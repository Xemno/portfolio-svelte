import Assets from './data/assets';
import { getSkills } from './skills.params';
import type { Project } from './types';

import descAiRoadSeg from './md/descAiRoadSeg.md?raw';
import descSoftBodyEng from './md/descSoftBodyPhysics.md?raw';
import descCpuRayMarcher from './md/descFastCpuRayMarcher.md?raw';
import descMRLab from './md/descMixedRealityLab.md?raw';
import descBachelorThesis from './md/descBachelorThesis.md?raw';
import descMasterThesis from './md/descMasterTHesis.md?raw';
import descThisWebsite from './md/descThisWebsite.md?raw';


const MY_PROJECTS: Array<Project> = [
	{
		slug: 'my-portfolio-website',
		name: 'This Website',
		color: '#5e95e3',
		description: descThisWebsite,
		shortDescription:
			'Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore non dolores voluptatibus vitae praesentium aperiam, iure laboriosam repellendus sunt explicabo pariatur totam enim, nihil animi quisquam. Sit vero quod laborum!',
		links: [{ to: 'https://github.com/RiadhAdrani/slick-portfolio-svelte', label: 'GitHub' }],
		logo: Assets.Unknown,
		period: {
			from: new Date()
		},
		skills: getSkills('angular', 'ts', 'tailwind'),
		type: 'Website Template'
	},
	{
		slug: 'master-thesis',
		name: 'Master Thesis',
		color: '#ff3e00',
		description: descMasterThesis,
		shortDescription:
			'A Vercel-like developer portfolio website template made with Typescript and SvelteKit.',
		links: [{ to: 'https://github.com/RiadhAdrani/slick-portfolio-svelte', label: 'GitHub' }],
		logo: Assets.Svelte,

		period: {
			from: new Date()
		},
		skills: getSkills('svelte', 'ts', 'tailwind', 'sass'),
		type: 'Website Template',
		screenshots: [
			{
				label: 'screen 1',
				src: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZ3JhbW1pbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60'
			},
			{
				label: '2',
				src: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cHJvZ3JhbW1pbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60'
			},
			{
				label: '3',
				src: 'https://images.unsplash.com/photo-1537432376769-00f5c2f4c8d2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHByb2dyYW1taW5nfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60'
			},
			{
				label: '4',
				src: 'https://images.unsplash.com/photo-1542903660-eedba2cda473?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHByb2dyYW1taW5nfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60'
			},
			{
				label: '5',
				src: 'https://images.unsplash.com/photo-1619410283995-43d9134e7656?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHByb2dyYW1taW5nfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60'
			},
			{
				label: '6',
				src: 'https://images.unsplash.com/photo-1585079542156-2755d9c8a094?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fHByb2dyYW1taW5nfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60'
			}
		]
	},

	{
		slug: 'bachelor-thesis',
		name: 'Bachelor Thesis',
		color: '#5e95e3',
		description: descBachelorThesis,
		shortDescription:
			'Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore non dolores voluptatibus vitae praesentium aperiam, iure laboriosam repellendus sunt explicabo pariatur totam enim, nihil animi quisquam. Sit vero quod laborum!',
		links: [{ to: 'https://github.com/RiadhAdrani/slick-portfolio-svelte', label: 'GitHub' }],
		logo: Assets.Unknown,
		period: {
			from: new Date()
		},
		skills: getSkills('angular', 'ts', 'tailwind'),
		type: 'Website Template'
	},

	{
		slug: 'mr-lab-eth',
		name: 'Mixed Reality Lab',
		color: '#5e95e3',
		description: descMRLab,
		shortDescription:
			'Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore non dolores voluptatibus vitae praesentium aperiam, iure laboriosam repellendus sunt explicabo pariatur totam enim, nihil animi quisquam. Sit vero quod laborum!',
		links: [{ to: 'https://github.com/RiadhAdrani/slick-portfolio-svelte', label: 'GitHub' }],
		logo: Assets.Unknown,
		period: {
			from: new Date()
		},
		skills: getSkills('angular', 'ts', 'tailwind'),
		type: 'Website Template'
	},

	{
		slug: 'fast-cpu-raymarcher',
		name: 'Fast CPU Raymarcher',
		color: '#5e95e3',
		description: descCpuRayMarcher,
		shortDescription:
			'Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore non dolores voluptatibus vitae praesentium aperiam, iure laboriosam repellendus sunt explicabo pariatur totam enim, nihil animi quisquam. Sit vero quod laborum!',
		links: [{ to: 'https://github.com/Xemno/Optimized-CPU-Ray-Marcher', label: 'GitHub' }],
		logo: Assets.Unknown,
		period: {
			from: new Date()
		},
		skills: getSkills('angular', 'ts', 'tailwind'),
		type: 'Website Template',
		// screenshots: [
		// 	{
		// 		label: '1',
		// 		src: 'https://raw.githubusercontent.com/Xemno/Optimized-CPU-Ray-Marcher/blob/master/output_examples/out_1080_0.png'
		// 	},
		// ]
	},

	{
		slug: 'soft-body-physics-engine',
		name: 'Soft-body Physics Engine',
		color: '#5e95e3',
		description: descSoftBodyEng,
		shortDescription:
			'Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore non dolores voluptatibus vitae praesentium aperiam, iure laboriosam repellendus sunt explicabo pariatur totam enim, nihil animi quisquam. Sit vero quod laborum!',
		links: [{ to: 'https://github.com/devnio/Flowmo', label: 'GitHub' }],
		logo: Assets.C,
		period: {
			from: new Date()
		},
		skills: getSkills('angular', 'ts', 'tailwind'),
		type: 'Website Template',
		// screenshots: [
		// 	{
		// 		label: '1',
		// 		src: 'https://raw.githubusercontent.com/devnio/Flowmo/blob/master/media/OctreeDebug.jpg'
		// 	},
		// ]
	},

	{
		slug: 'ai-road-segmentation',
		name: 'AI Road Segmentation',
		color: '#5e95e3',
		description: descAiRoadSeg,
		shortDescription: 'Road Segmentation Project for Computational Intelligence Lab 2019 at ETH Zurich',
		links: [{ to: 'https://github.com/laurinpaech/segme-net', label: 'GitHub' }],
		logo: Assets.Unknown,
		period: {
			from: new Date()
		},
		skills: getSkills('python'),
		type: 'Machine Learning',
		screenshots: [
			{
				label: '1',
				src: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cHJvZ3JhbW1pbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60'
			},
			{
				label: '2',
				src: 'https://images.unsplash.com/photo-1537432376769-00f5c2f4c8d2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHByb2dyYW1taW5nfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60'
			},

		]
	},
];

export default MY_PROJECTS;
