const debone = (poly, bones) => {
  const res = [];
  let bi = 0;
  for (let i = 0; i < poly.length; i++) {
    if (typeof poly[i] === 'string') {
      if (bi === bones) return res;
      bi += 0.5;
    }

    res.push(poly[i]);
  }

  return res;
};

const createPlayer = (state) => {
  const playerSprite = createSprite(100, 280, 2.4, 0, POLY_SKELEM);

  let previousBones = 0;
  let mirror = false;
  let altTick = 99;
  let sideVelocity = 0;
  let tick = 0;
  addBehavior(playerSprite, (sprite, dt) => {
    tick += dt;
    altTick += ((state.speed + Math.abs(sideVelocity / 2)) * dt);

    if (state.playerBones !== previousBones) {
      sprite[DATA] = debone(POLY_SKELEM, state.playerBones);
      previousBones = state.playerBones;
    }

    if (altTick > 40) {
      mirror = !mirror;

      state.particles.addBurst(playerSprite[X], playerSprite[Y] - 20, '#333', 4, 6);

      const rot = rndOne() * 4;

      const hole1 = createSprite(
        playerSprite[X] - 5,
        playerSprite[Y] - 10,
        3 + (state.playerBones / 5),
        rot,
        [...POLY_HOLE]
      );
      hole1[DATA][0] = '#222';
      addBehavior(hole1, groundBehavior(state));
      addSprite(state.background, hole1);

      const hole = createSprite(
        playerSprite[X],
        playerSprite[Y] - 5,
        2 + (state.playerBones / 5),
        rot,
        POLY_HOLE
      );
      addBehavior(hole, groundBehavior(state));
      addSprite(state.background2, hole);

      playerSprite[FLIP] = mirror ? FLIP_X : 0;

      altTick = 0;
    }

    if (state.keys['j'] || state.keys['ArrowLeft'] || state.touch === 'left') {
      sideVelocity = Math.max(sideVelocity - (dt * 3000), -120);
    } else if (state.keys['k'] || state.keys['ArrowRight'] || state.touch === 'right') {
      sideVelocity = Math.min(sideVelocity + (dt * 3000), 120);
    } else {
      sideVelocity = sideVelocity - (sideVelocity * Math.min(1, dt * 3));
    }

    if (sprite[X] > 190) sideVelocity = Math.min(sideVelocity, 0);
    if (sprite[X] < 10) sideVelocity = Math.max(sideVelocity, 0);

    sprite[X] += (sideVelocity * dt);
    sprite[ROTATION] = sideVelocity / 300;

    const speedDiff = (40 + (state.playerBones * state.playerBones * 2)) - state.speed;
    if (Math.abs(speedDiff) > 0.1) {
      state.speed += (speedDiff * dt);
    }

    state.playerX = sprite[X];
  });

  addSprite(state.foreground, playerSprite);
};