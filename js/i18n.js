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
        "model.fishery.param.e": "Esforço de Pesca (E)",

        // --- Chaves do Módulo 2D ---
        "title.module2d": "Módulo 2D (Sandbox)",
        "label.iterations": "Iterações:",
        "label.initial_condition_x": "Condição Inicial (x₀)",
        "label.initial_condition_y": "Condição Inicial (y₀)",
        "label.model2d": "Modelo Dinâmico 2D",
        "plot.phaseplane": "Plano de Fases (Phase Plane)",
        "plot.timeseries2d": "Série Temporal (X e Y vs n)",

        // --- Modelos 2D ---
        "model.gumowski.name": "Mapa de Gumowski-Mira (CERN)",
        "model.gumowski.param.mu": "Parâmetro (μ)",
        "model.gumowski.param.a": "Dissipação (a)",
        "model.gumowski.param.b": "Não-linearidade (b)",

        "model.ikeda.name": "Mapa de Ikeda (Ótica Não-Linear)",
        "model.ikeda.param.u": "Dissipação (u)",

        "model.gingerbread.name": "Homem de Gengibre (Caos Geométrico)",

        "model.tinkerbell.name": "Mapa Tinkerbell",
        "model.tinkerbell.param.a": "Parâmetro (a)",
        "model.tinkerbell.param.b": "Parâmetro (b)",
        "model.tinkerbell.param.c": "Parâmetro (c)",
        "model.tinkerbell.param.d": "Parâmetro (d)",

        "model.standard.name": "Mapa Padrão (Chirikov)",
        "model.standard.param.k": "Força (K)",

        "model.beddington.name": "Hospedeiro-Parasitoide (Ecologia)",
        "model.beddington.param.r": "Crescimento H (r)",
        "model.beddington.param.k": "Suporte H (K)",
        "model.beddington.param.a": "Eficiência Busca (a)",
        "model.beddington.param.c": "Conversão (c)",

        "model.cournot.name": "Duopólio de Cournot (Economia)",
        "model.cournot.param.v": "Velocidade Ajuste (v)",
        "model.cournot.param.c": "Custo Marginal (c)"
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
        "model.fishery.param.e": "Fishing Effort (E)",

        // --- 2D Module Keys ---
        "title.module2d": "2D Module (Sandbox)",
        "label.iterations": "Iterations:",
        "label.initial_condition_x": "Initial Condition (x₀)",
        "label.initial_condition_y": "Initial Condition (y₀)",
        "label.model2d": "2D Dynamical Model",
        "plot.phaseplane": "Phase Plane",
        "plot.timeseries2d": "Time Series (X and Y vs n)",

        // --- 2D Models ---
        "model.gumowski.name": "Gumowski-Mira Map (CERN)",
        "model.gumowski.param.mu": "Parameter (μ)",
        "model.gumowski.param.a": "Dissipation (a)",
        "model.gumowski.param.b": "Nonlinearity (b)",

        "model.ikeda.name": "Ikeda Map (Nonlinear Optics)",
        "model.ikeda.param.u": "Dissipation (u)",

        "model.gingerbread.name": "Gingerbreadman (Geometric Chaos)",

        "model.tinkerbell.name": "Tinkerbell Map",
        "model.tinkerbell.param.a": "Parameter (a)",
        "model.tinkerbell.param.b": "Parameter (b)",
        "model.tinkerbell.param.c": "Parameter (c)",
        "model.tinkerbell.param.d": "Parameter (d)",

        "model.standard.name": "Standard Map (Chirikov)",
        "model.standard.param.k": "Force (K)",

        "model.beddington.name": "Host-Parasitoid (BFL Ecology)",
        "model.beddington.param.r": "Host Growth (r)",
        "model.beddington.param.k": "Carrying Cap (K)",
        "model.beddington.param.a": "Search Effic. (a)",
        "model.beddington.param.c": "Conversion (c)",

        "model.cournot.name": "Cournot Duopoly (Economics)",
        "model.cournot.param.v": "Adjustment Speed (v)",
        "model.cournot.param.c": "Marginal Cost (c)"
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
        "model.fishery.param.e": "Esfuerzo de Pesca (E)",

        // --- Claves del Módulo 2D ---
        "title.module2d": "Módulo 2D (Sandbox)",
        "label.iterations": "Iteraciones:",
        "label.initial_condition_x": "Condición Inicial (x₀)",
        "label.initial_condition_y": "Condición Inicial (y₀)",
        "label.model2d": "Modelo Dinámico 2D",
        "plot.phaseplane": "Plano de Fases (Phase Plane)",
        "plot.timeseries2d": "Serie Temporal (X e Y vs n)",

        // --- Modelos 2D ---
        "model.gumowski.name": "Mapa de Gumowski-Mira (CERN)",
        "model.gumowski.param.mu": "Parámetro (μ)",
        "model.gumowski.param.a": "Disipación (a)",
        "model.gumowski.param.b": "No linealidad (b)",

        "model.ikeda.name": "Mapa de Ikeda (Óptica No Lineal)",
        "model.ikeda.param.u": "Disipación (u)",

        "model.gingerbread.name": "Hombre de Jengibre (Caos Geométrico)",

        "model.tinkerbell.name": "Mapa Tinkerbell",
        "model.tinkerbell.param.a": "Parámetro (a)",
        "model.tinkerbell.param.b": "Parámetro (b)",
        "model.tinkerbell.param.c": "Parámetro (c)",
        "model.tinkerbell.param.d": "Parámetro (d)",

        "model.standard.name": "Mapa Estándar (Chirikov)",
        "model.standard.param.k": "Fuerza (K)",

        "model.beddington.name": "Huésped-Parasitoide (Ecología)",
        "model.beddington.param.r": "Crecimiento H (r)",
        "model.beddington.param.k": "Capacidad Carga (K)",
        "model.beddington.param.a": "Eficacia Búsqueda (a)",
        "model.beddington.param.c": "Conversión (c)",

        "model.cournot.name": "Duopolio de Cournot (Economía)",
        "model.cournot.param.v": "Velocidad Ajuste (v)",
        "model.cournot.param.c": "Coste Marginal (c)"
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
