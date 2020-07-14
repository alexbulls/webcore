/*
 * WC_SwitchBox 1.1
 *
 * Copyright 2020 Alexandr Bykov
 *
 * Released under the MIT License
 *
 * Released on: May 07, 2020
 */

class WC_SwitchBox {

    init(settings) {

        if (!this._testInitialized()) {
            return;
        }

        this.settings = settings;

        this._createOptions();

        if (!this._createGlobalInitArray() || !this._initOnCurrentPage()) {
            return;
        }

        this._animationTest();
        this._createAttr();
        this._createEventsListener();
        this._createGlobalData();
        this._createHighestIndex();
        this._createCSS();
        this._createOptionsCSS();

        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
        this.switch = this.switch.bind(this);
        this.destroy = this.destroy.bind(this);

    }

    show() {

        if (this.constructor.name !== 'WC_SwitchBox') {
            const error = new Error(`Class instance context is lost`);
            console.error(error.name + ': ' + error.message);
            return;
        }

        if (!this._testInitialized()) {
            return;
        }

        const cover = document.getElementById(this.options.id);

        if (!cover) {
            return;
        }

        if (cover.classList.contains(this.attr.active) || this.data.stack.includes(this.options.id)) {
            return;
        }

        if (this._typeObject(this.options.before) === 'function') {
            this.options.before(cover);
        }

        if (this.options.fetch !== void 0) {
            this._fetch();
        }

        if (this.options.raiseIndex) {
            this.data.highest = this.data.stack.length === 0 ? this.options.zIndex : this.data.highest + 1;
            cover.style.zIndex = this.data.highest;
        }

        this.data.stack.push(this.options.id);

        cover.classList.add(this.attr.active);

        this._scrollDisable();

    }

    hide() {

        if (this.constructor.name !== 'WC_SwitchBox') {
            const error = new Error(`Class instance context is lost`);
            console.error(error.name + ': ' + error.message);
            return;
        }

        if (!this._testInitialized()) {
            return;
        }

        const cover = document.getElementById(this.options.id);

        if (!cover) {
            return;
        }

        if (!cover.classList.contains(this.attr.active)) {
            return;
        }

        if (this._typeObject(this.options.after) === 'function') {
            this.options.after(cover);
        }

        if (this.options.raiseIndex) {
            this.data.highest--;
        }

        for (let i = 0; i < this.data.stack.length; i++) {
            if (this.data.stack[i] === this.options.id) {
                this.data.stack.splice(i, 1);
                break;
            }
        }

        cover.classList.remove(this.attr.active);

        this._scrollEnable();

    }

    switch () {

        if (this.constructor.name !== 'WC_SwitchBox') {
            const error = new Error(`Class instance context is lost`);
            console.error(error.name + ': ' + error.message);
            return;
        }

        if (!this._testInitialized()) {
            return;
        }

        const cover = document.getElementById(this.options.id);

        if (!cover) {
            return;
        }

        cover.classList.contains(this.attr.active) ? this.hide() : this.show();

    }

    destroy() {

        if (this.constructor.name !== 'WC_SwitchBox') {
            const error = new Error(`Class instance context is lost`);
            console.error(error.name + ': ' + error.message);
            return;
        }

        if (!this._testInitialized()) {
            return;
        }

        let cover = document.getElementById(this.options.id),
            container = cover.getElementsByClassName(this.attr.container)[0];

        if (cover) {

            this.hide();

            cover.style.zIndex = '';
            cover.style.cursor = '';
            cover.style.transitionDuration = '';

        }

        if (container) {
            container.classList.remove(this.attr.animation);
        }

        for (let i = 0; i < window[`_${this.constructor.name}Global`].length; i++) {
            if (window[`_${this.constructor.name}Global`][i] === this.options.id) {
                window[`_${this.constructor.name}Global`].splice(i, 1);
                break;
            }
        }

        this.attr = void 0;
        this.data = void 0;
        this.options = void 0;
        this.fetchOnce = void 0;
        this.settings = void 0;
        this.initialized = void 0;

        document.removeEventListener('click', this._click);
        document.removeEventListener('keyup', this._keyup);

    }

    _optionsDefault() {

        return {
            id: void 0,
            fetch: void 0,
            duration: 400,
            before: void 0,
            after: void 0,
            zIndex: 1000,
            raiseIndex: true,
            animation: 'scale-in',
            switchWithALT: void 0,
            createPopupCSS: true,
            hideKeyEsc: true,
            switchScroll: true,
            modifier: 'webcore',
            hideClickOutContainer: true,
            catchEventShow: [],
            catchEventHide: [],
        }

    }

    _optionsFetch() {

        return {
            path: void 0,
            once: true,
            data: void 0,
            success: void 0,
            error: void 0,
            method: 'POST',
            insert: false,
        }

    }

    _isTouch() {
        return 'ontouchstart' in document;
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

    _initOnCurrentPage() {

        if (this.options.id === void 0 || !document.getElementById(this.options.id)) {

            this.destroy();
            
            return;

        }

        return true;

    }

    _createAttr() {

        this.attr = {
            cover: `${this.options.modifier}-switch-box--cover`,
            style: `${this.options.modifier}-switch-box--style`,
            active: `${this.options.modifier}-switch-box--active`,
            container: `${this.options.modifier}-switch-box--container`,
            animation: `${this.options.modifier}-switch-box--${this.options.animation}`,
        };

    }

    _createOptions() {

        this.options = this.settings === void 0 ? this._optionsDefault() : Object.assign(this._optionsDefault(), this.settings);
        this.options.fetch = this.options.fetch !== void 0 ? Object.assign(this._optionsFetch(), this.options.fetch) : void 0;
        this.fetchOnce = false;

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

    _createEventsListener() {

        this._click = this._click.bind(this);
        this._keyup = this._keyup.bind(this);

        document.addEventListener('click', this._click);
        document.addEventListener('keyup', this._keyup);

    }

    _scrollDisable() {

        if (!this._isTouch() && this.options.switchScroll) {

            this.data.scrollStack.push(this.options.id);

            if (document.body.style.overflow === 'hidden') {
                return;
            }

            document.body.style.paddingRight = window.innerWidth - document.documentElement.clientWidth + 'px';
            document.body.style.overflow = 'hidden';

        }

    }

    _scrollEnable() {

        if (!this._isTouch() && this.options.switchScroll) {

            for (let i = 0; i < this.data.scrollStack.length; i++) {
                if (this.data.scrollStack[i] === this.options.id) {
                    this.data.scrollStack.splice(i, 1);
                    break;
                }
            }

            if (this.data.scrollStack.length === 0) {
                document.body.style.paddingRight = '';
                document.body.style.overflow = '';
            }

        }

    }

    _createCSS() {

        if (!this.options.createPopupCSS) {
            return;
        }

        if (document.getElementsByClassName(this.attr.style)[0]) {
            return;
        }

        const style = document.createElement('style');

        style.classList.add(this.attr.style);
        style.innerHTML = `.${this.options.modifier}-switch-box--cover { top: 0; left: 0; opacity: 0; width: 100%; height: 100%; position: fixed; pointer-events: none; transition-delay: 0s; transition-property: opacity; transition-timing-function: ease-out; } .${this.options.modifier}-switch-box--container { cursor: default; position: relative; transition-delay: 0s; transition-duration: inherit; transition-property: opacity, transform; transition-timing-function: cubic-bezier(.38, .82, .41, .68); } .${this.options.modifier}-switch-box--fade { opacity: 0; transform: none; } .${this.options.modifier}-switch-box--scale-in { opacity: 1; transform: scale(.8); } .${this.options.modifier}-switch-box--scale-out { opacity: 1; transform: scale(1.2); } .${this.options.modifier}-switch-box--slide-up { opacity: 1; transform: translateY(30%); } .${this.options.modifier}-switch-box--slide-down { opacity: 1; transform: translateY(-30%); } .${this.options.modifier}-switch-box--slide-left { opacity: 1; transform: translateX(-30%); } .${this.options.modifier}-switch-box--slide-right { opacity: 1; transform: translateX(30%); } .${this.options.modifier}-switch-box--active { opacity: 1; pointer-events: all; } .${this.options.modifier}-switch-box--active .popup-switch-box--container { opacity: 1; transform: matrix(1, 0, 0, 1, 0, 0); transition-timing-function: cubic-bezier(.16,.84,.13,1.33); } @media (pointer: coarse) { .${this.options.modifier}-switch-box--cover { cursor: pointer !important; } }`;

        document.head.appendChild(style);

    }

    _createOptionsCSS() {

        let cover = document.getElementById(this.options.id),
            container = cover.getElementsByClassName(this.attr.container)[0];

        if (!cover) {
            return;
        }

        cover.style.zIndex = this.options.zIndex === void 0 ? '' : this.options.zIndex;
        cover.style.cursor = this.options.hideClickOutContainer ? 'pointer' : 'default';
        cover.style.transitionDuration = this.options.duration === void 0 ? '' : `${this.options.duration}ms`;

        if (!container) {
            return;
        }

        container.classList.add(this.attr.animation);

    }

    _createGlobalData() {

        if (window._WC_SwitchBoxData !== void 0) {
            this.data = window._WC_SwitchBoxData;
            return;
        }

        window._WC_SwitchBoxData = {
            stack: [],
            index: [],
            scrollStack: [],
            highest: void 0,
        };

        this.data = window._WC_SwitchBoxData;

    }

    _createGlobalInitArray() {

        window[`_${this.constructor.name}Global`] = window[`_${this.constructor.name}Global`] !== void 0 ? window[`_${this.constructor.name}Global`] : [];

        if (window[`_${this.constructor.name}Global`].includes(this.options.id)) {
            return false;
        }

        window[`_${this.constructor.name}Global`].push(this.options.id);
        return true;

    }

    _animationTest() {

        const animations = ['fade', 'scale-in', 'scale-out', 'slide-up', 'slide-down', 'slide-left', 'slide-right'];

        for (let i = 0; i < animations.length; i++) {

            if (animations[i] === this.options.animation) {
                return;
            }

        }

        this.options.animation = this._optionsDefault().animation;

    }

    _click(event) {

        for (let i = 0; i < this.options.catchEventShow.length; i++) {

            const show = event.target.closest(this.options.catchEventShow[i]);

            if (!show) {
                continue;
            }

            for (let j = 0; j < this.options.catchEventHide.length; j++) {

                const hide = event.target.closest(this.options.catchEventHide[j]);

                if (!hide) {
                    continue;
                }

                event.preventDefault();

                this.switch();

                return;

            }

            event.preventDefault();

            this.show();

            return;

        }

        if (this.data.stack.length === 0) {
            return;
        }

        if (this.data.stack[this.data.stack.length - 1] === this.options.id) {

            for (let i = 0; i < this.options.catchEventHide.length; i++) {

                const hide = event.target.closest(this.options.catchEventHide[i]);

                if (!hide) {
                    continue;
                }

                event.preventDefault();

                setTimeout(this.hide);

            }

            if (this.options.hideClickOutContainer) {

                let container = event.target.closest(`.${this.attr.container}`);

                if (container) {
                    return;
                }

                setTimeout(this.hide);

            }

            return;

        }

    }

    _keyup(event) {

        if (event.keyCode === 27 && this.options.hideKeyEsc && this.data.stack.length !== 0) {

            if (this.data.stack[this.data.stack.length - 1] === this.options.id) {
                setTimeout(this.hide);
            }

        }

        if (event.altKey && typeof this.options.switchWithALT === 'string') {

            if (event.key === this.options.switchWithALT) {

                if (this.data.stack.length !== 0) {

                    if (this.data.stack[this.data.stack.length - 1] === this.options.id) {

                        setTimeout(this.hide);

                        return;

                    }

                }

                this.show();

                return;

            }

        }

    }

    async _fetch() {

        if (this.options.fetch.once && this.fetchOnce) {
            return;
        }

        if (this.options.fetch.path === void 0 || typeof this.options.fetch.path !== 'string') {

            const error = new Error(`Need to pass the path to the handler`);
            console.error(error.name + ': ' + error.message);

            return;

        }

        if (this.options.fetch.data !== void 0) {

            if (this._typeObject(this.options.fetch.data) === 'function') {
                this.options.fetch.data = this.options.fetch.data();
            }

            this.options.fetch.data = this._typeObject(this.options.fetch.data) === 'formdata' ? this.options.fetch.data : void 0;

        }

        if (this.options.fetch.data === void 0 && this.options.fetch.method === 'POST') {

            const error = new Error(`POST method requires data in formdata format`);
            console.error(error.name + ': ' + error.message);

            return;

        }

        let body = this.options.fetch.method === 'GET' ? void 0 : {
            method: this.options.fetch.method,
            body: this.options.fetch.data,
        };

        const response = await fetch(this.options.fetch.path, body);

        if (response.ok) {

            if (this.options.fetch.once) {
                this.fetchOnce = true;
            }

            const result = await response.json();

            if (this.options.fetch.insert) {

                const cover = document.getElementById(this.options.id);

                if (cover) {

                    const container = cover.getElementsByClassName(this.attr.container)[0];

                    if (container) {
                        container.innerHTML = result.data;
                    }

                }

            }

            if (this._typeObject(this.options.fetch.success) === 'function') {
                this.options.fetch.success(result.data);
            }

            return;

        }

        if (this._typeObject(this.options.fetch.error) === 'function') {
            this.options.fetch.error(response);
        }

    }

}