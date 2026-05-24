// Shared role catalog. `value` must stay aligned with the backend enum.
export const ROLE_OPTIONS = [
  {
    value: 'STAFF',
    label: 'Staff',
    description: 'Perfil operacional base para consultas e acompanhamento do dia a dia.',
  },
  {
    value: 'FLEET',
    label: 'Frota',
    description: 'Perfil especializado para gerir viaturas, manutencoes, transferencias e incidentes.',
  },
  {
    value: 'ADMIN',
    label: 'Admin',
    description: 'Perfil com permissoes alargadas para administracao interna e coordenacao operacional.',
  },
];
