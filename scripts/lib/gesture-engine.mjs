/**
 * 1:1 Pointer Tracking & Velocity Capture Engine
 *
 * Provides normalized pointer event capture, rolling-window velocity estimation,
 * and Apple-grade drag gesture mechanics.
 */

/**
 * Creates a normalized 1:1 pointer gesture tracker on a DOM element.
 * @param {HTMLElement|Object} element Target DOM element
 * @param {Object} callbacks
 * @param {Function} [callbacks.onStart] ({ x, y, pointerId })
 * @param {Function} [callbacks.onMove] ({ x, y, dx, dy, vx, vy })
 * @param {Function} [callbacks.onEnd] ({ x, y, dx, dy, vx, vy, interrupted })
 * @param {Object} [options]
 * @param {number} [options.velocityWindowMs=100] Rolling window for velocity estimation
 * @param {boolean} [options.capturePointer=true] Whether to lock pointer capture
 * @returns {{ destroy: Function, isTracking: Function }}
 */
export function createPointerTracker(element, callbacks = {}, options = {}) {
  const velocityWindowMs = options.velocityWindowMs ?? 100;
  const capturePointer = options.capturePointer !== false;

  let activePointerId = null;
  let startX = 0;
  let startY = 0;
  let currentX = 0;
  let currentY = 0;
  let history = []; // Array of { x, y, time }

  function recordSample(x, y) {
    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    history.push({ x, y, time: now });

    // Prune points older than rolling window
    const cutoff = now - velocityWindowMs;
    while (history.length > 2 && history[0].time < cutoff) {
      history.shift();
    }
  }

  function computeVelocity() {
    if (history.length < 2) {
      return { vx: 0, vy: 0 };
    }

    const first = history[0];
    const last = history[history.length - 1];
    const dt = (last.time - first.time) / 1000; // in seconds

    if (dt <= 0.001) {
      return { vx: 0, vy: 0 };
    }

    return {
      vx: (last.x - first.x) / dt, // px per second
      vy: (last.y - first.y) / dt
    };
  }

  function handlePointerDown(e) {
    if (activePointerId !== null) return;
    if (e.button !== undefined && e.button !== 0) return; // Primary button only

    activePointerId = e.pointerId;
    startX = e.clientX;
    startY = e.clientY;
    currentX = e.clientX;
    currentY = e.clientY;
    history = [];
    recordSample(startX, startY);

    if (capturePointer && element && typeof element.setPointerCapture === 'function') {
      try {
        element.setPointerCapture(activePointerId);
      } catch (_) {}
    }

    if (typeof callbacks.onStart === 'function') {
      callbacks.onStart({
        x: startX,
        y: startY,
        pointerId: activePointerId
      });
    }
  }

  function handlePointerMove(e) {
    if (activePointerId === null || e.pointerId !== activePointerId) return;

    currentX = e.clientX;
    currentY = e.clientY;
    recordSample(currentX, currentY);

    const dx = currentX - startX;
    const dy = currentY - startY;
    const { vx, vy } = computeVelocity();

    if (typeof callbacks.onMove === 'function') {
      callbacks.onMove({
        x: currentX,
        y: currentY,
        dx,
        dy,
        vx,
        vy
      });
    }
  }

  function handlePointerUp(e, interrupted = false) {
    if (activePointerId === null || (e && e.pointerId !== activePointerId)) return;

    const pId = activePointerId;
    activePointerId = null;

    if (capturePointer && element && typeof element.releasePointerCapture === 'function') {
      try {
        element.releasePointerCapture(pId);
      } catch (_) {}
    }

    const dx = currentX - startX;
    const dy = currentY - startY;
    const { vx, vy } = computeVelocity();

    if (typeof callbacks.onEnd === 'function') {
      callbacks.onEnd({
        x: currentX,
        y: currentY,
        dx,
        dy,
        vx,
        vy,
        interrupted
      });
    }
  }

  function handlePointerCancel(e) {
    handlePointerUp(e, true);
  }

  if (element && typeof element.addEventListener === 'function') {
    element.addEventListener('pointerdown', handlePointerDown);
    element.addEventListener('pointermove', handlePointerMove);
    element.addEventListener('pointerup', handlePointerUp);
    element.addEventListener('pointercancel', handlePointerCancel);
  }

  return {
    destroy() {
      if (element && typeof element.removeEventListener === 'function') {
        element.removeEventListener('pointerdown', handlePointerDown);
        element.removeEventListener('pointermove', handlePointerMove);
        element.removeEventListener('pointerup', handlePointerUp);
        element.removeEventListener('pointercancel', handlePointerCancel);
      }
      activePointerId = null;
      history = [];
    },
    isTracking() {
      return activePointerId !== null;
    },
    computeVelocity
  };
}
