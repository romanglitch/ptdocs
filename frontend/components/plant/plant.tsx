"use client"
import React, {useEffect, useState} from "react";
import {
	addDay,
	addWeek,
	ApiError,
	archivePlant,
	deleteDay,
	deletePlant,
	deleteWeek,
	fetchPlantById,
	fetchTags, fetchWeekNames
} from "@/lib/api";
import {useParams} from 'next/navigation'
import {Button} from "@heroui/button";
import {useRouter} from 'next/navigation';

import {PlantHeader} from "@/components/plant/plant-header";
import {PlantWeek} from "@/components/plant/plant-week";

import {Spinner} from "@heroui/spinner";
import {EditPlant} from "@/components/plant/edit-plant";

export default function Plant() {
	const params = useParams()
	const router = useRouter();
	const [plant, setPlant] = useState<any>();
	const [tags, setTags] = useState<any>();
	const [weekNames, setWeekNames] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [startIndex, setStartIndex] = useState<number>(0);

	const [newDays, setNewDays] = useState<any[]>([])

	const loadPlant = async () => {
		try {
			setError(null);
			const data = await fetchPlantById(Number(params.id));

			setPlant(data);
		} catch (err) {
			if (err instanceof ApiError) {
				setError(err.message);
			} else {
				setError('Произошла неизвестная ошибка');
			}
		} finally {
			setLoading(false);
		}
	};

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
		}
	};

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
		}
	};

	useEffect(() => {
		setLoading(true);
		loadPlant();
		loadWeekNames();
		loadTags();
	}, []);

	if (loading) {
		return (
			<div className="flex items-center justify-center">
				<Spinner color="default" labelColor="foreground" size="lg"/>
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

	const allDays = plant.weeks?.flatMap((week: any) => week.days || []) || []
	const lastWeek = plant.weeks ? plant.weeks[plant.weeks.length - 1] : null
	const lastDay = lastWeek?.days[lastWeek.days.length - 1]
	const allDaysPhotos = allDays.filter((day: any) => day.stage1PhotoUrl);

	return (
		<div className="plant w-full">
			{!plant ? (
				<div className="text-center">
					<p className="text-default-500">Растение не найдено</p>
				</div>
			) : (
				!plant.error ? (
					<>
						<PlantHeader plant={plant} allDays={allDays} weeks={plant.weeks} loadPlant={loadPlant} allDaysPhotos={allDaysPhotos}/>
						<div className={'mb-3 opacity-60 font-normal'}>
							{plant.description}
						</div>
						<div className={'plant-weeks flex flex-col gap-5 mb-18'}>
							{plant.weeks && plant.weeks.length ? (
								plant.weeks.map((week: any, index: number) => (
									<PlantWeek plant={plant} tags={tags} weekNames={weekNames} allDays={allDays}
											   newDays={newDays} week={week} key={week.id} index={index}
											   loadPlant={loadPlant} setStartIndex={setStartIndex}/>
								))
							) : (
								<div>Добавьте этап</div>
							)}
						</div>
						{plant.weeks ? (
							<div
								className={'plant-footer flex items-center gap-2 fixed bottom-3 left-0 right-0 w-max m-auto z-10'}>
								<div
									className={'flex items-center p-1 font-normal text-small subpixel-antialiased bg-background/30 backdrop-blur backdrop-saturate-150 border-white/20 border-1 overflow-hidden rounded-large shadow-small'}>
									<Button variant={'light'} isIconOnly={true} onPress={(e) => window.scrollTo({
										top: document.body.scrollHeight,
										behavior: 'smooth'
									})}>
										<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
											 strokeWidth="1.5"
											 stroke="currentColor" className="size-6">
											<path d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"/>
										</svg>
									</Button>
									<EditPlant plant={plant} allDays={allDays} weeks={plant.weeks} loadPlant={loadPlant}/>
								</div>
								<div
									className={'flex items-center p-1 pr-3 font-normal text-small subpixel-antialiased bg-background/30 backdrop-blur backdrop-saturate-150 border-white/20 border-1 overflow-hidden rounded-large shadow-small'}>
									<Button variant={'light'} isIconOnly={true} isDisabled={plant.weeks.length >= 8}
											aria-label={'Добавить этап'} onPress={() => {
										addWeek(plant.id).catch(err => {
											console.log(err)
										}).finally(() => {
											loadPlant().finally(() => setTimeout(() => window.scrollTo({
												top: document.body.scrollHeight,
												behavior: 'smooth'
											}), 300))
										})
									}}>
										<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
											 strokeWidth={1.5}
											 stroke="currentColor" className="size-6">
											<path strokeLinecap="round" strokeLinejoin="round"
												  d="M12 4.5v15m7.5-7.5h-15"/>
										</svg>
									</Button>
									<Button variant={'light'} isIconOnly={true} isDisabled={!lastWeek}
											aria-label={'Удалить этап'} onPress={() => {
										if (lastWeek.days.length) {
											lastWeek.days.forEach((day: any, index: number) => {
												deleteDay(day.id).catch(err => {
													console.log(err)
												}).finally(() => {
													if (index == lastWeek.days.length - 1) {
														deleteWeek(lastWeek.id).catch(err => {
															console.log(err)
														}).finally(() => {
															loadPlant().finally(() => setTimeout(() => window.scrollTo({
																top: document.body.scrollHeight,
																behavior: 'smooth'
															}), 300))
														})
													}
												})
											})
										} else {
											deleteWeek(lastWeek.id).catch(err => {
												console.log(err)
											}).finally(() => {
												loadPlant().finally(() => setTimeout(() => window.scrollTo({
													top: document.body.scrollHeight,
													behavior: 'smooth'
												}), 300))
											})
										}
									}}>
										<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
											 strokeWidth={1.5}
											 stroke="currentColor" className="size-6">
											<path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14"/>
										</svg>
									</Button>
									<div className={'ml-2'}>
										{plant.weeks.length ? (
											<div>
												<span className={'text-md'}>{plant.weeks.length}</span> этап из <span
												className={'text-md'}>8</span>
											</div>
										) : 'Этап'}
									</div>
								</div>
								<div
									className={'flex items-center p-1 pr-3 font-normal text-small subpixel-antialiased bg-background/30 backdrop-blur backdrop-saturate-150 border-white/20 border-1 overflow-hidden rounded-large shadow-small'}>
									<Button variant={'light'} isIconOnly={true} isDisabled={!lastWeek}
											aria-label={'Добавить день'} onPress={() => {
										addDay(lastWeek.id, 1).then((createdDays: any) => {
											newDays.push(createdDays[0].id)
											setNewDays(newDays)
										}).catch(err => {
											console.log(err)
										}).finally(() => {
											loadPlant().finally(() => setTimeout(() => window.scrollTo({
												top: document.body.scrollHeight,
												behavior: 'smooth'
											}), 300))
										})
									}}>
										<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
											 strokeWidth={1.5}
											 stroke="currentColor" className="size-6">
											<path strokeLinecap="round" strokeLinejoin="round"
												  d="M12 4.5v15m7.5-7.5h-15"/>
										</svg>
									</Button>
									<Button variant={'light'} isIconOnly={true} isDisabled={!lastDay}
											aria-label={'Удалить день'} onPress={() => {
										const lastDayCard: any = document.querySelectorAll('.day-card')[allDays.indexOf(lastDay)]
										lastDayCard.classList.add('deleted-day')

										setTimeout(() => {
											deleteDay(lastDay.id).catch(err => {
												console.log(err)
											}).finally(() => {
												loadPlant().finally(() => setTimeout(() => window.scrollTo({
													top: document.body.scrollHeight,
													behavior: 'smooth'
												}), 300))
											})
										}, 50)
									}}>
										<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
											 strokeWidth={1.5}
											 stroke="currentColor" className="size-6">
											<path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14"/>
										</svg>
									</Button>
									<div className={'ml-2'}>
										День
									</div>
								</div>
							</div>
						) : null}
					</>
				) : (
					<div className={'text-center text-lg mt-5'}>
						Растение не найдено
					</div>
				)
			)}
		</div>
	);
}