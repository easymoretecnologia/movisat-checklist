import { TableCell, TableCellProps } from "@mui/material";
import React from "react";

type ColumnProps = TableCellProps & {};

export default ({ children, ...props }: ColumnProps) => {
	return (
		<TableCell align='center' {...props}>
			{children}
		</TableCell>
	);
};
