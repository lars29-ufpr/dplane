// js/models-2d.js

export const MODELS_2D = [
    {
        id: 'gumowski_mira',
        nameKey: 'model.gumowski.name', 
        nameFallback: 'Mapa de Gumowski-Mira (CERN)',
        defaultX0: 0.0,
        defaultY0: 0.5,
        domainX: { min: -20, max: 20 },
        domainY: { min: -20, max: 20 },
        params: [
            { id: 'mu', labelKey: 'model.gumowski.param.mu', default: -0.496, min: -1.0, max: 1.0, step: 0.001 },
            { id: 'a', labelKey: 'model.gumowski.param.a', default: 0.008, min: -0.05, max: 0.05, step: 0.001 },
            { id: 'b', labelKey: 'model.gumowski.param.b', default: 0.05, min: 0, max: 0.1, step: 0.001 }
        ],
        step: function(x, y, p) {
            const G = (v) => p.mu * v + (2 * (1 - p.mu) * v * v) / (1 + v * v);
            const nextX = y + p.a * y * (1 - p.b * y * y) + G(x);
            const nextY = -x + G(nextX);
            return { x: nextX, y: nextY };
        }
    },
    {
        id: 'ikeda',
        nameKey: 'model.ikeda.name',
        nameFallback: 'Mapa de Ikeda (Ótica Não-Linear)',
        defaultX0: 0.1,
        defaultY0: 0.0,
        domainX: { min: -2, max: 2 },
        domainY: { min: -2, max: 2 },
        params: [
            { id: 'u', labelKey: 'model.ikeda.param.u', default: 0.9, min: 0.5, max: 1.0, step: 0.01 }
        ],
        step: function(x, y, p) {
            const t = 0.4 - 6.0 / (1 + x * x + y * y);
            const nextX = 1 + p.u * (x * Math.cos(t) - y * Math.sin(t));
            const nextY = p.u * (x * Math.sin(t) + y * Math.cos(t));
            return { x: nextX, y: nextY };
        }
    },
    {
        id: 'gingerbreadman',
        nameKey: 'model.gingerbread.name',
        nameFallback: 'Homem de Gengibre (Caos Geométrico)',
        defaultX0: -0.1,
        defaultY0: 0.0,
        domainX: { min: -10, max: 10 },
        domainY: { min: -10, max: 10 },
        params: [], // Este modelo não precisa de parâmetros para gerar o atrator
        step: function(x, y, p) {
            return {
                x: 1 - y + Math.abs(x),
                y: x
            };
        }
    },
{
        id: 'tinkerbell',
        nameKey: 'model.tinkerbell.name',
        nameFallback: 'Mapa Tinkerbell (Sistemas Dinâmicos)',
        defaultX0: -0.72,
        defaultY0: -0.64,
        domainX: { min: -1.5, max: 0.5 },
        domainY: { min: -2.0, max: 1.0 },
        params: [
            { id: 'a', labelKey: 'model.tinkerbell.param.a', default: 0.9, min: 0.5, max: 1.2, step: 0.01 },
            { id: 'b', labelKey: 'model.tinkerbell.param.b', default: -0.6013, min: -1.0, max: 0.0, step: 0.001 },
            { id: 'c', labelKey: 'model.tinkerbell.param.c', default: 2.0, min: 1.0, max: 3.0, step: 0.01 },
            { id: 'd', labelKey: 'model.tinkerbell.param.d', default: 0.5, min: 0.0, max: 1.0, step: 0.01 }
        ],
        step: function(x, y, p) {
            return {
                x: (x * x) - (y * y) + p.a * x + p.b * y,
                y: 2 * x * y + p.c * x + p.d * y
            };
        }
    },
    {
        id: 'standard_map',
        nameKey: 'model.standard.name',
        nameFallback: 'Mapa Padrão de Chirikov (Física Quântica/Plasma)',
        defaultX0: 0.1,
        defaultY0: 0.1,
        domainX: { min: 0, max: 2 * Math.PI },
        domainY: { min: 0, max: 2 * Math.PI },
        params: [
            { id: 'K', labelKey: 'model.standard.param.k', default: 0.9716, min: 0.0, max: 5.0, step: 0.01 }
        ],
        step: function(x, y, p) {
            // O Mapa Padrão opera no toro [0, 2π) x [0, 2π)
            const TWO_PI = 2 * Math.PI;
            const nextY = y + p.K * Math.sin(x);
            const nextX = x + nextY;
            
            // Função auxiliar de módulo real para lidar com números negativos no JS
            const mod = (val, m) => ((val % m) + m) % m;
            
            return { 
                x: mod(nextX, TWO_PI), 
                y: mod(nextY, TWO_PI) 
            };
        }
    },
    {
        id: 'beddington_free_lawton',
        nameKey: 'model.beddington.name',
        nameFallback: 'Hospedeiro-Parasitoide (Ecologia)',
        defaultX0: 10.0,
        defaultY0: 10.0,
        domainX: { min: 0, max: 60 },
        domainY: { min: 0, max: 25 },
        params: [
            { id: 'r', labelKey: 'model.beddington.param.r', default: 1.5, min: 0.1, max: 3.5, step: 0.1 },
            { id: 'K', labelKey: 'model.beddington.param.k', default: 50.0, min: 10, max: 100, step: 1 },
            { id: 'a', labelKey: 'model.beddington.param.a', default: 0.1, min: 0.01, max: 0.5, step: 0.01 },
            { id: 'c', labelKey: 'model.beddington.param.c', default: 0.5, min: 0.1, max: 2.0, step: 0.1 }
        ],
        step: function(x, y, p) {
            // x = Hospedeiro, y = Parasitoide
            // Usamos Math.max(0, val) para evitar que populações fiquem negativas num passo longo
            const nextX = x * Math.exp(p.r * (1 - x / p.K) - p.a * y);
            const nextY = p.c * x * (1 - Math.exp(-p.a * y));
            return { 
                x: Math.max(0, nextX), 
                y: Math.max(0, nextY) 
            };
        }
    },
    {
        id: 'cournot_duopoly',
        nameKey: 'model.cournot.name',
        nameFallback: 'Duopólio de Cournot (Economia)',
        defaultX0: 0.2,
        defaultY0: 0.2,
        domainX: { min: 0, max: 1.2 },
        domainY: { min: 0, max: 1.2 },
        params: [
            { id: 'v', labelKey: 'model.cournot.param.v', default: 1.5, min: 0.1, max: 4.0, step: 0.05 },
            { id: 'c', labelKey: 'model.cournot.param.c', default: 0.1, min: 0.0, max: 0.5, step: 0.01 }
        ],
        step: function(x, y, p) {
            // Modelo de racionalidade limitada para duas empresas competindo no mercado
            const nextX = x * (1 + p.v * (1 - p.c - 2 * x - y));
            const nextY = y * (1 + p.v * (1 - p.c - x - 2 * y));
            return { 
                x: Math.max(0, nextX), 
                y: Math.max(0, nextY) 
            };
        }
    }
];
