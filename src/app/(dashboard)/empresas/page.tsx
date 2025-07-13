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

    return <Authorized subject="empresas" action="manage">
        <Component session={session} />
    </Authorized>
}

export default Page