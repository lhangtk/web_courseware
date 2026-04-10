import '../static/lecture.scss'
import { renderLecturePage } from '../courseware/lecture-render'
import { lecture1 } from '../courseware/data/lecture-1'

const app = document.getElementById('app')
if (app) {
  renderLecturePage(app, lecture1)
}
