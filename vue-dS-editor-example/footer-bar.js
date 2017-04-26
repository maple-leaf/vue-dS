/*
 * app.js
 * Copyright (C) 2016 maple-leaf
 *
 * Distributed under terms of the MIT license.
 */
(function(window, Vue){
    'use strict';
    const footerBar = Vue.extend({
        template: document.querySelector('#footerBarTpl').value,
        created() {
            eventHub.$on('editingChanged', (data) => {
                this.isEditing = data.editing;
            });
            eventHub.$on('textChanged', (data) => {
                this.textLen = data.textLen;
                this.availableLen = data.limit - this.textLen;
            });
        },
        data() {
            return {
                isEditing: false,
                textLen: 0,
                availableLen: 0
            };
        },
        methods:  {
            save() {
                console.log('s');
            }
        }
    });
    Vue.component('footerBar', footerBar);

})(window, Vue);
