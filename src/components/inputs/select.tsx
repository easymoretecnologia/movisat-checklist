import { Box, Button, ButtonProps, FormControl, FormControlProps, Grid2, InputLabel, InputLabelProps, ListSubheader, ListSubheaderProps, SelectProps as MuiSelectProps, Select } from "@mui/material"
import { ReactNode, SyntheticEvent, useState } from "react"
import SearchField, { SearchFieldProps } from "./searchfield"
import { Icon } from "@iconify/react"

type SelectProps = MuiSelectProps & {
    formControlProps?: FormControlProps
    options: unknown[]
    optionComponent: (item: any) => ReactNode
    render: (selected: any) => any
    filter?: (option: any) => any
    filterProps?: ListSubheaderProps
    searchFieldProps?: Omit<SearchFieldProps, 'onSearch'>
    withSearch?: boolean
    actions?: Array<ButtonProps & {
        label: string | ReactNode
    }>
    labelProps?: InputLabelProps
    helperText?: ReactNode
}

export default ({ actions, filter, formControlProps = { fullWidth: true }, options, optionComponent, withSearch = false, label, fullWidth = true, size = 'medium', render, labelProps = {}, helperText = null, filterProps = {}, searchFieldProps = {}, ...props }: SelectProps) => {
    const [search, setSearch] = useState<string>('')

    const onClose = (event: SyntheticEvent<Element, Event>) => {
        if (withSearch) {
            setSearch('')
        } else if (props.onClose) {
            props.onClose(event)
        }
    }

    return <FormControl {...formControlProps}>
        <InputLabel size={size === 'medium' ? 'normal' : 'small'} {...labelProps}>{label}</InputLabel>
        <Select
            fullWidth={fullWidth}
            size={size}
            label={label}
            onClose={onClose}
            MenuProps={withSearch ? { autoFocus: false } : {}}
            renderValue={render}
            IconComponent={(iconprops) => <Icon icon='solar:alt-arrow-down-line-duotone' {...iconprops} />}
            {...props}
        >
            {(withSearch || (actions && actions.length > 0)) && (
                <ListSubheader className='!py-2' {...filterProps}>
                    {withSearch ? <SearchField onSearch={setSearch} {...searchFieldProps} /> : null}
                    {actions && actions.length > 0 && (
                        <Grid2 container spacing={2}>
                            {actions.map(({ label: labelAction, size: sizeAction = 'small', variant = 'outlined', color = 'primary', fullWidth: fullWidthAction = true, ...buttonProps }, index) => (
                                <Grid2 size={{ xs: 12, sm: 6 }} key={`${label}-action-${index}`}>
                                    <Button size={sizeAction} variant={variant} color={color} fullWidth={fullWidthAction} {...buttonProps}>
                                        {labelAction}
                                    </Button>
                                </Grid2>
                            ))}
                        </Grid2>
                    )}
                </ListSubheader>
            )}
            {(withSearch && filter ? options.filter(option => filter(option).toLowerCase().includes(search.toLowerCase())) : options).map(option => optionComponent(option))}
        </Select>
        {helperText ? (
            <Box sx={{ marginTop: '.25rem' }}>
                {helperText}
            </Box>
        ) : null}
    </FormControl>
}
