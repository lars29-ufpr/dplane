// js/app.js

import { MODELS_1D } from './models.js';
import { compile1DFunction, calculateLyapunov, findFixedPoints } from './math-engine.js';
import { Viewport, setupInteractions } from './viewports.js';
import { CobwebPlot } from './cobweb-plot.js';
import { TimeSeriesPlot } from './time-series.js';
import { BifurcationPlot } from './bifurcation.js';
import { setLanguage, currentLang, translations } from './i18n.js'; 

class DPlaneApp {
    constructor() {
        this.currentModel = null;
        this.currentParams = {};
        this.currentX0 = 0.5;
        this.compiledFunc = null;

        this.initDOM();
        this.initPlots();
        
        // Popula a lista antes de carregar
        this.populateModelSelector();
        this.loadModel(MODELS_1D[0].id);

        // CORREÇÃO: A tradução inicial só deve ocorrer APÓS o modelo base estar carregado
        if (this.langSelect) {
            setLanguage(this.langSelect.value);
        }
    }

    initDOM() {
        this.modelSelect = document.getElementById('model-select');
        this.slidersContainer = document.getElementById('sliders-container');
        this.lyapunovDisplay = document.getElementById('lyapunov-value');
        this.x0Input = document.getElementById('x0-input');
        this.x0Slider = document.getElementById('x0-slider');

        this.langSelect = document.getElementById('lang-select');
        this.langSelect.addEventListener('change', (e) => setLanguage(e.target.value));
        
        // A primeira tradução foi movida daqui para o final do constructor.

        window.addEventListener('languageChanged', (e) => {
            this.populateModelSelector();
            // CORREÇÃO: Só reconstrói os sliders se já existir um modelo carregado
            if (this.currentModel) {
                this.buildSliders();
            }
        });

        this.modelSelect.addEventListener('change', (e) => this.loadModel(e.target.value));
        
        const updateX0 = (val) => {
            this.currentX0 = parseFloat(val);
            this.x0Input.value = this.currentX0.toFixed(3);
            this.x0Slider.value = this.currentX0;
            this.updateSimulation(false); 
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
        const currentSelection = this.modelSelect.value;
        this.modelSelect.innerHTML = '';
        
        MODELS_1D.forEach(model => {
            const option = document.createElement('option');
            option.value = model.id;
            const translatedName = translations[currentLang][model.nameKey] || model.id;
            option.textContent = translatedName;
            this.modelSelect.appendChild(option);
        });

        if (currentSelection) {
             this.modelSelect.value = currentSelection;
        }
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

        const bifConfig = this.currentModel.bifurcationConfig;
        if (bifConfig) {
            this.bifurcationViewport.xMin = bifConfig.xMin;
            this.bifurcationViewport.xMax = bifConfig.xMax;
            this.bifurcationViewport.yMin = bifConfig.yMin;
            this.bifurcationViewport.yMax = bifConfig.yMax;
        }

        this.buildSliders();
        this.updateSimulation(true); 
    }

    buildSliders() {
        // CORREÇÃO DE SEGURANÇA: Aborta se o modelo ainda não existir
        if (!this.currentModel || !this.currentModel.params) return;

        this.slidersContainer.innerHTML = '';
        this.currentParams = {};

        this.currentModel.params.forEach((param, index) => {
            this.currentParams[param.id] = param.default;
            const wrapper = document.createElement('div');
            wrapper.className = 'slider-group';

            const label = document.createElement('label');
            const translatedLabel = translations[currentLang][param.labelKey] || param.id;
            label.textContent = `${translatedLabel}: ${param.default.toFixed(2)}`;

            const controlRow = document.createElement('div');
            controlRow.className = 'slider-bounds-row';

            const minInput = document.createElement('input');
            minInput.type = 'number';
            minInput.className = 'bound-input';
            minInput.value = param.min;
            minInput.step = 'any';
            minInput.title = "Mín"; 

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
            maxInput.title = "Máx";

            const isBifurcationParam = this.currentModel.bifurcationConfig && 
                                       this.currentModel.bifurcationConfig.paramX === param.id;

            slider.addEventListener('input', (e) => {
                const val = parseFloat(e.target.value);
                this.currentParams[param.id] = val;
                label.textContent = `${translatedLabel}: ${val.toFixed(2)}`;
                this.updateSimulation(!isBifurcationParam, param.id, val);
            });

            minInput.addEventListener('change', (e) => {
                const newMin = parseFloat(e.target.value);
                if (!isNaN(newMin) && newMin < parseFloat(slider.max)) {
                    slider.min = newMin;
                    if (parseFloat(slider.value) < newMin) {
                        slider.value = newMin;
                        slider.dispatchEvent(new Event('input'));
                    }
                    if (isBifurcationParam) {
                        this.bifurcationViewport.xMin = newMin;
                        this.updateSimulation(true);
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
                    if (isBifurcationParam) {
                        this.bifurcationViewport.xMax = newMax;
                        this.updateSimulation(true);
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
        if (!this.compiledFunc || !this.currentModel) return;
        
        if (!this.currentModel.bifurcationConfig) {
            this.bifurcationViewport.clear(); 
            return;
        }

        const paramToSweep = this.currentModel.bifurcationConfig.paramX;
        this.bifurcationPlot.render(
            this.compiledFunc,
            this.currentParams,
            paramToSweep,
            this.currentX0,
            2000, // <-- CORREÇÃO: Aquecimento (burn-in) aumentado de 200 para 2000
            200   // Quantidade de pontos desenhados por pixel vertical
        );
    }
    updateSimulation(fullReRender = true, changedParamId = null, changedParamValue = null) {
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
        
        if (fullReRender) {
            this.updateBifurcationOnly();
        } else if (changedParamId && this.currentModel.bifurcationConfig && this.currentModel.bifurcationConfig.paramX === changedParamId) {
            this.bifurcationPlot.drawParamIndicator(changedParamValue);
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.dplaneApp = new DPlaneApp();
});
