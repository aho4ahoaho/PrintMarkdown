import Express from "express";
import path from "path";
const app = Express();


//クライアントのファイルを配信する
app.use(Express.static(path.join(__dirname, "client")))

//JSONをパース出来るようにする
app.use(Express.json());

app.get("/api", (req, res) => {
    res.json({ message: "Hello, World!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});