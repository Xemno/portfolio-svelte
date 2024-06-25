import Assets from './assets';
import { getSkills } from './skills';
import type { Project } from '../types';

import descAiRoadSeg from '@md/Projects/descAiRoadSeg.md?raw';
import descSoftBodyEng from '@md/Projects/descSoftBodyPhysics.md?raw';
import descCpuRayMarcher from '@md/Projects/descFastCpuRayMarcher.md?raw';
import descMRLab from '@md/Projects/descMixedRealityLab.md?raw';
import descBachelorThesis from '@md/Projects/descBachelorThesis.md?raw';
import descMasterThesis from '@md/Projects/descMasterThesis.md?raw';
import descThisWebsite from '@md/Projects/descThisWebsite.md?raw';

import { base } from '$app/paths';


const getImagePath = (file: string) => `${base}/images/${file}`;

export const title = 'Projects';

export const items: Array<Project> = [
	{
		slug: 'my-portfolio-website',
		name: 'This Website',
		color: '#5e95e3',
		description: descThisWebsite,
		shortDescription:
			'Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore non dolores voluptatibus vitae praesentium aperiam, iure laboriosam repellendus sunt explicabo pariatur totam enim, nihil animi quisquam. Sit vero quod laborum!',
		links: [{ to: 'https://github.com/RiadhAdrani/slick-portfolio-svelte', label: 'GitHub' }],
		logo: Assets.Unknown,
		bannerImage: Assets.Unknown,
		period: {
			from: new Date(2022, 1, 20),
			to: new Date(2023, 1, 20),
		},
		skills: getSkills('svelte', 'ts', 'css', 'js', 'html'),
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
		logo: Assets.Unknown,
		bannerImage: Assets.Unknown,
		period: {
			from: new Date()
		},
		skills: getSkills('csharp', 'unity-engine', 'python'),
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
			'In this thesis I am researching touch and/or deformation sensing in soft substrates using electrical resistance/impedance tomography techniques.',
		links: [],
		logo: Assets.Unknown,
		bannerImage: Assets.Unknown,
		period: {
			from: new Date()
		},
		skills: getSkills('c', 'cpp'),
		type: 'Computational Robotics'
	},

	{
		slug: 'mr-lab-eth',
		name: 'Mixed Reality Lab',
		color: '#5e95e3',
		description: descMRLab,
		shortDescription:
			'A focus of this project is to explore synergies between mixed reality and robotics.',
		links: [],
		logo: Assets.ETH,
		bannerImage: getImagePath('julien-tromeur-EWg1-0UjeWY-unsplash.jpg'),
		period: {
			from: new Date()
		},
		skills: getSkills('csharp', 'unity-engine', 'cpp'),
		type: 'Computer Graphics'
	},

	{
		slug: 'fast-cpu-raymarcher',
		name: 'Fast CPU Raymarcher',
		color: '#5e95e3',
		description: descCpuRayMarcher,
		shortDescription:
			'Implementation and SIMD optimization of a rendering engine using the Ray Marcher method based on Sphere Tracing.',
		links: [{ to: 'https://github.com/Xemno/Optimized-CPU-Ray-Marcher', label: 'GitHub' }],
		logo: Assets.ETH,
		bannerImage: getImagePath('inception_0.png'),
		period: {
			from: new Date()
		},
		skills: getSkills('c', 'cpp'),
		type: 'Advanced Systems Lab',
		// screenshots: [
		// 	{
		// 		label: '1',
		// 		src: 'https://raw.githubusercontent.com/Xemno/Optimized-CPU-Ray-Marcher/blob/master/output_examples/out_1080_0.png'
		// 	},
		// ]
	},

	{
		slug: 'soft-body-physics-engine',
		name: 'Soft-Body Physics Engine',
		color: '#5e95e3',
		description: descSoftBodyEng,
		shortDescription:
			'Development of an interactive soft-body and rigid-body physics engine in the Unity game engine.',
		links: [{ to: 'https://github.com/devnio/Flowmo', label: 'GitHub' }],
		logo: Assets.ETH,
		bannerImage: getImagePath('flowmo_tree.jpg'),
		period: {
			from: new Date()
		},
		skills: getSkills('csharp', 'unity-engine'),
		type: 'Computer Graphics',
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
		shortDescription: 'Road Image Segmentation Project for Computational Intelligence Lab 2019 at ETH Zurich',
		links: [{ to: 'https://github.com/laurinpaech/segme-net', label: 'GitHub' }],
		logo: Assets.ETH,
		bannerImage: getImagePath('chicago108.png'),
		period: {
			from: new Date()
		},
		skills: getSkills('python'),
		type: 'Machine Learning',
		// TODO: maybe remove screenshots?
		// screenshots: [
		// 	{
		// 		label: '1',
		// 		src: getImagePath('label108.png')
		// 	},
		// 	{
		// 		label: 'Lorem',
		// 		src: getImagePath('chicago108.png')
		// 	},

		// ]
	},
];
