/* Default Options
 *
 *
 * duration: 1500,
 * modifier: 'webcore',
 * preventAnimation: false,
 * timing: 'easeOutQuart',
 *
 *
 */

const toScroll = new WC_ToScroll();

toScroll.init({
    duration: 2000,
    modifier: 'animation',
    preventAnimation: false,
});

toScroll.createUp({
    title: 'Наверх',
    icon: 'arrow.svg',
});

toScroll.createDown({
    title: 'Вниз',
    icon: 'arrow.svg',
});

toScroll.createKey({
    keys: true,
    mouse: true,
});

toScroll.createTo(50);

/* Returns Methods
 *
 *
 * .init({Options});
 * .createUp({Options});
 * .createTo(offset);
 * .createKey({Options});
 * .createDown({Options});
 * .scrollUp();
 * .scrollTop();
 * .scrollTo(id, offset);
 * .scrollDown();
 * .destroy();
 *
 *
 */