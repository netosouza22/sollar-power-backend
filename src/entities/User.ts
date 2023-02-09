import { Column, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Address } from "./Address"
import { Project } from "./Project"

@Entity()
export class User extends Address {
    @PrimaryGeneratedColumn('increment')
    id: number

    @Column({type: 'varchar', length: 100})
    name: string

    @Column({type: 'varchar', length: 100})
    email: string

    @Column({type: 'varchar', select: false})
    password: string

    @Column({type: 'varchar', length: 15})
    cellphone: string;

    @Column({type:"varchar", unique: true, length:14,})
    cpf: string

    @OneToMany(() => Project, (project) => project.user, { cascade: true })
    projects: Project[]

    @DeleteDateColumn()  
    deletedAt?: Date;

}