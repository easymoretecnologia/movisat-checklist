import { TableCell, TableCellProps, Typography, TypographyProps } from "@mui/material";
import React, { memo } from "react";

type TextProps = TableCellProps & {
	typographyProps?: TypographyProps;
};

export default ({ children, typographyProps = {}, ...props }: TextProps) => {
	return (
		<TableCell align='center' {...props}>
			<Typography fontSize='.8rem' {...typographyProps}>
				{children}
			</Typography>
		</TableCell>
	);
};
