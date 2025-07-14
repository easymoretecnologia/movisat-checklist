import { ChecklistDiario, ChecklistMensal, ChecklistSemanal } from "@/entities/checklist.entity";
import { Empresa } from "@/entities/empresa.entity";
import User from "@/entities/user.entity";
import { Veiculo } from "@/entities/veiculo.entity";
import useDatabase from "@/hooks/useDatabase";
import useLog from "@/hooks/useLog";
import { DateTime } from "luxon";
import { NextRequest, NextResponse } from "next/server";
import { In } from "typeorm";

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
        const userRepository = db.getRepository(User)
        const auth = await userRepository.findOne({ where: { id: Number(auth_id), remember_token: token } })

        if (!auth) {
            return NextResponse.json({ message: 'Usuário não autenticado.' }, { status: 401, statusText: 'Unauthorized' })
        } else if (auth && Number(auth.tipo_acesso) !== 1) {
            return NextResponse.json({ message: 'Usuário não autorizado.' }, { status: 403, statusText: 'Forbidden' })
        } else if (auth && (Number(auth.id_empresa) === 0 || !auth.id_empresa)) {
            return NextResponse.json({ message: 'Usuário não autorizado.' }, { status: 403, statusText: 'Forbidden' })
        }

        const tipo = querySearch.has('tipo') ? querySearch.get('tipo') : 'diario'
        const inicio = querySearch.has('inicio') ? querySearch.get('inicio') as string : ''
        const fim = querySearch.has('fim') ? querySearch.get('fim') as string : ''
        const motorista_id = querySearch.has('usuario_id') ? querySearch.get('usuario_id') : 0
        const veiculo_id = querySearch.has('veiculo_id') ? querySearch.get('veiculo_id') : 0
        
        const repoVeiculos = db.getRepository(Veiculo)
        const repoEmpresas = db.getRepository(Empresa)
        const repoDiarios = db.getRepository(ChecklistDiario)
        const repoMensais = db.getRepository(ChecklistMensal)
        const repoSemanais = db.getRepository(ChecklistSemanal)

        if (tipo === 'diario') {
            let queryDiario = repoDiarios.createQueryBuilder('checklist_diario')

            queryDiario = queryDiario.where('checklist_diario.id_empresa = :empresa_id', { empresa_id: Number(auth.id_empresa) })

            if (motorista_id !== undefined && motorista_id !== '0' && motorista_id !== 0) {
                queryDiario = queryDiario.andWhere('checklist_diario.id_usuario = :motorista_id', { motorista_id: Number(motorista_id) })
            }

            if (veiculo_id !== undefined && veiculo_id !== '0' && veiculo_id !== 0) {
                queryDiario = queryDiario.andWhere('checklist_diario.id_veiculo = :veiculo_id', { veiculo_id: Number(veiculo_id) })
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

            queryDiario = queryDiario.andWhere(`(checklist_diario.farois = :stats OR checklist_diario.lataria = :stats OR checklist_diario.vidros = :stats OR checklist_diario.hodometro = :stats OR checklist_diario.combustivel = :stats OR checklist_diario.agua = :stats OR checklist_diario.luzes = :stats)`, { stats: 'Sim' })

            queryDiario = queryDiario.orderBy('checklist_diario.created_at', 'DESC')

            const checklists = await queryDiario.getMany()

            const userIds = [...new Set(checklists.map(c => Number(c.id_usuario)).filter(id => id > 0))]
            const veiculoIds = [...new Set(checklists.map(c => Number(c.id_veiculo)).filter(id => id > 0))]
            const empresaIds = [...new Set(checklists.map(c => Number(c.id_empresa)).filter(id => id > 0))]

            const [users, veiculos, empresas] = await Promise.all([
                userIds.length > 0 ? userRepository.find({ where: { id: In(userIds) } }) : [],
                veiculoIds.length > 0 ? repoVeiculos.find({ where: { id: In(veiculoIds) } }) : [],
                empresaIds.length > 0 ? repoEmpresas.find({ where: { id: In(empresaIds) } }) : []
            ])

            const userMap = new Map(users.map(u => [u.id, u]))
            const veiculoMap = new Map(veiculos.map(v => [v.id, v]))
            const empresaMap = new Map(empresas.map(e => [e.id, e]))

            const ocorrencias = checklists.map(checklist => {
                const user = userMap.get(Number(checklist.id_usuario))
                const veiculo = veiculoMap.get(Number(checklist.id_veiculo))
                const empresa = empresaMap.get(Number(checklist.id_empresa))

                return {
                    ...checklist,
                    tipo: 'diario',
                    usuario: user ? {
                        id: Number(user.id),
                        nome: user.nome,
                    } : {
                        id: 0,
                        nome: '',
                    },
                    veiculo: veiculo ? {
                        id: Number(veiculo.id),
                        placa: veiculo.placa,
                        modelo: veiculo.modelo,
                        cor: veiculo.cor,
                        apelido: veiculo.apelido,
                        ultimo_checklist: veiculo.ultimo_checklist,
                    } : {
                        id: 0,
                        placa: '',
                        modelo: '',
                        cor: '',
                        apelido: '',
                        ultimo_checklist: '',
                    },
                    empresa: empresa ? empresa.nome_fantasia : '',
                }
            })

            return NextResponse.json({
                ocorrencias: ocorrencias,
            }, { status: 200, statusText: 'OK' })
        } else if (tipo === 'mensal') {
            let queryMensal = repoMensais.createQueryBuilder('checklist_mensal')

            queryMensal = queryMensal.where('checklist_mensal.id_empresa = :empresa_id', { empresa_id: Number(auth.id_empresa) })

            if (motorista_id !== undefined && motorista_id !== '0' && motorista_id !== 0) {
                queryMensal = queryMensal.andWhere('checklist_mensal.id_usuario = :motorista_id', { motorista_id: Number(motorista_id) })
            }

            if (veiculo_id !== undefined && veiculo_id !== '0' && veiculo_id !== 0) {
                queryMensal = queryMensal.andWhere('checklist_mensal.id_veiculo = :veiculo_id', { veiculo_id: Number(veiculo_id) })
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

            queryMensal = queryMensal.andWhere(`(checklist_mensal.estofados = :stats OR checklist_mensal.documentacao = :stats OR checklist_mensal.volante = :stats OR checklist_mensal.cambio = :stats OR checklist_mensal.higiene_interna = :stats OR checklist_mensal.porta_malas = :stats OR checklist_mensal.bateria = :stats OR checklist_mensal.farois = :stats)`, { stats: 'Não' })

            queryMensal = queryMensal.orderBy('checklist_mensal.created_at', 'DESC')

            const checklists = await queryMensal.getMany()

            const userIds = [...new Set(checklists.map(c => Number(c.id_usuario)).filter(id => id > 0))]
            const veiculoIds = [...new Set(checklists.map(c => Number(c.id_veiculo)).filter(id => id > 0))]
            const empresaIds = [...new Set(checklists.map(c => Number(c.id_empresa)).filter(id => id > 0))]

            const [users, veiculos, empresas] = await Promise.all([
                userIds.length > 0 ? userRepository.find({ where: { id: In(userIds) } }) : [],
                veiculoIds.length > 0 ? repoVeiculos.find({ where: { id: In(veiculoIds) } }) : [],
                empresaIds.length > 0 ? repoEmpresas.find({ where: { id: In(empresaIds) } }) : []
            ])

            const userMap = new Map(users.map(u => [u.id, u]))
            const veiculoMap = new Map(veiculos.map(v => [v.id, v]))
            const empresaMap = new Map(empresas.map(e => [e.id, e]))

            const ocorrencias = checklists.map(checklist => {
                const user = userMap.get(Number(checklist.id_usuario))
                const veiculo = veiculoMap.get(Number(checklist.id_veiculo))
                const empresa = empresaMap.get(Number(checklist.id_empresa))

                return {
                    ...checklist,
                    tipo: 'mensal',
                    usuario: user ? {
                        id: Number(user.id),
                        nome: user.nome,
                    } : {
                        id: 0,
                        nome: '',
                    },
                    veiculo: veiculo ? {
                        id: Number(veiculo.id),
                        placa: veiculo.placa,
                        modelo: veiculo.modelo,
                        cor: veiculo.cor,
                        apelido: veiculo.apelido,
                        ultimo_checklist: veiculo.ultimo_checklist,
                    } : {
                        id: 0,
                        placa: '',
                        modelo: '',
                        cor: '',
                        apelido: '',
                        ultimo_checklist: '',
                    },
                    empresa: empresa ? empresa.nome_fantasia : '',
                }
            })

            return NextResponse.json({
                ocorrencias: ocorrencias,
            }, { status: 200, statusText: 'OK' })
        } else if (tipo === 'semanal') {
            let querySemanal = repoSemanais.createQueryBuilder('checklist_semanal')

            querySemanal = querySemanal.where('checklist_semanal.id_empresa = :empresa_id', { empresa_id: Number(auth.id_empresa) })

            if (motorista_id !== undefined && motorista_id !== '0' && motorista_id !== 0) {
                querySemanal = querySemanal.andWhere('checklist_semanal.id_usuario = :motorista_id', { motorista_id: Number(motorista_id) })
            }

            if (veiculo_id !== undefined && veiculo_id !== '0' && veiculo_id !== 0) {
                querySemanal = querySemanal.andWhere('checklist_semanal.id_veiculo = :veiculo_id', { veiculo_id: Number(veiculo_id) })
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

            querySemanal = querySemanal.andWhere(`(checklist_semanal.oleo_motor = :stats OR checklist_semanal.agua_limpador = :stats OR checklist_semanal.oleo_freio = :stats OR checklist_semanal.pneus = :stats OR checklist_semanal.escapamento = :stats OR checklist_semanal.vidros = :stats OR checklist_semanal.luzes = :stats)`, { stats: 'Não' })

            querySemanal = querySemanal.orderBy('checklist_semanal.created_at', 'DESC')

            const checklists = await querySemanal.getMany()

            const userIds = [...new Set(checklists.map(c => Number(c.id_usuario)).filter(id => id > 0))]
            const veiculoIds = [...new Set(checklists.map(c => Number(c.id_veiculo)).filter(id => id > 0))]
            const empresaIds = [...new Set(checklists.map(c => Number(c.id_empresa)).filter(id => id > 0))]

            const [users, veiculos, empresas] = await Promise.all([
                userIds.length > 0 ? userRepository.find({ where: { id: In(userIds) } }) : [],
                veiculoIds.length > 0 ? repoVeiculos.find({ where: { id: In(veiculoIds) } }) : [],
                empresaIds.length > 0 ? repoEmpresas.find({ where: { id: In(empresaIds) } }) : []
            ])

            const userMap = new Map(users.map(u => [u.id, u]))
            const veiculoMap = new Map(veiculos.map(v => [v.id, v]))
            const empresaMap = new Map(empresas.map(e => [e.id, e]))

            const ocorrencias = checklists.map(checklist => {
                const user = userMap.get(Number(checklist.id_usuario))
                const veiculo = veiculoMap.get(Number(checklist.id_veiculo))
                const empresa = empresaMap.get(Number(checklist.id_empresa))

                return {
                    ...checklist,
                    tipo: 'semanal',
                    usuario: user ? {
                        id: Number(user.id),
                        nome: user.nome,
                    } : {
                        id: 0,
                        nome: '',
                    },
                    veiculo: veiculo ? {
                        id: Number(veiculo.id),
                        placa: veiculo.placa,
                        modelo: veiculo.modelo,
                        cor: veiculo.cor,
                        apelido: veiculo.apelido,
                        ultimo_checklist: veiculo.ultimo_checklist,
                    } : {
                        id: 0,
                        placa: '',
                        modelo: '',
                        cor: '',
                        apelido: '',
                        ultimo_checklist: '',
                    },
                    empresa: empresa ? empresa.nome_fantasia : '',
                }
            })

            return NextResponse.json({
                ocorrencias: ocorrencias,
            }, { status: 200, statusText: 'OK' })
        }

        return NextResponse.json({ message: 'Ocorrencias encontradas.' }, { status: 404, statusText: 'Not Found' })
    } catch (error) {
        useLog(error)
        return NextResponse.json({ message: 'Erro ao buscar conformidades.' }, { status: 500, statusText: 'Internal Server Error' })
    }
}

export async function PATCH (request: NextRequest) {
    const token = request.headers.get('authorization')?.split(' ')[1]
    const body = await request.json()

    if (!token) {
        return NextResponse.json({ message: 'Usuário não autenticado.' }, { status: 401, statusText: 'Unauthorized' })
    }

    const { id_usuario, tipo, ids } = body

    if (!ids) {
        return NextResponse.json({ message: 'IDs das ocorrências são obrigatórios.' }, { status: 422, statusText: 'Unprocessable Entity' })
    }

    if (!id_usuario) {
        return NextResponse.json({ message: 'ID do usuário é obrigatório.' }, { status: 422, statusText: 'Unprocessable Entity' })
    }

    if (!tipo) {
        return NextResponse.json({ message: 'Tipo de checklist é obrigatório.' }, { status: 422, statusText: 'Unprocessable Entity' })
    } else if (tipo !== 'diario' && tipo !== 'mensal' && tipo !== 'semanal') {
        return NextResponse.json({ message: 'Tipo de checklist inválido.' }, { status: 422, statusText: 'Unprocessable Entity' })
    }

    try {
        const db = await useDatabase()
        const repoUser = db.getRepository(User)
        const repoDiarios = db.getRepository(ChecklistDiario)
        const repoMensais = db.getRepository(ChecklistMensal)
        const repoSemanais = db.getRepository(ChecklistSemanal)

        const user = await repoUser.findOneBy({ id: id_usuario })

        if (!user) {
            return NextResponse.json({ message: 'Usuário não encontrado.' }, { status: 404, statusText: 'Not Found' })
        }

        if (tipo === 'diario') {
            const checklists = await repoDiarios.find({ where: { id: In(ids.map((id: any) => Number(id))), id_empresa: user.id_empresa } })

            if (checklists.length <= 0) {
                return NextResponse.json({ message: 'Checklists não encontradas.' }, { status: 404, statusText: 'Not Found' })
            }
            
            await repoDiarios.update({ id: In(checklists.map(c => Number(c.id))) }, { ciencia_inconformidades: user.nome })

            return NextResponse.json({ message: 'Checklist atualizado com sucesso.' }, { status: 200, statusText: 'OK' })
        } else if (tipo === 'mensal') {
            const checklists = await repoMensais.find({ where: { id: In(ids.map((id: any) => Number(id))), id_empresa: user.id_empresa } })

            if (checklists.length <= 0) {
                return NextResponse.json({ message: 'Checklists não encontradas.' }, { status: 404, statusText: 'Not Found' })
            }

            await repoMensais.update({ id: In(checklists.map(c => Number(c.id))) }, { ciencia_inconformidades: user.nome })

            return NextResponse.json({ message: 'Checklist atualizado com sucesso.' }, { status: 200, statusText: 'OK' })
        } else if (tipo === 'semanal') {
            const checklists = await repoSemanais.find({ where: { id: In(ids.map((id: any) => Number(id))), id_empresa: user.id_empresa } })
            
            if (checklists.length <= 0) {
                return NextResponse.json({ message: 'Checklists não encontradas.' }, { status: 404, statusText: 'Not Found' })
            }

            await repoSemanais.update({ id: In(checklists.map(c => Number(c.id))) }, { ciencia_inconformidades: user.nome })

            return NextResponse.json({ message: 'Checklist atualizado com sucesso.' }, { status: 200, statusText: 'OK' })
        }

        return NextResponse.json({ message: 'Checklists não encontradas.' }, { status: 404, statusText: 'Not Found' })
    } catch (error) {
        useLog(error)
        return NextResponse.json({ message: 'Erro ao marcar notificação como lida.' }, { status: 500, statusText: 'Internal Server Error' })
    }
}