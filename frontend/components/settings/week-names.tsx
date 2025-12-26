"use client"
import React, {useEffect, useState} from "react";
import {
	ApiError,
	fetchWeekNames,
	postWeekName,
} from "@/lib/api";
import {Form, Input, Button} from "@heroui/react";
import {Card, CardBody, CardFooter, CardHeader} from "@heroui/card";
import {Divider} from "@heroui/divider";
import {WeekName} from "@/components/week-name";
import {Spinner} from "@heroui/spinner";

export const WeekNames = () => {
	const [weekNames, setWeekNames] = useState<any>();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [weekNameValue, setWeekNameValue] = useState<string>('')

	const loadWeekNames = async () => {
		try {
			setError(null);
			const data = await fetchWeekNames();

			setWeekNames(data);
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

		postWeekName({
			name: data.weekName,
		}).catch((err) => {
			console.log(err)
		}).finally(() => {
			loadWeekNames()
			setWeekNameValue('')
		});
	};

	useEffect(() => {
		setLoading(true);
		loadWeekNames();
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
					<p className="text-md">Названия этапов</p>
				</div>
			</CardHeader>
			<Divider />
			<CardBody>
				{weekNames && weekNames.length ? (
					<div className={'flex flex-col mb-2'}>
						{weekNames.map((weekName: any, index:number) => (
							<WeekName key={weekName.id} weekName={weekName} index={index} loadWeekNames={loadWeekNames}/>
						))}
					</div>
				) : (
					<div className={'text-sm'}>Добавьте этап</div>
				)}
			</CardBody>
			<Divider />
			<CardFooter>
				<Form className="w-full flex-row" onSubmit={onSubmit}>
					<Input
						isRequired
						errorMessage="Проверьте правильность введенных данных"
						minLength={2}
						name="weekName"
						placeholder="Название этапа"
						type="text"
						value={weekNameValue}
						autoComplete={'off'}
						onChange={(e: any) => {
							setWeekNameValue(e.target.value)
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
