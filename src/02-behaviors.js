const rotateBehavior = radsPerSec => (sprite, dt) => sprite[ROTATION] += (radsPerSec * dt);

const collisionCheck = (state, sprite, radius = 20) =>
  (Math.abs(sprite[Y] - 280) < radius) && (Math.abs(sprite[X] - state.playerX) < radius);

const pulseBehavior = (min, max) => {
  let tick = 0;
  return (sprite, dt) => {
    tick += (dt * 10);
    sprite[SCALE] = min + ((max - min) * (0.5 + (Math.cos(tick) / 2)));
  };
};

const fadeBehavior = () => {
  return (sprite, dt) => {
    sprite[OPACITY] = Math.max(0, sprite[OPACITY] - (dt / 2));
  };
};

const groundBehavior = (state, repeat = false, mod = 1) => (sprite, dt) => {
  sprite[Y] += state.speed * dt * mod;
  if (sprite[Y] > 450) {
    if (repeat) {
      sprite[Y] = -50;
    } else {
      removeSprite(state.root, sprite);
    }
  }
};

const boneBehavior = state => {
  let phase = 0;
  return (sprite, dt) => {
    if (phase === 0) {
      if (state.playerBones < 11 && collisionCheck(state, sprite)) {
        state.particles.addBurst(sprite[X], sprite[Y], '#2f0', 4, 6);
        state.playerBones++;
        phase++;
      }
    } else if (phase === 1) {
      sprite[SCALE] += (dt * 4);
      sprite[OPACITY] -= (dt * 2);

      if (sprite[OPACITY] < 0) {
        removeSprite(state.foreground, sprite);
      }
    };
  };
};

const ratBehavior = state => {
  let phase = 0;
  return (sprite, dt) => {
    if (phase === 0) {
      sprite[X] += 20 * dt * ((sprite[FLIP] === FLIP_X) ? -1 : 1);
      if (state.playerBones > 0 && collisionCheck(state, sprite)) {
        state.particles.addBurst(sprite[X], sprite[Y], '#f02', 4, 6);
        state.playerBones--;
        phase++;
      }
    } else if (phase === 1) {
      addSprite(sprite, createSprite(0, -5, 0.8, 0, POLY_BONE1));
      sprite[SCALE] = (2);
      phase++;
    } else if (phase === 2) {
      sprite[X] += dt * ((sprite[FLIP] === FLIP_X) ? -1 : 1) * 100;
      sprite[SCALE] -= dt;

      if (sprite[SCALE] < 0) {
        removeSprite(state.foreground, sprite);
      }
    };
  };
};
