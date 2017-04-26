/*
 * app.js
 * Copyright (C) 2016 maple-leaf
 *
 * Distributed under terms of the MIT license.
 */
(function(window, Vue){
    'use strict';
    new Vue({
        el: '#app',
        data: function() {
            return {
                isEditing: false,
                exceedLen: 0,
                saving: false
            };
        }
    });

})(window, Vue);
