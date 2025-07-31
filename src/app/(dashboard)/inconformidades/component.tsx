'use client'

import _ from 'lodash'
import PageHeader from "@/components/PageHeader"
import { Box, Button, Card, CardContent, CardHeader, Grid2, TableRow, Tooltip, Typography, useMediaQuery, useTheme } from "@mui/material"
import { Session } from "next-auth"
import React from "react"
import { Icon } from '@iconify/react/dist/iconify.js'
import { palette } from '@/configs/themeConfig'
import { DateTime } from 'luxon'
import Tables from '@/components/tables'
import Inputs from '@/components/inputs'

interface Props {
    session: Session
    diarios: { id: number, tipo: 'diario', veiculo: { id: number, placa: string }, ultimo_checklist: string, dias_sem_checklist: number, inconformidades: string, ciencia_inconformidades: string }[]
    mensais: { id: number, tipo: 'mensal', veiculo: { id: number, placa: string }, ultimo_checklist: string, dias_sem_checklist: number, inconformidades: string, ciencia_inconformidades: string }[]
    semanais: { id: number, tipo: 'semanal', veiculo: { id: number, placa: string }, ultimo_checklist: string, dias_sem_checklist: number, inconformidades: string, ciencia_inconformidades: string }[]
}

export default ({ session, diarios, mensais, semanais }: Props) => {
    const theme = useTheme()
    const mobile = useMediaQuery(theme.breakpoints.down('sm'))
    const [view, setView] = React.useState<'grid' | 'list'>('grid')
    const [search, setSearch] = React.useState('')
    
    const filteredDiarios = diarios.filter(diario => diario.veiculo.placa.toLowerCase().includes(search.toLowerCase()))
    const filteredMensais = mensais.filter(mensal => mensal.veiculo.placa.toLowerCase().includes(search.toLowerCase()))
    const filteredSemanais = semanais.filter(semana => semana.veiculo.placa.toLowerCase().includes(search.toLowerCase()))

    return <React.Fragment>
        <Grid2 container spacing={6}>
            <PageHeader title={(
                <Typography sx={{ color: 'primary.main', fontWeight: 600, fontSize: '2rem', fontFamily: 'Arial', letterSpacing: 2 }}>
                    Inconformidades
                </Typography>
            )} />

            <Grid2 size={{ xs: 12 }}>
                <Grid2 container spacing={3} justifyContent='space-between'>
                    <Grid2 size={{ xs: 12, sm: 4 }}>
                        <Inputs.TextField
                            label='Buscar por placa'
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            size='small'
                        />
                    </Grid2>

                    <Grid2 size={{ xs: 12, sm: 8 }}>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', alignItems: 'center' }}>
                            <Tooltip placement='top' title='Modo Grid'>
                                <Button variant={view === 'grid' ? 'contained' : 'outlined'} color='primary' size='small' onClick={() => setView('grid')}>
                                    <Icon icon="solar:widget-linear" fontSize={20} style={{ color: view === 'grid' ? 'white' : palette.primary.main }} />
                                </Button>
                            </Tooltip>
                            <Tooltip placement='top' title='Modo Lista'>
                                <Button variant={view === 'list' ? 'contained' : 'outlined'} color='primary' size='small' onClick={() => setView('list')}>
                                    <Icon icon="solar:server-minimalistic-linear" fontSize={20} style={{ color: view === 'list' ? 'white' : palette.primary.main }} />
                                </Button>
                            </Tooltip>
                        </Box>
                    </Grid2>
                </Grid2>
            </Grid2>

            <Grid2 size={{ xs: 12 }}>
                <Card>
                    <CardHeader title="Checklist Diário" />
                    {view === 'grid' && <CardContent>
                        <Grid2 container spacing={3}>
                            {filteredDiarios.map(diario => (
                                <Grid2 size={{ xs: 12, sm: 3, }} key={diario.id}>
                                    <Card sx={{ border: `2px solid ${diario.ciencia_inconformidades ? palette.success['500'] : palette.error['500']}` }}>
                                        <CardContent sx={{ p: '.5rem !important' }}>
                                            <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, mb: 2 }}>
                                                <strong>Placa:</strong> {diario.veiculo.placa}
                                            </Typography>
                                            <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, mb: 2 }}>
                                                <strong>Último checklist:</strong> {diario.ultimo_checklist ? DateTime.fromSQL(diario.ultimo_checklist).toFormat('dd/MM/yyyy'): 'N/A'}
                                            </Typography>
                                            <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, mb: 2 }}>
                                                <strong>Inconformidades:</strong> {diario.inconformidades}
                                            </Typography>
                                            <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, mb: 2 }}>
                                                <strong>Dias sem checklist:</strong> {diario.dias_sem_checklist} dias
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid2>
                            ))}
                        </Grid2>
                    </CardContent>}
                    {view === 'list' && <Tables.Container>
                        <Tables.Head>
                            <Tables.Title title='Placa' />    
                            <Tables.Title title='Último checklist' />    
                            <Tables.Title title='Inconformidades' />    
                            <Tables.Title title='Dias sem checklist' />    
                            <Tables.Title title='Ciência de Inconformidades' />
                        </Tables.Head>    
                        <Tables.Body>
                            {filteredDiarios.map(diario => (
                                <TableRow key={diario.id}>
                                    <Tables.Text>{diario.veiculo.placa}</Tables.Text>
                                    <Tables.Text>{diario.ultimo_checklist ? DateTime.fromSQL(diario.ultimo_checklist).toFormat('dd/MM/yyyy'): 'N/A'}</Tables.Text>
                                    <Tables.Text>{diario.inconformidades}</Tables.Text>
                                    <Tables.Text>{diario.dias_sem_checklist} dias</Tables.Text>
                                    <Tables.Text>{diario.ciencia_inconformidades ? 'Sim' : 'Não'}</Tables.Text>
                                </TableRow>
                            ))}
                        </Tables.Body>    
                    </Tables.Container>}
                </Card>
            </Grid2>

            <Grid2 size={{ xs: 12 }}>
                <Card>
                    <CardHeader title="Checklist Mensal" />
                    {view === 'grid' && <CardContent>
                        <Grid2 container spacing={3}>
                            {filteredMensais.map(mensal => (
                                <Grid2 size={{ xs: 12, sm: 3, }} key={mensal.id}>
                                    <Card sx={{ border: `2px solid ${mensal.ciencia_inconformidades ? palette.success['500'] : palette.error['500']}` }}>
                                        <CardContent sx={{ p: '.5rem !important' }}>
                                            <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, mb: 2 }}>
                                                <strong>Placa:</strong> {mensal.veiculo.placa}
                                            </Typography>
                                            <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, mb: 2 }}>
                                                <strong>Último checklist:</strong> {mensal.ultimo_checklist ? DateTime.fromSQL(mensal.ultimo_checklist).toFormat('dd/MM/yyyy'): 'N/A'}
                                            </Typography>
                                            <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, mb: 2 }}>
                                                <strong>Inconformidades:</strong> {mensal.inconformidades}
                                            </Typography>
                                            <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, mb: 2 }}>
                                                <strong>Dias sem checklist:</strong> {mensal.dias_sem_checklist} dias
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid2>
                            ))}
                        </Grid2>
                    </CardContent>}
                    {view === 'list' && <Tables.Container>
                        <Tables.Head>
                            <Tables.Title title='Placa' />    
                            <Tables.Title title='Último checklist' />    
                            <Tables.Title title='Inconformidades' />    
                            <Tables.Title title='Dias sem checklist' />
                            <Tables.Title title='Ciência de Inconformidades' />
                        </Tables.Head>    
                        <Tables.Body>
                            {filteredMensais.map(mensal => (
                                <TableRow key={mensal.id}>
                                    <Tables.Text>{mensal.veiculo.placa}</Tables.Text>
                                    <Tables.Text>{mensal.ultimo_checklist ? DateTime.fromSQL(mensal.ultimo_checklist).toFormat('dd/MM/yyyy'): 'N/A'}</Tables.Text>
                                    <Tables.Text>{mensal.inconformidades}</Tables.Text>
                                    <Tables.Text>{mensal.dias_sem_checklist} dias</Tables.Text>
                                    <Tables.Text>{mensal.ciencia_inconformidades ? 'Sim' : 'Não'}</Tables.Text>
                                </TableRow>
                            ))}
                        </Tables.Body>    
                    </Tables.Container>}
                </Card>
            </Grid2>

            <Grid2 size={{ xs: 12 }}>
                <Card>
                    <CardHeader title="Checklist Semanal" />
                    {view === 'grid' && <CardContent>
                        <Grid2 container spacing={3}>
                            {filteredSemanais.map(semana => (
                                <Grid2 size={{ xs: 12, sm: 3, }} key={semana.id}>
                                    <Card sx={{ border: `2px solid ${semana.ciencia_inconformidades ? palette.success['500'] : palette.error['500']}` }}>
                                        <CardContent sx={{ p: '.5rem !important' }}>
                                            <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, mb: 2 }}>
                                                <strong>Placa:</strong> {semana.veiculo.placa}
                                            </Typography>
                                            <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, mb: 2 }}>
                                                <strong>Último checklist:</strong> {semana.ultimo_checklist ? DateTime.fromSQL(semana.ultimo_checklist).toFormat('dd/MM/yyyy'): 'N/A'}
                                            </Typography>
                                            <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, mb: 2 }}>
                                                <strong>Inconformidades:</strong> {semana.inconformidades}
                                            </Typography>
                                            <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, mb: 2 }}>
                                                <strong>Dias sem checklist:</strong> {semana.dias_sem_checklist} dias
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid2>
                            ))}
                        </Grid2>
                    </CardContent>}
                    {view === 'list' && <Tables.Container>
                        <Tables.Head>
                            <Tables.Title title='Placa' />    
                            <Tables.Title title='Último checklist' />    
                            <Tables.Title title='Inconformidades' />    
                            <Tables.Title title='Dias sem checklist' />
                            <Tables.Title title='Ciência de Inconformidades' />
                        </Tables.Head>    
                        <Tables.Body>
                            {filteredSemanais.map(semana => (
                                <TableRow key={semana.id}>
                                    <Tables.Text>{semana.veiculo.placa}</Tables.Text>
                                    <Tables.Text>{semana.ultimo_checklist ? DateTime.fromSQL(semana.ultimo_checklist).toFormat('dd/MM/yyyy'): 'N/A'}</Tables.Text>
                                    <Tables.Text>{semana.inconformidades}</Tables.Text>
                                    <Tables.Text>{semana.dias_sem_checklist} dias</Tables.Text>
                                    <Tables.Text>{semana.ciencia_inconformidades ? 'Sim' : 'Não'}</Tables.Text>
                                </TableRow>
                            ))}
                        </Tables.Body>    
                    </Tables.Container>}
                </Card>
            </Grid2>
        </Grid2>
    </React.Fragment>
}