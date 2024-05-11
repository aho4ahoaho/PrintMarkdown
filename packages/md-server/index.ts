import Express from "express";
import path from "path";
import multer, { type Options } from "multer";
import { randomUUID } from "crypto";
import fs from "fs";
import { convertMarkdownToPdf } from "./src/convert";

const app = Express();
fs.mkdirSync(path.join(__dirname, "tmp"), { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "tmp"));
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const name = randomUUID();
        cb(null, `${name}${ext}`);
    },
});

const limits: Options["limits"] = {
    fileSize: 1024 * 1024 * 20, //20MB
};

//アクセスを表示する
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} ${req.ip}`);
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
});

//クライアントのファイルを配信する
app.use(Express.static(path.join(__dirname, "client")));

//JSONをパース出来るようにする
app.use(Express.json());

app.post("/api/convert", multer({ storage, limits }).single("file"), async (req, res) => {
    if (!req.file) {
        res.status(400).json({ message: "No file" });
        return;
    }
    if (path.extname(req.file.filename) !== ".md") {
        fs.unlinkSync(req.file.path);
        res.status(400).json({ message: "Not markdown file" });
    }
    const pdfPath = await convertMarkdownToPdf(req.file.path);
    res.sendFile(pdfPath);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
