import { FilterProps } from "@/types/filter";
import { Box, IconButton, TableCell, TableCellProps, Typography, TypographyProps, styled } from "@mui/material";
import React, { ReactNode } from "react";
import { useStateType } from "@/types";
import { Icon, IconProps } from "@iconify/react/dist/iconify.js";

type SortIconProps = Omit<IconProps, "icon"> & {
	sorted: boolean;
	direction: FilterProps["direction"];
};
const StyledIcon = styled(Icon)<IconProps>(({ theme }) => ({
	cursor: "pointer",
	color: 'white',
}));

const SortIcon = ({ sorted, direction, ...props }: SortIconProps) => {
	if (!sorted) {
		return <StyledIcon icon='solar:sort-vertical-linear' fontSize={22} {...props} />;
	}

	return direction === "asc" ? (
		<StyledIcon icon='bi:sort-down-alt' fontSize={22} {...props} />
	) : (
		<StyledIcon icon='bi:sort-down' fontSize={22} {...props} />
	);
};

type ComponentProps<Filters = FilterProps> = TableCellProps & {
	name?: string;
	filters?: Filters;
	setFilters?: useStateType<any>;
	iconProps?: Omit<IconProps, "icon" | "direction">;
	typographyProps?: TypographyProps;
	title: string | ReactNode;
};
export default function Title({
	name = '',
	align = "center",
	filters,
	setFilters,
	sx = { position: "relative" },
	...props
}: ComponentProps) {
	const onClick = () => {
		if (filters && setFilters) {
            setFilters((prevState: any) => ({
                ...prevState,
                by: name,
                direction: name === filters.by ? (filters.direction === "asc" ? "desc" : "asc") : "asc",
            }));
        }
	};

	return (
		<TableCell align={align} sx={{ ...sx }} {...props}>
			{!filters && (
				<Box sx={{ display: 'flex', justifyContent: align, alignItems: 'center' }}>
					<Typography fontSize={".9rem"} fontWeight={700} sx={{ textTransform: "none" }} {...props.typographyProps}>
						{props.title}
					</Typography>
				</Box>
			)}
			{filters && name && (
				<Box sx={{ display: 'flex', justifyContent: align, alignItems: 'center' }}>
					<Typography fontSize={".9rem"} fontWeight={700} sx={{ textTransform: "none", position: 'relative', width: 'fit-content' }} {...props.typographyProps}>
						{props.title}
					</Typography>
					<IconButton
						size='small'
						onClick={onClick}
						/* sx={{ position: "absolute", right: -50, top: 0, bottom: 0, ":hover": { background: "transparent" } }} */
						sx={{ marginLeft: ".25rem" }}
					>
						<SortIcon sorted={name === filters.by} direction={filters.direction} {...props.iconProps} />
					</IconButton>
				</Box>
			)}
		</TableCell>
	);
}
