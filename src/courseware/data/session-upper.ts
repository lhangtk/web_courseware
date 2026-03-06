import { CourseSession } from '../types'

export const sessionUpper: CourseSession = {
  id: 'session-upper',
  title: '前端核心概念与原理解析 · 上篇',
  duration: 90,
  sessionLabel: '第 1 讲 · 90min',
  theme: '夯实 Web 体系、渲染机制、HTML 与 CSS 基础',
  summary:
    '以修订意见的前四章为蓝本，按“Web 体系 → 渲染路径 → HTML → CSS”的顺序讲透每个概念，示例保持基础、配套代码与互动演示同屏展示，帮助零基础同学建立可追溯的知识链路。',
  takeaways: [
    '能够用自己的语言复述 URL 到像素的全过程',
    '会根据语义挑选标签并解释其可访问性收益',
    '理解关键渲染路径、布局与重排的触发条件',
    '掌握盒模型与 Flex 的调试步骤，并写出对应代码',
  ],
  prerequisites: ['了解基本的计算机网络名词', '已安装现代浏览器并会打开 DevTools'],
  toolkit: ['Chrome DevTools', 'Lighthouse / WebPageTest', '屏幕阅读器模拟器'],
  chapters: [
    {
      id: 'upper-ch1',
      title: 'Web 前端概述',
      duration: 22,
      focus: '弄懂浏览器如何与服务器配合，理解结构/表现/行为的分工',
      intro:
        '沿着“从地址栏到像素”的问题线，先把浏览器、网络路径与服务器之间的职责讲清，为后续渲染细节埋下伏笔。',
      narrative:
        '按照“输入 URL → 建立连接 → 拿到文档 → 浏览器解析”的顺序拆解客户端-服务器模型，并把 Web 标准三剑客之间的协作关系说清楚。',
      guide:
        '配合示意图与时间线，鼓励学员一边讲 DNS/TCP/TLS/HTTP，一边填写空白表格，再让三剑客同屏出现，完成从“网络旅程”到“技术角色”的过渡。',
      transition: '当文档抵达浏览器后，让大家继续追问“这些字节如何变成像素”，顺势进入渲染机制章节。',
      knowledgePoints: [
        {
          id: 'upper-ch1-kp1',
          title: 'URL 到像素的请求旅程',
          duration: 11,
          problem: '很多初学者只知 `fetch` 能拿数据，却讲不出背后经历的 DNS、TCP、TLS、HTTP 等步骤。',
          guide:
            '让学员拖动时间轴的同时复述“此阶段在做什么、失败会看到什么现象”，逐步连接白屏、慢首屏等日常问题。',
          explanation:
            '导航阶段要完成域名解析与握手，之后浏览器把 HTML 串流给渲染进程，等待 DOM/CSSOM 准备完毕。了解每个阶段的职责，才能定位白屏或慢首屏。',
          demo: {
            type: 'stageTimeline',
            title: '请求阶段时间轴',
            description: '拖动滑块回放 DNS、TCP/TLS、请求、解析、绘制与合成阶段，观察耗时提示。',
            code: `fetch('https://example.com/courseware')
  .then(response => response.text())
  .then(html => {
    document.body.innerHTML = html
  })`,
            stages: [
              { label: 'DNS', detail: '递归解析域名，获取目标 IP', duration: '20~50ms' },
              { label: 'TCP/TLS', detail: '三次握手 + TLS 协商，建立安全信道', duration: '100~200ms' },
              { label: 'HTTP', detail: '请求 HTML，服务器生成响应', duration: '可缓存' },
              { label: '解析', detail: '主线程构建 DOM/CSSOM，JS 可能阻塞', duration: '10~30ms' },
              { label: '渲染', detail: '构建渲染树、布局、绘制并提交帧', duration: '16ms 预算' },
            ],
          },
          nextStep: '思考在 HTML 之后还有多少关键资源会排队进入渲染路径。',
        },
        {
          id: 'upper-ch1-kp2',
          title: '结构·表现·行为协同',
          duration: 11,
          problem: '页面都能跑，但同学们常把内容、样式、交互揉在一起，后期很难维护。',
          guide:
            '把内容拆成“语义/视觉/交互”三列，请学员把业务模块贴到对应列，再讨论混用会导致的可维护性和可访问性问题。',
          explanation:
            'HTML 描述语义结构，CSS 决定视觉表现，JavaScript 处理交互逻辑。三者分离能提升复用、可维护性，也利于可访问性。',
          demo: {
            type: 'stateVisualizer',
            title: '三剑客责任流',
            description: '切换流向，观察结构、样式与行为如何互相约束。',
            code: `<!DOCTYPE html>
<main>
  <article class="card">
    <h2>HTML 语义</h2>
    <p>CSS 负责呈现，JS 负责交互。</p>
  </article>
</main>
<style>
.card { border-left: 4px solid #2f4bff; padding: 1rem; }
</style>
<script>
document.querySelector('.card').addEventListener('click', () => {
  alert('结构、表现、行为协作!')
})
</script>`,
            flows: [
              { label: '结构定义', description: 'HTML 决定信息层级、可访问顺序', direction: 'one-way' },
              { label: '表现控制', description: 'CSS 读取结构并映射为视觉', direction: 'two-way' },
              { label: '行为绑定', description: 'JS 监听 DOM 事件并更新状态', direction: 'event' },
            ],
          },
          nextStep: '带着“哪些文件会阻塞渲染”的疑问进入浏览器渲染原理。',
        },
      ],
      checkpoint: '能画出 URL → 像素流程，并说明标签、样式、脚本各自负责什么。',
    },
    {
      id: 'upper-ch2',
      title: '浏览器渲染原理',
      duration: 23,
      focus: '掌握关键渲染路径，认识阻塞点与优化手段',
      intro: '在获取 HTML、CSS、JS 之后，必须交代浏览器怎样把这些文本逐步解析成最终帧，才能把性能问题与概念一一对应。',
      narrative:
        '把“HTML/CSS/JS 如何变成图像”讲细，特别强调关键资源、并行下载限制以及布局/绘制的触发条件。',
      guide:
        '按“请求 → 解析 → 图层”的节奏，用 DevTools Performance/Network 面板实拍阻塞点，再对照 demo 动手规划资源，形成“观察 → 推理 → 优化”的闭环。',
      transition: '渲染机制讲透后，把话题切回 HTML 语义，说明结构良好的文档如何让渲染更可靠。',
      knowledgePoints: [
        {
          id: 'upper-ch2-kp1',
          title: '关键渲染路径 (CRP)',
          duration: 12,
          problem: '不知道哪些资源是关键资源，容易在首屏加载不必要的脚本或字体。',
          guide:
            '和学员一起设置带宽、延迟、并发数，观察关键资源瀑布图的颜色变化，再讨论 preload/async/defer 在何处切断长链。',
          explanation:
            'CRP 由 HTML、CSS、首屏 JS 等关键资源组成，下载顺序、带宽与并发数决定 FCP。通过拆分资源、preload/async 等手段可以缩短阻塞链。',
          demo: {
            type: 'networkPlanner',
            title: '关键资源规划器',
            description: '调整带宽/并发，查看关键 & 延迟资源的体积与耗时。',
            code: `<link rel="preload" href="/styles/above-fold.css" as="style">
<link rel="stylesheet" href="/styles/above-fold.css">
<script src="/scripts/app.js" defer></script>`,
            assets: [
              { name: 'HTML', size: 30, priority: 'critical' },
              { name: '主样式', size: 26, priority: 'critical' },
              { name: '变量字体', size: 80, priority: 'critical' },
              { name: '入口 JS', size: 120, priority: 'critical' },
              { name: '图像集', size: 200, priority: 'deferred' },
              { name: '仪表盘模块', size: 180, priority: 'deferred' },
            ],
          },
          nextStep: '记录哪些资源可以延迟、拆分或懒加载，为下一步的 HTML/CSS 优化找到依据。',
        },
        {
          id: 'upper-ch2-kp2',
          title: '布局、重排与重绘',
          duration: 11,
          problem: '经常在循环里频繁改样式，不清楚什么操作会触发 layout 或 paint。',
          guide:
            '要求学员先预测“这段代码会触发 layout 还是 paint”，再让 demo 给出计算结果，提醒他们善用 requestAnimationFrame 批量写入。',
          explanation:
            'DOM 几何信息发生变化会触发重排 (layout)，像颜色、阴影等视觉变化会触发重绘 (paint)。避免读写交错、批量修改样式能显著降低成本。',
          demo: {
            type: 'reflowEstimator',
            title: '重排成本估算器',
            description: '根据节点数量和变更类型评估潜在耗时。',
            code: `const list = document.querySelector('.list')
requestAnimationFrame(() => {
  list.classList.add('is-collapsed') // 先写，避免读写交错
})`,
            baseCost: 1,
            multipliers: { layout: 1.2, paint: 0.7, composite: 0.4 },
          },
          nextStep: '把“减少 layout”记在板书上，提示同学马上就要通过语义化结构来进一步降低风险。',
        },
      ],
      checkpoint: '能指出样式修改是否会阻塞渲染并提出缓解策略。',
    },
    {
      id: 'upper-ch3',
      title: 'HTML 核心与语义化',
      duration: 22,
      focus: '理解语义标签、嵌套规则以及表单 API 的工作方式',
      intro: '回到文档本身，从 HTML 演进历史谈到语义结构与可访问性的互相成就，再把现代 API 当成“结构可以直接驱动的能力”。',
      narrative:
        '讲清语义化的意义、标签如何帮助屏幕阅读器与搜索引擎，再结合 HTML5 表单 API 演示约束验证。',
      guide:
        '在语义示例和阅读器朗读之间来回切换，再用表单约束验证 API 让学员亲手体验“结构就能提供反馈”。',
      transition: '结构稳固后，自然需要 CSS 去塑造视觉和布局，因此下一章把目光放到盒模型与现代布局。',
      knowledgePoints: [
        {
          id: 'upper-ch3-kp1',
          title: '语义标签选择',
          duration: 11,
          problem: '常把所有内容都包在 div 里，忽略 `<header>`、`<main>` 等语义，使可访问性评分偏低。',
          guide:
            '提供一段没有语义的 DOM，让学员在 demo 中切换不同标签并观察屏幕阅读器提示，讨论 SEO 与可访问性的共同收益。',
          explanation:
            '选择语义标签可以让阅读器推断区域角色，也能提升 SEO。理解“页面结构 → 区域 → 文章/段落”层级，才能写出真正结构化的文档。',
          demo: {
            type: 'semanticLab',
            title: '语义片段示例',
            description: '切换不同标签片段，查看结构与描述。',
            code: `<header>
  <h1>核心概念导学</h1>
  <nav aria-label="页面导航">
    <a href="#outline">课程大纲</a>
    <a href="#labs">交互实验</a>
  </nav>
</header>`,
            samples: [
              {
                label: '页眉 + 导航',
                markup: `<header>
  <h1>核心概念导学</h1>
  <nav>
    <a href="#outline">大纲</a>
    <a href="#labs">实验</a>
  </nav>
</header>`,
                description: 'header + nav 表示页面级别的介绍与主要导航。',
              },
              {
                label: '主内容',
                markup: `<main>
  <article>
    <h2>HTML 语义</h2>
    <p>使用 section/article 划分主题。</p>
  </article>
</main>`,
                description: 'main 是页面的主区域，article 表示独立内容单元。',
              },
              {
                label: '补充说明',
                markup: `<aside>
  <h3>提示</h3>
  <p>aside 用于与主体相关但可独立的内容。</p>
</aside>`,
                description: 'aside 适合放提示、相关链接等侧边信息。',
              },
            ],
          },
          nextStep: '把同样的语义思路迁移到表单与交互组件，保证结构与行为对齐。',
        },
        {
          id: 'upper-ch3-kp2',
          title: '表单与约束验证 API',
          duration: 11,
          problem: '不知道 HTML5 自带的约束验证，所有校验都交给 JS，导致体验不一致。',
          guide:
            '让学员先在 demo 中填写“刻意错误”的数据，再观察浏览器反馈，同时展示 `reportValidity()` 的代码用法。',
          explanation:
            '浏览器原生支持 required、pattern 等约束，还提供 `checkValidity()` 与 `reportValidity()`。在语义正确的 `<form>` 基础上使用这些 API，能快速构建可靠的输入体验。',
          demo: {
            type: 'formValidator',
            title: 'HTML 约束验证操练',
            description: '输入不同字段，点击按钮查看浏览器返回的校验状态。',
            code: `const form = document.querySelector('form')
form.addEventListener('submit', (event) => {
  if (!form.reportValidity()) event.preventDefault()
})`,
            fields: [
              { label: '姓名', type: 'text', placeholder: '至少 2 个字符', required: true, pattern: '.{2,}', hint: 'pattern=".{2,}"' },
              { label: '邮箱', type: 'email', placeholder: 'name@example.com', required: true },
              { label: '年龄', type: 'number', placeholder: '18~60', required: true, pattern: '^(1[89]|[2-5][0-9]|60)$', hint: '仅允许 18-60 岁' },
            ],
          },
          nextStep: '总结“语义标签 + 浏览器 API = 更可靠的骨架”，为 CSS 布局承载这些结构做好准备。',
        },
      ],
      checkpoint: '能按语义拆分页面并用原生验证 API 做基本校验。',
    },
    {
      id: 'upper-ch4',
      title: 'CSS 核心机制',
      duration: 23,
      focus: '掌握盒模型、层叠与现代布局系统',
      intro: '在坚固的 HTML 骨架之上，进一步拆开 CSS 的决策逻辑：先搞清层叠与继承，再通过盒模型和布局系统把视觉落到坐标上。',
      narrative:
        '围绕盒模型、BFC 和 Flex 展开，分别解释尺寸计算、margin 折叠、弹性布局的决策流程，让同学能一步步定位排版问题。',
      guide:
        '通过“先猜再证”的方式：先请学员预测哪条规则会生效，再在盒模型与 Flex 沙盒里动手调参，并用 DevTools 佐证推理。',
      transition: '提示同学记录“当样式稳定后，JS 如何接管交互”这一问题，为下篇课程的 JS 执行模型铺垫。',
      knowledgePoints: [
        {
          id: 'upper-ch4-kp1',
          title: '盒模型与 BFC',
          duration: 12,
          problem: '设置 `width: 200px` 后内容却超出，不明白是哪个盒模型在生效。',
          guide:
            '先用白板画出 content-box 与 border-box 的计算，再在 demo 中切换不同 preset，观察 margin 折叠和 BFC 的隔离效果。',
          explanation:
            '标准盒模型仅计算内容区，border-box 会把 padding/border 包进去。触发 BFC（`overflow: hidden`、`display: flow-root` 等）能阻止 margin 折叠和浮动影响。',
          demo: {
            type: 'boxModelLab',
            title: '盒模型操练场',
            description: '调节 margin/padding/border，观察最终尺寸与 BFC 的隔离效果。',
            code: `.card {
  box-sizing: border-box;
  padding: 24px;
  border: 2px solid #2f4bff;
  overflow: hidden; /* 创建 BFC */
}`,
            presets: [
              { label: 'content-box', padding: 16, border: 2, margin: 12 },
              { label: 'border-box', padding: 20, border: 8, margin: 0 },
              { label: '流式卡片', padding: 24, border: 1, margin: 16 },
            ],
          },
          nextStep: '把“盒模型推理 → DevTools 验证”记下来，准备进入更宏观的布局系统。',
        },
        {
          id: 'upper-ch4-kp2',
          title: '现代布局系统',
          duration: 11,
          problem: '记不住 `justify-content`、`align-items` 的区别，响应式布局全靠试。',
          guide:
            '让学员写下“主轴/交叉轴”猜想，再用 demo 调整方向、对齐、gap，对照不同屏幕宽度下的重排。',
          explanation:
            'Flex 把排版拆成主轴与交叉轴，配合 gap、flex-grow、media query 可以快速覆盖桌面与移动端。掌握对齐含义后即可有依据地设定排布逻辑。',
          demo: {
            type: 'flexPlayground',
            title: 'Flex 布局沙盒',
            description: '交互式切换主轴、对齐方式与间距，观察元素如何重新排列。',
            code: `.features {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: space-between;
}
.features > li {
  flex: 1 1 240px;
}`,
            directions: ['row', 'column'],
            alignments: ['flex-start', 'center', 'flex-end', 'stretch'],
            justifications: ['flex-start', 'center', 'flex-end', 'space-between', 'space-around'],
          },
          nextStep: '带着“如何让 JS 接手交互”的思考结束上篇课程，并将问题带入下篇。',
        },
      ],
      checkpoint: '能用 DevTools 解释盒模型计算过程，并写出满足响应式的 Flex 布局代码。',
    },
  ],
}
