routes = [
  {
    path: '/',
    url: './index.html',
  },
  {
    path: '/about/',
    url: './pages/about.html',
  },
  {
    path: '/nosotros/',
    url: './pages/nosotros.html',
  },
  {
    path: '/ofertas/',
    url: './pages/ofertas.html',
  },
   {
    path: '/perfil/',
    url: './pages/perfil.html',
  },
    {
    path: '/login/',
    url: './pages/login.html',
  },
   {
    path: '/acercade/',
    url: './pages/acercade.html',
  },
   {
    path: '/registrarse/',
    loginScreen: {
      url: './pages/registrarse.html',
    },
    
  },
  // Default route (404 page). MUST BE THE LAST
  {
    path: '(.*)',
    url: './pages/404.html',
  },
];
