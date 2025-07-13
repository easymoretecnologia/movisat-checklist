import { palette } from "@/configs/themeConfig";
import { Icon } from "@iconify/react";
import { Box, TableCell, TableCellProps, TableRow, Typography, styled } from "@mui/material";
import { ImgHTMLAttributes, ReactNode } from "react";

const ErrorStyled = styled(TableCell)<TableCellProps>(({ theme }) => ({}));

export type ErrorProps = TableCellProps & {
	src?: string;
	text?: string | ReactNode;
	imgProps?: Omit<ImgHTMLAttributes<HTMLImageElement>, "src">;
	icon?: ReactNode;
};

const defaultText = (
	<Typography fontSize='1rem' fontWeight={500} className='!mt-4'>
		Não foi possível concluir a operação.
	</Typography>
);

const defaultIcon = (
	<Icon icon='solar:danger-triangle-broken' fontSize={100} style={{ color: palette.error.main }} />
);

const Error = ({
	src = "/svg/error2.svg",
	text = defaultText,
	imgProps = { style: { height: 100 } },
	icon = defaultIcon,
	className = "",
	...props
}: ErrorProps) => (
	<TableRow>
		<ErrorStyled {...props} className={className + " !p-12"}>
			<Box className='!w-full !grid !place-items-center !text-center'>
				{!icon ? <img src={src} alt='error' {...imgProps} /> : icon}
				{text ? text : null}
			</Box>
		</ErrorStyled>
	</TableRow>
);

export default Error;
