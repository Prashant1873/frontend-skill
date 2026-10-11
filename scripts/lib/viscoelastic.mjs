/**
 * Viscoelastic Physics Engine & Mathematical Trajectory Solver
 *
 * Implements physical stretch-and-squish animation mechanics for multi-option
 * segmented controls, tab bars, and elastic rails. Simulates viscoelastic
 * elongation under tension, Poisson perpendicular volume preservation,
 * and Apple-standard critically damped arrivals.
 */

export const VISCOELASTIC_PRESETS = Object.freeze({
  appleStandard: Object.freeze({
    duration: 340,
    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
    peakProgress: 0.38,
    peakSquish: 0.82,
    reboundProgress: 0.78,
    reboundScale: 1.04
  }),
  snappy: Object.freeze({
    duration: 260,
    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
    peakProgress: 0.35,
    peakSquish: 0.85,
    reboundProgress: 0.76,
    reboundScale: 1.02
  }),
  elastic: Object.freeze({
    duration: 420,
    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
    peakProgress: 0.40,
    peakSquish: 0.78,
    reboundProgress: 0.80,
    reboundScale: 1.06
  })
});

/**
 * Normalizes a rectangular bounding box.
 * @param {Object} rect
 * @param {number} rect.left
 * @param {number} rect.width
 * @param {number} [rect.right]
 * @param {number} [rect.height]
 * @returns {{ left: number, right: number, width: number, height: number }}
 */
export function normalizeRect(rect = {}) {
  const left = Number(rect.left ?? 0);
  const width = Math.max(0, Number(rect.width ?? 0));
  const right = rect.right !== undefined ? Number(rect.right) : left + width;
  const height = Math.max(0, Number(rect.height ?? 0));

  return {
    left: Number(left.toFixed(2)),
    right: Number(right.toFixed(2)),
    width: Number(width.toFixed(2)),
    height: Number(height.toFixed(2))
  };
}

/**
 * Calculates mathematical stretch-and-squish trajectory and keyframes.
 * @param {Object} params
 * @param {Object} params.fromRect Departure bounding box relative to container
 * @param {Object} params.toRect Arrival bounding box relative to container
 * @param {Object} [params.options] Optional configuration overrides
 * @param {string|Object} [params.options.preset] Preset name ('appleStandard', 'snappy', 'elastic') or custom config
 * @param {number} [params.options.duration] Custom transition duration in ms
 * @param {string} [params.options.easing] Custom easing curve
 * @param {number} [params.options.peakSquish] Custom Poisson vertical compression ratio (e.g. 0.82)
 * @param {number} [params.options.reboundScale] Custom vertical rebound ratio (e.g. 1.04)
 * @param {boolean} [params.options.reducedMotion] Whether prefers-reduced-motion is active
 * @returns {Object} Calculated trajectory with WAAPI keyframes and physical milestones
 */
export function calculateViscoelasticTrajectory({ fromRect, toRect, options = {} }) {
  const departure = normalizeRect(fromRect);
  const arrival = normalizeRect(toRect);

  const preset = typeof options.preset === 'string'
    ? (VISCOELASTIC_PRESETS[options.preset] ?? VISCOELASTIC_PRESETS.appleStandard)
    : (options.preset ?? VISCOELASTIC_PRESETS.appleStandard);

  const duration = Math.max(0, options.duration ?? preset.duration);
  const easing = options.easing ?? preset.easing;
  const peakProgress = Math.min(0.6, Math.max(0.2, options.peakProgress ?? preset.peakProgress));
  const peakSquish = Math.max(0.5, Math.min(1.0, options.peakSquish ?? preset.peakSquish));
  const reboundProgress = Math.min(0.95, Math.max(0.65, options.reboundProgress ?? preset.reboundProgress));
  const reboundScale = Math.max(1.0, Math.min(1.2, options.reboundScale ?? preset.reboundScale));
  const reducedMotion = Boolean(options.reducedMotion);

  const dx = arrival.left - departure.left;
  let direction = 'stationary';
  if (dx > 0.5) {
    direction = 'forward';
  } else if (dx < -0.5) {
    direction = 'backward';
  }

  // Degenerate/identical or reduced motion path: bypass physical stretch
  if (reducedMotion || direction === 'stationary') {
    const staticKeyframes = [
      {
        offset: 0,
        left: `${arrival.left}px`,
        width: `${arrival.width}px`,
        transform: 'scaleY(1)'
      },
      {
        offset: 1,
        left: `${arrival.left}px`,
        width: `${arrival.width}px`,
        transform: 'scaleY(1)'
      }
    ];

    return {
      direction,
      duration: reducedMotion ? 0 : duration,
      easing,
      keyframes: staticKeyframes,
      departure,
      arrival,
      peakWidth: arrival.width,
      reducedMotion,
      restingStyles: {
        left: `${arrival.left}px`,
        width: `${arrival.width}px`,
        transform: 'scaleY(1)'
      }
    };
  }

  let keyframes = [];
  let peakWidth = 0;

  if (direction === 'forward') {
    // 0% Departure: indicator sits at departure bounds
    // 38% Peak Bridge: trailing edge anchored at L0, width bridges to R1, scaleY compresses
    // 78% Rebound: trailing edge catches up to L1, width contracts to W1, slight vertical rebound
    // 100% Settle: resting at arrival bounds with scaleY(1.0)
    peakWidth = Number((arrival.right - departure.left).toFixed(2));

    keyframes = [
      {
        offset: 0,
        left: `${departure.left}px`,
        width: `${departure.width}px`,
        transform: 'scaleY(1)'
      },
      {
        offset: peakProgress,
        left: `${departure.left}px`,
        width: `${peakWidth}px`,
        transform: `scaleY(${peakSquish})`
      },
      {
        offset: reboundProgress,
        left: `${arrival.left}px`,
        width: `${arrival.width}px`,
        transform: `scaleY(${reboundScale})`
      },
      {
        offset: 1,
        left: `${arrival.left}px`,
        width: `${arrival.width}px`,
        transform: 'scaleY(1)'
      }
    ];
  } else {
    // Backward travel (moving right to left, arrival.left < departure.left):
    // 0% Departure: sits at departure bounds
    // 38% Peak Bridge: leading edge immediately reaches target boundary L1, bridges to R0
    // 78% Rebound: settles to arrival bounds with slight vertical rebound
    // 100% Settle: resting at arrival bounds with scaleY(1.0)
    peakWidth = Number((departure.right - arrival.left).toFixed(2));

    keyframes = [
      {
        offset: 0,
        left: `${departure.left}px`,
        width: `${departure.width}px`,
        transform: 'scaleY(1)'
      },
      {
        offset: peakProgress,
        left: `${arrival.left}px`,
        width: `${peakWidth}px`,
        transform: `scaleY(${peakSquish})`
      },
      {
        offset: reboundProgress,
        left: `${arrival.left}px`,
        width: `${arrival.width}px`,
        transform: `scaleY(${reboundScale})`
      },
      {
        offset: 1,
        left: `${arrival.left}px`,
        width: `${arrival.width}px`,
        transform: 'scaleY(1)'
      }
    ];
  }

  return {
    direction,
    duration,
    easing,
    keyframes,
    departure,
    arrival,
    peakWidth,
    reducedMotion: false,
    restingStyles: {
      left: `${arrival.left}px`,
      width: `${arrival.width}px`,
      transform: 'scaleY(1)'
    }
  };
}

/**
 * Computes mid-flight re-targeting trajectory when an ongoing animation is interrupted.
 * Prevents visual snapping by interpolating from current mid-flight bounds.
 * @param {Object} params
 * @param {Object} params.currentBounds Current actual or estimated indicator coordinates
 * @param {number} params.currentBounds.left
 * @param {number} params.currentBounds.width
 * @param {number} [params.currentBounds.scaleY=1.0]
 * @param {Object} params.targetRect New target button bounding box
 * @param {Object} [params.options]
 * @returns {Object} Seamless handoff trajectory
 */
export function computeMidflightRetarget({ currentBounds, targetRect, options = {} }) {
  const current = {
    left: Number(currentBounds.left ?? 0),
    width: Math.max(0, Number(currentBounds.width ?? 0)),
    right: Number((Number(currentBounds.left ?? 0) + Number(currentBounds.width ?? 0)).toFixed(2)),
    scaleY: Math.max(0.5, Math.min(1.2, Number(currentBounds.scaleY ?? 1.0)))
  };

  const target = normalizeRect(targetRect);

  // If already close to target, perform quick critically damped settle
  const dx = target.left - current.left;
  if (Math.abs(dx) < 1 && Math.abs(target.width - current.width) < 1) {
    return {
      direction: 'stationary',
      duration: 100,
      easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
      keyframes: [
        {
          offset: 0,
          left: `${current.left}px`,
          width: `${current.width}px`,
          transform: `scaleY(${current.scaleY})`
        },
        {
          offset: 1,
          left: `${target.left}px`,
          width: `${target.width}px`,
          transform: 'scaleY(1)'
        }
      ],
      restingStyles: {
        left: `${target.left}px`,
        width: `${target.width}px`,
        transform: 'scaleY(1)'
      }
    };
  }

  // Construct trajectory with current bounds as departure
  const trajectory = calculateViscoelasticTrajectory({
    fromRect: current,
    toRect: target,
    options
  });

  // Blend starting scaleY from current mid-flight scale
  if (trajectory.keyframes && trajectory.keyframes.length > 0) {
    trajectory.keyframes[0].transform = `scaleY(${current.scaleY})`;
  }

  return trajectory;
}

/**
 * Emits complete Web Animations API (WAAPI) payload ready for `element.animate(keyframes, options)`.
 * @param {Object} params
 * @param {Object} params.fromRect
 * @param {Object} params.toRect
 * @param {Object} [params.options]
 * @returns {{ keyframes: Array<Object>, options: Object, restingStyles: Object }}
 */
export function generateWaapiPayload({ fromRect, toRect, options = {} }) {
  const trajectory = calculateViscoelasticTrajectory({ fromRect, toRect, options });

  return {
    keyframes: trajectory.keyframes,
    options: {
      duration: trajectory.duration,
      easing: trajectory.easing,
      fill: 'both'
    },
    restingStyles: trajectory.restingStyles,
    direction: trajectory.direction,
    peakWidth: trajectory.peakWidth
  };
}
