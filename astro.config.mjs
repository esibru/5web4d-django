// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://esibru.github.io',
  	base: '/5web4d-django/',
	integrations: [
		starlight({
			title: '5WEB4D',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/withastro/starlight' }],
			sidebar: [
				{
					label: '1. Introduction',
					items: [
						{ label: '1.1 - Introduction', slug: 'labos/introduction' },
						{ label: '1.2 - Ma première vue', slug: 'labos/first-view' },
						{ label: '1.3 - Mon premier modèle', slug: 'labos/first-model' },
						{ label: '1.4 - Vues et gabarits - introduction', slug: 'labos/view-templates-intro' },
					],
				},
				{
					label: '2 - Vues et gabarits',
					items: [
						{ label: '2.1 - Héritage de gabarit', slug: 'labos/template-inheritance' },
						{ label: '2.2 - Formulaire', slug: 'labos/forms' },
						{ label: '2.3 - Vues génériques', slug: 'labos/generic-views' },
						{ label: '2.4 - Incrustation de gabarit', slug: 'labos/template-include' },
					],
				},
				{
					label: '3 - Concepts divers',
					items: [
						{ label: '3.1 - Les tests', slug: 'labos/tests' },
						{ label: '3.2 - PostgreSQL', slug: 'labos/postgresql' },
						{ label: '3.3 - Amélioration des pages développeurs', slug: 'labos/developer-improvement' },
						{ label: '3.4 - Gestion des tâches', slug: 'labos/tasks-management' },
						{ label: '3.5 - Gestion des onglets actifs', slug: 'labos/tab-management'},
					],
				},
				{
					label: '4 - Gestion des utilisateurs',
					items: [
						{ label: "4.1 - Page d'administration", slug: 'labos/admin-page'},
						{ label: "4.2 - Gestion des utilisateurs", slug: 'labos/user-management'},
						{ label: "4.3 - Authentification", slug: 'labos/authentification'},
						{ label: "4.4 - Sécurité", slug: 'labos/security'},
					],
				},
			],
		}),
	],
});
