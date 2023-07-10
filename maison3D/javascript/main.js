
/**
 * main.js
 * All the magic starts here
 * Author: Regards
 */

/**
* Configure paths to libraries
*/
require.config({
    paths: {
          'mousewheel': 'libs/jquery/jquery.mousewheel.min',
             'preload': 'libs/jquery/jquery.preload-1.0.8-min',
           'swfobject': 'libs/jquery/jquery.swfobject.1-1-1',
              'krpano': 'libs/krpano/pano',
     'devtools/config': 'libs/regards/devtools/devtools.config',
       'regards/ipano': 'libs/regards/ipano'
    }
});

/**
* Only require the libs needed right here
*/
require([
    'devtools/config',
    'pano'
], function(config) {

    $(document).ready(function() {
        config.init();
        config.trigger('app.ready');
    });

});
