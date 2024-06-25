import { Platform, type HomeLink } from '$lib/types';
import { getSkills } from './skills';

import descMainPage from '@md/descMainPage.md?raw';

export const title = 'Home';

export const name = 'Qais';

export const lastName = 'El Okaili';

export const description = descMainPage;

export const links: Array<HomeLink> = [
	{
		platform: Platform.GitHub,
		link: 'https://github.com/Xemno'
	},
	{
		platform: Platform.Linkedin,
		link: 'https://www.linkedin.com/in/qais-el-okaili-442703181/'
	},
	// {
	// 	platform: Platform.Email,
	// 	link: ''
	// }
];

export const skills = getSkills('js', 'css', 'html', 'reactjs', 'sass', 'svelte', 'ts');