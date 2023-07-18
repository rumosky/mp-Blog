## 说明

一直想把网站做成小程序，github上typecho的小程序也都是远古版本，今年官方也升级到了typecho 1.2.1版本，目前还没有可用的小程序，我自己抽空写了一个，开源给大家使用。

先附上开源地址：[Gitee国内](https://gitee.com/rumosky/mp-Blog) [Github](https://github.com/rumosky/mp-Blog)

详情地址：https://rumosky.com/archives/698/

其中，`Restful`后端接口插件，`mp`为小程序源码，`img`为介绍图片

### 环境

本站环境如下：

```bash
# PHP版本：8.1.17
# 网站服务器：nginx/1.22.1
# 数据库：Pdo_Mysql[Version：5.7.42-log]
# Typecho版本：1.2.1
```

微信小程序没有使用uni-app等框架，采用原生小程序和Vant前端框架，本小程序秉承简洁原则，大方美观

小程序二维码扫一扫下图：

![如默星空小程序](/img//mpQRcode.jpg)

#### 主要功能及优点

* 首页文章列表、文章分类浏览、文章归档时间轴、关于

* 浏览文章评论、分享页面、复制联系信息

* 文章代码高亮、行号、语言显示

* 文章链接自动复制

* 文章表格横向滚动

* 一键返回顶部

* 接口请求时间限制，防止崩溃

* 使用缓存，提升加载速度

#### 预览图

![首页](/img//首页.PNG)

![分类](/img//分类.PNG)

![归档](/img//归档.PNG)

![关于](/img//关于.PNG)

![代码高亮](/img//代码高亮.PNG)

![评论](/img//评论.PNG)

#### 后端

代码中`typecho-plugin-Restful`文件夹为接口插件，修改名称为Restful，上传到插件目录，启用即可。

默认后端请求地址为`https://xxx.com/api/`，可自行在插件中设置，此插件源码地址为：[typecho-plugin-Restful](https://github.com/moefront/typecho-plugin-Restful)

这个插件目前评论接口无效，搜索接口无效

#### 前端

小程序代码，appjs里修改后端接口地址：

```javascript
// app.js
App({
  onLaunch() {
    // 获取当前年份
    const date = new Date();
    const currentYear = date.getFullYear();
    this.globalData.currentYear = currentYear;
  },

  globalData: {
    baseURL: "https://xxx",
    currentYear: null,
  },
});
```

这个接口地址需要在微信小程序开发后台添加一下，然后执行`npm install`，然后构建npm即可

#### 已知问题

* 由于接口问题，目前小程序搜索功能暂未实现

* 评论功能暂不支持，目前也不打算支持，因为不简洁而且不容易过审

* 评论显示目前仅支持两层，也就是只允许回复一次，需在typecho后台设置*启用评论回复，以2层作为每个评论最多的回复层数*，这是由于性能问题，经测试，评论三重循环时，加载10条评论就会显著卡顿，所以暂时不计划更新评论层数，保持两层够用即可

#### 计划更新

1. 优化页面加载策略，调整性能
2. 增加黑暗模式（功能不复杂，开发版已支持，就是实在懒得适配css，很烦）
3. 自己写接口，因为这个插件返回的数据有时候需要前台处理，很麻烦
4. 未完待续……

#### 小程序审核

审核之前，后台最好备份一下数据，然后留两三篇技术文章，不要抄袭，不要发资讯之类的，一般都没问题，评论最好不要有。

本站小程序从提交审核到通过，14分钟，很快，如下图：

![微信小程序审核](/img//微信审核.PNG)

### 结语

这个微信小程序的本意就是方便在移动端浏览文章，所以阅读是最重要的功能，其余都是点缀，不希望太复杂，虽然网站是响应式布局，但很少有人用手机访问。

BUG反馈请提交issue，留言请前往此处：https://rumosky.com/archives/698/
