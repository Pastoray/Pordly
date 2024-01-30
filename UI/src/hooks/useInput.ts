import { useState } from "react";

export function useInput(initialValue: any) {
    const [value, setValue] = useState(initialValue);
    function handleValue(event: React.ChangeEvent<HTMLInputElement>) {
        setValue(event.target.value);
    }
    return [value, handleValue];
}