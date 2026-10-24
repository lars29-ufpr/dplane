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
        this.loadModel(MODELS_1D[0].id);
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
        const cobwebCanvas = document.getElementById('cobweb-canvas');
        this.cobwebViewport = new Viewport(cobwebCanvas, 0, 1, 0, 1);
        this.cobwebPlot = new CobwebPlot(cobwebCanvas, this.cobwebViewport);
        setupInteractions(cobwebCanvas, this.cobwebViewport, () => this.updateCobwebOnly());

        this.timeSeriesPlot = new TimeSeriesPlot(document.getElementById('timeseries-canvas'));

        const bifCanvas = document.getElementById('bifurcation-canvas');
        this.bifurcationViewport = new Viewport(bifCanvas, 0, 4, 0, 1);
        this.bifurcationPlot = new BifurcationPlot(bifCanvas, this.bifurcationViewport);
        setupInteractions(bifCanvas, this.bifurcationViewport, () => this.updateBifurcationOnly());
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
        
        this.x0Slider.min = this.currentModel.domain.min;
        this.x0Slider.max = this.currentModel.domain.max;
        this.x0Slider.step = (this.currentModel.domain.max - this.currentModel.domain.min) / 1000;
        this.x0Slider.value = this.currentX0;
        this.x0Input.value = this.currentX0;

        this.cobwebViewport.xMin = this.currentModel.domain.min;
        this.cobwebViewport.xMax = this.currentModel.domain.max;
        this.cobwebViewport.yMin = this.currentModel.domain.min;
        this.cobwebViewport.yMax = this.currentModel.domain.max;

        if (this.currentModel.params.length > 0) {
            const mainParam = this.currentModel.params[0];
            this.bifurcationViewport.xMin = mainParam.min;
            this.bifurcationViewport.xMax = mainParam.max;
            this.bifurcationViewport.yMin = this.currentModel.domain.min;
            this.bifurcationViewport.yMax = this.currentModel.domain.max * 1.2; 
        }

        this.buildSliders();
        this.updateSimulation();
    }

    buildSliders() {
        this.slidersContainer.innerHTML = '';
        this.currentParams = {};

        this.currentModel.params.forEach((param, index) => {
            this.currentParams[param.id] = param.default;
            const wrapper = document.createElement('div');
            wrapper.className = 'slider-group';

            const label = document.createElement('label');
            label.textContent = `${param.label}: ${param.default.toFixed(2)}`;

            const controlRow = document.createElement('div');
            controlRow.className = 'slider-bounds-row';

            const minInput = document.createElement('input');
            minInput.type = 'number';
            minInput.className = 'bound-input';
            minInput.value = param.min;
            minInput.step = 'any';
            minInput.title = "Valor Mínimo";

            const slider = document.createElement('input');
            slider.type = 'range';
            slider.min = param.min;
            slider.max = param.max;
            slider.step = param.step;
            slider.value = param.default;

            const maxInput = document.createElement('input');
            maxInput.type = 'number';
            maxInput.className = 'bound-input';
            maxInput.value = param.max;
            maxInput.step = 'any';
            maxInput.title = "Valor Máximo";

            slider.addEventListener('input', (e) => {
                const val = parseFloat(e.target.value);
                this.currentParams[param.id] = val;
                label.textContent = `${param.label}: ${val.toFixed(2)}`;
                this.updateSimulation();
            });

            minInput.addEventListener('change', (e) => {
                const newMin = parseFloat(e.target.value);
                if (!isNaN(newMin) && newMin < parseFloat(slider.max)) {
                    slider.min = newMin;
                    if (parseFloat(slider.value) < newMin) {
                        slider.value = newMin;
                        slider.dispatchEvent(new Event('input'));
                    }
                    if (index === 0) {
                        this.bifurcationViewport.xMin = newMin;
                        this.updateSimulation();
                    }
                }
            });

            maxInput.addEventListener('change', (e) => {
                const newMax = parseFloat(e.target.value);
                if (!isNaN(newMax) && newMax > parseFloat(slider.min)) {
                    slider.max = newMax;
                    if (parseFloat(slider.value) > newMax) {
                        slider.value = newMax;
                        slider.dispatchEvent(new Event('input'));
                    }
                    if (index === 0) {
                        this.bifurcationViewport.xMax = newMax;
                        this.updateSimulation();
                    }
                }
            });

            controlRow.appendChild(minInput);
            controlRow.appendChild(slider);
            controlRow.appendChild(maxInput);

            wrapper.appendChild(label);
            wrapper.appendChild(controlRow);
            this.slidersContainer.appendChild(wrapper);
        });
    }

    updateCobwebOnly() {
        if (!this.compiledFunc || !this.currentModel) return;
        const fixedPoints = findFixedPoints(this.compiledFunc, this.currentParams, this.cobwebViewport.xMin, this.cobwebViewport.xMax);
        this.cobwebPlot.render(this.compiledFunc, this.currentParams, this.currentX0, fixedPoints, 100);
    }

    updateBifurcationOnly() {
        if (!this.compiledFunc || !this.currentModel || this.currentModel.params.length === 0) return;
        const mainParam = this.currentModel.params[0];
        this.bifurcationPlot.render(
            this.compiledFunc,
            this.currentParams,
            mainParam.id,
            this.currentX0,
            200, 
            200  
        );
    }

    updateSimulation() {
        if (!this.compiledFunc || !this.currentModel) return;

        const lyapunov = calculateLyapunov(this.compiledFunc, this.currentX0, this.currentParams);
        if (this.lyapunovDisplay) {
            this.lyapunovDisplay.textContent = `λ = ${isNaN(lyapunov) ? 'Div' : lyapunov.toFixed(3)}`;
            this.lyapunovDisplay.style.color = lyapunov > 0 ? '#ef4444' : '#10b981';
        }

        this.updateCobwebOnly();
        
        this.timeSeriesPlot.render(
            this.compiledFunc, 
            this.currentParams, 
            this.currentX0, 
            this.currentX0 + 1e-5, 
            100, 
            this.currentModel.domain.min, 
            this.currentModel.domain.max
        );
        
        this.updateBifurcationOnly();
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.dplaneApp = new DPlaneApp();
});
