# lagou_spider

- 基于Nodejs，可以自由指定职位信息来快速得到所有相关职位数据的爬虫脚本


- 用sync-request解决了异步请求页面的遇到的问题。通过实现随机生成 HTTP 请求Header和监视请求失败并自行重试的功能， 解决了拉钩反爬虫机制的问题

- 实现带缓存机制的 GET，提高工作效率和容错


----------
![](https://raw.githubusercontent.com/Armrun/galou-spider/master/pacong.png)