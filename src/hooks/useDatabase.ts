import { DataSource } from "typeorm"
import "reflect-metadata"

// Import all entities
import User from "@/entities/user.entity"
import { Empresa } from "@/entities/empresa.entity"
import { Veiculo } from "@/entities/veiculo.entity"
import { ChecklistDiario } from "@/entities/checklist.entity"
import { ChecklistMensal } from "@/entities/checklist.entity"
import { ChecklistSemanal } from "@/entities/checklist.entity"
import { Lembrete } from "@/entities/lembrete.entity"
import { Notificacao, NotificacaoLida } from "@/entities/notificacao.entity"
// Add other entities as you convert them:
// import { EcommerceAcesso } from "@/entities/ecommerceAcesso.entity"
// import { EcommerceCupom } from "@/entities/ecommerceCupom.entity"
// ... etc

let dataSource: DataSource | null = null

export default async () => {
    if (dataSource && dataSource.isInitialized) {
        return dataSource
    }

    dataSource = new DataSource({
        type: process.env.DB_CONNECTION as any,
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT ?? '3306'),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE ?? 'localhost',
        synchronize: true,
        logging: true,
        entities: [
            User,
            Empresa,
            Veiculo,
            ChecklistDiario,
            ChecklistMensal,
            ChecklistSemanal,
            Lembrete,
            Notificacao,
            NotificacaoLida,
            // Add other entities here as you convert them
        ],
        subscribers: [],
        migrations: [],
        timezone: 'local',
        dateStrings: true
    })

    if (!dataSource.isInitialized) {
        await dataSource.initialize()
    }

    return dataSource
}