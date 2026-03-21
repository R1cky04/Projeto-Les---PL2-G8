export type InternalUserDeletionMode = 'DELETED' | 'DEACTIVATED';
export interface DeleteInternalUserResponseDto {
    message: string;
    mode: InternalUserDeletionMode;
    userId: string;
}
