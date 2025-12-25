import Header from '@editorjs/header';
import {BlockToolData, API, ToolConfig} from '@editorjs/editorjs';

interface CustomHeaderData extends BlockToolData {
	text: string;
	level: number;
}

interface CustomHeaderConfig extends ToolConfig {
	// Add any custom configuration options here if needed
}

export default class CustomHeader extends Header {
	constructor({data, config, api, readOnly}: {
		data: CustomHeaderData,
		config: CustomHeaderConfig,
		api: API,
		readOnly: boolean
	}) {
		super({data, config, api, readOnly});
	}

	/**
	 * Get tag for target level
	 * By default returns second-leveled header
	 *
	 * @returns {HTMLElement}
	 */
	getTag(): any {
		const tag = super.getTag();
		const headingLevel = this.currentLevel.number;

		const headingClasses = [
			'text-2xl',
			'text-xl',
			'text-lg',
			'text-base',
			'text-sm',
			'text-xs'
		]

		tag.classList.add(headingClasses[headingLevel - 1]);

		return tag;
	}
}