import { styled } from "@mui/material";
import { TabList, TabListProps } from "@mui/lab";

export default styled(TabList)<TabListProps>(({ theme }) => ({
	minHeight: 40,
	marginBottom: theme.spacing(6),
	"& .MuiTabs-indicator": {
		display: "none",
	},
	"& .MuiTab-root": {
		minWidth: 65,
		minHeight: 40,
		paddingTop: theme.spacing(2.5),
		paddingBottom: theme.spacing(2.5),
		borderRadius: theme.shape.borderRadius,
		"&.Mui-selected": {
			color: theme.palette.common.white,
			backgroundColor: theme.palette.primary.main,
		},
	},
}));
