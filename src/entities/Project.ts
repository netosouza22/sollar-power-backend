import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Address } from "./Address"
import { User } from "./User"

@Entity()
export class Project extends Address {
    @PrimaryGeneratedColumn('increment')
    id: number

    @Column({ type: 'varchar', length: 50})
    company_distribution: string

    @Column({ type: 'float'})
    total_potency: number

    @Column({type: 'varchar' })
    file: string

    @Column({ type: 'varchar', length: 100})
    client_name: string

    @Column({ type: 'varchar'})
    client_cellphone: string

    @Column({type: "uuid"}) // <- Assuming that your primary key type is UUID (OR you can have "char")
    user_id: string;

    @ManyToOne(() => User, (user) => user.projects)
    @JoinColumn({ name: "user_id"})
    user: User

}