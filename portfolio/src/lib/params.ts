import MY_EXPERIENCES from './experiences.params';
import MY_PROJECTS from './projects.params';
import MY_SKILLS from './skills.params';
import { MY_EDUCATIONS } from './educations.params';
import { Icons } from './utils';
import descMainPage from './md/descMainPage.md?raw';
import type { NavItem } from '$lib/types';
import {
	Platform,
	type HomePageParams,
	type ProjectPageParams,
	type ExperiencePageParams,
	type SkillsPageParams,
	type ResumePageParams,
	type SearchPageParams,
	type EducationPageParams
} from './types';


export const TITLE_SUFFIX = 'Portfolio';
export const NavBar = {
	home: 'Qais El Okaili',
	projects: 'Projects',
	career: 'Experiences',
	education: 'Education',
	skills: 'Skills',
	resume: 'Resume',
	test: 'Test'
} as const;

// NOTE: Home and Search are not included
export const navItems = [
	{ title: NavBar.projects, to: '/projects', icon: 'i-carbon-cube' },
	{ title: NavBar.career, to: '/experience', icon: 'i-carbon-development' },
	{ title: NavBar.education, to: '/education', icon: 'i-carbon-education' },
	{ title: NavBar.skills, to: '/skills', icon: 'i-carbon-software-resource-cluster' },
	{ title: NavBar.resume, to: '/resume', icon: 'i-carbon-result' },
	{ title: NavBar.test, to: '/test', icon: 'i-carbon-result' }
] as const;

export function routeToName(route: string): NavItem {
	let navItem: NavItem = { idx: 0, id: HOME.name + ' ' + HOME.lastName }; // default is home

	route = route.replaceAll('/', '');

	Array.from(navItems).forEach(function (item, idx) {
		const it = item.to.replaceAll('/', '');
		if (route === it) {
			navItem = { idx: idx + 1, id: item.title };
			return;
		}
	});

	// search page
	if (route === 'search') {
		navItem = { idx: navItems.length + 1, id: "Search" };
	}

	// console.log('::', navItem, ' - ', route);

	return navItem;
}

export const getPlatfromIcon = (platform: Platform): Icons => {
	switch (platform) {
		case Platform.GitHub:
			return Icons.GitHub;
		case Platform.Linkedin:
			return Icons.LinkedIn;
		case Platform.StackOverflow:
			return Icons.StackOverflow;
		case Platform.Facebook:
			return Icons.Facebook;
		case Platform.Email:
			return Icons.Email;
		case Platform.Twitter:
			return Icons.Twitter;
		case Platform.Youtube:
			return Icons.Youtube;
	}
};

export const HOME: HomePageParams = {
	title: 'Home',
	name: 'Qais',
	lastName: 'El Okaili',
	description: descMainPage,
	links: [
		{ platform: Platform.GitHub, link: 'https://github.com/Xemno' },
		{
			platform: Platform.Linkedin,
			link: 'https://www.linkedin.com/in/qais-el-okaili-442703181/'
		},
		{
			platform: Platform.Email,
			link: 'elokaili.qais@gmail.com'
		}
		// {
		// 	platform: Platform.Twitter,
		// 	link: 'https://twitter.com/'
		// },
		// {
		// 	platform: Platform.StackOverflow,
		// 	link: 'https://stackoverflow.com/'
		// },

		// {
		// 	platform: Platform.Youtube,
		// 	link: 'https://www.youtube.com/channel/UCHOSq6Lc1WlCYeqqGDOj9Vw'
		// },
		// {
		// 	platform: Platform.Facebook,
		// 	link: 'https://www.facebook.com'
		// }
	]
};

export const PROJECTS: ProjectPageParams = {
	title: 'Projects',
	items: MY_PROJECTS
};

export const EXPERIENCES: ExperiencePageParams = {
	title: 'Work Experience',
	items: MY_EXPERIENCES
};

export const SKILLS: SkillsPageParams = {
	title: 'Skills',
	items: MY_SKILLS
};

export const EDUCATION: EducationPageParams = {
	title: 'Education',
	items: MY_EDUCATIONS
};

export const RESUME: ResumePageParams = {
	title: 'Resumé',
	item: ''
};

export const SEARCH: SearchPageParams = {
	title: 'Search'
};
