export const getExtName = (filename: string) => {
    const i = filename.lastIndexOf(".");
    return i === -1 ? "" : filename.slice(i + 1);
};
