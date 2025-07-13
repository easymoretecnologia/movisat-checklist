'use client'

import _ from 'lodash'
import CustomDialog, { defaultDialogSx, useDialog } from "@/components/dialog/CustomDialog"
import Inputs from "@/components/inputs"
import PageHeader from "@/components/PageHeader"
import useForm from "@/hooks/useForm"
import useClass from "@/hooks/useState"
import axios from "@/utils/axios"
import sweetalert, { toast } from "@/utils/sweetalert"
import { Icon } from "@iconify/react/dist/iconify.js"
import { Alert, Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Grid2, IconButton, Skeleton, Typography } from "@mui/material"
import { Session } from "next-auth"
import React from "react"
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import { Lembrete } from '@/entities/lembrete.entity'
import { palette } from '@/configs/themeConfig'
import { DateTime } from 'luxon'

interface Props {
    session: Session
}

export default ({ session }: Props) => {
    const lembretes = useClass<{ lembretes: Lembrete[] }>({ lembretes: [] }, 'loading')
    const [store, setStore] = React.useState<Partial<Lembrete>>({ id: 0, mensagem: '', data: '' })
    const [edit, setEdit] = React.useState(false)

    const { onChange, onDate } = useForm({})
    const { openDialog, closeDialog, ...customDialog } = useDialog()

    const get = React.useCallback(_.debounce(() => {
        lembretes.set({ lembretes: [] }, 'loading')
        
        axios.get({ raw: true, url: '/api/data/lembretes/list', data: { auth_id: session.user.id }, token: session.accessToken, process: true, message: false })
        .then(res => {
            lembretes.set(res.data, 'ready')
        })
        .catch(err => {
            lembretes.set({ lembretes: [] }, 'error')
        })
    }, 500), [session])

    React.useEffect(() => {
        get()
    }, [])

    const onClose = () => {
        setEdit(false)
        _.delay(() => setStore({ id: 0, mensagem: '', data: '' } as Lembrete), 1000)
    }

    const onStore = (lembrete?: Lembrete) => () => {
        setStore(lembrete ?? { id: 0, mensagem: '', data: '' } as Lembrete)
        setEdit(true)
    }

    const onDelete = (lembrete: Lembrete) => () => {
        openDialog({
            open: true,
            title: 'Confirmar ação',
            content: (
                <React.Fragment>
                    <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 600, fontSize: '1rem', fontFamily: 'Arial', letterSpacing: 2, mb: 2 }}>
                        Confirmar a exclusão do lembrete:
                    </Typography>
                    <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2 }}>
                        {lembrete.mensagem}
                    </Typography>
                </React.Fragment>
            ),
            onClose: () => closeDialog(),
            onAction: () => {
                sweetalert.loading()

                axios.delete({ raw: true, url: '/api/data/lembretes', data: { id: lembrete.id, id_usuario: session.user.id }, token: session.accessToken, process: true, message: true })
                .then(res => {
                    closeDialog()
                    sweetalert.close()
                    toast.success({ html: <Typography>{res.data.message}</Typography> })
                    get()
                })
                .catch(err => {})
            },
            actionTitle: 'Confirmar',
            actionColor: 'error',
            cancelTitle: 'Cancelar',
            cancelColor: 'primary',
        })
    }

    const onSave = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        
        sweetalert.loading()

        axios.raw({ raw: true, method: store.id ? 'PUT' : 'POST', url: '/api/data/lembretes', data: { ...store, id_usuario: session.user.id }, token: session.accessToken, process: true, message: true })
        .then(res => {
            onClose()
            sweetalert.close()
            toast.success({ html: <Typography>{res.data.message}</Typography> })
            get()
        })
        .catch(err => {})
    }

    return <React.Fragment>
        <Grid2 container spacing={6}>
            <PageHeader title={(
                <Typography sx={{ color: 'primary.main', fontWeight: 600, fontSize: '2rem', fontFamily: 'Arial', letterSpacing: 2 }}>
                    Lembretes
                </Typography>
            )} />
            
            <Grid2 size={{ xs: 12 }}>
                <Grid2 container spacing={6} justifyContent='flex-end' alignItems='center'>
                    <Grid2 size={{ xs: 12, sm: 2 }}>
                        <Button color='primary' onClick={onStore()}>
                            <Icon icon='solar:add-square-linear' fontSize={20} className="!mr-2" />
                            Adicionar lembrete
                        </Button>
                    </Grid2>
                </Grid2>
            </Grid2>

            <Grid2 size={{ xs: 12 }}>
                {lembretes.status === 'loading' && (
                    <React.Fragment>
                        <Skeleton variant='rectangular' height={80} sx={{ mb: 2, borderRadius: 2 }} />
                        <Skeleton variant='rectangular' height={80} sx={{ mb: 2, borderRadius: 2 }} />
                        <Skeleton variant='rectangular' height={80} sx={{ mb: 2, borderRadius: 2 }} />
                    </React.Fragment>
                )}

                {lembretes.status === 'error' && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 200 }}>
                        <Icon icon='solar:danger-triangle-linear' fontSize={100} style={{ color: palette.error.main }} />
                        <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 600, fontSize: '1rem', fontFamily: 'Arial', letterSpacing: 2, mb: 2 }}>
                            Erro ao buscar lembretes.
                        </Typography>
                    </Box>
                )}

                {lembretes.status === 'ready' && lembretes.lembretes.length > 0 && (
                    <Grid2 container spacing={6}>
                        {lembretes.lembretes.map(lembrete => (
                            <Grid2 size={{ xs: 12, sm: 6 }} key={`lembrete-${lembrete.id}`}>
                                <Card>
                                    <CardContent sx={{ py: '.5rem !important',  px: 3 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2 }}>
                                                {DateTime.fromSQL(lembrete.data).toFormat('dd/MM/yyyy')}
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                                <IconButton onClick={onStore(lembrete)}>
                                                    <Icon icon='solar:pen-new-square-linear' fontSize={20} style={{ color: palette.primary.main }} />
                                                </IconButton>
                                                <IconButton onClick={onDelete(lembrete)}>
                                                    <Icon icon='solar:trash-bin-trash-linear' fontSize={20} style={{ color: palette.error.main }} />
                                                </IconButton>
                                            </Box>
                                        </Box>
                                        
                                        <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 600, fontSize: '1rem', fontFamily: 'Arial', letterSpacing: 2 }}>
                                            {lembrete.mensagem}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid2>
                        ))}
                    </Grid2>
                )}
            </Grid2>
        </Grid2>

        <Dialog fullWidth maxWidth='sm' sx={{ ...defaultDialogSx }} open={edit} onClose={onClose}>
            <DialogTitle>
                <Typography sx={{ fontWeight: 700, fontFamily: 'Arial', fontSize: '1.5rem', color: theme => theme.palette.primary.main }}>
                    {store.id ? 'Editar' : 'Cadastrar'} Lembrete
                </Typography>
            </DialogTitle>

            <form onSubmit={onSave} noValidate autoComplete="off">
                <DialogContent>
                    <LocalizationProvider dateAdapter={AdapterLuxon}>
                        <Grid2 container spacing={6}>
                            <Grid2 size={{ xs: 12 }}>
                                <Inputs.TextField 
                                    label='Mensagem' 
                                    name='mensagem' 
                                    value={store.mensagem} 
                                    onChange={onChange(setStore)} 
                                />
                            </Grid2>

                            <Grid2 size={{ xs: 12 }}>
                                <Inputs.DateField 
                                    name='data'
                                    label='Data'
                                    value={store.data ?? null}
                                    onChange={onDate('data', setStore)}
                                />
                            </Grid2>
                        </Grid2>
                    </LocalizationProvider>
                </DialogContent>

                <DialogActions>
                    <Button onClick={onClose} color='error'>Fechar</Button>
                    <Button type='submit' color='primary'>Salvar</Button>
                </DialogActions>
            </form>
        </Dialog>

        <CustomDialog {...customDialog} />
    </React.Fragment>
}