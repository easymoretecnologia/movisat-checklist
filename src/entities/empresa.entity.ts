import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'empresas', synchronize: false })
export class Empresa {
    @PrimaryGeneratedColumn()
    id: number
    
    @Column({ type: 'varchar', length: 255 })
    cnpj: string

    @Column({ type: 'varchar', length: 255 })
    nome_fantasia: string

    @Column({ type: 'varchar', length: 255 })
    email: string

    @Column({ type: 'varchar', length: 255 })
    contato_responsavel: string

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date
}