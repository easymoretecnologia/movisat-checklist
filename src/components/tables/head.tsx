import { TableHead, TableHeadProps, TableRow, TableRowProps, styled } from "@mui/material";
import React from "react";

const StyledHead = styled(TableHead)<TableHeadProps>(({ theme }) => ({}));

type HeadProps = TableHeadProps & {
	rowProps?: TableRowProps;
};
export default function Head({ rowProps = {}, children, sx = {}, ...props }: HeadProps) {
	return (
		<TableHead
            {...props}
            sx={{
                ...sx,
                background: theme => theme.palette.primary.main,
                '& p': {
                    color: theme => 'white',
                    fontWeight: 600
                }
            }}
        >
			<TableRow {...rowProps}>{children}</TableRow>
		</TableHead>
	);
}
