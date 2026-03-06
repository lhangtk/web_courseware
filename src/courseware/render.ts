import { createDemoElement } from './demos'
import { Chapter, CourseSession, KnowledgePoint } from './types'

const createHero = (session: CourseSession): HTMLElement => {
  const hero = document.createElement('section')
  hero.className = 'course-hero'
  const label = document.createElement('span')
  label.className = 'course-hero__label'
  label.textContent = session.sessionLabel
  const title = document.createElement('h1')
  title.textContent = session.title
  const theme = document.createElement('p')
  theme.className = 'course-hero__theme'
  theme.textContent = session.theme
  const summary = document.createElement('p')
  summary.className = 'course-hero__summary'
  summary.textContent = session.summary
  hero.append(label, title, theme, summary)
  return hero
}

const createMetaSection = (title: string, items: string[]): HTMLElement => {
  const section = document.createElement('div')
  section.className = 'course-meta__section'
  const heading = document.createElement('strong')
  heading.textContent = title
  const list = document.createElement('ul')
  items.forEach((item) => {
    const li = document.createElement('li')
    li.textContent = item
    list.appendChild(li)
  })
  section.append(heading, list)
  return section
}

const createMetaGrid = (session: CourseSession): HTMLElement => {
  const meta = document.createElement('section')
  meta.className = 'course-meta'
  meta.append(
    createMetaSection('学习收获', session.takeaways),
    createMetaSection('上课前准备', session.prerequisites),
    createMetaSection('课堂工具包', session.toolkit)
  )
  return meta
}

const createTimeline = (session: CourseSession): HTMLElement => {
  const timeline = document.createElement('section')
  timeline.className = 'course-timeline'
  const heading = document.createElement('h2')
  heading.textContent = '课堂节奏'
  const list = document.createElement('ol')
  let accumulated = 0
  session.chapters.forEach((chapter) => {
    const item = document.createElement('li')
    accumulated += chapter.duration
    item.innerHTML = `<div><strong>${chapter.title}</strong><p>${chapter.focus}</p></div><span>${chapter.duration} min · ${accumulated}/${session.duration}</span>`
    list.appendChild(item)
  })
  timeline.append(heading, list)
  return timeline
}

const createKnowledgeCard = (knowledgePoint: KnowledgePoint): HTMLElement => {
  const card = document.createElement('article')
  card.className = 'knowledge-card'
  const header = document.createElement('header')
  const title = document.createElement('h3')
  title.textContent = knowledgePoint.title
  const duration = document.createElement('span')
  duration.className = 'chip'
  duration.textContent = `${knowledgePoint.duration} min`
  header.append(title, duration)

  const problem = document.createElement('p')
  problem.className = 'knowledge-card__problem'
  problem.textContent = knowledgePoint.problem

  const guide = document.createElement('p')
  guide.className = 'knowledge-card__guide'
  guide.textContent = knowledgePoint.guide

  const explanation = document.createElement('p')
  explanation.className = 'knowledge-card__explanation'
  explanation.textContent = knowledgePoint.explanation

  const demo = createDemoElement(knowledgePoint.demo)
  card.append(header, problem, guide, explanation, demo)

  if (knowledgePoint.nextStep) {
    const next = document.createElement('p')
    next.className = 'knowledge-card__next'
    next.textContent = knowledgePoint.nextStep
    card.appendChild(next)
  }
  return card
}

const createChapterSection = (chapter: Chapter): HTMLElement => {
  const section = document.createElement('section')
  section.className = 'chapter-section'
  const header = document.createElement('div')
  header.className = 'chapter-header'
  const title = document.createElement('h2')
  title.textContent = chapter.title
  const subtitle = document.createElement('p')
  subtitle.className = 'chapter-subtitle'
  subtitle.textContent = chapter.focus
  const duration = document.createElement('span')
  duration.className = 'chip chip--outline'
  duration.textContent = `${chapter.duration} min`
  header.append(title, duration)

  const intro = document.createElement('p')
  intro.className = 'chapter-intro'
  intro.textContent = chapter.intro

  const narrative = document.createElement('p')
  narrative.className = 'chapter-narrative'
  narrative.textContent = chapter.narrative

  const guide = document.createElement('p')
  guide.className = 'chapter-guide'
  guide.textContent = chapter.guide

  const knowledgeWrapper = document.createElement('div')
  knowledgeWrapper.className = 'knowledge-grid'
  chapter.knowledgePoints.forEach((kp) => {
    knowledgeWrapper.appendChild(createKnowledgeCard(kp))
  })

  const checkpoint = document.createElement('div')
  checkpoint.className = 'chapter-checkpoint'
  checkpoint.innerHTML = `<strong>Checkpoint</strong><p>${chapter.checkpoint}</p>`

  section.append(header, subtitle, intro, narrative, guide, knowledgeWrapper, checkpoint)

  if (chapter.transition) {
    const transition = document.createElement('p')
    transition.className = 'chapter-transition'
    transition.textContent = chapter.transition
    section.appendChild(transition)
  }
  return section
}

export const renderCoursePage = (rootId: string, session: CourseSession): void => {
  const root = document.getElementById(rootId)
  if (!root) {
    return
  }
  root.innerHTML = ''
  root.className = 'courseware-shell'
  root.append(createHero(session), createMetaGrid(session), createTimeline(session))
  session.chapters.forEach((chapter) => {
    root.appendChild(createChapterSection(chapter))
  })
}

export const createCourseApp = (element: HTMLElement, session: CourseSession): void => {
  element.innerHTML = ''
  element.className = 'courseware-shell'
  element.append(createHero(session), createMetaGrid(session), createTimeline(session))
  session.chapters.forEach((chapter) => {
    element.appendChild(createChapterSection(chapter))
  })
}
