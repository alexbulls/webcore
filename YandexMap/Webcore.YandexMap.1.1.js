/*
 * WC_YandexMap 1.1
 *
 * Copyright 2020 Alexandr Bykov using Yandex Map API
 *
 * Released under the MIT License
 *
 * Released on: May 08, 2020
 */

class WC_YandexMap {

    init(settings) {

        if (!this._testInitialized()) {
            return;
        }

        this.settings = settings;

        this._createOptions();

        if (!this._createGlobalInitArray() || !this._initOnCurrentPage()) {
            return;
        }

        this._createAttr();
        this._createYaAPI();
        this._createMap();
        this._createCSS();

        this.destroy = this.destroy.bind(this);
        this.createLabels = this.createLabels.bind(this);

    }

    destroy() {

        if (this.constructor.name !== 'WC_YandexMap') {
            const error = new Error(`Class instance context is lost`);
            console.error(error.name + ': ' + error.message);
            return;
        }

        if (!this._testInitialized()) {
            return;
        }
        
        this._yandexMapHas(() => {
            
            this.map.destroy();
            
            const style = document.getElementsByClassName(this.attr.uniqueStyle)[0];
            
            if (style) {
                style.remove();
            }
            
            for (let i = 0; i < window[`_${this.constructor.name}Global`].length; i++) {
                if (window[`_${this.constructor.name}Global`][i] === this.options.id) {
                    window[`_${this.constructor.name}Global`].splice(i, 1);
                    break;
                }
            }
            
            this.map = void 0;
            this.data = void 0;
            this.attr = void 0;
            this.options = void 0;
            this.settings = void 0;
            this.initialized = void 0;
            
        });

    }

    createLabels(labels) {

        if (this.constructor.name !== 'WC_YandexMap') {
            const error = new Error(`Class instance context is lost`);
            console.error(error.name + ': ' + error.message);
            return;
        }

        if (!this._testInitialized()) {
            return;
        }

        if (labels === void 0 || this._typeObject(labels) !== 'array') {
            const error = new Error(`Missing data array`);
            console.error(error.name + ': ' + error.message);
            return;
        }

        this._yandexMapHas(() => {

            for (let i = 0; i < labels.length; i++) {
                labels[i] = Object.assign(this._optionsLabel(), labels[i]);
                labels[i].offset = [-(labels[i].size[0] / 2), -labels[i].size[1]];
                this._createLabel(labels[i]);
            }

        });

    }

    _optionsDefault() {

        return {
            zoom: 16,
            id: 'map',
            labels: [],
            drag: true,
            invert: false,
            grayscale: false,
            fullscreen: false,
            zoomScroll: false,
            zoomButtons: true,
            script: 'assets/js/YandexMap.json',
            center: this.data.positionLabel,
        };

    }

    _optionsLabel() {

        let w = 70,
            h = 70,
            x = -(w / 2),
            y = -h;

        return {
            icon: 'assets/images/icons/yandex-ball.svg',
            size: [w, h],
            offset: [x, y],
            position: this.data.positionLabel,
        }

    }

    _yandexMapHas(callback) {

        if (callback === void 0) {
            return;
        }

        if (this.map !== void 0) {

            this.data.attempt = 0;

            callback();

            return;

        }

        if (this.data.attempt < this.data.maxAttempt) {

            this.data.attempt++;

            setTimeout(() => {
                this._yandexMapHas(callback);
            }, this.data.delayAttempt);

            return;

        }

        this.data.attempt = 0;

    }

    _yandexMapReady(callback) {

        if (callback === void 0) {
            return;
        }

        if (window.ymaps !== void 0) {

            this.data.attempt = 0;

            ymaps.ready(callback);

            return;

        }

        if (this.data.attempt < this.data.maxAttempt) {

            this.data.attempt++;

            setTimeout(() => {
                this._yandexMapReady(callback);
            }, this.data.delayAttempt);

            return;

        }

        this.data.attempt = 0;

    }

    _testInitialized() {
        
        if (this.initialized === void 0) {
            this.initialized = true;
        }
        
        return this.initialized ? true : false;
        
    }

    _initOnCurrentPage() {

        const cover = document.getElementById(this.options.id);

        if (!cover) {

            this.destroy();

            return;

        }

        cover.innerHTML = '';

        return true;

    }

    _typeObject(object) {
        return {}.toString.call(object).slice(8, -1).toLowerCase();
    }

    _createGlobalInitArray() {

        window[`_${this.constructor.name}Global`] = window[`_${this.constructor.name}Global`] !== void 0 ? window[`_${this.constructor.name}Global`] : [];

        if (window[`_${this.constructor.name}Global`].includes(this.options.id)) {
            return false;
        }

        window[`_${this.constructor.name}Global`].push(this.options.id);
        return true;

    }

    _createLabel(optionLabel) {

        if (optionLabel === void 0) {
            return;
        }

        this._yandexMapReady(() => {

            let label = new ymaps.Placemark(optionLabel.position, {}, {
                iconLayout: 'default#image',
                iconImageHref: optionLabel.icon,
                iconImageSize: optionLabel.size,
                iconImageOffset: optionLabel.offset,
                cursor: 'default',
            });
            
            if (this.map !== void 0) {
                this.map.geoObjects.add(label);
            }

        });

    }

    _createYaAPI() {

        if (document.getElementsByClassName(this.attr.json)[0]) {
            return;
        }

        if (window.ymaps === void 0) {

            const script = document.createElement('script');

            script.async = true;
            script.classList.add(this.attr.json);
            script.setAttribute('src', this.options.script);

            document.body.appendChild(script);

        }

    }

    _createMap() {

        this._yandexMapReady(() => {

            const mapControl = [];

            if (this.options.zoomButtons) {
                mapControl.push('zoomControl');
            }

            if (this.options.fullscreen) {
                mapControl.push('fullscreenControl');
            }

            const mapOptions = {
                center: this.options.center,
                zoom: this.options.zoom,
                controls: mapControl,
            };

            this.map = new ymaps.Map(this.options.id, mapOptions);

            if (!this.options.zoomScroll) {
                this.map.behaviors.disable('scrollZoom');
            }

            if (!this.options.drag) {
                this.map.behaviors.disable('drag');
            }
            
            this.createLabels(this.options.labels);

        });

    }

    _createOptions() {

        this.data = {
            attempt: 0,
            maxAttempt: 30,
            delayAttempt: 400,
            positionLabel: [55.751437393466894, 37.61888746396247],
        };

        this.options = this.settings === void 0 ? this._optionsDefault() : Object.assign(this._optionsDefault(), this.settings);

    }

    _createAttr() {

        this.attr = {
            json: `webcore-yandex-map--json`,
            style: `webcore-yandex-map--style`,
            uniqueStyle: `webcore-yandex-map--style-${this.options.id}`,
        };

    }

    _createCSS() {

        const value = this._createCSSValue();

        if (value === void 0) {
            return;
        }

        const style = document.createElement('style');

        style.classList.add(this.attr.style);
        style.classList.add(this.attr.uniqueStyle);
        style.innerHTML = value;

        document.head.appendChild(style);

    }

    _createCSSValue() {

        if (this.options.invert && this.options.grayscale) {
            return `#${this.options.id} canvas {filter: invert(1) grayscale(100%);}`;
        }

        if (this.options.invert) {
            return `#${this.options.id} canvas {filter: invert(1);}`;
        }

        if (this.options.grayscale) {
            return `#${this.options.id} canvas {filter: grayscale(100%);}`;
        }

        return;

    }

}