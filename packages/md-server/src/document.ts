import { Window, type Element } from "happy-dom";
import { PORT } from "..";

export const replaceHTMLImage = async (
    html: string,
    images: { originalPath: string; fileName: string }[]
) => {
    const window = new Window();
    window.document.body.outerHTML = html;
    const document = window.document;
    const replaceImage = async (imgElm: Element) => {
        const src = imgElm.getAttribute("src");
        if (!src) {
            return;
        }
        const image = images.find(({ originalPath }) => src.endsWith(originalPath));
        if (!image) {
            return;
        }
        imgElm.setAttribute("src", `http://localhost:${PORT}/image/${image.fileName}`);
    };
    const imgElms = Array.from(document.querySelectorAll("img"));
    await Promise.all(imgElms.map(replaceImage));
    return document.documentElement.outerHTML;
};

export const removeScriptTag = async (html: string) => {
    const window = new Window();
    window.document.body.outerHTML = html;
    const document = window.document;
    const scriptElms = Array.from(document.querySelectorAll("script"));
    scriptElms.forEach((scriptElm) => scriptElm.remove());
    return document.documentElement.outerHTML;
};
