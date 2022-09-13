const createBackground = state => {
  const backgroundCount = 10;
  const dustCount = 20;

  for (let i = 0; i < backgroundCount; i++) {
    const bgSprite = createSprite(i * 20);
    bgSprite[SCALE] = 1.2 + (rndOne() * 0.5);
    bgSprite[X] = rndRange(100, 100);
    bgSprite[Y] = ((i / backgroundCount) * 500) - 50;
    bgSprite[OPACITY] = 0.5;

    let rnd = Math.random();
    if (rnd < 0.5) {
      bgSprite[DATA] = POLY_CRACK1;
    } else  {
      bgSprite[DATA] = POLY_CRACK2;
    }

    prerenderSprite(bgSprite);

    addBehavior(bgSprite, groundBehavior(state, true));
    addSprite(state.background, bgSprite);
  }

  for (let i = 0; i < dustCount; i++) {
    const wineSprite = createSprite(0, 0, rndRange(4, 2), rndOne() * 4, POLY_WINE1);
    wineSprite[X] = (rndOne() > 0) ? 220 : -20;
    wineSprite[Y] = ((i / backgroundCount) * 500) - 50;

    addBehavior(wineSprite, groundBehavior(state, true, rndRange(1.1, 0.1)));
    addSprite(state.fx, wineSprite);
    prerenderSprite(wineSprite);
  }
};