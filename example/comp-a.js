const compA = Vue.extend({
    name: 'compA',
    template: '<h1>com-A</h1><p>counter value in compB(will stop fetch value when larger than 5): {{counterFromB}}</p>',
    ready() {
        this.$dataStreams.$ready('compB', compB => compB.counter.onValue(stream => {
            this.counterFromB = stream.newValue;
            if (stream.newValue > 5) {
                stream.end();
            }
        }));
    },
    data() {
        return {
            counterFromB: 0
        };
    }
});

Vue.component('CompA', compA);
