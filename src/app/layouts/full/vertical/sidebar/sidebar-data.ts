import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Home',
  },
  {
    displayName: 'Analytical',
    iconName: 'aperture',
    route: '/dashboards/dashboard1',
  },
  {
    displayName: 'eCommerce',
    iconName: 'shopping-cart',
    route: '/dashboards/dashboard2',
  },
  {
    navCap: 'Apps',
  },
  {
    displayName: 'Chat',
    iconName: 'message-2',
    route: 'apps/chat',
  },
  {
    displayName: 'Calendar',
    iconName: 'calendar-event',
    route: 'apps/calendar',
  },
  {
    displayName: 'Email',
    iconName: 'mail',
    route: 'apps/email/inbox',
  },
  {
    displayName: 'Contacts',
    iconName: 'phone',
    route: 'apps/contacts',
  },
  {
    displayName: 'Courses',
    iconName: 'certificate',
    route: 'apps/courses',
  },
  {
    displayName: 'Employee',
    iconName: 'brand-ctemplar',
    route: 'apps/employee',
  },
  {
    displayName: 'Notes',
    iconName: 'note',
    route: 'apps/notes',
  },
  {
    displayName: 'Tickets',
    iconName: 'ticket',
    route: 'apps/tickets',
  },
  {
    displayName: 'Invoice',
    iconName: 'file-invoice',
    route: 'apps/invoice',
  },
  {
    displayName: 'ToDo',
    iconName: 'edit',
    route: 'apps/todo',
  },
  {
    displayName: 'Taskboard',
    iconName: 'checklist',
    route: 'apps/taskboard',
  },
  {
    displayName: 'Blog',
    iconName: 'chart-donut-3',
    route: 'apps/blog',
    children: [
      {
        displayName: 'Post',
        iconName: 'point',
        route: 'apps/blog/post',
      },
      {
        displayName: 'Detail',
        iconName: 'point',
        route: 'apps/blog/detail/Early Black Friday Amazon deals: cheap TVs, headphones, laptops',
      },
    ],
  },
  {
    navCap: 'Pages',
  },
  {
    displayName: 'Roll Base Access',
    iconName: 'lock-access',
    route: 'apps/permission',
  },
  {
    displayName: 'Treeview',
    iconName: 'git-merge',
    route: 'theme-pages/treeview',
  },
  {
    displayName: 'Pricing',
    iconName: 'currency-dollar',
    route: 'theme-pages/pricing',
  },
  {
    displayName: 'Account Setting',
    iconName: 'user-circle',
    route: 'theme-pages/account-setting',
  },
  {
    displayName: 'FAQ',
    iconName: 'help',
    route: 'theme-pages/faq',
  },
  {
    displayName: 'Landingpage',
    iconName: 'app-window',
    route: 'landingpage',
  },
  {
    displayName: 'Widgets',
    iconName: 'layout',
    route: 'widgets',
    children: [
      {
        displayName: 'Cards',
        iconName: 'point',
        route: 'widgets/cards',
      },
      {
        displayName: 'Banners',
        iconName: 'point',
        route: 'widgets/banners',
      },
      {
        displayName: 'Charts',
        iconName: 'point',
        route: 'widgets/charts',
      },
    ],
  },
  {
    navCap: 'Forms',
  },
  {
    displayName: 'Form elements',
    iconName: 'apps',
    route: 'forms/forms-elements',
    children: [
      {
        displayName: 'Autocomplete',
        iconName: 'point',
        route: 'forms/forms-elements/autocomplete',
      },
      {
        displayName: 'Button',
        iconName: 'point',
        route: 'forms/forms-elements/button',
      },
      {
        displayName: 'Checkbox',
        iconName: 'point',
        route: 'forms/forms-elements/checkbox',
      },
      {
        displayName: 'Radio',
        iconName: 'point',
        route: 'forms/forms-elements/radio',
      },
      {
        displayName: 'Datepicker',
        iconName: 'point',
        route: 'forms/forms-elements/datepicker',
      },
    ],
  },
  {
    displayName: 'Form Layouts',
    iconName: 'file-description',
    route: '/forms/form-layouts',
  },
  {
    displayName: 'Form Horizontal',
    iconName: 'box-align-bottom',
    route: '/forms/form-horizontal',
  },
  {
    displayName: 'Form Vertical',
    iconName: 'box-align-left',
    route: '/forms/form-vertical',
  },
  {
    displayName: 'Form Wizard',
    iconName: 'files',
    route: '/forms/form-wizard',
  },
  {
    navCap: 'Tables',
  },
  {
    displayName: 'Tables',
    iconName: 'layout',
    route: 'tables',
    children: [
      {
        displayName: 'Basic Table',
        iconName: 'point',
        route: 'tables/basic-table',
      },
      {
        displayName: 'Dynamic Table',
        iconName: 'point',
        route: 'tables/dynamic-table',
      },
      {
        displayName: 'Expand Table',
        iconName: 'point',
        route: 'tables/expand-table',
      },
      {
        displayName: 'Filterable Table',
        iconName: 'point',
        route: 'tables/filterable-table',
      },
      {
        displayName: 'Footer Row Table',
        iconName: 'point',
        route: 'tables/footer-row-table',
      },
      {
        displayName: 'HTTP Table',
        iconName: 'point',
        route: 'tables/http-table',
      },
      {
        displayName: 'Mix Table',
        iconName: 'point',
        route: 'tables/mix-table',
      },
      {
        displayName: 'Multi Header Footer',
        iconName: 'point',
        route: 'tables/multi-header-footer-table',
      },
      {
        displayName: 'Pagination Table',
        iconName: 'point',
        route: 'tables/pagination-table',
      },
      {
        displayName: 'Row Context Table',
        iconName: 'point',
        route: 'tables/row-context-table',
      },
      {
        displayName: 'Selection Table',
        iconName: 'point',
        route: 'tables/selection-table',
      },
      {
        displayName: 'Sortable Table',
        iconName: 'point',
        route: 'tables/sortable-table',
      },
      {
        displayName: 'Sticky Column',
        iconName: 'point',
        route: 'tables/sticky-column-table',
      },
      {
        displayName: 'Sticky Header Footer',
        iconName: 'point',
        route: 'tables/sticky-header-footer-table',
      },
    ],
  },
  {
    navCap: 'Chart',
  },
  {
    displayName: 'Line',
    iconName: 'chart-line',
    route: '/charts/line',
  },
  {
    displayName: 'Gredient',
    iconName: 'chart-arcs',
    route: '/charts/gredient',
  },
  {
    displayName: 'Area',
    iconName: 'chart-area',
    route: '/charts/area',
  },
  {
    displayName: 'Candlestick',
    iconName: 'chart-candle',
    route: '/charts/candlestick',
  },
  {
    displayName: 'Column',
    iconName: 'chart-dots',
    route: '/charts/column',
  },
  {
    displayName: 'Doughnut & Pie',
    iconName: 'chart-donut-3',
    route: '/charts/doughnut-pie',
  },
  {
    displayName: 'Radialbar & Radar',
    iconName: 'chart-radar',
    route: '/charts/radial-radar',
  },
  {
    navCap: 'UI',
  },
  {
    displayName: 'Ui Components',
    iconName: 'box',
    route: 'ui-components',
    children: [
      {
        displayName: 'Badge',
        iconName: 'point',
        route: 'ui-components/badge',
      },
      {
        displayName: 'Expansion Panel',
        iconName: 'point',
        route: 'ui-components/expansion',
      },
      {
        displayName: 'Chips',
        iconName: 'point',
        route: 'ui-components/chips',
      },
      {
        displayName: 'Dialog',
        iconName: 'point',
        route: 'ui-components/dialog',
      },
      {
        displayName: 'Lists',
        iconName: 'point',
        route: 'ui-components/lists',
      },
      {
        displayName: 'Divider',
        iconName: 'point',
        route: 'ui-components/divider',
      },
      {
        displayName: 'Menu',
        iconName: 'point',
        route: 'ui-components/menu',
      },
      {
        displayName: 'Paginator',
        iconName: 'point',
        route: 'ui-components/paginator',
      },
      {
        displayName: 'Progress Bar',
        iconName: 'point',
        route: 'ui-components/progress',
      },
      {
        displayName: 'Progress Spinner',
        iconName: 'point',
        route: 'ui-components/progress-spinner',
      },
      {
        displayName: 'Ripples',
        iconName: 'point',
        route: 'ui-components/ripples',
      },
      {
        displayName: 'Slide Toggle',
        iconName: 'point',
        route: 'ui-components/slide-toggle',
      },
      {
        displayName: 'Slider',
        iconName: 'point',
        route: 'ui-components/slider',
      },
      {
        displayName: 'Snackbar',
        iconName: 'point',
        route: 'ui-components/snackbar',
      },
      {
        displayName: 'Tabs',
        iconName: 'point',
        route: 'ui-components/tabs',
      },
      {
        displayName: 'Toolbar',
        iconName: 'point',
        route: 'ui-components/toolbar',
      },
      {
        displayName: 'Tooltips',
        iconName: 'point',
        route: 'ui-components/tooltips',
      },
    ],
  },
  {
    navCap: 'Auth',
  },
  {
    displayName: 'Login',
    iconName: 'login',
    route: '/authentication',
    children: [
      {
        displayName: 'Side Login',
        iconName: 'point',
        route: '/authentication/side-login',
      },
      {
        displayName: 'Boxed Login',
        iconName: 'point',
        route: '/authentication/boxed-login',
      },
    ],
  },
  {
    displayName: 'Register',
    iconName: 'user-plus',
    route: '/authentication',
    children: [
      {
        displayName: 'Side Login',
        iconName: 'point',
        route: '/authentication/side-register',
      },
      {
        displayName: 'Boxed Login',
        iconName: 'point',
        route: '/authentication/boxed-register',
      },
    ],
  },
  {
    displayName: 'Forgot Password',
    iconName: 'rotate',
    route: '/authentication',
    children: [
      {
        displayName: 'Side Forgot Password',
        iconName: 'point',
        route: '/authentication/side-forgot-pwd',
      },
      {
        displayName: 'Boxed Forgot Password',
        iconName: 'point',
        route: '/authentication/boxed-forgot-pwd',
      },
    ],
  },
  {
    displayName: 'Two Steps',
    iconName: 'zoom-code',
    route: '/authentication',
    children: [
      {
        displayName: 'Side Two Steps',
        iconName: 'point',
        route: '/authentication/side-two-steps',
      },
      {
        displayName: 'Boxed Two Steps',
        iconName: 'point',
        route: '/authentication/boxed-two-steps',
      },
    ],
  },
  {
    displayName: 'Error',
    iconName: 'alert-circle',
    route: '/authentication/error',
  },
  {
    displayName: 'Maintenance',
    iconName: 'settings',
    route: '/authentication/maintenance',
  },
  {
    navCap: 'Other',
  },
  {
    displayName: 'Menu Level',
    iconName: 'box-multiple',
    route: '/menu-level',
    children: [
      {
        displayName: 'Menu 1',
        iconName: 'point',
        route: '/menu-1',
        children: [
          {
            displayName: 'Menu 1',
            iconName: 'point',
            route: '/menu-1',
          },

          {
            displayName: 'Menu 2',
            iconName: 'point',
            route: '/menu-2',
          },
        ],
      },

      {
        displayName: 'Menu 2',
        iconName: 'point',
        route: '/menu-2',
      },
    ],
  },
  {
    displayName: 'Disabled',
    iconName: 'ban',
    route: '/disabled',
    disabled: true,
  },
  {
    displayName: 'Chip',
    iconName: 'mood-smile',
    route: '/',
    chip: true,
    chipClass: 'bg-primary text-white',
    chipContent: '9',
  },
  {
    displayName: 'Outlined',
    iconName: 'mood-smile',
    route: '/',
    chip: true,
    chipClass: 'b-1 border-primary text-primary',
    chipContent: 'outlined',
  },
  {
    displayName: 'External Link',
    iconName: 'star',
    route: 'https://www.google.com/',
    external: true,
  },
];
