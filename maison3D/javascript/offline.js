
/**
 * offline.js
 * Display screen while downloading offline
 * Author: Regards
 */

(function($) {
    'use strict';

    var appCache = window.applicationCache;
    var sync = localStorage.getItem('sync');
    var $element;

    var update = {

        init: function() {
            $('<div />').attr('id', 'offline-update').appendTo($('body'));
            $element = $('#offline-update');
        },

        checking: function() {
            if(sync === 0) {
                $element.show().addClass('error');
            }
        },

        available: function() {
            localStorage.setItem('sync', 0);
            $element.show().addClass('syncing');
        },

        progress: function(e) {
            var completed = Math.round((e.originalEvent.loaded / e.originalEvent.total) * 100) + '%';
            $element.attr('title', completed);
        },

        finished: function(e) {
            localStorage.setItem('sync', 1);
            $element.attr('title', 'Completed').removeClass('syncing').addClass('done').one('click', update.reload);
        },

        reload: function() {
            window.location.reload();
        }
    };

    update.init();

    $(appCache).on('checking', update.checking);
    $(appCache).on('downloading', update.available);
    $(appCache).on('progress', update.progress);
    $(appCache).on('cached updateready', update.finished);

})(window.jQuery);
