"use client"
import {Image} from "@heroui/image";
import {Tooltip} from "@heroui/tooltip";
import {Button} from "@heroui/button";
import {Dropdown, DropdownMenu, DropdownTrigger} from "@heroui/dropdown";
import {DropdownItem} from "@heroui/react";
import React, {useEffect, useState} from "react";
import {deleteDayPhoto, putDay, uploadDayPhoto} from "@/lib/api";
import {dayDate} from "@/lib/helpers";

export const DayCard = (props: any) => {
	const dayCardClasses = 'subpixel-antialiased bg-background/10 backdrop-blur backdrop-saturate-150 border-white/20 border-1 overflow-hidden rounded-large shadow-small'

	const [selectedTagIds, setSelectedTagIds] = React.useState(props.day.tags.map((tag: any) => tag.id.toString()))
	const [dayTags, setDayTags] = React.useState(props.day.tags)
	const [dayPhoto, setDayPhoto] = React.useState(props.day.stage1PhotoUrl)
	const [dayPhotoLoading, setDayPhotoLoading] = React.useState(false)

	const [closedDay, setClosedDay] = React.useState(props.day.closed)

	const indexOfWeeks = props.allDays.indexOf(props.day)

	const daysWithPhotos = props.allDays.filter((day: any) => day.stage1PhotoUrl !== null)
	let firstDayPhotoUrl = daysWithPhotos[0] ? daysWithPhotos[0].stage1PhotoUrl : null

	return (
		<div className={`day-card overflow-hidden rounded-large shadow-small transition-all ${props.isNewDay ? 'created-day' : ''}`}>
			<input name={`input-file-day-${props.day.id}`} hidden={true} type="file" onChange={(e: any) => {
				e.preventDefault();
				setDayPhotoLoading(true)

				const formData = new FormData();
				formData.append("stage1", e.target.files[0]);

				uploadDayPhoto(props.day.id, formData).then((day: any) => {
					setDayPhoto(day.stage1PhotoUrl)
				}).catch((err) => {
					console.log(err)
				}).finally(() => {
					props.loadPlant()
					setDayPhotoLoading(false)
				})
			}}/>
			<div className={'day-card__content flex flex-col gap-3 justify-between items-center p-3 pointer-events-none'}>
				<div className={`day-card-date pointer-events-auto w-full flex justify-between items-center pt-1 h-10 pb-1 pl-2 pr-2 text-xl ${dayPhoto ? 'text-white' : 'text-inherit'} cursor-default ${dayCardClasses}`}>
					<small className={'text-md'}>{dayDate(props.startDate, indexOfWeeks)}</small>
					<div>
						{dayPhoto ? (
							<Dropdown>
								<DropdownTrigger>
								<Button
										className={`flex items-center gap-1 items-center justify-center ${dayPhoto ? 'text-white' : 'text-inherit'}`}
										style={{width: '28px', height: '28px', minWidth: '28px'}} isIconOnly={true}
										isLoading={dayPhotoLoading}
										variant={'light'}
									>
										<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
											 strokeWidth={1.5}
											 stroke="currentColor" className="size-6">
											<path strokeLinecap="round" strokeLinejoin="round"
												  d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"/>
											<path strokeLinecap="round" strokeLinejoin="round"
												  d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"/>
										</svg>
									</Button>
								</DropdownTrigger>
								<DropdownMenu>
									<DropdownItem key="delete-photo" onPress={() => {
										deleteDayPhoto(props.day.id).then(() => {
											setDayPhoto(null)
										}).catch((err) => {
											console.log(err)
										})
									}}>Удалить фото</DropdownItem>
									<DropdownItem key="upload-photo" onPress={() => {
										const fileInput = document.getElementsByName(`input-file-day-${props.day.id}`)[0] as HTMLInputElement;
										fileInput.click();
									}}>Загрузить фото</DropdownItem>
								</DropdownMenu>
							</Dropdown>
						) : (
							<Button
								className={`flex items-center gap-1 items-center justify-center ${dayPhoto ? 'text-white' : 'text-inherit'}`}
								style={{width: '28px', height: '28px', minWidth: '28px'}} isIconOnly={true}
								isLoading={dayPhotoLoading}
								variant={'light'}
								onPress={() => {
									const fileInput = document.getElementsByName(`input-file-day-${props.day.id}`)[0] as HTMLInputElement;
									fileInput.click();
								}}
							>
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
									 strokeWidth={1.5}
									 stroke="currentColor" className="size-6">
									<path strokeLinecap="round" strokeLinejoin="round"
										  d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"/>
									<path strokeLinecap="round" strokeLinejoin="round"
										  d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"/>
								</svg>
							</Button>
						)}
					</div>
				</div>
				<Dropdown onClose={() => {
					putDay(props.day.id, {
						tagIds: selectedTagIds
					})
				}}>
					<DropdownTrigger>
						<Button
							className={`day-card-tags pointer-events-auto p-2 flex items-center gap-1 items-center justify-center ${dayPhoto ? 'text-white' : 'text-inherit'} ${dayCardClasses}`}
							style={{minWidth: '40px'}} variant={'light'}>
							{dayTags.length ? (
								dayTags.map((tag: any) => (
									<Tooltip key={tag.id} delay={1000} color="foreground" content={tag.name}
											 placement={'bottom'}>
										<Image className={'day-card__bg-image object-contain'}
											   src={`${process.env.NEXT_PUBLIC_REST_API}${tag.iconUrl}`} width={24}
											   height={24} alt={tag.name}/>
									</Tooltip>
								))
							) : (
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
									 strokeWidth={1.5}
									 stroke="currentColor" className="size-5">
									<path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
								</svg>
							)}
						</Button>
					</DropdownTrigger>
					<DropdownMenu
						aria-label="Выбор тегов"
						closeOnSelect={false}
						selectionMode="multiple"
						variant="flat"
						selectedKeys={selectedTagIds}
						onSelectionChange={(data) => {
							const inputSelectedKeys = Array.from(data);
							const newSelectedTags = props.allTags.filter((tag: any) => inputSelectedKeys.map(Number).includes(tag.id))

							setSelectedTagIds(inputSelectedKeys)
							setDayTags(newSelectedTags)
						}}
					>
						{props.allTags && props.allTags.length ? (
							props.allTags.map((tag: any) => (
								<DropdownItem key={tag.id} textValue={tag.name}>
									<div className={'tag-dropdown-item flex items-center gap-2'}>
										<Image className={'object-contain'}
											   src={`${process.env.NEXT_PUBLIC_REST_API}${tag.iconUrl}`}
											   width={18} height={18} alt={tag.name}/>
										{tag.name}
									</div>
								</DropdownItem>
							))
						) : null}
					</DropdownMenu>
				</Dropdown>
			</div>
			<div className={`day-card__bg relative transition delay-100 duration-300 overflow-hidden rounded-large ${dayPhoto ? 'cursor-pointer' : ''}`} onClick={() => {
				const galleryButton = document.getElementById('gallery-button')
				const indexOfDayWithPhoto = daysWithPhotos.indexOf(props.day)

				if (galleryButton && indexOfDayWithPhoto >= 0) {
					galleryButton.setAttribute('data-start-index', indexOfDayWithPhoto.toString())
					galleryButton.click()
				}
			}}>
				{dayPhoto ? (
					<Image className={'day-card__bg-image object-cover'} src={`${process.env.NEXT_PUBLIC_REST_API}${dayPhoto}`} width={'100%'} height={'330px'} alt="Day photo"/>
				) : (
					firstDayPhotoUrl ? (
						<div className={'blur-xl saturate-10 opacity-30'}>
							<Image className={'day-card__bg-image object-cover'} src={`${process.env.NEXT_PUBLIC_REST_API}${firstDayPhotoUrl}`} width={'100%'} height={'330px'} alt="Day photo"/>
						</div>
					) : (
						<div className={'w-full rounded-large'} style={{
							height: '330px',
							background: 'rgb(197 197 197 / 20%)',
						}}></div>
					)
				)}
			</div>
		</div>
	);
};
