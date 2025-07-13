import { Icon } from "@iconify/react";
import { Box, TableCell, TableCellProps, TableRow, Typography, styled } from "@mui/material";
import { ImgHTMLAttributes, ReactNode } from "react";
import { palette } from "@/configs/themeConfig";

const NoDataStyled = styled(TableCell)<TableCellProps>(({ theme }) => ({}));

export type NoDataProps = TableCellProps & {
	src?: string;
	text?: string | ReactNode;
	imgProps?: Omit<ImgHTMLAttributes<HTMLImageElement>, "src">;
	alt?: string;
	classNameImage?: string;
	hasIcon?: boolean;
	icon?: ReactNode;
};

const defaultText = (
	<Typography fontSize='1rem' fontWeight={500} className='!mt-4'>
		Nenhum resultado encontrado
	</Typography>
);

const NoData = ({
	src = "/svg/no-results.svg",
	text = defaultText,
	imgProps = { style: { height: 100 } },
	className = "",
	alt = "No Data",
	classNameImage,
	hasIcon = true,
	icon = null,
	...props
}: NoDataProps) => (
	<TableRow>
		<NoDataStyled {...props} className={"!p-12 " + className}>
			<Box className='!w-full !grid !place-items-center !text-center'>
				{/* <img alt={alt} src={src} className={classNameImage} {...imgProps} /> */}
                {hasIcon && !icon && <Icon icon='material-symbols:search-insights' fontSize={60} style={{ color: palette.primary.main }} />}
				{icon ? icon : null}
				{text ? text : null}
			</Box>
		</NoDataStyled>
	</TableRow>
);

export default NoData;
