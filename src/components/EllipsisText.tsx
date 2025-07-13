import { Box, BoxProps, styled } from "@mui/material";

export default styled(Box)<BoxProps>(({ theme }) => ({
	display: "inline-block",
	width: "300px !important",
	whiteSpace: "nowrap",
	overflow: "hidden",
	textOverflow: "ellipsis",
	fontSize: ".9rem",
}));
