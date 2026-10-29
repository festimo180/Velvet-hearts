(() => {
const root = document.getElementById('vh-3d-opening');
if (!root || root.dataset.ready) return;
root.dataset.ready = '1';

const canvas = root.querySelector('canvas');
const ctx = canvas.getContext('2d');
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
let w = 0, h = 0, dpr = 1, frame = 0;
let targetX = 0, targetY = 0, lookX = 0, lookY = 0;
let downX = 0, downY = 0, dragging = false;
const petals = Array.from({length: 65}, () => ({
x: Math.random(), y: Math.random(),
z: .2 + Math.random() * .8,
s: 2 + Math.random() * 5,
a: Math.random() * 6.28,
speed: .15 + Math.random() * .5
}));

function resize() {
const r = root.getBoundingClientRect();
w = r.width; h = r.height;
dpr = Math.min(devicePixelRatio || 1, 1.5);
canvas.width = Math.round(w * dpr);
canvas.height = Math.round(h * dpr);
canvas.style.width = w + 'px';
canvas.style.height = h + 'px';
ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function drawCharacter(cx, cy, scale, female, time) {
ctx.save();
ctx.translate(cx, cy + Math.sin(time * 1.2 + (female ? 1 : 0)) * 3 * scale);
ctx.scale(scale, scale);

// Soft cinematic character shadow
ctx.fillStyle = '#08050d66';
ctx.beginPath();
ctx.ellipse(0, 142, 52, 10, 0, 0, Math.PI * 2);
ctx.fill();

// Legs
ctx.fillStyle = female ? '#342039' : '#202039';
ctx.fillRect(-24, 78, 19, 61);
ctx.fillRect(5, 78, 19, 61);
ctx.fillStyle = '#17131e';
ctx.fillRect(-29, 133, 25, 10);
ctx.fillRect(3, 133, 27, 10);

// Body and outfit
ctx.fillStyle = female ? '#a84978' : '#31436e';
ctx.beginPath();
ctx.moveTo(-34, -4);
ctx.quadraticCurveTo(-43, 30, -30, 83);
ctx.lineTo(30, 83);
ctx.quadraticCurveTo(43, 30, 34, -4);
ctx.quadraticCurveTo(0, -25, -34, -4);
ctx.fill();

if (female) {
  ctx.fillStyle = '#d985ad';
  ctx.beginPath();
  ctx.moveTo(-27, 49);
  ctx.lineTo(27, 49);
  ctx.lineTo(43, 105);
  ctx.lineTo(-43, 105);
  ctx.closePath();
  ctx.fill();
}

// Neck
ctx.fillStyle = '#d99b83';
ctx.fillRect(-9, -17, 18, 24);

// Hair behind head
ctx.fillStyle = female ? '#241222' : '#171522';
ctx.beginPath();
ctx.ellipse(0, -38, female ? 34 : 31, female ? 39 : 34, 0, 0, Math.PI * 2);
ctx.fill();

// Face
ctx.fillStyle = '#f1c0a6';
ctx.beginPath();
ctx.ellipse(0, -37, 25, 31, 0, 0, Math.PI * 2);
ctx.fill();

// Anime hair fringe
ctx.fillStyle = female ? '#241222' : '#171522';
ctx.beginPath();
ctx.moveTo(-25, -44);
ctx.quadraticCurveTo(-20, -78, 3, -65);
ctx.quadraticCurveTo(22, -72, 26, -43);
ctx.lineTo(10, -49);
ctx.lineTo(0, -35);
ctx.lineTo(-10, -48);
ctx.lineTo(-25, -37);
ctx.closePath();
ctx.fill();

// Eyes
ctx.fillStyle = '#342033';
ctx.beginPath();
ctx.ellipse(-9, -36, 3.2, 5, 0, 0, Math.PI * 2);
ctx.ellipse(9, -36, 3.2, 5, 0, 0, Math.PI * 2);
ctx.fill();
ctx.strokeStyle = '#b66e79';
ctx.lineWidth = 1.5;
ctx.beginPath();
ctx.arc(0, -26, 5, .15, Math.PI - .15);
ctx.stroke();

// Highlights
ctx.fillStyle = '#fff2f8';
ctx.beginPath();
ctx.arc(-10, -38, 1.2, 0, Math.PI * 2);
ctx.arc(8, -38, 1.2, 0, Math.PI * 2);
ctx.fill();
ctx.restore();

}

function draw(time) {
if (!root.isConnected || root.hidden) return;
lookX += (targetX - lookX) * .045;
lookY += (targetY - lookY) * .045;
ctx.clearRect(0, 0, w, h);

const sky = ctx.createLinearGradient(0, 0, w, h);
sky.addColorStop(0, '#281128');
sky.addColorStop(.55, '#633052');
sky.addColorStop(1, '#100b20');
ctx.fillStyle = sky;
ctx.fillRect(0, 0, w, h);

// Distant glowing moon
const mx = w * (.76 - lookX * .05), my = h * .22 + lookY * 10;
const glow = ctx.createRadialGradient(mx, my, 2, mx, my, Math.min(w, h) * .28);
glow.addColorStop(0, '#ffb5d566');
glow.addColorStop(1, '#ffb5d500');
ctx.fillStyle = glow;
ctx.fillRect(0, 0, w, h);
ctx.fillStyle = '#ffe5f0';
ctx.beginPath();
ctx.arc(mx, my, Math.min(w, h) * .045, 0, Math.PI * 2);
ctx.fill();

// Distant city lights
for (let i = 0; i < 22; i++) {
  const bx = (i / 22) * w + lookX * (i % 3) * 8;
  const bh = 30 + ((i * 37) % 95);
  ctx.fillStyle = i % 2 ? '#24182f' : '#33203b';
  ctx.fillRect(bx, h * .60 - bh + lookY * 5, w / 30, bh);
  ctx.fillStyle = '#ffd1e855';
  for (let j = 0; j < 3; j++) {
    ctx.fillRect(bx + 5, h * .60 - bh + 9 + j * 13, 3, 4);
  }
}

// Garden ground
ctx.fillStyle = '#15111f';
ctx.beginPath();
ctx.moveTo(0, h * .68);
ctx.quadraticCurveTo(w * .5, h * .56, w, h * .68);
ctx.lineTo(w, h);
ctx.lineTo(0, h);
ctx.fill();

// Trees and branches
for (let side of [-1, 1]) {
  ctx.save();
  ctx.translate(w * (side < 0 ? .08 : .92) + lookX * 22, h * .47 + lookY * 8);
  ctx.strokeStyle = '#211226';
  ctx.lineWidth = 13;
  ctx.beginPath();
  ctx.moveTo(0, h * .3);
  ctx.quadraticCurveTo(side * 20, -h * .1, side * 75, -h * .2);
  ctx.stroke();
  for (let i = 0; i < 18; i++) {
    ctx.fillStyle = i % 2 ? '#d76ca455' : '#ffb5d966';
    ctx.beginPath();
    ctx.arc(side * (20 + (i * 17) % 95), -15 - (i * 19) % 120, 3 + i % 5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

// Couple responds to camera movement
const unit = Math.min(w / 390, h / 650);
const center = w / 2 + lookX * 32;
const cy = h * .53 + lookY * 12;
drawCharacter(center - 36 * unit, cy, unit * .83, false, time / 1000);
drawCharacter(center + 38 * unit, cy + 8 * unit, unit * .83, true, time / 1000);

// Falling rose petals
petals.forEach(p => {
  if (!reduced) {
    p.y += p.speed * .00045 * (h / 600);
    p.x += Math.sin(time / 1300 + p.a) * .00025;
    p.a += .008;
    if (p.y > 1.05) { p.y = -.04; p.x = Math.random(); }
  }
  const x = p.x * w + lookX * p.z * 24;
  const y = p.y * h;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(p.a);
  ctx.fillStyle = `rgba(255, ${140 + Math.round(p.z * 70)}, ${190 + Math.round(p.z * 50)}, ${.25 + p.z * .65})`;
  ctx.beginPath();
  ctx.ellipse(0, 0, p.s * p.z, p.s * p.z * .58, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
});

frame = requestAnimationFrame(draw);

}

root.addEventListener('pointerdown', e => {
if (e.target.closest('button')) return;
dragging = true; downX = e.clientX; downY = e.clientY;
try { root.setPointerCapture(e.pointerId); } catch {}
});
root.addEventListener('pointermove', e => {
if (dragging) {
targetX = Math.max(-1, Math.min(1, targetX + (e.clientX - downX) / Math.max(w, 1) * 2));
targetY = Math.max(-1, Math.min(1, targetY + (e.clientY - downY) / Math.max(h, 1) * 2));
downX = e.clientX; downY = e.clientY;
} else {
targetX = Math.max(-1, Math.min(1, (e.clientX / Math.max(w, 1) - .5) * 1.5));
}
});
root.addEventListener('pointerup', () => dragging = false);
root.addEventListener('pointercancel', () => dragging = false);
window.addEventListener('resize', resize);

function enterSite() {
root.classList.add('vh3d-leaving');
setTimeout(() => {
root.hidden = true;
document.body.style.overflow = '';
const target = document.querySelector('main, #velvet-app, #app, .app');
if (target) target.scrollIntoView({behavior: 'smooth', block: 'start'});
else window.scrollTo({top: 0, behavior: 'smooth'});
}, 750);
}

root.querySelectorAll('[data-vh3d-enter]').forEach(btn => btn.addEventListener('click', enterSite));
root.querySelectorAll('[data-vh3d-close]').forEach(btn => btn.addEventListener('click', enterSite));

// The opening is dismissible; the underlying website remains available.
resize();
document.body.style.overflow = 'hidden';
draw(0);
})();
