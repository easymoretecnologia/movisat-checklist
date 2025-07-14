import { ChecklistDiario, ChecklistMensal, ChecklistSemanal } from "@/entities/checklist.entity";
import User from "@/entities/user.entity";
import { Veiculo } from "@/entities/veiculo.entity";
import useDatabase from "@/hooks/useDatabase";
import useLog from "@/hooks/useLog";
import { DateTime } from "luxon";
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

    const today = DateTime.now()

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
        
        const repoVeiculos = db.getRepository(Veiculo)
        const veiculos = await repoVeiculos.find({ where: { id_empresa: Number(auth.id_empresa) } })

        const repoDiarios = db.getRepository(ChecklistDiario)
        const repoMensais = db.getRepository(ChecklistMensal)
        const repoSemanais = db.getRepository(ChecklistSemanal)

        const diariosQuery = await repoDiarios.find({
            where: {
                id_empresa: Number(auth.id_empresa),
            }
        })

        const diarios = await diariosQuery.map(diario => {
            const veiculo = veiculos.find(v => Number(v.id) === Number(diario.id_veiculo))

            let inconformidades = 'Não'

            if (diario.farois === 'Sim' || diario.lataria === 'Sim' || diario.vidros === 'Sim' || diario.hodometro === 'Sim' || diario.combustivel === 'Sim' || diario.agua === 'Sim' || diario.luzes === 'Sim') {
                inconformidades = 'Sim'
            }

            const ultimo_checklist = diario.created_at

            const days = DateTime.fromSQL(ultimo_checklist).diff(today, 'days').days

            return {
                id: Number(diario.id),
                tipo: 'diario',
                veiculo: veiculo ? {
                    id: Number(veiculo.id),
                    placa: veiculo.placa,
                } : {
                    id: 0,
                    placa: '-'
                },
                ultimo_checklist: ultimo_checklist,
                dias_sem_checklist: days > 1 ? days : 0,
                inconformidades: inconformidades,
                ciencia_inconformidades: diario.ciencia_inconformidades
            }
        })

        const mensaisQuery = await repoMensais.find({
            where: {
                id_empresa: Number(auth.id_empresa),
            }
        })

        const mensais = await mensaisQuery.map(mensal => {
            const veiculo = veiculos.find(v => Number(v.id) === Number(mensal.id_veiculo))

            let inconformidades = 'Não'

            if (mensal.estofados === 'Não' || mensal.documentacao === 'Não' || mensal.volante === 'Não' || mensal.cambio === 'Não' || mensal.higiene_interna === 'Não' || mensal.porta_malas === 'Não' || mensal.bateria === 'Não' || mensal.farois === 'Não') {
                inconformidades = 'Sim'
            }

            const ultimo_checklist = mensal.created_at

            const days = DateTime.fromSQL(ultimo_checklist).diff(today, 'days').days

            let limit = 30

            if (today.month === 2) {
                limit = 28
            } else if (today.month === 4 || today.month === 6 || today.month === 9 || today.month === 11) {
                limit = 30
            } else {
                limit = 31
            }

            return {
                id: Number(mensal.id),
                tipo: 'mensal',
                veiculo: veiculo ? {
                    id: Number(veiculo.id),
                    placa: veiculo.placa,
                } : {
                    id: 0,
                    placa: '-'
                },
                ultimo_checklist: ultimo_checklist,
                dias_sem_checklist: days > limit ? days : 0,
                inconformidades: inconformidades,
                ciencia_inconformidades: mensal.ciencia_inconformidades
            }
        })

        const semanasQuery = await repoSemanais.find({
            where: {
                id_empresa: Number(auth.id_empresa),
            }
        })

        const semanais = await semanasQuery.map(semana => {
            const veiculo = veiculos.find(v => Number(v.id) === Number(semana.id_veiculo))

            let inconformidades = 'Não'

            if (semana.oleo_motor === 'Não' || semana.agua_limpador === 'Não' || semana.oleo_freio === 'Não' || semana.pneus === 'Não' || semana.escapamento === 'Não' || semana.vidros === 'Não' || semana.luzes === 'Não') {
                inconformidades = 'Sim'
            }

            const ultimo_checklist = semana.created_at

            const days = DateTime.fromSQL(ultimo_checklist).diff(today, 'days').days

            let limit = 7

            return {
                id: Number(semana.id),
                tipo: 'semanal',
                veiculo: veiculo ? {
                    id: Number(veiculo.id),
                    placa: veiculo.placa,
                } : {
                    id: 0,
                    placa: '-'
                },
                ultimo_checklist: ultimo_checklist,
                dias_sem_checklist: days > limit ? days : 0,
                inconformidades: inconformidades,
                ciencia_inconformidades: semana.ciencia_inconformidades
            }
        })

        return NextResponse.json({ diarios, mensais, semanais }, { status: 200, statusText: 'OK' })
    } catch (error) {
        useLog(error)
        return NextResponse.json({ message: 'Erro ao buscar conformidades.' }, { status: 500, statusText: 'Internal Server Error' })
    }
}