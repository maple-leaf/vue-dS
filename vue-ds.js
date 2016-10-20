(function () {

    let installed = false;

    function VueDs(Vue, Kefir) {
        if (installed) {
            return;
        }

        if (!Kefir) {
            if (typeof window !== 'undefined' && window.Kefir) {
                Kefir = window.Kefir;
            } else {
                throw new Error(
                    'Make sure to pass in Kefir if it is not available globally: Vue.use(VueDs, Kefir)'
                );
            }
        }

        installed = true;

        const dataStreams = {};
        let readyStreamEmmiter;
        const readyStream = Kefir.stream(emitter => {
            readyStreamEmmiter = emitter;
        });
        const ready = function(componentName, property, cb) {
            let componentVueInstance = this;
            function subCallback(val) {
                if (val === componentName) {
                    const component = dataStreams[val];
                    component[property].onValue(cb);
                    component[property].log();
                    const subscribers = component.subscribers;
                    if (subscribers[property]) {
                        subscribers[property].push(cb);
                    } else {
                        subscribers[property] = [cb];
                    }
                    if (componentVueInstance.$dSSubscribedStreams[property]) {
                        componentVueInstance.$dSSubscribedStreams[property].callbacks.push(cb);
                    } else {
                        componentVueInstance.$dSSubscribedStreams[property] = {
                            observable: component[property],
                            callbacks: [cb]
                        };
                    }
                }
            }
            if (dataStreams[componentName]) {
                subCallback(componentName);
            } else {
                readyStream.onValue(subCallback);
            }
        };
        Vue.mixin({
            ready() {
                if (this.$el.nodeType === 1) {
                    this.$dsName = this.$el.getAttribute('ds-name');
                }
                const name = this.$dsName || this.$options.name;
                if (!readyStreamEmmiter) {
                    readyStream.onValue(() => {});
                }
                const propertiesWillBeObserver = Object.keys(this).filter(key => /^[^_$]/.test(key)).filter(key => {
                    let observeThisProperty = true;
                    if (this.$data.$dSBlackList) {
                        observeThisProperty = this.$data.$dSBlackList.indexOf(key) === -1;
                    }
                    if (this.$data.$dSWhiteList) {
                        observeThisProperty = this.$data.$dSWhiteList.indexOf(key) !== -1;
                    }
                    return observeThisProperty;
                });
                const ownedDataStreamsEmitter = {};
                if (name) {
                    const ownedStreams = {
                        subscribers: {}
                    };
                    propertiesWillBeObserver.forEach(property => {
                        const dataStream = Kefir.stream(emitter => {
                            const unwatch = this.$watch(property, (newValue, oldValue) => {
                                emitter.emit({
                                    newValue,
                                    oldValue,
                                    end: emitter.end
                                });
                            }, {
                                deep: true,
                                immediate: true
                            });
                            ownedDataStreamsEmitter[property] = emitter;

                            return () => {
                                unwatch();
                            };
                        });
                        if (dataStreams[name] && dataStreams[name][property]) {
                            ownedStreams[property] = dataStreams[name][property];
                        } else {
                            ownedStreams[property] = Kefir.pool();
                        }
                        ownedStreams[property].plug(dataStream);
                    });
                    dataStreams[name] = ownedStreams;
                    readyStreamEmmiter.emit(name);
                    this.$dSEmitter = ownedDataStreamsEmitter;
                    this.$dS = dataStreams;
                    this.$dS.$ready = ready.bind(this);
                    this.$dSSubscribedStreams = {};
                }
            },
            beforeDestroy() {
                if (this.$el.nodeType === 1) {
                    this.$dsName = this.$el.getAttribute('ds-name');
                }
                const name = this.$dsName || this.$options.name;
                Object.keys(this.$dSEmitter).forEach(property => {
                    // terminate owned streams
                    this.$dSEmitter[property].end();
                });
                if (name) {
                    const subscribers = dataStreams[name].subscribers;
                    const streams = dataStreams[name];
                    Object.keys(subscribers).forEach(property => {
                        // release subscriber of owned streams
                        subscribers[property].forEach(cb => streams[property].offValue(cb));
                    });
                }
                if (this.$dSSubscribedStreams) {
                    Object.keys(this.$dSSubscribedStreams).forEach(property => {
                        // unsubscribe streams
                        const observable = this.$dSSubscribedStreams[property].observable;
                        this.$dSSubscribedStreams[property].callbacks.forEach(observable.offValue.bind(observable));
                    });
                }
            }
        });
    }

    // auto install
    if (typeof Vue !== 'undefined') {
        Vue.use(VueDs);
    }

    if(typeof exports === 'object' && typeof module === 'object') {
        module.exports = VueDs;
    } else if(typeof define === 'function' && define.amd) {
        define(function () { return VueDs });
    } else if (typeof window !== 'undefined') {
        window.VueDs = VueDs;
    }
})();
