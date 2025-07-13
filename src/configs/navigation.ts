import React from "react"

export type NavigationConfig = {
    title: string
    path?: string
    icon?: string
    auth?: boolean
    disabled?: boolean
    externalLink?: boolean
    openInNewTab?: boolean
    hidden?: boolean
    action?: string
    subject?: string
    badgeColor?: 'default' | 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info'
    badgeContent?: string|React.ReactNode
    children?: NavigationConfig[],
    order: number
}

export function navigationConfig (): NavigationConfig[] {
    return [
        {
            title: 'Página Inicial',
            path: '/',
            icon: 'solar:home-2-linear',
            auth: true,
            subject: 'home',
            action: 'read',
            order: 1
        },
        {
            title: 'Empresas',
            path: '/empresas',
            icon: 'solar:buildings-linear',
            auth: true,
            subject: 'empresas',
            action: 'manage',
            order: 2
        },

        {
            title: 'Usuários',
            path: '/usuarios',
            icon: 'solar:users-group-two-rounded-linear',
            auth: true,
            subject: 'usuarios',
            action: 'manage',
            order: 3
        },

        {
            title: 'Veículos',
            path: '/veiculos',
            icon: 'hugeicons:car-02',
            auth: true,
            subject: 'veiculos',
            action: 'manage',
            order: 4
        },

        {
            title: 'Checklists',
            path: '/checklists',
            icon: 'solar:clipboard-list-linear',
            auth: true,
            subject: 'checklists',
            action: 'manage',
            order: 6
        },

        {
            title: 'Limpeza de Dados',
            path: '/limpeza-de-dados',
            icon: 'solar:broom-linear',
            auth: true,
            subject: 'limpezas',
            action: 'manage',
            order: 7
        },

        {
            title: 'Gestão de Ocorrências',
            path: '/ocorrencias',
            icon: 'solar:clipboard-list-linear',
            auth: true,
            subject: 'ocorrencias',
            action: 'manage',
            order: 2
        },

        {
            title: 'Inconformidades',
            path: '/inconformidades',
            icon: 'solar:danger-triangle-linear',
            auth: true,
            subject: 'inconformidades',
            action: 'manage',
            order: 3
        },

        {
            title: 'Notificações',
            path: '/notificacoes',
            icon: 'solar:bell-linear',
            auth: true,
            subject: 'notificacoes',
            action: 'manage',
            order: 4
        },

        {
            title: 'Lembretes',
            path: '/lembretes',
            icon: 'solar:danger-circle-linear',
            auth: true,
            subject: 'lembretes',
            action: 'manage',
            order: 5
        },
    ]
}