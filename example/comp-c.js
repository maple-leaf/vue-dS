const compC = Vue.extend({
    name: 'compC',
    template: '<h1>{{title}}</h1><p>Counter:{{counter}}</p><comp-b title="comp-B: will affect counter of `comp-A`, instead of its parent `comp-C`"></comp-b>',
    props: ['title'],
    ready() {
        this.$dS.$ready('compB-ds-unique-name', 'counter', stream => {
            console.log('up cccc');
            this.counter = stream.newValue;
        });
    },
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

Vue.component('CompC', compC);
