import { Notificacao, NotificacaoLida } from "@/entities/notificacao.entity"
import User from "@/entities/user.entity"
import useDatabase from "@/hooks/useDatabase"
import useLog from "@/hooks/useLog"
import { NextRequest, NextResponse } from "next/server"

export async function GET (request: NextRequest) {
    const token = request.headers.get('authorization')?.split(' ')[1]
    const querySearch = request.nextUrl.searchParams

    if (!token) {
        return NextResponse.json({ message: 'Usuário não autenticado.' }, { status: 401, statusText: 'Unauthorized' })
    } else if (!querySearch.has('auth_id')) {
        return NextResponse.json({ message: 'Usuário não autenticado.' }, { status: 422, statusText: 'Unprocessable Entity' })
    }

    const auth_id = querySearch.get('auth_id')

    try {
        const db = await useDatabase()

        const usuarioRepository = db.getRepository(User)
          
        const dbUser = await usuarioRepository.findOne({
            where: { 
                id: Number(auth_id),
                remember_token: token
            }
        })

        if (!dbUser) {
            return {
                name: undefined,
                email: undefined,
                sub: undefined
            } as any
        }
        
        const repo = db.getRepository(Notificacao)

        let query = await repo.createQueryBuilder('notificacoes')
        .where('notificacoes.empresa_id = :empresa_id', { empresa_id: dbUser.id_empresa })
        .andWhere(qb => {
            const subQuery = qb.subQuery()
                .select('1')
                .from(NotificacaoLida, 'nl')
                .where('nl.notificacao_id = notificacoes.id')
                .andWhere('nl.usuario_id = :usuario_id')
                .getQuery()
            return `NOT EXISTS ${subQuery}`
        }, { usuario_id: dbUser.id })
        .orderBy('notificacoes.data', 'DESC')

        const notificacoes = await query.limit(5).getMany()

        

        return NextResponse.json({
            notificacoes: notificacoes.map(notificacao => ({
                id: Number(notificacao.id),
                descricao: notificacao.descricao,
                data: notificacao.data
            })),    
        }, { status: 200, statusText: 'OK' })
    } catch (error) {
        useLog(error)

        return NextResponse.json({ message: 'Erro ao buscar notificações.' }, { status: 500, statusText: 'Internal Server Error' })
    }
}