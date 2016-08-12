const compA = Vue.extend({
    name: 'compA',
    template: '<h1>com-c</h1>',
    ready() {
        this.$dataStreams.$ready('compB', compB => compB.test.onValue(stream => {
            console.log(stream.newValue);
            if (stream.newValue > 5) {
                stream.end();
            }
        }));
    },
    data() {
        return {
            name: 'A',
            arr: [1,2,2],
            obj: {
                a: 1,
                b: {
                    c: 2,
                    d:3
                }
            },
            private: {
                pa: 1
            }
        };
    },
    computed: {
        test() {
            return 'B';
        }
    }
});

Vue.component('CompA', compA);
