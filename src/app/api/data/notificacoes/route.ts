import { Notificacao, NotificacaoLida } from "@/entities/notificacao.entity";
import User from "@/entities/user.entity";
import useDatabase from "@/hooks/useDatabase";
import useLog from "@/hooks/useLog";
import { NextRequest, NextResponse } from "next/server";

export async function POST (request: NextRequest) {
    const token = request.headers.get('authorization')?.split(' ')[1]
    const body = await request.json()

    if (!token) {
        return NextResponse.json({ message: 'Usuário não autenticado.' }, { status: 401, statusText: 'Unauthorized' })
    }

    const { descricao, data, id_usuario } = body

    let errors: string[] = []

    if (!descricao) {
        errors.push('Descrição é obrigatória.')
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
        const repo = db.getRepository(Notificacao)
        const repoUser = db.getRepository(User)

        const user = await repoUser.findOneBy({ id: id_usuario })

        if (!user) {
            return NextResponse.json({ message: 'Usuário não encontrado.' }, { status: 404, statusText: 'Not Found' })
        }

        const notificacao = repo.create({
            descricao,
            data,
            usuario_id: user.id
        })

        await repo.save(notificacao)

        await db.destroy()

        return NextResponse.json({ message: 'Notificação cadastrada com sucesso.' }, { status: 200, statusText: 'OK' })
    } catch (error) {
        useLog(error)
        return NextResponse.json({ message: 'Erro ao cadastrar notificação.' }, { status: 500, statusText: 'Internal Server Error' })
    }
}

export async function PUT (request: NextRequest) {
    const token = request.headers.get('authorization')?.split(' ')[1]
    const body = await request.json()

    if (!token) {
        return NextResponse.json({ message: 'Usuário não autenticado.' }, { status: 401, statusText: 'Unauthorized' })
    }

    const { id, descricao, data, id_usuario } = body

    let errors: string[] = []

    if (!id) {
        return NextResponse.json({ message: 'ID do lembrete é obrigatório.' }, { status: 422, statusText: 'Unprocessable Entity' })
    }

    if (!descricao) {
        errors.push('Descrição é obrigatória.')
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
        const repo = db.getRepository(Notificacao)
        const repoUser = db.getRepository(User)

        const user = await repoUser.findOneBy({ id: id_usuario })

        if (!user) {
            return NextResponse.json({ message: 'Usuário não encontrado.' }, { status: 404, statusText: 'Not Found' })
        }

        const notificacao = await repo.findOneBy({ id: id })
        if (!notificacao) {
            return NextResponse.json({ message: 'Notificação não encontrada.' }, { status: 404, statusText: 'Not Found' })
        }

        await repo.update({ id: notificacao.id }, { descricao, data, usuario_id: user.id })

        await db.destroy()

        return NextResponse.json({ message: 'Notificação atualizada com sucesso.' }, { status: 200, statusText: 'OK' })
    } catch (error) {
        useLog(error)
        return NextResponse.json({ message: 'Erro ao atualizar notificação.' }, { status: 500, statusText: 'Internal Server Error' })
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
        return NextResponse.json({ message: 'ID da notificação é obrigatório.' }, { status: 422, statusText: 'Unprocessable Entity' })
    }

    if (!id_usuario) {
        return NextResponse.json({ message: 'ID do usuário é obrigatório.' }, { status: 422, statusText: 'Unprocessable Entity' })
    }

    try {
        const db = await useDatabase()
        const repo = db.getRepository(Notificacao)
        const repoUser = db.getRepository(User)

        const user = await repoUser.findOneBy({ id: id_usuario })

        if (!user) {
            return NextResponse.json({ message: 'Usuário não encontrado.' }, { status: 404, statusText: 'Not Found' })
        }

        const notificacao = await repo.findOneBy({ id: id })
        if (!notificacao) {
            return NextResponse.json({ message: 'Notificação não encontrada.' }, { status: 404, statusText: 'Not Found' })
        }

        await repo.delete({ id: notificacao.id, usuario_id: user.id })

        await db.destroy()

        return NextResponse.json({ message: 'Notificação deletada com sucesso.' }, { status: 200, statusText: 'OK' })
    } catch (error) {
        useLog(error)
        return NextResponse.json({ message: 'Erro ao deletar notificação.' }, { status: 500, statusText: 'Internal Server Error' })
    }
}

export async function PATCH (request: NextRequest) {
    const token = request.headers.get('authorization')?.split(' ')[1]
    const body = await request.json()

    if (!token) {
        return NextResponse.json({ message: 'Usuário não autenticado.' }, { status: 401, statusText: 'Unauthorized' })
    }

    const { id, id_usuario } = body

    if (!id) {
        return NextResponse.json({ message: 'ID da notificação é obrigatório.' }, { status: 422, statusText: 'Unprocessable Entity' })
    }

    if (!id_usuario) {
        return NextResponse.json({ message: 'ID do usuário é obrigatório.' }, { status: 422, statusText: 'Unprocessable Entity' })
    }

    try {
        const db = await useDatabase()
        const repo = db.getRepository(Notificacao)
        const repoLida = db.getRepository(NotificacaoLida)
        const repoUser = db.getRepository(User)

        const user = await repoUser.findOneBy({ id: id_usuario })

        if (!user) {
            return NextResponse.json({ message: 'Usuário não encontrado.' }, { status: 404, statusText: 'Not Found' })
        }

        const notificacao = await repo.findOneBy({ id: id })
        
        if (!notificacao) {
            return NextResponse.json({ message: 'Notificação não encontrada.' }, { status: 404, statusText: 'Not Found' })
        }

        const lida = repoLida.create({
            notificacao_id: notificacao.id,
            usuario_id: user.id
        })

        await repoLida.save(lida)

        return NextResponse.json({ message: 'Notificação lida' }, { status: 200, statusText: 'OK' })
    } catch (error) {
        useLog(error)
        return NextResponse.json({ message: 'Erro ao marcar notificação como lida.' }, { status: 500, statusText: 'Internal Server Error' })
    }
}