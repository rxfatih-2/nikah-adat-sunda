/* ---------- kelopak jatuh ---------- */
(function petals(){
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const cv = document.getElementById("petals"), cx = cv.getContext("2d");
  let W, H, dpr, items = [];
  const N = reduce ? 14 : (innerWidth < 600 ? 24 : 42);
  function size(){ dpr = Math.min(devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight; cv.width = W * dpr; cv.height = H * dpr; cx.setTransform(dpr,0,0,dpr,0,0); }
  function make(initial){
    const jasmine = Math.random() < .3;
    return { x: Math.random() * W, y: initial ? Math.random() * H : -30, s: (jasmine ? 7 : 9) + Math.random() * 10, vy: .4 + Math.random() * .9, vx: -.2 + Math.random() * .5,
      r: Math.random() * 6.28, vr: (Math.random() - .5) * .025, ph: Math.random() * 6.28, sw: .4 + Math.random() * .9, jasmine,
      col: ["#f6b9ca","#f19ab5","#fde0e8","#e97c9d"][Math.floor(Math.random() * 4)], a: .35 + Math.random() * .35 };
  }
  function draw(p){
    cx.save(); cx.translate(p.x, p.y); cx.rotate(p.r); cx.globalAlpha = p.a;
    if(p.jasmine){
      cx.fillStyle = "#fff"; cx.strokeStyle = "rgba(201,73,107,.35)"; cx.lineWidth = .7;
      for(let i = 0; i < 5; i++){ cx.rotate(1.2566); cx.beginPath(); cx.ellipse(0, -p.s * .55, p.s * .26, p.s * .55, 0, 0, 6.2832); cx.fill(); cx.stroke(); }
      cx.fillStyle = "#f3b3c5"; cx.beginPath(); cx.arc(0, 0, p.s * .16, 0, 6.2832); cx.fill();
    } else {
      cx.fillStyle = p.col; cx.beginPath(); cx.moveTo(0, -p.s);
      cx.bezierCurveTo(p.s * .9, -p.s * .5, p.s * .7, p.s * .6, 0, p.s); cx.bezierCurveTo(-p.s * .7, p.s * .6, -p.s * .9, -p.s * .5, 0, -p.s); cx.fill();
      cx.globalAlpha = p.a * .35; cx.strokeStyle = "#fff"; cx.lineWidth = .8; cx.beginPath(); cx.moveTo(0, -p.s * .8); cx.lineTo(0, p.s * .6); cx.stroke();
    }
    cx.restore();
  }
  function frame(){
    cx.clearRect(0, 0, W, H);
    for(const p of items){
      p.ph += .012 * p.sw; p.x += p.vx + Math.sin(p.ph) * .6; p.y += p.vy; p.r += p.vr;
      if(p.y > H + 30 || p.x < -40 || p.x > W + 40) Object.assign(p, make(false), { x: Math.random() * W });
      draw(p);
    }
    if(!reduce) requestAnimationFrame(frame);
  }
  size(); items = Array.from({ length: N }, () => make(true));
  addEventListener("resize", size);
  reduce ? frame() : requestAnimationFrame(frame);
})();
