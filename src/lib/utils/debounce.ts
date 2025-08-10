export function debounce<TArgs extends unknown[]>(
    fn: (...args: TArgs) => void,
    delayMs: number
): (...args: TArgs) => void {
    let handle: number | undefined;
    return (...args: TArgs) => {
        if (handle !== undefined) window.clearTimeout(handle);
        handle = window.setTimeout(() => fn(...args), delayMs);
    };
}
