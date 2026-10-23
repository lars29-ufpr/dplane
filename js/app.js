// js/app.js

import { MODELS_1D } from './models.js';
import { compile1DFunction, calculateLyapunov, findFixedPoints } from './math-engine.js';
import { Viewport, setupInteractions } from './viewports.js';
import { CobwebPlot } from './cobweb-plot.js';
import { TimeSeriesPlot } from './time-series.js';
import { BifurcationPlot } from './bifurcation.js';

class DPlaneApp {
    constructor() {
        this.currentModel = null;
        this.currentParams = {};
        this.currentX0 = 0.5;
        this.compiledFunc = null;

        this.initDOM();
        this.initPlots();
        this.populateModelSelector();
        this.loadModel(MODELS_1D[0].id); // Carrega o Logístico por padrão
    }

    initDOM() {
        this.modelSelect = document.getElementById('model-select');
        this.slidersContainer = document.getElementById('sliders-container');
        this.lyapunovDisplay = document.getElementById('lyapunov-value');
        this.x0Input = document.getElementById('x0-input');
        this.x0Slider = document.getElementById('x0-slider');

        this.modelSelect.addEventListener('change', (e) => this.loadModel(e.target.value));
        
        const updateX0 = (val) => {
            this.currentX0 = parseFloat(val);
            this.x0Input.value = this.currentX0.toFixed(3);
            this.x0Slider.value = this.currentX0;
            this.updateSimulation();
        };

        this.x0Slider.addEventListener('input', (e) => updateX0(e.target.value));
        this.x0Input.addEventListener('change', (e) => updateX0(e.target.value));
    }

    initPlots() {
        // Inicializa o Viewport do Cobweb com limites padrão [0, 1]
        const cobwebCanvas = document.getElementById('cobweb-canvas');
        this.cobwebViewport = new Viewport(cobwebCanvas, 0, 1, 0, 1);
        this.cobwebPlot = new CobwebPlot(cobwebCanvas, this.cobwebViewport);
        
        // Adiciona Pan e Zoom interativos ao Cobweb
        setupInteractions(cobwebCanvas, this.cobwebViewport, () => this.updateSimulation());

        // Inicializa a Série Temporal e a Bifurcação
        this.timeSeriesPlot = new TimeSeriesPlot(document.getElementById('timeseries-canvas'));
        this.bifurcationPlot = new BifurcationPlot(document.getElementById('bifurcation-canvas'));
    }

    populateModelSelector() {
        this.modelSelect.innerHTML = '';
        MODELS_1D.forEach(model => {
            const option = document.createElement('option');
            option.value = model.id;
            option.textContent = model.name;
            this.modelSelect.appendChild(option);
        });
    }

    loadModel(modelId) {
        this.currentModel = MODELS_1D.find(m => m.id === modelId);
        this.compiledFunc = compile1DFunction(this.currentModel.formula);
        this.currentX0 = this.currentModel.defaultX0;
        
        // Atualiza a interface do x0 para o domínio do modelo
        this.x0Slider.min = this.currentModel.domain.min;
        this.x0Slider.max = this.currentModel.domain.max;
        this.x0Slider.step = (this.currentModel.domain.max - this.currentModel.domain.min) / 1000;
        this.x0Slider.value = this.currentX0;
        this.x0Input.value = this.currentX0;

        // Reseta o Viewport do Cobweb para o domínio do novo modelo
        this.cobwebViewport.xMin = this.currentModel.domain.min;
        this.cobwebViewport.xMax = this.currentModel.domain.max;
        this.cobwebViewport.yMin = this.currentModel.domain.min;
        this.cobwebViewport.yMax = this.currentModel.domain.max;

        this.buildSliders();
        this.updateSimulation();
    }

    buildSliders() {
        this.slidersContainer.innerHTML = '';
        this.currentParams = {};

        this.currentModel.params.forEach(param => {
            this.currentParams[param.id] = param.default;

            const wrapper = document.createElement('div');
            wrapper.className = 'slider-group';

            const label = document.createElement('label');
            label.textContent = `${param.label}: ${param.default.toFixed(2)}`;

            const slider = document.createElement('input');
            slider.type = 'range';
            slider.min = param.min;
            slider.max = param.max;
            slider.step = param.step;
            slider.value = param.default;

            slider.addEventListener('input', (e) => {
                const val = parseFloat(e.target.value);
                this.currentParams[param.id] = val;
                label.textContent = `${param.label}: ${val.toFixed(2)}`;
                this.updateSimulation();
            });

            wrapper.appendChild(label);
            wrapper.appendChild(slider);
            this.slidersContainer.appendChild(wrapper);
        });
    }

    updateSimulation() {
        if (!this.compiledFunc || !this.currentModel) return;

        // 1. Diagnóstico Analítico
        const lyapunov = calculateLyapunov(this.compiledFunc, this.currentX0, this.currentParams);
        const fixedPoints = findFixedPoints(
            this.compiledFunc, 
            this.currentParams, 
            this.cobwebViewport.xMin, 
            this.cobwebViewport.xMax
        );

        // Atualiza UI de Lyapunov
        if (this.lyapunovDisplay) {
            this.lyapunovDisplay.textContent = `λ = ${isNaN(lyapunov) ? 'Div' : lyapunov.toFixed(3)}`;
            this.lyapunovDisplay.style.color = lyapunov > 0 ? '#ef4444' : '#10b981'; // Vermelho se Caos, Verde se Estável
        }

        // 2. Renderiza Cobweb e Série Temporal em tempo real
        this.cobwebPlot.render(this.compiledFunc, this.currentParams, this.currentX0, fixedPoints, 100);
        
        // Efeito Borboleta na Série Temporal: adiciona 1e-5 ao x0
        this.timeSeriesPlot.render(
            this.compiledFunc, 
            this.currentParams, 
            this.currentX0, 
            this.currentX0 + 1e-5, 
            100, // iterações
            this.currentModel.domain.min, 
            this.currentModel.domain.max
        );
        
        // 3. Atualiza Diagrama de Bifurcação (usando o primeiro parâmetro do modelo como eixo X)
        if (this.currentModel.params.length > 0) {
            const mainParam = this.currentModel.params[0];
            this.bifurcationPlot.render(
                this.compiledFunc,
                this.currentParams,
                mainParam.id,
                mainParam.min,
                mainParam.max,
                this.currentX0,
                this.currentModel.domain.min,
                this.currentModel.domain.max
            );
        }
    }
}

// Inicializa a aplicação assim que o DOM carregar
window.addEventListener('DOMContentLoaded', () => {
    window.dplaneApp = new DPlaneApp();
});
