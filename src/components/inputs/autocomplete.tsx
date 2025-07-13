import { alpha, Autocomplete, AutocompleteProps, Chip, FormControl, FormControlProps, ListItem, ListItemText, TextFieldProps, useTheme } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import Inputs from ".";
import { debounce } from "lodash";
import { Icon } from "@iconify/react";
import validate from "@/utils/validate";

export type AutocompleteInputProps<
    Value = any, 
    Multiple extends boolean | undefined = any, 
    DisableClearable extends boolean | undefined = any, 
    FreeSolo extends boolean | undefined = any,
    ChipComponent extends React.ElementType = any
> = Omit<AutocompleteProps<Value, Multiple, DisableClearable, FreeSolo, ChipComponent>, 'options'|'value'|'renderInput'|'onInputChange'|'onChange'|'filterOptions'|'autoComplete'|'includeInputInList'|'renderOption'> & {
    formControlProps?: FormControlProps;
    inputProps?: TextFieldProps;
    loadingText?: string;
    onSearch: (search: string) => any;
    value: any;
    setValue: (value: any) => void;
    filterSelected: (option: any, value: any) => boolean;
    optionLabel: (option: any) => string;
    optionCustomLabel?: (option: any) => React.ReactNode;
    options?: any[];
    loaded?: boolean;
    useDefaultOptions?: boolean;
}

export default ({ 
    formControlProps = { fullWidth: true }, 
    inputProps = {}, 
    fullWidth = true, 
    multiple = true, 
    loadingText = 'Carregando...',
    noOptionsText = 'Nenhum item encontrado',
    onSearch,
    value,
    setValue,
    filterSelected,
    optionLabel,
    optionCustomLabel = undefined,
    options: __options = [],
    loaded: __loaded = false,
    useDefaultOptions = false,
    ...autocompleteProps 
}: AutocompleteInputProps) => {
    const theme = useTheme();
    const [options, setOptions] = useState<any[]>(useDefaultOptions ? __options : []);
    const [inputValue, setInputValue] = useState<string>('');
    const [loaded, setLoaded] = useState<boolean>(useDefaultOptions ? __loaded : false);
    const fetch = useMemo(() => debounce((request: { input: string }, callback: (results: any[]) => void) => {
        const response = onSearch(request.input);
        if (validate.isPromise(response)) {
            response.then(res => {
                callback(res as any);
            }).catch(() => {
                callback([]);
            });
        } else {
            callback(response);
        }
    }, 500), []);

    useEffect(() => {
        let active = true;

        if (inputValue === '') {
            setOptions(useDefaultOptions ? __options : []);
            return undefined;
        }

        if (inputValue.length < 3) {
            setOptions(useDefaultOptions ? __options : []);
            return undefined;
        }

        setLoaded(true);

        fetch({ input: inputValue }, (results) => {
            setLoaded(false);
            setOptions(results);
        });

        return () => {
            active = false;
        };
    }, [value, inputValue, fetch]);

    return <FormControl {...formControlProps}>
        <Autocomplete 
            autoComplete
            includeInputInList
            fullWidth={fullWidth}
            multiple={multiple}
            value={value}
            filterOptions={(x) => x}
            options={options}
            noOptionsText={loaded ? loadingText : noOptionsText}
            renderInput={(params) => <Inputs.TextField {...params} {...inputProps} />}
            onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
            onChange={(event, newValue) => setValue(newValue)}
            renderOption={(props, option) => {
                const { key, style = {}, ...optionProps } = props;
                return <ListItem
                    key={key}
                    {...optionProps}
                    sx={{ ...style, '&:hover': { background: theme => alpha(theme.palette.secondary.main, 0.2) } }}
                    secondaryAction={value.filter((i: any) => filterSelected(i, option)).length > 0 ? <Icon icon='lucide:check' fontSize={25} style={{ color: theme.palette.primary.main }} /> : null}
                >
                    {optionCustomLabel === undefined && <ListItemText
                        primary={optionLabel(option)}
                        primaryTypographyProps={{
                            sx: {
                                width: '100%',
                                wordWrap: 'break-word',
                                whiteSpace: 'break-spaces',
                            },
                        }}
                    />}
                    {optionCustomLabel !== undefined && optionCustomLabel(option)}
                </ListItem>
            }}
            renderTags={(value, getTagProps) => value.map((option, index) => {
                const { key, ...tagProps } = getTagProps({ index });

                return <Chip variant="filled" color="primary" label={optionLabel(option)} key={key} sx={{ '& .MuiChip-label': { fontWeight: 700 } }} {...tagProps} />
            })}
            {...autocompleteProps}
        />
    </FormControl>
}