import { Empresa } from "@/entities/empresa.entity";
import useDatabase from "@/hooks/useDatabase";
import useLog from "@/hooks/useLog";
import format from "@/utils/format";
import validate from "@/utils/validate";
import { NextRequest, NextResponse } from "next/server";

export async function POST (request: NextRequest) {
    const token = request.headers.get('authorization')?.split(' ')[1]
    const body = await request.json()

    if (!token) {
        return NextResponse.json({ message: 'Usuário não autenticado.' }, { status: 401, statusText: 'Unauthorized' })
    }

    const { nome_fantasia, email, cnpj, contato_responsavel } = body

    let errors: string[] = []

    if (!nome_fantasia) {
        errors.push('Nome Fantasia é obrigatório.')
    }

    if (!email) {
        errors.push('Email é obrigatório.')
    }

    if (!cnpj) {
        errors.push('CNPJ é obrigatório.')
    } else if (validate.isCNPJ(cnpj)) {
        errors.push(validate.isCNPJ(cnpj) ?? '')
    }

    if (!contato_responsavel) {
        errors.push('Contato Responsável é obrigatório.')
    }

    if (errors.length > 0) {
        return NextResponse.json({ errors: errors }, { status: 422, statusText: 'Unprocessable Entity' })
    }

    try {
        const db = await useDatabase()
        const repo = db.getRepository(Empresa)

        const empresa = repo.create({
            nome_fantasia,
            email,
            cnpj: format.onlyNumbers(cnpj),
            contato_responsavel
        })

        await repo.save(empresa)

        await db.destroy()

        return NextResponse.json({ message: 'Empresa cadastrada com sucesso.' }, { status: 200, statusText: 'OK' })
    } catch (error) {
        useLog(error)
        return NextResponse.json({ message: 'Erro ao cadastrar empresa.' }, { status: 500, statusText: 'Internal Server Error' })
    }
}

export async function PUT (request: NextRequest) {
    const token = request.headers.get('authorization')?.split(' ')[1]
    const body = await request.json()

    if (!token) {
        return NextResponse.json({ message: 'Usuário não autenticado.' }, { status: 401, statusText: 'Unauthorized' })
    }

    const { id, nome_fantasia, email, cnpj, contato_responsavel } = body

    let errors: string[] = []

    if (!id) {
        return NextResponse.json({ message: 'ID da empresa é obrigatório.' }, { status: 422, statusText: 'Unprocessable Entity' })
    }

    if (!nome_fantasia) {
        errors.push('Nome Fantasia é obrigatório.')
    }

    if (!email) {
        errors.push('Email é obrigatório.')
    }

    if (!cnpj) {
        errors.push('CNPJ é obrigatório.')
    } else if (validate.isCNPJ(cnpj)) {
        errors.push(validate.isCNPJ(cnpj) ?? '')
    }

    if (!contato_responsavel) {
        errors.push('Contato Responsável é obrigatório.')
    }

    if (errors.length > 0) {
        return NextResponse.json({ errors: errors }, { status: 422, statusText: 'Unprocessable Entity' })
    }

    try {
        const db = await useDatabase()
        const repo = db.getRepository(Empresa)

        const empresa = await repo.findOneBy({ id: id })

        if (!empresa) {
            return NextResponse.json({ message: 'Empresa não encontrada.' }, { status: 404, statusText: 'Not Found' })
        }

        await repo.update({ id: empresa.id }, { nome_fantasia, email, cnpj: format.onlyNumbers(cnpj), contato_responsavel })

        await db.destroy()

        return NextResponse.json({ message: 'Empresa atualizada com sucesso.' }, { status: 200, statusText: 'OK' })
    } catch (error) {
        useLog(error)
        return NextResponse.json({ message: 'Erro ao atualizar empresa.' }, { status: 500, statusText: 'Internal Server Error' })
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
        return NextResponse.json({ message: 'ID da empresa é obrigatório.' }, { status: 422, statusText: 'Unprocessable Entity' })
    }

    try {
        const db = await useDatabase()
        const repo = db.getRepository(Empresa)

        const empresa = await repo.findOneBy({ id: id })

        if (!empresa) {
            return NextResponse.json({ message: 'Empresa não encontrada.' }, { status: 404, statusText: 'Not Found' })
        }

        await repo.delete({ id: empresa.id })

        await db.destroy()

        return NextResponse.json({ message: 'Empresa deletada com sucesso.' }, { status: 200, statusText: 'OK' })
    } catch (error) {
        useLog(error)
        return NextResponse.json({ message: 'Erro ao deletar empresa.' }, { status: 500, statusText: 'Internal Server Error' })
    }
}