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
        dataStreams.$ready = (component, cb) => {
            function subCallback(val) {
                if (component.dsName) {
                    if (val === component.dsName) {
                        cb(dataStreams[val]);
                        unsubscribe();
                    }
                } else if (val === component.name) {
                    cb(dataStreams[val]);
                    unsubscribe();
                }
            }
            function unsubscribe() {
                readyStream.offValue(subCallback);
            }
            readyStream.onValue(subCallback);
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
                    const ownedStreams = {};
                    propertiesWillBeObserver.forEach(property => {
                        const dataStream = Kefir.stream(emitter => {
                            this.$watch(property, (newValue, oldValue) => {
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
                        });
                        if (dataStreams[name] && dataStreams[name][property]) {
                            ownedStreams[property] = dataStreams[name][property];
                        } else {
                            ownedStreams[property] = Kefir.pool();
                        }
                        ownedStreams[property].plug(dataStream);
                    });
                    dataStreams[name] = ownedStreams;
                    // count components with same name, when first emit ready
                    if (!dataStreams[name].count) {
                        dataStreams[name].count = 1;
                        readyStreamEmmiter.emit(name);
                    } else {
                        dataStreams[name].count++;
                    }
                    this.$dSEmitter = ownedDataStreamsEmitter;
                    this.$dS = dataStreams;
                }
            },
            beforeDestroy() {
                Object.keys(this.$dSEmitter).forEach(property => {
                    this.$dSEmitter[property].end();
                });
                delete dataStreams[this.$options.name];
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
