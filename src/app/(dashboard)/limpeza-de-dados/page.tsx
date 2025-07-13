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

    return <Authorized subject="limpezas" action="manage">
        <Component session={session} />
    </Authorized>
}

export default Page