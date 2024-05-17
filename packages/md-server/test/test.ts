import { convertMarkdownToPdf } from "../src/convert";
import path from "path";
import fs from "fs";

const convert = async (relativePath: string) => {
    const mdPath = path.resolve(__dirname, relativePath);
    const pdfPath = await convertMarkdownToPdf(mdPath);
    const filename = path.basename(pdfPath, ".pdf");
    //PDFファイルをコピー
    console.log(pdfPath);
    fs.copyFileSync(pdfPath, path.resolve(__dirname, `${filename}.pdf`));
    //元のHTMLファイルもコピー
    const htmlPath = path.join(path.dirname(pdfPath), `${filename}.html`);
    console.log(htmlPath);
    if (fs.existsSync(htmlPath)) {
        fs.copyFileSync(htmlPath, path.resolve(__dirname, `${filename}.html`));
    }
};

convert("example.md");
convert("code_block.md");
