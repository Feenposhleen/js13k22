const X = 0;
const Y = 1;
const SCALE = 2;
const ROTATION = 3;
const DATA = 4;
const FLIP = 5;
const OPACITY = 6;
const CHILDREN = 7;
const BEHAVIOR = 8;
const PRERENDER = 9;
const SEED = 10;

const FLIP_X = 4;
const FLIP_Y = 8;
const FLIP_XY = 12;

const REMOVE = 4;
const STOP = 8;
const STOP_AND_REMOVE = 12;

// Randomizers
const rndOne = () => (Math.random() - 0.5) * 2;
const rndRange = (point, spread = 10) => point + (rndOne() * spread);
const rndRadius = (pos, radius = 10) => [rndRange(pos[0], radius), rndRange(pos[1], radius)];

const createSprite = (x = 0, y = 0, scale = 1, rotation = 0, data = []) =>
  [x, y, scale, rotation, data, 0, 1, [], [], null, rndOne()];

const prerenderSprite = (sprite) => {
  var canvas = document.createElement('canvas');
  canvas.width = 24 * sprite[SCALE];
  canvas.height = 24 * sprite[SCALE];

  var ctx = canvas.getContext('2d');
  ctx.translate(12 * sprite[SCALE], 12 * sprite[SCALE]);
  ctx.scale(sprite[SCALE], sprite[SCALE]);

  drawPrerenderTree(ctx, sprite, 0, true);

  sprite[PRERENDER] = canvas;
}

const allSprites = (parent, cb, deep = true) => {
  for (let i = parent[CHILDREN].length - 1; i >= 0; i--) {
    const child = parent[CHILDREN][i];
    const res = cb(child, i);

    if (res && (res & REMOVE)) parent[CHILDREN].splice(i, 1);
    if (res && (res & STOP))  return;

    if (deep && child[CHILDREN].length) {
      allSprites(child, cb);
    }
  }
}

const addSprite = (parent, sprite) => parent[CHILDREN].push(sprite);

const addBehavior = (sprite, behavior) => sprite[BEHAVIOR].push(behavior);

const removeSprite = (parent, sprite) =>
  allSprites(parent, child => (child === sprite ? STOP_AND_REMOVE : 0));

const drawSprite = (ctx, sprite) => {
  let i = 0;
  while (i < sprite[DATA].length) {
    ctx.beginPath();
    ctx.fillStyle = sprite[DATA][i];

    ctx.moveTo(
      sprite[DATA][i + 1] * ((sprite[FLIP] & FLIP_X) ? -1 : 1),
      sprite[DATA][i + 2] * ((sprite[FLIP] & FLIP_Y) ? -1 : 1),
    );

    i += 3;

    while (typeof sprite[DATA][i] === 'number') {
      ctx.lineTo(
        sprite[DATA][i] * ((sprite[FLIP] & FLIP_X) ? -1 : 1),
        sprite[DATA][i + 1] * ((sprite[FLIP] & FLIP_Y) ? -1 : 1),
      );
      i += 2;
    }

    ctx.fill();
  }
}

const drawPrerenderTree = (ctx, sprite) => {
  drawSprite(ctx, sprite);
  for (let i = 0; i < sprite[CHILDREN].length; i++) {
    drawSprite(ctx, sprite[CHILDREN][i]);
  }
}

const runBehaviors = (sprite, dt, ctx) => {
  for (let i = 0; i < sprite[BEHAVIOR].length; i++) {
    sprite[BEHAVIOR][i](sprite, dt, ctx);
  }
};

const runSpriteTree = (ctx, sprite, dt, raw) => {
  ctx.save();
  ctx.globalAlpha = Math.max(0, sprite[OPACITY]);
  ctx.translate(sprite[X], sprite[Y]);

  if (sprite[PRERENDER]) {
    ctx.rotate(sprite[ROTATION]);
    ctx.drawImage(sprite[PRERENDER], -(sprite[PRERENDER].width / 2), -(sprite[PRERENDER].height / 2));
  } else {
    ctx.scale(sprite[SCALE], sprite[SCALE]);
    ctx.rotate(sprite[ROTATION]);
    drawSprite(ctx, sprite);

    for (let i = 0; i < sprite[CHILDREN].length; i++) {
      runSpriteTree(ctx, sprite[CHILDREN][i], dt, raw);
    }
  }

  ctx.restore();
  
  runBehaviors(sprite, dt, ctx);
};
