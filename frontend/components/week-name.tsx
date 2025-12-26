import {Button, Input} from "@heroui/react";
import {deleteWeekName, putWeekName} from "@/lib/api";
import React, {useState} from "react";

export const WeekName = (props:any) => {
  const [weekNameValue, setWeekNameValue] = useState<string>(props.weekName.name)

  return (
      <div className={'flex items-end gap-1'} key={props.weekName.id}>
        <Input variant={'underlined'} label={`${props.index + 1} этап`} onBlur={(e: any) => {
            putWeekName(props.weekName.id, {
            	name: e.target.value,
            }).catch((err) => {
            	console.log(err)
            }).finally(() => {
                props.loadWeekNames()
            })
        }} onChange={(e: any) => {
          setWeekNameValue(e.target.value)
        }} placeholder={`Введите название ${props.index + 1} этапа`} value={weekNameValue}/>
        <Button isIconOnly variant="light" onPress={(e: any) => {
          deleteWeekName(props.weekName.id).catch((err) => {
            console.log(err)
          }).finally(() => {
            props.loadWeekNames()
          })
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
               strokeWidth={1.5}
               stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14"/>
          </svg>
        </Button>
      </div>
  );
};
