'use client'

import CustomDialog, { defaultDialogSx, useDialog } from "@/components/dialog/CustomDialog"
import Inputs from "@/components/inputs"
import PageHeader from "@/components/PageHeader"
import { palette } from "@/configs/themeConfig"
import { Veiculo } from "@/entities/veiculo.entity"
import useForm from "@/hooks/useForm"
import { toast } from "@/utils/sweetalert"
import { Alert, Box, Button, ButtonProps, Card, CardContent, CardHeader, Dialog, DialogActions, DialogContent, DialogTitle, Grid2, IconButton, ListItemText, MenuItem, Typography, useMediaQuery, useTheme } from "@mui/material"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon"
import { DateTime } from "luxon"
import { Session } from "next-auth"
import Link from "next/link"
import React from "react"

const btnStx: ButtonProps['sx'] = { width: 80, height: 80, borderRadius: 10, boxShadow: 'none !important' }

interface Props {
    session: Session
    veiculos: Veiculo[]
}

type ChecklistDiario = {
    motivo: 'uso' | 'devolucao'
    farois: 'sim' | 'nao' | 'na'
    farois_obs: string
    farois_images: string[]
    lataria: 'sim' | 'nao' | 'na'
    lataria_obs: string
    lataria_images: string[]
    vidros: 'sim' | 'nao' | 'na'
    vidros_obs: string
    vidros_images: string[]
    hodometro: 'sim' | 'nao' | 'na'
    hodometro_obs: string
    hodometro_images: string[]
    combustivel: 'sim' | 'nao' | 'na'
    combustivel_obs: string
    combustivel_images: string[]
    agua: 'sim' | 'nao' | 'na'
    agua_obs: string
    agua_images: string[]
    luzes: 'sim' | 'nao' | 'na'
    luzes_obs: string
    luzes_images: string[]
}

const checklistDiarioDefault: ChecklistDiario = {
    motivo: 'uso',
    farois: 'na',
    farois_obs: '',
    farois_images: [],
    lataria: 'na',
    lataria_obs: '',
    lataria_images: [],
    vidros: 'na',
    vidros_obs: '',
    vidros_images: [],
    hodometro: 'na',
    hodometro_obs: '',
    hodometro_images: [],
    combustivel: 'na',
    combustivel_obs: '',
    combustivel_images: [],
    agua: 'na',
    agua_obs: '',
    agua_images: [],
    luzes: 'na',
    luzes_obs: '',
    luzes_images: [],
}

export default ({ session, veiculos: _veiculos }: Props) => {
    const theme = useTheme()
    const mobile = useMediaQuery(theme.breakpoints.down('sm'))
    const [veiculos, setVeiculos] = React.useState<Veiculo[]>(_veiculos)
    const [search, setSearch] = React.useState<string>('')
    const [openChecklist, setOpenChecklist] = React.useState<'diario' | 'semanal' | 'mensal' | null>('diario')
    const [veiculo, setVeiculo] = React.useState<Veiculo | null>(null)
    const [diario, setChecklistDiario] = React.useState<ChecklistDiario>(checklistDiarioDefault)

    const { openDialog, closeDialog, ...customDialog } = useDialog()

    const onStartChecklist = (veiculo: Veiculo, tipo: 'diario' | 'semanal' | 'mensal') => () => {
        closeDialog()
        setChecklistDiario(checklistDiarioDefault)
        setVeiculo(veiculo)
        setOpenChecklist(tipo)
    }

    const onAction = (veiculo: Veiculo) => () => {
        if (veiculo.status === 'Andamento' && Number(veiculo.id_usuario) === Number(session.user.id)) {

        } else if (veiculo.status === 'Andamento' && Number(veiculo.id_usuario) !== Number(session.user.id)) {
            toast.warning({ html: <Typography>Outro motorista já está realizando o checklist deste veículo.</Typography> })
            return
        }

        openDialog({
            open: true,
            maxWidth: 'sm',
            fullScreen: mobile,
            title: 'Iniciar checklist',
            content: (
                <React.Fragment>
                    <Grid2 container spacing={3}>
                        <Grid2 size={{ xs: 12, sm: 4 }}>
                            <Button color='primary' variant='contained' size='large' fullWidth sx={{ color: 'white' }} onClick={onStartChecklist(veiculo, 'diario')}>
                                Diário
                            </Button>
                        </Grid2>
                        
                        <Grid2 size={{ xs: 12, sm: 4 }}>
                            <Button color='primary' variant='contained' size='large' fullWidth sx={{ color: 'white' }} onClick={onStartChecklist(veiculo, 'semanal')}>
                                Semanal
                            </Button>
                        </Grid2>

                        <Grid2 size={{ xs: 12, sm: 4 }}>
                            <Button color='primary' variant='contained' size='large' fullWidth sx={{ color: 'white' }} onClick={onStartChecklist(veiculo, 'mensal')}>
                                Mensal
                            </Button>
                        </Grid2>
                    </Grid2>
                </React.Fragment>
            ),
            onClose: () => closeDialog(),
            hasAction: false,
            cancelTitle: 'Cancelar',
            cancelColor: 'primary',
        })
    }

    const isBg = (param: string, value: string, color: string) => param === value ? color : palette.grey['100']
    const isColor = (param: string, value: string, color: string) => param === value ? color : palette.grey['400']

    const onChangeDiario = (key: keyof ChecklistDiario, value: string) => setChecklistDiario(prev => ({ ...prev, [key]: value }))

    return (
        <React.Fragment>
            <Grid2 container spacing={6}>
                <PageHeader title={(
                    <Typography sx={{ color: 'primary.main', fontWeight: 600, fontSize: '2rem', fontFamily: 'Arial', letterSpacing: 2 }}>
                        Painel de Veículos
                    </Typography>
                )} />

                <Grid2 size={{ xs: 12 }}>
                    <Grid2 container spacing={6} justifyContent='space-between' alignItems='center'>
                        <Grid2 size={{ xs: 12, sm: 4 }}>
                            <Inputs.TextField label='Buscar por placa' name='search' value={search} onChange={e => setSearch(e.target.value)} size='small' />
                        </Grid2>
                    </Grid2>
                </Grid2>

                <Grid2 size={{ xs: 12 }}>
                    <Grid2 container spacing={4}>
                        {(search ? veiculos.filter(veiculo => veiculo.placa.toLowerCase().includes(search.toLowerCase())) : veiculos).map(veiculo => (
                            <Grid2 size={{ xs: 12, sm: 3 }} key={`veiculo-${veiculo.id}`}>
                                <Card sx={{ cursor: 'pointer' }} onClick={onAction(veiculo)}>
                                    <CardContent sx={{ px: 3, py: '.75rem !important' }}>
                                        <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, mb: 2 }}>
                                            <strong>Placa:</strong> {veiculo.placa}
                                        </Typography>
                                        <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, mb: 2 }}>
                                            <strong>Status:</strong> {veiculo.status === 'Andamento' ? (<span style={{ color: palette.warning['500'], fontWeight: 700 }}>Checklist em andamento</span>) : (veiculo.status ?? 'N/A')}
                                        </Typography>
                                        <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, mb: 2 }}>
                                            <strong>Último checklist:</strong> {veiculo.ultimo_checklist ? DateTime.fromSQL(veiculo.ultimo_checklist).toFormat('dd/MM/yyyy HH:mm'): 'N/A'}
                                        </Typography>

                                        {veiculo.status === 'Andamento' && Number(veiculo.id_usuario) === Number(session.user.id) && (
                                            <Button color='primary' variant='contained' size='small' sx={{ width: '100%', color: 'white' }}>
                                                Continuar checklist
                                            </Button>
                                        )}

                                        {veiculo.status === 'Andamento' && Number(veiculo.id_usuario) !== Number(session.user.id) && (
                                            <Button color='primary' variant='contained' size='small' sx={{ width: '100%', color: 'white' }} disabled>
                                                Checklist em andamento
                                            </Button>
                                        )}

                                        {veiculo.status !== 'Andamento' && (
                                            <Button color='primary' variant='contained' size='small' sx={{ width: '100%', color: 'white' }}>
                                                Iniciar checklist
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid2>
                        ))}
                    </Grid2>
                </Grid2>
            </Grid2>

            <CustomDialog {...customDialog} />

            <Dialog fullWidth maxWidth='sm' fullScreen={mobile} sx={{ ...defaultDialogSx }} open={openChecklist === 'diario'} onClose={() => setOpenChecklist(null)}>
                <DialogTitle>
                    <Typography sx={{ fontWeight: 700, fontFamily: 'Arial', fontSize: '1.5rem', color: theme => theme.palette.primary.main }}>
                        Checklist Diário
                    </Typography>
                </DialogTitle>

                <form onSubmit={() => {}} noValidate autoComplete="off">
                    <DialogContent>
                        <LocalizationProvider dateAdapter={AdapterLuxon}>
                            <Grid2 container spacing={6}>
                                <Grid2 size={{ xs: 12 }}>
                                    <Inputs.Select 
                                        label='Motivo'
                                        name='motivo'
                                        value={diario.motivo}
                                        multiple={false}
                                        options={['uso', 'devolucao']}
                                        size='small'
                                        optionComponent={(option: string) => (
                                            <MenuItem key={`select-checklist-diario-motivo-${option}`} value={option}>
                                                <ListItemText primary={option === 'uso' ? 'Uso' : 'Devolução'} />
                                            </MenuItem>
                                        )}
                                        render={(selected: string) => selected === 'uso' ? 'Uso' : 'Devolução'}
                                        onChange={(e) => onChangeDiario('motivo', e.target.value as 'uso' | 'devolucao')}
                                        labelProps={{ sx: { '&.MuiFormLabel-filled': {fontWeight: 700} } }}
                                    />
                                </Grid2>

                                <Grid2 size={{ xs: 12 }}>
                                    <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 600, fontSize: '1.1rem', mb: 2 }}>
                                        Os faróis estão danificados?
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mb: 3 }}>
                                        <Button color='error' variant="contained" sx={{ ...btnStx, bgcolor: isBg(diario.farois, 'nao', palette.error['600']) }} onClick={() => onChangeDiario('farois', 'nao')}>
                                            <Typography sx={{ color: isColor(diario.farois, 'nao', 'white'), fontWeight: 700, fontSize: '1rem' }}>
                                                NÃO
                                            </Typography>
                                        </Button>
                                        <Button variant="contained" sx={{ ...btnStx, bgcolor: isBg(diario.farois, 'na', palette.grey['300']) }} onClick={() => onChangeDiario('farois', 'na')}>
                                            <Typography sx={{ color: isColor(diario.farois, 'na', palette.grey['500']), fontWeight: 700, fontSize: '1rem' }}>
                                                N/A
                                            </Typography>
                                        </Button>
                                        <Button color='success' variant="contained" sx={{ ...btnStx, bgcolor: isBg(diario.farois, 'sim', palette.success['500']) }} onClick={() => onChangeDiario('farois', 'sim')}>
                                            <Typography sx={{ color: isColor(diario.farois, 'sim', 'white'), fontWeight: 700, fontSize: '1rem' }}>
                                                SIM
                                            </Typography>
                                        </Button>
                                    </Box>
                                    {diario.farois === 'sim' && (
                                        <Box sx={{ }}>
                                            <Inputs.TextField label='Faróis - Observações' name='farois_obs' multiline rows={2} value={diario.farois_obs} onChange={(e) => onChangeDiario('farois_obs', e.target.value)} />
                                        </Box>
                                    )}
                                </Grid2>

                                <Grid2 size={{ xs: 12 }}>
                                    <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 600, fontSize: '1.1rem', mb: 2 }}>
                                        A lataria possui amassados expressivos?
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mb: 3 }}>
                                        <Button color='error' variant="contained" sx={{ ...btnStx, bgcolor: isBg(diario.lataria, 'nao', palette.error['600']) }} onClick={() => onChangeDiario('lataria', 'nao')}>
                                            <Typography sx={{ color: isColor(diario.lataria, 'nao', 'white'), fontWeight: 700, fontSize: '1rem' }}>
                                                NÃO
                                            </Typography>
                                        </Button>
                                        <Button variant="contained" sx={{ ...btnStx, bgcolor: isBg(diario.lataria, 'na', palette.grey['300']) }} onClick={() => onChangeDiario('lataria', 'na')}>
                                            <Typography sx={{ color: isColor(diario.lataria, 'na', palette.grey['500']), fontWeight: 700, fontSize: '1rem' }}>
                                                N/A
                                            </Typography>
                                        </Button>
                                        <Button color='success' variant="contained" sx={{ ...btnStx, bgcolor: isBg(diario.lataria, 'sim', palette.success['500']) }} onClick={() => onChangeDiario('lataria', 'sim')}>
                                            <Typography sx={{ color: isColor(diario.lataria, 'sim', 'white'), fontWeight: 700, fontSize: '1rem' }}>
                                                SIM
                                            </Typography>
                                        </Button>
                                    </Box>
                                    {diario.lataria === 'sim' && (
                                        <Box sx={{ }}>
                                            <Inputs.TextField label='Lataria - Observações' name='lataria_obs' multiline rows={2} value={diario.lataria_obs} onChange={(e) => onChangeDiario('lataria_obs', e.target.value)} />
                                        </Box>
                                    )}
                                </Grid2>

                                <Grid2 size={{ xs: 12 }}>
                                    <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 600, fontSize: '1.1rem', mb: 2 }}>
                                        O prabrisas e os retrovisores estão danificados?
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mb: 3 }}>
                                        <Button color='error' variant="contained" sx={{ ...btnStx, bgcolor: isBg(diario.vidros, 'nao', palette.error['600']) }} onClick={() => onChangeDiario('vidros', 'nao')}>
                                            <Typography sx={{ color: isColor(diario.vidros, 'nao', 'white'), fontWeight: 700, fontSize: '1rem' }}>
                                                NÃO
                                            </Typography>
                                        </Button>
                                        <Button variant="contained" sx={{ ...btnStx, bgcolor: isBg(diario.vidros, 'na', palette.grey['300']) }} onClick={() => onChangeDiario('vidros', 'na')}>
                                            <Typography sx={{ color: isColor(diario.vidros, 'na', palette.grey['500']), fontWeight: 700, fontSize: '1rem' }}>
                                                N/A
                                            </Typography>
                                        </Button>
                                        <Button color='success' variant="contained" sx={{ ...btnStx, bgcolor: isBg(diario.vidros, 'sim', palette.success['500']) }} onClick={() => onChangeDiario('vidros', 'sim')}>
                                            <Typography sx={{ color: isColor(diario.vidros, 'sim', 'white'), fontWeight: 700, fontSize: '1rem' }}>
                                                SIM
                                            </Typography>
                                        </Button>
                                    </Box>
                                    {diario.vidros === 'sim' && (
                                        <Box sx={{ }}>
                                            <Inputs.TextField label='Vidros - Observações' name='vidros_obs' multiline rows={2} value={diario.vidros_obs} onChange={(e) => onChangeDiario('vidros_obs', e.target.value)} />
                                        </Box>
                                    )}
                                </Grid2>

                                <Grid2 size={{ xs: 12 }}>
                                    <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 600, fontSize: '1.1rem', mb: 2 }}>
                                        O hodômetro está danificado?
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mb: 3 }}>
                                        <Button color='error' variant="contained" sx={{ ...btnStx, bgcolor: isBg(diario.hodometro, 'nao', palette.error['600']) }} onClick={() => onChangeDiario('hodometro', 'nao')}>
                                            <Typography sx={{ color: isColor(diario.hodometro, 'nao', 'white'), fontWeight: 700, fontSize: '1rem' }}>
                                                NÃO
                                            </Typography>
                                        </Button>
                                        <Button variant="contained" sx={{ ...btnStx, bgcolor: isBg(diario.hodometro, 'na', palette.grey['300']) }} onClick={() => onChangeDiario('hodometro', 'na')}>
                                            <Typography sx={{ color: isColor(diario.hodometro, 'na', palette.grey['500']), fontWeight: 700, fontSize: '1rem' }}>
                                                N/A
                                            </Typography>
                                        </Button>
                                        <Button color='success' variant="contained" sx={{ ...btnStx, bgcolor: isBg(diario.hodometro, 'sim', palette.success['500']) }} onClick={() => onChangeDiario('hodometro', 'sim')}>
                                            <Typography sx={{ color: isColor(diario.hodometro, 'sim', 'white'), fontWeight: 700, fontSize: '1rem' }}>
                                                SIM
                                            </Typography>
                                        </Button>
                                    </Box>
                                    {diario.hodometro === 'sim' && (
                                        <Box sx={{ }}>
                                            <Inputs.TextField label='Hodômetro - Observações' name='hodometro_obs' multiline rows={2} value={diario.hodometro_obs} onChange={(e) => onChangeDiario('hodometro_obs', e.target.value)} />
                                        </Box>
                                    )}
                                </Grid2>

                                <Grid2 size={{ xs: 12 }}>
                                    <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 600, fontSize: '1.1rem', mb: 2 }}>
                                        Está sem combustível no veículo?
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mb: 3 }}>
                                        <Button color='error' variant="contained" sx={{ ...btnStx, bgcolor: isBg(diario.combustivel, 'nao', palette.error['600']) }} onClick={() => onChangeDiario('combustivel', 'nao')}>
                                            <Typography sx={{ color: isColor(diario.combustivel, 'nao', 'white'), fontWeight: 700, fontSize: '1rem' }}>
                                                NÃO
                                            </Typography>
                                        </Button>
                                        <Button variant="contained" sx={{ ...btnStx, bgcolor: isBg(diario.combustivel, 'na', palette.grey['300']) }} onClick={() => onChangeDiario('combustivel', 'na')}>
                                            <Typography sx={{ color: isColor(diario.combustivel, 'na', palette.grey['500']), fontWeight: 700, fontSize: '1rem' }}>
                                                N/A
                                            </Typography>
                                        </Button>
                                        <Button color='success' variant="contained" sx={{ ...btnStx, bgcolor: isBg(diario.combustivel, 'sim', palette.success['500']) }} onClick={() => onChangeDiario('combustivel', 'sim')}>
                                            <Typography sx={{ color: isColor(diario.combustivel, 'sim', 'white'), fontWeight: 700, fontSize: '1rem' }}>
                                                SIM
                                            </Typography>
                                        </Button>
                                    </Box>
                                    {diario.combustivel === 'sim' && (
                                        <Box sx={{ }}>
                                            <Inputs.TextField label='Combustível - Observações' name='combustivel_obs' multiline rows={2} value={diario.combustivel_obs} onChange={(e) => onChangeDiario('combustivel_obs', e.target.value)} />
                                        </Box>
                                    )}
                                </Grid2>

                                <Grid2 size={{ xs: 12 }}>
                                    <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 600, fontSize: '1.1rem', mb: 2 }}>
                                        Está sem água no radiador?
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mb: 3 }}>
                                        <Button color='error' variant="contained" sx={{ ...btnStx, bgcolor: isBg(diario.agua, 'nao', palette.error['600']) }} onClick={() => onChangeDiario('agua', 'nao')}>
                                            <Typography sx={{ color: isColor(diario.agua, 'nao', 'white'), fontWeight: 700, fontSize: '1rem' }}>
                                                NÃO
                                            </Typography>
                                        </Button>
                                        <Button variant="contained" sx={{ ...btnStx, bgcolor: isBg(diario.agua, 'na', palette.grey['300']) }} onClick={() => onChangeDiario('agua', 'na')}>
                                            <Typography sx={{ color: isColor(diario.agua, 'na', palette.grey['500']), fontWeight: 700, fontSize: '1rem' }}>
                                                N/A
                                            </Typography>
                                        </Button>
                                        <Button color='success' variant="contained" sx={{ ...btnStx, bgcolor: isBg(diario.agua, 'sim', palette.success['500']) }} onClick={() => onChangeDiario('agua', 'sim')}>
                                            <Typography sx={{ color: isColor(diario.agua, 'sim', 'white'), fontWeight: 700, fontSize: '1rem' }}>
                                                SIM
                                            </Typography>
                                        </Button>
                                    </Box>
                                    {diario.agua === 'sim' && (
                                        <Box sx={{ }}>
                                            <Inputs.TextField label='Água - Observações' name='agua_obs' multiline rows={2} value={diario.agua_obs} onChange={(e) => onChangeDiario('agua_obs', e.target.value)} />
                                        </Box>
                                    )}
                                </Grid2>

                                <Grid2 size={{ xs: 12 }}>
                                    <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 600, fontSize: '1.1rem', mb: 2 }}>
                                        Existem luzes acesas no painel do veículo antes do serviço?
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mb: 3 }}>
                                        <Button color='error' variant="contained" sx={{ ...btnStx, bgcolor: isBg(diario.luzes, 'nao', palette.error['600']) }} onClick={() => onChangeDiario('luzes', 'nao')}>
                                            <Typography sx={{ color: isColor(diario.luzes, 'nao', 'white'), fontWeight: 700, fontSize: '1rem' }}>
                                                NÃO
                                            </Typography>
                                        </Button>
                                        <Button variant="contained" sx={{ ...btnStx, bgcolor: isBg(diario.luzes, 'na', palette.grey['300']) }} onClick={() => onChangeDiario('luzes', 'na')}>
                                            <Typography sx={{ color: isColor(diario.luzes, 'na', palette.grey['500']), fontWeight: 700, fontSize: '1rem' }}>
                                                N/A
                                            </Typography>
                                        </Button>
                                        <Button color='success' variant="contained" sx={{ ...btnStx, bgcolor: isBg(diario.luzes, 'sim', palette.success['500']) }} onClick={() => onChangeDiario('luzes', 'sim')}>
                                            <Typography sx={{ color: isColor(diario.luzes, 'sim', 'white'), fontWeight: 700, fontSize: '1rem' }}>
                                                SIM
                                            </Typography>
                                        </Button>
                                    </Box>
                                    {diario.luzes === 'sim' && (
                                        <Box sx={{ }}>
                                            <Inputs.TextField label='Luzes - Observações' name='luzes_obs' multiline rows={2} value={diario.luzes_obs} onChange={(e) => onChangeDiario('luzes_obs', e.target.value)} />
                                        </Box>
                                    )}
                                </Grid2>
                            </Grid2>
                        </LocalizationProvider>
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={() => setOpenChecklist(null)} color='error'>Cancelar</Button>
                        <Button type='submit' color='primary'>Finalizar checklist</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </React.Fragment>
    )
}