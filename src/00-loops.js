const runLoop = (state, cb) => {
  let prevTs = performance.now();
  let dt = 0;
  
  const loop = (ts) => {
    dt = Math.min((ts - prevTs) / 1000, 0.1);
    if (cb(state, dt)) {
      requestAnimationFrame(loop);
    }
    prevTs = ts;
  }
  
  loop(prevTs);
};