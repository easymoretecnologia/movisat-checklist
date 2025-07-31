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
    usuarios: { id: number, nome: string }[]
    veiculos: { id: number, apelido: string, placa: string }[]
}

type OcorrenciasFilter = FilterProps<{ by: 'id', usuario_id: number, veiculo_id: number, inicio: string, fim: string, tipo: 'diario' | 'semanal' | 'mensal' }>

type Diario = ChecklistDiario & { tipo: 'diario', usuario: { id: number, nome: string }, veiculo: { id: number, apelido: string, placa: string, modelo: string, cor: string } }
type Mensal = ChecklistMensal & { tipo: 'mensal', usuario: { id: number, nome: string }, veiculo: { id: number, apelido: string, placa: string, modelo: string, cor: string } }
type Semanal = ChecklistSemanal & { tipo: 'semanal', usuario: { id: number, nome: string }, veiculo: { id: number, apelido: string, placa: string, modelo: string, cor: string } }

export default ({ session, usuarios, veiculos }: Props) => {
    const theme = useTheme()
    const mobile = useMediaQuery(theme.breakpoints.down('sm'))
    const [filters, setFilters] = React.useState<OcorrenciasFilter>({ by: 'id', direction: 'asc', page: 1, limit: 10, search: '', usuario_id: 0, veiculo_id: 0, inicio: '', fim: '', tipo: 'diario' })
    const checklists = useClass<{ ocorrencias: (Diario | Mensal | Semanal)[] }>({ ocorrencias: [] }, 'ready')

    const [selected, setSelected] = React.useState<Diario['id'][]>([])

    const { onDate } = useForm({})
    const { openDialog, closeDialog, ...customDialog } = useDialog()
    const { openDialog: openDialogImage, closeDialog: closeDialogImage, ...customDialogImage } = useDialog()

    const hasInconformidades = React.useCallback((checklist: Diario | Mensal | Semanal) => {
        if (checklist.tipo === 'diario') {
            return checklist.farois.toLowerCase() === 'sim' || checklist.lataria.toLowerCase() === 'sim' || checklist.vidros.toLowerCase() === 'sim' || checklist.hodometro.toLowerCase() === 'sim' || checklist.combustivel.toLowerCase() === 'sim' || checklist.agua.toLowerCase() === 'sim' || checklist.luzes.toLowerCase() === 'sim'
        }

        if (checklist.tipo === 'semanal') {
            return checklist.oleo_motor.toLowerCase() === 'não' || checklist.agua_limpador.toLowerCase() === 'não' || checklist.oleo_freio.toLowerCase() === 'não' || checklist.pneus.toLowerCase() === 'não' || checklist.escapamento.toLowerCase() === 'não' || checklist.vidros.toLowerCase() === 'não' || checklist.luzes.toLowerCase() === 'não'
        }

        if (checklist.tipo === 'mensal') {
            return checklist.estofados.toLowerCase() === 'não' || checklist.documentacao.toLowerCase() === 'não' || checklist.volante.toLowerCase() === 'não' || checklist.cambio.toLowerCase() === 'não' || checklist.higiene_interna.toLowerCase() === 'não' || checklist.porta_malas.toLowerCase() === 'não' || checklist.bateria.toLowerCase() === 'não' || checklist.farois.toLowerCase() === 'não'
        }

        return false
    }, [])

    const hasImages = React.useCallback((checklist: Diario | Mensal | Semanal) => {
        if (checklist.tipo === 'diario') {
            return (checklist.farois_images && checklist.farois_images.length > 0) || (checklist.lataria_images && checklist.lataria_images.length > 0) || (checklist.vidros_images && checklist.vidros_images.length > 0) || (checklist.hodometro_images && checklist.hodometro_images.length > 0) || (checklist.combustivel_images && checklist.combustivel_images.length > 0) || (checklist.agua_images && checklist.agua_images.length > 0) || (checklist.luzes_images && checklist.luzes_images.length > 0)
        }

        if (checklist.tipo === 'semanal') {
            return (checklist.oleo_motor_images && checklist.oleo_motor_images.length > 0) || (checklist.agua_limpador_images && checklist.agua_limpador_images.length > 0) || (checklist.oleo_freio_images && checklist.oleo_freio_images.length > 0) || (checklist.pneus_images && checklist.pneus_images.length > 0) || (checklist.escapamento_images && checklist.escapamento_images.length > 0) || (checklist.vidros_images && checklist.vidros_images.length > 0) || (checklist.luzes_images && checklist.luzes_images.length > 0)
        }

        if (checklist.tipo === 'mensal') {
            return (checklist.estofados_images && checklist.estofados_images.length > 0) || (checklist.documentacao_images && checklist.documentacao_images.length > 0) || (checklist.volante_images && checklist.volante_images.length > 0) || (checklist.cambio_images && checklist.cambio_images.length > 0) || (checklist.higiene_interna_images && checklist.higiene_interna_images.length > 0) || (checklist.porta_malas_images && checklist.porta_malas_images.length > 0) || (checklist.bateria_images && checklist.bateria_images.length > 0) || (checklist.farois_images && checklist.farois_images.length > 0)
        }

        return false
    }, [])

    const get = React.useCallback(_.debounce(() => {
        checklists.set({ ocorrencias: [] }, 'loading')
        setSelected([])
        
        axios.get({ raw: true, url: '/api/data/ocorrencias', data: { auth_id: session.user.id, ...filters }, token: session.accessToken, process: true, message: false })
        .then(res => {
            checklists.set(res.data, 'ready')
        })
        .catch(err => {
            checklists.set({ ocorrencias: [] }, 'error')
        })
    }, 500), [session, filters])

    React.useEffect(() => {
        get()
    }, [filters])

    const onCheck = React.useCallback((checklist: Diario | Mensal | Semanal) => () => {
        if (selected.includes(Number(checklist.id))) {
            setSelected(selected.filter(id => id !== Number(checklist.id)))
        } else {
            setSelected(prev => [...prev, Number(checklist.id)])
        }
    }, [selected])

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
                    {checklist.oleo_motor.toLowerCase() === 'não' && (
                        <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <Icon icon='solar:info-square-linear' fontSize={20} />
                            <strong>Óleo do Motor:</strong> {checklist.oleo_motor_obs ? checklist.oleo_motor_obs : 'Não informado'}
                        </Typography>
                    )}

                    {checklist.agua_limpador.toLowerCase() === 'não' && (
                        <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <Icon icon='solar:info-square-linear' fontSize={20} />
                            <strong>Água do Limpador:</strong> {checklist.agua_limpador_obs ? checklist.agua_limpador_obs : 'Não informado'}
                        </Typography>
                    )}

                    {checklist.oleo_freio.toLowerCase() === 'não' && (
                        <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <Icon icon='solar:info-square-linear' fontSize={20} />
                            <strong>Óleo do Freio:</strong> {checklist.oleo_freio_obs ? checklist.oleo_freio_obs : 'Não informado'}
                        </Typography>
                    )}

                    {checklist.pneus.toLowerCase() === 'não' && (
                        <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <Icon icon='solar:info-square-linear' fontSize={20} />
                            <strong>Pneus:</strong> {checklist.pneus_obs ? checklist.pneus_obs : 'Não informado'}
                        </Typography>
                    )}

                    {checklist.escapamento.toLowerCase() === 'não' && (
                        <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <Icon icon='solar:info-square-linear' fontSize={20} />
                            <strong>Escapamento:</strong> {checklist.escapamento_obs ? checklist.escapamento_obs : 'Não informado'}
                        </Typography>
                    )}

                    {checklist.vidros.toLowerCase() === 'não' && (
                        <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <Icon icon='solar:info-square-linear' fontSize={20} />
                            <strong>Vidros:</strong> {checklist.vidros_obs ? checklist.vidros_obs : 'Não informado'}
                        </Typography>
                    )}

                    {checklist.luzes.toLowerCase() === 'não' && (
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
                    {checklist.estofados.toLowerCase() === 'não' && (
                        <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <Icon icon='solar:info-square-linear' fontSize={20} />
                            <strong>Estofados:</strong> {checklist.estofados_obs ? checklist.estofados_obs : 'Não informado'}
                        </Typography>
                    )}

                    {checklist.documentacao.toLowerCase() === 'não' && (
                        <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <Icon icon='solar:info-square-linear' fontSize={20} />
                            <strong>Documentação:</strong> {checklist.documentacao_obs ? checklist.documentacao_obs : 'Não informado'}
                        </Typography>
                    )}

                    {checklist.volante.toLowerCase() === 'não' && (
                        <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <Icon icon='solar:info-square-linear' fontSize={20} />
                            <strong>Volante:</strong> {checklist.volante_obs ? checklist.volante_obs : 'Não informado'}
                        </Typography>
                    )}

                    {checklist.cambio.toLowerCase() === 'não' && (
                        <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <Icon icon='solar:info-square-linear' fontSize={20} />
                            <strong>Câmbio:</strong> {checklist.cambio_obs ? checklist.cambio_obs : 'Não informado'}
                        </Typography>
                    )}

                    {checklist.higiene_interna.toLowerCase() === 'não' && (
                        <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <Icon icon='solar:info-square-linear' fontSize={20} />
                            <strong>Higiene Interna:</strong> {checklist.higiene_interna_obs ? checklist.higiene_interna_obs : 'Não informado'}
                        </Typography>
                    )}

                    {checklist.porta_malas.toLowerCase() === 'não' && (
                        <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <Icon icon='solar:info-square-linear' fontSize={20} />
                            <strong>Porta Malas:</strong> {checklist.porta_malas_obs ? checklist.porta_malas_obs : 'Não informado'}
                        </Typography>
                    )}

                    {checklist.bateria.toLowerCase() === 'não' && (
                        <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <Icon icon='solar:info-square-linear' fontSize={20} />
                            <strong>Bateria:</strong> {checklist.bateria_obs ? checklist.bateria_obs : 'Não informado'}
                        </Typography>
                    )}

                    {checklist.farois.toLowerCase() === 'não' && (
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

    const onViewImage = React.useCallback((image: string) => () => {
        openDialogImage({
            maxWidth: 'md',
            fullScreen: mobile,
            open: true,
            title: `Visualização`,
            content: (
                <React.Fragment>
                    <img src={image} alt='Visualização imagem' width='100%' height='auto' />
                </React.Fragment>
            ),
            onAction: () => closeDialogImage(),
            actionTitle: 'Fechar',
            actionColor: 'primary',
            hasCancel: false
        })
    }, [])

    const onImages = React.useCallback((checklist: Diario | Mensal | Semanal) => () => {
        if (checklist.tipo === 'diario') {
            openDialog({
                maxWidth: 'md',
                fullScreen: mobile,
                open: true,
                title: `Checklist Diário #${checklist.id} - Imagens`,
                content: (
                    <React.Fragment>
                        {checklist.farois_images && checklist.farois_images.length > 0 && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                    <Icon icon='solar:info-square-linear' fontSize={20} />
                                    <strong>Faróis:</strong>
                                </Typography>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    {checklist.farois_images.map((image, index) => (
                                        <Box key={`farois-${index}`} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Button variant='outlined' size='small' onClick={onViewImage(image)}>
                                                <Icon icon='solar:gallery-minimalistic-linear' fontSize={20} />
                                                Imagem {index + 1}
                                            </Button>
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        )}

                        {checklist.lataria_images && checklist.lataria_images.length > 0 && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                    <Icon icon='solar:info-square-linear' fontSize={20} />
                                    <strong>Lataria:</strong>
                                </Typography>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    {checklist.lataria_images.map((image, index) => (
                                        <Box key={`lataria-${index}`} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Button variant='outlined' size='small' onClick={onViewImage(image)}>
                                                <Icon icon='solar:gallery-minimalistic-linear' fontSize={20} />
                                                Imagem {index + 1}
                                            </Button>
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        )}
                        

                        {checklist.vidros_images && checklist.vidros_images.length > 0 && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                    <Icon icon='solar:info-square-linear' fontSize={20} />
                                    <strong>Vidros:</strong>
                                </Typography>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    {checklist.vidros_images.map((image, index) => (
                                        <Box key={`vidros-${index}`} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Button variant='outlined' size='small' onClick={onViewImage(image)}>
                                                <Icon icon='solar:gallery-minimalistic-linear' fontSize={20} />
                                                Imagem {index + 1}
                                            </Button>
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        )}

                        {checklist.hodometro_images && checklist.hodometro_images.length > 0 && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                    <Icon icon='solar:info-square-linear' fontSize={20} />
                                    <strong>Hodômetro:</strong>
                                </Typography>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    {checklist.hodometro_images.map((image, index) => (
                                        <Box key={`hodometro-${index}`} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Button variant='outlined' size='small' onClick={onViewImage(image)}>
                                                <Icon icon='solar:gallery-minimalistic-linear' fontSize={20} />
                                                Imagem {index + 1}
                                            </Button>
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        )}

                        {checklist.combustivel_images && checklist.combustivel_images.length > 0 && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                    <Icon icon='solar:info-square-linear' fontSize={20} />
                                    <strong>Combustível:</strong>
                                </Typography>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    {checklist.combustivel_images.map((image, index) => (
                                        <Box key={`combustivel-${index}`} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Button variant='outlined' size='small' onClick={onViewImage(image)}>
                                                <Icon icon='solar:gallery-minimalistic-linear' fontSize={20} />
                                                Imagem {index + 1}
                                            </Button>
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        )}

                        {checklist.agua_images && checklist.agua_images.length > 0 && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                    <Icon icon='solar:info-square-linear' fontSize={20} />
                                    <strong>Água:</strong>
                                </Typography>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    {checklist.agua_images.map((image, index) => (
                                        <Box key={`agua-${index}`} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Button variant='outlined' size='small' onClick={onViewImage(image)}>
                                                <Icon icon='solar:gallery-minimalistic-linear' fontSize={20} />
                                                Imagem {index + 1}
                                            </Button>
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        )}

                        {checklist.luzes_images && checklist.luzes_images.length > 0 && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                    <Icon icon='solar:info-square-linear' fontSize={20} />
                                    <strong>Luzes:</strong>
                                </Typography>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    {checklist.luzes_images.map((image, index) => (
                                        <Box key={`luzes-${index}`} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Button variant='outlined' size='small' onClick={onViewImage(image)}>
                                                <Icon icon='solar:gallery-minimalistic-linear' fontSize={20} />
                                                Imagem {index + 1}
                                            </Button>
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
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
                title: `Checklist Semanal #${checklist.id} - Imagens`,
                content: <React.Fragment>
                    {checklist.oleo_motor_images && checklist.oleo_motor_images.length > 0 && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                <Icon icon='solar:info-square-linear' fontSize={20} />
                                <strong>Óleo do Motor:</strong>
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                {checklist.oleo_motor_images.map((image, index) => (
                                    <Box key={`oleo-motor-${index}`} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Button variant='outlined' size='small' onClick={onViewImage(image)}>
                                            <Icon icon='solar:gallery-minimalistic-linear' fontSize={20} />
                                            Imagem {index + 1}
                                        </Button>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    )}

                    {checklist.agua_limpador_images && checklist.agua_limpador_images.length > 0 && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                <Icon icon='solar:info-square-linear' fontSize={20} />
                                <strong>Água do Limpador:</strong>
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                {checklist.agua_limpador_images.map((image, index) => (
                                    <Box key={`agua-limpador-${index}`} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Button variant='outlined' size='small' onClick={onViewImage(image)}>
                                            <Icon icon='solar:gallery-minimalistic-linear' fontSize={20} />
                                            Imagem {index + 1}
                                        </Button>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    )}

                    {checklist.oleo_freio_images && checklist.oleo_freio_images.length > 0 && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                <Icon icon='solar:info-square-linear' fontSize={20} />
                                <strong>Óleo do Freio:</strong>
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                {checklist.oleo_freio_images.map((image, index) => (
                                    <Box key={`oleo-freio-${index}`} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Button variant='outlined' size='small' onClick={onViewImage(image)}>
                                            <Icon icon='solar:gallery-minimalistic-linear' fontSize={20} />
                                            Imagem {index + 1}
                                        </Button>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    )}

                    {checklist.pneus_images && checklist.pneus_images.length > 0 && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                <Icon icon='solar:info-square-linear' fontSize={20} />
                                <strong>Pneus:</strong>
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                {checklist.pneus_images.map((image, index) => (
                                    <Box key={`pneus-${index}`} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Button variant='outlined' size='small' onClick={onViewImage(image)}>
                                            <Icon icon='solar:gallery-minimalistic-linear' fontSize={20} />
                                            Imagem {index + 1}
                                        </Button>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    )}

                    {checklist.escapamento_images && checklist.escapamento_images.length > 0 && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                <Icon icon='solar:info-square-linear' fontSize={20} />
                                <strong>Escapamento:</strong>
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                {checklist.escapamento_images.map((image, index) => (
                                    <Box key={`escapamento-${index}`} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Button variant='outlined' size='small' onClick={onViewImage(image)}>
                                            <Icon icon='solar:gallery-minimalistic-linear' fontSize={20} />
                                            Imagem {index + 1}
                                        </Button>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    )}

                    {checklist.vidros_images && checklist.vidros_images.length > 0 && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                <Icon icon='solar:info-square-linear' fontSize={20} />
                                <strong>Vidros:</strong>
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                {checklist.vidros_images.map((image, index) => (
                                    <Box key={`vidros-${index}`} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Button variant='outlined' size='small' onClick={onViewImage(image)}>
                                            <Icon icon='solar:gallery-minimalistic-linear' fontSize={20} />
                                            Imagem {index + 1}
                                        </Button>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    )}

                    {checklist.luzes_images && checklist.luzes_images.length > 0 && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                <Icon icon='solar:info-square-linear' fontSize={20} />
                                <strong>Luzes:</strong>
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                {checklist.luzes_images.map((image, index) => (
                                    <Box key={`luzes-${index}`} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Button variant='outlined' size='small' onClick={onViewImage(image)}>
                                            <Icon icon='solar:gallery-minimalistic-linear' fontSize={20} />
                                            Imagem {index + 1}
                                        </Button>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
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
                    {checklist.estofados_images && checklist.estofados_images.length > 0 && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                <Icon icon='solar:info-square-linear' fontSize={20} />
                                <strong>Estofados:</strong>
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                {checklist.estofados_images.map((image, index) => (
                                    <Box key={`estofados-${index}`} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Button variant='outlined' size='small' onClick={onViewImage(image)}>
                                            <Icon icon='solar:gallery-minimalistic-linear' fontSize={20} />
                                            Imagem {index + 1}
                                        </Button>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    )}

                    {checklist.documentacao_images && checklist.documentacao_images.length > 0 && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                <Icon icon='solar:info-square-linear' fontSize={20} />
                                <strong>Documentação:</strong>
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                {checklist.documentacao_images.map((image, index) => (
                                    <Box key={`documentacao-${index}`} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Button variant='outlined' size='small' onClick={onViewImage(image)}>
                                            <Icon icon='solar:gallery-minimalistic-linear' fontSize={20} />
                                            Imagem {index + 1}
                                        </Button>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    )}

                    {checklist.volante_images && checklist.volante_images.length > 0 && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                <Icon icon='solar:info-square-linear' fontSize={20} />
                                <strong>Volante:</strong>
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                {checklist.volante_images.map((image, index) => (
                                    <Box key={`volante-${index}`} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Button variant='outlined' size='small' onClick={onViewImage(image)}>
                                            <Icon icon='solar:gallery-minimalistic-linear' fontSize={20} />
                                            Imagem {index + 1}
                                        </Button>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    )}

                    {checklist.cambio_images && checklist.cambio_images.length > 0 && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                <Icon icon='solar:info-square-linear' fontSize={20} />
                                <strong>Câmbio:</strong>
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                {checklist.cambio_images.map((image, index) => (
                                    <Box key={`cambio-${index}`} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Button variant='outlined' size='small' onClick={onViewImage(image)}>
                                            <Icon icon='solar:gallery-minimalistic-linear' fontSize={20} />
                                            Imagem {index + 1}
                                        </Button>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    )}

                    {checklist.higiene_interna_images && checklist.higiene_interna_images.length > 0 && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                <Icon icon='solar:info-square-linear' fontSize={20} />
                                <strong>Higiene Interna:</strong>
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                {checklist.higiene_interna_images.map((image, index) => (
                                    <Box key={`higiene-interna-${index}`} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Button variant='outlined' size='small' onClick={onViewImage(image)}>
                                            <Icon icon='solar:gallery-minimalistic-linear' fontSize={20} />
                                            Imagem {index + 1}
                                        </Button>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    )}

                    {checklist.porta_malas_images && checklist.porta_malas_images.length > 0 && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                <Icon icon='solar:info-square-linear' fontSize={20} />
                                <strong>Porta Malas:</strong>
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                {checklist.porta_malas_images.map((image, index) => (
                                    <Box key={`porta-malas-${index}`} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Button variant='outlined' size='small' onClick={onViewImage(image)}>
                                            <Icon icon='solar:gallery-minimalistic-linear' fontSize={20} />
                                            Imagem {index + 1}
                                        </Button>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    )}

                    {checklist.bateria_images && checklist.bateria_images.length > 0 && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                <Icon icon='solar:info-square-linear' fontSize={20} />
                                <strong>Bateria:</strong>
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                {checklist.bateria_images.map((image, index) => (
                                    <Box key={`bateria-${index}`} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Button variant='outlined' size='small' onClick={onViewImage(image)}>
                                            <Icon icon='solar:gallery-minimalistic-linear' fontSize={20} />
                                            Imagem {index + 1}
                                        </Button>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    )}

                    {checklist.farois_images && checklist.farois_images.length > 0 && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                <Icon icon='solar:info-square-linear' fontSize={20} />
                                <strong>Faróis:</strong>
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                {checklist.farois_images.map((image, index) => (
                                    <Box key={`farois-${index}`} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Button variant='outlined' size='small' onClick={onViewImage(image)}>
                                            <Icon icon='solar:gallery-minimalistic-linear' fontSize={20} />
                                            Imagem {index + 1}
                                        </Button>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
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

    const onConfirm = React.useCallback(() => {
        if (selected.length === 0) {
            toast.error({
                html: <Typography>
                    Nenhum ocorrência selecionada
                </Typography>
            })
            return
        }

        sweetalert.loading()

        axios.patch({
            raw: true,
            url: `/api/data/ocorrencias`,
            data: {
                ids: selected,
                id_usuario: session.user.id,
                tipo: filters.tipo
            },
            token: session.accessToken,
            process: true,
            message: true,
        }).then(res => {
            sweetalert.close()
            setSelected([])
            get()
            toast.success({
                html: <Typography>
                    {res.data.message}
                </Typography>
            })
        }).catch(err => {})
    }, [selected, filters.tipo, session.user.id])

    return <React.Fragment>
        <Grid2 container spacing={6}>
            <PageHeader title={(
                <Typography sx={{ color: 'primary.main', fontWeight: 600, fontSize: '2rem', fontFamily: 'Arial', letterSpacing: 2 }}>
                    Gestão de Ocorrencias
                </Typography>
            )} />

            <Grid2 size={{ xs: 12 }}>
                <LocalizationProvider dateAdapter={AdapterLuxon}>
                    <Grid2 container spacing={6}>
                        <Grid2 size={{ xs: 12, sm: 4 }}>
                            <Inputs.Select 
                                label='Motorista'
                                name='usuario_id'
                                value={filters.usuario_id}
                                multiple={false}
                                options={[{ id: 0, nome: 'Todos' }, ...usuarios]}
                                withSearch
                                filter={(option: Props['usuarios'][0]) => `${option.nome}`}
                                optionComponent={(option: Props['usuarios'][0]) => (
                                    <MenuItem key={`select-empresa-${option.id}`} value={Number(`${option.id}`)}>
                                        <ListItemText primary={`${option.nome}`} />
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
                                options={[{ id: 0, apelido: 'Todos', placa: '' }, ...veiculos]}
                                withSearch
                                filter={(option: Props['veiculos'][0]) => `${option.apelido}`}
                                optionComponent={(option: Props['veiculos'][0]) => (
                                    <MenuItem key={`select-empresa-${option.id}`} value={Number(`${option.id}`)}>
                                        <ListItemText primary={`${option.apelido} ${option.placa ? `(${option.placa})` : ''}`} />
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
                            <Button variant='contained' color='primary' size='medium' onClick={() => setFilters({ by: 'id', direction: 'asc', page: 1, limit: 10, search: '', usuario_id: 0, veiculo_id: 0, inicio: '', fim: '', tipo: 'diario' })}>
                                Limpar Filtros
                            </Button>
                        </Grid2>
                    </Grid2>
                </LocalizationProvider>
            </Grid2>

            <Grid2 size={{ xs: 12 }}>
                <Button variant='outlined' color='primary' size='medium' onClick={onConfirm}>
                    Confirmar ciência de inconformidades
                </Button>
            </Grid2>

            <Grid2 size={{ xs: 12 }}>
                <Card>
                    <Tables.Container>
                        <Tables.Head>
                            <Tables.Title title='' name='' />
                            <Tables.Title title='#' name='id' filters={filters} setFilters={setFilters} />
                            <Tables.Title title='Tipo Checklist' name='tipo' />
                            <Tables.Title title='Motorista' name='motorista' />
                            <Tables.Title title='Veículo' name='veiculo' />
                            <Tables.Title title='Modelo' name='modelo' />
                            <Tables.Title title='Placa' name='placa' />
                            <Tables.Title title='Data' name='data' />
                            <Tables.Title title='Inconformidades?' name='inconformidades' />
                            <Tables.Title title='Imagens' name='imagens' />
                            <Tables.Title title='Ciência de Inconformidades' name='ciencia_inconformidades' />
                            <Tables.Title title='Ações' width={150} />
                        </Tables.Head>

                        <Tables.Body>
                        {checklists.status === 'loading' && (<Tables.Loading colSpan={12} />)}

                        {checklists.status === 'error' && (<Tables.Error colSpan={12} />)}

                        {checklists.status === 'ready' && checklists.ocorrencias.length <= 0 && <Tables.NoData colSpan={12} />}

                        {checklists.status === 'ready' && checklists.ocorrencias.map(checklist => (
                            <TableRow key={`checklist-${checklist.id}`}>
                                <Tables.Column>
                                    {!checklist.ciencia_inconformidades && (
                                        <Inputs.Checkbox size='large' name={`checklist-${checklist.id}`} value={selected.includes(Number(checklist.id))} onChange={onCheck(checklist)} />
                                    )}
                                </Tables.Column>
                                <Tables.Text typographyProps={{ sx: { fontWeight: 600 } }}>{checklist.id}</Tables.Text>
                                <Tables.Text typographyProps={{ sx: {} }}>{checklist.tipo === 'diario' ? 'Diário' : (checklist.tipo === 'semanal' ? 'Semanal' : 'Mensal')}</Tables.Text>
                                <Tables.Text typographyProps={{ sx: { display: 'flex', alignItems: 'center', gap: 1 } }}>
                                    {checklist.usuario.nome}
                                    <Tooltip placement='top' title='Visualizar Motorista' arrow>
                                        <IconButton size='small' onClick={onViewImage(checklist.selfie_motorista)}>
                                            <Icon icon='solar:camera-linear' fontSize={20} />
                                        </IconButton>
                                    </Tooltip>
                                </Tables.Text>
                                <Tables.Text typographyProps={{ sx: {} }}>{checklist.veiculo.apelido}</Tables.Text>
                                <Tables.Text typographyProps={{ sx: {} }}>{checklist.veiculo.modelo}</Tables.Text>
                                <Tables.Text typographyProps={{ sx: {} }}>{checklist.veiculo.placa}</Tables.Text>
                                <Tables.Text typographyProps={{ sx: {} }}>{DateTime.fromISO(checklist.created_at).setZone('America/Sao_Paulo').toFormat('dd/MM/yyyy HH:mm')}</Tables.Text>
                                <Tables.Text typographyProps={{ sx: {} }}>{hasInconformidades(checklist) ? 'Sim' : 'Não'}</Tables.Text>
                                <Tables.Text typographyProps={{ sx: {} }}>{hasImages(checklist) ? 'Sim' : 'Não'}</Tables.Text>
                                <Tables.Text typographyProps={{ sx: {} }}>{checklist.ciencia_inconformidades ?? '-'}</Tables.Text>
                                <Tables.Column>
                                    {hasInconformidades(checklist) && (
                                        <Tooltip placement='top' title='Ver Inconformidades' arrow>
                                            <IconButton size='small' onClick={onInconformidades(checklist)}>
                                                <Icon icon='solar:info-square-linear' fontSize={20} />
                                            </IconButton>
                                        </Tooltip>
                                    )}

                                    {hasImages(checklist) && (
                                        <Tooltip placement='top' title='Visualizar Imagens' arrow>
                                            <IconButton size='small' onClick={onImages(checklist)}>
                                                <Icon icon='solar:gallery-wide-linear' fontSize={20} />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                </Tables.Column>
                            </TableRow>
                        ))}
                        </Tables.Body>
                    </Tables.Container>
                </Card>
            </Grid2>
        </Grid2>

        <CustomDialog {...customDialog} />
        <CustomDialog {...customDialogImage} />
    </React.Fragment>
}