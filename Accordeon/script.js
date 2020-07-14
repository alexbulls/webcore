/* Default Options
 *
 *
 * start: 0,
 * visible: void 0
 *      display: void 0,
 *      buttonCreate: true,
 *      buttonClassNames: [],
 *      buttonInnerHTML: 'Show more',
 * single: true,
 * duration: 400,
 * autoplay: void 0, 
 * after: void 0,
 * before: void 0,
 * modifier: 'webcore',
 * bezier: 'cubic-bezier(.09,.78,.42,.98)',
 *
 *
*/

const accordeon = new WC_Accordeon();

accordeon.init({
    visible: {
        display: 3,
    },
});

accordeon.autoplay(1000);

/* Returns Methods
 *
 *
 * .init({Options});
 * .show(1);
 * .hide(1);
 * .showAll();
 * .hideAll();
 * .destroy();
 * .autoplay(delay);
 *
 *
 */