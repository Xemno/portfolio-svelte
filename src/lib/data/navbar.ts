export const NavBar = {
	home: 'Qais El Okaili',
	projects: 'Projects',
	career: 'Experiences',
	education: 'Education',
	skills: 'Skills'
} as const;

export const items = [
	{ title: 'Projects', to: '/projects', icon: 'i-line-md-document-code' },
	{ title: 'Experience', to: '/experience', icon: 'i-line-md-text-box' },
	{ title: 'Education', to: '/education', icon: 'i-carbon-education' },
	{ title: 'Skills', to: '/skills', icon: 'i-carbon-software-resource-cluster' }
] as const;
