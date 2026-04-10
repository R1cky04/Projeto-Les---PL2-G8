import 'dotenv/config';
import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
declare const PrismaClient: new (...args: any[]) => any;
export declare class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    [key: string]: any;
    constructor();
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
}
export {};
