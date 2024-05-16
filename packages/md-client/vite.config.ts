import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import Unfonts from "unplugin-fonts/vite";

const unfontsOptions: NonNullable<Parameters<typeof Unfonts>[0]> = {
    google: {
        families: [
            {
                name: "Noto Sans JP",
                styles: "wght@400;700",
            },
            {
                name: "Roboto",
                styles: "wght@400;700",
            },
        ],
    },
};

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [preact(), Unfonts(unfontsOptions)],
    build: {
        outDir: "../md-server/client",
        emptyOutDir: true,
        target: "es2022",
    },
});
