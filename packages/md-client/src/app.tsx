import { Box } from "@mui/material";
import "./app.css";
import { Button } from "@mui/material";
import styled from "@emotion/styled";
import { CloudUpload } from "@mui/icons-material";
import { useCallback, useState } from "preact/hooks";
import { API_URL } from "./utils/url";
import { Header } from "./components/Header";
import { ErrorModal } from "./components/Modal/error";

export function App() {
    const [file, setFile] = useState<File | null>(null);
    const [errorText, setErrorText] = useState<string | null>(null);
    const [, setPdfUrl] = useState<string | null>(null);

    const uploadProcess = useCallback(async () => {
        if (!file) {
            return;
        }
        const formData = new FormData();
        formData.append("file", file);
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
        const a = document.createElement("a");
        a.setAttribute("href", url);
        const fileName = file.name.replace(/\.md$/, ".pdf");
        a.setAttribute("download", fileName);
        a.click();
    }, [file]);

    return (
        <>
            <Header />
            <Box display="flex" flexDirection="column" width="min(100%,800px)" margin="0 auto">
                <Text>{file ? file.name : "Not Specified"}</Text>
                <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<CloudUpload />}
                >
                    Select file
                    <VisuallyHiddenInput
                        type="file"
                        onChange={(e) => {
                            const file = e.target.files?.item(0);
                            if (file?.name.endsWith(".md")) {
                                setFile(file);
                            } else {
                                setErrorText("マークダウンファイルを選択してください。");
                            }
                        }}
                    />
                </Button>
                <Button onClick={uploadProcess}>Upload</Button>
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

const Text = styled.div`
    font-size: larger;
`;
const VisuallyHiddenInput = styled.input({
    clip: "rect(0 0 0 0)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
});
