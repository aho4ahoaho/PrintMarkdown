import Express from "express";
import path from "path";
import { router as convertRouter } from "./router/convert";

const app = Express();

//PDF生成用に画像を配信する
app.use("/image", Express.static(path.join(__dirname, "tmp")));

//アクセスを表示する
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} ${req.ip}`);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "content-type");
    next();
});

//クライアントのファイルを配信する
app.use(Express.static(path.join(__dirname, "client")));

//JSONをパース出来るようにする
app.use(Express.json());
app.use("/api", convertRouter);

export const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
