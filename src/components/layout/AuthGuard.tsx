'use client'

import '@/bootstrap'
import { ChildrenType } from "@/@core/types"
import AuthRedirect from "./AuthRedirect"
import { AclGuard, defineAbilityFor } from "./AclGuard"
import { AnyAbility } from "@casl/ability"
import { useSession } from "next-auth/react"
import React from "react"
import User from "@/entities/user.entity"
import FallbackSpinner from "./UserSpinner"

export default function AuthGuard ({ children }: ChildrenType) {
    const session = useSession()
    let ability: AnyAbility

    if (session.status === 'loading') {
        return <React.Fragment>
            <FallbackSpinner />
        </React.Fragment>
    } else if (session.status === 'unauthenticated') {
        return <AuthRedirect />
    }

    if (!session.data) {
        return <AuthRedirect />
    }

    ability = defineAbilityFor(session.data.user as User)

    return <AclGuard ability={ability}>
        {children}
    </AclGuard>
}