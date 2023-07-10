
/**
 * iPano.js
 * Framework for 360° panoramic photography using krpano
 * Author: Regards
 *
 * Triggered events:
 * regards.ipano.ready              launched when spheric engine has completed loading
 * regards.ipano.scene.ready        launched when a scene has completed loading (params: sceneName, sceneType)
 * regards.ipano.hotspot.clicked    launched when a hotspot has been clicked (params: hotspotId, clicked param)
 * regards.ipano.hotspot.over       launched when mouse is overing a hotspot (params: hotspotId, over param)
 * regards.ipano.hotspot.out        launched when mouse is living a hotspot (params: hotspotId, out param)
 */

(function($) {
    'use strict';

    define([
        '../../json/ipano.data',
        'krpano'
    ], function(data) {

        var _krpano,
            _settings,
            _$container,
            _currentScene;

        var ipano = {

            /**
            * Init settings
            */
            init: function(params) {

                /****************************************
                 * SETTINGS INITIALIZATION
                 */

                // startscene
                var startscene = data.start_scene;

                // blendtime
                var blendtime = data.blend_time;
                if (typeof blendtime === 'undefined') {
                   blendtime = 2;
                }

                _settings = $.extend({
                    target:     'pano',
                    startscene: startscene,
                    wmode:      'opaque',
                    useHTML5:   'auto',
                    width:      '100%',
                    height:     '100%',
                    blendtime:  blendtime,
                    $navigation: $('#pano-navigation')
                }, params);


                /****************************************
                 * VIEWER INITIALIZATION
                 */

                var viewer = createPanoViewer({swf: 'javascript/libs/krpano/pano.swf', target: _settings.target, width: _settings.width, height: _settings.height});
                viewer.addVariable('xml', data.xml);
                viewer.addParam('wmode', _settings.wmode);
                viewer.addVariable('startscene', _settings.startscene);
                viewer.useHTML5(_settings.useHTML5);
                viewer.embed();
                _krpano = document.getElementById('krpanoSWFObject');
                window.krpano = _krpano;

                _$container = $('#' + _settings.target);

                /****************************************
                 * NAVIGATION INIT
                 */
                ipano.navigation.init();

            },

            destroy: function() {
                if(typeof _currentScene !== 'undefined') {
                    _$container.empty();
                    _currentScene = undefined;
                }
            },

            /**
            * iPano is ready
            */
            ready: function() {
                if(typeof _currentScene === 'undefined') {
                    _currentScene = {};
                    // Load first scene
                    ipano.panorama.load(_settings.startscene);
                }
                // trigger ipano.ready
                trigger('regards.ipano.ready');
            },

            data: function(obj) {
                if(typeof obj === 'undefined') {
                    return data;
                } else {
                    data = obj;
                    return true;
                }
            },

            /**
             * Show/hide editor
             */
            editor: function(visible) {
                if (typeof visible === 'undefined') {
                    visible = 'true';
                }
                set('plugin[editor].visible', visible);
            },

            navigation: {
                init: function() {
                    /****************************************
                     * NAVIGATION BUTTONS BINDING
                     */
                    // Autorotation
                    _settings.$navigation.on('click touchstart', '.autorotate', ipano.navigation.autorotate);
                    // Zoom
                    _settings.$navigation.on('mousedown touchstart', '.zoomin', ipano.navigation.zoom['in']).on('mouseup touchend', '.zoomin', ipano.navigation.zoom.end);
                    _settings.$navigation.on('mousedown touchstart', '.zoomout', ipano.navigation.zoom.out).on('mouseup touchend', '.zoomout', ipano.navigation.zoom.end);
                    // Vertical
                    _settings.$navigation.on('mousedown touchstart', '.up', ipano.navigation.move.vertical.up).on('mouseup touchend', '.up', ipano.navigation.move.vertical.end);
                    _settings.$navigation.on('mousedown touchstart', '.down', ipano.navigation.move.vertical.down).on('mouseup touchend', '.down', ipano.navigation.move.vertical.end);
                    // Horizontal
                    _settings.$navigation.on('mousedown touchstart', '.left', ipano.navigation.move.horizontal.left).on('mouseup touchend', '.left', ipano.navigation.move.horizontal.end);
                    _settings.$navigation.on('mousedown touchstart', '.right', ipano.navigation.move.horizontal.right).on('mouseup touchend', '.right', ipano.navigation.move.horizontal.end);
                },

                /**
                * Toggle autorotation
                */
                autorotate: function(on) {
                    if(typeof on !== 'boolean') {
                        on = !get('autorotate.enabled');
                    }

                    if(on) {
                        _settings.$navigation.find('.autorotate').addClass('active');
                    } else {
                        _settings.$navigation.find('.autorotate').removeClass('active');
                    }

                    set('autorotate.enabled', on);
                },

                /**
                 * Zoom
                 */
                zoom: {
                    'in': function() {
                        set('fov_moveforce', -0.5);
                    },

                    out: function() {
                        set('fov_moveforce', +0.5);
                    },

                    end: function() {
                        set('fov_moveforce', 0);
                    }
                },

                /**
                 * Move
                 */
                move: {
                    vertical: {
                        up: function() {
                            set('vlookat_moveforce', -0.5);
                        },
                        down: function() {
                            set('vlookat_moveforce', +0.5);
                        },
                        end: function() {
                            set('vlookat_moveforce', 0);
                        }
                    },
                    horizontal: {
                        left: function() {
                            set('hlookat_moveforce', -0.5);
                        },
                        right: function() {
                            set('hlookat_moveforce', +0.5);
                        },
                        end: function() {
                            set('hlookat_moveforce', 0);
                        }
                    }
                },

                 /**
                 * View
                 */
                view: {
                    set: function(hlookat, vlookat) {
                        set('view.hlookat', hlookat);
                        set('view.vlookat', vlookat);
                    },

                    /**
                    * Pan camera from current view to new view
                    */
                    pan: function(hlookat, vlookat) {
                        call('lookto(' + hlookat + ', ' + vlookat + ')');
                    }
                }
            },

            debugFromEngine: function(message) {
                console.log('********************\nENGINE LOG: ' + message);
            },

            panorama: {

                /**
                 * Load a panorama (ie new scene) from json data or json scene's name.
                 *
                 * @param scene Scene name or json data
                 */
                load: function(scene) {
                    if (typeof scene === 'string') {
                        // retrieve actual scene data
                        scene = data.scenes[scene];
                    }
                    _currentScene.name = scene.id;
                    // load panorama as start scene
                    ipano.scene.load(scene, 'start');
                }

            },

            scene: {
                /**
                * Scene is ready
                */
                ready: function(sceneType) {
                    _currentScene.type = sceneType;
                    trigger('regards.ipano.scene.ready', [_currentScene.name, _currentScene.type]);
                    // load hotspots if necessary
                    switch (sceneType) {
                        case 'main':
                            ipano.scene.hotspots.load();
                            ipano.timeline.init();
                            break;
                        case 'alternative':
                            var keep = ipano.scene.current().alternative.keepHotspots;
                            if(typeof keep === 'undefined') {
                                keep = false;
                            }
                            if (keep) {
                                ipano.scene.hotspots.load();
                            }
                            break;

                    }
                },

                /**
                 * Load a scene from json data or json scene's name.
                 * Different kind of scene loading are allowed:
                 * - 'start': used to launch current scene panorama. Panorama image are
                 * provided as cube sides via scene url. Takes scene default view
                 * parameters into account.
                 * - 'main': used to view default scene settings. Same as 'start'
                 * option, but keep current view parameters.
                 * - 'alternative': used to view an alternative version of the scene
                 * (blur, mask...). Panorama image is provided as cubestrip via scene
                 * alternative url. Keep current view paramaters.
                 *
                 * @param scene Scene name or json data
                 * @param type  Scene type between 'start', 'main', 'altrnative'
                 */
                // TODO: allow different kind of image settings (at least for alternative type)
                load: function(scene, type) {
                    if (typeof scene === 'string') {
                        scene = data.scenes[scene];
                    }
                    _currentScene.name = scene.id;

                    // load scene
                    var sceneType,
                        preview     = 'preview.url=' + scene.url + '/preview.jpg',
                        image,
                        view,
                        params,
                        merge       = 'MERGE',
                        blend       = 'BLEND(' + _settings.blendtime + ')';
                    switch (type) {
                        default:
                        case 'start':
                            // scene type
                            sceneType = 'main';
                            //image
                            image = 'image.cube.url=' + scene.url + '/pano_%s.jpg';
                            // view
                            var hlookat,
                                vlookat,
                                hlookatmin,
                                hlookatmax,
                                vlookatmin,
                                vlookatmax,
                                fov;
                            if (typeof scene.lookat !== 'undefined') {
                                if(typeof scene.lookat.horizontal !== 'undefined') {
                                    hlookat = scene.lookat.horizontal.start;
                                    if (typeof hlookat === 'undefined') {hlookat = 0;}
                                    hlookatmin = scene.lookat.horizontal.min;
                                    if (typeof hlookatmin === 'undefined') {hlookatmin = -180;}
                                    hlookatmax = scene.lookat.horizontal.max;
                                    if (typeof hlookatmax === 'undefined') {hlookatmax = 180;}
                                } else {
                                    hlookat = 0;
                                    hlookatmin = -180;
                                    hlookatmax = 180;
                                }
                                if(typeof scene.lookat.vertical !== 'undefined') {
                                    vlookat = scene.lookat.vertical.start;
                                    if (typeof vlookat === 'undefined') {vlookat = 0;}
                                    vlookatmin = scene.lookat.vertical.min;
                                    if (typeof vlookatmin === 'undefined') {vlookatmin = -90;}
                                    vlookatmax = scene.lookat.vertical.max;
                                    if (typeof vlookatmax === 'undefined') {vlookatmax = 90;}
                                } else {
                                    vlookat = 0;
                                    vlookatmin = -90;
                                    vlookatmax = 90;
                                }
                            } else {
                                hlookat = vlookat = 0;
                                hlookatmin = -180;
                                hlookatmax = 180;
                                vlookatmin = -90;
                                vlookatmax = 90;
                            }
                            fov = scene.fov;
                            if (typeof fov === 'undefined') {
                                fov = data.fov;
                                if (typeof fov === 'undefined') {fov = 90;}
                            }
                            view = 'view.hlookat=' + hlookat + '&' +
                                   'view.hlookatmin=' + hlookatmin + '&' +
                                   'view.hlookatmax=' + hlookatmax + '&' +
                                   'view.vlookat=' + vlookat + '&' +
                                   'view.vlookatmin=' + vlookatmin + '&' +
                                   'view.vlookatmax=' + vlookatmax + '&' +
                                   'view.limitview=range' + '&' +
                                   'view.fov=' + fov;
                            // params
                            params = preview + '&' +
                                     image +'&' +
                                     view;
                            break;
                        case 'main':
                            // scene type
                            sceneType = 'main';
                            //image
                            image = 'image.cube.url=' + scene.url + '/pano_%s.jpg';
                            // params
                            params = preview + '&' +
                                     image;
                            break;
                        case 'alternative':
                            // scene type
                            sceneType = 'alternative';
                            //image
                            image = 'image.cubestrip.url=' + ipano.scene.current().alternative.url;
                            // params
                            params = preview + '&' +
                                     image;
                            break;
                    }
                    call('loadscene(' +
                        sceneType + ',' +
                        params + ',' +
                        merge + ',' +
                        blend +');');
                },

                alternative: {
                    /**
                     * Toggle between 'alternative' and 'main' views
                     */
                    // TODO: manage different alternative scenes
                    toggle: function() {
                        var type = 'alternative';
                        if (_currentScene.type === 'alternative') {
                            type = 'main';
                        }
                        ipano.scene.load(ipano.scene.current(), type);
                    }
                },

                hotspots: {
                    index: undefined,
                    load: function() {
                        if(typeof ipano.scene.hotspots.index === 'undefined') {
                            ipano.scene.hotspots.index = 0;
                        }
                        var hotspots = ipano.scene.current().hotspots,
                            index = ipano.scene.hotspots.index;
                        if(index < hotspots.length) {
                            ipano.hotspot.add(hotspots[index]);
                            ipano.scene.hotspots.index ++;
                            setTimeout(ipano.scene.hotspots.load, 0);
                        } else {
                            ipano.scene.hotspots.index = undefined;
                        }
                    }
                },

                current: function() {
                    return data.scenes[_currentScene.name];
                }

            },

            hotspot: {

                add: function(hotspot) {
                    var crop,
                        ath,
                        atv,
                        edge,
                        zindex,
                        onclick,
                        onover,
                        onout;


                    try {
                        call('addhotspot(' + hotspot.id + ')');
                    } catch(error) {
                        setTimeout(function() {
                            ipano.hotspot.add(hotspot);
                        }, 500);
                        return;
                    }

                    // MAIN CHARACTERISTICS
                    // url
                    ipano.hotspot.url(hotspot.id, hotspot.url);
                    // position
                    ath = hotspot.ath;
                    if(typeof ath === 'undefined') {ath = 0;}
                    set('hotspot[' + hotspot.id + '].ath', ath);
                    atv = hotspot.atv;
                    if(typeof atv === 'undefined') {atv = 0;}
                    set('hotspot[' + hotspot.id + '].atv', atv);
                    edge = hotspot.edge;
                    if(typeof edge === 'undefined') {edge = 'center';}
                    set('hotspot[' + hotspot.id + '].edge', edge);
                    // crop
                    // TODO JS: take full crop array into account, including index
                    crop = hotspot.crop;
                    if(typeof crop !== 'undefined') {
                        crop = crop[0];
                        ipano.hotspot.crop(hotspot.id, crop.x, crop.y, crop.width, crop.height, edge);
                    }
                    // zindex
                    zindex = hotspot.zindex;
                    if(typeof zindex=== 'undefined') {zindex = 100;}
                    set('hotspot[' + hotspot.id + '].zorder', zindex);
                    // cursor
                    if(typeof hotspot.cursorPointer !== 'undefined') {
                        set('hotspot[' + hotspot.id + '].handcursor', hotspot.cursorPointer);
                    }

                    // ACTIONS
                    // click
                    onclick = 'js(regards.ipano.hotspot.clicked(' + hotspot.id;
                    if(typeof hotspot.click !== 'undefined') {
                        onclick += ', ' + hotspot.click.action + ', ' + hotspot.click.param + '));';
                        switch (hotspot.click.action) {
                            case 'changePano':
                                onclick += 'js(regards.ipano.panorama.load(' + hotspot.click.param + '));';
                                break;
                            case 'alternative':
                                onclick += 'js(regards.ipano.scene.alternative.toggle());';
                                break;
                        }
                        if(typeof hotspot.click.crop !== 'undefined') {
                            crop = hotspot.click.crop[0];
                            onclick += 'js(regards.ipano.hotspot.crop(' + hotspot.id + ', ' + crop.x + ', ' + crop.y + ', ' + crop.width + ', ' + crop.height + ', ' + edge + '));';
                        }
                    }
                    else {
                        onclick += '));';
                    }
                    set('hotspot[' + hotspot.id + '].onclick', onclick);
                    // over
                    onover = 'js(regards.ipano.hotspot.over(' + hotspot.id;
                    if(typeof hotspot.over !== 'undefined') {
                        onover += ', ' + hotspot.over.action + ', ' + hotspot.over.param + '));';
                        switch (hotspot.over.action) {
                            case 'changeURL':
                                onover += 'js(regards.ipano.hotspot.url(' + hotspot.id + ', ' + hotspot.over.url + '));';
                                break;
                        }
                        if(typeof hotspot.over.crop !== 'undefined') {
                            crop = hotspot.over.crop[0];
                            onover += 'js(regards.ipano.hotspot.crop(' + hotspot.id + ', ' + crop.x + ', ' + crop.y + ', ' + crop.width + ', ' + crop.height + ', ' + edge + '));';
                        }
                    }
                    else {
                        onover += '));';
                    }
                    set('hotspot[' + hotspot.id + '].onover', onover);
                    // out
                    onout = 'js(regards.ipano.hotspot.out(' + hotspot.id;
                    if(typeof hotspot.out !== 'undefined') {
                        onout += ', ' + hotspot.out.action + ', ' + hotspot.out.param + '));';
                        switch (hotspot.out.action) {
                            case 'changeURL':
                                onout += 'js(regards.ipano.hotspot.url(' + hotspot.id + ', ' + hotspot.out.url + '));';
                                break;
                        }
                        if(typeof hotspot.out.crop !== 'undefined') {
                            crop = hotspot.out.crop[0];
                            onout += 'js(regards.ipano.hotspot.crop(' + hotspot.id + ', ' + crop.x + ', ' + crop.y + ', ' + crop.width + ', ' + crop.height + ', ' + edge + '));';
                        } else {
                            if(typeof hotspot.over.crop !== 'undefined' && typeof hotspot.crop !== 'undefined') {
                                crop = hotspot.crop[0];
                                onout += 'js(regards.ipano.hotspot.crop(' + hotspot.id + ', ' + crop.x + ', ' + crop.y + ', ' + crop.width + ', ' + crop.height + ', ' + edge + '));';
                            }
                        }
                    }
                    else {
                        onout += '));';
                        if(typeof hotspot.crop !== 'undefined' && typeof hotspot.over !== 'undefined' && typeof hotspot.over.crop !== 'undefined') {
                            crop = hotspot.crop[0];
                            onout += 'js(regards.ipano.hotspot.crop(' + hotspot.id + ', ' + crop.x + ', ' + crop.y + ', ' + crop.width + ', ' + crop.height + ', ' + edge + '));';
                        }
                    }
                    set('hotspot[' + hotspot.id + '].onout', onout);
                },

                remove: function(hotspot) {
                    call('removehotspot(' + hotspot.id + ')');
                },

                url: function(label, url) {
                    set('hotspot[' + label + '].url', url);
                },

                //TODO JS: add crop change depending on window size
                crop: function(id, x, y, width, height, edge) {
                    set('hotspot[' + id + '].crop', x + '|' + y + '|' + width + '|' + height);
                    if(typeof edge === 'undefined') {
                        edge = 'center';
                    }
                    set('hotspot[' + id + '].edge', edge);
                },

                zindex: function(id, zindex) {
                    set('hotspot[' + id + '].zorder', zindex);
                },

                clicked: function(id, action, param) {
                    var options = {
                        action: action,
                        param: param
                    };
                    trigger('regards.ipano.hotspot.clicked', [id, options]);
                },

                over: function(id, action, param) {
                    var options = {
                        action: action,
                        param: param
                    };
                    trigger('regards.ipano.hotspot.over', [id, options]);
                },

                out: function(id, action, param) {
                    var options = {
                        action: action,
                        param: param
                    };
                    trigger('regards.ipano.hotspot.out', [id, options]);
                }

            },

            timeline: {

                init: function() {
                    var timeline = data.scenes[_currentScene.name].timeline;
                    if(typeof timeline === 'undefined') {
                        return;
                    }

                    for(var i=0 ; i<timeline.times.length ; i++) {
                        timeline.times[i].hotspots_on = 'false';
                    }

                    ipano.timeline.time.transparency(
                        timeline.times[timeline.start_time_index],
                        timeline.start_transparency,
                        timeline.start_time_index,
                        1);
                },

                length: function() {
                    return data.scenes[_currentScene.name].timeline.times.length;
                },

                time: {

                    transparency: function(time, transparency, zorder, originalTransparency) {
                        call('setAugmentedSpotsTransparency('
                            + time.url + ','
                            + time.id + ','
                            + transparency + ','
                            + (zorder*20) + ');');
                        if(originalTransparency>0.8) {
                            ipano.timeline.time.hotspots.add(time);
                        } else {
                            ipano.timeline.time.hotspots.remove(time);
                        }
                    },

                    data: function(index) {
                        return data.scenes[_currentScene.name].timeline.times[index];
                    },

                    remove: function(time) {
                        ipano.timeline.time.hotspots.remove(time);
                        call('removeAugmentedSpots(' + time.id + ');');
                    },

                    hotspots: {

                        add: function(time) {
                            var hotspots = time.hotspots;
                            if(typeof hotspots === 'undefined') {return;}
                            if(time.hotspots_on === 'false') {
                                time.hotspots_on = 'true';
                                for (var i=0; i<hotspots.length; i++) {
                                    ipano.hotspot.add(hotspots[i]);
                                }
                            }
                        },

                        remove: function(time) {
                            var hotspots = time.hotspots;
                            if(typeof hotspots === 'undefined') {return;}
                            if(time.hotspots_on === 'true') {
                                time.hotspots_on = 'false';
                                for (var i=0; i<hotspots.length; i++) {
                                    ipano.hotspot.remove(hotspots[i]);
                                }
                            }
                        }
                    }
                }
            }
        };

        var set = function(param, value) {
                _krpano.set(param, value);
            },
            get = function(param) {
                return _krpano.get(param);
            },
            call = function(operation) {
                _krpano.call(operation);
            };

        var trigger = function(key, param) {
            _$container.trigger(key, param);
        };

        return ipano;

    });

})(window.jQuery);
