import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'notificacoes', synchronize: false })
export class Notificacao {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'bigint', nullable: false })
    usuario_id: number
    
    @Column({ type: 'longtext', nullable: true })
    descricao: string

    @Column({ type: 'timestamp', nullable: false })
    data: string

    @Column({ type: 'json', nullable: true })
    json: any
}

@Entity({ name: 'notificacoes_lidas', synchronize: false })
export class NotificacaoLida {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'bigint', nullable: false })
    usuario_id: number

    @Column({ type: 'bigint', nullable: false })
    notificacao_id: number
}