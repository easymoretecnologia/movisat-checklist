import { Authorized } from "@/components/layout/AclGuard"
import AuthRedirect from "@/components/layout/AuthRedirect"
import Http from "@/enums/http"
import useAuth from "@/hooks/useAuth"
import axios from "@/utils/axios"
import Motorista from "@/views/home/motorista"
import Supervisor from "@/views/home/supervisor"
import { Box, Grid2 } from "@mui/material"
import React from "react"

const Page = async ({ params, searchParams }: { params: Promise<{}>, searchParams: Promise<{ message: string }> }) => {
    const {} = await params
    const { message = '' } = await searchParams
    const session = await useAuth()

    if (!session || (session && !session.user)) {
        return <><AuthRedirect to='/login' /></>
    }

    if (session.user.tipo_acesso === 0) {
        return <Authorized subject="home" action="read">
            <Box></Box>
        </Authorized>
    } else if (session.user.tipo_acesso === 1) {
        const lembretes = await axios.get({ raw: true, url: '/api/data/lembretes/list', data: { auth_id: session.user.id }, token: session.accessToken, process: false, message: false })
        console.log(lembretes.data)

        if (Http.failed(lembretes.status)) {
            if (Http.is('Unauthorized', lembretes.status)) {
                return <><AuthRedirect to='/login' /></>
            }
            
            return <><AuthRedirect to='/500' /></>
        }

        const notificacoes = await axios.get({ raw: true, url: '/api/data/notificacoes/recents', data: { auth_id: session.user.id }, token: session.accessToken, process: false, message: false })
        console.log(notificacoes.data)

        if (Http.failed(notificacoes.status)) {
            if (Http.is('Unauthorized', notificacoes.status)) {
                return <><AuthRedirect to='/login' /></>
            }
    
            return <><AuthRedirect to='/500' /></>
        }

        return <Authorized subject="home" action="read">
            <Supervisor session={session} lembretes={lembretes.data.lembretes ?? []} notificacoes={notificacoes.data.notificacoes ?? []} />
        </Authorized>
    }

    const veiculos = await axios.get({ raw: true, url: '/api/data/motorista/veiculos', data: { auth_id: session.user.id }, token: session.accessToken, process: false, message: false })
    console.log(veiculos.data)

    if (Http.failed(veiculos.status)) {
        if (Http.is('Unauthorized', veiculos.status)) {
            return <><AuthRedirect to='/login' /></>
        }
        
        return <><AuthRedirect to='/500' /></>
    }

    return <Authorized subject="home" action="read">
        <Motorista session={session} veiculos={veiculos.data.veiculos ?? []} />
    </Authorized>
}

export default Page