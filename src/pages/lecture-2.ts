import '../static/lecture.scss'
import { renderLecturePage } from '../courseware/lecture-render'
import { lecture2 } from '../courseware/data/lecture-2'

const app = document.getElementById('app')
if (app) {
  renderLecturePage(app, lecture2)
}
