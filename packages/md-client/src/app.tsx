import { Box, Button } from "@mui/material";
import "./app.css";
import { LoadingButton } from "@mui/lab";
import styled from "@emotion/styled";
import { CloudUpload, Download } from "@mui/icons-material";
import { useCallback, useState } from "preact/hooks";
import { API_URL } from "./utils/url";
import { Header } from "./components/Header";
import { ErrorModal } from "./components/Modal/error";
import { PDFViewer } from "./components/PDFViewer";
import { useOnResize } from "./utils/resize";
import { DirectoryInput } from "./components/DirectoryInput";

const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];

export function App() {
    const [file, setFile] = useState<File | null>(null);
    const [isConverting, setIsConverting] = useState<boolean>(false);
    const [errorText, setErrorText] = useState<string | null>(null);
    const [pdfurl, setPdfUrl] = useState<string | null>(null);

    const isDoublePage = useOnResize(() => {
        const docsWidth = (window.innerHeight / 297) * 210;
        return window.innerWidth > docsWidth * 2;
    }, []);

    const onSelectFile = useCallback(
        (files: File[]) => {
            const imageFiles = files.filter((file) =>
                IMAGE_EXTENSIONS.some((ext) => file.name.endsWith(`.${ext}`))
            );
            const docFile =
                files.find((file) => file.name === "index.md") ??
                files.find((file) => file.name.endsWith(".md"));
            if (!docFile) {
                setErrorText("index.md または .md ファイルが見つかりません");
                return;
            }
            setFile(docFile);
            setIsConverting(true);
            (async () => {
                const formData = new FormData();
                formData.append("file", docFile);
                imageFiles.forEach((file) => {
                    formData.append("images", file);
                });
                const res = await fetch(`${API_URL}/api/convert`, {
                    method: "POST",
                    body: formData,
                });
                if (!res.ok) {
                    console.error(res.statusText);
                    return;
                }
                const blob = await res.blob();
                const url = URL.createObjectURL(blob);
                setPdfUrl(url);
                setIsConverting(false);
            })();
            return () => {
                if (pdfurl) {
                    URL.revokeObjectURL(pdfurl);
                }
            };
        },
        [file]
    );

    const onDownload = useCallback(() => {
        if (!pdfurl) {
            return;
        }
        const a = document.createElement("a");
        a.href = pdfurl;
        const filename = file?.name.split(".") ?? ["output", "md"];
        filename?.pop();
        a.download = filename?.join(".") + ".pdf";
        a.click();
    }, [pdfurl]);

    return (
        <>
            <Header />
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                width={isDoublePage ? "min(100%,1600px)" : "min(100%,800px)"}
                margin="0 auto 1rem auto"
                padding="0 1rem"
                boxSizing="border-box"
            >
                <ThePDFViewer src={pdfurl} isDoublePage={isDoublePage} />
            </Box>
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                width="min(100%,800px)"
                margin="0 auto 1rem auto"
                padding="0 1rem"
                boxSizing="border-box"
            >
                <LoadingButton
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<CloudUpload />}
                    loading={isConverting}
                    fullWidth
                >
                    {file?.name || "Select file"}
                    <VisuallyHiddenInput
                        type="file"
                        onChange={(e) => {
                            const files = e.currentTarget.files;
                            if (files?.length) {
                                onSelectFile(Array.from(files));
                            }
                        }}
                        webkitdirectory={true}
                    />
                </LoadingButton>
                <Button disabled={!pdfurl} onClick={onDownload} startIcon={<Download />} fullWidth>
                    Download
                </Button>
            </Box>
            {errorText && (
                <ErrorModal
                    title="エラー"
                    onPositiveClick={() => {
                        setErrorText(null);
                    }}
                >
                    {errorText}
                </ErrorModal>
            )}
        </>
    );
}

const VisuallyHiddenInput = styled(DirectoryInput)({
    clip: "rect(0 0 0 0)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
});

const ThePDFViewer = styled(PDFViewer)(({ isDoublePage }) => {
    return {
        width: isDoublePage ? "calc(75lvh / 297 * 210 * 2)" : "calc(75lvh / 297 * 210)",
    };
});
