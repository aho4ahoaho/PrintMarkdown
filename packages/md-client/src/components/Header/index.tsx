import styled from "@emotion/styled";

export const Header = () => {
    return (
        <TheHeader>
            <HeaderTitle>MDPrint</HeaderTitle>
        </TheHeader>
    );
};

export const TheHeader = styled.header({
    backgroundColor: "hsl(0, 0%, 20%)",
    color: "white",
    padding: "0.5rem 1rem",
    width: "100%",
    boxSizing: "border-box",
});

export const HeaderTitle = styled.h1({
    margin: 0,
    fontSize: "1.5rem",
    fontWeight: "normal",
    textAlign: "center",
});
