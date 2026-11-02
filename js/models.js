// js/models.js

export const MODELS_1D = [
    {
        id: "blank",
        nameKey: "model.blank.name",
        formula: "x",
        params: [], 
        defaultX0: 0.5,
        domain: { min: -5, max: 5 },
        descKey: "model.blank.desc",
        bifurcationConfig: null 
    },
    {
        id: "logistic",
        nameKey: "model.logistic.name",
        formula: "p.r * x * (1 - x)",
        params: [
            { id: "r", labelKey: "model.logistic.param.r", min: 1.0, max: 4.0, step: 0.01, default: 2.8 }
        ],
        defaultX0: 0.2,
        domain: { min: 0, max: 1 },
        descKey: "model.logistic.desc",
        bifurcationConfig: { paramX: "r", xMin: 1.0, xMax: 4.0, yMin: 0, yMax: 1 }
    },
    {
        id: "ricker",
        nameKey: "model.ricker.name",
        formula: "x * Math.exp(p.r * (1 - x / p.K))",
        params: [
            { id: "r", labelKey: "model.ricker.param.r", min: 0.1, max: 4.0, step: 0.05, default: 2.2 },
            { id: "K", labelKey: "model.ricker.param.k", min: 10, max: 200, step: 5, default: 100 }
        ],
        defaultX0: 10,
        domain: { min: 0, max: 250 },
        descKey: "model.ricker.desc",
        bifurcationConfig: { paramX: "r", xMin: 0.1, xMax: 4.0, yMin: 0, yMax: 250 }
    },
    {
        id: "hassell",
        nameKey: "model.hassell.name",
        formula: "(p.lambda * x) / ((1 + p.a * x) ** p.b)",
        params: [
            { id: "lambda", labelKey: "model.hassell.param.lambda", min: 1.1, max: 100.0, step: 1.0, default: 50.0 },
            { id: "a", labelKey: "model.hassell.param.a", min: 0.01, max: 1.0, step: 0.01, default: 0.1 },
            { id: "b", labelKey: "model.hassell.param.b", min: 0.1, max: 10.0, step: 0.1, default: 2.5 }
        ],
        defaultX0: 10,
        domain: { min: 0, max: 100 },
        descKey: "model.hassell.desc",
        bifurcationConfig: { paramX: "lambda", xMin: 1.1, xMax: 100.0, yMin: 0, yMax: 100 }
    },
    {
        id: "allee",
        nameKey: "model.allee.name",
        formula: "p.a * (x ** 2) * (1 - x)",
        params: [
            { id: "a", labelKey: "model.allee.param.a", min: 1.0, max: 6.0, step: 0.05, default: 4.5 }
        ],
        defaultX0: 0.5,
        domain: { min: 0, max: 1 },
        descKey: "model.allee.desc",
        bifurcationConfig: { paramX: "a", xMin: 1.0, xMax: 6.0, yMin: 0, yMax: 1 }
    },
    {
        id: "fishery",
        nameKey: "model.fishery.name",
        formula: "(p.b * x) / (p.a + x) - p.E * x",
        params: [
            { id: "a", labelKey: "model.fishery.param.a", min: 0.1, max: 50.0, step: 1.0, default: 10.0 },
            { id: "b", labelKey: "model.fishery.param.b", min: 1.0, max: 100.0, step: 1.0, default: 50.0 },
            { id: "E", labelKey: "model.fishery.param.e", min: 0.0, max: 5.0, step: 0.05, default: 1.5 }
        ],
        defaultX0: 20,
        domain: { min: 0, max: 50 },
        descKey: "model.fishery.desc",
        bifurcationConfig: { paramX: "E", xMin: 0.0, xMax: 5.0, yMin: 0, yMax: 50 }
    }
];

export const MODELS_2D = [
    {
        id: "nicholson_bailey",
        nameKey: "model.nb.name",
        formulaX: "p.lambda * x * Math.exp(-p.a * y)",
        formulaY: "x * (1 - Math.exp(-p.a * y))",
        params: [
            { id: "lambda", labelKey: "model.nb.param.lambda", min: 1.1, max: 5.0, step: 0.1, default: 2.0 },
            { id: "a", labelKey: "model.nb.param.a", min: 0.01, max: 0.2, step: 0.01, default: 0.06 }
        ],
        defaultX0: 20,
        defaultY0: 10,
        bounds: { xMin: 0, xMax: 80, yMin: 0, yMax: 50 },
        descKey: "model.nb.desc"
    }
];
