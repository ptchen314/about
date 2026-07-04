/* =========================================================
   PS3 XMB background.
   Primary : WebGL2 spline wave + sparkle particles, ported from
             github.com/linkev/PlayStation-3-XMB (MIT) — see /wave/*.js
   Fallback: a lightweight 2D canvas wave if WebGL2 is unavailable.
   Both paths share the same interaction speed-boost.
   ========================================================= */
(function initBackground() {

    /* ---------- interaction speed boost ----------
       Wave speeds up on user interaction, then eases back to normal. */
    let speedMul = 1, boostEnd = 0;
    const speed = () => {
        if (performance.now() < boostEnd) return speedMul = 8;   // fast for 800ms
        return speedMul += (1 - speedMul) * 0.04;                // then ease back
    };
    const kick = () => { boostEnd = performance.now() + 800; };
    ["pointerdown", "keydown", "wheel", "touchstart"].forEach(
        ev => window.addEventListener(ev, kick, { passive: true }));

    /* ---------- wave engine tuning ----------
       Classic PS3 deep-blue background (RGB "default" gradient mode) */
    if (window.SPLINE_SETTINGS) {
        Object.assign(window.SPLINE_SETTINGS, {
            gradientPreset: "default",
            colorR: 30, colorG: 78, colorB: 175,
            gradientTopMul: 0.09, // near-black navy at the top
            gradientBotMul: 0.60  // deep blue toward the bottom
        });
    }
    if (window.PARTICLE_SETTINGS) window.PARTICLE_SETTINGS.count = 1400; // calmer than the demo default

    /* ---------- WebGL2 path ---------- */
    const glCanvas = document.getElementById("gl-wave");
    if (startWebGLWave(glCanvas)) return;

    /* WebGL unavailable — hide its canvas and run the 2D fallback */
    glCanvas.style.display = "none";
    startFallbackWave(document.getElementById("wave"));

    function startWebGLWave(canvas) {
        let gl = null;
        try {
            gl = canvas.getContext("webgl2", { antialias: true, alpha: false, powerPreference: "high-performance" });
        } catch (e) { /* fall through */ }
        if (!gl || !window.createSplineLayer || !window.createParticlesLayer) return false;

        try {
            gl.getExtension("OES_texture_float_linear");
            gl.getExtension("EXT_color_buffer_float");

            const resize = () => {
                const dpr = Math.min(window.devicePixelRatio || 1, 2);
                canvas.width = Math.floor(window.innerWidth * dpr);
                canvas.height = Math.floor(window.innerHeight * dpr);
                canvas.style.width = window.innerWidth + "px";
                canvas.style.height = window.innerHeight + "px";
                gl.viewport(0, 0, canvas.width, canvas.height);
            };
            window.addEventListener("resize", resize);
            resize();

            const spline = window.createSplineLayer(gl, canvas);
            const particles = window.createParticlesLayer(gl, canvas);
            document.getElementById("wave").style.display = "none"; // hide the 2D fallback

            let prev = performance.now();
            let tSpline = 0;
            let tPart = Math.random() * 1000;
            const frame = (nowMs) => {
                const dt = Math.max(0, (nowMs - prev) / 1000);
                prev = nowMs;
                const m = speed();
                tSpline += dt * m; tPart += dt * m;
                spline.render(tSpline);
                particles.render(tPart);
                requestAnimationFrame(frame);
            };
            requestAnimationFrame(frame);
            return true;
        } catch (e) {
            console.warn("XMB WebGL wave failed, using 2D fallback:", e);
            return false;
        }
    }

    /* ---------- 2D canvas fallback ---------- */
    function startFallbackWave(canvas) {
        const ctx = canvas.getContext("2d");
        let W, H;
        const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
        window.addEventListener("resize", resize);
        resize();

        const baseHue = 215; // deep blue, matching the WebGL background
        const TWO_PI = Math.PI * 2;

        let particles = [];
        const seedParticles = () => {
            const count = Math.round((W * H) / 30000);
            particles = [];
            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * W, y: Math.random() * H,
                    r: Math.random() * 1.6 + 0.5, sp: Math.random() * 0.22 + 0.05,
                    ph: Math.random() * TWO_PI, tw: Math.random() * 0.02 + 0.004
                });
            }
        };
        window.addEventListener("resize", seedParticles);
        seedParticles();

        let t = 0;
        const drawWave = () => {
            ctx.clearRect(0, 0, W, H);
            const cy = H * 0.5;
            ctx.globalCompositeOperation = "lighter";
            const RIBBONS = 8;
            for (let n = 0; n < RIBBONS; n++) {
                const yOff = (n - (RIBBONS - 1) / 2) * 9;
                const amp = 30 + n * 4;
                const spd = 0.005 + n * 0.0011;
                const lightness = 68 + (n % 3) * 9;
                ctx.beginPath();
                for (let x = -20; x <= W + 20; x += 6) {
                    const y = cy + yOff
                        + Math.sin(x * 0.0042 + t * spd + n * 0.9) * amp
                        + Math.sin(x * 0.013 + t * spd * 1.7 + n) * (amp * 0.32)
                        + Math.sin(x * 0.027 + t * 0.009 - n) * 5;
                    x === -20 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
                }
                ctx.strokeStyle = `hsla(${baseHue + n * 3}, 85%, ${lightness}%, 0.05)`;
                ctx.lineWidth = 2.2;
                ctx.shadowColor = `hsla(${baseHue}, 90%, 72%, 0.9)`;
                ctx.shadowBlur = 28;
                ctx.stroke();
            }
            ctx.shadowBlur = 0;
            for (const p of particles) {
                p.y -= p.sp;
                p.x += Math.sin(t * 0.008 + p.ph) * 0.12;
                if (p.y < -6) { p.y = H + 6; p.x = Math.random() * W; }
                const a = Math.max(0, 0.28 + Math.sin(t * p.tw + p.ph) * 0.22);
                ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 3.4, 0, TWO_PI);
                ctx.fillStyle = `hsla(${baseHue}, 70%, 85%, ${a * 0.16})`; ctx.fill();
                ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, TWO_PI);
                ctx.fillStyle = `hsla(${baseHue}, 40%, 96%, ${a})`; ctx.fill();
            }
            ctx.globalCompositeOperation = "source-over";
            t += speed();
            requestAnimationFrame(drawWave);
        };
        drawWave();
    }
})();
