import puppeteer, { type PDFOptions } from "puppeteer";


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
    console.log("Browser started");
    return browser;
};

export const renderingHTML = async (html: string, options?: PDFOptions) => {
    const browser = await getBrowser();
    const page = await browser.newPage();
    await page.setContent(html);
    const result = await page.pdf({ format: "A4", ...options });
    await browser.close();
    return result;
};