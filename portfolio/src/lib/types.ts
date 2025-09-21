import type { Color } from './utils/colors';

export type NavItem = { slug: string; name: string; idx: number };

export enum Platform {
	GitHub = 'github',
	StackOverflow = 'stackoverflow',
	Twitter = 'twitter',
	Linkedin = 'linkedin',
	Email = 'email',
	Facebook = 'facebook',
	Youtube = 'youtube'
}

export enum ContractType {
	FullTime = 'Full-time',
	PartTime = 'Part-time',
	SelfEmployed = 'Self-employed',
	Freelance = 'Freelance',
	Contract = 'Contract',
	Internship = 'Internship'
}

export type Icon = `i-${string}-${string}`;
export type AssetExtended = { light: string; dark: string };
export type Asset = string | Icon | AssetExtended;

export interface Item<S extends string = string> {
	slug: S;
	name: string;
	logo: Asset;
	shortDescription: string;
	description: string;
}

export interface Link {
	to: string;
	label: string;
	newTab?: boolean;
}

export interface IconLink extends Link {
	icon: Asset;
}

export interface Skill<S extends string = string> extends Omit<Item<S>, 'shortDescription'> {
	color: string;
}

export interface Project<S extends string = string> extends Item<S> {
	// bannerImage: Asset;
	links: Array<Link>;
	color: Color;
	period: {
		from: Date;
		to?: Date;
	};
	type: string;
	skills: Array<Skill<S>>;
}

export interface Experience<S extends string = string> extends Project<S> {
	company: string;
	location: string;
	contract: ContractType;
	logo: Icon;
}

export interface Education<S extends string = string> extends Item<S> {
	organization: string;
	location: string;
	period: {
		from: Date;
		to?: Date;
	};
	majors: Array<string>;
	degree: string;
	color: Color;
}

export interface HomeLink {
	platform: Platform;
	link: string;
}

export type StringWithAutoComplete<T> = T | (string & Record<never, never>);
