// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-expect-error
import style from "highlight.js/styles/github.css";
import fs from "fs/promises";
import path from "path";

const getHighlightStyle = async () => {
    if (path.isAbsolute(style)) {
        return await fs.readFile(style, "utf-8");
    } else {
        //相対パスはビルド後なので、distからの相対パスに変換する
        const stylePath = path.resolve(__dirname, "..", "..", "dist", style);
        return await fs.readFile(stylePath, "utf-8");
    }
};

export const hljsStyle = await getHighlightStyle();
