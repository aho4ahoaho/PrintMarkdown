import markdownit from 'markdown-it'
import { markdownPlugins } from './plugin'


const md = markdownit()
//プラグインを適用
markdownPlugins.forEach(plugin => {
    md.use(plugin)
})

export const convertMarkdownToHTML = async (markdown: string) => {
    return md.render(markdown)
}