import User from "@/entities/user.entity";
import { Veiculo } from "@/entities/veiculo.entity";
import useDatabase from "@/hooks/useDatabase";
import useLog from "@/hooks/useLog";
import { NextRequest, NextResponse } from "next/server";

export async function POST (request: NextRequest) {
    const token = request.headers.get('authorization')?.split(' ')[1]
    const body = await request.json()

    if (!token) {
        return NextResponse.json({ message: 'Usuário não autenticado.' }, { status: 401, statusText: 'Unauthorized' })
    }

    const { id_veiculo, id_usuario } = body

    if (!id_veiculo) {
        return NextResponse.json({ message: 'ID do veículo é obrigatório.' }, { status: 422, statusText: 'Unprocessable Entity' })
    }

    if (!id_usuario) {
        return NextResponse.json({ message: 'ID do usuário é obrigatório.' }, { status: 422, statusText: 'Unprocessable Entity' })
    }

    try {
        const db = await useDatabase()
        const repoVeiculo = db.getRepository(Veiculo)
        const repoUser = db.getRepository(User)

        const user = await repoUser.findOneBy({ id: id_usuario, remember_token: token })

        if (!user) {
            return NextResponse.json({ message: 'Usuário não autenticado.' }, { status: 401, statusText: 'Unauthorized' })
        }

        const veiculo = await repoVeiculo.findOneBy({ id: id_veiculo, id_usuario: user.id })

        if (!veiculo) {
            return NextResponse.json({ message: 'Veículo não encontrado.' }, { status: 404, statusText: 'Not Found' })
        }

        if (!veiculo.status || (veiculo.status && veiculo.status !== 'Andamento')) {
            return NextResponse.json({ message: 'Veículo não está em andamento.' }, { status: 400, statusText: 'Bad Request' })
        } else if (veiculo.status && veiculo.status === 'Andamento') {
            if (veiculo.id_usuario && Number(veiculo.id_usuario) !== Number(user.id)) {
                return NextResponse.json({ message: 'Veículo não está em andamento.' }, { status: 400, statusText: 'Bad Request' })
            }
        }

        await repoVeiculo.update({ id: id_veiculo}, { status: null, id_usuario: null, tipo_checklist: null })

        await db.destroy()

        return NextResponse.json({ message: 'Checklist cancelado com sucesso.' }, { status: 200, statusText: 'OK' })
    } catch (error) {
        useLog(error)
        return NextResponse.json({ message: 'Erro ao cancelar checklist.' }, { status: 500, statusText: 'Internal Server Error' })
    }
    
    
}