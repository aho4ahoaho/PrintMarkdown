import { type PDFMargin, type PDFOptions } from "puppeteer";
//eslint-disable-next-line @typescript-eslint/no-var-requires
const puppeteer = require("puppeteer"); //ESMでインポートするとバグる。https://github.com/oven-sh/bun/issues/4477


const getBrowser = async () => {
    const browser = await puppeteer.launch({
        headless: "shell",
        defaultViewport: {
            width: 1920,
            height: 1080
        },
        args: [
            "--no-sandbox",
            "--disable-gpu",
        ],
        dumpio: false
    });
    console.debug("Browser started");
    return browser;
};
/**
 * margin: number 全ての方向に適用
 * margin: [number, number]  上下、左右に適用
 * margin: [number, number, number, number] 上、右、下、左に適用
 */
export const getMargin = (margin: number | [number, number] | [number, number, number, number]): PDFMargin => {

    if (Array.isArray(margin)) {
        if (margin.length === 2) {
            return { top: `${margin[0]}mm`, bottom: `${margin[0]}mm`, right: `${margin[1]}mm`, left: `${margin[1]}mm` }
        }
        if (margin.length === 4) {
            return { top: `${margin[0]}mm`, right: `${margin[1]}mm`, bottom: `${margin[2]}mm`, left: `${margin[3]}mm` }
        }
    }
    return { top: `${margin}mm`, right: `${margin}mm`, bottom: `${margin}mm`, left: `${margin}mm` }
};

export const renderingHTML = async (html: string, options?: PDFOptions) => {
    const browser = await getBrowser();
    const page = await browser.newPage();
    await page.setContent(html);
    const result = await page.pdf({ format: "A4", printBackground: true, margin: getMargin(10), ...options });
    await browser.close();
    return result;
};