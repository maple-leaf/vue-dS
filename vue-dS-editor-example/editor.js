/*
 * app.js
 * Copyright (C) 2016 maple-leaf
 *
 * Distributed under terms of the MIT license.
 */
(function(window, Vue, eventHub){
    'use strict';
    const KEY = {
        enter: 13,
        delete: 8
    };
    const editor = Vue.extend({
        template: document.querySelector('#editorTpl').value,
        created() {
            eventHub.$on('appendEmoj', (emoj) => {
                this.text += emoj;
            });
        },
        data() {
            return {
                editing: false,
                text: '点我，双击编辑',
                limit: 15,
                emojVisible: false
            };
        },
        computed: {
            toolbarVisible() {
                return this.editing;
            }
        },
        methods:  {
            editContent(e) {
                if (this.text.length >= this.limit && e.keyCode !== KEY.delete) {
                    e.preventDefault();
                } else if (e.keyCode === KEY.enter) {
                    e.preventDefault();
                    this.editing = false;
                }
            }
        },
        watch: {
            editing() {
                eventHub.$emit('editingChanged', {
                    editing: this.editing,
                    text: this.text,
                    limit: this.limit
                });
            },
            text() {
                eventHub.$emit('textChanged', {
                    textLen: this.text.length,
                    limit: this.limit,
                });
            }
        }
    });
    Vue.component('editor', editor);

})(window, Vue, eventHub);
