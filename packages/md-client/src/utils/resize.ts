import { useEffect, useState, useCallback } from "preact/hooks";

export const useOnResize = <T>(
    callback: (event: UIEvent | null) => T,
    deps: React.DependencyList
) => {
    const [value, setValue] = useState<T>();
    const onResize = useCallback(
        (event: UIEvent | null) => {
            setValue(callback(event));
        },
        [callback]
    );

    useEffect(() => {
        window.addEventListener("resize", onResize);
        return () => {
            window.removeEventListener("resize", onResize);
        };
    }, [onResize]);

    useEffect(() => {
        setValue(callback(null));
    }, [...(deps ?? [])]);

    return value;
};
