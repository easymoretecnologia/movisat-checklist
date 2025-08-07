import { User } from "@/entities/user.entity"
import useDatabase from "@/hooks/useDatabase"
import useLog from "@/hooks/useLog"
import { NextRequest, NextResponse } from "next/server"

export async function GET (request: NextRequest) {
    const token = request.headers.get('authorization')?.split(' ')[1]
    const querySearch = request.nextUrl.searchParams

    if (!token) {
        return NextResponse.json({ message: 'Usuário não autenticado.' }, { status: 401, statusText: 'Unauthorized' })
    }

    try {
        const db = await useDatabase()
        const repo = db.getRepository(User)

        let query = await repo.createQueryBuilder('usuarios')

        if (querySearch.has('search')) {
            query = query.where('(LOWER(usuarios.nome) LIKE :search OR LOWER(usuarios.email) LIKE :search OR LOWER(usuarios.cpf) LIKE :search OR LOWER(usuarios.telefone) LIKE :search)', { search: `%${querySearch.get('search')?.toLowerCase()}%` })
        }

        query = query.orderBy(`usuarios.${querySearch.get('by') || 'nome'}`, querySearch.get('direction')?.toUpperCase() as 'ASC' | 'DESC')

        const usuarios = await query.getMany()

        

        return NextResponse.json({
            options: usuarios.map(usuario => ({
                id: Number(usuario.id),
                nome: usuario.nome,
                email: usuario.email,
            })),
        }, { status: 200, statusText: 'OK' })
    } catch (error) {
        useLog(error)

        return NextResponse.json({ message: 'Erro ao buscar usuários.' }, { status: 500, statusText: 'Internal Server Error' })
    }
}