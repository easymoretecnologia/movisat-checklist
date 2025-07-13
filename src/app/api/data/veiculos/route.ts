import { Empresa } from "@/entities/empresa.entity";
import { Veiculo } from "@/entities/veiculo.entity";
import useDatabase from "@/hooks/useDatabase";
import useLog from "@/hooks/useLog";
import format from "@/utils/format";
import Hash from "@/utils/hash";
import validate from "@/utils/validate";
import { NextRequest, NextResponse } from "next/server";
import { Not } from "typeorm";

export async function POST (request: NextRequest) {
    const token = request.headers.get('authorization')?.split(' ')[1]
    const body = await request.json()

    if (!token) {
        return NextResponse.json({ message: 'Usuário não autenticado.' }, { status: 401, statusText: 'Unauthorized' })
    }

    const { cor, modelo, placa, apelido, id_empresa } = body

    let errors: string[] = []

    if (!cor) {
        errors.push('Cor é obrigatória.')
    }

    if (!modelo) {
        errors.push('Modelo é obrigatório.')
    }

    if (!placa) {
        errors.push('Placa é obrigatória.')
    }

    if (!apelido) {
        errors.push('Apelido é obrigatório.')
    }

    if (!id_empresa) {
        errors.push('Empresa é obrigatória.')
    } else if (id_empresa !== 0) {
        try {
            const db = await useDatabase()

            const empresa = await db.getRepository(Empresa).findOneBy({ id: id_empresa })

            await db.destroy()

            if (!empresa) {
                errors.push('Empresa não encontrada.')
            }
        } catch (error) {
            useLog(error)
            errors.push('Erro ao buscar empresa.')
        }
    }

    if (errors.length > 0) {
        return NextResponse.json({ errors: errors }, { status: 422, statusText: 'Unprocessable Entity' })
    }

    try {
        const db = await useDatabase()
        const repo = db.getRepository(Veiculo)

        const veiculo = repo.create({
            cor,
            modelo,
            placa,
            apelido,
            id_empresa,
        })

        await repo.save(veiculo)

        return NextResponse.json({ message: 'Veículo cadastrado com sucesso.' }, { status: 200, statusText: 'OK' })
    } catch (error) {
        useLog(error)
        return NextResponse.json({ message: 'Erro ao cadastrar veículo.' }, { status: 500, statusText: 'Internal Server Error' })
    }
}

export async function PUT (request: NextRequest) {
    const token = request.headers.get('authorization')?.split(' ')[1]
    const body = await request.json()

    if (!token) {
        return NextResponse.json({ message: 'Usuário não autenticado.' }, { status: 401, statusText: 'Unauthorized' })
    }

    const { id, cor, modelo, placa, apelido, id_empresa } = body

    let errors: string[] = []

    if (!id) {
        return NextResponse.json({ message: 'ID do veículo é obrigatório.' }, { status: 422, statusText: 'Unprocessable Entity' })
    }

    if (!cor) {
        errors.push('Cor é obrigatória.')
    }

    if (!modelo) {
        errors.push('Modelo é obrigatório.')
    }

    if (!placa) {
        errors.push('Placa é obrigatória.')
    }

    if (!apelido) {
        errors.push('Apelido é obrigatório.')
    }

    if (!id_empresa) {
        errors.push('Empresa é obrigatória.')
    } else if (id_empresa !== 0) {
        try {
            const db = await useDatabase()

            const empresa = await db.getRepository(Empresa).findOneBy({ id: id_empresa })

            await db.destroy()

            if (!empresa) {
                errors.push('Empresa não encontrada.')
            }
        } catch (error) {
            useLog(error)
            errors.push('Erro ao buscar empresa.')
        }
    }

    if (errors.length > 0) {
        return NextResponse.json({ errors: errors }, { status: 422, statusText: 'Unprocessable Entity' })
    }

    try {
        const db = await useDatabase()
        const repo = db.getRepository(Veiculo)

        const veiculo = await repo.findOneBy({ id: id })

        if (!veiculo) {
            return NextResponse.json({ message: 'Veículo não encontrado.' }, { status: 404, statusText: 'Not Found' })
        }

        await repo.update({ id: veiculo.id }, { cor, modelo, placa, apelido, id_empresa })

        await db.destroy()

        return NextResponse.json({ message: 'Veículo atualizado com sucesso.' }, { status: 200, statusText: 'OK' })
    } catch (error) {
        useLog(error)
        return NextResponse.json({ message: 'Erro ao atualizar veículo.' }, { status: 500, statusText: 'Internal Server Error' })
    }
}

export async function DELETE (request: NextRequest) {
    const token = request.headers.get('authorization')?.split(' ')[1]
    const body = await request.json()

    if (!token) {
        return NextResponse.json({ message: 'Usuário não autenticado.' }, { status: 401, statusText: 'Unauthorized' })
    }

    const { id } = body

    if (!id) {
        return NextResponse.json({ message: 'ID do veículo é obrigatório.' }, { status: 422, statusText: 'Unprocessable Entity' })
    }

    try {
        const db = await useDatabase()
        const repo = db.getRepository(Veiculo)

        const veiculo = await repo.findOneBy({ id: id })

        if (!veiculo) {
            return NextResponse.json({ message: 'Veículo não encontrado.' }, { status: 404, statusText: 'Not Found' })
        }

        await repo.delete({ id: veiculo.id })

        return NextResponse.json({ message: 'Veículo deletado com sucesso.' }, { status: 200, statusText: 'OK' })
    } catch (error) {
        useLog(error)
        return NextResponse.json({ message: 'Erro ao deletar veículo.' }, { status: 500, statusText: 'Internal Server Error' })
    }
}