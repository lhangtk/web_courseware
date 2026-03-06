import '../static/lecture.scss'
import { renderLecturePage } from '../courseware/lecture-render'
import { lecture1 } from '../courseware/data/lecture-1'
import { lecture2 } from '../courseware/data/lecture-2'
import type { Lecture } from '../courseware/lecture-types'

const lectures: Record<string, Lecture> = {
  'lecture-1': lecture1,
  'lecture-2': lecture2
}

function getLectureId(): string | null {
  const params = new URLSearchParams(window.location.search)
  return params.get('id')
}

function init() {
  const app = document.getElementById('app')
  if (!app) return

  const lectureId = getLectureId()
  
  if (!lectureId || !lectures[lectureId]) {
    app.innerHTML = `
      <div class="lecture-error">
        <h1>课程未找到</h1>
        <p>请检查链接是否正确，或返回<a href="./index.html">课程列表</a>选择课程。</p>
      </div>
    `
    return
  }

  renderLecturePage(app, lectures[lectureId])
}

init()
