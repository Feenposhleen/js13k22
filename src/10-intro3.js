const introScene3 = (canvas) => new Promise(next => {
  const context = canvas.getContext('2d');
  const root = createSprite();

  const debris = Array.from({ length: 10}, (_, i) => {
    const thing = createSprite(rndRange(100, 100), -100 + (i * 40), 2, 0, POLY_CRACK1);
    thing[OPACITY] = 0.4;
    addSprite(root, thing);
    addBehavior(thing, (_, dt) => {
      thing[Y] -= dt * 1000;
      if (thing[Y] < -100) thing[Y] = 500;
    });
    return thing;
  });

  const hole = createSprite(100, 550, 10, -0.8, [...POLY_HOLE]);
  hole[DATA][0] = '#222';
  const holeInner = createSprite(1, 1, 0.8, 0, POLY_HOLE);
  const skull = createSprite(-3, 2, 0.7, 0.2, POLY_SKULL1);
  addSprite(hole, holeInner);
  addSprite(hole, skull);
  addSprite(root, hole);

  runCutscene(context, root, '#642', next, [
    [0, '#f0f'],
    [3, null, null, (dt, fraction) => {
      debris.forEach(x => x[OPACITY] = 1 - fraction);
    }],
    [1, null, null, (dt, fraction) => {
      hole[Y] = 550 - (fraction * 300);
    }],
    [1],
    [3, null, ['Ughhh...', 'I\'ll try, Master!']],
    [2, '#000'],
  ]);
});
