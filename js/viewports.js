// js/viewports.js

export class Viewport {
    constructor(canvas, xMin, xMax, yMin, yMax) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        this.xMin = xMin;
        this.xMax = xMax;
        this.yMin = yMin;
        this.yMax = yMax;
        
        // Margens internas (em pixels) para desenhar eixos e números
        this.padding = { top: 20, right: 20, bottom: 40, left: 50 };
        
        this.resize();
    }

    /**
     * Ajusta a resolução do Canvas para evitar borrões em telas HiDPI/Retina
     */
    resize() {
        const rect = this.canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.ctx.scale(dpr, dpr);
        
        this.width = rect.width;
        this.height = rect.height;
    }

    // --- Conversão: Mundo Matemático -> Pixels da Tela ---
    
    toScreenX(x) {
        const innerWidth = this.width - this.padding.left - this.padding.right;
        return this.padding.left + ((x - this.xMin) / (this.xMax - this.xMin)) * innerWidth;
    }

    toScreenY(y) {
        const innerHeight = this.height - this.padding.top - this.padding.bottom;
        return this.height - this.padding.bottom - ((y - this.yMin) / (this.yMax - this.yMin)) * innerHeight;
    }

    // --- Conversão: Pixels da Tela -> Mundo Matemático ---
    
    toWorldX(px) {
        const innerWidth = this.width - this.padding.left - this.padding.right;
        return this.xMin + ((px - this.padding.left) / innerWidth) * (this.xMax - this.xMin);
    }

    toWorldY(py) {
        const innerHeight = this.height - this.padding.top - this.padding.bottom;
        return this.yMin + ((this.height - this.padding.bottom - py) / innerHeight) * (this.yMax - this.yMin);
    }

    // --- Navegação (Pan e Zoom) ---

    pan(dxWorld, dyWorld) {
        this.xMin -= dxWorld;
        this.xMax -= dxWorld;
        this.yMin -= dyWorld;
        this.yMax -= dyWorld;
    }

    zoom(factor, centerX, centerY) {
        const rangeX = this.xMax - this.xMin;
        const rangeY = this.yMax - this.yMin;

        const newRangeX = rangeX * factor;
        const newRangeY = rangeY * factor;

        // Mantém o centro do zoom ancorado na posição do mouse
        const ratioX = (centerX - this.xMin) / rangeX;
        const ratioY = (centerY - this.yMin) / rangeY;

        this.xMin = centerX - newRangeX * ratioX;
        this.xMax = centerX + newRangeX * (1 - ratioX);
        this.yMin = centerY - newRangeY * ratioY;
        this.yMax = centerY + newRangeY * (1 - ratioY);
    }

    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    // --- Renderização de Base ---

    drawAxes(xLabel = 'x', yLabel = 'y') {
        const ctx = this.ctx;
        ctx.save();
        
        ctx.strokeStyle = '#334155'; // Cor do eixo (tema escuro padrão dplane)
        ctx.fillStyle = '#94a3b8';
        ctx.lineWidth = 1.5;
        ctx.font = '14px sans-serif';

        // Determina a posição do zero, mas trava dentro dos limites da tela para o eixo não sumir
        const yZero = this.toScreenY(0);
        const clampedYZero = Math.max(this.padding.top, Math.min(this.height - this.padding.bottom, yZero));
        
        const xZero = this.toScreenX(0);
        const clampedXZero = Math.max(this.padding.left, Math.min(this.width - this.padding.right, xZero));

        // Eixo X
        ctx.beginPath();
        ctx.moveTo(this.padding.left, clampedYZero);
        ctx.lineTo(this.width - this.padding.right, clampedYZero);
        ctx.stroke();

        // Eixo Y
        ctx.beginPath();
        ctx.moveTo(clampedXZero, this.padding.top);
        ctx.lineTo(clampedXZero, this.height - this.padding.bottom);
        ctx.stroke();
        
        // Desenha as legendas dos eixos
        ctx.fillText(xLabel, this.width - this.padding.right + 10, clampedYZero + 4);
        ctx.textAlign = 'center';
        ctx.fillText(yLabel, clampedXZero, this.padding.top - 10);

        ctx.restore();
    }
}

/**
 * Função utilitária para registrar os eventos de mouse (Pan e Zoom) em um canvas
 */
export function setupInteractions(canvas, viewport, onRedraw) {
    let isDragging = false;
    let lastX = 0;
    let lastY = 0;

    canvas.addEventListener('mousedown', (e) => {
        isDragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
        canvas.style.cursor = 'grabbing';
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
        canvas.style.cursor = 'crosshair';
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        
        // Converte o deslocamento em pixels para o deslocamento no mundo matemático
        const dxWorld = (dx / (viewport.width - viewport.padding.left - viewport.padding.right)) * (viewport.xMax - viewport.xMin);
        const dyWorld = -(dy / (viewport.height - viewport.padding.top - viewport.padding.bottom)) * (viewport.yMax - viewport.yMin);
        
        viewport.pan(dxWorld, dyWorld);
        
        lastX = e.clientX;
        lastY = e.clientY;
        
        onRedraw();
    });

    canvas.addEventListener('wheel', (e) => {
        e.preventDefault();
        
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        const worldX = viewport.toWorldX(mouseX);
        const worldY = viewport.toWorldY(mouseY);
        
        // Fator de zoom: scroll para cima (zoom in), para baixo (zoom out)
        const zoomFactor = e.deltaY > 0 ? 1.1 : 0.9;
        
        viewport.zoom(zoomFactor, worldX, worldY);
        onRedraw();
    });
}
