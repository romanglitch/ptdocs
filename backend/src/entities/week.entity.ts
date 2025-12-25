import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn
} from 'typeorm';
import { Plant } from './plant.entity';
import { Day } from './day.entity';

@Entity()
export class Week {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    description: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Plant, plant => plant.weeks)
    @JoinColumn({ name: 'plantId' })
    plant: Plant;

    @Column()
    plantId: number;

    @OneToMany(() => Day, day => day.week, { cascade: true })
    days: Day[];
}