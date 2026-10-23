// js/bifurcation.js

export class BifurcationPlot {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d', { alpha: false }); // Otimização de performance
        this.padding = { top: 20, right: 20, bottom: 40, left: 50 };
        this.isRendering = false;
        this.cancelRequested = false;
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
        // Fundo escuro padrão do dplane
        this.ctx.fillStyle = '#0b1329'; 
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    toScreenX(paramValue, paramMin, paramMax) {
        const innerWidth = this.width - this.padding.left - this.padding.right;
        return this.padding.left + ((paramValue - paramMin) / (paramMax - paramMin)) * innerWidth;
    }

    toScreenY(y, yMin, yMax) {
        const innerHeight = this.height - this.padding.top - this.padding.bottom;
        return this.height - this.padding.bottom - ((y - yMin) / (yMax - yMin)) * innerHeight;
    }

    drawAxes(paramName, paramMin, paramMax, yMin, yMax) {
        const ctx = this.ctx;
        ctx.save();
        ctx.strokeStyle = '#334155';
        ctx.fillStyle = '#94a3b8';
        ctx.lineWidth = 1.5;
        ctx.font = '14px sans-serif';

        const yZero = this.toScreenY(0, yMin, yMax);
        const clampedYZero = Math.max(this.padding.top, Math.min(this.height - this.padding.bottom, yZero));
        const xZero = this.padding.left;

        // Eixo X (Parâmetro)
        ctx.beginPath();
        ctx.moveTo(this.padding.left, clampedYZero);
        ctx.lineTo(this.width - this.padding.right, clampedYZero);
        ctx.stroke();

        // Eixo Y (Valores assintóticos x*)
        ctx.beginPath();
        ctx.moveTo(xZero, this.padding.top);
        ctx.lineTo(xZero, this.height - this.padding.bottom);
        ctx.stroke();

        // Legendas numéricas básicas nos extremos
        ctx.fillText(paramMin.toFixed(2), this.padding.left, clampedYZero + 15);
        ctx.fillText(paramMax.toFixed(2), this.width - this.padding.right - 20, clampedYZero + 15);
        
        ctx.textAlign = 'center';
        ctx.fillText(`Parâmetro: ${paramName}`, this.width / 2, clampedYZero + 30);
        ctx.fillText('x*', xZero, this.padding.top - 10);

        ctx.restore();
    }

    /**
     * Renderiza o diagrama assincronamente.
     * Se uma renderização já estiver em andamento, cancela a anterior.
     */
    async render(f, baseParams, paramToSweep, paramMin, paramMax, x0, yMin, yMax, transient = 200, plotIters = 200) {
        if (this.isRendering) {
            this.cancelRequested = true;
            // Aguarda o ciclo anterior ser cancelado
            await new Promise(resolve => setTimeout(resolve, 50)); 
        }

        this.isRendering = true;
        this.cancelRequested = false;
        
        this.resize();
        this.clear();
        this.drawAxes(paramToSweep, paramMin, paramMax, yMin, yMax);

        const ctx = this.ctx;
        const resolution = this.width - this.padding.left - this.padding.right; // Um cálculo por pixel do eixo X
        const dp = (paramMax - paramMin) / resolution;

        ctx.fillStyle = 'rgba(6, 182, 212, 0.3)'; // Ciano translúcido para revelar a densidade do caos

        let currentP = paramMin;
        const pObj = { ...baseParams };

        // Processa em blocos para não congelar o navegador
        const chunkSize = 20; // Calcula 20 colunas de pixels por quadro

        const drawChunk = () => {
            return new Promise((resolve) => {
                for (let c = 0; c < chunkSize; c++) {
                    if (currentP > paramMax || this.cancelRequested) {
                        resolve(false); // Terminou ou foi cancelado
                        return;
                    }

                    pObj[paramToSweep] = currentP;
                    let x = x0;

                    // 1. Escoa o transiente
                    for (let i = 0; i < transient; i++) {
                        x = f(x, pObj);
                        if (!isFinite(x) || Math.abs(x) > 1e6) break;
                    }

                    // 2. Desenha os pontos assintóticos
                    const screenX = this.toScreenX(currentP, paramMin, paramMax);
                    for (let i = 0; i < plotIters; i++) {
                        x = f(x, pObj);
                        if (!isFinite(x) || Math.abs(x) > 1e6) break;
                        
                        const screenY = this.toScreenY(x, yMin, yMax);
                        
                        // Desenha apenas se estiver dentro da área visível
                        if (screenY >= this.padding.top && screenY <= this.height - this.padding.bottom) {
                            ctx.fillRect(screenX, screenY, 1, 1);
                        }
                    }
                    currentP += dp;
                }
                
                // Solicita o próximo quadro de animação (não bloqueia a interface)
                requestAnimationFrame(() => resolve(true));
            });
        };

        // Loop assíncrono que processa todos os blocos
        let keepGoing = true;
        while (keepGoing) {
            keepGoing = await drawChunk();
        }

        this.isRendering = false;
        this.cancelRequested = false;
    }
}
