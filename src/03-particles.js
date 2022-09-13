const particleManager = state => {
  const particleCache = [];

  const particleDropBehavior = (sprite, dt) => {
    if (sprite[OPACITY] <= 0) return;

    sprite[Y] += (dt * state.speed);
    sprite[OPACITY] -= (dt * 1.4);

    if (sprite[OPACITY] <= 0) {
      particleCache.push(sprite);
    }
  };

  const particleBurstBehavior = (sprite, dt) => {
    if (sprite[OPACITY] <= 0) return;
    sprite[X] += sprite._pl[0] * 120 * dt;
    sprite[Y] += sprite._pl[1] * 120 * dt;
    sprite[SCALE] *= (1 - (dt * 4));
    sprite[OPACITY] -= (dt * 1.4);
    sprite[ROTATION] -= sprite._pl[0] * 12 * dt;

    if (sprite[OPACITY] <= 0) {
      particleCache.push(sprite);
    }
  };

  const addParticle = (x, y, color, scale, behavior = particleDropBehavior) => {
    let particleSprite;
    if (particleCache.length) {
      particleSprite = particleCache.pop();
    } else {
      particleSprite = createSprite();
      particleSprite[DATA] = [...POLY_TRI];
      addSprite(state.fx, particleSprite);
    }

    particleSprite[X] = x;
    particleSprite[Y] = y;
    particleSprite[DATA][0] = color;
    particleSprite[SCALE] = scale;
    particleSprite[OPACITY] = 1;
    particleSprite[BEHAVIOR] = [behavior];

    particleSprite._pl = [rndOne(), rndOne()];
  };

  const addBurst = (x, y, color, radius, qty = 10) => {
    for (let i = 0; i < qty; i++) {
      addParticle(x, y, color, radius + (rndOne() * 0.5 * radius), particleBurstBehavior);
    }
  };

  return { addBurst, addParticle };
};