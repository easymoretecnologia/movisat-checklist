import { ChecklistDiario, ChecklistMensal, ChecklistSemanal } from "@/entities/checklist.entity"
import { Empresa } from "@/entities/empresa.entity"
import { User } from "@/entities/user.entity"
import { Veiculo } from "@/entities/veiculo.entity"
import useDatabase from "@/hooks/useDatabase"
import useLog from "@/hooks/useLog"
import { DateTime } from "luxon"
import { NextRequest, NextResponse } from "next/server"

export async function GET (request: NextRequest) {
    const token = request.headers.get('authorization')?.split(' ')[1]
    const querySearch = request.nextUrl.searchParams

    if (!token) {
        return NextResponse.json({ message: 'Usuário não autenticado.' }, { status: 401, statusText: 'Unauthorized' })
    }

    try {
        const db = await useDatabase()
        const repoDiario = db.getRepository(ChecklistDiario)
        const repoMensal = db.getRepository(ChecklistMensal)
        const repoSemanal = db.getRepository(ChecklistSemanal)
        const repoUser = db.getRepository(User)
        const repoVeiculo = db.getRepository(Veiculo)
        const repoEmpresa = db.getRepository(Empresa)

        const type: 'diario' | 'mensal' | 'semanal' = querySearch.has('tipo') ? querySearch.get('tipo') as 'diario' | 'mensal' | 'semanal' : 'diario'
        const empresa_id = querySearch.has('empresa_id') ? Number(querySearch.get('empresa_id') ?? 0) : 0
        const usuario_id = querySearch.has('usuario_id') ? Number(querySearch.get('usuario_id') ?? 0) : 0
        const veiculo_id = querySearch.has('veiculo_id') ? Number(querySearch.get('veiculo_id') ?? 0) : 0
        const inicio = querySearch.has('inicio') ? querySearch.get('inicio') as string : ''
        const fim = querySearch.has('fim') ? querySearch.get('fim') as string : ''

        if (type === 'diario') {
            let queryDiario = repoDiario.createQueryBuilder('checklist_diario')

            if (empresa_id > 0) {
                queryDiario = queryDiario.where('checklist_diario.id_empresa = :empresa_id', { empresa_id })
            }

            if (usuario_id > 0) {
                queryDiario = queryDiario.where('checklist_diario.id_usuario = :usuario_id', { usuario_id })
            }

            if (veiculo_id > 0) {
                queryDiario = queryDiario.where('checklist_diario.id_veiculo = :veiculo_id', { veiculo_id })
            }

            if (inicio || fim) {
                const start = DateTime.fromSQL(inicio)
                const end = DateTime.fromSQL(fim)

                if (start.isValid && end.isValid) {
                    queryDiario = queryDiario.andWhere('DATE(checklist_diario.created_at) BETWEEN :start AND :end', { start: start.toFormat('yyyy-MM-dd'), end: end.toFormat('yyyy-MM-dd') })
                } else if (start.isValid && !end.isValid) {
                    queryDiario = queryDiario.andWhere('DATE(checklist_diario.created_at) >= :start', { start: start.toFormat('yyyy-MM-dd') })
                } else if (!start.isValid && end.isValid) {
                    queryDiario = queryDiario.andWhere('DATE(checklist_diario.created_at) <= :end', { end: end.toFormat('yyyy-MM-dd') })
                }
            }

            queryDiario = queryDiario.orderBy('checklist_diario.created_at', 'DESC')

            const [checklists, total] = await queryDiario.skip((Number(querySearch.get('page') || 1) - 1) * Number(querySearch.get('limit') || 20)).take(Number(querySearch.get('limit') || 20)).getManyAndCount()

            let items = []

            for (const checklist of checklists) {
                const user = await repoUser.findOne({ where: { id: checklist.id_usuario } })
                const veiculo = await repoVeiculo.findOne({ where: { id: checklist.id_veiculo } })
                const empresa = await repoEmpresa.findOne({ where: { id: checklist.id_empresa } })

                items.push({
                    ...checklist,
                    tipo: 'diario',
                    id: Number(checklist.id),
                    id_empresa: Number(checklist.id_empresa),
                    id_usuario: Number(checklist.id_usuario),
                    id_veiculo: Number(checklist.id_veiculo),
                    usuario: user ? {
                        id: Number(user.id),
                        nome: user.nome,
                    } : {
                        id: 0,
                        nome: 'Não encontrado',
                    },
                    veiculo: veiculo ? {
                        id: Number(veiculo.id),
                        apelido: veiculo.apelido,
                        placa: veiculo.placa,
                        modelo: veiculo.modelo,
                        cor: veiculo.cor,
                    } : {
                        id: 0,
                        apelido: 'Não encontrado',
                        placa: 'Não encontrado',
                        modelo: 'Não encontrado',
                        cor: 'Não encontrado',
                    },
                    empresa: empresa ? {
                        id: Number(empresa.id),
                        nome: empresa.nome_fantasia,
                    } : {
                        id: 0,
                        nome: 'Não encontrado',
                    },
                    created_at: checklist.created_at,
                    updated_at: checklist.updated_at,
                })
            }

            await db.destroy()

            return NextResponse.json({
                items: items,
                current: Number(querySearch.get('page') || 1),
                last: Math.ceil(total / Number(querySearch.get('limit') || 20)),
                per_page: Number(querySearch.get('limit') || 20),
                total: total,
            }, { status: 200, statusText: 'OK' })
        } else if (type === 'mensal') {
            let queryMensal = repoMensal.createQueryBuilder('checklist_mensal')

            if (empresa_id > 0) {
                queryMensal = queryMensal.where('checklist_mensal.id_empresa = :empresa_id', { empresa_id })
            }

            if (usuario_id > 0) {
                queryMensal = queryMensal.where('checklist_mensal.id_usuario = :usuario_id', { usuario_id })
            }

            if (veiculo_id > 0) {
                queryMensal = queryMensal.where('checklist_mensal.id_veiculo = :veiculo_id', { veiculo_id })
            }

            if (inicio || fim) {
                const start = DateTime.fromSQL(inicio)
                const end = DateTime.fromSQL(fim)

                if (start.isValid && end.isValid) {
                    queryMensal = queryMensal.andWhere('DATE(checklist_mensal.created_at) BETWEEN :start AND :end', { start: start.toFormat('yyyy-MM-dd'), end: end.toFormat('yyyy-MM-dd') })
                } else if (start.isValid && !end.isValid) {
                    queryMensal = queryMensal.andWhere('DATE(checklist_mensal.created_at) >= :start', { start: start.toFormat('yyyy-MM-dd') })
                } else if (!start.isValid && end.isValid) {
                    queryMensal = queryMensal.andWhere('DATE(checklist_mensal.created_at) <= :end', { end: end.toFormat('yyyy-MM-dd') })
                }
            }

            queryMensal = queryMensal.orderBy('checklist_mensal.created_at', 'DESC')

            const [checklists, total] = await queryMensal.skip((Number(querySearch.get('page') || 1) - 1) * Number(querySearch.get('limit') || 20)).take(Number(querySearch.get('limit') || 20)).getManyAndCount()

            let items = []

            for (const checklist of checklists) {
                const user = await repoUser.findOne({ where: { id: checklist.id_usuario } })
                const veiculo = await repoVeiculo.findOne({ where: { id: checklist.id_veiculo } })
                const empresa = await repoEmpresa.findOne({ where: { id: checklist.id_empresa } })

                items.push({
                    ...checklist,
                    tipo: 'mensal',
                    id: Number(checklist.id),
                    id_empresa: Number(checklist.id_empresa),
                    id_usuario: Number(checklist.id_usuario),
                    id_veiculo: Number(checklist.id_veiculo),
                    usuario: user ? {
                        id: Number(user.id),
                        nome: user.nome,
                    } : {
                        id: 0,
                        nome: 'Não encontrado',
                    },
                    veiculo: veiculo ? {
                        id: Number(veiculo.id),
                        apelido: veiculo.apelido,
                        placa: veiculo.placa,
                        modelo: veiculo.modelo,
                        cor: veiculo.cor,
                    } : {
                        id: 0,
                        apelido: 'Não encontrado',
                        placa: 'Não encontrado',
                        modelo: 'Não encontrado',
                        cor: 'Não encontrado',
                    },
                    empresa: empresa ? {
                        id: Number(empresa.id),
                        nome: empresa.nome_fantasia,
                    } : {
                        id: 0,
                        nome: 'Não encontrado',
                    },
                    created_at: checklist.created_at,
                    updated_at: checklist.updated_at,
                })
            }

            await db.destroy()

            return NextResponse.json({
                items: items,
                current: Number(querySearch.get('page') || 1),
                last: Math.ceil(total / Number(querySearch.get('limit') || 20)),
                per_page: Number(querySearch.get('limit') || 20),
                total: total,
            }, { status: 200, statusText: 'OK' })
        } else if (type === 'semanal') {
            let querySemanal = repoSemanal.createQueryBuilder('checklist_semanal')

            if (empresa_id > 0) {
                querySemanal = querySemanal.where('checklist_semanal.id_empresa = :empresa_id', { empresa_id })
            }

            if (usuario_id > 0) {
                querySemanal = querySemanal.where('checklist_semanal.id_usuario = :usuario_id', { usuario_id })
            }

            if (veiculo_id > 0) {
                querySemanal = querySemanal.where('checklist_semanal.id_veiculo = :veiculo_id', { veiculo_id })
            }

            if (inicio || fim) {
                const start = DateTime.fromSQL(inicio)
                const end = DateTime.fromSQL(fim)

                if (start.isValid && end.isValid) {
                    querySemanal = querySemanal.andWhere('DATE(checklist_semanal.created_at) BETWEEN :start AND :end', { start: start.toFormat('yyyy-MM-dd'), end: end.toFormat('yyyy-MM-dd') })
                } else if (start.isValid && !end.isValid) {
                    querySemanal = querySemanal.andWhere('DATE(checklist_semanal.created_at) >= :start', { start: start.toFormat('yyyy-MM-dd') })
                } else if (!start.isValid && end.isValid) {
                    querySemanal = querySemanal.andWhere('DATE(checklist_semanal.created_at) <= :end', { end: end.toFormat('yyyy-MM-dd') })
                }
            }

            querySemanal = querySemanal.orderBy('checklist_semanal.created_at', 'DESC')

            const [checklists, total] = await querySemanal.skip((Number(querySearch.get('page') || 1) - 1) * Number(querySearch.get('limit') || 20)).take(Number(querySearch.get('limit') || 20)).getManyAndCount()

            let items = []

            for (const checklist of checklists) {
                const user = await repoUser.findOne({ where: { id: checklist.id_usuario } })
                const veiculo = await repoVeiculo.findOne({ where: { id: checklist.id_veiculo } })
                const empresa = await repoEmpresa.findOne({ where: { id: checklist.id_empresa } })

                items.push({
                    ...checklist,
                    tipo: 'semanal',
                    id: Number(checklist.id),
                    id_empresa: Number(checklist.id_empresa),
                    id_usuario: Number(checklist.id_usuario),
                    id_veiculo: Number(checklist.id_veiculo),
                    usuario: user ? {
                        id: Number(user.id),
                        nome: user.nome,
                    } : {
                        id: 0,
                        nome: 'Não encontrado',
                    },
                    veiculo: veiculo ? {
                        id: Number(veiculo.id),
                        apelido: veiculo.apelido,
                        placa: veiculo.placa,
                        modelo: veiculo.modelo,
                        cor: veiculo.cor,
                    } : {
                        id: 0,
                        apelido: 'Não encontrado',
                        placa: 'Não encontrado',
                        modelo: 'Não encontrado',
                        cor: 'Não encontrado',
                    },
                    empresa: empresa ? {
                        id: Number(empresa.id),
                        nome: empresa.nome_fantasia,
                    } : {
                        id: 0,
                        nome: 'Não encontrado',
                    },
                    created_at: checklist.created_at,
                    updated_at: checklist.updated_at,
                })
            }

            await db.destroy()

            return NextResponse.json({
                items: items,
                current: Number(querySearch.get('page') || 1),
                last: Math.ceil(total / Number(querySearch.get('limit') || 20)),
                per_page: Number(querySearch.get('limit') || 20),
                total: total,
            }, { status: 200, statusText: 'OK' })
        }

        return NextResponse.json({ message: 'Tipo de checklist inválido.' }, { status: 400, statusText: 'Bad Request' })
    } catch (error) {
        useLog(error)

        return NextResponse.json({ message: 'Erro ao buscar usuários.' }, { status: 500, statusText: 'Internal Server Error' })
    }
}