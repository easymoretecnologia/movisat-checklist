import { Box, FormControl, FormControlProps } from "@mui/material"
import { DateTimePicker, DateTimePickerProps } from "@mui/x-date-pickers"
import { memo, ReactNode } from "react"
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers'
import { DateTime } from "luxon"

export type DateTimeFieldProps = Omit<DateTimePickerProps<DateTime>, 'value'> & {
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
    size = 'small',
    slotProps = {},
    helperText = null,
    ...props
}: DateTimeFieldProps) => {
    return <FormControl {...formControlProps}>
        <DateTimePicker
            format='dd/MM/yyyy HH:mm:ss'
            value={value ? DateTime.fromSQL(value) ?? undefined : undefined}
            {...props}
            slotProps={{
                ...slotProps,
                textField: {
                    size: size,
                    ...(slotProps.textField || {})
                }
            }}
            viewRenderers={{
                hours: renderTimeViewClock,
                minutes: renderTimeViewClock,
                seconds: renderTimeViewClock,
            }}
        />
         {helperText ? (
            <Box sx={{ marginTop: '.25rem' }}>
                {helperText}
            </Box>
        ) : null}
    </FormControl>
})