import Assets from './assets';
import { getSkills } from './skills';
import { ContractType, type Experience } from '../types';

import descQualitasExp from '@md/Experiences/descQualitasExp.md?raw';
import descUGExp from '@md/Experiences/descUGExp.md?raw';

export const title = 'Experience';

export const items: Array<Experience> = [
	{
		slug: 'qualitas-ag',
		company: 'Qualitas AG',
		name: 'Software Engineer',
		description: descQualitasExp,
		shortDescription: 'C++ Game Developer working on the game Transport Fever 2.',
		contract: ContractType.FullTime,
		type: 'Software Engineer',
		location: 'Zug',
		period: { from: new Date(2024, 0, 1) },
		skills: getSkills('ts', 'js'),
		color: 'coral',
		links: [],
		logo: Assets.Unknown,
		bannerImage: Assets.Unknown,
	},
	{
		slug: 'urban-games',
		name: 'Software Engineer',
		company: 'Urban Games GmbH',
		description: descUGExp,
		shortDescription: 'C++ Game Developer working on the game Transport Fever 2.',
		contract: ContractType.FullTime,
		type: 'Software Development',
		location: 'Schaffhausen',
		period: { from: new Date(2021, 3, 1), to: new Date(2023, 11, 31) },
		skills: getSkills('svelte', 'ts', 'sass', 'css', 'html', 'js'),
		color: 'darkseagreen',
		links: [],
		logo: Assets.Unknown,
		bannerImage: Assets.Unknown,
	}
];
