export const navbarRoutes: any = {
  loggedOutNavRoutes: [
    {
      name: 'Landing',
      route: '/',
    },
    {
      name: 'Contact',
      route: '/contact',
    },
    {
      name: 'Register',
      route: '/register',
    },
    {
      name: 'Login',
      route: '/log-in',
    }
  ],
  loggedInNavRoutes: [
    {
      name: 'Home',
      route: '/home',
    },
    {
      name: 'Contact',
      route: '/contact',
    },
    {
      name: 'Todo',
      route: '/todo',
    }
  ]
};
