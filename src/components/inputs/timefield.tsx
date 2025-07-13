import { Box, FormControl, FormControlProps } from "@mui/material"
import { TimePicker, TimePickerProps } from "@mui/x-date-pickers"
import { DateTime } from "luxon"
import { memo, ReactNode } from "react"

export type TimeFieldProps = Omit<TimePickerProps<DateTime>, 'value'> & {
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
}: TimeFieldProps) => {
    return <FormControl {...formControlProps}>
        <TimePicker
            views={["hours", "minutes", "seconds"]}
			ampm={false}
			ampmInClock={false}
			timeSteps={{ hours: 1, minutes: 1, seconds: 1 }}
			format='HH:mm:ss'
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
