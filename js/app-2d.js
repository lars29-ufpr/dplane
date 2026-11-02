// js/app-2d.js

import { MODELS_2D } from './models-2d.js';
import { Viewport, setupInteractions } from './viewports.js';
import { PhasePlanePlot } from './phase-plane.js';
import { TimeSeries2DPlot } from './time-series-2d.js'; // <-- NOVA IMPORTAÇÃO

class DPlane2DApp {
    constructor() {
        this.currentModel = null;
        this.currentParams = {};
        this.currentX0 = 0.0;
        this.currentY0 = 0.5;
        this.iterations = 50000;

        this.initDOM();
        this.initPlots();
        this.populateModelSelector();
        this.loadModel(MODELS_2D[0].id);
    }

    initDOM() {
        this.modelSelect = document.getElementById('model-select');
        this.slidersContainer = document.getElementById('sliders-container');
        this.x0Slider = document.getElementById('x0-slider');
        this.x0Input = document.getElementById('x0-input');
        this.y0Slider = document.getElementById('y0-slider');
        this.y0Input = document.getElementById('y0-input');
        this.iterBadge = document.getElementById('iterations-value');

        this.modelSelect.addEventListener('change', (e) => this.loadModel(e.target.value));

        const updateInitialConditions = () => {
            this.currentX0 = parseFloat(this.x0Slider.value);
            this.x0Input.value = this.currentX0.toFixed(2);
            this.currentY0 = parseFloat(this.y0Slider.value);
            this.y0Input.value = this.currentY0.toFixed(2);
            this.updateSimulation();
        };

        this.x0Slider.addEventListener('input', updateInitialConditions);
        this.x0Input.addEventListener('change', (e) => { this.x0Slider.value = e.target.value; updateInitialConditions(); });
        this.y0Slider.addEventListener('input', updateInitialConditions);
        this.y0Input.addEventListener('change', (e) => { this.y0Slider.value = e.target.value; updateInitialConditions(); });
    }

    initPlots() {
        // Plano de Fases
        const canvas = document.getElementById('phase-plane-canvas');
        this.viewport = new Viewport(canvas, -20, 20, -20, 20);
        this.phasePlane = new PhasePlanePlot(canvas, this.viewport);
        setupInteractions(canvas, this.viewport, () => this.updateSimulation());

        // NOVO: Inicializa a Série Temporal
        const tsCanvas = document.getElementById('timeseries-2d-canvas');
        this.timeSeriesPlot = new TimeSeries2DPlot(tsCanvas);
    }

    populateModelSelector() {
        this.modelSelect.innerHTML = '';
        MODELS_2D.forEach(model => {
            const option = document.createElement('option');
            option.value = model.id;
            option.textContent = model.nameFallback;
            this.modelSelect.appendChild(option);
        });
    }

    loadModel(modelId) {
        this.currentModel = MODELS_2D.find(m => m.id === modelId);
        this.currentX0 = this.currentModel.defaultX0;
        this.currentY0 = this.currentModel.defaultY0;
        
        this.x0Slider.value = this.currentX0;
        this.x0Input.value = this.currentX0;
        this.y0Slider.value = this.currentY0;
        this.y0Input.value = this.currentY0;

        this.viewport.xMin = this.currentModel.domainX.min;
        this.viewport.xMax = this.currentModel.domainX.max;
        this.viewport.yMin = this.currentModel.domainY.min;
        this.viewport.yMax = this.currentModel.domainY.max;

        this.buildSliders();
        this.updateSimulation();
    }

    buildSliders() {
        this.slidersContainer.innerHTML = '';
        this.currentParams = {};

        if (!this.currentModel.params) return;

        this.currentModel.params.forEach(param => {
            this.currentParams[param.id] = param.default;
            const wrapper = document.createElement('div');
            wrapper.className = 'slider-group';

            const label = document.createElement('label');
            label.textContent = `${param.id} (μ): ${param.default.toFixed(3)}`;

            const slider = document.createElement('input');
            slider.type = 'range';
            slider.min = param.min;
            slider.max = param.max;
            slider.step = param.step;
            slider.value = param.default;

            slider.addEventListener('input', (e) => {
                const val = parseFloat(e.target.value);
                this.currentParams[param.id] = val;
                label.textContent = `${param.id} (μ): ${val.toFixed(3)}`;
                this.updateSimulation();
            });

            wrapper.appendChild(label);
            wrapper.appendChild(slider);
            this.slidersContainer.appendChild(wrapper);
        });
    }

    updateSimulation() {
        if (!this.currentModel) return;
        
        this.iterBadge.textContent = this.iterations.toLocaleString('pt-BR');

        // Renderiza o Plano de Fases
        this.phasePlane.render(
            this.currentModel.step,
            this.currentParams,
            this.currentX0,
            this.currentY0,
            this.iterations
        );

        // NOVO: Renderiza a Série Temporal
        this.timeSeriesPlot.render(
            this.currentModel.step,
            this.currentParams,
            this.currentX0,
            this.currentY0,
            150 // Desenha os primeiros 150 passos temporais
        );
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.dplane2DApp = new DPlane2DApp();
});
