'use client';

import React, { useEffect } from 'react';
import { Fancybox as NativeFancybox } from '@fancyapps/ui';
import '@fancyapps/ui/dist/fancybox/fancybox.css';
import {dayDate} from "@/lib/helpers";
import {Button} from "@heroui/button";

interface DaysGalleryButtonProps {
	images: any[];
	allDays: any[];
	startDate: string;
}

export default function DaysGalleryButton({
											 images,
											  allDays,
											  startDate
										 }: DaysGalleryButtonProps) {

	useEffect(() => {
		return () => {
			NativeFancybox.close();
		};
	}, []);

	const handleOpenGallery = () => {
		const galleryButton = document.getElementById('gallery-button')
		const startIndex = Number(galleryButton?.getAttribute('data-start-index'));

		NativeFancybox.show(
			images.map(day => {
				const indexOfWeeks = allDays.indexOf(day)

				return ({
					src: `${process.env.NEXT_PUBLIC_REST_API}${day.stage1PhotoUrl}`,
					type: 'image',
					caption: `${dayDate(startDate, indexOfWeeks)}`,
				})
			}),
			{
				startIndex: startIndex,
				Carousel: {
					infinite: false,
				}
			}
		);

		galleryButton?.setAttribute('data-start-index', '0')
	};

	return (
		<Button id={'gallery-button'} data-start-index={0} className={'text-white outline-none hidden'} variant={'light'} isIconOnly={true} onPress={handleOpenGallery}>
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
				 stroke="currentColor" className="size-6">
				<path strokeLinecap="round" strokeLinejoin="round"
					  d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"/>
			</svg>
		</Button>
	);
}