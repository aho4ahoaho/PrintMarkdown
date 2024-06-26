import { Button } from "@mui/material";
import * as pdfjs from "pdfjs-dist";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { useRef, useState } from "preact/hooks";
import { useCallback, useEffect } from "react";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker?url";
import styled from "@emotion/styled";

type PDFViewerProps = {
    src?: string | null;
    scale?: number;
    className?: string;
    isDoublePage?: boolean;
};
export const PDFViewer = ({ src, className, isDoublePage = false }: PDFViewerProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const secondCanvasRef = useRef<HTMLCanvasElement>(null);
    const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
    const [page, setPage] = useState<number>(1);
    const [scale, setScale] = useState<number>(devicePixelRatio);

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

    //初期化処理
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = canvas?.clientWidth;
        canvas.height = (canvas?.clientWidth / 210) * 297;

        if (!isDoublePage) return;
        const canvas2 = secondCanvasRef.current;
        if (!canvas2) return;
        canvas2.width = canvas.width;
        canvas2.height = canvas.height;

        const updatePixelRatio = () => {
            const pr = window.devicePixelRatio;
            setScale(pr);
            console.log(pr);
            matchMedia(`(resolution: ${pr}dppx)`).addEventListener("change", updatePixelRatio, {
                once: true,
            });
        };

        updatePixelRatio();
    }, [isDoublePage]);

    const renderPage = useCallback(
        async (canvas: HTMLCanvasElement | null, page: number) => {
            //変数の用意
            const ctx = canvas?.getContext("2d");
            if (!ctx || !pdf || !canvas) return;

            //ページが存在しない場合は白紙を表示
            if (page > pdf.numPages) {
                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                return;
            }

            //レンダリング処理
            const pageData = await pdf?.getPage(page);

            const viewport = pageData?.getViewport({ scale: scale });
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            pageData?.render({
                canvasContext: ctx,
                viewport,
            }).promise;
        },
        [pdf, page, scale]
    );

    useEffect(() => {
        renderPage(canvasRef.current, page);
        if (isDoublePage) {
            renderPage(secondCanvasRef.current, page + 1);
        }
    }, [pdf, page, scale, isDoublePage]);

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
                if (isDoublePage && next % 2 === 0) {
                    if (page > 0) {
                        return next - 1;
                    } else {
                        return next + 1;
                    }
                }
                return next;
            });
        },
        [pdf]
    );

    return (
        <PDFViewerContainer className={className}>
            <CanvasGroup>
                <CanvasWrapper>
                    <PDFViewerCanvas ref={canvasRef} />
                </CanvasWrapper>
                {isDoublePage && (
                    <CanvasWrapper>
                        <PDFViewerCanvas ref={secondCanvasRef} />
                    </CanvasWrapper>
                )}
            </CanvasGroup>
            <ButtonGroup>
                <Button
                    variant="contained"
                    onClick={() => {
                        if (isDoublePage) {
                            pageUpdate(-2);
                        } else {
                            pageUpdate(-1);
                        }
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
                        if (isDoublePage) {
                            pageUpdate(2);
                        } else {
                            pageUpdate(1);
                        }
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

const CanvasGroup = styled.div({
    display: "flex",
    gap: "1rem",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
});

const CanvasWrapper = styled.div({
    flex: 1,
});

const PDFViewerCanvas = styled.canvas(({ hidden }: { hidden?: boolean }) => ({
    display: hidden ? "none" : "block",
    width: "100%",
    height: "auto",
    boxShadow: "0 0 5px 0 rgba(0, 0, 0, 0.5)",
    flex: 1,
}));

const ButtonGroup = styled.div({
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
});
