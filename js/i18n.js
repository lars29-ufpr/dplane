// js/i18n.js

export const translations = {
    pt: {
        "title.main": "dplane",
        "title.module": "Módulo 1D",
        "label.lyapunov": "Expoente de Lyapunov:",
        "label.model": "Modelo Dinâmico",
        "label.initial_condition": "Condição Inicial (x₀)",
        "tips.title": "Dicas:",
        "tips.zoom": "Role a roda do mouse sobre o gráfico para dar Zoom.",
        "tips.pan": "Clique e arraste para mover a janela (Pan).",
        "tips.butterfly": "Observe o Efeito Borboleta na série temporal quando λ > 0.",
        "plot.cobweb": "Diagrama de Teia (Cobweb)",
        "plot.timeseries": "Série Temporal (Órbita Dupla)",
        "plot.bifurcation": "Diagrama de Bifurcação 1D",
        
        "model.blank.name": "Modelo em Branco",
        "model.blank.desc": "Crie seu próprio modelo definindo a equação e os parâmetros.",
        "model.logistic.name": "Logístico Canônico",
        "model.logistic.desc": "O modelo clássico de bifurcação e caos no intervalo [0, 1].",
        "model.logistic.param.r": "Taxa (r)",
        "model.ricker.name": "Ricker (Exponencial Discreto)",
        "model.ricker.desc": "Modelo clássico de ecologia. Não admite populações negativas.",
        "model.ricker.param.r": "Taxa intrínseca (r)",
        "model.ricker.param.k": "Suporte (K)",
        "model.hassell.name": "Hassell (1975) - Insetos",
        "model.hassell.desc": "Regulação de densidade severa. Transita de ciclos ao caos se b e λ forem altos.",
        "model.hassell.param.lambda": "Crescimento (λ)",
        "model.hassell.param.a": "Escala (a)",
        "model.hassell.param.b": "Competição (b)",
        "model.allee.name": "Efeito Allee (Marotta)",
        "model.allee.desc": "Bistabilidade: populações abaixo de um limiar crítico entram em extinção.",
        "model.allee.param.a": "Parâmetro (a)",
        "model.fishery.name": "Manejo Pesqueiro com Esforço",
        "model.fishery.desc": "Modelo de colheita. Esforço excessivo leva a população ao colapso.",
        "model.fishery.param.a": "Meia-saturação (a)",
        "model.fishery.param.b": "Máx Recrutamento (b)",
        "model.fishery.param.e": "Esforço de Pesca (E)"
    },
    en: {
        "title.main": "dplane",
        "title.module": "1D Module",
        "label.lyapunov": "Lyapunov Exponent:",
        "label.model": "Dynamical Model",
        "label.initial_condition": "Initial Condition (x₀)",
        "tips.title": "Tips:",
        "tips.zoom": "Use the mouse wheel over the plot to Zoom.",
        "tips.pan": "Click and drag to move the viewport (Pan).",
        "tips.butterfly": "Observe the Butterfly Effect in the time series when λ > 0.",
        "plot.cobweb": "Cobweb Plot",
        "plot.timeseries": "Time Series (Dual Orbit)",
        "plot.bifurcation": "1D Bifurcation Diagram",

        "model.blank.name": "Blank Model",
        "model.blank.desc": "Create your own model by defining the equation and parameters.",
        "model.logistic.name": "Canonical Logistic",
        "model.logistic.desc": "The classic model of bifurcation and chaos on the interval [0, 1].",
        "model.logistic.param.r": "Rate (r)",
        "model.ricker.name": "Ricker (Discrete Exponential)",
        "model.ricker.desc": "Classic ecology model. Does not allow negative populations.",
        "model.ricker.param.r": "Intrinsic rate (r)",
        "model.ricker.param.k": "Carrying capacity (K)",
        "model.hassell.name": "Hassell (1975) - Insects",
        "model.hassell.desc": "Severe density regulation. Transitions from cycles to chaos if b and λ are high.",
        "model.hassell.param.lambda": "Growth (λ)",
        "model.hassell.param.a": "Scale (a)",
        "model.hassell.param.b": "Competition (b)",
        "model.allee.name": "Allee Effect (Marotta)",
        "model.allee.desc": "Bistability: populations below a critical threshold go extinct.",
        "model.allee.param.a": "Parameter (a)",
        "model.fishery.name": "Fishery Management",
        "model.fishery.desc": "Harvesting model. Excessive effort leads to population collapse.",
        "model.fishery.param.a": "Half-saturation (a)",
        "model.fishery.param.b": "Max Recruitment (b)",
        "model.fishery.param.e": "Fishing Effort (E)"
    },
    es: {
        "title.main": "dplane",
        "title.module": "Módulo 1D",
        "label.lyapunov": "Exponente de Lyapunov:",
        "label.model": "Modelo Dinámico",
        "label.initial_condition": "Condición Inicial (x₀)",
        "tips.title": "Consejos:",
        "tips.zoom": "Usa la rueda del ratón sobre el gráfico para acercar.",
        "tips.pan": "Haz clic y arrastra para mover la ventana (Pan).",
        "tips.butterfly": "Observa el Efecto Mariposa en la serie temporal cuando λ > 0.",
        "plot.cobweb": "Diagrama de Telaraña",
        "plot.timeseries": "Serie Temporal (Órbita Doble)",
        "plot.bifurcation": "Diagrama de Bifurcación 1D",

        "model.blank.name": "Modelo en Blanco",
        "model.blank.desc": "Crea tu propio modelo definiendo la ecuación y los parámetros.",
        "model.logistic.name": "Logístico Canónico",
        "model.logistic.desc": "El modelo clásico de bifurcación y caos en el intervalo [0, 1].",
        "model.logistic.param.r": "Tasa (r)",
        "model.ricker.name": "Ricker (Exponencial Discreto)",
        "model.ricker.desc": "Modelo clásico de ecología. No admite poblaciones negativas.",
        "model.ricker.param.r": "Tasa intrínseca (r)",
        "model.ricker.param.k": "Capacidad de carga (K)",
        "model.hassell.name": "Hassell (1975) - Insectos",
        "model.hassell.desc": "Regulación de densidad severa. Transita de ciclos a caos si b y λ son altos.",
        "model.hassell.param.lambda": "Crecimiento (λ)",
        "model.hassell.param.a": "Escala (a)",
        "model.hassell.param.b": "Competición (b)",
        "model.allee.name": "Efecto Allee (Marotta)",
        "model.allee.desc": "Biestabilidad: poblaciones por debajo de un umbral crítico se extinguen.",
        "model.allee.param.a": "Parámetro (a)",
        "model.fishery.name": "Gestión Pesquera",
        "model.fishery.desc": "Modelo de captura. El esfuerzo excesivo lleva al colapso de la población.",
        "model.fishery.param.a": "Semi-saturación (a)",
        "model.fishery.param.b": "Reclutamiento Máx (b)",
        "model.fishery.param.e": "Esfuerzo de Pesca (E)"
    }
};

export let currentLang = 'pt';

export function setLanguage(lang) {
    if (!translations[lang]) return;
    currentLang = lang;

    const elements = document.querySelectorAll('[data-i18n]');
    
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });

    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
}
