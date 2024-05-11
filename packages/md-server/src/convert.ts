import path from "path";
import fs from "fs/promises";
import { convertMarkdownToHTML } from "./markdown";
import { renderingHTML } from "./browser";
import { rootDir } from "./util";
import ejs from "ejs";
import { hljsStyle } from "./markdown/style";

const template = await (async () => {
    const templatePath = path.join(rootDir, "template.ejs");
    const templateFile = await fs.readFile(templatePath, "utf-8");
    return ejs.compile(templateFile, { async: true });
})();

export const convertMarkdownToPdf = async (filePath: string) => {
    const filename = path.basename(filePath, ".md");
    const markdown = await fs.readFile(filePath, "utf-8");
    const document = await convertMarkdownToHTML(markdown);
    const result = await template({ document, style: hljsStyle });
    await fs.writeFile(path.join(rootDir, "tmp", `${filename}.html`), result);
    const pdfBuffer = await renderingHTML(result);
    const pdfPath = path.join(rootDir, "tmp", `${filename}.pdf`);
    await fs.writeFile(pdfPath, pdfBuffer);
    return pdfPath;
};
