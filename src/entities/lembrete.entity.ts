import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'lembretes', synchronize: false })
export class Lembrete {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'bigint', nullable: false })
    usuario_id: number
    
    @Column({ type: 'text', nullable: false })
    mensagem: string

    @Column({ type: 'date', nullable: false })
    data: string

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date
}