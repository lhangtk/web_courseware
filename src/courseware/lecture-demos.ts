/**
 * 讲稿交互演示组件
 * 实现 design.md 中描述的核心 Demo
 */

import {
  DemoConfig,
  RenderPipelineConfig,
  DomTreeBuilderConfig,
  CssCascadeConfig,
  FlexPlaygroundConfig,
  GridPlaygroundConfig,
  BfcDemoConfig,
  EventLoopConfig,
  PromiseOrderConfig,
  PrototypeChainConfig,
  ThisBindingConfig,
  ClosureMemoryConfig,
  CorsSimulatorConfig,
  BoxModelConfig,
  CssPerformanceConfig,
} from './lecture-types'

// ============ 渲染流程模拟 Demo ============

interface Stage {
  id: string;
  label: string;
  detail: string;
  icon: string;
  type?: 'normal' | 'blocking' | 'async' | 'defer';
}

const createRenderPipelineDemo = (_config: RenderPipelineConfig): HTMLElement => {
  const container = document.createElement('div')
  container.className = 'demo-panel demo-render-pipeline'

  // 基础阶段
  const baseStages: Stage[] = [
    { id: 'dns', label: 'DNS解析', detail: '域名 → IP地址', icon: '🔍' },
    { id: 'tcp', label: 'TCP连接', detail: '三次握手', icon: '🤝' },
    { id: 'tls', label: 'TLS握手', detail: '证书验证 + 密钥协商', icon: '🔐' },
    { id: 'request', label: 'HTTP请求', detail: 'GET /index.html', icon: '📤' },
    { id: 'html', label: '解析HTML', detail: '构建 DOM Tree', icon: '📄' },
    { id: 'css', label: '解析CSS', detail: '构建 CSSOM', icon: '🎨' },
    { id: 'render', label: 'Render Tree', detail: 'DOM + CSSOM 合并', icon: '🌲' },
    { id: 'layout', label: 'Layout', detail: '计算几何位置', icon: '📐' },
    { id: 'paint', label: 'Paint', detail: '绘制像素', icon: '🖌️' },
    { id: 'composite', label: 'Composite', detail: 'GPU合成图层', icon: '🎭' },
  ]

  // 脚本相关阶段
  const blockingJsStage: Stage = {
    id: 'js-block',
    label: '⚠️ JS阻塞',
    detail: '同步脚本阻塞HTML解析，等待下载+执行',
    icon: '⏸️',
    type: 'blocking',
  }

  const asyncDownloadStage: Stage = {
    id: 'js-async-download',
    label: 'async下载',
    detail: '异步下载脚本，不阻塞解析',
    icon: '⬇️',
    type: 'async',
  }

  const asyncExecStage: Stage = {
    id: 'js-async-exec',
    label: 'async执行',
    detail: '下载完立即执行，可能阻塞渲染',
    icon: '⚡',
    type: 'async',
  }

  const deferDownloadStage: Stage = {
    id: 'js-defer-download',
    label: 'defer下载',
    detail: '异步下载脚本，不阻塞解析',
    icon: '⬇️',
    type: 'defer',
  }

  const deferExecStage: Stage = {
    id: 'js-defer-exec',
    label: 'defer执行',
    detail: 'DOM解析完成后按顺序执行',
    icon: '📋',
    type: 'defer',
  }

  // 根据选项生成阶段列表
  const getStages = (): Stage[] => {
    const hasAsync = (container.querySelector('#opt-async') as HTMLInputElement)?.checked
    const hasDefer = (container.querySelector('#opt-defer') as HTMLInputElement)?.checked
    const hasBlock = (container.querySelector('#opt-block') as HTMLInputElement)?.checked

    const result: Stage[] = [...baseStages.slice(0, 5)] // DNS → HTML

    // 阻塞JS：在HTML解析后立即执行，阻塞后续流程
    if (hasBlock) {
      result.push(blockingJsStage)
    }

    // async：在HTML解析时并行下载
    if (hasAsync) {
      result.push(asyncDownloadStage)
    }

    // defer：在HTML解析时并行下载
    if (hasDefer) {
      result.push(deferDownloadStage)
    }

    // CSS解析
    result.push(baseStages[5])

    // async执行：下载完就执行（在CSS之后模拟）
    if (hasAsync) {
      result.push(asyncExecStage)
    }

    // Render Tree
    result.push(baseStages[6])

    // defer执行：DOM完成后、渲染前执行
    if (hasDefer) {
      result.push(deferExecStage)
    }

    // Layout → Composite
    result.push(...baseStages.slice(7))

    return result
  }

  let stages = getStages()
  let currentStage = -1
  let isPlaying = false
  let timer: number | null = null

  // 控制区
  const controls = document.createElement('div')
  controls.className = 'demo-controls'

  const playBtn = document.createElement('button')
  playBtn.className = 'demo-btn demo-btn--primary'
  playBtn.textContent = '▶ 开始渲染'

  const resetBtn = document.createElement('button')
  resetBtn.className = 'demo-btn'
  resetBtn.textContent = '↺ 重置'

  // 选项
  const options = document.createElement('div')
  options.className = 'demo-options'
  options.innerHTML = `
    <label><input type="checkbox" id="opt-async" /> async 脚本</label>
    <label><input type="checkbox" id="opt-defer" /> defer 脚本</label>
    <label><input type="checkbox" id="opt-block" /> 阻塞JS</label>
  `

  controls.append(playBtn, resetBtn, options)

  // 时间轴
  const timeline = document.createElement('div')
  timeline.className = 'pipeline-timeline'

  // 详情面板
  const detail = document.createElement('div')
  detail.className = 'pipeline-detail'
  detail.innerHTML = '<p class="hint">点击"开始渲染"查看完整流程，勾选不同脚本类型观察差异</p>'

  // 渲染时间轴
  const renderTimeline = () => {
    timeline.innerHTML = ''
    stages.forEach((stage, idx) => {
      const node = document.createElement('div')
      node.className = `pipeline-stage${stage.type ? ` stage-${stage.type}` : ''}`
      node.dataset.stage = stage.id
      node.innerHTML = `
        <div class="stage-icon">${stage.icon}</div>
        <div class="stage-label">${stage.label}</div>
        <div class="stage-detail">${stage.detail}</div>
      `
      node.addEventListener('click', () => {
        currentStage = idx
        updateTimeline()
      })
      timeline.appendChild(node)
    })
  }

  const updateTimeline = () => {
    const nodes = timeline.querySelectorAll('.pipeline-stage')
    nodes.forEach((node, idx) => {
      node.classList.toggle('is-done', idx < currentStage)
      node.classList.toggle('is-active', idx === currentStage)
    })

    if (currentStage >= 0 && currentStage < stages.length) {
      const stage = stages[currentStage]
      const typeLabel = stage.type === 'blocking' ? '<span class="tag tag-blocking">阻塞</span>'
        : stage.type === 'async' ? '<span class="tag tag-async">async</span>'
          : stage.type === 'defer' ? '<span class="tag tag-defer">defer</span>'
            : ''

      detail.innerHTML = `
        <div class="detail-header">
          <span class="detail-icon">${stage.icon}</span>
          <strong>${stage.label}</strong>
          ${typeLabel}
        </div>
        <p>${stage.detail}</p>
        ${stage.type === 'blocking' ? '<p class="warning">⚠️ 阻塞JS会暂停HTML解析，影响首屏时间！</p>' : ''}
        ${stage.type === 'async' ? '<p class="info">💡 async脚本不阻塞解析，但执行时机不确定</p>' : ''}
        ${stage.type === 'defer' ? '<p class="info">💡 defer脚本保证在DOM完成后按顺序执行</p>' : ''}
        <div class="detail-progress">
          <div class="progress-bar" style="width: ${((currentStage + 1) / stages.length) * 100}%"></div>
        </div>
        <p class="progress-text">${currentStage + 1} / ${stages.length}</p>
      `
    }
  }

  const play = () => {
    if (isPlaying) { return }
    isPlaying = true
    playBtn.textContent = '⏸ 暂停'

    const tick = () => {
      currentStage++
      if (currentStage >= stages.length) {
        isPlaying = false
        playBtn.textContent = '✓ 完成'
        const hasBlock = (container.querySelector('#opt-block') as HTMLInputElement)?.checked
        const hasAsync = (container.querySelector('#opt-async') as HTMLInputElement)?.checked
        const hasDefer = (container.querySelector('#opt-defer') as HTMLInputElement)?.checked

        let summary = '🎉 页面渲染完成!'
        if (hasBlock) {
          summary += '<br><span class="warning">⚠️ 阻塞脚本延迟了渲染</span>'
        }
        if (hasAsync || hasDefer) {
          summary += `<br><span class="info">✓ ${hasAsync ? 'async' : ''}${hasAsync && hasDefer ? '+' : ''}${hasDefer ? 'defer' : ''} 脚本优化了加载</span>`
        }
        detail.innerHTML += `<p class="success">${summary}</p>`
        return
      }
      updateTimeline()

      // 阻塞脚本时增加延迟以体现阻塞效果
      const stage = stages[currentStage]
      const delay = stage.type === 'blocking' ? 1500 : 800
      timer = window.setTimeout(tick, delay)
    }

    tick()
  }

  const pause = () => {
    if (timer) { clearTimeout(timer) }
    isPlaying = false
    playBtn.textContent = '▶ 继续'
  }

  const reset = () => {
    if (timer) { clearTimeout(timer) }
    isPlaying = false
    currentStage = -1
    stages = getStages()
    renderTimeline()
    playBtn.textContent = '▶ 开始渲染'
    detail.innerHTML = '<p class="hint">点击"开始渲染"查看完整流程，勾选不同脚本类型观察差异</p>'
  }

  // 选项变化时重置
  options.addEventListener('change', reset)

  playBtn.addEventListener('click', () => (isPlaying ? pause() : play()))
  resetBtn.addEventListener('click', reset)

  // 原理说明区域
  const explanation = document.createElement('div')
  explanation.className = 'script-explanation'
  explanation.innerHTML = `
    <h4>脚本加载方式原理</h4>
    <div class="explanation-grid">
      <div class="explanation-item blocking-item">
        <div class="explanation-header">
          <code>&lt;script src="app.js"&gt;</code>
          <span class="tag tag-blocking">阻塞</span>
        </div>
        <div class="explanation-diagram">
          <div class="diagram-row">
            <span class="diagram-label">HTML解析</span>
            <div class="diagram-bar html-bar">解析</div>
            <div class="diagram-bar pause-bar">暂停</div>
            <div class="diagram-bar html-bar">继续</div>
          </div>
          <div class="diagram-row">
            <span class="diagram-label">脚本</span>
            <div class="diagram-bar empty-bar"></div>
            <div class="diagram-bar js-bar">下载+执行</div>
          </div>
        </div>
        <p class="explanation-desc">遇到脚本立即下载并执行，<strong>阻塞HTML解析</strong>，影响首屏渲染速度。</p>
      </div>
      <div class="explanation-item async-item">
        <div class="explanation-header">
          <code>&lt;script async src="app.js"&gt;</code>
          <span class="tag tag-async">async</span>
        </div>
        <div class="explanation-diagram">
          <div class="diagram-row">
            <span class="diagram-label">HTML解析</span>
            <div class="diagram-bar html-bar long">解析（不阻塞）</div>
          </div>
          <div class="diagram-row">
            <span class="diagram-label">脚本</span>
            <div class="diagram-bar async-bar">下载</div>
            <div class="diagram-bar js-bar short">执行</div>
          </div>
        </div>
        <p class="explanation-desc">异步下载，下载完<strong>立即执行</strong>。执行顺序不确定，适合独立脚本（如统计）。</p>
      </div>
      <div class="explanation-item defer-item">
        <div class="explanation-header">
          <code>&lt;script defer src="app.js"&gt;</code>
          <span class="tag tag-defer">defer</span>
        </div>
        <div class="explanation-diagram">
          <div class="diagram-row">
            <span class="diagram-label">HTML解析</span>
            <div class="diagram-bar html-bar long">解析（不阻塞）</div>
          </div>
          <div class="diagram-row">
            <span class="diagram-label">脚本</span>
            <div class="diagram-bar defer-bar">下载</div>
            <div class="diagram-bar empty-bar short"></div>
            <div class="diagram-bar js-bar short">执行</div>
          </div>
          <div class="diagram-row">
            <span class="diagram-label"></span>
            <div class="diagram-marker">↑ DOM解析完成后执行</div>
          </div>
        </div>
        <p class="explanation-desc">异步下载，<strong>DOM解析完成后按顺序执行</strong>。适合依赖DOM的脚本。</p>
      </div>
    </div>
    <div class="explanation-summary">
      <strong>最佳实践：</strong>
      将 <code>&lt;script&gt;</code> 放在 <code>&lt;/body&gt;</code> 前，或使用 <code>defer</code> 属性。
      独立的第三方脚本（如 analytics）可使用 <code>async</code>。
    </div>
  `

  container.append(controls, timeline, detail, explanation)

  // 初始渲染
  renderTimeline()

  return container
}

// ============ DOM 树构建 Demo ============

const createDomTreeBuilderDemo = (config: DomTreeBuilderConfig): HTMLElement => {
  const container = document.createElement('div')
  container.className = 'demo-panel demo-dom-tree'

  const defaultHtml = config.initialHtml || `<div>
  <h1>Hello</h1>
  <p>World</p>
</div>`

  // 输入区
  const inputArea = document.createElement('div')
  inputArea.className = 'dom-input'
  inputArea.innerHTML = `<label>输入 HTML:</label>`

  const textarea = document.createElement('textarea')
  textarea.className = 'demo-textarea'
  textarea.value = defaultHtml
  textarea.rows = 6
  inputArea.appendChild(textarea)

  const buildBtn = document.createElement('button')
  buildBtn.className = 'demo-btn demo-btn--primary'
  buildBtn.textContent = '生成 DOM Tree'
  inputArea.appendChild(buildBtn)

  // 树形展示区
  const treeArea = document.createElement('div')
  treeArea.className = 'dom-tree-view'
  treeArea.innerHTML = '<p class="hint">点击按钮生成 DOM 树</p>'

  const buildTree = (html: string) => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    const body = doc.body

    const renderNode = (node: Node, depth = 0): string => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent?.trim()
        if (!text) {return ''}
        return `<div class="tree-node tree-text" style="--depth:${depth}">
          <span class="node-type">text</span>
          <span class="node-content">"${text}"</span>
        </div>`
      }

      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as Element
        const children = Array.from(el.childNodes)
          .map((c) => renderNode(c, depth + 1))
          .filter(Boolean)
          .join('')

        return `<div class="tree-node tree-element" style="--depth:${depth}">
          <span class="node-tag">&lt;${el.tagName.toLowerCase()}&gt;</span>
          ${children ? `<div class="tree-children">${children}</div>` : ''}
        </div>`
      }

      return ''
    }

    const result = Array.from(body.childNodes)
      .map((c) => renderNode(c, 0))
      .filter(Boolean)
      .join('')

    treeArea.innerHTML = result || '<p class="hint">无有效 DOM 节点</p>'
  }

  buildBtn.addEventListener('click', () => buildTree(textarea.value))

  container.append(inputArea, treeArea)
  return container
}

// ============ CSS 层叠规则 Demo ============

const createCssCascadeDemo = (config: CssCascadeConfig): HTMLElement => {
  const container = document.createElement('div')
  container.className = 'demo-panel demo-css-cascade'

  const defaultCss =    config.initialCss
    || `#box { color: red; }
.box { color: blue; }
div { color: green; }`

  const defaultHtml = config.initialHtml || `<div id="box" class="box">Hello</div>`

  // 输入区
  const inputGrid = document.createElement('div')
  inputGrid.className = 'cascade-inputs'

  inputGrid.innerHTML = `
    <div class="cascade-input">
      <label>CSS 规则:</label>
      <textarea class="demo-textarea" id="cascade-css" rows="4">${defaultCss}</textarea>
    </div>
    <div class="cascade-input">
      <label>HTML:</label>
      <textarea class="demo-textarea" id="cascade-html" rows="2">${defaultHtml}</textarea>
    </div>
  `

  const calcBtn = document.createElement('button')
  calcBtn.className = 'demo-btn demo-btn--primary'
  calcBtn.textContent = '计算最终样式'

  // 结果区
  const resultArea = document.createElement('div')
  resultArea.className = 'cascade-result'
  resultArea.innerHTML = '<p class="hint">点击按钮计算样式优先级</p>'

  const calculate = () => {
    const cssInput = container.querySelector('#cascade-css') as HTMLTextAreaElement
    const rules = cssInput.value

    // 简单解析规则
    const parsed: Array<{ selector: string; specificity: number; prop: string; value: string }> = []
    const regex = /([^{]+)\s*\{\s*([^:]+):\s*([^;}]+)/g
    let match
    while ((match = regex.exec(rules))) {
      const selector = match[1].trim()
      const prop = match[2].trim()
      const value = match[3].trim()

      let specificity = 0
      if (selector.includes('#')) {specificity += 100}
      if (selector.includes('.')) {specificity += 10}
      if (/^[a-z]+$/i.test(selector)) {specificity += 1}

      parsed.push({ selector, specificity, prop, value })
    }

    // 按优先级排序
    parsed.sort((a, b) => b.specificity - a.specificity)

    const winner = parsed[0]

    resultArea.innerHTML = `
      <div class="cascade-winner">
        <strong>最终生效:</strong>
        <code>${winner?.prop}: ${winner?.value}</code>
      </div>
      <div class="cascade-breakdown">
        <strong>优先级计算:</strong>
        <ul>
          ${parsed
    .map(
      (r) => `
            <li class="${r === winner ? 'is-winner' : ''}">
              <code>${r.selector}</code>
              <span class="specificity">特指度: ${r.specificity}</span>
              <span class="rule">${r.prop}: ${r.value}</span>
            </li>
          `
    )
    .join('')}
        </ul>
      </div>
      <div class="specificity-guide">
        <strong>特指度规则:</strong>
        <code>ID=100 | class=10 | tag=1</code>
      </div>
    `
  }

  calcBtn.addEventListener('click', calculate)
  inputGrid.appendChild(calcBtn)

  container.append(inputGrid, resultArea)
  return container
}

// ============ Flex 布局沙盒 Demo ============

const createFlexPlaygroundDemo = (config: FlexPlaygroundConfig): HTMLElement => {
  const container = document.createElement('div')
  container.className = 'demo-panel demo-flex-playground'

  const itemCount = config.itemCount || 5

  // 控制区
  const controls = document.createElement('div')
  controls.className = 'flex-controls'

  const props = [
    { name: 'flex-direction', options: ['row', 'column', 'row-reverse', 'column-reverse'] },
    {
      name: 'justify-content',
      options: ['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly'],
    },
    { name: 'align-items', options: ['flex-start', 'center', 'flex-end', 'stretch', 'baseline'] },
    { name: 'flex-wrap', options: ['nowrap', 'wrap', 'wrap-reverse'] },
    { name: 'gap', options: ['0px', '8px', '16px', '24px'] },
  ]

  const state: Record<string, string> = {
    'flex-direction': 'row',
    'justify-content': 'flex-start',
    'align-items': 'stretch',
    'flex-wrap': 'nowrap',
    gap: '8px',
  }

  props.forEach((prop) => {
    const group = document.createElement('div')
    group.className = 'control-group'
    group.innerHTML = `<label>${prop.name}:</label>`

    const select = document.createElement('select')
    select.className = 'demo-select'
    prop.options.forEach((opt) => {
      const option = document.createElement('option')
      option.value = opt
      option.textContent = opt
      if (opt === state[prop.name]) {option.selected = true}
      select.appendChild(option)
    })

    select.addEventListener('change', () => {
      state[prop.name] = select.value
      updatePreview()
    })

    group.appendChild(select)
    controls.appendChild(group)
  })

  // 预览区
  const preview = document.createElement('div')
  preview.className = 'flex-preview'

  for (let i = 0; i < itemCount; i++) {
    const item = document.createElement('div')
    item.className = 'flex-item'
    item.textContent = `${i + 1}`
    preview.appendChild(item)
  }

  // 代码展示
  const codeDisplay = document.createElement('pre')
  codeDisplay.className = 'demo-code flex-code'

  const updatePreview = () => {
    Object.entries(state).forEach(([prop, value]) => {
      (preview.style as any)[prop] = value
    })

    codeDisplay.innerHTML = `<code>.container {
  display: flex;
  flex-direction: ${state['flex-direction']};
  justify-content: ${state['justify-content']};
  align-items: ${state['align-items']};
  flex-wrap: ${state['flex-wrap']};
  gap: ${state['gap']};
}</code>`
  }

  updatePreview()

  container.append(controls, preview, codeDisplay)
  return container
}

// ============ 事件循环 Demo ============

const createEventLoopDemo = (config: EventLoopConfig): HTMLElement => {
  const container = document.createElement('div')
  container.className = 'demo-panel demo-event-loop'

  const defaultCode =    config.initialCode
    || `console.log('1')

setTimeout(() => {
  console.log('2')
}, 0)

Promise.resolve().then(() => {
  console.log('3')
})

console.log('4')`

  // 代码输入
  const codeArea = document.createElement('div')
  codeArea.className = 'eventloop-code'
  codeArea.innerHTML = `<label>JavaScript 代码:</label>`

  const textarea = document.createElement('textarea')
  textarea.className = 'demo-textarea'
  textarea.value = defaultCode
  textarea.rows = 10
  codeArea.appendChild(textarea)

  const runBtn = document.createElement('button')
  runBtn.className = 'demo-btn demo-btn--primary'
  runBtn.textContent = '▶ 执行并可视化'
  codeArea.appendChild(runBtn)

  // 可视化区域
  const visArea = document.createElement('div')
  visArea.className = 'eventloop-visual'
  visArea.innerHTML = `
    <div class="queue-section">
      <div class="queue-box callstack">
        <h4>调用栈 Call Stack</h4>
        <div class="queue-items" id="callstack-items"></div>
      </div>
      <div class="queue-box microtasks">
        <h4>微任务队列 Microtasks</h4>
        <div class="queue-items" id="micro-items"></div>
      </div>
      <div class="queue-box macrotasks">
        <h4>宏任务队列 Macrotasks</h4>
        <div class="queue-items" id="macro-items"></div>
      </div>
    </div>
    <div class="output-section">
      <h4>输出 Console</h4>
      <div class="output-log" id="output-log"></div>
    </div>
  `

  // 模拟执行
  const simulate = () => {
    const callstack = visArea.querySelector('#callstack-items')!
    const microQueue = visArea.querySelector('#micro-items')!
    const macroQueue = visArea.querySelector('#macro-items')!
    const output = visArea.querySelector('#output-log')!

    callstack.innerHTML = ''
    microQueue.innerHTML = ''
    macroQueue.innerHTML = ''
    output.innerHTML = ''

    const logs: Array<{ text: string; phase: string }> = []

    // 简化的模拟
    const steps = [
      { phase: 'sync', action: 'push', target: 'callstack', item: 'console.log(1)', output: '1' },
      { phase: 'sync', action: 'pop', target: 'callstack', item: 'console.log(1)' },
      { phase: 'sync', action: 'push', target: 'callstack', item: 'setTimeout()' },
      { phase: 'sync', action: 'schedule', target: 'macro', item: 'callback: log(2)' },
      { phase: 'sync', action: 'pop', target: 'callstack', item: 'setTimeout()' },
      { phase: 'sync', action: 'push', target: 'callstack', item: 'Promise.then()' },
      { phase: 'sync', action: 'schedule', target: 'micro', item: 'callback: log(3)' },
      { phase: 'sync', action: 'pop', target: 'callstack', item: 'Promise.then()' },
      { phase: 'sync', action: 'push', target: 'callstack', item: 'console.log(4)', output: '4' },
      { phase: 'sync', action: 'pop', target: 'callstack', item: 'console.log(4)' },
      { phase: 'micro', action: 'run', target: 'micro', item: 'callback: log(3)', output: '3' },
      { phase: 'macro', action: 'run', target: 'macro', item: 'callback: log(2)', output: '2' },
    ]

    let idx = 0
    const interval = setInterval(() => {
      if (idx >= steps.length) {
        clearInterval(interval)
        output.innerHTML += `<div class="output-final">✓ 执行完成！顺序: 1 → 4 → 3 → 2</div>`
        return
      }

      const step = steps[idx]

      if (step.action === 'push' || step.action === 'schedule') {
        const targetEl = step.target === 'callstack' ? callstack : step.target === 'micro' ? microQueue : macroQueue
        const chip = document.createElement('div')
        chip.className = `queue-item phase-${step.phase}`
        chip.textContent = step.item
        targetEl.appendChild(chip)
      }

      if (step.action === 'pop' || step.action === 'run') {
        const targetEl = step.target === 'callstack' ? callstack : step.target === 'micro' ? microQueue : macroQueue
        const items = targetEl.querySelectorAll('.queue-item')
        if (items.length) {items[items.length - 1].remove()}
      }

      if (step.output) {
        const logEl = document.createElement('div')
        logEl.className = `output-item phase-${step.phase}`
        logEl.textContent = step.output
        output.appendChild(logEl)
      }

      idx++
    }, 600)
  }

  runBtn.addEventListener('click', simulate)

  container.append(codeArea, visArea)
  return container
}

// ============ 原型链探查器 Demo ============

const createPrototypeChainDemo = (config: PrototypeChainConfig): HTMLElement => {
  const container = document.createElement('div')
  container.className = 'demo-panel demo-prototype'

  const defaultCode =    config.initialCode
    || `function Person(name) {
  this.name = name
}
Person.prototype.greet = function() {
  return 'Hello ' + this.name
}
const p = new Person('Ada')`

  // 代码输入
  const codeArea = document.createElement('div')
  codeArea.className = 'proto-code'
  codeArea.innerHTML = `<label>创建对象:</label>`

  const textarea = document.createElement('textarea')
  textarea.className = 'demo-textarea'
  textarea.value = defaultCode
  textarea.rows = 8
  codeArea.appendChild(textarea)

  const buildBtn = document.createElement('button')
  buildBtn.className = 'demo-btn demo-btn--primary'
  buildBtn.textContent = '查看原型链'
  codeArea.appendChild(buildBtn)

  // 属性查找
  const searchArea = document.createElement('div')
  searchArea.className = 'proto-search'
  searchArea.innerHTML = `
    <label>查找属性:</label>
    <input type="text" class="demo-input" id="proto-search-input" placeholder="输入属性名, 如 greet" />
    <button class="demo-btn" id="proto-search-btn">查找</button>
  `

  // 原型链可视化
  const chainArea = document.createElement('div')
  chainArea.className = 'proto-chain'
  chainArea.innerHTML = '<p class="hint">点击按钮查看原型链</p>'

  const buildChain = () => {
    // 预设的原型链展示
    chainArea.innerHTML = `
      <div class="chain-node">
        <div class="node-header">p (实例)</div>
        <ul class="node-props">
          <li><code>name</code>: "Ada"</li>
        </ul>
        <div class="chain-arrow">↓ __proto__</div>
      </div>
      <div class="chain-node">
        <div class="node-header">Person.prototype</div>
        <ul class="node-props">
          <li><code>greet</code>: function</li>
          <li><code>constructor</code>: Person</li>
        </ul>
        <div class="chain-arrow">↓ __proto__</div>
      </div>
      <div class="chain-node">
        <div class="node-header">Object.prototype</div>
        <ul class="node-props">
          <li><code>toString</code></li>
          <li><code>hasOwnProperty</code></li>
          <li><code>valueOf</code></li>
        </ul>
        <div class="chain-arrow">↓ __proto__</div>
      </div>
      <div class="chain-node chain-end">
        <div class="node-header">null</div>
      </div>
    `
  }

  const searchProp = () => {
    const input = searchArea.querySelector('#proto-search-input') as HTMLInputElement
    const prop = input.value.trim()
    if (!prop) {return}

    const nodes = chainArea.querySelectorAll('.chain-node')
    nodes.forEach((n) => n.classList.remove('is-found'))

    // 简化的查找演示
    const propToNode: Record<string, number> = {
      name: 0,
      greet: 1,
      constructor: 1,
      toString: 2,
      hasOwnProperty: 2,
      valueOf: 2,
    }

    const foundIdx = propToNode[prop]
    if (foundIdx !== undefined) {
      nodes[foundIdx]?.classList.add('is-found')
      const li = nodes[foundIdx]?.querySelector(`code`)
      if (li) {
        chainArea.insertAdjacentHTML(
          'beforeend',
          `<div class="search-result">✓ 在 ${nodes[foundIdx]?.querySelector('.node-header')?.textContent} 找到属性 "${prop}"</div>`
        )
      }
    } else {
      chainArea.insertAdjacentHTML('beforeend', `<div class="search-result not-found">✗ 属性 "${prop}" 未找到</div>`)
    }
  }

  buildBtn.addEventListener('click', buildChain)
  searchArea.querySelector('#proto-search-btn')?.addEventListener('click', searchProp)

  container.append(codeArea, searchArea, chainArea)
  return container
}

// ============ this 绑定实验 Demo ============

const createThisBindingDemo = (config: ThisBindingConfig): HTMLElement => {
  const container = document.createElement('div')
  container.className = 'demo-panel demo-this-binding'

  const bindings = [
    {
      name: '默认绑定',
      code: `function test() {
  console.log(this)
}
test()`,
      result: 'window (严格模式下是 undefined)',
    },
    {
      name: '隐式绑定',
      code: `const obj = {
  name: 'Ada',
  say() {
    console.log(this.name)
  }
}
obj.say()`,
      result: 'Ada (this → obj)',
    },
    {
      name: '显式绑定',
      code: `function greet() {
  console.log(this.name)
}
const user = { name: 'Bob' }
greet.call(user)`,
      result: 'Bob (this → user)',
    },
    {
      name: 'new 绑定',
      code: `function Person(name) {
  this.name = name
}
const p = new Person('Carol')
console.log(p.name)`,
      result: 'Carol (this → 新实例)',
    },
    {
      name: '箭头函数',
      code: `const obj = {
  name: 'Dave',
  say: () => {
    console.log(this.name)
  }
}
obj.say()`,
      result: 'undefined (箭头函数继承外层 this)',
    },
  ]

  let currentIdx = 0

  // 选择器
  const selector = document.createElement('div')
  selector.className = 'this-selector'

  bindings.forEach((b, idx) => {
    const btn = document.createElement('button')
    btn.className = `demo-btn ${idx === 0 ? 'is-active' : ''}`
    btn.textContent = b.name
    btn.addEventListener('click', () => {
      currentIdx = idx
      updateView()
      selector.querySelectorAll('.demo-btn').forEach((el, i) => {
        el.classList.toggle('is-active', i === idx)
      })
    })
    selector.appendChild(btn)
  })

  // 代码 & 结果
  const display = document.createElement('div')
  display.className = 'this-display'

  const updateView = () => {
    const binding = bindings[currentIdx]
    display.innerHTML = `
      <pre class="demo-code"><code>${binding.code}</code></pre>
      <div class="this-result">
        <strong>this 指向:</strong>
        <span>${binding.result}</span>
      </div>
    `
  }

  updateView()

  // 规则总结
  const rules = document.createElement('div')
  rules.className = 'this-rules'
  rules.innerHTML = `
    <h4>this 绑定规则优先级:</h4>
    <ol>
      <li><strong>new 绑定</strong> → 新创建的对象</li>
      <li><strong>显式绑定</strong> (call/apply/bind) → 指定对象</li>
      <li><strong>隐式绑定</strong> (obj.fn()) → 调用者对象</li>
      <li><strong>默认绑定</strong> → globalThis / undefined</li>
    </ol>
    <p class="note">箭头函数没有自己的 this，继承定义时的外层 this</p>
  `

  container.append(selector, display, rules)
  return container
}

// ============ 闭包内存实验 Demo ============

const createClosureMemoryDemo = (config: ClosureMemoryConfig): HTMLElement => {
  const container = document.createElement('div')
  container.className = 'demo-panel demo-closure'

  // 代码展示
  const codeArea = document.createElement('div')
  codeArea.className = 'closure-code'
  codeArea.innerHTML = `
    <pre class="demo-code"><code>function createCounter() {
  let count = 0  // 被闭包捕获
  return function() {
    count++
    return count
  }
}

const counter = createCounter()
</code></pre>
  `

  // 控制区
  const controls = document.createElement('div')
  controls.className = 'closure-controls'

  const callBtn = document.createElement('button')
  callBtn.className = 'demo-btn demo-btn--primary'
  callBtn.textContent = '调用 counter()'

  const resetBtn = document.createElement('button')
  resetBtn.className = 'demo-btn'
  resetBtn.textContent = '重新创建'

  controls.append(callBtn, resetBtn)

  // 可视化
  const visual = document.createElement('div')
  visual.className = 'closure-visual'

  let count = 0

  const updateVisual = () => {
    visual.innerHTML = `
      <div class="scope-chain">
        <div class="scope-box global">
          <h4>Global Scope</h4>
          <div class="var">counter: function</div>
        </div>
        <div class="scope-arrow">↓</div>
        <div class="scope-box closure">
          <h4>Closure Scope (createCounter)</h4>
          <div class="var highlight">count: <strong>${count}</strong></div>
        </div>
        <div class="scope-arrow">↓</div>
        <div class="scope-box inner">
          <h4>Inner Function</h4>
          <div class="var">访问 count → ${count}</div>
        </div>
      </div>
      <div class="closure-log">
        <h4>调用记录:</h4>
        <ul id="closure-calls"></ul>
      </div>
    `
  }

  updateVisual()

  const calls: string[] = []

  callBtn.addEventListener('click', () => {
    count++
    calls.push(`counter() → ${count}`)
    updateVisual()
    const list = visual.querySelector('#closure-calls')
    if (list) {
      list.innerHTML = calls.map((c) => `<li>${c}</li>`).join('')
    }
  })

  resetBtn.addEventListener('click', () => {
    count = 0
    calls.length = 0
    updateVisual()
  })

  container.append(codeArea, controls, visual)
  return container
}

// ============ 同源策略模拟 Demo ============

const createCorsSimulatorDemo = (config: CorsSimulatorConfig): HTMLElement => {
  const container = document.createElement('div')
  container.className = 'demo-panel demo-cors'

  // 输入区
  const inputArea = document.createElement('div')
  inputArea.className = 'cors-inputs'
  inputArea.innerHTML = `
    <div class="origin-input">
      <label>当前页面 Origin:</label>
      <input type="text" class="demo-input" id="origin-current" value="https://mysite.com" />
    </div>
    <div class="origin-input">
      <label>请求目标 Origin:</label>
      <input type="text" class="demo-input" id="origin-target" value="https://api.other.com" />
    </div>
  `

  const checkBtn = document.createElement('button')
  checkBtn.className = 'demo-btn demo-btn--primary'
  checkBtn.textContent = '检查同源策略'
  inputArea.appendChild(checkBtn)

  // 结果区
  const resultArea = document.createElement('div')
  resultArea.className = 'cors-result'
  resultArea.innerHTML = '<p class="hint">输入两个 URL 检查是否同源</p>'

  const checkOrigin = () => {
    const current = (container.querySelector('#origin-current') as HTMLInputElement).value
    const target = (container.querySelector('#origin-target') as HTMLInputElement).value

    try {
      const urlCurrent = new URL(current)
      const urlTarget = new URL(target)

      const checks = [
        { name: '协议 Protocol', a: urlCurrent.protocol, b: urlTarget.protocol },
        { name: '域名 Host', a: urlCurrent.hostname, b: urlTarget.hostname },
        { name: '端口 Port', a: urlCurrent.port || '(默认)', b: urlTarget.port || '(默认)' },
      ]

      const allSame = checks.every((c) => c.a === c.b)

      resultArea.innerHTML = `
        <div class="cors-check ${allSame ? 'is-same' : 'is-cross'}">
          <strong>${allSame ? '✓ 同源' : '✗ 跨域'}</strong>
        </div>
        <table class="cors-table">
          <tr><th>检查项</th><th>当前页面</th><th>目标</th><th>结果</th></tr>
          ${checks
    .map(
      (c) => `
            <tr class="${c.a === c.b ? 'match' : 'mismatch'}">
              <td>${c.name}</td>
              <td><code>${c.a}</code></td>
              <td><code>${c.b}</code></td>
              <td>${c.a === c.b ? '✓' : '✗'}</td>
            </tr>
          `
    )
    .join('')}
        </table>
        ${
  !allSame
    ? `
        <div class="cors-solution">
          <h4>跨域解决方案:</h4>
          <ol>
            <li>服务器设置 <code>Access-Control-Allow-Origin</code></li>
            <li>使用代理服务器</li>
            <li>JSONP (仅 GET)</li>
          </ol>
        </div>
        `
    : ''
}
      `
    } catch (e) {
      resultArea.innerHTML = '<p class="error">请输入有效的 URL</p>'
    }
  }

  checkBtn.addEventListener('click', checkOrigin)

  container.append(inputArea, resultArea)
  return container
}

// ============ 盒模型可视化 Demo ============

const createBoxModelDemo = (_config: BoxModelConfig): HTMLElement => {
  const container = document.createElement('div')
  container.className = 'demo-panel demo-box-model'

  // 控制区
  const controls = document.createElement('div')
  controls.className = 'boxmodel-controls'

  const properties = [
    { name: 'width', label: 'width', min: 50, max: 200, value: 100, unit: 'px' },
    { name: 'height', label: 'height', min: 30, max: 150, value: 60, unit: 'px' },
    { name: 'padding', label: 'padding', min: 0, max: 50, value: 20, unit: 'px' },
    { name: 'border', label: 'border', min: 0, max: 20, value: 5, unit: 'px' },
    { name: 'margin', label: 'margin', min: 0, max: 50, value: 15, unit: 'px' },
  ]

  const state: Record<string, number> = {}
  properties.forEach((p) => {
    state[p.name] = p.value
  })

  // box-sizing 切换
  const boxSizingGroup = document.createElement('div')
  boxSizingGroup.className = 'control-group boxsizing-toggle'
  boxSizingGroup.innerHTML = `
    <label>box-sizing:</label>
    <select id="box-sizing-select" class="demo-select">
      <option value="content-box">content-box (标准)</option>
      <option value="border-box">border-box (推荐)</option>
    </select>
  `
  controls.appendChild(boxSizingGroup)

  properties.forEach((prop) => {
    const group = document.createElement('div')
    group.className = 'control-group'
    group.innerHTML = `
      <label>${prop.label}:</label>
      <input type="range" 
             id="ctrl-${prop.name}" 
             min="${prop.min}" 
             max="${prop.max}" 
             value="${prop.value}" />
      <span class="value-display" id="val-${prop.name}">${prop.value}${prop.unit}</span>
    `
    controls.appendChild(group)
  })

  // 可视化区
  const visual = document.createElement('div')
  visual.className = 'boxmodel-visual'

  // 计算尺寸显示
  const sizeInfo = document.createElement('div')
  sizeInfo.className = 'boxmodel-size-info'

  const updateVisual = () => {
    const boxSizing = (container.querySelector('#box-sizing-select') as HTMLSelectElement)?.value || 'content-box'
    const w = state['width']
    const h = state['height']
    const p = state['padding']
    const b = state['border']
    const m = state['margin']

    // 计算实际尺寸
    let contentWidth = w
    let contentHeight = h
    let totalWidth: number
    let totalHeight: number

    if (boxSizing === 'border-box') {
      contentWidth = Math.max(0, w - 2 * p - 2 * b)
      contentHeight = Math.max(0, h - 2 * p - 2 * b)
      totalWidth = w + 2 * m
      totalHeight = h + 2 * m
    } else {
      totalWidth = w + 2 * p + 2 * b + 2 * m
      totalHeight = h + 2 * p + 2 * b + 2 * m
    }

    visual.innerHTML = `
      <div class="box-margin" style="padding: ${m}px;">
        <div class="box-label margin-label">margin: ${m}px</div>
        <div class="box-border" style="border-width: ${b}px; padding: ${p}px;">
          <div class="box-label border-label">border: ${b}px</div>
          <div class="box-padding">
            <div class="box-label padding-label">padding: ${p}px</div>
            <div class="box-content" style="width: ${contentWidth}px; height: ${contentHeight}px;">
              <span>content</span>
              <span class="content-size">${contentWidth}×${contentHeight}</span>
            </div>
          </div>
        </div>
      </div>
    `

    // 显示计算结果
    sizeInfo.innerHTML = `
      <div class="size-row">
        <strong>box-sizing: ${boxSizing}</strong>
      </div>
      <div class="size-row">
        <span>width 属性值:</span>
        <code>${w}px</code>
      </div>
      <div class="size-row">
        <span>height 属性值:</span>
        <code>${h}px</code>
      </div>
      <div class="size-row highlight">
        <span>content 实际尺寸:</span>
        <code>${contentWidth}px × ${contentHeight}px</code>
      </div>
      <div class="size-row highlight">
        <span>元素总占用:</span>
        <code>${totalWidth}px × ${totalHeight}px</code>
      </div>
      <div class="size-formula">
        ${boxSizing === 'content-box'
    ? `<p>标准盒模型: <code>total = width + 2×padding + 2×border + 2×margin</code></p>
           <p>即: ${w} + ${2 * p} + ${2 * b} + ${2 * m} = ${totalWidth}px</p>`
    : `<p>border-box: <code>width 包含 padding 和 border</code></p>
           <p>content 实际 = ${w} - ${2 * p} - ${2 * b} = ${contentWidth}px</p>`
}
      </div>
    `
  }

  // 绑定事件
  controls.addEventListener('input', (e) => {
    const target = e.target as HTMLInputElement
    if (target.type === 'range') {
      const name = target.id.replace('ctrl-', '')
      state[name] = parseInt(target.value, 10)
      const display = container.querySelector(`#val-${name}`)
      if (display) {
        display.textContent = `${state[name]}px`
      }
      updateVisual()
    }
  })

  controls.addEventListener('change', (e) => {
    const target = e.target as HTMLSelectElement
    if (target.id === 'box-sizing-select') {
      updateVisual()
    }
  })

  // 说明区域
  const explanation = document.createElement('div')
  explanation.className = 'boxmodel-explanation'
  explanation.innerHTML = `
    <h4>content-box vs border-box</h4>
    <div class="boxmodel-compare">
      <div class="compare-item">
        <div class="compare-header">
          <code>box-sizing: content-box</code>
          <span class="compare-tag">标准盒模型</span>
        </div>
        <div class="compare-diagram">
          <div class="diagram-formula">
            <strong>width/height =</strong> 仅 content 区域
          </div>
          <div class="diagram-calc">
            元素实际宽度 = width + padding×2 + border×2
          </div>
        </div>
        <div class="compare-desc">
          <p><strong>问题：</strong>设置 <code>width: 100px</code>，加上 padding 和 border 后，实际占用空间会超过 100px，布局计算困难。</p>
        </div>
      </div>
      <div class="compare-item recommended">
        <div class="compare-header">
          <code>box-sizing: border-box</code>
          <span class="compare-tag recommend-tag">推荐</span>
        </div>
        <div class="compare-diagram">
          <div class="diagram-formula">
            <strong>width/height =</strong> content + padding + border
          </div>
          <div class="diagram-calc">
            元素实际宽度 = width（固定）
          </div>
        </div>
        <div class="compare-desc">
          <p><strong>优点：</strong>设置 <code>width: 100px</code>，元素就是 100px，padding/border 会压缩 content 区域，布局更直观。</p>
        </div>
      </div>
    </div>
    <div class="boxmodel-best-practice">
      <strong>最佳实践：</strong>
      <pre><code>*, *::before, *::after {
  box-sizing: border-box;
}</code></pre>
      <p>在项目开头全局设置，让所有元素使用 border-box，避免布局计算问题。</p>
    </div>
  `

  container.append(controls, visual, sizeInfo, explanation)

  // 初始渲染
  updateVisual()

  return container
}

// ============ BFC 演示 Demo ============

const createBfcDemo = (_config: BfcDemoConfig): HTMLElement => {
  const container = document.createElement('div')
  container.className = 'demo-panel demo-bfc'

  // 场景选择
  const scenarios = [
    {
      id: 'margin-collapse',
      name: 'margin 塌陷',
      description: '相邻元素的 margin 会合并，只取较大值',
      problem: `<div class="bfc-box" style="margin-bottom: 30px;">Box 1 (margin-bottom: 30px)</div>
<div class="bfc-box" style="margin-top: 20px;">Box 2 (margin-top: 20px)</div>
<p class="bfc-note">实际间距: 30px (不是 50px!)</p>`,
      solution: `<div class="bfc-wrapper">
  <div class="bfc-box" style="margin-bottom: 30px;">Box 1</div>
</div>
<div class="bfc-box" style="margin-top: 20px;">Box 2</div>
<p class="bfc-note">BFC 隔离后，间距: 50px</p>`,
    },
    {
      id: 'float-collapse',
      name: '浮动塌陷',
      description: '父元素高度无法包含浮动子元素',
      problem: `<div class="bfc-parent">
  <div class="bfc-float">浮动元素</div>
  <span>父元素高度塌陷了!</span>
</div>`,
      solution: `<div class="bfc-parent bfc-trigger">
  <div class="bfc-float">浮动元素</div>
  <span>父元素包含了浮动子元素</span>
</div>`,
    },
    {
      id: 'text-wrap',
      name: '文字环绕',
      description: '普通元素会环绕浮动元素，BFC 元素不会',
      problem: `<div class="bfc-container">
  <div class="bfc-float-left">浮动</div>
  <div class="bfc-text">这段文字会环绕在浮动元素周围，这是正常的浮动行为，文字会自动换行填充剩余空间。</div>
</div>`,
      solution: `<div class="bfc-container">
  <div class="bfc-float-left">浮动</div>
  <div class="bfc-text bfc-trigger">BFC 元素不会环绕浮动元素，而是独占一行，形成两列布局效果。</div>
</div>`,
    },
  ]

  let currentScenario = 0
  let showSolution = false

  // 场景切换
  const tabs = document.createElement('div')
  tabs.className = 'bfc-tabs'
  scenarios.forEach((s, idx) => {
    const tab = document.createElement('button')
    tab.className = `demo-btn ${idx === 0 ? 'is-active' : ''}`
    tab.textContent = s.name
    tab.addEventListener('click', () => {
      currentScenario = idx
      showSolution = false
      tabs.querySelectorAll('.demo-btn').forEach((t, i) => t.classList.toggle('is-active', i === idx))
      updateView()
    })
    tabs.appendChild(tab)
  })

  // 问题/解决方案切换
  const toggleArea = document.createElement('div')
  toggleArea.className = 'bfc-toggle'
  
  const toggleBtn = document.createElement('button')
  toggleBtn.className = 'demo-btn demo-btn--primary'
  toggleBtn.textContent = '显示 BFC 解决方案'
  toggleBtn.addEventListener('click', () => {
    showSolution = !showSolution
    toggleBtn.textContent = showSolution ? '显示问题' : '显示 BFC 解决方案'
    updateView()
  })
  toggleArea.appendChild(toggleBtn)

  // 展示区
  const display = document.createElement('div')
  display.className = 'bfc-display'

  // 说明区
  const explanation = document.createElement('div')
  explanation.className = 'bfc-explanation'

  const updateView = () => {
    const scenario = scenarios[currentScenario]
    
    display.innerHTML = `
      <div class="bfc-demo-area ${showSolution ? 'is-solution' : 'is-problem'}">
        <div class="bfc-label">${showSolution ? '✓ BFC 解决方案' : '✗ 问题现象'}</div>
        ${showSolution ? scenario.solution : scenario.problem}
      </div>
    `

    explanation.innerHTML = `
      <h4>${scenario.name}</h4>
      <p>${scenario.description}</p>
      ${showSolution ? `
        <div class="bfc-solution-code">
          <strong>触发 BFC 的方式：</strong>
          <code>overflow: hidden</code> 或 <code>display: flow-root</code>
        </div>
      ` : ''}
    `
  }

  // BFC 概念说明
  const concept = document.createElement('div')
  concept.className = 'bfc-concept'
  concept.innerHTML = `
    <h4>什么是 BFC？</h4>
    <p><strong>BFC (Block Formatting Context)</strong> 是一个<em>独立的渲染区域</em>。</p>
    <p>可以理解为：BFC 内部的元素和外部的元素<strong>互不影响</strong>。</p>
    <div class="bfc-triggers">
      <strong>触发 BFC 的常用方式：</strong>
      <ul>
        <li><code>overflow: hidden / auto / scroll</code></li>
        <li><code>display: flex / grid / flow-root</code></li>
        <li><code>float: left / right</code></li>
        <li><code>position: absolute / fixed</code></li>
      </ul>
    </div>
  `

  container.append(concept, tabs, toggleArea, display, explanation)
  updateView()

  return container
}

// ============ Grid 布局沙盒 Demo ============

const createGridPlaygroundDemo = (config: GridPlaygroundConfig): HTMLElement => {
  const container = document.createElement('div')
  container.className = 'demo-panel demo-grid-playground'

  const itemCount = config.itemCount || 6

  // 布局类型切换
  const layoutToggle = document.createElement('div')
  layoutToggle.className = 'layout-toggle'
  layoutToggle.innerHTML = `
    <span class="toggle-label">布局对比：</span>
    <button class="demo-btn is-active" data-layout="flex">Flex 一维</button>
    <button class="demo-btn" data-layout="grid">Grid 二维</button>
  `

  let currentLayout = 'flex'

  layoutToggle.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest('[data-layout]')
    if (!btn) {return}
    currentLayout = (btn as HTMLElement).dataset.layout || 'flex'
    layoutToggle.querySelectorAll('.demo-btn').forEach((b) => {
      b.classList.toggle('is-active', (b as HTMLElement).dataset.layout === currentLayout)
    })
    updateLayout()
  })

  // Flex 控制区
  const flexControls = document.createElement('div')
  flexControls.className = 'grid-controls flex-mode'
  flexControls.innerHTML = `
    <div class="control-group">
      <label>flex-direction:</label>
      <select class="demo-select" id="flex-dir">
        <option value="row">row</option>
        <option value="column">column</option>
      </select>
    </div>
    <div class="control-group">
      <label>flex-wrap:</label>
      <select class="demo-select" id="flex-wrap">
        <option value="nowrap">nowrap</option>
        <option value="wrap" selected>wrap</option>
      </select>
    </div>
    <div class="control-group">
      <label>justify-content:</label>
      <select class="demo-select" id="flex-justify">
        <option value="flex-start">flex-start</option>
        <option value="center">center</option>
        <option value="space-between">space-between</option>
      </select>
    </div>
  `

  // Grid 控制区
  const gridControls = document.createElement('div')
  gridControls.className = 'grid-controls grid-mode'
  gridControls.style.display = 'none'
  gridControls.innerHTML = `
    <div class="control-group">
      <label>grid-template-columns:</label>
      <select class="demo-select" id="grid-cols">
        <option value="1fr 1fr">1fr 1fr (2列)</option>
        <option value="1fr 1fr 1fr" selected>1fr 1fr 1fr (3列)</option>
        <option value="repeat(auto-fill, minmax(100px, 1fr))">auto-fill</option>
      </select>
    </div>
    <div class="control-group">
      <label>grid-template-rows:</label>
      <select class="demo-select" id="grid-rows">
        <option value="auto">auto</option>
        <option value="100px 100px">100px 100px</option>
      </select>
    </div>
    <div class="control-group">
      <label>gap:</label>
      <select class="demo-select" id="grid-gap">
        <option value="8px">8px</option>
        <option value="16px" selected>16px</option>
        <option value="24px">24px</option>
      </select>
    </div>
  `

  // 预览区
  const preview = document.createElement('div')
  preview.className = 'layout-preview'

  // 代码展示
  const codeDisplay = document.createElement('pre')
  codeDisplay.className = 'demo-code layout-code'

  // 对比说明
  const comparison = document.createElement('div')
  comparison.className = 'layout-comparison'

  const updateLayout = () => {
    preview.innerHTML = ''
    preview.className = `layout-preview ${currentLayout}-preview`

    for (let i = 0; i < itemCount; i++) {
      const item = document.createElement('div')
      item.className = 'layout-item'
      item.textContent = `${i + 1}`
      // 给某些 item 不同大小以展示差异
      if (i === 2) {item.classList.add('item-tall')}
      if (i === 4) {item.classList.add('item-wide')}
      preview.appendChild(item)
    }

    if (currentLayout === 'flex') {
      flexControls.style.display = 'flex'
      gridControls.style.display = 'none'

      const dir = (container.querySelector('#flex-dir') as HTMLSelectElement)?.value || 'row'
      const wrap = (container.querySelector('#flex-wrap') as HTMLSelectElement)?.value || 'wrap'
      const justify = (container.querySelector('#flex-justify') as HTMLSelectElement)?.value || 'flex-start'

      preview.style.cssText = `
        display: flex;
        flex-direction: ${dir};
        flex-wrap: ${wrap};
        justify-content: ${justify};
        gap: 12px;
      `

      codeDisplay.innerHTML = `<code>.container {
  display: flex;
  flex-direction: ${dir};
  flex-wrap: ${wrap};
  justify-content: ${justify};
  gap: 12px;
}</code>`

      comparison.innerHTML = `
        <div class="compare-note flex-note">
          <strong>Flex 特点（一维布局）：</strong>
          <ul>
            <li>只能控制<em>一个方向</em>（主轴）上的排列</li>
            <li>元素在交叉轴上<em>独立对齐</em>，不会形成网格</li>
            <li>适合：导航栏、按钮组、卡片列表</li>
          </ul>
        </div>
      `
    } else {
      flexControls.style.display = 'none'
      gridControls.style.display = 'flex'

      const cols = (container.querySelector('#grid-cols') as HTMLSelectElement)?.value || '1fr 1fr 1fr'
      const rows = (container.querySelector('#grid-rows') as HTMLSelectElement)?.value || 'auto'
      const gap = (container.querySelector('#grid-gap') as HTMLSelectElement)?.value || '16px'

      preview.style.cssText = `
        display: grid;
        grid-template-columns: ${cols};
        grid-template-rows: ${rows};
        gap: ${gap};
      `

      codeDisplay.innerHTML = `<code>.container {
  display: grid;
  grid-template-columns: ${cols};
  grid-template-rows: ${rows};
  gap: ${gap};
}</code>`

      comparison.innerHTML = `
        <div class="compare-note grid-note">
          <strong>Grid 特点（二维布局）：</strong>
          <ul>
            <li>同时控制<em>行和列</em>，形成真正的网格</li>
            <li>元素按网格单元格对齐，<em>结构整齐</em></li>
            <li>适合：页面整体布局、仪表盘、图片画廊</li>
          </ul>
        </div>
      `
    }
  }

  // 绑定控制事件
  flexControls.addEventListener('change', updateLayout)
  gridControls.addEventListener('change', updateLayout)

  container.append(layoutToggle, flexControls, gridControls, preview, codeDisplay, comparison)
  updateLayout()

  return container
}

// ============ CSS 性能演示 Demo ============

const createCssPerformanceDemo = (_config: CssPerformanceConfig): HTMLElement => {
  const container = document.createElement('div')
  container.className = 'demo-panel demo-css-performance'

  // 渲染流程图
  const pipelineSection = document.createElement('div')
  pipelineSection.className = 'perf-pipeline'
  pipelineSection.innerHTML = `
    <h4>浏览器渲染流程</h4>
    <div class="pipeline-flow">
      <div class="pipeline-step">
        <span class="step-name">JS</span>
        <span class="step-desc">修改样式</span>
      </div>
      <div class="pipeline-arrow">→</div>
      <div class="pipeline-step step-layout" id="step-layout">
        <span class="step-name">Layout</span>
        <span class="step-desc">计算位置</span>
      </div>
      <div class="pipeline-arrow">→</div>
      <div class="pipeline-step step-paint" id="step-paint">
        <span class="step-name">Paint</span>
        <span class="step-desc">绘制像素</span>
      </div>
      <div class="pipeline-arrow">→</div>
      <div class="pipeline-step step-composite" id="step-composite">
        <span class="step-name">Composite</span>
        <span class="step-desc">GPU合成</span>
      </div>
    </div>
  `

  // 属性分类啑
  const categories = [
    {
      type: 'layout',
      name: '触发 Reflow (重排)',
      color: '#ef4444',
      description: '改变几何属性，触发 Layout → Paint → Composite',
      properties: ['width', 'height', 'padding', 'margin', 'top', 'left', 'font-size', 'display'],
      impact: '性能开销最大，会重新计算所有元素位置',
      steps: ['layout', 'paint', 'composite'],
    },
    {
      type: 'paint',
      name: '触发 Repaint (重绘)',
      color: '#f59e0b',
      description: '改变外观属性，触发 Paint → Composite',
      properties: ['color', 'background', 'border-color', 'box-shadow', 'visibility'],
      impact: '中等开销，跳过 Layout，直接重绘',
      steps: ['paint', 'composite'],
    },
    {
      type: 'composite',
      name: '仅 Composite',
      color: '#22c55e',
      description: '只触发 GPU 合成，最优性能',
      properties: ['transform', 'opacity', 'filter', 'will-change'],
      impact: '性能最佳，不触发主线程计算',
      steps: ['composite'],
    },
  ]

  let currentCategory = 0

  // 分类选择
  const tabs = document.createElement('div')
  tabs.className = 'perf-tabs'
  categories.forEach((cat, idx) => {
    const tab = document.createElement('button')
    tab.className = `demo-btn ${idx === 0 ? 'is-active' : ''}`
    tab.style.borderColor = cat.color
    tab.innerHTML = `<span style="color:${cat.color}">●</span> ${cat.name}`
    tab.addEventListener('click', () => {
      currentCategory = idx
      tabs.querySelectorAll('.demo-btn').forEach((t, i) => t.classList.toggle('is-active', i === idx))
      updateView()
    })
    tabs.appendChild(tab)
  })

  // 详情区
  const detail = document.createElement('div')
  detail.className = 'perf-detail'

  // 演示区
  const demoArea = document.createElement('div')
  demoArea.className = 'perf-demo-area'
  demoArea.innerHTML = `
    <div class="perf-box" id="perf-box">点击按钮查看效果</div>
  `

  const demoControls = document.createElement('div')
  demoControls.className = 'perf-demo-controls'

  const updateView = () => {
    const cat = categories[currentCategory]

    // 更新流程图高亮
    const allSteps = pipelineSection.querySelectorAll('.pipeline-step')
    allSteps.forEach((step) => {
      step.classList.remove('is-active', 'is-skipped')
    })

    if (cat.type === 'layout') {
      pipelineSection.querySelector('#step-layout')?.classList.add('is-active')
      pipelineSection.querySelector('#step-paint')?.classList.add('is-active')
      pipelineSection.querySelector('#step-composite')?.classList.add('is-active')
    } else if (cat.type === 'paint') {
      pipelineSection.querySelector('#step-layout')?.classList.add('is-skipped')
      pipelineSection.querySelector('#step-paint')?.classList.add('is-active')
      pipelineSection.querySelector('#step-composite')?.classList.add('is-active')
    } else {
      pipelineSection.querySelector('#step-layout')?.classList.add('is-skipped')
      pipelineSection.querySelector('#step-paint')?.classList.add('is-skipped')
      pipelineSection.querySelector('#step-composite')?.classList.add('is-active')
    }

    // 更新详情
    detail.innerHTML = `
      <div class="perf-detail-header" style="border-color: ${cat.color}">
        <h4 style="color: ${cat.color}">${cat.name}</h4>
        <p>${cat.description}</p>
      </div>
      <div class="perf-properties">
        <strong>涉及属性：</strong>
        <div class="prop-list">
          ${cat.properties.map((p) => `<code>${p}</code>`).join('')}
        </div>
      </div>
      <div class="perf-impact ${cat.type}">
        <strong>性能影响：</strong>
        <p>${cat.impact}</p>
      </div>
    `

    // 更新演示按钮
    demoControls.innerHTML = ''
    if (cat.type === 'layout') {
      const btn1 = document.createElement('button')
      btn1.className = 'demo-btn'
      btn1.textContent = '改变 width (开销大)'
      btn1.addEventListener('click', () => animateBox('width'))
      
      const btn2 = document.createElement('button')
      btn2.className = 'demo-btn demo-btn--primary'
      btn2.textContent = '用 transform 替代 (推荐)'
      btn2.addEventListener('click', () => animateBox('transform-scale'))
      
      demoControls.append(btn1, btn2)
    } else if (cat.type === 'paint') {
      const btn1 = document.createElement('button')
      btn1.className = 'demo-btn'
      btn1.textContent = '改变 background'
      btn1.addEventListener('click', () => animateBox('background'))
      
      const btn2 = document.createElement('button')
      btn2.className = 'demo-btn demo-btn--primary'
      btn2.textContent = '用 opacity 替代'
      btn2.addEventListener('click', () => animateBox('opacity'))
      
      demoControls.append(btn1, btn2)
    } else {
      const btn1 = document.createElement('button')
      btn1.className = 'demo-btn demo-btn--primary'
      btn1.textContent = 'transform: translateX'
      btn1.addEventListener('click', () => animateBox('transform-x'))
      
      const btn2 = document.createElement('button')
      btn2.className = 'demo-btn demo-btn--primary'
      btn2.textContent = 'transform: rotate'
      btn2.addEventListener('click', () => animateBox('transform-rotate'))
      
      demoControls.append(btn1, btn2)
    }
  }

  const animateBox = (type: string) => {
    const box = container.querySelector('#perf-box') as HTMLElement
    if (!box) { return }

    // 重置
    box.style.cssText = ''
    box.className = 'perf-box'

    requestAnimationFrame(() => {
      switch (type) {
      case 'width':
        box.classList.add('anim-width')
        break
      case 'transform-scale':
        box.classList.add('anim-scale')
        break
      case 'background':
        box.classList.add('anim-bg')
        break
      case 'opacity':
        box.classList.add('anim-opacity')
        break
      case 'transform-x':
        box.classList.add('anim-translate')
        break
      case 'transform-rotate':
        box.classList.add('anim-rotate')
        break
      }
    })
  }

  // 最佳实践
  const bestPractice = document.createElement('div')
  bestPractice.className = 'perf-best-practice'
  bestPractice.innerHTML = `
    <h4>性能优化最佳实践</h4>
    <div class="practice-grid">
      <div class="practice-item bad">
        <div class="practice-label">✗ 避免</div>
        <pre><code>element.style.left = x + 'px'
element.style.top = y + 'px'</code></pre>
        <p>触发 Layout，性能差</p>
      </div>
      <div class="practice-item good">
        <div class="practice-label">✓ 推荐</div>
        <pre><code>element.style.transform = 
  \`translate(\${x}px, \${y}px)\`</code></pre>
        <p>仅 Composite，性能佳</p>
      </div>
    </div>
    <div class="practice-tip">
      <strong>强制同步布局（Layout Thrashing）</strong>
      <p>读取布局属性（如 offsetHeight）会强制浏览器立即计算布局。</p>
      <p>避免在循环中交替读写样式，应该先批量读取，再批量写入。</p>
    </div>
  `

  container.append(pipelineSection, tabs, detail, demoArea, demoControls, bestPractice)
  updateView()

  return container
}

// ============ 统一导出 ============

export const createLectureDemo = (config: DemoConfig): HTMLElement => {
  const wrapper = document.createElement('div')
  wrapper.className = 'lecture-demo'

  let demo: HTMLElement

  switch (config.type) {
  case 'renderPipeline':
    demo = createRenderPipelineDemo(config)
    break
  case 'domTreeBuilder':
    demo = createDomTreeBuilderDemo(config)
    break
  case 'cssCascade':
    demo = createCssCascadeDemo(config)
    break
  case 'flexPlayground':
    demo = createFlexPlaygroundDemo(config)
    break
  case 'gridPlayground':
    demo = createGridPlaygroundDemo(config)
    break
  case 'bfcDemo':
    demo = createBfcDemo(config)
    break
  case 'eventLoop':
    demo = createEventLoopDemo(config)
    break
  case 'promiseOrder':
    demo = createEventLoopDemo(config as EventLoopConfig) // 复用事件循环
    break
  case 'prototypeChain':
    demo = createPrototypeChainDemo(config)
    break
  case 'thisBinding':
    demo = createThisBindingDemo(config)
    break
  case 'closureMemory':
    demo = createClosureMemoryDemo(config)
    break
  case 'corsSimulator':
    demo = createCorsSimulatorDemo(config)
    break
  case 'boxModel':
    demo = createBoxModelDemo(config)
    break
  case 'cssPerformance':
    demo = createCssPerformanceDemo(config)
    break
  default:
    demo = document.createElement('div')
    demo.textContent = `Demo: ${(config as any).type}`
  }

  wrapper.appendChild(demo)
  return wrapper
}
