import { Box, FormControl, FormControlProps, TextField, TextFieldProps } from "@mui/material";

export type TextInputProps = TextFieldProps & {
    formControlProps?: FormControlProps;
    value?: any;
}

export default ({ size = 'medium', fullWidth = true, formControlProps = { fullWidth: true }, helperText = null, sx = {}, value = '', ...props }: TextInputProps) => {
    return <FormControl {...formControlProps}>
        <TextField
            size={size}
            autoComplete="off"
            fullWidth={fullWidth}
            sx={{
                fontFamily: 'Arial',
                ...sx,
            }}
            value={value}
            {...props}
        />
        {helperText ? (
            <Box sx={{ marginTop: '.25rem' }}>
                {helperText}
            </Box>
        ) : null}
    </FormControl>
}
