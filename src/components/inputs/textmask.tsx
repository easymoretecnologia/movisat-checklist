import React from "react";
import { IMaskInput } from "react-imask";

interface TextMaskProps {
    onChange: (event: { target: { name: string; value: string; } }) => void;
    name: string;
    mask: string;
    definitions: any;
}

const TextMask = React.forwardRef<HTMLElement, TextMaskProps>(
    function TextMask(props, ref) {
        const { onChange, name, mask, definitions, ...other } = props;

        return (
            <IMaskInput
                {...other}
                mask={mask}
                definitions={definitions}
                inputRef={ref as any}
                onAccept={(value: any) => onChange({ target: { name: props.name, value } })}
                overwrite
            />
        );
    }
);

export default TextMask;