"use client"

import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	useDisclosure,
	Checkbox,
	Input,
	Link, Form, Select, SelectItem, DatePicker,
} from "@heroui/react";
import React, {useEffect, useState} from "react";
import {postPlant, fetchCategories, ApiError} from "@/lib/api";
import {useParams, useRouter} from 'next/navigation';
import {Textarea} from "@heroui/input";

export const AddPlant = () => {
	const [categories, setCategories] = useState<any>();
	const [plant, setPlant] = useState<any>();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const router = useRouter();
	const params = useParams()

	const {isOpen, onOpen, onOpenChange} = useDisclosure();
	const [plantNameValue, setPlantNameValue] = useState<string>('')
	const [plantDescriptionValue, setPlantDescriptionValue] = useState<string>('')

	const loadCategories = async () => {
		try {
			setError(null);
			const data = await fetchCategories();

			setCategories(data);
		} catch (err) {
			if (err instanceof ApiError) {
				setError(err.message);
			} else {
				setError('Произошла неизвестная ошибка');
			}
		} finally {
			setLoading(false)
		}
	};
	const onSubmit = async (e:any) => {
		e.preventDefault();

		const data = Object.fromEntries(new FormData(e.currentTarget));

		postPlant({
			name: data.plantName,
			description: data.plantDescription,
			startDate: new Date(data.startDate.toString()).toISOString(),
			categoryId: data.plantCategoryId ? Number(data.plantCategoryId) : null
		}).then((plant:any) => {
			router.push(`/plant/${plant.id}`);
			setTimeout(() => {
				onOpenChange()
				setPlantNameValue('')
				setPlantDescriptionValue('')
			}, 200)
		}).catch((err) => {
			console.log(err)
		})
	};

	return (
		<>
			<Button variant={'light'} isIconOnly={true} onPress={() => {
				onOpen()
				setLoading(true);
				loadCategories()
			}}>
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
					 stroke="currentColor" className="size-6">
					<path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
				</svg>
			</Button>
			<Modal backdrop={'blur'} isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
				<ModalContent>
					{(onClose) => (
						<Form onSubmit={onSubmit}>
							<ModalHeader>
								Добавить растение
							</ModalHeader>
							<ModalBody className={'flex w-full'}>
								<Input
									isRequired
									errorMessage="Проверьте правильность введенных данных"
									minLength={3}
									label="Название"
									name="plantName"
									placeholder="Введите название"
									type="text"
									value={plantNameValue}
									autoComplete={'off'}
									onChange={(e: any) => {
										setPlantNameValue(e.target.value)
									}}
								/>
								<Textarea
									errorMessage="Проверьте правильность введенных данных"
									minLength={3}
									label="Краткое описание"
									name="plantDescription"
									placeholder="Введите краткое описание"
									value={plantDescriptionValue}
									autoComplete={'off'}
									onChange={(e: any) => {
										setPlantDescriptionValue(e.target.value)
									}}
								/>
								<DatePicker
									name="startDate"
									isRequired
									label="Первый день"
								/>
								<Select
									isRequired
									items={categories ? categories.map((category:any) => ({label: category.name, key: category.id})) : []}
									label="Категория"
									name="plantCategoryId"
									placeholder="Выберите категорию"
								>
									{(category:any) => (
										<SelectItem>{category.label}</SelectItem>
									)}
								</Select>
							</ModalBody>
							<ModalFooter className={'flex w-full'}>
								<Button type="submit" color={'primary'}>
									Добавить
								</Button>
							</ModalFooter>
						</Form>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};