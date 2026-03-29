import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type VehicleMaintenanceModel = runtime.Types.Result.DefaultSelection<Prisma.$VehicleMaintenancePayload>;
export type AggregateVehicleMaintenance = {
    _count: VehicleMaintenanceCountAggregateOutputType | null;
    _avg: VehicleMaintenanceAvgAggregateOutputType | null;
    _sum: VehicleMaintenanceSumAggregateOutputType | null;
    _min: VehicleMaintenanceMinAggregateOutputType | null;
    _max: VehicleMaintenanceMaxAggregateOutputType | null;
};
export type VehicleMaintenanceAvgAggregateOutputType = {
    cost: runtime.Decimal | null;
};
export type VehicleMaintenanceSumAggregateOutputType = {
    cost: runtime.Decimal | null;
};
export type VehicleMaintenanceMinAggregateOutputType = {
    id: string | null;
    tenantId: string | null;
    vehicleId: string | null;
    status: $Enums.MaintenanceStatus | null;
    description: string | null;
    startedAt: Date | null;
    finishedAt: Date | null;
    cost: runtime.Decimal | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type VehicleMaintenanceMaxAggregateOutputType = {
    id: string | null;
    tenantId: string | null;
    vehicleId: string | null;
    status: $Enums.MaintenanceStatus | null;
    description: string | null;
    startedAt: Date | null;
    finishedAt: Date | null;
    cost: runtime.Decimal | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type VehicleMaintenanceCountAggregateOutputType = {
    id: number;
    tenantId: number;
    vehicleId: number;
    status: number;
    description: number;
    startedAt: number;
    finishedAt: number;
    cost: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type VehicleMaintenanceAvgAggregateInputType = {
    cost?: true;
};
export type VehicleMaintenanceSumAggregateInputType = {
    cost?: true;
};
export type VehicleMaintenanceMinAggregateInputType = {
    id?: true;
    tenantId?: true;
    vehicleId?: true;
    status?: true;
    description?: true;
    startedAt?: true;
    finishedAt?: true;
    cost?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type VehicleMaintenanceMaxAggregateInputType = {
    id?: true;
    tenantId?: true;
    vehicleId?: true;
    status?: true;
    description?: true;
    startedAt?: true;
    finishedAt?: true;
    cost?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type VehicleMaintenanceCountAggregateInputType = {
    id?: true;
    tenantId?: true;
    vehicleId?: true;
    status?: true;
    description?: true;
    startedAt?: true;
    finishedAt?: true;
    cost?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type VehicleMaintenanceAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.VehicleMaintenanceWhereInput;
    orderBy?: Prisma.VehicleMaintenanceOrderByWithRelationInput | Prisma.VehicleMaintenanceOrderByWithRelationInput[];
    cursor?: Prisma.VehicleMaintenanceWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | VehicleMaintenanceCountAggregateInputType;
    _avg?: VehicleMaintenanceAvgAggregateInputType;
    _sum?: VehicleMaintenanceSumAggregateInputType;
    _min?: VehicleMaintenanceMinAggregateInputType;
    _max?: VehicleMaintenanceMaxAggregateInputType;
};
export type GetVehicleMaintenanceAggregateType<T extends VehicleMaintenanceAggregateArgs> = {
    [P in keyof T & keyof AggregateVehicleMaintenance]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateVehicleMaintenance[P]> : Prisma.GetScalarType<T[P], AggregateVehicleMaintenance[P]>;
};
export type VehicleMaintenanceGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.VehicleMaintenanceWhereInput;
    orderBy?: Prisma.VehicleMaintenanceOrderByWithAggregationInput | Prisma.VehicleMaintenanceOrderByWithAggregationInput[];
    by: Prisma.VehicleMaintenanceScalarFieldEnum[] | Prisma.VehicleMaintenanceScalarFieldEnum;
    having?: Prisma.VehicleMaintenanceScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: VehicleMaintenanceCountAggregateInputType | true;
    _avg?: VehicleMaintenanceAvgAggregateInputType;
    _sum?: VehicleMaintenanceSumAggregateInputType;
    _min?: VehicleMaintenanceMinAggregateInputType;
    _max?: VehicleMaintenanceMaxAggregateInputType;
};
export type VehicleMaintenanceGroupByOutputType = {
    id: string;
    tenantId: string;
    vehicleId: string;
    status: $Enums.MaintenanceStatus;
    description: string;
    startedAt: Date | null;
    finishedAt: Date | null;
    cost: runtime.Decimal | null;
    createdAt: Date;
    updatedAt: Date;
    _count: VehicleMaintenanceCountAggregateOutputType | null;
    _avg: VehicleMaintenanceAvgAggregateOutputType | null;
    _sum: VehicleMaintenanceSumAggregateOutputType | null;
    _min: VehicleMaintenanceMinAggregateOutputType | null;
    _max: VehicleMaintenanceMaxAggregateOutputType | null;
};
type GetVehicleMaintenanceGroupByPayload<T extends VehicleMaintenanceGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<VehicleMaintenanceGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof VehicleMaintenanceGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], VehicleMaintenanceGroupByOutputType[P]> : Prisma.GetScalarType<T[P], VehicleMaintenanceGroupByOutputType[P]>;
}>>;
export type VehicleMaintenanceWhereInput = {
    AND?: Prisma.VehicleMaintenanceWhereInput | Prisma.VehicleMaintenanceWhereInput[];
    OR?: Prisma.VehicleMaintenanceWhereInput[];
    NOT?: Prisma.VehicleMaintenanceWhereInput | Prisma.VehicleMaintenanceWhereInput[];
    id?: Prisma.StringFilter<"VehicleMaintenance"> | string;
    tenantId?: Prisma.StringFilter<"VehicleMaintenance"> | string;
    vehicleId?: Prisma.StringFilter<"VehicleMaintenance"> | string;
    status?: Prisma.EnumMaintenanceStatusFilter<"VehicleMaintenance"> | $Enums.MaintenanceStatus;
    description?: Prisma.StringFilter<"VehicleMaintenance"> | string;
    startedAt?: Prisma.DateTimeNullableFilter<"VehicleMaintenance"> | Date | string | null;
    finishedAt?: Prisma.DateTimeNullableFilter<"VehicleMaintenance"> | Date | string | null;
    cost?: Prisma.DecimalNullableFilter<"VehicleMaintenance"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Prisma.DateTimeFilter<"VehicleMaintenance"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"VehicleMaintenance"> | Date | string;
    tenant?: Prisma.XOR<Prisma.TenantScalarRelationFilter, Prisma.TenantWhereInput>;
    vehicle?: Prisma.XOR<Prisma.VehicleScalarRelationFilter, Prisma.VehicleWhereInput>;
};
export type VehicleMaintenanceOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    vehicleId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    startedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    finishedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    cost?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    tenant?: Prisma.TenantOrderByWithRelationInput;
    vehicle?: Prisma.VehicleOrderByWithRelationInput;
};
export type VehicleMaintenanceWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.VehicleMaintenanceWhereInput | Prisma.VehicleMaintenanceWhereInput[];
    OR?: Prisma.VehicleMaintenanceWhereInput[];
    NOT?: Prisma.VehicleMaintenanceWhereInput | Prisma.VehicleMaintenanceWhereInput[];
    tenantId?: Prisma.StringFilter<"VehicleMaintenance"> | string;
    vehicleId?: Prisma.StringFilter<"VehicleMaintenance"> | string;
    status?: Prisma.EnumMaintenanceStatusFilter<"VehicleMaintenance"> | $Enums.MaintenanceStatus;
    description?: Prisma.StringFilter<"VehicleMaintenance"> | string;
    startedAt?: Prisma.DateTimeNullableFilter<"VehicleMaintenance"> | Date | string | null;
    finishedAt?: Prisma.DateTimeNullableFilter<"VehicleMaintenance"> | Date | string | null;
    cost?: Prisma.DecimalNullableFilter<"VehicleMaintenance"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Prisma.DateTimeFilter<"VehicleMaintenance"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"VehicleMaintenance"> | Date | string;
    tenant?: Prisma.XOR<Prisma.TenantScalarRelationFilter, Prisma.TenantWhereInput>;
    vehicle?: Prisma.XOR<Prisma.VehicleScalarRelationFilter, Prisma.VehicleWhereInput>;
}, "id">;
export type VehicleMaintenanceOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    vehicleId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    startedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    finishedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    cost?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.VehicleMaintenanceCountOrderByAggregateInput;
    _avg?: Prisma.VehicleMaintenanceAvgOrderByAggregateInput;
    _max?: Prisma.VehicleMaintenanceMaxOrderByAggregateInput;
    _min?: Prisma.VehicleMaintenanceMinOrderByAggregateInput;
    _sum?: Prisma.VehicleMaintenanceSumOrderByAggregateInput;
};
export type VehicleMaintenanceScalarWhereWithAggregatesInput = {
    AND?: Prisma.VehicleMaintenanceScalarWhereWithAggregatesInput | Prisma.VehicleMaintenanceScalarWhereWithAggregatesInput[];
    OR?: Prisma.VehicleMaintenanceScalarWhereWithAggregatesInput[];
    NOT?: Prisma.VehicleMaintenanceScalarWhereWithAggregatesInput | Prisma.VehicleMaintenanceScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"VehicleMaintenance"> | string;
    tenantId?: Prisma.StringWithAggregatesFilter<"VehicleMaintenance"> | string;
    vehicleId?: Prisma.StringWithAggregatesFilter<"VehicleMaintenance"> | string;
    status?: Prisma.EnumMaintenanceStatusWithAggregatesFilter<"VehicleMaintenance"> | $Enums.MaintenanceStatus;
    description?: Prisma.StringWithAggregatesFilter<"VehicleMaintenance"> | string;
    startedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"VehicleMaintenance"> | Date | string | null;
    finishedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"VehicleMaintenance"> | Date | string | null;
    cost?: Prisma.DecimalNullableWithAggregatesFilter<"VehicleMaintenance"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"VehicleMaintenance"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"VehicleMaintenance"> | Date | string;
};
export type VehicleMaintenanceCreateInput = {
    id?: string;
    status?: $Enums.MaintenanceStatus;
    description: string;
    startedAt?: Date | string | null;
    finishedAt?: Date | string | null;
    cost?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    tenant: Prisma.TenantCreateNestedOneWithoutMaintenancesInput;
    vehicle: Prisma.VehicleCreateNestedOneWithoutMaintenancesInput;
};
export type VehicleMaintenanceUncheckedCreateInput = {
    id?: string;
    tenantId: string;
    vehicleId: string;
    status?: $Enums.MaintenanceStatus;
    description: string;
    startedAt?: Date | string | null;
    finishedAt?: Date | string | null;
    cost?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type VehicleMaintenanceUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumMaintenanceStatusFieldUpdateOperationsInput | $Enums.MaintenanceStatus;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    startedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    finishedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    cost?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    tenant?: Prisma.TenantUpdateOneRequiredWithoutMaintenancesNestedInput;
    vehicle?: Prisma.VehicleUpdateOneRequiredWithoutMaintenancesNestedInput;
};
export type VehicleMaintenanceUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenantId?: Prisma.StringFieldUpdateOperationsInput | string;
    vehicleId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumMaintenanceStatusFieldUpdateOperationsInput | $Enums.MaintenanceStatus;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    startedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    finishedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    cost?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type VehicleMaintenanceCreateManyInput = {
    id?: string;
    tenantId: string;
    vehicleId: string;
    status?: $Enums.MaintenanceStatus;
    description: string;
    startedAt?: Date | string | null;
    finishedAt?: Date | string | null;
    cost?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type VehicleMaintenanceUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumMaintenanceStatusFieldUpdateOperationsInput | $Enums.MaintenanceStatus;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    startedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    finishedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    cost?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type VehicleMaintenanceUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenantId?: Prisma.StringFieldUpdateOperationsInput | string;
    vehicleId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumMaintenanceStatusFieldUpdateOperationsInput | $Enums.MaintenanceStatus;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    startedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    finishedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    cost?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type VehicleMaintenanceListRelationFilter = {
    every?: Prisma.VehicleMaintenanceWhereInput;
    some?: Prisma.VehicleMaintenanceWhereInput;
    none?: Prisma.VehicleMaintenanceWhereInput;
};
export type VehicleMaintenanceOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type VehicleMaintenanceCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    vehicleId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    startedAt?: Prisma.SortOrder;
    finishedAt?: Prisma.SortOrder;
    cost?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type VehicleMaintenanceAvgOrderByAggregateInput = {
    cost?: Prisma.SortOrder;
};
export type VehicleMaintenanceMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    vehicleId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    startedAt?: Prisma.SortOrder;
    finishedAt?: Prisma.SortOrder;
    cost?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type VehicleMaintenanceMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    vehicleId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    startedAt?: Prisma.SortOrder;
    finishedAt?: Prisma.SortOrder;
    cost?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type VehicleMaintenanceSumOrderByAggregateInput = {
    cost?: Prisma.SortOrder;
};
export type VehicleMaintenanceCreateNestedManyWithoutTenantInput = {
    create?: Prisma.XOR<Prisma.VehicleMaintenanceCreateWithoutTenantInput, Prisma.VehicleMaintenanceUncheckedCreateWithoutTenantInput> | Prisma.VehicleMaintenanceCreateWithoutTenantInput[] | Prisma.VehicleMaintenanceUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.VehicleMaintenanceCreateOrConnectWithoutTenantInput | Prisma.VehicleMaintenanceCreateOrConnectWithoutTenantInput[];
    createMany?: Prisma.VehicleMaintenanceCreateManyTenantInputEnvelope;
    connect?: Prisma.VehicleMaintenanceWhereUniqueInput | Prisma.VehicleMaintenanceWhereUniqueInput[];
};
export type VehicleMaintenanceUncheckedCreateNestedManyWithoutTenantInput = {
    create?: Prisma.XOR<Prisma.VehicleMaintenanceCreateWithoutTenantInput, Prisma.VehicleMaintenanceUncheckedCreateWithoutTenantInput> | Prisma.VehicleMaintenanceCreateWithoutTenantInput[] | Prisma.VehicleMaintenanceUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.VehicleMaintenanceCreateOrConnectWithoutTenantInput | Prisma.VehicleMaintenanceCreateOrConnectWithoutTenantInput[];
    createMany?: Prisma.VehicleMaintenanceCreateManyTenantInputEnvelope;
    connect?: Prisma.VehicleMaintenanceWhereUniqueInput | Prisma.VehicleMaintenanceWhereUniqueInput[];
};
export type VehicleMaintenanceUpdateManyWithoutTenantNestedInput = {
    create?: Prisma.XOR<Prisma.VehicleMaintenanceCreateWithoutTenantInput, Prisma.VehicleMaintenanceUncheckedCreateWithoutTenantInput> | Prisma.VehicleMaintenanceCreateWithoutTenantInput[] | Prisma.VehicleMaintenanceUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.VehicleMaintenanceCreateOrConnectWithoutTenantInput | Prisma.VehicleMaintenanceCreateOrConnectWithoutTenantInput[];
    upsert?: Prisma.VehicleMaintenanceUpsertWithWhereUniqueWithoutTenantInput | Prisma.VehicleMaintenanceUpsertWithWhereUniqueWithoutTenantInput[];
    createMany?: Prisma.VehicleMaintenanceCreateManyTenantInputEnvelope;
    set?: Prisma.VehicleMaintenanceWhereUniqueInput | Prisma.VehicleMaintenanceWhereUniqueInput[];
    disconnect?: Prisma.VehicleMaintenanceWhereUniqueInput | Prisma.VehicleMaintenanceWhereUniqueInput[];
    delete?: Prisma.VehicleMaintenanceWhereUniqueInput | Prisma.VehicleMaintenanceWhereUniqueInput[];
    connect?: Prisma.VehicleMaintenanceWhereUniqueInput | Prisma.VehicleMaintenanceWhereUniqueInput[];
    update?: Prisma.VehicleMaintenanceUpdateWithWhereUniqueWithoutTenantInput | Prisma.VehicleMaintenanceUpdateWithWhereUniqueWithoutTenantInput[];
    updateMany?: Prisma.VehicleMaintenanceUpdateManyWithWhereWithoutTenantInput | Prisma.VehicleMaintenanceUpdateManyWithWhereWithoutTenantInput[];
    deleteMany?: Prisma.VehicleMaintenanceScalarWhereInput | Prisma.VehicleMaintenanceScalarWhereInput[];
};
export type VehicleMaintenanceUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: Prisma.XOR<Prisma.VehicleMaintenanceCreateWithoutTenantInput, Prisma.VehicleMaintenanceUncheckedCreateWithoutTenantInput> | Prisma.VehicleMaintenanceCreateWithoutTenantInput[] | Prisma.VehicleMaintenanceUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.VehicleMaintenanceCreateOrConnectWithoutTenantInput | Prisma.VehicleMaintenanceCreateOrConnectWithoutTenantInput[];
    upsert?: Prisma.VehicleMaintenanceUpsertWithWhereUniqueWithoutTenantInput | Prisma.VehicleMaintenanceUpsertWithWhereUniqueWithoutTenantInput[];
    createMany?: Prisma.VehicleMaintenanceCreateManyTenantInputEnvelope;
    set?: Prisma.VehicleMaintenanceWhereUniqueInput | Prisma.VehicleMaintenanceWhereUniqueInput[];
    disconnect?: Prisma.VehicleMaintenanceWhereUniqueInput | Prisma.VehicleMaintenanceWhereUniqueInput[];
    delete?: Prisma.VehicleMaintenanceWhereUniqueInput | Prisma.VehicleMaintenanceWhereUniqueInput[];
    connect?: Prisma.VehicleMaintenanceWhereUniqueInput | Prisma.VehicleMaintenanceWhereUniqueInput[];
    update?: Prisma.VehicleMaintenanceUpdateWithWhereUniqueWithoutTenantInput | Prisma.VehicleMaintenanceUpdateWithWhereUniqueWithoutTenantInput[];
    updateMany?: Prisma.VehicleMaintenanceUpdateManyWithWhereWithoutTenantInput | Prisma.VehicleMaintenanceUpdateManyWithWhereWithoutTenantInput[];
    deleteMany?: Prisma.VehicleMaintenanceScalarWhereInput | Prisma.VehicleMaintenanceScalarWhereInput[];
};
export type VehicleMaintenanceCreateNestedManyWithoutVehicleInput = {
    create?: Prisma.XOR<Prisma.VehicleMaintenanceCreateWithoutVehicleInput, Prisma.VehicleMaintenanceUncheckedCreateWithoutVehicleInput> | Prisma.VehicleMaintenanceCreateWithoutVehicleInput[] | Prisma.VehicleMaintenanceUncheckedCreateWithoutVehicleInput[];
    connectOrCreate?: Prisma.VehicleMaintenanceCreateOrConnectWithoutVehicleInput | Prisma.VehicleMaintenanceCreateOrConnectWithoutVehicleInput[];
    createMany?: Prisma.VehicleMaintenanceCreateManyVehicleInputEnvelope;
    connect?: Prisma.VehicleMaintenanceWhereUniqueInput | Prisma.VehicleMaintenanceWhereUniqueInput[];
};
export type VehicleMaintenanceUncheckedCreateNestedManyWithoutVehicleInput = {
    create?: Prisma.XOR<Prisma.VehicleMaintenanceCreateWithoutVehicleInput, Prisma.VehicleMaintenanceUncheckedCreateWithoutVehicleInput> | Prisma.VehicleMaintenanceCreateWithoutVehicleInput[] | Prisma.VehicleMaintenanceUncheckedCreateWithoutVehicleInput[];
    connectOrCreate?: Prisma.VehicleMaintenanceCreateOrConnectWithoutVehicleInput | Prisma.VehicleMaintenanceCreateOrConnectWithoutVehicleInput[];
    createMany?: Prisma.VehicleMaintenanceCreateManyVehicleInputEnvelope;
    connect?: Prisma.VehicleMaintenanceWhereUniqueInput | Prisma.VehicleMaintenanceWhereUniqueInput[];
};
export type VehicleMaintenanceUpdateManyWithoutVehicleNestedInput = {
    create?: Prisma.XOR<Prisma.VehicleMaintenanceCreateWithoutVehicleInput, Prisma.VehicleMaintenanceUncheckedCreateWithoutVehicleInput> | Prisma.VehicleMaintenanceCreateWithoutVehicleInput[] | Prisma.VehicleMaintenanceUncheckedCreateWithoutVehicleInput[];
    connectOrCreate?: Prisma.VehicleMaintenanceCreateOrConnectWithoutVehicleInput | Prisma.VehicleMaintenanceCreateOrConnectWithoutVehicleInput[];
    upsert?: Prisma.VehicleMaintenanceUpsertWithWhereUniqueWithoutVehicleInput | Prisma.VehicleMaintenanceUpsertWithWhereUniqueWithoutVehicleInput[];
    createMany?: Prisma.VehicleMaintenanceCreateManyVehicleInputEnvelope;
    set?: Prisma.VehicleMaintenanceWhereUniqueInput | Prisma.VehicleMaintenanceWhereUniqueInput[];
    disconnect?: Prisma.VehicleMaintenanceWhereUniqueInput | Prisma.VehicleMaintenanceWhereUniqueInput[];
    delete?: Prisma.VehicleMaintenanceWhereUniqueInput | Prisma.VehicleMaintenanceWhereUniqueInput[];
    connect?: Prisma.VehicleMaintenanceWhereUniqueInput | Prisma.VehicleMaintenanceWhereUniqueInput[];
    update?: Prisma.VehicleMaintenanceUpdateWithWhereUniqueWithoutVehicleInput | Prisma.VehicleMaintenanceUpdateWithWhereUniqueWithoutVehicleInput[];
    updateMany?: Prisma.VehicleMaintenanceUpdateManyWithWhereWithoutVehicleInput | Prisma.VehicleMaintenanceUpdateManyWithWhereWithoutVehicleInput[];
    deleteMany?: Prisma.VehicleMaintenanceScalarWhereInput | Prisma.VehicleMaintenanceScalarWhereInput[];
};
export type VehicleMaintenanceUncheckedUpdateManyWithoutVehicleNestedInput = {
    create?: Prisma.XOR<Prisma.VehicleMaintenanceCreateWithoutVehicleInput, Prisma.VehicleMaintenanceUncheckedCreateWithoutVehicleInput> | Prisma.VehicleMaintenanceCreateWithoutVehicleInput[] | Prisma.VehicleMaintenanceUncheckedCreateWithoutVehicleInput[];
    connectOrCreate?: Prisma.VehicleMaintenanceCreateOrConnectWithoutVehicleInput | Prisma.VehicleMaintenanceCreateOrConnectWithoutVehicleInput[];
    upsert?: Prisma.VehicleMaintenanceUpsertWithWhereUniqueWithoutVehicleInput | Prisma.VehicleMaintenanceUpsertWithWhereUniqueWithoutVehicleInput[];
    createMany?: Prisma.VehicleMaintenanceCreateManyVehicleInputEnvelope;
    set?: Prisma.VehicleMaintenanceWhereUniqueInput | Prisma.VehicleMaintenanceWhereUniqueInput[];
    disconnect?: Prisma.VehicleMaintenanceWhereUniqueInput | Prisma.VehicleMaintenanceWhereUniqueInput[];
    delete?: Prisma.VehicleMaintenanceWhereUniqueInput | Prisma.VehicleMaintenanceWhereUniqueInput[];
    connect?: Prisma.VehicleMaintenanceWhereUniqueInput | Prisma.VehicleMaintenanceWhereUniqueInput[];
    update?: Prisma.VehicleMaintenanceUpdateWithWhereUniqueWithoutVehicleInput | Prisma.VehicleMaintenanceUpdateWithWhereUniqueWithoutVehicleInput[];
    updateMany?: Prisma.VehicleMaintenanceUpdateManyWithWhereWithoutVehicleInput | Prisma.VehicleMaintenanceUpdateManyWithWhereWithoutVehicleInput[];
    deleteMany?: Prisma.VehicleMaintenanceScalarWhereInput | Prisma.VehicleMaintenanceScalarWhereInput[];
};
export type EnumMaintenanceStatusFieldUpdateOperationsInput = {
    set?: $Enums.MaintenanceStatus;
};
export type VehicleMaintenanceCreateWithoutTenantInput = {
    id?: string;
    status?: $Enums.MaintenanceStatus;
    description: string;
    startedAt?: Date | string | null;
    finishedAt?: Date | string | null;
    cost?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    vehicle: Prisma.VehicleCreateNestedOneWithoutMaintenancesInput;
};
export type VehicleMaintenanceUncheckedCreateWithoutTenantInput = {
    id?: string;
    vehicleId: string;
    status?: $Enums.MaintenanceStatus;
    description: string;
    startedAt?: Date | string | null;
    finishedAt?: Date | string | null;
    cost?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type VehicleMaintenanceCreateOrConnectWithoutTenantInput = {
    where: Prisma.VehicleMaintenanceWhereUniqueInput;
    create: Prisma.XOR<Prisma.VehicleMaintenanceCreateWithoutTenantInput, Prisma.VehicleMaintenanceUncheckedCreateWithoutTenantInput>;
};
export type VehicleMaintenanceCreateManyTenantInputEnvelope = {
    data: Prisma.VehicleMaintenanceCreateManyTenantInput | Prisma.VehicleMaintenanceCreateManyTenantInput[];
    skipDuplicates?: boolean;
};
export type VehicleMaintenanceUpsertWithWhereUniqueWithoutTenantInput = {
    where: Prisma.VehicleMaintenanceWhereUniqueInput;
    update: Prisma.XOR<Prisma.VehicleMaintenanceUpdateWithoutTenantInput, Prisma.VehicleMaintenanceUncheckedUpdateWithoutTenantInput>;
    create: Prisma.XOR<Prisma.VehicleMaintenanceCreateWithoutTenantInput, Prisma.VehicleMaintenanceUncheckedCreateWithoutTenantInput>;
};
export type VehicleMaintenanceUpdateWithWhereUniqueWithoutTenantInput = {
    where: Prisma.VehicleMaintenanceWhereUniqueInput;
    data: Prisma.XOR<Prisma.VehicleMaintenanceUpdateWithoutTenantInput, Prisma.VehicleMaintenanceUncheckedUpdateWithoutTenantInput>;
};
export type VehicleMaintenanceUpdateManyWithWhereWithoutTenantInput = {
    where: Prisma.VehicleMaintenanceScalarWhereInput;
    data: Prisma.XOR<Prisma.VehicleMaintenanceUpdateManyMutationInput, Prisma.VehicleMaintenanceUncheckedUpdateManyWithoutTenantInput>;
};
export type VehicleMaintenanceScalarWhereInput = {
    AND?: Prisma.VehicleMaintenanceScalarWhereInput | Prisma.VehicleMaintenanceScalarWhereInput[];
    OR?: Prisma.VehicleMaintenanceScalarWhereInput[];
    NOT?: Prisma.VehicleMaintenanceScalarWhereInput | Prisma.VehicleMaintenanceScalarWhereInput[];
    id?: Prisma.StringFilter<"VehicleMaintenance"> | string;
    tenantId?: Prisma.StringFilter<"VehicleMaintenance"> | string;
    vehicleId?: Prisma.StringFilter<"VehicleMaintenance"> | string;
    status?: Prisma.EnumMaintenanceStatusFilter<"VehicleMaintenance"> | $Enums.MaintenanceStatus;
    description?: Prisma.StringFilter<"VehicleMaintenance"> | string;
    startedAt?: Prisma.DateTimeNullableFilter<"VehicleMaintenance"> | Date | string | null;
    finishedAt?: Prisma.DateTimeNullableFilter<"VehicleMaintenance"> | Date | string | null;
    cost?: Prisma.DecimalNullableFilter<"VehicleMaintenance"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Prisma.DateTimeFilter<"VehicleMaintenance"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"VehicleMaintenance"> | Date | string;
};
export type VehicleMaintenanceCreateWithoutVehicleInput = {
    id?: string;
    status?: $Enums.MaintenanceStatus;
    description: string;
    startedAt?: Date | string | null;
    finishedAt?: Date | string | null;
    cost?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    tenant: Prisma.TenantCreateNestedOneWithoutMaintenancesInput;
};
export type VehicleMaintenanceUncheckedCreateWithoutVehicleInput = {
    id?: string;
    tenantId: string;
    status?: $Enums.MaintenanceStatus;
    description: string;
    startedAt?: Date | string | null;
    finishedAt?: Date | string | null;
    cost?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type VehicleMaintenanceCreateOrConnectWithoutVehicleInput = {
    where: Prisma.VehicleMaintenanceWhereUniqueInput;
    create: Prisma.XOR<Prisma.VehicleMaintenanceCreateWithoutVehicleInput, Prisma.VehicleMaintenanceUncheckedCreateWithoutVehicleInput>;
};
export type VehicleMaintenanceCreateManyVehicleInputEnvelope = {
    data: Prisma.VehicleMaintenanceCreateManyVehicleInput | Prisma.VehicleMaintenanceCreateManyVehicleInput[];
    skipDuplicates?: boolean;
};
export type VehicleMaintenanceUpsertWithWhereUniqueWithoutVehicleInput = {
    where: Prisma.VehicleMaintenanceWhereUniqueInput;
    update: Prisma.XOR<Prisma.VehicleMaintenanceUpdateWithoutVehicleInput, Prisma.VehicleMaintenanceUncheckedUpdateWithoutVehicleInput>;
    create: Prisma.XOR<Prisma.VehicleMaintenanceCreateWithoutVehicleInput, Prisma.VehicleMaintenanceUncheckedCreateWithoutVehicleInput>;
};
export type VehicleMaintenanceUpdateWithWhereUniqueWithoutVehicleInput = {
    where: Prisma.VehicleMaintenanceWhereUniqueInput;
    data: Prisma.XOR<Prisma.VehicleMaintenanceUpdateWithoutVehicleInput, Prisma.VehicleMaintenanceUncheckedUpdateWithoutVehicleInput>;
};
export type VehicleMaintenanceUpdateManyWithWhereWithoutVehicleInput = {
    where: Prisma.VehicleMaintenanceScalarWhereInput;
    data: Prisma.XOR<Prisma.VehicleMaintenanceUpdateManyMutationInput, Prisma.VehicleMaintenanceUncheckedUpdateManyWithoutVehicleInput>;
};
export type VehicleMaintenanceCreateManyTenantInput = {
    id?: string;
    vehicleId: string;
    status?: $Enums.MaintenanceStatus;
    description: string;
    startedAt?: Date | string | null;
    finishedAt?: Date | string | null;
    cost?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type VehicleMaintenanceUpdateWithoutTenantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumMaintenanceStatusFieldUpdateOperationsInput | $Enums.MaintenanceStatus;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    startedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    finishedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    cost?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    vehicle?: Prisma.VehicleUpdateOneRequiredWithoutMaintenancesNestedInput;
};
export type VehicleMaintenanceUncheckedUpdateWithoutTenantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    vehicleId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumMaintenanceStatusFieldUpdateOperationsInput | $Enums.MaintenanceStatus;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    startedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    finishedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    cost?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type VehicleMaintenanceUncheckedUpdateManyWithoutTenantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    vehicleId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumMaintenanceStatusFieldUpdateOperationsInput | $Enums.MaintenanceStatus;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    startedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    finishedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    cost?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type VehicleMaintenanceCreateManyVehicleInput = {
    id?: string;
    tenantId: string;
    status?: $Enums.MaintenanceStatus;
    description: string;
    startedAt?: Date | string | null;
    finishedAt?: Date | string | null;
    cost?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type VehicleMaintenanceUpdateWithoutVehicleInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumMaintenanceStatusFieldUpdateOperationsInput | $Enums.MaintenanceStatus;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    startedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    finishedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    cost?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    tenant?: Prisma.TenantUpdateOneRequiredWithoutMaintenancesNestedInput;
};
export type VehicleMaintenanceUncheckedUpdateWithoutVehicleInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenantId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumMaintenanceStatusFieldUpdateOperationsInput | $Enums.MaintenanceStatus;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    startedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    finishedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    cost?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type VehicleMaintenanceUncheckedUpdateManyWithoutVehicleInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenantId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumMaintenanceStatusFieldUpdateOperationsInput | $Enums.MaintenanceStatus;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    startedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    finishedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    cost?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type VehicleMaintenanceSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tenantId?: boolean;
    vehicleId?: boolean;
    status?: boolean;
    description?: boolean;
    startedAt?: boolean;
    finishedAt?: boolean;
    cost?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
    vehicle?: boolean | Prisma.VehicleDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["vehicleMaintenance"]>;
export type VehicleMaintenanceSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tenantId?: boolean;
    vehicleId?: boolean;
    status?: boolean;
    description?: boolean;
    startedAt?: boolean;
    finishedAt?: boolean;
    cost?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
    vehicle?: boolean | Prisma.VehicleDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["vehicleMaintenance"]>;
export type VehicleMaintenanceSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tenantId?: boolean;
    vehicleId?: boolean;
    status?: boolean;
    description?: boolean;
    startedAt?: boolean;
    finishedAt?: boolean;
    cost?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
    vehicle?: boolean | Prisma.VehicleDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["vehicleMaintenance"]>;
export type VehicleMaintenanceSelectScalar = {
    id?: boolean;
    tenantId?: boolean;
    vehicleId?: boolean;
    status?: boolean;
    description?: boolean;
    startedAt?: boolean;
    finishedAt?: boolean;
    cost?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type VehicleMaintenanceOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "tenantId" | "vehicleId" | "status" | "description" | "startedAt" | "finishedAt" | "cost" | "createdAt" | "updatedAt", ExtArgs["result"]["vehicleMaintenance"]>;
export type VehicleMaintenanceInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
    vehicle?: boolean | Prisma.VehicleDefaultArgs<ExtArgs>;
};
export type VehicleMaintenanceIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
    vehicle?: boolean | Prisma.VehicleDefaultArgs<ExtArgs>;
};
export type VehicleMaintenanceIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
    vehicle?: boolean | Prisma.VehicleDefaultArgs<ExtArgs>;
};
export type $VehicleMaintenancePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "VehicleMaintenance";
    objects: {
        tenant: Prisma.$TenantPayload<ExtArgs>;
        vehicle: Prisma.$VehiclePayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        tenantId: string;
        vehicleId: string;
        status: $Enums.MaintenanceStatus;
        description: string;
        startedAt: Date | null;
        finishedAt: Date | null;
        cost: runtime.Decimal | null;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["vehicleMaintenance"]>;
    composites: {};
};
export type VehicleMaintenanceGetPayload<S extends boolean | null | undefined | VehicleMaintenanceDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$VehicleMaintenancePayload, S>;
export type VehicleMaintenanceCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<VehicleMaintenanceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: VehicleMaintenanceCountAggregateInputType | true;
};
export interface VehicleMaintenanceDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['VehicleMaintenance'];
        meta: {
            name: 'VehicleMaintenance';
        };
    };
    findUnique<T extends VehicleMaintenanceFindUniqueArgs>(args: Prisma.SelectSubset<T, VehicleMaintenanceFindUniqueArgs<ExtArgs>>): Prisma.Prisma__VehicleMaintenanceClient<runtime.Types.Result.GetResult<Prisma.$VehicleMaintenancePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends VehicleMaintenanceFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, VehicleMaintenanceFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__VehicleMaintenanceClient<runtime.Types.Result.GetResult<Prisma.$VehicleMaintenancePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends VehicleMaintenanceFindFirstArgs>(args?: Prisma.SelectSubset<T, VehicleMaintenanceFindFirstArgs<ExtArgs>>): Prisma.Prisma__VehicleMaintenanceClient<runtime.Types.Result.GetResult<Prisma.$VehicleMaintenancePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends VehicleMaintenanceFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, VehicleMaintenanceFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__VehicleMaintenanceClient<runtime.Types.Result.GetResult<Prisma.$VehicleMaintenancePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends VehicleMaintenanceFindManyArgs>(args?: Prisma.SelectSubset<T, VehicleMaintenanceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$VehicleMaintenancePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends VehicleMaintenanceCreateArgs>(args: Prisma.SelectSubset<T, VehicleMaintenanceCreateArgs<ExtArgs>>): Prisma.Prisma__VehicleMaintenanceClient<runtime.Types.Result.GetResult<Prisma.$VehicleMaintenancePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends VehicleMaintenanceCreateManyArgs>(args?: Prisma.SelectSubset<T, VehicleMaintenanceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends VehicleMaintenanceCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, VehicleMaintenanceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$VehicleMaintenancePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends VehicleMaintenanceDeleteArgs>(args: Prisma.SelectSubset<T, VehicleMaintenanceDeleteArgs<ExtArgs>>): Prisma.Prisma__VehicleMaintenanceClient<runtime.Types.Result.GetResult<Prisma.$VehicleMaintenancePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends VehicleMaintenanceUpdateArgs>(args: Prisma.SelectSubset<T, VehicleMaintenanceUpdateArgs<ExtArgs>>): Prisma.Prisma__VehicleMaintenanceClient<runtime.Types.Result.GetResult<Prisma.$VehicleMaintenancePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends VehicleMaintenanceDeleteManyArgs>(args?: Prisma.SelectSubset<T, VehicleMaintenanceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends VehicleMaintenanceUpdateManyArgs>(args: Prisma.SelectSubset<T, VehicleMaintenanceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends VehicleMaintenanceUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, VehicleMaintenanceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$VehicleMaintenancePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends VehicleMaintenanceUpsertArgs>(args: Prisma.SelectSubset<T, VehicleMaintenanceUpsertArgs<ExtArgs>>): Prisma.Prisma__VehicleMaintenanceClient<runtime.Types.Result.GetResult<Prisma.$VehicleMaintenancePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends VehicleMaintenanceCountArgs>(args?: Prisma.Subset<T, VehicleMaintenanceCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], VehicleMaintenanceCountAggregateOutputType> : number>;
    aggregate<T extends VehicleMaintenanceAggregateArgs>(args: Prisma.Subset<T, VehicleMaintenanceAggregateArgs>): Prisma.PrismaPromise<GetVehicleMaintenanceAggregateType<T>>;
    groupBy<T extends VehicleMaintenanceGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: VehicleMaintenanceGroupByArgs['orderBy'];
    } : {
        orderBy?: VehicleMaintenanceGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, VehicleMaintenanceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVehicleMaintenanceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: VehicleMaintenanceFieldRefs;
}
export interface Prisma__VehicleMaintenanceClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    tenant<T extends Prisma.TenantDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.TenantDefaultArgs<ExtArgs>>): Prisma.Prisma__TenantClient<runtime.Types.Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    vehicle<T extends Prisma.VehicleDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.VehicleDefaultArgs<ExtArgs>>): Prisma.Prisma__VehicleClient<runtime.Types.Result.GetResult<Prisma.$VehiclePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface VehicleMaintenanceFieldRefs {
    readonly id: Prisma.FieldRef<"VehicleMaintenance", 'String'>;
    readonly tenantId: Prisma.FieldRef<"VehicleMaintenance", 'String'>;
    readonly vehicleId: Prisma.FieldRef<"VehicleMaintenance", 'String'>;
    readonly status: Prisma.FieldRef<"VehicleMaintenance", 'MaintenanceStatus'>;
    readonly description: Prisma.FieldRef<"VehicleMaintenance", 'String'>;
    readonly startedAt: Prisma.FieldRef<"VehicleMaintenance", 'DateTime'>;
    readonly finishedAt: Prisma.FieldRef<"VehicleMaintenance", 'DateTime'>;
    readonly cost: Prisma.FieldRef<"VehicleMaintenance", 'Decimal'>;
    readonly createdAt: Prisma.FieldRef<"VehicleMaintenance", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"VehicleMaintenance", 'DateTime'>;
}
export type VehicleMaintenanceFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VehicleMaintenanceSelect<ExtArgs> | null;
    omit?: Prisma.VehicleMaintenanceOmit<ExtArgs> | null;
    include?: Prisma.VehicleMaintenanceInclude<ExtArgs> | null;
    where: Prisma.VehicleMaintenanceWhereUniqueInput;
};
export type VehicleMaintenanceFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VehicleMaintenanceSelect<ExtArgs> | null;
    omit?: Prisma.VehicleMaintenanceOmit<ExtArgs> | null;
    include?: Prisma.VehicleMaintenanceInclude<ExtArgs> | null;
    where: Prisma.VehicleMaintenanceWhereUniqueInput;
};
export type VehicleMaintenanceFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VehicleMaintenanceSelect<ExtArgs> | null;
    omit?: Prisma.VehicleMaintenanceOmit<ExtArgs> | null;
    include?: Prisma.VehicleMaintenanceInclude<ExtArgs> | null;
    where?: Prisma.VehicleMaintenanceWhereInput;
    orderBy?: Prisma.VehicleMaintenanceOrderByWithRelationInput | Prisma.VehicleMaintenanceOrderByWithRelationInput[];
    cursor?: Prisma.VehicleMaintenanceWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.VehicleMaintenanceScalarFieldEnum | Prisma.VehicleMaintenanceScalarFieldEnum[];
};
export type VehicleMaintenanceFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VehicleMaintenanceSelect<ExtArgs> | null;
    omit?: Prisma.VehicleMaintenanceOmit<ExtArgs> | null;
    include?: Prisma.VehicleMaintenanceInclude<ExtArgs> | null;
    where?: Prisma.VehicleMaintenanceWhereInput;
    orderBy?: Prisma.VehicleMaintenanceOrderByWithRelationInput | Prisma.VehicleMaintenanceOrderByWithRelationInput[];
    cursor?: Prisma.VehicleMaintenanceWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.VehicleMaintenanceScalarFieldEnum | Prisma.VehicleMaintenanceScalarFieldEnum[];
};
export type VehicleMaintenanceFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VehicleMaintenanceSelect<ExtArgs> | null;
    omit?: Prisma.VehicleMaintenanceOmit<ExtArgs> | null;
    include?: Prisma.VehicleMaintenanceInclude<ExtArgs> | null;
    where?: Prisma.VehicleMaintenanceWhereInput;
    orderBy?: Prisma.VehicleMaintenanceOrderByWithRelationInput | Prisma.VehicleMaintenanceOrderByWithRelationInput[];
    cursor?: Prisma.VehicleMaintenanceWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.VehicleMaintenanceScalarFieldEnum | Prisma.VehicleMaintenanceScalarFieldEnum[];
};
export type VehicleMaintenanceCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VehicleMaintenanceSelect<ExtArgs> | null;
    omit?: Prisma.VehicleMaintenanceOmit<ExtArgs> | null;
    include?: Prisma.VehicleMaintenanceInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.VehicleMaintenanceCreateInput, Prisma.VehicleMaintenanceUncheckedCreateInput>;
};
export type VehicleMaintenanceCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.VehicleMaintenanceCreateManyInput | Prisma.VehicleMaintenanceCreateManyInput[];
    skipDuplicates?: boolean;
};
export type VehicleMaintenanceCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VehicleMaintenanceSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.VehicleMaintenanceOmit<ExtArgs> | null;
    data: Prisma.VehicleMaintenanceCreateManyInput | Prisma.VehicleMaintenanceCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.VehicleMaintenanceIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type VehicleMaintenanceUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VehicleMaintenanceSelect<ExtArgs> | null;
    omit?: Prisma.VehicleMaintenanceOmit<ExtArgs> | null;
    include?: Prisma.VehicleMaintenanceInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.VehicleMaintenanceUpdateInput, Prisma.VehicleMaintenanceUncheckedUpdateInput>;
    where: Prisma.VehicleMaintenanceWhereUniqueInput;
};
export type VehicleMaintenanceUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.VehicleMaintenanceUpdateManyMutationInput, Prisma.VehicleMaintenanceUncheckedUpdateManyInput>;
    where?: Prisma.VehicleMaintenanceWhereInput;
    limit?: number;
};
export type VehicleMaintenanceUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VehicleMaintenanceSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.VehicleMaintenanceOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.VehicleMaintenanceUpdateManyMutationInput, Prisma.VehicleMaintenanceUncheckedUpdateManyInput>;
    where?: Prisma.VehicleMaintenanceWhereInput;
    limit?: number;
    include?: Prisma.VehicleMaintenanceIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type VehicleMaintenanceUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VehicleMaintenanceSelect<ExtArgs> | null;
    omit?: Prisma.VehicleMaintenanceOmit<ExtArgs> | null;
    include?: Prisma.VehicleMaintenanceInclude<ExtArgs> | null;
    where: Prisma.VehicleMaintenanceWhereUniqueInput;
    create: Prisma.XOR<Prisma.VehicleMaintenanceCreateInput, Prisma.VehicleMaintenanceUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.VehicleMaintenanceUpdateInput, Prisma.VehicleMaintenanceUncheckedUpdateInput>;
};
export type VehicleMaintenanceDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VehicleMaintenanceSelect<ExtArgs> | null;
    omit?: Prisma.VehicleMaintenanceOmit<ExtArgs> | null;
    include?: Prisma.VehicleMaintenanceInclude<ExtArgs> | null;
    where: Prisma.VehicleMaintenanceWhereUniqueInput;
};
export type VehicleMaintenanceDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.VehicleMaintenanceWhereInput;
    limit?: number;
};
export type VehicleMaintenanceDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VehicleMaintenanceSelect<ExtArgs> | null;
    omit?: Prisma.VehicleMaintenanceOmit<ExtArgs> | null;
    include?: Prisma.VehicleMaintenanceInclude<ExtArgs> | null;
};
export {};
