/*
 * app.js
 * Copyright (C) 2016 maple-leaf
 *
 * Distributed under terms of the MIT license.
 */
(function(window, Vue, eventHub){
    'use strict';
    const emoj = Vue.extend({
        template: document.querySelector('#emojTpl').value,
        created() {
            eventHub.$on('editingChanged', (data) => {
                this.isEditing = data.editing;
            });
        },
        data() {
            return {
                isEditing: false,
                saving: false
            };
        },
        methods:  {
            appendEmoj(e) {
                eventHub.$emit('appendEmoj', e.target.textContent);
            }
        }
    });
    Vue.component('emoj', emoj);

})(window, Vue, eventHub);
