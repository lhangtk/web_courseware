/**
 * 讲稿渲染器
 * 支持叙述、代码、流程图、Demo 流式展示
 */

import { ContentBlock, Lecture, LectureSection } from './lecture-types'
import { createLectureDemo } from './lecture-demos'

// ============ 内容块渲染 ============

const renderNarrativeBlock = (block: Extract<ContentBlock, { type: 'narrative' }>): HTMLElement => {
  const el = document.createElement('p')
  el.className = 'lecture-narrative'
  if (block.emphasis === 'highlight') {
    el.classList.add('is-highlight')
  } else if (block.emphasis === 'question') {
    el.classList.add('is-question')
  }
  el.textContent = block.content
  return el
}

const renderCodeBlock = (block: Extract<ContentBlock, { type: 'code' }>): HTMLElement => {
  const wrapper = document.createElement('div')
  wrapper.className = 'lecture-code-block'

  if (block.caption) {
    const caption = document.createElement('div')
    caption.className = 'code-caption'
    caption.textContent = block.caption
    wrapper.appendChild(caption)
  }

  const pre = document.createElement('pre')
  pre.className = `lecture-code lang-${block.language}`
  const code = document.createElement('code')
  code.textContent = block.code
  pre.appendChild(code)
  wrapper.appendChild(pre)

  return wrapper
}

const renderBulletBlock = (block: Extract<ContentBlock, { type: 'bullets' }>): HTMLElement => {
  const wrapper = document.createElement('div')
  wrapper.className = 'lecture-bullets'

  if (block.title) {
    const title = document.createElement('strong')
    title.className = 'bullets-title'
    title.textContent = block.title
    wrapper.appendChild(title)
  }

  const ul = document.createElement('ul')
  block.items.forEach((item) => {
    const li = document.createElement('li')
    li.textContent = item
    ul.appendChild(li)
  })
  wrapper.appendChild(ul)

  return wrapper
}

const renderFlowBlock = (block: Extract<ContentBlock, { type: 'flow' }>): HTMLElement => {
  const wrapper = document.createElement('div')
  wrapper.className = `lecture-flow is-${block.direction || 'horizontal'}`

  block.steps.forEach((step, idx) => {
    const stepEl = document.createElement('div')
    stepEl.className = 'flow-step'
    stepEl.innerHTML = `<span class="step-num">${idx + 1}</span><span class="step-text">${step}</span>`
    wrapper.appendChild(stepEl)

    if (idx < block.steps.length - 1) {
      const arrow = document.createElement('div')
      arrow.className = 'flow-arrow'
      arrow.textContent = block.direction === 'vertical' ? '↓' : '→'
      wrapper.appendChild(arrow)
    }
  })

  return wrapper
}

const renderDemoBlock = (block: Extract<ContentBlock, { type: 'demo' }>): HTMLElement => {
  const wrapper = document.createElement('div')
  wrapper.className = 'lecture-demo-wrapper'

  const header = document.createElement('div')
  header.className = 'demo-header'
  header.innerHTML = `<span class="demo-badge">交互演示</span>`
  wrapper.appendChild(header)

  const demo = createLectureDemo(block.config)
  wrapper.appendChild(demo)

  return wrapper
}

const renderTransitionBlock = (block: Extract<ContentBlock, { type: 'transition' }>): HTMLElement => {
  const el = document.createElement('div')
  el.className = 'lecture-transition'
  el.innerHTML = `<span class="transition-icon">💡</span><span>${block.text}</span>`
  return el
}

const renderCheckpointBlock = (block: Extract<ContentBlock, { type: 'checkpoint' }>): HTMLElement => {
  const el = document.createElement('div')
  el.className = 'lecture-checkpoint'
  el.innerHTML = `<strong>✓ 检查点</strong><p>${block.question}</p>`
  return el
}

const renderContentBlock = (block: ContentBlock): HTMLElement => {
  switch (block.type) {
  case 'narrative':
    return renderNarrativeBlock(block)
  case 'code':
    return renderCodeBlock(block)
  case 'bullets':
    return renderBulletBlock(block)
  case 'flow':
    return renderFlowBlock(block)
  case 'demo':
    return renderDemoBlock(block)
  case 'transition':
    return renderTransitionBlock(block)
  case 'checkpoint':
    return renderCheckpointBlock(block)
  default:
    const unknown = document.createElement('div')
    unknown.textContent = `Unknown block type`
    return unknown
  }
}

// ============ 章节渲染 ============

const renderSection = (section: LectureSection, index: number): HTMLElement => {
  const sectionEl = document.createElement('section')
  sectionEl.className = 'lecture-section'
  sectionEl.id = section.id

  // 章节头
  const header = document.createElement('header')
  header.className = 'section-header'
  header.innerHTML = `
    <span class="section-num">${index + 1}</span>
    <h2>${section.title}</h2>
    <span class="section-duration">${section.duration} min</span>
  `
  sectionEl.appendChild(header)

  // 内容流
  const content = document.createElement('div')
  content.className = 'section-content'

  section.blocks.forEach((block) => {
    content.appendChild(renderContentBlock(block))
  })

  sectionEl.appendChild(content)

  return sectionEl
}

// ============ 讲稿页面渲染 ============

const renderLectureHero = (lecture: Lecture): HTMLElement => {
  const hero = document.createElement('header')
  hero.className = 'lecture-hero'

  hero.innerHTML = `
    <span class="lecture-label">${lecture.subtitle}</span>
    <h1>${lecture.title}</h1>
    <div class="lecture-meta">
      <span>总时长 ${lecture.totalDuration} 分钟</span>
      <span>|</span>
      <span>${lecture.sections.length} 个章节</span>
    </div>
  `

  return hero
}

const renderLectureToc = (lecture: Lecture): HTMLElement => {
  const toc = document.createElement('nav')
  toc.className = 'lecture-toc'

  const title = document.createElement('h3')
  title.textContent = '课程大纲'
  toc.appendChild(title)

  const list = document.createElement('ol')
  lecture.sections.forEach((section, idx) => {
    const li = document.createElement('li')
    li.innerHTML = `
      <a href="#${section.id}">
        <span class="toc-num">${idx + 1}</span>
        <span class="toc-title">${section.title}</span>
        <span class="toc-duration">${section.duration}m</span>
      </a>
    `
    list.appendChild(li)
  })
  toc.appendChild(list)

  return toc
}

export const renderLecturePage = (container: HTMLElement, lecture: Lecture): void => {
  container.innerHTML = ''
  container.className = 'lecture-shell'

  // Hero
  container.appendChild(renderLectureHero(lecture))

  // TOC
  container.appendChild(renderLectureToc(lecture))

  // Sections
  const main = document.createElement('main')
  main.className = 'lecture-main'

  lecture.sections.forEach((section, idx) => {
    main.appendChild(renderSection(section, idx))
  })

  container.appendChild(main)
}

// ============ 落地页（课程列表）============

export const renderLectureListPage = (container: HTMLElement, lectures: Lecture[]): void => {
  container.innerHTML = ''
  container.className = 'landing-shell'

  const hero = document.createElement('header')
  hero.className = 'landing-hero'
  hero.innerHTML = `
    <span>前端实验室</span>
    <h1>《前端核心概念与原理解析》</h1>
    <p>从浏览器渲染到 JavaScript 执行机制，用交互演示理解底层原理</p>
  `
  container.appendChild(hero)

  const grid = document.createElement('div')
  grid.className = 'landing-grid'

  lectures.forEach((lecture) => {
    const card = document.createElement('article')
    card.className = 'landing-card'
    card.innerHTML = `
      <p class="landing-card__meta">${lecture.subtitle}</p>
      <h2>${lecture.title}</h2>
      <ul>
        ${lecture.sections.map((s) => `<li>${s.title}</li>`).join('')}
      </ul>
      <a href="src/pages/lecture.html?id=${lecture.id}" class="landing-card__link">进入课程</a>
    `
    grid.appendChild(card)
  })

  container.appendChild(grid)
}
