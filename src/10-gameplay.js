const _drawBoneBar = (state, ctx) => {
  ctx.fillStyle = '#742';
  ctx.fillRect(10, 370, 180, 20);

  ctx.fillStyle = '#963';
  ctx.fillRect(10, 370, 180, 1);

  for (let i = 0; i < 11; i++) {
    ctx.fillStyle = (i < state.playerBones) ? '#a84' : '#210';
    ctx.fillRect(13 + (i * (174 / 11)), 373, (174 / 11), 14);
  }

  ctx.font = '12px sans-serif';
  ctx.fillStyle = '#963';
  ctx.textAlign = 'center';
  ctx.fillText('BONES', 100, 384);
};

const _drawProgressBar = (value, min, max, color, y, text, ctx) => {
  ctx.fillStyle = '#742';
  ctx.fillRect(10, y, 180, 16);

  ctx.fillStyle = '#963';
  ctx.fillRect(10, y, 180, 1);

  ctx.fillStyle = color;
  ctx.fillRect(13, y + 3, Math.max(0, (value / (max - min))) * 174, 10);

  ctx.font = '8px sans-serif';
  ctx.fillStyle = '#bbb';
  ctx.textAlign = 'center';
  ctx.fillText(text, 100, y + 11);
};

const gameplayScene = (canvas) => new Promise(next => {
  const GOAL = 26000;

  const ctx = canvas.getContext('2d');
  const root = createSprite();

  const background = createSprite();
  addSprite(root, background);

  const background2 = createSprite();
  addSprite(root, background2);

  const foreground = createSprite();
  addSprite(root, foreground);

  const fx = createSprite();
  addSprite(root, fx);

  const state = {
    touch: null,
    keys: {},
    canvas,
    root,
    background,
    background2,
    foreground,
    fx,
    playerX: 50,
    playerBones: 1,
    speed: 0,
    distance: 0,
    timeLeft: 120,
  };

  state.particles = particleManager(state);

  window.addEventListener('keydown', (ev) => state.keys[ev.key] = true);
  window.addEventListener('keyup', (ev) => state.keys[ev.key] = false);
  document.addEventListener('touchend', () => state.touch = null);
  document.addEventListener('touchstart', (ev) => {
    const side = ev.touches[0].screenX / window.innerWidth;
    state.touch = side > 0.5 ? 'right' : 'left';
  });

  createPlayer(state);
  createBackground(state);
  createSpawner(state);

  let tick = 0;
  let curtain = 0;
  let brightCurtain = false;
  let curtainText;
  runLoop(0, (_, dt) => {
    tick += dt;

    ctx.globalAlpha = 1;
    ctx.fillStyle = '#642';
    ctx.fillRect(0, 0, 200, 400);

    runSpriteTree(ctx, root, dt);
    _drawBoneBar(state, ctx);
    _drawProgressBar(state.timeLeft, 0, 120, '#a52', 338, 'MASTERS PATIENCE', ctx);
    _drawProgressBar(GOAL - state.distance, 0, GOAL, '#257', 354, 'DISTANCE LEFT', ctx);

    if (tick < 2) {
      curtain = (1 - (tick / 2));
    } else if (state.distance > GOAL) {
      curtain += (dt / 2);
      brightCurtain = true;
      curtainText = 'I CAN SEE THE LIGHT!';
      if (curtain >= 1) {
        next(120 - state.timeLeft);
        return 0;
      }
    } else if (state.timeLeft < 0) {
      curtain += (dt / 2);
      curtainText = 'YOU DISAPPOINT ME!';
      if (curtain >= 1) {
        next(false);
        return 0;
      }
    }

    state.timeLeft -= dt;
    state.distance += (state.speed * dt);

    if (curtain > 0) {
      ctx.globalAlpha = curtain;
      ctx.fillStyle = brightCurtain ? '#fff' : '#000';
      ctx.fillRect(0, 0, 200, 400);

      if (curtainText) {
        ctx.globalAlpha = 1;
        ctx.font = '16px bold sans-serif';
        ctx.fillStyle = brightCurtain ? '#000' : '#fff';
        ctx.textAlign = 'center';
        ctx.fillText(curtainText, 100, 200);
      }
    }

    return 1;
  });
});
