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

        const veiculos = await query.getMany()

        await db.destroy()

        return NextResponse.json({
            options: veiculos.map(veiculo => ({
                id: Number(veiculo.id),
                placa: veiculo.placa,
                apelido: veiculo.apelido,
            })),
        }, { status: 200, statusText: 'OK' })
    } catch (error) {
        useLog(error)

        return NextResponse.json({ message: 'Erro ao buscar veículos.' }, { status: 500, statusText: 'Internal Server Error' })
    }
}