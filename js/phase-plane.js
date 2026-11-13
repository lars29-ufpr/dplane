// js/phase-plane.js

export class PhasePlanePlot {
    constructor(canvas, viewport) {
        this.canvas = canvas;
        this.viewport = viewport;
        this.ctx = viewport.ctx;
        this.animationId = null; 
    }

    render(stepFunc, params, x0, y0, iterations = 50000) {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }

        this.viewport.clear();
        this.viewport.drawAxes('x', 'y'); 

        const ctx = this.ctx;
        const vp = this.viewport;

        // --- INÍCIO DA NOVA LÓGICA DE TEXTO (Estilo pplaneX) ---
        // Descobre onde os eixos (0,0) estão no ecrã. Se estiverem fora, fixa nas bordas.
        const originY = vp.toScreenY(0);
        const xAxisY = (originY >= 20 && originY <= vp.height - 20) ? originY : (originY < 20 ? 20 : vp.height - 20);
        
        const originX = vp.toScreenX(0);
        const yAxisX = (originX >= 40 && originX <= vp.width - 40) ? originX : (originX < 40 ? 10 : vp.width - 40);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '12px sans-serif';
        
        // Rótulos do Eixo X (Esquerda e Direita)
        ctx.textAlign = 'left';
        ctx.textBaseline = (xAxisY > vp.height / 2) ? 'bottom' : 'top';
        const yOffset = (xAxisY > vp.height / 2) ? -8 : 8;
        
        ctx.fillText(vp.xMin.toFixed(2), 10, xAxisY + yOffset);
        ctx.textAlign = 'right';
        ctx.fillText(vp.xMax.toFixed(2), vp.width - 10, xAxisY + yOffset);

        // Rótulos do Eixo Y (Topo e Fundo)
        ctx.textAlign = (yAxisX > vp.width / 2) ? 'right' : 'left';
        ctx.textBaseline = 'top';
        const xOffset = (yAxisX > vp.width / 2) ? -8 : 8;
        
        ctx.fillText(vp.yMax.toFixed(2), yAxisX + xOffset, 10);
        ctx.textBaseline = 'bottom';
        ctx.fillText(vp.yMin.toFixed(2), yAxisX + xOffset, vp.height - 10);
        // --- FIM DA NOVA LÓGICA DE TEXTO ---
let x = x0;
        let y = y0;
        let currentIter = 0;

        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';  
        ctx.lineWidth = 1;
        ctx.moveTo(vp.toScreenX(x), vp.toScreenY(y));

        // NOVA LÓGICA: O transiente respeita o slider, com limite máximo de 100
        const transientSteps = Math.min(100, iterations);
        for (let i = 0; i < transientSteps; i++) {
            const next = stepFunc(x, y, params);
            x = next.x;  
            y = next.y;
            if (!isFinite(x) || !isFinite(y)) break;
            ctx.lineTo(vp.toScreenX(x), vp.toScreenY(y));
            currentIter++;
        }
        ctx.stroke();

        ctx.fillStyle = '#06b6d4'; 

        const drawBatch = () => {
            const batchSize = 1200; 
            
            for (let i = 0; i < batchSize && currentIter < iterations; i++) {
                const next = stepFunc(x, y, params);
                x = next.x; 
                y = next.y;
                currentIter++;

                if (!isFinite(x) || !isFinite(y) || Math.abs(x) > 1e6 || Math.abs(y) > 1e6) {
                    currentIter = iterations; 
                    break;
                }

                const sx = vp.toScreenX(x);
                const sy = vp.toScreenY(y);

                if (sx >= 0 && sx <= vp.width && sy >= 0 && sy <= vp.height) {
                    ctx.fillRect(sx, sy, 1, 1);
                }
            }

            if (currentIter < iterations) {
                this.animationId = requestAnimationFrame(drawBatch);
            }
        };

        drawBatch();
    }
}
