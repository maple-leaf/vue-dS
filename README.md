# vue-dS
[中文文档戳这里](#中文文档)

vue-dS is brief of vue-dataStream, which will make `component` able to produce data streams, and use these to communicate. 
[kefir](https://rpominov.github.io/kefir) is the library used to produce data stream.

If use `EventEmiiter`, component will have write a lot of `$dispatch` and `events`/`$on` code. And if you want these events maintainable, you should
make a rule to name the event, maybe like `this.$dispath('ComponentName:ActionName')`, and notice you workers about this and hope they follow the guide.
And about `vuex`, it's good for large and complex project, but create many extra `actions` and `store` for not that complex project, maybe a little overhead.

So I create `vue-dS`, and what this all about is: make component's data, of course allowed by component itself, can be fetch by others component any time and anywhere.
what data can be fetched can be easily find out by looking the component's `data` model. This is just like fs of Linux, file can be fetch and modify by anyone if they 
have proper right. Of course, allow componnet to modify data of other component will make some unpredictable behavior and changes, which will be a bug, and the bug will
be very hard to reproduce and debug. And `vue-dS` will never allow component to modify data directly. 


Now you can use `vue-dS` to make `component` to send and receive data stream since `created`, and use these stream to make component more interactiable.

### deps

- [vue](vuejs.org)
- [kefir](https://rpominov.github.io/kefir)

### howto

- $dSBlackList, $dSWhiteList

  Eventy `component` will have these two private variables to define filter rules, the `data` of `component` will be filter by `$dSBlackList` first,
  , which will filter when match, and then examine by `$dsWhiteList`, which will pass when match. You can use either or both.

Example:

    Vue.extend({
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
                $dSBlackList: ['privates'], // this will remove 'privates' from list
                $dSWhiteList: ['publics', 'counter'] // this will only allow 'publics' and 'counter'
            };
        }
    }); 

    // In this case, only 'publics', and 'counter' will be observed, and emit their values to others components

- $dS

    The private variable `$dS` have a `$ready` method to fetch all streams of the `component` by passing the component name. And when the
    component is start emit data stream, `callback` passed to `$ready` will be called,   and `callback` will get an param, which is a object
    inclued all `data` passed by `$blackList` and `$whiteList`. Each `data` will have three properties:

```
  {
    newValue: 'newValue', // current value of property
    oldValue: 'oldValue', // last value of property
    end: fn // a function to stop fetch lastest stream of property
  }
```

Example:

    Vue.extend({
        name: 'compA',
        template: '<h1>com-A</h1><p>counter value in compB(will stop fetch value when larger than 5): {{counterFromB}} {{event}}</p>',
        ready() {
            this.$dS.$ready('compB', compB => {
                compB.counter.onValue(stream => {
                    this.counterFromB = stream.newValue; // update number in `compA` when `counter` in `compB` change
                    if (stream.newValue > 5) {
                        stream.end();
                    }
                });
            });
        },
        data() {
            return {
                counterFromB: 0
            };
        }
    });

---

# 中文文档

vue-dS, 即vue-dataStream缩写。因本插件会在`component`之间产生持续的数据流，并以此来通信，故取此名称。本插件采用[kefir](https://rpominov.github.io/kefir)来创建数据流。

该插件是为了解决不同`component`间的通信问题，目前`vue`自带的`EventEmiiter`会产生一堆的`$dispatch`, `events`代码，
使原本简单的代码变得繁杂。至于第三方的`vuex`，在大项目中或许没什么问题，但是在某些项目中，专门建立`actions`,
`store`显得有点过头了，原本一点代码可以解决的东西变得复杂化了。

这个插件的思想就是，每个component的data就是可随时获取的，每个`component`的`data`是否可被外部`component`获取由自身来决定。
就像Linux上的文件系统一样，文件本身就是`data`，而文件可否可被读取修改由文件自身的权限决定。但是有所不同的是项目中不同
`component`之间如果可以互相修改，就是导致数据变更不确定性，最终导致不明原因的bug的产生。所以本插件只让`component`间只有读取值，而不会开放修改。

每个`component`的值从`created`开始就向外部发送自身的`data`数据流，也在接收其他`component`发送的数据流。`component`之间的关联性可以由某个数据来作为桥梁，监听该数据来改变自身的行为。


### 依赖

- vue
- kefir

### howto

- $dSBlackList, $dSWhiteList

  每个`component`可以定义这两个私有变量来定义过滤规则，`data`内的`properties`会经过`$dSBlackList`过滤掉黑名单，再经过`$dsWhiteList`过滤掉不在白名单内的`properties`.

Example:

    Vue.extend({
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
                $dSBlackList: ['privates'], // this will remove 'privates' from list
                $dSWhiteList: ['publics', 'counter'] // this will only allow 'publics' and 'counter'
            };
        }
    }); 

    // In this case, only 'publics', and 'counter' will be observed, and emit their values to others components

- $dS

    每个`component`都会有一个私有变量`$dS`, 该变量提供`$ready`方法来获取其他`component`的数据流.
    `$ready`方法接收两个参数: `component-name`, `callback`.
    callback获取一个`Object`，包含所有`component`向外传递数据流的`properties`.
    每个`property`均会有`onValue`方法，该方法获取变更数据流`stream`, `stream`的数据为:
    ```
    {
        newValue: 'newValue', // current value of property
        oldValue: 'oldValue', // last value of property
        end: fn // a function to stop fetch lastest stream of property
    }
    ```

Example:

    Vue.extend({
        name: 'compA',
        template: '<h1>com-A</h1><p>counter value in compB(will stop fetch value when larger than 5): {{counterFromB}} {{event}}</p>',
        ready() {
            this.$dS.$ready('compB', compB => {
                compB.counter.onValue(stream => {
                    this.counterFromB = stream.newValue; // update number in `compA` when `counter` in `compB` change
                    if (stream.newValue > 5) {
                        stream.end();
                    }
                });
            });
        },
        data() {
            return {
                counterFromB: 0
            };
        }
    });

