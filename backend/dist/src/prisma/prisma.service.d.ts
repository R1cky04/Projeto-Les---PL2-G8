export interface StationRecord {
    id: number;
    name: string;
    location: string;
    capacity: number;
    createdAt: Date;
    updatedAt: Date;
    createdBy?: string;
}
export declare class PrismaService {
    private stations;
    private nextId;
    station: {
        findUnique: ({ where }: {
            where: {
                name?: string;
                id?: number;
            };
        }) => Promise<StationRecord | null>;
        findMany: () => Promise<StationRecord[]>;
        create: ({ data }: {
            data: Omit<StationRecord, "id" | "createdAt" | "updatedAt">;
        }) => Promise<StationRecord>;
    };
}
