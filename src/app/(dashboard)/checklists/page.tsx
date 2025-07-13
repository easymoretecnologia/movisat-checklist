import { Authorized } from "@/components/layout/AclGuard"
import AuthRedirect from "@/components/layout/AuthRedirect"
import useAuth from "@/hooks/useAuth"
import React from "react"
import Component from "./component"
import axios from "@/utils/axios"
import Http from "@/enums/http"

const Page = async ({ params, searchParams }: { params: Promise<{}>, searchParams: Promise<{ message: string }> }) => {
    const {} = await params
    const { message = '' } = await searchParams
    const session = await useAuth()

    if (!session || (session && !session.user)) {
        return <><AuthRedirect to='/login' /></>
    }

    const options = await axios.get({ raw: true, url: '/api/data/checklists/admin/options', token: session.accessToken, process: false, message: false })

    if (Http.failed(options.status)) {
        if (Http.is('Unauthorized', options.status)) {
            return <><AuthRedirect to='/login' /></>
        }

        return <><AuthRedirect to='/500' /></>
    }

    return <Authorized subject="checklists" action="manage">
        <Component session={session} {...options.data} />
    </Authorized>
}

export default Page