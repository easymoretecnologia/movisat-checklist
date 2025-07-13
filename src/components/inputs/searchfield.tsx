import { Icon } from "@iconify/react";
import { FormControl, FormControlProps, InputAdornment, TextField, TextFieldProps } from "@mui/material";
import { useStateType } from "@/types";

export type SearchFieldProps = TextFieldProps & {
    onSearch: useStateType<string>;
    formControlProps?: FormControlProps;
}

export default function SearchField ({ onSearch, formControlProps, ...props }: SearchFieldProps) {
    return <FormControl fullWidth {...formControlProps}>
        <TextField
            size="medium"
            placeholder="Pesquisar"
            fullWidth
            sx={{ bgcolor: 'white' }}
            {...props}
            onChange={e => onSearch(e.target.value)}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <Icon icon="healthicons:magnifying-glass-outline" fontSize={16} />
                    </InputAdornment>
                )
            }}
            autoFocus={true}
            onKeyDown={e => e.key !== "Escape" && e.stopPropagation()}
        />
    </FormControl>
}
