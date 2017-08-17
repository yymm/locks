import markdownIt from 'markdown-it'
import markdownItEmoji from 'markdown-it-emoji'
import markdownItAsciimath from 'markdown-it-asciimath'
import markdownItTocAndAnchor from 'markdown-it-toc-and-anchor'
import markdownItSub from 'markdown-it-sub'
import markdownItSup from 'markdown-it-sup'
import markdownItIns from 'markdown-it-ins'
import markdownItMark from 'markdown-it-mark'
import markdownItContainer from 'markdown-it-container'
import markdownItFootnote from 'markdown-it-footnote'
import markdownItDeflist from 'markdown-it-deflist'
import markdownItVideo from 'markdown-it-video'
import markdownItImsize from 'markdown-it-imsize'
import markdownItTaskLists from 'markdown-it-task-lists'
import markdownItPlayground from 'markdown-it-playground'
import markdownItSmartarrows from 'markdown-it-smartarrows'
import markdownItHighlightjs from 'markdown-it-highlightjs'

let md = markdownIt({
    html: true,
    breaks: true,
    linkify: true,
    typography: true
  })
  .use(markdownItEmoji)
  .use(markdownItAsciimath)
  //.use(markdownItTocAndAnchor, { anchorLinkSymbol: '✘' }) // https://github.com/medfreeman/markdown-it-toc-and-anchor/issues/36
  .use(markdownItSub)
  .use(markdownItSup)
  .use(markdownItIns)
  .use(markdownItMark)
  .use(markdownItContainer)
  .use(markdownItFootnote)
  .use(markdownItDeflist)
  .use(markdownItVideo)
  .use(markdownItImsize)
  .use(markdownItTaskLists, {enabled: true})
  .use(markdownItPlayground)
  .use(markdownItSmartarrows)
  .use(markdownItHighlightjs)

md.renderer.rules.hr = function() {
  return '</div><div class="slidePage" style="display: none;">'
}

export default function(text) {
  let parsedHTML = ""
  try {
    parsedHTML = md.render(text)
  }
  catch(e) {
    // ignore
    console.log(e)
  }
  return '<div class="slidePage" style="display: block;">' + parsedHTML + '</div>'
}
