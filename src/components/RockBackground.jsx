import React, { useEffect, useRef } from 'react';
import { getPerformanceProfile } from '../hooks/usePerformancePreferences';

/* ── Color helpers ─────────────────────────────────────────────────── */
const hex2rgb = (h) => [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)];
const rgb2hex = (r,g,b) => '#'+[r,g,b].map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,'0')).join('');
const lighten = (h,t) => { const [r,g,b]=hex2rgb(h); return rgb2hex(r+(255-r)*t,g+(255-g)*t,b+(255-b)*t); };
const darken  = (h,t) => { const [r,g,b]=hex2rgb(h); return rgb2hex(r*(1-t),g*(1-t),b*(1-t)); };
const rgba    = (h,a) => { const [r,g,b]=hex2rgb(h); return `rgba(${r},${g},${b},${a})`; };

/* ── Constants ─────────────────────────────────────────────────────── */
const BODY = 50;
const PAD = 30;
const STOTAL = (BODY + PAD) * 2; // 160
const PALETTE = ['#e85d04','#c77dff','#00b4d8','#fbbf24','#f472b6','#34d399'];
const NOTE_COLORS = ['#00f5d4','#fee440','#f15bb5','#9b5de5'];
const TAU = Math.PI * 2;

/* ── Instrument Renderers (centered at 0,0 in ±BODY box) ──────────── */

function drawGuitar(c, col) {
  c.shadowBlur = 20; c.shadowColor = col;
  // Body
  c.beginPath();
  c.moveTo(0, -18);
  c.bezierCurveTo(-18,-18,-20,-10,-16,0);
  c.bezierCurveTo(-11,6,-11,11,-20,18);
  c.bezierCurveTo(-25,27,-16,40,0,40);
  c.bezierCurveTo(16,40,25,27,20,18);
  c.bezierCurveTo(11,11,11,6,16,0);
  c.bezierCurveTo(20,-10,18,-18,0,-18);
  c.closePath();
  const bg = c.createRadialGradient(-4,-2,2,0,10,22);
  bg.addColorStop(0, lighten(col,0.4));
  bg.addColorStop(0.5, col);
  bg.addColorStop(1, darken(col,0.35));
  c.fillStyle = bg; c.fill();
  c.strokeStyle = darken(col,0.25); c.lineWidth = 1.4; c.stroke();
  c.shadowBlur = 0;
  // Neck
  let g = c.createLinearGradient(-3,0,3,0);
  g.addColorStop(0,'#4a2c00'); g.addColorStop(0.4,'#8B5A2B'); g.addColorStop(1,'#2a1500');
  c.fillStyle = g; c.fillRect(-3.5,-44,7,27);
  c.strokeStyle = '#5a3000'; c.lineWidth = 0.6; c.strokeRect(-3.5,-44,7,27);
  // Frets
  for (let i=1;i<=5;i++) { c.beginPath(); c.moveTo(-3.5,-44+i*4.8); c.lineTo(3.5,-44+i*4.8); c.strokeStyle='rgba(255,220,100,0.6)'; c.lineWidth=0.35; c.stroke(); }
  // Headstock
  c.beginPath(); c.roundRect(-5,-49,10,7,2);
  c.fillStyle = darken(col,0.4); c.fill(); c.strokeStyle = darken(col,0.3); c.lineWidth=0.8; c.stroke();
  // Tuning pegs
  c.fillStyle = '#c0c0d0';
  for (let i=0;i<3;i++) { c.beginPath(); c.arc(-7,-47+i*2.5,1.1,0,TAU); c.fill(); c.beginPath(); c.arc(7,-47+i*2.5,1.1,0,TAU); c.fill(); }
  // Sound hole
  c.beginPath(); c.arc(0,22,6.5,0,TAU);
  c.fillStyle='#0a0500'; c.fill();
  c.strokeStyle = lighten(col,0.2); c.lineWidth=1.2; c.stroke();
  c.beginPath(); c.arc(0,22,8,0,TAU); c.strokeStyle = rgba(col,0.3); c.lineWidth=0.6; c.stroke();
  // Bridge
  c.fillStyle = '#3a2010'; c.fillRect(-6,33,12,2.5);
  // Strings
  c.strokeStyle = 'rgba(255,255,255,0.3)'; c.lineWidth=0.35;
  c.beginPath(); for(let i=0;i<6;i++){const x=-2.5+i; c.moveTo(x*0.5,-44); c.lineTo(x,34);} c.stroke();
  // Gloss
  c.beginPath(); c.ellipse(-7,10,5,14,-0.2,0,TAU); c.fillStyle='rgba(255,255,255,0.09)'; c.fill();
}

function drawDrum(c, col) {
  c.shadowBlur = 20; c.shadowColor = col;
  const rx=26, ry=9;
  // Bottom ellipse lower half
  c.beginPath(); c.ellipse(0,16,rx,ry,0,0,Math.PI); c.fillStyle=darken(col,0.2); c.fill();
  // Shell
  const sg = c.createLinearGradient(-rx,0,rx,0);
  sg.addColorStop(0,darken(col,0.35)); sg.addColorStop(0.3,lighten(col,0.15)); sg.addColorStop(0.5,lighten(col,0.3)); sg.addColorStop(0.7,lighten(col,0.15)); sg.addColorStop(1,darken(col,0.35));
  c.fillStyle = sg; c.fillRect(-rx,-10,rx*2,26);
  c.strokeStyle = darken(col,0.2); c.lineWidth=0.6;
  c.beginPath(); c.moveTo(-rx,-10); c.lineTo(-rx,16); c.stroke();
  c.beginPath(); c.moveTo(rx,-10); c.lineTo(rx,16); c.stroke();
  // Drumhead
  c.beginPath(); c.ellipse(0,-10,rx,ry,0,0,TAU);
  const hg = c.createRadialGradient(0,-12,2,0,-10,rx);
  hg.addColorStop(0,lighten(col,0.5)); hg.addColorStop(0.5,lighten(col,0.25)); hg.addColorStop(1,col);
  c.fillStyle = hg; c.fill(); c.strokeStyle=lighten(col,0.15); c.lineWidth=2; c.stroke();
  c.shadowBlur = 0;
  // Rim highlight
  c.beginPath(); c.ellipse(0,-10,rx-2,ry-1.5,0,-0.4,Math.PI*0.4); c.strokeStyle='rgba(255,255,255,0.2)'; c.lineWidth=1.5; c.stroke();
  // Tension rods
  c.strokeStyle = rgba('#ffffff',0.1); c.lineWidth = 0.6;
  for(let i=0;i<8;i++){const a=TAU/8*i,x=Math.cos(a)*rx; c.beginPath(); c.moveTo(x,-10+Math.abs(Math.sin(a))*ry); c.lineTo(x,16+Math.abs(Math.sin(a))*ry*0.6); c.stroke();}
  // Lug nuts
  c.fillStyle='#c0c0d0';
  for(let i=0;i<6;i++){const a=TAU/6*i; c.beginPath(); c.arc(Math.cos(a)*rx,3+Math.sin(a)*3,1.4,0,TAU); c.fill();}
  // Drumsticks
  c.strokeStyle='#d4a57a'; c.lineWidth=2.5; c.lineCap='round';
  c.beginPath(); c.moveTo(-20,-28); c.lineTo(7,-7); c.stroke();
  c.beginPath(); c.moveTo(20,-28); c.lineTo(-7,-7); c.stroke();
  c.lineCap='butt';
  c.fillStyle='#e8c8a0';
  c.beginPath(); c.arc(7,-7,2.2,0,TAU); c.fill();
  c.beginPath(); c.arc(-7,-7,2.2,0,TAU); c.fill();
}

function drawSax(c, col) {
  c.shadowBlur = 20; c.shadowColor = col;
  c.lineCap='round'; c.lineJoin='round';
  // Body tube
  c.beginPath(); c.moveTo(4,-40); c.quadraticCurveTo(0,-15,-6,5); c.quadraticCurveTo(-14,25,-8,35);
  c.lineWidth=12; c.strokeStyle=darken(col,0.15); c.stroke();
  c.lineWidth=10; c.strokeStyle=col; c.stroke();
  c.lineWidth=3; c.strokeStyle=lighten(col,0.3); c.stroke();
  c.shadowBlur = 0;
  // Bell
  c.beginPath(); c.arc(-4,40,14,0,TAU); c.fillStyle=col; c.fill(); c.strokeStyle=darken(col,0.2); c.lineWidth=1.5; c.stroke();
  c.beginPath(); c.arc(-4,40,9,0,TAU); c.fillStyle='#0a0a18'; c.fill();
  c.beginPath(); c.arc(-6,38,4.5,0,TAU); c.fillStyle='rgba(255,255,255,0.08)'; c.fill();
  // Mouthpiece
  c.lineWidth=4; c.strokeStyle='#555'; c.beginPath(); c.moveTo(4,-40); c.lineTo(2,-48); c.stroke();
  c.beginPath(); c.arc(2,-49,2.5,0,TAU); c.fillStyle='#444'; c.fill();
  // Keys
  c.fillStyle='#d0d0e0';
  [[-1,-28],[-3,-18],[-4,-8],[-7,5],[-10,18]].forEach(([kx,ky])=>{
    c.beginPath(); c.arc(kx-3,ky,2,0,TAU); c.fill(); c.strokeStyle=rgba(col,0.4); c.lineWidth=0.5; c.stroke();
  });
  c.lineCap='butt'; c.lineJoin='miter';
}

function drawPiano(c, col) {
  c.shadowBlur = 20; c.shadowColor = col;
  // Piano body top
  const bg = c.createLinearGradient(-38,-22,-38,-10);
  bg.addColorStop(0,darken(col,0.35)); bg.addColorStop(1,darken(col,0.15));
  c.fillStyle = bg; c.beginPath(); c.roundRect(-38,-22,76,14,[4,4,0,0]); c.fill();
  c.strokeStyle=darken(col,0.4); c.lineWidth=1; c.stroke();
  c.shadowBlur=0;
  // White keys
  const kw=76/7;
  for(let i=0;i<7;i++){const x=-38+i*kw; c.fillStyle='#eee8f8'; c.fillRect(x+0.4,-8,kw-0.8,38); c.strokeStyle='#9080a0'; c.lineWidth=0.35; c.strokeRect(x+0.4,-8,kw-0.8,38);}
  // Black keys
  c.fillStyle='#1a1028';
  [0,1,3,4,5].forEach(pos=>{const x=-38+(pos+0.65)*kw; c.beginPath(); c.roundRect(x,-8,kw*0.55,24,[0,0,2,2]); c.fill();});
  // Light reflection
  c.fillStyle='rgba(255,255,255,0.06)'; c.fillRect(-36,-6,72,3);
  // Bottom edge
  c.fillStyle=darken(col,0.45); c.fillRect(-38,30,76,4);
  // Label
  c.fillStyle=rgba(lighten(col,0.4),0.5); c.font='bold 5px sans-serif'; c.textAlign='center'; c.fillText('♫ PIANO',0,-13);
}

function drawViolin(c, col) {
  c.shadowBlur = 20; c.shadowColor = col;
  // Body
  c.beginPath();
  c.moveTo(0,-14);
  c.bezierCurveTo(-14,-14,-16,-6,-11,2);
  c.bezierCurveTo(-7,6,-7,10,-13,16);
  c.bezierCurveTo(-18,23,-12,36,0,36);
  c.bezierCurveTo(12,36,18,23,13,16);
  c.bezierCurveTo(7,10,7,6,11,2);
  c.bezierCurveTo(16,-6,14,-14,0,-14);
  c.closePath();
  const bg = c.createRadialGradient(-3,5,2,0,12,20);
  bg.addColorStop(0,lighten(col,0.35)); bg.addColorStop(0.5,col); bg.addColorStop(1,darken(col,0.3));
  c.fillStyle=bg; c.fill(); c.strokeStyle=darken(col,0.25); c.lineWidth=1.4; c.stroke();
  c.shadowBlur = 0;
  // Neck
  c.fillStyle=darken(col,0.2); c.fillRect(-2.5,-38,5,25);
  c.strokeStyle=darken(col,0.3); c.lineWidth=0.6; c.strokeRect(-2.5,-38,5,25);
  // Scroll
  c.beginPath(); c.arc(0,-40,3.5,Math.PI,Math.PI*2.5); c.strokeStyle=darken(col,0.3); c.lineWidth=1.8; c.stroke();
  c.beginPath(); c.roundRect(-3.5,-42,7,5,1); c.fillStyle=darken(col,0.3); c.fill();
  // Pegs
  c.fillStyle='#b0b0c0';
  c.beginPath(); c.arc(-4.5,-40,0.9,0,TAU); c.fill(); c.beginPath(); c.arc(-4.5,-38,0.9,0,TAU); c.fill();
  c.beginPath(); c.arc(4.5,-40,0.9,0,TAU); c.fill(); c.beginPath(); c.arc(4.5,-38,0.9,0,TAU); c.fill();
  // F-holes
  c.strokeStyle='#080818'; c.lineWidth=1.2;
  c.beginPath(); c.moveTo(-4.5,6); c.quadraticCurveTo(-5.5,14,-3.5,20); c.stroke();
  c.beginPath(); c.moveTo(4.5,6); c.quadraticCurveTo(5.5,14,3.5,20); c.stroke();
  // Bridge
  c.fillStyle='#c0a878'; c.beginPath(); c.moveTo(-3,17); c.lineTo(0,14); c.lineTo(3,17); c.fill();
  // Tailpiece
  c.fillStyle=darken(col,0.4); c.beginPath(); c.roundRect(-2,22,4,8,1.5); c.fill();
  // Strings
  c.strokeStyle='rgba(255,255,255,0.25)'; c.lineWidth=0.35;
  c.beginPath(); for(let i=0;i<4;i++){const x=-1.5+i; c.moveTo(x*0.4,-38); c.lineTo(x,28);} c.stroke();
  // Chinrest
  c.fillStyle=darken(col,0.35); c.beginPath(); c.ellipse(7,30,3.5,2.5,0.3,0,TAU); c.fill();
  // Gloss
  c.beginPath(); c.ellipse(-4,10,3,10,-0.2,0,TAU); c.fillStyle='rgba(255,255,255,0.07)'; c.fill();
}

function drawTrumpet(c, col) {
  c.shadowBlur = 20; c.shadowColor = col;
  // Bell
  c.beginPath();
  c.moveTo(18,-4);
  c.quadraticCurveTo(30,-6,38,-20);
  c.lineTo(42,-24); c.lineTo(42,24);
  c.quadraticCurveTo(30,6,18,4);
  c.closePath();
  const bg = c.createLinearGradient(18,-24,42,24);
  bg.addColorStop(0,lighten(col,0.35)); bg.addColorStop(0.4,lighten(col,0.2)); bg.addColorStop(0.7,col); bg.addColorStop(1,darken(col,0.15));
  c.fillStyle = bg; c.fill(); c.strokeStyle=darken(col,0.2); c.lineWidth=1; c.stroke();
  // Bell opening
  c.beginPath(); c.ellipse(42,0,3,22,0,0,TAU); c.fillStyle='#0a0a18'; c.fill(); c.strokeStyle=lighten(col,0.15); c.lineWidth=0.8; c.stroke();
  c.shadowBlur = 0;
  // Main tube
  const tg = c.createLinearGradient(0,-3.5,0,3.5);
  tg.addColorStop(0,lighten(col,0.3)); tg.addColorStop(0.5,col); tg.addColorStop(1,darken(col,0.2));
  c.fillStyle=tg; c.beginPath(); c.roundRect(-34,-3.5,52,7,3); c.fill();
  c.strokeStyle=darken(col,0.2); c.lineWidth=0.5; c.stroke();
  // Mouthpiece
  c.beginPath(); c.moveTo(-34,-1.5); c.lineTo(-40,-0.8); c.lineTo(-40,0.8); c.lineTo(-34,1.5); c.fillStyle='#aaa'; c.fill();
  c.beginPath(); c.arc(-41,0,2,0,TAU); c.fillStyle='#888'; c.fill();
  // Valves
  for(let i=0;i<3;i++){const vx=-10+i*10;
    c.fillStyle='#d0d0e0'; c.beginPath(); c.roundRect(vx-2.5,-15,5,12,1.5); c.fill(); c.strokeStyle='#999'; c.lineWidth=0.4; c.stroke();
    c.beginPath(); c.arc(vx,-16,1.6,0,TAU); c.fillStyle=lighten(col,0.3); c.fill();
  }
  // Slide
  c.strokeStyle=col; c.lineWidth=2.2; c.lineCap='round';
  c.beginPath(); c.moveTo(-10,4); c.lineTo(-10,13); c.arc(0,13,10,Math.PI,0,true); c.lineTo(10,4); c.stroke();
  c.lineCap='butt';
  // Gloss
  c.fillStyle='rgba(255,255,255,0.07)'; c.fillRect(-30,-2.5,42,1.5);
}

const DRAW_FNS = [drawGuitar, drawDrum, drawSax, drawPiano, drawViolin, drawTrumpet];

/* ── Music note shape ──────────────────────────────────────────────── */
function drawNoteShape(ctx, x, y, size, rotation, color, alpha) {
  ctx.save();
  ctx.translate(x, y); ctx.rotate(rotation);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color; ctx.strokeStyle = color;
  ctx.shadowColor = color; ctx.shadowBlur = 8;
  const s = size;
  ctx.beginPath(); ctx.ellipse(-s*0.3, 0, s*0.7, s*0.5, -0.4, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.moveTo(s*0.35, 0); ctx.lineTo(s*0.35, -s*2.2); ctx.lineWidth = s*0.18; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(s*0.35, -s*2.2); ctx.bezierCurveTo(s*1.2,-s*1.9,s*1.4,-s*1.2,s*0.6,-s*0.8); ctx.lineWidth=s*0.18; ctx.stroke();
  ctx.restore();
}

/* ── Component ─────────────────────────────────────────────────────── */
const RockBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const profile = getPerformanceProfile();
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, profile.maxDpr);

    let W = window.innerWidth;
    let H = window.innerHeight;

    /* ── Sprite cache ── */
    const spriteCache = new Map();

    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = true;
      spriteCache.clear(); // Re-render sprites at new size
    };
    resize();
    window.addEventListener('resize', resize);

    function getSprite(type, colorIdx) {
      const key = `${type}-${colorIdx}`;
      if (spriteCache.has(key)) return spriteCache.get(key);
      const offscreen = document.createElement('canvas');
      offscreen.width = STOTAL * dpr;
      offscreen.height = STOTAL * dpr;
      const sc = offscreen.getContext('2d');
      sc.scale(dpr, dpr);
      sc.translate(STOTAL / 2, STOTAL / 2);
      DRAW_FNS[type](sc, PALETTE[colorIdx]);
      spriteCache.set(key, offscreen);
      return offscreen;
    }

    /* ── Drag state ── */
    let grabbed = null;
    let grabOffsetX = 0, grabOffsetY = 0;
    let lastClientX = 0, lastClientY = 0;
    let prevClientX = 0, prevClientY = 0;

    /* ── Instruments init ── */
    const instruments = [];
    const noteParticles = [];
    const sparks = [];
    const instCount = profile.lowPower ? 12 : 24;

    for (let i = 0; i < instCount; i++) {
      const type = i % 6;
      const colorIdx = i % PALETTE.length;
      const margin = 80;
      instruments.push({
        type,
        colorIdx,
        x: margin + Math.random() * Math.max(1, W - margin * 2),
        y: margin + Math.random() * Math.max(1, H - margin * 2),
        r: profile.lowPower ? 35 + Math.random() * 20 : 45 + Math.random() * 30, // Slightly smaller to fit more
        vx: (Math.random() - 0.5) * (profile.lowPower ? 3.0 : 4.5),
        vy: (Math.random() - 0.5) * (profile.lowPower ? 3.0 : 4.5),
        rotation: Math.random() * TAU,
        rotSpeed: (Math.random() - 0.5) * 0.008,
        pulse: Math.random() * TAU,
        alpha: 0.7 + Math.random() * 0.2,
        isDragging: false,
      });
    }

    /* ── Background stars ── */
    const bgStars = Array.from({ length: profile.lowPower ? 150 : 350 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.5, twinkle: Math.random() * TAU, speed: 0.02 + Math.random() * 0.04,
    }));

    /* ── Particle emitters ── */
    function emitNotes(x, y) {
      const count = profile.lowPower ? 3 : 5 + Math.floor(Math.random() * 4);
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * TAU;
        const speed = 1.5 + Math.random() * 4;
        noteParticles.push({
          x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
          size: 10 + Math.random() * 16, rotation: Math.random() * TAU,
          rotSpeed: (Math.random() - 0.5) * 0.2,
          color: NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)],
          life: 1, decay: 0.012 + Math.random() * 0.016, gravity: -0.04 - Math.random() * 0.04,
        });
      }
    }
    function emitSparks(x, y) {
      const count = profile.lowPower ? 6 : 14;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * TAU;
        const speed = 2 + Math.random() * 7;
        sparks.push({
          x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
          color: Math.random() > 0.5 ? '#ffffff' : '#ffd60a',
          life: 1, decay: 0.025 + Math.random() * 0.04,
        });
      }
    }

    /* ── Pointer interaction ── */
    function handlePointerDown(clientX, clientY, isTouch) {
      const pageX = clientX;
      const pageY = clientY;
      const grabRadius = isTouch ? 0.5 : 0.8;
      for (let i = instruments.length - 1; i >= 0; i--) {
        const inst = instruments[i];
        const dx = inst.x - pageX, dy = inst.y - pageY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < inst.r * grabRadius * 1.3) {
          grabbed = inst;
          grabOffsetX = dx; grabOffsetY = dy;
          lastClientX = clientX; lastClientY = clientY;
          prevClientX = clientX; prevClientY = clientY;
          inst.isDragging = true;
          inst.vx = 0; inst.vy = 0;
          instruments.splice(i, 1);
          instruments.push(inst);
          document.documentElement.classList.add('instrument-dragging');
          return true;
        }
      }
      return false;
    }
    function handlePointerMove(clientX, clientY) {
      prevClientX = lastClientX; prevClientY = lastClientY;
      lastClientX = clientX; lastClientY = clientY;
      if (grabbed) {
        grabbed.x = clientX + grabOffsetX;
        grabbed.y = clientY + grabOffsetY;
      }
    }
    function handlePointerUp() {
      if (grabbed) {
        const fling = 0.5;
        grabbed.vx = (lastClientX - prevClientX) * fling;
        grabbed.vy = (lastClientY - prevClientY) * fling;
        const maxV = 10;
        grabbed.vx = Math.max(-maxV, Math.min(maxV, grabbed.vx));
        grabbed.vy = Math.max(-maxV, Math.min(maxV, grabbed.vy));
        grabbed.isDragging = false;
        grabbed = null;
        document.documentElement.classList.remove('instrument-dragging');
      }
    }

    const onMouseDown = (e) => {
      if (e.button !== 0) return;
      if (e.target.closest('a, button, input, select, textarea, [role="button"], nav')) return;
      handlePointerDown(e.clientX, e.clientY, false);
    };
    const onMouseMove = (e) => { handlePointerMove(e.clientX, e.clientY); };
    const onMouseUp = () => { handlePointerUp(); };
    const onTouchStart = (e) => {
      if (e.touches.length !== 1) return;
      if (e.target.closest('a, button, input, select, textarea, [role="button"], nav')) return;
      handlePointerDown(e.touches[0].clientX, e.touches[0].clientY, true);
    };
    const onTouchMove = (e) => {
      if (grabbed) e.preventDefault();
      if (e.touches.length !== 1) return;
      handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onTouchEnd = () => { handlePointerUp(); };

    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);

    /* ── Visibility tracking ── */
    let isVisible = !document.hidden;
    const onVisibility = () => { isVisible = !document.hidden; };
    document.addEventListener('visibilitychange', onVisibility);

    /* ── Animation loop ── */
    let animId;
    let lastFrame = 0;
    let tick = 0;
    const frameInterval = profile.backgroundFps > 0 ? 1000 / profile.backgroundFps : Infinity;

    function drawBackground() {
      const isLightMode = document.documentElement.getAttribute('data-theme') === 'light';

      const bg = ctx.createLinearGradient(0, 0, 0, H);
      if (isLightMode) {
        bg.addColorStop(0, '#fffdf7'); bg.addColorStop(0.5, '#fefcfa'); bg.addColorStop(1, '#fdfaf2');
      } else {
        bg.addColorStop(0, '#000008'); bg.addColorStop(0.5, '#080012'); bg.addColorStop(1, '#020008');
      }
      
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

      const starRGB = isLightMode ? '200,200,210' : '255,255,255'; // Darker stars in light mode
      bgStars.forEach(s => {
        s.twinkle += s.speed;
        const a = 0.3 + 0.5 * Math.abs(Math.sin(s.twinkle));
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, TAU);
        ctx.fillStyle = `rgba(${starRGB},${a.toFixed(2)})`; ctx.fill();
      });

      // Stage lights
      [{ x: W * 0.15, color: 'rgba(232,93,4,' }, { x: W * 0.5, color: 'rgba(120,40,200,' }, { x: W * 0.82, color: 'rgba(0,180,200,' }].forEach(b => {
        const lg = ctx.createLinearGradient(b.x, 0, b.x + 80, H * 0.8);
        const opacity = isLightMode ? '0.05)' : '0.1)';
        lg.addColorStop(0, b.color + opacity); lg.addColorStop(1, b.color + '0)');
        ctx.beginPath();
        ctx.moveTo(b.x - 5, 0); ctx.lineTo(b.x + 160, H * 0.8); ctx.lineTo(b.x + 80, H * 0.8); ctx.lineTo(b.x + 5, 0);
        ctx.fillStyle = lg; ctx.fill();
      });
    }

    function loop(timestamp) {
      animId = requestAnimationFrame(loop);
      if (!isVisible) return;
      if (timestamp - lastFrame < frameInterval) return;
      lastFrame = timestamp - ((timestamp - lastFrame) % frameInterval);
      tick++;

      ctx.clearRect(0, 0, W, H);
      drawBackground();

      /* ── Physics ── */
      instruments.forEach(inst => {
        if (inst.isDragging) {
          inst.pulse += 0.04;
          return;
        }
        inst.x += inst.vx; inst.y += inst.vy;
        inst.rotation += inst.rotSpeed;
        inst.pulse += 0.04;
        
        // Maintain continuous motion
        const speed = Math.sqrt(inst.vx * inst.vx + inst.vy * inst.vy);
        const minSpeed = profile.lowPower ? 1.5 : 2.5;
        if (speed < minSpeed && speed > 0) {
            const scale = minSpeed / speed;
            inst.vx *= scale;
            inst.vy *= scale;
        } else if (speed > 10) {
            inst.vx *= 0.98;
            inst.vy *= 0.98;
        }
        // Boundary bounce
        if (inst.x < inst.r) { inst.x = inst.r; inst.vx = Math.abs(inst.vx) * 0.9; }
        if (inst.x > W - inst.r) { inst.x = W - inst.r; inst.vx = -Math.abs(inst.vx) * 0.9; }
        if (inst.y < inst.r) { inst.y = inst.r; inst.vy = Math.abs(inst.vy) * 0.9; }
        if (inst.y > H - inst.r) { inst.y = H - inst.r; inst.vy = -Math.abs(inst.vy) * 0.9; }
      });

      /* ── Collisions ── */
      for (let i = 0; i < instruments.length; i++) {
        for (let j = i + 1; j < instruments.length; j++) {
          const a = instruments[i], b = instruments[j];
          const dx = b.x - a.x, dy = b.y - a.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          const minD = a.r + b.r - 8;
          if (d < minD && d > 0) {
            const nx = dx / d, ny = dy / d;
            const relV = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;
            if (relV > 0 || a.isDragging || b.isDragging) {
              const impulse = Math.max(relV, 1.5) * 1.1;
              const dragMult = (a.isDragging || b.isDragging) ? 2.5 : 1;
              if (!a.isDragging) { a.vx -= impulse * nx * dragMult; a.vy -= impulse * ny * dragMult; }
              if (!b.isDragging) { b.vx += impulse * nx * dragMult; b.vy += impulse * ny * dragMult; }
              const overlap = minD - d;
              if (!a.isDragging && !b.isDragging) {
                a.x -= nx * overlap * 0.5; a.y -= ny * overlap * 0.5;
                b.x += nx * overlap * 0.5; b.y += ny * overlap * 0.5;
              } else {
                const target = a.isDragging ? b : a;
                const sign = a.isDragging ? 1 : -1;
                target.x += sign * nx * overlap; target.y += sign * ny * overlap;
              }
              const mx = (a.x + b.x) * 0.5, my = (a.y + b.y) * 0.5;
              emitNotes(mx, my);
              emitSparks(mx, my);
            }
          }
        }
      }

      /* ── Draw instruments ── */
      instruments.forEach(inst => {
        const pulse = 1 + Math.sin(inst.pulse) * 0.05;
        const drawR = inst.r * pulse;
        const scale = drawR / BODY;
        const isDrag = inst.isDragging;

        // Glow halo
        ctx.save();
        ctx.globalAlpha = isDrag ? 0.22 : 0.12;
        ctx.beginPath(); ctx.arc(inst.x, inst.y, drawR * 0.9, 0, TAU);
        ctx.fillStyle = PALETTE[inst.colorIdx];
        ctx.shadowColor = PALETTE[inst.colorIdx];
        ctx.shadowBlur = isDrag ? 50 : (profile.lowPower ? 20 : 38);
        ctx.fill();
        ctx.restore();

        // Sprite
        const sprite = getSprite(inst.type, inst.colorIdx);
        ctx.save();
        ctx.translate(inst.x, inst.y);
        ctx.rotate(inst.rotation);
        const finalScale = scale * (isDrag ? 1.12 : 1.0);
        ctx.scale(finalScale, finalScale);
        ctx.globalAlpha = isDrag ? 0.95 : inst.alpha;
        if (isDrag) { ctx.shadowBlur = 30; ctx.shadowColor = PALETTE[inst.colorIdx]; }
        ctx.drawImage(sprite, -STOTAL / 2, -STOTAL / 2, STOTAL, STOTAL);
        ctx.restore();
      });

      /* ── Note particles ── */
      for (let i = noteParticles.length - 1; i >= 0; i--) {
        const n = noteParticles[i];
        n.x += n.vx; n.y += n.vy; n.vy += n.gravity; n.vx *= 0.97;
        n.rotation += n.rotSpeed; n.life -= n.decay;
        if (n.life <= 0) { noteParticles.splice(i, 1); continue; }
        const sf = n.life > 0.7 ? (1 - n.life) * 3.3 : n.life * 1.3;
        drawNoteShape(ctx, n.x, n.y, n.size * Math.min(1, sf + 0.3), n.rotation, n.color, Math.max(0, n.life));
      }

      /* ── Spark streaks ── */
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx; s.y += s.vy; s.vx *= 0.93; s.vy *= 0.93; s.vy += 0.06;
        s.life -= s.decay;
        if (s.life <= 0) { sparks.splice(i, 1); continue; }
        ctx.save();
        ctx.globalAlpha = s.life * s.life;
        ctx.strokeStyle = s.color; ctx.shadowColor = s.color; ctx.shadowBlur = 6; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(s.x - s.vx * 6, s.y - s.vy * 6); ctx.stroke();
        ctx.restore();
      }

      /* ── Ambient floating notes ── */
      const ambInterval = profile.lowPower ? 160 : 100;
      if (tick % ambInterval === 0) {
        const count = profile.lowPower ? 1 : 2;
        for (let i = 0; i < count; i++) {
          noteParticles.push({
            x: Math.random() * W, y: H + 20,
            vx: (Math.random() - 0.5) * 0.6, vy: -(0.6 + Math.random() * 0.8),
            size: 18 + Math.random() * 22, rotation: Math.random() * TAU,
            rotSpeed: (Math.random() - 0.5) * 0.008,
            color: NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)],
            life: 1, decay: 0.003 + Math.random() * 0.004, gravity: 0,
          });
        }
      }
    }

    /* ── Start ── */
    if (profile.reducedMotion) {
      drawBackground();
      instruments.slice(0, 3).forEach(inst => {
        const sprite = getSprite(inst.type, inst.colorIdx);
        ctx.save(); ctx.translate(inst.x, inst.y); ctx.rotate(inst.rotation);
        const s = inst.r / BODY;
        ctx.scale(s, s); ctx.globalAlpha = 0.45;
        ctx.drawImage(sprite, -STOTAL/2, -STOTAL/2, STOTAL, STOTAL);
        ctx.restore();
      });
    } else {
      animId = requestAnimationFrame(loop);
    }

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      document.removeEventListener('visibilitychange', onVisibility);
      if (animId) cancelAnimationFrame(animId);
      document.documentElement.classList.remove('instrument-dragging');
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '100%', height: '100%',
          zIndex: -1,
          pointerEvents: 'none',
        }}
      />
      <style>{`
        html.instrument-dragging,
        html.instrument-dragging * {
          cursor: grabbing !important;
        }
      `}</style>
    </>
  );
};

export default RockBackground;
