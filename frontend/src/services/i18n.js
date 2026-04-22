import { reactive } from 'vue'

const LOCALE_STORAGE_KEY = 'app.locale'
const FALLBACK_LOCALE = 'pt'
const SUPPORTED_LOCALES = ['pt', 'en', 'es']

const DATE_LOCALES = {
  pt: 'pt-PT',
  en: 'en-GB',
  es: 'es-ES',
}

const messages = {
  pt: {
    language: {
      label: 'Idioma',
      portuguese: 'Portuguese',
      english: 'English',
      spanish: 'Spanish',
    },
    login: {
      title: 'Entrar no portal interno',
      description: 'Autenticacao por ID de utilizador e palavra-passe com validacao no backend, estado de conta e carregamento de funcionalidades por perfil.',
      userIdLabel: 'ID de utilizador',
      passwordLabel: 'Palavra-passe',
      userIdPlaceholder: 'ex: it.master',
      passwordPlaceholder: 'Palavra-passe',
      authenticating: 'A autenticar...',
      signIn: 'Entrar',
    },
    portal: {
      loadingEyebrow: 'Portal interno',
      loadingTitle: 'A restaurar sessao',
      loadingDescription: 'Validacao em curso das credenciais atuais e das funcionalidades disponiveis.',
      appTitle: 'Gestao Rent-a-Car',
      backToPanel: 'Voltar ao painel',
      logout: 'Terminar sessao',
      stationsTitle: 'Estacoes',
      stationsManageDescription: 'Consulte e atualize estacoes existentes. Use o atalho de criacao quando precisar de registar uma nova estacao.',
      stationsCreateDescription: 'Preencha os dados obrigatorios e submeta para registar uma nova estacao na rede.',
      createStation: 'Criar estacao',
      backToManageStations: 'Voltar a gerir estacoes',
      vehiclesTitle: 'Veiculos',
      vehiclesManageDescription: 'Consulte e edite veiculos existentes, incluindo estado, quilometragem e preco diario.',
      vehiclesCreateDescription: 'Preencha os dados obrigatorios para criar um novo veiculo no sistema.',
      createVehicle: 'Criar veiculo',
      backToManageVehicles: 'Voltar a gerir veiculos',
      rentalsTitle: 'Contratos',
      rentalsDescription: 'Crie contratos diretos de aluguer, associe cliente e viatura disponivel, e deixe o valor estimado ser calculado automaticamente com base no periodo escolhido.',
      improsTitle: 'Impros',
      improsDescription: 'Crie transferencias entre estacoes e atualize dados operacionais com historico auditavel.',
      stationOnlyIt: 'A funcionalidade de estacoes esta disponivel apenas para o perfil IT autenticado.',
      improOnlyRoles: 'A funcionalidade de impros esta disponivel apenas para os perfis Frota, Admin ou IT autenticados.',
      vehicleOnlyRoles: 'A funcionalidade de veiculos exige perfil IT, ADMIN, STAFF ou FLEET.',
      rentalsOnlyRoles: 'A funcionalidade de contratos exige perfil IT, ADMIN, STAFF ou FLEET.',
      futureSprint: 'A autenticacao e as permissoes deste modulo ja estao resolvidas, mas a interface funcional ainda nao faz parte desta sprint.',
      genericLoginError: 'Nao foi possivel efetuar login.',
      usersLoadError: 'Nao foi possivel carregar a lista de utilizadores.',
      usersCreateError: 'Nao foi possivel criar o utilizador.',
    },
    workspace: {
      sessionInternal: 'Sessao interna',
      userId: 'ID de utilizador',
      status: 'Estado',
      expiresAt: 'Expira em',
      parallelSessions: 'Sessoes paralelas',
      sessionWarnings: 'Avisos da sessao',
      openModule: 'Abrir modulo',
      unavailable: 'Nao disponivel',
      notAuthorized: 'Nao autorizado',
      noProfile: 'Sem perfil',
      accessIt: 'Acesso IT',
      accessFleetAdmin: 'Acesso Frota/Admin',
      manageStations: 'Gerir Estacoes',
      manageStationsDesc: 'Aceda a um unico modulo para consultar, editar e, se necessario, criar novas estacoes.',
      manageStationsReason: 'Apenas o perfil IT autenticado com permissao de gestao de estacoes pode aceder a este modulo.',
      manageImpros: 'Gerir Impros',
      manageImprosDesc: 'Crie e acompanhe transferencias de veiculos entre estacoes com historico.',
      manageImprosReason: 'Apenas os perfis Frota, Admin ou IT com permissao de transferencia podem aceder ao modulo de impros.',
      manageVehicles: 'Gerir Veiculos',
      manageVehiclesDesc: 'Gestao da frota com edicao para IT, ADMIN, STAFF e FLEET; criacao e eliminacao apenas para IT.',
      manageVehiclesReason: 'O modulo de veiculos esta disponivel para IT, ADMIN, STAFF e FLEET.',
      feature: {
        INTERNAL_USERS: {
          title: 'Gerir Utilizadores Internos',
          description: 'Consulte e administre contas internas, permissoes e estado de acesso.',
        },
        CUSTOMERS: {
          title: 'Clientes',
          description: 'Consulta e apoio operacional a perfis de cliente.',
        },
        RESERVATIONS: {
          title: 'Reservas',
          description: 'Reserva, consulta e acompanhamento do ciclo de reservas.',
        },
        STATION_MANAGEMENT: {
          title: 'Gerir Estacoes',
          description: 'Consulte, atualize e crie estacoes da rede operacional.',
        },
        VEHICLES: {
          title: 'Veiculos',
          description: 'Consulta do parque automovel e disponibilidade das viaturas.',
        },
        VEHICLE_MANAGEMENT: {
          title: 'Gerir Veiculos',
          description: 'Consulte e atualize dados da frota e estado operacional.',
        },
        RENTALS: {
          title: 'Gerir Contratos',
          description: 'Crie e acompanhe contratos de aluguer.',
        },
        FLEET_OPERATIONS: {
          title: 'Operacoes de Frota',
          description: 'Operacoes de frota, manutencao, transferencias e gestao de incidentes.',
        },
        IMPRO_MANAGEMENT: {
          title: 'Gerir Impros',
          description: 'Crie e acompanhe transferencias entre estacoes.',
        },
      },
    },
    internalUsers: {
      resultLabel: 'Resultado',
      accountCreated: 'Conta criada',
      profile: 'Perfil',
      status: 'Estado',
      active: 'Ativa',
      yes: 'Sim',
      no: 'Nao',
      permissionsAssigned: 'Permissoes associadas',
      newUser: 'Novo Utilizador',
      newUserIntro: 'Expanda a equipa do Rent-a-Car.',
      clear: 'Limpar',
      userIdPlaceholder: 'ex: staff.lisboa',
      userIdLabel: 'User ID',
      password: 'Password',
      passwordPlaceholder: 'Minimo 8 caracteres com complexidade',
      userType: 'Tipo de utilizador',
      itReservedRole: 'IT (reservado)',
      registering: 'A registar...',
      registerUser: 'Registar utilizador',
      hierarchy: 'Hierarquia',
      rolesAndInheritedPermissions: 'Perfis e permissoes herdadas',
      internalUsersCount: 'Utilizadores internos ({count})',
      teamManagement: 'Gestao de equipa',
      searchByUserId: 'Pesquisar por User ID',
      search: 'Pesquisar',
      activeFilter: 'Filtro ativo: "{term}"',
      loadingUsers: 'A carregar utilizadores...',
      noUsersForSearch: 'Nenhum utilizador encontrado para a pesquisa atual.',
      noInternalUsers: 'Nenhum utilizador interno encontrado.',
      createdAt: 'Criado em',
      editing: 'A editar',
      manage: 'Gerir',
      removing: 'A remover...',
      remove: 'Remover',
      removed: 'Removido',
      pageOf: 'Pagina {page} de {totalPages}',
      previous: 'Anterior',
      next: 'Seguinte',
      notAvailable: 'N/A',
      manageUser: 'Gerir Utilizador',
      manageIntro: 'Visualize os dados atuais e ajuste o acesso do utilizador selecionado.',
      selectUserToEdit: 'Selecione um utilizador da lista para editar o User ID, a password, o tipo e o estado da conta.',
      selectedAccount: 'Conta selecionada',
      currentProfile: 'Perfil atual',
      currentStatus: 'Estado atual',
      newPassword: 'Nova password',
      keepPasswordHint: 'Deixe em branco para manter a password atual.',
      accountStatus: 'Estado da conta',
      accountAvailability: 'Disponibilidade da conta',
      accountActive: 'Conta ativa',
      accountDeactivated: 'Conta desativada',
      currentPermissions: 'Permissoes atuais',
      inheritedPermissionsForRole: 'Permissoes herdadas pelo tipo selecionado',
      inheritedPermissionsHint: 'Estas permissoes sao aplicadas automaticamente com base no tipo escolhido.',
      protectedItInfo: 'A conta selecionada pertence ao perfil IT reservado. O User ID e a password podem ser atualizados, mas o tipo, o estado e a ativacao ficam protegidos, e as permissoes continuam herdadas automaticamente do perfil IT.',
      viewPermissionsByRole: 'Ver permissoes disponiveis por perfil',
      resetData: 'Repor dados',
      saving: 'A guardar...',
      saveChanges: 'Guardar alteracoes',
      errors: {
        loadUsers: 'Nao foi possivel carregar a lista de utilizadores.',
        createUser: 'Nao foi possivel criar o utilizador.',
        updateUser: 'Nao foi possivel atualizar o utilizador.',
        deleteUser: 'Erro ao eliminar utilizador.',
      },
    },
    authPresentation: {
      roleFleet: 'Frota',
      accessFull: 'Acesso completo',
      accessLimited: 'Acesso limitado',
      featureAvailable: 'Disponivel',
      featureLimited: 'Limitado',
      featureMaintenance: 'Manutencao',
      noProfile: 'Sem perfil',
      noAccess: 'Sem acesso',
      undefined: 'Indefinido',
      noExpiry: 'Sem expiracao',
    },
  },
  en: {
    language: {
      label: 'Language',
      portuguese: 'Portuguese',
      english: 'English',
      spanish: 'Spanish',
    },
    login: {
      title: 'Sign in to internal portal',
      description: 'Authentication by User ID and password with backend validation, account status check and role-based feature loading.',
      userIdLabel: 'User ID',
      passwordLabel: 'Password',
      userIdPlaceholder: 'e.g. it.master',
      passwordPlaceholder: 'Password',
      authenticating: 'Authenticating...',
      signIn: 'Sign in',
    },
    portal: {
      loadingEyebrow: 'Internal portal',
      loadingTitle: 'Restoring session',
      loadingDescription: 'Current credentials and available features are being validated.',
      appTitle: 'Rent-a-Car Management',
      backToPanel: 'Back to dashboard',
      logout: 'Sign out',
      stationsTitle: 'Stations',
      stationsManageDescription: 'Review and update existing stations. Use the create shortcut to register a new station.',
      stationsCreateDescription: 'Fill in required data and submit to register a new station in the network.',
      createStation: 'Create station',
      backToManageStations: 'Back to station management',
      vehiclesTitle: 'Vehicles',
      vehiclesManageDescription: 'Review and edit existing vehicles, including status, mileage and daily rate.',
      vehiclesCreateDescription: 'Fill in required data to create a new vehicle in the system.',
      createVehicle: 'Create vehicle',
      backToManageVehicles: 'Back to vehicle management',
      rentalsTitle: 'Contracts',
      rentalsDescription: 'Create direct rental contracts, link customer and available vehicle, and let estimated value be calculated automatically based on selected period.',
      improsTitle: 'Impros',
      improsDescription: 'Create transfers between stations and update operational data with auditable history.',
      stationOnlyIt: 'Station management is available only for authenticated IT profile.',
      improOnlyRoles: 'Impro management is available only for authenticated Fleet, Admin or IT profiles.',
      vehicleOnlyRoles: 'Vehicle management requires IT, ADMIN, STAFF or FLEET profile.',
      rentalsOnlyRoles: 'Contracts module requires IT, ADMIN, STAFF or FLEET profile.',
      futureSprint: 'Authentication and permissions for this module are ready, but the functional UI is not part of this sprint yet.',
      genericLoginError: 'Unable to sign in.',
      usersLoadError: 'Unable to load users list.',
      usersCreateError: 'Unable to create user.',
    },
    workspace: {
      sessionInternal: 'Internal session',
      userId: 'User ID',
      status: 'Status',
      expiresAt: 'Expires at',
      parallelSessions: 'Parallel sessions',
      sessionWarnings: 'Session warnings',
      openModule: 'Open module',
      unavailable: 'Unavailable',
      notAuthorized: 'Not authorized',
      noProfile: 'No profile',
      accessIt: 'IT access',
      accessFleetAdmin: 'Fleet/Admin access',
      manageStations: 'Manage Stations',
      manageStationsDesc: 'Access a single module to review, edit and, if needed, create new stations.',
      manageStationsReason: 'Only authenticated IT profile with station management permission can access this module.',
      manageImpros: 'Manage Impros',
      manageImprosDesc: 'Create and track vehicle transfers between stations with history.',
      manageImprosReason: 'Only Fleet, Admin or IT profiles with transfer permission can access impro module.',
      manageVehicles: 'Manage Vehicles',
      manageVehiclesDesc: 'Fleet management with editing for IT, ADMIN, STAFF and FLEET; creation and deletion only for IT.',
      manageVehiclesReason: 'Vehicle module is available for IT, ADMIN, STAFF and FLEET.',
      feature: {
        INTERNAL_USERS: {
          title: 'Manage Internal Users',
          description: 'Review and administer internal accounts, permissions and access state.',
        },
        CUSTOMERS: {
          title: 'Customers',
          description: 'Customer consultation and operational support.',
        },
        RESERVATIONS: {
          title: 'Reservations',
          description: 'Reservation booking, review and lifecycle tracking.',
        },
        STATION_MANAGEMENT: {
          title: 'Manage Stations',
          description: 'Review, update and create stations in the operational network.',
        },
        VEHICLES: {
          title: 'Vehicles',
          description: 'Review the vehicle fleet and availability.',
        },
        VEHICLE_MANAGEMENT: {
          title: 'Manage Vehicles',
          description: 'Review and update fleet data and operational status.',
        },
        RENTALS: {
          title: 'Manage Contracts',
          description: 'Create and track rental contracts.',
        },
        FLEET_OPERATIONS: {
          title: 'Fleet Operations',
          description: 'Fleet operations, maintenance, transfers and incident handling.',
        },
        IMPRO_MANAGEMENT: {
          title: 'Manage Impros',
          description: 'Create and track transfers between stations.',
        },
      },
    },
    internalUsers: {
      resultLabel: 'Result',
      accountCreated: 'Account created',
      profile: 'Profile',
      status: 'Status',
      active: 'Active',
      yes: 'Yes',
      no: 'No',
      permissionsAssigned: 'Assigned permissions',
      newUser: 'New User',
      newUserIntro: 'Grow the Rent-a-Car team.',
      clear: 'Clear',
      userIdPlaceholder: 'e.g. staff.lisboa',
      userIdLabel: 'User ID',
      password: 'Password',
      passwordPlaceholder: 'Minimum 8 characters with complexity',
      userType: 'User type',
      itReservedRole: 'IT (reserved)',
      registering: 'Registering...',
      registerUser: 'Register user',
      hierarchy: 'Hierarchy',
      rolesAndInheritedPermissions: 'Roles and inherited permissions',
      internalUsersCount: 'Internal users ({count})',
      teamManagement: 'Team management',
      searchByUserId: 'Search by User ID',
      search: 'Search',
      activeFilter: 'Active filter: "{term}"',
      loadingUsers: 'Loading users...',
      noUsersForSearch: 'No users found for the current search.',
      noInternalUsers: 'No internal users found.',
      createdAt: 'Created on',
      editing: 'Editing',
      manage: 'Manage',
      removing: 'Removing...',
      remove: 'Remove',
      removed: 'Removed',
      pageOf: 'Page {page} of {totalPages}',
      previous: 'Previous',
      next: 'Next',
      notAvailable: 'N/A',
      manageUser: 'Manage User',
      manageIntro: 'Review current data and adjust access for the selected user.',
      selectUserToEdit: 'Select a user from the list to edit User ID, password, role and account status.',
      selectedAccount: 'Selected account',
      currentProfile: 'Current profile',
      currentStatus: 'Current status',
      newPassword: 'New password',
      keepPasswordHint: 'Leave blank to keep the current password.',
      accountStatus: 'Account status',
      accountAvailability: 'Account availability',
      accountActive: 'Active account',
      accountDeactivated: 'Deactivated account',
      currentPermissions: 'Current permissions',
      inheritedPermissionsForRole: 'Permissions inherited from selected role',
      inheritedPermissionsHint: 'These permissions are applied automatically based on selected role.',
      protectedItInfo: 'The selected account belongs to the reserved IT role. User ID and password can be updated, but role, status and activation are protected, and permissions remain inherited automatically from IT role.',
      viewPermissionsByRole: 'View available permissions by role',
      resetData: 'Reset data',
      saving: 'Saving...',
      saveChanges: 'Save changes',
      errors: {
        loadUsers: 'Unable to load users list.',
        createUser: 'Unable to create user.',
        updateUser: 'Unable to update user.',
        deleteUser: 'Error while deleting user.',
      },
    },
    authPresentation: {
      roleFleet: 'Fleet',
      accessFull: 'Full access',
      accessLimited: 'Limited access',
      featureAvailable: 'Available',
      featureLimited: 'Limited',
      featureMaintenance: 'Maintenance',
      noProfile: 'No profile',
      noAccess: 'No access',
      undefined: 'Undefined',
      noExpiry: 'No expiry',
    },
  },
  es: {
    language: {
      label: 'Idioma',
      portuguese: 'Portuguese',
      english: 'English',
      spanish: 'Spanish',
    },
    login: {
      title: 'Entrar en el portal interno',
      description: 'Autenticacion por ID de usuario y contrasena con validacion en backend, estado de cuenta y carga de funcionalidades por perfil.',
      userIdLabel: 'ID de usuario',
      passwordLabel: 'Contrasena',
      userIdPlaceholder: 'ej: it.master',
      passwordPlaceholder: 'Password',
      authenticating: 'Autenticando...',
      signIn: 'Entrar',
    },
    portal: {
      loadingEyebrow: 'Portal interno',
      loadingTitle: 'Restaurando sesion',
      loadingDescription: 'Validando credenciales actuales y funcionalidades disponibles.',
      appTitle: 'Gestion Rent-a-Car',
      backToPanel: 'Volver al panel',
      logout: 'Cerrar sesion',
      stationsTitle: 'Estaciones',
      stationsManageDescription: 'Consulte y actualice estaciones existentes. Use el acceso de creacion para registrar una nueva estacion.',
      stationsCreateDescription: 'Rellene los datos obligatorios y envie para registrar una nueva estacion en la red.',
      createStation: 'Crear estacion',
      backToManageStations: 'Volver a gestionar estaciones',
      vehiclesTitle: 'Vehiculos',
      vehiclesManageDescription: 'Consulte y edite vehiculos existentes, incluyendo estado, kilometraje y precio diario.',
      vehiclesCreateDescription: 'Rellene los datos obligatorios para crear un nuevo vehiculo en el sistema.',
      createVehicle: 'Crear vehiculo',
      backToManageVehicles: 'Volver a gestionar vehiculos',
      rentalsTitle: 'Contratos',
      rentalsDescription: 'Cree contratos directos de alquiler, asocie cliente y vehiculo disponible, y deje que el valor estimado se calcule automaticamente segun el periodo seleccionado.',
      improsTitle: 'Impros',
      improsDescription: 'Cree transferencias entre estaciones y actualice datos operativos con historial auditable.',
      stationOnlyIt: 'La funcionalidad de estaciones esta disponible solo para el perfil IT autenticado.',
      improOnlyRoles: 'La funcionalidad de impros esta disponible solo para perfiles Flota, Admin o IT autenticados.',
      vehicleOnlyRoles: 'La funcionalidad de vehiculos requiere perfil IT, ADMIN, STAFF o FLEET.',
      rentalsOnlyRoles: 'La funcionalidad de contratos requiere perfil IT, ADMIN, STAFF o FLEET.',
      futureSprint: 'La autenticacion y permisos de este modulo ya estan resueltos, pero la interfaz funcional no forma parte de este sprint.',
      genericLoginError: 'No se pudo iniciar sesion.',
      usersLoadError: 'No se pudo cargar la lista de usuarios.',
      usersCreateError: 'No se pudo crear el usuario.',
    },
    workspace: {
      sessionInternal: 'Sesion interna',
      userId: 'ID de usuario',
      status: 'Estado',
      expiresAt: 'Expira en',
      parallelSessions: 'Sesiones paralelas',
      sessionWarnings: 'Avisos de sesion',
      openModule: 'Abrir modulo',
      unavailable: 'No disponible',
      notAuthorized: 'No autorizado',
      noProfile: 'Sin perfil',
      accessIt: 'Acceso IT',
      accessFleetAdmin: 'Acceso Flota/Admin',
      manageStations: 'Gestionar Estaciones',
      manageStationsDesc: 'Acceda a un unico modulo para consultar, editar y, si es necesario, crear nuevas estaciones.',
      manageStationsReason: 'Solo el perfil IT autenticado con permiso de gestion de estaciones puede acceder a este modulo.',
      manageImpros: 'Gestionar Impros',
      manageImprosDesc: 'Cree y acompanhe transferencias de vehiculos entre estaciones con historial.',
      manageImprosReason: 'Solo perfiles Flota, Admin o IT con permiso de transferencia pueden acceder al modulo de impros.',
      manageVehicles: 'Gestionar Vehiculos',
      manageVehiclesDesc: 'Gestion de flota con edicion para IT, ADMIN, STAFF y FLEET; creacion y eliminacion solo para IT.',
      manageVehiclesReason: 'El modulo de vehiculos esta disponible para IT, ADMIN, STAFF y FLEET.',
      feature: {
        INTERNAL_USERS: {
          title: 'Gestionar Usuarios Internos',
          description: 'Consulte y administre cuentas internas, permisos y estado de acceso.',
        },
        CUSTOMERS: {
          title: 'Clientes',
          description: 'Consulta y apoyo operativo a perfiles de cliente.',
        },
        RESERVATIONS: {
          title: 'Reservas',
          description: 'Reserva, consulta y seguimiento del ciclo de reservas.',
        },
        STATION_MANAGEMENT: {
          title: 'Gestionar Estaciones',
          description: 'Consulte, actualice y cree estaciones de la red operativa.',
        },
        VEHICLES: {
          title: 'Vehiculos',
          description: 'Consulta del parque automovil y disponibilidad de los vehiculos.',
        },
        VEHICLE_MANAGEMENT: {
          title: 'Gestionar Vehiculos',
          description: 'Consulte y actualice datos de flota y estado operativo.',
        },
        RENTALS: {
          title: 'Gestionar Contratos',
          description: 'Cree y acompanhe contratos de alquiler.',
        },
        FLEET_OPERATIONS: {
          title: 'Operaciones de Flota',
          description: 'Operaciones de flota, mantenimiento, transferencias y gestion de incidentes.',
        },
        IMPRO_MANAGEMENT: {
          title: 'Gestionar Impros',
          description: 'Cree y acompanhe transferencias entre estaciones.',
        },
      },
    },
    internalUsers: {
      resultLabel: 'Resultado',
      accountCreated: 'Cuenta creada',
      profile: 'Perfil',
      status: 'Estado',
      active: 'Activa',
      yes: 'Si',
      no: 'No',
      permissionsAssigned: 'Permisos asociados',
      newUser: 'Nuevo Usuario',
      newUserIntro: 'Amplie el equipo de Rent-a-Car.',
      clear: 'Limpiar',
      userIdPlaceholder: 'ej: staff.lisboa',
      userIdLabel: 'User ID',
      password: 'Contrasena',
      passwordPlaceholder: 'Minimo 8 caracteres con complejidad',
      userType: 'Tipo de usuario',
      itReservedRole: 'IT (reservado)',
      registering: 'Registrando...',
      registerUser: 'Registrar usuario',
      hierarchy: 'Jerarquia',
      rolesAndInheritedPermissions: 'Perfiles y permisos heredados',
      internalUsersCount: 'Usuarios internos ({count})',
      teamManagement: 'Gestion de equipo',
      searchByUserId: 'Buscar por User ID',
      search: 'Buscar',
      activeFilter: 'Filtro activo: "{term}"',
      loadingUsers: 'Cargando usuarios...',
      noUsersForSearch: 'No se encontraron usuarios para la busqueda actual.',
      noInternalUsers: 'No se encontraron usuarios internos.',
      createdAt: 'Creado en',
      editing: 'Editando',
      manage: 'Gestionar',
      removing: 'Eliminando...',
      remove: 'Eliminar',
      removed: 'Eliminado',
      pageOf: 'Pagina {page} de {totalPages}',
      previous: 'Anterior',
      next: 'Siguiente',
      notAvailable: 'N/A',
      manageUser: 'Gestionar Usuario',
      manageIntro: 'Visualice los datos actuales y ajuste el acceso del usuario seleccionado.',
      selectUserToEdit: 'Seleccione un usuario de la lista para editar User ID, contrasena, tipo y estado de la cuenta.',
      selectedAccount: 'Cuenta seleccionada',
      currentProfile: 'Perfil actual',
      currentStatus: 'Estado actual',
      newPassword: 'Nueva contrasena',
      keepPasswordHint: 'Deje en blanco para mantener la contrasena actual.',
      accountStatus: 'Estado de la cuenta',
      accountAvailability: 'Disponibilidad de la cuenta',
      accountActive: 'Cuenta activa',
      accountDeactivated: 'Cuenta desactivada',
      currentPermissions: 'Permisos actuales',
      inheritedPermissionsForRole: 'Permisos heredados por el tipo seleccionado',
      inheritedPermissionsHint: 'Estos permisos se aplican automaticamente segun el tipo elegido.',
      protectedItInfo: 'La cuenta seleccionada pertenece al perfil IT reservado. El User ID y la contrasena se pueden actualizar, pero el tipo, estado y activacion quedan protegidos, y los permisos siguen heredados automaticamente del perfil IT.',
      viewPermissionsByRole: 'Ver permisos disponibles por perfil',
      resetData: 'Restablecer datos',
      saving: 'Guardando...',
      saveChanges: 'Guardar cambios',
      errors: {
        loadUsers: 'No se pudo cargar la lista de usuarios.',
        createUser: 'No se pudo crear el usuario.',
        updateUser: 'No se pudo actualizar el usuario.',
        deleteUser: 'Error al eliminar usuario.',
      },
    },
    authPresentation: {
      roleFleet: 'Flota',
      accessFull: 'Acceso completo',
      accessLimited: 'Acceso limitado',
      featureAvailable: 'Disponible',
      featureLimited: 'Limitado',
      featureMaintenance: 'Mantenimiento',
      noProfile: 'Sin perfil',
      noAccess: 'Sin acceso',
      undefined: 'Indefinido',
      noExpiry: 'Sin expiracion',
    },
  },
}

function resolveInitialLocale() {
  const stored =
    typeof window !== 'undefined'
      ? window.localStorage.getItem(LOCALE_STORAGE_KEY)
      : null

  if (stored && SUPPORTED_LOCALES.includes(stored)) {
    return stored
  }

  return FALLBACK_LOCALE
}

function resolveMessage(locale, key) {
  return key.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), messages[locale])
}

function replaceParams(message, params) {
  return Object.entries(params || {}).reduce(
    (result, [paramKey, value]) => result.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(value)),
    message,
  )
}

const state = reactive({
  locale: resolveInitialLocale(),
})

export function setLocale(locale) {
  if (!SUPPORTED_LOCALES.includes(locale)) {
    return
  }

  state.locale = locale
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale)
  }
}

export function t(key, params = {}) {
  const message =
    resolveMessage(state.locale, key) ||
    resolveMessage(FALLBACK_LOCALE, key) ||
    key

  if (typeof message !== 'string') {
    return key
  }

  return replaceParams(message, params)
}

export function getDateLocale() {
  return DATE_LOCALES[state.locale] || DATE_LOCALES[FALLBACK_LOCALE]
}

export function getLocaleState() {
  return state
}

export function createI18nPlugin() {
  return {
    install(app) {
      app.config.globalProperties.$t = t
      app.config.globalProperties.$setLocale = setLocale
      app.config.globalProperties.$getDateLocale = getDateLocale
      app.config.globalProperties.$localeState = state
      app.config.globalProperties.$supportedLocales = SUPPORTED_LOCALES
    },
  }
}
