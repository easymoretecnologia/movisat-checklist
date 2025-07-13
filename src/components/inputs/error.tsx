import { Icon } from "@iconify/react";
import { Typography } from "@mui/material";
import { TypographyProps } from "@mui/system";
import { PropsWithChildren, ReactNode } from "react";

export default ({ text, ...props }: TypographyProps & { text: string|ReactNode }) => {
    return <Typography color='error' sx={{ textAlign: 'left', fontSize: '.8rem', fontWeight: 600, fontFamily: 'Arial', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 1 }} {...props}>
        <Icon icon='solar:close-circle-broken' fontSize={15} style={{ color: 'var(--scarlet)' }} />
        {text}
    </Typography>
}
