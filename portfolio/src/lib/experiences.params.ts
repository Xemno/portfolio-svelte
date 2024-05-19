import Assets from './data/assets';
import { getSkills } from './skills.params';
import { ContractType, type Experience } from './types';

const MY_EXPERIENCES: Array<Experience> = [
	{
		slug: 'qualitas-ag',
		company: 'Qualitas AG',
		name: 'Software Engineer',
		description: 'Full-Stack Java Developer',
		contract: ContractType.FullTime,
		type: 'Software Engineer',
		location: 'Zug',
		period: { from: new Date(2024, 0, 1) },
		skills: getSkills('ts', 'js'),
		color: '#ffffff',
		links: [],
		logo: Assets.Unknown,
		bannerImage: Assets.Unknown,
		shortDescription: 'asd'
	},
	{
		slug: 'urban-games',
		name: 'Software Engineer',
		company: 'Urban Games GmbH',
		description: 'C++ Game Developer working on the game Transport Fever 2.',
		contract: ContractType.FullTime,
		type: 'Software Development',
		location: 'Schaffhausen',
		period: { from: new Date(2021, 3, 1), to: new Date(2023, 11, 31) },
		skills: getSkills('svelte', 'ts', 'sass', 'css', 'html', 'js'),
		color: '#ffffff',
		links: [],
		logo: Assets.Unknown,
		bannerImage: Assets.Unknown,
		shortDescription: ''
	}
];

export default MY_EXPERIENCES;
