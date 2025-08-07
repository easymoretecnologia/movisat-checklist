import { ChecklistDiario } from "@/entities/checklist.entity";
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

    const { id_veiculo, id_usuario, farois, lataria, vidros, hodometro, combustivel, agua, luzes, motivo, selfie_motorista, inicio } = body

    if (!id_veiculo) {
        return NextResponse.json({ message: 'ID do veículo é obrigatório.' }, { status: 422, statusText: 'Unprocessable Entity' })
    }

    if (!id_usuario) {
        return NextResponse.json({ message: 'ID do usuário é obrigatório.' }, { status: 422, statusText: 'Unprocessable Entity' })
    }

    if (!farois) {
        return NextResponse.json({ message: 'Farois é obrigatório.' }, { status: 422, statusText: 'Unprocessable Entity' })
    } else if (farois !== 'sim' && farois !== 'nao' && farois !== 'na') {
        return NextResponse.json({ message: 'Farois inválido.' }, { status: 422, statusText: 'Unprocessable Entity' })
    }

    if (!lataria) {
        return NextResponse.json({ message: 'Lataria é obrigatório.' }, { status: 422, statusText: 'Unprocessable Entity' })
    } else if (lataria !== 'sim' && lataria !== 'nao' && lataria !== 'na') {
        return NextResponse.json({ message: 'Lataria inválida.' }, { status: 422, statusText: 'Unprocessable Entity' })
    }

    if (!vidros) {
        return NextResponse.json({ message: 'Vidros é obrigatório.' }, { status: 422, statusText: 'Unprocessable Entity' })
    } else if (vidros !== 'sim' && vidros !== 'nao' && vidros !== 'na') {
        return NextResponse.json({ message: 'Vidros inválido.' }, { status: 422, statusText: 'Unprocessable Entity' })
    }

    if (!hodometro) {
        return NextResponse.json({ message: 'Hodômetro é obrigatório.' }, { status: 422, statusText: 'Unprocessable Entity' })
    } else if (hodometro !== 'sim' && hodometro !== 'nao' && hodometro !== 'na') {
        return NextResponse.json({ message: 'Hodômetro inválido.' }, { status: 422, statusText: 'Unprocessable Entity' })
    }

    if (!combustivel) {
        return NextResponse.json({ message: 'Combustível é obrigatório.' }, { status: 422, statusText: 'Unprocessable Entity' })
    } else if (combustivel !== 'sim' && combustivel !== 'nao' && combustivel !== 'na') {
        return NextResponse.json({ message: 'Combustível inválido.' }, { status: 422, statusText: 'Unprocessable Entity' })
    }

    if (!agua) {
        return NextResponse.json({ message: 'Água é obrigatória.' }, { status: 422, statusText: 'Unprocessable Entity' })
    } else if (agua !== 'sim' && agua !== 'nao' && agua !== 'na') {
        return NextResponse.json({ message: 'Água inválida.' }, { status: 422, statusText: 'Unprocessable Entity' })
    }

    if (!luzes) {
        return NextResponse.json({ message: 'Luzes é obrigatório.' }, { status: 422, statusText: 'Unprocessable Entity' })
    } else if (luzes !== 'sim' && luzes !== 'nao' && luzes !== 'na') {
        return NextResponse.json({ message: 'Luzes inválido.' }, { status: 422, statusText: 'Unprocessable Entity' })
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
        const repo = db.getRepository(ChecklistDiario)

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
        const faroisImagePaths = body.farois_images ? await saveBase64Images(body.farois_images, 'farois') : []
        const latariaImagePaths = body.lataria_images ? await saveBase64Images(body.lataria_images, 'lataria') : []
        const vidrosImagePaths = body.vidros_images ? await saveBase64Images(body.vidros_images, 'vidros') : []
        const hodometroImagePaths = body.hodometro_images ? await saveBase64Images(body.hodometro_images, 'hodometro') : []
        const combustivelImagePaths = body.combustivel_images ? await saveBase64Images(body.combustivel_images, 'combustivel') : []
        const aguaImagePaths = body.agua_images ? await saveBase64Images(body.agua_images, 'agua') : []
        const luzesImagePaths = body.luzes_images ? await saveBase64Images(body.luzes_images, 'luzes') : []
        
        const checklist = new ChecklistDiario()
        checklist.id_usuario = Number(user.id)
        checklist.id_empresa = Number(user.id_empresa)
        checklist.id_veiculo = Number(id_veiculo)
        checklist.farois = farois === 'sim' ? 'Sim' : 'Não'
        checklist.farois_obs = body.farois_obs ?? null
        checklist.farois_images = faroisImagePaths
        checklist.lataria = lataria === 'sim' ? 'Sim' : 'Não'
        checklist.lataria_obs = body.lataria_obs ?? null
        checklist.lataria_images = latariaImagePaths
        checklist.vidros = vidros === 'sim' ? 'Sim' : 'Não'
        checklist.vidros_obs = body.vidros_obs ?? null
        checklist.vidros_images = vidrosImagePaths
        checklist.hodometro = hodometro === 'sim' ? 'Sim' : 'Não'
        checklist.hodometro_obs = body.hodometro_obs ?? null
        checklist.hodometro_images = hodometroImagePaths
        checklist.combustivel = combustivel === 'sim' ? 'Sim' : 'Não'
        checklist.combustivel_obs = body.combustivel_obs ?? null
        checklist.combustivel_images = combustivelImagePaths
        checklist.agua = agua === 'sim' ? 'Sim' : 'Não'
        checklist.agua_obs = body.agua_obs ?? null
        checklist.agua_images = aguaImagePaths
        checklist.luzes = luzes === 'sim' ? 'Sim' : 'Não'
        checklist.luzes_obs = body.luzes_obs ?? null
        checklist.luzes_images = luzesImagePaths
        checklist.status = motivo === 'uso' ? 'Uso' : 'Devolução'
        checklist.selfie_motorista = selfie_motorista
        checklist.ultimo_checklist = DateTime.now().setZone('America/Sao_Paulo').toFormat('yyyy-MM-dd HH:mm:ss')
        checklist.ciencia_inconformidades = null
        checklist.created_at = inicio
        checklist.updated_at = DateTime.now().setZone('America/Sao_Paulo').toFormat('yyyy-MM-dd HH:mm:ss')

        await repo.save(checklist)

        await repoVeiculo.update({ id: Number(id_veiculo)}, { status: null, id_usuario: null, tipo_checklist: null, ultimo_checklist: DateTime.now().setZone('America/Sao_Paulo').toFormat('yyyy-MM-dd HH:mm:ss') })

        const repoNotificacao = db.getRepository(Notificacao)
        
        const notificacao = repoNotificacao.create({
            empresa_id: Number(user.id_empresa),
            usuario_id: Number(user.id),
            descricao: `Checklist diário enviado para o veículo ${veiculo.placa}!`,
            data: DateTime.now().setZone('America/Sao_Paulo').toFormat('yyyy-MM-dd HH:mm:ss'),
            json: {
                id_veiculo: Number(id_veiculo),
                veiculo: veiculo,
                checklist: checklist,
            }
        })
        await repoNotificacao.save(notificacao)

        if (farois === 'sim' || lataria === 'sim' || vidros === 'sim' || hodometro === 'sim' || combustivel === 'sim' || agua === 'sim' || luzes === 'sim') {
            const notificacaoInconformidades = repoNotificacao.create({
                empresa_id: Number(user.id_empresa),
                usuario_id: Number(user.id),
                descricao: `Checklist diário (#${checklist.id}) com inconformidades!`,
                data: DateTime.now().setZone('America/Sao_Paulo').toFormat('yyyy-MM-dd HH:mm:ss'),
                json: {
                    id_veiculo: Number(id_veiculo),
                    veiculo: veiculo,
                    checklist: checklist,
                }
            })

            await repoNotificacao.save(notificacaoInconformidades)
        }

        

        return NextResponse.json({ message: 'Checklist enviado com sucesso.' }, { status: 200, statusText: 'OK' })
    } catch (error) {
        useLog(error)
        return NextResponse.json({ message: 'Erro ao salvar checklist.' }, { status: 500, statusText: 'Internal Server Error' })
    }
    
    
}