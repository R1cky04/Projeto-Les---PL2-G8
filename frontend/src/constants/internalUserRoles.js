// Shared role catalog. `value` must stay aligned with the backend enum.
export const ROLE_OPTIONS = [
  {
    value: 'STAFF',
    label: 'Staff',
    activationLabel: 'Ativacao pendente de validacao do IT',
    description: 'Perfil operacional base para consultas e acompanhamento do dia a dia.',
  },
  {
    value: 'FLEET',
    label: 'Frota',
    activationLabel: 'Ativacao pendente de validacao do IT',
    description: 'Perfil especializado para gerir viaturas, manutencoes, transferencias e incidentes.',
  },
  {
    value: 'ADMIN',
    label: 'Admin',
    activationLabel: 'Conta ativa de imediato',
    description: 'Perfil com permissoes alargadas para administracao interna e gestao de utilizadores.',
  },
];
