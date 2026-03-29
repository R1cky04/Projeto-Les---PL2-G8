import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class ImproGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean;
}
