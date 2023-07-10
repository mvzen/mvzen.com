
/**
 * devtools.config.js
 * Config & environment settings
 * Author: Regards
 */

(function($) {
    'use strict';

    define(['json!../../config.json'], function(_config) {

        var config = {

            init: function() {
                config.env(_config.env);
            },

            get: function(setting) {
                return _config[setting];
            },

            env: function(env) {
                if(typeof env === 'undefined') {
                    return _config.env;
                } else {
                    if(env === 'dev') {
                        config.debug(true);

                        $('<span />').css({
                            'position': 'absolute',
                            'background': 'yellow',
                            'pointer-events': 'none',
                            'font-family': 'sans-serif',
                            'font-size': 11,
                            'color': 'black',
                            'padding': 5,
                            'top': 5,
                            'left': 5,
                            'z-index': 9999999
                        }).html('DEV').appendTo('body');
                    } else {
                        config.debug(false);
                    }
                }
            },

            debug: function(state) {
                if(!state || !window.console) {
                    window.console = {};
                    var methods = ['log', 'debug', 'warn', 'info'];
                    for(var i = 0; i < methods.length; i++) {
                        console[methods[i]] = function() {};
                    }
                }
            },

            trigger: function(action, params) {
                $(document).trigger(action, params);
            },

            bind: function(action, fn) {
                $(document).bind(action, fn);
            }
            
        };

        return config;

    });

})(window.jQuery);
