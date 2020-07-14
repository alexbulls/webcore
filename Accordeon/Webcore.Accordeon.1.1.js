/*
 * WC_Accordeon 1.1
 *
 * Copyright 2020 Alexandr Bykov
 *
 * Released under the MIT License
 *
 * Released on: May 05, 2020
 */

class WC_Accordeon {

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
        
        this._createEventsListener();
        this._createRender();
        this._createMore();
        this._createAutoplay();

        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
        this.showAll = this.showAll.bind(this);
        this.hideAll = this.hideAll.bind(this);
        this.destroy = this.destroy.bind(this);
        this.autoplay = this.autoplay.bind(this);

    }

    show(container) {

        if (this.constructor.name !== 'WC_Accordeon') {
            const error = new Error(`Class instance context is lost`);
            console.error(error.name + ': ' + error.message);
            return;
        }

        if (!this._testInitialized()) {
            return;
        }

        if (!container === void 0) {
            return;
        }

        if (typeof container === 'number') {
            this._switchByPosition(container, 'show');
            return;
        }

        let cover = container.closest(`[${this.attr.dataAttrCover}]`);

        if (!cover) {
            return;
        }

        let body = container.getElementsByClassName(this.attr.body)[0],
            positionCover = cover.getAttribute(this.attr.dataAttrCover) * 1,
            positionContainer = container.getAttribute(this.attr.dataAttrContainer) * 1;

        if (container.classList.contains(this.attr.hidden)) {
            return;
        }

        if (!body) {
            return;
        }

        if (this.options.single) {
            this.hideAll(cover);
        }

        if (this._typeObject(this.options.before) === 'function') {
            this.options.before(container);
        }

        body.style.height = this.heights[positionCover][positionContainer];
        container.classList.add(this.attr.active);

    }

    hide(container) {

        if (this.constructor.name !== 'WC_Accordeon') {
            const error = new Error(`Class instance context is lost`);
            console.error(error.name + ': ' + error.message);
            return;
        }

        if (!this._testInitialized()) {
            return;
        }

        if (container === void 0) {
            return;
        }

        if (typeof container === 'number') {
            this._switchByPosition(container, 'hide');
            return;
        }

        let body = container.getElementsByClassName(this.attr.body)[0];

        if (container.classList.contains(this.attr.hidden)) {
            return;
        }

        if (!body) {
            return;
        }

        body.style.height = '0px';
        container.classList.remove(this.attr.active);

        if (this._typeObject(this.options.after) === 'function') {
            this.options.after(container);
        }

    }

    showAll(cover) {

        if (this.constructor.name !== 'WC_Accordeon') {
            const error = new Error(`Class instance context is lost`);
            console.error(error.name + ': ' + error.message);
            return;
        }

        if (!this._testInitialized()) {
            return;
        }

        if (cover === void 0) {

            let covers = document.getElementsByClassName(this.attr.cover);

            if (covers.length === 0) {
                return;
            }

            for (let i = 0; i < covers.length; i++) {
                this.showAll(covers[i]);
            }

            return;

        }

        let containers = cover.getElementsByClassName(this.attr.container);

        if (containers.length === 0) {
            return;
        }

        for (let i = 0; i < containers.length; i++) {
            if (!containers[i].classList.contains(this.attr.active)) {
                this.show(containers[i]);
            }
        }

    }

    hideAll(cover) {

        if (this.constructor.name !== 'WC_Accordeon') {
            const error = new Error(`Class instance context is lost`);
            console.error(error.name + ': ' + error.message);
            return;
        }

        if (!this._testInitialized()) {
            return;
        }

        if (cover === void 0) {

            let covers = document.getElementsByClassName(this.attr.cover);

            if (covers.length === 0) {
                return;
            }

            for (let i = 0; i < covers.length; i++) {
                this.hideAll(covers[i]);
            }

            return;

        }

        let containers = cover.getElementsByClassName(this.attr.container);

        if (containers.length === 0) {
            return;
        }

        for (let i = 0; i < containers.length; i++) {
            if (containers[i].classList.contains(this.attr.active)) {
                this.hide(containers[i]);
            }
        }

    }

    destroy() {

        if (this.constructor.name !== 'WC_Accordeon') {
            const error = new Error(`Class instance context is lost`);
            console.error(error.name + ': ' + error.message);
            return;
        }

        if (!this._testInitialized()) {
            return;
        }

        let covers = document.getElementsByClassName(this.attr.cover);

        for (let i = 0; i < covers.length; i++) {

            covers[i].removeAttribute(this.attr.dataAttrCover);

            let containers = covers[i].getElementsByClassName(this.attr.container),
                buttonMore = covers[i].getElementsByClassName(this.attr.more)[0];

            if (buttonMore) {
                buttonMore.remove();
            }

            for (let j = 0; j < containers.length; j++) {

                let head = containers[j].getElementsByClassName(this.attr.head)[0],
                    body = containers[j].getElementsByClassName(this.attr.body)[0];

                if (body) {
                    body.style.transition = '';
                    body.style.height = '';
                    body.style.overflow = '';
                }

                containers[j].style.display = '';
                containers[j].removeAttribute(this.attr.dataAttrContainer);
                containers[j].classList.remove(this.attr.active);
                containers[j].classList.remove(this.attr.hidden);

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
        
        this.options = void 0;
        this.attr = void 0;
        this.heights = void 0;
        this.timeouts = void 0;
        this.settings = void 0;
        this.initialized = void 0;

        window.removeEventListener('resize', this._resize);
        document.removeEventListener('click', this._click);

    }

    autoplay(timeout) {

        if (this.constructor.name !== 'WC_Accordeon') {
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
        this.options.single = true;
        this.options.autoplay = timeout < this.options.duration ? this.options.duration : timeout;

        this._createAutoplay();

    }

    _switchByPosition(number, action) {

        if (number === void 0 && action === void 0) {
            return;
        }

        let covers = document.getElementsByClassName(this.attr.cover);

        if (covers.length === 0) {
            return;
        }

        for (let i = 0; i < covers.length; i++) {

            let containers = covers[i].getElementsByClassName(this.attr.container);

            if (containers.length === 0) {
                return;
            }

            for (let j = 0; j < containers.length; j++) {

                let position = containers[j].getAttribute(this.attr.dataAttrContainer) * 1;

                if (position === number) {
                    this[action](containers[j]);
                }

            }

        }

    }

    _switchContainer(container) {

        if (container === void 0) {
            return;
        }

        container.classList.contains(this.attr.active) ? this.hide(container) : this.show(container);

    }
    
    _typeObject(object) {
        return {}.toString.call(object).slice(8, -1).toLowerCase();
    }

    _optionsDefault() {

        return {
            start: 0,
            visible: void 0,
            single: true,
            duration: 400,
            after: void 0,
            before: void 0,
            autoplay: void 0,
            modifier: 'webcore',
            bezier: 'cubic-bezier(.09,.78,.42,.98)',
        }

    }

    _optionsVisible() {

        return {
            display: void 0,
            buttonCreate: true,
            buttonClassNames: [],
            buttonInnerHTML: 'Show more',
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

    _createAttr() {

        this.attr = {
            head: `${this.options.modifier}-accordeon--head`,
            body: `${this.options.modifier}-accordeon--body`,
            more: `${this.options.modifier}-accordeon--more`,
            cover: `${this.options.modifier}-accordeon--cover`,
            active: `${this.options.modifier}-accordeon--active`,
            hidden: `${this.options.modifier}-accordeon--hidden`,
            container: `${this.options.modifier}-accordeon--container`,
            dataAttrCover: `data-${this.options.modifier}-accordeon--cover`,
            dataAttrContainer: `data-${this.options.modifier}-accordeon--container`,
        };

    }

    _createOptions() {

        this.options = this.settings === void 0 ? this._optionsDefault() : Object.assign(this._optionsDefault(), this.settings);
        
        if (this.options.visible !== void 0) {
            this.options.visible = Object.assign(this._optionsVisible(), this.settings.visible);
        }

        if (this.options.autoplay !== void 0) {
            this.timeouts = [];
            this.options.single = true;
            this.options.autoplay = this.options.autoplay < this.options.duration ? this.options.duration : this.options.autoplay;
        }

    }

    _createEventsListener() {

        this._click = this._click.bind(this);
        this._resize = this._resize.bind(this);

        window.addEventListener('resize', this._resize);
        document.addEventListener('click', this._click);

    }
    
    _createGlobalInitArray() {
        
        window[`_${this.constructor.name}Global`] = window[`_${this.constructor.name}Global`] !== void 0 ? window[`_${this.constructor.name}Global`] : [];
        
        if (window[`_${this.constructor.name}Global`].includes(this.options.modifier)) {
            return false;
        }
        
        window[`_${this.constructor.name}Global`].push(this.options.modifier);
        return true;
        
    }
    
    _createRender() {

        this.heights = [];

        const covers = document.getElementsByClassName(this.attr.cover);

        if (covers.length === 0) {
            return;
        }

        for (let i = 0; i < covers.length; i++) {

            let containersHeights = [];

            covers[i].setAttribute(this.attr.dataAttrCover, i);

            let containers = covers[i].getElementsByClassName(this.attr.container);

            if (containers.length === 0) {
                this.heights.push(containersHeights);
                continue;
            }

            if (this.options.start > containers.length - 1) {
                this.options.start = this._optionsDefault().start;
            }

            if (this.options.visible !== void 0 && this.options.start > this.options.visible.display - 1) {
                this.options.start = this._optionsDefault().start;
            }

            for (let j = 0; j < containers.length; j++) {

                let head = containers[j].getElementsByClassName(this.attr.head)[0],
                    body = containers[j].getElementsByClassName(this.attr.body)[0],
                    action = this.options.start === j ? true : false;

                if (!body) {
                    const error = new Error(`Missing ${this.attr.body} in ${this.attr.container}`);
                    console.error(error.name + ': ' + error.message);
                    break;
                }

                if (!head) {
                    const error = new Error(`Missing ${this.attr.head} in ${this.attr.container}`);
                    console.error(error.name + ': ' + error.message);
                    break;
                }

                body.style.overflow = 'hidden';
                body.style.transition = '';
                body.style.height = '';

                containers[j].setAttribute(this.attr.dataAttrContainer, j);
                containers[j].classList[action ? 'add' : 'remove'](this.attr.active);

                containersHeights.push(getComputedStyle(body).height);

                body.style.height = action ? containersHeights[j] : '0px';
                body.style.transition = `all ${this.options.duration}ms ${this.options.bezier} 0s`;

                if (this.options.visible !== void 0 && this.options.visible.display <= j) {
                    containers[j].style.display = 'none';
                    containers[j].classList.add(this.attr.hidden);
                }

            }

            this.heights.push(containersHeights);

        }

    }

    _createMore() {

        if (this.options.visible === void 0) {
            return;
        }

        if (this.options.visible.buttonCreate === false) {
            return;
        }

        const covers = document.getElementsByClassName(this.attr.cover);

        if (covers.length === 0) {
            return;
        }

        for (let i = 0; i < covers.length; i++) {

            const hiddens = covers[i].getElementsByClassName(this.attr.hidden);

            if (hiddens.length === 0) {
                continue;
            }

            const button = document.createElement('button');

            button.classList.add(this.attr.more);

            if (this.options.visible.buttonClassNames.length !== 0) {

                for (let i = 0; i < this.options.visible.buttonClassNames.length; i++) {
                    button.classList.add(this.options.visible.buttonClassNames[i]);
                }

            }

            button.innerHTML = this.options.visible.buttonInnerHTML;

            covers[i].appendChild(button);

        }

    }

    _createRedrawing() {

        this.heights = [];

        const covers = document.getElementsByClassName(this.attr.cover);

        if (covers.length === 0) {
            return;
        }

        for (let i = 0; i < covers.length; i++) {

            let containersHeights = [];

            let containers = covers[i].getElementsByClassName(this.attr.container);

            if (containers.length === 0) {
                this.heights.push(containersHeights);
                continue;
            }

            for (let j = 0; j < containers.length; j++) {

                let body = containers[j].getElementsByClassName(this.attr.body)[0],
                    action = containers[j].classList.contains(this.attr.active);

                if (!body) {
                    const error = new Error(`Missing ${this.attr.body} in ${this.attr.container}`);
                    console.error(error.name + ': ' + error.message);
                    break;
                }

                body.style.transition = '';
                body.style.height = '';

                containers[j].classList[action ? 'add' : 'remove'](this.attr.active);

                containersHeights.push(getComputedStyle(body).height);

                body.style.height = action ? containersHeights[j] : '0px';
                body.style.transition = `all ${this.options.duration}ms ${this.options.bezier} 0s`;

            }

            this.heights.push(containersHeights);

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

            let hiddens = covers[i].getElementsByClassName(this.attr.hidden);

            if (hiddens.length !== 0) {

                if ((containers.length - hiddens.length) < 2) {
                    clearTimeout(this.timeouts[i]);
                    this.timeouts[i] = null;
                    continue;
                }

            }

            clearTimeout(this.timeouts[i]);

            for (let j = 0; j < containers.length; j++) {

                if (!containers[j].classList.contains(this.attr.active)) {

                    if (containers.length - 1 === j) {
                        this._switchContainer(containers[0]);
                    }

                    continue;

                }

                let next = containers[j + 1] === void 0 ? containers[0] : containers[j + 1];
                next = next.classList.contains(this.attr.hidden) ? containers[0] : next;

                this._switchContainer(next);

                break;

            }

            this.timeouts[i] = setTimeout(() => {
                this._recursiveAutoplay();
            }, this.options.autoplay);

        }

    }

    _click(event) {

        let buttonHead = event.target.closest(`.${this.attr.head}`),
            buttonMore = event.target.closest(`.${this.attr.more}`);

        if (buttonHead) {
            this._clickSwitch(buttonHead);
            return;
        }

        if (buttonMore) {
            this._clickMore(buttonMore);
            return;
        }

    }
    
    _resize(event) {
        setTimeout(() => {
            this._createRedrawing();
        }, 500);
    }

    _clickSwitch(buttonHead) {

        if (buttonHead === void 0) {
            return;
        }

        let cover = buttonHead.closest(`[${this.attr.dataAttrCover}]`),
            container = buttonHead.closest(`[${this.attr.dataAttrContainer}]`);

        if (!cover || !container) {
            return;
        }

        if (this.options.autoplay > 0) {

            let position = cover.getAttribute(this.attr.dataAttrCover) * 1;

            if (this.timeouts[position] !== null) {
                clearTimeout(this.timeouts[position]);
                this.timeouts[position] = null;
            }

        }

        this._switchContainer(container);

    }

    _clickMore(buttonMore) {

        if (buttonMore === void 0) {
            return;
        }

        const cover = buttonMore.closest(`.${this.attr.cover}`);

        if (!cover) {
            return;
        }

        const containers = cover.getElementsByClassName(this.attr.container);

        if (containers.length === 0) {
            return;
        }

        for (let i = 0; i < containers.length; i++) {

            if (containers[i].classList.contains(this.attr.hidden)) {
                containers[i].style.display = '';
                containers[i].classList.remove(this.attr.hidden);
            }

        }

        buttonMore.remove();

    }

}