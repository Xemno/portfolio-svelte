import Assets from './data/assets';
import type { Education } from './types';

export const MY_EDUCATIONS: Array<Education> = [
	{
		degree: 'Masters Computer Science',
		description: 'asd1',
		location: 'Zurich, Switzerland',
		logo: Assets.ETH2,
		name: 'asd2',
		organization: 'ETH Zurich',
		period: { from: new Date(2019, 5, 1), to: new Date(2021, 3, 1) },
		shortDescription: 'asd3',
		slug: 'education-item-1',
		subjects: ['Computer Vision', 'Distributed Algorithms', 'Computer Graphics', 'Machine Learning', 'Probabilistic AI', 'Shape Modeling & Geometry Processing', 'Advanced Systems Lab', 'Computational Intelligence Lab'],
		color: 'coral',
	},
	{
		degree: 'Bachelor Computer Science',
		description: '',
		location: 'Zurich, Switzerland',
		logo: Assets.ETH2,
		name: '',
		organization: 'ETH Zurich',
		period: { from: new Date(2014, 8, 1), to: new Date(2019, 5, 1)},
		shortDescription: '',
		slug: 'education-item-2',
		subjects: ['Algorithms & Data structures', 'Machine Learning'],
		color: 'coral',
	},
	{
		degree: 'Electronics Technician',
		description: '',
		location: 'Biel, Switzerland',
		logo: Assets.Unknown,
		name: '',
		organization: 'Technische Fachschule Biel',
		period: { from: new Date(2008, 0, 1), to: new Date(2012, 0, 1) },
		shortDescription: '',
		slug: 'education-item-3',
		subjects: ['Assembly', 'C', 'Electronics', 'Physics', 'Altium Designer', 'PCB and electronic design', 'Micorcontrollers' ],
		color: 'coral',
	}
];