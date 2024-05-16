import { getExtName } from "./file";
import { randomString } from "./random";
import { API_URL } from "./url";

const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];

export type ImageData = {
    file: File;
    fileName: string;
    originalPath: string;
    uploadedName?: string;
};

type ResponseData = {
    doc: string;
    images: Array<{
        originalName: string;
        fileName: string;
    }>;
};

export const fileUploadProcess = async (files: File[]) => {
    //markdownファイルを取得
    const docFile =
        files.find((file) => file.name === "index.md") ??
        files.find((file) => file.name.endsWith(".md"));
    if (!docFile) {
        throw new Error("index.md または .md ファイルが見つかりません");
    }

    //画像ファイルを取得
    const imageFiles: ImageData[] = files
        .filter((file) => IMAGE_EXTENSIONS.some((ext) => file.name.endsWith(`.${ext}`)))
        .map((file) => {
            const ext = getExtName(file.name);
            const id = randomString(16);
            const fileName = `${id}.${ext}`; //ランダムな名前に変更
            return {
                file,
                fileName,
                originalPath: removeRootDir(file.webkitRelativePath ?? file.name),
            };
        });

    //setIsConverting(true);
    const formData = new FormData();
    formData.append("doc", docFile);
    imageFiles.forEach(({ file, fileName }) => {
        formData.append("images", file, fileName);
    });
    const res = await fetch(`${API_URL}/api/upload`, {
        method: "POST",
        body: formData,
    });
    if (!res.ok) {
        throw new Error(`アップロードに失敗しました。${res.statusText}`);
    }
    const data: ResponseData = await res.json();

    //画像ファイルのアップロード名を取得
    imageFiles.forEach((image) => {
        const fileName = image.fileName;
        const uploadedName = data.images.find((i) => i.originalName === fileName)?.fileName;
        image.uploadedName = uploadedName;
    });

    return {
        doc: {
            originalName: docFile.name,
            fileName: data.doc,
        },
        images: imageFiles,
        docFile: docFile,
    };
};

const removeRootDir = (path: string) => {
    return path.replace(/^.*[\\/]/, "");
};
