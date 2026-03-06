/**
 * 落地页入口
 */

import '../static/lecture.scss'
import { renderLectureListPage } from '../courseware/lecture-render'
import { lecture1 } from '../courseware/data/lecture-1'
import { lecture2 } from '../courseware/data/lecture-2'

const app = document.getElementById('app')
if (app) {
  renderLectureListPage(app, [lecture1, lecture2])
}
