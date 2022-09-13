const introScene2 = (canvas) => new Promise(next => {
  const context = canvas.getContext('2d');
  const root = createSprite();

  const logo = createSprite(100, 140, 0, 0, POLY_LOGO1);
  addSprite(root, logo);

  const necroBody = createSprite(130, 230, 15, 0, POLY_NECRO1);
  addSprite(root, necroBody);

  let handTick = 0;
  const necroHand= createSprite(-2, -2, 1, 0, POLY_NECRO2);
  addBehavior(necroHand, (sprite, dt) => {
    handTick += dt;
    necroHand[X] = -6 + (Math.cos(handTick));
    necroHand[Y] = 7 + (Math.sin(handTick));
  });
  addSprite(necroBody, necroHand);

  runCutscene(context, root, '#214', next, [
    [0, '#000'],
    [2],
    [3, null, ['FALLEN ONES!', 'CONDEMNED ONES!']],
    [1],
    [3, null, ['OBEY MY COMMAND!','AND...']],
    [4, null, null, (dt, fraction) => {
      logo[SCALE] += dt * 3;
      logo[OPACITY] += dt;
      necroBody[Y] += dt * 10;
    }],
    [1, '#f0f', null, dt => {
      logo[Y] -= dt * 30;
      necroBody[Y] -= dt * 50;
    }],
  ]);
});
