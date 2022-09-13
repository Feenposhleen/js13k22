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
    

  
  //   let curtain = 1;
  // let tick = 0;
  // let text;
  // runLoop(0, (_, dt) => {
  //   tick += dt;
  //   if (tick < 3) {
  //     curtain = Math.max(0, (1 - tick));
  //   } else if (tick < 6) {
  //     skull[Y] -= (dt * 80);
  //     necroBody[Y] -= (dt * 120);
  //   } else if (tick < 7) { text = null;
  //   } else if (tick < 9) { text = ['You are perfect!'];
  //   } else if (tick < 12) {
  //     necroBody[X] -= (dt * 20);
  //     skull[X] -= (dt * 10);
  //   } else if (tick < 16) { text = ['Together, we will', 'conquer everything!'];
  //   } else if (tick < 18) { text = null;
  //   } else if (tick < 20) {
  //     curtain += dt / 2;
  //   } else {
  //     next();
  //     return 0;
  //   }

  //   context.globalAlpha = 1;
  //   context.fillStyle = '#448';
  //   context.fillRect(0, 0, 200, 400);

  //   runSpriteTree(context, root, dt);

  //   if (text) {
  //     context.textAlign = 'center';
  //     context.fillStyle = '#fff';
  //     context.font = '12px bold monospace';
  //     context.globalAlpha = 1;

  //     for (let i = 0; i < text.length; i++) {
  //       context.fillText(text[i], 100, 30 + (i* 12));
  //     }
  //   }

  //   if (curtain > 0) {
  //     context.fillStyle = '#fff';
  //     context.globalAlpha = curtain;
  //     context.fillRect(0, 0, 200, 400);
  //   }

  //   return 1;
  // });
});
