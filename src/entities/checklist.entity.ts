import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'checklist_diario', synchronize: false })
export class ChecklistDiario {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'bigint', nullable: true })
    id_usuario: number

    @Column({ type: 'bigint', nullable: true })
    id_empresa: number

    @Column({ type: 'bigint', nullable: true })
    id_veiculo: number

    @Column({ type: 'text', nullable: true })
    farois: string

    @Column({ type: 'text', nullable: true })
    farois_obs: string

    @Column({ type: 'json', nullable: true })
    farois_images: string[]

    @Column({ type: 'text', nullable: true })
    lataria: string

    @Column({ type: 'text', nullable: true })
    lataria_obs: string

    @Column({ type: 'json', nullable: true })
    lataria_images: string[]

    @Column({ type: 'text', nullable: true })
    vidros: string

    @Column({ type: 'text', nullable: true })
    vidros_obs: string

    @Column({ type: 'json', nullable: true })
    vidros_images: string[]

    @Column({ type: 'text', nullable: true })
    hodometro: string

    @Column({ type: 'text', nullable: true })
    hodometro_obs: string

    @Column({ type: 'json', nullable: true })
    hodometro_images: string[]

    @Column({ type: 'text', nullable: true })
    combustivel: string

    @Column({ type: 'text', nullable: true })
    combustivel_obs: string

    @Column({ type: 'json', nullable: true })
    combustivel_images: string[]

    @Column({ type: 'text', nullable: true })
    agua: string

    @Column({ type: 'text', nullable: true })
    agua_obs: string

    @Column({ type: 'json', nullable: true })
    agua_images: string[]

    @Column({ type: 'text', nullable: true })
    luzes: string

    @Column({ type: 'text', nullable: true })
    luzes_obs: string

    @Column({ type: 'json', nullable: true })
    luzes_images: string[]

    @Column({ type: 'text', nullable: true })
    status: string

    @Column({ type: 'text', nullable: true })
    selfie_motorista: string

    @Column({ type: 'text', nullable: true })
    ciencia_inconformidades: string | null

    @Column({ type: 'timestamp', nullable: true })
    ultimo_checklist: string | null

    @Column({ type: 'timestamp', nullable: true })
    created_at: string

    @Column({ type: 'timestamp', nullable: true })
    updated_at: string
}

@Entity({ name: 'checklist_mensal', synchronize: false })
export class ChecklistMensal {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'bigint', nullable: true })
    id_usuario: number

    @Column({ type: 'bigint', nullable: true })
    id_empresa: number

    @Column({ type: 'bigint', nullable: true })
    id_veiculo: number

    @Column({ type: 'text', nullable: true })
    estofados: string

    @Column({ type: 'text', nullable: true })
    estofados_obs: string

    @Column({ type: 'json', nullable: true })
    estofados_images: string[]

    @Column({ type: 'text', nullable: true })
    documentacao: string

    @Column({ type: 'text', nullable: true })
    documentacao_obs: string

    @Column({ type: 'json', nullable: true })
    documentacao_images: string[]

    @Column({ type: 'text', nullable: true })
    volante: string

    @Column({ type: 'text', nullable: true })
    volante_obs: string

    @Column({ type: 'json', nullable: true })
    volante_images: string[]

    @Column({ type: 'text', nullable: true })
    cambio: string

    @Column({ type: 'text', nullable: true })
    cambio_obs: string

    @Column({ type: 'json', nullable: true })
    cambio_images: string[]

    @Column({ type: 'text', nullable: true })
    higiene_interna: string

    @Column({ type: 'text', nullable: true })
    higiene_interna_obs: string

    @Column({ type: 'json', nullable: true })
    higiene_interna_images: string[]

    @Column({ type: 'text', nullable: true })
    porta_malas: string

    @Column({ type: 'text', nullable: true })
    porta_malas_obs: string

    @Column({ type: 'json', nullable: true })
    porta_malas_images: string[]

    @Column({ type: 'text', nullable: true })
    bateria: string

    @Column({ type: 'text', nullable: true })
    bateria_obs: string

    @Column({ type: 'json', nullable: true })
    bateria_images: string[]

    @Column({ type: 'text', nullable: true })
    farois: string

    @Column({ type: 'text', nullable: true })
    farois_obs: string

    @Column({ type: 'json', nullable: true })
    farois_images: string[]

    @Column({ type: 'text', nullable: true })
    status: string

    @Column({ type: 'text', nullable: true })
    selfie_motorista: string

    @Column({ type: 'text', nullable: true })
    ciencia_inconformidades: string | null

    @Column({ type: 'timestamp', nullable: true })
    ultimo_checklist: string

    @Column({ type: 'timestamp', nullable: true })
    created_at: string

    @Column({ type: 'timestamp', nullable: true })
    updated_at: string
}

@Entity({ name: 'checklist_semanal', synchronize: false })
export class ChecklistSemanal {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'bigint', nullable: true })
    id_usuario: number

    @Column({ type: 'bigint', nullable: true })
    id_empresa: number

    @Column({ type: 'bigint', nullable: true })
    id_veiculo: number

    @Column({ type: 'text', nullable: true })
    oleo_motor: string

    @Column({ type: 'text', nullable: true })
    oleo_motor_obs: string

    @Column({ type: 'json', nullable: true })
    oleo_motor_images: string[]

    @Column({ type: 'text', nullable: true })
    agua_limpador: string

    @Column({ type: 'text', nullable: true })
    agua_limpador_obs: string

    @Column({ type: 'json', nullable: true })
    agua_limpador_images: string[]

    @Column({ type: 'text', nullable: true })
    oleo_freio: string

    @Column({ type: 'text', nullable: true })
    oleo_freio_obs: string

    @Column({ type: 'json', nullable: true })
    oleo_freio_images: string[]

    @Column({ type: 'text', nullable: true })
    pneus: string

    @Column({ type: 'text', nullable: true })
    pneus_obs: string

    @Column({ type: 'json', nullable: true })
    pneus_images: string[]

    @Column({ type: 'text', nullable: true })
    escapamento: string

    @Column({ type: 'text', nullable: true })
    escapamento_obs: string

    @Column({ type: 'json', nullable: true })
    escapamento_images: string[]

    @Column({ type: 'text', nullable: true })
    vidros: string

    @Column({ type: 'text', nullable: true })
    vidros_obs: string

    @Column({ type: 'json', nullable: true })
    vidros_images: string[]

    @Column({ type: 'text', nullable: true })
    luzes: string

    @Column({ type: 'text', nullable: true })
    luzes_obs: string

    @Column({ type: 'json', nullable: true })
    luzes_images: string[]

    @Column({ type: 'text', nullable: true })
    status: string

    @Column({ type: 'text', nullable: true })
    selfie_motorista: string

    @Column({ type: 'text', nullable: true })
    ciencia_inconformidades: string | null

    @Column({ type: 'timestamp', nullable: true })
    ultimo_checklist: string

    @Column({ type: 'timestamp', nullable: true })
    created_at: string

    @Column({ type: 'timestamp', nullable: true })
    updated_at: string
}