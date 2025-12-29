import {dayDate, formatDays} from "@/lib/helpers";
import {Image} from "@heroui/image";
import React from "react";
import {Divider} from "@heroui/divider";
import DaysGalleryButton from "@/components/plant/days-gallery-button";
import {Button} from "@heroui/button";
import {addWeek, deleteDay, deleteWeek} from "@/lib/api";

export const PlantHeader = (props: any) => {
	const firstDayByPhoto = props.allDays.find((day:any) => day.stage1PhotoUrl !== null)
	const firstPhotoUrl = firstDayByPhoto?.stage1PhotoUrl

	return (
		<>
			<a href={'/'}
			   className={'plant-header w-fit left-0 right-0 ml-auto mr-auto fixed transition-all flex gap-3 items-center p-2 font-normal text-small bg-content1 subpixel-antialiased overflow-hidden rounded-large'}>
				<div className={'plant-header__heading'}>
					<h1 className={'text-lg font-bold flex justify-start items-center gap-1'}>
						<span>{props.plant.name}</span>
						{props.plant.archive ? (
							<span className={'font-normal text-xl ml-2'}>(В архиве)</span>
						) : null}
					</h1>
					<p className={'text-sm'}>
						{props.plant.category?.name}
					</p>
				</div>
				<Divider orientation={'vertical'} style={{height: '2.5rem'}}/>
				<div className={'plant-header__days'}>
					<p className={'text-md'}>{formatDays(props.allDays.length)}
						<span>({formatDays(props.allDays.length, true)})</span></p>
					<p className={'text-xs'}>{dayDate(props.plant.startDate, 0)} / {new Date(props.plant.startDate).getFullYear()}</p>
				</div>
			</a>
			<DaysGalleryButton
				images={props.allDaysPhotos}
				allDays={props.allDays}
				startDate={props.plant.startDate}
			/>
		</>
	);
};
