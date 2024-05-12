import { Button } from "@mui/material";
import * as pdfjs from "pdfjs-dist";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { useRef, useState } from "preact/hooks";
import { useCallback, useEffect } from "react";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker?url";
import styled from "@emotion/styled";

type PDFViewerProps = {
    src?: string;
    scale?: number;
};
export const PDFViewer = ({ src, scale = 1.0 }: PDFViewerProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
    const [page, setPage] = useState<number>(1);

    useEffect(() => {
        if (!src) {
            return;
        }
        (async () => {
            pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
            const pdf = await pdfjs.getDocument(src).promise;
            setPdf(pdf);
            setPage(1);
        })();
        return () => {
            pdf?.destroy();
        };
    }, [src]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = canvas?.clientWidth;
        canvas.height = (canvas?.clientWidth / 210) * 297;
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");

        if (!(pdf && canvas && ctx)) return;

        (async () => {
            const pageData = await pdf?.getPage(page);

            const docWidth = pageData?.view[2];
            const docScale = canvas.clientWidth / docWidth;

            const viewport = pageData?.getViewport({ scale: scale * docScale });
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            await pageData?.render({
                canvasContext: ctx,
                viewport,
            }).promise;
        })();
    }, [pdf, page]);

    const pageUpdate = useCallback(
        (page: number) => {
            if (pdf == null) {
                return;
            }
            setPage((prev) => {
                const next = prev + page;
                if (next < 1) {
                    return 1;
                }
                if (next > pdf.numPages) {
                    return pdf.numPages;
                }
                return next;
            });
        },
        [pdf]
    );

    return (
        <PDFViewerContainer>
            <PDFViewerCanvas ref={canvasRef} />
            <ButtonGroup>
                <Button
                    variant="contained"
                    onClick={() => {
                        pageUpdate(-1);
                    }}
                >
                    Prev
                </Button>
                <Button variant="text">
                    {page}/{pdf?.numPages ?? 1}
                </Button>
                <Button
                    variant="contained"
                    onClick={() => {
                        pageUpdate(1);
                    }}
                >
                    Next
                </Button>
            </ButtonGroup>
        </PDFViewerContainer>
    );
};

const PDFViewerContainer = styled.div({
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    padding: "1rem",
});

const PDFViewerCanvas = styled.canvas(({ hidden }: { hidden?: boolean }) => ({
    display: hidden ? "none" : "block",
    width: "100%",
    height: "auto",
    boxShadow: "0 0 5px 0 rgba(0, 0, 0, 0.5)",
}));

const ButtonGroup = styled.div({
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
});
