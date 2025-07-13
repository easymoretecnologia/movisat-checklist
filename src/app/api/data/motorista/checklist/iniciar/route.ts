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

    const { id_veiculo, id_usuario, tipo } = body

    if (!id_veiculo) {
        return NextResponse.json({ message: 'ID do veículo é obrigatório.' }, { status: 422, statusText: 'Unprocessable Entity' })
    }

    if (!id_usuario) {
        return NextResponse.json({ message: 'ID do usuário é obrigatório.' }, { status: 422, statusText: 'Unprocessable Entity' })
    }

    if (!tipo) {
        return NextResponse.json({ message: 'Tipo de checklist é obrigatório.' }, { status: 422, statusText: 'Unprocessable Entity' })
    } else if (tipo !== 'diario' && tipo !== 'semanal' && tipo !== 'mensal') {
        return NextResponse.json({ message: 'Tipo de checklist inválido.' }, { status: 422, statusText: 'Unprocessable Entity' })
    }

    try {
        const db = await useDatabase()
        const repoVeiculo = db.getRepository(Veiculo)
        const repoUser = db.getRepository(User)

        const user = await repoUser.findOneBy({ id: id_usuario, remember_token: token })

        if (!user) {
            return NextResponse.json({ message: 'Usuário não autenticado.' }, { status: 401, statusText: 'Unauthorized' })
        }

        const veiculo = await repoVeiculo.findOneBy({ id: Number(id_veiculo), id_empresa: Number(user.id_empresa) })

        if (!veiculo) {
            return NextResponse.json({ message: 'Veículo não encontrado.' }, { status: 404, statusText: 'Not Found' })
        }

        if (veiculo.status && veiculo.status === 'Andamento' && veiculo.id_usuario && Number(veiculo.id_usuario) !== Number(user.id)) {
            return NextResponse.json({ message: 'Veículo já está em andamento.' }, { status: 400, statusText: 'Bad Request' })
        } 

        if (veiculo.status && veiculo.status === 'Andamento' && veiculo.id_usuario && Number(veiculo.id_usuario) === Number(user.id)) {
            return NextResponse.json({ message: 'Veículo já está em andamento.' }, { status: 400, statusText: 'Bad Request' })
        }

        await repoVeiculo.update({ id: id_veiculo}, { status: 'Andamento', id_usuario: user.id, tipo_checklist: tipo })

        await db.destroy()

        return NextResponse.json({ message: 'Checklist iniciado com sucesso.' }, { status: 200, statusText: 'OK' })
    } catch (error) {
        useLog(error)
        return NextResponse.json({ message: 'Erro ao iniciar checklist.' }, { status: 500, statusText: 'Internal Server Error' })
    }
    
    
}