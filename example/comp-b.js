const compB = Vue.extend({
    name: 'compB',
    template: '<h1>{{test}}</h1><button @click="test++">++</button>',
    data() {
        return {
            test: 1
        };
    }
});

Vue.component('CompB', compB);
