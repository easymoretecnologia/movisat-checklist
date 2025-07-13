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
    }

    try {
        const db = await useDatabase()
        const repoUser = db.getRepository(User)
        const repoEmpresa = db.getRepository(Empresa)
        const repoVeiculo = db.getRepository(Veiculo)

        const queryusers = await repoUser.find({ where: { tipo_acesso: 2 } })
        const queryempresas = await repoEmpresa.find({ })
        const queryveiculos = await repoVeiculo.find({ })

        await db.destroy()

        const users = queryusers.map(user => ({
            id: Number(user.id),
            nome: user.nome,
            empresa_id: Number(user.id_empresa),
            empresa: queryempresas.find(empresa => Number(empresa.id) === Number(user.id_empresa))?.nome_fantasia,
        }))

        const empresas = queryempresas.map(empresa => ({
            id: Number(empresa.id),
            nome: empresa.nome_fantasia,
        }))

        const veiculos = queryveiculos.map(veiculo => ({
            id: Number(veiculo.id),
            apelido: veiculo.apelido,
            placa: veiculo.placa,
            modelo: veiculo.modelo,
            cor: veiculo.cor,
            empresa_id: Number(veiculo.id_empresa),
            empresa: queryempresas.find(empresa => Number(empresa.id) === Number(veiculo.id_empresa))?.nome_fantasia,
        }))

        return NextResponse.json({ usuarios: users, empresas, veiculos }, { status: 200, statusText: 'OK' })
    } catch (error) {
        return NextResponse.json({ message: 'Erro ao buscar dados.' }, { status: 500, statusText: 'Internal Server Error' })
    }
}