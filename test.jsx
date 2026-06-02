import { useRef, useEffect } from "react";

export const DiabetesViz = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationId;
    let startTime = null;

    // Particle pools
    let candies = [];
    let sugarSparkles = [];
    let glucoseHistory = [];
    let lastSample = 0;

    const LOOP = 8200;
    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
    const eio = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

    const init = () => {
      canvas.width = canvas.parentElement?.clientWidth || 620;
      canvas.height = canvas.parentElement?.clientHeight || 390;
    };
    init();
    window.addEventListener("resize", init);

    const render = (ts) => {
      if (!startTime) startTime = ts;
      const timeS = ((ts - startTime) % LOOP) / LOOP * 8.2;
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // ── TIMELINE ──────────────────────────────────────────────────────────
      const eatF = clamp(timeS / 5.5, 0, 1);
      const bellyGrow = eatF * 24;
      const blush = eatF;
      const eyeDroop = eatF > 0.72 ? (eatF - 0.72) / 0.28 : 0;
      const sweating = eatF > 0.54;
      const armPhase = timeS < 5.5 ? Math.sin(timeS * Math.PI * 2.15) : -1;
      const armUp = armPhase > 0.18;
      const isOut = timeS >= 5.5;
      const glucose = isOut ? 468 : 88 + eatF * 382;
      let fallAngle = 0;
      if (isOut) {
        const ft = clamp((timeS - 5.5) / 2.3, 0, 1);
        if (ft < 0.42) fallAngle = eio(ft / 0.42) * (Math.PI / 4);
        else if (ft < 0.62) fallAngle = Math.PI / 4 - Math.sin(((ft - 0.42) / 0.2) * Math.PI) * 0.11;
        else fallAngle = Math.PI / 4 + Math.sin(ft * 9) * 0.005;
      }
      if (ts - lastSample > 95) {
        glucoseHistory.push(glucose);
        if (glucoseHistory.length > 58) glucoseHistory.shift();
        lastSample = ts;
      }
      const tvFlk = 0.93 + Math.sin(ts * 0.071) * 0.04 + (Math.random() > 0.982 ? 0.13 : 0);
      const floorY = H * 0.73;

      // ── CEILING ────────────────────────────────────────────────────────────
      ctx.fillStyle = "#d6d2de"; ctx.fillRect(0, 0, W, H * 0.1);
      ctx.fillStyle = "#e8e4f0"; ctx.fillRect(0, H * 0.1 - 4, W, 7);
      ctx.fillStyle = "#b4b0c2"; ctx.fillRect(0, H * 0.1 + 3, W, 2);
      // Ceiling light fixture
      const lfX = W * 0.5;
      ctx.fillStyle = "#c8c4d0"; ctx.beginPath(); ctx.arc(lfX, H * 0.06, 18, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#f8f8e8"; ctx.beginPath(); ctx.arc(lfX, H * 0.06, 12, 0, Math.PI * 2); ctx.fill();
      const ceilGlow = ctx.createRadialGradient(lfX, H * 0.06, 5, lfX, H * 0.06, W * 0.3);
      ceilGlow.addColorStop(0, "rgba(255,245,200,0.22)"); ceilGlow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = ceilGlow; ctx.fillRect(0, 0, W, H * 0.35);

      // ── WALL ───────────────────────────────────────────────────────────────
      const wallG = ctx.createLinearGradient(0, H * 0.1, 0, floorY);
      wallG.addColorStop(0, "#ccc8d8"); wallG.addColorStop(1, "#908898");
      ctx.fillStyle = wallG; ctx.fillRect(0, H * 0.1, W, floorY - H * 0.1);
      // Subtle wall texture — faint horizontal brush strokes
      ctx.strokeStyle = "rgba(255,255,255,0.04)"; ctx.lineWidth = 1;
      for (let wy = H * 0.12; wy < floorY; wy += 8) {
        ctx.beginPath(); ctx.moveTo(0, wy + Math.sin(wy * 0.3) * 1.5); ctx.lineTo(W, wy + Math.cos(wy * 0.2) * 1.5); ctx.stroke();
      }
      // Baseboard
      ctx.fillStyle = "#e8e4f0"; ctx.fillRect(0, floorY - 9, W, 9);
      ctx.fillStyle = "rgba(0,0,0,0.1)"; ctx.fillRect(0, floorY - 9, W, 1.5);

      // ── FLOOR ──────────────────────────────────────────────────────────────
      const flG = ctx.createLinearGradient(0, floorY, 0, H);
      flG.addColorStop(0, "#7c5c3a"); flG.addColorStop(0.5, "#5e3e24"); flG.addColorStop(1, "#3c2216");
      ctx.fillStyle = flG; ctx.fillRect(0, floorY, W, H - floorY);
      ctx.save(); ctx.beginPath(); ctx.rect(0, floorY, W, H - floorY); ctx.clip();
      // Plank row lines
      ctx.strokeStyle = "rgba(0,0,0,0.2)"; ctx.lineWidth = 1.1;
      for (let r = 0; r < 9; r++) {
        const py = floorY + r * 13 + 4;
        ctx.beginPath(); ctx.moveTo(0, py); ctx.lineTo(W, py + 5); ctx.stroke();
      }
      // Plank end-joints
      ctx.strokeStyle = "rgba(0,0,0,0.09)"; ctx.lineWidth = 0.6;
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 5; c++) {
          const px = (c * W / 3.8 + r * W / 8.5) % W;
          const py = floorY + r * 13;
          ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + 1.5, py + 13); ctx.stroke();
        }
      }
      // Plank highlight (sheen)
      ctx.strokeStyle = "rgba(255,220,160,0.07)"; ctx.lineWidth = 2;
      for (let r = 0; r < 9; r++) {
        const py = floorY + r * 13 + 1.5;
        ctx.beginPath(); ctx.moveTo(0, py); ctx.lineTo(W, py + 5); ctx.stroke();
      }
      // TV glow on floor
      const ftvG = ctx.createRadialGradient(W * 0.77, floorY + 3, 6, W * 0.77, floorY + 45, W * 0.36);
      ftvG.addColorStop(0, `rgba(80,165,255,${0.17 * tvFlk})`); ftvG.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = ftvG; ctx.fillRect(0, floorY, W, H - floorY);
      // Lamp warm pool on floor
      const flampG = ctx.createRadialGradient(W * 0.54, floorY + 5, 4, W * 0.54, floorY + 50, W * 0.22);
      flampG.addColorStop(0, "rgba(255,210,110,0.18)"); flampG.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = flampG; ctx.fillRect(0, floorY, W, H - floorY);
      ctx.restore();

      // ── WINDOW ─────────────────────────────────────────────────────────────
      const wX = W * 0.06, wY = H * 0.15, wW = W * 0.19, wH = H * 0.32;
      // Light beam
      ctx.save();
      const bmG = ctx.createLinearGradient(wX + wW * 0.5, wY + wH, wX + wW + W * 0.1, floorY);
      bmG.addColorStop(0, "rgba(255,248,188,0.17)"); bmG.addColorStop(1, "rgba(255,248,188,0)");
      ctx.fillStyle = bmG;
      ctx.beginPath(); ctx.moveTo(wX, wY + wH); ctx.lineTo(wX + wW, wY + wH);
      ctx.lineTo(wX + wW + W * 0.24, floorY); ctx.lineTo(wX - W * 0.04, floorY); ctx.fill();
      ctx.restore();
      // Frame
      ctx.fillStyle = "#f0ece2"; ctx.fillRect(wX - 7, wY - 7, wW + 14, wH + 14);
      ctx.fillStyle = "#ddd8cc"; ctx.fillRect(wX - 3, wY - 3, wW + 6, wH + 6);
      // Sky
      const skyG = ctx.createLinearGradient(wX, wY, wX, wY + wH);
      skyG.addColorStop(0, "#3a8ec0"); skyG.addColorStop(1, "#8ed0ec");
      ctx.fillStyle = skyG; ctx.fillRect(wX, wY, wW, wH);
      ctx.save(); ctx.beginPath(); ctx.rect(wX, wY, wW, wH); ctx.clip();
      // Clouds
      const cl = (ts * 0.012) % (wW + 70) - 35;
      const drawCloud = (cx2, cy2, s) => {
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.beginPath(); ctx.arc(cx2, cy2, s, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx2 + s * 0.88, cy2 - s * 0.3, s * 0.72, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx2 + s * 1.72, cy2 + s * 0.08, s * 0.58, 0, Math.PI * 2); ctx.fill();
      };
      drawCloud(wX + cl, wY + wH * 0.2, 9); drawCloud(wX + cl + wW * 0.6, wY + wH * 0.12, 6);
      // City silhouette
      const bldgs = [[0, 0.52, 0.2, 0.48], [0.22, 0.44, 0.15, 0.56], [0.38, 0.62, 0.11, 0.38], [0.52, 0.38, 0.22, 0.62], [0.76, 0.5, 0.24, 0.5]];
      ctx.fillStyle = "rgba(45,60,85,0.42)";
      bldgs.forEach(([bx, by, bw, bh]) => ctx.fillRect(wX + bx * wW, wY + by * wH, bw * wW, bh * wH));
      ctx.fillStyle = "rgba(255,240,150,0.55)";
      bldgs.forEach(([bx, by, bw]) => {
        for (let r = 0; r < 3; r++) for (let c = 0; c < 2; c++) {
          if ((r + c + Math.floor(bx * 10)) % 3 !== 0)
            ctx.fillRect(wX + bx * wW + c * bw * wW * 0.36 + 2, wY + by * wH + r * 8 + 3, bw * wW * 0.2, 4);
        }
      });
      ctx.restore();
      // Partial blinds
      ctx.strokeStyle = "rgba(195,185,155,0.5)"; ctx.lineWidth = 1;
      for (let b = 0; b < 7; b++) {
        const by = wY + (b / 7) * wH * 0.4;
        ctx.beginPath(); ctx.moveTo(wX, by); ctx.lineTo(wX + wW, by + 2); ctx.stroke();
      }
      // Panes
      ctx.fillStyle = "#f0ece0";
      ctx.fillRect(wX + wW / 2 - 2.5, wY, 5, wH);
      ctx.fillRect(wX, wY + wH / 2 - 2.5, wW, 5);
      // Sill
      ctx.fillStyle = "#e2dcd0"; ctx.fillRect(wX - 10, wY + wH, wW + 20, 10);
      // Plant on sill
      ctx.fillStyle = "#8a5a2a"; ctx.fillRect(wX + wW * 0.55, wY + wH - 12, 18, 14);
      ctx.fillStyle = "#2a7a30";
      for (let l = 0; l < 4; l++) {
        ctx.beginPath(); ctx.ellipse(wX + wW * 0.64 + Math.sin(l * 1.3) * 8, wY + wH - 14 - l * 5, 7, 4, Math.sin(l * 0.8) * 0.8, 0, Math.PI * 2); ctx.fill();
      }
      // Curtains
      const doCurtain = (cx2, flip) => {
        ctx.fillStyle = "#780018";
        ctx.beginPath(); ctx.moveTo(cx2, wY - 10);
        ctx.bezierCurveTo(cx2 + (flip ? 30 : -30), wY + wH * 0.3, cx2 + (flip ? -6 : 6), wY + wH * 0.5, cx2 + (flip ? -3 : 3), wY + wH + 20);
        ctx.lineTo(cx2 + (flip ? -22 : 22), wY + wH + 20); ctx.lineTo(cx2 + (flip ? -22 : 22), wY - 10); ctx.closePath(); ctx.fill();
        ctx.fillStyle = "rgba(255,70,70,0.1)";
        ctx.beginPath(); ctx.moveTo(cx2 + (flip ? 7 : -7), wY - 10);
        ctx.bezierCurveTo(cx2 + (flip ? 19 : -19), wY + wH * 0.26, cx2 + (flip ? -1 : 1), wY + wH * 0.5, cx2 + (flip ? -2 : 2), wY + wH);
        ctx.lineTo(cx2 + (flip ? -7 : 7), wY + wH); ctx.closePath(); ctx.fill();
      };
      doCurtain(wX - 7, false); doCurtain(wX + wW + 7, true);
      // Rod + finials
      ctx.fillStyle = "#c8a028"; ctx.beginPath(); ctx.roundRect(wX - 28, wY - 15, wW + 56, 5, 2); ctx.fill();
      ctx.beginPath(); ctx.arc(wX - 28, wY - 12, 7, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(wX + wW + 28, wY - 12, 7, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#e8c040";
      ctx.beginPath(); ctx.arc(wX - 28, wY - 12, 4, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(wX + wW + 28, wY - 12, 4, 0, Math.PI * 2); ctx.fill();

      // ── WALL ART & DECOR ───────────────────────────────────────────────────
      // Framed painting
      const pfX = W * 0.34, pfY = H * 0.13, pfW = W * 0.1, pfH = H * 0.15;
      ctx.fillStyle = "#3a2006"; ctx.fillRect(pfX - 5, pfY - 5, pfW + 10, pfH + 10);
      ctx.fillStyle = "rgba(0,0,0,0.18)"; ctx.fillRect(pfX - 3, pfY - 3, pfW + 6, pfH + 6);
      ctx.fillStyle = "#c4d8ec"; ctx.fillRect(pfX, pfY, pfW, pfH);
      ctx.save(); ctx.beginPath(); ctx.rect(pfX, pfY, pfW, pfH); ctx.clip();
      // Abstract shapes inside frame
      const pg = ctx.createLinearGradient(pfX, pfY, pfX + pfW, pfY + pfH);
      pg.addColorStop(0, "#c0d8ec"); pg.addColorStop(1, "#90b0cc");
      ctx.fillStyle = pg; ctx.fillRect(pfX, pfY, pfW, pfH);
      ctx.fillStyle = "rgba(175,55,48,0.68)";
      ctx.beginPath(); ctx.ellipse(pfX + pfW * 0.38, pfY + pfH * 0.52, pfW * 0.24, pfH * 0.38, 0.28, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(230,195,28,0.6)";
      ctx.beginPath(); ctx.ellipse(pfX + pfW * 0.68, pfY + pfH * 0.3, pfW * 0.16, pfH * 0.22, -0.42, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(50,120,180,0.4)";
      ctx.beginPath(); ctx.ellipse(pfX + pfW * 0.22, pfY + pfH * 0.7, pfW * 0.12, pfH * 0.18, 0.8, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      ctx.strokeStyle = "rgba(255,255,255,0.6)"; ctx.lineWidth = 1;
      ctx.strokeRect(pfX + 3, pfY + 3, pfW - 6, pfH - 6);

      // Shelf
      const shX = W * 0.34, shY = H * 0.32;
      ctx.fillStyle = "#6a4020"; ctx.fillRect(shX - 4, shY, W * 0.12 + 8, 7);
      ctx.fillStyle = "rgba(0,0,0,0.2)"; ctx.fillRect(shX - 4, shY + 7, W * 0.12 + 8, 2);
      // Books on shelf
      const bookColors = ["#8b2a2a","#2a5a8b","#2a7a3a","#8b7a2a","#6a2a8b"];
      bookColors.forEach((col, bi) => {
        const bx = shX + bi * (W * 0.022);
        ctx.fillStyle = col; ctx.fillRect(bx, shY - H * 0.065, W * 0.018, H * 0.065);
        ctx.fillStyle = "rgba(255,255,255,0.12)"; ctx.fillRect(bx, shY - H * 0.065, 2, H * 0.065);
      });

      // ── FLOOR LAMP ──────────────────────────────────────────────────────────
      const lX = W * 0.55, lBase = floorY;
      ctx.fillStyle = "#2c1a0c"; ctx.fillRect(lX - 3, lBase - H * 0.31, 6, H * 0.31);
      ctx.fillRect(lX - 14, lBase - 5, 28, 7); ctx.fillRect(lX - 22, lBase - 2, 44, 5);
      // Shade
      ctx.fillStyle = "#f5e4c0";
      ctx.beginPath(); ctx.moveTo(lX - 25, lBase - H * 0.31 - 2); ctx.lineTo(lX + 25, lBase - H * 0.31 - 2);
      ctx.lineTo(lX + 16, lBase - H * 0.22); ctx.lineTo(lX - 16, lBase - H * 0.22); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "#c8a055"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(lX - 25, lBase - H * 0.31 - 2); ctx.lineTo(lX - 16, lBase - H * 0.22); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(lX + 25, lBase - H * 0.31 - 2); ctx.lineTo(lX + 16, lBase - H * 0.22); ctx.stroke();
      ctx.fillStyle = "rgba(255,230,150,0.75)"; ctx.beginPath(); ctx.arc(lX, lBase - H * 0.29, 5, 0, Math.PI * 2); ctx.fill();
      // Lamp glow
      const lmpGlow = ctx.createRadialGradient(lX, lBase - H * 0.27, 4, lX, lBase - H * 0.22, W * 0.33);
      lmpGlow.addColorStop(0, "rgba(255,218,120,0.32)"); lmpGlow.addColorStop(0.38, "rgba(255,200,95,0.1)"); lmpGlow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = lmpGlow; ctx.fillRect(0, 0, W, H);

      // ── SIDE TABLE ──────────────────────────────────────────────────────────
      const stX = W * 0.55, stY = floorY - H * 0.145, stW = W * 0.09;
      ctx.fillStyle = "#5a3215"; ctx.fillRect(stX, stY, stW, H * 0.145);
      ctx.fillStyle = "#7a4822"; ctx.fillRect(stX - 5, stY, stW + 10, H * 0.013);
      // Soda can
      const cX2 = stX + stW * 0.22, cY2 = stY - H * 0.068, cW2 = stW * 0.28, cH2 = H * 0.068;
      const canBodyG = ctx.createLinearGradient(cX2, cY2, cX2 + cW2, cY2);
      canBodyG.addColorStop(0, "#c8101e"); canBodyG.addColorStop(0.4, "#e81022"); canBodyG.addColorStop(1, "#9a0c18");
      ctx.fillStyle = canBodyG; ctx.beginPath(); ctx.roundRect(cX2, cY2, cW2, cH2, 2); ctx.fill();
      ctx.fillStyle = "#c0c4c8";
      ctx.beginPath(); ctx.ellipse(cX2 + cW2 / 2, cY2, cW2 / 2, cH2 * 0.13, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cX2 + cW2 / 2, cY2 + cH2, cW2 / 2, cH2 * 0.13, 0, 0, Math.PI * 2); ctx.fill();
      // Can tab
      ctx.fillStyle = "#a8aaac"; ctx.fillRect(cX2 + cW2 * 0.35, cY2 - 3, cW2 * 0.3, 4);
      // Label
      ctx.fillStyle = "#fff"; ctx.font = `bold ${H * 0.018}px Arial`; ctx.textAlign = "center";
      ctx.fillText("COLA", cX2 + cW2 / 2, cY2 + cH2 * 0.56);
      // Condensation
      ctx.fillStyle = "rgba(190,220,255,0.45)";
      for (let d = 0; d < 6; d++) ctx.beginPath(), ctx.arc(cX2 + 2 + d * (cW2 / 5.5), cY2 + cH2 * 0.28 + Math.sin(d * 1.2) * cH2 * 0.16, 1, 0, Math.PI * 2), ctx.fill();
      // Can shine
      ctx.fillStyle = "rgba(255,255,255,0.22)";
      ctx.beginPath(); ctx.moveTo(cX2 + cW2 * 0.12, cY2 + cH2 * 0.06); ctx.lineTo(cX2 + cW2 * 0.26, cY2 + cH2 * 0.06);
      ctx.lineTo(cX2 + cW2 * 0.22, cY2 + cH2 * 0.9); ctx.lineTo(cX2 + cW2 * 0.08, cY2 + cH2 * 0.9); ctx.closePath(); ctx.fill();
      ctx.textAlign = "left";

      // ── TV ─────────────────────────────────────────────────────────────────
      const tvX = W * 0.63, tvY2 = H * 0.1, tvW = W * 0.3, tvH = H * 0.38;
      // TV glow ambient
      const tvGlwG = ctx.createRadialGradient(tvX + tvW / 2, tvY2 + tvH / 2, 8, tvX + tvW / 2, tvY2 + tvH / 2, W * 0.46);
      tvGlwG.addColorStop(0, `rgba(86,178,255,${0.26 * tvFlk})`); tvGlwG.addColorStop(1, "rgba(86,178,255,0)");
      ctx.fillStyle = tvGlwG; ctx.fillRect(0, 0, W, H);
      // Body shadow
      ctx.save(); ctx.filter = "blur(12px)";
      ctx.fillStyle = "rgba(0,0,0,0.42)"; ctx.fillRect(tvX + 9, tvY2 + 9, tvW, tvH + 18);
      ctx.filter = "none"; ctx.restore();
      // Body
      const tvBG = ctx.createLinearGradient(tvX, tvY2, tvX + tvW, tvY2 + tvH);
      tvBG.addColorStop(0, "#2c2c38"); tvBG.addColorStop(0.5, "#0c0c14"); tvBG.addColorStop(1, "#2a2a36");
      ctx.fillStyle = tvBG; ctx.beginPath(); ctx.roundRect(tvX, tvY2, tvW, tvH, 10); ctx.fill();
      // Bezel rim
      ctx.strokeStyle = "rgba(255,255,255,0.07)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.roundRect(tvX + 1, tvY2 + 1, tvW - 2, tvH - 2, 9); ctx.stroke();
      // Screen content
      ctx.save(); ctx.beginPath(); ctx.roundRect(tvX + 8, tvY2 + 8, tvW - 16, tvH - 18, 5); ctx.clip();
      const scrG = ctx.createLinearGradient(tvX, tvY2, tvX, tvY2 + tvH);
      scrG.addColorStop(0, "#7ac8f5"); scrG.addColorStop(0.55, "#b0e4ff"); scrG.addColorStop(1, "#488e44");
      ctx.fillStyle = scrG; ctx.fillRect(tvX, tvY2, tvW, tvH);
      // Sun with rays
      const sX = tvX + tvW * 0.15, sY = tvY2 + tvH * 0.2;
      const sunG = ctx.createRadialGradient(sX, sY, 2, sX, sY, tvH * 0.16);
      sunG.addColorStop(0, "#ffe880"); sunG.addColorStop(0.55, "#ffcc28"); sunG.addColorStop(1, "rgba(255,180,0,0)");
      ctx.fillStyle = sunG; ctx.beginPath(); ctx.arc(sX, sY, tvH * 0.16, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#ffe050"; ctx.beginPath(); ctx.arc(sX, sY, tvH * 0.09, 0, Math.PI * 2); ctx.fill();
      // Rolling hills (2 layers)
      const hs = (ts * 0.013) % tvW;
      [["#58b84a", 0], ["#3c9830", 1]].forEach(([col, lay]) => {
        ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(tvX - hs, tvY2 + tvH);
        for (let px = -tvW; px < tvW * 2; px += 7)
          ctx.lineTo(tvX + px - hs, tvY2 + tvH * 0.58 + Math.sin((px + lay * 28) * 0.04) * tvH * 0.11 + lay * tvH * 0.07);
        ctx.lineTo(tvX + tvW * 2, tvY2 + tvH); ctx.closePath(); ctx.fill();
      });
      // Trees scrolling
      const tScr = (ts * 0.096) % (tvW * 2.2);
      for (let ti = 0; ti < 9; ti++) {
        const tx = tvX + (ti * tvW / 3.1) - tScr % (tvW * 2.2);
        if (tx > tvX - 22 && tx < tvX + tvW + 22) {
          const sw = Math.sin(ts * 0.005 + ti * 1.35) * 2.4;
          ctx.fillStyle = "#5c3c22"; ctx.fillRect(tx + 3, tvY2 + tvH * 0.44, 4, tvH * 0.18);
          ctx.fillStyle = ti % 2 === 0 ? "#175e28" : "#1e7830";
          ctx.beginPath(); ctx.ellipse(tx + 5 + sw, tvY2 + tvH * 0.36, tvW * 0.058, tvH * 0.15, 0.07 * sw, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = "rgba(98,195,78,0.32)";
          ctx.beginPath(); ctx.arc(tx + 1 + sw, tvY2 + tvH * 0.3, tvW * 0.028, 0, Math.PI * 2); ctx.fill();
        }
      }
      // Horse
      const gp = ts * 0.027;
      const hbX = tvX + tvW * 0.52, hbY = tvY2 + tvH * 0.65 + Math.sin(gp) * 2.4;
      // Shadow
      ctx.fillStyle = "rgba(0,0,0,0.22)"; ctx.beginPath(); ctx.ellipse(hbX + 8, hbY + 18, 21, 3.5, 0, 0, Math.PI * 2); ctx.fill();
      // Body
      const hBG = ctx.createLinearGradient(hbX - 14, hbY - 9, hbX + 24, hbY + 10);
      hBG.addColorStop(0, "#8e6040"); hBG.addColorStop(1, "#4c2a14");
      ctx.fillStyle = hBG; ctx.beginPath(); ctx.ellipse(hbX + 8, hbY, 19, 9.5, -0.05, 0, Math.PI * 2); ctx.fill();
      // Head
      ctx.fillStyle = "#7c5030";
      ctx.beginPath(); ctx.moveTo(hbX + 20, hbY - 2); ctx.quadraticCurveTo(hbX + 23, hbY - 13, hbX + 31, hbY - 16);
      ctx.quadraticCurveTo(hbX + 37, hbY - 13, hbX + 36, hbY - 6); ctx.quadraticCurveTo(hbX + 32, hbY - 2, hbX + 27, hbY - 2);
      ctx.quadraticCurveTo(hbX + 24, hbY + 4, hbX + 20, hbY + 6); ctx.fill();
      // Nostril
      ctx.fillStyle = "#1a0808"; ctx.beginPath(); ctx.ellipse(hbX + 35, hbY - 6, 1.5, 1, 0, 0, Math.PI * 2); ctx.fill();
      // Eye
      ctx.fillStyle = "#0a0a0a"; ctx.beginPath(); ctx.arc(hbX + 33, hbY - 11, 1.8, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(hbX + 34, hbY - 12, 0.8, 0, Math.PI * 2); ctx.fill();
      // Mane
      ctx.fillStyle = "#1e0808";
      ctx.beginPath(); ctx.moveTo(hbX + 24, hbY - 13); ctx.quadraticCurveTo(hbX + 18, hbY - 9, hbX + 18, hbY);
      ctx.quadraticCurveTo(hbX + 21, hbY - 3, hbX + 24, hbY - 13); ctx.fill();
      ctx.beginPath(); ctx.moveTo(hbX + 32, hbY - 17); ctx.lineTo(hbX + 34, hbY - 23); ctx.lineTo(hbX + 37, hbY - 16); ctx.lineTo(hbX + 39, hbY - 21); ctx.lineTo(hbX + 40, hbY - 11); ctx.fill();
      // Tail
      ctx.strokeStyle = "#1e0808"; ctx.lineWidth = 3.2; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(hbX - 8, hbY - 1); ctx.quadraticCurveTo(hbX - 25, hbY - 14, hbX - 27, hbY + 2 + Math.sin(gp) * 4.5); ctx.stroke();
      // Legs
      const dLeg = (ox, ph, col, lw) => {
        const u = Math.sin(gp + ph) * 8.5, lo = Math.cos(gp + ph) * 6.5;
        ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(hbX + ox, hbY + 7.5); ctx.lineTo(hbX + ox + u * 0.42, hbY + 14); ctx.lineTo(hbX + ox + u + lo, hbY + 21); ctx.stroke();
      };
      dLeg(-3, 0, "#3c1c12", 2.4); dLeg(15, 1.28, "#3c1c12", 2.4);
      dLeg(-1, Math.PI, "#7c4a32", 2.9); dLeg(17, Math.PI + 1.28, "#7c4a32", 2.9);
      // Scanlines CRT
      ctx.fillStyle = "rgba(0,0,0,0.09)";
      for (let sl = tvY2 + 8; sl < tvY2 + tvH - 10; sl += 3.2) ctx.fillRect(tvX + 8, sl, tvW - 16, 1.4);
      // Screen glare
      ctx.fillStyle = "rgba(255,255,255,0.06)";
      ctx.beginPath(); ctx.moveTo(tvX + 8, tvY2 + 8); ctx.lineTo(tvX + tvW - 8, tvY2 + 8);
      ctx.lineTo(tvX + tvW * 0.38, tvY2 + tvH * 0.54); ctx.lineTo(tvX + 8, tvY2 + tvH * 0.4); ctx.closePath(); ctx.fill();
      // Channel info bar
      ctx.fillStyle = "rgba(0,0,0,0.4)"; ctx.fillRect(tvX + 8, tvY2 + tvH - 26, tvW - 16, 18);
      ctx.fillStyle = "#7fd87f"; ctx.font = `${H * 0.017}px monospace`; ctx.textAlign = "left";
      ctx.fillText("▶  NATURE WILD  HD", tvX + 15, tvY2 + tvH - 13);
      ctx.fillStyle = "#aaa"; ctx.textAlign = "right"; ctx.fillText("22:14", tvX + tvW - 14, tvY2 + tvH - 13);
      ctx.textAlign = "left"; ctx.restore();
      // Power LED
      const ledOn = !isOut || timeS < 7.85;
      ctx.fillStyle = ledOn ? "#00ff66" : "#2a2a2a";
      ctx.beginPath(); ctx.arc(tvX + tvW - 11, tvY2 + tvH - 10, 3, 0, Math.PI * 2); ctx.fill();
      if (ledOn) { ctx.fillStyle = "rgba(0,255,100,0.28)"; ctx.beginPath(); ctx.arc(tvX + tvW - 11, tvY2 + tvH - 10, 7, 0, Math.PI * 2); ctx.fill(); }
      // Wall mount bracket
      ctx.fillStyle = "#1a1a1e";
      ctx.fillRect(tvX + tvW / 2 - 5, tvY2 + tvH, 10, H * 0.06);
      ctx.fillRect(tvX + tvW / 2 - 18, tvY2 + tvH + H * 0.055, 36, 6);

      // ── COUCH ──────────────────────────────────────────────────────────────
      const couchX = W * 0.04, couchY = floorY - H * 0.24;
      const couchW = W * 0.44, couchH = H * 0.24;
      // Shadow
      ctx.save(); ctx.filter = "blur(11px)";
      ctx.fillStyle = "rgba(0,0,0,0.28)"; ctx.fillRect(couchX + 4, couchY + couchH - 4, couchW, 16);
      ctx.filter = "none"; ctx.restore();
      // Back cushions
      for (let ci = 0; ci < 3; ci++) {
        const csW = couchW / 3, csX = couchX + ci * csW;
        const csG = ctx.createLinearGradient(csX, couchY, csX + csW, couchY + couchH * 0.54);
        csG.addColorStop(0, "#d43848"); csG.addColorStop(1, "#6c0c1a");
        ctx.fillStyle = csG; ctx.beginPath(); ctx.roundRect(csX + 3, couchY + 2, csW - 6, couchH * 0.53, 8); ctx.fill();
        // Seam
        ctx.strokeStyle = "rgba(0,0,0,0.2)"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(csX + csW / 2, couchY + 8); ctx.lineTo(csX + csW / 2, couchY + couchH * 0.46); ctx.stroke();
        // Highlight strip
        ctx.fillStyle = "rgba(255,255,255,0.08)";
        ctx.beginPath(); ctx.roundRect(csX + 7, couchY + 5, csW - 14, 9, 4); ctx.fill();
      }
      // Seat cushions
      for (let ci = 0; ci < 3; ci++) {
        const csW = couchW / 3, csX = couchX + ci * csW;
        const csG = ctx.createLinearGradient(csX, couchY + couchH * 0.5, csX, couchY + couchH * 0.87);
        csG.addColorStop(0, "#c02030"); csG.addColorStop(1, "#760c1c");
        ctx.fillStyle = csG; ctx.beginPath(); ctx.roundRect(csX + 3, couchY + couchH * 0.5, csW - 6, couchH * 0.38, 5); ctx.fill();
        ctx.strokeStyle = "rgba(0,0,0,0.16)"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(csX + csW / 2, couchY + couchH * 0.52); ctx.lineTo(csX + csW / 2, couchY + couchH * 0.85); ctx.stroke();
      }
      // Armrests w/ nail heads
      const doArm = (ax) => {
        const aG = ctx.createLinearGradient(ax, couchY, ax + W * 0.046, couchY + couchH);
        aG.addColorStop(0, "#8a0022"); aG.addColorStop(1, "#460010");
        ctx.fillStyle = aG; ctx.beginPath(); ctx.roundRect(ax, couchY + couchH * 0.2, W * 0.046, couchH * 0.8, 8); ctx.fill();
        ctx.fillStyle = "#c8a028";
        for (let n = 0; n < 4; n++) { ctx.beginPath(); ctx.arc(ax + W * 0.023, couchY + couchH * 0.3 + n * H * 0.042, 2.2, 0, Math.PI * 2); ctx.fill(); }
        ctx.fillStyle = "#e8c040";
        for (let n = 0; n < 4; n++) { ctx.beginPath(); ctx.arc(ax + W * 0.023 - 0.5, couchY + couchH * 0.3 + n * H * 0.042 - 0.5, 1, 0, Math.PI * 2); ctx.fill(); }
      };
      doArm(couchX - W * 0.043); doArm(couchX + couchW);
      // Throw pillow
      const pilX2 = couchX + couchW * 0.71, pilY2 = couchY + couchH * 0.1;
      ctx.fillStyle = "#f0c070"; ctx.beginPath(); ctx.roundRect(pilX2, pilY2, W * 0.07, H * 0.1, 9); ctx.fill();
      ctx.strokeStyle = "rgba(175,90,18,0.38)"; ctx.lineWidth = 1;
      ctx.strokeRect(pilX2 + 4, pilY2 + 4, W * 0.07 - 8, H * 0.1 - 8);
      ctx.strokeStyle = "rgba(195,105,22,0.25)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(pilX2 + 4, pilY2 + 4); ctx.lineTo(pilX2 + W * 0.07 - 4, pilY2 + H * 0.1 - 4); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(pilX2 + W * 0.07 - 4, pilY2 + 4); ctx.lineTo(pilX2 + 4, pilY2 + H * 0.1 - 4); ctx.stroke();
      // Remote
      const remX2 = couchX + couchW * 0.14, remY2 = couchY + couchH * 0.57;
      const rmW = W * 0.028, rmH = H * 0.062;
      ctx.fillStyle = "#1c1c22"; ctx.beginPath(); ctx.roundRect(remX2, remY2, rmW, rmH, 4); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.12)"; ctx.fillRect(remX2 + 2, remY2 + 2, rmW - 4, 2);
      ctx.fillStyle = "#e00"; ctx.beginPath(); ctx.arc(remX2 + rmW / 2, remY2 + H * 0.008, 2.5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#303038";
      for (let rb = 0; rb < 6; rb++) { ctx.beginPath(); ctx.arc(remX2 + rmW * 0.28 + (rb % 2) * rmW * 0.42, remY2 + H * 0.018 + Math.floor(rb / 2) * H * 0.013, 2, 0, Math.PI * 2); ctx.fill(); }

      // ── CHARACTER ──────────────────────────────────────────────────────────
      const mX = couchX + couchW * 0.34, mY = couchY + couchH * 0.46;
      ctx.save(); ctx.translate(mX, mY);
      if (isOut) ctx.rotate(fallAngle);

      // Body shadow
      ctx.fillStyle = "rgba(0,0,0,0.16)"; ctx.beginPath(); ctx.ellipse(24, 53, 37, 8, 0, 0, Math.PI * 2); ctx.fill();

      // Jeans
      const jG = ctx.createLinearGradient(-8, 0, 50, 52);
      jG.addColorStop(0, "#2c5299"); jG.addColorStop(0.5, "#1a387a"); jG.addColorStop(1, "#0d1b4c");
      ctx.fillStyle = jG;
      ctx.beginPath(); ctx.moveTo(-8, -5); ctx.quadraticCurveTo(14, -13, 31, -4); ctx.quadraticCurveTo(45, 4, 47, 17);
      ctx.quadraticCurveTo(45, 24, 37, 23); ctx.quadraticCurveTo(16, 16, -8, 12); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(35, 20); ctx.quadraticCurveTo(51, 22, 55, 35); ctx.quadraticCurveTo(58, 44, 53, 49);
      ctx.lineTo(41, 47); ctx.quadraticCurveTo(41, 32, 31, 22); ctx.closePath(); ctx.fill();
      // Jeans seam + highlight
      ctx.strokeStyle = "rgba(8,14,48,0.55)"; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(30, 7); ctx.quadraticCurveTo(36, 14, 37, 22); ctx.stroke();
      ctx.fillStyle = "rgba(120,155,255,0.09)"; ctx.fillRect(3, 2, 22, 2);

      // Shoe
      ctx.fillStyle = "#181820";
      ctx.beginPath(); ctx.moveTo(39, 45); ctx.lineTo(56, 46); ctx.quadraticCurveTo(67, 50, 68, 55);
      ctx.quadraticCurveTo(53, 59, 37, 55); ctx.quadraticCurveTo(36, 50, 39, 45); ctx.fill();
      ctx.strokeStyle = "#555"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(37, 55); ctx.lineTo(66, 55); ctx.stroke();
      ctx.strokeStyle = "#fff"; ctx.lineWidth = 0.9;
      ctx.beginPath(); ctx.moveTo(44, 47); ctx.lineTo(52, 50); ctx.moveTo(48, 46); ctx.lineTo(55, 49); ctx.stroke();

      // Shirt (plaid pattern)
      const bR = 20 + bellyGrow * 0.73;
      const shrtG = ctx.createRadialGradient(10, -27, 2, 10, -27, bR + 26);
      shrtG.addColorStop(0, "#f8f8f4"); shrtG.addColorStop(0.62, "#eaeae8"); shrtG.addColorStop(1, "#c6c6cc");
      ctx.fillStyle = shrtG;
      ctx.beginPath(); ctx.moveTo(-15, -45); ctx.quadraticCurveTo(4, -58, 27, -47); ctx.quadraticCurveTo(44, -37, 34 + bellyGrow * 0.62, -15);
      ctx.quadraticCurveTo(24 + bellyGrow * 0.53, 7, -4, 3); ctx.quadraticCurveTo(-19, -14, -15, -45); ctx.fill();
      // Plaid stripes
      ctx.strokeStyle = "rgba(90,110,200,0.16)"; ctx.lineWidth = 3;
      for (let s = 0; s < 4; s++) { ctx.beginPath(); ctx.moveTo(-15 + s * 11, -58); ctx.lineTo(-5 + s * 13, 6); ctx.stroke(); }
      ctx.strokeStyle = "rgba(90,110,200,0.1)"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(-15, -38); ctx.lineTo(40 + bellyGrow * 0.55, -22); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-15, -26); ctx.lineTo(36 + bellyGrow * 0.6, -10); ctx.stroke();
      // Belly jiggle shine
      ctx.fillStyle = `rgba(255,255,255,${0.2 + Math.sin(ts * 0.003) * 0.04})`;
      ctx.beginPath(); ctx.ellipse(14 + bellyGrow * 0.22, -23, bR * 0.68, 18, -0.1, 0, Math.PI * 2); ctx.fill();
      // Buttons
      ctx.fillStyle = "#a8a8a8";
      for (let b = 0; b < 4; b++) { ctx.beginPath(); ctx.arc(17 + bellyGrow * 0.44, -39 + b * 11, 1.6, 0, Math.PI * 2); ctx.fill(); }
      // Seam
      ctx.strokeStyle = "rgba(100,100,112,0.4)"; ctx.lineWidth = 0.8;
      ctx.beginPath(); ctx.moveTo(16, -46); ctx.quadraticCurveTo(21, -26, 20 + bellyGrow * 0.46, -3); ctx.stroke();
      // Collar
      ctx.fillStyle = "#eeece8";
      ctx.beginPath(); ctx.moveTo(-1, -44); ctx.lineTo(11, -36); ctx.lineTo(15, -47);
      ctx.lineTo(23, -36); ctx.lineTo(30, -44); ctx.lineTo(20, -51); ctx.lineTo(8, -51); ctx.closePath(); ctx.fill();
      // Neck
      const sk = "#e0a870";
      ctx.fillStyle = sk; ctx.beginPath(); ctx.roundRect(2, -55, 15, 14, 5); ctx.fill();
      // Ear
      ctx.fillStyle = sk; ctx.beginPath(); ctx.ellipse(-1.5, -67, 3.5, 5, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "#c8906a"; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.arc(0, -67, 2.5, -0.3, Math.PI + 0.3); ctx.stroke();
      // Hair
      ctx.fillStyle = "#2c1a10";
      ctx.beginPath(); ctx.moveTo(-2, -70); ctx.quadraticCurveTo(0, -88, 18, -86); ctx.quadraticCurveTo(32, -80, 27, -64);
      ctx.quadraticCurveTo(16, -73, 3, -71); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "#1e0e08"; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(0, -71); ctx.quadraticCurveTo(-2, -79, 4, -83); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(9, -74); ctx.quadraticCurveTo(11, -83, 20, -83); ctx.stroke();
      // Face
      ctx.fillStyle = sk; ctx.beginPath(); ctx.ellipse(12, -68, 13.5, 16.5, -0.06, 0, Math.PI * 2); ctx.fill();
      // Nose
      ctx.fillStyle = "#c8906a"; ctx.beginPath(); ctx.ellipse(23, -65, 4.5, 5.5, -0.15, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "#b8784e"; ctx.lineWidth = 0.8;
      ctx.beginPath(); ctx.arc(21.5, -63, 2.2, 0.2, Math.PI - 0.2); ctx.stroke();
      // Blush cheeks
      if (blush > 0.18) {
        ctx.fillStyle = `rgba(218,72,72,${0.14 * blush})`;
        ctx.beginPath(); ctx.ellipse(7, -63, 7.5, 4.5, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(21, -63, 5.5, 3.5, 0, 0, Math.PI * 2); ctx.fill();
      }
      // Eyes & expressions
      if (!isOut) {
        // Eyebrow
        ctx.strokeStyle = "#2a1408"; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(6, -77); ctx.quadraticCurveTo(11, -79, 16, -77); ctx.stroke();
        // Whites + iris
        const eyeOp = clamp(1 - eyeDroop * 0.8, 0.22, 1);
        ctx.fillStyle = "#f9f9f9"; ctx.beginPath(); ctx.ellipse(11, -71, 3.5, 2.6 * eyeOp, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#3a2010"; ctx.beginPath(); ctx.ellipse(11, -71, 2.1, 1.9 * eyeOp, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#0a0a0a"; ctx.beginPath(); ctx.ellipse(11, -71, 1.3, 1.3 * eyeOp, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(12, -72, 0.75, 0, Math.PI * 2); ctx.fill();
        if (eyeDroop > 0.28) {
          ctx.fillStyle = sk; ctx.beginPath(); ctx.ellipse(11, -71 - 2.5 * eyeOp + 0.5, 4, 2.3 * (eyeDroop - 0.28) + 0.6, 0, 0, Math.PI * 2); ctx.fill();
        }
        // Mouth
        ctx.strokeStyle = "#8a3030"; ctx.lineWidth = 1.5;
        if (armUp) {
          ctx.fillStyle = "#3c1012"; ctx.beginPath(); ctx.ellipse(18, -57, 3.5, 4.5, 0, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = "#e8e0d0"; ctx.beginPath(); ctx.arc(18, -57, 2.5, Math.PI, Math.PI * 2); ctx.fill();
        } else {
          ctx.beginPath(); ctx.arc(18, -57, 3.5, 0.12, Math.PI - 0.12); ctx.stroke();
        }
      } else {
        // Unconscious face — X eyes
        ctx.strokeStyle = "#444"; ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.moveTo(7, -74); ctx.lineTo(15, -67); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(15, -74); ctx.lineTo(7, -67); ctx.stroke();
        // Drool
        const drA = clamp((timeS - 5.85) / 0.55, 0, 1);
        if (drA > 0) {
          ctx.strokeStyle = `rgba(140,170,225,${drA * 0.72})`; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(15, -54); ctx.bezierCurveTo(16, -52, 18, -50, 17, -45); ctx.stroke();
          ctx.fillStyle = `rgba(140,170,225,${drA * 0.52})`;
          ctx.beginPath(); ctx.arc(17, -43, 3.5, 0, Math.PI * 2); ctx.fill();
        }
        // Strong blush
        ctx.fillStyle = `rgba(200,55,55,0.2)`;
        ctx.beginPath(); ctx.ellipse(7, -64, 8, 4.5, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(21, -64, 5.5, 3.5, 0, 0, Math.PI * 2); ctx.fill();
      }
      // Sweat drops
      if (sweating && !isOut) {
        const swN = Math.floor((eatF - 0.54) / 0.46 * 5) + 1;
        for (let sw = 0; sw < swN; sw++) {
          const swDX = -9 + sw * 9 + Math.sin(ts * 0.002 + sw * 1.2) * 3;
          const swDY = -87 + Math.sin(ts * 0.0032 + sw * 2.2) * 10;
          const swA = 0.5 + Math.sin(ts * 0.004 + sw) * 0.2;
          ctx.fillStyle = `rgba(168,214,255,${swA})`;
          ctx.beginPath(); ctx.moveTo(swDX, swDY); ctx.quadraticCurveTo(swDX + 3.5, swDY + 6, swDX, swDY + 11);
          ctx.quadraticCurveTo(swDX - 3.5, swDY + 6, swDX, swDY); ctx.fill();
        }
      }
      // Left arm (resting)
      ctx.strokeStyle = "#ccccd4"; ctx.lineWidth = 13; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(-7, -40); ctx.quadraticCurveTo(-27, -30, -18, -8); ctx.stroke();
      ctx.strokeStyle = sk; ctx.lineWidth = 9;
      ctx.beginPath(); ctx.moveTo(-19, -11); ctx.quadraticCurveTo(-13, 2, 4, -3); ctx.stroke();
      ctx.fillStyle = sk; ctx.beginPath(); ctx.ellipse(5, -3, 6.5, 5.5, 0.3, 0, Math.PI * 2); ctx.fill();
      // Right arm (eating)
      ctx.strokeStyle = "#ccccd4"; ctx.lineWidth = 13; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(21, -40);
      if (!isOut) ctx.quadraticCurveTo(armUp ? 39 : 39, armUp ? -32 : -24, armUp ? 30 : 28, armUp ? -57 : -4);
      else ctx.quadraticCurveTo(37, -20, 34, 29);
      ctx.stroke();
      ctx.strokeStyle = sk; ctx.lineWidth = 9;
      ctx.beginPath(); ctx.moveTo(27, -32);
      if (!isOut) ctx.quadraticCurveTo(armUp ? 39 : 37, armUp ? -47 : -18, armUp ? 30 : 29, armUp ? -59 : -4);
      else ctx.quadraticCurveTo(41, 2, 35, 30);
      ctx.stroke();
      // Right hand + candy
      ctx.fillStyle = sk;
      if (!isOut) {
        const hpX = armUp ? 30 : 29, hpY = armUp ? -60 : -4;
        ctx.beginPath(); ctx.ellipse(hpX, hpY, 6.5, 5.5, 0.2, 0, Math.PI * 2); ctx.fill();
        if (armUp) {
          const hue = (timeS * 78) % 360;
          const cG2 = ctx.createRadialGradient(hpX, hpY - 7, 1, hpX, hpY - 7, 6.5);
          cG2.addColorStop(0, `hsl(${hue}, 100%, 72%)`); cG2.addColorStop(1, `hsl(${hue + 35}, 100%, 44%)`);
          ctx.fillStyle = cG2; ctx.beginPath(); ctx.arc(hpX, hpY - 7.5, 6.5, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = "rgba(255,255,255,0.48)"; ctx.beginPath(); ctx.arc(hpX - 2, hpY - 10, 2.2, 0, Math.PI * 2); ctx.fill();
          if (Math.random() > 0.62) {
            for (let sp = 0; sp < 3; sp++) {
              sugarSparkles.push({ x: mX + hpX + (Math.random() - 0.5) * 18, y: mY + hpY - 7.5 + (Math.random() - 0.5) * 18, vx: (Math.random() - 0.5) * 2, vy: -Math.random() * 2.2 - 0.5, life: 1, hue });
            }
          }
        }
      } else {
        ctx.beginPath(); ctx.ellipse(35, 31, 6.5, 5.5, 0.2, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();

      // ── CANDY BOWL ──────────────────────────────────────────────────────────
      let bX = mX + 20, bY3 = mY - 6, bRot = 0;
      if (isOut) { const ft = timeS - 5.5; bX += ft * 45; bY3 += ft * ft * 168; bRot = ft * 5.8; }
      ctx.save(); ctx.translate(bX, bY3); ctx.rotate(bRot);
      ctx.fillStyle = "rgba(0,0,0,0.17)"; ctx.beginPath(); ctx.ellipse(0, 15, 15, 4, 0, 0, Math.PI * 2); ctx.fill();
      const bwlG = ctx.createLinearGradient(-15, -8, 15, 8);
      bwlG.addColorStop(0, "#eaeae2"); bwlG.addColorStop(1, "#bcbcb4");
      ctx.fillStyle = bwlG; ctx.beginPath(); ctx.arc(0, 0, 15, 0, Math.PI, true); ctx.fill();
      ctx.beginPath(); ctx.ellipse(0, 0, 15, 5, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "#d4af37"; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.ellipse(0, 0, 15, 5, 0, 0, Math.PI * 2); ctx.stroke();
      if (!isOut || bRot < 1.35) {
        const bcc = ["#ff4466","#ffaa00","#44ff88","#ff88ff","#44aaff","#ffff44"];
        bcc.forEach((col, ci) => {
          ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(-5.5 + ci * 3.3, -2.5 - Math.abs(ci - 2.5) * 1.5, 3, 2.3, ci * 0.4, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = "rgba(255,255,255,0.38)"; ctx.beginPath(); ctx.arc(-6.5 + ci * 3.3, -3.5 - Math.abs(ci - 2.5) * 1.5, 0.9, 0, Math.PI * 2); ctx.fill();
        });
      }
      ctx.restore();

      // ── SPILLED CANDIES ─────────────────────────────────────────────────────
      if (isOut && candies.length === 0 && timeS < 6.9) {
        for (let ci = 0; ci < 26; ci++) {
          candies.push({ x: mX + 22, y: mY - 8, vx: (Math.random() - 0.3) * 10.5, vy: (Math.random() - 0.88) * 8.5, rot: Math.random() * Math.PI * 2, rotV: (Math.random() - 0.5) * 0.35, color: `hsl(${Math.random() * 360},100%,58%)`, size: 3.8 + Math.random() * 3.8, shape: Math.floor(Math.random() * 3) });
        }
      }
      if (!isOut && candies.length > 0) candies = [];
      candies.forEach(c => {
        c.x += c.vx; c.y += c.vy; c.vy += 0.58; c.rot += c.rotV;
        if (c.y > floorY - 5) { c.y = floorY - 5; c.vy *= -0.46; c.vx *= 0.85; }
        ctx.save(); ctx.translate(c.x, c.y); ctx.rotate(c.rot);
        ctx.fillStyle = c.color;
        if (c.shape === 0) { ctx.beginPath(); ctx.arc(0, 0, c.size, 0, Math.PI * 2); ctx.fill(); }
        else if (c.shape === 1) { ctx.beginPath(); ctx.roundRect(-c.size, -c.size, c.size * 2, c.size * 2, c.size * 0.3); ctx.fill(); }
        else { ctx.beginPath(); ctx.ellipse(0, 0, c.size * 1.65, c.size * 0.64, 0, 0, Math.PI * 2); ctx.fill(); }
        ctx.fillStyle = "rgba(255,255,255,0.38)"; ctx.beginPath(); ctx.arc(-c.size * 0.33, -c.size * 0.33, c.size * 0.3, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      });

      // ── SUGAR SPARKLES ──────────────────────────────────────────────────────
      sugarSparkles.forEach(sp => {
        sp.x += sp.vx; sp.y += sp.vy; sp.life -= 0.027;
        if (sp.life > 0) {
          ctx.fillStyle = `hsla(${sp.hue},100%,78%,${sp.life})`;
          ctx.beginPath(); ctx.arc(sp.x, sp.y, 2.5 * sp.life, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = `hsla(${sp.hue + 28},100%,92%,${sp.life * 0.52})`;
          ctx.lineWidth = 0.9; const r2 = 4 * sp.life;
          ctx.beginPath(); ctx.moveTo(sp.x - r2, sp.y); ctx.lineTo(sp.x + r2, sp.y);
          ctx.moveTo(sp.x, sp.y - r2); ctx.lineTo(sp.x, sp.y + r2); ctx.stroke();
        }
      });
      for (let i = sugarSparkles.length - 1; i >= 0; i--) { if (sugarSparkles[i].life <= 0) sugarSparkles.splice(i, 1); }

      // ── GLUCOSE HUD ─────────────────────────────────────────────────────────
      const hudX = W - 140, hudY3 = 15, hudW = 130, hudH3 = 102;
      const gc = glucose < 140 ? "#42ff84" : glucose < 250 ? "#ffcc22" : glucose < 380 ? "#ff8800" : "#ff2424";
      ctx.fillStyle = "rgba(3,7,16,0.92)"; ctx.beginPath(); ctx.roundRect(hudX, hudY3, hudW, hudH3, 10); ctx.fill();
      const alertBdr = glucose > 300 && ts % 480 < 240;
      ctx.strokeStyle = alertBdr ? "#ff2424" : "rgba(55,108,138,0.68)"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.roundRect(hudX, hudY3, hudW, hudH3, 10); ctx.stroke();
      if (alertBdr) {
        ctx.strokeStyle = "rgba(255,36,36,0.18)"; ctx.lineWidth = 5;
        ctx.beginPath(); ctx.roundRect(hudX, hudY3, hudW, hudH3, 10); ctx.stroke();
      }
      ctx.font = "500 9px monospace"; ctx.fillStyle = "#567888"; ctx.textAlign = "left";
      ctx.fillText("BLOOD GLUCOSE", hudX + 8, hudY3 + 14);
      ctx.font = `bold ${H * 0.044}px monospace`; ctx.fillStyle = gc; ctx.textAlign = "right";
      ctx.fillText(Math.floor(glucose), hudX + hudW - 36, hudY3 + 39);
      ctx.font = "9px monospace"; ctx.fillStyle = "#567888"; ctx.fillText("mg/dL", hudX + hudW - 6, hudY3 + 39);
      const trend = glucoseHistory.length > 7 ? glucoseHistory[glucoseHistory.length - 1] - glucoseHistory[glucoseHistory.length - 7] : 0;
      ctx.font = "bold 13px monospace"; ctx.fillStyle = gc; ctx.textAlign = "left";
      ctx.fillText(trend > 25 ? "↑↑" : trend > 8 ? "↑" : trend < -8 ? "↓" : "→", hudX + hudW - 30, hudY3 + 39);
      const lbl = glucose < 140 ? "NORMAL" : glucose < 250 ? "ELEVATED" : glucose < 380 ? "HIGH ⚠" : "CRITICAL ⚠";
      ctx.font = "bold 8px monospace"; ctx.fillStyle = gc; ctx.textAlign = "center";
      ctx.fillText(lbl, hudX + hudW / 2, hudY3 + 51);
      // Sparkline
      if (glucoseHistory.length > 1) {
        const gMin = 80, gMax = 475, gW3 = hudW - 16, gH3 = 29;
        const gX3 = hudX + 8, gY3 = hudY3 + hudH3 - gH3 - 8;
        ctx.fillStyle = "rgba(0,10,26,0.72)"; ctx.beginPath(); ctx.roundRect(gX3, gY3, gW3, gH3, 4); ctx.fill();
        ctx.strokeStyle = "rgba(38,88,110,0.42)"; ctx.lineWidth = 0.5;
        [140, 200, 300].forEach(gl => {
          const ly = gY3 + gH3 - ((gl - gMin) / (gMax - gMin)) * gH3;
          ctx.beginPath(); ctx.moveTo(gX3, ly); ctx.lineTo(gX3 + gW3, ly); ctx.stroke();
        });
        ctx.strokeStyle = gc; ctx.lineWidth = 1.7;
        ctx.beginPath();
        glucoseHistory.forEach((g, i) => {
          const px = gX3 + (i / (glucoseHistory.length - 1)) * gW3;
          const py = gY3 + gH3 - clamp((g - gMin) / (gMax - gMin), 0, 1) * gH3;
          i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        });
        ctx.stroke();
        const lPy = gY3 + gH3 - clamp((glucoseHistory[glucoseHistory.length - 1] - gMin) / (gMax - gMin), 0, 1) * gH3;
        ctx.lineTo(gX3 + gW3, gY3 + gH3); ctx.lineTo(gX3, gY3 + gH3); ctx.closePath();
        ctx.fillStyle = `${gc}18`; ctx.fill();
        // Live dot
        const dotX = gX3 + gW3, dotY = lPy;
        ctx.fillStyle = gc; ctx.beginPath(); ctx.arc(dotX, dotY, 2.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = `${gc}4a`; ctx.beginPath(); ctx.arc(dotX, dotY, 5 + Math.sin(ts * 0.012) * 2, 0, Math.PI * 2); ctx.fill();
      }
      ctx.textAlign = "left";

      // ── VIGNETTE ────────────────────────────────────────────────────────────
      const vig = ctx.createRadialGradient(W * 0.5, H * 0.5, W * 0.18, W * 0.5, H * 0.5, W * 0.78);
      vig.addColorStop(0, "rgba(0,0,0,0)"); vig.addColorStop(1, "rgba(0,0,0,0.38)");
      ctx.fillStyle = vig; ctx.fillRect(0, 0, W, H);

      // ── SUGAR CRASH SEQUENCE ─────────────────────────────────────────────────
      if (isOut) {
        ctx.fillStyle = `rgba(165,0,0,${0.1 + Math.sin(ts * 0.014) * 0.07})`;
        ctx.fillRect(0, 0, W, H);
        // EKG heartbeat line
        const htY = H * 0.89, htX2 = W * 0.07, htW2 = W * 0.86;
        const htPrg = (ts * 0.55) % htW2;
        ctx.strokeStyle = "#ff2424"; ctx.lineWidth = 2.4; ctx.lineCap = "round"; ctx.lineJoin = "round";
        ctx.beginPath(); ctx.moveTo(htX2, htY);
        ctx.lineTo(htX2 + htPrg * 0.56, htY);
        if (htPrg > htW2 * 0.27) {
          const bp = htX2 + htPrg * 0.56;
          ctx.lineTo(bp + htPrg * 0.04, htY);
          ctx.lineTo(bp + htPrg * 0.065, htY - H * 0.058);
          ctx.lineTo(bp + htPrg * 0.105, htY + H * 0.09);
          ctx.lineTo(bp + htPrg * 0.145, htY - H * 0.038);
          ctx.lineTo(bp + htPrg * 0.185, htY);
          ctx.lineTo(htX2 + htPrg, htY);
        }
        ctx.stroke();
        // EKG cursor dot
        ctx.fillStyle = "#ff4444"; ctx.beginPath(); ctx.arc(htX2 + htPrg, htY, 3.8, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "rgba(255,40,40,0.26)"; ctx.beginPath(); ctx.arc(htX2 + htPrg, htY, 8 + Math.sin(ts * 0.025) * 2, 0, Math.PI * 2); ctx.fill();
        // Crash title
        ctx.save();
        ctx.translate(W / 2, H * 0.4); ctx.rotate(Math.sin(ts * 0.007) * 0.028);
        ctx.font = `900 ${H * 0.067}px "Arial Black", sans-serif`; ctx.textAlign = "center";
        ctx.shadowBlur = 24; ctx.shadowColor = "#ff0000";
        ctx.strokeStyle = "#180000"; ctx.lineWidth = 10;
        ctx.strokeText("SUGAR CRASH!", 0, 0);
        ctx.fillStyle = "#ff3333"; ctx.fillText("SUGAR CRASH!", 0, 0);
        ctx.shadowBlur = 0;
        ctx.font = `bold ${H * 0.028}px Arial`; ctx.fillStyle = "#ffba44";
        ctx.fillText(`Glucose: ${Math.floor(glucose)} mg/dL — Seek help immediately`, 0, H * 0.06);
        ctx.restore();
      }

      animationId = requestAnimationFrame(render);
    };

    requestAnimationFrame(render);
    return () => { window.removeEventListener("resize", init); if (animationId) cancelAnimationFrame(animationId); };
  }, []);

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />;
};