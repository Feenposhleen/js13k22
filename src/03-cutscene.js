// Part:
// [durationSeconds, curtainColor, text, frameCallback(dt, fraction)]

const runCutscene = (ctx, rootNode, bgColor, endCb, sceneParts) => {
  const queue = [...sceneParts];
  queue.reverse();

  let tick, currentPart, nextPart, previousPart, fraction;

  let curtainOpacity = 0;
  
  const updatePart = () => {
    previousPart = currentPart;
    currentPart = queue.pop();
    nextPart = queue[queue.length - 1];
    tick = 0;
    fraction = 0;
  };

  updatePart();
  if (currentPart[1]) curtainOpacity = 1;
  runLoop(null, (_, dt) => {
    tick += dt;
    fraction = tick / currentPart[0];

    if (fraction > 1) {
      if (!nextPart) {
        endCb();
        return 0;
      } else {
        updatePart();
        return 1;
      }
    } else {
      currentPart[3] && currentPart[3](dt, fraction);
    }

    ctx.globalAlpha = 1;
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, 200, 400);

    runSpriteTree(ctx, rootNode, dt);

    curtainOpacity = Math.min(1, Math.max(0, curtainOpacity + (currentPart[1] ? dt : -dt)));
    if (curtainOpacity > 0) {
      ctx.fillStyle = currentPart[1] || previousPart[1];
      ctx.globalAlpha = curtainOpacity;
      ctx.fillRect(0, 0, 200, 400);
    }
    
    if (currentPart[2]) {
      ctx.textAlign = 'center';
      ctx.fillStyle = '#fff';
      ctx.font = '12px bold monospace';
      ctx.globalAlpha = 1;

      for (let i = 0; i < currentPart[2].length; i++) {
        ctx.fillText(currentPart[2][i], 100, 50 + (i* 12));
      }
    }

    return 1;
  });
};