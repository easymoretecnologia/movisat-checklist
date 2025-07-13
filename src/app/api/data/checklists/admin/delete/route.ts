import { ChecklistDiario, ChecklistMensal, ChecklistSemanal } from "@/entities/checklist.entity"
import { Empresa } from "@/entities/empresa.entity"
import { User } from "@/entities/user.entity"
import { Veiculo } from "@/entities/veiculo.entity"
import useDatabase from "@/hooks/useDatabase"
import useLog from "@/hooks/useLog"
import { deleteImageFiles, parseImagePaths } from "@/utils/imageHandler"
import { DateTime } from "luxon"
import { NextRequest, NextResponse } from "next/server"
import * as ExcelJS from "exceljs"
import { stringify } from "csv"

// Helper function to delete images from checklist records
async function deleteChecklistImages(checklists: (ChecklistDiario | ChecklistMensal | ChecklistSemanal)[]): Promise<void> {
    for (const checklist of checklists) {
        const imagesToDelete: string[] = []
        
        // Check all possible image fields and collect paths
        const imageFields = [
            'farois_images', 'lataria_images', 'vidros_images', 'hodometro_images', 
            'combustivel_images', 'agua_images', 'luzes_images',
            // Additional fields for ChecklistMensal
            'estofados_images', 'documentacao_images', 'volante_images', 'cambio_images', 
            'higiene_interna_images', 'porta_malas_images', 'bateria_images',
            // Additional fields for ChecklistSemanal
            'oleo_motor_images', 'agua_limpador_images', 'oleo_freio_images', 
            'pneus_images', 'escapamento_images'
        ]
        
        imageFields.forEach(field => {
            if ((checklist as any)[field]) {
                const paths = parseImagePaths((checklist as any)[field])
                imagesToDelete.push(...paths)
            }
        })
        
        // Delete image files
        if (imagesToDelete.length > 0) {
            await deleteImageFiles(imagesToDelete)
        }
    }
}

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

            // First, get the records to delete their images
            const recordsToDelete = await queryDiario.getMany()
            
            // Delete associated image files
            await deleteChecklistImages(recordsToDelete)

            // Now delete the records from database
            await queryDiario.delete()

            await db.destroy()

            return NextResponse.json({
                message: 'Dados limpos com sucesso.'
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

            // First, get the records to delete their images
            const recordsToDelete = await queryMensal.getMany()
            
            // Delete associated image files
            await deleteChecklistImages(recordsToDelete)

            // Now delete the records from database
            await queryMensal.delete()

            await db.destroy()

            return NextResponse.json({
                message: 'Dados limpos com sucesso.'
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

            // First, get the records to delete their images
            const recordsToDelete = await querySemanal.getMany()
            
            // Delete associated image files
            await deleteChecklistImages(recordsToDelete)

            // Now delete the records from database
            await querySemanal.delete()

            await db.destroy()

            return NextResponse.json({
                message: 'Dados limpos com sucesso.'
            }, { status: 200, statusText: 'OK' })
        }

        return NextResponse.json({ message: 'Tipo de checklist inválido.' }, { status: 400, statusText: 'Bad Request' })
    } catch (error) {
        useLog(error)

        return NextResponse.json({ message: 'Erro ao buscar usuários.' }, { status: 500, statusText: 'Internal Server Error' })
    }
}