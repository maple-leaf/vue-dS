const compA = Vue.extend({
    name: 'compA',
    template: '<h1>com-A</h1><p>counter value in compB(will stop fetch value when larger than 5): {{counterFromB}} {{event}}</p>',
    ready() {
        this.$dS.$ready('compB', compB => {
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
