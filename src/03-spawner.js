const spawnBone = (state, x) => {
  const poly = rndOne() > 0 ? POLY_BONE1 : rndOne() > 0 ? POLY_BONE2 : POLY_BONE3;
  const sprite = createSprite(x, -50, 0.8, rndRange(0, Math.PI), poly);
  addBehavior(sprite, groundBehavior(state));
  addBehavior(sprite, pulseBehavior(0.8, 1.2));
  addBehavior(sprite, boneBehavior(state));
  addSprite(state.foreground, sprite);
};

const spawnRat = (state, x) => {
  const sprite = createSprite(x, -50, 1.4, 0, POLY_RAT);
  sprite[FLIP] = rndOne() > 0 ? FLIP_X : 0;
  addBehavior(sprite, groundBehavior(state));
  addBehavior(sprite, ratBehavior(state));
  addSprite(state.foreground, sprite);
};

const createSpawner = state => {
  let tick = 0;

  spawnBone(state, rndRange(100, 90));
  spawnBone(state, rndRange(100, 90));

  runLoop(state, (state, dt) => {
    tick += (dt * state.speed);

    if (tick > 80) {
      tick = 0;
      let rnd = (rndRange(5, 5));
      if (rnd < (11 - state.playerBones)) {
        spawnBone(state, rndRange(100, 90));
      } else if (rnd < 7) {
        spawnRat(state, rndRange(100, 90));
      }
    }

    return true;
  });
};