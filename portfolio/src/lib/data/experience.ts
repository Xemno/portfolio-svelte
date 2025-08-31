import Assets from './assets';
import { getSkills } from './skills';
import { ContractType, type Experience } from '../types';

import descQualitasExp from '@md/Experiences/descQualitasExp.md?raw';
import shortDescQualitasExp from '@md/Experiences/shortDescQualitasExp.md?raw';
import descUGExp from '@md/Experiences/descUGExp.md?raw';
import shortDescUGExp from '@md/Experiences/shortDescUGExp.md?raw';


export const title = 'Experience';

export const items: Array<Experience> = [
	{
		slug: 'qualitas-ag',
		company: 'Qualitas AG',
		name: 'Java Software Engineer',
		description: descQualitasExp,
		shortDescription: shortDescQualitasExp,
		contract: ContractType.FullTime,
		type: 'Software Engineer',
		location: 'Zug',
		period: { from: new Date(2024, 0, 1) },
		skills: getSkills('java', 'js', 'sql', 'plsql'),
		color: '#00BFFF',
		links: [],
		logo: 'i-carbon-building',
		// bannerImage: Assets.Unknown
	},
	{
		slug: 'urban-games',
		name: 'C++ Software Engineer',
		company: 'Urban Games GmbH',
		description: descUGExp,
		shortDescription: shortDescUGExp,
		contract: ContractType.FullTime,
		type: 'Software Development',
		location: 'Schaffhausen',
		period: { from: new Date(2021, 3, 1), to: new Date(2023, 11, 31) },
		skills: getSkills('cpp', 'lua', 'python', 'opengl', 'vulkan'),
		color: '#00BFFF',
		links: [],
		logo: 'i-carbon-game-console',
		// bannerImage: Assets.Unknown
	}
];
