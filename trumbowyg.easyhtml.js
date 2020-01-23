(function ($) {
    'use strict';

    // Plugin default options
    var defaultOptions = {
        defaults : {
            tag: '',
            id: '',
            class: '',
            props: '',
            content: ''
        },
        templates: {}
    };

    // Encode the string in html characters for being inserted into the editor
    function HTMLEncode(string) {
        return string.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
        ;
    }

    // Shrink HTML string, removing spaces between tags
    function HTMLShrink(string) {
        return string.replace(/>\s*(.*?)\s*</g,'>$1<');
    }

    // Create an HTML element
    function createHTMLElement(html) {
        var tag = html.tag;
        var id = html.id || '';
        var classes = html.class || '';
        var props = html.props || '';
        var content = html.content || '';

        return `<${tag}
                    id="${id}"
                    class="${classes}"
                    ${props}
                >
                    ${content}
                </${tag}>`
        ;
    }

    // Insert HTML
    function insertHTML(trumbowyg, values) {
        var element = createHTMLElement(values);

        trumbowyg.restoreRange();
        trumbowyg.execCmd('insertHtml', HTMLShrink(element));
    }

    // Create insert HTML modal
    function createModalForm(trumbowyg, defaults) {
        trumbowyg.saveRange();
        var $modal =  trumbowyg.openModal(
            'Insert an element',
            `
                <label>
                    <input type="text" name="tag" value="${defaults.tag}">
                    <span class="trumbowyg-input-infos">
                        <span>tag</span>
                    </span>
                </label>
                <label>
                    <input type="text" name="id" value="${defaults.id}">
                    <span class="trumbowyg-input-infos">
                        <span>id</span>
                    </span>
                </label>
                <label>
                    <input type="text" name="class" value="${defaults.class}">
                    <span class="trumbowyg-input-infos">
                        <span>class</span>
                    </span>
                </label>
                <label>
                    <input type="text" name="props" value="${HTMLEncode(defaults.props)}">
                    <span class="trumbowyg-input-infos">
                        <span>props</span>
                    </span>
                </label>
                <label class="trumbowyg-easyhtml-bigtext">
                    <span class="trumbowyg-input-infos">
                            <span>content</span>
                    </span>
                    <textarea name="content">${trumbowyg.getRangeText() || defaults.content}</textarea>
                </label>
            `,
            true
        );

        var values;
        $modal.on('tbwconfirm', function(e) {
            values = $modal.find('form').serializeArray();
            insertHTML(trumbowyg, {
                tag: values[0].value,
                id: values[1].value,
                class: values[2].value,
                props: values[3].value,
                content: values[4].value
            });

            trumbowyg.closeModal();
        });
        $modal.on('tbwcancel', function(e){
            trumbowyg.closeModal();
        });

        return $modal;
    }

    function createQuickInsertModal(trumbowyg) {
        var $modal =  trumbowyg.openModal(
            'Quick insert HTML',
            `
                <label class="trumbowyg-easyhtml-bigtext">
                    <span class="trumbowyg-input-infos">
                            <span>html</span>
                    </span>
                    <textarea name="html"></textarea>
                </label>
            `,
            true
        );

        var values;
        $modal.on('tbwconfirm', function(e) {
            values = $modal.find('form').serializeArray();
            trumbowyg.restoreRange();
            trumbowyg.execCmd('insertHtml', values[0].value);

            trumbowyg.closeModal();
        });
        $modal.on('tbwcancel', function(e){
            trumbowyg.closeModal();
        });

        return $modal;

    }

    // Build templates button
    function buildTemplatesButton(trumbowyg) {
        var dropdown = [],
            defaults = trumbowyg.o.plugins.easyHTML.defaults,
            templates = trumbowyg.o.plugins.easyHTML.templates
        ;

        // Build separator
        trumbowyg.addBtnDef('easyHTML_separator', {
            style: " height:0; overflow:hidden; border:1px solid;"
        });
        dropdown.push('easyHTML_separator');


        // Build template button
        $.each(templates, function(index, template) {
            trumbowyg.addBtnDef('easyHTML_t_' + index, {
                hasIcon: false,
                fn: function() {
                    console.log($.extend(
                            true,
                            {},
                            defaults,
                            template.values
                        ));
                    createModalForm(
                        trumbowyg,
                        $.extend(
                            true,
                            {},
                            defaults,
                            template.values
                        )
                    );
                },
                text: template.text
            });

            dropdown.push('easyHTML_t_' + index);
        });

        return dropdown;
    }

    // Build easyHTML button
    function buildMainButton(trumbowyg) {
        var dropdownButton = [];

        // Add Quick insert HTML button
        trumbowyg.addBtnDef('easyHTML_quickinsert', {
            fn:function() {
                createQuickInsertModal(trumbowyg);
            },
            text: 'Quick insert HTML',
            hasIcon: false
        });
        dropdownButton.push('easyHTML_quickinsert');

         // Add Insert HTML button
        trumbowyg.addBtnDef('easyHTML_insert', {
            fn: function() {
                createModalForm(trumbowyg, trumbowyg.o.plugins.easyHTML.defaults)
            },
            text: 'Insert HTML',
            hasIcon: false
        });
        dropdownButton.push('easyHTML_insert');

        // Insert HTML from templates... if there is anyone defined
        if (! $.isEmptyObject(trumbowyg.o.plugins.easyHTML.templates)) {
            dropdownButton = dropdownButton.concat(buildTemplatesButton(trumbowyg));
        }

        return {
            dropdown: dropdownButton,
            title: 'Insert HTML',
            text: 'easyHTML',
            hasIcon: false
        };
    }

    $.extend(true, $.trumbowyg, {
        plugins: {
            easyHTML: {
                init: function (trumbowyg) {
                    trumbowyg.o.plugins.easyHTML = $.extend(true, {},
                        defaultOptions,
                        trumbowyg.o.plugins.easyHTML || {}
                    );

                    trumbowyg.addBtnDef('easyHTML', buildMainButton(trumbowyg));
                }
            }
        }
    });
})(jQuery);

