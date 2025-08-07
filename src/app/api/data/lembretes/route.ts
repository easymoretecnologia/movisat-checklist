import { Lembrete } from "@/entities/lembrete.entity";
import User from "@/entities/user.entity";
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

    const { mensagem, data, id_usuario } = body

    let errors: string[] = []

    if (!mensagem) {
        errors.push('Mensagem é obrigatória.')
    }

    if (!data) {
        errors.push('Data é obrigatória.')
    }

    if (!id_usuario) {
        errors.push('ID do usuário é obrigatório.')
    }

    if (errors.length > 0) {
        return NextResponse.json({ errors: errors }, { status: 422, statusText: 'Unprocessable Entity' })
    }

    try {
        const db = await useDatabase()
        const repo = db.getRepository(Lembrete)
        const repoUser = db.getRepository(User)

        const user = await repoUser.findOneBy({ id: id_usuario })

        if (!user) {
            return NextResponse.json({ message: 'Usuário não encontrado.' }, { status: 404, statusText: 'Not Found' })
        }

        const lembrete = repo.create({
            mensagem,
            data,
            usuario_id: user.id
        })

        await repo.save(lembrete)

        

        return NextResponse.json({ message: 'Lembrete cadastrado com sucesso.' }, { status: 200, statusText: 'OK' })
    } catch (error) {
        useLog(error)
        return NextResponse.json({ message: 'Erro ao cadastrar lembrete.' }, { status: 500, statusText: 'Internal Server Error' })
    }
}

export async function PUT (request: NextRequest) {
    const token = request.headers.get('authorization')?.split(' ')[1]
    const body = await request.json()

    if (!token) {
        return NextResponse.json({ message: 'Usuário não autenticado.' }, { status: 401, statusText: 'Unauthorized' })
    }

    const { id, mensagem, data, id_usuario } = body

    let errors: string[] = []

    if (!id) {
        return NextResponse.json({ message: 'ID do lembrete é obrigatório.' }, { status: 422, statusText: 'Unprocessable Entity' })
    }

    if (!mensagem) {
        errors.push('Mensagem é obrigatória.')
    }

    if (!data) {
        errors.push('Data é obrigatória.')
    }

    if (!id_usuario) {
        errors.push('ID do usuário é obrigatório.')
    }

    if (errors.length > 0) {
        return NextResponse.json({ errors: errors }, { status: 422, statusText: 'Unprocessable Entity' })
    }

    try {
        const db = await useDatabase()
        const repo = db.getRepository(Lembrete)
        const repoUser = db.getRepository(User)

        const user = await repoUser.findOneBy({ id: id_usuario })

        if (!user) {
            return NextResponse.json({ message: 'Usuário não encontrado.' }, { status: 404, statusText: 'Not Found' })
        }

        const lembrete = await repo.findOneBy({ id: id })
        if (!lembrete) {
            return NextResponse.json({ message: 'Lembrete não encontrado.' }, { status: 404, statusText: 'Not Found' })
        }

        await repo.update({ id: lembrete.id }, { mensagem, data, usuario_id: user.id })

        

        return NextResponse.json({ message: 'Lembrete atualizado com sucesso.' }, { status: 200, statusText: 'OK' })
    } catch (error) {
        useLog(error)
        return NextResponse.json({ message: 'Erro ao atualizar lembrete.' }, { status: 500, statusText: 'Internal Server Error' })
    }
}

export async function DELETE (request: NextRequest) {
    const token = request.headers.get('authorization')?.split(' ')[1]
    const body = await request.json()

    if (!token) {
        return NextResponse.json({ message: 'Usuário não autenticado.' }, { status: 401, statusText: 'Unauthorized' })
    }

    const { id, id_usuario } = body

    if (!id) {
        return NextResponse.json({ message: 'ID do lembrete é obrigatório.' }, { status: 422, statusText: 'Unprocessable Entity' })
    }

    if (!id_usuario) {
        return NextResponse.json({ message: 'ID do usuário é obrigatório.' }, { status: 422, statusText: 'Unprocessable Entity' })
    }

    try {
        const db = await useDatabase()
        const repo = db.getRepository(Lembrete)
        const repoUser = db.getRepository(User)

        const user = await repoUser.findOneBy({ id: id_usuario })

        if (!user) {
            return NextResponse.json({ message: 'Usuário não encontrado.' }, { status: 404, statusText: 'Not Found' })
        }

        const lembrete = await repo.findOneBy({ id: id })
        if (!lembrete) {
            return NextResponse.json({ message: 'Lembrete não encontrado.' }, { status: 404, statusText: 'Not Found' })
        }

        await repo.delete({ id: lembrete.id, usuario_id: user.id })

        

        return NextResponse.json({ message: 'Lembrete deletado com sucesso.' }, { status: 200, statusText: 'OK' })
    } catch (error) {
        useLog(error)
        return NextResponse.json({ message: 'Erro ao deletar lembrete.' }, { status: 500, statusText: 'Internal Server Error' })
    }
}