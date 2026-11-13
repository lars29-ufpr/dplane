// js/app-2d.js

import { setLanguage, currentLang, translations } from './i18n.js';
import { MODELS_2D } from './models-2d.js';
import { Viewport, setupInteractions } from './viewports.js';
import { PhasePlanePlot } from './phase-plane.js';
import { TimeSeries2DPlot } from './time-series-2d.js';

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

        if (this.langSelect) {
            setLanguage(this.langSelect.value);
        }
    }

    initDOM() {
        this.langSelect = document.getElementById('lang-select');
        if (this.langSelect) {
            this.langSelect.addEventListener('change', (e) => setLanguage(e.target.value));
        }

        window.addEventListener('languageChanged', () => {
            this.populateModelSelector();
            if (this.currentModel) {
                this.modelSelect.value = this.currentModel.id;
                this.buildSliders(true); // true = preserva valores atuais dos sliders ao trocar idioma
            }
        });

        this.modelSelect = document.getElementById('model-select');
        this.slidersContainer = document.getElementById('sliders-container');
        this.x0Slider = document.getElementById('x0-slider');
        this.x0Input = document.getElementById('x0-input');
        this.y0Slider = document.getElementById('y0-slider');
        this.y0Input = document.getElementById('y0-input');
        this.iterBadge = document.getElementById('iterations-value');

        this.iterSlider = document.getElementById('iterations-slider');
        if (this.iterSlider) {
            this.iterSlider.addEventListener('input', (e) => {
                this.iterations = parseInt(e.target.value, 10);
                this.updateSimulation();
            });
        }

        this.modelSelect.addEventListener('change', (e) => this.loadModel(e.target.value));

        const updateFromSliders = () => {
            this.currentX0 = parseFloat(this.x0Slider.value);
            this.x0Input.value = this.currentX0.toFixed(2);
            this.currentY0 = parseFloat(this.y0Slider.value);
            this.y0Input.value = this.currentY0.toFixed(2);
            this.updateSimulation();
        };

        this.x0Slider.addEventListener('input', updateFromSliders);
        this.x0Input.addEventListener('change', (e) => {
            this.x0Slider.value = e.target.value;
            updateFromSliders();
        });
        this.y0Slider.addEventListener('input', updateFromSliders);
        this.y0Input.addEventListener('change', (e) => {
            this.y0Slider.value = e.target.value;
            updateFromSliders();
        });
    }

    initPlots() {
        const canvas = document.getElementById('phase-plane-canvas');
        this.viewport = new Viewport(canvas, -20, 20, -20, 20);
        this.phasePlane = new PhasePlanePlot(canvas, this.viewport);
        setupInteractions(canvas, this.viewport, () => this.updateSimulation());

        const tsCanvas = document.getElementById('timeseries-2d-canvas');
        this.timeSeriesPlot = new TimeSeries2DPlot(tsCanvas);
    }

    populateModelSelector() {
        const selectedId = this.currentModel ? this.currentModel.id : MODELS_2D[0].id;
        this.modelSelect.innerHTML = '';
        const dict = translations[currentLang] || translations.pt;

        MODELS_2D.forEach(model => {
            const option = document.createElement('option');
            option.value = model.id;
            option.textContent = dict[model.nameKey] || model.nameFallback;
            this.modelSelect.appendChild(option);
        });
        this.modelSelect.value = selectedId;
    }

    loadModel(modelId) {
        this.currentModel = MODELS_2D.find(m => m.id === modelId);
        this.currentX0 = this.currentModel.defaultX0;
        this.currentY0 = this.currentModel.defaultY0;

        // Ajusta o range de x0 e y0 dinamicamente conforme o domínio do modelo
        const dx = this.currentModel.domainX;
        const dy = this.currentModel.domainY;
        const stepX = ((dx.max - dx.min) <= 5) ? 0.01 : 0.1;
        const stepY = ((dy.max - dy.min) <= 5) ? 0.01 : 0.1;

        this.x0Slider.min = dx.min;
        this.x0Slider.max = dx.max;
        this.x0Slider.step = stepX;
        this.x0Input.step = stepX;

        this.y0Slider.min = dy.min;
        this.y0Slider.max = dy.max;
        this.y0Slider.step = stepY;
        this.y0Input.step = stepY;

        this.x0Slider.value = this.currentX0;
        this.x0Input.value = this.currentX0;
        this.y0Slider.value = this.currentY0;
        this.y0Input.value = this.currentY0;

        this.viewport.xMin = dx.min;
        this.viewport.xMax = dx.max;
        this.viewport.yMin = dy.min;
        this.viewport.yMax = dy.max;

        this.buildSliders(false);
        this.updateSimulation();
    }

    buildSliders(preserveValues = false) {
        this.slidersContainer.innerHTML = '';
        if (!preserveValues) {
            this.currentParams = {};
        }

        if (!this.currentModel.params) return;
        const dict = translations[currentLang] || translations.pt;

        this.currentModel.params.forEach(param => {
            const val = (preserveValues && this.currentParams[param.id] !== undefined)
                ? this.currentParams[param.id]
                : param.default;
            this.currentParams[param.id] = val;

            const wrapper = document.createElement('div');
            wrapper.className = 'slider-group';

            const paramLabelText = dict[param.labelKey] || param.id;
            const decimals = (param.step < 0.01) ? 3 : 2;

            const label = document.createElement('label');
            label.textContent = `${paramLabelText}: ${val.toFixed(decimals)}`;

            const slider = document.createElement('input');
            slider.type = 'range';
            slider.min = param.min;
            slider.max = param.max;
            slider.step = param.step;
            slider.value = val;

            slider.addEventListener('input', (e) => {
                const newVal = parseFloat(e.target.value);
                this.currentParams[param.id] = newVal;
                const currentDict = translations[currentLang] || translations.pt;
                const currentLabel = currentDict[param.labelKey] || param.id;
                label.textContent = `${currentLabel}: ${newVal.toFixed(decimals)}`;
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

        this.phasePlane.render(
            this.currentModel.step,
            this.currentParams,
            this.currentX0,
            this.currentY0,
            this.iterations
        );

        this.timeSeriesPlot.render(
            this.currentModel.step,
            this.currentParams,
            this.currentX0,
            this.currentY0,
            150
        );
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.dplane2DApp = new DPlane2DApp();
});
