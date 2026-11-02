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
    }
];
