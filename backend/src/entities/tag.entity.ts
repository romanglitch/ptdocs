import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Day } from './day.entity';

@Entity()
export class Tag {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    iconUrl: string;

    @ManyToMany(() => Day, day => day.tags)
    days: Day[];
}