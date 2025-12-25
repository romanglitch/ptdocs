export interface Plant {
    id: number,
    name: string,
    image: string,
    description: string,
    createdAt: string,
    updatedAt: string,
    startDate: string,
    archive: boolean,
    category: any,
    categoryId?: number,
    weeks: any,
}