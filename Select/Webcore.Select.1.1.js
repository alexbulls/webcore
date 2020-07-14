/*
 * WC_Select 1.1
 *
 * Copyright 2020 Alexandr Bykov
 *
 * Released under the MIT License
 *
 * Released on: May 07, 2020
 */

class WC_Select {

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
        
        this._createHighestIndex();
        this._createEventsListener();

        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
        this.switch = this.switch.bind(this);
        this.destroy = this.destroy.bind(this);
        this.hideAll = this.hideAll.bind(this);
        this.hideLast = this.hideLast.bind(this);
        this.hideFirst = this.hideFirst.bind(this);

    }

    show(cover) {

        if (this.constructor.name !== 'WC_Select') {
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

            if (!cover) {
                return;
            }

        }

        if (this._typeObject(this.options.before) === 'function') {
            this.options.before(cover);
        }
        
        this.data.highest = this.data.stack.length === 0 ? this.options.zIndex : this.data.highest + 1;
        this.data.stack.push([this.data.highest, cover]);
        
        if (this.options.raiseIndex) {
            cover.style.zIndex = this.data.highest;
        }
        
        cover.classList.add(this.attr.active);
        
    }

    hide(cover) {

        if (this.constructor.name !== 'WC_Select') {
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

            if (!cover) {
                return;
            }

        }
        
        for (let i = 0; i < this.data.stack.length; i++) {
            if (this.data.stack[i][0] === this.data.highest) {
                this.data.stack.splice(i, 1);
                break;
            }
        }
        
        this.data.highest--;
        
        if (this.options.raiseIndex) {
            cover.style.zIndex = '';
        }
        
        cover.classList.remove(this.attr.active);
        
        if (this._typeObject(this.options.after) === 'function') {
            this.options.after(cover);
        }

    }

    switch (cover) {

        if (this.constructor.name !== 'WC_Select') {
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

            if (!cover) {
                return;
            }

        }

        cover.classList.contains(this.attr.active) ? this.hide(cover) : this.show(cover);

    }

    hideAll() {

        if (this.constructor.name !== 'WC_Select') {
            const error = new Error(`Class instance context is lost`);
            console.error(error.name + ': ' + error.message);
            return;
        }

        if (!this._testInitialized()) {
            return;
        }

        let covers = document.getElementsByClassName(this.attr.cover);

        if (covers.length === 0) {
            return;
        }

        for (let i = 0; i < covers.length; i++) {
            if (covers[i].classList.contains(this.attr.active)) {
                this.hide(covers[i]);
            }
        }

    }
    
    hideLast() {
        
        if (this.constructor.name !== 'WC_Select') {
            const error = new Error(`Class instance context is lost`);
            console.error(error.name + ': ' + error.message);
            return;
        }

        if (!this._testInitialized()) {
            return;
        }
        
        if (this.data.stack.length === 0) {
            return;
        }
        
        const prevCover = this.data.stack[this.data.stack.length - 1][1];
        
        this.hide(prevCover);
        
    }
    
    hideFirst() {
        
        if (this.constructor.name !== 'WC_Select') {
            const error = new Error(`Class instance context is lost`);
            console.error(error.name + ': ' + error.message);
            return;
        }

        if (!this._testInitialized()) {
            return;
        }
        
        if (this.data.stack.length === 0) {
            return;
        }
        
        const prevCover = this.data.stack[0][1];
        
        this.hide(prevCover);
        
    }
    
    destroy() {

        if (this.constructor.name !== 'WC_Select') {
            const error = new Error(`Class instance context is lost`);
            console.error(error.name + ': ' + error.message);
            return;
        }

        if (!this._testInitialized()) {
            return;
        }
        
        this.hideAll();
        
        for (let i = 0; i < window[`_${this.constructor.name}Global`].length; i++) {
            if (window[`_${this.constructor.name}Global`][i] === this.options.modifier) {
                window[`_${this.constructor.name}Global`].splice(i, 1);
                break;
            }
        }
        
        this.attr = void 0;
        this.data = void 0;
        this.options = void 0;
        this.settings = void 0;
        this.initialized = void 0;

        document.removeEventListener('click', this._click);
        document.removeEventListener('keyup', this._keyup);
        
        
    }

    _typeObject(object) {
        return {}.toString.call(object).slice(8, -1).toLowerCase();
    }

    _optionsDefault() {

        return {
            zIndex: 2,
            after: void 0,
            before: void 0,
            modifier: 'webcore',
            raiseIndex: true,
            hideKeyEsc: true,
            closingInTurn: false,
            hideClickOutContainer: true,
        }

    }

    _createAttr() {

        this.attr = {
            cover: `${this.options.modifier}-select--cover`,
            option: `${this.options.modifier}-select--option`,
            active: `${this.options.modifier}-select--active`,
            caption: `${this.options.modifier}-select--caption`,
            container: `${this.options.modifier}-select--container`,
        };

    }

    _createOptions() {
        
        this.options = this.settings === void 0 ? this._optionsDefault() : Object.assign(this._optionsDefault(), this.settings);
        
        this.data = {
            stack: [],
            index: [],
            highest: void 0,
        }
        
    }

    _createHighestIndex() {

        this.data.highest = 1;
        this.data.index.push(this.options.zIndex);

        for (let i = 0; i < this.data.index.length; i++) {

            if (this.data.index[i] === void 0) {
                continue;
            }

            if (this.data.index[i] > this.data.highest) {
                this.data.highest = this.data.index[i];
            }

        }

    }

    _testInitialized() {
        
        if (this.initialized === void 0) {
            this.initialized = true;
        }
        
        return this.initialized ? true : false;
        
    }
    
    _initOnCurrentPage() {

        if (document.getElementsByClassName(this.attr.cover).length === 0) {

            this.destroy();

            return;

        }

        return true;

    }

    _createEventsListener() {

        this._click = this._click.bind(this);
        this._keyup = this._keyup.bind(this);

        document.addEventListener('click', this._click);
        document.addEventListener('keyup', this._keyup);

    }
    
    _createGlobalInitArray() {
        
        window[`_${this.constructor.name}Global`] = window[`_${this.constructor.name}Global`] !== void 0 ? window[`_${this.constructor.name}Global`] : [];
        
        if (window[`_${this.constructor.name}Global`].includes(this.options.modifier)) {
            return false;
        }
        
        window[`_${this.constructor.name}Global`].push(this.options.modifier);
        return true;
        
    }
    
    _click(event) {

        let cover = event.target.closest(`.${this.attr.cover}`),
            option = event.target.closest(`.${this.attr.option}`);

        if (option) {
            this._clickOption(option);
            return;
        }

        if (cover) {
            this.switch(cover);
            return;
        }

        if (this.options.hideClickOutContainer) {
            this.options.closingInTurn ? this.hideLast() : this.hideAll();
            return;
        }

    }

    _keyup(event) {

        if (this.options.hideKeyEsc && event.keyCode === 27) {
            this.options.closingInTurn ? this.hideLast() : this.hideAll();
            return;
        }

    }

    _clickOption(option) {

        if (option === void 0) {
            return;
        }

        let text = option.textContent,
            cover = option.closest(`.${this.attr.cover}`),
            container = option.closest(`.${this.attr.container}`);

        if (!cover && !container) {
            return;
        }
        
        let options = container.getElementsByClassName(this.attr.option);

        for (let i = 0; i < options.length; i++) {
            options[i].classList.remove(this.attr.active);
        }
        
        option.classList.add(this.attr.active);
        
        let caption = cover.getElementsByClassName(this.attr.caption)[0];

        if (caption) {
            caption.textContent = text;
        }

        this.hide(cover);

    }

}