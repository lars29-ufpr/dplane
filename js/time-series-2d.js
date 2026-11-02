// js/time-series-2d.js

export class TimeSeries2DPlot {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    }

    render(stepFunc, params, x0, y0, iterations = 150) {
        const ctx = this.ctx;
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;

        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // Ajuste das margens para caberem os textos dos eixos
        const padding = 20;
        const bottomPadding = 35; // Espaço para os valores de n
        const leftPadding = 50;   // Espaço para os valores de X e Y

        ctx.clearRect(0, 0, width, height);

        // 1. Calcula a órbita e captura os limites absolutos dos dados
        let x = x0;
        let y = y0;
        let dataX = [x];
        let dataY = [y];
        
        let dataMin = Math.min(x, y);
        let dataMax = Math.max(x, y);

        for (let i = 0; i < iterations; i++) {
            const next = stepFunc(x, y, params);
            x = next.x;
            y = next.y;
            
            if (!isFinite(x) || !isFinite(y) || Math.abs(x) > 1e6 || Math.abs(y) > 1e6) break;
            
            dataX.push(x);
            dataY.push(y);
            dataMin = Math.min(dataMin, x, y);
            dataMax = Math.max(dataMax, x, y);
        }

        // Adiciona 10% de folga vertical para o gráfico respirar
        const yRange = (dataMax - dataMin) || 1;
        const minY = dataMin - yRange * 0.1;
        const maxY = dataMax + yRange * 0.1;

        const plotWidth = width - leftPadding - padding;
        const plotHeight = height - padding - bottomPadding;

        const toScreenX = (n) => leftPadding + (n / iterations) * plotWidth;
        const toScreenY = (val) => height - bottomPadding - ((val - minY) / (maxY - minY)) * plotHeight;

        // 2. Desenha o eixo central y = 0
        if (minY <= 0 && maxY >= 0) {
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
            ctx.lineWidth = 1;
            ctx.moveTo(leftPadding, toScreenY(0));
            ctx.lineTo(width - padding, toScreenY(0));
            ctx.stroke();
        }

        // 3. Função para desenhar as séries temporais
        const drawSeries = (data, color, label, legendOffsetY) => {
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            
            ctx.moveTo(toScreenX(0), toScreenY(data[0]));
            for (let i = 1; i < data.length; i++) {
                ctx.lineTo(toScreenX(i), toScreenY(data[i]));
            }
            ctx.stroke();

            // Caixa de legenda
            const legendX = width - padding - 60;
            const legendY = padding + legendOffsetY;
            
            ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
            ctx.fillRect(legendX - 10, legendY - 15, 60, 25);
            
            ctx.fillStyle = color;
            ctx.font = 'bold 13px sans-serif';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(label, legendX, legendY);
        };

        drawSeries(dataY, '#10b981', 'Y', 30);
        drawSeries(dataX, '#3b82f6', 'X', 0);

        // 4. DESENHA AS MAGNITUDES DOS EIXOS
        ctx.fillStyle = '#94a3b8'; // Cor cinza clara, estilo DevTools
        ctx.font = '11px sans-serif';
        
        // Eixo Y (Magnitudes máximas, mínimas e o zero)
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(dataMax.toFixed(2), leftPadding - 10, toScreenY(dataMax));
        ctx.fillText(dataMin.toFixed(2), leftPadding - 10, toScreenY(dataMin));
        
        if (dataMin < 0 && dataMax > 0) {
            ctx.fillText('0.00', leftPadding - 10, toScreenY(0));
        }

        // Eixo X (Valores de iteração n)
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText('0', toScreenX(0), height - bottomPadding + 10);
        ctx.fillText(Math.floor(iterations / 2).toString(), toScreenX(iterations / 2), height - bottomPadding + 10);
        ctx.fillText(iterations.toString(), toScreenX(iterations), height - bottomPadding + 10);
        
        // Rótulo da variável temporal (n)
        ctx.textAlign = 'left';
        ctx.fillText('n', toScreenX(iterations) + 12, height - bottomPadding + 10);
    }
}
