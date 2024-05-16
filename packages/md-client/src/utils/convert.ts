import { API_URL } from "./url";
import { ImageData } from "./upload";

export const convertProcess = async (docName: string, images: ImageData[]) => {
    const body = {
        doc: docName,
        images: images.map(({ originalPath, uploadedName }) => ({
            originalPath: originalPath,
            fileName: uploadedName,
        })),
    };
    const res = await fetch(`${API_URL}/api/convert`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });
    return await res.blob();
};
