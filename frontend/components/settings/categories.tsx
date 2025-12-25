"use client"
import React, {useEffect, useState} from "react";
import {ApiError, deleteCategory, fetchCategories, postCategory} from "@/lib/api";
import {Image} from "@heroui/image";
import {Form, Input, Button} from "@heroui/react";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem} from "@heroui/react";
import {Card, CardBody, CardFooter, CardHeader} from "@heroui/card";
import {Divider} from "@heroui/divider";
import {Spinner} from "@heroui/spinner";

export const Categories = () => {
	const [categories, setCategories] = useState<any>();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [categoryNameValue, setCategoryNameValue] = useState<string>('')

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

	const onSubmit = (e:any) => {
		e.preventDefault();

		const data = Object.fromEntries(new FormData(e.currentTarget));

		postCategory({
			name: data.categoryName
		}).catch((err) => {
			console.log(err)
		}).finally(() => {
			loadCategories()
			setCategoryNameValue('')
		});
	};

	useEffect(() => {
		setLoading(true);
		loadCategories();
	}, []);

	if (loading) {
		return (
			<div className="flex justify-center">
				<Spinner color="default" labelColor="foreground" size="lg" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex">
				<h2 className="text-xl font-bold text-danger mb-2">Ошибка загрузки</h2>
				<p className="text-default-600">{error}</p>
			</div>
		);
	}

	return (
		<Card>
			<CardHeader className="flex gap-3">
				<div className="flex flex-col">
					<p className="text-md">Настройка категорий</p>
				</div>
			</CardHeader>
			<Divider />
			<CardBody>
				{categories && categories.length ? (
					<div className={'flex flex-col mb-2'}>
						{categories.map((category: any) => (
							<Dropdown key={category.id}>
								<DropdownTrigger>
									<Button className={'justify-start'} isDisabled={category.plants.length > 0} variant={'light'}>
										{category.name} ({category.plants.length})
									</Button>
								</DropdownTrigger>
								<DropdownMenu aria-label="Действия с категорией">
									<DropdownItem key="delete-tag" onClick={(e: any) => {
										deleteCategory(category.id).catch((err) => {
											console.log(err)
										}).finally(() => {
											loadCategories()
										})
									}}>Удалить категорию</DropdownItem>
								</DropdownMenu>
							</Dropdown>
						))}
					</div>
				) : (
					<div className={'text-sm'}>Нет категорий</div>
				)}
			</CardBody>
			<Divider />
			<CardFooter>
				<Form className="w-full flex-row" onSubmit={onSubmit}>
					<Input
						isRequired
						errorMessage="Проверьте правильность введенных данных"
						minLength={2}
						name="categoryName"
						placeholder="Название категории"
						type="text"
						value={categoryNameValue}
						autoComplete={'off'}
						onChange={(e: any) => {
							setCategoryNameValue(e.target.value)
						}}
					/>
					<Button type="submit" variant="bordered">
						Добавить
					</Button>
				</Form>
			</CardFooter>
		</Card>
	);
};
