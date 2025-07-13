import React, { ReactNode } from "react";
import { Skeleton, SkeletonProps, TableCell, TableCellProps, TableRow, TableRowProps, styled } from "@mui/material";

const LoadingStyled = styled(TableCell)<TableCellProps>(({ theme }) => ({}));

const Loading = ({ className = "", count = 4, itemProps = {}, rowProps = {}, ...props }: TableCellProps & { count?: number; itemProps?: SkeletonProps; rowProps?: TableRowProps;  } ) => {
	const Rows = () => {
		const rows: ReactNode[] = [];

		for (let i = 0; i < count; i++) {
			rows.push(
				<Skeleton
					key={`${(new Date()).getTime()}-${i}`}
					variant='rectangular'
					animation='wave'
					height={48}
					width='100%'
					sx={{ my: 3, bgcolor: "primary.100", borderRadius: 2 }}
					{...itemProps}
				/>
			);
		}
		return rows;
	}

	return (
		<TableRow {...rowProps}>
			<LoadingStyled {...props} className={className}>
				<Rows />
			</LoadingStyled>
		</TableRow>
	);
};

export default Loading;
