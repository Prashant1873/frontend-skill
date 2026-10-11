/**
 * Fluid Elastic Segmented Control & Tab Component Engine
 *
 * Implements a framework-agnostic 3-tier DOM controller executing physical
 * stretch-and-squish animations directly on the browser compositor thread via WAAPI.
 * Features interruptible mid-flight retargeting, zero-jitter ResizeObserver lifecycle,
 * and accessible tablist/radiogroup keyboard traversal.
 */

import {
  calculateViscoelasticTrajectory,
  computeMidflightRetarget,
  normalizeRect,
  VISCOELASTIC_PRESETS
} from './viscoelastic.mjs';

/**
 * Calculates bounding rect of child element relative to container rail.
 * @param {HTMLElement|Object} childEl
 * @param {HTMLElement|Object} containerEl
 * @returns {{ left: number, right: number, width: number, height: number }}
 */
export function getRelativeRect(childEl, containerEl) {
  if (
    childEl &&
    containerEl &&
    typeof childEl.getBoundingClientRect === 'function' &&
    typeof containerEl.getBoundingClientRect === 'function'
  ) {
    const childRect = childEl.getBoundingClientRect();
    const containerRect = containerEl.getBoundingClientRect();
    return normalizeRect({
      left: childRect.left - containerRect.left,
      width: childRect.width,
      right: childRect.right - containerRect.left,
      height: childRect.height
    });
  }

  const left = Number(childEl?.offsetLeft ?? 0);
  const width = Number(childEl?.offsetWidth ?? childEl?.clientWidth ?? 100);
  const height = Number(childEl?.offsetHeight ?? childEl?.clientHeight ?? 40);

  return normalizeRect({
    left,
    width,
    right: left + width,
    height
  });
}

/**
 * Creates and mounts an interactive elastic segmented control.
 * @param {HTMLElement|Object} container Container element
 * @param {Object} [options]
 * @param {'tabs'|'radiogroup'} [options.mode='tabs'] ARIA semantic role mode
 * @param {string|Object} [options.preset='appleStandard'] Timing preset
 * @param {boolean} [options.reducedMotion] Whether to bypass physical stretch
 * @param {string|number} [options.defaultValue] Initial active value or index
 * @param {Function} [options.onChange] Selection change callback: (value, index, event) => void
 * @param {boolean} [options.wrapKeyboard=true] Whether Arrow keys wrap around edges
 * @returns {Object} Component controller API
 */
export function createSegmentedControl(container, options = {}) {
  if (!container) {
    throw new Error('createSegmentedControl requires a valid container element.');
  }

  const mode = options.mode === 'radiogroup' ? 'radiogroup' : 'tabs';
  const wrapKeyboard = options.wrapKeyboard !== false;
  const isReducedMotion = () => {
    if (options.reducedMotion !== undefined) {
      return Boolean(options.reducedMotion);
    }
    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  };

  // 1. Ensure Container Rail class and role
  if (container.classList && typeof container.classList.add === 'function') {
    container.classList.add('elastic-segmented-rail');
  }
  if (typeof container.setAttribute === 'function') {
    container.setAttribute('role', mode === 'radiogroup' ? 'radiogroup' : 'tablist');
  }

  // 2. Ensure Floating Indicator Layer
  let indicator = null;
  if (typeof container.querySelector === 'function') {
    indicator = container.querySelector('.elastic-segmented-indicator');
  }

  if (!indicator) {
    const doc = container.ownerDocument || (typeof document !== 'undefined' ? document : null);
    if (typeof doc?.createElement === 'function') {
      indicator = doc.createElement('div');
    } else if (typeof container.createElement === 'function') {
      indicator = container.createElement('div');
    }
  }

  if (indicator) {
    indicator.className = 'elastic-segmented-indicator';
    if (typeof indicator.setAttribute === 'function') {
      indicator.setAttribute('aria-hidden', 'true');
    }
    if (typeof container.prepend === 'function') {
      container.prepend(indicator);
    } else if (typeof container.insertBefore === 'function') {
      container.insertBefore(indicator, container.firstChild);
    }
  }

  // 3. Query option buttons
  let optionsList = [];
  if (typeof container.querySelectorAll === 'function') {
    optionsList = Array.from(
      container.querySelectorAll('.elastic-segmented-option, [data-value], button')
    ).filter(el => el !== indicator);
  }

  let currentIndex = 0;
  let activeAnimation = null;
  let currentRect = null;
  let isDestroyed = false;

  // Determine initial index
  if (options.defaultValue !== undefined) {
    const idx = optionsList.findIndex(
      (opt, i) => (opt.getAttribute?.('data-value') ?? opt.value ?? String(i)) === String(options.defaultValue)
    );
    if (idx !== -1) currentIndex = idx;
    else if (typeof options.defaultValue === 'number') currentIndex = options.defaultValue;
  }

  function getOptionValue(opt, index) {
    return opt.getAttribute?.('data-value') ?? opt.value ?? opt.dataset?.value ?? String(index);
  }

  // Update ARIA attributes on options
  function syncAria(selectedIndex) {
    optionsList.forEach((opt, idx) => {
      const isSelected = idx === selectedIndex;
      if (typeof opt.setAttribute === 'function') {
        if (mode === 'radiogroup') {
          opt.setAttribute('role', 'radio');
          opt.setAttribute('aria-checked', isSelected ? 'true' : 'false');
        } else {
          opt.setAttribute('role', 'tab');
          opt.setAttribute('aria-selected', isSelected ? 'true' : 'false');
        }
        opt.setAttribute('tabindex', isSelected ? '0' : '-1');
      }
      if (opt.classList && typeof opt.classList.toggle === 'function') {
        opt.classList.toggle('is-active', isSelected);
      }
    });
  }

  // Directly sets resting coordinates on indicator without animation
  function setRestingCoords(rect) {
    if (!indicator || !rect) return;
    currentRect = normalizeRect(rect);
    indicator.style = indicator.style || {};
    indicator.style.left = `${currentRect.left}px`;
    indicator.style.width = `${currentRect.width}px`;
    indicator.style.transform = 'scaleY(1)';
  }

  // Selection transition
  function select(index, { userInitiated = false, event = null } = {}) {
    if (isDestroyed || index < 0 || index >= optionsList.length) return;
    const targetOpt = optionsList[index];
    if (targetOpt?.disabled || targetOpt?.getAttribute?.('aria-disabled') === 'true') return;

    const fromRect = currentRect ?? getRelativeRect(optionsList[currentIndex], container);
    const toRect = getRelativeRect(targetOpt, container);

    currentIndex = index;
    syncAria(currentIndex);

    const reduced = isReducedMotion();

    if (activeAnimation && typeof activeAnimation.cancel === 'function') {
      // Interruption: cancel active animation and construct smooth handoff
      try {
        let currentLeft = fromRect.left;
        let currentWidth = fromRect.width;
        let currentScaleY = 1.0;

        if (typeof window !== 'undefined' && typeof window.getComputedStyle === 'function') {
          const comp = window.getComputedStyle(indicator);
          currentLeft = parseFloat(comp.left) || currentLeft;
          currentWidth = parseFloat(comp.width) || currentWidth;
        }

        activeAnimation.cancel();

        const retarget = computeMidflightRetarget({
          currentBounds: { left: currentLeft, width: currentWidth, scaleY: currentScaleY },
          targetRect: toRect,
          options: { ...options, reducedMotion: reduced }
        });

        if (indicator && typeof indicator.animate === 'function' && !reduced) {
          activeAnimation = indicator.animate(retarget.keyframes, {
            duration: retarget.duration,
            easing: retarget.easing,
            fill: 'both'
          });
          activeAnimation.onfinish = () => {
            setRestingCoords(toRect);
            activeAnimation = null;
          };
        } else {
          setRestingCoords(toRect);
        }
      } catch (_) {
        setRestingCoords(toRect);
      }
    } else {
      // Clean non-interrupted transit
      const traj = calculateViscoelasticTrajectory({
        fromRect,
        toRect,
        options: { ...options, reducedMotion: reduced }
      });

      if (indicator && typeof indicator.animate === 'function' && !reduced && traj.direction !== 'stationary') {
        activeAnimation = indicator.animate(traj.keyframes, {
          duration: traj.duration,
          easing: traj.easing,
          fill: 'both'
        });
        activeAnimation.onfinish = () => {
          setRestingCoords(toRect);
          activeAnimation = null;
        };
      } else {
        setRestingCoords(toRect);
      }
    }

    currentRect = toRect;

    if (typeof options.onChange === 'function') {
      options.onChange(getOptionValue(targetOpt, currentIndex), currentIndex, event);
    }
  }

  // 4. Initial layout sync
  if (optionsList.length > 0) {
    const initRect = getRelativeRect(optionsList[currentIndex], container);
    setRestingCoords(initRect);
    syncAria(currentIndex);
  }

  // 5. Event Listeners (Click & Pointer)
  const clickHandlers = [];
  optionsList.forEach((opt, idx) => {
    const handler = (e) => {
      select(idx, { userInitiated: true, event: e });
    };
    clickHandlers.push({ element: opt, handler });
    if (typeof opt.addEventListener === 'function') {
      opt.addEventListener('click', handler);
    }
  });

  // 6. Keyboard Traversal
  function handleKeyDown(e) {
    if (!e || isDestroyed) return;
    const key = e.key;

    let targetIdx = null;

    if (key === 'ArrowRight' || key === 'ArrowDown') {
      e.preventDefault?.();
      targetIdx = wrapKeyboard
        ? (currentIndex + 1) % optionsList.length
        : Math.min(currentIndex + 1, optionsList.length - 1);
    } else if (key === 'ArrowLeft' || key === 'ArrowUp') {
      e.preventDefault?.();
      targetIdx = wrapKeyboard
        ? (currentIndex - 1 + optionsList.length) % optionsList.length
        : Math.max(currentIndex - 1, 0);
    } else if (key === 'Home') {
      e.preventDefault?.();
      targetIdx = 0;
    } else if (key === 'End') {
      e.preventDefault?.();
      targetIdx = optionsList.length - 1;
    }

    if (targetIdx !== null && targetIdx !== currentIndex) {
      select(targetIdx, { userInitiated: true, event: e });
      optionsList[targetIdx]?.focus?.();
    }
  }

  if (typeof container.addEventListener === 'function') {
    container.addEventListener('keydown', handleKeyDown);
  }

  // 7. ResizeObserver lifecycle handling
  let resizeObserver = null;
  if (typeof ResizeObserver !== 'undefined' && container && typeof container.getBoundingClientRect === 'function') {
    try {
      resizeObserver = new ResizeObserver(() => {
        if (!isDestroyed && optionsList[currentIndex]) {
          const freshRect = getRelativeRect(optionsList[currentIndex], container);
          setRestingCoords(freshRect);
        }
      });
      resizeObserver.observe(container);
    } catch (_) {}
  }

  return {
    destroy() {
      isDestroyed = true;
      if (activeAnimation && typeof activeAnimation.cancel === 'function') {
        activeAnimation.cancel();
      }
      clickHandlers.forEach(({ element, handler }) => {
        if (typeof element.removeEventListener === 'function') {
          element.removeEventListener('click', handler);
        }
      });
      if (typeof container.removeEventListener === 'function') {
        container.removeEventListener('keydown', handleKeyDown);
      }
      if (resizeObserver && typeof resizeObserver.disconnect === 'function') {
        resizeObserver.disconnect();
      }
    },
    getValue() {
      return optionsList[currentIndex] ? getOptionValue(optionsList[currentIndex], currentIndex) : null;
    },
    setValue(value) {
      const idx = optionsList.findIndex(
        (opt, i) => getOptionValue(opt, i) === String(value)
      );
      if (idx !== -1) {
        select(idx, { userInitiated: false });
      }
    },
    select(index) {
      select(index, { userInitiated: false });
    },
    getIndex() {
      return currentIndex;
    },
    getIndicator() {
      return indicator;
    },
    refresh() {
      if (optionsList[currentIndex]) {
        const freshRect = getRelativeRect(optionsList[currentIndex], container);
        setRestingCoords(freshRect);
      }
    }
  };
}
