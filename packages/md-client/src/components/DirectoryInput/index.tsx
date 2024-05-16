import { HTMLAttributes } from "preact/compat";
import { useRef } from "preact/hooks";
import React, { useEffect } from "react";

type DirectoryInputProps = HTMLAttributes<HTMLInputElement> & {
    ref?: React.RefObject<HTMLInputElement> | React.MutableRefObject<HTMLInputElement>;
    directory: boolean;
};
export const DirectoryInput = ({
    children,
    directory,
    ref: propRef,
    ...props
}: DirectoryInputProps) => {
    const ref = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const input = propRef?.current ?? ref.current;

        if (directory) {
            input?.setAttribute("directory", "true");
            input?.setAttribute("webkitdirectory", "true");
        } else {
            input?.removeAttribute("directory");
            input?.removeAttribute("webkitdirectory");
        }
    }, [ref, directory, propRef]);

    return (
        <input {...props} ref={propRef ?? ref} type="file">
            {children}
        </input>
    );
};
