import { sessionLower } from 'src/courseware/data/session-lower'
import { sessionUpper } from 'src/courseware/data/session-upper'
import 'src/static/content.scss'

const sessions = [sessionUpper, sessionLower]

const buildLandingPage = () => {
  const root = document.getElementById('app')
  if (!root) {
    return
  }
  root.className = 'landing-shell'
  const hero = document.createElement('section')
  hero.className = 'landing-hero'
  const label = document.createElement('span')
  label.textContent = '课程 · 前端核心概念与原理解析'
  const title = document.createElement('h1')
  title.textContent = '两节 90 分钟的沉浸式课件'
  const description = document.createElement('p')
  description.textContent = '内容来自 old/前端核心概念和原理解析 PPT 上下篇与《修订意见》，聚焦浏览器原理、工程化与可观测性，提供课堂级别的讲解与交互演示。'
  hero.append(label, title, description)

  const sessionGrid = document.createElement('section')
  sessionGrid.className = 'landing-grid'
  sessions.forEach((session) => {
    const card = document.createElement('article')
    card.className = 'landing-card'
    const heading = document.createElement('h2')
    heading.textContent = session.title
    const meta = document.createElement('p')
    meta.className = 'landing-card__meta'
    meta.textContent = `${session.sessionLabel} · ${session.duration} min`
    const summary = document.createElement('p')
    summary.textContent = session.summary

    const list = document.createElement('ul')
    session.chapters.slice(0, 4).forEach((chapter) => {
      const item = document.createElement('li')
      item.textContent = `${chapter.title} · ${chapter.duration} min`
      list.appendChild(item)
    })

    const link = document.createElement('a')
    link.className = 'landing-card__link'
    link.href = session.id === 'session-upper' ? '/src/pages/session-upper/index.html' : '/src/pages/session-lower/index.html'
    link.textContent = '进入课件'

    card.append(heading, meta, summary, list, link)
    sessionGrid.appendChild(card)
  })

  root.append(hero, sessionGrid)
}

buildLandingPage()
