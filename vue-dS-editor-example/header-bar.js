/*
 * app.js
 * Copyright (C) 2016 maple-leaf
 *
 * Distributed under terms of the MIT license.
 */
(function(window, Vue, eventHub){
    'use strict';
    const headerBar = Vue.extend({
        template: document.querySelector('#headerBarTpl').value,
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
    Vue.component('headerBar', headerBar);

})(window, Vue, eventHub);
