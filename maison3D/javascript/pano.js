
/**
 * ipano.js
 * Author: Regards
 */

(function($) {
    'use strict';

    define([
        'devtools/config',
        'regards/ipano'
    ], function(config, ipano) {

        /* External access to iPano (for krpano) */
        window.regards = {
            ipano: ipano
        };

        /* Init iPano when app is ready */
        config.bind('app.ready', function() {
            ipano.init({
                useHTML5: 'auto'
            });
        });

        config.bind('regards.ipano.scene.ready', function() {
            $('#spot-label').html(ipano.scene.current().label);
            $('#plan .spot[data-pano=' + ipano.scene.current().id + ']').addClass('active').siblings('.spot').removeClass('active');
            radar();
            var top = parseInt($('#plan .spot.active').css('top')) - 10;
            var left = parseInt($('#plan .spot.active').css('left')) -10;
            $('.radar').css({'top': top, 'left': left}).fadeIn();
        });

        $('#plan .spot').on('click', function() {
            ipano.panorama.load($(this).data('pano'));
        });

        var radar = function() {
            var offset = $('#plan .spot.active').data('angle');
            var angle = Math.round((krpano.get('view.hlookat') + offset) % 360);
            $('.radar').css({'-moz-transform': 'rotate(' + angle + 'deg)'})
                       .css({'-webkit-transform': 'rotate(' + angle + 'deg)'});
        };
        window.radar = radar;

    });

})(window.jQuery);
