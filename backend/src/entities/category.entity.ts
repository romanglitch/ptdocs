import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Plant } from './plant.entity';

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(() => Plant, plant => plant.category)
    plants: Plant[];
}