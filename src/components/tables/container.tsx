import { Table as MUITable, TableProps as MUITableProps, styled, BoxProps, Box, TableContainer } from "@mui/material";
import React from "react";
import useWindowSize from "@/hooks/useWindowSize";

const Wrapper = styled(Box)<BoxProps>(({ theme }) => ({
	maxWidth: "100%",
	overflow: "hidden",
}));

type TableProps = MUITableProps & {
	boxProps?: BoxProps;
};
export default ({ boxProps = {}, children, stickyHeader = false, ...props }: TableProps) => {
	const { width, height } = useWindowSize();
	return (
		<Wrapper {...boxProps}>
			<TableContainer /* sx={{ maxHeight: `calc(${height}px - 300px)` }} */>
				<MUITable stickyHeader={stickyHeader} {...props}>
					{children}
				</MUITable>
			</TableContainer>
		</Wrapper>
	);
}
