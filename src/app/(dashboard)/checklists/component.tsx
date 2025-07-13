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

type Diario = ChecklistDiario & { tipo: 'diario', usuario: { id: number, nome: string }, veiculo: { id: number, apelido: string, placa: string, modelo: string, cor: string }, empresa: { id: number, nome: string } }
type Mensal = ChecklistMensal & { tipo: 'mensal', usuario: { id: number, nome: string }, veiculo: { id: number, apelido: string, placa: string, modelo: string, cor: string }, empresa: { id: number, nome: string } }
type Semanal = ChecklistSemanal & { tipo: 'semanal', usuario: { id: number, nome: string }, veiculo: { id: number, apelido: string, placa: string, modelo: string, cor: string }, empresa: { id: number, nome: string } }

export default ({ session, usuarios, empresas, veiculos }: Props) => {
    const theme = useTheme()
    const mobile = useMediaQuery(theme.breakpoints.down('sm'))
    const [filters, setFilters] = React.useState<EmpresasFilter>({ by: 'id', direction: 'asc', page: 1, limit: 10, search: '', empresa_id: 0, usuario_id: 0, veiculo_id: 0, inicio: '', fim: '', tipo: 'diario' })
    const checklists = useClass<Paginate<Diario | Mensal | Semanal>>({ items: [], current: 1, last: 1, total: 0, per_page: filters.limit }, 'ready')

    const { onChange, onDate } = useForm({})
    const { openDialog, closeDialog, ...customDialog } = useDialog()

    const hasInconformidades = React.useCallback((checklist: Diario | Mensal | Semanal) => {
        if (checklist.tipo === 'diario') {
            return checklist.farois.toLowerCase() === 'sim' || checklist.lataria.toLowerCase() === 'sim' || checklist.vidros.toLowerCase() === 'sim' || checklist.hodometro.toLowerCase() === 'sim' || checklist.combustivel.toLowerCase() === 'sim' || checklist.agua.toLowerCase() === 'sim' || checklist.luzes.toLowerCase() === 'sim'
        }

        if (checklist.tipo === 'semanal') {
            return checklist.oleo_motor.toLowerCase() === 'sim' || checklist.agua_limpador.toLowerCase() === 'sim' || checklist.oleo_freio.toLowerCase() === 'sim' || checklist.pneus.toLowerCase() === 'sim' || checklist.escapamento.toLowerCase() === 'sim' || checklist.vidros.toLowerCase() === 'sim' || checklist.luzes.toLowerCase() === 'sim'
        }

        if (checklist.tipo === 'mensal') {
            return checklist.estofados.toLowerCase() === 'sim' || checklist.documentacao.toLowerCase() === 'sim' || checklist.volante.toLowerCase() === 'sim' || checklist.cambio.toLowerCase() === 'sim' || checklist.higiene_interna.toLowerCase() === 'sim' || checklist.porta_malas.toLowerCase() === 'sim' || checklist.bateria.toLowerCase() === 'sim' || checklist.farois.toLowerCase() === 'sim'
        }

        return false
    }, [])

    const get = React.useCallback(_.debounce(() => {
        checklists.set({ items: [], current: 1, last: 1, total: 0, per_page: filters.limit }, 'loading')
        
        axios.get({ raw: true, url: '/api/data/checklists/admin/list', data: filters, token: session.accessToken, process: true, message: false })
        .then(res => {
            checklists.set(res.data, 'ready')
        })
        .catch(err => {
            checklists.set({ items: [], current: 1, last: 1, total: 0, per_page: filters.limit }, 'error')
        })
    }, 500), [session, filters])

    React.useEffect(() => {
        get()
    }, [filters])

    const onInconformidades = React.useCallback((checklist: Diario | Mensal | Semanal) => () => {
        if (checklist.tipo === 'diario') {
            openDialog({
                maxWidth: 'md',
                fullScreen: mobile,
                open: true,
                title: `Checklist Diário #${checklist.id} - Inconformidades`,
                content: (
                    <React.Fragment>
                        {checklist.farois.toLowerCase() === 'sim' && (
                            <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                <Icon icon='solar:info-square-linear' fontSize={20} />
                                <strong>Faróis:</strong> {checklist.farois_obs ? checklist.farois_obs : 'Não informado'}
                            </Typography>
                        )}

                        {checklist.lataria.toLowerCase() === 'sim' && (
                            <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                <Icon icon='solar:info-square-linear' fontSize={20} />
                                <strong>Lataria:</strong> {checklist.lataria_obs ? checklist.lataria_obs : 'Não informado'}
                            </Typography>
                        )}

                        {checklist.vidros.toLowerCase() === 'sim' && (
                            <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                <Icon icon='solar:info-square-linear' fontSize={20} />
                                <strong>Vidros:</strong> {checklist.vidros_obs ? checklist.vidros_obs : 'Não informado'}
                            </Typography>
                        )}

                        {checklist.hodometro.toLowerCase() === 'sim' && (
                            <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                <Icon icon='solar:info-square-linear' fontSize={20} />
                                <strong>Hodômetro:</strong> {checklist.hodometro_obs ? checklist.hodometro_obs : 'Não informado'}
                            </Typography>
                        )}

                        {checklist.combustivel.toLowerCase() === 'sim' && (
                            <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                <Icon icon='solar:info-square-linear' fontSize={20} />
                                <strong>Combustível:</strong> {checklist.combustivel_obs ? checklist.combustivel_obs : 'Não informado'}
                            </Typography>
                        )}

                        {checklist.agua.toLowerCase() === 'sim' && (
                            <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                <Icon icon='solar:info-square-linear' fontSize={20} />
                                <strong>Água:</strong> {checklist.agua_obs ? checklist.agua_obs : 'Não informado'}
                            </Typography>
                        )}

                        {checklist.luzes.toLowerCase() === 'sim' && (
                            <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                <Icon icon='solar:info-square-linear' fontSize={20} />
                                <strong>Luzes:</strong> {checklist.luzes_obs ? checklist.luzes_obs : 'Não informado'}
                            </Typography>
                        )}
                    </React.Fragment>
                ),
                onAction: () => closeDialog(),
                actionTitle: 'Fechar',
                actionColor: 'primary',
                hasCancel: false
            })
        } else if (checklist.tipo === 'semanal') {
            openDialog({
                maxWidth: 'md',
                fullScreen: mobile,
                open: true,
                title: `Checklist Semanal #${checklist.id} - Inconformidades`,
                content: <React.Fragment>
                    {checklist.oleo_motor.toLowerCase() === 'sim' && (
                        <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <Icon icon='solar:info-square-linear' fontSize={20} />
                            <strong>Óleo do Motor:</strong> {checklist.oleo_motor_obs ? checklist.oleo_motor_obs : 'Não informado'}
                        </Typography>
                    )}

                    {checklist.agua_limpador.toLowerCase() === 'sim' && (
                        <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <Icon icon='solar:info-square-linear' fontSize={20} />
                            <strong>Água do Limpador:</strong> {checklist.agua_limpador_obs ? checklist.agua_limpador_obs : 'Não informado'}
                        </Typography>
                    )}

                    {checklist.oleo_freio.toLowerCase() === 'sim' && (
                        <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <Icon icon='solar:info-square-linear' fontSize={20} />
                            <strong>Óleo do Freio:</strong> {checklist.oleo_freio_obs ? checklist.oleo_freio_obs : 'Não informado'}
                        </Typography>
                    )}

                    {checklist.pneus.toLowerCase() === 'sim' && (
                        <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <Icon icon='solar:info-square-linear' fontSize={20} />
                            <strong>Pneus:</strong> {checklist.pneus_obs ? checklist.pneus_obs : 'Não informado'}
                        </Typography>
                    )}

                    {checklist.escapamento.toLowerCase() === 'sim' && (
                        <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <Icon icon='solar:info-square-linear' fontSize={20} />
                            <strong>Escapamento:</strong> {checklist.escapamento_obs ? checklist.escapamento_obs : 'Não informado'}
                        </Typography>
                    )}

                    {checklist.vidros.toLowerCase() === 'sim' && (
                        <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <Icon icon='solar:info-square-linear' fontSize={20} />
                            <strong>Vidros:</strong> {checklist.vidros_obs ? checklist.vidros_obs : 'Não informado'}
                        </Typography>
                    )}

                    {checklist.luzes.toLowerCase() === 'sim' && (
                        <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <Icon icon='solar:info-square-linear' fontSize={20} />
                            <strong>Luzes:</strong> {checklist.luzes_obs ? checklist.luzes_obs : 'Não informado'}
                        </Typography>
                    )}
                </React.Fragment>,
                onAction: () => closeDialog(),
                actionTitle: 'Fechar',
                actionColor: 'primary',
                hasCancel: false
            })
        } else if (checklist.tipo === 'mensal') {
            openDialog({
                maxWidth: 'md',
                fullScreen: mobile,
                open: true,
                title: `Checklist Mensal #${checklist.id} - Inconformidades`,
                content: <React.Fragment>
                    {checklist.estofados.toLowerCase() === 'sim' && (
                        <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <Icon icon='solar:info-square-linear' fontSize={20} />
                            <strong>Estofados:</strong> {checklist.estofados_obs ? checklist.estofados_obs : 'Não informado'}
                        </Typography>
                    )}

                    {checklist.documentacao.toLowerCase() === 'sim' && (
                        <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <Icon icon='solar:info-square-linear' fontSize={20} />
                            <strong>Documentação:</strong> {checklist.documentacao_obs ? checklist.documentacao_obs : 'Não informado'}
                        </Typography>
                    )}

                    {checklist.volante.toLowerCase() === 'sim' && (
                        <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <Icon icon='solar:info-square-linear' fontSize={20} />
                            <strong>Volante:</strong> {checklist.volante_obs ? checklist.volante_obs : 'Não informado'}
                        </Typography>
                    )}

                    {checklist.cambio.toLowerCase() === 'sim' && (
                        <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <Icon icon='solar:info-square-linear' fontSize={20} />
                            <strong>Câmbio:</strong> {checklist.cambio_obs ? checklist.cambio_obs : 'Não informado'}
                        </Typography>
                    )}

                    {checklist.higiene_interna.toLowerCase() === 'sim' && (
                        <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <Icon icon='solar:info-square-linear' fontSize={20} />
                            <strong>Higiene Interna:</strong> {checklist.higiene_interna_obs ? checklist.higiene_interna_obs : 'Não informado'}
                        </Typography>
                    )}

                    {checklist.porta_malas.toLowerCase() === 'sim' && (
                        <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <Icon icon='solar:info-square-linear' fontSize={20} />
                            <strong>Porta Malas:</strong> {checklist.porta_malas_obs ? checklist.porta_malas_obs : 'Não informado'}
                        </Typography>
                    )}

                    {checklist.bateria.toLowerCase() === 'sim' && (
                        <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <Icon icon='solar:info-square-linear' fontSize={20} />
                            <strong>Bateria:</strong> {checklist.bateria_obs ? checklist.bateria_obs : 'Não informado'}
                        </Typography>
                    )}

                    {checklist.farois.toLowerCase() === 'sim' && (
                        <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <Icon icon='solar:info-square-linear' fontSize={20} />
                            <strong>Faróis:</strong> {checklist.farois_obs ? checklist.farois_obs : 'Não informado'}
                        </Typography>
                    )}
                </React.Fragment>,
                onAction: () => closeDialog(),
                actionTitle: 'Fechar',
                actionColor: 'primary',
                hasCancel: false
            })
        }
    }, [])

    const onExport = React.useCallback(() => {
        sweetalert.loading()

        axios.get({
            raw: true,
            url: `/api/data/checklists/admin/export`,
            data: filters,
            token: session.accessToken,
            process: true,
            message: true,
        }).then(res => {
            sweetalert.close()
            // Download the CSV file received in the response
            const blob = new Blob([res.data], { type: 'text/csv;charset=utf-8;' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'checklists.csv');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        }).catch(err => {
            sweetalert.close()
            sweetalert.error(err.message)
        })
    }, [filters])

    return <React.Fragment>
        <Grid2 container spacing={6}>
            <PageHeader title={(
                <Typography sx={{ color: 'primary.main', fontWeight: 600, fontSize: '2rem', fontFamily: 'Arial', letterSpacing: 2 }}>
                    Checklists
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
                            {/* <Button variant='contained' color='primary' size='medium' onClick={get}>
                                Buscar
                            </Button> */}
                            <Button variant='contained' color='primary' size='medium' onClick={() => setFilters({ by: 'id', direction: 'asc', page: 1, limit: 10, search: '', empresa_id: 0, usuario_id: 0, veiculo_id: 0, inicio: '', fim: '', tipo: 'diario' })}>
                                Limpar Filtros
                            </Button>
                            <Button variant='contained' color='primary' size='medium' onClick={onExport}>
                                Exportar Relatório
                            </Button>
                        </Grid2>
                    </Grid2>
                </LocalizationProvider>
            </Grid2>

            <Grid2 size={{ xs: 12 }}>
                <Card>
                    <Tables.Container>
                        <Tables.Head>
                            <Tables.Title title='#' name='id' filters={filters} setFilters={setFilters} />
                            <Tables.Title title='Tipo Checklist' name='tipo' />
                            <Tables.Title title='Empresa' name='empresa' />
                            <Tables.Title title='Motorista' name='motorista' />
                            <Tables.Title title='Veículo' name='veiculo' />
                            <Tables.Title title='Data' name='data' />
                            <Tables.Title title='Inconformidades?' name='inconformidades' />
                            <Tables.Title title='Ações' width={150} />
                        </Tables.Head>

                        <Tables.Body>
                        {checklists.status === 'loading' && (<Tables.Loading colSpan={8} />)}

                        {checklists.status === 'error' && (<Tables.Error colSpan={8} />)}

                        {checklists.status === 'ready' && checklists.items.length <= 0 && <Tables.NoData colSpan={8} />}

                        {checklists.status === 'ready' && checklists.items.map(checklist => (
                            <TableRow key={`checklist-${checklist.id}`}>
                                <Tables.Text typographyProps={{ sx: { fontWeight: 600 } }}>{checklist.id}</Tables.Text>
                                <Tables.Text typographyProps={{ sx: {} }}>{checklist.tipo === 'diario' ? 'Diário' : (checklist.tipo === 'semanal' ? 'Semanal' : 'Mensal')}</Tables.Text>
                                <Tables.Text typographyProps={{ sx: {} }}>{checklist.empresa.nome}</Tables.Text>
                                <Tables.Text typographyProps={{ sx: {} }}>{checklist.usuario.nome}</Tables.Text>
                                <Tables.Text typographyProps={{ sx: {} }}>{checklist.veiculo.apelido} ({checklist.veiculo.placa})</Tables.Text>
                                <Tables.Text typographyProps={{ sx: {} }}>{DateTime.fromISO(checklist.created_at).toFormat('dd/MM/yyyy HH:mm')}</Tables.Text>
                                <Tables.Text typographyProps={{ sx: {} }}>{hasInconformidades(checklist) ? 'Sim' : 'Não'}</Tables.Text>
                                <Tables.Column>
                                    {hasInconformidades(checklist) && (
                                        <Tooltip placement='top' title='Ver Inconformidades' arrow>
                                            <IconButton size='small' onClick={onInconformidades(checklist)}>
                                                <Icon icon='solar:info-square-linear' fontSize={20} />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                </Tables.Column>
                            </TableRow>
                        ))}
                        </Tables.Body>
                    </Tables.Container>
                </Card>

                <Card sx={{ marginTop: 4 }}>
                    <CardActions sx={{ display: "flex", justifyContent: "center", alignItems: "center", padding: '0.75rem !important' }}>
                        <Tables.Pagination color="primary" size='medium' total={checklists.last} page={checklists.current} onChange={(e, page) => onPage(e, page, setFilters)} />
                    </CardActions>
                </Card>
            </Grid2>
        </Grid2>

        <CustomDialog {...customDialog} />
    </React.Fragment>
}