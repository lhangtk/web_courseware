/**
 * 第一讲：Web体系与页面构建
 * 按照讲稿流式结构组织内容
 */

import { Lecture } from '../lecture-types'

export const lecture1: Lecture = {
  id: 'lecture-1',
  title: 'Web体系与页面构建',
  subtitle: '第一讲 · 90分钟',
  totalDuration: 90,
  sections: [
    // ========== 一、开场导语 ==========
    {
      id: 'sec-1-opening',
      title: '开场导语',
      duration: 5,
      blocks: [
        {
          type: 'narrative',
          content: '同学们好，欢迎来到《前端核心概念与原理解析》。',
        },
        {
          type: 'narrative',
          content:
            '在很多人的印象里，前端开发似乎就是：写写 HTML、调调 CSS、写点 JavaScript。但实际上，如果你真正深入理解浏览器，你会发现：',
        },
        {
          type: 'narrative',
          content: '前端其实是一门「操作浏览器系统」的工程。',
          emphasis: 'highlight',
        },
        {
          type: 'narrative',
          content: '今天这门课，我们不会只讲语法，而是要回答一个核心问题：',
        },
        {
          type: 'narrative',
          content: '一个网页到底是怎么被浏览器展示出来的？',
          emphasis: 'question',
        },
        {
          type: 'narrative',
          content: '当你在浏览器输入一个网址：',
        },
        {
          type: 'code',
          language: 'text',
          code: 'https://example.com',
        },
        {
          type: 'narrative',
          content: '浏览器内部究竟发生了什么？大概会经历：',
        },
        {
          type: 'flow',
          steps: [
            'DNS解析',
            '建立TCP连接',
            'HTTPS握手',
            '请求HTML',
            '解析HTML',
            '下载CSS',
            '执行JS',
            '计算布局',
            '绘制像素',
          ],
          direction: 'horizontal',
        },
        {
          type: 'narrative',
          content: '最终你才看到页面。这条路径，被称为：',
        },
        {
          type: 'narrative',
          content: '浏览器关键渲染路径',
          emphasis: 'highlight',
        },
        {
          type: 'narrative',
          content: '今天我们整节课都会围绕这个主线。',
        },
      ],
    },

    // ========== 二、Web前端概述与三剑客 ==========
    {
      id: 'sec-2-overview',
      title: 'Web前端概述与三剑客',
      duration: 20,
      blocks: [
        // 2.1 客户端-服务器模型
        {
          type: 'narrative',
          content: '首先我们要理解：Web到底是什么架构？',
          emphasis: 'question',
        },
        {
          type: 'narrative',
          content: '本质上 Web 是一种：客户端—服务器架构。',
        },
        {
          type: 'flow',
          steps: ['浏览器 (Client)', 'DNS服务器', 'CDN / 网关', '应用服务器', '数据库'],
          direction: 'vertical',
        },
        {
          type: 'narrative',
          content: '浏览器的职责只有一个：获取资源并渲染页面。',
          emphasis: 'highlight',
        },
        {
          type: 'bullets',
          title: '资源可能包括:',
          items: ['HTML', 'CSS', 'JS', '图片', '字体', '视频'],
        },

        // URL 输入之后发生什么
        {
          type: 'narrative',
          content: '这是经典面试题：URL 输入之后发生什么？',
          emphasis: 'question',
        },
        {
          type: 'narrative',
          content: '第一步：DNS解析。浏览器会查询：',
        },
        {
          type: 'code',
          language: 'text',
          code: 'example.com → IP地址',
          caption: '域名解析',
        },
        {
          type: 'bullets',
          title: '查询顺序:',
          items: ['浏览器缓存', '系统缓存', '路由器缓存', 'ISP DNS', '根DNS'],
        },
        {
          type: 'narrative',
          content: '第二步：建立TCP连接。浏览器会进行 TCP三次握手。',
        },
        {
          type: 'code',
          language: 'text',
          code: 'SYN → SYN-ACK → ACK',
          caption: '三次握手',
        },
        {
          type: 'narrative',
          content: '第三步：HTTPS握手。如果是 HTTPS，还会进行 TLS握手：交换证书、协商加密算法、生成会话密钥。',
        },
        {
          type: 'narrative',
          content: '第四步：发送HTTP请求。',
        },
        {
          type: 'code',
          language: 'text',
          code: `GET /index.html HTTP/1.1
Host: example.com

---

HTTP/1.1 200 OK
Content-Type: text/html`,
          caption: 'HTTP 请求与响应',
        },

        // Demo: 渲染流程
        {
          type: 'narrative',
          content: '下面通过交互演示，完整回放这个过程：',
        },
        {
          type: 'demo',
          demoType: 'renderPipeline',
          config: { type: 'renderPipeline', showAsync: true, showDefer: true },
        },

        {
          type: 'transition',
          text: '浏览器拿到HTML之后，是怎么理解它的？这就引出了 Web 三剑客。',
        },

        // 2.2 Web三剑客
        {
          type: 'narrative',
          content: 'Web最核心的三个技术：HTML、CSS、JavaScript。很多人背过，但很少理解它们的设计哲学。',
          emphasis: 'highlight',
        },
        {
          type: 'narrative',
          content: 'HTML：结构。HTML解决的问题是内容结构，例如：文章、标题、段落、导航、侧栏。',
        },
        {
          type: 'narrative',
          content: 'HTML的核心思想是：语义化。',
          emphasis: 'highlight',
        },
        {
          type: 'code',
          language: 'html',
          code: `<header>
<nav>
<article>
<section>
<footer>`,
          caption: '语义化标签',
        },
        {
          type: 'narrative',
          content: 'CSS：表现。CSS解决的是页面长什么样，例如：颜色、字体、布局、动画。它只负责视觉表现。',
        },
        {
          type: 'narrative',
          content: 'JavaScript：行为。JS解决的是页面会发生什么，例如：点击按钮、加载数据、表单验证、动画控制。',
        },
        {
          type: 'narrative',
          content: '为什么要分三层？',
          emphasis: 'question',
        },
        {
          type: 'narrative',
          content: '早期网页是这样写的：',
        },
        {
          type: 'code',
          language: 'html',
          code: `<table>
  <tr>
    <td bgcolor="red">内容</td>
  </tr>
</table>`,
          caption: '结构和样式混在一起',
        },
        {
          type: 'narrative',
          content: '后来 Web 标准提出：结构 / 表现 / 行为分离。',
          emphasis: 'highlight',
        },
        {
          type: 'bullets',
          title: '分离的优点:',
          items: ['可维护', '可复用', '可访问性更好'],
        },

        // 浏览器内核
        {
          type: 'narrative',
          content: '浏览器其实由两个核心部分组成：',
        },
        {
          type: 'bullets',
          title: '渲染引擎（负责解析HTML/CSS、布局、绘制）:',
          items: ['Blink（Chrome）', 'WebKit（Safari）', 'Gecko（Firefox）'],
        },
        {
          type: 'bullets',
          title: 'JavaScript引擎（负责执行JS）:',
          items: ['V8（Chrome）', 'SpiderMonkey（Firefox）'],
        },
        {
          type: 'narrative',
          content: '但有一个重要规则：JS执行会阻塞DOM解析。为什么？后面会解释。',
          emphasis: 'highlight',
        },
        {
          type: 'transition',
          text: '现在我们已经知道浏览器拿到了 HTML。但 HTML 只是一堆字节。浏览器如何把字节变成屏幕像素？',
        },
      ],
    },

    // ========== 三、浏览器渲染原理 ==========
    {
      id: 'sec-3-render',
      title: '浏览器渲染原理',
      duration: 25,
      blocks: [
        {
          type: 'narrative',
          content: '这是整门课最重要的一部分。',
          emphasis: 'highlight',
        },

        // 3.1 HTML解析
        {
          type: 'narrative',
          content: '浏览器收到HTML之后，会做第一件事：解析HTML。',
        },
        {
          type: 'code',
          language: 'html',
          code: `<html>
  <body>
    <div>Hello</div>
  </body>
</html>`,
        },
        {
          type: 'narrative',
          content: '浏览器会构建：DOM Tree。',
        },
        {
          type: 'code',
          language: 'text',
          code: `html
 └ body
   └ div
     └ text "Hello"`,
          caption: 'DOM 树结构',
        },
        {
          type: 'narrative',
          content: 'DOM是一个树结构。下面是交互演示：',
        },
        {
          type: 'demo',
          demoType: 'domTreeBuilder',
          config: {
            type: 'domTreeBuilder',
            initialHtml: `<div>
  <h1>Hello</h1>
  <p>World</p>
</div>`,
          },
        },

        // 3.2 CSS解析
        {
          type: 'narrative',
          content: '同时浏览器会下载CSS：',
        },
        {
          type: 'code',
          language: 'html',
          code: `<link rel="stylesheet" href="style.css">`,
        },
        {
          type: 'narrative',
          content: 'CSS会被解析为：CSSOM（CSS Object Model）。',
        },

        // 3.3 JS阻塞
        {
          type: 'narrative',
          content: 'JS执行为什么会阻塞？',
          emphasis: 'question',
        },
        {
          type: 'narrative',
          content: '如果HTML解析到：',
        },
        {
          type: 'code',
          language: 'html',
          code: `<script src="app.js"></script>`,
        },
        {
          type: 'narrative',
          content: '浏览器会：1. 停止解析HTML → 2. 下载JS → 3. 执行JS',
        },
        {
          type: 'narrative',
          content: '为什么？因为 JS 可以调用 document.write() 修改DOM。如果不停下来，DOM结构会错乱。',
          emphasis: 'highlight',
        },
        {
          type: 'narrative',
          content: '为了解决这个问题，有两个属性：',
        },
        {
          type: 'code',
          language: 'html',
          code: `<!-- async: 下载不阻塞，执行会打断解析 -->
<script async src="app.js"></script>

<!-- defer: 下载不阻塞，DOM解析完再执行 -->
<script defer src="app.js"></script>`,
          caption: 'async vs defer',
        },

        // 3.4 Render Tree
        {
          type: 'narrative',
          content: '浏览器会合并 DOM 和 CSSOM，生成：Render Tree。',
        },
        {
          type: 'narrative',
          content: '只有可见元素才会进入 Render Tree。例如 display:none 不会进入。',
          emphasis: 'highlight',
        },

        // 3.5 Layout
        {
          type: 'narrative',
          content: 'Layout 就是：计算元素位置。例如宽度、高度、位置。也叫 Reflow（回流/重排）。',
        },

        // 3.6 Paint
        {
          type: 'narrative',
          content: 'Layout完成后开始 Paint。绘制：颜色、文字、阴影、边框。',
        },

        // 3.7 Composite
        {
          type: 'narrative',
          content: '现代浏览器还会：合成图层（Composite）。',
        },
        {
          type: 'code',
          language: 'css',
          code: `/* 这些属性会进入 GPU 合成层 */
transform: translateX(100px);
opacity: 0.5;`,
          caption: 'GPU 合成',
        },
        {
          type: 'narrative',
          content: '为什么 transform 性能更好？因为它不会触发布局，只会触发 composite。',
          emphasis: 'highlight',
        },
        {
          type: 'checkpoint',
          question: '能说出从 URL 到像素的完整流程吗？能指出哪些操作会触发重排/重绘吗？',
        },
        {
          type: 'transition',
          text: '现在大家理解了浏览器如何渲染页面。但如果HTML结构不好，渲染效率也会很差。所以我们要学习 HTML 语义化。',
        },
      ],
    },

    // ========== 四、HTML核心与语义化 ==========
    {
      id: 'sec-4-html',
      title: 'HTML核心与语义化',
      duration: 20,
      blocks: [
        {
          type: 'narrative',
          content: 'HTML最早来自 SGML，后来演变为 HTML4 → XHTML → HTML5。',
        },
        {
          type: 'narrative',
          content: 'HTML5的目标：更适合现代应用。',
          emphasis: 'highlight',
        },

        // 语义化标签
        {
          type: 'narrative',
          content: '语义化标签：',
        },
        {
          type: 'code',
          language: 'html',
          code: `<header>  <!-- 页眉 -->
<nav>     <!-- 导航 -->
<main>    <!-- 主内容 -->
<article> <!-- 独立文章 -->
<section> <!-- 章节 -->
<footer>  <!-- 页脚 -->`,
          caption: '语义化标签',
        },
        {
          type: 'narrative',
          content: '为什么重要？两个原因：SEO（搜索引擎更容易理解页面结构）和可访问性（屏幕阅读器会依赖语义结构）。',
          emphasis: 'highlight',
        },

        // 块级/行内
        {
          type: 'narrative',
          content: 'HTML元素分为：',
        },
        {
          type: 'bullets',
          title: '块级元素（独占一行）:',
          items: ['div', 'p', 'h1~h6', 'ul/li'],
        },
        {
          type: 'bullets',
          title: '行内元素（不换行）:',
          items: ['span', 'a', 'img', 'strong'],
        },

        // HTML5 API
        {
          type: 'narrative',
          content: 'HTML5带来了很多新能力：',
        },
        {
          type: 'code',
          language: 'html',
          code: `<!-- 表单验证 -->
<input type="email" required>

<!-- 视频 -->
<video src="movie.mp4" controls></video>

<!-- Canvas 绘图 -->
<canvas id="chart"></canvas>`,
          caption: 'HTML5 新特性',
        },
        {
          type: 'transition',
          text: 'HTML只是结构。要让页面漂亮，必须使用 CSS。',
        },
      ],
    },

    // ========== 五、CSS核心机制 ==========
    {
      id: 'sec-5-css',
      title: 'CSS核心机制',
      duration: 18,
      blocks: [
        // 层叠
        {
          type: 'narrative',
          content: 'CSS的全称：Cascading Style Sheets。Cascading = 层叠。',
        },
        {
          type: 'narrative',
          content: '当多个样式冲突时，浏览器会计算优先级。',
        },
        {
          type: 'narrative',
          content: '优先级规则（从高到低）:',
          emphasis: 'highlight',
        },
        {
          type: 'code',
          language: 'text',
          code: `!important > inline > #id > .class > tag`,
          caption: '优先级',
        },
        {
          type: 'demo',
          demoType: 'cssCascade',
          config: {
            type: 'cssCascade',
            initialCss: `#box { color: red; }
.box { color: blue; }
div { color: green; }`,
            initialHtml: `<div id="box" class="box">Hello</div>`,
          },
        },

        // 继承
        {
          type: 'narrative',
          content: '一些CSS属性会自动继承，例如：font、color。好处是减少重复代码。',
        },

        // 盒模型
        {
          type: 'narrative',
          content: '每个元素都被看作一个盒子。',
        },
        {
          type: 'demo',
          demoType: 'boxModel',
          config: { type: 'boxModel' },
        },

        // BFC
        {
          type: 'narrative',
          content: 'BFC 是什么？为什么要学它？',
          emphasis: 'question',
        },
        {
          type: 'narrative',
          content: 'BFC（Block Formatting Context）叫「块级格式化上下文」。简单理解：它是一个独立的渲染区域，内部元素和外部元素互不影响。',
        },
        {
          type: 'narrative',
          content: '掌握 BFC 能解决三个常见的 CSS "怪异行为"：',
          emphasis: 'highlight',
        },
        {
          type: 'demo',
          demoType: 'bfcDemo',
          config: { type: 'bfcDemo' },
        },

        // 现代布局
        {
          type: 'narrative',
          content: '现代CSS有两大布局系统：Flex 和 Grid。很多人只会用 Flex，但它们适用场景不同。',
        },
        {
          type: 'narrative',
          content: 'Flex = 一维布局（只管一行或一列），Grid = 二维布局（同时管理行和列）。',
          emphasis: 'highlight',
        },
        {
          type: 'demo',
          demoType: 'gridPlayground',
          config: { type: 'gridPlayground', itemCount: 6 },
        },

        // CSS性能
        {
          type: 'narrative',
          content: '最后一个重要话题：CSS 性能。为什么有些动画很卡，有些很流畅？这和浏览器的渲染管线有关。',
        },
        {
          type: 'narrative',
          content: '浏览器渲染分为几个阶段：Layout（布局）→ Paint（绘制）→ Composite（合成）。不同 CSS 属性变化会触发不同阶段：',
          emphasis: 'highlight',
        },
        {
          type: 'bullets',
          title: '触发级别与代价:',
          items: [
            'Layout 触发（最贵）：改变几何属性如 width、height、margin、padding，会重新计算所有元素位置',
            'Paint 触发（中等）：改变视觉属性如 color、background、border-radius，要重新绘制像素',
            'Composite 触发（最省）：只有 transform 和 opacity 可以跳过前两步，直接由 GPU 合成',
          ],
        },
        {
          type: 'demo',
          demoType: 'cssPerformance',
          config: { type: 'cssPerformance' },
        },
        {
          type: 'narrative',
          content: '实际开发中的黄金法则：动画只用 transform 和 opacity，能获得 60fps 流畅体验。',
          emphasis: 'highlight',
        },
      ],
    },

    // ========== 总结 ==========
    {
      id: 'sec-6-summary',
      title: '第一讲总结',
      duration: 2,
      blocks: [
        {
          type: 'narrative',
          content: '今天我们理解了浏览器渲染的完整流程：',
        },
        {
          type: 'flow',
          steps: ['URL', 'HTTP', 'HTML解析', 'DOM', 'CSSOM', 'RenderTree', 'Layout', 'Paint', 'Composite'],
          direction: 'horizontal',
        },
        {
          type: 'narrative',
          content: '下一节课，我们将进入：JavaScript 执行机制。',
          emphasis: 'highlight',
        },
        {
          type: 'checkpoint',
          question: '能画出完整的渲染流程图吗？能解释 async/defer 的区别吗？',
        },
      ],
    },
  ],
}
