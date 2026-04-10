/**
 * 讲稿渲染器
 * 支持叙述、代码、流程图、Demo 流式展示
 */

import { ContentBlock, Lecture, LectureSection } from './lecture-types'
import { createLectureDemo } from './lecture-demos'

const MAX_SLIDE_WEIGHT = 9

type LectureSlide = {
  id: string
  section: LectureSection
  sectionIndex: number
  pageIndex: number
  pageCount: number
  topic: string
  blocks: ContentBlock[]
}

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

const getBlockWeight = (block: ContentBlock): number => {
  switch (block.type) {
  case 'demo':
    return 5
  case 'code':
    return block.code.split('\n').length > 6 ? 4 : 2
  case 'flow':
    return block.steps.length > 5 ? 3 : 2
  case 'bullets':
    return block.items.length > 4 ? 3 : 2
  default:
    return 1
  }
}

const getTopicFromBlock = (block: ContentBlock, fallback: string): string => {
  if (block.type === 'narrative') return block.content
  if (block.type === 'code') return block.caption || fallback
  if (block.type === 'bullets') return block.title || fallback
  if (block.type === 'checkpoint') return '课堂检查'
  if (block.type === 'transition') return '承上启下'
  if (block.type === 'demo') return '交互演示'
  return fallback
}

const shouldStartNewSlide = (currentBlocks: ContentBlock[], nextBlock: ContentBlock, currentWeight: number): boolean => {
  if (!currentBlocks.length) return false
  const lastBlock = currentBlocks[currentBlocks.length - 1]

  if (lastBlock.type === 'transition' || lastBlock.type === 'checkpoint') return true
  if (lastBlock.type === 'demo' && nextBlock.type !== 'transition') return true
  if (nextBlock.type === 'narrative' && nextBlock.emphasis === 'question') return true
  if (currentWeight + getBlockWeight(nextBlock) <= MAX_SLIDE_WEIGHT) return false

  return nextBlock.type !== 'transition'
}

const mergeTinyTailSlide = (slides: Omit<LectureSlide, 'pageCount'>[]): Omit<LectureSlide, 'pageCount'>[] => {
  if (slides.length < 2) return slides

  const lastSlide = slides[slides.length - 1]
  const tailWeight = lastSlide.blocks.reduce((sum, block) => sum + getBlockWeight(block), 0)
  const isTinyTail = lastSlide.blocks.length <= 2 && tailWeight <= 3
  if (!isTinyTail) return slides

  const previousSlide = slides[slides.length - 2]
  previousSlide.blocks.push(...lastSlide.blocks)
  return slides.slice(0, -1)
}

const createSectionSlides = (section: LectureSection, sectionIndex: number): Omit<LectureSlide, 'pageCount'>[] => {
  if (section.id === 'sec-1-opening') {
    return [{
      id: `${section.id}-page-1`,
      section,
      sectionIndex,
      pageIndex: 0,
      topic: section.title,
      blocks: section.blocks,
    }]
  }

  const slides: Omit<LectureSlide, 'pageCount'>[] = []
  let currentBlocks: ContentBlock[] = []
  let currentWeight = 0
  let currentTopic = section.title

  const pushSlide = () => {
    if (!currentBlocks.length) return
    slides.push({
      id: `${section.id}-page-${slides.length + 1}`,
      section,
      sectionIndex,
      pageIndex: slides.length,
      topic: currentTopic,
      blocks: currentBlocks,
    })
    currentBlocks = []
    currentWeight = 0
    currentTopic = section.title
  }

  section.blocks.forEach((block) => {
    if (block.type === 'demo' && currentBlocks.length === 1 && slides.length) {
      const previousSlide = slides[slides.length - 1]
      previousSlide.blocks.push(...currentBlocks, block)
      currentBlocks = []
      currentWeight = 0
      currentTopic = section.title
      return
    }

    if (shouldStartNewSlide(currentBlocks, block, currentWeight)) pushSlide()
    if (!currentBlocks.length) currentTopic = getTopicFromBlock(block, section.title)
    currentBlocks.push(block)
    currentWeight += getBlockWeight(block)
  })
  pushSlide()

  return mergeTinyTailSlide(slides)
}

const createLectureSlides = (lecture: Lecture): LectureSlide[] => {
  return lecture.sections.flatMap((section, sectionIndex) => {
    const sectionSlides = createSectionSlides(section, sectionIndex)
    const pageCount = Math.max(1, sectionSlides.length)
    return sectionSlides.map((slide, pageIndex) => ({
      ...slide,
      pageIndex,
      pageCount,
    }))
  })
}

const renderSlide = (slide: LectureSlide): HTMLElement => {
  const sectionEl = document.createElement('section')
  sectionEl.className = 'lecture-slide'
  sectionEl.id = slide.id

  const header = document.createElement('header')
  header.className = 'section-header'
  header.innerHTML = `
    <span class="section-num">${slide.sectionIndex + 1}</span>
    <div>
      <h2>${slide.section.title}</h2>
      <p>${slide.topic} · 第 ${slide.pageIndex + 1} / ${slide.pageCount} 页</p>
    </div>
  `
  sectionEl.appendChild(header)

  const content = document.createElement('div')
  content.className = 'section-content'

  slide.blocks.forEach((block) => {
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

const renderLectureToc = (lecture: Lecture, onJump?: (index: number) => void): HTMLElement => {
  const toc = document.createElement('nav')
  toc.className = 'lecture-toc'

  const title = document.createElement('h3')
  title.textContent = '课程大纲'
  toc.appendChild(title)

  const list = document.createElement('ol')
  lecture.sections.forEach((section, idx) => {
    const li = document.createElement('li')
    const link = document.createElement('button')
    link.type = 'button'
    link.className = 'lecture-toc__link'
    link.innerHTML = `
      <span class="toc-num">${idx + 1}</span>
      <span class="toc-title">${section.title}</span>
    `
    if (onJump) {
      link.addEventListener('click', () => onJump(idx))
    }
    li.appendChild(link)
    list.appendChild(li)
  })
  toc.appendChild(list)

  return toc
}

export const renderLecturePage = (container: HTMLElement, lecture: Lecture): void => {
  container.innerHTML = ''
  container.className = 'lecture-shell'

  const slides = createLectureSlides(lecture)
  let currentIndex = 0

  const viewport = document.createElement('div')
  viewport.className = 'lecture-viewport'

  const progress = document.createElement('div')
  progress.className = 'lecture-progress'

  const deck = document.createElement('main')
  deck.className = 'lecture-deck'

  const firstPageBySection = new Map<string, number>()
  slides.forEach((slide, index) => {
    if (!firstPageBySection.has(slide.section.id)) {
      firstPageBySection.set(slide.section.id, index + 1)
    }
  })

  const heroSlide = document.createElement('section')
  heroSlide.className = 'lecture-slide lecture-slide--hero is-active'
  heroSlide.appendChild(renderLectureHero(lecture))
  heroSlide.appendChild(renderLectureToc(lecture, (sectionIndex) => {
    const targetSection = lecture.sections[sectionIndex]
    const firstPage = firstPageBySection.get(targetSection.id)
    if (typeof firstPage === 'number') goTo(firstPage)
  }))
  deck.appendChild(heroSlide)

  slides.forEach((slide) => {
    deck.appendChild(renderSlide(slide))
  })

  const pageTotal = deck.children.length
  const pageNumber = document.createElement('div')
  pageNumber.className = 'lecture-page-number'

  const nav = document.createElement('nav')
  nav.className = 'lecture-nav'
  nav.innerHTML = `
    <button class="lecture-nav__button" type="button" data-action="prev" aria-label="上一页">←</button>
    <span class="lecture-nav__count"></span>
    <button class="lecture-nav__button" type="button" data-action="next" aria-label="下一页">→</button>
    <button class="lecture-nav__button" type="button" data-action="fullscreen" aria-label="全屏">⛶</button>
  `

  const pageCount = nav.querySelector('.lecture-nav__count')

  const goTo = (nextIndex: number) => {
    currentIndex = Math.max(0, Math.min(nextIndex, pageTotal - 1))
    Array.from(deck.children).forEach((slide, index) => {
      slide.classList.toggle('is-active', index === currentIndex)
    })
    progress.style.width = `${((currentIndex + 1) / pageTotal) * 100}%`
    pageNumber.textContent = `${String(currentIndex + 1).padStart(2, '0')} / ${String(pageTotal).padStart(2, '0')}`
    if (pageCount) pageCount.textContent = `${currentIndex + 1} / ${pageTotal}`
  }

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      viewport.requestFullscreen()
    }
  }

  nav.addEventListener('click', (event) => {
    const target = event.target as HTMLElement
    const action = target.dataset.action
    if (action === 'prev') goTo(currentIndex - 1)
    if (action === 'next') goTo(currentIndex + 1)
    if (action === 'fullscreen') toggleFullscreen()
  })

  document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') goTo(currentIndex - 1)
    if (event.key === 'ArrowRight' || event.key === ' ') goTo(currentIndex + 1)
  })

  viewport.appendChild(progress)
  viewport.appendChild(deck)
  viewport.appendChild(pageNumber)
  viewport.appendChild(nav)
  container.appendChild(viewport)
  goTo(0)
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
      <a href="src/pages/${lecture.id}.html" class="landing-card__link">进入课程</a>
    `
    grid.appendChild(card)
  })

  container.appendChild(grid)
}
