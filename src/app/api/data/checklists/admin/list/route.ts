import { ChecklistDiario, ChecklistMensal, ChecklistSemanal } from "@/entities/checklist.entity"
import { Empresa } from "@/entities/empresa.entity"
import { User } from "@/entities/user.entity"
import { Veiculo } from "@/entities/veiculo.entity"
import useDatabase from "@/hooks/useDatabase"
import useLog from "@/hooks/useLog"
import { DateTime } from "luxon"
import { NextRequest, NextResponse } from "next/server"
import { In } from "typeorm"

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

        const type: 'diario' | 'mensal' | 'semanal' = querySearch.has('tipo') ? querySearch.get('tipo') as 'diario' | 'mensal' | 'semanal' : 'diario'
        const empresa_id = querySearch.has('empresa_id') ? Number(querySearch.get('empresa_id') ?? 0) : 0
        const usuario_id = querySearch.has('usuario_id') ? Number(querySearch.get('usuario_id') ?? 0) : 0
        const veiculo_id = querySearch.has('veiculo_id') ? Number(querySearch.get('veiculo_id') ?? 0) : 0
        const inicio = querySearch.has('inicio') ? querySearch.get('inicio') as string : ''
        const fim = querySearch.has('fim') ? querySearch.get('fim') as string : ''
        const page = Number(querySearch.get('page') || 1)
        const limit = Number(querySearch.get('limit') || 20)

        if (type === 'diario') {
            let queryDiario = repoDiario.createQueryBuilder('checklist_diario')

            if (empresa_id > 0) {
                queryDiario = queryDiario.where('checklist_diario.id_empresa = :empresa_id', { empresa_id })
            }

            if (usuario_id > 0) {
                queryDiario = queryDiario.andWhere('checklist_diario.id_usuario = :usuario_id', { usuario_id })
            }

            if (veiculo_id > 0) {
                queryDiario = queryDiario.andWhere('checklist_diario.id_veiculo = :veiculo_id', { veiculo_id })
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
                .addOrderBy('checklist_diario.id', 'DESC')

            const [checklists, total] = await queryDiario
                .skip((page - 1) * limit)
                .take(limit)
                .getManyAndCount()

            // Get unique IDs for bulk queries
            const userIds = [...new Set(checklists.map(c => Number(c.id_usuario)).filter(id => id > 0))]
            const veiculoIds = [...new Set(checklists.map(c => Number(c.id_veiculo)).filter(id => id > 0))]
            const empresaIds = [...new Set(checklists.map(c => Number(c.id_empresa)).filter(id => id > 0))]

            // Bulk fetch related data
            const [users, veiculos, empresas] = await Promise.all([
                userIds.length > 0 ? db.getRepository(User).find({ where: { id: In(userIds) } }) : [],
                veiculoIds.length > 0 ? db.getRepository(Veiculo).find({ where: { id: In(veiculoIds) } }) : [],
                empresaIds.length > 0 ? db.getRepository(Empresa).find({ where: { id: In(empresaIds) } }) : []
            ])

            // Create lookup maps for O(1) access
            const userMap = new Map(users.map(u => [u.id, u]))
            const veiculoMap = new Map(veiculos.map(v => [v.id, v]))
            const empresaMap = new Map(empresas.map(e => [e.id, e]))

            const items = checklists.map(checklist => {
                const user = userMap.get(Number(checklist.id_usuario))
                const veiculo = veiculoMap.get(Number(checklist.id_veiculo))
                const empresa = empresaMap.get(Number(checklist.id_empresa))

                return {
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
                }
            })

            

            return NextResponse.json({
                items: items,
                current: page,
                last: Math.ceil(total / limit),
                per_page: limit,
                total: total,
            }, { status: 200, statusText: 'OK' })
        } else if (type === 'mensal') {
            let queryMensal = repoMensal.createQueryBuilder('checklist_mensal')

            if (empresa_id > 0) {
                queryMensal = queryMensal.where('checklist_mensal.id_empresa = :empresa_id', { empresa_id })
            }

            if (usuario_id > 0) {
                queryMensal = queryMensal.andWhere('checklist_mensal.id_usuario = :usuario_id', { usuario_id })
            }

            if (veiculo_id > 0) {
                queryMensal = queryMensal.andWhere('checklist_mensal.id_veiculo = :veiculo_id', { veiculo_id })
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
                .addOrderBy('checklist_mensal.id', 'DESC')

            const [checklists, total] = await queryMensal
                .skip((page - 1) * limit)
                .take(limit)
                .getManyAndCount()

            // Get unique IDs for bulk queries
            const userIds = [...new Set(checklists.map(c => Number(c.id_usuario)).filter(id => id > 0))]
            const veiculoIds = [...new Set(checklists.map(c => Number(c.id_veiculo)).filter(id => id > 0))]
            const empresaIds = [...new Set(checklists.map(c => Number(c.id_empresa)).filter(id => id > 0))]

            // Bulk fetch related data
            const [users, veiculos, empresas] = await Promise.all([
                userIds.length > 0 ? db.getRepository(User).find({ where: { id: In(userIds) } }) : [],
                veiculoIds.length > 0 ? db.getRepository(Veiculo).find({ where: { id: In(veiculoIds) } }) : [],
                empresaIds.length > 0 ? db.getRepository(Empresa).find({ where: { id: In(empresaIds) } }) : []
            ])

            // Create lookup maps for O(1) access
            const userMap = new Map(users.map(u => [u.id, u]))
            const veiculoMap = new Map(veiculos.map(v => [v.id, v]))
            const empresaMap = new Map(empresas.map(e => [e.id, e]))

            const items = checklists.map(checklist => {
                const user = userMap.get(Number(checklist.id_usuario))
                const veiculo = veiculoMap.get(Number(checklist.id_veiculo))
                const empresa = empresaMap.get(Number(checklist.id_empresa))

                return {
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
                }
            })

            

            return NextResponse.json({
                items: items,
                current: page,
                last: Math.ceil(total / limit),
                per_page: limit,
                total: total,
            }, { status: 200, statusText: 'OK' })
        } else if (type === 'semanal') {
            let querySemanal = repoSemanal.createQueryBuilder('checklist_semanal')

            if (empresa_id > 0) {
                querySemanal = querySemanal.where('checklist_semanal.id_empresa = :empresa_id', { empresa_id })
            }

            if (usuario_id > 0) {
                querySemanal = querySemanal.andWhere('checklist_semanal.id_usuario = :usuario_id', { usuario_id })
            }

            if (veiculo_id > 0) {
                querySemanal = querySemanal.andWhere('checklist_semanal.id_veiculo = :veiculo_id', { veiculo_id })
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
                .addOrderBy('checklist_semanal.id', 'DESC')

            const [checklists, total] = await querySemanal
                .skip((page - 1) * limit)
                .take(limit)
                .getManyAndCount()

            // Get unique IDs for bulk queries
            const userIds = [...new Set(checklists.map(c => Number(c.id_usuario)).filter(id => id > 0))]
            const veiculoIds = [...new Set(checklists.map(c => Number(c.id_veiculo)).filter(id => id > 0))]
            const empresaIds = [...new Set(checklists.map(c => Number(c.id_empresa)).filter(id => id > 0))]

            // Bulk fetch related data
            const [users, veiculos, empresas] = await Promise.all([
                userIds.length > 0 ? db.getRepository(User).find({ where: { id: In(userIds) } }) : [],
                veiculoIds.length > 0 ? db.getRepository(Veiculo).find({ where: { id: In(veiculoIds) } }) : [],
                empresaIds.length > 0 ? db.getRepository(Empresa).find({ where: { id: In(empresaIds) } }) : []
            ])

            // Create lookup maps for O(1) access
            const userMap = new Map(users.map(u => [u.id, u]))
            const veiculoMap = new Map(veiculos.map(v => [v.id, v]))
            const empresaMap = new Map(empresas.map(e => [e.id, e]))

            const items = checklists.map(checklist => {
                const user = userMap.get(Number(checklist.id_usuario))
                const veiculo = veiculoMap.get(Number(checklist.id_veiculo))
                const empresa = empresaMap.get(Number(checklist.id_empresa))

                return {
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
                }
            })

            

            return NextResponse.json({
                items: items,
                current: page,
                last: Math.ceil(total / limit),
                per_page: limit,
                total: total,
            }, { status: 200, statusText: 'OK' })
        }

        return NextResponse.json({ message: 'Tipo de checklist inválido.' }, { status: 400, statusText: 'Bad Request' })
    } catch (error) {
        useLog(error)

        return NextResponse.json({ message: 'Erro ao buscar usuários.' }, { status: 500, statusText: 'Internal Server Error' })
    }
}