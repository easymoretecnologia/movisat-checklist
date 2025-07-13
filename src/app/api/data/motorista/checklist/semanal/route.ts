import { ChecklistSemanal } from "@/entities/checklist.entity";
import { Notificacao } from "@/entities/notificacao.entity";
import User from "@/entities/user.entity";
import { Veiculo } from "@/entities/veiculo.entity";
import useDatabase from "@/hooks/useDatabase";
import useLog from "@/hooks/useLog";
import { saveBase64Images } from "@/utils/imageHandler";
import { DateTime } from "luxon";
import { NextRequest, NextResponse } from "next/server";

export async function POST (request: NextRequest) {
    const token = request.headers.get('authorization')?.split(' ')[1]
    const body = await request.json()

    if (!token) {
        return NextResponse.json({ message: 'Usuário não autenticado.' }, { status: 401, statusText: 'Unauthorized' })
    }

    const { id_veiculo, id_usuario, oleo_motor, agua_limpador, oleo_freio, pneus, escapamento, vidros, luzes, motivo, selfie_motorista, inicio } = body

    if (!id_veiculo) {
        return NextResponse.json({ message: 'ID do veículo é obrigatório.' }, { status: 422, statusText: 'Unprocessable Entity' })
    }

    if (!id_usuario) {
        return NextResponse.json({ message: 'ID do usuário é obrigatório.' }, { status: 422, statusText: 'Unprocessable Entity' })
    }

    if (!oleo_motor) {
        return NextResponse.json({ message: 'Oleo do motor é obrigatório.' }, { status: 422, statusText: 'Unprocessable Entity' })
    } else if (oleo_motor !== 'sim' && oleo_motor !== 'nao' && oleo_motor !== 'na') {
        return NextResponse.json({ message: 'Oleo do motor inválido.' }, { status: 422, statusText: 'Unprocessable Entity' })
    }

    if (!agua_limpador) {
        return NextResponse.json({ message: 'Água do limpador é obrigatória.' }, { status: 422, statusText: 'Unprocessable Entity' })
    } else if (agua_limpador !== 'sim' && agua_limpador !== 'nao' && agua_limpador !== 'na') {
        return NextResponse.json({ message: 'Água do limpador inválida.' }, { status: 422, statusText: 'Unprocessable Entity' })
    }

    if (!oleo_freio) {
        return NextResponse.json({ message: 'Óleo do freio é obrigatório.' }, { status: 422, statusText: 'Unprocessable Entity' })
    } else if (oleo_freio !== 'sim' && oleo_freio !== 'nao' && oleo_freio !== 'na') {
        return NextResponse.json({ message: 'Óleo do freio inválido.' }, { status: 422, statusText: 'Unprocessable Entity' })
    }

    if (!pneus) {
        return NextResponse.json({ message: 'Pneus é obrigatório.' }, { status: 422, statusText: 'Unprocessable Entity' })
    } else if (pneus !== 'sim' && pneus !== 'nao' && pneus !== 'na') {
        return NextResponse.json({ message: 'Pneus inválido.' }, { status: 422, statusText: 'Unprocessable Entity' })
    }

    if (!escapamento) {
        return NextResponse.json({ message: 'Escapamento é obrigatório.' }, { status: 422, statusText: 'Unprocessable Entity' })
    } else if (escapamento !== 'sim' && escapamento !== 'nao' && escapamento !== 'na') {
        return NextResponse.json({ message: 'Escapamento inválido.' }, { status: 422, statusText: 'Unprocessable Entity' })
    }

    if (!vidros) {
        return NextResponse.json({ message: 'Vidros é obrigatório.' }, { status: 422, statusText: 'Unprocessable Entity' })
    } else if (vidros !== 'sim' && vidros !== 'nao' && vidros !== 'na') {
        return NextResponse.json({ message: 'Vidros inválido.' }, { status: 422, statusText: 'Unprocessable Entity' })
    }

    if (!luzes) {
        return NextResponse.json({ message: 'Luzes é obrigatória.' }, { status: 422, statusText: 'Unprocessable Entity' })
    } else if (luzes !== 'sim' && luzes !== 'nao' && luzes !== 'na') {
        return NextResponse.json({ message: 'Luzes inválida.' }, { status: 422, statusText: 'Unprocessable Entity' })
    }

    if (!motivo) {
        return NextResponse.json({ message: 'Motivo é obrigatório.' }, { status: 422, statusText: 'Unprocessable Entity' })
    } else if (motivo !== 'uso' && motivo !== 'devolucao') {
        return NextResponse.json({ message: 'Motivo inválido.' }, { status: 422, statusText: 'Unprocessable Entity' })
    }

    if (!selfie_motorista) {
        return NextResponse.json({ message: 'Selfie do motorista é obrigatório.' }, { status: 422, statusText: 'Unprocessable Entity' })
    }

    try {
        const db = await useDatabase()
        const repoVeiculo = db.getRepository(Veiculo)
        const repoUser = db.getRepository(User)
        const repo = db.getRepository(ChecklistSemanal)

        const user = await repoUser.findOneBy({ id: id_usuario, remember_token: token })

        if (!user) {
            return NextResponse.json({ message: 'Usuário não autenticado.' }, { status: 401, statusText: 'Unauthorized' })
        }

        const veiculo = await repoVeiculo.findOneBy({ id: Number(id_veiculo), id_empresa: Number(user.id_empresa) })

        if (!veiculo) {
            return NextResponse.json({ message: 'Veículo não encontrado.' }, { status: 404, statusText: 'Not Found' })
        }

        if (veiculo.status !== 'Andamento' || Number(veiculo.id_usuario) !== Number(user.id)) {
            return NextResponse.json({ message: 'Veículo não está em andamento.' }, { status: 400, statusText: 'Bad Request' })
        }

        // Process and save base64 images as files
        const oleoMotorImagePaths = body.oleo_motor_images ? await saveBase64Images(body.oleo_motor_images, 'oleo_motor') : []
        const aguaLimpadorImagePaths = body.agua_limpador_images ? await saveBase64Images(body.agua_limpador_images, 'agua_limpador') : []
        const oleoFreioImagePaths = body.oleo_freio_images ? await saveBase64Images(body.oleo_freio_images, 'oleo_freio') : []
        const pneusImagePaths = body.pneus_images ? await saveBase64Images(body.pneus_images, 'pneus') : []
        const escapamentoImagePaths = body.escapamento_images ? await saveBase64Images(body.escapamento_images, 'escapamento') : []
        const vidrosImagePaths = body.vidros_images ? await saveBase64Images(body.vidros_images, 'vidros') : []
        const luzesImagePaths = body.luzes_images ? await saveBase64Images(body.luzes_images, 'luzes') : []
        
        const checklist = repo.create({
            id_usuario: Number(user.id),
            id_empresa: Number(user.id_empresa),
            id_veiculo: Number(id_veiculo),
            oleo_motor: oleo_motor === 'sim' ? 'Sim' : 'Não',
            oleo_motor_obs: body.oleo_motor_obs ?? null,
            oleo_motor_images: oleoMotorImagePaths,
            agua_limpador: agua_limpador === 'sim' ? 'Sim' : 'Não',
            agua_limpador_obs: body.agua_limpador_obs ?? null,
            agua_limpador_images: aguaLimpadorImagePaths,
            oleo_freio: oleo_freio === 'sim' ? 'Sim' : 'Não',
            oleo_freio_obs: body.oleo_freio_obs ?? null,
            oleo_freio_images: oleoFreioImagePaths,
            pneus: pneus === 'sim' ? 'Sim' : 'Não',
            pneus_obs: body.pneus_obs ?? null,
            pneus_images: pneusImagePaths,
            escapamento: escapamento === 'sim' ? 'Sim' : 'Não',
            escapamento_obs: body.escapamento_obs ?? null,
            escapamento_images: escapamentoImagePaths,
            vidros: vidros === 'sim' ? 'Sim' : 'Não',
            vidros_obs: body.vidros_obs ?? null,
            vidros_images: vidrosImagePaths,
            luzes: luzes === 'sim' ? 'Sim' : 'Não',
            luzes_obs: body.luzes_obs ?? null,
            luzes_images: luzesImagePaths,
            status: motivo === 'uso' ? 'Uso' : 'Devolução',
            selfie_motorista: selfie_motorista,
            ultimo_checklist: DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss'),
            ciencia_inconformidades: null,
            created_at: inicio,
            updated_at: DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss'),
        })

        await repo.save(checklist)

        await repoVeiculo.update({ id: Number(id_veiculo)}, { status: null, id_usuario: null, tipo_checklist: null, ultimo_checklist: DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss') })

        const repoNotificacao = db.getRepository(Notificacao)
        
        const notificacao = repoNotificacao.create({
            usuario_id: Number(user.id),
            descricao: `Checklist semanal enviado para o veículo ${veiculo.placa}!`,
            data: DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss'),
            json: {
                id_veiculo: Number(id_veiculo),
                veiculo: veiculo,
                checklist: checklist,
            }
        })
        await repoNotificacao.save(notificacao)

        if (oleo_motor === 'sim' || agua_limpador === 'sim' || oleo_freio === 'sim' || pneus === 'sim' || escapamento === 'sim' || vidros === 'sim' || luzes === 'sim') {
            const notificacaoInconformidades = repoNotificacao.create({
                usuario_id: Number(user.id),
                descricao: `Checklist semanal (#${checklist.id}) com inconformidades!`,
                data: DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss'),
                json: {
                    id_veiculo: Number(id_veiculo),
                    veiculo: veiculo,
                    checklist: checklist,
                }
            })

            await repoNotificacao.save(notificacaoInconformidades)
        }

        await db.destroy()

        return NextResponse.json({ message: 'Checklist enviado com sucesso.' }, { status: 200, statusText: 'OK' })
    } catch (error) {
        useLog(error)
        return NextResponse.json({ message: 'Erro ao salvar checklist.' }, { status: 500, statusText: 'Internal Server Error' })
    }
    
    
}