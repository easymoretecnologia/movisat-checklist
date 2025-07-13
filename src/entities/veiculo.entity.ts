import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'veiculos', synchronize: false })
export class Veiculo {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'bigint', unsigned: true, nullable: true })
    id_usuario: number | null
    
    @Column({ type: 'bigint', unsigned: true })
    id_empresa: number

    @Column({ type: 'varchar', length: 255 })
    cor: string

    @Column({ type: 'varchar', length: 255 })
    modelo: string

    @Column({ type: 'varchar', length: 255 })
    placa: string

    @Column({ type: 'varchar', length: 255 })
    apelido: string

    @Column({ type: 'varchar', length: 255, nullable: true })
    status: string | null

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date

    @Column({ type: 'timestamp', nullable: true })
    ultimo_checklist: string
    
    @Column({ type: 'bigint', nullable: true })
    id_checklist: number | null

    @Column({ type: 'varchar', length: 255, nullable: true })
    tipo_checklist: 'diario' | 'semanal' | 'mensal' | null
}