import Assets from './assets';
import type { Education } from '../types';

export const title = 'Education';

export const items: Array<Education> = [
	{
		degree: 'Masters Computer Science',
		description: 'asd1',
		location: 'Zurich, Switzerland',
		logo: Assets.ETH,
		name: '',
		organization: 'ETH Zurich',
		period: { from: new Date(2019, 5, 1), to: new Date(2021, 3, 1) },
		shortDescription: 'asd3',
		slug: 'education-item-1',
		majors: [
			'Computer Vision',
			'Distributed Algorithms',
			'Computer Graphics',
			'Machine Learning',
			'Probabilistic AI',
			'Geometry Processing',
			'Advanced Systems Lab',
			'Computational Intelligence Lab'
		],
		color: '#FFD700'
	},
	{
		degree: 'Bachelor Computer Science',
		description: '',
		location: 'Zurich, Switzerland',
		logo: Assets.ETH,
		name: '',
		organization: 'ETH Zurich',
		period: { from: new Date(2014, 8, 1), to: new Date(2019, 5, 1) },
		shortDescription: '',
		slug: 'education-item-2',
		majors: [
			'Machine Learning', 
			'Distributed Systems', 
			'Visual Computing', 
			'Systems Programming',
			'Neuroinformatics'
		],
		color: '#FFD700'
	},
	{
		degree: 'Electronics Technician',
		description: '',
		location: 'Biel, Switzerland',
		logo: Assets.Unknown,
		name: '',
		organization: 'Technische Fachschule Biel',
		period: { from: new Date(2008, 7, 1), to: new Date(2012, 3, 1) },
		shortDescription: '',
		slug: 'education-item-3',
		majors: [
			'Assembly',
			'C', 'Electrical Engineering',
			'Electronics',
			'Physics',
			'Altium Designer',
			'PCB design / production',
			'Micorcontrollers'
		],
		color: '#FFD700'
	}
];
