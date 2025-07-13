import { Icon, IconProps } from "@iconify/react";
import { Box, IconButton, Menu, MenuItem, MenuItemProps, MenuProps, styled } from "@mui/material";
import React, { MouseEvent, ReactNode, memo, useState } from "react";

type OptionsProps = Omit<MenuProps, "keepMounted" | "anchorEl" | "open" | "onClose"> & {};

export default ({ children, ...props }: OptionsProps) => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const rowOptionsOpen = Boolean(anchorEl);

	const handleOptionsClick = (event: MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
	const handleOptionsClose = () => setAnchorEl(null);

	return (
		<Box>
			<IconButton size='small' onClick={handleOptionsClick}>
				<Icon icon='bx:dots-vertical-rounded' fontSize={20} />
			</IconButton>

			<Menu
				keepMounted
				anchorEl={anchorEl}
				open={rowOptionsOpen}
				onClose={handleOptionsClose}
				anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
				transformOrigin={{ vertical: "top", horizontal: "right" }}
				slotProps={{ paper: { style: { minWidth: "8rem" } } }}
				{...props}
			>
				{children}
			</Menu>
		</Box>
	);
};

const StyledMenu = styled(MenuItem)<MenuItemProps & { href?: string }>(({ theme }) => ({
	"& svg": {
		marginRight: ".5rem",
	},
}));

type ItemProps = MenuItemProps & {
	icon: string;
	iconProps?: Omit<IconProps, "icon">;
	onClick?: Function;
	title: string | ReactNode;
	href?: string;
	size?: number;
};
export const Item = ({ icon, title, iconProps, size = 20, ...props }: ItemProps) => {
	return (
		<StyledMenu {...props}>
			<Icon icon={icon} fontSize={size} {...iconProps} />
			{title}
		</StyledMenu>
	);
};
