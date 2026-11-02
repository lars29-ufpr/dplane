// js/cobweb-plot.js

export class CobwebPlot {
    constructor(canvas, viewport) {
        this.canvas = canvas;
        this.viewport = viewport;
        this.ctx = viewport.ctx;
    }

    render(f, params, x0, fixedPoints, iterations = 100) {
        // Limpa o canvas e desenha os eixos cartesianos
        this.viewport.clear();
        this.viewport.drawAxes('x', 'f(x)');

        const ctx = this.ctx;
        const vp = this.viewport;

        // 1. Desenhar a reta de identidade (y = x)
        ctx.beginPath();
        ctx.strokeStyle = '#64748b'; // Cinzento ardósia
        ctx.lineWidth = 1.5;
        ctx.setLineDash([5, 5]);
        ctx.moveTo(vp.toScreenX(vp.xMin), vp.toScreenY(vp.xMin));
        ctx.lineTo(vp.toScreenX(vp.xMax), vp.toScreenY(vp.xMax));
        ctx.stroke();
        ctx.setLineDash([]); // Repor o traço contínuo

        // 2. Desenhar a curva da função f(x)
        ctx.beginPath();
        ctx.strokeStyle = '#3b82f6'; // Azul vibrante
        ctx.lineWidth = 2.5;
        
        // Resolução baseada na largura em píxeis do ecrã para um traço suave
        const resolution = vp.width; 
        const dx = (vp.xMax - vp.xMin) / resolution;
        
        let firstPoint = true;
        for (let i = 0; i <= resolution; i++) {
            const x = vp.xMin + i * dx;
            const y = f(x, params);
            
            if (isFinite(y)) {
                const sx = vp.toScreenX(x);
                const sy = vp.toScreenY(y);
                if (firstPoint) {
                    ctx.moveTo(sx, sy);
                    firstPoint = false;
                } else {
                    ctx.lineTo(sx, sy);
                }
            }
        }
        ctx.stroke();

        // 3. Desenhar a Teia de Aranha (Cobweb) a partir de x0
        ctx.beginPath();
        ctx.strokeStyle = '#ef4444'; // Vermelho
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.85;

        let currentX = x0;
        let currentY = 0; // Inicia visualmente no eixo X

        // Move a caneta para o ponto inicial no eixo X
        ctx.moveTo(vp.toScreenX(currentX), vp.toScreenY(currentY));

        for (let i = 0; i < iterations; i++) {
            let nextY = f(currentX, params);
            
            // Trava de segurança para evitar que o desenho fuja para o infinito
            if (!isFinite(nextY) || Math.abs(nextY) > 1e6) break;
            
            // Linha vertical: sobe (ou desce) até à curva f(x)
            ctx.lineTo(vp.toScreenX(currentX), vp.toScreenY(nextY));
            
            // Linha horizontal: desloca-se até à reta de identidade y = x
            ctx.lineTo(vp.toScreenX(nextY), vp.toScreenY(nextY));
            
            currentX = nextY;
        }
        ctx.stroke();
        ctx.globalAlpha = 1.0;

        // 4. Destacar os Pontos Fixos calculados pelo math-engine
        if (fixedPoints && fixedPoints.length > 0) {
            fixedPoints.forEach(pt => {
                const sx = vp.toScreenX(pt.x);
                const sy = vp.toScreenY(pt.x); // O ponto fixo reside sempre sobre y = x
                
                ctx.beginPath();
                ctx.arc(sx, sy, 5, 0, 2 * Math.PI);
                ctx.fillStyle = pt.color || '#10b981'; // Cor dinâmica (verde, amarelo ou vermelho)
                ctx.fill();
                ctx.strokeStyle = '#1e293b'; // Margem escura para contraste
                ctx.lineWidth = 2;
                ctx.stroke();
            });
        }
    }
}

