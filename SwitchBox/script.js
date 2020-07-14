/* Default Options
 *
 *
 * id: void 0,
 * fetch: void 0,
 *      path: void 0,
 *      once: true,
 *      data: void 0,
 *      success: void 0,
 *      error: void 0,
 *      method: 'POST',
 *      insert: false,
 * duration: 400,
 * before: void 0,
 * after: void 0,
 * zIndex: 1000,
 * raiseIndex: true,
 * animation: 'scale-in',
 * switchWithALT: void 0,
 * createPopupCSS: true,
 * hideKeyEsc: true,
 * switchScroll: true,
 * modifier: 'webcore',
 * hideClickOutContainer: true,
 * catchEventShow: [],
 * catchEventHide: [],
 *
 *
 */

const hiddenBoxNode = document.getElementById('switch-hidden');
const hiddenHeight = getComputedStyle(hiddenBoxNode).height;
hiddenBoxNode.style.height = '0px';

const hiddenBox = new WC_SwitchBox();
const popupBox = new WC_SwitchBox();
const popupBox1 = new WC_SwitchBox();
const popupBox2 = new WC_SwitchBox();

hiddenBox.init({
    zIndex: void 0,
    duration: 200,
    id: 'switch-hidden',
    modifier: 'hidden',
    raiseIndex: false,
    switchScroll: false,
    createPopupCSS: false,
    switchWithALT: '1',
    before: (cover) => {
        cover.style.height = hiddenHeight;
    },
    after: (cover) => {
        cover.style.height = '0px';
    },
    hideClickOutContainer: false,
    catchEventShow: ['.button--switch-hidden'],
    catchEventHide: ['.button--switch-hidden'],
});

popupBox.init({
    id: 'switch-popup',
    modifier: 'popup',
    switchWithALT: 'q',
    catchEventShow: ['.button--switch-popup'],
    catchEventHide: ['.button--switch-popup'],
});

popupBox1.init({
    id: 'switch-popup1',
    modifier: 'popup',
    switchWithALT: '3',
    catchEventShow: ['.button--switch-popup1'],
    catchEventHide: ['.button--switch-popup1'],
});

popupBox2.init({
    id: 'switch-popup2',
    modifier: 'popup',
    switchWithALT: '4',
});

/* Returns Methods
 *
 *
 * .init({Options});
 * .show();
 * .hide();
 * .switch();
 * .destroy();
 *
 *
 */