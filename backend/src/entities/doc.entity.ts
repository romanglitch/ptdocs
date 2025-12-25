import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

interface ContentJSON {
    blocks: any[];
    time: number;
    version: string;
}

@Entity()
export class Doc {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column({ type: 'jsonb', nullable: true })
    content: ContentJSON;
}