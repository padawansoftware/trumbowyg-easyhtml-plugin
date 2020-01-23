window.$ = window.jQuery = require('jquery');
require('trumbowyg');
require('trumbowyg/dist/ui/trumbowyg.min.css');
require('../trumbowyg.easyhtml.js');
require('../ui/sass/trumbowyg.easyhtml.css');

var configuration = {
    btns: [
        ['viewHTML'],
        ['easyHTML'] // Add easyHTML buttons
    ],
    plugins: {
        easyHTML: {
            defaults : {
                class: 'my-class',
                props: 'style="color: red;"',
            },
            templates: {
                my_anchor: {
                    text: 'My anchor',
                    values: {
                        tag: 'a',
                        id: 'my-anchor',
                        class: 'my-anchor-class',
                    }
                },
                my_div: {
                    text: 'My div',
                    values: {
                        tag: 'div'
                    }
                }
            }
        }
    }
};

$('.wysiwyg').trumbowyg(configuration);
