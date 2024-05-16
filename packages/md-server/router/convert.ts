import Express from "express";
import multer, { type Options } from "multer";
import fs from "fs/promises";
import path from "path";
import { convertMarkdownToPdf } from "../src/convert";
import { randomUUID } from "crypto";
import { rootDir } from "../src/util";

const router = Express.Router();

await fs.mkdir(path.join(rootDir, "tmp"), { recursive: true });
fs.readdir(path.join(rootDir, "tmp")).then((files) =>
    files.forEach((file) => {
        fs.unlink(path.join(rootDir, "tmp", file));
    })
);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(rootDir, "tmp"));
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
const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];
const IMAGE_MIME_TYPES = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/bmp",
    "image/webp",
    "image/svg+xml",
];
const fileFilter: Options["fileFilter"] = (req, file, cb) => {
    //マークダウンは許可
    if (file.originalname.endsWith(".md")) {
        cb(null, true);
        return;
    }
    //画像は許可
    if (
        IMAGE_EXTENSIONS.some((ext) => file.originalname.endsWith(`.${ext}`)) &&
        IMAGE_MIME_TYPES.includes(file.mimetype)
    ) {
        cb(null, true);
        return;
    }
    //それ以外は拒否
    cb(null, false);
};

router.post(
    "/upload",
    multer({ storage, limits, fileFilter }).fields([
        { name: "doc", maxCount: 1 },
        { name: "images", maxCount: 50 },
    ]),
    async (req, res) => {
        if (Array.isArray(req.files)) {
            res.status(503).json({ message: "Invalid request" });
            return;
        }
        const docFile = req.files?.["doc"][0];
        const images = req.files?.["images"];
        if (!docFile) {
            res.status(400).json({ message: "No file" });
            return;
        }
        if (path.extname(docFile.filename) !== ".md") {
            fs.unlink(docFile.path);
            res.status(400).json({ message: "Not markdown file" });
        }
        res.send({
            doc: docFile.filename,
            images: images?.map((image) => ({
                originalName: image.originalname,
                fileName: image.filename,
            })),
        });

        setTimeout(async () => {
            (await fs.exists(docFile.path)) && fs.unlink(docFile.path);
            images?.forEach(
                async (image) => (await fs.exists(docFile.path)) && fs.unlink(image.path)
            );
        }, 1000 * 10);
    }
);

router.post("/convert", async (req, res) => {
    const docFile = String(req.body.doc);
    if (!docFile.endsWith(".md")) {
        res.status(400).json({ message: "Not markdown file" });
        return;
    }

    const images = (() => {
        const rawImages = req.body.images;
        if (!Array.isArray(rawImages)) {
            return [];
        }
        try {
            return rawImages
                .map((image: { originalPath: string; fileName: string }) => ({
                    originalPath: String(image.originalPath),
                    fileName: String(image.fileName),
                }))
                .filter(({ originalPath, fileName }) => {
                    if (!originalPath || !fileName) {
                        return false;
                    }
                    if (!IMAGE_EXTENSIONS.some((ext) => originalPath.endsWith(`.${ext}`))) {
                        return false;
                    }
                    if (path.extname(fileName) !== path.extname(originalPath)) {
                        return false;
                    }
                    return true;
                });
        } catch (e) {
            return [];
        }
    })();
    const docPath = path.join(rootDir, "tmp", docFile);
    const pdfPath = await convertMarkdownToPdf(docPath, images);
    res.sendFile(pdfPath, () => {
        fs.unlink(docPath);
        images.forEach((image) => fs.unlink(path.join(rootDir, "tmp", image.fileName)));
        fs.unlink(pdfPath);
    });
});

export { router };
