import { MenuItem } from '../models/menu.model';

// menu items for vertical and detached layout
const MENU_ITEMS: MenuItem[] = [
    { key: 'traitements-recettes', label: 'RECETTES', isTitle: true ,roles: ['SUPERVISEUR','COMPTABLE']},
    {
        key: 'recettes',
        label: 'Produits',
        link: '/traitements/saisies-recettes',
        icon: 'grid',
        isTitle: false,
        roles: ['SUPERVISEUR','COMPTABLE']
    },
    { key: 'traitements-depenses', label: 'DEPENSES', isTitle: true ,roles: ['SUPERVISEUR','COMPTABLE']},
    {
        key: 'di',
        label: 'Immobilisées',
        link: '/traitements/saisies-depenses-immobilisees',
        icon: 'grid',
        isTitle: false,
        roles: ['SUPERVISEUR','COMPTABLE']
    },
    {
        key: 'de',
        label: 'Exploitations',
        link: '/traitements/saisies-depenses-exploitations',
        icon: 'grid',
        isTitle: false,
        roles: ['SUPERVISEUR','COMPTABLE']
    },
    {
        key: 'salaires',
        label: 'Salaires',
        link: '/traitements/saisies-salaires',
        icon: 'grid',
        isTitle: false,
        roles: ['SUPERVISEUR','COMPTABLE']
    },

    { key: 'traitements-tresoreries', label: 'TRESORERIES', isTitle: true ,roles: ['SUPERVISEUR','COMPTABLE']},
    {
        key: 'encaissements',
        label: 'Encaissements',
        link: '/traitements/saisies-encaissements',
        icon: 'grid',
        isTitle: false,
        roles: ['SUPERVISEUR','COMPTABLE']
    },
    {
        key: 'encaissements',
        label: 'Decaissements',
        link: '/traitements/saisies-decaissements',
        icon: 'grid',
        isTitle: false,
        roles: ['SUPERVISEUR','COMPTABLE']
    },
    
    
    { key: 'etats', label: 'ETATS', isTitle: true,roles: ['SUPERVISEUR','COMPTABLE'] },

    {
        key: 'etatsdepenses',
        label: 'Etats Depenses',
        link: '/etats/etats-depenses',
        icon: 'folder-plus',
        isTitle: false,
        roles: ['SUPERVISEUR','COMPTABLE']
    },

    {
        key: 'etatsrecettes',
        label: 'Etats Recettes',
        link: '/etats/etats-recettes',
        icon: 'folder-plus',
        isTitle: false,
        roles: ['SUPERVISEUR','COMPTABLE']
    },
    {
        key: 'etatstresoreries',
        label: 'Etats Tresoreries',
        link: '/etats/etats-tresoreries',
        icon: 'folder-plus',
        isTitle: false,
        roles: ['SUPERVISEUR','COMPTABLE']
    },
    {
        key: 'ec',
        label: 'Ecritures Comptables',
        link: '/etats/ecritures-comptables',
        icon: 'folder-plus',
        isTitle: false,
        roles: ['SUPERVISEUR','COMPTABLE']
    },
    
    { key: 'parametrages', label: 'PARAMETRAGES', isTitle: true ,roles: ['ADMIN','SUPERVISEUR','COMPTABLE']},
    
    {
        key: 'exercice-comptable',
        label: 'Exercice',
        link: '/parametrages/exercice-comptable',
        icon: 'package',
        isTitle: false,
        roles: ['SUPERVISEUR','COMPTABLE']
    },
    {
        key: 'cabinet',
        label: 'Cabinets',
        link: '/parametrages/informations-cabinet',
        icon: 'package',
        isTitle: false,
        roles: ['SUPERVISEUR',]
    },
    {
        key: 'societes',
        label: 'Sociétés',
        link: '/parametrages/societes',
        icon: 'package',
        isTitle: false,
        roles: ['SUPERVISEUR']
    },
    {
        key: 'operations',
        label: "Operations",
        link: '/parametrages/operations',
        icon: 'package',
        isTitle: false,
        roles: ['ADMIN']
    },
    {
        key: 'comptescomptables',
        label: 'Comptes Comptable',
        link: '/parametrages/comptes-comptables',
        icon: 'package',
        isTitle: false,
        roles: ['ADMIN']
    },
    {
        key: 'plancomptable',
        label: 'Plan Comptable',
        link: '/parametrages/plan-comptable',
        icon: 'package',
        isTitle: false,
        roles: ['ADMIN']
    },
    {
        key: 'sectionnalytique',
        label: 'Section Analytique',
        link: '/parametrages/sections-analytiques',
        icon: 'package',
        isTitle: false,
        roles: ['ADMIN']
    },
    {
        key: 'plananalytique',
        label: 'Plan Analytique',
        link: '/parametrages/plan-analytique',
        icon: 'package',
        isTitle: false,
        roles: ['ADMIN']
    },
    {
        key: 'cabinets',
        label: 'Cabinets',
        link: '/parametrages/cabinets',
        icon: 'package',
        isTitle: false,
        roles: ['ADMIN', 'SUPERVISEUR']
    },
    {
        key: 'categories',
        label: 'Categories',
        link: '/parametrages/categories',
        icon: 'package',
        isTitle: false,
        roles: ['ADMIN']
    },
    {
        key: 'journaux',
        label: 'Journaux',
        link: '/parametrages/journaux',
        icon: 'package',
        isTitle: false,
        roles: ['ADMIN']
    },
    {
        key: 'tiers',
        label: 'Tiers',
        link: '/parametrages/tiers',
        icon: 'package',
        isTitle: false,
        roles: ['ADMIN']
    },
    {
        key: 'utilisateurs',
        label: 'Utilisateurs',
        link: '/parametrages/utilisateurs',
        icon: 'package',
        isTitle: false,
        roles: ['ADMIN','SUPERVISEUR']
    },
    {
        key: 'moncompte',
        label: 'Mon compte',
        link: '/parametrages/mon-compte',
        icon: 'package',
        isTitle: false,
        roles: ['ADMIN','SUPERVISEUR','COMPTABLE']
    }

];

// menu items for vertcal and detached layout
// const MENU_ITEMS: MenuItem[] = [
//     //{ key: 'tdb', label: 'TABLEAU BORD', isTitle: false, icon: 'home', link: '/dashboard/ecommerce' },
//     { key: 'menu', label: 'MENU', isTitle: true },
    
//     {
//         key: 'traitements',
//         label: 'Traitements',
//         isTitle: false,
//         icon: 'briefcase',
//         collapsed: true,
//         children: [
//             { key: 'previsions', label: 'Prévisions', link: '/traitements/saisies-previsionnelles', parentKey: 'traitements' },
//             { key: 'realisations', label: 'Réalisations', link: '/traitements/saisies-realisations', parentKey: 'traitements' },
//             { key: 'elementsbilan', label: 'Elements bilan', link: '/traitements/elements-bilan', parentKey: 'traitements' }
//         ],
//     },
//     {
//         key: 'etats',
//         label: 'Etats',
//         isTitle: false,
//         icon: 'clipboard',
//         collapsed: true,
//         children: [
//             { key: 'ecartsdepenses', label: 'Ecarts Depenses', link: '/etats/ecarts-depenses', parentKey: 'etats' },
//             { key: 'ecartsrecettes', label: 'Ecarts Recettes', link: '/etats/ecarts-recettes', parentKey: 'etats' },
//             { key: 'ratiotresorerie', label: 'Ratio Tresorerie', link: '/etats/ratio-tresorerie', parentKey: 'etats' },
//             { key: 'variationdepense-masse', label: 'Variation Depense Masse', link: '/etats/variation-depense-masse', parentKey: 'etats' },
//             { key: 'variationnette-brute', label: 'Variation Nette Brute', link: '/etats/variation-nette-brute', parentKey: 'etats' },
//             { key: 'variationrecette-masse', label: 'Variation Recette Masse', link: '/etats/variation-recette-masse', parentKey: 'etats' },
//         ],
//     },
//     {
//         key: 'parametrages',
//         label: 'Parametrages',
//         isTitle: false,
//         icon: 'clipboard',
//         collapsed: true,
//         children: [
//             { key: 'infossociete', label: 'Infos Société', link: '/parametrages/informations-societe', parentKey: 'parametrages' },
//             { key: 'rubrique', label: 'Rubrique', link: '/parametrages/rubrique', parentKey: 'parametrages' },
//             { key: 'sousrubrique', label: 'Sous Rubrique', link: '/parametrages/sous-rubrique', parentKey: 'parametrages' },
//             { key: 'codebudgetaire', label: 'Code Budgétaire', link: '/parametrages/code-budgetaire', parentKey: 'parametrages' }
//            //, { key: 'natureoperations', label: 'Nature des Opérations', link: '/parametrages/nature-operations', parentKey: 'parametrages' }
//         ],
//     }

// ];

// menu items for two column menu layout 
const TWO_COl_MENU_ITEMS: MenuItem[] = [
    {
        key: 'dashboard',
        icon: 'home',
        label: 'Dashboard',
        isTitle: true,
        children: [
            {
                key: 'ds-ecommerce',
                label: 'Ecommerce',
                link: '/dashboard/ecommerce',
                parentKey: 'dashboard',
            },
            {
                key: 'ds-analytics',
                label: 'Analytics',
                link: '/dashboard/analytics',
                parentKey: 'dashboard',
            }
        ],
    },
    {
        key: 'apps',
        icon: 'grid',
        label: 'Apps',
        isTitle: true,
        children: [
            {
                key: 'apps-calendar',
                label: 'Calendar',
                isTitle: false,
                icon: 'calendar',
                link: '/apps/calendar',
                parentKey: 'apps',
            },
            {
                key: 'apps-chat',
                label: 'Chat',
                isTitle: false,
                icon: 'message-square',
                link: '/apps/chat',
                parentKey: 'apps',
            },
            {
                key: 'apps-email',
                label: 'Email',
                isTitle: false,
                icon: 'mail',
                parentKey: 'apps',
                collapsed: true,
                children: [
                    {
                        key: 'email-inbox',
                        label: 'Inbox',
                        link: '/apps/email/inbox',
                        parentKey: 'apps-email',
                    },
                    {
                        key: 'email-read-email',
                        label: 'Read Email',
                        link: '/apps/email/details',
                        parentKey: 'apps-email',
                    },
                    {
                        key: 'email-compose-email',
                        label: 'Compose Email',
                        link: '/apps/email/compose',
                        parentKey: 'apps-email',
                    },
                ],
            },
            {
                key: 'apps-projects',
                label: 'Projects',
                isTitle: false,
                icon: 'briefcase',
                parentKey: 'apps',
                collapsed: true,
                children: [
                    { key: 'project-list', label: 'List', link: '/apps/projects/list', parentKey: 'apps-projects' },
                    {
                        key: 'project-details',
                        label: 'Detail',
                        link: '/apps/projects/details',
                        parentKey: 'apps-projects',
                    }
                ],
            },
            {
                key: 'apps-tasks',
                label: 'Tasks',
                isTitle: false,
                icon: 'clipboard',
                parentKey: 'apps',
                collapsed: true,
                children: [
                    { key: 'task-list', label: 'List', link: '/apps/tasks/list', parentKey: 'apps-tasks' },
                    { key: 'task-kanban', label: 'Kanban Board', link: '/apps/tasks/kanban', parentKey: 'apps-tasks' },
                ],
            },
            {
                key: 'apps-file-manager',
                label: 'File Manager',
                isTitle: false,
                icon: 'folder-plus',
                link: '/apps/file-manager',
                parentKey: 'apps',
            },
        ],
    },
    {
        key: 'extra-pages',
        icon: 'file-text',
        label: 'Pages',
        isTitle: true,
        children: [
            { key: 'page-starter', label: 'Starter', link: '/pages/starter', parentKey: 'extra-pages' },
            { key: 'page-profile', label: 'Profile', link: '/pages/profile', parentKey: 'extra-pages' },
            { key: 'page-activity', label: 'Activity', link: '/pages/activity', parentKey: 'extra-pages' },
            { key: 'page-invoice', label: 'Invoice', link: '/pages/invoice', parentKey: 'extra-pages' },
            { key: 'page-pricing', label: 'Pricing', link: '/pages/pricing', parentKey: 'extra-pages' },
            {
                key: 'page-maintenance',
                label: 'Maintenance',

                link: '/maintenance',
                parentKey: 'extra-pages',
            },
            { key: 'page-error-404', label: 'Error - 404', link: '/error-404', parentKey: 'extra-pages' },
            { key: 'page-error-500', label: 'Error - 500', link: '/error-500', parentKey: 'extra-pages' },
        ],
    },
    {
        key: 'components',
        icon: 'package',
        label: 'Components',
        isTitle: true,
        children: [
            { key: 'ui-elements', label: 'UI Elements', isTitle: false, icon: 'package', link: '/ui-element', parentKey: 'components' },
            {
                key: 'icons',
                label: 'Icons',
                isTitle: false,
                icon: 'cpu',
                parentKey: 'components',
                collapsed: true,
                children: [
                    { key: 'icon-unicons', label: 'Unicons', link: '/icons/unicon', parentKey: 'icons' },
                    { key: 'icon-feather', label: 'Feather', link: '/icons/feather', parentKey: 'icons' },
                    { key: 'icon-bootstrap', label: 'Bootstrap', link: '/icons/bootstrap', parentKey: 'icons' },
                ],
            },
            { key: 'charts', label: 'Charts', isTitle: false, icon: 'bar-chart-2', link: '/charts', parentKey: 'components' },
            {
                key: 'forms',
                label: 'Forms',
                isTitle: false,
                icon: 'bookmark',
                parentKey: 'components',
                collapsed: true,
                children: [
                    { key: 'form-basic', label: 'Basic Elements', link: '/forms/basic', parentKey: 'forms' },
                    { key: 'form-advanced', label: 'Advanced', link: '/forms/advanced', parentKey: 'forms' },
                    { key: 'form-validation', label: 'Validation', link: '/forms/validation', parentKey: 'forms' },
                    { key: 'form-wizard', label: 'Wizard', link: '/forms/wizard', parentKey: 'forms' },
                    { key: 'form-editors', label: 'Editors', link: '/forms/editors', parentKey: 'forms' },
                    { key: 'form-upload', label: 'File Uploads', link: '/forms/upload', parentKey: 'forms' }
                ],
            },
            {
                key: 'tables',
                label: 'Tables',
                isTitle: false,
                icon: 'grid',
                parentKey: 'components',
                collapsed: true,
                children: [
                    { key: 'table-basic', label: 'Basic', link: '/tables/basic', parentKey: 'tables' },
                    { key: 'table-advanced', label: 'Advanced Tables', link: '/tables/advanced', parentKey: 'tables' },
                ],
            },
            {
                key: 'maps',
                label: 'Maps',
                isTitle: false,
                icon: 'map',
                parentKey: 'components',
                collapsed: true,
                children: [
                    { key: 'maps-googlemaps', label: 'Google Maps', link: '/maps/googlemaps', parentKey: 'maps' },
                    { key: 'maps-vectormaps', label: 'Vector Maps', link: '/maps/vectormaps', parentKey: 'maps' },
                ],
            },
            {
                key: 'menu-levels',
                label: 'Menu Levels',
                isTitle: false,
                icon: 'share-2',
                parentKey: 'components',
                collapsed: true,
                children: [
                    {
                        key: 'menu-levels-1-1',
                        label: 'Level 1.1',
                        link: '/',
                        parentKey: 'menu-levels',
                        collapsed: true,
                        children: [
                            {
                                key: 'menu-levels-2-1',
                                label: 'Level 2.1',
                                link: '/',
                                parentKey: 'menu-levels-1-1',
                                collapsed: true,
                                children: [
                                    {
                                        key: 'menu-levels-3-1',
                                        label: 'Level 3.1',
                                        link: '/',
                                        parentKey: 'menu-levels-2-1',
                                    },
                                    {
                                        key: 'menu-levels-3-2',
                                        label: 'Level 3.2',
                                        link: '/',
                                        parentKey: 'menu-levels-2-1',
                                    },
                                ],
                            },
                            { key: 'menu-levels-2-2', label: 'Level 2.2', link: '/', parentKey: 'menu-levels-1-1' },
                        ],
                    },
                    { key: 'menu-levels-1-2', label: 'Level 1.2', link: '/', parentKey: 'menu-levels' },
                ],
            },
        ],
    },
    { key: 'widgets', label: 'Widgets', isTitle: false, icon: 'gift', link: '/widgets' },
];

// menu items for horizontal layout
const HORIZONTAL_MENU_ITEMS: MenuItem[] = [
    {
        key: 'dashboard',
        icon: 'home',
        label: 'Dashboards',
        isTitle: true,
        collapsed: true,
        children: [
            {
                key: 'ds-ecommerce',
                label: 'Ecommerce',
                link: '/dashboard/ecommerce',
                parentKey: 'dashboard',
            },
            {
                key: 'ds-analytics',
                label: 'Analytics',
                link: '/dashboard/analytics',
                parentKey: 'dashboard',
            }
        ],
    },
    {
        key: 'apps',
        icon: 'layers',
        label: 'Apps',
        isTitle: true,
        collapsed: true,
        children: [
            {
                key: 'apps-calendar',
                label: 'Calendar',
                isTitle: false,
                icon: 'calendar',
                link: '/apps/calendar',
                parentKey: 'apps',
            },
            {
                key: 'apps-chat',
                label: 'Chat',
                isTitle: false,
                icon: 'message-square',
                link: '/apps/chat',
                parentKey: 'apps',
            },
            {
                key: 'apps-email',
                label: 'Email',
                isTitle: false,
                icon: 'mail',
                parentKey: 'apps',
                collapsed: true,
                children: [
                    {
                        key: 'email-inbox',
                        label: 'Inbox',
                        link: '/apps/email/inbox',
                        parentKey: 'apps-email',
                    },
                    {
                        key: 'email-read-email',
                        label: 'Read Email',
                        link: '/apps/email/details',
                        parentKey: 'apps-email',
                    },
                    {
                        key: 'email-compose-email',
                        label: 'Compose Email',
                        link: '/apps/email/compose',
                        parentKey: 'apps-email',
                    },
                ],
            },
            {
                key: 'apps-projects',
                label: 'Projects',
                isTitle: false,
                icon: 'briefcase',
                parentKey: 'apps',
                collapsed: true,
                children: [
                    { key: 'project-list', label: 'List', link: '/apps/projects/list', parentKey: 'apps-projects' },
                    {
                        key: 'project-details',
                        label: 'Detail',
                        link: '/apps/projects/details',
                        parentKey: 'apps-projects',
                    },
                ],
            },
            {
                key: 'apps-tasks',
                label: 'Tasks',
                isTitle: false,
                icon: 'clipboard',
                parentKey: 'apps',
                collapsed: true,
                children: [
                    { key: 'task-list', label: 'List', link: '/apps/tasks/list', parentKey: 'apps-tasks' },
                    { key: 'task-kanban', label: 'Kanban Board', link: '/apps/tasks/kanban', parentKey: 'apps-tasks' },
                ],
            },
            {
                key: 'apps-file-manager',
                label: 'File Manager',
                isTitle: false,
                icon: 'folder-plus',
                link: '/apps/file-manager',
                parentKey: 'apps',
            },
        ],
    },
    {
        key: 'components',
        icon: 'briefcase',
        label: 'Components',
        isTitle: true,
        collapsed: true,
        children: [
            { key: 'ui-elements', label: 'UI Elements', isTitle: false, icon: 'package', link: '/ui-element', parentKey: 'components' },
            { key: 'widgets', label: 'Widgets', isTitle: false, icon: 'gift', link: '/widgets', parentKey: 'components' },

            {
                key: 'forms',
                label: 'Forms',
                isTitle: false,
                icon: 'bookmark',
                parentKey: 'components',
                collapsed: true,
                children: [
                    { key: 'form-basic', label: 'Basic Elements', link: '/forms/basic', parentKey: 'forms' },
                    { key: 'form-advanced', label: 'Advanced', link: '/forms/advanced', parentKey: 'forms' },
                    { key: 'form-validation', label: 'Validation', link: '/forms/validation', parentKey: 'forms' },
                    { key: 'form-wizard', label: 'Wizard', link: '/forms/wizard', parentKey: 'forms' },
                    { key: 'form-editors', label: 'Editors', link: '/forms/editors', parentKey: 'forms' },
                    { key: 'form-upload', label: 'File Uploads', link: '/forms/upload', parentKey: 'forms' }
                ],
            },
            { key: 'charts', label: 'Charts', isTitle: false, icon: 'bar-chart-2', link: '/charts', parentKey: 'components' },
            {
                key: 'tables',
                label: 'Tables',
                isTitle: false,
                icon: 'grid',
                parentKey: 'components',
                collapsed: true,
                children: [
                    { key: 'table-basic', label: 'Basic', link: '/tables/basic', parentKey: 'tables' },
                    { key: 'table-advanced', label: 'Advanced Tables', link: '/tables/advanced', parentKey: 'tables' },
                ],
            },
            {
                key: 'icons',
                label: 'Icons',
                isTitle: false,
                icon: 'cpu',
                parentKey: 'components',
                collapsed: true,
                children: [
                    { key: 'icon-unicons', label: 'Unicons', link: '/icons/unicon', parentKey: 'icons' },
                    { key: 'icon-feather', label: 'Feather', link: '/icons/feather', parentKey: 'icons' },
                    { key: 'icon-bootstrap', label: 'Bootstrap', link: '/icons/bootstrap', parentKey: 'icons' },
                ],
            },
            {
                key: 'maps',
                label: 'Maps',
                isTitle: false,
                icon: 'map',
                parentKey: 'components',
                collapsed: true,
                children: [
                    { key: 'maps-googlemaps', label: 'Google Maps', link: '/maps/googlemaps', parentKey: 'maps' },
                    { key: 'maps-vectormaps', label: 'Vector Maps', link: '/maps/vectormaps', parentKey: 'maps' },
                ],
            },
        ],
    },
    {
        key: 'extra-pages',
        label: 'Pages',
        isTitle: false,
        icon: 'file-text',
        collapsed: true,
        children: [
            { key: 'page-starter', label: 'Starter', isTitle: false, link: '/pages/starter', parentKey: 'extra-pages' },
            { key: 'page-profile', label: 'Profile', isTitle: false, link: '/pages/profile', parentKey: 'extra-pages' },
            { key: 'page-activity', label: 'Activity', isTitle: false, link: '/pages/activity', parentKey: 'extra-pages' },
            { key: 'page-invoice', label: 'Invoice', isTitle: false, link: '/pages/invoice', parentKey: 'extra-pages' },
            { key: 'page-pricing', label: 'Pricing', isTitle: false, link: '/pages/pricing', parentKey: 'extra-pages' },
            {
                key: 'page-maintenance',
                label: 'Maintenance',
                isTitle: false,
                link: '/maintenance',
                parentKey: 'extra-pages',
            },
            { key: 'page-error-404', label: 'Error - 404', isTitle: false, link: '/error-404', parentKey: 'extra-pages' },
            { key: 'page-error-500', label: 'Error - 500', isTitle: false, link: '/error-500', parentKey: 'extra-pages' },
        ],
    }

];

export { MENU_ITEMS, TWO_COl_MENU_ITEMS, HORIZONTAL_MENU_ITEMS };