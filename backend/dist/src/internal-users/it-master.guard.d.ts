import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class ItMasterGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean;
}
