const compB = Vue.extend({
    name: 'compB',
    template: '<h1>CompB</h1><p>Counter:{{counter}}</p><button @click="counter++">++</button>',
    data() {
        return {
            counter: 1,
            privates: 'x',
            publics: 'y',
            test: {
                a: 1
            },
            $dSBlackList: ['privates'],
            $dSWhiteList: ['publics', 'counter']
        };
    }
});

Vue.component('CompB', compB);
