/*
 * WC_Counter 1.1
 *
 * Copyright 2020 Alexandr Bykov
 *
 * Released under the MIT License
 *
 * Released on: May 13, 2020
 */

class WC_Counter {

    init(settings) {

        if (!this._testInitialized()) {
            return;
        }
        
        this.settings = settings;

        this._createOptions();
        this._createAttr();
        
        if (!this._createGlobalInitArray() || !this._initOnCurrentPage()) {
            return;
        }
        
        this._createCSS();
        this._createDataInput();
        this._createEventsListener();
        
        this.up = this.up.bind(this);
        this.any = this.any.bind(this);
        this.min = this.min.bind(this);
        this.max = this.max.bind(this);
        this.down = this.down.bind(this);
        this.destroy = this.destroy.bind(this);

    }

    up(cover) {
        
        if (this.constructor.name !== 'WC_Counter') {
            const error = new Error(`Class instance context is lost`);
            console.error(error.name + ': ' + error.message);
            return;
        }

        if (!this._testInitialized()) {
            return;
        }
        
        if (cover === void 0) {
            return;
        }
        
        if (typeof cover === 'string') {
            cover = document.getElementById(cover.replace('#', ''));
        }
        
        if (typeof cover === 'number') {
            cover = document.getElementsByClassName(this.attr.cover)[cover];
        }
        
        if (this._typeObject(cover).indexOf('element') === -1) {
            return;
        }
        
        const input = cover.getElementsByClassName(this.attr.input)[0];
        
        if (!input) {
            return;
        }
        
        let current = this._testValue((input.value * 1));
        current = current + this.options.step >= this.options.max ? this.options.max : current + this.options.step;
        input.value = current.toFixed(this.fixed);
        
        if (this._typeObject(this.options.afterUp) === 'function') {
            this.options.afterUp(input);
        }
        
    }
    
    any(cover, value, callback) {
        
        if (this.constructor.name !== 'WC_Counter') {
            const error = new Error(`Class instance context is lost`);
            console.error(error.name + ': ' + error.message);
            return;
        }

        if (!this._testInitialized()) {
            return;
        }
        
        if (cover === void 0 || typeof value !== 'number') {
            return;
        }
        
        if (typeof cover === 'string') {
            cover = document.getElementById(cover.replace('#', ''));
        }
        
        if (typeof cover === 'number') {
            cover = document.getElementsByClassName(this.attr.cover)[cover];
        }
        
        if (this._typeObject(cover).indexOf('element') === -1) {
            return;
        }
        
        const input = cover.getElementsByClassName(this.attr.input)[0];
        
        if (!input) {
            return;
        }
        
        input.value = this._testValue(value);
        
        if (this._typeObject(callback) === 'function') {
            callback(input);
        }
        
    }
    
    min(cover, callback) {
        
        if (this.constructor.name !== 'WC_Counter') {
            const error = new Error(`Class instance context is lost`);
            console.error(error.name + ': ' + error.message);
            return;
        }

        if (!this._testInitialized()) {
            return;
        }
        
        if (cover === void 0) {
            return;
        }
        
        if (typeof cover === 'string') {
            cover = document.getElementById(cover.replace('#', ''));
        }
        
        if (typeof cover === 'number') {
            cover = document.getElementsByClassName(this.attr.cover)[cover];
        }
        
        if (this._typeObject(cover).indexOf('element') === -1) {
            return;
        }
        
        const input = cover.getElementsByClassName(this.attr.input)[0];
        
        if (!input) {
            return;
        }
        
        input.value = this.options.min;
        
        if (this._typeObject(callback) === 'function') {
            callback(input);
        }
        
    }
    
    max(cover, callback) {
        
        if (this.constructor.name !== 'WC_Counter') {
            const error = new Error(`Class instance context is lost`);
            console.error(error.name + ': ' + error.message);
            return;
        }

        if (!this._testInitialized()) {
            return;
        }
        
        if (cover === void 0) {
            return;
        }
        
        if (typeof cover === 'string') {
            cover = document.getElementById(cover.replace('#', ''));
        }
        
        if (typeof cover === 'number') {
            cover = document.getElementsByClassName(this.attr.cover)[cover];
        }
        
        if (this._typeObject(cover).indexOf('element') === -1) {
            return;
        }
        
        const input = cover.getElementsByClassName(this.attr.input)[0];
        
        if (!input) {
            return;
        }
        
        input.value = this.options.max;
        
        if (this._typeObject(callback) === 'function') {
            callback(input);
        }
        
    }
    
    down(cover) {
        
        if (this.constructor.name !== 'WC_Counter') {
            const error = new Error(`Class instance context is lost`);
            console.error(error.name + ': ' + error.message);
            return;
        }

        if (!this._testInitialized()) {
            return;
        }
        
        if (cover === void 0) {
            return;
        }
        
        if (typeof cover === 'string') {
            cover = document.getElementById(cover.replace('#', ''));
        }
        
        if (typeof cover === 'number') {
            cover = document.getElementsByClassName(this.attr.cover)[cover];
        }
        
        if (this._typeObject(cover).indexOf('element') === -1) {
            return;
        }
        
        const input = cover.getElementsByClassName(this.attr.input)[0];
        
        if (!input) {
            return;
        }
        
        let current = this._testValue((input.value * 1));
        current = current - this.options.step <= this.options.min ? this.options.min : current - this.options.step;
        input.value = current.toFixed(this.fixed);
        
        if (this._typeObject(this.options.afterDown) === 'function') {
            this.options.afterDown(input);
        }
        
    }

    destroy() {
        
        if (this.constructor.name !== 'WC_Counter') {
            const error = new Error(`Class instance context is lost`);
            console.error(error.name + ': ' + error.message);
            return;
        }

        if (!this._testInitialized()) {
            return;
        }
        
        this.settings = void 0;
        this.initialized = void 0;
        
        for (let i = 0; i < window[`_${this.constructor.name}Global`].length; i++) {
            if (window[`_${this.constructor.name}Global`][i] === this.options.modifier) {
                window[`_${this.constructor.name}Global`].splice(i, 1);
                break;
            }
        }
        
        this.attr = void 0;
        this.fixed = void 0;
        this.options = void 0;

        document.removeEventListener('blur', this._blur, true);
        document.removeEventListener('click', this._click);
        
    }
    
    _typeObject(object) {
        return {}.toString.call(object).slice(8, -1).toLowerCase();
    }
    
    _testInitialized() {
        
        if (this.initialized === void 0) {
            this.initialized = true;
        }
        
        return this.initialized ? true : false;
        
    }

    _optionsDefault() {

        return {
            min: 1,
            max: 100,
            step: 1,
            value: 1,
            afterUp: void 0,
            afterDown: void 0,
            afterBlur: void 0,
            modifier: 'webcore',
        }

    }
    
    _initOnCurrentPage() {

        if (document.getElementsByClassName(this.attr.cover).length === 0) {
            
            this.destroy();
            
            return;
            
        }

        return true;

    }
    
    _createOptions() {
        this.options = this.settings === void 0 ? this._optionsDefault() : Object.assign(this._optionsDefault(), this.settings);
        this.options.min = this.options.min < .1 ? .1 : this.options.min;
        this.options.step = this.options.step > this.options.max ? this.options.max : this.options.step;
        this.options.step = this.options.step < this.options.min ? this.options.min : this.options.step;
        this.options.value = this._testValue(this.options.value);
        this.fixed = this.options.step.toString().length > 2 ? 1 : 0;
    }

    _createAttr() {

        this.attr = {
            cover: `${this.options.modifier}-couter--cover`,
            style: `${this.options.modifier}-couter--style`,
            input: `${this.options.modifier}-couter--input`,
            buttonUp: `${this.options.modifier}-couter--button-up`,
            buttonDown: `${this.options.modifier}-couter--button-down`,
        };

    }
    
    _createGlobalInitArray() {

        window[`_${this.constructor.name}Global`] = window[`_${this.constructor.name}Global`] !== void 0 ? window[`_${this.constructor.name}Global`] : [];

        if (window[`_${this.constructor.name}Global`].includes(this.options.modifier)) {
            return false;
        }

        window[`_${this.constructor.name}Global`].push(this.options.modifier);
        return true;

    }
    
    _createCSS() {
        
        if (document.getElementsByClassName(this.attr.style)[0]) {
            return;
        }
        
        const node = document.createElement('style');
        
        node.classList.add(this.attr.style);
        node.innerHTML = `.${this.attr.input}::-webkit-outer-spin-button, .${this.attr.input}::-webkit-inner-spin-button { -webkit-appearance: none; } .${this.attr.input} { -moz-appearance: textfield; }`;
        
        document.head.appendChild(node);
        
    }
    
    _testValue(value) {
        
        if (value === void 0) {
            return;
        }
        
        if (isNaN(value)) {
            return this.options.min;
        }
        
        if (value > this.options.max) {
            return this.options.max;
        }
        
        if (value < this.options.min) {
            return this.options.min;
        }
        
        return value;
        
    }
    
    _createDataInput() {
        
        const inputs = document.getElementsByClassName(this.attr.input);
        
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].type = 'number';
            inputs[i].value = this.options.value;
        }
        
    }
    
    _createEventsListener() {

        this._blur = this._blur.bind(this);
        this._click = this._click.bind(this);

        document.addEventListener('blur', this._blur, true);
        document.addEventListener('click', this._click);

    }
    
    _click(event) {
        
        let buttonUp = event.target.closest(`.${this.attr.buttonUp}`),
            buttonDown = event.target.closest(`.${this.attr.buttonDown}`);
        
        if (buttonUp) {
            this.up(buttonUp.closest(`.${this.attr.cover}`));
            return;
        }
        
        if (buttonDown) {
            this.down(buttonDown.closest(`.${this.attr.cover}`));
            return;
        }
        
    }
    
    _blur(event) {
        
        let input = event.target.closest(`.${this.attr.input}`);
        
        if (input) {
            
            input.value = this._testValue(input.value * 1);
            
            if (this._typeObject(this.options.afterBlur) === 'function') {
                this.options.afterBlur(input);
            }
            
            return;
            
        }
        
    }
    
}