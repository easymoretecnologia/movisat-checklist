'use client'

import { redirect, usePathname } from "next/navigation"

const AuthRedirect = ({ to = '/' }: { to?: string }) => {
    const pathname = usePathname()

    const login = '/login'
    const home = '/'

    return redirect(pathname === login ? login : (pathname === home ? login : (pathname === to ? login : to)))
}

export default AuthRedirect