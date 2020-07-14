/* Default Options
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
*/   

const gallery = new WC_Gallery();

gallery.init({
    
    arrows: true,
    infobar: true,
    keyboard: true,
    hideKeyEsc: true,
    progressbar: true,
    switchScroll: true,
    swipingMomentum: false,
    hideClickOutImage: true,
    
    loop: false,
    single: false,
    
    scale: true,
    autoplay: true,
    thumbnails: true,
    thumbnailsBox: false,
    
    autoplayDuration: 3000,
    appearanceDuration: 1000,
    transitionDuration: 500,
    
});

//gallery.show(2, 'webcore');

/* Returns Methods
 *
 *
 * .init({Options});
 * .up();
 * .up();
 * .up();
 * .up();
 * .up();
 * .up();
 * .up();
 * .up();
 *
 *
 */