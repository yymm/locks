import markdownIt from 'markdown-it'
import markdownItEmoji from 'markdown-it-emoji'
import markdownItAsciimath from 'markdown-it-asciimath'
//import markdownItToc from 'markdown-it-toc'
import markdownItSub from 'markdown-it-sub'
import markdownItSup from 'markdown-it-sup'
import markdownItIns from 'markdown-it-ins'
import markdownItMark from 'markdown-it-mark'
import markdownItContainer from 'markdown-it-container'
//import markdownItFootnote from 'markdown-it-footnote'
import markdownItDeflist from 'markdown-it-deflist'
import markdownItBlockEmbed from 'markdown-it-block-embed'
import markdownItImsize from 'markdown-it-imsize'
import markdownItTaskLists from 'markdown-it-task-lists'
import markdownItPlayground from 'markdown-it-playground'
import markdownItSmartarrows from 'markdown-it-smartarrows'
import markdownItHighlightjs from 'markdown-it-highlightjs'
import markdownItLinkAttr from 'markdown-it-link-attributes'

let md = markdownIt({
    html: true,
    breaks: true,
    linkify: true,
    typography: true
  })
  .use(markdownItEmoji)
  .use(markdownItAsciimath)
  //.use(markdownItToc)
  .use(markdownItSub)
  .use(markdownItSup)
  .use(markdownItIns)
  .use(markdownItMark)
  .use(markdownItContainer, 'warning')
  .use(markdownItContainer, 'info')
  //.use(markdownItFootnote)
  .use(markdownItDeflist)
  .use(markdownItBlockEmbed)
  .use(markdownItImsize)
  .use(markdownItTaskLists, {enabled: true})
  .use(markdownItPlayground)
  .use(markdownItSmartarrows)
  .use(markdownItHighlightjs)
  .use(markdownItLinkAttr, { target: '_blank' })

md.renderer.rules.hr = function() {
  return '</div><div class="slide-page" style="display: none;">'
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
  return '<div class="slide-page" style="display: block;">' + parsedHTML + '</div>'
}
