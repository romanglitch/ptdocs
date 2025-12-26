export interface Day {
    id: number,
    createdAt: string,
    updatedAt: string,
    humidity: number,
    notes: string,
    closed: boolean,
    weekId: number,
    tags: any,
    stage1PhotoUrl?: string,
    stage2PhotoUrl?: string,
    stage3PhotoUrl?: string,
}