import {Plant} from "@/types/plant";
import {Week} from "@/types/week"
import {Day} from "@/types/day";
import {Tag} from "@/types/tag";
import {Category} from "@/types/category";
import {WeekName} from "@/types/weekname";
import {Doc} from "@/types/doc";

const API_BASE_URL = process.env.NEXT_PUBLIC_REST_API;

export class ApiError extends Error {
    constructor(
        message: string,
        public status: number,
        public statusText: string
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

export async function postPlant(data:object): Promise<Plant[]> {
    try {
        const url = `${API_BASE_URL}/plants`;

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const response = await fetch(url, {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            new ApiError(
                `Ошибка создания растения: ${response.statusText}`,
                response.status,
                response.statusText
            );
        }

        return await response.json();
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError('Не удалось подключиться к серверу', 0, 'Network Error');
    }
}

export async function putPlant(plantId:number, data:object): Promise<Plant> {
    try {
        const url = `${API_BASE_URL}/plants/${plantId}`;

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const response = await fetch(url, {
            method: 'PUT',
            headers: myHeaders,
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            new ApiError(
                `Ошибка изменения растения: ${response.statusText}`,
                response.status,
                response.statusText
            );
        }

        return await response.json();
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError('Не удалось подключиться к серверу', 0, 'Network Error');
    }
}

export async function deletePlant(plantId:number): Promise<string> {
    try {
        const url = `${API_BASE_URL}/plants/${plantId}`;

        const response = await fetch(url, {
            method: 'DELETE'
        });

        if (!response.ok) {
            new ApiError(
                `Ошибка удаления растения: ${response.statusText}`,
                response.status,
                response.statusText
            );
        }

        return await response.text();
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError('Не удалось подключиться к серверу', 0, 'Network Error');
    }
}

export async function archivePlant(plantId:number, isArchive:boolean): Promise<Tag[]> {
    try {
        const url = `${API_BASE_URL}/plants/${plantId}/${isArchive ? 'archive' : 'unarchive'}`;

        const response = await fetch(url, {
            method: "PATCH",
            redirect: "follow"
        });

        if (!response.ok) {
            new ApiError(
                `Ошибка архивации растения: ${response.statusText}`,
                response.status,
                response.statusText
            );
        }

        return await response.json();
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError('Не удалось подключиться к серверу', 0, 'Network Error');
    }
}

export async function fetchPlants(includeArchive:boolean = false, categoryId:any): Promise<Plant[]> {
    const REQUEST_URL = new URL(`${API_BASE_URL}/plants`);

    includeArchive ? REQUEST_URL.searchParams.set('includeArchived', 'true') : false;
    categoryId ? REQUEST_URL.searchParams.set('categoryId', categoryId) : false;

    try {
        const response = await fetch(REQUEST_URL, {
            method: 'GET'
        });

        if (!response.ok) {
            new ApiError(
                `Ошибка загрузки растений: ${response.statusText}`,
                response.status,
                response.statusText
            );
        }

        return await response.json();
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError('Не удалось подключиться к серверу', 0, 'Network Error');
    }
}

export async function fetchWeeks(plantId:number): Promise<Week[]> {
    try {
        const url = `${API_BASE_URL}/weeks/plant/${plantId}`;
        const response = await fetch(url, {
            method: 'GET'
        });

        if (!response.ok) {
            new ApiError(
                `Ошибка загрузки блоков недель: ${response.statusText}`,
                response.status,
                response.statusText
            );
        }

        return await response.json();
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError('Не удалось подключиться к серверу', 0, 'Network Error');
    }
}

export async function fetchPlantById(id: number): Promise<Plant> {
    try {
        const url = `${API_BASE_URL}/plants/${id}`;
        const response = await fetch(url, {
            method: 'GET'
        });

        if (!response.ok) {
            new ApiError(
                `Ошибка загрузки растений: ${response.statusText}`,
                response.status,
                response.statusText
            );
        }

        return await response.json();
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError('Не удалось подключиться к серверу', 0, 'Network Error');
    }
}

export async function addWeek(plantId:number): Promise<Week[]> {
    try {
        const url = `${API_BASE_URL}/weeks`;

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const response = await fetch(url, {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify({
                "plantId": plantId
            }),
        });

        if (!response.ok) {
            new ApiError(
                `Ошибка добавления недели: ${response.statusText}`,
                response.status,
                response.statusText
            );
        }

        return await response.json();
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError('Не удалось подключиться к серверу', 0, 'Network Error');
    }
}

export async function deleteWeek(weekId:number): Promise<string> {
    try {
        const url = `${API_BASE_URL}/weeks/${weekId}`;

        const response = await fetch(url, {
            method: 'DELETE'
        });

        if (!response.ok) {
            new ApiError(
                `Ошибка удаления недели: ${response.statusText}`,
                response.status,
                response.statusText
            );
        }

        return await response.text();
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError('Не удалось подключиться к серверу', 0, 'Network Error');
    }
}

export async function addDay(weekId:number, daysCount:number): Promise<Day[]> {
    try {
        const url = `${API_BASE_URL}/days/multiple`;

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const response = await fetch(url, {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify({
                "humidity": 0,
                "weekId": weekId,
                "daysCount": daysCount
            }),
        });

        if (!response.ok) {
            new ApiError(
                `Ошибка добавления дней: ${response.statusText}`,
                response.status,
                response.statusText
            );
        }

        return await response.json();
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError('Не удалось подключиться к серверу', 0, 'Network Error');
    }
}

export async function putDay(dayId:number, data:object): Promise<Day> {
    try {
        const url = `${API_BASE_URL}/days/${dayId}`;

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const response = await fetch(url, {
            method: 'PUT',
            headers: myHeaders,
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            new ApiError(
                `Ошибка создания растения: ${response.statusText}`,
                response.status,
                response.statusText
            );
        }

        return await response.json();
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError('Не удалось подключиться к серверу', 0, 'Network Error');
    }
}

export async function uploadDayPhoto(dayId:number, form_data:any): Promise<Day[]> {
    try {
        const url = `${API_BASE_URL}/days/${dayId}/upload-stages`;

        const response = await fetch(url, {
            method: "PATCH",
            body: form_data,
            redirect: "follow"
        });

        if (!response.ok) {
            new ApiError(
                `Ошибка загрузки фото дня: ${response.statusText}`,
                response.status,
                response.statusText
            );
        }

        return await response.json();
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError('Не удалось подключиться к серверу', 0, 'Network Error');
    }
}

export async function deleteDayPhoto(dayId:number): Promise<string> {
    try {
        const url = `${API_BASE_URL}/days/${dayId}/photo/1`;

        const response = await fetch(url, {
            method: 'DELETE'
        });

        if (!response.ok) {
            new ApiError(
                `Ошибка удаления фото дня: ${response.statusText}`,
                response.status,
                response.statusText
            );
        }

        return await response.text();
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError('Не удалось подключиться к серверу', 0, 'Network Error');
    }
}

export async function deleteDay(dayId:number): Promise<string> {
    try {
        const url = `${API_BASE_URL}/days/${dayId}`;

        const response = await fetch(url, {
            method: 'DELETE'
        });

        if (!response.ok) {
            new ApiError(
                `Ошибка удаления дня: ${response.statusText}`,
                response.status,
                response.statusText
            );
        }

        return await response.text();
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError('Не удалось подключиться к серверу', 0, 'Network Error');
    }
}

export async function fetchTags(): Promise<Tag[]> {
    try {
        const url = `${API_BASE_URL}/tags`;
        const response = await fetch(url, {
            method: 'GET'
        });

        if (!response.ok) {
            new ApiError(
                `Ошибка загрузки тегов: ${response.statusText}`,
                response.status,
                response.statusText
            );
        }

        return await response.json();
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError('Не удалось подключиться к серверу', 0, 'Network Error');
    }
}

export async function postTag(data:object): Promise<Tag[]> {
    try {
        const url = `${API_BASE_URL}/tags`;

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const response = await fetch(url, {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            new ApiError(
                `Ошибка создания тега: ${response.statusText}`,
                response.status,
                response.statusText
            );
        }

        return await response.json();
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError('Не удалось подключиться к серверу', 0, 'Network Error');
    }
}

export async function uploadTagIcon(tagId:number, form_data:any): Promise<Tag[]> {
    try {
        const url = `${API_BASE_URL}/tags/${tagId}/upload-icon`;

        const response = await fetch(url, {
            method: "PATCH",
            body: form_data,
            redirect: "follow"
        });

        if (!response.ok) {
            new ApiError(
                `Ошибка загрузки иконки тега: ${response.statusText}`,
                response.status,
                response.statusText
            );
        }

        return await response.json();
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError('Не удалось подключиться к серверу', 0, 'Network Error');
    }
}

export async function deleteTag(tagId:number): Promise<string> {
    try {
        const url = `${API_BASE_URL}/tags/${tagId}`;
        const response = await fetch(url, {
            method: 'DELETE'
        });

        if (!response.ok) {
            new ApiError(
                `Ошибка удаления недели: ${response.statusText}`,
                response.status,
                response.statusText
            );
        }

        return await response.text();
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError('Не удалось подключиться к серверу', 0, 'Network Error');
    }
}

export async function fetchCategories(): Promise<Category[]> {
    try {
        const url = `${API_BASE_URL}/categories`;
        const response = await fetch(url, {
            method: 'GET'
        });

        if (!response.ok) {
            new ApiError(
                `Ошибка загрузки категорий: ${response.statusText}`,
                response.status,
                response.statusText
            );
        }

        return await response.json();
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError('Не удалось подключиться к серверу', 0, 'Network Error');
    }
}

export async function postCategory(data:object): Promise<Category> {
    try {
        const url = `${API_BASE_URL}/categories`;

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const response = await fetch(url, {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            new ApiError(
                `Ошибка создания тега: ${response.statusText}`,
                response.status,
                response.statusText
            );
        }

        return await response.json();
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError('Не удалось подключиться к серверу', 0, 'Network Error');
    }
}

export async function deleteCategory(categoryId:number): Promise<string> {
    try {
        const url = `${API_BASE_URL}/categories/${categoryId}`;
        const response = await fetch(url, {
            method: 'DELETE'
        });

        if (!response.ok) {
            new ApiError(
                `Ошибка удаления категории: ${response.statusText}`,
                response.status,
                response.statusText
            );
        }

        return await response.text();
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError('Не удалось подключиться к серверу', 0, 'Network Error');
    }
}

export async function fetchWeekNames(): Promise<WeekName[]> {
    try {
        const url = `${API_BASE_URL}/weeknames`;
        const response = await fetch(url, {
            method: 'GET'
        });

        if (!response.ok) {
            new ApiError(
                `Ошибка загрузки названий недель: ${response.statusText}`,
                response.status,
                response.statusText
            );
        }

        return await response.json();
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError('Не удалось подключиться к серверу', 0, 'Network Error');
    }
}

export async function postWeekName(data:object): Promise<WeekName[]> {
    try {
        const url = `${API_BASE_URL}/weeknames`;

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const response = await fetch(url, {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            new ApiError(
                `Ошибка создания названия этапа: ${response.statusText}`,
                response.status,
                response.statusText
            );
        }

        return await response.json();
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError('Не удалось подключиться к серверу', 0, 'Network Error');
    }
}

export async function putWeekName(weekNameId:number, data:object): Promise<WeekName> {
    try {
        const url = `${API_BASE_URL}/weeknames/${weekNameId}`;

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const response = await fetch(url, {
            method: 'PUT',
            headers: myHeaders,
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            new ApiError(
                `Ошибка изменения названия этапа: ${response.statusText}`,
                response.status,
                response.statusText
            );
        }

        return await response.json();
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError('Не удалось подключиться к серверу', 0, 'Network Error');
    }
}

export async function deleteWeekName(weekNameId:number): Promise<string> {
    try {
        const url = `${API_BASE_URL}/weeknames/${weekNameId}`;
        const response = await fetch(url, {
            method: 'DELETE'
        });

        if (!response.ok) {
            new ApiError(
                `Ошибка удаления названия этапа: ${response.statusText}`,
                response.status,
                response.statusText
            );
        }

        return await response.text();
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError('Не удалось подключиться к серверу', 0, 'Network Error');
    }
}

export async function fetchDocs(): Promise<Doc[]> {
    try {
        const url = `${API_BASE_URL}/docs`;
        const response = await fetch(url, {
            method: 'GET'
        });

        if (!response.ok) {
            new ApiError(
                `Ошибка загрузки документов: ${response.statusText}`,
                response.status,
                response.statusText
            );
        }

        return await response.json();
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError('Не удалось подключиться к серверу', 0, 'Network Error');
    }
}

export async function postDocs(data:object): Promise<Doc[]> {
    try {
        const url = `${API_BASE_URL}/docs`;

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const response = await fetch(url, {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            new ApiError(
                `Ошибка создания документа: ${response.statusText}`,
                response.status,
                response.statusText
            );
        }

        return await response.json();
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError('Не удалось подключиться к серверу', 0, 'Network Error');
    }
}

export async function putDocs(docId:number, data:object): Promise<Doc> {
    try {
        const url = `${API_BASE_URL}/docs/${docId}`;

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const response = await fetch(url, {
            method: 'PUT',
            headers: myHeaders,
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            new ApiError(
                `Ошибка изменения документа: ${response.statusText}`,
                response.status,
                response.statusText
            );
        }

        return await response.json();
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError('Не удалось подключиться к серверу', 0, 'Network Error');
    }
}

export async function deleteDocs(docId:number): Promise<string> {
    try {
        const url = `${API_BASE_URL}/docs/${docId}`;
        const response = await fetch(url, {
            method: 'DELETE'
        });

        if (!response.ok) {
            new ApiError(
                `Ошибка удаления документа: ${response.statusText}`,
                response.status,
                response.statusText
            );
        }

        return await response.text();
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError('Не удалось подключиться к серверу', 0, 'Network Error');
    }
}