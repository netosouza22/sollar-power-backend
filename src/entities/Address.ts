import { Column } from "typeorm"

export abstract class Address {

    @Column({type: 'varchar'})
    cep: string

    @Column({type: 'varchar'})
    state: string

    @Column({type: 'varchar'})
    city: string

    @Column({type: 'varchar'})
    neighborhood: string 

    @Column({type: 'varchar'})
    address: string 

    @Column({ nullable: true})
    number: number

}