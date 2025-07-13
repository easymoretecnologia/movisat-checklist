import { DataSource } from 'typeorm'
import 'reflect-metadata'

// Import all entities
import User from '@/entities/user.entity'
import { Empresa } from '@/entities/empresa.entity'
import { Veiculo } from '@/entities/veiculo.entity'
import { ChecklistDiario } from '@/entities/checklist.entity'
import { ChecklistMensal } from '@/entities/checklist.entity'
import { ChecklistSemanal } from '@/entities/checklist.entity'
import { Lembrete } from '@/entities/lembrete.entity'
import { Notificacao, NotificacaoLida } from '@/entities/notificacao.entity'

export const AppDataSource = new DataSource({
  type: process.env.DB_CONNECTION as any,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? '3306'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true,
  logging: false,
  entities: [User, Empresa, Veiculo, ChecklistDiario, ChecklistMensal, ChecklistSemanal, Lembrete, Notificacao, NotificacaoLida],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: ['src/subscribers/**/*.ts'],
  timezone: 'local',
  dateStrings: true,
})

// Singleton pattern for DataSource
let dataSource: DataSource | null = null

export const getDataSource = async (): Promise<DataSource> => {
  if (dataSource && dataSource.isInitialized) {
    return dataSource
  }

  dataSource = AppDataSource

  if (!dataSource.isInitialized) {
    await dataSource.initialize()
  }

  return dataSource
} 