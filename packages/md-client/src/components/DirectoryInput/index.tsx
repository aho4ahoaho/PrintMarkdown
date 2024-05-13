import { HTMLAttributes } from "preact/compat";
import { useRef } from "preact/hooks";
import React, { useEffect } from "react";

type DirectoryInputProps = HTMLAttributes<HTMLInputElement> & {
    ref?: React.RefObject<HTMLInputElement> | React.MutableRefObject<HTMLInputElement>;
    webkitdirectory: boolean;
};
export const DirectoryInput = ({
    children,
    webkitdirectory,
    ref: propRef,
    ...props
}: DirectoryInputProps) => {
    const ref = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const input = propRef?.current ?? ref.current;

        if (webkitdirectory) {
            input?.setAttribute("webkitdirectory", "true");
        } else {
            input?.removeAttribute("webkitdirectory");
        }
    }, [ref, webkitdirectory, propRef]);

    return (
        <input {...props} ref={propRef ?? ref} type="file">
            {children}
        </input>
    );
};
