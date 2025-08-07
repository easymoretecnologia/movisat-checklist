import { ChecklistDiario, ChecklistMensal, ChecklistSemanal } from "@/entities/checklist.entity"
import { Empresa } from "@/entities/empresa.entity"
import { User } from "@/entities/user.entity"
import { Veiculo } from "@/entities/veiculo.entity"
import useDatabase from "@/hooks/useDatabase"
import useLog from "@/hooks/useLog"
import { DateTime } from "luxon"
import { NextRequest, NextResponse } from "next/server"
import * as ExcelJS from "exceljs"
import { stringify } from "csv"

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

        // Generate CSV from items array and return as downloadable file

        // Helper function to escape CSV values
        function escapeCSV(value: any) {
            if (value == null) return '';
            let str = String(value);
            if (str.includes('"')) str = str.replace(/"/g, '""');
            if (str.search(/("|,|\n)/g) >= 0) str = `"${str}"`;
            return str;
        }

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

            const checklists = await queryDiario.getMany()

            let items = []

            for (const checklist of checklists) {
                const user = await repoUser.findOne({ where: { id: checklist.id_usuario } })
                const veiculo = await repoVeiculo.findOne({ where: { id: checklist.id_veiculo } })
                const empresa = await repoEmpresa.findOne({ where: { id: checklist.id_empresa } })

                items.push({
                    tipo: 'diario',
                    id: Number(checklist.id),
                    id_empresa: Number(checklist.id_empresa),
                    id_usuario: Number(checklist.id_usuario),
                    id_veiculo: Number(checklist.id_veiculo),
                    usuario: user ? user.nome : 'Não encontrado',
                    veiculo: veiculo ? `${veiculo.apelido} (${veiculo.placa})` : 'Não encontrado',
                    empresa: empresa ? empresa.nome_fantasia : 'Não encontrado',
                    farois: checklist.farois.toLowerCase() === 'sim' ? `Faróis com inconformidade: ${checklist.farois_obs ? checklist.farois_obs : 'Não informado'}` : 'Sem inconformidade',
                    lataria: checklist.lataria.toLowerCase() === 'sim' ? `Lataria com inconformidade: ${checklist.lataria_obs ? checklist.lataria_obs : 'Não informado'}` : 'Sem inconformidade',
                    vidros: checklist.vidros.toLowerCase() === 'sim' ? `Vidros com inconformidade: ${checklist.vidros_obs ? checklist.vidros_obs : 'Não informado'}` : 'Sem inconformidade',
                    hodometro: checklist.hodometro.toLowerCase() === 'sim' ? `Hodômetro com inconformidade: ${checklist.hodometro_obs ? checklist.hodometro_obs : 'Não informado'}` : 'Sem inconformidade',
                    combustivel: checklist.combustivel.toLowerCase() === 'sim' ? `Combustível com inconformidade: ${checklist.combustivel_obs ? checklist.combustivel_obs : 'Não informado'}` : 'Sem inconformidade',
                    agua: checklist.agua.toLowerCase() === 'sim' ? `Água com inconformidade: ${checklist.agua_obs ? checklist.agua_obs : 'Não informado'}` : 'Sem inconformidade',
                    luzes: checklist.luzes.toLowerCase() === 'sim' ? `Luzes com inconformidade: ${checklist.luzes_obs ? checklist.luzes_obs : 'Não informado'}` : 'Sem inconformidade',
                    created_at: checklist.created_at,
                })
            }

            

            // If there are items, generate CSV
            if (items.length > 0) {
                // Get all unique keys from all items (to ensure all columns are present)
                const allKeys = Array.from(
                    items.reduce((set, item) => {
                        Object.keys(item).forEach(k => set.add(k));
                        return set;
                    }, new Set<string>())
                );

                // CSV header
                const header = allKeys.join(',');

                // CSV rows
                const rows = items.map((item: any) =>
                    allKeys.map(key => escapeCSV(item[key])).join(',')
                );

                // Combine header and rows
                const csvContent = [header, ...rows].join('\r\n');

                // Return as CSV file
                return new Response(csvContent, {
                    status: 200,
                    headers: {
                        'Content-Type': 'text/csv; charset=utf-8',
                        'Content-Disposition': `attachment; filename="checklists_diario.csv"`
                    }
                });
            }

            return NextResponse.json({
                message: 'Nenhum checklist encontrado.'
            }, { status: 404, statusText: 'Not Found' })
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

            const checklists = await queryMensal.getMany()

            let items = []

            for (const checklist of checklists) {
                const user = await repoUser.findOne({ where: { id: checklist.id_usuario } })
                const veiculo = await repoVeiculo.findOne({ where: { id: checklist.id_veiculo } })
                const empresa = await repoEmpresa.findOne({ where: { id: checklist.id_empresa } })

                items.push({
                    tipo: 'mensal',
                    id: Number(checklist.id),
                    id_empresa: Number(checklist.id_empresa),
                    id_usuario: Number(checklist.id_usuario),
                    id_veiculo: Number(checklist.id_veiculo),
                    usuario: user ? user.nome : 'Não encontrado',
                    veiculo: veiculo ? `${veiculo.apelido} (${veiculo.placa})` : 'Não encontrado',
                    empresa: empresa ? empresa.nome_fantasia : 'Não encontrado',
                    estofados: checklist.estofados.toLowerCase() === 'sim' ? `Estofados com inconformidade: ${checklist.estofados_obs ? checklist.estofados_obs : 'Não informado'}` : 'Sem inconformidade',
                    documentacao: checklist.documentacao.toLowerCase() === 'sim' ? `Documentação com inconformidade: ${checklist.documentacao_obs ? checklist.documentacao_obs : 'Não informado'}` : 'Sem inconformidade',
                    volante: checklist.volante.toLowerCase() === 'sim' ? `Volante com inconformidade: ${checklist.volante_obs ? checklist.volante_obs : 'Não informado'}` : 'Sem inconformidade',
                    cambio: checklist.cambio.toLowerCase() === 'sim' ? `Câmbio com inconformidade: ${checklist.cambio_obs ? checklist.cambio_obs : 'Não informado'}` : 'Sem inconformidade',
                    higiene_interna: checklist.higiene_interna.toLowerCase() === 'sim' ? `Higiene interna com inconformidade: ${checklist.higiene_interna_obs ? checklist.higiene_interna_obs : 'Não informado'}` : 'Sem inconformidade',
                    porta_malas: checklist.porta_malas.toLowerCase() === 'sim' ? `Porta-malas com inconformidade: ${checklist.porta_malas_obs ? checklist.porta_malas_obs : 'Não informado'}` : 'Sem inconformidade',
                    bateria: checklist.bateria.toLowerCase() === 'sim' ? `Bateria com inconformidade: ${checklist.bateria_obs ? checklist.bateria_obs : 'Não informado'}` : 'Sem inconformidade',
                    farois: checklist.farois.toLowerCase() === 'sim' ? `Faróis com inconformidade: ${checklist.farois_obs ? checklist.farois_obs : 'Não informado'}` : 'Sem inconformidade',
                    created_at: checklist.created_at,
                })
            }

            

            // If there are items, generate CSV
            if (items.length > 0) {
                // Get all unique keys from all items (to ensure all columns are present)
                const allKeys = Array.from(
                    items.reduce((set, item) => {
                        Object.keys(item).forEach(k => set.add(k));
                        return set;
                    }, new Set<string>())
                );

                // CSV header
                const header = allKeys.join(',');

                // CSV rows
                const rows = items.map((item: any) =>
                    allKeys.map(key => escapeCSV(item[key])).join(',')
                );

                // Combine header and rows
                const csvContent = [header, ...rows].join('\r\n');

                // Return as CSV file
                return new Response(csvContent, {
                    status: 200,
                    headers: {
                        'Content-Type': 'text/csv; charset=utf-8',
                        'Content-Disposition': `attachment; filename="checklists_diario.csv"`
                    }
                });
            }

            return NextResponse.json({
                message: 'Nenhum checklist encontrado.'
            }, { status: 404, statusText: 'Not Found' })
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

            const checklists = await querySemanal.getMany()

            let items = []

            for (const checklist of checklists) {
                const user = await repoUser.findOne({ where: { id: checklist.id_usuario } })
                const veiculo = await repoVeiculo.findOne({ where: { id: checklist.id_veiculo } })
                const empresa = await repoEmpresa.findOne({ where: { id: checklist.id_empresa } })

                items.push({
                    tipo: 'semanal',
                    id: Number(checklist.id),
                    id_empresa: Number(checklist.id_empresa),
                    id_usuario: Number(checklist.id_usuario),
                    id_veiculo: Number(checklist.id_veiculo),
                    usuario: user ? user.nome : 'Não encontrado',
                    veiculo: veiculo ? `${veiculo.apelido} (${veiculo.placa})` : 'Não encontrado',
                    empresa: empresa ? empresa.nome_fantasia : 'Não encontrado',
                    oleo_motor: checklist.oleo_motor.toLowerCase() === 'sim' ? `Óleo do motor com inconformidade: ${checklist.oleo_motor_obs ? checklist.oleo_motor_obs : 'Não informado'}` : 'Sem inconformidade',
                    agua_limpador: checklist.agua_limpador.toLowerCase() === 'sim' ? `Água do limpador com inconformidade: ${checklist.agua_limpador_obs ? checklist.agua_limpador_obs : 'Não informado'}` : 'Sem inconformidade',
                    oleo_freio: checklist.oleo_freio.toLowerCase() === 'sim' ? `Óleo do freio com inconformidade: ${checklist.oleo_freio_obs ? checklist.oleo_freio_obs : 'Não informado'}` : 'Sem inconformidade',
                    pneus: checklist.pneus.toLowerCase() === 'sim' ? `Pneus com inconformidade: ${checklist.pneus_obs ? checklist.pneus_obs : 'Não informado'}` : 'Sem inconformidade',
                    escapamento: checklist.escapamento.toLowerCase() === 'sim' ? `Escapamento com inconformidade: ${checklist.escapamento_obs ? checklist.escapamento_obs : 'Não informado'}` : 'Sem inconformidade',
                    vidros: checklist.vidros.toLowerCase() === 'sim' ? `Vidros com inconformidade: ${checklist.vidros_obs ? checklist.vidros_obs : 'Não informado'}` : 'Sem inconformidade',
                    luzes: checklist.luzes.toLowerCase() === 'sim' ? `Luzes com inconformidade: ${checklist.luzes_obs ? checklist.luzes_obs : 'Não informado'}` : 'Sem inconformidade',
                    created_at: checklist.created_at,
                })
            }

            

            // If there are items, generate CSV
            if (items.length > 0) {
                // Get all unique keys from all items (to ensure all columns are present)
                const allKeys = Array.from(
                    items.reduce((set, item) => {
                        Object.keys(item).forEach(k => set.add(k));
                        return set;
                    }, new Set<string>())
                );

                // CSV header
                const header = allKeys.join(',');

                // CSV rows
                const rows = items.map((item: any) =>
                    allKeys.map(key => escapeCSV(item[key])).join(',')
                );

                // Combine header and rows
                const csvContent = [header, ...rows].join('\r\n');

                // Return as CSV file
                return new Response(csvContent, {
                    status: 200,
                    headers: {
                        'Content-Type': 'text/csv; charset=utf-8',
                        'Content-Disposition': `attachment; filename="checklists_diario.csv"`
                    }
                });
            }

            return NextResponse.json({
                message: 'Nenhum checklist encontrado.'
            }, { status: 404, statusText: 'Not Found' })
        }

        return NextResponse.json({ message: 'Tipo de checklist inválido.' }, { status: 400, statusText: 'Bad Request' })
    } catch (error) {
        useLog(error)

        return NextResponse.json({ message: 'Erro ao buscar usuários.' }, { status: 500, statusText: 'Internal Server Error' })
    }
}