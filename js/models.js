// js/models.js

export const MODELS_1D = [
    {
        id: "logistic",
        name: "Logístico Canônico",
        formula: "p.r * x * (1 - x)",
        params: [
            { id: "r", label: "Taxa (r)", min: 1.0, max: 4.0, step: 0.01, default: 2.8 }
        ],
        defaultX0: 0.2,
        domain: { min: 0, max: 1 },
        description: "O modelo clássico de bifurcação e caos no intervalo [0, 1]."
    },
    {
        id: "ricker",
        name: "Ricker (Exponencial Discreto)",
        formula: "x * Math.exp(p.r * (1 - x / p.K))",
        params: [
            { id: "r", label: "Taxa intrínseca (r)", min: 0.1, max: 4.0, step: 0.05, default: 2.2 },
            { id: "K", label: "Suporte (K)", min: 10, max: 200, step: 5, default: 100 }
        ],
        defaultX0: 10,
        domain: { min: 0, max: 250 },
        description: "Modelo clássico de ecologia. Não admite populações negativas."
    },
    {
        id: "hassell",
        name: "Hassell (1975) - Insetos",
        formula: "(p.lambda * x) / ((1 + p.a * x) ** p.b)",
        params: [
            { id: "lambda", label: "Crescimento (λ)", min: 1.1, max: 100.0, step: 1.0, default: 50.0 },
            { id: "a", label: "Escala (a)", min: 0.01, max: 1.0, step: 0.01, default: 0.1 },
            { id: "b", label: "Competição (b)", min: 0.1, max: 10.0, step: 0.1, default: 2.5 }
        ],
        defaultX0: 10,
        domain: { min: 0, max: 100 },
        description: "Regulação de densidade severa. Transita de ciclos ao caos se b e λ forem altos."
    },
    {
        id: "allee",
        name: "Efeito Allee (Marotta)",
        formula: "p.a * (x ** 2) * (1 - x)",
        params: [
            { id: "a", label: "Parâmetro (a)", min: 1.0, max: 6.0, step: 0.05, default: 4.5 }
        ],
        defaultX0: 0.5,
        domain: { min: 0, max: 1 },
        description: "Bistabilidade: populações abaixo de um limiar crítico entram em extinção."
    },
    {
        id: "fishery",
        name: "Manejo Pesqueiro com Esforço",
        formula: "(p.b * x) / (p.a + x) - p.E * x",
        params: [
            { id: "a", label: "Meia-saturação (a)", min: 0.1, max: 50.0, step: 1.0, default: 10.0 },
            { id: "b", label: "Máx Recrutamento (b)", min: 1.0, max: 100.0, step: 1.0, default: 50.0 },
            { id: "E", label: "Esforço de Pesca (E)", min: 0.0, max: 5.0, step: 0.05, default: 1.5 }
        ],
        defaultX0: 20,
        domain: { min: 0, max: 50 },
        description: "Modelo de colheita. Esforço excessivo leva a população ao colapso."
    }
];

export const MODELS_2D = [
    // Deixaremos a estrutura pronta para quando formos focar no 2D
    {
        id: "nicholson_bailey",
        name: "Nicholson-Bailey Clássico",
        formulaX: "p.lambda * x * Math.exp(-p.a * y)",
        formulaY: "x * (1 - Math.exp(-p.a * y))",
        params: [
            { id: "lambda", label: "Cresc. Presa (λ)", min: 1.1, max: 5.0, step: 0.1, default: 2.0 },
            { id: "a", label: "Busca Predador (a)", min: 0.01, max: 0.2, step: 0.01, default: 0.06 }
        ],
        defaultX0: 20,
        defaultY0: 10,
        bounds: { xMin: 0, xMax: 80, yMin: 0, yMax: 50 },
        description: "Instabilidade inerente. Trajetórias espiralam para fora até a extinção."
    }
];
