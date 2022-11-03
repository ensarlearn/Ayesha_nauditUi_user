// ----------------------------------------------------------------------

function path(root: string, sublink: string) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/dashboard';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  register: path(ROOTS_AUTH, '/register'),
  loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),
  registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
  verify: path(ROOTS_AUTH, '/verify'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
  newPassword: path(ROOTS_AUTH, '/new-password'),
};

export const PATH_PAGE = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page403: '/403',
  page404: '/404',
  page500: '/500',
  components: '/components',
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  general: {
    app: path(ROOTS_DASHBOARD, '/app'),
    ecommerce: path(ROOTS_DASHBOARD, '/ecommerce'),
    analytics: path(ROOTS_DASHBOARD, '/analytics'),
    banking: path(ROOTS_DASHBOARD, '/banking'),
    booking: path(ROOTS_DASHBOARD, '/booking'),
  },
  mail: {
    root: path(ROOTS_DASHBOARD, '/mail'),
    all: path(ROOTS_DASHBOARD, '/mail/all'),
  },
  chat: {
    root: path(ROOTS_DASHBOARD, '/chat'),
    new: path(ROOTS_DASHBOARD, '/chat/new'),
    view: (name: string) => path(ROOTS_DASHBOARD, `/chat/${name}`),
  },
  calendar: path(ROOTS_DASHBOARD, '/calendar'),
  kanban: path(ROOTS_DASHBOARD, '/kanban'),
  permissionDenied: path(ROOTS_DASHBOARD, '/permission-denied'),
  user: {
    root: path(ROOTS_DASHBOARD, '/user'),
    new: path(ROOTS_DASHBOARD, '/user/new'),
    list: path(ROOTS_DASHBOARD, '/user/list'),
    softwares: path(ROOTS_DASHBOARD, '/user/softwares'),
    cards: path(ROOTS_DASHBOARD, '/user/cards'),
    profile: path(ROOTS_DASHBOARD, '/user/profile'),
    account: path(ROOTS_DASHBOARD, '/user/account'),
    edit: (name: string) => path(ROOTS_DASHBOARD, `/user/${name}/edit`),
    demoEdit: path(ROOTS_DASHBOARD, `/user/reece-chung/edit`),

    roleedit: (id: string) => path(ROOTS_DASHBOARD, `/user/${id}/roleedit`),
    role: path(ROOTS_DASHBOARD, '/user/role'),
    rolenew: path(ROOTS_DASHBOARD, '/user/rolenew'),
    // employee list
    employeeedit: (id: string) => path(ROOTS_DASHBOARD, `/user/${id}/employeeedit`),
    employee: path(ROOTS_DASHBOARD, '/user/employee'),
    employeenew: path(ROOTS_DASHBOARD, '/user/employeenew'),
  },
  nist: {
    root: path(ROOTS_DASHBOARD, '/nist'),

    systemsedit: (id: string) => path(ROOTS_DASHBOARD, `/nist/${id}/systemsedit`),
    systems: path(ROOTS_DASHBOARD, '/nist/systems'),

    softwareedit: (id: string) => path(ROOTS_DASHBOARD, `/nist/${id}/softwareedit`),
    softwares: path(ROOTS_DASHBOARD, '/nist/softwares'),

    controlsedit: (id: string) => path(ROOTS_DASHBOARD, `/nist/${id}/controlsedit`),
    controls: path(ROOTS_DASHBOARD, '/nist/controls'),

    featureedit: (id: string) => path(ROOTS_DASHBOARD, `/nist/${id}/featureedit`),
    features: path(ROOTS_DASHBOARD, '/nist/features'),

    systemsnew: path(ROOTS_DASHBOARD, '/nist/systemsnew'),
    softwarenew: path(ROOTS_DASHBOARD, '/nist/softwarenew'),
    controlsnew: path(ROOTS_DASHBOARD, '/nist/controlsnew'),
    featurenew: path(ROOTS_DASHBOARD, '/nist/featurenew'),
  },
  timeoff: {
    root: path(ROOTS_DASHBOARD, '/timeoff'),

    holidaysedit: (id: string) => path(ROOTS_DASHBOARD, `/timeoff/${id}/holidaysedit`),
    holidays: path(ROOTS_DASHBOARD, '/timeoff/holidays'),
    holidaysnew: path(ROOTS_DASHBOARD, '/timeoff/holidaysnew'),

    timeoffedit: (id: string) => path(ROOTS_DASHBOARD, `/timeoff/${id}/timeoffedit`),
    timeoff: path(ROOTS_DASHBOARD, '/timeoff/timeoff'),
    timeoffnew: path(ROOTS_DASHBOARD, '/timeoff/timeoffnew'),
  },
  linkedin:{
    root: path(ROOTS_DASHBOARD, '/linkedin'),
    linkedinleadview: (id: string) => path(ROOTS_DASHBOARD, `/linkedin/${id}/linkedinleadview`),
    linkedinleadedit: (id: string | undefined) => path(ROOTS_DASHBOARD, `/linkedin/${id}/linkedinleadedit`),
    linkedinlead: path(ROOTS_DASHBOARD, '/linkedin/linkedinlead'),
    linkedinleadnew: path(ROOTS_DASHBOARD, '/linkedin/linkedinleadnew'),

    linkedinaccountedit: (id: string) => path(ROOTS_DASHBOARD, `/linkedin/${id}/linkedinaccountedit`),
    linkedinaccount: path(ROOTS_DASHBOARD, '/linkedin/linkedinaccount'),
    linkedinaccountnew: path(ROOTS_DASHBOARD, '/linkedin/linkedinaccountnew'),
  },
  hr: {
    root: path(ROOTS_DASHBOARD, '/hr'),

    statusedit: (id: string) => path(ROOTS_DASHBOARD, `/hr/${id}/statusedit`),
    status: path(ROOTS_DASHBOARD, '/hr/status'),
    statusnew: path(ROOTS_DASHBOARD, '/hr/statusnew'),

    timesheetattendanceedit: (id: string) => path(ROOTS_DASHBOARD, `/hr/${id}/timesheetattendanceedit`),
    timesheetattendance: path(ROOTS_DASHBOARD, '/hr/timesheetattendance'),
    timesheetattendancenew: path(ROOTS_DASHBOARD, '/hr/timesheetattendancenew'),


    departmentedit: (id: string) => path(ROOTS_DASHBOARD, `/hr/${id}/departmentedit`),
    department: path(ROOTS_DASHBOARD, '/hr/department'),
    departmentnew: path(ROOTS_DASHBOARD, '/hr/departmentnew'),


    projectedit: (id: string) => path(ROOTS_DASHBOARD, `/hr/${id}/projectedit`),
    project: path(ROOTS_DASHBOARD, '/hr/project'),
    projectnew: path(ROOTS_DASHBOARD, '/hr/projectnew'),

    taskedit: (id: string) => path(ROOTS_DASHBOARD, `/hr/${id}/taskedit`),
    task: path(ROOTS_DASHBOARD, '/hr/task'),
    tasknew: path(ROOTS_DASHBOARD, '/hr/tasknew'),

    subtaskedit: (id: string) => path(ROOTS_DASHBOARD, `/hr/${id}/subtaskedit`),
    subtask: path(ROOTS_DASHBOARD, '/hr/subtask'),
    subtasknew: path(ROOTS_DASHBOARD, '/hr/subtasknew'),
  },
  eCommerce: {
    root: path(ROOTS_DASHBOARD, '/e-commerce'),
    shop: path(ROOTS_DASHBOARD, '/e-commerce/shop'),
    list: path(ROOTS_DASHBOARD, '/e-commerce/list'),
    softwares: path(ROOTS_DASHBOARD, '/e-commerce/softwares'),
    checkout: path(ROOTS_DASHBOARD, '/e-commerce/checkout'),
    new: path(ROOTS_DASHBOARD, '/e-commerce/product/new'),
    view: (name: string) => path(ROOTS_DASHBOARD, `/e-commerce/product/${name}`),
    edit: (name: string) => path(ROOTS_DASHBOARD, `/e-commerce/product/${name}/edit`),
    demoEdit: path(ROOTS_DASHBOARD, '/e-commerce/product/nike-blazer-low-77-vintage/edit'),
    demoView: path(ROOTS_DASHBOARD, '/e-commerce/product/nike-air-force-1-ndestrukt'),
  },
  invoice: {
    root: path(ROOTS_DASHBOARD, '/invoice'),
    list: path(ROOTS_DASHBOARD, '/invoice/list'),
    softwares: path(ROOTS_DASHBOARD, '/invoice/softwares'),
    new: path(ROOTS_DASHBOARD, '/invoice/new'),
    view: (id: string) => path(ROOTS_DASHBOARD, `/invoice/${id}`),
    edit: (id: string) => path(ROOTS_DASHBOARD, `/invoice/${id}/edit`),
    demoEdit: path(ROOTS_DASHBOARD, '/invoice/e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1/edit'),
    demoView: path(ROOTS_DASHBOARD, '/invoice/e99f09a7-dd88-49d5-b1c8-1daf80c2d7b5'),
  },
  blog: {
    root: path(ROOTS_DASHBOARD, '/blog'),
    posts: path(ROOTS_DASHBOARD, '/blog/posts'),
    new: path(ROOTS_DASHBOARD, '/blog/new'),
    view: (title: string) => path(ROOTS_DASHBOARD, `/blog/post/${title}`),
    demoView: path(ROOTS_DASHBOARD, '/blog/post/apply-these-7-secret-techniques-to-improve-event'),
  },
};

export const PATH_DOCS = 'https://docs-minimals.vercel.app/introduction';
