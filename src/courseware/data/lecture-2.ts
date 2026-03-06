/**
 * 第二讲：JavaScript执行机制与知识图谱
 * 按照讲稿流式结构组织内容
 */

import { Lecture } from '../lecture-types'

export const lecture2: Lecture = {
  id: 'lecture-2',
  title: 'JavaScript执行机制与知识图谱',
  subtitle: '第二讲 · 90分钟',
  totalDuration: 90,
  sections: [
    // ========== 一、执行上下文 ==========
    {
      id: 'sec-1-context',
      title: '执行上下文',
      duration: 18,
      blocks: [
        {
          type: 'narrative',
          content: 'JavaScript是一门单线程语言。但它有一个非常复杂的执行机制。',
          emphasis: 'highlight',
        },

        // 执行上下文
        {
          type: 'narrative',
          content: '每段JS代码运行时，都会创建执行上下文。',
        },
        {
          type: 'bullets',
          title: '类型有三种:',
          items: ['Global（全局上下文）', 'Function（函数上下文）', 'Eval（eval上下文）'],
        },

        {
          type: 'narrative',
          content: '执行上下文包含三个部分：',
        },
        {
          type: 'bullets',
          title: '执行上下文组成:',
          items: ['变量环境（Variable Environment）', '词法环境（Lexical Environment）', 'this 绑定'],
        },

        // 变量提升
        {
          type: 'narrative',
          content: '变量提升是怎么回事？',
          emphasis: 'question',
        },
        {
          type: 'code',
          language: 'javascript',
          code: `console.log(a)  // undefined
var a = 1`,
          caption: 'var 的变量提升',
        },
        {
          type: 'narrative',
          content: '输出 undefined。原因是创建阶段会先声明 var a，但不赋值。',
        },

        // TDZ
        {
          type: 'narrative',
          content: 'let / const 不会提升（准确说是提升但不初始化）。',
          emphasis: 'highlight',
        },
        {
          type: 'code',
          language: 'javascript',
          code: `console.log(a)  // ReferenceError!
let a = 1`,
          caption: 'TDZ 暂时性死区',
        },
        {
          type: 'narrative',
          content: '会报错。这叫暂时性死区（Temporal Dead Zone）。',
        },
        {
          type: 'transition',
          text: '理解了执行上下文，我们来看一个更复杂的概念：闭包。',
        },
      ],
    },

    // ========== 二、闭包与原型 ==========
    {
      id: 'sec-2-closure-prototype',
      title: '闭包与原型',
      duration: 27,
      blocks: [
        // 闭包
        {
          type: 'narrative',
          content: '闭包的定义：函数 + 词法环境。',
          emphasis: 'highlight',
        },
        {
          type: 'code',
          language: 'javascript',
          code: `function createCounter() {
  let count = 0       // 被闭包捕获
  return function() {
    count++
    return count
  }
}

const counter = createCounter()
counter()  // 1
counter()  // 2`,
          caption: '闭包示例',
        },
        {
          type: 'narrative',
          content: '内部函数记住了 count。即使 createCounter 执行完毕，count 仍然存在。',
        },
        {
          type: 'demo',
          demoType: 'closureMemory',
          config: { type: 'closureMemory' },
        },
        {
          type: 'bullets',
          title: '闭包常见用途:',
          items: ['函数工厂', '私有变量', '函数式编程（柯里化等）'],
        },

        // 原型链
        {
          type: 'narrative',
          content: 'JS使用原型继承。每个对象都有 [[Prototype]]。',
          emphasis: 'highlight',
        },
        {
          type: 'code',
          language: 'javascript',
          code: `function Person(name) {
  this.name = name
}
Person.prototype.greet = function() {
  return 'Hello ' + this.name
}

const p = new Person('Ada')
p.greet()  // "Hello Ada"`,
          caption: '原型链示例',
        },
        {
          type: 'narrative',
          content: '查找属性的过程：',
        },
        {
          type: 'flow',
          steps: ['obj 自身', 'obj.__proto__', 'Object.prototype', 'null'],
          direction: 'vertical',
        },
        {
          type: 'demo',
          demoType: 'prototypeChain',
          config: { type: 'prototypeChain' },
        },

        {
          type: 'narrative',
          content: 'ES6 class 只是语法糖，底层仍然是 prototype。',
          emphasis: 'highlight',
        },

        // this 绑定
        {
          type: 'narrative',
          content: 'JS的this由调用方式决定。',
          emphasis: 'question',
        },
        {
          type: 'bullets',
          title: '四条规则:',
          items: [
            '默认绑定 → window（严格模式 undefined）',
            '隐式绑定 → obj.fn() 中的 obj',
            '显式绑定 → call/apply/bind 指定',
            'new 绑定 → 新创建的实例',
          ],
        },
        {
          type: 'demo',
          demoType: 'thisBinding',
          config: { type: 'thisBinding' },
        },
        {
          type: 'narrative',
          content: '箭头函数没有自己的this，继承外层this。',
          emphasis: 'highlight',
        },
        {
          type: 'transition',
          text: '理解了同步执行，接下来我们看JS如何处理异步：事件循环。',
        },
      ],
    },

    // ========== 三、事件循环 ==========
    {
      id: 'sec-3-eventloop',
      title: '事件循环',
      duration: 20,
      blocks: [
        {
          type: 'narrative',
          content: 'JS单线程如何处理异步？答案是：事件循环（Event Loop）。',
          emphasis: 'question',
        },

        // 调用栈
        {
          type: 'narrative',
          content: '所有函数调用都会进入调用栈（Call Stack）。',
        },

        // 任务队列
        {
          type: 'narrative',
          content: '任务队列分两类：',
        },
        {
          type: 'bullets',
          title: '宏任务 Macrotask:',
          items: ['setTimeout', 'setInterval', 'I/O', 'UI渲染'],
        },
        {
          type: 'bullets',
          title: '微任务 Microtask:',
          items: ['Promise.then', 'MutationObserver', 'queueMicrotask'],
        },

        // 执行顺序
        {
          type: 'narrative',
          content: '执行顺序：',
          emphasis: 'highlight',
        },
        {
          type: 'flow',
          steps: ['同步代码', '清空微任务队列', '取一个宏任务', '重复'],
          direction: 'horizontal',
        },

        {
          type: 'code',
          language: 'javascript',
          code: `console.log('1')      // 同步

setTimeout(() => {
  console.log('2')    // 宏任务
}, 0)

Promise.resolve().then(() => {
  console.log('3')    // 微任务
})

console.log('4')      // 同步

// 输出: 1 → 4 → 3 → 2`,
          caption: '经典面试题',
        },
        {
          type: 'demo',
          demoType: 'eventLoop',
          config: { type: 'eventLoop' },
        },

        // async/await
        {
          type: 'narrative',
          content: 'async/await 本质是什么？',
          emphasis: 'question',
        },
        {
          type: 'narrative',
          content: 'async函数返回 Promise。await 会暂停函数执行，但不会阻塞线程。',
        },
        {
          type: 'code',
          language: 'javascript',
          code: `async function test() {
  console.log(1)
  await Promise.resolve()
  console.log(2)    // 相当于 .then(() => console.log(2))
}

test()
console.log(3)

// 输出: 1 → 3 → 2`,
          caption: 'async/await 本质',
        },
        {
          type: 'transition',
          text: '理解了JS执行机制，最后我们看看网络与安全。',
        },
      ],
    },

    // ========== 四、网络与安全 ==========
    {
      id: 'sec-4-network',
      title: '网络与安全',
      duration: 10,
      blocks: [
        // 同源策略
        {
          type: 'narrative',
          content: '浏览器有一个重要安全机制：同源策略。',
          emphasis: 'highlight',
        },
        {
          type: 'narrative',
          content: '同源的定义：协议、域名、端口必须完全一致。',
        },
        {
          type: 'code',
          language: 'text',
          code: `https://example.com:443/path

协议: https
域名: example.com
端口: 443`,
          caption: 'URL 组成',
        },
        {
          type: 'demo',
          demoType: 'corsSimulator',
          config: { type: 'corsSimulator' },
        },

        // CORS
        {
          type: 'narrative',
          content: '跨域资源共享（CORS）：服务器通过响应头允许跨域。',
        },
        {
          type: 'code',
          language: 'text',
          code: `Access-Control-Allow-Origin: https://mysite.com
Access-Control-Allow-Methods: GET, POST
Access-Control-Allow-Headers: Content-Type`,
          caption: 'CORS 响应头',
        },

        // Fetch API
        {
          type: 'narrative',
          content: '现代HTTP请求方式：Fetch API。',
        },
        {
          type: 'code',
          language: 'javascript',
          code: `// 替代 XMLHttpRequest
const response = await fetch('/api/data', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Ada' })
})

const data = await response.json()`,
          caption: 'Fetch API',
        },
      ],
    },

    // ========== 五、课程总结 ==========
    {
      id: 'sec-5-summary',
      title: '课程总结',
      duration: 15,
      blocks: [
        {
          type: 'narrative',
          content: '今天我们建立了前端核心知识图谱。',
          emphasis: 'highlight',
        },
        {
          type: 'code',
          language: 'text',
          code: `前端核心知识图谱
├── 浏览器渲染
│   ├── 关键渲染路径
│   ├── DOM / CSSOM
│   └── Layout / Paint / Composite
│
├── HTML
│   ├── 语义化标签
│   └── HTML5 API
│
├── CSS
│   ├── 层叠与继承
│   ├── 盒模型与 BFC
│   └── Flex / Grid 布局
│
└── JavaScript
    ├── 执行上下文
    ├── 作用域与闭包
    ├── 原型链与继承
    ├── this 绑定
    └── 事件循环`,
          caption: '知识图谱',
        },

        {
          type: 'narrative',
          content: '如果理解了这些，你就真正理解了：浏览器如何运行。',
          emphasis: 'highlight',
        },

        {
          type: 'bullets',
          title: '推荐练习:',
          items: [
            '手写一个关键渲染路径的流程图',
            '用闭包实现一个模块系统',
            '分析任意代码的事件循环执行顺序',
            '实现一个基于原型的继承系统',
          ],
        },

        {
          type: 'checkpoint',
          question: '能画出完整的知识图谱吗？能解释每个概念的核心原理吗？',
        },
      ],
    },
  ],
}
