export const es = {
  // Navegación y menú
  nav: {
    home: 'Inicio',
    users: 'Usuarios',
    family: 'Mi Familia',
    members: 'Asistentes',
  },

  // Común
  common: {
    save: 'Guardar',
    cancel: 'Cancelar',
    edit: 'Editar',
    delete: 'Eliminar',
    close: 'Cerrar',
    search: 'Buscar',
    add: 'Agregar',
    create: 'Crear',
    loading: 'Cargando...',
    noData: 'No hay datos',
    confirm: 'Confirmar',
    yes: 'Sí',
    no: 'No',
    accept: 'Aceptar',
    user: 'Usuario',
    noEmail: 'Sin email',
    editProfile: 'Editar mi perfil',
    support: 'Soporte',
    profileUpdated: 'Perfil actualizado correctamente',
    errorUpdatingProfile: 'No se pudo actualizar el perfil',
    unexpectedErrorProfile: 'Ocurrió un error al actualizar el perfil',
    emailSent: 'Email enviado',
    emailSentMessage: 'Se ha enviado un email de restablecimiento a {email}',
    errorSendingEmail: 'No se pudo enviar el email',
    unexpectedEmailError: 'Ocurrió un error al enviar el email de restablecimiento',
    viewDetails: 'Ver detalles',
    editUser: 'Editar usuario',
    deleteUser: 'Eliminar usuario',
  },

  // Formularios
  form: {
    name: 'Nombre',
    email: 'Correo electrónico',
    phone: 'Teléfono',
    birthdate: 'Fecha de nacimiento',
    gender: 'Género',
    nationality: 'Nacionalidad',
    password: 'Contraseña',
    confirmPassword: 'Confirmar contraseña',
    role: 'Rol',
    relation: 'Relación',
    isMember: '¿Es miembro?',
    hasWebAccess: 'Acceso web',    avatar: 'Avatar',
    actions: 'Acciones',
    noName: 'Sin nombre',
    birth: 'Nacimiento',  },

  // Géneros
  gender: {
    male: 'Masculino',
    female: 'Femenino',
    other: 'Otro',
  },

  // Roles
  role: {
    admin: 'Administrador',
    user: 'Usuario',
    adminBadge: 'ADMIN',
    userBadge: 'USUARIO',
  },

  // Páginas
  pages: {
    home: {
      title: 'Inicio',
      welcome: 'Bienvenido',
      welcomeUser: '¡Bienvenido, {name}!',
      completeProfile: 'Completa tu perfil para acceder a todas las funciones',
      completeProfileTitle: 'Completar mi perfil',
      completeProfileMessage: 'Para comenzar a usar la plataforma, necesitamos que completes tu información personal:',
      completeProfileItems: {
        birthdate: 'Fecha de nacimiento',
        nationality: 'Nacionalidad',
        photo: 'Foto de perfil',
      },
      profileCompleted: '¡Perfil completado!',
      profileCompletedMessage: 'Tu perfil ha sido actualizado correctamente. Ahora puedes acceder a todas las funciones de la plataforma.',
      savingProfile: 'Guardando perfil...',
      pleaseWait: 'Por favor espera un momento',
      errorSaving: 'Error al guardar',
      errorSavingMessage: 'No se pudo actualizar tu perfil. Por favor intenta de nuevo.',
      unexpectedError: 'Error inesperado',
      unexpectedErrorMessage: 'Ocurrió un error al guardar tu perfil. Por favor intenta de nuevo.',
    },
    users: {
      title: 'Gestión de usuarios',
      description: 'Usuarios registrados en la aplicación',
      addUser: 'Agregar usuario',
      editUser: 'Editar usuario',
      deleteUser: '¿Eliminar usuario?',
      noUsers: 'No hay usuarios registrados',
    },
    family: {
      title: 'Mi Familia',
      addMember: 'Agregar miembro de la familia',
      addFamiliar: 'Agregar familiar',
      editMember: 'Editar familiar',
      deleteMember: 'Eliminar de mi familia',
      noMembers: 'No hay miembros en tu familia',
      searchPlaceholder: 'Buscar miembro, relación...',
    },
    members: {
      title: 'Asistentes',
      searchPlaceholder: 'Buscar asistentes...',
    },
  },

  // Autenticación
  auth: {
    login: 'Iniciar sesión',
    logout: 'Cerrar sesión',
    register: 'Registrarse',
    signIn: 'Ingresar',
    signUp: 'Crear cuenta',
    forgotPassword: '¿Olvidaste tu contraseña?',
    rememberMe: 'Recordarme',
    loginWithGoogle: 'Continuar con Google',
    alreadyHaveAccount: '¿Ya tienes cuenta?',
    dontHaveAccount: '¿No tienes cuenta?',
    createNewAccount: 'Crear nueva cuenta',
    signInHere: 'Inicia sesión aquí',
    enterCredentials: 'Ingresa con tus credenciales!',
    registerWithData: 'Regístrate con tus datos',
    google: 'Google',
    fullName: 'Nombre completo',
    emailPlaceholder: 'Correo electrónico',
    passwordPlaceholder: 'Contraseña',
    fullNamePlaceholder: 'Nombre completo',
  },

  // Mensajes
  messages: {
    success: {
      saved: 'Guardado correctamente',
      deleted: 'Eliminado correctamente',
      updated: 'Actualizado correctamente',
      created: 'Creado correctamente',
    },
    error: {
      generic: 'Ocurrió un error',
      notFound: 'No encontrado',
      unauthorized: 'No autorizado',
      required: 'Este campo es requerido',
    },
    validation: {
      emailInvalid: 'El correo debe tener una @',
      passwordLength: 'La contraseña debe tener al menos 6 caracteres',
      nameRequired: 'El nombre es obligatorio',
      passwordsMustMatch: 'Las contraseñas deben coincidir',
    },
  },

  // UserCard
  userCard: {
    webAccess: 'Acceso web',
    member: 'Miembro',
    age: 'años',
  },

  // Relaciones familiares
  relations: {
    titular: 'Titular',
    spouse: 'Esposa',
    son: 'Hijo',
    daughter: 'Hija',
    father: 'Padre',
    mother: 'Madre',
    brother: 'Hermano',
    sister: 'Hermana',
    grandfather: 'Abuelo',
    grandmother: 'Abuela',
    grandson: 'Nieto',
    granddaughter: 'Nieta',
  },
};

export type TranslationKeys = typeof es;
