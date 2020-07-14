/* Default Options
 *
 *
 * min: 1,
 * max: 100,
 * step: 1,
 * value: 1,
 * afterUp: void 0,
 * afterDown: void 0,
 * afterBlur: void 0,
 * modifier: 'webcore',
 *
 *
*/   

const counters = new WC_Counter();

counters.init({
    min: 1,
    max: 50,
    step: 2,
    value: 15,
});

counters.min('test', (input) => {
    console.log(input);
});

counters.max(1);

counters.any(2, 26);

/* Returns Methods
 *
 *
 * .init({Options});
 * .up(id);
 * .any(id, value, callback);
 * .min(id, callback);
 * .max(id, callback);
 * .down(id);
 * .destroy();
 *
 *
 */