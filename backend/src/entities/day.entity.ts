import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    ManyToMany,
    JoinColumn,
    JoinTable,
    CreateDateColumn, UpdateDateColumn
} from 'typeorm';
import { Week } from './week.entity';
import { Tag } from './tag.entity';

@Entity()
export class Day {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column('numeric')
    humidity: number;

    @Column({ nullable: true })
    notes: string;

    @Column({ type: 'boolean', default: false })
    closed: boolean;

    @ManyToOne(() => Week, week => week.days)
    @JoinColumn({ name: 'weekId' })
    week: Week;

    @Column()
    weekId: number;

    @ManyToMany(() => Tag, tag => tag.days)
    @JoinTable({
        name: 'day_tags',
        joinColumn: { name: 'dayId', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'tagId', referencedColumnName: 'id' }
    })
    tags: Tag[];

    @Column({ nullable: true })
    stage1PhotoUrl: string;

    @Column({ nullable: true })
    stage2PhotoUrl: string;

    @Column({ nullable: true })
    stage3PhotoUrl: string;
}