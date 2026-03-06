import { CourseSession } from '../types'

export const sessionLower: CourseSession = {
  id: 'session-lower',
  title: '前端核心概念与原理解析 · 下篇',
  duration: 90,
  sessionLabel: '第 2 讲 · 90min',
  theme: 'JavaScript 核心原理 + 课程总结与练习计划',
  summary:
    '下篇承接修订意见的第 5、6 章，聚焦 JavaScript 执行机制、闭包、原型链与事件循环，并以总结模块帮助学员构建知识图谱与实践闭环。',
  takeaways: [
    '能画出执行上下文和作用域链的形成过程',
    '用代码演示闭包、原型链以及 this 绑定差异',
    '读懂事件循环中的宏任务/微任务队列，避免异步陷阱',
    '整理个人知识图谱并制定滚动练习计划',
  ],
  prerequisites: ['完成上篇学习或熟悉 HTML/CSS 基础', '具备 ES6 语法的初步经验'],
  toolkit: ['Chrome DevTools Sources 面板', 'Node.js REPL 或浏览器控制台', '个人学习日志模板'],
  chapters: [
    {
      id: 'lower-ch1',
      title: '执行上下文与作用域链',
      duration: 18,
      focus: '用“创建 → 执行”视角看执行上下文，并当场追踪作用域链与 TDZ',
      intro:
        '先复盘上篇留下的疑问，将讨论聚焦在“执行上下文如何生成、变量究竟在哪里查找”这两个支点，帮助学员建立 JS 运行时的第一层心智模型。',
      narrative:
        '围绕修订意见第 5 章开头，用调用栈与词法环境的故事线讲解全局、函数、块级上下文的创建/执行阶段，并引入 let/const 的暂时性死区。',
      guide:
        '结合代码与时间轴 demo，要求学员亲自标注“现在栈顶是谁”“能读到哪些变量”，再用 TDZ 例子强化“先声明、后使用”的纪律。',
      transition: '抛出“函数返回后变量还能否访问”的问题，引出闭包与对象系统的讨论。',
      knowledgePoints: [
        {
          id: 'lower-ch1-kp1',
          title: '执行上下文堆栈',
          duration: 10,
          problem: '对“栈帧”“执行顺序”印象模糊，只会背概念，调试时不知道哪个上下文在运行。',
          guide:
            '请学员在时间轴 demo 中拖动阶段滑块，讲述“此刻创建了哪个上下文、里面登记了什么变量”，并推断抛错会停在第几帧。',
          explanation:
            '每次调用函数都会创建执行上下文：包含变量环境、词法环境与 this 绑定。上下文按照调用顺序入栈，作用域链通过外层引用串起来，最终回溯到全局对象。',
          demo: {
            type: 'stageTimeline',
            title: '执行上下文栈',
            description: '逐步查看全局、函数、块级上下文入栈/出栈的顺序。',
            code: `function outer() {
  const topic = 'scope'
  function inner() {
    console.log(topic)
  }
    inner()
}
outer()`,
            stages: [
              { label: '全局', detail: '创建全局对象 & 全局上下文', duration: '1' },
              { label: 'outer()', detail: '建立函数上下文，记录 AO/词法环境', duration: '2' },
              { label: 'inner()', detail: '创建新的函数上下文，scope chain 指向 outer', duration: '3' },
              { label: '回收', detail: 'inner 出栈，outer 出栈，回到全局', duration: '4' },
            ],
          },
          nextStep: '记录“上下文销毁后变量为何仍可访问”这一疑问，准备在闭包部分解答。',
        },
        {
          id: 'lower-ch1-kp2',
          title: '作用域链与 TDZ',
          duration: 8,
          problem: '分不清块级/函数作用域，常把 let/const 和 var 混用，导致 ReferenceError 或变量污染。',
          guide:
            '让学员先手写变量可见性判断，再通过 demo 查看词法作用域串联方式，并演示临时性死区的报错栈。',
          explanation:
            '作用域链由词法嵌套关系决定：当前环境查不到变量时沿着外层逐级查找。let/const 在声明前不可访问（TDZ），因此能避免变量被提前读写。理解链条才能预测变量解析顺序。',
          demo: {
            type: 'stateVisualizer',
            title: '作用域链追踪器',
            description: '查看全局、函数、块级作用域如何串起变量，并观察 TDZ 报错位置。',
            code: `const track = 'global'
function launch(topic) {
  const speaker = 'mentor'
  if (topic) {
    let highlight = topic.toUpperCase()
    console.log(track, speaker, highlight)
  }
}
launch('scope')
try {
  console.log(highlight)
} catch (error) {
  console.warn('TDZ', error.message)
}`,
            flows: [
              { label: '全局作用域', description: 'track 常驻并可被任何子级读取', direction: 'one-way' },
              { label: '函数作用域', description: 'speaker 只在 launch 内有效', direction: 'two-way' },
              { label: '块级 + TDZ', description: 'highlight 初始化前访问会触发 ReferenceError', direction: 'event' },
            ],
          },
          nextStep: '思考：如果内部函数引用 highlight，会发生什么？引出闭包概念。',
        },
      ],
      checkpoint: '能借助调用栈追踪任意函数的创建/执行阶段，并解释变量为何在某些作用域可见或报 TDZ。',
    },
    {
      id: 'lower-ch2',
      title: '闭包、原型链与 this 绑定',
      duration: 27,
      focus: '把词法作用域延伸到对象系统，厘清共享状态与查找规则',
      intro:
        '在理解作用域链之后，讨论闭包如何延长变量生命周期，再把视角切换到对象原型与 this 绑定的差异，让“谁来提供数据”与“谁来执行方法”一一对应。',
      narrative:
        '按照“闭包保持状态 → 原型链负责查找 → this 决定调用主体”的顺序展开，把修订意见第 5 章的核心概念串成连续故事。',
      guide:
        '每个概念都遵循“先预测 → 看 demo → 回头验证代码”的节奏，帮助学员说出状态为何被保留、方法为何能被继承。',
      transition: '同步语义梳理完毕后，继续把问题抛给异步调度与网络边界。',
      knowledgePoints: [
        {
          id: 'lower-ch2-kp1',
          title: '闭包与词法作用域',
          duration: 9,
          problem: '对闭包的理解停留在“函数里返回函数”，忽略变量被捕获后的内存影响。',
          guide:
            '让学员预测 counter 每次的输出，再观察 demo 中词法环境是如何被引用并在内存中保留下来，同时讨论释放方式。',
          explanation:
            '闭包本质是函数携带了创建时的词法作用域，外部执行上下文被销毁后，内部函数仍可访问被捕获的变量。合理使用能实现私有状态，滥用会造成泄漏。',
          demo: {
            type: 'stateVisualizer',
            title: '闭包词法链',
            description: '观察 state 如何沿着词法链被捕获并返回。',
            code: `function createCounter() {
  let count = 0
  return () => ++count
}
const inc = createCounter()
inc() // 1
inc() // 2`,
            flows: [
              { label: '定义阶段', description: '词法环境记录 count 变量', direction: 'one-way' },
              { label: '调用阶段', description: '返回的函数复用原来的词法环境', direction: 'event' },
              { label: '结果', description: 'count 得以在多次调用间持久化', direction: 'one-way' },
            ],
          },
          nextStep: '总结“函数 + 词法环境 = 闭包”，继续追问对象方法是如何被复用的。',
        },
        {
          id: 'lower-ch2-kp2',
          title: '原型链与继承',
          duration: 9,
          problem: '分不清 `__proto__` 与 `prototype`，遇到继承/扩展需求就复制粘贴代码。',
          guide:
            '让学员在 demo 中输入属性名，观察在哪一层原型被命中，再把链路画到白板上解释 why。',
          explanation:
            '对象通过 `[[Prototype]]` 指向另一个对象，形成功能查找链；函数的 `prototype` 决定基于 new 创建的实例指向哪里。掌握链路才能优雅地扩展行为。',
          demo: {
            type: 'prototypeExplorer',
            title: '原型链查找器',
            description: '输入属性名，沿链路查看在哪个原型上命中。',
            code: `function Speaker() {}
Speaker.prototype.say = function () {
  return this.prefix + ' ' + this.word
}
const learner = Object.create(Speaker.prototype)
learner.prefix = 'Hello'
learner.word = 'JS'`,
            chain: [
              { name: 'learner', properties: ['prefix', 'word'] },
              { name: 'Speaker.prototype', properties: ['say'] },
              { name: 'Object.prototype', properties: ['toString', 'hasOwnProperty'] },
            ],
          },
          nextStep: '接着思考：同一段方法被不同对象调用时，this 到底指向谁？',
        },
        {
          id: 'lower-ch2-kp3',
          title: 'this 绑定策略',
          duration: 9,
          problem: '默认、隐式、显式与 new 绑定混为一谈，常在事件或 setTimeout 中丢失 this。',
          guide:
            '通过 demo 切换不同调用模式，先猜测输出，再运行代码验证，并总结箭头函数的词法 this 特性。',
          explanation:
            '调用形式决定 this：直接调用走默认绑定，obj.fn() 走隐式绑定，call/apply/bind 属于显式绑定，new 会创建全新对象。箭头函数则继承定义时的 this。',
          demo: {
            type: 'eventFlowLab',
            title: 'this 绑定实验台',
            description: '切换绑定模式，观察 this 指向如何变化。',
            code: `const user = {
  name: 'Ada',
  say(prefix = 'Hi') {
    return \`\${prefix} \${this.name}\`
  },
}
const say = user.say
const bound = user.say.bind({ name: 'JS' })
console.log(say())
console.log(user.say('Hello'))
console.log(bound())`,
            modes: [
              { label: '默认绑定', description: 'say() -> this 指向 globalThis', stopAt: 'outer' },
              { label: '隐式绑定', description: 'user.say() -> this 指向 user', stopAt: 'middle' },
              { label: '显式绑定', description: 'say.call(ctx) -> this 被强制指向 ctx', captureOnly: true },
              { label: 'new 绑定', description: 'new Foo() -> this 指向新实例' },
              { label: '箭头函数', description: 'this 取决于定义时的词法作用域' },
            ],
          },
          nextStep: '把 this 绑定总结为“场景 + 规则”，然后带入事件循环去分析异步回调里的 this。',
        },
      ],
      checkpoint: '能用闭包解释状态持久化，画出原型链查找路径，并选对 this 绑定方式。',
    },
    {
      id: 'lower-ch3',
      title: '事件循环、Promise 与网络能力',
      duration: 25,
      focus: '掌握异步调度顺序并理解现代浏览器 API 与安全边界',
      intro:
        '把同步语义扩展到异步世界：先看事件循环如何安排宏/微任务，再拆解 Promise/async 的语法糖，最后说明网络安全策略为何决定接口写法。',
      narrative:
        '参照修订意见第 5 章和第 6 章开头，从一帧的生命周期讲到 async/await 的调度，再衔接同源策略、CORS 与 Fetch/WebSocket 的适用场景。',
      guide:
        '坚持“把代码投到队列里再看动画”的做法，让学员亲眼看到谁会阻塞帧、谁会被延后，并把问题引向跨域请求。',
      transition: '异步与网络策略梳理完成后，最后进入知识图谱与练习闭环的总结环节。',
      knowledgePoints: [
        {
          id: 'lower-ch3-kp1',
          title: '事件循环模型',
          duration: 9,
          problem: 'Promise、setTimeout、requestAnimationFrame 的执行顺序总是记不牢，动画和请求容易互相阻塞。',
          guide:
            '让学员把宏/微任务拖入队列，先写下自己预测的日志顺序，再运行 simulator 验证并对照调用栈截图。',
          explanation:
            '调用栈清空后会先处理所有微任务队列 (Promise.then、MutationObserver)，再取下一个宏任务 (setTimeout、message、渲染)。了解调度顺序就能合理安排动画与 IO。',
          demo: {
            type: 'eventLoopSimulator',
            title: '事件循环模拟器',
            description: '把宏/微任务放入队列并执行一帧，实时查看日志。',
            code: `setTimeout(() => console.log('timeout'))
Promise.resolve().then(() => console.log('microtask'))
requestAnimationFrame(() => console.log('raf'))`,
            presets: [
              { label: 'setTimeout', type: 'macro' },
              { label: 'requestAnimationFrame', type: 'macro' },
              { label: 'Promise.then', type: 'micro' },
              { label: 'MutationObserver', type: 'micro' },
            ],
          },
          nextStep: '继续追问 async/await 背后如何依赖微任务队列。',
        },
        {
          id: 'lower-ch3-kp2',
          title: 'Promise 与 async/await',
          duration: 8,
          problem: '知道 async/await 更好写，但不了解它只是 Promise 的语法糖，遇到异常链路就懵。',
          guide:
            '拆开 async 函数、await、微任务执行的三个阶段，提示学员在时间轴上标注“这里仍在主线程，同步代码尚未结束”。',
          explanation:
            'async 函数会返回 Promise，遇到 await 时会暂存栈帧并把后续逻辑放入微任务，Promise resolved/rejected 后再恢复执行。理解机制才能正确处理错误与并发。',
          demo: {
            type: 'stageTimeline',
            title: 'async/await 调度图',
            description: '观察同步阶段、await 挂起、微任务恢复的节奏。',
            code: `async function loadCourse() {
  console.log('sync start')
  const data = await fetch('/api/course').then(r => r.json())
  console.log('after await', data.title)
}
loadCourse()
console.log('call stack end')`,
            stages: [
              { label: '同步执行', detail: '进入 async 函数，执行 await 之前的逻辑', duration: '主线程' },
              { label: 'await 挂起', detail: 'fetch Promise pending，函数返回 Promise', duration: 'pending' },
              { label: '微任务恢复', detail: 'Promise fulfilled，then/await 继续执行', duration: 'microtask' },
              { label: '继续执行', detail: 'await 后的语句重新进入调用栈', duration: 'resolved' },
            ],
          },
          nextStep: '把视角转向真实网络请求，理解安全策略如何影响这些异步流程。',
        },
        {
          id: 'lower-ch3-kp3',
          title: '网络安全与现代 API',
          duration: 8,
          problem: '不知道同源策略、CORS、预检请求的存在，跨域埋点或后端接口经常“莫名失败”。',
          guide:
            '使用时间线回放 CORS 流程：先让学员预测 OPTIONS 请求何时出现，再展示 Fetch 与 WebSocket 在不同场景下的限制。',
          explanation:
            '浏览器默认实施同源策略，跨站请求需通过 CORS 头、预检流程或使用 WebSocket/SSE 等协议。理解这些边界，才能设计可靠的接口与安全策略。',
          demo: {
            type: 'stageTimeline',
            title: 'CORS 交互流程',
            description: '回放浏览器发起预检、验证响应头、再发送实际请求的步骤。',
            code: `fetch('https://api.example.com/data', {
  method: 'POST',
  mode: 'cors',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ lesson: 'async' }),
})`,
            stages: [
              { label: '请求准备', detail: 'Fetch 构建报文，判断是否需要预检', duration: 'main' },
              { label: '预检 OPTIONS', detail: '浏览器发送 OPTIONS，校验 CORS 头', duration: 'network' },
              { label: '实际请求', detail: '通过校验后发送真正的 POST', duration: 'network' },
              { label: '响应验证', detail: '检查 Access-Control-Allow-* 并交给 JS', duration: 'response' },
            ],
          },
          nextStep: '将这些约束写进实践计划：遇到跨域、埋点需求时先查策略，再写代码。',
        },
      ],
      checkpoint: '能说明宏/微任务顺序，解释 async/await 的本质，并在跨域场景下给出正确的接口方案。',
    },
    {
      id: 'lower-ch4',
      title: '知识图谱与学习闭环',
      duration: 20,
      focus: '把两讲内容放回个人实践路径，构建可持续的练习-观测机制',
      intro:
        '以修订意见第 6 章为蓝本，把 HTML/CSS/JS 的核心概念映射到同一张图上，再设计“学习 → 实践 → 观测 → 调整”的循环。',
      narrative:
        '通过自评仪表和练习频率规划，让学员明确下一步要练什么、如何观测成效，并把课堂问题迁移到真实项目。',
      guide:
        '鼓励学员现场填写仪表盘与计划表，讲师示范如何把困惑转成实验，再以日志跟踪进展。',
      transition: '以“把问题带回真实项目”作为结语，并邀请学员在社群持续分享练习成果。',
      knowledgePoints: [
        {
          id: 'lower-ch4-kp1',
          title: '知识图谱复盘',
          duration: 10,
          problem: '学完就忘，缺乏对 HTML/CSS/JS 各子模块的整体认知，无法说清哪些薄弱。',
          guide:
            '示范如何把概念放进“概念 → 原理 → 示例”三列，让学员把个人薄弱模块标成黄色或红色，方便后续复盘。',
          explanation:
            '把每个模块拆成“概念 → 原理 → 实践示例”，并定期自评掌握度，可以更快发现空白区。图谱不是死记，而是方便定位的导航。',
          demo: {
            type: 'metricMonitor',
            title: '自评知识仪表',
            description: '拖动滑块，记录自己对 HTML/CSS/JS 模块的熟练度。',
            code: `const knowledgeMap = {
  html: ['语义结构', '表单 API'],
  css: ['盒模型', '布局系统'],
  js: ['作用域链', '原型链', '事件循环'],
}
console.table(knowledgeMap)`,
            metrics: [
              { key: 'html', label: 'HTML 语义', unit: '%', max: 100, good: 80, warning: 60, defaultValue: 70 },
              { key: 'css', label: 'CSS 机制', unit: '%', max: 100, good: 80, warning: 60, defaultValue: 65 },
              { key: 'js', label: 'JS 原理', unit: '%', max: 100, good: 80, warning: 60, defaultValue: 60 },
            ],
          },
          nextStep: '将低分模块拆成任务列表，进入下一张练习计划表。',
        },
        {
          id: 'lower-ch4-kp2',
          title: '实践与观测计划',
          duration: 10,
          problem: '不知道应该多频率复习或上线实验，容易虎头蛇尾。',
          guide:
            '把练习当作“数据采样”：设定频率、触发条件与回顾节奏，并让学员写下真实案例，如“每周两次重现事件循环 demo”。',
          explanation:
            '把练习当成“事件”去观测：设定采样率（每周练习次数）、分级告警（长时间不练自动提醒），就能形成正向闭环。',
          demo: {
            type: 'telemetryPanel',
            title: '练习频率规划',
            description: '调整采样率（练习频次），估算每周要完成的题目/实验数量。',
            code: `const plan = rate => ({
  weeklyPractice: Math.round(rate / 10) * 2,
  retro: rate >= 50 ? '每周复盘' : '每两周复盘'
})
console.log(plan(30))`,
            defaultRate: 30,
          },
          nextStep: '将计划同步到学习日志或团队例会上，形成监督机制。',
        },
      ],
      checkpoint: '输出一张包含 HTML/CSS/JS 的知识图谱，并写下未来 4 周的练习/复盘计划。',
    },
  ],
}
