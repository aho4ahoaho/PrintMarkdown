import styled from "@emotion/styled";
import { Button } from "@mui/material";
import { ReactNode } from "preact/compat";

type ModalProps = {
    title?: ReactNode;
    children?: ReactNode;
    onPositiveClick?: () => void;
    onNegativeClick?: () => void;
};

export const ErrorModal = ({ title, children, onNegativeClick, onPositiveClick }: ModalProps) => {
    return (
        <ModalWrapper>
            <ModalContainer>
                {title && <ModalTitle>{title}</ModalTitle>}
                <ModalContent>{children}</ModalContent>
                <ModalSpace />
                <ButtonContainer>
                    {onPositiveClick && (
                        <Button variant="contained" fullWidth onClick={onPositiveClick}>
                            OK
                        </Button>
                    )}
                    {onNegativeClick && (
                        <Button variant="outlined" fullWidth onClick={onNegativeClick}>
                            Cancel
                        </Button>
                    )}
                </ButtonContainer>
            </ModalContainer>
        </ModalWrapper>
    );
};

const ModalWrapper = styled.div({
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
});

const ModalContainer = styled.div({
    backgroundColor: "white",
    padding: "1rem",
    borderRadius: "0.25rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: "1rem",
    width: "min(100%, 400px)",
    minHeight: "200px",
    maxHeight: "80vh",
});

const ModalContent = styled.div({
    whiteSpace: "pre-wrap",
});

const ModalTitle = styled.h2({
    margin: 0,
    fontSize: "1.5rem",
    fontWeight: "normal",
    textAlign: "center",
});

const ModalSpace = styled.div({
    flex: 1,
});

const ButtonContainer = styled.div({
    display: "flex",
    flexDirection: "row-reverse",
    gap: "1rem",
    justifyContent: "center",
    marginTop: "1rem",
});
