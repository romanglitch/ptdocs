"use client"

import React, {useState} from "react";
import {Logo} from "@/components/icons";
import {siteConfig} from "@/config/site";
import NextLink from "next/link";
import {useParams} from 'next/navigation'

export const HeaderLogo = () => {
	return (
		<NextLink className="flex justify-start items-center gap-1" href="/">
			<Logo/>
			<p className="font-bold text-inherit ml-2">{siteConfig.name}</p>
		</NextLink>
	);
};
