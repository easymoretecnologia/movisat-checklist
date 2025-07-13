'use client'

import _ from 'lodash'
import CustomDialog, { defaultDialogSx, useDialog } from "@/components/dialog/CustomDialog"
import Inputs from "@/components/inputs"
import PageHeader from "@/components/PageHeader"
import Tables from "@/components/tables"
import { palette } from "@/configs/themeConfig"
import { Empresa } from "@/entities/empresa.entity"
import useForm from "@/hooks/useForm"
import useClass from "@/hooks/useState"
import { FilterProps } from "@/types/filter"
import { Paginate } from "@/types/paginate"
import axios from "@/utils/axios"
import { onPage } from "@/utils/set-page"
import sweetalert, { toast } from "@/utils/sweetalert"
import { Icon } from "@iconify/react/dist/iconify.js"
import { Box, Button, Card, CardActions, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Grid2, IconButton, ListItemText, MenuItem, TableRow, Tooltip, Typography, useMediaQuery, useTheme } from "@mui/material"
import { Session } from "next-auth"
import React from "react"
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import { ChecklistDiario, ChecklistSemanal, ChecklistMensal } from '@/entities/checklist.entity'
import { DateTime } from 'luxon'

const tipos = [
    { id: 'diario', label: 'Diário' },
    { id: 'semanal', label: 'Semanal' },
    { id: 'mensal', label: 'Mensal' }
]

interface Props {
    session: Session
}

type EmpresasFilter = FilterProps<{ by: 'id', inicio: string, fim: string, tipo: 'diario' | 'semanal' | 'mensal' }>

export default ({ session }: Props) => {
    const theme = useTheme()
    const mobile = useMediaQuery(theme.breakpoints.down('sm'))
    const [filters, setFilters] = React.useState<EmpresasFilter>({ by: 'id', direction: 'asc', page: 1, limit: 10, search: '', inicio: '', fim: '', tipo: 'diario' })

    const { onChange, onDate } = useForm({})
    const { openDialog, closeDialog, ...customDialog } = useDialog()

    const onDelete = React.useCallback(() => {
        if (filters.inicio && filters.fim) {
            openDialog({
                maxWidth: 'sm',
                open: true,
                title: `Confirmação de Limpeza de Dados`,
                content: <React.Fragment>
                    <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 600, fontSize: '1rem', fontFamily: 'Arial', letterSpacing: 2, mb: 2 }}>
                        Você tem certeza que deseja limpar os dados?
                    </Typography>
                    <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2 }}>
                        Esta ação não pode ser desfeita.
                    </Typography>     
                </React.Fragment>,
                onAction: () => {
                    sweetalert.loading()

                    axios.delete({ raw: true, url: '/api/data/checklists/admin/delete', data: filters, token: session.accessToken, process: true, message: false })
                    .then(res => {
                        sweetalert.close()
                        closeDialog()
                        toast.success({
                            html: <React.Fragment>
                                <Typography>{res.data.message}</Typography>
                            </React.Fragment>
                        })
                    })
                    .catch(err => {})
                },
                onClose: () => closeDialog(),
                actionTitle: 'Confirmar',
                actionColor: 'error',
                cancelTitle: 'Cancelar',
                cancelColor: 'primary',
            })
        } else {
            toast.error({
                html: <React.Fragment>
                    <Typography>Por favor, preencha os campos de data de início e fim.</Typography>
                </React.Fragment>
            })
        }
    }, [filters])

    return <React.Fragment>
        <Grid2 container spacing={6}>
            <PageHeader title={(
                <Typography sx={{ color: 'primary.main', fontWeight: 600, fontSize: '2rem', fontFamily: 'Arial', letterSpacing: 2 }}>
                    Limpeza de Dados
                </Typography>
            )} />

            <Grid2 size={{ xs: 12 }}>
                <LocalizationProvider dateAdapter={AdapterLuxon}>
                    <Grid2 container spacing={6}>
                        <Grid2 size={{ xs: 12, sm: 2 }}>
                            <Inputs.Select 
                                label='Tipo Checklist'
                                name='tipo'
                                value={filters.tipo}
                                multiple={false}
                                options={tipos}
                                withSearch
                                filter={(option: typeof tipos[0]) => `${option.label}`}
                                optionComponent={(option: typeof tipos[0]) => (
                                    <MenuItem key={`select-empresa-${option.id}`} value={option.id}>
                                        <ListItemText primary={`${option.label}`} />
                                    </MenuItem>
                                )}
                                render={(selected: string) => tipos.find(i => i.id === selected)?.label ?? ''}
                                onChange={(e) => setFilters(prev => ({ ...prev, tipo: e.target.value as 'diario' | 'semanal' | 'mensal' }))}
                                labelProps={{ sx: { '&.MuiFormLabel-filled': {fontWeight: 700} } }}
                                size='small'
                            />
                        </Grid2>

                        <Grid2 size={{ xs: 12, sm: 2 }}>
                            <Inputs.DateField 
                                name='inicio'
                                label='Data de Início'
                                size='small'
                                value={filters.inicio}
                                onChange={onDate('inicio', setFilters)}
                            />
                        </Grid2>

                        <Grid2 size={{ xs: 12, sm: 2 }}>
                            <Inputs.DateField 
                                name='fim'
                                label='Data de Fim'
                                size='small'
                                value={filters.fim}
                                onChange={onDate('fim', setFilters)}
                            />
                        </Grid2>

                        <Grid2 size={{ xs: 12, sm: 6 }} sx={{ display: 'flex', gap: 2 }}>
                            <Button variant='contained' color='primary' size='medium' onClick={onDelete}>
                                Limpar Dados
                            </Button>
                        </Grid2>
                    </Grid2>
                </LocalizationProvider>
            </Grid2>
        </Grid2>

        <CustomDialog {...customDialog} />
    </React.Fragment>
}