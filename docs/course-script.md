
# 《前端核心概念与原理解析》完整讲稿版

---

# 第一讲

# Web体系与页面构建

（90分钟）

---

# 一、开场导语（5分钟）

同学们好，欢迎来到《前端核心概念与原理解析》。

在很多人的印象里，前端开发似乎就是：

* 写写 HTML
* 调调 CSS
* 写点 JavaScript

但实际上，如果你真正深入理解浏览器，你会发现：

**前端其实是一门“操作浏览器系统”的工程。**

今天这门课，我们不会只讲语法，而是要回答几个核心问题：

**一个网页到底是怎么被浏览器展示出来的？**

当你在浏览器输入一个网址：

```
https://example.com
```

浏览器内部究竟发生了什么？

大概会经历：

1. DNS解析
2. 建立TCP连接
3. HTTPS握手
4. 请求HTML
5. 解析HTML
6. 下载CSS
7. 执行JS
8. 计算布局
9. 绘制像素

最终你才看到页面。

这条路径，被称为：

**浏览器关键渲染路径**

今天我们整节课都会围绕这个主线。

---

# 二、Web前端概述与三剑客（20分钟）

---

# 1 客户端—服务器模型

首先我们要理解：

**Web到底是什么架构？**

本质上 Web 是一种：

**客户端—服务器架构**

结构如下：

```
浏览器 (Client)
        ↓
    DNS服务器
        ↓
   CDN / 网关
        ↓
  应用服务器
        ↓
    数据库
```

浏览器的职责只有一个：

**获取资源并渲染页面**

资源可能包括：

```
HTML
CSS
JS
图片
字体
视频
```

---

## URL 输入之后发生什么

这是经典面试题。

流程如下：

### 第一步：DNS解析

浏览器会查询：

```
example.com → IP地址
```

查询顺序：

```
浏览器缓存
系统缓存
路由器缓存
ISP DNS
根DNS
```

最终得到服务器 IP。

---

### 第二步：建立TCP连接

浏览器会进行：

**TCP三次握手**

```
SYN
SYN-ACK
ACK
```

目的是建立可靠连接。

---

### 第三步：HTTPS握手

如果是 HTTPS，还会进行：

**TLS握手**

主要是：

* 交换证书
* 协商加密算法
* 生成会话密钥

---

### 第四步：发送HTTP请求

浏览器发送：

```
GET /index.html HTTP/1.1
Host: example.com
```

服务器返回：

```
HTTP/1.1 200 OK
Content-Type: text/html
```

以及 HTML 内容。

---

这里提出一个问题：

**浏览器拿到HTML之后，是怎么理解它的？**

这就引出了：

---

# 2 Web三剑客

Web最核心的三个技术：

```
HTML
CSS
JavaScript
```

很多人背过，但很少理解它们的**设计哲学**。

---

## HTML：结构

HTML解决的问题是：

**内容结构**

例如：

```
文章
标题
段落
导航
侧栏
```

HTML的核心思想：

**语义化**

例如：

```
<header>
<nav>
<article>
<section>
<footer>
```

---

## CSS：表现

CSS解决的是：

**页面长什么样**

例如：

```
颜色
字体
布局
动画
```

它只负责视觉表现。

---

## JavaScript：行为

JS解决的是：

**页面会发生什么**

例如：

```
点击按钮
加载数据
表单验证
动画控制
```

---

# 为什么要分三层？

早期网页是这样写的：

```
<table>
<tr>
<td bgcolor="red">
```

结构和样式混在一起。

后来 Web 标准提出：

**结构 / 表现 / 行为分离**

优点：

* 可维护
* 可复用
* 可访问性更好

---

# 浏览器内核

浏览器其实由两个核心部分组成：

### 渲染引擎

负责：

```
HTML解析
CSS解析
布局
绘制
```

常见：

* Blink（Chrome）
* WebKit（Safari）
* Gecko（Firefox）

---

### JavaScript引擎

负责执行JS。

例如：

* V8（Chrome）
* SpiderMonkey（Firefox）

---

渲染引擎与JS引擎会协同工作。

但有一个重要规则：

**JS执行会阻塞DOM解析**

为什么？

后面会解释。

---

# 过渡

现在我们已经知道：

浏览器拿到 HTML。

但 HTML 只是：

**一堆字节**

浏览器如何把字节变成：

**屏幕像素？**

接下来我们进入：

**浏览器渲染原理**

---

# 三、浏览器渲染原理（25分钟）

这是整门课最重要的一部分。

---

# 1 HTML解析

浏览器收到HTML之后，会做第一件事：

**解析HTML**

例如：

```
<html>
<body>
<div>Hello</div>
</body>
</html>
```

浏览器会构建：

**DOM Tree**

```
html
 └ body
   └ div
     └ text
```

DOM是一个树结构。

---

# 2 CSS解析

同时浏览器会下载CSS：

```
<link rel="stylesheet">
```

CSS会被解析为：

**CSSOM**

```
CSS Object Model
```

---

# 3 JS执行为什么会阻塞

如果HTML解析到：

```
<script src="app.js"></script>
```

浏览器会：

1 停止解析HTML
2 下载JS
3 执行JS

为什么？

因为 JS 可以：

```
document.write()
修改DOM
```

如果不停下来，DOM结构会错乱。

---

# async 和 defer

为了解决这个问题，有两个属性：

### async

```
<script async>
```

特点：

* 下载不阻塞
* 执行会打断解析

---

### defer

```
<script defer>
```

特点：

* 下载不阻塞
* DOM解析完再执行

---

# 4 Render Tree

浏览器会合并：

```
DOM
CSSOM
```

生成：

**Render Tree**

只有可见元素才会进入 Render Tree。

例如：

```
display:none
```

不会进入。

---

# 5 Layout

Layout就是：

**计算元素位置**

例如：

```
宽度
高度
位置
```

也叫：

```
Reflow
```

---

# 6 Paint

Layout完成后开始：

**Paint**

绘制：

```
颜色
文字
阴影
边框
```

---

# 7 Composite

现代浏览器还会：

**合成图层**

例如：

```
transform
opacity
```

会进入：

**GPU合成层**

优点：

动画更流畅。

---

# 为什么 transform 性能更好

因为它：

**不会触发布局**

只会触发：

```
composite
```

---

# 过渡

现在大家理解了：

浏览器如何渲染页面。

但如果HTML结构不好。

渲染效率也会很差。

所以我们要学习：

**HTML语义化**

---

# 四、HTML核心与语义化（20分钟）

---

# HTML设计理念

HTML最早来自：

**SGML**

后来演变为：

```
HTML4
XHTML
HTML5
```

HTML5的目标：

**更适合现代应用**

---

# 语义化标签

例如：

```
<header>
<nav>
<main>
<article>
<section>
<footer>
```

为什么重要？

两个原因：

### SEO

搜索引擎更容易理解页面结构。

---

### 可访问性

屏幕阅读器会依赖语义结构。

例如：

```
h1 → 页面标题
nav → 导航
```

---

# 块级 / 行内

HTML元素分为：

### 块级元素

特点：

```
独占一行
```

例如：

```
div
p
h1
```

---

### 行内元素

特点：

```
不换行
```

例如：

```
span
a
img
```

---

# HTML5 API

HTML5带来了很多新能力：

例如：

### 表单验证

```
<input required>
```

浏览器自动校验。

---

### 视频

```
<video>
```

---

### Canvas

用于：

```
图形绘制
游戏
图表
```

---

# 过渡

HTML只是结构。

要让页面漂亮。

必须使用：

**CSS**

---

# 五、CSS核心机制（18分钟）

---

# 1 层叠

CSS的全称：

```
Cascading Style Sheets
```

Cascading = 层叠。

当多个样式冲突时。

浏览器会计算优先级。

---

# 优先级规则

从高到低：

```
!important
inline
id
class
tag
```

例如：

```
#box {color:red}
.box {color:blue}
```

结果是：

```
red
```

---

# 2 继承

一些CSS属性会自动继承：

例如：

```
font
color
```

好处：

减少重复代码。

---

# 3 盒模型

每个元素都被看作：

**一个盒子**

结构：

```
content
padding
border
margin
```

---

# 标准盒模型

```
width = content
```

---

# border-box

```
width = content + padding + border
```

推荐使用：

```
box-sizing: border-box
```

---

# 4 BFC

BFC叫：

**块级格式化上下文**

作用：

* 防止margin塌陷
* 清除浮动

触发条件：

```
overflow:hidden
display:flex
float
```

---

# 5 现代布局

两大布局系统：

### Flex

一维布局。

核心概念：

```
主轴
交叉轴
```

---

### Grid

二维布局。

适合复杂UI。

---

# CSS性能

改变某些属性会触发：

```
Reflow
Repaint
```

优化方式：

使用：

```
transform
opacity
```

---

# 第一讲总结

今天我们理解了：

浏览器渲染的完整流程：

```
URL
↓
HTTP
↓
HTML解析
↓
DOM
↓
CSSOM
↓
RenderTree
↓
Layout
↓
Paint
↓
Composite
```

下一节课。

我们将进入：

**JavaScript执行机制**

---

# 第二讲

# JavaScript执行机制与知识图谱

（90分钟）

---

# 一、执行上下文（18分钟）

JavaScript是一门：

**单线程语言**

但它有一个非常复杂的执行机制。

---

# 执行上下文

每段JS代码运行时。

都会创建：

**执行上下文**

类型有三种：

```
Global
Function
Eval
```

---

# 执行上下文包含

三个部分：

```
变量环境
作用域链
this
```

---

# 变量提升

例如：

```
console.log(a)
var a = 1
```

输出：

```
undefined
```

原因是：

创建阶段会：

```
var a
```

---

# TDZ

let / const 不会提升。

例如：

```
console.log(a)
let a = 1
```

会报错。

这叫：

**暂时性死区**

---

# 二、闭包与原型（27分钟）

---

# 闭包

闭包的定义：

**函数 + 词法环境**

例如：

```
function createCounter(){
 let count=0
 return function(){
   count++
 }
}
```

内部函数记住了：

```
count
```

---

# 闭包应用

常见用途：

```
函数工厂
私有变量
函数式编程
```

---

# 原型链

JS使用：

**原型继承**

每个对象都有：

```
[[Prototype]]
```

例如：

```
obj.__proto__
```

---

# 查找属性过程

```
obj
↓
prototype
↓
Object.prototype
↓
null
```

---

# class本质

ES6 class只是：

**语法糖**

底层仍然是：

```
prototype
```

---

# this绑定

JS的this由：

**调用方式决定**

四条规则：

```
默认绑定
隐式绑定
显式绑定
new绑定
```

---

# 箭头函数

箭头函数没有自己的this。

继承：

**外层this**

---

# 三、事件循环（20分钟）

JS单线程如何处理异步？

答案是：

**事件循环**

---

# 调用栈

所有函数调用都会进入：

```
Call Stack
```

---

# 任务队列

分两类：

### 宏任务

```
setTimeout
setInterval
I/O
```

---

### 微任务

```
Promise
MutationObserver
```

---

# 执行顺序

```
同步代码
↓
微任务
↓
宏任务
```

---

# async/await

async函数本质：

```
返回Promise
```

await会：

**暂停函数**

但不会阻塞线程。

---

# 四、网络与安全（10分钟）

---

# 同源策略

浏览器限制：

```
协议
域名
端口
```

必须一致。

---

# CORS

服务器通过：

```
Access-Control-Allow-Origin
```

允许跨域。

---

# Fetch API

现代HTTP请求方式：

```
fetch()
```

替代：

```
XMLHttpRequest
```

---

# 五、课程总结（10分钟）

今天我们建立了：

**前端核心知识图谱**

结构如下：

```
浏览器
 ├ HTML
 ├ CSS
 └ JavaScript
      ├ 执行上下文
      ├ 原型链
      ├ 闭包
      └ 事件循环
```

如果理解了这些。

你就真正理解了：

**浏览器如何运行。**
