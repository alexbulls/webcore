/*
 * WC_ToScroll 1.1
 *
 * Copyright 2020 Alexandr Bykov
 *
 * Released under the MIT License
 *
 * Released on: May 09, 2020
 */

class WC_ToScroll {

    init(settings) {

        if (!this._testInitialized()) {
            return;
        }

        this.settings = settings;

        this._createTiming();
        this._createOptions();

        if (!this._createGlobalInitArray()) {

            this.destroy();
            
            return;

        }

        this._createAttr();
        this._createEventsListener();

        this.createUp = this.createUp.bind(this);
        this.createTo = this.createTo.bind(this);
        this.createKey = this.createKey.bind(this);
        this.createDown = this.createDown.bind(this);

        this.scrollUp = this.scrollUp.bind(this);
        this.scrollTo = this.scrollTo.bind(this);
        this.scrollTop = this.scrollTop.bind(this);
        this.scrollDown = this.scrollDown.bind(this);
        this.destroy = this.destroy.bind(this);

    }

    createUp(settings) {

        if (this.constructor.name !== 'WC_ToScroll') {
            const error = new Error(`Class instance context is lost`);
            console.error(error.name + ': ' + error.message);
            return;
        }

        if (!this._testInitialized()) {
            return;
        }

        if (this.buttons.up !== void 0) {
            return;
        }

        this._createButton(settings === void 0 ? {} : settings, true);
        this._searchButtons();
        this._scroll();

    }

    createDown(settings) {

        if (this.constructor.name !== 'WC_ToScroll') {
            const error = new Error(`Class instance context is lost`);
            console.error(error.name + ': ' + error.message);
            return;
        }

        if (!this._testInitialized()) {
            return;
        }

        if (this.buttons.down !== void 0) {
            return;
        }

        this._createButton(settings === void 0 ? {} : settings, false);
        this._searchButtons();
        this._scroll();

    }

    createTo(offset) {

        if (this.constructor.name !== 'WC_ToScroll') {
            const error = new Error(`Class instance context is lost`);
            console.error(error.name + ': ' + error.message);
            return;
        }

        if (!this._testInitialized()) {
            return;
        }

        this.data.switchScrollTo = true;
        this.data.offsetScrollTo = offset === void 0 ? 0 : offset;

    }

    createKey(settings) {

        if (this.constructor.name !== 'WC_ToScroll') {
            const error = new Error(`Class instance context is lost`);
            console.error(error.name + ': ' + error.message);
            return;
        }

        if (!this._testInitialized()) {
            return;
        }

        this.data.keysOptions = settings === void 0 ? this._optionsKeys() : Object.assign(this._optionsKeys(), settings);

    }

    scrollUp() {

        if (this.constructor.name !== 'WC_ToScroll') {
            const error = new Error(`Class instance context is lost`);
            console.error(error.name + ': ' + error.message);
            return;
        }

        if (!this._testInitialized()) {
            return;
        }

        if (this.animated) {

            this._animationDestroy();

            if (!this.options.preventAnimation) {
                setTimeout(this.scrollUp, 20);
            }

            return;

        }

        let scrolltop = this.scrollTop(),
            to = 0;

        if (scrolltop === to) {
            return;
        }

        this._animation({
            draw: (progress) => {
                let result = (to - scrolltop) * progress + scrolltop;
                window.scrollTo(0, result);
            },
        });

    }

    scrollDown() {

        if (this.constructor.name !== 'WC_ToScroll') {
            const error = new Error(`Class instance context is lost`);
            console.error(error.name + ': ' + error.message);
            return;
        }

        if (!this._testInitialized()) {
            return;
        }

        if (this.animated) {

            this._animationDestroy();

            if (!this.options.preventAnimation) {
                setTimeout(this.scrollDown, 20);
            }

            return;

        }

        let scrolltop = this.scrollTop(),
            height = parseFloat(getComputedStyle(document.body).height),
            viewport = document.documentElement.clientHeight,
            to = height - viewport;

        if (scrolltop === to) {
            return;
        }

        this._animation({
            draw: (progress) => {
                let result = (to - scrolltop) * progress + scrolltop;
                window.scrollTo(0, result);
            },
        });

    }

    scrollTo(node, offset) {

        if (this.constructor.name !== 'WC_ToScroll') {
            const error = new Error(`Class instance context is lost`);
            console.error(error.name + ': ' + error.message);
            return;
        }

        if (!this._testInitialized()) {
            return;
        }

        if (node === void 0) {
            const error = new Error(`Id for search not passed`);
            console.error(error.name + ': ' + error.message);
            return;
        }

        if (this.animated) {

            this._animationDestroy();

            setTimeout(() => {
                this.scrollTo(node, offset);
            }, 20);

            return;

        }

        if (typeof node === 'string') {

            node = document.getElementById(node.replace('#', ''));

            if (!node) {
                return;
            }

        }

        offset = offset === void 0 ? 0 : offset;

        let scrolltop = this.scrollTop(),
            to = this._getPositionNode(node);

        if (to === void 0) {
            return;
        }

        if (scrolltop === to.top) {
            return;
        }

        this._animation({
            draw: (progress) => {
                let result = ((to.top - offset) - scrolltop) * progress + scrolltop;
                window.scrollTo(0, result);
            },
        });

    }

    scrollTop() {
        const doc = document.scrollingElement || document.documentElement;
        return doc.scrollTop;
    }
    
    destroy() {

        if (this.constructor.name !== 'WC_ToScroll') {
            const error = new Error(`Class instance context is lost`);
            console.error(error.name + ': ' + error.message);
            return;
        }

        if (!this._testInitialized()) {
            return;
        }

        this._animationDestroy();

        if (this.buttons.up !== void 0) {
            this.buttons.up.remove();
        }

        if (this.buttons.down !== void 0) {
            this.buttons.down.remove();
        }

        for (let i = 0; i < window[`_${this.constructor.name}Global`].length; i++) {
            if (window[`_${this.constructor.name}Global`][i] === this.options.modifier) {
                window[`_${this.constructor.name}Global`].splice(i, 1);
                break;
            }
        }

        this.attr = void 0;
        this.data = void 0;
        this.buttons = void 0;
        this.options = void 0;

        this.settings = void 0;
        this.initialized = void 0;

        window.removeEventListener('resize', this._resize);
        document.removeEventListener('click', this._click);
        document.removeEventListener('keyup', this._keyup);
        document.removeEventListener('scroll', this._scroll);
        document.removeEventListener('contextmenu', this._contextmenu);

    }

    _optionsDefault() {

        return {
            duration: 1500,
            modifier: 'webcore',
            preventAnimation: false,
            timing: 'easeOutQuart',
        }

    }

    _optionsKeys() {

        return {
            keys: true,
            mouse: true,
        }

    }

    _createOptions() {

        this.buttons = {};

        this.options = this.settings === void 0 ? this._optionsDefault() : Object.assign(this._optionsDefault(), this.settings);
        this.options.timing = this.timing[this.options.timing] === void 0 ? 'easeInOutCubic' : this.timing[this.options.timing];

        this.data = {
            keysOptions: void 0,
            switchScrollTo: false,
            offsetScrollTo: 0,
        };

    }

    _createAttr() {

        this.attr = {
            up: `${this.options.modifier}-toscroll--up`,
            down: `${this.options.modifier}-toscroll--down`,
            button: `${this.options.modifier}-toscroll--button`,
            icon: `${this.options.modifier}-toscroll--icon`,
            iconUp: `${this.options.modifier}-toscroll--icon-up`,
            iconDown: `${this.options.modifier}-toscroll--icon-down`,
            active: `${this.options.modifier}-toscroll--active`,
            dataAttrScrollTo: `data-${this.options.modifier}-toscroll`,
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

    _createEventsListener() {

        this._click = this._click.bind(this);
        this._keyup = this._keyup.bind(this);
        this._resize = this._resize.bind(this);
        this._scroll = this._scroll.bind(this);
        this._contextmenu = this._contextmenu.bind(this);

        window.addEventListener('resize', this._resize);
        document.addEventListener('click', this._click);
        document.addEventListener('keyup', this._keyup);
        document.addEventListener('scroll', this._scroll);
        document.addEventListener('contextmenu', this._contextmenu);

    }

    _createTiming() {

        if (window._timing !== void 0) {
            this.timing = window._timing;
            return;
        }

        window._timing = {

            linear: (t) => {
                return t;
            },

            bounce: (t) => {
                for (let a = 0, b = 1, result; 1; a += b, b /= 2) {
                    if (t >= (7 - 4 * a) / 11) {
                        return -Math.pow((11 - 6 * a - 11 * t) / 4, 2) + Math.pow(b, 2);
                    }
                }
            },

            easeInQuad: (t) => {
                return t * t;
            },

            easeOutQuad: (t) => {
                return t * (2 - t);
            },

            easeInOutQuad: (t) => {
                return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
            },

            easeInCubic: (t) => {
                return t * t * t;
            },

            easeOutCubic: (t) => {
                return (--t) * t * t + 1;
            },

            easeInOutCubic: (t) => {
                return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
            },

            easeInQuart: (t) => {
                return t * t * t * t;
            },

            easeOutQuart: (t) => {
                return 1 - (--t) * t * t * t;
            },

            easeInOutQuart: (t) => {
                return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
            },

            easeInQuint: (t) => {
                return t * t * t * t * t;
            },

            easeOutQuint: (t) => {
                return 1 + (--t) * t * t * t * t;
            },

            easeInOutQuint: (t) => {
                return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
            },

        };

        this.timing = window._timing;

    }

    _createButton(settings, action) {

        if (settings === void 0 || action == void 0) {
            return;
        }

        const button = document.createElement('button');

        if (settings.title !== void 0) {
            button.setAttribute('title', settings.title);
            button.setAttribute('aria-label', settings.title);
        }

        button.classList.add(this.attr.button);
        button.classList.add(this.attr[action ? 'up' : 'down']);

        if (settings.icon !== void 0) {

            const icon = document.createElement('img');

            icon.setAttribute('src', settings.icon);
            icon.setAttribute('alt', settings.title === void 0 ? '/' : settings.title);

            icon.classList.add(this.attr.icon);
            icon.classList.add(this.attr[action ? 'iconUp' : 'iconDown']);

            button.appendChild(icon);

        }

        document.body.appendChild(button);

    }

    _searchButtons() {

        this.buttons = {
            up: document.getElementsByClassName(this.attr.up)[0],
            down: document.getElementsByClassName(this.attr.down)[0],
        };

    }

    _testInitialized() {
        
        if (this.initialized === void 0) {
            this.initialized = true;
        }
        
        return this.initialized ? true : false;
        
    }

    _getPositionNode(node) {

        if (node === void 0) {
            return;
        }

        const position = node.getBoundingClientRect();

        return {
            top: position.top + pageYOffset,
            left: position.left + pageXOffset,
        }

    }

    _animation(object) {

        this.animated = true;

        let fraction,
            progress,
            options = this.options,
            start = performance.now();

        const proto = this._animation.prototype = {

            action: (action) => {

                fraction = fraction === 0 ? 1 : (action - start) / options.duration;
                progress = options.timing(fraction);
                object.draw(progress);

                if (!this.animated) {
                    object.draw(progress);
                    fraction = 1;
                    return;
                }

                if (fraction <= 1) {
                    requestAnimationFrame(proto.action);
                    return;
                }

                if (fraction !== 1) {
                    object.draw(options.timing(fraction = 1));
                    this._animationDestroy();
                    return;
                }

            },

        };

        requestAnimationFrame(proto.action);

    }

    _animationDestroy() {
        this.animated = false;
    }

    _click(event) {

        let buttonUp = event.target.closest(`.${this.attr.up}`),
            buttonDown = event.target.closest(`.${this.attr.down}`),
            buttonTo = event.target.closest(`[${this.attr.dataAttrScrollTo}]`);

        if (this.data.switchScrollTo && buttonTo) {

            const currentAttr = buttonTo.getAttribute(this.attr.dataAttrScrollTo);

            if (!currentAttr) {
                return;
            }

            event.preventDefault();
            this.scrollTo(currentAttr, this.data.offsetScrollTo);
            return;

        }

        if (this.data.keysOptions !== void 0 && event.ctrlKey && this.data.keysOptions.mouse) {
            event.preventDefault();
            this.scrollUp();
            return;
        }

        if (buttonUp) {
            this.scrollUp();
            return;
        }

        if (buttonDown) {
            this.scrollDown();
            return;
        }

    }

    _keyup(event) {

        if (this.data.keysOptions !== void 0) {

            if (event.ctrlKey && this.data.keysOptions.keys && event.keyCode === 38) {
                this.scrollUp();
                return;
            }

            if (event.ctrlKey && this.data.keysOptions.keys && event.keyCode === 40) {
                this.scrollDown();
                return;
            }

        }

    }

    _resize() {
        setTimeout(() => {
            this._scroll();
        }, 500);
    }

    _scroll() {

        let height = parseFloat(getComputedStyle(document.body).height),
            viewport = document.documentElement.clientHeight,
            scrolltop = this.scrollTop();

        if (this.buttons.up) {
            this.buttons.up.classList[scrolltop > viewport ? 'add' : 'remove'](this.attr.active);
        }

        if (this.buttons.down) {
            this.buttons.down.classList[scrolltop > (height - (viewport * 2)) ? 'remove' : 'add'](this.attr.active);
        }

    }

    _contextmenu(event) {

        if (this.data.keysOptions !== void 0 && event.ctrlKey && this.data.keysOptions.mouse) {
            event.preventDefault();
            this.scrollDown();
            return;
        }

    }

}