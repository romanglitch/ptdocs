import React from "react";
import {HeaderNavbar} from "@/components/header-navbar";
import {HeaderLogo} from "@/components/header-logo";

export const Header = () => {
	return (
		<header className={'ptdocs-header left-0 right-0 px-6 fixed z-50'}>
			<div className={'mx-auto w-full mt-3 pt-2 pb-2 pl-3 pr-3 flex items-center justify-between subpixel-antialiased bg-content1 overflow-hidden rounded-large shadow-small'}>
				<HeaderLogo />
				<HeaderNavbar />
			</div>
		</header>
	);
};
