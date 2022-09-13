const introScene1 = (canvas) => new Promise(next => {
  const context = canvas.getContext('2d');
  const root = createSprite();

  const background = createSprite(100, 200, 18, 0, POLY_BG1);
  prerenderSprite(background);
  addSprite(root, background);

  const necro = createSprite(100, 140, 7, 0, POLY_NECRO3);
  addSprite(root, necro);

  const tombs = createSprite();
  addSprite(tombs, createSprite(-60, 1, 4, -0.08, POLY_TOMB2));
  addSprite(tombs, createSprite(-20, 2, 3.6, 0.04, POLY_TOMB1));
  addSprite(tombs, createSprite(20, 0, 4.2, -0.02, POLY_TOMB2));
  addSprite(tombs, createSprite(60, 4, 2, 0.08, POLY_TOMB1));
  addSprite(tombs, createSprite(100, 0, 4.3, -0.08, POLY_TOMB2));
  addSprite(tombs, createSprite(140, 4, 3.4, -0.08, POLY_TOMB2));
  addSprite(tombs, createSprite(180, 0, 4.1, -0.08, POLY_TOMB2));
  addSprite(tombs, createSprite(220, 3, 3.2, -0.08, POLY_TOMB2));
  addSprite(tombs, createSprite(260, 2, 2.8, -0.08, POLY_TOMB2));

  const tombRow1 = createSprite(-20, 200, 1.8);
  addSprite(tombRow1, tombs);

  const tombRow2 = createSprite(40, 240, 1.9);
  addSprite(tombRow2, tombs);

  const tombRow3 = createSprite(0, 280, 2);
  addSprite(tombRow3, tombs);

  addSprite(root, tombRow1);
  addSprite(root, tombRow2);
  addSprite(root, tombRow3);

  runCutscene(context, root, '#214', next, [
    [1, '#000'],
    [5, '#000', ['','','','','< tap to fullscreen >']],
    [1, '#000'],
    [3, null, null, (dt, fraction) => {
      background[Y] -= dt * 5;
      tombRow1[Y] += dt * 5;
      tombRow2[Y] += dt * 10;
      tombRow3[Y] += dt * 12;
      necro[Y] -= dt * 2;
    }],
    [1],
    [3, null, ['At long last,', 'the Nekros crystal is mine!']],
    [1],
    [3, null, ['My undead warriors', 'will swarm the earth.']],
    [1],
    [2, '#000'],
  ]);
});
