import { Veiculo } from "@/entities/veiculo.entity"
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
        const repo = db.getRepository(Veiculo)

        let query = await repo.createQueryBuilder('veiculos')

        if (querySearch.has('search')) {
            query = query.where('(LOWER(veiculos.cor) LIKE :search OR LOWER(veiculos.modelo) LIKE :search OR LOWER(veiculos.placa) LIKE :search OR LOWER(veiculos.apelido) LIKE :search)', { search: `%${querySearch.get('search')?.toLowerCase()}%` })
        }

        query = query.orderBy(`veiculos.${querySearch.get('by') || 'id'}`, querySearch.get('direction')?.toUpperCase() as 'ASC' | 'DESC')

        const [veiculos, total] = await query.skip((Number(querySearch.get('page') || 1) - 1) * Number(querySearch.get('limit') || 20)).take(Number(querySearch.get('limit') || 20)).getManyAndCount()

        await db.destroy()

        return NextResponse.json({
            items: veiculos.map(veiculo => ({
                id: Number(veiculo.id),
                id_empresa: Number(veiculo.id_empresa),
                cor: veiculo.cor,
                modelo: veiculo.modelo,
                placa: veiculo.placa,
                apelido: veiculo.apelido,
                ultimo_checklist: veiculo.ultimo_checklist,
            })),    
            current: Number(querySearch.get('page') || 1),
            last: Math.ceil(total / Number(querySearch.get('limit') || 20)),
            per_page: Number(querySearch.get('limit') || 20),
            total: total,
        }, { status: 200, statusText: 'OK' })
    } catch (error) {
        useLog(error)

        return NextResponse.json({ message: 'Erro ao buscar veículos.' }, { status: 500, statusText: 'Internal Server Error' })
    }
}