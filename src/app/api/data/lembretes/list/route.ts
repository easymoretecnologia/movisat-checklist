import { Empresa } from "@/entities/empresa.entity"
import { Lembrete } from "@/entities/lembrete.entity"
import User from "@/entities/user.entity"
import useDatabase from "@/hooks/useDatabase"
import useLog from "@/hooks/useLog"
import { FilterProps } from "@/types/filter"
import { DateTime } from "luxon"
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
            return NextResponse.json({ message: 'Usuário não autenticado.' }, { status: 401, statusText: 'Unauthorized' })
        }
        
        const repo = db.getRepository(Lembrete)

        let query = await repo.createQueryBuilder('lembretes')

        query = query.where('lembretes.usuario_id = :usuario_id', { usuario_id: dbUser.id })
        query = query.andWhere('lembretes.data >= :data', { data: DateTime.now().toFormat('yyyy-MM-dd') })

        query = query.orderBy(`lembretes.data`, 'ASC')

        const lembretes = await query.getMany()

        
        return NextResponse.json({
            lembretes: lembretes.map(lembrete => ({
                id: Number(lembrete.id),
                mensagem: lembrete.mensagem,
                data: lembrete.data
            })),    
        }, { status: 200, statusText: 'OK' })
    } catch (error) {
        useLog(error)

        return NextResponse.json({ message: 'Erro ao buscar lembretes.' }, { status: 500, statusText: 'Internal Server Error' })
    }
}