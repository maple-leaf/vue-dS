/*
 * app.js
 * Copyright (C) 2016 maple-leaf
 *
 * Distributed under terms of the MIT license.
 */
(function(window, Vue, eventHub){
    'use strict';
    const toolbar = Vue.extend({
        template: document.querySelector('#toolbarTpl').value,
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
            save() {
                console.log('s');
            }
        }
    });
    Vue.component('toolbar', toolbar);

})(window, Vue, eventHub);
