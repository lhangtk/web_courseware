import {
  BoxModelLabDemo,
  BundleOptimizerDemo,
  CacheTunerDemo,
  DemoConfig,
  EventFlowLabDemo,
  EventLoopSimulatorDemo,
  FlexPlaygroundDemo,
  FormValidatorDemo,
  ImmutabilityLabDemo,
  MetricMonitorDemo,
  NetworkPlannerDemo,
  PrototypeExplorerDemo,
  ReflowEstimatorDemo,
  SemanticLabDemo,
  StageTimelineDemo,
  StateVisualizerDemo,
  TelemetryPanelDemo,
} from './types'

const createBaseCard = (config: DemoConfig) => {
  const container = document.createElement('div')
  container.className = 'interactive-demo'

  const header = document.createElement('div')
  header.className = 'interactive-demo__header'
  const title = document.createElement('h4')
  title.textContent = config.title
  const desc = document.createElement('p')
  desc.textContent = config.description
  header.append(title, desc)

  const body = document.createElement('div')
  body.className = 'interactive-demo__body'

  container.append(header, body)

  if (config.code) {
    const codeBlock = document.createElement('pre')
    codeBlock.className = 'demo-code'
    const code = document.createElement('code')
    code.textContent = config.code.trim()
    codeBlock.appendChild(code)
    container.appendChild(codeBlock)
  }

  return { container, body }
}

const createLabeledControl = (labelText: string, control: HTMLElement): HTMLElement => {
  const wrapper = document.createElement('label')
  wrapper.className = 'demo-control'
  const span = document.createElement('span')
  span.textContent = labelText
  wrapper.append(span, control)
  return wrapper
}

const createSelect = (options: string[]): HTMLSelectElement => {
  const select = document.createElement('select')
  options.forEach((value) => {
    const option = document.createElement('option')
    option.value = value
    option.textContent = value
    select.appendChild(option)
  })
  return select
}

const createQueuePanel = (label: string, list: HTMLElement): HTMLElement => {
  const panel = document.createElement('div')
  panel.className = 'queue-panel'
  const title = document.createElement('strong')
  title.textContent = label
  panel.append(title, list)
  return panel
}

const createStageTimeline = (config: StageTimelineDemo): HTMLElement => {
  const { container, body } = createBaseCard(config)
  const slider = document.createElement('input')
  slider.type = 'range'
  slider.min = '0'
  slider.max = String(config.stages.length - 1)
  slider.value = '0'
  slider.className = 'timeline-slider'

  const stagesList = document.createElement('div')
  stagesList.className = 'timeline-stages'

  const detail = document.createElement('div')
  detail.className = 'timeline-detail'
  const detailTitle = document.createElement('strong')
  const detailText = document.createElement('p')
  const detailDuration = document.createElement('span')
  detail.append(detailTitle, detailText, detailDuration)

  const renderStage = (index: number) => {
    detailTitle.textContent = config.stages[index].label
    detailText.textContent = config.stages[index].detail
    detailDuration.textContent = config.stages[index].duration ? `建议 ${config.stages[index].duration}` : ''
    Array.from(stagesList.children).forEach((node, idx) => {
      node.classList.toggle('is-active', idx === index)
    })
    slider.value = String(index)
  }

  config.stages.forEach((stage, index) => {
    const stageItem = document.createElement('div')
    stageItem.className = 'timeline-stage'
    stageItem.textContent = stage.label
    stageItem.addEventListener('click', () => renderStage(index))
    stagesList.appendChild(stageItem)
  })

  slider.addEventListener('input', (event) => {
    const value = Number((event.target as HTMLInputElement).value)
    renderStage(value)
  })

  renderStage(0)

  body.append(slider, stagesList, detail)
  return container
}

const createBoxModelLab = (config: BoxModelLabDemo): HTMLElement => {
  const { container, body } = createBaseCard(config)
  const controls = document.createElement('div')
  controls.className = 'demo-controls'

  const select = document.createElement('select')
  select.className = 'demo-select'
  config.presets.forEach((preset, index) => {
    const option = document.createElement('option')
    option.value = String(index)
    option.textContent = preset.label
    select.appendChild(option)
  })

  const marginInput = document.createElement('input')
  marginInput.type = 'range'
  marginInput.min = '0'
  marginInput.max = '64'
  marginInput.value = String(config.presets[0].margin)

  const paddingInput = document.createElement('input')
  paddingInput.type = 'range'
  paddingInput.min = '0'
  paddingInput.max = '64'
  paddingInput.value = String(config.presets[0].padding)

  const borderInput = document.createElement('input')
  borderInput.type = 'range'
  borderInput.min = '0'
  borderInput.max = '20'
  borderInput.value = String(config.presets[0].border)

  const sample = document.createElement('div')
  sample.className = 'box-model-lab'
  const sampleBox = document.createElement('div')
  sampleBox.className = 'box-model-lab__box'
  sample.appendChild(sampleBox)

  const updateBox = () => {
    sampleBox.style.margin = `${marginInput.value}px`
    sampleBox.style.padding = `${paddingInput.value}px`
    sampleBox.style.borderWidth = `${borderInput.value}px`
  }

  select.addEventListener('change', () => {
    const preset = config.presets[Number(select.value)]
    marginInput.value = String(preset.margin)
    paddingInput.value = String(preset.padding)
    borderInput.value = String(preset.border)
    updateBox()
  })

  ;[marginInput, paddingInput, borderInput].forEach((input) => {
    input.addEventListener('input', updateBox)
  })

  controls.append(
    createLabeledControl('方案', select),
    createLabeledControl('Margin', marginInput),
    createLabeledControl('Padding', paddingInput),
    createLabeledControl('Border', borderInput)
  )

  updateBox()
  body.append(controls, sample)
  return container
}

const createFlexPlayground = (config: FlexPlaygroundDemo): HTMLElement => {
  const { container, body } = createBaseCard(config)
  const controls = document.createElement('div')
  controls.className = 'demo-controls'

  const directionSelect = createSelect(config.directions)
  const alignSelect = createSelect(config.alignments)
  const justifySelect = createSelect(config.justifications)

  const gapInput = document.createElement('input')
  gapInput.type = 'range'
  gapInput.min = '0'
  gapInput.max = '48'
  gapInput.value = '12'

  const preview = document.createElement('div')
  preview.className = 'flex-playground'
  const renderPreviewItems = () => {
    preview.innerHTML = ''
    const count = directionSelect.value === 'column' ? 3 : 4
    for (let i = 0; i < count; i += 1) {
      const item = document.createElement('div')
      item.className = 'flex-playground__item'
      item.textContent = `item ${i + 1}`
      preview.appendChild(item)
    }
  }

  const updatePreview = () => {
    preview.style.flexDirection = directionSelect.value
    preview.style.alignItems = alignSelect.value
    preview.style.justifyContent = justifySelect.value
    preview.style.gap = `${gapInput.value}px`
  }

  ;[directionSelect, alignSelect, justifySelect, gapInput].forEach((node) => {
    node.addEventListener('input', () => {
      renderPreviewItems()
      updatePreview()
    })
  })

  renderPreviewItems()
  updatePreview()

  controls.append(
    createLabeledControl('主轴', directionSelect),
    createLabeledControl('交叉轴对齐', alignSelect),
    createLabeledControl('主轴对齐', justifySelect),
    createLabeledControl('间距 (px)', gapInput)
  )

  body.append(controls, preview)
  return container
}

const createSemanticLab = (config: SemanticLabDemo): HTMLElement => {
  const { container, body } = createBaseCard(config)
  const select = document.createElement('select')
  config.samples.forEach((sample, index) => {
    const option = document.createElement('option')
    option.value = String(index)
    option.textContent = sample.label
    select.appendChild(option)
  })

  const preview = document.createElement('div')
  preview.className = 'semantic-preview'
  const description = document.createElement('p')
  description.className = 'semantic-description'

  const render = (index: number) => {
    const sample = config.samples[index]
    preview.innerHTML = sample.markup
    description.textContent = sample.description
  }

  select.addEventListener('change', () => {
    render(Number(select.value))
  })

  render(0)
  body.append(createLabeledControl('语义片段', select), preview, description)
  return container
}

const createFormValidator = (config: FormValidatorDemo): HTMLElement => {
  const { container, body } = createBaseCard(config)
  const form = document.createElement('form')
  form.className = 'form-validator'
  form.addEventListener('submit', (event) => event.preventDefault())

  const inputs: HTMLInputElement[] = []
  config.fields.forEach((field) => {
    const wrapper = document.createElement('label')
    wrapper.className = 'demo-control'
    const span = document.createElement('span')
    span.textContent = field.label
    const input = document.createElement('input')
    input.type = field.type
    input.placeholder = field.placeholder
    if (field.required) {
      input.required = true
    }
    if (field.pattern) {
      input.pattern = field.pattern
    }
    wrapper.append(span, input)
    if (field.hint) {
      const hint = document.createElement('small')
      hint.textContent = field.hint
      hint.className = 'form-validator__hint'
      wrapper.appendChild(hint)
    }
    form.appendChild(wrapper)
    inputs.push(input)
  })

  const statusList = document.createElement('ul')
  statusList.className = 'form-validator__status'

  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'demo-btn demo-btn--primary'
  button.textContent = '检查有效性'
  button.addEventListener('click', () => {
    statusList.innerHTML = ''
    inputs.forEach((input, index) => {
      const li = document.createElement('li')
      const valid = input.reportValidity()
      li.textContent = `${config.fields[index].label}: ${valid ? '通过' : '未通过'}`
      li.dataset.state = valid ? 'pass' : 'fail'
      statusList.appendChild(li)
    })
  })

  body.append(form, button, statusList)
  return container
}

const createEventFlowLab = (config: EventFlowLabDemo): HTMLElement => {
  const { container, body } = createBaseCard(config)
  const modeSelect = document.createElement('select')
  config.modes.forEach((mode, index) => {
    const option = document.createElement('option')
    option.value = String(index)
    option.textContent = mode.label
    modeSelect.appendChild(option)
  })

  const sandbox = document.createElement('div')
  sandbox.className = 'event-flow-lab'
  const outer = document.createElement('div')
  outer.className = 'event-flow-lab__layer'
  outer.dataset.layer = 'outer'
  outer.textContent = 'outer'
  const middle = document.createElement('div')
  middle.className = 'event-flow-lab__layer'
  middle.dataset.layer = 'middle'
  middle.textContent = 'middle'
  const inner = document.createElement('button')
  inner.className = 'event-flow-lab__layer event-flow-lab__trigger'
  inner.dataset.layer = 'inner'
  inner.textContent = 'inner (click me)'

  middle.appendChild(inner)
  outer.appendChild(middle)
  sandbox.appendChild(outer)

  const logList = document.createElement('ol')
  logList.className = 'event-flow-log'

  const appendLog = (text: string, phase: string) => {
    const item = document.createElement('li')
    item.textContent = `${phase} → ${text}`
    logList.prepend(item)
    while (logList.children.length > 6) {
      logList.removeChild(logList.lastChild as ChildNode)
    }
  }

  const getMode = () => config.modes[Number(modeSelect.value)]

  const listener = (layer: string, phase: 'capture' | 'bubble') => (event: Event) => {
    const mode = getMode()
    if (mode.captureOnly && phase === 'bubble') {
      return
    }
    appendLog(layer, phase)
    if (mode.stopAt === layer) {
      event.stopPropagation()
      appendLog(`${layer} stopPropagation`, '控制')
    }
  }

  outer.addEventListener('click', listener('outer', 'capture'), true)
  outer.addEventListener('click', listener('outer', 'bubble'))
  middle.addEventListener('click', listener('middle', 'capture'), true)
  middle.addEventListener('click', listener('middle', 'bubble'))
  inner.addEventListener('click', listener('inner', 'capture'), true)
  inner.addEventListener('click', listener('inner', 'bubble'))

  const modeDescription = document.createElement('p')
  modeDescription.className = 'event-flow-mode'
  const syncModeDescription = () => {
    modeDescription.textContent = config.modes[Number(modeSelect.value)].description
  }
  modeSelect.addEventListener('change', syncModeDescription)
  syncModeDescription()

  body.append(createLabeledControl('模式', modeSelect), sandbox, modeDescription, logList)
  return container
}

const createEventLoopSimulator = (config: EventLoopSimulatorDemo): HTMLElement => {
  const { container, body } = createBaseCard(config)
  const macroQueue: string[] = []
  const microQueue: string[] = []

  const macroList = document.createElement('ul')
  macroList.className = 'task-queue'
  const microList = document.createElement('ul')
  microList.className = 'task-queue task-queue--micro'
  const resultList = document.createElement('ol')
  resultList.className = 'event-loop-log'

  const updateQueueView = () => {
    macroList.innerHTML = ''
    macroQueue.forEach((task) => {
      const item = document.createElement('li')
      item.textContent = task
      macroList.appendChild(item)
    })
    microList.innerHTML = ''
    microQueue.forEach((task) => {
      const item = document.createElement('li')
      item.textContent = task
      microList.appendChild(item)
    })
  }

  const addTask = (label: string, type: 'macro' | 'micro') => {
    const targetQueue = type === 'macro' ? macroQueue : microQueue
    targetQueue.push(`${type === 'macro' ? '宏' : '微'} · ${label}`)
    updateQueueView()
  }

  config.presets.forEach((preset) => {
    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'demo-btn'
    button.textContent = `加入 ${preset.label}`
    button.addEventListener('click', () => addTask(preset.label, preset.type))
    body.appendChild(button)
  })

  const flushMicroTasks = (log: string[]) => {
    while (microQueue.length > 0) {
      const task = microQueue.shift()
      if (task) {
        log.push(task)
      }
    }
  }

  const runLoopButton = document.createElement('button')
  runLoopButton.type = 'button'
  runLoopButton.className = 'demo-btn demo-btn--primary'
  runLoopButton.textContent = '执行一帧事件循环'
  runLoopButton.addEventListener('click', () => {
    const log: string[] = []
    if (macroQueue.length === 0 && microQueue.length === 0) {
      log.push('空闲帧，无任务执行')
    }
    while (macroQueue.length > 0) {
      const macro = macroQueue.shift()
      if (macro) {
        log.push(macro)
      }
      flushMicroTasks(log)
      log.push('渲染帧提交')
    }
    if (microQueue.length > 0) {
      log.push('无宏任务，直接清空微任务')
      flushMicroTasks(log)
    }
    resultList.innerHTML = ''
    log.forEach((entry) => {
      const item = document.createElement('li')
      item.textContent = entry
      resultList.appendChild(item)
    })
    updateQueueView()
  })

  body.append(
    createQueuePanel('宏任务队列', macroList),
    createQueuePanel('微任务队列', microList),
    runLoopButton,
    resultList
  )

  return container
}

const createMetricMonitor = (config: MetricMonitorDemo): HTMLElement => {
  const { container, body } = createBaseCard(config)
  config.metrics.forEach((metric) => {
    const slider = document.createElement('input')
    slider.type = 'range'
    slider.min = '0'
    slider.max = String(metric.max)
    slider.value = String(metric.defaultValue)

    const valueLabel = document.createElement('span')
    valueLabel.className = 'metric-value'

    const statusBadge = document.createElement('span')
    statusBadge.className = 'metric-status'

    const updateMetric = () => {
      const value = Number(slider.value)
      valueLabel.textContent = `${value}${metric.unit}`
      let level = 'good'
      if (value > metric.warning) {
        level = 'bad'
      } else if (value > metric.good) {
        level = 'warn'
      }
      statusBadge.textContent = level === 'good' ? '达标' : level === 'warn' ? '需关注' : '警告'
      statusBadge.dataset.level = level
    }

    slider.addEventListener('input', updateMetric)
    updateMetric()

    const metricRow = document.createElement('div')
    metricRow.className = 'metric-row'
    const label = document.createElement('label')
    label.textContent = metric.label
    metricRow.append(label, slider, valueLabel, statusBadge)
    body.appendChild(metricRow)
  })
  return container
}

const createReflowEstimator = (config: ReflowEstimatorDemo): HTMLElement => {
  const { container, body } = createBaseCard(config)
  const nodeInput = document.createElement('input')
  nodeInput.type = 'range'
  nodeInput.min = '50'
  nodeInput.max = '2000'
  nodeInput.value = '400'

  const typeSelect = document.createElement('select')
  ;['layout', 'paint', 'composite'].forEach((option) => {
    const opt = document.createElement('option')
    opt.value = option
    opt.textContent = option
    typeSelect.appendChild(opt)
  })

  const result = document.createElement('div')
  result.className = 'reflow-result'

  const updateResult = () => {
    const nodes = Number(nodeInput.value)
    const type = typeSelect.value as 'layout' | 'paint' | 'composite'
    const multiplier = config.multipliers[type]
    const cost = Math.round(nodes * config.baseCost * multiplier)
    const level = cost > 1200 ? '高' : cost > 600 ? '中' : '低'
    result.innerHTML = `<strong>${level} 代价</strong><p>估算周期：${cost} 单位</p>`
  }

  nodeInput.addEventListener('input', updateResult)
  typeSelect.addEventListener('change', updateResult)
  updateResult()

  body.append(createLabeledControl('节点数量', nodeInput), createLabeledControl('变更类型', typeSelect), result)
  return container
}

const createBundleOptimizer = (config: BundleOptimizerDemo): HTMLElement => {
  const { container, body } = createBaseCard(config)
  const list = document.createElement('ul')
  list.className = 'bundle-list'
  const summary = document.createElement('div')
  summary.className = 'bundle-summary'

  const state = new Map<string, boolean>()
  config.modules.forEach((module) => {
    state.set(module.name, !module.lazy)
  })

  const updateSummary = () => {
    let eager = 0
    let lazy = 0
    config.modules.forEach((module) => {
      if (state.get(module.name)) {
        eager += module.size
      } else {
        lazy += module.size
      }
    })
    summary.innerHTML = `<strong>关键体积：${eager} KB</strong><p>延迟体积：${lazy} KB</p>`
  }

  config.modules.forEach((module) => {
    const item = document.createElement('li')
    item.className = 'bundle-item'
    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.checked = state.get(module.name) ?? true
    checkbox.addEventListener('change', () => {
      state.set(module.name, checkbox.checked)
      updateSummary()
    })
    const label = document.createElement('label')
    label.textContent = `${module.name} · ${module.size}KB`
    const meta = document.createElement('small')
    meta.textContent = module.benefit
    item.append(checkbox, label, meta)
    list.appendChild(item)
  })

  updateSummary()
  body.append(list, summary)
  return container
}

const createNetworkPlanner = (config: NetworkPlannerDemo): HTMLElement => {
  const { container, body } = createBaseCard(config)
  const bandwidthInput = document.createElement('input')
  bandwidthInput.type = 'range'
  bandwidthInput.min = '256'
  bandwidthInput.max = '4096'
  bandwidthInput.value = '1024'

  const concurrencyInput = document.createElement('input')
  concurrencyInput.type = 'range'
  concurrencyInput.min = '1'
  concurrencyInput.max = '6'
  concurrencyInput.value = '3'

  const summary = document.createElement('div')
  summary.className = 'network-summary'

  const table = document.createElement('table')
  table.className = 'network-table'
  const head = document.createElement('thead')
  head.innerHTML = '<tr><th>资源</th><th>大小 (KB)</th><th>优先级</th></tr>'
  table.appendChild(head)
  const tbody = document.createElement('tbody')
  config.assets.forEach((asset) => {
    const row = document.createElement('tr')
    row.innerHTML = `<td>${asset.name}</td><td>${asset.size}</td><td>${asset.priority}</td>`
    tbody.appendChild(row)
  })
  table.appendChild(tbody)

  const calcTime = (priority: 'critical' | 'deferred') => {
    const totalSize = config.assets
      .filter((asset) => asset.priority === priority)
      .reduce((acc, curr) => acc + curr.size, 0)
    const bandwidth = Number(bandwidthInput.value)
    const concurrency = Number(concurrencyInput.value)
    const seconds = (totalSize * 8) / (bandwidth * concurrency)
    return { totalSize, seconds: Number(seconds.toFixed(2)) }
  }

  const updateSummary = () => {
    const critical = calcTime('critical')
    const deferred = calcTime('deferred')
    summary.innerHTML = `
      <p>关键路径体积：${critical.totalSize}KB · 估算 ${critical.seconds}s</p>
      <p>延迟资源体积：${deferred.totalSize}KB · 估算 ${deferred.seconds}s</p>
    `
  }

  bandwidthInput.addEventListener('input', updateSummary)
  concurrencyInput.addEventListener('input', updateSummary)
  updateSummary()

  body.append(
    createLabeledControl('带宽 (kbps)', bandwidthInput),
    createLabeledControl('并发数', concurrencyInput),
    summary,
    table
  )

  return container
}

const createStateVisualizer = (config: StateVisualizerDemo): HTMLElement => {
  const { container, body } = createBaseCard(config)
  const buttonsWrapper = document.createElement('div')
  buttonsWrapper.className = 'state-buttons'
  const canvas = document.createElement('div')
  canvas.className = 'state-visualizer'

  const renderFlow = (index: number) => {
    const flow = config.flows[index]
    canvas.innerHTML = ''
    const title = document.createElement('strong')
    title.textContent = flow.label
    const desc = document.createElement('p')
    desc.textContent = flow.description
    const diagram = document.createElement('div')
    diagram.className = 'state-diagram'
    diagram.dataset.direction = flow.direction
    if (flow.direction === 'one-way') {
      diagram.textContent = 'State → View → Action → Reducer'
    } else if (flow.direction === 'two-way') {
      diagram.textContent = 'Model ↔ View'
    } else {
      diagram.textContent = 'Event Bus ⇄ 多监听者'
    }
    canvas.append(title, desc, diagram)
  }

  config.flows.forEach((flow, index) => {
    const btn = document.createElement('button')
    btn.type = 'button'
    btn.className = 'demo-btn'
    btn.textContent = flow.label
    btn.addEventListener('click', () => renderFlow(index))
    buttonsWrapper.appendChild(btn)
  })

  renderFlow(0)
  body.append(buttonsWrapper, canvas)
  return container
}

const createImmutabilityLab = (config: ImmutabilityLabDemo): HTMLElement => {
  const { container, body } = createBaseCard(config)
  const sizeSelect = document.createElement('select')
  config.datasetSizes.forEach((size) => {
    const option = document.createElement('option')
    option.value = String(size)
    option.textContent = `${size} 条记录`
    sizeSelect.appendChild(option)
  })

  const result = document.createElement('div')
  result.className = 'immutability-result'

  const runSimulation = () => {
    const size = Number(sizeSelect.value)
    const baseline = Array.from({ length: size }, (_, index) => index)
    const mutationStart = performance.now()
    const mutable = [...baseline]
    for (let i = 0; i < mutable.length; i += Math.max(1, Math.floor(size / 20))) {
      mutable[i] = mutable[i] + 1
    }
    const mutationCost = performance.now() - mutationStart

    const immutableStart = performance.now()
    const copied = baseline.map((value, index) => (index % 3 === 0 ? value + 1 : value))
    const immutableCost = performance.now() - immutableStart

    result.innerHTML = `
      <p>可变更新：${mutationCost.toFixed(2)}ms</p>
      <p>不可变更新：${immutableCost.toFixed(2)}ms</p>
      <p>差异：${(immutableCost - mutationCost).toFixed(2)}ms</p>
    `
  }

  const simulateButton = document.createElement('button')
  simulateButton.type = 'button'
  simulateButton.className = 'demo-btn demo-btn--primary'
  simulateButton.textContent = '运行模拟'
  simulateButton.addEventListener('click', runSimulation)

  body.append(createLabeledControl('数据规模', sizeSelect), simulateButton, result)
  return container
}

const createPrototypeExplorer = (config: PrototypeExplorerDemo): HTMLElement => {
  const { container, body } = createBaseCard(config)
  const chainList = document.createElement('ul')
  chainList.className = 'prototype-chain'
  config.chain.forEach((node) => {
    const item = document.createElement('li')
    const name = document.createElement('strong')
    name.textContent = node.name
    const props = document.createElement('span')
    props.textContent = node.properties.join(', ')
    item.append(name, props)
    chainList.appendChild(item)
  })

  const input = document.createElement('input')
  input.type = 'text'
  input.placeholder = '输入要查找的属性，如 toString'

  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'demo-btn demo-btn--primary'
  button.textContent = '沿原型链查找'

  const logList = document.createElement('ol')
  logList.className = 'prototype-log'

  const runLookup = () => {
    const prop = input.value.trim()
    if (!prop) {
      return
    }
    logList.innerHTML = ''
    let found = false
    config.chain.forEach((node) => {
      const item = document.createElement('li')
      const hasProp = node.properties.includes(prop)
      item.textContent = `${node.name}.${prop} ${hasProp ? '→ 命中' : '→ 未定义'}`
      if (hasProp && !found) {
        item.classList.add('is-hit')
        found = true
      }
      logList.appendChild(item)
    })
    if (!found) {
      const item = document.createElement('li')
      item.textContent = `${prop} 未在原型链上找到，返回 undefined`
      logList.appendChild(item)
    }
  }

  button.addEventListener('click', runLookup)

  body.append(chainList, createLabeledControl('属性名', input), button, logList)
  return container
}

const createCacheTuner = (config: CacheTunerDemo): HTMLElement => {
  const { container, body } = createBaseCard(config)
  const select = document.createElement('select')
  config.strategies.forEach((strategy, index) => {
    const option = document.createElement('option')
    option.value = String(index)
    option.textContent = strategy.name
    select.appendChild(option)
  })

  const code = document.createElement('pre')
  code.className = 'cache-code'
  const hint = document.createElement('p')

  const render = () => {
    const strategy = config.strategies[Number(select.value)]
    code.textContent = strategy.header
    hint.textContent = `${strategy.hitHint} · 推荐 TTL ${strategy.ttl} 天`
  }

  select.addEventListener('change', render)
  render()

  body.append(createLabeledControl('策略', select), code, hint)
  return container
}

const createTelemetryPanel = (config: TelemetryPanelDemo): HTMLElement => {
  const { container, body } = createBaseCard(config)
  const rateInput = document.createElement('input')
  rateInput.type = 'range'
  rateInput.min = '1'
  rateInput.max = '100'
  rateInput.value = String(config.defaultRate)

  const summary = document.createElement('div')
  summary.className = 'telemetry-summary'

  const update = () => {
    const rate = Number(rateInput.value)
    const baseEvents = 5000
    const sampled = Math.round((baseEvents * rate) / 100)
    summary.innerHTML = `
      <p>采样率：${rate}%</p>
      <p>预计上传：${sampled} 事件/分钟</p>
      <p>建议：${rate > 60 ? '关注成本' : rate < 10 ? '注意覆盖率' : '覆盖与成本平衡'}</p>
    `
  }

  rateInput.addEventListener('input', update)
  update()

  body.append(createLabeledControl('采样率', rateInput), summary)
  return container
}


export const createDemoElement = (config: DemoConfig): HTMLElement => {
  switch (config.type) {
  case 'stageTimeline':
    return createStageTimeline(config)
  case 'boxModelLab':
    return createBoxModelLab(config)
  case 'flexPlayground':
    return createFlexPlayground(config)
  case 'semanticLab':
    return createSemanticLab(config)
  case 'formValidator':
    return createFormValidator(config)
  case 'eventFlowLab':
    return createEventFlowLab(config)
  case 'eventLoopSimulator':
    return createEventLoopSimulator(config)
  case 'metricMonitor':
    return createMetricMonitor(config)
  case 'reflowEstimator':
    return createReflowEstimator(config)
  case 'bundleOptimizer':
    return createBundleOptimizer(config)
  case 'networkPlanner':
  case 'lazyLoadPlanner':
    return createNetworkPlanner(config)
  case 'stateVisualizer':
    return createStateVisualizer(config)
  case 'immutabilityLab':
    return createImmutabilityLab(config)
  case 'prototypeExplorer':
    return createPrototypeExplorer(config)
  case 'cacheTuner':
    return createCacheTuner(config)
  case 'telemetryPanel':
    return createTelemetryPanel(config)
  default:
    return document.createElement('div')
  }
}
