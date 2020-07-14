/* Default Options
 *
 *
 * zoom: 16,  
 * id: 'map',
 * labels: [],
        icon: 'assets/images/icons/yandex-ball.svg',
        size: [70, 70],
        offset: [-(70 / 2), -70],
        position: [55.751437393466894, 37.61888746396247],
 * drag: true,
 * invert: false,
 * grayscale: false,
 * fullscreen: false,
 * zoomScroll: false,
 * zoomButtons: true,
 * script: 'assets/js/YandexMap.json',
 * center: [55.751437393466894, 37.61888746396247],
 *
 *
 */

const yandexMap1 = new WC_YandexMap();
const yandexMap2 = new WC_YandexMap();
const yandexMap3 = new WC_YandexMap();
const yandexMap4 = new WC_YandexMap();

yandexMap1.init({
    zoom: 5,
    id: 'map--item-0',
    invert: true,
    grayscale: false,
    zoomScroll: false,
    zoomButtons: true,
    script: 'YandexMap.json',
    center: [44.799282652076116,20.47574222973488],
    labels: [{
        icon: 'yandex-ball.svg',
        position: [44.799282652076116,20.47574222973488],
    }],
});

yandexMap2.init({
    zoom: 5,
    id: 'map--item-1',
    invert: false,
    grayscale: true,
    zoomScroll: true,
    zoomButtons: true,
    script: 'YandexMap.json',
    center: [41.90212086984049,12.453456921904554],
    labels: [{
        size: [40, 40],
        icon: 'yandex-ball.svg',
        position: [41.90212086984049,12.453456921904554],
    }],
});

yandexMap3.init({
    zoom: 12,
    id: 'map--item-2',
    invert: true,
    grayscale: true,
    zoomScroll: true,
    zoomButtons: true,
    script: 'YandexMap.json',
    center: [-35.308189719333186,149.15356295779054],
    labels: [{
        icon: 'yandex-ball.svg',
        position: [-35.307596884433366,149.19048655116282],
    },{
        icon: 'yandex-ball.svg',
        position: [-35.30859676334993,149.12505539582705],
    },{
        icon: 'yandex-ball.svg',
        position: [-35.302190590554325,149.12968026537072],
    }],
});

yandexMap4.init({
    zoom: 13,
    id: 'map--item-3',
    invert: false,
    grayscale: false,
    zoomScroll: true,
    zoomButtons: false,
    fullscreen: true,
    script: 'YandexMap.json',
    center: [35.686451423369206,139.72489275675315],
    labels: [{
        icon: 'yandex-ball.svg',
        position: [35.68616811439213,139.72932580612698],
    },{
        icon: 'yandex-ball.svg',
        position: [35.68809258167941,139.720011136346],
    }],
});

/* Returns Methods
 *
 *
 * .init({Options});
 * .destroy();
 * .createLabels([]);
 *
 *
 */