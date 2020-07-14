/*
 * WC_Gallery 1.1
 *
 * Copyright 2020 Alexandr Bykov
 *
 * Released under the MIT License
 *
 * Released on: May 30, 2020
 */

class WC_Gallery {

    // methods

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

        this._createData();
        this._createDataIcons();
        this._createComponents();
        this._createDataGallery();
        this._createEventsListener();
        this._createBindEventsListener();
        this._addEventListeners();

        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
        this.destroy = this.destroy.bind(this);

    }

    show(position, group) {

        if (this.constructor.name !== 'WC_Gallery') {
            const error = new Error(`Class instance context is lost`);
            console.error(error.name + ': ' + error.message);
            return;
        }

        if (!this._testInitialized()) {
            return;
        }

        if (this.data.appearance) {
            return;
        }

        if (this.nodes.cover.classList.contains(this._attr.active)) {
            return;
        }

        if (this.gallery[this.data.currentGroup] === void 0) {
            return;
        }

        if (typeof position === 'number') {
            this.data.currentStep = position;
        }

        if (typeof group === 'string') {
            this.data.currentGroup = group;
        }

        this._scrollDisable();
        this.data.direction = 'x';
        this.data.transition = false;

        this._renderTrackSlides();
        this._renderThumbnailsSlides();
        this._createDataSteps();
        this._actionSlide();

        this.nodes.cover.classList.add(this._attr.active);

        setTimeout(() => {
            this.data.appearance = true;
        }, this.data.appearanceDuration);

    }

    hide() {

        if (this.constructor.name !== 'WC_Gallery') {
            const error = new Error(`Class instance context is lost`);
            console.error(error.name + ': ' + error.message);
            return;
        }

        if (!this._testInitialized()) {
            return;
        }

        if (!this.nodes.cover.classList.contains(this._attr.active)) {
            return;
        }

        this._actionScaleOff();
        this._actionAutoplayOff();

        if (!this.options.thumbnailsBox) {
            this._actionThumbnailsOff();
        }

        this.nodes.cover.classList.remove(this._attr.active);

        setTimeout(() => {
            this._scrollEnable();
            this.data.appearance = false;
        }, this.data.appearanceDuration);

    }

    destroy() {

        if (this.constructor.name !== 'WC_Gallery') {
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

        this.data = void 0;
        this.coords = void 0;
        this.nodes = void 0;
        this.gallery = void 0;
        this.attr = void 0;
        this.options = void 0;

    }


    // init test

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

        if (!document.querySelector(`[${this.attr.item}]`)) {

            this.destroy();

            return;

        }

        return true;

    }

    _createGlobalInitArray() {

        window[`_${this.constructor.name}Global`] = window[`_${this.constructor.name}Global`] !== void 0 ? window[`_${this.constructor.name}Global`] : [];

        if (window[`_${this.constructor.name}Global`].includes(this.options.modifier)) {
            return false;
        }

        window[`_${this.constructor.name}Global`].push(this.options.modifier);
        return true;

    }


    // scrollbar

    _scrollDisable() {

        if (!this.data.touch && this.options.switchScroll) {
            document.body.style.paddingRight = window.innerWidth - document.documentElement.clientWidth + 'px';
            document.body.style.overflow = 'hidden';
        }

    }

    _scrollEnable() {

        if (!this.data.touch && this.options.switchScroll) {
            document.body.style.paddingRight = '';
            document.body.style.overflow = '';
        }

    }


    // options

    _optionsDefault() {

        return {
            loop: false,
            scale: true,
            infobar: true,
            autoplay: true,
            thumbnails: true,
            thumbnailsBox: true,
            progressbar: true,

            arrows: true,
            zIndex: 1100,
            single: false,
            separator: '/',
            keyboard: true,
            hideKeyEsc: true,
            modifier: 'webcore',
            switchScroll: true,
            swipingMomentum: false,
            hideClickOutImage: true,
            autoplayDuration: 5000,
            transitionDuration: 350,
        }

    }


    // this instance

    _createOptions() {
        this.options = this.settings === void 0 ? this._optionsDefault() : Object.assign(this._optionsDefault(), this.settings);
        this.options.autoplayDuration = this.options.autoplayDuration < this.options.transitionDuration ? this.options.transitionDuration : this.options.autoplayDuration;
    }

    _createData() {

        this.data = {
            appearance: false,
            appearanceDuration: 350,
            touch: 'ontouchstart' in document,
            autoplay: void 0,
            direction: void 0,
            dragready: false,
            draggable: void 0,
            transition: true,
            directionPX: 10,
            momentumPX: this.options.swipingMomentum ? 0 : document.documentElement.clientWidth / 15,
            currentGroup: void 0,
            currentStep: void 0,
            currentTrackSlide: void 0,
            currentTrackImage: void 0,
            quantitySteps: void 0,
            trackStepWidth: void 0,
            trackStepHeight: void 0,
            thumbnailsStepWidth: void 0,
            thumbnailsStepHeight: void 0,
        };

        this.coords = {
            down: {},
            move: {},
        };

        this.nodes = {};

        this.gallery = {};
        
        this.eventsNames = {
            start: this.data.touch ? 'touchstart' : 'mousedown',
            move: this.data.touch ? 'touchmove' : 'mousemove',
            end: this.data.touch ? 'touchend' : 'mouseup',
        };
        
    }

    _createAttr() {

        const modifier = this._optionsDefault().modifier;

        this.attr = {
            item: `data-${this.options.modifier}-gallery`,
            title: `data-${this.options.modifier}-gallery-title`,
            subtitle: `data-${this.options.modifier}-gallery-subtitle`,
        };

        this._attr = {
            
            grabbing: `${modifier}-gallery--grabbing`,
            
            active: `${modifier}-gallery--active`,
            noactive: `${modifier}-gallery--noactive`,
            
            visible: `${modifier}-gallery--visible`,

            icon: `${modifier}-gallery--icon`,

            cover: `${modifier}-gallery--cover`,
            inner: `${modifier}-gallery--inner`,

            top: `${modifier}-gallery--top`,
            center: `${modifier}-gallery--center`,
            bottom: `${modifier}-gallery--bottom`,

            infobar: `${modifier}-gallery--infobar`,
            infobarItem: `${modifier}-gallery--infobar-item`,
            infobarCurrent: `${modifier}-gallery--infobar-current`,
            infobarSeparator: `${modifier}-gallery--infobar-separator`,
            infobarQuantity: `${modifier}-gallery--infobar-quantity`,

            toolbar: `${modifier}-gallery--toolbar`,
            toolbarItem: `${modifier}-gallery--toolbar-item`,
            toolbarScale: `${modifier}-gallery--toolbar-scale`,
            toolbarThumbnails: `${modifier}-gallery--toolbar-thumbnails`,
            toolbarAutoplay: `${modifier}-gallery--toolbar-autoplay`,
            toolbarAutoplayPlay: `${modifier}-gallery--toolbar-autoplay-play`,
            toolbarAutoplayPaused: `${modifier}-gallery--toolbar-autoplay-paused`,
            toolbarHide: `${modifier}-gallery--toolbar-hide`,

            autoplaybar: `${modifier}-gallery--autoplaybar`,
            autoplaybarSlide: `${modifier}-gallery--autoplaybar-slide`,

            track: `${modifier}-gallery--track`,
            trackSlide: `${modifier}-gallery--track-slide`,
            trackImage: `${modifier}-gallery--track-image`,

            navbar: `${modifier}-gallery--navbar`,
            navbarItem: `${modifier}-gallery--navbar-item`,
            navbarPrev: `${modifier}-gallery--navbar-prev`,
            navbarNext: `${modifier}-gallery--navbar-next`,

            progressbar: `${modifier}-gallery--progressbar`,
            progressbarSlide: `${modifier}-gallery--progressbar-slide`,

            thumbnails: `${modifier}-gallery--thumbnails`,
            thumbnailsItem: `${modifier}-gallery--thumbnails-item`,
            thumbnailsImage: `${modifier}-gallery--thumbnails-image`,

            descbar: `${modifier}-gallery--descbar`,
            descbarTitle: `${modifier}-gallery--descbar-title`,
            descbarSubtitle: `${modifier}-gallery--descbar-subtitle`,

        };

    }

    _createDataIcons() {

        if (this.icons !== void 0) {
            return;
        }

        this.icons = {

            scale: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="${this._attr.icon}"><path d="M18.7 17.3l-3-3a5.9 5.9 0 0 0-.6-7.6 5.9 5.9 0 0 0-8.4 0 5.9 5.9 0 0 0 0 8.4 5.9 5.9 0 0 0 7.7.7l3 3a1 1 0 0 0 1.3 0c.4-.5.4-1 0-1.5zM8.1 13.8a4 4 0 0 1 0-5.7 4 4 0 0 1 5.7 0 4 4 0 0 1 0 5.7 4 4 0 0 1-5.7 0z"/></svg>`,

            play: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="${this._attr.icon} ${this._attr.toolbarAutoplayPlay}"><path d="M6.5 5.4v13.2l11-6.6z"/></svg>`,

            paused: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="${this._attr.icon} ${this._attr.toolbarAutoplayPaused}"><path d="M8.33 5.75h2.2v12.5h-2.2V5.75zm5.15 0h2.2v12.5h-2.2V5.75z"/></svg>`,

            thumbnails: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="${this._attr.icon}"><path d="M14.59 14.59h3.76v3.76h-3.76v-3.76zm-4.47 0h3.76v3.76h-3.76v-3.76zm-4.47 0h3.76v3.76H5.65v-3.76zm8.94-4.47h3.76v3.76h-3.76v-3.76zm-4.47 0h3.76v3.76h-3.76v-3.76zm-4.47 0h3.76v3.76H5.65v-3.76zm8.94-4.47h3.76v3.76h-3.76V5.65zm-4.47 0h3.76v3.76h-3.76V5.65zm-4.47 0h3.76v3.76H5.65V5.65z"/></svg>`,

            hide: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="${this._attr.icon}"><path d="M12 10.6L6.6 5.2 5.2 6.6l5.4 5.4-5.4 5.4 1.4 1.4 5.4-5.4 5.4 5.4 1.4-1.4-5.4-5.4 5.4-5.4-1.4-1.4-5.4 5.4z"/></svg>`,

            prev: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="${this._attr.icon}"><path d="M11.28 15.7l-1.34 1.37L5 12l4.94-5.07 1.34 1.38-2.68 2.72H19v1.94H8.6z"/></svg>`,

            next: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="${this._attr.icon}"><path d="M15.4 12.97l-2.68 2.72 1.34 1.38L19 12l-4.94-5.07-1.34 1.38 2.68 2.72H5v1.94z"/></svg>`,

        };

    }

    _createComponents() {

        let fragment = document.createDocumentFragment(),
            cover = document.createElement('div'),
            inner = document.createElement('div'),
            top = document.createElement('div'),
            center = document.createElement('div'),
            bottom = document.createElement('div'),
            infobar = document.createElement('div'),
            toolbar = document.createElement('div'),
            hide = document.createElement('button'),
            track = document.createElement('div'),
            descbar = document.createElement('div'),
            descbarTitle = document.createElement('span'),
            descbarSubtitle = document.createElement('span');

        cover.classList.add(this._attr.cover);
        inner.classList.add(this._attr.inner);

        top.classList.add(this._attr.top);
        center.classList.add(this._attr.center);
        bottom.classList.add(this._attr.bottom);

        infobar.classList.add(this._attr.infobar);
        toolbar.classList.add(this._attr.toolbar);
        hide.classList.add(this._attr.toolbarItem);
        hide.classList.add(this._attr.toolbarHide);
        hide.innerHTML = this.icons.hide;

        track.classList.add(this._attr.track);

        descbar.classList.add(this._attr.descbar);
        descbarTitle.classList.add(this._attr.descbarTitle);
        descbarSubtitle.classList.add(this._attr.descbarSubtitle);

        if (this.options.infobar) {

            let infobarCurrent = document.createElement('span'),
                infobarSeparator = document.createElement('span'),
                infobarQuantity = document.createElement('span');

            infobarCurrent.classList.add(this._attr.infobarItem);
            infobarSeparator.classList.add(this._attr.infobarItem);
            infobarQuantity.classList.add(this._attr.infobarItem);

            infobarCurrent.classList.add(this._attr.infobarCurrent);
            infobarSeparator.classList.add(this._attr.infobarSeparator);
            infobarQuantity.classList.add(this._attr.infobarQuantity);

            infobarSeparator.textContent = ` ${this.options.separator} `;

            this.nodes.stepCurrent = infobarCurrent;
            this.nodes.stepQuantity = infobarQuantity;

            infobar.append(infobarCurrent);
            infobar.append(infobarSeparator);
            infobar.append(infobarQuantity);

        }

        if (this.options.scale) {

            let button = document.createElement('button');

            button.classList.add(this._attr.toolbarItem);
            button.classList.add(this._attr.toolbarScale);

            button.innerHTML = this.icons.scale;

            toolbar.append(button);

            this.nodes.buttonScale = button;

        }

        if (this.options.autoplay) {

            let button = document.createElement('button'),
                autoplaybar = document.createElement('div'),
                autoplaybarSlide = document.createElement('div');

            autoplaybar.classList.add(this._attr.autoplaybar);
            autoplaybarSlide.classList.add(this._attr.autoplaybarSlide);
            autoplaybarSlide.style.animationDuration = `${this.options.autoplayDuration}ms`;

            button.classList.add(this._attr.toolbarItem);
            button.classList.add(this._attr.toolbarAutoplay);
            button.innerHTML = this.icons.play + this.icons.paused;

            autoplaybar.append(autoplaybarSlide);
            top.append(autoplaybar);
            toolbar.append(button);

            this.nodes.buttonAutoplay = button;
            this.nodes.autoplaybar = autoplaybar;
            this.nodes.autoplaybarSlide = autoplaybarSlide;

        }

        if (this.options.thumbnails) {

            let button = document.createElement('button'),
                thumbnails = document.createElement('div');

            button.classList.add(this._attr.toolbarItem);
            button.classList.add(this._attr.toolbarThumbnails);

            thumbnails.classList.add(this._attr.thumbnails);

            if (this.options.thumbnailsBox) {
                thumbnails.classList.add(this._attr.active);
            }

            button.innerHTML = this.icons.thumbnails;

            this.nodes.buttonThumbnails = button;
            this.nodes.thumbnails = thumbnails;

            toolbar.append(button);
            bottom.append(thumbnails);

        }

        if (this.options.arrows) {

            let navbar = document.createElement('div'),
                prev = document.createElement('button'),
                next = document.createElement('button');

            navbar.classList.add(this._attr.navbar);

            prev.classList.add(this._attr.navbarItem);
            prev.classList.add(this._attr.navbarPrev);

            prev.innerHTML = this.icons.prev;
            next.innerHTML = this.icons.next;

            next.classList.add(this._attr.navbarItem);
            next.classList.add(this._attr.navbarNext);

            navbar.append(prev);
            navbar.append(next);

            center.append(navbar);

            this.nodes.buttonPrev = prev;
            this.nodes.buttonNext = next;

        }

        if (this.options.progressbar) {

            let progressbar = document.createElement('div'),
                progressbarSlide = document.createElement('div');

            progressbar.classList.add(this._attr.progressbar);
            progressbarSlide.classList.add(this._attr.progressbarSlide);

            this.nodes.progressbar = progressbar;
            this.nodes.progressbarSlide = progressbarSlide;

            progressbar.append(progressbarSlide);
            bottom.append(progressbar);

        }

        top.append(infobar);
        toolbar.append(hide);
        top.append(toolbar);

        center.append(track);

        descbar.append(descbarTitle);
        descbar.append(descbarSubtitle);

        center.append(descbar);

        inner.append(top);
        inner.append(center);
        inner.append(bottom);

        cover.style.zIndex = this.options.zIndex;
        cover.style.transitionDuration = `${this.data.appearanceDuration}ms`;
        track.style.transitionDuration = `${this.options.transitionDuration}ms`;

        cover.append(inner);

        fragment.append(cover);

        document.body.append(fragment);

        this.nodes.cover = cover;
        this.nodes.inner = inner;
        this.nodes.top = top;
        this.nodes.center = center;
        this.nodes.bottom = bottom;
        this.nodes.track = track;
        this.nodes.descbarTitle = descbarTitle;
        this.nodes.descbarSubtitle = descbarSubtitle;

    }


    // events

    _createEventsListener() {

        this.events = {

            document: {

                [this.eventsNames.start]: (event) => {
                    
                    let track = event.target.closest(`.${this._attr.track}`);

                    if (track) {

                        if (!this.data.touch) {
                            event.preventDefault();
                        }
                        
                        if (!this.data.appearance) {
                            return;
                        }
                        
                        this.coords.down = {
                            x: !this.data.touch ? event.clientX : event.targetTouches[0].clientX,
                            y: !this.data.touch ? event.clientY : event.targetTouches[0].clientY,
                        };
                        
                        this.data.draggable = 'track';
                        this.data.direction = void 0;
                        this.data.dragready = false;
                        this.data.transition = false;

                        document.addEventListener([this.eventsNames.move], this.events.document[this.eventsNames.move]);
                        document.addEventListener([this.eventsNames.end], this.events.document[this.eventsNames.end]);

                        return;

                    }

                },

                click: (event) => {

                    let item = event.target.closest(`[${this.attr.item}]`),
                        center = event.target.closest(`.${this._attr.center}`),
                        trackImage = event.target.closest(`.${this._attr.trackImage}`),
                        buttonHide = event.target.closest(`.${this._attr.toolbarHide}`),
                        buttonPrev = event.target.closest(`.${this._attr.navbarPrev}`),
                        buttonNext = event.target.closest(`.${this._attr.navbarNext}`),
                        buttonScale = event.target.closest(`.${this._attr.toolbarScale}`),
                        buttonAutoplay = event.target.closest(`.${this._attr.toolbarAutoplay}`),
                        buttonThumbnails = event.target.closest(`.${this._attr.toolbarThumbnails}`),
                        thumbnailsItem = event.target.closest(`.${this._attr.thumbnailsItem}`);

                    if (item) {
                        event.preventDefault();
                        this._createCurrentGroup(item);
                        this._createCurrentStep(item, `[${this.attr.item}="${this.data.currentGroup}"]`);
                        this._createQuantitySteps();
                        this.show();
                        return;
                    }

                    if (buttonHide && this.data.appearance) {
                        this.hide();
                        return;
                    }

                    if (buttonPrev && this.data.appearance) {
                        
                        if (buttonPrev.classList.contains(this._attr.noactive)) {
                            return;
                        }
                        
                        this._actionScaleOff();
                        this._actionAutoplayOff();
                        this._actionPrev();
                        
                        return;
                        
                    }

                    if (buttonNext && this.data.appearance) {
                        
                        if (buttonNext.classList.contains(this._attr.noactive)) {
                            return;
                        }
                        
                        this._actionScaleOff();
                        this._actionAutoplayOff();
                        this._actionNext();
                        
                        return;
                        
                    }

                    if (buttonScale && this.data.appearance) {

                        if (this.data.direction === void 0) {
                            this._actionAutoplayOff();
                            this._actionScaleSwitch();
                        }

                        return;

                    }

                    if (buttonAutoplay && this.data.appearance) {
                        
                        if (buttonAutoplay.classList.contains(this._attr.noactive)) {
                            return;
                        }
                        
                        this._actionAutoplaySwitch();
                        
                        return;
                        
                    }

                    if (buttonThumbnails && this.data.appearance) {
                        this._actionScaleOff();
                        this._actionThumbnailsSwitch();
                        return;
                    }

                    if (thumbnailsItem && this.data.appearance) {
                        
                        if (thumbnailsItem.classList.contains(this._attr.active)) {
                            return;
                        }
                            
                        this._actionAutoplayOff();
                        this._actionScaleOff();
                        this._createCurrentStep(thumbnailsItem, `.${this._attr.thumbnailsItem}`);
                        this.data.direction = 'x';
                        this.data.draggable = void 0;
                        this.data.transition = false;
                        this._actionSlide();
                        
                        return;
                        
                    }

                    if (trackImage && this.data.appearance) {

                        if (this.options.scale && this.data.direction === void 0) {
                            this._actionAutoplayOff();
                            this._actionScaleSwitch();
                        }

                        return;

                    }

                    if (center && !trackImage && this.data.appearance) {

                        if (this.options.hideClickOutImage && this.data.direction === void 0) {
                            this.hide();
                        }

                        return;

                    }

                },

                keyup: (event) => {

                    if (this.options.keyboard && this.data.appearance) {

                        if (event.keyCode === 39) {
                            this._actionScaleOff();
                            this._actionNext();
                            return;
                        }

                        if (event.keyCode === 37) {
                            this._actionScaleOff();
                            this._actionPrev();
                            return;
                        }

                    }

                    if (event.keyCode === 27 && this.options.hideKeyEsc && this.data.appearance) {
                        this.hide();
                        return;
                    }

                },

                [this.eventsNames.move]: (event) => {
                    
                    this.coords.move = {
                        x: !this.data.touch ? event.clientX : event.targetTouches[0].clientX,
                        y: !this.data.touch ? event.clientY : event.targetTouches[0].clientY,
                    };

                    this._createDragDirection();

                    if (this.data.draggable === 'track') {
                        this._actionMatrixTrack();
                    }

                },

                [this.eventsNames.end]: (event) => {

                    this.data.dragready = true;

                    if (this.data.draggable === 'track') {
                        this._actionMatrixTrack();
                    }

                    this.data.draggable = void 0;
                    
                    document.removeEventListener([this.eventsNames.move], this.events.document[this.eventsNames.move]);
                    document.removeEventListener([this.eventsNames.end], this.events.document[this.eventsNames.end]);

                },

                dragstart: (event) => {

                    if (event.target.closest(`.${this._attr.track}`)) {
                        event.preventDefault();
                        return;
                    }

                },
                
                wheel: (event) => {},
                
            },

            window: {

                resize: () => {
                    
                    if (!this.data.appearance) {
                        return;
                    }
                    
                    setTimeout(() => {
                        
                        this._createDataSteps();
                        this._actionSlide();
                        
                    }, 400);
                    
                },

            },

        };

    }

    _createBindEventsListener() {

        if (this.events === void 0) {
            return;
        }

        for (let key in this.events.document) {
            this.events.document[key].bind(this);
        }

        for (let key in this.events.window) {
            this.events.window[key].bind(this);
        }

    }

    _addEventListeners() {

        if (this.events === void 0) {
            return;
        }

        for (let key in this.events.document) {
            if (key !== this.eventsNames.move && key !== this.eventsNames.end) {
                document.addEventListener(key, this.events.document[key]);
            }
        }

        for (let key in this.events.window) {
            window.addEventListener(key, this.events.window[key]);
        }

    }

    _removeEventListeners() {

        if (this.events === void 0) {
            return;
        }

        for (let key in this.events.document) {
            document.removeEventListener(key, this.events.document[key]);
        }

        for (let key in this.events.window) {
            window.removeEventListener(key, this.events.window[key]);
        }

    }


    // data

    _createCurrentGroup(target) {

        if (target === void 0) {
            return;
        }

        this.data.currentGroup = target.getAttribute(this.attr.item);

    }

    _createCurrentStep(target, selector) {

        if (target === void 0 || selector === void 0) {
            this.data.currentStep = 0;
            return;
        }

        const items = document.querySelectorAll(selector);

        for (let i = 0; i < items.length; i++) {
            if (items[i] === target) {
                this.data.currentStep = i;
                break;
            }
        }

    }

    _createQuantitySteps() {
        this.data.quantitySteps = this.data.currentGroup === void 0 ? 0 : this.gallery[this.data.currentGroup].length;
    }

    _createDataGallery() {

        const items = document.querySelectorAll(`[${this.attr.item}]`);

        if (items.length === 0) {
            return;
        }

        for (let i = 0; i < items.length; i++) {

            let path = items[i].getAttribute('href'),
                name = items[i].getAttribute(this.attr.item),
                title = items[i].getAttribute(this.attr.title),
                subtitle = items[i].getAttribute(this.attr.subtitle);

            if (!path) {
                continue;
            }

            if (this.gallery[name] === void 0) {
                this.gallery[name] = [];
            }

            this.gallery[name].push({
                path: path,
                title: title,
                subtitle: subtitle,
            });

        }

    }

    _createDataSteps() {

        this.data.trackStepWidth = parseFloat(getComputedStyle(this.nodes.center).width);
        this.data.trackStepHeight = parseFloat(getComputedStyle(this.nodes.center).height);
        this.data.trackStepStart = 0;
        this.data.trackStepEnd = this.data.trackStepWidth * (this.data.quantitySteps - 1);
        
        if (!this.options.thumbnails) {
            return;
        }
        
        this.data.thumbnailsStepMargin = parseFloat(getComputedStyle(this.nodes.thumbnailsSlides[0]).marginRight);
        this.data.thumbnailsStepWidth = parseFloat(getComputedStyle(this.nodes.thumbnailsSlides[0]).width) + this.data.thumbnailsStepMargin;
        this.data.thumbnailsStepHeight = parseFloat(getComputedStyle(this.nodes.thumbnailsSlides[0]).height);
        this.data.thumbnailsStepQuantity = (~~(parseFloat(getComputedStyle(this.nodes.bottom).width) / this.data.thumbnailsStepWidth)) - 1;
        this.data.thumbnailsStepQuantityDifference = parseFloat(getComputedStyle(this.nodes.bottom).width) - (this.data.thumbnailsStepWidth * this.data.thumbnailsStepQuantity);
        this.data.thumbnailsStepStart = 0;
        this.data.thumbnailsStepEnd = -(this.data.thumbnailsStepWidth * (this.data.quantitySteps - this.data.thumbnailsStepQuantity) - this.data.thumbnailsStepMargin - this.data.thumbnailsStepQuantityDifference);

    }

    _createDragDirection() {

        if (this.data.direction !== void 0) {
            return;
        }

        if (Math.abs(this.coords.down.x - this.coords.move.x) > this.data.directionPX) {
            this.data.direction = 'x';
            return;
        }

        if (Math.abs(this.coords.down.y - this.coords.move.y) > this.data.directionPX) {
            this.data.direction = 'y';
            return;
        }

    }

    _createSlide(data) {

        let item = this.gallery[this.data.currentGroup][data.position],
            slide = document.createElement('div'),
            image = document.createElement('img');

        slide.classList.add(data.classNameSlide);

        image.setAttribute('src', item.path);
        image.classList.add(data.classNameImage);

        slide.append(image);
        
        return slide;
        
    }


    // render

    _renderDescbar() {

        let current = this.gallery[this.data.currentGroup][this.data.currentStep];

        this.nodes.descbarTitle.innerHTML = current.title !== null ? current.title : '';
        this.nodes.descbarSubtitle.innerHTML = current.subtitle !== null ? current.subtitle : '';

    }

    _renderProgressStep(move) {

        if (!this.options.progressbar) {
            return;
        }
        
        move = move ? (move / window.screen.width) * (100 / this.data.quantitySteps) : 0;
        
        this.nodes.progressbarSlide.style.transitionDuration = `${this.data.transition ? this.options.transitionDuration : 0}ms`;
        this.nodes.progressbarSlide.style.width = `${((100 / this.data.quantitySteps) * (this.data.currentStep + 1)) - move}%`;

    }

    _renderInfobarStep() {

        if (!this.options.infobar) {
            return;
        }
        
        this.nodes.stepCurrent.innerHTML = this.data.currentStep + 1;
        this.nodes.stepQuantity.innerHTML = this.data.quantitySteps;

    }

    _renderTrackSlides() {

        if (this.gallery[this.data.currentGroup] === void 0) {
            return;
        }

        const data = document.createDocumentFragment();

        this.nodes.track.innerHTML = '';

        if (this.options.single) {
            
            data.append(this._createSlide({
                position: this.data.currentStep,
                classNameSlide: this._attr.trackSlide,
                classNameImage: this._attr.trackImage,
            }));
            
        }
        
        if (!this.options.single) {
            
            for (let i = 0; i < this.gallery[this.data.currentGroup].length; i++) {
                
                data.append(this._createSlide({
                    position: i,
                    classNameSlide: this._attr.trackSlide,
                    classNameImage: this._attr.trackImage,
                }));
                
            }
            
        }

        this.nodes.track.append(data);
        this.nodes.trackSlides = document.getElementsByClassName(this._attr.trackSlide);

    }

    _renderThumbnailsSlides() {

        if (!this.options.thumbnails) {
            return;
        }

        if (this.gallery[this.data.currentGroup] === void 0) {
            return;
        }

        const data = document.createDocumentFragment();

        this.nodes.thumbnails.innerHTML = '';
        
        if (this.options.single) {
            
            data.append(this._createSlide({
                position: this.data.currentStep,
                classNameSlide: this._attr.thumbnailsItem,
                classNameImage: this._attr.thumbnailsImage,
            }));
            
        }
        
        if (!this.options.single) {
            
            for (let i = 0; i < this.gallery[this.data.currentGroup].length; i++) {
                
                data.append(this._createSlide({
                    position: i,
                    classNameSlide: this._attr.thumbnailsItem,
                    classNameImage: this._attr.thumbnailsImage,
                }));
                
            }
            
        }

        this.nodes.thumbnails.append(data);
        this.nodes.thumbnailsSlides = document.getElementsByClassName(this._attr.thumbnailsItem);

    }

    _renderButtonsActions() {

        if (this.nodes.buttonPrev !== void 0 && !this.options.loop) {
            this.nodes.buttonPrev.classList[this.data.currentStep !== 0 ? 'remove' : 'add'](this._attr.noactive);
        } else {
            this.nodes.buttonPrev.classList[this.data.quantitySteps !== 1 ? 'remove' : 'add'](this._attr.noactive);
        }

        if (this.nodes.buttonNext !== void 0 && !this.options.loop) {
            this.nodes.buttonNext.classList[this.data.currentStep !== this.data.quantitySteps - 1 ? 'remove' : 'add'](this._attr.noactive);
        } else {
            this.nodes.buttonNext.classList[this.data.quantitySteps !== 1 ? 'remove' : 'add'](this._attr.noactive);
        }

        if (this.nodes.buttonAutoplay !== void 0) {
            this.nodes.buttonAutoplay.classList[this.data.currentStep === this.data.quantitySteps - 1 && (!this.options.loop || this.data.quantitySteps === 1) ? 'add' : 'remove'](this._attr.noactive);
        }

    }

    _renderTrackSlideActive() {

        if (this.gallery[this.data.currentGroup] === void 0) {
            return;
        }
        
        for (let i = 0; i < this.nodes.trackSlides.length; i++) {
            this.nodes.trackSlides[i].classList.remove(this._attr.active);
        }
        
        this.nodes.trackSlides[this.data.currentStep].classList.add(this._attr.active);

        this.data.currentTrackSlide = this.nodes.trackSlides[this.data.currentStep];
        this.data.currentTrackImage = this.nodes.trackSlides[this.data.currentStep].getElementsByClassName(this._attr.trackImage)[0];

    }

    _renderThumbnailsSlideActive() {

        if (!this.options.thumbnails) {
            return;
        }

        if (this.gallery[this.data.currentGroup] === void 0) {
            return;
        }
        
        for (let i = 0; i < this.nodes.thumbnailsSlides.length; i++) {
            this.nodes.thumbnailsSlides[i].classList.remove(this._attr.active);
        }
        
        this.nodes.thumbnailsSlides[this.data.currentStep].classList.add(this._attr.active);

    }

    _renderThumbnailsInViewport() {
        
        if (!this.options.thumbnails) {
            return;
        }
        
        let startPosition = 0;
        
        for (let i = 0; i < this.nodes.thumbnailsSlides.length; i++) {
            
            if (!this.nodes.thumbnailsSlides[i].classList.contains(this._attr.active)) {
                this.nodes.thumbnailsSlides[i].classList.remove(this._attr.visible);
                continue;
            } 
            
            startPosition = i;
        
        }
        
        for (let i = 0; i <= this.data.thumbnailsStepQuantity; i++) {
            
            let node = this.nodes.thumbnailsSlides[startPosition + i];
            
            if (node) {
                this.nodes.thumbnailsSlides[startPosition + i].classList.add(this._attr.visible);
                continue;
            }
            
            break;
            
        }
        
    }
    


    // action slide

    _actionPrev() {

        this.data.direction = 'x';
        this.data.transition = true;

        if (!this.options.loop && this.data.currentStep === 0) {
            this._actionSlide();
            return;
        }

        this.data.currentStep = this.data.currentStep === 0 ? this.data.quantitySteps - 1 : this.data.currentStep - 1;

        this._actionSlide();

    }

    _actionNext() {

        this.data.direction = 'x';
        this.data.transition = true;

        if (!this.options.loop && this.data.currentStep === this.data.quantitySteps - 1) {
            this._actionSlide();
            return;
        }

        this.data.currentStep = this.data.currentStep === this.data.quantitySteps - 1 ? 0 : this.data.currentStep + 1;

        this._actionSlide();

    }

    _actionSlide() {
        
        if (this.options.single) {
            this.data.currentStep = 0;
            this.data.quantitySteps = 1;
        }
        
        this._renderDescbar();
        this._renderProgressStep();
        this._renderInfobarStep();
        this._renderButtonsActions();
        this._renderTrackSlideActive();
        this._renderThumbnailsSlideActive();
        this._renderThumbnailsInViewport();
        this._actionMatrixTrack();
        this._actionMatrixThumbnails();

    }

    _actionMatrixTrack() {

        if (this.data.direction === void 0) {
            return;
        }

        this.nodes.track.style.transitionDuration = `${this.data.transition === true ? this.options.transitionDuration : 0}ms`;

        let staticTransform = -(this.data.trackStepWidth * this.data.currentStep);

        if (this.data.direction === 'x') {

            if (this.data.draggable === void 0) {
                this.nodes.track.style.transform = `matrix(1, 0, 0, 1, ${staticTransform}, 0)`;
                return;
            }

            let ratioMove = this.coords.move.x - this.coords.down.x,
                dynamicTransform = staticTransform + ratioMove;
            
            if (this.options.loop) {
                
                if (this.options.single) {
                    
                    this.nodes.track.style.transform = `matrix(1, 0, 0, 1, ${dynamicTransform - ((ratioMove) / 1.5)}, 0)`;
                    
                } else {
                    
                    this.nodes.track.style.transform = `matrix(1, 0, 0, 1, ${dynamicTransform}, 0)`;
                    
                }
                
            } else {
                
                if (Math.abs(dynamicTransform) >= this.data.trackStepEnd || dynamicTransform >= this.data.trackStepStart || this.options.single) {
                    
                    this.nodes.track.style.transform = `matrix(1, 0, 0, 1, ${dynamicTransform - ((ratioMove) / 1.5)}, 0)`;
                    
                } else {
                    
                    this.nodes.track.style.transform = `matrix(1, 0, 0, 1, ${dynamicTransform}, 0)`;
                    
                }
                
            }
            
            this._renderProgressStep(ratioMove);
            this.nodes.center.classList.add(this._attr.grabbing);

            if (this.data.dragready) {
                
                let difference = dynamicTransform - staticTransform;
                
                this.data.dragready = false;
                this.data.draggable = void 0;
                this.nodes.center.classList.remove(this._attr.grabbing);

                if (difference > this.data.momentumPX) {
                    this._actionScaleOff();
                    this._actionAutoplayOff();
                    this._actionPrev();
                    return;
                }

                if (Math.abs(difference) > this.data.momentumPX) {
                    this._actionScaleOff();
                    this._actionAutoplayOff();
                    this._actionNext();
                    return;
                }

                this.nodes.track.style.transitionDuration = `${this.options.transitionDuration}ms`;
                this.nodes.track.style.transform = `matrix(1, 0, 0, 1, ${staticTransform}, 0)`;

            }

        }

        if (this.data.direction === 'y') {

            let difference = this.coords.move.y - this.coords.down.y;

            this.nodes.center.classList.add(this._attr.grabbing);
            this.nodes.track.style.transform = `matrix(1, 0, 0, 1, ${staticTransform}, ${difference})`;

            if (this.data.dragready) {

                this.data.dragready = false;
                this.data.draggable = void 0;
                this.nodes.center.classList.remove(this._attr.grabbing);

                if (Math.abs(difference) > this.data.momentumPX) {

                    difference = difference < 0 ? -this.data.trackStepHeight : this.data.trackStepHeight;

                    this.nodes.track.style.transitionDuration = `${this.options.transitionDuration / 2}ms`;
                    this.nodes.track.style.transform = `matrix(1, 0, 0, 1, ${staticTransform}, ${difference})`;

                    setTimeout(this.hide, this.options.transitionDuration / 4);

                    return;

                }

                this.nodes.track.style.transitionDuration = `${this.options.transitionDuration}ms`;
                this.nodes.track.style.transform = `matrix(1, 0, 0, 1, ${staticTransform}, 0)`;

            }

        }

    }

    _actionMatrixThumbnails() {
        
        if (!this.options.thumbnails) {
            return;
        }
        
        if (this.options.single) {
            return;
        }
        
        if (this.data.quantitySteps <= this.data.thumbnailsStepQuantity) {
            this.nodes.thumbnails.style.transitionDuration = `0ms`;
            this.nodes.thumbnails.style.transform = `matrix(1, 0, 0, 1, ${this.data.thumbnailsStepStart}, 0)`;
            return;
        }
        
        this.nodes.thumbnails.style.transitionDuration = `${this.data.transition === true ? this.options.transitionDuration : 0}ms`;

        let staticTransform = -(this.data.thumbnailsStepWidth * this.data.currentStep);
        
        if (this.nodes.thumbnailsSlides[this.nodes.thumbnailsSlides.length - 1].classList.contains(this._attr.visible) || Math.abs(staticTransform) >= Math.abs(this.data.thumbnailsStepEnd)) {
            staticTransform = this.data.thumbnailsStepEnd;
        }
                
        this.nodes.thumbnails.style.transform = `matrix(1, 0, 0, 1, ${staticTransform}, 0)`;
        
    }
    
    

    // action scale

    _actionScaleSwitch() {

        if (!this.options.scale) {
            return;
        }

        this.data.currentTrackImage.classList.contains(this._attr.active) ? this._actionScaleOff() : this._actionScaleOn();

    }

    _actionScaleOn() {

        if (!this.options.scale) {
            return;
        }

        this.data.currentTrackImage.classList.add(this._attr.active);

    }

    _actionScaleOff() {

        if (!this.options.scale) {
            return;
        }

        this.data.currentTrackImage.classList.remove(this._attr.active);

    }



    // action autoplay

    _actionAutoplaySwitch() {

        if (!this.options.autoplay) {
            return;
        }

        this.nodes.buttonAutoplay.classList.contains(this._attr.active) ? this._actionAutoplayOff() : this._actionAutoplayOn();

    }

    _actionAutoplayOn() {

        if (!this.options.autoplay) {
            return;
        }

        if (this.data.autoplay !== void 0) {
            clearTimeout(this.data.autoplay);
            this.data.autoplay = void 0;
        }

        this.nodes.buttonAutoplay.classList.add(this._attr.active);
        this.nodes.autoplaybarSlide.classList.add(this._attr.active);

        this._actionAutoplayRecursive();

    }

    _actionAutoplayOff() {

        if (!this.options.autoplay) {
            return;
        }

        clearTimeout(this.data.autoplay);
        this.data.autoplay = void 0;

        this.nodes.buttonAutoplay.classList.remove(this._attr.active);
        this.nodes.autoplaybarSlide.classList.remove(this._attr.active);

    }

    _actionAutoplayRecursive() {

        if (this.data.currentStep === this.data.quantitySteps - 1 && !this.options.loop) {
            this._actionAutoplayOff();
            return;
        }

        this.data.autoplay = setTimeout(() => {
            this._actionNext();
            this._actionAutoplayRecursive();
        }, this.options.autoplayDuration);

    }



    // thumbnails

    _actionThumbnailsSwitch() {

        if (!this.options.thumbnails) {
            return;
        }

        this.nodes.thumbnails.classList.contains(this._attr.active) ? this._actionThumbnailsOff() : this._actionThumbnailsOn();

    }

    _actionThumbnailsOn() {

        if (!this.options.thumbnails) {
            return;
        }

        this.nodes.thumbnails.classList.add(this._attr.active);

    }

    _actionThumbnailsOff() {

        if (!this.options.thumbnails) {
            return;
        }

        this.nodes.thumbnails.classList.remove(this._attr.active);

    }


}