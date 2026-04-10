import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname, basename } from 'node:path'

const root = resolve(process.cwd(), 'dist')
const lecturePages = [
  resolve(root, 'src/pages/lecture-1.html'),
  resolve(root, 'src/pages/lecture-2.html'),
]

const toDataUrl = (code) => `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`

const inlinePage = (htmlPath) => {
  const htmlDir = dirname(htmlPath)
  let html = readFileSync(htmlPath, 'utf8')

  html = html.replace(/<link rel="stylesheet" href="([^"]+)">/g, (match, href) => {
    if (/^(https?:)?\/\//.test(href)) return match
    const filePath = resolve(htmlDir, href)
    const css = readFileSync(filePath, 'utf8')
    return `<style>\n${css}\n</style>`
  })

  const moduleMap = {}
  html = html.replace(/<link rel="modulepreload"[^>]*href="([^"]+)"[^>]*>\s*/g, (_, href) => {
    if (/^(https?:)?\/\//.test(href)) return ''
    const filePath = resolve(htmlDir, href)
    const code = readFileSync(filePath, 'utf8')
    moduleMap[`./${basename(filePath)}`] = toDataUrl(code)
    return ''
  })

  html = html.replace(/<script type="module" crossorigin src="([^"]+)"><\/script>/, (match, src) => {
    if (/^(https?:)?\/\//.test(src)) return match
    const filePath = resolve(htmlDir, src)
    const code = readFileSync(filePath, 'utf8')
    const importMap = `<script type="importmap">\n${JSON.stringify({ imports: moduleMap }, null, 2)}\n</script>`
    return `${importMap}\n<script type="module">\n${code}\n</script>`
  })

  const outputPath = htmlPath.replace(/\.html$/, '.single.html')
  writeFileSync(outputPath, html)
}

lecturePages.forEach(inlinePage)
