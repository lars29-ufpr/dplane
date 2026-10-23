// js/time-series.js

export class TimeSeriesPlot {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.padding = { top: 20, right: 20, bottom: 40, left: 50 };
    }

    resize() {
        const rect = this.canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.ctx.scale(dpr, dpr);
        this.width = rect.width;
        this.height = rect.height;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    toScreenX(t, maxT) {
        const innerWidth = this.width - this.padding.left - this.padding.right;
        return this.padding.left + (t / maxT) * innerWidth;
    }

    toScreenY(y, yMin, yMax) {
        const innerHeight = this.height - this.padding.top - this.padding.bottom;
        return this.height - this.padding.bottom - ((y - yMin) / (yMax - yMin)) * innerHeight;
    }

    drawAxes(maxT, yMin, yMax) {
        const ctx = this.ctx;
        ctx.save();
        ctx.strokeStyle = '#334155'; // Cor do eixo
        ctx.fillStyle = '#94a3b8';
        ctx.lineWidth = 1.5;
        ctx.font = '14px sans-serif';

        const yZero = this.toScreenY(0, yMin, yMax);
        // Trava o eixo X para que não fuja da tela se yMin > 0
        const clampedYZero = Math.max(this.padding.top, Math.min(this.height - this.padding.bottom, yZero));
        const xZero = this.padding.left;

        // Eixo X (Tempo n)
        ctx.beginPath();
        ctx.moveTo(this.padding.left, clampedYZero);
        ctx.lineTo(this.width - this.padding.right, clampedYZero);
        ctx.stroke();

        // Eixo Y (População x_n)
        ctx.beginPath();
        ctx.moveTo(xZero, this.padding.top);
        ctx.lineTo(xZero, this.height - this.padding.bottom);
        ctx.stroke();

        // Legendas
        ctx.fillText('n (iterações)', this.width - this.padding.right - 40, clampedYZero + 20);
        ctx.textAlign = 'center';
        ctx.fillText('x_n', xZero, this.padding.top - 10);

        ctx.restore();
    }

    drawSeries(f, p, x0, iterations, yMin, yMax, color, isDashed = false) {
        const ctx = this.ctx;
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        if (isDashed) ctx.setLineDash([4, 4]);

        let x = x0;
        ctx.moveTo(this.toScreenX(0, iterations), this.toScreenY(x, yMin, yMax));

        const points = [{ t: 0, val: x }];

        for (let t = 1; t <= iterations; t++) {
            x = f(x, p);
            if (!isFinite(x) || Math.abs(x) > 1e6) break;
            
            const px = this.toScreenX(t, iterations);
            const py = this.toScreenY(x, yMin, yMax);
            ctx.lineTo(px, py);
            points.push({ t, val: x });
        }
        ctx.stroke();

        // Desenha marcadores (pontos) apenas se houver poucas iterações para não poluir visualmente
        if (iterations <= 150) {
            ctx.fillStyle = color;
            ctx.setLineDash([]);
            for (const pt of points) {
                ctx.beginPath();
                ctx.arc(this.toScreenX(pt.t, iterations), this.toScreenY(pt.val, yMin, yMax), 3, 0, 2 * Math.PI);
                ctx.fill();
            }
        }
        ctx.restore();
    }

    render(f, p, x0, x0_alt, iterations = 100, yMin = 0, yMax = 1) {
        this.resize();
        this.clear();
        this.drawAxes(iterations, yMin, yMax);

        // Órbita secundária (Perturbada) - Cor Coral
        if (x0_alt !== undefined && x0_alt !== null) {
            this.drawSeries(f, p, x0_alt, iterations, yMin, yMax, '#f43f5e', true);
        }

        // Órbita principal - Cor Ciano (desenhada por cima)
        if (x0 !== undefined && x0 !== null) {
            this.drawSeries(f, p, x0, iterations, yMin, yMax, '#06b6d4', false);
        }
    }
}
