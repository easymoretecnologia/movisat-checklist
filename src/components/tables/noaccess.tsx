import { Box, TableCell, TableCellProps, TableRow, Typography, styled } from "@mui/material";
import React from "react";
import { ImgHTMLAttributes, ReactNode } from "react";

const NoAccessStyled = styled(TableCell)<TableCellProps>(({ theme }) => ({}));

export type NoAccessProps = TableCellProps & {
	src?: string;
	text?: string | ReactNode;
	imgProps?: Omit<ImgHTMLAttributes<HTMLImageElement>, "src">;
};

const defaultText = (
	<Typography fontSize='1rem' fontWeight={500} className='!mt-4'>
		Você não tem permissão para visualizar está página
	</Typography>
);

const NoAccess = ({
	src = "/svg/unauthorized.svg",
	text = defaultText,
	imgProps = { style: { height: 100 } },
	className = "",
	...props
}: NoAccessProps) => (
	<TableRow>
		<NoAccessStyled {...props} className={className + " !p-12"}>
			<Box className='!w-full !grid !place-items-center !text-center'>
				<img src={src} {...imgProps} />
				{text ? text : null}
			</Box>
		</NoAccessStyled>
	</TableRow>
);

export default NoAccess;
