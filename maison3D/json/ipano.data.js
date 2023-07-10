
(function($) {
    'use strict';

    define(function() {

        return {

            label:          'Boilerplate iPano',
            description:    '',
            xml:            'panos/pano.xml',
            start_scene:    'salleamanger',
            blend_time:     1,
            fov:            130,
            scenes: {
                salleamanger: {
                    id:             'salleamanger',
                    label:          'Salle a manger',
                    description:    '',
                    url:            'panos/salleamanger',
                    ath:            -138,
                    atv:            7.4,
                    hotspots: [
                        {
                            id:     'hs-salon',
                            url:    'media/hotspot.png',
                            edge:   'center',
                            ath:    35.2,
                            atv:    5.2,
                            click:  {
                                action: 'changePano',
                                param:  'salon'
                            }
                        },
                        {
                            id:     'hs-cuisine',
                            url:    'media/hotspot.png',
                            edge:   'center',
                            ath:    4.5,
                            atv:    4.1,
                            click:  {
                                action: 'changePano',
                                param:  'cuisine'
                            }
                        },
                        {
                            id:     'hs-sejour',
                            url:    'media/hotspot.png',
                            edge:   'center',
                            ath:    -23.5,
                            atv:    5.4,
                            click:  {
                                action: 'changePano',
                                param:  'sejour'
                            }
                        }
                    ]
                },
                salon: {
                    id:             'salon',
                    label:          'Salon',
                    description:    '',
                    url:            'panos/salon',
                    lookat:         {
                        horizontal:   {
                            start:  0
                        },
                        vertical:   {
                            start:  0
                        }
                    },
                    hotspots: [
                        {
                            id:     'hs-salleamanger',
                            url:    'media/hotspot.png',
                            edge:   'center',
                            ath:    -49.3,
                            atv:    3.6,
                            click:  {
                                action: 'changePano',
                                param:  'salleamanger'
                            }
                        },
                        {
                            id:     'hs-cuisine',
                            url:    'media/hotspot.png',
                            edge:   'center',
                            ath:    52.8,
                            atv:    2.6,
                            click:  {
                                action: 'changePano',
                                param:  'cuisine'
                            }
                        },
                        {
                            id:     'hs-sejour',
                            url:    'media/hotspot.png',
                            edge:   'center',
                            ath:    6.1,
                            atv:    3.4,
                            click:  {
                                action: 'changePano',
                                param:  'sejour'
                            }
                        }
                    ]
                },
                sejour: {
                    id:             'sejour',
                    label:          'Séjour',
                    description:    '',
                    url:            'panos/sejour',
                    lookat:         {
                        horizontal:   {
                            start:  -40
                        },
                        vertical:   {
                            start:  0
                        }
                    },
                    hotspots: [
                        {
                            id:     'hs-salleamanger',
                            url:    'media/hotspot.png',
                            edge:   'center',
                            ath:    63.3,
                            atv:    2.9,
                            click:  {
                                action: 'changePano',
                                param:  'salleamanger'
                            }
                        },
                        {
                            id:     'hs-salon',
                            url:    'media/hotspot.png',
                            edge:   'center',
                            ath:    1,
                            atv:    3,
                            click:  {
                                action: 'changePano',
                                param:  'salon'
                            }
                        },
                        {
                            id:     'hs-cuisine',
                            url:    'media/hotspot.png',
                            edge:   'center',
                            ath:    -61.1,
                            atv:    3.8,
                            click:  {
                                action: 'changePano',
                                param:  'cuisine'
                            }
                        }
                    ]
                },
                cuisine: {
                    id:             'cuisine',
                    label:          'Cuisine',
                    description:    '',
                    url:            'panos/cuisine',
                    ath:            -138,
                    atv:            7.4,
                    hotspots: [
                        {
                            id:     'hs-salleamanger',
                            url:    'media/hotspot.png',
                            edge:   'center',
                            ath:    0.2,
                            atv:    2.8,
                            click:  {
                                action: 'changePano',
                                param:  'salleamanger'
                            }
                        },
                        {
                            id:     'hs-salon',
                            url:    'media/hotspot.png',
                            edge:   'center',
                            ath:    -50,
                            atv:    3,
                            click:  {
                                action: 'changePano',
                                param:  'salon'
                            }
                        },
                        {
                            id:     'hs-sejour',
                            url:    'media/hotspot.png',
                            edge:   'center',
                            ath:    49.8,
                            atv:    4.6,
                            click:  {
                                action: 'changePano',
                                param:  'sejour'
                            }
                        }
                    ]
                }
            }
        }
    });

})(window.jQuery);
