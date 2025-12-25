"use client"
import React, {useEffect, useState} from "react";
import {ApiError, deleteTag, fetchTags, postTag, uploadTagIcon} from "@/lib/api";
import {Image} from "@heroui/image";
import {Form, Input, Button} from "@heroui/react";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem} from "@heroui/react";
import {Card, CardBody, CardFooter, CardHeader} from "@heroui/card";
import {Divider} from "@heroui/divider";
import {Spinner} from "@heroui/spinner";

export const Tags = () => {
	const [tags, setTags] = useState<any>();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [tagNameValue, setTagNameValue] = useState<string>('')
	const [clickedTagId, setClickedTagId] = useState<number>()

	const loadTags = async () => {
		try {
			setError(null);
			const data = await fetchTags();

			setTags(data);
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

		postTag({
			name: data.tagName,
			description: ""
		}).catch((err) => {
			console.log(err)
		}).finally(() => {
			loadTags()
			setTagNameValue('')
		});
	};

	useEffect(() => {
		setLoading(true);
		loadTags();
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
					<p className="text-md">Настройка тегов</p>
				</div>
			</CardHeader>
			<Divider />
			<CardBody>
				{tags && tags.length ? (
					<div className={'flex flex-col mb-2'}>
						{tags.map((tag: any) => (
							<Dropdown key={tag.id}>
								<DropdownTrigger>
									<Button className={'justify-start'} variant="light">
										<Image className={'object-contain'}
											   src={`${process.env.NEXT_PUBLIC_REST_API}${tag.iconUrl}`} width={18}
											   height={18} alt={tag.name}/>
										{tag.name}
									</Button>
								</DropdownTrigger>
								<DropdownMenu aria-label="Действия с тегом">
									<DropdownItem key="delete-tag" onClick={(e: any) => {
										deleteTag(tag.id).catch((err) => {
											console.log(err)
										}).finally(() => {
											loadTags()
										})
									}}>Удалить тег</DropdownItem>
									<DropdownItem key="load-icon" onClick={(e: any) => {
										const fileInput = document.getElementsByName('icon')[0] as HTMLInputElement;
										fileInput.click();
										setClickedTagId(tag.id)
									}}>
										Загрузить иконку
									</DropdownItem>
								</DropdownMenu>
							</Dropdown>
						))}
					</div>
				) : (
					<div className={'text-sm'}>Нет тегов</div>
				)}
			</CardBody>
			<Divider />
			<CardFooter>
				<input name="icon" hidden={true} type="file" onChange={(e: any) => {
					e.preventDefault();

					const formData = new FormData();

					formData.append("icon", e.target.files[0]);

					if (clickedTagId) {
						uploadTagIcon(clickedTagId, formData).catch((err) => {
							console.log(err)
						}).finally(() => {
							loadTags();
						})
					}
				}}/>
				<Form className="w-full flex-row" onSubmit={onSubmit}>
					<Input
						isRequired
						errorMessage="Проверьте правильность введенных данных"
						minLength={2}
						name="tagName"
						placeholder="Название тега"
						type="text"
						value={tagNameValue}
						autoComplete={'off'}
						onChange={(e: any) => {
							setTagNameValue(e.target.value)
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
