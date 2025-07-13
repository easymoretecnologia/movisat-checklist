import React from "react";
import { NumericFormat as NF, NumericFormatProps as NFProps } from "react-number-format";

interface NumericFormatProps {
	onChange: (event: { target: { name: string; value: string } }) => void;
	name: string;
    prefix?: string; 
    suffix?: string;
}

const NumericFormat = React.forwardRef<
    NFProps,
	NumericFormatProps
>(function NumericFormat(props, ref) {
	const { onChange, prefix = "", suffix = "", ...other } = props;

	return (
		<NF
			{...other}
			getInputRef={ref}
			onValueChange={(values) => {
				onChange({
					target: {
						name: props.name,
						value: values.value,
					},
				});
			}}
			thousandSeparator='.'
			decimalSeparator=','
			decimalScale={2}
			valueIsNumericString
			{...{ prefix: prefix ? prefix : undefined, suffix: suffix ? suffix : undefined }}
		/>
	);
});

export default NumericFormat;