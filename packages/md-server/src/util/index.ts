import path from "path";
export const rootDir = path.join(__dirname, "..", "..");

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
