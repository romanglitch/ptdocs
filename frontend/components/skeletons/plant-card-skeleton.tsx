import {Skeleton} from "@heroui/skeleton";
import {Card} from "@heroui/card";
import React from "react";

export const PlantCardSkeleton = () => {
	return (
		<Card className="space-y-5 p-4" radius="lg">
			<Skeleton className="w-3/5 rounded-lg">
				<div className="h-3 w-3/5 rounded-lg bg-default-200"/>
			</Skeleton>
			<Skeleton className="w-4/5 rounded-lg">
				<div className="h-3 w-4/5 rounded-lg bg-default-200"/>
			</Skeleton>
			<Skeleton className="rounded-lg">
				<div className="rounded-lg bg-default-300" style={{height: '420px'}}/>
			</Skeleton>
			<div className="space-y-3">
                <Skeleton className="w-full rounded-lg flex justify-between">
                    <div className="h-3 w-1/5 rounded-lg bg-default-300"/>
                </Skeleton>
            </div>
        </Card>
	);
};
