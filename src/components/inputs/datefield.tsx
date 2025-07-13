import { Box, FormControl, FormControlProps } from "@mui/material"
import { DatePicker, DatePickerProps } from "@mui/x-date-pickers"
import { DateTime } from "luxon"
import { memo, ReactNode } from "react"

export type DateFieldProps = Omit<DatePickerProps<DateTime>, 'value'> & {
    value: string|null
    formControlProps?: FormControlProps
    size?: 'small'|'medium'
    helperText?: string | ReactNode
}

export default memo(({
    value,
    formControlProps = {
        fullWidth: true
    },
    size = 'medium',
    slotProps = {},
    helperText = null,
    ...props
}: DateFieldProps) => {
    return <FormControl {...formControlProps}>
        <DatePicker
            format='dd/MM/yyyy'
            value={value ? DateTime.fromSQL(value) ?? undefined : undefined}
            {...props}
            slotProps={{
                ...slotProps,
                textField: {
                    size: size,
                    ...(slotProps.textField || {})
                }
            }}
        />
         {helperText ? (
            <Box sx={{ marginTop: '.25rem' }}>
                {helperText}
            </Box>
        ) : null}
    </FormControl>
})
