const victoryScene = (canvas, seconds) => new Promise(next => {
  const context = canvas.getContext('2d');
  const root = createSprite();

  const necroBody = createSprite(80, 550, 18, 0, POLY_NECRO1);
  necroBody[FLIP] = FLIP_X;
  addSprite(root, necroBody);

  const skull = createSprite(140, 600, 13, 0.2, POLY_SKULL1);
  skull[FLIP] = FLIP_X;
  addSprite(root, skull);

  let listener;
  listener = () => (window.removeEventListener('click', listener) || next());
  const cb = () => window.addEventListener('click', listener);

  runCutscene(context, root, '#214', cb, [
    [0, '#fff'],
    [4, null, null, (dt, fraction) => {
      skull[Y] = 600 - (fraction * 280);
      necroBody[Y] = 600 - (fraction * 400);
    }],
    [1],
    [3, null, ['You are perfect!']],
    [3, null, null, (dt, fraction) => {
      necroBody[X] -= (dt * 20);
      skull[X] -= (dt * 5);
    }],
    [3, null, ['Together, we will', 'conquer everything!']],
    [3, '#000'],
    [1, '#000'],
    [3, '#000', [
      '',
      '',
      '',
      'The police rapidly figured',
      'out the whole plan and ',
      'arrested the necromancer,',
      'successfully preventing the',
      'skeleton army from forming.',
      '',
      '',
      '',
      '',
      'Your time to reach the surface was:',
      `${Math.floor(seconds / 60)}m ${Math.floor(seconds % 60)}s`,
      '',
      '< tap to play again >']],
  ]);
});
