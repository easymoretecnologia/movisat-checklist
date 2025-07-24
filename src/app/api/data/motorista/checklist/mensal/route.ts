import { ChecklistMensal } from "@/entities/checklist.entity";
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

    const { id_veiculo, id_usuario, estofados, documentacao, volante, cambio, higiene_interna, porta_malas, bateria, farois, motivo, selfie_motorista, inicio } = body

    if (!id_veiculo) {
        return NextResponse.json({ message: 'ID do veículo é obrigatório.' }, { status: 422, statusText: 'Unprocessable Entity' })
    }

    if (!id_usuario) {
        return NextResponse.json({ message: 'ID do usuário é obrigatório.' }, { status: 422, statusText: 'Unprocessable Entity' })
    }

    if (!estofados) {
        return NextResponse.json({ message: 'Estofados é obrigatório.' }, { status: 422, statusText: 'Unprocessable Entity' })
    } else if (estofados !== 'sim' && estofados !== 'nao' && estofados !== 'na') {
        return NextResponse.json({ message: 'Estofados inválido.' }, { status: 422, statusText: 'Unprocessable Entity' })
    }

    if (!documentacao) {
        return NextResponse.json({ message: 'Documentação é obrigatório.' }, { status: 422, statusText: 'Unprocessable Entity' })
    } else if (documentacao !== 'sim' && documentacao !== 'nao' && documentacao !== 'na') {
        return NextResponse.json({ message: 'Documentação inválida.' }, { status: 422, statusText: 'Unprocessable Entity' })
    }

    if (!volante) {
        return NextResponse.json({ message: 'Volante é obrigatório.' }, { status: 422, statusText: 'Unprocessable Entity' })
    } else if (volante !== 'sim' && volante !== 'nao' && volante !== 'na') {
        return NextResponse.json({ message: 'Volante inválido.' }, { status: 422, statusText: 'Unprocessable Entity' })
    }

    if (!cambio) {
        return NextResponse.json({ message: 'Câmbio é obrigatório.' }, { status: 422, statusText: 'Unprocessable Entity' })
    } else if (cambio !== 'sim' && cambio !== 'nao' && cambio !== 'na') {
        return NextResponse.json({ message: 'Câmbio inválido.' }, { status: 422, statusText: 'Unprocessable Entity' })
    }

    if (!higiene_interna) {
        return NextResponse.json({ message: 'Higiene interna é obrigatório.' }, { status: 422, statusText: 'Unprocessable Entity' })
    } else if (higiene_interna !== 'sim' && higiene_interna !== 'nao' && higiene_interna !== 'na') {
        return NextResponse.json({ message: 'Higiene interna inválida.' }, { status: 422, statusText: 'Unprocessable Entity' })
    }

    if (!porta_malas) {
        return NextResponse.json({ message: 'Porta-malas é obrigatório.' }, { status: 422, statusText: 'Unprocessable Entity' })
    } else if (porta_malas !== 'sim' && porta_malas !== 'nao' && porta_malas !== 'na') {
        return NextResponse.json({ message: 'Porta-malas inválido.' }, { status: 422, statusText: 'Unprocessable Entity' })
    }

    if (!bateria) {
        return NextResponse.json({ message: 'Bateria é obrigatória.' }, { status: 422, statusText: 'Unprocessable Entity' })
    } else if (bateria !== 'sim' && bateria !== 'nao' && bateria !== 'na') {
        return NextResponse.json({ message: 'Bateria inválida.' }, { status: 422, statusText: 'Unprocessable Entity' })
    }

    if (!farois) {
        return NextResponse.json({ message: 'Faróis é obrigatório.' }, { status: 422, statusText: 'Unprocessable Entity' })
    } else if (farois !== 'sim' && farois !== 'nao' && farois !== 'na') {
        return NextResponse.json({ message: 'Faróis inválido.' }, { status: 422, statusText: 'Unprocessable Entity' })
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
        const repo = db.getRepository(ChecklistMensal)

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
        const estofadosImagePaths = body.estofados_images ? await saveBase64Images(body.estofados_images, 'estofados') : []
        const documentacaoImagePaths = body.documentacao_images ? await saveBase64Images(body.documentacao_images, 'documentacao') : []
        const volanteImagePaths = body.volante_images ? await saveBase64Images(body.volante_images, 'volante') : []
        const cambioImagePaths = body.cambio_images ? await saveBase64Images(body.cambio_images, 'cambio') : []
        const higieneInternaImagePaths = body.higiene_interna_images ? await saveBase64Images(body.higiene_interna_images, 'higiene_interna') : []
        const portaMalasImagePaths = body.porta_malas_images ? await saveBase64Images(body.porta_malas_images, 'porta_malas') : []
        const bateriaImagePaths = body.bateria_images ? await saveBase64Images(body.bateria_images, 'bateria') : []
        const faroisImagePaths = body.farois_images ? await saveBase64Images(body.farois_images, 'farois') : []
        
        const checklist = repo.create({
            id_usuario: Number(user.id),
            id_empresa: Number(user.id_empresa),
            id_veiculo: Number(id_veiculo),
            estofados: estofados === 'sim' ? 'Sim' : 'Não',
            estofados_obs: body.estofados_obs ?? null,
            estofados_images: estofadosImagePaths,
            documentacao: documentacao === 'sim' ? 'Sim' : 'Não',
            documentacao_obs: body.documentacao_obs ?? null,
            documentacao_images: documentacaoImagePaths,
            volante: volante === 'sim' ? 'Sim' : 'Não',
            volante_obs: body.volante_obs ?? null,
            volante_images: volanteImagePaths,
            cambio: cambio === 'sim' ? 'Sim' : 'Não',
            cambio_obs: body.cambio_obs ?? null,
            cambio_images: cambioImagePaths,
            higiene_interna: higiene_interna === 'sim' ? 'Sim' : 'Não',
            higiene_interna_obs: body.higiene_interna_obs ?? null,
            higiene_interna_images: higieneInternaImagePaths,
            porta_malas: porta_malas === 'sim' ? 'Sim' : 'Não',
            porta_malas_obs: body.porta_malas_obs ?? null,
            porta_malas_images: portaMalasImagePaths,
            bateria: bateria === 'sim' ? 'Sim' : 'Não',
            bateria_obs: body.bateria_obs ?? null,
            bateria_images: bateriaImagePaths,
            farois: farois === 'sim' ? 'Sim' : 'Não',
            farois_obs: body.farois_obs ?? null,
            farois_images: faroisImagePaths,
            status: motivo === 'uso' ? 'Uso' : 'Devolução',
            selfie_motorista: selfie_motorista,
            ultimo_checklist: DateTime.now().setZone('America/Sao_Paulo').toFormat('yyyy-MM-dd HH:mm:ss'),
            ciencia_inconformidades: null,
            created_at: inicio,
            updated_at: DateTime.now().setZone('America/Sao_Paulo').toFormat('yyyy-MM-dd HH:mm:ss'),
        })

        await repo.save(checklist)

        await repoVeiculo.update({ id: Number(id_veiculo)}, { status: null, id_usuario: null, tipo_checklist: null, ultimo_checklist: DateTime.now().setZone('America/Sao_Paulo').toFormat('yyyy-MM-dd HH:mm:ss') })

        const repoNotificacao = db.getRepository(Notificacao)
        
        const notificacao = repoNotificacao.create({
            empresa_id: Number(user.id_empresa),
            usuario_id: Number(user.id),
            descricao: `Checklist mensal enviado para o veículo ${veiculo.placa}!`,
            data: DateTime.now().setZone('America/Sao_Paulo').toFormat('yyyy-MM-dd HH:mm:ss'),
            json: {
                id_veiculo: Number(id_veiculo),
                veiculo: veiculo,
                checklist: checklist,
            }
        })
        await repoNotificacao.save(notificacao)

        if (estofados === 'nao' || documentacao === 'nao' || volante === 'nao' || cambio === 'nao' || higiene_interna === 'nao' || porta_malas === 'nao' || bateria === 'nao' || farois === 'nao') {
            const notificacaoInconformidades = repoNotificacao.create({
                empresa_id: Number(user.id_empresa),
                usuario_id: Number(user.id),
                descricao: `Checklist mensal (#${checklist.id}) com inconformidades!`,
                data: DateTime.now().setZone('America/Sao_Paulo').toFormat('yyyy-MM-dd HH:mm:ss'),
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