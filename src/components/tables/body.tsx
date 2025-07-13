import { styled, TableBody, TableBodyProps } from "@mui/material";

const StyledBody = styled(TableBody)<TableBodyProps>(({ theme }) => ({}));

type BodyProps = TableBodyProps & {};

export default function Body({ children, sx = {}, ...props }: BodyProps) {
    return (
        <StyledBody
            {...props}
            sx={{
                ...sx,
                '& tr.MuiTableRow-root:nth-of-type(odd)': { backgroundColor: '#f0f0f0' },
                '& tr.MuiTableRow-root:nth-of-type(even)': { backgroundColor: '#ebebeb' },
            }}
        >
            {children}
        </StyledBody>
    );
}
