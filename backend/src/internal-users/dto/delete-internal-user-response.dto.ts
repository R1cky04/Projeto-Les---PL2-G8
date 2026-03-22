// Response contract for internal-user deletion and retention outcomes.
export type InternalUserDeletionMode = 'DELETED' | 'DEACTIVATED';

export interface DeleteInternalUserResponseDto {
  message: string;
  mode: InternalUserDeletionMode;
  userId: string;
}
