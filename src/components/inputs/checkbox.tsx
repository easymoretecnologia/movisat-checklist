import { Checkbox, CheckboxProps, FormControl, FormControlLabel, FormControlLabelProps, FormControlProps } from "@mui/material";

export type CheckboxInputProps = CheckboxProps & {
    formControlProps?: FormControlProps;
    hasLabel?: boolean;
    labelProps?: Omit<FormControlLabelProps, 'control'>;
}

export default ({ 
    size = 'small', 
    formControlProps = { fullWidth: true }, 
    sx = {}, 
    hasLabel = false,
    labelProps = { label: '' },
    ...props 
}: CheckboxInputProps) => {

    return <FormControl {...formControlProps}>
        {hasLabel ? (
            <FormControlLabel {...labelProps} control={<Checkbox size={size} sx={{ ...sx }} {...props} />} />
        ) : (
            <Checkbox size={size} sx={{ ...sx }} {...props} />
        )}
    </FormControl>
}