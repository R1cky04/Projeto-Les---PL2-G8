import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type LocationModel = runtime.Types.Result.DefaultSelection<Prisma.$LocationPayload>;
export type AggregateLocation = {
    _count: LocationCountAggregateOutputType | null;
    _min: LocationMinAggregateOutputType | null;
    _max: LocationMaxAggregateOutputType | null;
};
export type LocationMinAggregateOutputType = {
    id: string | null;
    tenantId: string | null;
    name: string | null;
    addressLine1: string | null;
    addressLine2: string | null;
    city: string | null;
    postalCode: string | null;
    country: string | null;
    isActive: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type LocationMaxAggregateOutputType = {
    id: string | null;
    tenantId: string | null;
    name: string | null;
    addressLine1: string | null;
    addressLine2: string | null;
    city: string | null;
    postalCode: string | null;
    country: string | null;
    isActive: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type LocationCountAggregateOutputType = {
    id: number;
    tenantId: number;
    name: number;
    addressLine1: number;
    addressLine2: number;
    city: number;
    postalCode: number;
    country: number;
    isActive: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type LocationMinAggregateInputType = {
    id?: true;
    tenantId?: true;
    name?: true;
    addressLine1?: true;
    addressLine2?: true;
    city?: true;
    postalCode?: true;
    country?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type LocationMaxAggregateInputType = {
    id?: true;
    tenantId?: true;
    name?: true;
    addressLine1?: true;
    addressLine2?: true;
    city?: true;
    postalCode?: true;
    country?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type LocationCountAggregateInputType = {
    id?: true;
    tenantId?: true;
    name?: true;
    addressLine1?: true;
    addressLine2?: true;
    city?: true;
    postalCode?: true;
    country?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type LocationAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LocationWhereInput;
    orderBy?: Prisma.LocationOrderByWithRelationInput | Prisma.LocationOrderByWithRelationInput[];
    cursor?: Prisma.LocationWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | LocationCountAggregateInputType;
    _min?: LocationMinAggregateInputType;
    _max?: LocationMaxAggregateInputType;
};
export type GetLocationAggregateType<T extends LocationAggregateArgs> = {
    [P in keyof T & keyof AggregateLocation]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateLocation[P]> : Prisma.GetScalarType<T[P], AggregateLocation[P]>;
};
export type LocationGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LocationWhereInput;
    orderBy?: Prisma.LocationOrderByWithAggregationInput | Prisma.LocationOrderByWithAggregationInput[];
    by: Prisma.LocationScalarFieldEnum[] | Prisma.LocationScalarFieldEnum;
    having?: Prisma.LocationScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: LocationCountAggregateInputType | true;
    _min?: LocationMinAggregateInputType;
    _max?: LocationMaxAggregateInputType;
};
export type LocationGroupByOutputType = {
    id: string;
    tenantId: string;
    name: string;
    addressLine1: string;
    addressLine2: string | null;
    city: string;
    postalCode: string | null;
    country: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    _count: LocationCountAggregateOutputType | null;
    _min: LocationMinAggregateOutputType | null;
    _max: LocationMaxAggregateOutputType | null;
};
type GetLocationGroupByPayload<T extends LocationGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<LocationGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof LocationGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], LocationGroupByOutputType[P]> : Prisma.GetScalarType<T[P], LocationGroupByOutputType[P]>;
}>>;
export type LocationWhereInput = {
    AND?: Prisma.LocationWhereInput | Prisma.LocationWhereInput[];
    OR?: Prisma.LocationWhereInput[];
    NOT?: Prisma.LocationWhereInput | Prisma.LocationWhereInput[];
    id?: Prisma.StringFilter<"Location"> | string;
    tenantId?: Prisma.StringFilter<"Location"> | string;
    name?: Prisma.StringFilter<"Location"> | string;
    addressLine1?: Prisma.StringFilter<"Location"> | string;
    addressLine2?: Prisma.StringNullableFilter<"Location"> | string | null;
    city?: Prisma.StringFilter<"Location"> | string;
    postalCode?: Prisma.StringNullableFilter<"Location"> | string | null;
    country?: Prisma.StringFilter<"Location"> | string;
    isActive?: Prisma.BoolFilter<"Location"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"Location"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Location"> | Date | string;
    tenant?: Prisma.XOR<Prisma.TenantScalarRelationFilter, Prisma.TenantWhereInput>;
    pickupReservations?: Prisma.ReservationListRelationFilter;
    dropoffReservations?: Prisma.ReservationListRelationFilter;
};
export type LocationOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    addressLine1?: Prisma.SortOrder;
    addressLine2?: Prisma.SortOrderInput | Prisma.SortOrder;
    city?: Prisma.SortOrder;
    postalCode?: Prisma.SortOrderInput | Prisma.SortOrder;
    country?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    tenant?: Prisma.TenantOrderByWithRelationInput;
    pickupReservations?: Prisma.ReservationOrderByRelationAggregateInput;
    dropoffReservations?: Prisma.ReservationOrderByRelationAggregateInput;
};
export type LocationWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    tenantId_name?: Prisma.LocationTenantIdNameCompoundUniqueInput;
    AND?: Prisma.LocationWhereInput | Prisma.LocationWhereInput[];
    OR?: Prisma.LocationWhereInput[];
    NOT?: Prisma.LocationWhereInput | Prisma.LocationWhereInput[];
    tenantId?: Prisma.StringFilter<"Location"> | string;
    name?: Prisma.StringFilter<"Location"> | string;
    addressLine1?: Prisma.StringFilter<"Location"> | string;
    addressLine2?: Prisma.StringNullableFilter<"Location"> | string | null;
    city?: Prisma.StringFilter<"Location"> | string;
    postalCode?: Prisma.StringNullableFilter<"Location"> | string | null;
    country?: Prisma.StringFilter<"Location"> | string;
    isActive?: Prisma.BoolFilter<"Location"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"Location"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Location"> | Date | string;
    tenant?: Prisma.XOR<Prisma.TenantScalarRelationFilter, Prisma.TenantWhereInput>;
    pickupReservations?: Prisma.ReservationListRelationFilter;
    dropoffReservations?: Prisma.ReservationListRelationFilter;
}, "id" | "tenantId_name">;
export type LocationOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    addressLine1?: Prisma.SortOrder;
    addressLine2?: Prisma.SortOrderInput | Prisma.SortOrder;
    city?: Prisma.SortOrder;
    postalCode?: Prisma.SortOrderInput | Prisma.SortOrder;
    country?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.LocationCountOrderByAggregateInput;
    _max?: Prisma.LocationMaxOrderByAggregateInput;
    _min?: Prisma.LocationMinOrderByAggregateInput;
};
export type LocationScalarWhereWithAggregatesInput = {
    AND?: Prisma.LocationScalarWhereWithAggregatesInput | Prisma.LocationScalarWhereWithAggregatesInput[];
    OR?: Prisma.LocationScalarWhereWithAggregatesInput[];
    NOT?: Prisma.LocationScalarWhereWithAggregatesInput | Prisma.LocationScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Location"> | string;
    tenantId?: Prisma.StringWithAggregatesFilter<"Location"> | string;
    name?: Prisma.StringWithAggregatesFilter<"Location"> | string;
    addressLine1?: Prisma.StringWithAggregatesFilter<"Location"> | string;
    addressLine2?: Prisma.StringNullableWithAggregatesFilter<"Location"> | string | null;
    city?: Prisma.StringWithAggregatesFilter<"Location"> | string;
    postalCode?: Prisma.StringNullableWithAggregatesFilter<"Location"> | string | null;
    country?: Prisma.StringWithAggregatesFilter<"Location"> | string;
    isActive?: Prisma.BoolWithAggregatesFilter<"Location"> | boolean;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Location"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Location"> | Date | string;
};
export type LocationCreateInput = {
    id?: string;
    name: string;
    addressLine1: string;
    addressLine2?: string | null;
    city: string;
    postalCode?: string | null;
    country: string;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    tenant: Prisma.TenantCreateNestedOneWithoutLocationsInput;
    pickupReservations?: Prisma.ReservationCreateNestedManyWithoutPickupLocationInput;
    dropoffReservations?: Prisma.ReservationCreateNestedManyWithoutDropoffLocationInput;
};
export type LocationUncheckedCreateInput = {
    id?: string;
    tenantId: string;
    name: string;
    addressLine1: string;
    addressLine2?: string | null;
    city: string;
    postalCode?: string | null;
    country: string;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    pickupReservations?: Prisma.ReservationUncheckedCreateNestedManyWithoutPickupLocationInput;
    dropoffReservations?: Prisma.ReservationUncheckedCreateNestedManyWithoutDropoffLocationInput;
};
export type LocationUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    addressLine1?: Prisma.StringFieldUpdateOperationsInput | string;
    addressLine2?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    city?: Prisma.StringFieldUpdateOperationsInput | string;
    postalCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    country?: Prisma.StringFieldUpdateOperationsInput | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    tenant?: Prisma.TenantUpdateOneRequiredWithoutLocationsNestedInput;
    pickupReservations?: Prisma.ReservationUpdateManyWithoutPickupLocationNestedInput;
    dropoffReservations?: Prisma.ReservationUpdateManyWithoutDropoffLocationNestedInput;
};
export type LocationUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenantId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    addressLine1?: Prisma.StringFieldUpdateOperationsInput | string;
    addressLine2?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    city?: Prisma.StringFieldUpdateOperationsInput | string;
    postalCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    country?: Prisma.StringFieldUpdateOperationsInput | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    pickupReservations?: Prisma.ReservationUncheckedUpdateManyWithoutPickupLocationNestedInput;
    dropoffReservations?: Prisma.ReservationUncheckedUpdateManyWithoutDropoffLocationNestedInput;
};
export type LocationCreateManyInput = {
    id?: string;
    tenantId: string;
    name: string;
    addressLine1: string;
    addressLine2?: string | null;
    city: string;
    postalCode?: string | null;
    country: string;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type LocationUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    addressLine1?: Prisma.StringFieldUpdateOperationsInput | string;
    addressLine2?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    city?: Prisma.StringFieldUpdateOperationsInput | string;
    postalCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    country?: Prisma.StringFieldUpdateOperationsInput | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LocationUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenantId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    addressLine1?: Prisma.StringFieldUpdateOperationsInput | string;
    addressLine2?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    city?: Prisma.StringFieldUpdateOperationsInput | string;
    postalCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    country?: Prisma.StringFieldUpdateOperationsInput | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LocationListRelationFilter = {
    every?: Prisma.LocationWhereInput;
    some?: Prisma.LocationWhereInput;
    none?: Prisma.LocationWhereInput;
};
export type LocationOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type LocationTenantIdNameCompoundUniqueInput = {
    tenantId: string;
    name: string;
};
export type LocationCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    addressLine1?: Prisma.SortOrder;
    addressLine2?: Prisma.SortOrder;
    city?: Prisma.SortOrder;
    postalCode?: Prisma.SortOrder;
    country?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type LocationMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    addressLine1?: Prisma.SortOrder;
    addressLine2?: Prisma.SortOrder;
    city?: Prisma.SortOrder;
    postalCode?: Prisma.SortOrder;
    country?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type LocationMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    addressLine1?: Prisma.SortOrder;
    addressLine2?: Prisma.SortOrder;
    city?: Prisma.SortOrder;
    postalCode?: Prisma.SortOrder;
    country?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type LocationScalarRelationFilter = {
    is?: Prisma.LocationWhereInput;
    isNot?: Prisma.LocationWhereInput;
};
export type LocationCreateNestedManyWithoutTenantInput = {
    create?: Prisma.XOR<Prisma.LocationCreateWithoutTenantInput, Prisma.LocationUncheckedCreateWithoutTenantInput> | Prisma.LocationCreateWithoutTenantInput[] | Prisma.LocationUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.LocationCreateOrConnectWithoutTenantInput | Prisma.LocationCreateOrConnectWithoutTenantInput[];
    createMany?: Prisma.LocationCreateManyTenantInputEnvelope;
    connect?: Prisma.LocationWhereUniqueInput | Prisma.LocationWhereUniqueInput[];
};
export type LocationUncheckedCreateNestedManyWithoutTenantInput = {
    create?: Prisma.XOR<Prisma.LocationCreateWithoutTenantInput, Prisma.LocationUncheckedCreateWithoutTenantInput> | Prisma.LocationCreateWithoutTenantInput[] | Prisma.LocationUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.LocationCreateOrConnectWithoutTenantInput | Prisma.LocationCreateOrConnectWithoutTenantInput[];
    createMany?: Prisma.LocationCreateManyTenantInputEnvelope;
    connect?: Prisma.LocationWhereUniqueInput | Prisma.LocationWhereUniqueInput[];
};
export type LocationUpdateManyWithoutTenantNestedInput = {
    create?: Prisma.XOR<Prisma.LocationCreateWithoutTenantInput, Prisma.LocationUncheckedCreateWithoutTenantInput> | Prisma.LocationCreateWithoutTenantInput[] | Prisma.LocationUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.LocationCreateOrConnectWithoutTenantInput | Prisma.LocationCreateOrConnectWithoutTenantInput[];
    upsert?: Prisma.LocationUpsertWithWhereUniqueWithoutTenantInput | Prisma.LocationUpsertWithWhereUniqueWithoutTenantInput[];
    createMany?: Prisma.LocationCreateManyTenantInputEnvelope;
    set?: Prisma.LocationWhereUniqueInput | Prisma.LocationWhereUniqueInput[];
    disconnect?: Prisma.LocationWhereUniqueInput | Prisma.LocationWhereUniqueInput[];
    delete?: Prisma.LocationWhereUniqueInput | Prisma.LocationWhereUniqueInput[];
    connect?: Prisma.LocationWhereUniqueInput | Prisma.LocationWhereUniqueInput[];
    update?: Prisma.LocationUpdateWithWhereUniqueWithoutTenantInput | Prisma.LocationUpdateWithWhereUniqueWithoutTenantInput[];
    updateMany?: Prisma.LocationUpdateManyWithWhereWithoutTenantInput | Prisma.LocationUpdateManyWithWhereWithoutTenantInput[];
    deleteMany?: Prisma.LocationScalarWhereInput | Prisma.LocationScalarWhereInput[];
};
export type LocationUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: Prisma.XOR<Prisma.LocationCreateWithoutTenantInput, Prisma.LocationUncheckedCreateWithoutTenantInput> | Prisma.LocationCreateWithoutTenantInput[] | Prisma.LocationUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.LocationCreateOrConnectWithoutTenantInput | Prisma.LocationCreateOrConnectWithoutTenantInput[];
    upsert?: Prisma.LocationUpsertWithWhereUniqueWithoutTenantInput | Prisma.LocationUpsertWithWhereUniqueWithoutTenantInput[];
    createMany?: Prisma.LocationCreateManyTenantInputEnvelope;
    set?: Prisma.LocationWhereUniqueInput | Prisma.LocationWhereUniqueInput[];
    disconnect?: Prisma.LocationWhereUniqueInput | Prisma.LocationWhereUniqueInput[];
    delete?: Prisma.LocationWhereUniqueInput | Prisma.LocationWhereUniqueInput[];
    connect?: Prisma.LocationWhereUniqueInput | Prisma.LocationWhereUniqueInput[];
    update?: Prisma.LocationUpdateWithWhereUniqueWithoutTenantInput | Prisma.LocationUpdateWithWhereUniqueWithoutTenantInput[];
    updateMany?: Prisma.LocationUpdateManyWithWhereWithoutTenantInput | Prisma.LocationUpdateManyWithWhereWithoutTenantInput[];
    deleteMany?: Prisma.LocationScalarWhereInput | Prisma.LocationScalarWhereInput[];
};
export type LocationCreateNestedOneWithoutPickupReservationsInput = {
    create?: Prisma.XOR<Prisma.LocationCreateWithoutPickupReservationsInput, Prisma.LocationUncheckedCreateWithoutPickupReservationsInput>;
    connectOrCreate?: Prisma.LocationCreateOrConnectWithoutPickupReservationsInput;
    connect?: Prisma.LocationWhereUniqueInput;
};
export type LocationCreateNestedOneWithoutDropoffReservationsInput = {
    create?: Prisma.XOR<Prisma.LocationCreateWithoutDropoffReservationsInput, Prisma.LocationUncheckedCreateWithoutDropoffReservationsInput>;
    connectOrCreate?: Prisma.LocationCreateOrConnectWithoutDropoffReservationsInput;
    connect?: Prisma.LocationWhereUniqueInput;
};
export type LocationUpdateOneRequiredWithoutPickupReservationsNestedInput = {
    create?: Prisma.XOR<Prisma.LocationCreateWithoutPickupReservationsInput, Prisma.LocationUncheckedCreateWithoutPickupReservationsInput>;
    connectOrCreate?: Prisma.LocationCreateOrConnectWithoutPickupReservationsInput;
    upsert?: Prisma.LocationUpsertWithoutPickupReservationsInput;
    connect?: Prisma.LocationWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.LocationUpdateToOneWithWhereWithoutPickupReservationsInput, Prisma.LocationUpdateWithoutPickupReservationsInput>, Prisma.LocationUncheckedUpdateWithoutPickupReservationsInput>;
};
export type LocationUpdateOneRequiredWithoutDropoffReservationsNestedInput = {
    create?: Prisma.XOR<Prisma.LocationCreateWithoutDropoffReservationsInput, Prisma.LocationUncheckedCreateWithoutDropoffReservationsInput>;
    connectOrCreate?: Prisma.LocationCreateOrConnectWithoutDropoffReservationsInput;
    upsert?: Prisma.LocationUpsertWithoutDropoffReservationsInput;
    connect?: Prisma.LocationWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.LocationUpdateToOneWithWhereWithoutDropoffReservationsInput, Prisma.LocationUpdateWithoutDropoffReservationsInput>, Prisma.LocationUncheckedUpdateWithoutDropoffReservationsInput>;
};
export type LocationCreateWithoutTenantInput = {
    id?: string;
    name: string;
    addressLine1: string;
    addressLine2?: string | null;
    city: string;
    postalCode?: string | null;
    country: string;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    pickupReservations?: Prisma.ReservationCreateNestedManyWithoutPickupLocationInput;
    dropoffReservations?: Prisma.ReservationCreateNestedManyWithoutDropoffLocationInput;
};
export type LocationUncheckedCreateWithoutTenantInput = {
    id?: string;
    name: string;
    addressLine1: string;
    addressLine2?: string | null;
    city: string;
    postalCode?: string | null;
    country: string;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    pickupReservations?: Prisma.ReservationUncheckedCreateNestedManyWithoutPickupLocationInput;
    dropoffReservations?: Prisma.ReservationUncheckedCreateNestedManyWithoutDropoffLocationInput;
};
export type LocationCreateOrConnectWithoutTenantInput = {
    where: Prisma.LocationWhereUniqueInput;
    create: Prisma.XOR<Prisma.LocationCreateWithoutTenantInput, Prisma.LocationUncheckedCreateWithoutTenantInput>;
};
export type LocationCreateManyTenantInputEnvelope = {
    data: Prisma.LocationCreateManyTenantInput | Prisma.LocationCreateManyTenantInput[];
    skipDuplicates?: boolean;
};
export type LocationUpsertWithWhereUniqueWithoutTenantInput = {
    where: Prisma.LocationWhereUniqueInput;
    update: Prisma.XOR<Prisma.LocationUpdateWithoutTenantInput, Prisma.LocationUncheckedUpdateWithoutTenantInput>;
    create: Prisma.XOR<Prisma.LocationCreateWithoutTenantInput, Prisma.LocationUncheckedCreateWithoutTenantInput>;
};
export type LocationUpdateWithWhereUniqueWithoutTenantInput = {
    where: Prisma.LocationWhereUniqueInput;
    data: Prisma.XOR<Prisma.LocationUpdateWithoutTenantInput, Prisma.LocationUncheckedUpdateWithoutTenantInput>;
};
export type LocationUpdateManyWithWhereWithoutTenantInput = {
    where: Prisma.LocationScalarWhereInput;
    data: Prisma.XOR<Prisma.LocationUpdateManyMutationInput, Prisma.LocationUncheckedUpdateManyWithoutTenantInput>;
};
export type LocationScalarWhereInput = {
    AND?: Prisma.LocationScalarWhereInput | Prisma.LocationScalarWhereInput[];
    OR?: Prisma.LocationScalarWhereInput[];
    NOT?: Prisma.LocationScalarWhereInput | Prisma.LocationScalarWhereInput[];
    id?: Prisma.StringFilter<"Location"> | string;
    tenantId?: Prisma.StringFilter<"Location"> | string;
    name?: Prisma.StringFilter<"Location"> | string;
    addressLine1?: Prisma.StringFilter<"Location"> | string;
    addressLine2?: Prisma.StringNullableFilter<"Location"> | string | null;
    city?: Prisma.StringFilter<"Location"> | string;
    postalCode?: Prisma.StringNullableFilter<"Location"> | string | null;
    country?: Prisma.StringFilter<"Location"> | string;
    isActive?: Prisma.BoolFilter<"Location"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"Location"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Location"> | Date | string;
};
export type LocationCreateWithoutPickupReservationsInput = {
    id?: string;
    name: string;
    addressLine1: string;
    addressLine2?: string | null;
    city: string;
    postalCode?: string | null;
    country: string;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    tenant: Prisma.TenantCreateNestedOneWithoutLocationsInput;
    dropoffReservations?: Prisma.ReservationCreateNestedManyWithoutDropoffLocationInput;
};
export type LocationUncheckedCreateWithoutPickupReservationsInput = {
    id?: string;
    tenantId: string;
    name: string;
    addressLine1: string;
    addressLine2?: string | null;
    city: string;
    postalCode?: string | null;
    country: string;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    dropoffReservations?: Prisma.ReservationUncheckedCreateNestedManyWithoutDropoffLocationInput;
};
export type LocationCreateOrConnectWithoutPickupReservationsInput = {
    where: Prisma.LocationWhereUniqueInput;
    create: Prisma.XOR<Prisma.LocationCreateWithoutPickupReservationsInput, Prisma.LocationUncheckedCreateWithoutPickupReservationsInput>;
};
export type LocationCreateWithoutDropoffReservationsInput = {
    id?: string;
    name: string;
    addressLine1: string;
    addressLine2?: string | null;
    city: string;
    postalCode?: string | null;
    country: string;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    tenant: Prisma.TenantCreateNestedOneWithoutLocationsInput;
    pickupReservations?: Prisma.ReservationCreateNestedManyWithoutPickupLocationInput;
};
export type LocationUncheckedCreateWithoutDropoffReservationsInput = {
    id?: string;
    tenantId: string;
    name: string;
    addressLine1: string;
    addressLine2?: string | null;
    city: string;
    postalCode?: string | null;
    country: string;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    pickupReservations?: Prisma.ReservationUncheckedCreateNestedManyWithoutPickupLocationInput;
};
export type LocationCreateOrConnectWithoutDropoffReservationsInput = {
    where: Prisma.LocationWhereUniqueInput;
    create: Prisma.XOR<Prisma.LocationCreateWithoutDropoffReservationsInput, Prisma.LocationUncheckedCreateWithoutDropoffReservationsInput>;
};
export type LocationUpsertWithoutPickupReservationsInput = {
    update: Prisma.XOR<Prisma.LocationUpdateWithoutPickupReservationsInput, Prisma.LocationUncheckedUpdateWithoutPickupReservationsInput>;
    create: Prisma.XOR<Prisma.LocationCreateWithoutPickupReservationsInput, Prisma.LocationUncheckedCreateWithoutPickupReservationsInput>;
    where?: Prisma.LocationWhereInput;
};
export type LocationUpdateToOneWithWhereWithoutPickupReservationsInput = {
    where?: Prisma.LocationWhereInput;
    data: Prisma.XOR<Prisma.LocationUpdateWithoutPickupReservationsInput, Prisma.LocationUncheckedUpdateWithoutPickupReservationsInput>;
};
export type LocationUpdateWithoutPickupReservationsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    addressLine1?: Prisma.StringFieldUpdateOperationsInput | string;
    addressLine2?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    city?: Prisma.StringFieldUpdateOperationsInput | string;
    postalCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    country?: Prisma.StringFieldUpdateOperationsInput | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    tenant?: Prisma.TenantUpdateOneRequiredWithoutLocationsNestedInput;
    dropoffReservations?: Prisma.ReservationUpdateManyWithoutDropoffLocationNestedInput;
};
export type LocationUncheckedUpdateWithoutPickupReservationsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenantId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    addressLine1?: Prisma.StringFieldUpdateOperationsInput | string;
    addressLine2?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    city?: Prisma.StringFieldUpdateOperationsInput | string;
    postalCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    country?: Prisma.StringFieldUpdateOperationsInput | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    dropoffReservations?: Prisma.ReservationUncheckedUpdateManyWithoutDropoffLocationNestedInput;
};
export type LocationUpsertWithoutDropoffReservationsInput = {
    update: Prisma.XOR<Prisma.LocationUpdateWithoutDropoffReservationsInput, Prisma.LocationUncheckedUpdateWithoutDropoffReservationsInput>;
    create: Prisma.XOR<Prisma.LocationCreateWithoutDropoffReservationsInput, Prisma.LocationUncheckedCreateWithoutDropoffReservationsInput>;
    where?: Prisma.LocationWhereInput;
};
export type LocationUpdateToOneWithWhereWithoutDropoffReservationsInput = {
    where?: Prisma.LocationWhereInput;
    data: Prisma.XOR<Prisma.LocationUpdateWithoutDropoffReservationsInput, Prisma.LocationUncheckedUpdateWithoutDropoffReservationsInput>;
};
export type LocationUpdateWithoutDropoffReservationsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    addressLine1?: Prisma.StringFieldUpdateOperationsInput | string;
    addressLine2?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    city?: Prisma.StringFieldUpdateOperationsInput | string;
    postalCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    country?: Prisma.StringFieldUpdateOperationsInput | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    tenant?: Prisma.TenantUpdateOneRequiredWithoutLocationsNestedInput;
    pickupReservations?: Prisma.ReservationUpdateManyWithoutPickupLocationNestedInput;
};
export type LocationUncheckedUpdateWithoutDropoffReservationsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenantId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    addressLine1?: Prisma.StringFieldUpdateOperationsInput | string;
    addressLine2?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    city?: Prisma.StringFieldUpdateOperationsInput | string;
    postalCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    country?: Prisma.StringFieldUpdateOperationsInput | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    pickupReservations?: Prisma.ReservationUncheckedUpdateManyWithoutPickupLocationNestedInput;
};
export type LocationCreateManyTenantInput = {
    id?: string;
    name: string;
    addressLine1: string;
    addressLine2?: string | null;
    city: string;
    postalCode?: string | null;
    country: string;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type LocationUpdateWithoutTenantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    addressLine1?: Prisma.StringFieldUpdateOperationsInput | string;
    addressLine2?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    city?: Prisma.StringFieldUpdateOperationsInput | string;
    postalCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    country?: Prisma.StringFieldUpdateOperationsInput | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    pickupReservations?: Prisma.ReservationUpdateManyWithoutPickupLocationNestedInput;
    dropoffReservations?: Prisma.ReservationUpdateManyWithoutDropoffLocationNestedInput;
};
export type LocationUncheckedUpdateWithoutTenantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    addressLine1?: Prisma.StringFieldUpdateOperationsInput | string;
    addressLine2?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    city?: Prisma.StringFieldUpdateOperationsInput | string;
    postalCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    country?: Prisma.StringFieldUpdateOperationsInput | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    pickupReservations?: Prisma.ReservationUncheckedUpdateManyWithoutPickupLocationNestedInput;
    dropoffReservations?: Prisma.ReservationUncheckedUpdateManyWithoutDropoffLocationNestedInput;
};
export type LocationUncheckedUpdateManyWithoutTenantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    addressLine1?: Prisma.StringFieldUpdateOperationsInput | string;
    addressLine2?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    city?: Prisma.StringFieldUpdateOperationsInput | string;
    postalCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    country?: Prisma.StringFieldUpdateOperationsInput | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LocationCountOutputType = {
    pickupReservations: number;
    dropoffReservations: number;
};
export type LocationCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    pickupReservations?: boolean | LocationCountOutputTypeCountPickupReservationsArgs;
    dropoffReservations?: boolean | LocationCountOutputTypeCountDropoffReservationsArgs;
};
export type LocationCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LocationCountOutputTypeSelect<ExtArgs> | null;
};
export type LocationCountOutputTypeCountPickupReservationsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ReservationWhereInput;
};
export type LocationCountOutputTypeCountDropoffReservationsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ReservationWhereInput;
};
export type LocationSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tenantId?: boolean;
    name?: boolean;
    addressLine1?: boolean;
    addressLine2?: boolean;
    city?: boolean;
    postalCode?: boolean;
    country?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
    pickupReservations?: boolean | Prisma.Location$pickupReservationsArgs<ExtArgs>;
    dropoffReservations?: boolean | Prisma.Location$dropoffReservationsArgs<ExtArgs>;
    _count?: boolean | Prisma.LocationCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["location"]>;
export type LocationSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tenantId?: boolean;
    name?: boolean;
    addressLine1?: boolean;
    addressLine2?: boolean;
    city?: boolean;
    postalCode?: boolean;
    country?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["location"]>;
export type LocationSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tenantId?: boolean;
    name?: boolean;
    addressLine1?: boolean;
    addressLine2?: boolean;
    city?: boolean;
    postalCode?: boolean;
    country?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["location"]>;
export type LocationSelectScalar = {
    id?: boolean;
    tenantId?: boolean;
    name?: boolean;
    addressLine1?: boolean;
    addressLine2?: boolean;
    city?: boolean;
    postalCode?: boolean;
    country?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type LocationOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "tenantId" | "name" | "addressLine1" | "addressLine2" | "city" | "postalCode" | "country" | "isActive" | "createdAt" | "updatedAt", ExtArgs["result"]["location"]>;
export type LocationInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
    pickupReservations?: boolean | Prisma.Location$pickupReservationsArgs<ExtArgs>;
    dropoffReservations?: boolean | Prisma.Location$dropoffReservationsArgs<ExtArgs>;
    _count?: boolean | Prisma.LocationCountOutputTypeDefaultArgs<ExtArgs>;
};
export type LocationIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
};
export type LocationIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
};
export type $LocationPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Location";
    objects: {
        tenant: Prisma.$TenantPayload<ExtArgs>;
        pickupReservations: Prisma.$ReservationPayload<ExtArgs>[];
        dropoffReservations: Prisma.$ReservationPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        tenantId: string;
        name: string;
        addressLine1: string;
        addressLine2: string | null;
        city: string;
        postalCode: string | null;
        country: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["location"]>;
    composites: {};
};
export type LocationGetPayload<S extends boolean | null | undefined | LocationDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$LocationPayload, S>;
export type LocationCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<LocationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: LocationCountAggregateInputType | true;
};
export interface LocationDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Location'];
        meta: {
            name: 'Location';
        };
    };
    findUnique<T extends LocationFindUniqueArgs>(args: Prisma.SelectSubset<T, LocationFindUniqueArgs<ExtArgs>>): Prisma.Prisma__LocationClient<runtime.Types.Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends LocationFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, LocationFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__LocationClient<runtime.Types.Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends LocationFindFirstArgs>(args?: Prisma.SelectSubset<T, LocationFindFirstArgs<ExtArgs>>): Prisma.Prisma__LocationClient<runtime.Types.Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends LocationFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, LocationFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__LocationClient<runtime.Types.Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends LocationFindManyArgs>(args?: Prisma.SelectSubset<T, LocationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends LocationCreateArgs>(args: Prisma.SelectSubset<T, LocationCreateArgs<ExtArgs>>): Prisma.Prisma__LocationClient<runtime.Types.Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends LocationCreateManyArgs>(args?: Prisma.SelectSubset<T, LocationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends LocationCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, LocationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends LocationDeleteArgs>(args: Prisma.SelectSubset<T, LocationDeleteArgs<ExtArgs>>): Prisma.Prisma__LocationClient<runtime.Types.Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends LocationUpdateArgs>(args: Prisma.SelectSubset<T, LocationUpdateArgs<ExtArgs>>): Prisma.Prisma__LocationClient<runtime.Types.Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends LocationDeleteManyArgs>(args?: Prisma.SelectSubset<T, LocationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends LocationUpdateManyArgs>(args: Prisma.SelectSubset<T, LocationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends LocationUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, LocationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends LocationUpsertArgs>(args: Prisma.SelectSubset<T, LocationUpsertArgs<ExtArgs>>): Prisma.Prisma__LocationClient<runtime.Types.Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends LocationCountArgs>(args?: Prisma.Subset<T, LocationCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], LocationCountAggregateOutputType> : number>;
    aggregate<T extends LocationAggregateArgs>(args: Prisma.Subset<T, LocationAggregateArgs>): Prisma.PrismaPromise<GetLocationAggregateType<T>>;
    groupBy<T extends LocationGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: LocationGroupByArgs['orderBy'];
    } : {
        orderBy?: LocationGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, LocationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLocationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: LocationFieldRefs;
}
export interface Prisma__LocationClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    tenant<T extends Prisma.TenantDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.TenantDefaultArgs<ExtArgs>>): Prisma.Prisma__TenantClient<runtime.Types.Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    pickupReservations<T extends Prisma.Location$pickupReservationsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Location$pickupReservationsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    dropoffReservations<T extends Prisma.Location$dropoffReservationsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Location$dropoffReservationsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface LocationFieldRefs {
    readonly id: Prisma.FieldRef<"Location", 'String'>;
    readonly tenantId: Prisma.FieldRef<"Location", 'String'>;
    readonly name: Prisma.FieldRef<"Location", 'String'>;
    readonly addressLine1: Prisma.FieldRef<"Location", 'String'>;
    readonly addressLine2: Prisma.FieldRef<"Location", 'String'>;
    readonly city: Prisma.FieldRef<"Location", 'String'>;
    readonly postalCode: Prisma.FieldRef<"Location", 'String'>;
    readonly country: Prisma.FieldRef<"Location", 'String'>;
    readonly isActive: Prisma.FieldRef<"Location", 'Boolean'>;
    readonly createdAt: Prisma.FieldRef<"Location", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Location", 'DateTime'>;
}
export type LocationFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LocationSelect<ExtArgs> | null;
    omit?: Prisma.LocationOmit<ExtArgs> | null;
    include?: Prisma.LocationInclude<ExtArgs> | null;
    where: Prisma.LocationWhereUniqueInput;
};
export type LocationFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LocationSelect<ExtArgs> | null;
    omit?: Prisma.LocationOmit<ExtArgs> | null;
    include?: Prisma.LocationInclude<ExtArgs> | null;
    where: Prisma.LocationWhereUniqueInput;
};
export type LocationFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LocationSelect<ExtArgs> | null;
    omit?: Prisma.LocationOmit<ExtArgs> | null;
    include?: Prisma.LocationInclude<ExtArgs> | null;
    where?: Prisma.LocationWhereInput;
    orderBy?: Prisma.LocationOrderByWithRelationInput | Prisma.LocationOrderByWithRelationInput[];
    cursor?: Prisma.LocationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.LocationScalarFieldEnum | Prisma.LocationScalarFieldEnum[];
};
export type LocationFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LocationSelect<ExtArgs> | null;
    omit?: Prisma.LocationOmit<ExtArgs> | null;
    include?: Prisma.LocationInclude<ExtArgs> | null;
    where?: Prisma.LocationWhereInput;
    orderBy?: Prisma.LocationOrderByWithRelationInput | Prisma.LocationOrderByWithRelationInput[];
    cursor?: Prisma.LocationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.LocationScalarFieldEnum | Prisma.LocationScalarFieldEnum[];
};
export type LocationFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LocationSelect<ExtArgs> | null;
    omit?: Prisma.LocationOmit<ExtArgs> | null;
    include?: Prisma.LocationInclude<ExtArgs> | null;
    where?: Prisma.LocationWhereInput;
    orderBy?: Prisma.LocationOrderByWithRelationInput | Prisma.LocationOrderByWithRelationInput[];
    cursor?: Prisma.LocationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.LocationScalarFieldEnum | Prisma.LocationScalarFieldEnum[];
};
export type LocationCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LocationSelect<ExtArgs> | null;
    omit?: Prisma.LocationOmit<ExtArgs> | null;
    include?: Prisma.LocationInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.LocationCreateInput, Prisma.LocationUncheckedCreateInput>;
};
export type LocationCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.LocationCreateManyInput | Prisma.LocationCreateManyInput[];
    skipDuplicates?: boolean;
};
export type LocationCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LocationSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.LocationOmit<ExtArgs> | null;
    data: Prisma.LocationCreateManyInput | Prisma.LocationCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.LocationIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type LocationUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LocationSelect<ExtArgs> | null;
    omit?: Prisma.LocationOmit<ExtArgs> | null;
    include?: Prisma.LocationInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.LocationUpdateInput, Prisma.LocationUncheckedUpdateInput>;
    where: Prisma.LocationWhereUniqueInput;
};
export type LocationUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.LocationUpdateManyMutationInput, Prisma.LocationUncheckedUpdateManyInput>;
    where?: Prisma.LocationWhereInput;
    limit?: number;
};
export type LocationUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LocationSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.LocationOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.LocationUpdateManyMutationInput, Prisma.LocationUncheckedUpdateManyInput>;
    where?: Prisma.LocationWhereInput;
    limit?: number;
    include?: Prisma.LocationIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type LocationUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LocationSelect<ExtArgs> | null;
    omit?: Prisma.LocationOmit<ExtArgs> | null;
    include?: Prisma.LocationInclude<ExtArgs> | null;
    where: Prisma.LocationWhereUniqueInput;
    create: Prisma.XOR<Prisma.LocationCreateInput, Prisma.LocationUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.LocationUpdateInput, Prisma.LocationUncheckedUpdateInput>;
};
export type LocationDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LocationSelect<ExtArgs> | null;
    omit?: Prisma.LocationOmit<ExtArgs> | null;
    include?: Prisma.LocationInclude<ExtArgs> | null;
    where: Prisma.LocationWhereUniqueInput;
};
export type LocationDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LocationWhereInput;
    limit?: number;
};
export type Location$pickupReservationsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReservationSelect<ExtArgs> | null;
    omit?: Prisma.ReservationOmit<ExtArgs> | null;
    include?: Prisma.ReservationInclude<ExtArgs> | null;
    where?: Prisma.ReservationWhereInput;
    orderBy?: Prisma.ReservationOrderByWithRelationInput | Prisma.ReservationOrderByWithRelationInput[];
    cursor?: Prisma.ReservationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ReservationScalarFieldEnum | Prisma.ReservationScalarFieldEnum[];
};
export type Location$dropoffReservationsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReservationSelect<ExtArgs> | null;
    omit?: Prisma.ReservationOmit<ExtArgs> | null;
    include?: Prisma.ReservationInclude<ExtArgs> | null;
    where?: Prisma.ReservationWhereInput;
    orderBy?: Prisma.ReservationOrderByWithRelationInput | Prisma.ReservationOrderByWithRelationInput[];
    cursor?: Prisma.ReservationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ReservationScalarFieldEnum | Prisma.ReservationScalarFieldEnum[];
};
export type LocationDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LocationSelect<ExtArgs> | null;
    omit?: Prisma.LocationOmit<ExtArgs> | null;
    include?: Prisma.LocationInclude<ExtArgs> | null;
};
export {};
