(async () => {
  const canvas = document.querySelector('#c');
  canvas.addEventListener('click', () => canvas.requestFullscreen());
  await introScene1(canvas);
  await introScene2(canvas);
  await introScene3(canvas);
  while (true) {
    const res = await gameplayScene(canvas);
    if (res) {
      await victoryScene(canvas, res);
    };
  }
})();