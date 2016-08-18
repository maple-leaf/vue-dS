# vue-ds

vue-ds, 即vue-dataStream缩写。因本插件会是`component`之间产生持续的数据流，并以此来通信，故取此名称。本插件采用[kefir](https://rpominov.github.io/kefir)来
创建数据流。

该插件是为了解决不同`component`间的通信问题，目前`vue`自带的`EventEmiiter`会产生一堆的`$dispatch`, `events`代码，
使原本简单的代码变得繁杂。至于第三方的`vuex`，在大项目中或许没什么问题，但是在某些项目中，专门建立`actions`,
`store`显得有点过头了，原本一点代码可以解决的东西变得复杂化了。

这个插件的思想就是，每个component的data就是可随时获取的，每个`component`的`data`是否可被外部`component`获取由自身来决定。
就像Linux上的文件系统一样，文件本身就是`data`，而文件可否可被读取修改由文件自身的权限决定。但是有所不同的是项目中不同
`component`之间如果可以互相修改，就是导致数据变更不确定性，最终导致不明原因的bug的产生。所以本插件只让`component`间只有
读取值，而不会开放修改。

每个`component`的值从`created`开始就像外部发送自身的`data`数据流，也在接收其他`component`发送的数据流。`component`之间
的关联性可以由某个数据来作为桥梁，监听该数据来改变自身的行为。


### Required third party libs

- vue
- kefir
