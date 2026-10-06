import type { Lang } from "./LanguageContext";

export type Dict = {
  navLabel: string;
  menuOpen: string;
  menuClose: string;
  home: string;
  explore: string;
  about: string;
  cities: string;
  categoriesMenu: string;
  soon: string;
  language: string;
  skip: string;
  logoAlt: string;
  heroTitleA: string;
  heroCityWord: string;
  heroSub: string;
  searchLabel: string;
  searchPlaceholder: string;
  searchButton: string;
  categoriesNavLabel: string;
  categoryPrevious: string;
  categoryNext: string;
  projectsFor: (q: string) => string;
  aboutTitle: string;
  aboutP1: string;
  aboutP2: string;
  aboutCta: string;
  cityH1: [
    (city: string) => string,
    (city: string) => string,
    (city: string) => string,
  ];
  cityP: (city: string) => string;
  cityCta: (city: string) => string;
  categoryH1: [
    (category: string) => string,
    (category: string) => string,
    (category: string) => string,
  ];
  categorySub: (category: string) => string;
  categoryHeading: (category: string) => string;
  categoryIntro: (category: string) => string;
  categoryProjectsHeading: (category: string) => string;
  contribute: string;
  contributeTitle: string;
  contributeP1: string;
  contributeP2: string;
  contributeCta: string;
  loginTitle: string;
  emailLabel: string;
  passwordLabel: string;
  nameLabel: string;
  loginButton: string;
  noAccount: string;
  registerLink: string;
  registerTitle: string;
  registerButton: string;
  hasAccount: string;
  loginLink: string;
  orContinue: string;
  socialGithub: string;
  socialGoogle: string;
  authError: string;
  profile: string;
  projectsHeading: string;
  projectsInCity: (city: string) => string;
  projectsEmpty: string;
  projectsEmptyCta: string;
  projectImageUnavailable: string;
  projectOpen: string;
  projectShareLabel: string;
  projectShareAriaLabel: (title: string) => string;
  projectShareCopied: string;
  projectShareDone: string;
  projectShareError: string;
  projectLike: string;
  projectUnlike: string;
  projectLikeCount: (count: number) => string;
  projectTechnologies: string;
  projectDetails: string;
  projectRepository: string;
  projectLiveDemo: string;
  projectAuthor: string;
  profileTitle: string;
  profileDescription: string;
  profilePersonalInfo: string;
  profileLinks: string;
  profileName: string;
  profileGithub: string;
  profileLinkedin: string;
  profileTwitter: string;
  profileWhatsapp: string;
  profileWhatsappHint: string;
  profileSave: string;
  profileSaving: string;
  profileSaved: string;
  profileSaveError: string;
  profileInvalid: string;
  profileSessionExpired: string;
  profileOnboardingTitle: string;
  profileOnboardingDescription: string;
  profileCreateProject: string;
  profileExploreProjects: string;
  createProjectTitle: string;
  createProjectDescription: string;
  createProjectName: string;
  createProjectDescriptionLabel: string;
  createProjectCity: string;
  createProjectChooseCity: string;
  createProjectCategories: string;
  createProjectCategoryHint: string;
  createProjectImage: string;
  createProjectImageHint: string;
  createProjectImageUpload: string;
  createProjectImageAllowed: string;
  createProjectImageUploading: string;
  createProjectImageError: string;
  createProjectImagePreview: string;
  createProjectWebsite: string;
  createProjectRepository: string;
  createProjectSubmit: string;
  createProjectSubmitting: string;
  createProjectEmptyCatalog: string;
  createProjectInvalid: string;
  createProjectSessionExpired: string;
  createProjectError: string;
  createProjectCreated: string;
  notFoundTitle: string;
  notFoundDescription: string;
  notFoundHome: string;
  notFoundExplore: string;
};

const es: Dict = {
  navLabel: "Navegación principal",
  menuOpen: "Abrir menú de navegación",
  menuClose: "Cerrar menú de navegación",
  home: "Inicio",
  explore: "Explorar",
  about: "Sobre nosotros",
  cities: "Ciudades",
  categoriesMenu: "Categorías",
  soon: "Próximamente",
  language: "Idioma",
  skip: "Saltar al contenido",
  logoAlt: "Colombia Hunt — logotipo",
  heroTitleA: "Aquí encontrarás los mejores proyectos tecnológicos de",
  heroCityWord: "Colombia",
  heroSub:
    "Software, desarrollo y tecnología hechos en Colombia: descubre proyectos, conoce a sus creadores y encuentra el próximo proyecto tecnológico colombiano.",
  searchLabel: "Buscar proyectos",
  searchPlaceholder: "Buscar proyectos…",
  searchButton: "Buscar",
  categoriesNavLabel: "Categorías populares",
  categoryPrevious: "Ver categorías anteriores",
  categoryNext: "Ver categorías siguientes",
  projectsFor: (q) => `Proyectos "${q}"`,
  aboutTitle: "Sobre nosotros",
  aboutP1:
    "Colombia Hunt es una iniciativa para mostrar nuestro amor por Colombia y por el desarrollo: creemos en el talento que construye software y tecnología en nuestro país y queremos darle el lugar que merece.",
  aboutP2:
    "Nos gusta descubrir proyectos, contar sus historias y crear un espacio donde explorarlos, compartirlos y celebrarlos. Si te mueve lo mismo, este lugar también es tuyo.",
  aboutCta: "Explorar proyectos",
  cityH1: [
    (city) => `Proyectos tecnológicos en ${city}`,
    (city) => `Descubre el software y la tecnología de ${city}`,
    (city) => `Tecnología hecha en ${city}: explora sus proyectos`,
  ],
  cityP: (city) =>
    `Software, desarrollo y tecnología hechos en ${city}: descubre proyectos, conoce a sus creadores y encuentra el próximo proyecto tecnológico de la ciudad.`,
  cityCta: (city) => `Explorar proyectos en ${city}`,
  categoryH1: [
    (category) => `${category} en Colombia: proyectos tecnológicos`,
    (category) => `Tecnología colombiana de ${category}: proyectos y herramientas`,
    (category) => `Industria colombiana de ${category}: software y proyectos`,
  ],
  categorySub: (category) =>
    `Explora los mejores proyectos de ${category} hechos en Colombia. Software, herramientas y aplicaciones creadas por talento colombiano en la industria de ${category}.`,
  categoryHeading: (category) => `${category} en Colombia`,
  categoryIntro: (category) =>
    `Descubre proyectos de ${category} creados por la comunidad tecnológica colombiana. Talento y software hecho en Colombia para el mundo.`,
  categoryProjectsHeading: (category) => `Proyectos de ${category} en Colombia`,
  contribute: "Contribuir",
  contributeTitle: "Contribuir",
  contributeP1:
    "Colombia Hunt es un proyecto de código abierto: creemos que la tecnología se construye en comunidad y que el código abierto nos hace mejores.",
  contributeP2:
    "Nuestra finalidad es dar visibilidad a los proyectos hechos en Colombia: descubre, comparte y suma el tuyo. Para publicar necesitas una cuenta.",
  contributeCta: "Crear un proyecto",
  loginTitle: "Iniciar sesión",
  emailLabel: "Correo electrónico",
  passwordLabel: "Contraseña",
  nameLabel: "Nombre",
  loginButton: "Iniciar sesión",
  noAccount: "¿No tienes cuenta?",
  registerLink: "Regístrate",
  registerTitle: "Crear cuenta",
  registerButton: "Crear cuenta",
  hasAccount: "¿Ya tienes cuenta?",
  loginLink: "Inicia sesión",
  orContinue: "O continúa con",
  socialGithub: "Continuar con GitHub",
  socialGoogle: "Continuar con Google",
  authError: "Revisa tus datos e inténtalo de nuevo.",
  profile: "Perfil",
  projectsHeading: "Proyectos de la comunidad",
  projectsInCity: (city) => `Proyectos de ${city}`,
  projectsEmpty: "Aún no hay proyectos publicados aquí. Puedes ser la primera persona en compartir uno.",
  projectsEmptyCta: "Crear un proyecto",
  projectImageUnavailable: "Imagen no disponible",
  projectOpen: "Ver proyecto",
  projectShareLabel: "Compartir",
  projectShareAriaLabel: (title) => `Compartir proyecto: ${title}`,
  projectShareCopied: "Enlace del proyecto copiado.",
  projectShareDone: "Proyecto compartido.",
  projectShareError: "No se pudo compartir ni copiar el enlace.",
  projectLike: "Me gusta",
  projectUnlike: "Quitar me gusta",
  projectLikeCount: (count) => `${count} me gusta`,
  projectTechnologies: "Tecnologías del proyecto",
  projectDetails: "Detalles del proyecto",
  projectRepository: "Repositorio",
  projectLiveDemo: "Demo en vivo",
  projectAuthor: "Información del perfil",
  profileTitle: "Tu perfil",
  profileDescription: "Actualiza tu nombre y los enlaces que compartes.",
  profilePersonalInfo: "Datos personales",
  profileLinks: "Enlaces del perfil",
  profileName: "Nombre",
  profileGithub: "URL de GitHub",
  profileLinkedin: "URL de LinkedIn",
  profileTwitter: "URL de X o Twitter",
  profileWhatsapp: "WhatsApp",
  profileWhatsappHint: "Incluye el indicativo del país, solo números.",
  profileSave: "Guardar cambios",
  profileSaving: "Guardando…",
  profileSaved: "Perfil actualizado.",
  profileSaveError: "No se pudo guardar el perfil. Inténtalo de nuevo.",
  profileInvalid: "Revisa el nombre, los enlaces y el número de WhatsApp.",
  profileSessionExpired: "Tu sesión expiró. Inicia sesión y vuelve a intentarlo.",
  profileOnboardingTitle: "Sigue construyendo en Colombia",
  profileOnboardingDescription:
    "Mantén tus datos al día, publica un proyecto o descubre lo que ya está creando la comunidad.",
  profileCreateProject: "Crear un proyecto",
  profileExploreProjects: "Ver proyectos",
  createProjectTitle: "Publica tu proyecto",
  createProjectDescription:
    "Comparte qué estás construyendo para que más personas puedan descubrirlo.",
  createProjectName: "Nombre del proyecto",
  createProjectDescriptionLabel: "¿Qué hace tu proyecto?",
  createProjectCity: "Ciudad",
  createProjectChooseCity: "Selecciona una ciudad",
  createProjectCategories: "Categorías",
  createProjectCategoryHint: "Elige al menos una categoría.",
  createProjectImage: "Imagen del proyecto (opcional)",
  createProjectImageHint: "Sube una imagen JPG, PNG, WebP o GIF de hasta 4 MB.",
  createProjectImageUpload: "Seleccionar imagen",
  createProjectImageAllowed: "Una imagen, hasta 4 MB.",
  createProjectImageUploading: "Cargando imagen…",
  createProjectImageError: "No se pudo cargar la imagen. Inténtalo de nuevo.",
  createProjectImagePreview: "Vista previa de la imagen seleccionada",
  createProjectWebsite: "Sitio web o demo",
  createProjectRepository: "Repositorio de código",
  createProjectSubmit: "Publicar proyecto",
  createProjectSubmitting: "Publicando…",
  createProjectEmptyCatalog:
    "Aún no hay ciudades o categorías disponibles para clasificar proyectos. Vuelve a intentarlo más tarde.",
  createProjectInvalid: "Revisa los datos del proyecto e inténtalo de nuevo.",
  createProjectSessionExpired: "Tu sesión expiró. Inicia sesión y vuelve a intentarlo.",
  createProjectError: "No se pudo publicar el proyecto. Inténtalo de nuevo.",
  createProjectCreated: "Tu proyecto ya está publicado en Colombia Hunt.",
  notFoundTitle: "No encontramos esa página.",
  notFoundDescription:
    "El enlace puede estar vencido o la dirección no existe. Puedes volver a explorar los proyectos.",
  notFoundHome: "Ir al inicio",
  notFoundExplore: "Explorar proyectos",
};

const en: Dict = {
  navLabel: "Primary navigation",
  menuOpen: "Open navigation menu",
  menuClose: "Close navigation menu",
  home: "Home",
  explore: "Explore",
  about: "About us",
  cities: "Cities",
  categoriesMenu: "Categories",
  soon: "Coming soon",
  language: "Language",
  skip: "Skip to content",
  logoAlt: "Colombia Hunt — logo",
  heroTitleA: "Here you will find the best tech projects from",
  heroCityWord: "Colombia",
  heroSub:
    "Software, development and technology made in Colombia: discover projects, meet their creators and find the next Colombian tech project.",
  searchLabel: "Search projects",
  searchPlaceholder: "Search projects…",
  searchButton: "Search",
  categoriesNavLabel: "Popular categories",
  categoryPrevious: "View previous categories",
  categoryNext: "View next categories",
  projectsFor: (q) => `"${q}" projects`,
  aboutTitle: "About us",
  aboutP1:
    "Colombia Hunt is an initiative to show our love for Colombia and for development: we believe in the talent building software and technology in our country and we want to give it the place it deserves.",
  aboutP2:
    "We love discovering projects, telling their stories and creating a space to explore, share and celebrate them. If that moves you too, this place is yours as well.",
  aboutCta: "Explore projects",
  cityH1: [
    (city) => `Tech projects in ${city}`,
    (city) => `Discover the software and technology of ${city}`,
    (city) => `Technology made in ${city}: explore its projects`,
  ],
  cityP: (city) =>
    `Software, development and technology made in ${city}: discover projects, meet their creators and find the city's next tech project.`,
  cityCta: (city) => `Explore projects in ${city}`,
  categoryH1: [
    (category) => `${category} in Colombia: tech projects`,
    (category) => `Colombian ${category} technology: projects and tools`,
    (category) => `Colombian ${category} industry: software and projects`,
  ],
  categorySub: (category) =>
    `Explore the best ${category} projects made in Colombia. Software, tools and applications created by Colombian talent in the ${category} industry.`,
  categoryHeading: (category) => `${category} in Colombia`,
  categoryIntro: (category) =>
    `Discover ${category} projects created by the Colombian tech community. Talent and software made in Colombia for the world.`,
  categoryProjectsHeading: (category) => `${category} projects in Colombia`,
  contribute: "Contribute",
  contributeTitle: "Contribute",
  contributeP1:
    "Colombia Hunt is an open source project: we believe technology is built in community and open source makes us better.",
  contributeP2:
    "Our goal is to give visibility to projects made in Colombia: discover, share and add yours. You need an account to publish.",
  contributeCta: "Create a project",
  loginTitle: "Sign in",
  emailLabel: "Email",
  passwordLabel: "Password",
  nameLabel: "Name",
  loginButton: "Sign in",
  noAccount: "Don't have an account?",
  registerLink: "Sign up",
  registerTitle: "Create account",
  registerButton: "Create account",
  hasAccount: "Already have an account?",
  loginLink: "Sign in",
  orContinue: "Or continue with",
  socialGithub: "Continue with GitHub",
  socialGoogle: "Continue with Google",
  authError: "Check your details and try again.",
  profile: "Profile",
  projectsHeading: "Community projects",
  projectsInCity: (city) => `Projects in ${city}`,
  projectsEmpty: "There are no published projects here yet. You can be the first to share one.",
  projectsEmptyCta: "Create a project",
  projectImageUnavailable: "Image unavailable",
  projectOpen: "View project",
  projectShareLabel: "Share",
  projectShareAriaLabel: (title) => `Share project: ${title}`,
  projectShareCopied: "Project link copied.",
  projectShareDone: "Project shared.",
  projectShareError: "Could not share or copy the link.",
  projectLike: "Like",
  projectUnlike: "Unlike",
  projectLikeCount: (count) => `${count} likes`,
  projectTechnologies: "Project technologies",
  projectDetails: "Project details",
  projectRepository: "Repository",
  projectLiveDemo: "Live demo",
  projectAuthor: "Profile information",
  profileTitle: "Your profile",
  profileDescription: "Update your name and the links you share.",
  profilePersonalInfo: "Personal details",
  profileLinks: "Profile links",
  profileName: "Name",
  profileGithub: "GitHub URL",
  profileLinkedin: "LinkedIn URL",
  profileTwitter: "X or Twitter URL",
  profileWhatsapp: "WhatsApp",
  profileWhatsappHint: "Include the country code, numbers only.",
  profileSave: "Save changes",
  profileSaving: "Saving…",
  profileSaved: "Profile updated.",
  profileSaveError: "Could not save your profile. Try again.",
  profileInvalid: "Check the name, links, and WhatsApp number.",
  profileSessionExpired: "Your session expired. Sign in and try again.",
  profileOnboardingTitle: "Keep building in Colombia",
  profileOnboardingDescription:
    "Keep your details current, publish a project, or discover what the community is building.",
  profileCreateProject: "Create a project",
  profileExploreProjects: "View projects",
  createProjectTitle: "Publish your project",
  createProjectDescription:
    "Share what you're building so more people can discover it.",
  createProjectName: "Project name",
  createProjectDescriptionLabel: "What does your project do?",
  createProjectCity: "City",
  createProjectChooseCity: "Select a city",
  createProjectCategories: "Categories",
  createProjectCategoryHint: "Choose at least one category.",
  createProjectImage: "Project image (optional)",
  createProjectImageHint: "Upload a JPG, PNG, WebP, or GIF image up to 4 MB.",
  createProjectImageUpload: "Select image",
  createProjectImageAllowed: "One image, up to 4 MB.",
  createProjectImageUploading: "Uploading image…",
  createProjectImageError: "The image could not be uploaded. Please try again.",
  createProjectImagePreview: "Preview of the selected image",
  createProjectWebsite: "Website or demo",
  createProjectRepository: "Code repository",
  createProjectSubmit: "Publish project",
  createProjectSubmitting: "Publishing…",
  createProjectEmptyCatalog:
    "There are no cities or categories available to classify projects yet. Please try again later.",
  createProjectInvalid: "Check the project details and try again.",
  createProjectSessionExpired: "Your session expired. Sign in and try again.",
  createProjectError: "Could not publish the project. Please try again.",
  createProjectCreated: "Your project is now published on Colombia Hunt.",
  notFoundTitle: "We couldn't find that page.",
  notFoundDescription:
    "The link may be outdated or the address may not exist. You can go back and explore projects.",
  notFoundHome: "Go to home",
  notFoundExplore: "Explore projects",
};

const dictionaries: Record<Lang, Dict> = { es, en };

export function getDict(lang: Lang): Dict {
  return dictionaries[lang];
}
