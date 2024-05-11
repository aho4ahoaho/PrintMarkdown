//@ts-expect-error
import style from 'highlight.js/styles/github.css';
import fs from "fs/promises"

const getHighlightStyle = async () => {
    return await fs.readFile(style, "utf-8")
}

export const hljsStyle = await getHighlightStyle()