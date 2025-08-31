import type { Project } from '../types';

import { getSkills } from './skills';
import Assets from './assets';
import descAiRoadSeg from '@md/Projects/descAiRoadSeg.md?raw';
import descSoftBodyEng from '@md/Projects/descSoftBodyPhysics.md?raw';
import descCpuRayMarcher from '@md/Projects/descFastCpuRayMarcher.md?raw';
import descMRLab from '@md/Projects/descMixedRealityLab.md?raw';
import descBachelorThesis from '@md/Projects/descBachelorThesis.md?raw';
import descMasterThesis from '@md/Projects/descMasterThesis.md?raw';
import descDriveWebsite from '@md/Projects/descDriveWebsite.md?raw';
import descThisWebsite from '@md/Projects/descThisWebsite.md?raw';

export const title = 'Projects';

export const items: Array<Project> = [
	{
		slug: 'my-portfolio-website',
		name: 'This Website',
		color: '#DAA520',
		description: descThisWebsite,
		shortDescription:
			'A dynamic, interactive website I built while mastering modern web development with Svelte, Node.js, and Three.js.',
		links: [{ to: '', label: '' }],
		logo: 'i-line-md-coffee-loop',
		period: {
			from: new Date(2023, 10, 15),
			to: new Date(2025, 3, 15)
		},
		skills: getSkills('svelte', 'ts', 'css', 'js', 'html', 'nodejs'),
		type: 'Personal Project',
		screenshots: [],
	},
	{
		slug: 'dr1ve-website',
		name: 'Dr1ve Website',
		color: '#DAA520',
		description: descDriveWebsite,
		shortDescription:
			'Designed and developed a landing page for Dr1ve GmbH using Svelte and TypeScript, ensuring a sleek and responsive user experience.',
		links: [{ to: 'https://dr1ve.ch/', label: 'dr1ve.ch' }],
		logo: Assets.Drive,
		period: {
			from: new Date(2024, 8, 15),
			to: new Date(2024, 10, 15)
		},
		skills: getSkills('svelte', 'ts', 'css', 'js', 'html', 'nodejs'),
		type: 'Professional Website',
		screenshots: []
	},
	{
		slug: 'master-thesis',
		name: 'Master Thesis',
		color: '#DAA520',
		description: descMasterThesis,
		shortDescription:
			'A novel AI character animation system for virtual production. The goal is to produce high-quality motion on various terrains and learns different gait styles.',
		links: [],
		logo: Assets.ETH,
		period: {
			from: new Date(2020, 8, 14),
			to: new Date(2021, 3, 15)
		},
		skills: getSkills('csharp', 'unity-engine', 'python'),
		type: 'Master Thesis at Disney Research',
		screenshots: []
	},

	{
		slug: 'bachelor-thesis',
		name: 'Bachelor Thesis',
		color: '#DAA520',
		description: descBachelorThesis,
		shortDescription:
			'In this thesis I am researching touch and/or deformation sensing in soft substrates using electrical resistance/impedance tomography techniques.',
		links: [],
		logo: Assets.ETH,
		period: {
			from: new Date(2020, 8, 1),		// TODO:
			to: new Date(2020, 12, 1)		// TODO: 
		},
		skills: getSkills('c', 'cpp'),
		type: 'Computational Robotics',
		screenshots: []
	},

	{
		slug: 'mr-lab-eth',
		name: 'Mixed Reality Lab',
		color: '#DAA520',
		description: descMRLab,
		shortDescription:
			'A focus of this project is to explore synergies between mixed reality and robotics.',
		links: [],
		logo: Assets.ETH,
		period: {
			from: new Date(2019, 11, 1),
			to: new Date(2020, 2, 10)
		},
		skills: getSkills('csharp', 'unity-engine', 'cpp'),
		type: 'Computer Graphics',
		screenshots: []
	},

	{
		slug: 'fast-cpu-raymarcher',
		name: 'Fast CPU Raymarcher',
		color: '#DAA520',
		description: descCpuRayMarcher,
		shortDescription:
			'Implementation and SIMD optimization of a rendering engine using the Ray Marcher method based on Sphere Tracing.',
		links: [{ to: 'https://github.com/Xemno/Optimized-CPU-Ray-Marcher', label: 'GitHub' }],
		logo: Assets.ETH,
		period: {
			from: new Date(2020, 3, 14),
			to: new Date(2020, 6, 31)
		},
		skills: getSkills('c', 'cpp'),
		type: 'Advanced Systems Lab',
		screenshots: []
	},

	{
		slug: 'soft-body-physics-engine',
		name: 'Soft-Body Physics Engine',
		color: '#DAA520',
		description: descSoftBodyEng,
		shortDescription:
			'Development of an interactive soft-body and rigid-body physics engine in the Unity game engine.',
		links: [{ to: 'https://github.com/devnio/Flowmo', label: 'GitHub' }],
		logo: Assets.ETH,
		period: {
			from: new Date(2019, 8, 14),
			to: new Date(2019, 12, 2)
		},
		skills: getSkills('csharp', 'unity-engine'),
		type: 'Computer Graphics',
		screenshots: []
	},

	{
		slug: 'ai-road-segmentation',
		name: 'AI Road Segmentation',
		color: '#DAA520',
		description: descAiRoadSeg,
		shortDescription:
			'Road Image Segmentation Project for Computational Intelligence Lab 2019 at ETH Zurich',
		links: [{ to: 'https://github.com/laurinpaech/segme-net', label: 'GitHub' }],
		logo: Assets.ETH,
		period: {
			from: new Date(2019, 3, 14),
			to: new Date(2019, 11, 31)
		},
		skills: getSkills('python'),
		type: 'Machine Learning',
		screenshots: []
	}
];
