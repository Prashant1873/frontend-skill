/**
 * Analytical Spring Physics Solver & Apple Fluid Motion Engine
 *
 * Implements closed-form harmonic oscillator equations, velocity projection,
 * and Apple rubber-banding logarithmic resistance curves.
 */

export const SPRING_PRESETS = Object.freeze({
  default: { response: 0.35, dampingRatio: 1.0 },
  snappy: { response: 0.25, dampingRatio: 0.85 },
  bouncy: { response: 0.45, dampingRatio: 0.72 },
  sheet: { response: 0.40, dampingRatio: 0.95 },
  toggle: { response: 0.22, dampingRatio: 0.90 }
});

/**
 * Creates an analytical spring solver based on physical parameters or Apple parameters.
 * @param {Object} config
 * @param {number} [config.response=0.35] Duration in seconds for a full oscillation cycle
 * @param {number} [config.dampingRatio=1.0] Damping ratio (1.0 = critical, <1 = underdamped, >1 = overdamped)
 * @param {number} [config.mass=1.0] Mass
 * @returns {Object} Spring solver instance
 */
export function createAppleSpring(config = {}) {
  const response = Math.max(0.01, config.response ?? 0.35);
  const dampingRatio = Math.max(0, config.dampingRatio ?? 1.0);
  const mass = Math.max(0.001, config.mass ?? 1.0);

  const omega0 = (2 * Math.PI) / response;
  const k = omega0 * omega0 * mass;
  const c = 2 * dampingRatio * Math.sqrt(k * mass);

  return createSpringFromParams({
    omega0,
    dampingRatio,
    mass,
    stiffness: k,
    damping: c,
    response
  });
}

/**
 * Creates a spring solver from stiffness, damping, and mass.
 * @param {Object} config
 * @param {number} [config.stiffness=100]
 * @param {number} [config.damping=20]
 * @param {number} [config.mass=1]
 * @returns {Object}
 */
export function createSpring(config = {}) {
  const mass = Math.max(0.001, config.mass ?? 1.0);
  const stiffness = Math.max(0.001, config.stiffness ?? 100);
  const damping = Math.max(0, config.damping ?? 20);

  const omega0 = Math.sqrt(stiffness / mass);
  const dampingRatio = damping / (2 * Math.sqrt(stiffness * mass));
  const response = (2 * Math.PI) / omega0;

  return createSpringFromParams({
    omega0,
    dampingRatio,
    mass,
    stiffness,
    damping,
    response
  });
}

function createSpringFromParams(params) {
  const { omega0, dampingRatio, stiffness, damping, mass, response } = params;

  return {
    params: { omega0, dampingRatio, stiffness, damping, mass, response },

    /**
     * Solves position and velocity at time t (seconds) given initial conditions.
     * @param {number} start Initial position
     * @param {number} target Target resting position
     * @param {number} initialVelocity Initial velocity (units per second)
     * @param {number} t Elapsed time in seconds
     * @returns {{ position: number, velocity: number }}
     */
    at(start, target, initialVelocity = 0, t = 0) {
      if (t <= 0) {
        return { position: start, velocity: initialVelocity };
      }

      const x0 = start - target;
      const v0 = initialVelocity;

      let x = 0;
      let v = 0;

      if (Math.abs(dampingRatio - 1.0) < 1e-5) {
        // Critically damped (zeta == 1.0)
        const c1 = x0;
        const c2 = v0 + omega0 * x0;
        const envelope = Math.exp(-omega0 * t);
        x = envelope * (c1 + c2 * t);
        v = envelope * (c2 - omega0 * (c1 + c2 * t));
      } else if (dampingRatio < 1.0) {
        // Underdamped (zeta < 1.0)
        const omegaD = omega0 * Math.sqrt(1 - dampingRatio * dampingRatio);
        const c1 = x0;
        const c2 = (v0 + dampingRatio * omega0 * x0) / omegaD;
        const envelope = Math.exp(-dampingRatio * omega0 * t);
        const cosTerm = Math.cos(omegaD * t);
        const sinTerm = Math.sin(omegaD * t);

        x = envelope * (c1 * cosTerm + c2 * sinTerm);
        v = envelope * (
          -dampingRatio * omega0 * (c1 * cosTerm + c2 * sinTerm) +
          (-c1 * omegaD * sinTerm + c2 * omegaD * cosTerm)
        );
      } else {
        // Overdamped (zeta > 1.0)
        const omegaStar = omega0 * Math.sqrt(dampingRatio * dampingRatio - 1);
        const r1 = -dampingRatio * omega0 + omegaStar;
        const r2 = -dampingRatio * omega0 - omegaStar;
        const c2 = (v0 - r1 * x0) / (r2 - r1);
        const c1 = x0 - c2;

        const exp1 = Math.exp(r1 * t);
        const exp2 = Math.exp(r2 * t);

        x = c1 * exp1 + c2 * exp2;
        v = c1 * r1 * exp1 + c2 * r2 * exp2;
      }

      return {
        position: target + x,
        velocity: v
      };
    },

    /**
     * Calculates the estimated duration until spring reaches rest threshold.
     * @param {number} start
     * @param {number} target
     * @param {number} [initialVelocity=0]
     * @param {number} [epsilon=0.01]
     * @returns {number} Settle time in seconds
     */
    settleDuration(start, target, initialVelocity = 0, epsilon = 0.01) {
      const distance = Math.abs(start - target);
      if (distance < epsilon && Math.abs(initialVelocity) < epsilon) {
        return 0;
      }

      const dt = 0.016;
      let t = 0;
      const maxT = 3.0; // Guard against infinite loop

      while (t < maxT) {
        t += dt;
        const sample = this.at(start, target, initialVelocity, t);
        if (
          Math.abs(sample.position - target) < epsilon &&
          Math.abs(sample.velocity) < epsilon
        ) {
          return Number(t.toFixed(3));
        }
      }

      return maxT;
    }
  };
}

/**
 * Variable timestep Euler-Cromer / Verlet hybrid stepper for dynamic interactions.
 * @param {number} currentPos
 * @param {number} currentVel
 * @param {number} target
 * @param {number} dt Time delta in seconds
 * @param {Object} [config]
 * @returns {{ position: number, velocity: number, settled: boolean }}
 */
export function solveSpringStep(currentPos, currentVel, target, dt, config = {}) {
  const stiffness = config.stiffness ?? 170;
  const damping = config.damping ?? 26;
  const mass = config.mass ?? 1;
  const epsilon = config.epsilon ?? 0.01;

  const displacement = currentPos - target;
  const springForce = -stiffness * displacement;
  const dampingForce = -damping * currentVel;
  const acceleration = (springForce + dampingForce) / mass;

  const nextVel = currentVel + acceleration * dt;
  const nextPos = currentPos + nextVel * dt;

  const settled = Math.abs(nextPos - target) < epsilon && Math.abs(nextVel) < epsilon;

  return {
    position: settled ? target : nextPos,
    velocity: settled ? 0 : nextVel,
    settled
  };
}

/**
 * Apple logarithmic rubber-banding resistance calculation.
 * Formula: f(x, d, c) = (1 - 1 / ( (x * c / d) + 1 )) * d
 *
 * @param {number} delta Current displacement past boundary (signed or unsigned)
 * @param {number} dimension Boundary threshold dimension (e.g. screen height or width)
 * @param {number} [coefficient=0.55] Elasticity constant
 * @returns {number} Resisted displacement
 */
export function rubberBand(delta, dimension, coefficient = 0.55) {
  if (delta === 0 || dimension <= 0) return 0;

  const sign = Math.sign(delta);
  const absDelta = Math.abs(delta);

  const resisted = (1.0 - (1.0 / ((absDelta * coefficient / dimension) + 1.0))) * dimension;
  return sign * resisted;
}
