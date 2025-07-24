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
    usuarios: { id: number, nome: string, empresa_id: number, empresa: string }[]
    empresas: { id: number, nome: string }[]
    veiculos: { id: number, apelido: string, placa: string, modelo: string, cor: string, empresa_id: number, empresa: string }[]
}

type EmpresasFilter = FilterProps<{ by: 'id', empresa_id: number, usuario_id: number, veiculo_id: number, inicio: string, fim: string, tipo: 'diario' | 'semanal' | 'mensal' }>

export default ({ session, usuarios, empresas, veiculos }: Props) => {
    const theme = useTheme()
    const mobile = useMediaQuery(theme.breakpoints.down('sm'))
    const [filters, setFilters] = React.useState<EmpresasFilter>({ by: 'id', direction: 'asc', page: 1, limit: 10, search: '', empresa_id: 0, usuario_id: 0, veiculo_id: 0, inicio: '', fim: '', tipo: 'diario' })

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
                    <Grid2 size={{ xs: 12, sm: 4 }}>
                            <Inputs.Select 
                                label='Empresa'
                                name='empresa_id'
                                value={filters.empresa_id}
                                multiple={false}
                                options={[{ id: 0, nome: 'Todas' }, ...empresas]}
                                withSearch
                                filter={(option: Props['empresas'][0]) => `${option.nome}`}
                                optionComponent={(option: Props['empresas'][0]) => (
                                    <MenuItem key={`select-empresa-${option.id}`} value={Number(`${option.id}`)}>
                                        <ListItemText primary={`${option.nome}`} />
                                    </MenuItem>
                                )}
                                render={(selected: number) => empresas.find(i => Number(i.id) === Number(`${selected}`))?.nome ?? ''}
                                onChange={(e) => setFilters(prev => ({ ...prev, empresa_id: Number(`${e.target.value}`), usuario_id: 0, veiculo_id: 0 }))}
                                labelProps={{ sx: { '&.MuiFormLabel-filled': {fontWeight: 700} } }}
                                size='small'
                            />
                        </Grid2>

                        <Grid2 size={{ xs: 12, sm: 4 }}>
                            <Inputs.Select 
                                label='Motorista'
                                name='usuario_id'
                                value={filters.usuario_id}
                                multiple={false}
                                options={[{ id: 0, nome: 'Todos', empresa: '' }, ...(filters.empresa_id > 0 ? usuarios.filter(i => Number(i.empresa_id) === Number(filters.empresa_id)) : usuarios)]}
                                withSearch
                                filter={(option: Props['usuarios'][0]) => `${option.nome}`}
                                optionComponent={(option: Props['usuarios'][0]) => (
                                    <MenuItem key={`select-empresa-${option.id}`} value={Number(`${option.id}`)}>
                                        <ListItemText primary={`${option.nome}`} secondary={`${option.empresa ? `${option.empresa}` : ''}`} />
                                    </MenuItem>
                                )}
                                render={(selected: number) => usuarios.find(i => Number(i.id) === Number(`${selected}`))?.nome ?? ''}
                                onChange={(e) => setFilters(prev => ({ ...prev, usuario_id: Number(`${e.target.value}`) }))}
                                labelProps={{ sx: { '&.MuiFormLabel-filled': {fontWeight: 700} } }}
                                size='small'
                            />
                        </Grid2>

                        <Grid2 size={{ xs: 12, sm: 4 }}>
                            <Inputs.Select 
                                label='Veículo'
                                name='veiculo_id'
                                value={filters.veiculo_id}
                                multiple={false}
                                options={[{ id: 0, apelido: 'Todos', placa: '', empresa: '' }, ...(filters.empresa_id > 0 ? veiculos.filter(i => Number(i.empresa_id) === Number(filters.empresa_id)) : veiculos)]}
                                withSearch
                                filter={(option: Props['veiculos'][0]) => `${option.apelido}`}
                                optionComponent={(option: Props['veiculos'][0]) => (
                                    <MenuItem key={`select-empresa-${option.id}`} value={Number(`${option.id}`)}>
                                        <ListItemText primary={`${option.apelido} ${option.placa ? `(${option.placa})` : ''}`} secondary={`${option.empresa}`} />
                                    </MenuItem>
                                )}
                                render={(selected: number) => veiculos.find(i => Number(i.id) === Number(`${selected}`))?.apelido ?? ''}
                                onChange={(e) => setFilters(prev => ({ ...prev, veiculo_id: Number(`${e.target.value}`) }))}
                                labelProps={{ sx: { '&.MuiFormLabel-filled': {fontWeight: 700} } }}
                                size='small'
                            />
                        </Grid2>

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