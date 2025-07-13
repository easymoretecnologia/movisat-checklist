import Swal, { SweetAlertCustomClass } from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import sweetbuttonCva from "./cva/sweetalert.cva";
import { SweetAlertOptions } from "@/types/sweetalert";
import { Box, CircularProgress, Typography } from "@mui/material";
import { AxiosResponse } from "axios";
import React, { ReactElement, ReactNode } from "react";
import { Icon } from "@iconify/react";

export const SwalReact = withReactContent(Swal);

export const Toast = SwalReact.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: false,
    didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
        toast.onclick = () => {
            Toast.close();
        };
    },
});

export const dcc: SweetAlertCustomClass = {
    confirmButton: sweetbuttonCva({ color: 'common', outline: true }),
    cancelButton: sweetbuttonCva({ color: 'error', outline: true }),
    icon: 'p-2 border-0',
}

export const defaultCustom = (customClass: SweetAlertCustomClass): SweetAlertCustomClass => ({ ...dcc, ...customClass });
export const textToast = (message: string) => <Typography fontSize='.8rem' fontWeight={600}>{message}</Typography>;

export default {
    close: () => SwalReact.close(),

    loading: () => SwalReact.fire({
        customClass: defaultCustom({ popup: 'bg-transparent' }),
        showCancelButton: false,
        showCloseButton: false,
        showDenyButton: false,
        showConfirmButton: false,
        reverseButtons: true,
        allowOutsideClick: false,
        iconHtml: <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center'/* , '& img': { filter: 'brightness(0) invert(1)', '-webkit-filter': 'brightness(0) invert(1)' } */ }}>
            <img src="/images/logo.png" style={{ width: 250, maxWidth: 250 }} />
            <CircularProgress color="primary" size={100} disableShrink sx={{ mt: 6, '&.MuiCircularProgress-root': { color: 'var(--biscay)' } }} />
        </Box>
    }),

    raw: ({ customClass = {}, ...options }: SweetAlertOptions) => SwalReact.fire({
        customClass: defaultCustom(customClass),
        confirmButtonText: 'Fechar',
        reverseButtons: true,
        ...options,
    }),

    error: ({ customClass = {}, ...options }: SweetAlertOptions) => SwalReact.fire({
        iconHtml: <Icon icon='solar:danger-triangle-linear' fontSize={80} style={{ color: 'var(--scarlet)' }} opacity={1} />,
        customClass: defaultCustom(customClass),
        confirmButtonText: 'Fechar',
        reverseButtons: true,
        ...options,
    }),

    warning: ({ customClass = {}, ...options }: SweetAlertOptions) => SwalReact.fire({
        iconHtml: <Icon icon='solar:danger-circle-linear' fontSize={80} style={{ color: 'var(--amber-400)' }} opacity={1} />,
        customClass: defaultCustom(customClass),
        confirmButtonText: 'Fechar',
        reverseButtons: true,
        ...options,
    }),

    success: ({ customClass = {}, ...options }: SweetAlertOptions) => SwalReact.fire({
        iconHtml: <Icon icon='solar:chat-round-check-linear' fontSize={80} style={{ color: 'var(--emerald-500)' }} />,
        customClass: defaultCustom(customClass),
        confirmButtonText: 'Fechar',
        reverseButtons: true,
        ...options,
    }),

    sent: ({ customClass = {}, ...options }: SweetAlertOptions) => SwalReact.fire({
        iconHtml: <Icon icon='hugeicons:sent' fontSize={80} style={{ color: 'var(--tangaroa-900)' }} />,
        customClass: defaultCustom(customClass),
        confirmButtonText: 'Fechar',
        reverseButtons: true,
        ...options,
    }),

    subscription: ({ customClass = {}, ...options }: SweetAlertOptions) => SwalReact.fire({
        customClass: defaultCustom(customClass),
        confirmButtonText: 'Fechar',
        reverseButtons: true,
        ...options,
    }),

    delete: ({ customClass = {}, ...options }: SweetAlertOptions) => SwalReact.fire({
        iconHtml: <Icon icon='solar:trash-bin-trash-linear' fontSize={80} style={{ color: 'var(--tangaroa-900)' }} />,
        customClass: defaultCustom(customClass),
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true,
        ...options,
    }),

    create: ({ customClass = {}, ...options }: SweetAlertOptions) => SwalReact.fire({
        iconHtml: <Icon icon='solar:add-circle-broken' fontSize={80} style={{ color: 'var(--tangaroa-950)' }} />,
        customClass: defaultCustom(customClass),
        showCancelButton: true,
        confirmButtonText: 'Cadastrar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true,
        ...options,
    }),

    edit: ({ customClass = {}, ...options }: SweetAlertOptions) => SwalReact.fire({
        iconHtml: <Icon icon='solar:clapperboard-edit-linear' fontSize={80} style={{ color: 'var(--tangaroa-950)' }} />,
        customClass: defaultCustom(customClass),
        showCancelButton: true,
        confirmButtonText: 'Salvar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true,
        ...options,
    }),

    unprocessable: ({ customClass = {}, response = {}, message = '', ...options }: SweetAlertOptions & { response?: AxiosResponse|any, message?: ReactNode }) => {
        const errors: ReactNode[] = [];

        if (response) {
            if (response.data) {
                if (response.data.errors) {
                    const data_errors: string[]|Object = response.data.errors;

                    if (data_errors.constructor === Array) {
                        if (data_errors.length > 0) {
                            data_errors.forEach((error: string, index: number) => errors.push(<Typography key={`${error}`}>{error}</Typography>));
                        }
                    } else if (Object.keys(data_errors).length > 0) {
                        Object.keys(data_errors).forEach((key: string) => {
                            const byKey = (data_errors as any)[key];

                            if (byKey.constructor === Array) {
                                byKey.forEach((error: string, index: number) => errors.push(<Typography key={`${error}`}>{error}</Typography>));
                            } else {
                                errors.push(<Typography key={`${byKey}`}>{byKey}</Typography>);
                            }
                        });
                    }
                }

                if (errors.length === 0 && response.data.message) {
                    errors.push(response.data.message);
                }
            }
        }

        if (errors.length === 0) {
            if (response && response.statusText) {
                errors.push(response.statusText);
            } else if (message) {
                errors.push(message);
            }
        }

        return SwalReact.fire({
            iconHtml: <Icon icon='solar:danger-triangle-linear' fontSize={80} style={{ color: 'var(--scarlet)' }} opacity={1} />,
            customClass: defaultCustom(customClass),
            confirmButtonText: 'Fechar',
            reverseButtons: true,
            ...options,
            html: errors.length > 0 ? <React.Fragment>{errors}</React.Fragment> : <Typography>Erro desconhecido</Typography>,
        });
    }
}

export const toast = {
    close: () => Toast.close(),

    raw: ({ customClass = {}, ...options }: SweetAlertOptions) => Toast.fire({
        customClass: defaultCustom({ ...customClass, timerProgressBar: 'bg-minsk swal-height-progressbar' }),
        ...options,
    } as any),

    error: ({ customClass = {}, ...options }: SweetAlertOptions) => Toast.fire({
        iconHtml: <Icon icon='solar:danger-triangle-linear' fontSize={32} style={{ color: 'var(--scarlet)' }} opacity={1} />,
        customClass: defaultCustom({ ...customClass, timerProgressBar: 'bg-minsk swal-height-progressbar' }),
        ...options,
    } as any),

    warning: ({ customClass = {}, ...options }: SweetAlertOptions) => Toast.fire({
        iconHtml: <Icon icon='solar:danger-circle-linear' fontSize={32} style={{ color: 'var(--amber-400)' }} opacity={1} />,
        customClass: defaultCustom({ ...customClass, timerProgressBar: 'bg-minsk swal-height-progressbar' }),
        ...options,
    } as any),

    success: ({ customClass = {}, ...options }: SweetAlertOptions) => Toast.fire({
        iconHtml: <Icon icon='lucide:circle-check-big' fontSize={32} style={{ color: 'var(--emerald-500)' }} />,
        customClass: defaultCustom({ ...customClass, timerProgressBar: 'bg-minsk swal-height-progressbar' }),
        ...options,
        onClick: () => toast.close(),
    } as any),

    sent: ({ customClass = {}, ...options }: SweetAlertOptions) => Toast.fire({
        iconHtml: <Icon icon='hugeicons:sent' fontSize={26} style={{ color: 'var(--tangaroa-900)' }} />,
        customClass: defaultCustom({ ...customClass, timerProgressBar: 'bg-minsk swal-height-progressbar' }),
        ...options,
    } as any),

    unprocessable: ({ customClass = {}, response = {}, message = '', ...options }: SweetAlertOptions & { response?: AxiosResponse|any, message?: ReactNode }) => {
        const errors: ReactNode[] = [];

        if (response) {
            if (response.data) {
                if (response.data.errors) {
                    const data_errors: string[]|Object = response.data.errors;

                    if (data_errors.constructor === Array) {
                        if (data_errors.length > 0) {
                            data_errors.forEach((error: string) => errors.push(<Typography>{error}</Typography>));
                        }
                    } else if (Object.keys(data_errors).length > 0) {
                        Object.keys(data_errors).forEach((key: string) => {
                            const byKey = (data_errors as any)[key];

                            if (byKey.constructor === Array) {
                                byKey.forEach((error: string) => errors.push(<Typography>{error}</Typography>));
                            } else {
                                errors.push(<Typography>{byKey}</Typography>);
                            }
                        });
                    }
                }

                if (errors.length === 0 && response.data.message) {
                    errors.push(response.data.message);
                }
            }
        }

        if (errors.length === 0) {
            if (response && response.statusText) {
                errors.push(response.statusText);
            } else if (message) {
                errors.push(message);
            }
        }

        return Toast.fire({
            iconHtml: <Icon icon='solar:danger-triangle-linear' fontSize={32} style={{ color: 'var(--scarlet)' }} opacity={1} />,
            customClass: defaultCustom(customClass),
            ...options,
            html: errors.length > 0 ? <React.Fragment>{errors}</React.Fragment> : <Typography>Erro desconhecido</Typography>,
        } as any);
    }
}
