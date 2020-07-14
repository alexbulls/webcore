/* Default Options
 *
 *
 * zIndex: 2,    
 * after: void 0,
 * before: void 0,
 * modifier: 'webcore',
 * raiseIndex: true,
 * hideKeyEsc: true,
 * closingInTurn: false,
 * hideClickOutContainer: true,
 *
 *
 */

const test = new WC_Select();
const test1 = new WC_Select();

console.log(test);

test.init({
    modifier: 'test',
});

test1.init({
    modifier: 'test1',
    closingInTurn: true,
});

/* Returns Methods
 *
 *
 * .init({Options});
 * .show(id);
 * .hide(id);
 * .switch(id);
 * .destroy();
 * .hideAll();
 * .hideLast();
 * .hideFirst();
 *
 *
 */