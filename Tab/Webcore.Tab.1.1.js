/*
 * WC_Tab 1.1
 *
 * Copyright 2020 Alexandr Bykov
 *
 * Released under the MIT License
 *
 * Released on: May 10, 2020
 */

class WC_Tab {

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
        
        this._createRender();
        this._createEventsListener();
        this._createAutoplay();

        this.show = this.show.bind(this);
        this.destroy = this.destroy.bind(this);
        this.autoplay = this.autoplay.bind(this);

    }

    show(cover, position) {
        
        if (this.constructor.name !== 'WC_Tab') {
            const error = new Error(`Class instance context is lost`);
            console.error(error.name + ': ' + error.message);
            return;
        }

        if (!this._testInitialized()) {
            return;
        }
        
        if (cover === void 0 && typeof position !== 'number') {
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
        
        const buttons = cover.getElementsByClassName(this.attr.button);
        
        if (buttons[position] === void 0) {
            return;
        }
        
        for (let i = 0; i < buttons.length; i++) {
            if (buttons[i].classList.contains(this.attr.active)) {
                if (i === position) {
                    return;
                }
            }
        }
        
        if (this._typeObject(this.options.before) === 'function') {
            this.options.before(cover);
        }
        
        this._hideAll(cover);
        
        let coverPosition = cover.getAttribute(this.attr.dataAttrCover) * 1,
            container = cover.getElementsByClassName(this.attr.container)[position];
        
        buttons[position].classList.add(this.attr.active);
        
        if (container !== void 0) {
            container.classList.add(this.attr.active);
            container.style.height = this.heights[coverPosition][position];
        }
        
        if (this._typeObject(this.options.after) === 'function') {
            this.options.after(cover);
        }
        
    }

    destroy() {
        
        if (this.constructor.name !== 'WC_Tab') {
            const error = new Error(`Class instance context is lost`);
            console.error(error.name + ': ' + error.message);
            return;
        }

        if (!this._testInitialized()) {
            return;
        }
        
        this.settings = void 0;
        this.initialized = void 0;

        let covers = document.getElementsByClassName(this.attr.cover);
        
        for (let i = 0; i < covers.length; i++) {

            covers[i].removeAttribute(this.attr.dataAttrCover);
            
            let buttons = covers[i].getElementsByClassName(this.attr.button),
                containers = covers[i].getElementsByClassName(this.attr.container);

            for (let j = 0; j < containers.length; j++) {

                let button = buttons[j],
                    container = containers[j];

                container.style.overflow = ``;
                container.style.transitionDelay = ``;
                container.style.transitionDuration = ``;
                container.style.transitionTimingFunction = ``;
                container.style.transitionProperty = ``;
                container.style.height = ``;

                if (button !== void 0) {
                    button.removeAttribute(this.attr.dataAttrButton);
                    button.classList.remove(this.attr.active);
                }

                container.classList.remove(this.attr.active);

            }
            
        }
        
        if (this.timeouts !== void 0) {
            for (let i = 0; i < this.timeouts.length; i++) {
                clearTimeout(this.timeouts[i]);
                this.timeouts[i] = null;
            }
        }
        
        for (let i = 0; i < window[`_${this.constructor.name}Global`].length; i++) {
            if (window[`_${this.constructor.name}Global`][i] === this.options.modifier) {
                window[`_${this.constructor.name}Global`].splice(i, 1);
                break;
            }
        }
        
        this.attr = void 0;
        this.options = void 0;
        this.heights = void 0;
        this.timeouts = void 0;

        window.removeEventListener('resize', this._resize);
        document.removeEventListener('click', this._click);
        
    }

    autoplay(timeout) {
        
        if (this.constructor.name !== 'WC_Tab') {
            const error = new Error(`Class instance context is lost`);
            console.error(error.name + ': ' + error.message);
            return;
        }

        if (!this._testInitialized()) {
            return;
        }

        if (timeout === void 0) {
            const error = new Error(`Need to pass a number as a parameter`);
            console.error(error.name + ': ' + error.message);
            return;
        }

        if (this.timeouts !== void 0) {
            const error = new Error(`Unable to run method again`);
            console.error(error.name + ': ' + error.message);
            return;
        }

        this.timeouts = [];
        this.options.autoplay = timeout < this.options.duration ? this.options.duration : timeout;

        this._createAutoplay();
        
    }
    
    _hideAll(cover) {
        
        if (cover === void 0) {
            return;
        }
        
        let buttons = cover.getElementsByClassName(this.attr.button),
            containers = cover.getElementsByClassName(this.attr.container);
        
        for (let i = 0; i < containers.length; i++) {
            
            containers[i].style.height = '0px';
            containers[i].classList.remove(this.attr.active);
            
            if (buttons[i] !== void 0) {
                buttons[i].classList.remove(this.attr.active);
            }
            
        }
        
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
            start: 0,
            duration: 400,
            after: void 0,
            before: void 0,
            autoplay: void 0,
            modifier: 'webcore',
            bezier: 'cubic-bezier(.09,.78,.42,.98)',
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
        
        this.heights = [];
        this.options = this.settings === void 0 ? this._optionsDefault() : Object.assign(this._optionsDefault(), this.settings);
        
        if (this.options.autoplay !== void 0) {
            this.timeouts = [];
            this.options.autoplay = this.options.autoplay < this.options.duration ? this.options.duration : this.options.autoplay;
        }
        
    }

    _createAttr() {

        this.attr = {
            cover: `${this.options.modifier}-tab--cover`,
            button: `${this.options.modifier}-tab--button`,
            active: `${this.options.modifier}-tab--active`,
            container: `${this.options.modifier}-tab--container`,
            dataAttrCover: `data-${this.options.modifier}-tab--cover`,
            dataAttrButton: `data-${this.options.modifier}-tab--button`,
        };

    }

    _createRender() {
        
        this.heights = [];
        
        const covers = document.getElementsByClassName(this.attr.cover);
        
        if (covers.length === 0) {
            return;
        }

        for (let i = 0; i < covers.length; i++) {

            let array = [];

            covers[i].setAttribute(this.attr.dataAttrCover, i);
            
            let buttons = covers[i].getElementsByClassName(this.attr.button),
                containers = covers[i].getElementsByClassName(this.attr.container);

            if (buttons.length === 0 || containers.length === 0) {
                this.heights.push(array);
                continue;
            }

            if (this.options.start > buttons.length - 1) {
                this.options.start = this._optionsDefault().start;
            }

            for (let j = 0; j < containers.length; j++) {

                let button = buttons[j],
                    container = containers[j],
                    action = this.options.start === j ? true : false;

                container.style.overflow = `hidden`;
                container.style.transitionDelay = ``;
                container.style.transitionDuration = ``;
                container.style.transitionTimingFunction = ``;
                container.style.transitionProperty = ``;
                container.style.height = `auto`;

                if (button !== void 0) {
                    button.setAttribute(this.attr.dataAttrButton, j);
                    button.classList[action ? 'add' : 'remove'](this.attr.active);
                }

                let height = getComputedStyle(container).height;

                container.classList[action ? 'add' : 'remove'](this.attr.active);
                container.style.height = action ? height : '0px';
                container.style.transitionDelay = `0s`;
                container.style.transitionDuration = `${this.options.duration}ms`;
                container.style.transitionTimingFunction = `${this.options.bezier}`;
                container.style.transitionProperty = `opacity, transform`;

                array.push(height);

            }

            this.heights.push(array);

        }

    }
    
    _createRedrawing() {
        
        this.heights = [];
        
        const covers = document.getElementsByClassName(this.attr.cover);
        
        if (covers.length === 0) {
            return;
        }

        for (let i = 0; i < covers.length; i++) {

            let array = [];
            
            let containers = covers[i].getElementsByClassName(this.attr.container);

            if (containers.length === 0) {
                this.heights.push(array);
                continue;
            }

            for (let j = 0; j < containers.length; j++) {

                let container = containers[j],
                    action = containers[j].classList.contains(this.attr.active);

                container.style.transitionDuration = ``;
                container.style.height = `auto`;

                let height = getComputedStyle(container).height;

                container.style.height = action ? height : '0px';
                container.style.transitionDuration = `${this.options.duration}ms`;

                array.push(height);

            }

            this.heights.push(array);

        }
        
    }
    
    _createAutoplay() {
        
        if (this.options.autoplay === void 0) {
            return;
        }

        setTimeout(() => {
            this._recursiveAutoplay();
        }, this.options.autoplay);
        
    }
    
    _recursiveAutoplay() {
        
        let covers = document.getElementsByClassName(this.attr.cover);

        if (covers.length === 0) {
            return;
        }

        for (let i = 0; i < covers.length; i++) {

            let containers = covers[i].getElementsByClassName(this.attr.container);

            if (this.timeouts[i] === null) {
                continue;
            }

            if (containers.length < 2) {
                continue;
            }

            clearTimeout(this.timeouts[i]);

            for (let j = 0; j < containers.length; j++) {

                if (!containers[j].classList.contains(this.attr.active)) {

                    if (containers.length - 1 === j) {
                        this.show(i, 0);
                    }

                    continue;

                }

                this.show(i, containers[j + 1] === void 0 ? 0 : j + 1);

                break;

            }

            this.timeouts[i] = setTimeout(() => {
                this._recursiveAutoplay();
            }, this.options.autoplay);

        }
        
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
        this._resize = this._resize.bind(this);

        window.addEventListener('resize', this._resize);
        document.addEventListener('click', this._click);

    }

    _click(event) {
        
        const button = event.target.closest(`.${this.attr.button}`);

        if (button) {
            
            let cover = button.closest(`[${this.attr.dataAttrCover}]`),
                positionCover = cover.getAttribute(this.attr.dataAttrCover) * 1,
                positionButton = button.getAttribute(this.attr.dataAttrButton) * 1;
            
            if (!cover || typeof positionButton !== 'number') {
                return;
            }
            
            if (this.options.autoplay > 0 && this.timeouts[positionCover] !== null) {
                clearTimeout(this.timeouts[positionCover]);
                this.timeouts[positionCover] = null;
            }
            
            this.show(cover, positionButton);
            
            return;
            
        }
        
    }

    _resize() {
        
        setTimeout(() => {
            this._createRedrawing();
        }, 500);
        
    }

}