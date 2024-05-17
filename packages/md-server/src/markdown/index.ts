import markdownit from "markdown-it";
import hljs from "highlight.js";

//型の怪しいプラグインを読み込む
import { markdownitcheckbox, markdownitcontainer, markdownitfootnote } from "./plugin";
import type MarkdownIt from "markdown-it/index.js";

//any型を避けるために型を指定
const md: MarkdownIt = markdownit({
    highlight: (str, lang) => {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return (
                    '<pre><code class="hljs">' +
                    hljs.highlight(str, {
                        language: lang,
                        ignoreIllegals: true,
                    }).value +
                    "</code></pre>"
                );
            } catch (__) {
                __;
            }
        }

        return '<pre><code class="hljs">' + md.utils.escapeHtml(str) + "</code></pre>";
    },
});
//プラグインを適用
//md.use(markdownitsub).use(markdownitsup).use(markdownitcheckbox).use(markdownitfootnote);
md.use(markdownitcheckbox).use(markdownitfootnote); //MathJaxとの競合を避けるため、一部のプラグインを適用しない

//コンテナプラグインを適用
md.use(markdownitcontainer, "info")
    .use(markdownitcontainer, "warn")
    .use(markdownitcontainer, "alert");

md.disable("emphasis"); //MathJaxとの競合を避けるため、強調を無効化

export const convertMarkdownToHTML = async (markdown: string) => {
    return md.render(markdown);
};

/*export const replaceMarkdownImage = async (markdown: string, images: { originalPath: string, fileName: string }[]) => {
    return images.reduce((prev, { originalPath, fileName }) => {
        const pattern = new RegExp(`\\(\\s*(\./)?${originalPath}\\s*\\)`, "g")
        const address = `(http://localhost:${PORT}/image/${fileName})`;
        return prev.replaceAll(pattern, address);
    }, markdown);
};*/
