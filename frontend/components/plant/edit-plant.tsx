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
	Link, Form, Select, SelectItem, DatePicker, DropdownItem,
} from "@heroui/react";
import React, {useEffect, useState} from "react";
import {fetchCategories, ApiError, putPlant, deleteDay, deleteWeek, deletePlant, archivePlant} from "@/lib/api";
import {parseDate} from "@internationalized/date";
import {Textarea} from "@heroui/input";
import {Dropdown, DropdownMenu, DropdownTrigger} from "@heroui/dropdown";
import { useRouter } from 'next/navigation';

export const EditPlant = (props:any) => {
	const router = useRouter();

	const [categories, setCategories] = useState<any>();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const {isOpen, onOpen, onOpenChange} = useDisclosure();
	const [plantNameValue, setPlantNameValue] = useState<string>(props.plant.name)
	const [plantDescriptionValue, setPlantDescriptionValue] = useState<string>(props.plant.description ?? '')
	const [plantStartDateValue, setPlantStartDateValue] = useState<any>(
		props.plant?.startDate ? parseDate(props.plant.startDate.split('T')[0]) : null
	)
	const [selectedCategoryIds, setSelectedCategoryIds] = React.useState([props.plant.categoryId])

	const [archived, setArchived] = useState<boolean>(props.plant.archive)
	const [isDeleting, setIsDeleting] = useState<boolean>(false)

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

		putPlant(props.plant.id, {
			name: data.plantName,
			description: data.plantDescription,
			startDate: new Date(data.startDate.toString()).toISOString(),
			categoryId: Number(data.plantCategoryId)
		}).catch((err) => {
			console.log(err)
		}).finally(() => {
			props.loadPlant().catch((err:any) => {
				console.log(err)
			}).finally(() => {
				onOpenChange()
			})
		})
	};

	return (
		<>
			<Button variant={'light'} isIconOnly={true} onPress={() => {
				onOpen()
				setLoading(true);
				loadCategories()
				setIsDeleting(false)
			}}>
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
					 stroke="currentColor" className="size-6" style={{marginBottom: ".15rem"}}>
					<path strokeLinecap="round" strokeLinejoin="round"
						  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"/>
				</svg>
			</Button>
			<Modal backdrop={'blur'} isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
				<ModalContent>
					{(onClose) => (
						<Form onSubmit={onSubmit}>
							<ModalHeader>
								Изменить растение
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
									showMonthAndYearPickers
									value={plantStartDateValue}
									onChange={(value:any) => {
										setPlantStartDateValue(value)
									}}
								/>
								<Select
									isRequired
									items={categories ? categories.map((category:any) => ({label: category.name, key: category.id})) : []}
									label="Категория"
									name="plantCategoryId"
									placeholder="Выберите категорию"
									selectedKeys={categories ? selectedCategoryIds : []}
									onSelectionChange={(data:any) => {
										const inputSelectedKeys = Array.from(data);
										setSelectedCategoryIds(inputSelectedKeys)
									}}
								>
									{(category:any) => (
										<SelectItem key={category.id}>{category.label}</SelectItem>
									)}
								</Select>
							</ModalBody>
							<ModalFooter className={'flex w-full flex justify-between'}>
								<Dropdown closeOnSelect={false}>
									<DropdownTrigger>
										<Button variant="bordered" isIconOnly={true}>
											<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
												 strokeWidth={1.5} stroke="currentColor" className="size-6">
												<path strokeLinecap="round" strokeLinejoin="round"
													  d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"/>
											</svg>
										</Button>
									</DropdownTrigger>
									<DropdownMenu aria-label="Действия с растением">
										<DropdownItem key="archive" onPress={async () => {
											archivePlant(props.plant.id, !archived).then((data: any) => {
												setArchived(data.archive)
											}).catch(err => {
												console.log(err)
											}).finally(() => {
												props.loadPlant()
											})
										}}>
											{archived ? 'Убрать из архива' : 'Переместить в архив'}
										</DropdownItem>
										<DropdownItem key="delete" className="text-danger" color="danger" onPress={async () => {
											if (isDeleting) {
												try {
													await props.allDays.forEach((day:any) => {
														deleteDay(day.id)
													})
													await props.weeks.forEach((week:any) => {
														deleteWeek(week.id)
													})
												} catch (err) {
													console.log(err)
												} finally {
													await props.loadPlant().finally(async () => {
														await deletePlant(props.plant.id)
													})
													onClose()
													router.push(`/`);
												}
											}

											setIsDeleting(true)
										}}>
											{!isDeleting ?  'Удалить' : 'Подтвердить удаление'}
										</DropdownItem>
									</DropdownMenu>
								</Dropdown>
								<Button type="submit" color={'primary'}>
									Изменить
								</Button>
							</ModalFooter>
						</Form>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};