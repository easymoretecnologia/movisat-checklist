'use client'

import { Lembrete } from "@/entities/lembrete.entity"
import { Notificacao } from "@/entities/notificacao.entity"
import { Alert, Button, Card, CardContent, CardHeader, Grid2, Typography, useTheme } from "@mui/material"
import { DateTime } from "luxon"
import { Session } from "next-auth"
import Link from "next/link"
import React from "react"

interface Props {
    session: Session
    lembretes: Lembrete[]
    notificacoes: Notificacao[]
}

export default ({ session, lembretes: _lembretes, notificacoes: _notificacoes }: Props) => {
    const theme = useTheme()
    const [lembretes, setLembretes] = React.useState<Lembrete[]>(_lembretes.filter(lembrete => lembrete.data === DateTime.now().toFormat('yyyy-MM-dd')))
    const [notificacoes, setNotificacoes] = React.useState<Notificacao[]>(_notificacoes)

    return (
        <Grid2 container spacing={6}>
            <Grid2 size={{ xs: 12, sm: 7 }}>
                <Card>
                    <CardHeader title='Notificações' action={<Button color='primary' LinkComponent={Link} href="/notificacoes">Ver todas</Button>} />
                    <CardContent>
                        {notificacoes.map(item => (
                            <Alert key={`notificacao-${item.id}`} severity='info' sx={{ mb: 2, '& .MuiAlert-message': { width: '100%' } }}>
                                <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2 }}>
                                    {item.descricao}
                                </Typography>
                                <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2, textAlign: 'right' }}>
                                    {DateTime.fromSQL(item.data).toFormat('dd/MM/yyyy HH:mm')}
                                </Typography>
                            </Alert>
                        ))}
                    </CardContent>
                </Card>
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 5 }}>
                <Card>
                    <CardHeader title='Lembretes do Dia' />
                    <CardContent>
                        {lembretes.map(item => (
                            <Alert key={`lembrete-${item.id}`} severity='info' sx={{ mb: 2 }}>
                                <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2 }}>
                                    {item.mensagem}
                                </Typography>
                            </Alert>
                        ))}
                        {lembretes.length === 0 && (
                            <Typography sx={{ color: theme => theme.palette.text.secondary, fontWeight: 500, fontSize: '.9rem', fontFamily: 'Arial', letterSpacing: 2 }}>
                                Nenhum lembrete encontrado.
                            </Typography>
                        )}
                    </CardContent>
                </Card>
            </Grid2>
        </Grid2>
    )
}