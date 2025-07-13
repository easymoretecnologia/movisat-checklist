import { Authorized } from "@/components/layout/AclGuard"
import AuthRedirect from "@/components/layout/AuthRedirect"
import Http from "@/enums/http"
import useAuth from "@/hooks/useAuth"
import axios from "@/utils/axios"
import { Box, Grid2 } from "@mui/material"
import React from "react"
import Component from "./component"

const Page = async ({ params, searchParams }: { params: Promise<{}>, searchParams: Promise<{ message: string }> }) => {
    const {} = await params
    const { message = '' } = await searchParams
    const session = await useAuth()

    if (!session || (session && !session.user)) {
        return <><AuthRedirect to='/login' /></>
    }

    const empresas = await axios.get({ raw: true, url: '/api/data/empresas/options', token: session.accessToken, process: false, message: false })

    if (Http.failed(empresas.status)) {
        if (Http.is('Unauthorized', empresas.status)) {
            return <><AuthRedirect to='/login' /></>
        }

        return <><AuthRedirect to='/500' /></>
    }

    return <Authorized subject="veiculos" action="manage">
        <Component session={session} empresas={empresas.data.options} />
    </Authorized>
}

export default Page