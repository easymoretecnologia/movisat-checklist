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
import { Alert, Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Grid2, IconButton, Skeleton, Tooltip, Typography } from "@mui/material"
import { Session } from "next-auth"
import React from "react"
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import { Lembrete } from '@/entities/lembrete.entity'
import { palette } from '@/configs/themeConfig'
import { DateTime } from 'luxon'
import { Notificacao } from '@/entities/notificacao.entity'

interface Props {
    session: Session
}

export default ({ session }: Props) => {
    const notificacoes = useClass<{ notificacoes: Notificacao[] }>({ notificacoes: [] }, 'loading')

    const { openDialog, closeDialog, ...customDialog } = useDialog()

    const get = React.useCallback(_.debounce(() => {
        notificacoes.set({ notificacoes: [] }, 'loading')
        
        axios.get({ raw: true, url: '/api/data/notificacoes/list', data: { auth_id: session.user.id }, token: session.accessToken, process: true, message: false })
        .then(res => {
            notificacoes.set(res.data, 'ready')
        })
        .catch(err => {
            notificacoes.set({ notificacoes: [] }, 'error')
        })
    }, 500), [session])

    React.useEffect(() => {
        get()
    }, [])

    const onRead = (notificacao: Notificacao) => () => {
        sweetalert.loading()

        axios.patch({ raw: true, url: '/api/data/notificacoes', data: { id: notificacao.id, id_usuario: session.user.id }, token: session.accessToken, process: true, message: true })
        .then(res => {
            closeDialog()
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
                    Notificações
                </Typography>
            )} />
            
            <Grid2 size={{ xs: 12 }}>
                {notificacoes.status === 'loading' && (
                    <React.Fragment>
                        <Skeleton variant='rectangular' height={80} sx={{ mb: 2, borderRadius: 2 }} />
                        <Skeleton variant='rectangular' height={80} sx={{ mb: 2, borderRadius: 2 }} />
                        <Skeleton variant='rectangular' height={80} sx={{ mb: 2, borderRadius: 2 }} />
                    </React.Fragment>
                )}

                {notificacoes.status === 'error' && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 200 }}>
                        <Icon icon='solar:danger-triangle-linear' fontSize={100} style={{ color: palette.error.main }} />
                        <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 600, fontSize: '1rem', fontFamily: 'Arial', letterSpacing: 2, mb: 2 }}>
                            Erro ao buscar lembretes.
                        </Typography>
                    </Box>
                )}

                {notificacoes.status === 'ready' && notificacoes.notificacoes.length > 0 && (
                    <Grid2 container spacing={3}>
                        {notificacoes.notificacoes.map(notificacao => (
                            <Grid2 size={{ xs: 12 }} key={`notificacao-${notificacao.id}`}>
                                <Card>
                                    <CardContent sx={{ py: '.5rem !important',  px: 3 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2 }}>
                                                {DateTime.fromSQL(notificacao.data).toFormat('dd/MM/yyyy HH:mm')}
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                                <Tooltip placement='top' title="Marcar como lida" arrow>
                                                    <IconButton onClick={onRead(notificacao)}>
                                                        <Icon icon='solar:letter-unread-linear' fontSize={20} style={{ color: palette.primary.main }} />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </Box>
                                        
                                        <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 600, fontSize: '1rem', fontFamily: 'Arial', letterSpacing: 2 }}>
                                            {notificacao.descricao}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid2>
                        ))}
                    </Grid2>
                )}
            </Grid2>
        </Grid2>

        <CustomDialog {...customDialog} />
    </React.Fragment>
}