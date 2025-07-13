import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity('usuarios')
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'bigint', unsigned: true })
    id_empresa: number

    @Column({ length: 255 })
    nome: string

    @Column({ length: 255, unique: true })
    email: string

    @Column({ length: 1020 })
    password: string

    @Column({ type: 'integer' })
    tipo_acesso: number

    @Column({ length: 20, nullable: true })
    cpf: string

    @Column({ length: 20, nullable: true })
    telefone: string

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date

    @Column({ length: 1020, nullable: true })
    remember_token: string

    @Column({ length: 1020, nullable: true })
    status: string

    @Column({ length: 1020, nullable: true })
    alertas: string
}

export default User 