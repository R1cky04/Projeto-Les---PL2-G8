import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type ReservationModel = runtime.Types.Result.DefaultSelection<Prisma.$ReservationPayload>;
export type AggregateReservation = {
    _count: ReservationCountAggregateOutputType | null;
    _avg: ReservationAvgAggregateOutputType | null;
    _sum: ReservationSumAggregateOutputType | null;
    _min: ReservationMinAggregateOutputType | null;
    _max: ReservationMaxAggregateOutputType | null;
};
export type ReservationAvgAggregateOutputType = {
    quotedTotal: runtime.Decimal | null;
};
export type ReservationSumAggregateOutputType = {
    quotedTotal: runtime.Decimal | null;
};
export type ReservationMinAggregateOutputType = {
    id: string | null;
    tenantId: string | null;
    customerProfileId: string | null;
    vehicleId: string | null;
    pickupLocationId: string | null;
    dropoffLocationId: string | null;
    pickupAt: Date | null;
    dropoffAt: Date | null;
    status: $Enums.ReservationStatus | null;
    quotedTotal: runtime.Decimal | null;
    notes: string | null;
    createdById: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type ReservationMaxAggregateOutputType = {
    id: string | null;
    tenantId: string | null;
    customerProfileId: string | null;
    vehicleId: string | null;
    pickupLocationId: string | null;
    dropoffLocationId: string | null;
    pickupAt: Date | null;
    dropoffAt: Date | null;
    status: $Enums.ReservationStatus | null;
    quotedTotal: runtime.Decimal | null;
    notes: string | null;
    createdById: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type ReservationCountAggregateOutputType = {
    id: number;
    tenantId: number;
    customerProfileId: number;
    vehicleId: number;
    pickupLocationId: number;
    dropoffLocationId: number;
    pickupAt: number;
    dropoffAt: number;
    status: number;
    quotedTotal: number;
    notes: number;
    createdById: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type ReservationAvgAggregateInputType = {
    quotedTotal?: true;
};
export type ReservationSumAggregateInputType = {
    quotedTotal?: true;
};
export type ReservationMinAggregateInputType = {
    id?: true;
    tenantId?: true;
    customerProfileId?: true;
    vehicleId?: true;
    pickupLocationId?: true;
    dropoffLocationId?: true;
    pickupAt?: true;
    dropoffAt?: true;
    status?: true;
    quotedTotal?: true;
    notes?: true;
    createdById?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type ReservationMaxAggregateInputType = {
    id?: true;
    tenantId?: true;
    customerProfileId?: true;
    vehicleId?: true;
    pickupLocationId?: true;
    dropoffLocationId?: true;
    pickupAt?: true;
    dropoffAt?: true;
    status?: true;
    quotedTotal?: true;
    notes?: true;
    createdById?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type ReservationCountAggregateInputType = {
    id?: true;
    tenantId?: true;
    customerProfileId?: true;
    vehicleId?: true;
    pickupLocationId?: true;
    dropoffLocationId?: true;
    pickupAt?: true;
    dropoffAt?: true;
    status?: true;
    quotedTotal?: true;
    notes?: true;
    createdById?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type ReservationAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ReservationWhereInput;
    orderBy?: Prisma.ReservationOrderByWithRelationInput | Prisma.ReservationOrderByWithRelationInput[];
    cursor?: Prisma.ReservationWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ReservationCountAggregateInputType;
    _avg?: ReservationAvgAggregateInputType;
    _sum?: ReservationSumAggregateInputType;
    _min?: ReservationMinAggregateInputType;
    _max?: ReservationMaxAggregateInputType;
};
export type GetReservationAggregateType<T extends ReservationAggregateArgs> = {
    [P in keyof T & keyof AggregateReservation]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateReservation[P]> : Prisma.GetScalarType<T[P], AggregateReservation[P]>;
};
export type ReservationGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ReservationWhereInput;
    orderBy?: Prisma.ReservationOrderByWithAggregationInput | Prisma.ReservationOrderByWithAggregationInput[];
    by: Prisma.ReservationScalarFieldEnum[] | Prisma.ReservationScalarFieldEnum;
    having?: Prisma.ReservationScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ReservationCountAggregateInputType | true;
    _avg?: ReservationAvgAggregateInputType;
    _sum?: ReservationSumAggregateInputType;
    _min?: ReservationMinAggregateInputType;
    _max?: ReservationMaxAggregateInputType;
};
export type ReservationGroupByOutputType = {
    id: string;
    tenantId: string;
    customerProfileId: string;
    vehicleId: string | null;
    pickupLocationId: string;
    dropoffLocationId: string;
    pickupAt: Date;
    dropoffAt: Date;
    status: $Enums.ReservationStatus;
    quotedTotal: runtime.Decimal | null;
    notes: string | null;
    createdById: string | null;
    createdAt: Date;
    updatedAt: Date;
    _count: ReservationCountAggregateOutputType | null;
    _avg: ReservationAvgAggregateOutputType | null;
    _sum: ReservationSumAggregateOutputType | null;
    _min: ReservationMinAggregateOutputType | null;
    _max: ReservationMaxAggregateOutputType | null;
};
type GetReservationGroupByPayload<T extends ReservationGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ReservationGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ReservationGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ReservationGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ReservationGroupByOutputType[P]>;
}>>;
export type ReservationWhereInput = {
    AND?: Prisma.ReservationWhereInput | Prisma.ReservationWhereInput[];
    OR?: Prisma.ReservationWhereInput[];
    NOT?: Prisma.ReservationWhereInput | Prisma.ReservationWhereInput[];
    id?: Prisma.StringFilter<"Reservation"> | string;
    tenantId?: Prisma.StringFilter<"Reservation"> | string;
    customerProfileId?: Prisma.StringFilter<"Reservation"> | string;
    vehicleId?: Prisma.StringNullableFilter<"Reservation"> | string | null;
    pickupLocationId?: Prisma.StringFilter<"Reservation"> | string;
    dropoffLocationId?: Prisma.StringFilter<"Reservation"> | string;
    pickupAt?: Prisma.DateTimeFilter<"Reservation"> | Date | string;
    dropoffAt?: Prisma.DateTimeFilter<"Reservation"> | Date | string;
    status?: Prisma.EnumReservationStatusFilter<"Reservation"> | $Enums.ReservationStatus;
    quotedTotal?: Prisma.DecimalNullableFilter<"Reservation"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    notes?: Prisma.StringNullableFilter<"Reservation"> | string | null;
    createdById?: Prisma.StringNullableFilter<"Reservation"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Reservation"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Reservation"> | Date | string;
    tenant?: Prisma.XOR<Prisma.TenantScalarRelationFilter, Prisma.TenantWhereInput>;
    customerProfile?: Prisma.XOR<Prisma.CustomerProfileScalarRelationFilter, Prisma.CustomerProfileWhereInput>;
    vehicle?: Prisma.XOR<Prisma.VehicleNullableScalarRelationFilter, Prisma.VehicleWhereInput> | null;
    pickupLocation?: Prisma.XOR<Prisma.LocationScalarRelationFilter, Prisma.LocationWhereInput>;
    dropoffLocation?: Prisma.XOR<Prisma.LocationScalarRelationFilter, Prisma.LocationWhereInput>;
    createdBy?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
    rental?: Prisma.XOR<Prisma.RentalNullableScalarRelationFilter, Prisma.RentalWhereInput> | null;
};
export type ReservationOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    customerProfileId?: Prisma.SortOrder;
    vehicleId?: Prisma.SortOrderInput | Prisma.SortOrder;
    pickupLocationId?: Prisma.SortOrder;
    dropoffLocationId?: Prisma.SortOrder;
    pickupAt?: Prisma.SortOrder;
    dropoffAt?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    quotedTotal?: Prisma.SortOrderInput | Prisma.SortOrder;
    notes?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdById?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    tenant?: Prisma.TenantOrderByWithRelationInput;
    customerProfile?: Prisma.CustomerProfileOrderByWithRelationInput;
    vehicle?: Prisma.VehicleOrderByWithRelationInput;
    pickupLocation?: Prisma.LocationOrderByWithRelationInput;
    dropoffLocation?: Prisma.LocationOrderByWithRelationInput;
    createdBy?: Prisma.UserOrderByWithRelationInput;
    rental?: Prisma.RentalOrderByWithRelationInput;
};
export type ReservationWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.ReservationWhereInput | Prisma.ReservationWhereInput[];
    OR?: Prisma.ReservationWhereInput[];
    NOT?: Prisma.ReservationWhereInput | Prisma.ReservationWhereInput[];
    tenantId?: Prisma.StringFilter<"Reservation"> | string;
    customerProfileId?: Prisma.StringFilter<"Reservation"> | string;
    vehicleId?: Prisma.StringNullableFilter<"Reservation"> | string | null;
    pickupLocationId?: Prisma.StringFilter<"Reservation"> | string;
    dropoffLocationId?: Prisma.StringFilter<"Reservation"> | string;
    pickupAt?: Prisma.DateTimeFilter<"Reservation"> | Date | string;
    dropoffAt?: Prisma.DateTimeFilter<"Reservation"> | Date | string;
    status?: Prisma.EnumReservationStatusFilter<"Reservation"> | $Enums.ReservationStatus;
    quotedTotal?: Prisma.DecimalNullableFilter<"Reservation"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    notes?: Prisma.StringNullableFilter<"Reservation"> | string | null;
    createdById?: Prisma.StringNullableFilter<"Reservation"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Reservation"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Reservation"> | Date | string;
    tenant?: Prisma.XOR<Prisma.TenantScalarRelationFilter, Prisma.TenantWhereInput>;
    customerProfile?: Prisma.XOR<Prisma.CustomerProfileScalarRelationFilter, Prisma.CustomerProfileWhereInput>;
    vehicle?: Prisma.XOR<Prisma.VehicleNullableScalarRelationFilter, Prisma.VehicleWhereInput> | null;
    pickupLocation?: Prisma.XOR<Prisma.LocationScalarRelationFilter, Prisma.LocationWhereInput>;
    dropoffLocation?: Prisma.XOR<Prisma.LocationScalarRelationFilter, Prisma.LocationWhereInput>;
    createdBy?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
    rental?: Prisma.XOR<Prisma.RentalNullableScalarRelationFilter, Prisma.RentalWhereInput> | null;
}, "id">;
export type ReservationOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    customerProfileId?: Prisma.SortOrder;
    vehicleId?: Prisma.SortOrderInput | Prisma.SortOrder;
    pickupLocationId?: Prisma.SortOrder;
    dropoffLocationId?: Prisma.SortOrder;
    pickupAt?: Prisma.SortOrder;
    dropoffAt?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    quotedTotal?: Prisma.SortOrderInput | Prisma.SortOrder;
    notes?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdById?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.ReservationCountOrderByAggregateInput;
    _avg?: Prisma.ReservationAvgOrderByAggregateInput;
    _max?: Prisma.ReservationMaxOrderByAggregateInput;
    _min?: Prisma.ReservationMinOrderByAggregateInput;
    _sum?: Prisma.ReservationSumOrderByAggregateInput;
};
export type ReservationScalarWhereWithAggregatesInput = {
    AND?: Prisma.ReservationScalarWhereWithAggregatesInput | Prisma.ReservationScalarWhereWithAggregatesInput[];
    OR?: Prisma.ReservationScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ReservationScalarWhereWithAggregatesInput | Prisma.ReservationScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Reservation"> | string;
    tenantId?: Prisma.StringWithAggregatesFilter<"Reservation"> | string;
    customerProfileId?: Prisma.StringWithAggregatesFilter<"Reservation"> | string;
    vehicleId?: Prisma.StringNullableWithAggregatesFilter<"Reservation"> | string | null;
    pickupLocationId?: Prisma.StringWithAggregatesFilter<"Reservation"> | string;
    dropoffLocationId?: Prisma.StringWithAggregatesFilter<"Reservation"> | string;
    pickupAt?: Prisma.DateTimeWithAggregatesFilter<"Reservation"> | Date | string;
    dropoffAt?: Prisma.DateTimeWithAggregatesFilter<"Reservation"> | Date | string;
    status?: Prisma.EnumReservationStatusWithAggregatesFilter<"Reservation"> | $Enums.ReservationStatus;
    quotedTotal?: Prisma.DecimalNullableWithAggregatesFilter<"Reservation"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    notes?: Prisma.StringNullableWithAggregatesFilter<"Reservation"> | string | null;
    createdById?: Prisma.StringNullableWithAggregatesFilter<"Reservation"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Reservation"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Reservation"> | Date | string;
};
export type ReservationCreateInput = {
    id?: string;
    pickupAt: Date | string;
    dropoffAt: Date | string;
    status?: $Enums.ReservationStatus;
    quotedTotal?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    tenant: Prisma.TenantCreateNestedOneWithoutReservationsInput;
    customerProfile: Prisma.CustomerProfileCreateNestedOneWithoutReservationsInput;
    vehicle?: Prisma.VehicleCreateNestedOneWithoutReservationsInput;
    pickupLocation: Prisma.LocationCreateNestedOneWithoutPickupReservationsInput;
    dropoffLocation: Prisma.LocationCreateNestedOneWithoutDropoffReservationsInput;
    createdBy?: Prisma.UserCreateNestedOneWithoutCreatedReservationsInput;
    rental?: Prisma.RentalCreateNestedOneWithoutReservationInput;
};
export type ReservationUncheckedCreateInput = {
    id?: string;
    tenantId: string;
    customerProfileId: string;
    vehicleId?: string | null;
    pickupLocationId: string;
    dropoffLocationId: string;
    pickupAt: Date | string;
    dropoffAt: Date | string;
    status?: $Enums.ReservationStatus;
    quotedTotal?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    notes?: string | null;
    createdById?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    rental?: Prisma.RentalUncheckedCreateNestedOneWithoutReservationInput;
};
export type ReservationUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    pickupAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    dropoffAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.EnumReservationStatusFieldUpdateOperationsInput | $Enums.ReservationStatus;
    quotedTotal?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    tenant?: Prisma.TenantUpdateOneRequiredWithoutReservationsNestedInput;
    customerProfile?: Prisma.CustomerProfileUpdateOneRequiredWithoutReservationsNestedInput;
    vehicle?: Prisma.VehicleUpdateOneWithoutReservationsNestedInput;
    pickupLocation?: Prisma.LocationUpdateOneRequiredWithoutPickupReservationsNestedInput;
    dropoffLocation?: Prisma.LocationUpdateOneRequiredWithoutDropoffReservationsNestedInput;
    createdBy?: Prisma.UserUpdateOneWithoutCreatedReservationsNestedInput;
    rental?: Prisma.RentalUpdateOneWithoutReservationNestedInput;
};
export type ReservationUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenantId?: Prisma.StringFieldUpdateOperationsInput | string;
    customerProfileId?: Prisma.StringFieldUpdateOperationsInput | string;
    vehicleId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    pickupLocationId?: Prisma.StringFieldUpdateOperationsInput | string;
    dropoffLocationId?: Prisma.StringFieldUpdateOperationsInput | string;
    pickupAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    dropoffAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.EnumReservationStatusFieldUpdateOperationsInput | $Enums.ReservationStatus;
    quotedTotal?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    rental?: Prisma.RentalUncheckedUpdateOneWithoutReservationNestedInput;
};
export type ReservationCreateManyInput = {
    id?: string;
    tenantId: string;
    customerProfileId: string;
    vehicleId?: string | null;
    pickupLocationId: string;
    dropoffLocationId: string;
    pickupAt: Date | string;
    dropoffAt: Date | string;
    status?: $Enums.ReservationStatus;
    quotedTotal?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    notes?: string | null;
    createdById?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ReservationUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    pickupAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    dropoffAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.EnumReservationStatusFieldUpdateOperationsInput | $Enums.ReservationStatus;
    quotedTotal?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ReservationUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenantId?: Prisma.StringFieldUpdateOperationsInput | string;
    customerProfileId?: Prisma.StringFieldUpdateOperationsInput | string;
    vehicleId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    pickupLocationId?: Prisma.StringFieldUpdateOperationsInput | string;
    dropoffLocationId?: Prisma.StringFieldUpdateOperationsInput | string;
    pickupAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    dropoffAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.EnumReservationStatusFieldUpdateOperationsInput | $Enums.ReservationStatus;
    quotedTotal?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ReservationListRelationFilter = {
    every?: Prisma.ReservationWhereInput;
    some?: Prisma.ReservationWhereInput;
    none?: Prisma.ReservationWhereInput;
};
export type ReservationOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type ReservationCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    customerProfileId?: Prisma.SortOrder;
    vehicleId?: Prisma.SortOrder;
    pickupLocationId?: Prisma.SortOrder;
    dropoffLocationId?: Prisma.SortOrder;
    pickupAt?: Prisma.SortOrder;
    dropoffAt?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    quotedTotal?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    createdById?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ReservationAvgOrderByAggregateInput = {
    quotedTotal?: Prisma.SortOrder;
};
export type ReservationMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    customerProfileId?: Prisma.SortOrder;
    vehicleId?: Prisma.SortOrder;
    pickupLocationId?: Prisma.SortOrder;
    dropoffLocationId?: Prisma.SortOrder;
    pickupAt?: Prisma.SortOrder;
    dropoffAt?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    quotedTotal?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    createdById?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ReservationMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    customerProfileId?: Prisma.SortOrder;
    vehicleId?: Prisma.SortOrder;
    pickupLocationId?: Prisma.SortOrder;
    dropoffLocationId?: Prisma.SortOrder;
    pickupAt?: Prisma.SortOrder;
    dropoffAt?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    quotedTotal?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    createdById?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ReservationSumOrderByAggregateInput = {
    quotedTotal?: Prisma.SortOrder;
};
export type ReservationNullableScalarRelationFilter = {
    is?: Prisma.ReservationWhereInput | null;
    isNot?: Prisma.ReservationWhereInput | null;
};
export type ReservationCreateNestedManyWithoutTenantInput = {
    create?: Prisma.XOR<Prisma.ReservationCreateWithoutTenantInput, Prisma.ReservationUncheckedCreateWithoutTenantInput> | Prisma.ReservationCreateWithoutTenantInput[] | Prisma.ReservationUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.ReservationCreateOrConnectWithoutTenantInput | Prisma.ReservationCreateOrConnectWithoutTenantInput[];
    createMany?: Prisma.ReservationCreateManyTenantInputEnvelope;
    connect?: Prisma.ReservationWhereUniqueInput | Prisma.ReservationWhereUniqueInput[];
};
export type ReservationUncheckedCreateNestedManyWithoutTenantInput = {
    create?: Prisma.XOR<Prisma.ReservationCreateWithoutTenantInput, Prisma.ReservationUncheckedCreateWithoutTenantInput> | Prisma.ReservationCreateWithoutTenantInput[] | Prisma.ReservationUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.ReservationCreateOrConnectWithoutTenantInput | Prisma.ReservationCreateOrConnectWithoutTenantInput[];
    createMany?: Prisma.ReservationCreateManyTenantInputEnvelope;
    connect?: Prisma.ReservationWhereUniqueInput | Prisma.ReservationWhereUniqueInput[];
};
export type ReservationUpdateManyWithoutTenantNestedInput = {
    create?: Prisma.XOR<Prisma.ReservationCreateWithoutTenantInput, Prisma.ReservationUncheckedCreateWithoutTenantInput> | Prisma.ReservationCreateWithoutTenantInput[] | Prisma.ReservationUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.ReservationCreateOrConnectWithoutTenantInput | Prisma.ReservationCreateOrConnectWithoutTenantInput[];
    upsert?: Prisma.ReservationUpsertWithWhereUniqueWithoutTenantInput | Prisma.ReservationUpsertWithWhereUniqueWithoutTenantInput[];
    createMany?: Prisma.ReservationCreateManyTenantInputEnvelope;
    set?: Prisma.ReservationWhereUniqueInput | Prisma.ReservationWhereUniqueInput[];
    disconnect?: Prisma.ReservationWhereUniqueInput | Prisma.ReservationWhereUniqueInput[];
    delete?: Prisma.ReservationWhereUniqueInput | Prisma.ReservationWhereUniqueInput[];
    connect?: Prisma.ReservationWhereUniqueInput | Prisma.ReservationWhereUniqueInput[];
    update?: Prisma.ReservationUpdateWithWhereUniqueWithoutTenantInput | Prisma.ReservationUpdateWithWhereUniqueWithoutTenantInput[];
    updateMany?: Prisma.ReservationUpdateManyWithWhereWithoutTenantInput | Prisma.ReservationUpdateManyWithWhereWithoutTenantInput[];
    deleteMany?: Prisma.ReservationScalarWhereInput | Prisma.ReservationScalarWhereInput[];
};
export type ReservationUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: Prisma.XOR<Prisma.ReservationCreateWithoutTenantInput, Prisma.ReservationUncheckedCreateWithoutTenantInput> | Prisma.ReservationCreateWithoutTenantInput[] | Prisma.ReservationUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.ReservationCreateOrConnectWithoutTenantInput | Prisma.ReservationCreateOrConnectWithoutTenantInput[];
    upsert?: Prisma.ReservationUpsertWithWhereUniqueWithoutTenantInput | Prisma.ReservationUpsertWithWhereUniqueWithoutTenantInput[];
    createMany?: Prisma.ReservationCreateManyTenantInputEnvelope;
    set?: Prisma.ReservationWhereUniqueInput | Prisma.ReservationWhereUniqueInput[];
    disconnect?: Prisma.ReservationWhereUniqueInput | Prisma.ReservationWhereUniqueInput[];
    delete?: Prisma.ReservationWhereUniqueInput | Prisma.ReservationWhereUniqueInput[];
    connect?: Prisma.ReservationWhereUniqueInput | Prisma.ReservationWhereUniqueInput[];
    update?: Prisma.ReservationUpdateWithWhereUniqueWithoutTenantInput | Prisma.ReservationUpdateWithWhereUniqueWithoutTenantInput[];
    updateMany?: Prisma.ReservationUpdateManyWithWhereWithoutTenantInput | Prisma.ReservationUpdateManyWithWhereWithoutTenantInput[];
    deleteMany?: Prisma.ReservationScalarWhereInput | Prisma.ReservationScalarWhereInput[];
};
export type ReservationCreateNestedManyWithoutCreatedByInput = {
    create?: Prisma.XOR<Prisma.ReservationCreateWithoutCreatedByInput, Prisma.ReservationUncheckedCreateWithoutCreatedByInput> | Prisma.ReservationCreateWithoutCreatedByInput[] | Prisma.ReservationUncheckedCreateWithoutCreatedByInput[];
    connectOrCreate?: Prisma.ReservationCreateOrConnectWithoutCreatedByInput | Prisma.ReservationCreateOrConnectWithoutCreatedByInput[];
    createMany?: Prisma.ReservationCreateManyCreatedByInputEnvelope;
    connect?: Prisma.ReservationWhereUniqueInput | Prisma.ReservationWhereUniqueInput[];
};
export type ReservationUncheckedCreateNestedManyWithoutCreatedByInput = {
    create?: Prisma.XOR<Prisma.ReservationCreateWithoutCreatedByInput, Prisma.ReservationUncheckedCreateWithoutCreatedByInput> | Prisma.ReservationCreateWithoutCreatedByInput[] | Prisma.ReservationUncheckedCreateWithoutCreatedByInput[];
    connectOrCreate?: Prisma.ReservationCreateOrConnectWithoutCreatedByInput | Prisma.ReservationCreateOrConnectWithoutCreatedByInput[];
    createMany?: Prisma.ReservationCreateManyCreatedByInputEnvelope;
    connect?: Prisma.ReservationWhereUniqueInput | Prisma.ReservationWhereUniqueInput[];
};
export type ReservationUpdateManyWithoutCreatedByNestedInput = {
    create?: Prisma.XOR<Prisma.ReservationCreateWithoutCreatedByInput, Prisma.ReservationUncheckedCreateWithoutCreatedByInput> | Prisma.ReservationCreateWithoutCreatedByInput[] | Prisma.ReservationUncheckedCreateWithoutCreatedByInput[];
    connectOrCreate?: Prisma.ReservationCreateOrConnectWithoutCreatedByInput | Prisma.ReservationCreateOrConnectWithoutCreatedByInput[];
    upsert?: Prisma.ReservationUpsertWithWhereUniqueWithoutCreatedByInput | Prisma.ReservationUpsertWithWhereUniqueWithoutCreatedByInput[];
    createMany?: Prisma.ReservationCreateManyCreatedByInputEnvelope;
    set?: Prisma.ReservationWhereUniqueInput | Prisma.ReservationWhereUniqueInput[];
    disconnect?: Prisma.ReservationWhereUniqueInput | Prisma.ReservationWhereUniqueInput[];
    delete?: Prisma.ReservationWhereUniqueInput | Prisma.ReservationWhereUniqueInput[];
    connect?: Prisma.ReservationWhereUniqueInput | Prisma.ReservationWhereUniqueInput[];
    update?: Prisma.ReservationUpdateWithWhereUniqueWithoutCreatedByInput | Prisma.ReservationUpdateWithWhereUniqueWithoutCreatedByInput[];
    updateMany?: Prisma.ReservationUpdateManyWithWhereWithoutCreatedByInput | Prisma.ReservationUpdateManyWithWhereWithoutCreatedByInput[];
    deleteMany?: Prisma.ReservationScalarWhereInput | Prisma.ReservationScalarWhereInput[];
};
export type ReservationUncheckedUpdateManyWithoutCreatedByNestedInput = {
    create?: Prisma.XOR<Prisma.ReservationCreateWithoutCreatedByInput, Prisma.ReservationUncheckedCreateWithoutCreatedByInput> | Prisma.ReservationCreateWithoutCreatedByInput[] | Prisma.ReservationUncheckedCreateWithoutCreatedByInput[];
    connectOrCreate?: Prisma.ReservationCreateOrConnectWithoutCreatedByInput | Prisma.ReservationCreateOrConnectWithoutCreatedByInput[];
    upsert?: Prisma.ReservationUpsertWithWhereUniqueWithoutCreatedByInput | Prisma.ReservationUpsertWithWhereUniqueWithoutCreatedByInput[];
    createMany?: Prisma.ReservationCreateManyCreatedByInputEnvelope;
    set?: Prisma.ReservationWhereUniqueInput | Prisma.ReservationWhereUniqueInput[];
    disconnect?: Prisma.ReservationWhereUniqueInput | Prisma.ReservationWhereUniqueInput[];
    delete?: Prisma.ReservationWhereUniqueInput | Prisma.ReservationWhereUniqueInput[];
    connect?: Prisma.ReservationWhereUniqueInput | Prisma.ReservationWhereUniqueInput[];
    update?: Prisma.ReservationUpdateWithWhereUniqueWithoutCreatedByInput | Prisma.ReservationUpdateWithWhereUniqueWithoutCreatedByInput[];
    updateMany?: Prisma.ReservationUpdateManyWithWhereWithoutCreatedByInput | Prisma.ReservationUpdateManyWithWhereWithoutCreatedByInput[];
    deleteMany?: Prisma.ReservationScalarWhereInput | Prisma.ReservationScalarWhereInput[];
};
export type ReservationCreateNestedManyWithoutCustomerProfileInput = {
    create?: Prisma.XOR<Prisma.ReservationCreateWithoutCustomerProfileInput, Prisma.ReservationUncheckedCreateWithoutCustomerProfileInput> | Prisma.ReservationCreateWithoutCustomerProfileInput[] | Prisma.ReservationUncheckedCreateWithoutCustomerProfileInput[];
    connectOrCreate?: Prisma.ReservationCreateOrConnectWithoutCustomerProfileInput | Prisma.ReservationCreateOrConnectWithoutCustomerProfileInput[];
    createMany?: Prisma.ReservationCreateManyCustomerProfileInputEnvelope;
    connect?: Prisma.ReservationWhereUniqueInput | Prisma.ReservationWhereUniqueInput[];
};
export type ReservationUncheckedCreateNestedManyWithoutCustomerProfileInput = {
    create?: Prisma.XOR<Prisma.ReservationCreateWithoutCustomerProfileInput, Prisma.ReservationUncheckedCreateWithoutCustomerProfileInput> | Prisma.ReservationCreateWithoutCustomerProfileInput[] | Prisma.ReservationUncheckedCreateWithoutCustomerProfileInput[];
    connectOrCreate?: Prisma.ReservationCreateOrConnectWithoutCustomerProfileInput | Prisma.ReservationCreateOrConnectWithoutCustomerProfileInput[];
    createMany?: Prisma.ReservationCreateManyCustomerProfileInputEnvelope;
    connect?: Prisma.ReservationWhereUniqueInput | Prisma.ReservationWhereUniqueInput[];
};
export type ReservationUpdateManyWithoutCustomerProfileNestedInput = {
    create?: Prisma.XOR<Prisma.ReservationCreateWithoutCustomerProfileInput, Prisma.ReservationUncheckedCreateWithoutCustomerProfileInput> | Prisma.ReservationCreateWithoutCustomerProfileInput[] | Prisma.ReservationUncheckedCreateWithoutCustomerProfileInput[];
    connectOrCreate?: Prisma.ReservationCreateOrConnectWithoutCustomerProfileInput | Prisma.ReservationCreateOrConnectWithoutCustomerProfileInput[];
    upsert?: Prisma.ReservationUpsertWithWhereUniqueWithoutCustomerProfileInput | Prisma.ReservationUpsertWithWhereUniqueWithoutCustomerProfileInput[];
    createMany?: Prisma.ReservationCreateManyCustomerProfileInputEnvelope;
    set?: Prisma.ReservationWhereUniqueInput | Prisma.ReservationWhereUniqueInput[];
    disconnect?: Prisma.ReservationWhereUniqueInput | Prisma.ReservationWhereUniqueInput[];
    delete?: Prisma.ReservationWhereUniqueInput | Prisma.ReservationWhereUniqueInput[];
    connect?: Prisma.ReservationWhereUniqueInput | Prisma.ReservationWhereUniqueInput[];
    update?: Prisma.ReservationUpdateWithWhereUniqueWithoutCustomerProfileInput | Prisma.ReservationUpdateWithWhereUniqueWithoutCustomerProfileInput[];
    updateMany?: Prisma.ReservationUpdateManyWithWhereWithoutCustomerProfileInput | Prisma.ReservationUpdateManyWithWhereWithoutCustomerProfileInput[];
    deleteMany?: Prisma.ReservationScalarWhereInput | Prisma.ReservationScalarWhereInput[];
};
export type ReservationUncheckedUpdateManyWithoutCustomerProfileNestedInput = {
    create?: Prisma.XOR<Prisma.ReservationCreateWithoutCustomerProfileInput, Prisma.ReservationUncheckedCreateWithoutCustomerProfileInput> | Prisma.ReservationCreateWithoutCustomerProfileInput[] | Prisma.ReservationUncheckedCreateWithoutCustomerProfileInput[];
    connectOrCreate?: Prisma.ReservationCreateOrConnectWithoutCustomerProfileInput | Prisma.ReservationCreateOrConnectWithoutCustomerProfileInput[];
    upsert?: Prisma.ReservationUpsertWithWhereUniqueWithoutCustomerProfileInput | Prisma.ReservationUpsertWithWhereUniqueWithoutCustomerProfileInput[];
    createMany?: Prisma.ReservationCreateManyCustomerProfileInputEnvelope;
    set?: Prisma.ReservationWhereUniqueInput | Prisma.ReservationWhereUniqueInput[];
    disconnect?: Prisma.ReservationWhereUniqueInput | Prisma.ReservationWhereUniqueInput[];
    delete?: Prisma.ReservationWhereUniqueInput | Prisma.ReservationWhereUniqueInput[];
    connect?: Prisma.ReservationWhereUniqueInput | Prisma.ReservationWhereUniqueInput[];
    update?: Prisma.ReservationUpdateWithWhereUniqueWithoutCustomerProfileInput | Prisma.ReservationUpdateWithWhereUniqueWithoutCustomerProfileInput[];
    updateMany?: Prisma.ReservationUpdateManyWithWhereWithoutCustomerProfileInput | Prisma.ReservationUpdateManyWithWhereWithoutCustomerProfileInput[];
    deleteMany?: Prisma.ReservationScalarWhereInput | Prisma.ReservationScalarWhereInput[];
};
export type ReservationCreateNestedManyWithoutPickupLocationInput = {
    create?: Prisma.XOR<Prisma.ReservationCreateWithoutPickupLocationInput, Prisma.ReservationUncheckedCreateWithoutPickupLocationInput> | Prisma.ReservationCreateWithoutPickupLocationInput[] | Prisma.ReservationUncheckedCreateWithoutPickupLocationInput[];
    connectOrCreate?: Prisma.ReservationCreateOrConnectWithoutPickupLocationInput | Prisma.ReservationCreateOrConnectWithoutPickupLocationInput[];
    createMany?: Prisma.ReservationCreateManyPickupLocationInputEnvelope;
    connect?: Prisma.ReservationWhereUniqueInput | Prisma.ReservationWhereUniqueInput[];
};
export type ReservationCreateNestedManyWithoutDropoffLocationInput = {
    create?: Prisma.XOR<Prisma.ReservationCreateWithoutDropoffLocationInput, Prisma.ReservationUncheckedCreateWithoutDropoffLocationInput> | Prisma.ReservationCreateWithoutDropoffLocationInput[] | Prisma.ReservationUncheckedCreateWithoutDropoffLocationInput[];
    connectOrCreate?: Prisma.ReservationCreateOrConnectWithoutDropoffLocationInput | Prisma.ReservationCreateOrConnectWithoutDropoffLocationInput[];
    createMany?: Prisma.ReservationCreateManyDropoffLocationInputEnvelope;
    connect?: Prisma.ReservationWhereUniqueInput | Prisma.ReservationWhereUniqueInput[];
};
export type ReservationUncheckedCreateNestedManyWithoutPickupLocationInput = {
    create?: Prisma.XOR<Prisma.ReservationCreateWithoutPickupLocationInput, Prisma.ReservationUncheckedCreateWithoutPickupLocationInput> | Prisma.ReservationCreateWithoutPickupLocationInput[] | Prisma.ReservationUncheckedCreateWithoutPickupLocationInput[];
    connectOrCreate?: Prisma.ReservationCreateOrConnectWithoutPickupLocationInput | Prisma.ReservationCreateOrConnectWithoutPickupLocationInput[];
    createMany?: Prisma.ReservationCreateManyPickupLocationInputEnvelope;
    connect?: Prisma.ReservationWhereUniqueInput | Prisma.ReservationWhereUniqueInput[];
};
export type ReservationUncheckedCreateNestedManyWithoutDropoffLocationInput = {
    create?: Prisma.XOR<Prisma.ReservationCreateWithoutDropoffLocationInput, Prisma.ReservationUncheckedCreateWithoutDropoffLocationInput> | Prisma.ReservationCreateWithoutDropoffLocationInput[] | Prisma.ReservationUncheckedCreateWithoutDropoffLocationInput[];
    connectOrCreate?: Prisma.ReservationCreateOrConnectWithoutDropoffLocationInput | Prisma.ReservationCreateOrConnectWithoutDropoffLocationInput[];
    createMany?: Prisma.ReservationCreateManyDropoffLocationInputEnvelope;
    connect?: Prisma.ReservationWhereUniqueInput | Prisma.ReservationWhereUniqueInput[];
};
export type ReservationUpdateManyWithoutPickupLocationNestedInput = {
    create?: Prisma.XOR<Prisma.ReservationCreateWithoutPickupLocationInput, Prisma.ReservationUncheckedCreateWithoutPickupLocationInput> | Prisma.ReservationCreateWithoutPickupLocationInput[] | Prisma.ReservationUncheckedCreateWithoutPickupLocationInput[];
    connectOrCreate?: Prisma.ReservationCreateOrConnectWithoutPickupLocationInput | Prisma.ReservationCreateOrConnectWithoutPickupLocationInput[];
    upsert?: Prisma.ReservationUpsertWithWhereUniqueWithoutPickupLocationInput | Prisma.ReservationUpsertWithWhereUniqueWithoutPickupLocationInput[];
    createMany?: Prisma.ReservationCreateManyPickupLocationInputEnvelope;
    set?: Prisma.ReservationWhereUniqueInput | Prisma.ReservationWhereUniqueInput[];
    disconnect?: Prisma.ReservationWhereUniqueInput | Prisma.ReservationWhereUniqueInput[];
    delete?: Prisma.ReservationWhereUniqueInput | Prisma.ReservationWhereUniqueInput[];
    connect?: Prisma.ReservationWhereUniqueInput | Prisma.ReservationWhereUniqueInput[];
    update?: Prisma.ReservationUpdateWithWhereUniqueWithoutPickupLocationInput | Prisma.ReservationUpdateWithWhereUniqueWithoutPickupLocationInput[];
    updateMany?: Prisma.ReservationUpdateManyWithWhereWithoutPickupLocationInput | Prisma.ReservationUpdateManyWithWhereWithoutPickupLocationInput[];
    deleteMany?: Prisma.ReservationScalarWhereInput | Prisma.ReservationScalarWhereInput[];
};
export type ReservationUpdateManyWithoutDropoffLocationNestedInput = {
    create?: Prisma.XOR<Prisma.ReservationCreateWithoutDropoffLocationInput, Prisma.ReservationUncheckedCreateWithoutDropoffLocationInput> | Prisma.ReservationCreateWithoutDropoffLocationInput[] | Prisma.ReservationUncheckedCreateWithoutDropoffLocationInput[];
    connectOrCreate?: Prisma.ReservationCreateOrConnectWithoutDropoffLocationInput | Prisma.ReservationCreateOrConnectWithoutDropoffLocationInput[];
    upsert?: Prisma.ReservationUpsertWithWhereUniqueWithoutDropoffLocationInput | Prisma.ReservationUpsertWithWhereUniqueWithoutDropoffLocationInput[];
    createMany?: Prisma.ReservationCreateManyDropoffLocationInputEnvelope;
    set?: Prisma.ReservationWhereUniqueInput | Prisma.ReservationWhereUniqueInput[];
    disconnect?: Prisma.ReservationWhereUniqueInput | Prisma.ReservationWhereUniqueInput[];
    delete?: Prisma.ReservationWhereUniqueInput | Prisma.ReservationWhereUniqueInput[];
    connect?: Prisma.ReservationWhereUniqueInput | Prisma.ReservationWhereUniqueInput[];
    update?: Prisma.ReservationUpdateWithWhereUniqueWithoutDropoffLocationInput | Prisma.ReservationUpdateWithWhereUniqueWithoutDropoffLocationInput[];
    updateMany?: Prisma.ReservationUpdateManyWithWhereWithoutDropoffLocationInput | Prisma.ReservationUpdateManyWithWhereWithoutDropoffLocationInput[];
    deleteMany?: Prisma.ReservationScalarWhereInput | Prisma.ReservationScalarWhereInput[];
};
export type ReservationUncheckedUpdateManyWithoutPickupLocationNestedInput = {
    create?: Prisma.XOR<Prisma.ReservationCreateWithoutPickupLocationInput, Prisma.ReservationUncheckedCreateWithoutPickupLocationInput> | Prisma.ReservationCreateWithoutPickupLocationInput[] | Prisma.ReservationUncheckedCreateWithoutPickupLocationInput[];
    connectOrCreate?: Prisma.ReservationCreateOrConnectWithoutPickupLocationInput | Prisma.ReservationCreateOrConnectWithoutPickupLocationInput[];
    upsert?: Prisma.ReservationUpsertWithWhereUniqueWithoutPickupLocationInput | Prisma.ReservationUpsertWithWhereUniqueWithoutPickupLocationInput[];
    createMany?: Prisma.ReservationCreateManyPickupLocationInputEnvelope;
    set?: Prisma.ReservationWhereUniqueInput | Prisma.ReservationWhereUniqueInput[];
    disconnect?: Prisma.ReservationWhereUniqueInput | Prisma.ReservationWhereUniqueInput[];
    delete?: Prisma.ReservationWhereUniqueInput | Prisma.ReservationWhereUniqueInput[];
    connect?: Prisma.ReservationWhereUniqueInput | Prisma.ReservationWhereUniqueInput[];
    update?: Prisma.ReservationUpdateWithWhereUniqueWithoutPickupLocationInput | Prisma.ReservationUpdateWithWhereUniqueWithoutPickupLocationInput[];
    updateMany?: Prisma.ReservationUpdateManyWithWhereWithoutPickupLocationInput | Prisma.ReservationUpdateManyWithWhereWithoutPickupLocationInput[];
    deleteMany?: Prisma.ReservationScalarWhereInput | Prisma.ReservationScalarWhereInput[];
};
export type ReservationUncheckedUpdateManyWithoutDropoffLocationNestedInput = {
    create?: Prisma.XOR<Prisma.ReservationCreateWithoutDropoffLocationInput, Prisma.ReservationUncheckedCreateWithoutDropoffLocationInput> | Prisma.ReservationCreateWithoutDropoffLocationInput[] | Prisma.ReservationUncheckedCreateWithoutDropoffLocationInput[];
    connectOrCreate?: Prisma.ReservationCreateOrConnectWithoutDropoffLocationInput | Prisma.ReservationCreateOrConnectWithoutDropoffLocationInput[];
    upsert?: Prisma.ReservationUpsertWithWhereUniqueWithoutDropoffLocationInput | Prisma.ReservationUpsertWithWhereUniqueWithoutDropoffLocationInput[];
    createMany?: Prisma.ReservationCreateManyDropoffLocationInputEnvelope;
    set?: Prisma.ReservationWhereUniqueInput | Prisma.ReservationWhereUniqueInput[];
    disconnect?: Prisma.ReservationWhereUniqueInput | Prisma.ReservationWhereUniqueInput[];
    delete?: Prisma.ReservationWhereUniqueInput | Prisma.ReservationWhereUniqueInput[];
    connect?: Prisma.ReservationWhereUniqueInput | Prisma.ReservationWhereUniqueInput[];
    update?: Prisma.ReservationUpdateWithWhereUniqueWithoutDropoffLocationInput | Prisma.ReservationUpdateWithWhereUniqueWithoutDropoffLocationInput[];
    updateMany?: Prisma.ReservationUpdateManyWithWhereWithoutDropoffLocationInput | Prisma.ReservationUpdateManyWithWhereWithoutDropoffLocationInput[];
    deleteMany?: Prisma.ReservationScalarWhereInput | Prisma.ReservationScalarWhereInput[];
};
export type ReservationCreateNestedManyWithoutVehicleInput = {
    create?: Prisma.XOR<Prisma.ReservationCreateWithoutVehicleInput, Prisma.ReservationUncheckedCreateWithoutVehicleInput> | Prisma.ReservationCreateWithoutVehicleInput[] | Prisma.ReservationUncheckedCreateWithoutVehicleInput[];
    connectOrCreate?: Prisma.ReservationCreateOrConnectWithoutVehicleInput | Prisma.ReservationCreateOrConnectWithoutVehicleInput[];
    createMany?: Prisma.ReservationCreateManyVehicleInputEnvelope;
    connect?: Prisma.ReservationWhereUniqueInput | Prisma.ReservationWhereUniqueInput[];
};
export type ReservationUncheckedCreateNestedManyWithoutVehicleInput = {
    create?: Prisma.XOR<Prisma.ReservationCreateWithoutVehicleInput, Prisma.ReservationUncheckedCreateWithoutVehicleInput> | Prisma.ReservationCreateWithoutVehicleInput[] | Prisma.ReservationUncheckedCreateWithoutVehicleInput[];
    connectOrCreate?: Prisma.ReservationCreateOrConnectWithoutVehicleInput | Prisma.ReservationCreateOrConnectWithoutVehicleInput[];
    createMany?: Prisma.ReservationCreateManyVehicleInputEnvelope;
    connect?: Prisma.ReservationWhereUniqueInput | Prisma.ReservationWhereUniqueInput[];
};
export type ReservationUpdateManyWithoutVehicleNestedInput = {
    create?: Prisma.XOR<Prisma.ReservationCreateWithoutVehicleInput, Prisma.ReservationUncheckedCreateWithoutVehicleInput> | Prisma.ReservationCreateWithoutVehicleInput[] | Prisma.ReservationUncheckedCreateWithoutVehicleInput[];
    connectOrCreate?: Prisma.ReservationCreateOrConnectWithoutVehicleInput | Prisma.ReservationCreateOrConnectWithoutVehicleInput[];
    upsert?: Prisma.ReservationUpsertWithWhereUniqueWithoutVehicleInput | Prisma.ReservationUpsertWithWhereUniqueWithoutVehicleInput[];
    createMany?: Prisma.ReservationCreateManyVehicleInputEnvelope;
    set?: Prisma.ReservationWhereUniqueInput | Prisma.ReservationWhereUniqueInput[];
    disconnect?: Prisma.ReservationWhereUniqueInput | Prisma.ReservationWhereUniqueInput[];
    delete?: Prisma.ReservationWhereUniqueInput | Prisma.ReservationWhereUniqueInput[];
    connect?: Prisma.ReservationWhereUniqueInput | Prisma.ReservationWhereUniqueInput[];
    update?: Prisma.ReservationUpdateWithWhereUniqueWithoutVehicleInput | Prisma.ReservationUpdateWithWhereUniqueWithoutVehicleInput[];
    updateMany?: Prisma.ReservationUpdateManyWithWhereWithoutVehicleInput | Prisma.ReservationUpdateManyWithWhereWithoutVehicleInput[];
    deleteMany?: Prisma.ReservationScalarWhereInput | Prisma.ReservationScalarWhereInput[];
};
export type ReservationUncheckedUpdateManyWithoutVehicleNestedInput = {
    create?: Prisma.XOR<Prisma.ReservationCreateWithoutVehicleInput, Prisma.ReservationUncheckedCreateWithoutVehicleInput> | Prisma.ReservationCreateWithoutVehicleInput[] | Prisma.ReservationUncheckedCreateWithoutVehicleInput[];
    connectOrCreate?: Prisma.ReservationCreateOrConnectWithoutVehicleInput | Prisma.ReservationCreateOrConnectWithoutVehicleInput[];
    upsert?: Prisma.ReservationUpsertWithWhereUniqueWithoutVehicleInput | Prisma.ReservationUpsertWithWhereUniqueWithoutVehicleInput[];
    createMany?: Prisma.ReservationCreateManyVehicleInputEnvelope;
    set?: Prisma.ReservationWhereUniqueInput | Prisma.ReservationWhereUniqueInput[];
    disconnect?: Prisma.ReservationWhereUniqueInput | Prisma.ReservationWhereUniqueInput[];
    delete?: Prisma.ReservationWhereUniqueInput | Prisma.ReservationWhereUniqueInput[];
    connect?: Prisma.ReservationWhereUniqueInput | Prisma.ReservationWhereUniqueInput[];
    update?: Prisma.ReservationUpdateWithWhereUniqueWithoutVehicleInput | Prisma.ReservationUpdateWithWhereUniqueWithoutVehicleInput[];
    updateMany?: Prisma.ReservationUpdateManyWithWhereWithoutVehicleInput | Prisma.ReservationUpdateManyWithWhereWithoutVehicleInput[];
    deleteMany?: Prisma.ReservationScalarWhereInput | Prisma.ReservationScalarWhereInput[];
};
export type EnumReservationStatusFieldUpdateOperationsInput = {
    set?: $Enums.ReservationStatus;
};
export type NullableDecimalFieldUpdateOperationsInput = {
    set?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    increment?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    decrement?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    multiply?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    divide?: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type ReservationCreateNestedOneWithoutRentalInput = {
    create?: Prisma.XOR<Prisma.ReservationCreateWithoutRentalInput, Prisma.ReservationUncheckedCreateWithoutRentalInput>;
    connectOrCreate?: Prisma.ReservationCreateOrConnectWithoutRentalInput;
    connect?: Prisma.ReservationWhereUniqueInput;
};
export type ReservationUpdateOneWithoutRentalNestedInput = {
    create?: Prisma.XOR<Prisma.ReservationCreateWithoutRentalInput, Prisma.ReservationUncheckedCreateWithoutRentalInput>;
    connectOrCreate?: Prisma.ReservationCreateOrConnectWithoutRentalInput;
    upsert?: Prisma.ReservationUpsertWithoutRentalInput;
    disconnect?: Prisma.ReservationWhereInput | boolean;
    delete?: Prisma.ReservationWhereInput | boolean;
    connect?: Prisma.ReservationWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.ReservationUpdateToOneWithWhereWithoutRentalInput, Prisma.ReservationUpdateWithoutRentalInput>, Prisma.ReservationUncheckedUpdateWithoutRentalInput>;
};
export type ReservationCreateWithoutTenantInput = {
    id?: string;
    pickupAt: Date | string;
    dropoffAt: Date | string;
    status?: $Enums.ReservationStatus;
    quotedTotal?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    customerProfile: Prisma.CustomerProfileCreateNestedOneWithoutReservationsInput;
    vehicle?: Prisma.VehicleCreateNestedOneWithoutReservationsInput;
    pickupLocation: Prisma.LocationCreateNestedOneWithoutPickupReservationsInput;
    dropoffLocation: Prisma.LocationCreateNestedOneWithoutDropoffReservationsInput;
    createdBy?: Prisma.UserCreateNestedOneWithoutCreatedReservationsInput;
    rental?: Prisma.RentalCreateNestedOneWithoutReservationInput;
};
export type ReservationUncheckedCreateWithoutTenantInput = {
    id?: string;
    customerProfileId: string;
    vehicleId?: string | null;
    pickupLocationId: string;
    dropoffLocationId: string;
    pickupAt: Date | string;
    dropoffAt: Date | string;
    status?: $Enums.ReservationStatus;
    quotedTotal?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    notes?: string | null;
    createdById?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    rental?: Prisma.RentalUncheckedCreateNestedOneWithoutReservationInput;
};
export type ReservationCreateOrConnectWithoutTenantInput = {
    where: Prisma.ReservationWhereUniqueInput;
    create: Prisma.XOR<Prisma.ReservationCreateWithoutTenantInput, Prisma.ReservationUncheckedCreateWithoutTenantInput>;
};
export type ReservationCreateManyTenantInputEnvelope = {
    data: Prisma.ReservationCreateManyTenantInput | Prisma.ReservationCreateManyTenantInput[];
    skipDuplicates?: boolean;
};
export type ReservationUpsertWithWhereUniqueWithoutTenantInput = {
    where: Prisma.ReservationWhereUniqueInput;
    update: Prisma.XOR<Prisma.ReservationUpdateWithoutTenantInput, Prisma.ReservationUncheckedUpdateWithoutTenantInput>;
    create: Prisma.XOR<Prisma.ReservationCreateWithoutTenantInput, Prisma.ReservationUncheckedCreateWithoutTenantInput>;
};
export type ReservationUpdateWithWhereUniqueWithoutTenantInput = {
    where: Prisma.ReservationWhereUniqueInput;
    data: Prisma.XOR<Prisma.ReservationUpdateWithoutTenantInput, Prisma.ReservationUncheckedUpdateWithoutTenantInput>;
};
export type ReservationUpdateManyWithWhereWithoutTenantInput = {
    where: Prisma.ReservationScalarWhereInput;
    data: Prisma.XOR<Prisma.ReservationUpdateManyMutationInput, Prisma.ReservationUncheckedUpdateManyWithoutTenantInput>;
};
export type ReservationScalarWhereInput = {
    AND?: Prisma.ReservationScalarWhereInput | Prisma.ReservationScalarWhereInput[];
    OR?: Prisma.ReservationScalarWhereInput[];
    NOT?: Prisma.ReservationScalarWhereInput | Prisma.ReservationScalarWhereInput[];
    id?: Prisma.StringFilter<"Reservation"> | string;
    tenantId?: Prisma.StringFilter<"Reservation"> | string;
    customerProfileId?: Prisma.StringFilter<"Reservation"> | string;
    vehicleId?: Prisma.StringNullableFilter<"Reservation"> | string | null;
    pickupLocationId?: Prisma.StringFilter<"Reservation"> | string;
    dropoffLocationId?: Prisma.StringFilter<"Reservation"> | string;
    pickupAt?: Prisma.DateTimeFilter<"Reservation"> | Date | string;
    dropoffAt?: Prisma.DateTimeFilter<"Reservation"> | Date | string;
    status?: Prisma.EnumReservationStatusFilter<"Reservation"> | $Enums.ReservationStatus;
    quotedTotal?: Prisma.DecimalNullableFilter<"Reservation"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    notes?: Prisma.StringNullableFilter<"Reservation"> | string | null;
    createdById?: Prisma.StringNullableFilter<"Reservation"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Reservation"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Reservation"> | Date | string;
};
export type ReservationCreateWithoutCreatedByInput = {
    id?: string;
    pickupAt: Date | string;
    dropoffAt: Date | string;
    status?: $Enums.ReservationStatus;
    quotedTotal?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    tenant: Prisma.TenantCreateNestedOneWithoutReservationsInput;
    customerProfile: Prisma.CustomerProfileCreateNestedOneWithoutReservationsInput;
    vehicle?: Prisma.VehicleCreateNestedOneWithoutReservationsInput;
    pickupLocation: Prisma.LocationCreateNestedOneWithoutPickupReservationsInput;
    dropoffLocation: Prisma.LocationCreateNestedOneWithoutDropoffReservationsInput;
    rental?: Prisma.RentalCreateNestedOneWithoutReservationInput;
};
export type ReservationUncheckedCreateWithoutCreatedByInput = {
    id?: string;
    tenantId: string;
    customerProfileId: string;
    vehicleId?: string | null;
    pickupLocationId: string;
    dropoffLocationId: string;
    pickupAt: Date | string;
    dropoffAt: Date | string;
    status?: $Enums.ReservationStatus;
    quotedTotal?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    rental?: Prisma.RentalUncheckedCreateNestedOneWithoutReservationInput;
};
export type ReservationCreateOrConnectWithoutCreatedByInput = {
    where: Prisma.ReservationWhereUniqueInput;
    create: Prisma.XOR<Prisma.ReservationCreateWithoutCreatedByInput, Prisma.ReservationUncheckedCreateWithoutCreatedByInput>;
};
export type ReservationCreateManyCreatedByInputEnvelope = {
    data: Prisma.ReservationCreateManyCreatedByInput | Prisma.ReservationCreateManyCreatedByInput[];
    skipDuplicates?: boolean;
};
export type ReservationUpsertWithWhereUniqueWithoutCreatedByInput = {
    where: Prisma.ReservationWhereUniqueInput;
    update: Prisma.XOR<Prisma.ReservationUpdateWithoutCreatedByInput, Prisma.ReservationUncheckedUpdateWithoutCreatedByInput>;
    create: Prisma.XOR<Prisma.ReservationCreateWithoutCreatedByInput, Prisma.ReservationUncheckedCreateWithoutCreatedByInput>;
};
export type ReservationUpdateWithWhereUniqueWithoutCreatedByInput = {
    where: Prisma.ReservationWhereUniqueInput;
    data: Prisma.XOR<Prisma.ReservationUpdateWithoutCreatedByInput, Prisma.ReservationUncheckedUpdateWithoutCreatedByInput>;
};
export type ReservationUpdateManyWithWhereWithoutCreatedByInput = {
    where: Prisma.ReservationScalarWhereInput;
    data: Prisma.XOR<Prisma.ReservationUpdateManyMutationInput, Prisma.ReservationUncheckedUpdateManyWithoutCreatedByInput>;
};
export type ReservationCreateWithoutCustomerProfileInput = {
    id?: string;
    pickupAt: Date | string;
    dropoffAt: Date | string;
    status?: $Enums.ReservationStatus;
    quotedTotal?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    tenant: Prisma.TenantCreateNestedOneWithoutReservationsInput;
    vehicle?: Prisma.VehicleCreateNestedOneWithoutReservationsInput;
    pickupLocation: Prisma.LocationCreateNestedOneWithoutPickupReservationsInput;
    dropoffLocation: Prisma.LocationCreateNestedOneWithoutDropoffReservationsInput;
    createdBy?: Prisma.UserCreateNestedOneWithoutCreatedReservationsInput;
    rental?: Prisma.RentalCreateNestedOneWithoutReservationInput;
};
export type ReservationUncheckedCreateWithoutCustomerProfileInput = {
    id?: string;
    tenantId: string;
    vehicleId?: string | null;
    pickupLocationId: string;
    dropoffLocationId: string;
    pickupAt: Date | string;
    dropoffAt: Date | string;
    status?: $Enums.ReservationStatus;
    quotedTotal?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    notes?: string | null;
    createdById?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    rental?: Prisma.RentalUncheckedCreateNestedOneWithoutReservationInput;
};
export type ReservationCreateOrConnectWithoutCustomerProfileInput = {
    where: Prisma.ReservationWhereUniqueInput;
    create: Prisma.XOR<Prisma.ReservationCreateWithoutCustomerProfileInput, Prisma.ReservationUncheckedCreateWithoutCustomerProfileInput>;
};
export type ReservationCreateManyCustomerProfileInputEnvelope = {
    data: Prisma.ReservationCreateManyCustomerProfileInput | Prisma.ReservationCreateManyCustomerProfileInput[];
    skipDuplicates?: boolean;
};
export type ReservationUpsertWithWhereUniqueWithoutCustomerProfileInput = {
    where: Prisma.ReservationWhereUniqueInput;
    update: Prisma.XOR<Prisma.ReservationUpdateWithoutCustomerProfileInput, Prisma.ReservationUncheckedUpdateWithoutCustomerProfileInput>;
    create: Prisma.XOR<Prisma.ReservationCreateWithoutCustomerProfileInput, Prisma.ReservationUncheckedCreateWithoutCustomerProfileInput>;
};
export type ReservationUpdateWithWhereUniqueWithoutCustomerProfileInput = {
    where: Prisma.ReservationWhereUniqueInput;
    data: Prisma.XOR<Prisma.ReservationUpdateWithoutCustomerProfileInput, Prisma.ReservationUncheckedUpdateWithoutCustomerProfileInput>;
};
export type ReservationUpdateManyWithWhereWithoutCustomerProfileInput = {
    where: Prisma.ReservationScalarWhereInput;
    data: Prisma.XOR<Prisma.ReservationUpdateManyMutationInput, Prisma.ReservationUncheckedUpdateManyWithoutCustomerProfileInput>;
};
export type ReservationCreateWithoutPickupLocationInput = {
    id?: string;
    pickupAt: Date | string;
    dropoffAt: Date | string;
    status?: $Enums.ReservationStatus;
    quotedTotal?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    tenant: Prisma.TenantCreateNestedOneWithoutReservationsInput;
    customerProfile: Prisma.CustomerProfileCreateNestedOneWithoutReservationsInput;
    vehicle?: Prisma.VehicleCreateNestedOneWithoutReservationsInput;
    dropoffLocation: Prisma.LocationCreateNestedOneWithoutDropoffReservationsInput;
    createdBy?: Prisma.UserCreateNestedOneWithoutCreatedReservationsInput;
    rental?: Prisma.RentalCreateNestedOneWithoutReservationInput;
};
export type ReservationUncheckedCreateWithoutPickupLocationInput = {
    id?: string;
    tenantId: string;
    customerProfileId: string;
    vehicleId?: string | null;
    dropoffLocationId: string;
    pickupAt: Date | string;
    dropoffAt: Date | string;
    status?: $Enums.ReservationStatus;
    quotedTotal?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    notes?: string | null;
    createdById?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    rental?: Prisma.RentalUncheckedCreateNestedOneWithoutReservationInput;
};
export type ReservationCreateOrConnectWithoutPickupLocationInput = {
    where: Prisma.ReservationWhereUniqueInput;
    create: Prisma.XOR<Prisma.ReservationCreateWithoutPickupLocationInput, Prisma.ReservationUncheckedCreateWithoutPickupLocationInput>;
};
export type ReservationCreateManyPickupLocationInputEnvelope = {
    data: Prisma.ReservationCreateManyPickupLocationInput | Prisma.ReservationCreateManyPickupLocationInput[];
    skipDuplicates?: boolean;
};
export type ReservationCreateWithoutDropoffLocationInput = {
    id?: string;
    pickupAt: Date | string;
    dropoffAt: Date | string;
    status?: $Enums.ReservationStatus;
    quotedTotal?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    tenant: Prisma.TenantCreateNestedOneWithoutReservationsInput;
    customerProfile: Prisma.CustomerProfileCreateNestedOneWithoutReservationsInput;
    vehicle?: Prisma.VehicleCreateNestedOneWithoutReservationsInput;
    pickupLocation: Prisma.LocationCreateNestedOneWithoutPickupReservationsInput;
    createdBy?: Prisma.UserCreateNestedOneWithoutCreatedReservationsInput;
    rental?: Prisma.RentalCreateNestedOneWithoutReservationInput;
};
export type ReservationUncheckedCreateWithoutDropoffLocationInput = {
    id?: string;
    tenantId: string;
    customerProfileId: string;
    vehicleId?: string | null;
    pickupLocationId: string;
    pickupAt: Date | string;
    dropoffAt: Date | string;
    status?: $Enums.ReservationStatus;
    quotedTotal?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    notes?: string | null;
    createdById?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    rental?: Prisma.RentalUncheckedCreateNestedOneWithoutReservationInput;
};
export type ReservationCreateOrConnectWithoutDropoffLocationInput = {
    where: Prisma.ReservationWhereUniqueInput;
    create: Prisma.XOR<Prisma.ReservationCreateWithoutDropoffLocationInput, Prisma.ReservationUncheckedCreateWithoutDropoffLocationInput>;
};
export type ReservationCreateManyDropoffLocationInputEnvelope = {
    data: Prisma.ReservationCreateManyDropoffLocationInput | Prisma.ReservationCreateManyDropoffLocationInput[];
    skipDuplicates?: boolean;
};
export type ReservationUpsertWithWhereUniqueWithoutPickupLocationInput = {
    where: Prisma.ReservationWhereUniqueInput;
    update: Prisma.XOR<Prisma.ReservationUpdateWithoutPickupLocationInput, Prisma.ReservationUncheckedUpdateWithoutPickupLocationInput>;
    create: Prisma.XOR<Prisma.ReservationCreateWithoutPickupLocationInput, Prisma.ReservationUncheckedCreateWithoutPickupLocationInput>;
};
export type ReservationUpdateWithWhereUniqueWithoutPickupLocationInput = {
    where: Prisma.ReservationWhereUniqueInput;
    data: Prisma.XOR<Prisma.ReservationUpdateWithoutPickupLocationInput, Prisma.ReservationUncheckedUpdateWithoutPickupLocationInput>;
};
export type ReservationUpdateManyWithWhereWithoutPickupLocationInput = {
    where: Prisma.ReservationScalarWhereInput;
    data: Prisma.XOR<Prisma.ReservationUpdateManyMutationInput, Prisma.ReservationUncheckedUpdateManyWithoutPickupLocationInput>;
};
export type ReservationUpsertWithWhereUniqueWithoutDropoffLocationInput = {
    where: Prisma.ReservationWhereUniqueInput;
    update: Prisma.XOR<Prisma.ReservationUpdateWithoutDropoffLocationInput, Prisma.ReservationUncheckedUpdateWithoutDropoffLocationInput>;
    create: Prisma.XOR<Prisma.ReservationCreateWithoutDropoffLocationInput, Prisma.ReservationUncheckedCreateWithoutDropoffLocationInput>;
};
export type ReservationUpdateWithWhereUniqueWithoutDropoffLocationInput = {
    where: Prisma.ReservationWhereUniqueInput;
    data: Prisma.XOR<Prisma.ReservationUpdateWithoutDropoffLocationInput, Prisma.ReservationUncheckedUpdateWithoutDropoffLocationInput>;
};
export type ReservationUpdateManyWithWhereWithoutDropoffLocationInput = {
    where: Prisma.ReservationScalarWhereInput;
    data: Prisma.XOR<Prisma.ReservationUpdateManyMutationInput, Prisma.ReservationUncheckedUpdateManyWithoutDropoffLocationInput>;
};
export type ReservationCreateWithoutVehicleInput = {
    id?: string;
    pickupAt: Date | string;
    dropoffAt: Date | string;
    status?: $Enums.ReservationStatus;
    quotedTotal?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    tenant: Prisma.TenantCreateNestedOneWithoutReservationsInput;
    customerProfile: Prisma.CustomerProfileCreateNestedOneWithoutReservationsInput;
    pickupLocation: Prisma.LocationCreateNestedOneWithoutPickupReservationsInput;
    dropoffLocation: Prisma.LocationCreateNestedOneWithoutDropoffReservationsInput;
    createdBy?: Prisma.UserCreateNestedOneWithoutCreatedReservationsInput;
    rental?: Prisma.RentalCreateNestedOneWithoutReservationInput;
};
export type ReservationUncheckedCreateWithoutVehicleInput = {
    id?: string;
    tenantId: string;
    customerProfileId: string;
    pickupLocationId: string;
    dropoffLocationId: string;
    pickupAt: Date | string;
    dropoffAt: Date | string;
    status?: $Enums.ReservationStatus;
    quotedTotal?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    notes?: string | null;
    createdById?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    rental?: Prisma.RentalUncheckedCreateNestedOneWithoutReservationInput;
};
export type ReservationCreateOrConnectWithoutVehicleInput = {
    where: Prisma.ReservationWhereUniqueInput;
    create: Prisma.XOR<Prisma.ReservationCreateWithoutVehicleInput, Prisma.ReservationUncheckedCreateWithoutVehicleInput>;
};
export type ReservationCreateManyVehicleInputEnvelope = {
    data: Prisma.ReservationCreateManyVehicleInput | Prisma.ReservationCreateManyVehicleInput[];
    skipDuplicates?: boolean;
};
export type ReservationUpsertWithWhereUniqueWithoutVehicleInput = {
    where: Prisma.ReservationWhereUniqueInput;
    update: Prisma.XOR<Prisma.ReservationUpdateWithoutVehicleInput, Prisma.ReservationUncheckedUpdateWithoutVehicleInput>;
    create: Prisma.XOR<Prisma.ReservationCreateWithoutVehicleInput, Prisma.ReservationUncheckedCreateWithoutVehicleInput>;
};
export type ReservationUpdateWithWhereUniqueWithoutVehicleInput = {
    where: Prisma.ReservationWhereUniqueInput;
    data: Prisma.XOR<Prisma.ReservationUpdateWithoutVehicleInput, Prisma.ReservationUncheckedUpdateWithoutVehicleInput>;
};
export type ReservationUpdateManyWithWhereWithoutVehicleInput = {
    where: Prisma.ReservationScalarWhereInput;
    data: Prisma.XOR<Prisma.ReservationUpdateManyMutationInput, Prisma.ReservationUncheckedUpdateManyWithoutVehicleInput>;
};
export type ReservationCreateWithoutRentalInput = {
    id?: string;
    pickupAt: Date | string;
    dropoffAt: Date | string;
    status?: $Enums.ReservationStatus;
    quotedTotal?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    tenant: Prisma.TenantCreateNestedOneWithoutReservationsInput;
    customerProfile: Prisma.CustomerProfileCreateNestedOneWithoutReservationsInput;
    vehicle?: Prisma.VehicleCreateNestedOneWithoutReservationsInput;
    pickupLocation: Prisma.LocationCreateNestedOneWithoutPickupReservationsInput;
    dropoffLocation: Prisma.LocationCreateNestedOneWithoutDropoffReservationsInput;
    createdBy?: Prisma.UserCreateNestedOneWithoutCreatedReservationsInput;
};
export type ReservationUncheckedCreateWithoutRentalInput = {
    id?: string;
    tenantId: string;
    customerProfileId: string;
    vehicleId?: string | null;
    pickupLocationId: string;
    dropoffLocationId: string;
    pickupAt: Date | string;
    dropoffAt: Date | string;
    status?: $Enums.ReservationStatus;
    quotedTotal?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    notes?: string | null;
    createdById?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ReservationCreateOrConnectWithoutRentalInput = {
    where: Prisma.ReservationWhereUniqueInput;
    create: Prisma.XOR<Prisma.ReservationCreateWithoutRentalInput, Prisma.ReservationUncheckedCreateWithoutRentalInput>;
};
export type ReservationUpsertWithoutRentalInput = {
    update: Prisma.XOR<Prisma.ReservationUpdateWithoutRentalInput, Prisma.ReservationUncheckedUpdateWithoutRentalInput>;
    create: Prisma.XOR<Prisma.ReservationCreateWithoutRentalInput, Prisma.ReservationUncheckedCreateWithoutRentalInput>;
    where?: Prisma.ReservationWhereInput;
};
export type ReservationUpdateToOneWithWhereWithoutRentalInput = {
    where?: Prisma.ReservationWhereInput;
    data: Prisma.XOR<Prisma.ReservationUpdateWithoutRentalInput, Prisma.ReservationUncheckedUpdateWithoutRentalInput>;
};
export type ReservationUpdateWithoutRentalInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    pickupAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    dropoffAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.EnumReservationStatusFieldUpdateOperationsInput | $Enums.ReservationStatus;
    quotedTotal?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    tenant?: Prisma.TenantUpdateOneRequiredWithoutReservationsNestedInput;
    customerProfile?: Prisma.CustomerProfileUpdateOneRequiredWithoutReservationsNestedInput;
    vehicle?: Prisma.VehicleUpdateOneWithoutReservationsNestedInput;
    pickupLocation?: Prisma.LocationUpdateOneRequiredWithoutPickupReservationsNestedInput;
    dropoffLocation?: Prisma.LocationUpdateOneRequiredWithoutDropoffReservationsNestedInput;
    createdBy?: Prisma.UserUpdateOneWithoutCreatedReservationsNestedInput;
};
export type ReservationUncheckedUpdateWithoutRentalInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenantId?: Prisma.StringFieldUpdateOperationsInput | string;
    customerProfileId?: Prisma.StringFieldUpdateOperationsInput | string;
    vehicleId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    pickupLocationId?: Prisma.StringFieldUpdateOperationsInput | string;
    dropoffLocationId?: Prisma.StringFieldUpdateOperationsInput | string;
    pickupAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    dropoffAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.EnumReservationStatusFieldUpdateOperationsInput | $Enums.ReservationStatus;
    quotedTotal?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ReservationCreateManyTenantInput = {
    id?: string;
    customerProfileId: string;
    vehicleId?: string | null;
    pickupLocationId: string;
    dropoffLocationId: string;
    pickupAt: Date | string;
    dropoffAt: Date | string;
    status?: $Enums.ReservationStatus;
    quotedTotal?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    notes?: string | null;
    createdById?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ReservationUpdateWithoutTenantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    pickupAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    dropoffAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.EnumReservationStatusFieldUpdateOperationsInput | $Enums.ReservationStatus;
    quotedTotal?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    customerProfile?: Prisma.CustomerProfileUpdateOneRequiredWithoutReservationsNestedInput;
    vehicle?: Prisma.VehicleUpdateOneWithoutReservationsNestedInput;
    pickupLocation?: Prisma.LocationUpdateOneRequiredWithoutPickupReservationsNestedInput;
    dropoffLocation?: Prisma.LocationUpdateOneRequiredWithoutDropoffReservationsNestedInput;
    createdBy?: Prisma.UserUpdateOneWithoutCreatedReservationsNestedInput;
    rental?: Prisma.RentalUpdateOneWithoutReservationNestedInput;
};
export type ReservationUncheckedUpdateWithoutTenantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    customerProfileId?: Prisma.StringFieldUpdateOperationsInput | string;
    vehicleId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    pickupLocationId?: Prisma.StringFieldUpdateOperationsInput | string;
    dropoffLocationId?: Prisma.StringFieldUpdateOperationsInput | string;
    pickupAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    dropoffAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.EnumReservationStatusFieldUpdateOperationsInput | $Enums.ReservationStatus;
    quotedTotal?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    rental?: Prisma.RentalUncheckedUpdateOneWithoutReservationNestedInput;
};
export type ReservationUncheckedUpdateManyWithoutTenantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    customerProfileId?: Prisma.StringFieldUpdateOperationsInput | string;
    vehicleId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    pickupLocationId?: Prisma.StringFieldUpdateOperationsInput | string;
    dropoffLocationId?: Prisma.StringFieldUpdateOperationsInput | string;
    pickupAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    dropoffAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.EnumReservationStatusFieldUpdateOperationsInput | $Enums.ReservationStatus;
    quotedTotal?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ReservationCreateManyCreatedByInput = {
    id?: string;
    tenantId: string;
    customerProfileId: string;
    vehicleId?: string | null;
    pickupLocationId: string;
    dropoffLocationId: string;
    pickupAt: Date | string;
    dropoffAt: Date | string;
    status?: $Enums.ReservationStatus;
    quotedTotal?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ReservationUpdateWithoutCreatedByInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    pickupAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    dropoffAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.EnumReservationStatusFieldUpdateOperationsInput | $Enums.ReservationStatus;
    quotedTotal?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    tenant?: Prisma.TenantUpdateOneRequiredWithoutReservationsNestedInput;
    customerProfile?: Prisma.CustomerProfileUpdateOneRequiredWithoutReservationsNestedInput;
    vehicle?: Prisma.VehicleUpdateOneWithoutReservationsNestedInput;
    pickupLocation?: Prisma.LocationUpdateOneRequiredWithoutPickupReservationsNestedInput;
    dropoffLocation?: Prisma.LocationUpdateOneRequiredWithoutDropoffReservationsNestedInput;
    rental?: Prisma.RentalUpdateOneWithoutReservationNestedInput;
};
export type ReservationUncheckedUpdateWithoutCreatedByInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenantId?: Prisma.StringFieldUpdateOperationsInput | string;
    customerProfileId?: Prisma.StringFieldUpdateOperationsInput | string;
    vehicleId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    pickupLocationId?: Prisma.StringFieldUpdateOperationsInput | string;
    dropoffLocationId?: Prisma.StringFieldUpdateOperationsInput | string;
    pickupAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    dropoffAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.EnumReservationStatusFieldUpdateOperationsInput | $Enums.ReservationStatus;
    quotedTotal?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    rental?: Prisma.RentalUncheckedUpdateOneWithoutReservationNestedInput;
};
export type ReservationUncheckedUpdateManyWithoutCreatedByInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenantId?: Prisma.StringFieldUpdateOperationsInput | string;
    customerProfileId?: Prisma.StringFieldUpdateOperationsInput | string;
    vehicleId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    pickupLocationId?: Prisma.StringFieldUpdateOperationsInput | string;
    dropoffLocationId?: Prisma.StringFieldUpdateOperationsInput | string;
    pickupAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    dropoffAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.EnumReservationStatusFieldUpdateOperationsInput | $Enums.ReservationStatus;
    quotedTotal?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ReservationCreateManyCustomerProfileInput = {
    id?: string;
    tenantId: string;
    vehicleId?: string | null;
    pickupLocationId: string;
    dropoffLocationId: string;
    pickupAt: Date | string;
    dropoffAt: Date | string;
    status?: $Enums.ReservationStatus;
    quotedTotal?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    notes?: string | null;
    createdById?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ReservationUpdateWithoutCustomerProfileInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    pickupAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    dropoffAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.EnumReservationStatusFieldUpdateOperationsInput | $Enums.ReservationStatus;
    quotedTotal?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    tenant?: Prisma.TenantUpdateOneRequiredWithoutReservationsNestedInput;
    vehicle?: Prisma.VehicleUpdateOneWithoutReservationsNestedInput;
    pickupLocation?: Prisma.LocationUpdateOneRequiredWithoutPickupReservationsNestedInput;
    dropoffLocation?: Prisma.LocationUpdateOneRequiredWithoutDropoffReservationsNestedInput;
    createdBy?: Prisma.UserUpdateOneWithoutCreatedReservationsNestedInput;
    rental?: Prisma.RentalUpdateOneWithoutReservationNestedInput;
};
export type ReservationUncheckedUpdateWithoutCustomerProfileInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenantId?: Prisma.StringFieldUpdateOperationsInput | string;
    vehicleId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    pickupLocationId?: Prisma.StringFieldUpdateOperationsInput | string;
    dropoffLocationId?: Prisma.StringFieldUpdateOperationsInput | string;
    pickupAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    dropoffAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.EnumReservationStatusFieldUpdateOperationsInput | $Enums.ReservationStatus;
    quotedTotal?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    rental?: Prisma.RentalUncheckedUpdateOneWithoutReservationNestedInput;
};
export type ReservationUncheckedUpdateManyWithoutCustomerProfileInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenantId?: Prisma.StringFieldUpdateOperationsInput | string;
    vehicleId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    pickupLocationId?: Prisma.StringFieldUpdateOperationsInput | string;
    dropoffLocationId?: Prisma.StringFieldUpdateOperationsInput | string;
    pickupAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    dropoffAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.EnumReservationStatusFieldUpdateOperationsInput | $Enums.ReservationStatus;
    quotedTotal?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ReservationCreateManyPickupLocationInput = {
    id?: string;
    tenantId: string;
    customerProfileId: string;
    vehicleId?: string | null;
    dropoffLocationId: string;
    pickupAt: Date | string;
    dropoffAt: Date | string;
    status?: $Enums.ReservationStatus;
    quotedTotal?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    notes?: string | null;
    createdById?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ReservationCreateManyDropoffLocationInput = {
    id?: string;
    tenantId: string;
    customerProfileId: string;
    vehicleId?: string | null;
    pickupLocationId: string;
    pickupAt: Date | string;
    dropoffAt: Date | string;
    status?: $Enums.ReservationStatus;
    quotedTotal?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    notes?: string | null;
    createdById?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ReservationUpdateWithoutPickupLocationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    pickupAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    dropoffAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.EnumReservationStatusFieldUpdateOperationsInput | $Enums.ReservationStatus;
    quotedTotal?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    tenant?: Prisma.TenantUpdateOneRequiredWithoutReservationsNestedInput;
    customerProfile?: Prisma.CustomerProfileUpdateOneRequiredWithoutReservationsNestedInput;
    vehicle?: Prisma.VehicleUpdateOneWithoutReservationsNestedInput;
    dropoffLocation?: Prisma.LocationUpdateOneRequiredWithoutDropoffReservationsNestedInput;
    createdBy?: Prisma.UserUpdateOneWithoutCreatedReservationsNestedInput;
    rental?: Prisma.RentalUpdateOneWithoutReservationNestedInput;
};
export type ReservationUncheckedUpdateWithoutPickupLocationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenantId?: Prisma.StringFieldUpdateOperationsInput | string;
    customerProfileId?: Prisma.StringFieldUpdateOperationsInput | string;
    vehicleId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dropoffLocationId?: Prisma.StringFieldUpdateOperationsInput | string;
    pickupAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    dropoffAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.EnumReservationStatusFieldUpdateOperationsInput | $Enums.ReservationStatus;
    quotedTotal?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    rental?: Prisma.RentalUncheckedUpdateOneWithoutReservationNestedInput;
};
export type ReservationUncheckedUpdateManyWithoutPickupLocationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenantId?: Prisma.StringFieldUpdateOperationsInput | string;
    customerProfileId?: Prisma.StringFieldUpdateOperationsInput | string;
    vehicleId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dropoffLocationId?: Prisma.StringFieldUpdateOperationsInput | string;
    pickupAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    dropoffAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.EnumReservationStatusFieldUpdateOperationsInput | $Enums.ReservationStatus;
    quotedTotal?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ReservationUpdateWithoutDropoffLocationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    pickupAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    dropoffAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.EnumReservationStatusFieldUpdateOperationsInput | $Enums.ReservationStatus;
    quotedTotal?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    tenant?: Prisma.TenantUpdateOneRequiredWithoutReservationsNestedInput;
    customerProfile?: Prisma.CustomerProfileUpdateOneRequiredWithoutReservationsNestedInput;
    vehicle?: Prisma.VehicleUpdateOneWithoutReservationsNestedInput;
    pickupLocation?: Prisma.LocationUpdateOneRequiredWithoutPickupReservationsNestedInput;
    createdBy?: Prisma.UserUpdateOneWithoutCreatedReservationsNestedInput;
    rental?: Prisma.RentalUpdateOneWithoutReservationNestedInput;
};
export type ReservationUncheckedUpdateWithoutDropoffLocationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenantId?: Prisma.StringFieldUpdateOperationsInput | string;
    customerProfileId?: Prisma.StringFieldUpdateOperationsInput | string;
    vehicleId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    pickupLocationId?: Prisma.StringFieldUpdateOperationsInput | string;
    pickupAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    dropoffAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.EnumReservationStatusFieldUpdateOperationsInput | $Enums.ReservationStatus;
    quotedTotal?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    rental?: Prisma.RentalUncheckedUpdateOneWithoutReservationNestedInput;
};
export type ReservationUncheckedUpdateManyWithoutDropoffLocationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenantId?: Prisma.StringFieldUpdateOperationsInput | string;
    customerProfileId?: Prisma.StringFieldUpdateOperationsInput | string;
    vehicleId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    pickupLocationId?: Prisma.StringFieldUpdateOperationsInput | string;
    pickupAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    dropoffAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.EnumReservationStatusFieldUpdateOperationsInput | $Enums.ReservationStatus;
    quotedTotal?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ReservationCreateManyVehicleInput = {
    id?: string;
    tenantId: string;
    customerProfileId: string;
    pickupLocationId: string;
    dropoffLocationId: string;
    pickupAt: Date | string;
    dropoffAt: Date | string;
    status?: $Enums.ReservationStatus;
    quotedTotal?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    notes?: string | null;
    createdById?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ReservationUpdateWithoutVehicleInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    pickupAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    dropoffAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.EnumReservationStatusFieldUpdateOperationsInput | $Enums.ReservationStatus;
    quotedTotal?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    tenant?: Prisma.TenantUpdateOneRequiredWithoutReservationsNestedInput;
    customerProfile?: Prisma.CustomerProfileUpdateOneRequiredWithoutReservationsNestedInput;
    pickupLocation?: Prisma.LocationUpdateOneRequiredWithoutPickupReservationsNestedInput;
    dropoffLocation?: Prisma.LocationUpdateOneRequiredWithoutDropoffReservationsNestedInput;
    createdBy?: Prisma.UserUpdateOneWithoutCreatedReservationsNestedInput;
    rental?: Prisma.RentalUpdateOneWithoutReservationNestedInput;
};
export type ReservationUncheckedUpdateWithoutVehicleInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenantId?: Prisma.StringFieldUpdateOperationsInput | string;
    customerProfileId?: Prisma.StringFieldUpdateOperationsInput | string;
    pickupLocationId?: Prisma.StringFieldUpdateOperationsInput | string;
    dropoffLocationId?: Prisma.StringFieldUpdateOperationsInput | string;
    pickupAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    dropoffAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.EnumReservationStatusFieldUpdateOperationsInput | $Enums.ReservationStatus;
    quotedTotal?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    rental?: Prisma.RentalUncheckedUpdateOneWithoutReservationNestedInput;
};
export type ReservationUncheckedUpdateManyWithoutVehicleInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenantId?: Prisma.StringFieldUpdateOperationsInput | string;
    customerProfileId?: Prisma.StringFieldUpdateOperationsInput | string;
    pickupLocationId?: Prisma.StringFieldUpdateOperationsInput | string;
    dropoffLocationId?: Prisma.StringFieldUpdateOperationsInput | string;
    pickupAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    dropoffAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.EnumReservationStatusFieldUpdateOperationsInput | $Enums.ReservationStatus;
    quotedTotal?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ReservationSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tenantId?: boolean;
    customerProfileId?: boolean;
    vehicleId?: boolean;
    pickupLocationId?: boolean;
    dropoffLocationId?: boolean;
    pickupAt?: boolean;
    dropoffAt?: boolean;
    status?: boolean;
    quotedTotal?: boolean;
    notes?: boolean;
    createdById?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
    customerProfile?: boolean | Prisma.CustomerProfileDefaultArgs<ExtArgs>;
    vehicle?: boolean | Prisma.Reservation$vehicleArgs<ExtArgs>;
    pickupLocation?: boolean | Prisma.LocationDefaultArgs<ExtArgs>;
    dropoffLocation?: boolean | Prisma.LocationDefaultArgs<ExtArgs>;
    createdBy?: boolean | Prisma.Reservation$createdByArgs<ExtArgs>;
    rental?: boolean | Prisma.Reservation$rentalArgs<ExtArgs>;
}, ExtArgs["result"]["reservation"]>;
export type ReservationSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tenantId?: boolean;
    customerProfileId?: boolean;
    vehicleId?: boolean;
    pickupLocationId?: boolean;
    dropoffLocationId?: boolean;
    pickupAt?: boolean;
    dropoffAt?: boolean;
    status?: boolean;
    quotedTotal?: boolean;
    notes?: boolean;
    createdById?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
    customerProfile?: boolean | Prisma.CustomerProfileDefaultArgs<ExtArgs>;
    vehicle?: boolean | Prisma.Reservation$vehicleArgs<ExtArgs>;
    pickupLocation?: boolean | Prisma.LocationDefaultArgs<ExtArgs>;
    dropoffLocation?: boolean | Prisma.LocationDefaultArgs<ExtArgs>;
    createdBy?: boolean | Prisma.Reservation$createdByArgs<ExtArgs>;
}, ExtArgs["result"]["reservation"]>;
export type ReservationSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tenantId?: boolean;
    customerProfileId?: boolean;
    vehicleId?: boolean;
    pickupLocationId?: boolean;
    dropoffLocationId?: boolean;
    pickupAt?: boolean;
    dropoffAt?: boolean;
    status?: boolean;
    quotedTotal?: boolean;
    notes?: boolean;
    createdById?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
    customerProfile?: boolean | Prisma.CustomerProfileDefaultArgs<ExtArgs>;
    vehicle?: boolean | Prisma.Reservation$vehicleArgs<ExtArgs>;
    pickupLocation?: boolean | Prisma.LocationDefaultArgs<ExtArgs>;
    dropoffLocation?: boolean | Prisma.LocationDefaultArgs<ExtArgs>;
    createdBy?: boolean | Prisma.Reservation$createdByArgs<ExtArgs>;
}, ExtArgs["result"]["reservation"]>;
export type ReservationSelectScalar = {
    id?: boolean;
    tenantId?: boolean;
    customerProfileId?: boolean;
    vehicleId?: boolean;
    pickupLocationId?: boolean;
    dropoffLocationId?: boolean;
    pickupAt?: boolean;
    dropoffAt?: boolean;
    status?: boolean;
    quotedTotal?: boolean;
    notes?: boolean;
    createdById?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type ReservationOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "tenantId" | "customerProfileId" | "vehicleId" | "pickupLocationId" | "dropoffLocationId" | "pickupAt" | "dropoffAt" | "status" | "quotedTotal" | "notes" | "createdById" | "createdAt" | "updatedAt", ExtArgs["result"]["reservation"]>;
export type ReservationInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
    customerProfile?: boolean | Prisma.CustomerProfileDefaultArgs<ExtArgs>;
    vehicle?: boolean | Prisma.Reservation$vehicleArgs<ExtArgs>;
    pickupLocation?: boolean | Prisma.LocationDefaultArgs<ExtArgs>;
    dropoffLocation?: boolean | Prisma.LocationDefaultArgs<ExtArgs>;
    createdBy?: boolean | Prisma.Reservation$createdByArgs<ExtArgs>;
    rental?: boolean | Prisma.Reservation$rentalArgs<ExtArgs>;
};
export type ReservationIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
    customerProfile?: boolean | Prisma.CustomerProfileDefaultArgs<ExtArgs>;
    vehicle?: boolean | Prisma.Reservation$vehicleArgs<ExtArgs>;
    pickupLocation?: boolean | Prisma.LocationDefaultArgs<ExtArgs>;
    dropoffLocation?: boolean | Prisma.LocationDefaultArgs<ExtArgs>;
    createdBy?: boolean | Prisma.Reservation$createdByArgs<ExtArgs>;
};
export type ReservationIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
    customerProfile?: boolean | Prisma.CustomerProfileDefaultArgs<ExtArgs>;
    vehicle?: boolean | Prisma.Reservation$vehicleArgs<ExtArgs>;
    pickupLocation?: boolean | Prisma.LocationDefaultArgs<ExtArgs>;
    dropoffLocation?: boolean | Prisma.LocationDefaultArgs<ExtArgs>;
    createdBy?: boolean | Prisma.Reservation$createdByArgs<ExtArgs>;
};
export type $ReservationPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Reservation";
    objects: {
        tenant: Prisma.$TenantPayload<ExtArgs>;
        customerProfile: Prisma.$CustomerProfilePayload<ExtArgs>;
        vehicle: Prisma.$VehiclePayload<ExtArgs> | null;
        pickupLocation: Prisma.$LocationPayload<ExtArgs>;
        dropoffLocation: Prisma.$LocationPayload<ExtArgs>;
        createdBy: Prisma.$UserPayload<ExtArgs> | null;
        rental: Prisma.$RentalPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        tenantId: string;
        customerProfileId: string;
        vehicleId: string | null;
        pickupLocationId: string;
        dropoffLocationId: string;
        pickupAt: Date;
        dropoffAt: Date;
        status: $Enums.ReservationStatus;
        quotedTotal: runtime.Decimal | null;
        notes: string | null;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["reservation"]>;
    composites: {};
};
export type ReservationGetPayload<S extends boolean | null | undefined | ReservationDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ReservationPayload, S>;
export type ReservationCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ReservationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ReservationCountAggregateInputType | true;
};
export interface ReservationDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Reservation'];
        meta: {
            name: 'Reservation';
        };
    };
    findUnique<T extends ReservationFindUniqueArgs>(args: Prisma.SelectSubset<T, ReservationFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ReservationClient<runtime.Types.Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ReservationFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ReservationFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ReservationClient<runtime.Types.Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ReservationFindFirstArgs>(args?: Prisma.SelectSubset<T, ReservationFindFirstArgs<ExtArgs>>): Prisma.Prisma__ReservationClient<runtime.Types.Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ReservationFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ReservationFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ReservationClient<runtime.Types.Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ReservationFindManyArgs>(args?: Prisma.SelectSubset<T, ReservationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ReservationCreateArgs>(args: Prisma.SelectSubset<T, ReservationCreateArgs<ExtArgs>>): Prisma.Prisma__ReservationClient<runtime.Types.Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ReservationCreateManyArgs>(args?: Prisma.SelectSubset<T, ReservationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ReservationCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ReservationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ReservationDeleteArgs>(args: Prisma.SelectSubset<T, ReservationDeleteArgs<ExtArgs>>): Prisma.Prisma__ReservationClient<runtime.Types.Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ReservationUpdateArgs>(args: Prisma.SelectSubset<T, ReservationUpdateArgs<ExtArgs>>): Prisma.Prisma__ReservationClient<runtime.Types.Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ReservationDeleteManyArgs>(args?: Prisma.SelectSubset<T, ReservationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ReservationUpdateManyArgs>(args: Prisma.SelectSubset<T, ReservationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ReservationUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ReservationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ReservationUpsertArgs>(args: Prisma.SelectSubset<T, ReservationUpsertArgs<ExtArgs>>): Prisma.Prisma__ReservationClient<runtime.Types.Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ReservationCountArgs>(args?: Prisma.Subset<T, ReservationCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ReservationCountAggregateOutputType> : number>;
    aggregate<T extends ReservationAggregateArgs>(args: Prisma.Subset<T, ReservationAggregateArgs>): Prisma.PrismaPromise<GetReservationAggregateType<T>>;
    groupBy<T extends ReservationGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ReservationGroupByArgs['orderBy'];
    } : {
        orderBy?: ReservationGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ReservationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReservationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ReservationFieldRefs;
}
export interface Prisma__ReservationClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    tenant<T extends Prisma.TenantDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.TenantDefaultArgs<ExtArgs>>): Prisma.Prisma__TenantClient<runtime.Types.Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    customerProfile<T extends Prisma.CustomerProfileDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.CustomerProfileDefaultArgs<ExtArgs>>): Prisma.Prisma__CustomerProfileClient<runtime.Types.Result.GetResult<Prisma.$CustomerProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    vehicle<T extends Prisma.Reservation$vehicleArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Reservation$vehicleArgs<ExtArgs>>): Prisma.Prisma__VehicleClient<runtime.Types.Result.GetResult<Prisma.$VehiclePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    pickupLocation<T extends Prisma.LocationDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.LocationDefaultArgs<ExtArgs>>): Prisma.Prisma__LocationClient<runtime.Types.Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    dropoffLocation<T extends Prisma.LocationDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.LocationDefaultArgs<ExtArgs>>): Prisma.Prisma__LocationClient<runtime.Types.Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    createdBy<T extends Prisma.Reservation$createdByArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Reservation$createdByArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    rental<T extends Prisma.Reservation$rentalArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Reservation$rentalArgs<ExtArgs>>): Prisma.Prisma__RentalClient<runtime.Types.Result.GetResult<Prisma.$RentalPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ReservationFieldRefs {
    readonly id: Prisma.FieldRef<"Reservation", 'String'>;
    readonly tenantId: Prisma.FieldRef<"Reservation", 'String'>;
    readonly customerProfileId: Prisma.FieldRef<"Reservation", 'String'>;
    readonly vehicleId: Prisma.FieldRef<"Reservation", 'String'>;
    readonly pickupLocationId: Prisma.FieldRef<"Reservation", 'String'>;
    readonly dropoffLocationId: Prisma.FieldRef<"Reservation", 'String'>;
    readonly pickupAt: Prisma.FieldRef<"Reservation", 'DateTime'>;
    readonly dropoffAt: Prisma.FieldRef<"Reservation", 'DateTime'>;
    readonly status: Prisma.FieldRef<"Reservation", 'ReservationStatus'>;
    readonly quotedTotal: Prisma.FieldRef<"Reservation", 'Decimal'>;
    readonly notes: Prisma.FieldRef<"Reservation", 'String'>;
    readonly createdById: Prisma.FieldRef<"Reservation", 'String'>;
    readonly createdAt: Prisma.FieldRef<"Reservation", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Reservation", 'DateTime'>;
}
export type ReservationFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReservationSelect<ExtArgs> | null;
    omit?: Prisma.ReservationOmit<ExtArgs> | null;
    include?: Prisma.ReservationInclude<ExtArgs> | null;
    where: Prisma.ReservationWhereUniqueInput;
};
export type ReservationFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReservationSelect<ExtArgs> | null;
    omit?: Prisma.ReservationOmit<ExtArgs> | null;
    include?: Prisma.ReservationInclude<ExtArgs> | null;
    where: Prisma.ReservationWhereUniqueInput;
};
export type ReservationFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type ReservationFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type ReservationFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type ReservationCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReservationSelect<ExtArgs> | null;
    omit?: Prisma.ReservationOmit<ExtArgs> | null;
    include?: Prisma.ReservationInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ReservationCreateInput, Prisma.ReservationUncheckedCreateInput>;
};
export type ReservationCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ReservationCreateManyInput | Prisma.ReservationCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ReservationCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReservationSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ReservationOmit<ExtArgs> | null;
    data: Prisma.ReservationCreateManyInput | Prisma.ReservationCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.ReservationIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type ReservationUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReservationSelect<ExtArgs> | null;
    omit?: Prisma.ReservationOmit<ExtArgs> | null;
    include?: Prisma.ReservationInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ReservationUpdateInput, Prisma.ReservationUncheckedUpdateInput>;
    where: Prisma.ReservationWhereUniqueInput;
};
export type ReservationUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ReservationUpdateManyMutationInput, Prisma.ReservationUncheckedUpdateManyInput>;
    where?: Prisma.ReservationWhereInput;
    limit?: number;
};
export type ReservationUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReservationSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ReservationOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ReservationUpdateManyMutationInput, Prisma.ReservationUncheckedUpdateManyInput>;
    where?: Prisma.ReservationWhereInput;
    limit?: number;
    include?: Prisma.ReservationIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type ReservationUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReservationSelect<ExtArgs> | null;
    omit?: Prisma.ReservationOmit<ExtArgs> | null;
    include?: Prisma.ReservationInclude<ExtArgs> | null;
    where: Prisma.ReservationWhereUniqueInput;
    create: Prisma.XOR<Prisma.ReservationCreateInput, Prisma.ReservationUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ReservationUpdateInput, Prisma.ReservationUncheckedUpdateInput>;
};
export type ReservationDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReservationSelect<ExtArgs> | null;
    omit?: Prisma.ReservationOmit<ExtArgs> | null;
    include?: Prisma.ReservationInclude<ExtArgs> | null;
    where: Prisma.ReservationWhereUniqueInput;
};
export type ReservationDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ReservationWhereInput;
    limit?: number;
};
export type Reservation$vehicleArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VehicleSelect<ExtArgs> | null;
    omit?: Prisma.VehicleOmit<ExtArgs> | null;
    include?: Prisma.VehicleInclude<ExtArgs> | null;
    where?: Prisma.VehicleWhereInput;
};
export type Reservation$createdByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
};
export type Reservation$rentalArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RentalSelect<ExtArgs> | null;
    omit?: Prisma.RentalOmit<ExtArgs> | null;
    include?: Prisma.RentalInclude<ExtArgs> | null;
    where?: Prisma.RentalWhereInput;
};
export type ReservationDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReservationSelect<ExtArgs> | null;
    omit?: Prisma.ReservationOmit<ExtArgs> | null;
    include?: Prisma.ReservationInclude<ExtArgs> | null;
};
export {};
