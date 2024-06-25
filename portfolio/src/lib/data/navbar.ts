
export const NavBar = {
	home: 'Qais El Okaili',
	projects: 'Projects',
	career: 'Experiences',
	education: 'Education',
	skills: 'Skills',
	resume: 'Resume',
	test: 'Test'
} as const;

export const items = [
	{ title: 'Projects', to: '/projects', icon: 'i-carbon-cube' },
	{ title: 'Experience', to: '/experience', icon: 'i-carbon-development' },
	{ title: 'Education', to: '/education', icon: 'i-carbon-education' },
	{ title: 'Skills', to: '/skills', icon: 'i-carbon-software-resource-cluster' },
	{ title: 'Resumé', to: '/resume', icon: 'i-carbon-result' },
	{ title: 'Test', to: '/test', icon: 'i-carbon-result' }
] as const;

// NOTE: Home and Search are not included
// export const navItems = [
// 	{ title: NavBar.projects, to: '/projects', icon: 'i-carbon-cube' },
// 	{ title: NavBar.career, to: '/experience', icon: 'i-carbon-development' },
// 	{ title: NavBar.education, to: '/education', icon: 'i-carbon-education' },
// 	{ title: NavBar.skills, to: '/skills', icon: 'i-carbon-software-resource-cluster' },
// 	{ title: NavBar.resume, to: '/resume', icon: 'i-carbon-result' },
// 	{ title: NavBar.test, to: '/test', icon: 'i-carbon-result' }
// ] as const;