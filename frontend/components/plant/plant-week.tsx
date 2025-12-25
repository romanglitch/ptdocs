"use client"

import React from "react";
import {formatDays} from "@/lib/helpers";
import {DayCard} from "@/components/plant/day-card";
import useEmblaCarousel from "embla-carousel-react";

export const PlantWeek = (props: any) => {
	const [emblaRef] = useEmblaCarousel({
		startIndex: props.week.days.length,
	})

	return (
		<div className={'plant-week'}>
			{props.weekNames[props.index] ? (
				<div className={'text-xl mb-1'}>{props.weekNames[props.index].name}</div>
			) : (
				<div className={'text-xl mb-1'}>{props.index + 1} этап</div>
			)}
			<p className={'text-default-500 mb-3'}>{formatDays(props.week.days.length, false, true)}</p>

			{props.week.days.length ? (
				window.innerWidth < 768 ? (
					<div className={'plant-days md:block mb-5'}>
						<div className="embla" ref={emblaRef}>
							<div className="embla__container">
								{props.week.days.map((day: any) => (
									<div className="embla__slide" key={day.id}>
										<DayCard day={day} allTags={props.tags} allDays={props.allDays} loadPlant={props.loadPlant} startDate={props.plant.startDate}/>
									</div>
								))}
							</div>
						</div>
					</div>
				) : (
					<div className={'plant-days md:grid grid-cols-7 gap-5 mb-5'}>
						{props.week.days.map((day: any) => {
							const isNewDay = props.newDays.includes(day.id)

							return (
								<DayCard day={day} key={day.id} allTags={props.tags} allDays={props.allDays} startDate={props.plant.startDate} isNewDay={isNewDay} loadPlant={props.loadPlant}/>
							)
						})}
					</div>
				)
			) : null}
		</div>
	);
};
