import { Empresa } from "@/entities/empresa.entity";
import User from "@/entities/user.entity";
import { Veiculo } from "@/entities/veiculo.entity";
import useDatabase from "@/hooks/useDatabase";
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
        const repoUser = db.getRepository(User)
        const auth = await repoUser.findOne({ where: { id: Number(auth_id), remember_token: token } })

        if (!auth) {
            return NextResponse.json({ message: 'Usuário não autenticado.' }, { status: 401, statusText: 'Unauthorized' })
        } else if (auth && Number(auth.tipo_acesso) !== 1) {
            return NextResponse.json({ message: 'Usuário não autorizado.' }, { status: 403, statusText: 'Forbidden' })
        } else if (auth && (Number(auth.id_empresa) === 0 || !auth.id_empresa)) {
            return NextResponse.json({ message: 'Usuário não autorizado.' }, { status: 403, statusText: 'Forbidden' })
        }

        const repoEmpresa = db.getRepository(Empresa)
        
        const empresa = await repoEmpresa.findOne({ where: { id: Number(auth.id_empresa) } })

        if (!empresa) {
            return NextResponse.json({ message: 'Empresa não encontrada.' }, { status: 404, statusText: 'Not Found' })
        }
        
        const repoVeiculo = db.getRepository(Veiculo)

        const queryusers = await repoUser.find({ where: { tipo_acesso: 2, id_empresa: Number(auth.id_empresa) } })
        const queryveiculos = await repoVeiculo.find({ where: { id_empresa: Number(auth.id_empresa) } })

        await db.destroy()

        const users = queryusers.map(user => ({
            id: Number(user.id),
            nome: user.nome,
        }))

        const veiculos = queryveiculos.map(veiculo => ({
            id: Number(veiculo.id),
            apelido: veiculo.apelido,
            placa: veiculo.placa,
        }))

        return NextResponse.json({ usuarios: users, veiculos }, { status: 200, statusText: 'OK' })
    } catch (error) {
        return NextResponse.json({ message: 'Erro ao buscar dados.' }, { status: 500, statusText: 'Internal Server Error' })
    }
}