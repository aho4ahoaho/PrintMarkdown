import { Box, Button } from "@mui/material";
import "./app.css";
import { LoadingButton } from "@mui/lab";
import styled from "@emotion/styled";
import { CloudUpload, Download } from "@mui/icons-material";
import { useCallback, useState } from "preact/hooks";
import { Header } from "./components/Header";
import { ErrorModal } from "./components/Modal/error";
import { PDFViewer } from "./components/PDFViewer";
import { useOnResize } from "./utils/resize";
import { DirectoryInput } from "./components/DirectoryInput";
import { fileUploadProcess } from "./utils/upload";
import { convertProcess } from "./utils/convert";

export function App() {
    const [file, setFile] = useState<string | null>(null);
    const [isConverting, setIsConverting] = useState<boolean>(false);
    const [errorText, setErrorText] = useState<string | null>(null);
    const [pdfUrl, PdfUrl] = useState<string | null>(null);

    const isDoublePage = useOnResize(() => {
        const docsWidth = (window.innerHeight / 297) * 210;
        return window.innerWidth > docsWidth * 2;
    }, []);

    const onSelectFile = async (files: File[]) => {
        if (pdfUrl) {
            PdfUrl(null);
            URL.revokeObjectURL(pdfUrl);
        }
        setIsConverting(true);
        const {
            doc: { fileName: docFileName, originalName: docOriginalName },
            images,
        } = await fileUploadProcess(files);
        setFile(docOriginalName);
        const pdfBlob = await convertProcess(docFileName, images);
        const newPdfUrl = URL.createObjectURL(pdfBlob);
        PdfUrl(newPdfUrl);
        setIsConverting(false);
    };

    const onDownload = useCallback(() => {
        if (!pdfUrl) {
            return;
        }
        const a = document.createElement("a");
        a.href = pdfUrl;
        const filename = file?.split(".") ?? ["output", "md"];
        filename?.pop();
        a.download = filename?.join(".") + ".pdf";
        a.click();
    }, [pdfUrl]);

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
                <ThePDFViewer src={pdfUrl} isDoublePage={isDoublePage} />
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
                    {file || "Select file"}
                    <VisuallyHiddenInput
                        type="file"
                        onChange={(e) => {
                            const files = e.currentTarget.files;
                            if (files?.length) {
                                onSelectFile(Array.from(files));
                                e.currentTarget.value = "";
                            }
                        }}
                        webkitdirectory={true}
                    />
                </LoadingButton>
                <Button disabled={!pdfUrl} onClick={onDownload} startIcon={<Download />} fullWidth>
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
