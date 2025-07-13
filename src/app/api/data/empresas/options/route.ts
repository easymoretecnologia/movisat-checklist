import { Empresa } from "@/entities/empresa.entity"
import useDatabase from "@/hooks/useDatabase"
import useLog from "@/hooks/useLog"
import { FilterProps } from "@/types/filter"
import { NextRequest, NextResponse } from "next/server"

export async function GET (request: NextRequest) {
    const token = request.headers.get('authorization')?.split(' ')[1]
    const querySearch = request.nextUrl.searchParams

    if (!token) {
        return NextResponse.json({ message: 'Usuário não autenticado.' }, { status: 401, statusText: 'Unauthorized' })
    }

    try {
        const db = await useDatabase()
        const repo = db.getRepository(Empresa)

        let query = await repo.createQueryBuilder('empresas')

        if (querySearch.has('search')) {
            query = query.where('(LOWER(empresas.nome_fantasia) LIKE :search OR LOWER(empresas.email) LIKE :search OR LOWER(empresas.cnpj) LIKE :search OR LOWER(empresas.contato_responsavel) LIKE :search)', { search: `%${querySearch.get('search')?.toLowerCase()}%` })
        }

        query = query.orderBy(`empresas.${querySearch.get('by') || 'nome_fantasia'}`, querySearch.get('direction')?.toUpperCase() as 'ASC' | 'DESC')

        const empresas = await query.getMany()

        await db.destroy()

        return NextResponse.json({
            options: empresas.map(empresa => ({
                id: Number(empresa.id),
                nome_fantasia: empresa.nome_fantasia,
                cnpj: empresa.cnpj,
            })),
        }, { status: 200, statusText: 'OK' })
    } catch (error) {
        useLog(error)

        return NextResponse.json({ message: 'Erro ao buscar empresas.' }, { status: 500, statusText: 'Internal Server Error' })
    }
}