import { ChecklistDiario, ChecklistMensal, ChecklistSemanal } from "@/entities/checklist.entity";
import User from "@/entities/user.entity";
import { Veiculo } from "@/entities/veiculo.entity";
import useDatabase from "@/hooks/useDatabase";
import useLog from "@/hooks/useLog";
import { NextRequest, NextResponse } from "next/server";

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
        const userRepository = db.getRepository(User)
        const auth = await userRepository.findOne({ where: { id: Number(auth_id), remember_token: token } })

        if (!auth) {
            return NextResponse.json({ message: 'Usuário não autenticado.' }, { status: 401, statusText: 'Unauthorized' })
        } else if (auth && Number(auth.tipo_acesso) !== 1) {
            return NextResponse.json({ message: 'Usuário não autorizado.' }, { status: 403, statusText: 'Forbidden' })
        } else if (auth && (Number(auth.id_empresa) === 0 || !auth.id_empresa)) {
            return NextResponse.json({ message: 'Usuário não autorizado.' }, { status: 403, statusText: 'Forbidden' })
        }
        
        const repoVeiculos = db.getRepository(Veiculo)

        const veiculos = await repoVeiculos.find({ where: { id_empresa: Number(auth.id_empresa) } })
        const repoDiarios = db.getRepository(ChecklistDiario)
        const repoMensais = db.getRepository(ChecklistMensal)
        const repoSemanais = db.getRepository(ChecklistSemanal)
    } catch (error) {
        useLog(error)
        return NextResponse.json({ message: 'Erro ao buscar conformidades.' }, { status: 500, statusText: 'Internal Server Error' })
    }
}