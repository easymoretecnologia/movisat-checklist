import React, { ChangeEvent } from "react";
import { Pagination, PaginationProps, alpha, styled } from "@mui/material";

const PaginateStyled = styled(Pagination)<PaginationProps>(({ theme }) => ({
	"& .MuiPaginationItem-root:not(.MuiPaginationItem-ellipsis)": {
		fontFamily: '"Lato", sans-serif',
		'&:not([aria-current="true"]):hover': {
			backgroundColor: alpha(theme.palette.primary["main"], 0.3),
			fontWeight: 700,
			color: "white",
		},
		'&[aria-current="true"]': {
			fontWeight: 700,
		},
	},
}));

export type PaginateProps = Omit<
	PaginationProps,
	"count" | "defaultPage" | "siblingCount" | "onChange" | "showFirstButton" | "showLastButton"
> & {
	total: number;
	start?: number;
	siblings?: number;
	onChange: (event: ChangeEvent<unknown>, page: number) => void;
};

const Paginate = ({ total, start = 1, siblings = 2, onChange, size = "large", ...props }: PaginateProps) => (
	<PaginateStyled
		{...props}
		size={size}
		count={total}
		defaultPage={start}
		siblingCount={siblings}
		showFirstButton
		showLastButton
		onChange={onChange}
	/>
);

export default Paginate;
