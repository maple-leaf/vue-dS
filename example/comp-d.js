const compD = Vue.extend({
    name: 'compD',
    template: '<div><h1>{{title}}</h1><p>counter(will stop when larger than 5): {{counterFromB}}</p></div>',
    props: ['title'],
    ready() {
        this.$dS.$ready('compB', 'counter', stream => {
            console.log('update in compD');
            this.counterFromB = stream.newValue;
            if (stream.newValue > 5) {
                stream.end();
            }
        });
    },
    data() {
        return {
            counterFromB: 0
        };
    }
});

Vue.component('CompD', compD);
