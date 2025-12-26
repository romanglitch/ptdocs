"use client";

import {FC} from "react";
import {VisuallyHidden} from "@react-aria/visually-hidden";
import {SwitchProps, useSwitch} from "@heroui/switch";
import {useTheme} from "next-themes";
import {useIsSSR} from "@react-aria/ssr";
import clsx from "clsx";

export interface ThemeSwitchProps {
	className?: string;
	classNames?: SwitchProps["classNames"];
}

export const ThemeSwitch: FC<ThemeSwitchProps> = ({className, classNames,}) => {
	const {theme, setTheme} = useTheme();
	const isSSR = useIsSSR();

	const onChange = () => {
		theme === "light" ? setTheme("dark") : setTheme("light");
	};

	const {
		Component,
		slots,
		isSelected,
		getBaseProps,
		getInputProps,
		getWrapperProps,
	} = useSwitch({
		isSelected: theme === "light" || isSSR,
		"aria-label": `Switch to ${theme === "light" || isSSR ? "dark" : "light"} mode`,
		onChange,
	});

	return (
		<Component
			{...getBaseProps({
				className: clsx(
					"h-10 w-full max-w-full justify-center items-center px-px transition-opacity hover:opacity-80 cursor-pointer",
					className,
					classNames?.base,
				),
			})}
		>
			<VisuallyHidden>
				<input {...getInputProps()} />
			</VisuallyHidden>
			{!isSelected || isSSR ? (
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
						 stroke="currentColor" className="size-6">
						<path strokeLinecap="round" strokeLinejoin="round"
							  d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"/>
					</svg>
				) : (
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
						 stroke="currentColor" className="size-6">
						<path strokeLinecap="round" strokeLinejoin="round"
							  d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"/>
					</svg>
				)
			}
		</Component>
	);
};
