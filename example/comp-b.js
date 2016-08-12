const compB = Vue.extend({
    name: 'compB',
    template: '<h1>CompB</h1><p>Counter:{{counter}}</p><button @click="counter++">++</button>',
    data() {
        return {
            counter: 1
        };
    }
});

Vue.component('CompB', compB);
