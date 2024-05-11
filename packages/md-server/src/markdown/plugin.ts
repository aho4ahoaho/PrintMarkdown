// @ts-nocheck markdownItのプラグインの型定義がないため、ts-nocheckを記述
import markdownitsub from "markdown-it-sub"
import markdownitsup from "markdown-it-sup"
import markdownitcheckbox from "markdown-it-checkbox"
import markdownitcontainer from "markdown-it-container"
import markdownitfootnote from "markdown-it-footnote"

export const markdownPlugins = [
    markdownitsub,
    markdownitsup,
    markdownitcheckbox,
    markdownitcontainer,
    markdownitfootnote
]