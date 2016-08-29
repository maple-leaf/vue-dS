const compA = Vue.extend({
    name: 'compA',
    template: '<div><h1>{{title}}</h1><p>counter(will stop when larger than 5): {{counterFromB}} {{event}}</p><comp-b title="comp-B: will affect counter of comp-A"></comp-b></div>',
    props: ['title'],
    ready() {
        this.$dS.$ready({name: 'compB'}, compB => {
            console.log(compB);
            compB.counter.onValue(stream => {
                this.counterFromB = stream.newValue;
                if (stream.newValue > 5) {
                    stream.end();
                }
            });
        });
    },
    data() {
        return {
            counterFromB: 0,
            event: 0,
            test: {
                a: 1
            }
        };
    }
});

Vue.component('CompA', compA);
