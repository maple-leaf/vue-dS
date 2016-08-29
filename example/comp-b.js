const compB = Vue.extend({
    name: 'compB',
    template: '<div class="comp-b"><h2>{{title}}</h2><p>Counter:{{counter}}</p><button @click="counter++">++</button></div>',
    props: ['title'],
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
