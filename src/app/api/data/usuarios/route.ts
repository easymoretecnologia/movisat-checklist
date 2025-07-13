import { Empresa } from "@/entities/empresa.entity";
import { User } from "@/entities/user.entity";
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

    const { nome, email, cpf, telefone, tipo_acesso, id_empresa, password } = body

    let errors: string[] = []

    if (!tipo_acesso) {
        errors.push('Tipo de acesso é obrigatório.')
    } else if (tipo_acesso !== 1 && tipo_acesso !== 2 && tipo_acesso !== 0) {
        errors.push('Tipo de acesso inválido.')
    }

    if (!nome) {
        errors.push('Nome é obrigatório.')
    }

    if (!email) {
        errors.push('Email é obrigatório.')
    } else {
        try {
            const db = await useDatabase()
            const repo = db.getRepository(User)
            const usuario = await repo.findOneBy({ email: email })
            await db.destroy()

            if (usuario) {
                errors.push('Email já cadastrado.')
            }
        } catch (error) {
            useLog(error)
            errors.push('Erro ao buscar usuário.')
        }
    }

    if (!cpf) {
        errors.push('CPF é obrigatório.')
    } else if (validate.isCPF(cpf)) {
        errors.push(validate.isCPF(cpf) ?? '')
    }

    if (!telefone) {
        errors.push('Telefone é obrigatório.')
    }

    if (tipo_acesso !== 0 && !id_empresa) {
        errors.push('Empresa é obrigatória.')
    } else if (tipo_acesso !== 0 && id_empresa !== 0) {
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
    
    if (!password) {
        errors.push('Senha é obrigatória.')
    }

    if (errors.length > 0) {
        return NextResponse.json({ errors: errors }, { status: 422, statusText: 'Unprocessable Entity' })
    }

    try {
        const db = await useDatabase()
        const repo = db.getRepository(User)

        const hashedPassword = await Hash.make(password)

        const usuario = repo.create({
            nome,
            email,
            cpf: format.onlyNumbers(cpf),
            telefone,
            tipo_acesso,
            id_empresa,
            password: hashedPassword
        })

        await repo.save(usuario)

        return NextResponse.json({ message: 'Usuário cadastrado com sucesso.' }, { status: 200, statusText: 'OK' })
    } catch (error) {
        useLog(error)
        return NextResponse.json({ message: 'Erro ao cadastrar usuário.' }, { status: 500, statusText: 'Internal Server Error' })
    }
}

export async function PUT (request: NextRequest) {
    const token = request.headers.get('authorization')?.split(' ')[1]
    const body = await request.json()

    if (!token) {
        return NextResponse.json({ message: 'Usuário não autenticado.' }, { status: 401, statusText: 'Unauthorized' })
    }

    const { id, nome, email, cpf, telefone, tipo_acesso, id_empresa, password } = body

    let errors: string[] = []

    if (!tipo_acesso) {
        errors.push('Tipo de acesso é obrigatório.')
    } else if (tipo_acesso !== 1 && tipo_acesso !== 2 && tipo_acesso !== 0) {
        errors.push('Tipo de acesso inválido.')
    }

    if (!id) {
        return NextResponse.json({ message: 'ID do usuário é obrigatório.' }, { status: 422, statusText: 'Unprocessable Entity' })
    }

    if (!nome) {
        errors.push('Nome é obrigatório.')
    }

    if (!email) {
        errors.push('Email é obrigatório.')
    } else {
        try {
            const db = await useDatabase()
            const repo = db.getRepository(User)
            const usuario = await repo.findOneBy({ email: email, id: Not(id) })
            await db.destroy()

            if (usuario) {
                errors.push('Email já cadastrado.')
            }
        } catch (error) {
            useLog(error)
            errors.push('Erro ao buscar usuário.')
        }
    }

    if (!cpf) {
        errors.push('CPF é obrigatório.')
    } else if (validate.isCPF(cpf)) {
        errors.push(validate.isCPF(cpf) ?? '')
    }

    if (!telefone) {
        errors.push('Telefone é obrigatório.')
    }

    if (tipo_acesso !== 0 && !id_empresa) {
        errors.push('Empresa é obrigatória.')
    } else if (tipo_acesso !== 0 && id_empresa !== 0) {
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
        const repo = db.getRepository(User)

        const usuario = await repo.findOneBy({ id: id })

        if (!usuario) {
            return NextResponse.json({ message: 'Usuário não encontrado.' }, { status: 404, statusText: 'Not Found' })
        }

        if (password) {
            const hashedPassword = await Hash.make(password)

            await repo.update({ id: usuario.id }, { nome, email, cpf: format.onlyNumbers(cpf), telefone, tipo_acesso, id_empresa, password: hashedPassword })
        } else {
            await repo.update({ id: usuario.id }, { nome, email, cpf: format.onlyNumbers(cpf), telefone, tipo_acesso, id_empresa })
        }

        await db.destroy()

        return NextResponse.json({ message: 'Usuário atualizado com sucesso.' }, { status: 200, statusText: 'OK' })
    } catch (error) {
        useLog(error)
        return NextResponse.json({ message: 'Erro ao atualizar usuário.' }, { status: 500, statusText: 'Internal Server Error' })
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
        return NextResponse.json({ message: 'ID do usuário é obrigatório.' }, { status: 422, statusText: 'Unprocessable Entity' })
    }

    try {
        const db = await useDatabase()
        const repo = db.getRepository(User)

        const usuario = await repo.findOneBy({ id: id })

        if (!usuario) {
            return NextResponse.json({ message: 'Usuário não encontrado.' }, { status: 404, statusText: 'Not Found' })
        }

        await repo.delete({ id: usuario.id })

        return NextResponse.json({ message: 'Usuário deletado com sucesso.' }, { status: 200, statusText: 'OK' })
    } catch (error) {
        useLog(error)
        return NextResponse.json({ message: 'Erro ao deletar usuário.' }, { status: 500, statusText: 'Internal Server Error' })
    }
}