"use client"
import React, {useEffect, useState} from "react";
import {Plant} from "@/types/plant";
import {ApiError, fetchCategories, fetchPlants} from "@/lib/api";
import {Link} from "@heroui/link";
import {Image} from "@heroui/image";
import {dayDate, formatDays} from "@/lib/helpers";
import {Card, CardBody, CardFooter, CardHeader} from "@heroui/card";
import {Skeleton} from "@heroui/skeleton";
import {PlantCardSkeleton} from "@/components/skeletons/plant-card-skeleton";
import {Button} from "@heroui/button";
import {useSearchParams} from "next/navigation";
import {Switch} from "@heroui/switch";
import {Select, SelectItem} from "@heroui/react";

export default function Plants() {
	const [plants, setPlants] = useState<Plant[]>([]);
	const [categories, setCategories] = useState<any>();
	const [loading, setLoading] = useState(true);
	const [archive, setArchive] = useState(false);
	const [categoryId, setCategoryId] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	const loadPlantsAndCategories = async (includeArchive:boolean = false, categoryId:any = null) => {
		try {
			setError(null);
			const plantsData = await fetchPlants(includeArchive, Number(categoryId));
			const categoriesData = await fetchCategories();

			setPlants(plantsData);
			setCategories(categoriesData);
		} catch (err) {
			if (err instanceof ApiError) {
				setError(err.message);
			} else {
				setError('Произошла неизвестная ошибка');
			}
		} finally {
			setTimeout(() => {
				setLoading(false);
			}, 300)
		}
	};

	useEffect(() => {
		setLoading(true);
		loadPlantsAndCategories();
	}, []);

	if (error) {
		return (
			<div className="flex">
				<h2 className="text-xl font-bold text-danger mb-2">Ошибка загрузки</h2>
				<p className="text-default-600">{error}</p>
			</div>
		);
	}

	return (
		<div>
			<div className={'mb-4 flex gap-3 items-center'}>
				{categories && categories.length ? (
					<Select
						size={'sm'}
						className="max-w-xs"
						label="Категория"
						selectedKeys={[categoryId || '']}
						onSelectionChange={(value) => {
							setCategoryId(value.currentKey ?? null)
							setLoading(true);
							loadPlantsAndCategories(archive, Number(value.currentKey));
						}}
					>
						{categories.map((category:any) => (
							<SelectItem key={category.id} endContent={category.plants.length}>{category.name}</SelectItem>
						))}
					</Select>
				) : null}

				<Switch color={'default'} size={'sm'} defaultSelected={archive} onValueChange={(value:boolean) => {
					!archive ? setArchive(true) : setArchive(false)
					setLoading(true);
					loadPlantsAndCategories(value, categoryId);
				}}>
					Архивные растения
				</Switch>
			</div>

			{loading ? (
				<div>
					<div className={'grid xl:grid-cols-5 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 grid-cols-1 w-full gap-5 mb-5'}>
						<PlantCardSkeleton/>
						<PlantCardSkeleton/>
						<PlantCardSkeleton/>
						<PlantCardSkeleton/>
						<PlantCardSkeleton/>
						<PlantCardSkeleton/>
						<PlantCardSkeleton/>
						<PlantCardSkeleton/>
						<PlantCardSkeleton/>
						<PlantCardSkeleton/>
					</div>
				</div>
			) : (
				plants.length ? (
					<div className="grid xl:grid-cols-5 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 grid-cols-1 w-full gap-5 mb-5">
						{plants.map((plant) => {
							const allDays = plant.weeks?.flatMap((week: any) => week.days || []) || []
							const daysWithPhotos = allDays.filter((day: any) => day.stage1PhotoUrl !== null)
							const lastDayPhotoUrl = daysWithPhotos[daysWithPhotos.length - 1] ? daysWithPhotos[daysWithPhotos.length - 1].stage1PhotoUrl : null

							return (
								<Link className={'flex flex-col items-start'} key={plant.id} href={`/plant/${plant.id}`} color={'foreground'}>
									<Card className={'w-full'}>
										<CardHeader className={'flex-col items-start pb-0'}>
											<div className={'flex items-end gap-1'}>
												<h2 className={'text-xl'}>{plant.name}</h2>
												{plant.archive ? (<small>(архив)</small>) : ''}
											</div>
											<p className={'text-default-500 text-sm'}>{allDays.length > 6 ? formatDays(allDays.length) : ''} <b>({formatDays(allDays.length, true)})</b></p>
										</CardHeader>
										<CardBody>
											{lastDayPhotoUrl ? (
												<Image className={'object-cover'} width={'100%'} height={420} src={`${process.env.NEXT_PUBLIC_REST_API}${lastDayPhotoUrl}`} alt={plant.name}/>
											) : (
												<div className={'w-full rounded-large'} style={{
													height: '420px',
													background: 'rgb(197 197 197 / 22%)',
												}}></div>
											)}
										</CardBody>
										<CardFooter className={'items-center justify-between pt-0 text-sm'}>
											<p className={'text-default-500'}>{plant.category?.name}</p>
											<p className={'text-default-500'}>{dayDate(plant.startDate, 0)} / {new Date(plant.startDate).getFullYear()}</p>
										</CardFooter>
									</Card>
								</Link>
							)
						})}
					</div>
				) : (
					<div className="text-center">
						<p className="text-default-500">Растения не найдены</p>
					</div>
				)
			)}
		</div>
	);
}