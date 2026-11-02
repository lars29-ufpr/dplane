// js/bifurcation.js

export class BifurcationPlot {
    constructor(canvas, viewport) {
        this.canvas = canvas;
        this.viewport = viewport;
        this.ctx = viewport.ctx;
        this.cachedImage = null; // Memória para não recalcular o fractal
    }

    render(f, params, paramToSweep, x0, burnIn = 5000, drawIterations = 300) {
        this.viewport.clear();
        
        const ctx = this.ctx;
        const vp = this.viewport;
        const width = vp.canvas.width;
        const height = vp.canvas.height;

        ctx.fillStyle = 'rgba(6, 182, 212, 0.15)'; // Ciano com transparência

        for (let i = 0; i <= width; i++) {
            const paramValue = vp.xMin + (i / width) * (vp.xMax - vp.xMin);
            const currentParams = { ...params };
            currentParams[paramToSweep] = paramValue;

            let x = x0;

            // 1. Burn-in maciço para vencer o Retardamento Crítico
            for (let j = 0; j < burnIn; j++) {
                x = f(x, currentParams);
                // Trava de fuga para o infinito
                if (!isFinite(x) || Math.abs(x) > 1e6) break;
            }

            if (!isFinite(x) || Math.abs(x) > 1e6) continue;

            // 2. Acumula os pontos no canvas
            for (let j = 0; j < drawIterations; j++) {
                x = f(x, currentParams);
                if (!isFinite(x) || Math.abs(x) > 1e6) break;
                
                // Desenha apenas se o valor não estourar visualmente o limite Y
                if (x >= vp.yMin && x <= vp.yMax) {
                    const sx = vp.toScreenX(paramValue);
                    const sy = vp.toScreenY(x);
                    ctx.fillRect(sx, sy, 1, 1);
                }
            }
        }
        
        // 3. Salva a imagem matematicamente pura no cache
        this.cachedImage = ctx.getImageData(0, 0, width, height);

        // 4. Desenha a linha indicadora sobre a nova imagem
        this.drawParamIndicator(params[paramToSweep]);
    }

    drawParamIndicator(paramValue) {
        const ctx = this.ctx;
        const vp = this.viewport;
        
        // 1. Restaura o fundo do cache (apaga a linha anterior instantaneamente)
        if (this.cachedImage) {
            ctx.putImageData(this.cachedImage, 0, 0);
        } else {
            return;
        }

        // 2. Desenha a nova linha tracejada vermelha controlada dinamicamente
        const sx = vp.toScreenX(paramValue);
        
        if (sx >= 0 && sx <= vp.canvas.width) {
            ctx.beginPath();
            ctx.strokeStyle = '#ef4444'; 
            ctx.lineWidth = 1.5;
            ctx.setLineDash([5, 5]);
            ctx.moveTo(sx, 0);
            ctx.lineTo(sx, vp.canvas.height);
            ctx.stroke();
            ctx.setLineDash([]); // Repor estado da caneta
        }
    }
}
