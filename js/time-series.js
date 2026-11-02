// js/time-series.js

export class TimeSeriesPlot {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    }

    render(f, params, x0, x0_alt, iterations, yMin, yMax) {
        const ctx = this.ctx;
        
        // Garante que a resolução interna do canvas acompanha o tamanho real no ecrã
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;

        const width = this.canvas.width;
        const height = this.canvas.height;

        // Limpa o quadro para o novo desenho
        ctx.clearRect(0, 0, width, height);

        // Margens internas (padding)
        const padding = 20;
        const plotWidth = width - 2 * padding;
        const plotHeight = height - 2 * padding;

        const toScreenX = (n) => padding + (n / iterations) * plotWidth;
        const toScreenY = (y) => height - padding - ((y - yMin) / (yMax - yMin)) * plotHeight;

        // Desenha o eixo y = 0 se estiver visível
        if (yMin <= 0 && yMax >= 0) {
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.lineWidth = 1;
            ctx.moveTo(padding, toScreenY(0));
            ctx.lineTo(width - padding, toScreenY(0));
            ctx.stroke();
        }

        const drawOrbit = (initialValue, color, isDashed = false) => {
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = 1.5;
            
            if (isDashed) {
                ctx.setLineDash([4, 4]);
            } else {
                ctx.setLineDash([]);
            }

            let x = initialValue;
            ctx.moveTo(toScreenX(0), toScreenY(x));

            for (let i = 1; i <= iterations; i++) {
                x = f(x, params);
                if (!isFinite(x) || Math.abs(x) > 1e6) break; 
                ctx.lineTo(toScreenX(i), toScreenY(x));
            }
            ctx.stroke();
            ctx.setLineDash([]); 
        };

        // 1. Desenha a órbita base a azul
        drawOrbit(x0, '#3b82f6', false);

        // 2. Desenha a órbita perturbada a vermelho
        drawOrbit(x0_alt, '#ef4444', true);

        // 3. DESENHA A LEGENDA NO CANTO SUPERIOR DIREITO
        const legendW = 110;
        const legendH = 50;
        const legendX = width - padding - legendW;
        const legendY = padding;

        // Fundo da Legenda
        ctx.fillStyle = 'rgba(15, 23, 42, 0.75)'; // Fundo escuro transparente
        ctx.fillRect(legendX, legendY, legendW, legendH);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)'; // Borda sutil
        ctx.strokeRect(legendX, legendY, legendW, legendH);

        ctx.font = '12px sans-serif';
        ctx.textBaseline = 'middle';

        // Item 1: Linha Azul (Condição Inicial)
        ctx.beginPath();
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.moveTo(legendX + 12, legendY + 15);
        ctx.lineTo(legendX + 32, legendY + 15);
        ctx.stroke();
        ctx.fillStyle = '#f8fafc';
        ctx.fillText('x₀', legendX + 42, legendY + 16);

        // Item 2: Linha Vermelha Tracejada (Perturbação)
        ctx.beginPath();
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.moveTo(legendX + 12, legendY + 35);
        ctx.lineTo(legendX + 32, legendY + 35);
        ctx.stroke();
        ctx.setLineDash([]); // Limpa o tracejado
        ctx.fillStyle = '#f8fafc';
        ctx.fillText('x₀ + 10⁻⁵', legendX + 42, legendY + 36);
    }
}
