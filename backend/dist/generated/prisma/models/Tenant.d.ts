import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type TenantModel = runtime.Types.Result.DefaultSelection<Prisma.$TenantPayload>;
export type AggregateTenant = {
    _count: TenantCountAggregateOutputType | null;
    _min: TenantMinAggregateOutputType | null;
    _max: TenantMaxAggregateOutputType | null;
};
export type TenantMinAggregateOutputType = {
    id: string | null;
    name: string | null;
    slug: string | null;
    taxNumber: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type TenantMaxAggregateOutputType = {
    id: string | null;
    name: string | null;
    slug: string | null;
    taxNumber: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type TenantCountAggregateOutputType = {
    id: number;
    name: number;
    slug: number;
    taxNumber: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type TenantMinAggregateInputType = {
    id?: true;
    name?: true;
    slug?: true;
    taxNumber?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type TenantMaxAggregateInputType = {
    id?: true;
    name?: true;
    slug?: true;
    taxNumber?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type TenantCountAggregateInputType = {
    id?: true;
    name?: true;
    slug?: true;
    taxNumber?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type TenantAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TenantWhereInput;
    orderBy?: Prisma.TenantOrderByWithRelationInput | Prisma.TenantOrderByWithRelationInput[];
    cursor?: Prisma.TenantWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | TenantCountAggregateInputType;
    _min?: TenantMinAggregateInputType;
    _max?: TenantMaxAggregateInputType;
};
export type GetTenantAggregateType<T extends TenantAggregateArgs> = {
    [P in keyof T & keyof AggregateTenant]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateTenant[P]> : Prisma.GetScalarType<T[P], AggregateTenant[P]>;
};
export type TenantGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TenantWhereInput;
    orderBy?: Prisma.TenantOrderByWithAggregationInput | Prisma.TenantOrderByWithAggregationInput[];
    by: Prisma.TenantScalarFieldEnum[] | Prisma.TenantScalarFieldEnum;
    having?: Prisma.TenantScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: TenantCountAggregateInputType | true;
    _min?: TenantMinAggregateInputType;
    _max?: TenantMaxAggregateInputType;
};
export type TenantGroupByOutputType = {
    id: string;
    name: string;
    slug: string;
    taxNumber: string | null;
    createdAt: Date;
    updatedAt: Date;
    _count: TenantCountAggregateOutputType | null;
    _min: TenantMinAggregateOutputType | null;
    _max: TenantMaxAggregateOutputType | null;
};
type GetTenantGroupByPayload<T extends TenantGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<TenantGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof TenantGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], TenantGroupByOutputType[P]> : Prisma.GetScalarType<T[P], TenantGroupByOutputType[P]>;
}>>;
export type TenantWhereInput = {
    AND?: Prisma.TenantWhereInput | Prisma.TenantWhereInput[];
    OR?: Prisma.TenantWhereInput[];
    NOT?: Prisma.TenantWhereInput | Prisma.TenantWhereInput[];
    id?: Prisma.StringFilter<"Tenant"> | string;
    name?: Prisma.StringFilter<"Tenant"> | string;
    slug?: Prisma.StringFilter<"Tenant"> | string;
    taxNumber?: Prisma.StringNullableFilter<"Tenant"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Tenant"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Tenant"> | Date | string;
    users?: Prisma.TenantUserListRelationFilter;
    customerProfiles?: Prisma.CustomerProfileListRelationFilter;
    locations?: Prisma.LocationListRelationFilter;
    vehicles?: Prisma.VehicleListRelationFilter;
    reservations?: Prisma.ReservationListRelationFilter;
    rentals?: Prisma.RentalListRelationFilter;
    payments?: Prisma.PaymentListRelationFilter;
    maintenances?: Prisma.VehicleMaintenanceListRelationFilter;
};
export type TenantOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    slug?: Prisma.SortOrder;
    taxNumber?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    users?: Prisma.TenantUserOrderByRelationAggregateInput;
    customerProfiles?: Prisma.CustomerProfileOrderByRelationAggregateInput;
    locations?: Prisma.LocationOrderByRelationAggregateInput;
    vehicles?: Prisma.VehicleOrderByRelationAggregateInput;
    reservations?: Prisma.ReservationOrderByRelationAggregateInput;
    rentals?: Prisma.RentalOrderByRelationAggregateInput;
    payments?: Prisma.PaymentOrderByRelationAggregateInput;
    maintenances?: Prisma.VehicleMaintenanceOrderByRelationAggregateInput;
};
export type TenantWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    slug?: string;
    AND?: Prisma.TenantWhereInput | Prisma.TenantWhereInput[];
    OR?: Prisma.TenantWhereInput[];
    NOT?: Prisma.TenantWhereInput | Prisma.TenantWhereInput[];
    name?: Prisma.StringFilter<"Tenant"> | string;
    taxNumber?: Prisma.StringNullableFilter<"Tenant"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Tenant"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Tenant"> | Date | string;
    users?: Prisma.TenantUserListRelationFilter;
    customerProfiles?: Prisma.CustomerProfileListRelationFilter;
    locations?: Prisma.LocationListRelationFilter;
    vehicles?: Prisma.VehicleListRelationFilter;
    reservations?: Prisma.ReservationListRelationFilter;
    rentals?: Prisma.RentalListRelationFilter;
    payments?: Prisma.PaymentListRelationFilter;
    maintenances?: Prisma.VehicleMaintenanceListRelationFilter;
}, "id" | "slug">;
export type TenantOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    slug?: Prisma.SortOrder;
    taxNumber?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.TenantCountOrderByAggregateInput;
    _max?: Prisma.TenantMaxOrderByAggregateInput;
    _min?: Prisma.TenantMinOrderByAggregateInput;
};
export type TenantScalarWhereWithAggregatesInput = {
    AND?: Prisma.TenantScalarWhereWithAggregatesInput | Prisma.TenantScalarWhereWithAggregatesInput[];
    OR?: Prisma.TenantScalarWhereWithAggregatesInput[];
    NOT?: Prisma.TenantScalarWhereWithAggregatesInput | Prisma.TenantScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Tenant"> | string;
    name?: Prisma.StringWithAggregatesFilter<"Tenant"> | string;
    slug?: Prisma.StringWithAggregatesFilter<"Tenant"> | string;
    taxNumber?: Prisma.StringNullableWithAggregatesFilter<"Tenant"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Tenant"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Tenant"> | Date | string;
};
export type TenantCreateInput = {
    id?: string;
    name: string;
    slug: string;
    taxNumber?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    users?: Prisma.TenantUserCreateNestedManyWithoutTenantInput;
    customerProfiles?: Prisma.CustomerProfileCreateNestedManyWithoutTenantInput;
    locations?: Prisma.LocationCreateNestedManyWithoutTenantInput;
    vehicles?: Prisma.VehicleCreateNestedManyWithoutTenantInput;
    reservations?: Prisma.ReservationCreateNestedManyWithoutTenantInput;
    rentals?: Prisma.RentalCreateNestedManyWithoutTenantInput;
    payments?: Prisma.PaymentCreateNestedManyWithoutTenantInput;
    maintenances?: Prisma.VehicleMaintenanceCreateNestedManyWithoutTenantInput;
};
export type TenantUncheckedCreateInput = {
    id?: string;
    name: string;
    slug: string;
    taxNumber?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    users?: Prisma.TenantUserUncheckedCreateNestedManyWithoutTenantInput;
    customerProfiles?: Prisma.CustomerProfileUncheckedCreateNestedManyWithoutTenantInput;
    locations?: Prisma.LocationUncheckedCreateNestedManyWithoutTenantInput;
    vehicles?: Prisma.VehicleUncheckedCreateNestedManyWithoutTenantInput;
    reservations?: Prisma.ReservationUncheckedCreateNestedManyWithoutTenantInput;
    rentals?: Prisma.RentalUncheckedCreateNestedManyWithoutTenantInput;
    payments?: Prisma.PaymentUncheckedCreateNestedManyWithoutTenantInput;
    maintenances?: Prisma.VehicleMaintenanceUncheckedCreateNestedManyWithoutTenantInput;
};
export type TenantUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    taxNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    users?: Prisma.TenantUserUpdateManyWithoutTenantNestedInput;
    customerProfiles?: Prisma.CustomerProfileUpdateManyWithoutTenantNestedInput;
    locations?: Prisma.LocationUpdateManyWithoutTenantNestedInput;
    vehicles?: Prisma.VehicleUpdateManyWithoutTenantNestedInput;
    reservations?: Prisma.ReservationUpdateManyWithoutTenantNestedInput;
    rentals?: Prisma.RentalUpdateManyWithoutTenantNestedInput;
    payments?: Prisma.PaymentUpdateManyWithoutTenantNestedInput;
    maintenances?: Prisma.VehicleMaintenanceUpdateManyWithoutTenantNestedInput;
};
export type TenantUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    taxNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    users?: Prisma.TenantUserUncheckedUpdateManyWithoutTenantNestedInput;
    customerProfiles?: Prisma.CustomerProfileUncheckedUpdateManyWithoutTenantNestedInput;
    locations?: Prisma.LocationUncheckedUpdateManyWithoutTenantNestedInput;
    vehicles?: Prisma.VehicleUncheckedUpdateManyWithoutTenantNestedInput;
    reservations?: Prisma.ReservationUncheckedUpdateManyWithoutTenantNestedInput;
    rentals?: Prisma.RentalUncheckedUpdateManyWithoutTenantNestedInput;
    payments?: Prisma.PaymentUncheckedUpdateManyWithoutTenantNestedInput;
    maintenances?: Prisma.VehicleMaintenanceUncheckedUpdateManyWithoutTenantNestedInput;
};
export type TenantCreateManyInput = {
    id?: string;
    name: string;
    slug: string;
    taxNumber?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type TenantUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    taxNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TenantUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    taxNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TenantCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    slug?: Prisma.SortOrder;
    taxNumber?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type TenantMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    slug?: Prisma.SortOrder;
    taxNumber?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type TenantMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    slug?: Prisma.SortOrder;
    taxNumber?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type TenantScalarRelationFilter = {
    is?: Prisma.TenantWhereInput;
    isNot?: Prisma.TenantWhereInput;
};
export type StringFieldUpdateOperationsInput = {
    set?: string;
};
export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null;
};
export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string;
};
export type TenantCreateNestedOneWithoutUsersInput = {
    create?: Prisma.XOR<Prisma.TenantCreateWithoutUsersInput, Prisma.TenantUncheckedCreateWithoutUsersInput>;
    connectOrCreate?: Prisma.TenantCreateOrConnectWithoutUsersInput;
    connect?: Prisma.TenantWhereUniqueInput;
};
export type TenantUpdateOneRequiredWithoutUsersNestedInput = {
    create?: Prisma.XOR<Prisma.TenantCreateWithoutUsersInput, Prisma.TenantUncheckedCreateWithoutUsersInput>;
    connectOrCreate?: Prisma.TenantCreateOrConnectWithoutUsersInput;
    upsert?: Prisma.TenantUpsertWithoutUsersInput;
    connect?: Prisma.TenantWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.TenantUpdateToOneWithWhereWithoutUsersInput, Prisma.TenantUpdateWithoutUsersInput>, Prisma.TenantUncheckedUpdateWithoutUsersInput>;
};
export type TenantCreateNestedOneWithoutCustomerProfilesInput = {
    create?: Prisma.XOR<Prisma.TenantCreateWithoutCustomerProfilesInput, Prisma.TenantUncheckedCreateWithoutCustomerProfilesInput>;
    connectOrCreate?: Prisma.TenantCreateOrConnectWithoutCustomerProfilesInput;
    connect?: Prisma.TenantWhereUniqueInput;
};
export type TenantUpdateOneRequiredWithoutCustomerProfilesNestedInput = {
    create?: Prisma.XOR<Prisma.TenantCreateWithoutCustomerProfilesInput, Prisma.TenantUncheckedCreateWithoutCustomerProfilesInput>;
    connectOrCreate?: Prisma.TenantCreateOrConnectWithoutCustomerProfilesInput;
    upsert?: Prisma.TenantUpsertWithoutCustomerProfilesInput;
    connect?: Prisma.TenantWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.TenantUpdateToOneWithWhereWithoutCustomerProfilesInput, Prisma.TenantUpdateWithoutCustomerProfilesInput>, Prisma.TenantUncheckedUpdateWithoutCustomerProfilesInput>;
};
export type TenantCreateNestedOneWithoutLocationsInput = {
    create?: Prisma.XOR<Prisma.TenantCreateWithoutLocationsInput, Prisma.TenantUncheckedCreateWithoutLocationsInput>;
    connectOrCreate?: Prisma.TenantCreateOrConnectWithoutLocationsInput;
    connect?: Prisma.TenantWhereUniqueInput;
};
export type TenantUpdateOneRequiredWithoutLocationsNestedInput = {
    create?: Prisma.XOR<Prisma.TenantCreateWithoutLocationsInput, Prisma.TenantUncheckedCreateWithoutLocationsInput>;
    connectOrCreate?: Prisma.TenantCreateOrConnectWithoutLocationsInput;
    upsert?: Prisma.TenantUpsertWithoutLocationsInput;
    connect?: Prisma.TenantWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.TenantUpdateToOneWithWhereWithoutLocationsInput, Prisma.TenantUpdateWithoutLocationsInput>, Prisma.TenantUncheckedUpdateWithoutLocationsInput>;
};
export type TenantCreateNestedOneWithoutVehiclesInput = {
    create?: Prisma.XOR<Prisma.TenantCreateWithoutVehiclesInput, Prisma.TenantUncheckedCreateWithoutVehiclesInput>;
    connectOrCreate?: Prisma.TenantCreateOrConnectWithoutVehiclesInput;
    connect?: Prisma.TenantWhereUniqueInput;
};
export type TenantUpdateOneRequiredWithoutVehiclesNestedInput = {
    create?: Prisma.XOR<Prisma.TenantCreateWithoutVehiclesInput, Prisma.TenantUncheckedCreateWithoutVehiclesInput>;
    connectOrCreate?: Prisma.TenantCreateOrConnectWithoutVehiclesInput;
    upsert?: Prisma.TenantUpsertWithoutVehiclesInput;
    connect?: Prisma.TenantWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.TenantUpdateToOneWithWhereWithoutVehiclesInput, Prisma.TenantUpdateWithoutVehiclesInput>, Prisma.TenantUncheckedUpdateWithoutVehiclesInput>;
};
export type TenantCreateNestedOneWithoutReservationsInput = {
    create?: Prisma.XOR<Prisma.TenantCreateWithoutReservationsInput, Prisma.TenantUncheckedCreateWithoutReservationsInput>;
    connectOrCreate?: Prisma.TenantCreateOrConnectWithoutReservationsInput;
    connect?: Prisma.TenantWhereUniqueInput;
};
export type TenantUpdateOneRequiredWithoutReservationsNestedInput = {
    create?: Prisma.XOR<Prisma.TenantCreateWithoutReservationsInput, Prisma.TenantUncheckedCreateWithoutReservationsInput>;
    connectOrCreate?: Prisma.TenantCreateOrConnectWithoutReservationsInput;
    upsert?: Prisma.TenantUpsertWithoutReservationsInput;
    connect?: Prisma.TenantWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.TenantUpdateToOneWithWhereWithoutReservationsInput, Prisma.TenantUpdateWithoutReservationsInput>, Prisma.TenantUncheckedUpdateWithoutReservationsInput>;
};
export type TenantCreateNestedOneWithoutRentalsInput = {
    create?: Prisma.XOR<Prisma.TenantCreateWithoutRentalsInput, Prisma.TenantUncheckedCreateWithoutRentalsInput>;
    connectOrCreate?: Prisma.TenantCreateOrConnectWithoutRentalsInput;
    connect?: Prisma.TenantWhereUniqueInput;
};
export type TenantUpdateOneRequiredWithoutRentalsNestedInput = {
    create?: Prisma.XOR<Prisma.TenantCreateWithoutRentalsInput, Prisma.TenantUncheckedCreateWithoutRentalsInput>;
    connectOrCreate?: Prisma.TenantCreateOrConnectWithoutRentalsInput;
    upsert?: Prisma.TenantUpsertWithoutRentalsInput;
    connect?: Prisma.TenantWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.TenantUpdateToOneWithWhereWithoutRentalsInput, Prisma.TenantUpdateWithoutRentalsInput>, Prisma.TenantUncheckedUpdateWithoutRentalsInput>;
};
export type TenantCreateNestedOneWithoutPaymentsInput = {
    create?: Prisma.XOR<Prisma.TenantCreateWithoutPaymentsInput, Prisma.TenantUncheckedCreateWithoutPaymentsInput>;
    connectOrCreate?: Prisma.TenantCreateOrConnectWithoutPaymentsInput;
    connect?: Prisma.TenantWhereUniqueInput;
};
export type TenantUpdateOneRequiredWithoutPaymentsNestedInput = {
    create?: Prisma.XOR<Prisma.TenantCreateWithoutPaymentsInput, Prisma.TenantUncheckedCreateWithoutPaymentsInput>;
    connectOrCreate?: Prisma.TenantCreateOrConnectWithoutPaymentsInput;
    upsert?: Prisma.TenantUpsertWithoutPaymentsInput;
    connect?: Prisma.TenantWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.TenantUpdateToOneWithWhereWithoutPaymentsInput, Prisma.TenantUpdateWithoutPaymentsInput>, Prisma.TenantUncheckedUpdateWithoutPaymentsInput>;
};
export type TenantCreateNestedOneWithoutMaintenancesInput = {
    create?: Prisma.XOR<Prisma.TenantCreateWithoutMaintenancesInput, Prisma.TenantUncheckedCreateWithoutMaintenancesInput>;
    connectOrCreate?: Prisma.TenantCreateOrConnectWithoutMaintenancesInput;
    connect?: Prisma.TenantWhereUniqueInput;
};
export type TenantUpdateOneRequiredWithoutMaintenancesNestedInput = {
    create?: Prisma.XOR<Prisma.TenantCreateWithoutMaintenancesInput, Prisma.TenantUncheckedCreateWithoutMaintenancesInput>;
    connectOrCreate?: Prisma.TenantCreateOrConnectWithoutMaintenancesInput;
    upsert?: Prisma.TenantUpsertWithoutMaintenancesInput;
    connect?: Prisma.TenantWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.TenantUpdateToOneWithWhereWithoutMaintenancesInput, Prisma.TenantUpdateWithoutMaintenancesInput>, Prisma.TenantUncheckedUpdateWithoutMaintenancesInput>;
};
export type TenantCreateWithoutUsersInput = {
    id?: string;
    name: string;
    slug: string;
    taxNumber?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    customerProfiles?: Prisma.CustomerProfileCreateNestedManyWithoutTenantInput;
    locations?: Prisma.LocationCreateNestedManyWithoutTenantInput;
    vehicles?: Prisma.VehicleCreateNestedManyWithoutTenantInput;
    reservations?: Prisma.ReservationCreateNestedManyWithoutTenantInput;
    rentals?: Prisma.RentalCreateNestedManyWithoutTenantInput;
    payments?: Prisma.PaymentCreateNestedManyWithoutTenantInput;
    maintenances?: Prisma.VehicleMaintenanceCreateNestedManyWithoutTenantInput;
};
export type TenantUncheckedCreateWithoutUsersInput = {
    id?: string;
    name: string;
    slug: string;
    taxNumber?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    customerProfiles?: Prisma.CustomerProfileUncheckedCreateNestedManyWithoutTenantInput;
    locations?: Prisma.LocationUncheckedCreateNestedManyWithoutTenantInput;
    vehicles?: Prisma.VehicleUncheckedCreateNestedManyWithoutTenantInput;
    reservations?: Prisma.ReservationUncheckedCreateNestedManyWithoutTenantInput;
    rentals?: Prisma.RentalUncheckedCreateNestedManyWithoutTenantInput;
    payments?: Prisma.PaymentUncheckedCreateNestedManyWithoutTenantInput;
    maintenances?: Prisma.VehicleMaintenanceUncheckedCreateNestedManyWithoutTenantInput;
};
export type TenantCreateOrConnectWithoutUsersInput = {
    where: Prisma.TenantWhereUniqueInput;
    create: Prisma.XOR<Prisma.TenantCreateWithoutUsersInput, Prisma.TenantUncheckedCreateWithoutUsersInput>;
};
export type TenantUpsertWithoutUsersInput = {
    update: Prisma.XOR<Prisma.TenantUpdateWithoutUsersInput, Prisma.TenantUncheckedUpdateWithoutUsersInput>;
    create: Prisma.XOR<Prisma.TenantCreateWithoutUsersInput, Prisma.TenantUncheckedCreateWithoutUsersInput>;
    where?: Prisma.TenantWhereInput;
};
export type TenantUpdateToOneWithWhereWithoutUsersInput = {
    where?: Prisma.TenantWhereInput;
    data: Prisma.XOR<Prisma.TenantUpdateWithoutUsersInput, Prisma.TenantUncheckedUpdateWithoutUsersInput>;
};
export type TenantUpdateWithoutUsersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    taxNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    customerProfiles?: Prisma.CustomerProfileUpdateManyWithoutTenantNestedInput;
    locations?: Prisma.LocationUpdateManyWithoutTenantNestedInput;
    vehicles?: Prisma.VehicleUpdateManyWithoutTenantNestedInput;
    reservations?: Prisma.ReservationUpdateManyWithoutTenantNestedInput;
    rentals?: Prisma.RentalUpdateManyWithoutTenantNestedInput;
    payments?: Prisma.PaymentUpdateManyWithoutTenantNestedInput;
    maintenances?: Prisma.VehicleMaintenanceUpdateManyWithoutTenantNestedInput;
};
export type TenantUncheckedUpdateWithoutUsersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    taxNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    customerProfiles?: Prisma.CustomerProfileUncheckedUpdateManyWithoutTenantNestedInput;
    locations?: Prisma.LocationUncheckedUpdateManyWithoutTenantNestedInput;
    vehicles?: Prisma.VehicleUncheckedUpdateManyWithoutTenantNestedInput;
    reservations?: Prisma.ReservationUncheckedUpdateManyWithoutTenantNestedInput;
    rentals?: Prisma.RentalUncheckedUpdateManyWithoutTenantNestedInput;
    payments?: Prisma.PaymentUncheckedUpdateManyWithoutTenantNestedInput;
    maintenances?: Prisma.VehicleMaintenanceUncheckedUpdateManyWithoutTenantNestedInput;
};
export type TenantCreateWithoutCustomerProfilesInput = {
    id?: string;
    name: string;
    slug: string;
    taxNumber?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    users?: Prisma.TenantUserCreateNestedManyWithoutTenantInput;
    locations?: Prisma.LocationCreateNestedManyWithoutTenantInput;
    vehicles?: Prisma.VehicleCreateNestedManyWithoutTenantInput;
    reservations?: Prisma.ReservationCreateNestedManyWithoutTenantInput;
    rentals?: Prisma.RentalCreateNestedManyWithoutTenantInput;
    payments?: Prisma.PaymentCreateNestedManyWithoutTenantInput;
    maintenances?: Prisma.VehicleMaintenanceCreateNestedManyWithoutTenantInput;
};
export type TenantUncheckedCreateWithoutCustomerProfilesInput = {
    id?: string;
    name: string;
    slug: string;
    taxNumber?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    users?: Prisma.TenantUserUncheckedCreateNestedManyWithoutTenantInput;
    locations?: Prisma.LocationUncheckedCreateNestedManyWithoutTenantInput;
    vehicles?: Prisma.VehicleUncheckedCreateNestedManyWithoutTenantInput;
    reservations?: Prisma.ReservationUncheckedCreateNestedManyWithoutTenantInput;
    rentals?: Prisma.RentalUncheckedCreateNestedManyWithoutTenantInput;
    payments?: Prisma.PaymentUncheckedCreateNestedManyWithoutTenantInput;
    maintenances?: Prisma.VehicleMaintenanceUncheckedCreateNestedManyWithoutTenantInput;
};
export type TenantCreateOrConnectWithoutCustomerProfilesInput = {
    where: Prisma.TenantWhereUniqueInput;
    create: Prisma.XOR<Prisma.TenantCreateWithoutCustomerProfilesInput, Prisma.TenantUncheckedCreateWithoutCustomerProfilesInput>;
};
export type TenantUpsertWithoutCustomerProfilesInput = {
    update: Prisma.XOR<Prisma.TenantUpdateWithoutCustomerProfilesInput, Prisma.TenantUncheckedUpdateWithoutCustomerProfilesInput>;
    create: Prisma.XOR<Prisma.TenantCreateWithoutCustomerProfilesInput, Prisma.TenantUncheckedCreateWithoutCustomerProfilesInput>;
    where?: Prisma.TenantWhereInput;
};
export type TenantUpdateToOneWithWhereWithoutCustomerProfilesInput = {
    where?: Prisma.TenantWhereInput;
    data: Prisma.XOR<Prisma.TenantUpdateWithoutCustomerProfilesInput, Prisma.TenantUncheckedUpdateWithoutCustomerProfilesInput>;
};
export type TenantUpdateWithoutCustomerProfilesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    taxNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    users?: Prisma.TenantUserUpdateManyWithoutTenantNestedInput;
    locations?: Prisma.LocationUpdateManyWithoutTenantNestedInput;
    vehicles?: Prisma.VehicleUpdateManyWithoutTenantNestedInput;
    reservations?: Prisma.ReservationUpdateManyWithoutTenantNestedInput;
    rentals?: Prisma.RentalUpdateManyWithoutTenantNestedInput;
    payments?: Prisma.PaymentUpdateManyWithoutTenantNestedInput;
    maintenances?: Prisma.VehicleMaintenanceUpdateManyWithoutTenantNestedInput;
};
export type TenantUncheckedUpdateWithoutCustomerProfilesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    taxNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    users?: Prisma.TenantUserUncheckedUpdateManyWithoutTenantNestedInput;
    locations?: Prisma.LocationUncheckedUpdateManyWithoutTenantNestedInput;
    vehicles?: Prisma.VehicleUncheckedUpdateManyWithoutTenantNestedInput;
    reservations?: Prisma.ReservationUncheckedUpdateManyWithoutTenantNestedInput;
    rentals?: Prisma.RentalUncheckedUpdateManyWithoutTenantNestedInput;
    payments?: Prisma.PaymentUncheckedUpdateManyWithoutTenantNestedInput;
    maintenances?: Prisma.VehicleMaintenanceUncheckedUpdateManyWithoutTenantNestedInput;
};
export type TenantCreateWithoutLocationsInput = {
    id?: string;
    name: string;
    slug: string;
    taxNumber?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    users?: Prisma.TenantUserCreateNestedManyWithoutTenantInput;
    customerProfiles?: Prisma.CustomerProfileCreateNestedManyWithoutTenantInput;
    vehicles?: Prisma.VehicleCreateNestedManyWithoutTenantInput;
    reservations?: Prisma.ReservationCreateNestedManyWithoutTenantInput;
    rentals?: Prisma.RentalCreateNestedManyWithoutTenantInput;
    payments?: Prisma.PaymentCreateNestedManyWithoutTenantInput;
    maintenances?: Prisma.VehicleMaintenanceCreateNestedManyWithoutTenantInput;
};
export type TenantUncheckedCreateWithoutLocationsInput = {
    id?: string;
    name: string;
    slug: string;
    taxNumber?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    users?: Prisma.TenantUserUncheckedCreateNestedManyWithoutTenantInput;
    customerProfiles?: Prisma.CustomerProfileUncheckedCreateNestedManyWithoutTenantInput;
    vehicles?: Prisma.VehicleUncheckedCreateNestedManyWithoutTenantInput;
    reservations?: Prisma.ReservationUncheckedCreateNestedManyWithoutTenantInput;
    rentals?: Prisma.RentalUncheckedCreateNestedManyWithoutTenantInput;
    payments?: Prisma.PaymentUncheckedCreateNestedManyWithoutTenantInput;
    maintenances?: Prisma.VehicleMaintenanceUncheckedCreateNestedManyWithoutTenantInput;
};
export type TenantCreateOrConnectWithoutLocationsInput = {
    where: Prisma.TenantWhereUniqueInput;
    create: Prisma.XOR<Prisma.TenantCreateWithoutLocationsInput, Prisma.TenantUncheckedCreateWithoutLocationsInput>;
};
export type TenantUpsertWithoutLocationsInput = {
    update: Prisma.XOR<Prisma.TenantUpdateWithoutLocationsInput, Prisma.TenantUncheckedUpdateWithoutLocationsInput>;
    create: Prisma.XOR<Prisma.TenantCreateWithoutLocationsInput, Prisma.TenantUncheckedCreateWithoutLocationsInput>;
    where?: Prisma.TenantWhereInput;
};
export type TenantUpdateToOneWithWhereWithoutLocationsInput = {
    where?: Prisma.TenantWhereInput;
    data: Prisma.XOR<Prisma.TenantUpdateWithoutLocationsInput, Prisma.TenantUncheckedUpdateWithoutLocationsInput>;
};
export type TenantUpdateWithoutLocationsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    taxNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    users?: Prisma.TenantUserUpdateManyWithoutTenantNestedInput;
    customerProfiles?: Prisma.CustomerProfileUpdateManyWithoutTenantNestedInput;
    vehicles?: Prisma.VehicleUpdateManyWithoutTenantNestedInput;
    reservations?: Prisma.ReservationUpdateManyWithoutTenantNestedInput;
    rentals?: Prisma.RentalUpdateManyWithoutTenantNestedInput;
    payments?: Prisma.PaymentUpdateManyWithoutTenantNestedInput;
    maintenances?: Prisma.VehicleMaintenanceUpdateManyWithoutTenantNestedInput;
};
export type TenantUncheckedUpdateWithoutLocationsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    taxNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    users?: Prisma.TenantUserUncheckedUpdateManyWithoutTenantNestedInput;
    customerProfiles?: Prisma.CustomerProfileUncheckedUpdateManyWithoutTenantNestedInput;
    vehicles?: Prisma.VehicleUncheckedUpdateManyWithoutTenantNestedInput;
    reservations?: Prisma.ReservationUncheckedUpdateManyWithoutTenantNestedInput;
    rentals?: Prisma.RentalUncheckedUpdateManyWithoutTenantNestedInput;
    payments?: Prisma.PaymentUncheckedUpdateManyWithoutTenantNestedInput;
    maintenances?: Prisma.VehicleMaintenanceUncheckedUpdateManyWithoutTenantNestedInput;
};
export type TenantCreateWithoutVehiclesInput = {
    id?: string;
    name: string;
    slug: string;
    taxNumber?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    users?: Prisma.TenantUserCreateNestedManyWithoutTenantInput;
    customerProfiles?: Prisma.CustomerProfileCreateNestedManyWithoutTenantInput;
    locations?: Prisma.LocationCreateNestedManyWithoutTenantInput;
    reservations?: Prisma.ReservationCreateNestedManyWithoutTenantInput;
    rentals?: Prisma.RentalCreateNestedManyWithoutTenantInput;
    payments?: Prisma.PaymentCreateNestedManyWithoutTenantInput;
    maintenances?: Prisma.VehicleMaintenanceCreateNestedManyWithoutTenantInput;
};
export type TenantUncheckedCreateWithoutVehiclesInput = {
    id?: string;
    name: string;
    slug: string;
    taxNumber?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    users?: Prisma.TenantUserUncheckedCreateNestedManyWithoutTenantInput;
    customerProfiles?: Prisma.CustomerProfileUncheckedCreateNestedManyWithoutTenantInput;
    locations?: Prisma.LocationUncheckedCreateNestedManyWithoutTenantInput;
    reservations?: Prisma.ReservationUncheckedCreateNestedManyWithoutTenantInput;
    rentals?: Prisma.RentalUncheckedCreateNestedManyWithoutTenantInput;
    payments?: Prisma.PaymentUncheckedCreateNestedManyWithoutTenantInput;
    maintenances?: Prisma.VehicleMaintenanceUncheckedCreateNestedManyWithoutTenantInput;
};
export type TenantCreateOrConnectWithoutVehiclesInput = {
    where: Prisma.TenantWhereUniqueInput;
    create: Prisma.XOR<Prisma.TenantCreateWithoutVehiclesInput, Prisma.TenantUncheckedCreateWithoutVehiclesInput>;
};
export type TenantUpsertWithoutVehiclesInput = {
    update: Prisma.XOR<Prisma.TenantUpdateWithoutVehiclesInput, Prisma.TenantUncheckedUpdateWithoutVehiclesInput>;
    create: Prisma.XOR<Prisma.TenantCreateWithoutVehiclesInput, Prisma.TenantUncheckedCreateWithoutVehiclesInput>;
    where?: Prisma.TenantWhereInput;
};
export type TenantUpdateToOneWithWhereWithoutVehiclesInput = {
    where?: Prisma.TenantWhereInput;
    data: Prisma.XOR<Prisma.TenantUpdateWithoutVehiclesInput, Prisma.TenantUncheckedUpdateWithoutVehiclesInput>;
};
export type TenantUpdateWithoutVehiclesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    taxNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    users?: Prisma.TenantUserUpdateManyWithoutTenantNestedInput;
    customerProfiles?: Prisma.CustomerProfileUpdateManyWithoutTenantNestedInput;
    locations?: Prisma.LocationUpdateManyWithoutTenantNestedInput;
    reservations?: Prisma.ReservationUpdateManyWithoutTenantNestedInput;
    rentals?: Prisma.RentalUpdateManyWithoutTenantNestedInput;
    payments?: Prisma.PaymentUpdateManyWithoutTenantNestedInput;
    maintenances?: Prisma.VehicleMaintenanceUpdateManyWithoutTenantNestedInput;
};
export type TenantUncheckedUpdateWithoutVehiclesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    taxNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    users?: Prisma.TenantUserUncheckedUpdateManyWithoutTenantNestedInput;
    customerProfiles?: Prisma.CustomerProfileUncheckedUpdateManyWithoutTenantNestedInput;
    locations?: Prisma.LocationUncheckedUpdateManyWithoutTenantNestedInput;
    reservations?: Prisma.ReservationUncheckedUpdateManyWithoutTenantNestedInput;
    rentals?: Prisma.RentalUncheckedUpdateManyWithoutTenantNestedInput;
    payments?: Prisma.PaymentUncheckedUpdateManyWithoutTenantNestedInput;
    maintenances?: Prisma.VehicleMaintenanceUncheckedUpdateManyWithoutTenantNestedInput;
};
export type TenantCreateWithoutReservationsInput = {
    id?: string;
    name: string;
    slug: string;
    taxNumber?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    users?: Prisma.TenantUserCreateNestedManyWithoutTenantInput;
    customerProfiles?: Prisma.CustomerProfileCreateNestedManyWithoutTenantInput;
    locations?: Prisma.LocationCreateNestedManyWithoutTenantInput;
    vehicles?: Prisma.VehicleCreateNestedManyWithoutTenantInput;
    rentals?: Prisma.RentalCreateNestedManyWithoutTenantInput;
    payments?: Prisma.PaymentCreateNestedManyWithoutTenantInput;
    maintenances?: Prisma.VehicleMaintenanceCreateNestedManyWithoutTenantInput;
};
export type TenantUncheckedCreateWithoutReservationsInput = {
    id?: string;
    name: string;
    slug: string;
    taxNumber?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    users?: Prisma.TenantUserUncheckedCreateNestedManyWithoutTenantInput;
    customerProfiles?: Prisma.CustomerProfileUncheckedCreateNestedManyWithoutTenantInput;
    locations?: Prisma.LocationUncheckedCreateNestedManyWithoutTenantInput;
    vehicles?: Prisma.VehicleUncheckedCreateNestedManyWithoutTenantInput;
    rentals?: Prisma.RentalUncheckedCreateNestedManyWithoutTenantInput;
    payments?: Prisma.PaymentUncheckedCreateNestedManyWithoutTenantInput;
    maintenances?: Prisma.VehicleMaintenanceUncheckedCreateNestedManyWithoutTenantInput;
};
export type TenantCreateOrConnectWithoutReservationsInput = {
    where: Prisma.TenantWhereUniqueInput;
    create: Prisma.XOR<Prisma.TenantCreateWithoutReservationsInput, Prisma.TenantUncheckedCreateWithoutReservationsInput>;
};
export type TenantUpsertWithoutReservationsInput = {
    update: Prisma.XOR<Prisma.TenantUpdateWithoutReservationsInput, Prisma.TenantUncheckedUpdateWithoutReservationsInput>;
    create: Prisma.XOR<Prisma.TenantCreateWithoutReservationsInput, Prisma.TenantUncheckedCreateWithoutReservationsInput>;
    where?: Prisma.TenantWhereInput;
};
export type TenantUpdateToOneWithWhereWithoutReservationsInput = {
    where?: Prisma.TenantWhereInput;
    data: Prisma.XOR<Prisma.TenantUpdateWithoutReservationsInput, Prisma.TenantUncheckedUpdateWithoutReservationsInput>;
};
export type TenantUpdateWithoutReservationsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    taxNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    users?: Prisma.TenantUserUpdateManyWithoutTenantNestedInput;
    customerProfiles?: Prisma.CustomerProfileUpdateManyWithoutTenantNestedInput;
    locations?: Prisma.LocationUpdateManyWithoutTenantNestedInput;
    vehicles?: Prisma.VehicleUpdateManyWithoutTenantNestedInput;
    rentals?: Prisma.RentalUpdateManyWithoutTenantNestedInput;
    payments?: Prisma.PaymentUpdateManyWithoutTenantNestedInput;
    maintenances?: Prisma.VehicleMaintenanceUpdateManyWithoutTenantNestedInput;
};
export type TenantUncheckedUpdateWithoutReservationsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    taxNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    users?: Prisma.TenantUserUncheckedUpdateManyWithoutTenantNestedInput;
    customerProfiles?: Prisma.CustomerProfileUncheckedUpdateManyWithoutTenantNestedInput;
    locations?: Prisma.LocationUncheckedUpdateManyWithoutTenantNestedInput;
    vehicles?: Prisma.VehicleUncheckedUpdateManyWithoutTenantNestedInput;
    rentals?: Prisma.RentalUncheckedUpdateManyWithoutTenantNestedInput;
    payments?: Prisma.PaymentUncheckedUpdateManyWithoutTenantNestedInput;
    maintenances?: Prisma.VehicleMaintenanceUncheckedUpdateManyWithoutTenantNestedInput;
};
export type TenantCreateWithoutRentalsInput = {
    id?: string;
    name: string;
    slug: string;
    taxNumber?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    users?: Prisma.TenantUserCreateNestedManyWithoutTenantInput;
    customerProfiles?: Prisma.CustomerProfileCreateNestedManyWithoutTenantInput;
    locations?: Prisma.LocationCreateNestedManyWithoutTenantInput;
    vehicles?: Prisma.VehicleCreateNestedManyWithoutTenantInput;
    reservations?: Prisma.ReservationCreateNestedManyWithoutTenantInput;
    payments?: Prisma.PaymentCreateNestedManyWithoutTenantInput;
    maintenances?: Prisma.VehicleMaintenanceCreateNestedManyWithoutTenantInput;
};
export type TenantUncheckedCreateWithoutRentalsInput = {
    id?: string;
    name: string;
    slug: string;
    taxNumber?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    users?: Prisma.TenantUserUncheckedCreateNestedManyWithoutTenantInput;
    customerProfiles?: Prisma.CustomerProfileUncheckedCreateNestedManyWithoutTenantInput;
    locations?: Prisma.LocationUncheckedCreateNestedManyWithoutTenantInput;
    vehicles?: Prisma.VehicleUncheckedCreateNestedManyWithoutTenantInput;
    reservations?: Prisma.ReservationUncheckedCreateNestedManyWithoutTenantInput;
    payments?: Prisma.PaymentUncheckedCreateNestedManyWithoutTenantInput;
    maintenances?: Prisma.VehicleMaintenanceUncheckedCreateNestedManyWithoutTenantInput;
};
export type TenantCreateOrConnectWithoutRentalsInput = {
    where: Prisma.TenantWhereUniqueInput;
    create: Prisma.XOR<Prisma.TenantCreateWithoutRentalsInput, Prisma.TenantUncheckedCreateWithoutRentalsInput>;
};
export type TenantUpsertWithoutRentalsInput = {
    update: Prisma.XOR<Prisma.TenantUpdateWithoutRentalsInput, Prisma.TenantUncheckedUpdateWithoutRentalsInput>;
    create: Prisma.XOR<Prisma.TenantCreateWithoutRentalsInput, Prisma.TenantUncheckedCreateWithoutRentalsInput>;
    where?: Prisma.TenantWhereInput;
};
export type TenantUpdateToOneWithWhereWithoutRentalsInput = {
    where?: Prisma.TenantWhereInput;
    data: Prisma.XOR<Prisma.TenantUpdateWithoutRentalsInput, Prisma.TenantUncheckedUpdateWithoutRentalsInput>;
};
export type TenantUpdateWithoutRentalsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    taxNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    users?: Prisma.TenantUserUpdateManyWithoutTenantNestedInput;
    customerProfiles?: Prisma.CustomerProfileUpdateManyWithoutTenantNestedInput;
    locations?: Prisma.LocationUpdateManyWithoutTenantNestedInput;
    vehicles?: Prisma.VehicleUpdateManyWithoutTenantNestedInput;
    reservations?: Prisma.ReservationUpdateManyWithoutTenantNestedInput;
    payments?: Prisma.PaymentUpdateManyWithoutTenantNestedInput;
    maintenances?: Prisma.VehicleMaintenanceUpdateManyWithoutTenantNestedInput;
};
export type TenantUncheckedUpdateWithoutRentalsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    taxNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    users?: Prisma.TenantUserUncheckedUpdateManyWithoutTenantNestedInput;
    customerProfiles?: Prisma.CustomerProfileUncheckedUpdateManyWithoutTenantNestedInput;
    locations?: Prisma.LocationUncheckedUpdateManyWithoutTenantNestedInput;
    vehicles?: Prisma.VehicleUncheckedUpdateManyWithoutTenantNestedInput;
    reservations?: Prisma.ReservationUncheckedUpdateManyWithoutTenantNestedInput;
    payments?: Prisma.PaymentUncheckedUpdateManyWithoutTenantNestedInput;
    maintenances?: Prisma.VehicleMaintenanceUncheckedUpdateManyWithoutTenantNestedInput;
};
export type TenantCreateWithoutPaymentsInput = {
    id?: string;
    name: string;
    slug: string;
    taxNumber?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    users?: Prisma.TenantUserCreateNestedManyWithoutTenantInput;
    customerProfiles?: Prisma.CustomerProfileCreateNestedManyWithoutTenantInput;
    locations?: Prisma.LocationCreateNestedManyWithoutTenantInput;
    vehicles?: Prisma.VehicleCreateNestedManyWithoutTenantInput;
    reservations?: Prisma.ReservationCreateNestedManyWithoutTenantInput;
    rentals?: Prisma.RentalCreateNestedManyWithoutTenantInput;
    maintenances?: Prisma.VehicleMaintenanceCreateNestedManyWithoutTenantInput;
};
export type TenantUncheckedCreateWithoutPaymentsInput = {
    id?: string;
    name: string;
    slug: string;
    taxNumber?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    users?: Prisma.TenantUserUncheckedCreateNestedManyWithoutTenantInput;
    customerProfiles?: Prisma.CustomerProfileUncheckedCreateNestedManyWithoutTenantInput;
    locations?: Prisma.LocationUncheckedCreateNestedManyWithoutTenantInput;
    vehicles?: Prisma.VehicleUncheckedCreateNestedManyWithoutTenantInput;
    reservations?: Prisma.ReservationUncheckedCreateNestedManyWithoutTenantInput;
    rentals?: Prisma.RentalUncheckedCreateNestedManyWithoutTenantInput;
    maintenances?: Prisma.VehicleMaintenanceUncheckedCreateNestedManyWithoutTenantInput;
};
export type TenantCreateOrConnectWithoutPaymentsInput = {
    where: Prisma.TenantWhereUniqueInput;
    create: Prisma.XOR<Prisma.TenantCreateWithoutPaymentsInput, Prisma.TenantUncheckedCreateWithoutPaymentsInput>;
};
export type TenantUpsertWithoutPaymentsInput = {
    update: Prisma.XOR<Prisma.TenantUpdateWithoutPaymentsInput, Prisma.TenantUncheckedUpdateWithoutPaymentsInput>;
    create: Prisma.XOR<Prisma.TenantCreateWithoutPaymentsInput, Prisma.TenantUncheckedCreateWithoutPaymentsInput>;
    where?: Prisma.TenantWhereInput;
};
export type TenantUpdateToOneWithWhereWithoutPaymentsInput = {
    where?: Prisma.TenantWhereInput;
    data: Prisma.XOR<Prisma.TenantUpdateWithoutPaymentsInput, Prisma.TenantUncheckedUpdateWithoutPaymentsInput>;
};
export type TenantUpdateWithoutPaymentsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    taxNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    users?: Prisma.TenantUserUpdateManyWithoutTenantNestedInput;
    customerProfiles?: Prisma.CustomerProfileUpdateManyWithoutTenantNestedInput;
    locations?: Prisma.LocationUpdateManyWithoutTenantNestedInput;
    vehicles?: Prisma.VehicleUpdateManyWithoutTenantNestedInput;
    reservations?: Prisma.ReservationUpdateManyWithoutTenantNestedInput;
    rentals?: Prisma.RentalUpdateManyWithoutTenantNestedInput;
    maintenances?: Prisma.VehicleMaintenanceUpdateManyWithoutTenantNestedInput;
};
export type TenantUncheckedUpdateWithoutPaymentsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    taxNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    users?: Prisma.TenantUserUncheckedUpdateManyWithoutTenantNestedInput;
    customerProfiles?: Prisma.CustomerProfileUncheckedUpdateManyWithoutTenantNestedInput;
    locations?: Prisma.LocationUncheckedUpdateManyWithoutTenantNestedInput;
    vehicles?: Prisma.VehicleUncheckedUpdateManyWithoutTenantNestedInput;
    reservations?: Prisma.ReservationUncheckedUpdateManyWithoutTenantNestedInput;
    rentals?: Prisma.RentalUncheckedUpdateManyWithoutTenantNestedInput;
    maintenances?: Prisma.VehicleMaintenanceUncheckedUpdateManyWithoutTenantNestedInput;
};
export type TenantCreateWithoutMaintenancesInput = {
    id?: string;
    name: string;
    slug: string;
    taxNumber?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    users?: Prisma.TenantUserCreateNestedManyWithoutTenantInput;
    customerProfiles?: Prisma.CustomerProfileCreateNestedManyWithoutTenantInput;
    locations?: Prisma.LocationCreateNestedManyWithoutTenantInput;
    vehicles?: Prisma.VehicleCreateNestedManyWithoutTenantInput;
    reservations?: Prisma.ReservationCreateNestedManyWithoutTenantInput;
    rentals?: Prisma.RentalCreateNestedManyWithoutTenantInput;
    payments?: Prisma.PaymentCreateNestedManyWithoutTenantInput;
};
export type TenantUncheckedCreateWithoutMaintenancesInput = {
    id?: string;
    name: string;
    slug: string;
    taxNumber?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    users?: Prisma.TenantUserUncheckedCreateNestedManyWithoutTenantInput;
    customerProfiles?: Prisma.CustomerProfileUncheckedCreateNestedManyWithoutTenantInput;
    locations?: Prisma.LocationUncheckedCreateNestedManyWithoutTenantInput;
    vehicles?: Prisma.VehicleUncheckedCreateNestedManyWithoutTenantInput;
    reservations?: Prisma.ReservationUncheckedCreateNestedManyWithoutTenantInput;
    rentals?: Prisma.RentalUncheckedCreateNestedManyWithoutTenantInput;
    payments?: Prisma.PaymentUncheckedCreateNestedManyWithoutTenantInput;
};
export type TenantCreateOrConnectWithoutMaintenancesInput = {
    where: Prisma.TenantWhereUniqueInput;
    create: Prisma.XOR<Prisma.TenantCreateWithoutMaintenancesInput, Prisma.TenantUncheckedCreateWithoutMaintenancesInput>;
};
export type TenantUpsertWithoutMaintenancesInput = {
    update: Prisma.XOR<Prisma.TenantUpdateWithoutMaintenancesInput, Prisma.TenantUncheckedUpdateWithoutMaintenancesInput>;
    create: Prisma.XOR<Prisma.TenantCreateWithoutMaintenancesInput, Prisma.TenantUncheckedCreateWithoutMaintenancesInput>;
    where?: Prisma.TenantWhereInput;
};
export type TenantUpdateToOneWithWhereWithoutMaintenancesInput = {
    where?: Prisma.TenantWhereInput;
    data: Prisma.XOR<Prisma.TenantUpdateWithoutMaintenancesInput, Prisma.TenantUncheckedUpdateWithoutMaintenancesInput>;
};
export type TenantUpdateWithoutMaintenancesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    taxNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    users?: Prisma.TenantUserUpdateManyWithoutTenantNestedInput;
    customerProfiles?: Prisma.CustomerProfileUpdateManyWithoutTenantNestedInput;
    locations?: Prisma.LocationUpdateManyWithoutTenantNestedInput;
    vehicles?: Prisma.VehicleUpdateManyWithoutTenantNestedInput;
    reservations?: Prisma.ReservationUpdateManyWithoutTenantNestedInput;
    rentals?: Prisma.RentalUpdateManyWithoutTenantNestedInput;
    payments?: Prisma.PaymentUpdateManyWithoutTenantNestedInput;
};
export type TenantUncheckedUpdateWithoutMaintenancesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    taxNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    users?: Prisma.TenantUserUncheckedUpdateManyWithoutTenantNestedInput;
    customerProfiles?: Prisma.CustomerProfileUncheckedUpdateManyWithoutTenantNestedInput;
    locations?: Prisma.LocationUncheckedUpdateManyWithoutTenantNestedInput;
    vehicles?: Prisma.VehicleUncheckedUpdateManyWithoutTenantNestedInput;
    reservations?: Prisma.ReservationUncheckedUpdateManyWithoutTenantNestedInput;
    rentals?: Prisma.RentalUncheckedUpdateManyWithoutTenantNestedInput;
    payments?: Prisma.PaymentUncheckedUpdateManyWithoutTenantNestedInput;
};
export type TenantCountOutputType = {
    users: number;
    customerProfiles: number;
    locations: number;
    vehicles: number;
    reservations: number;
    rentals: number;
    payments: number;
    maintenances: number;
};
export type TenantCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    users?: boolean | TenantCountOutputTypeCountUsersArgs;
    customerProfiles?: boolean | TenantCountOutputTypeCountCustomerProfilesArgs;
    locations?: boolean | TenantCountOutputTypeCountLocationsArgs;
    vehicles?: boolean | TenantCountOutputTypeCountVehiclesArgs;
    reservations?: boolean | TenantCountOutputTypeCountReservationsArgs;
    rentals?: boolean | TenantCountOutputTypeCountRentalsArgs;
    payments?: boolean | TenantCountOutputTypeCountPaymentsArgs;
    maintenances?: boolean | TenantCountOutputTypeCountMaintenancesArgs;
};
export type TenantCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TenantCountOutputTypeSelect<ExtArgs> | null;
};
export type TenantCountOutputTypeCountUsersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TenantUserWhereInput;
};
export type TenantCountOutputTypeCountCustomerProfilesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CustomerProfileWhereInput;
};
export type TenantCountOutputTypeCountLocationsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LocationWhereInput;
};
export type TenantCountOutputTypeCountVehiclesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.VehicleWhereInput;
};
export type TenantCountOutputTypeCountReservationsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ReservationWhereInput;
};
export type TenantCountOutputTypeCountRentalsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RentalWhereInput;
};
export type TenantCountOutputTypeCountPaymentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PaymentWhereInput;
};
export type TenantCountOutputTypeCountMaintenancesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.VehicleMaintenanceWhereInput;
};
export type TenantSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    slug?: boolean;
    taxNumber?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    users?: boolean | Prisma.Tenant$usersArgs<ExtArgs>;
    customerProfiles?: boolean | Prisma.Tenant$customerProfilesArgs<ExtArgs>;
    locations?: boolean | Prisma.Tenant$locationsArgs<ExtArgs>;
    vehicles?: boolean | Prisma.Tenant$vehiclesArgs<ExtArgs>;
    reservations?: boolean | Prisma.Tenant$reservationsArgs<ExtArgs>;
    rentals?: boolean | Prisma.Tenant$rentalsArgs<ExtArgs>;
    payments?: boolean | Prisma.Tenant$paymentsArgs<ExtArgs>;
    maintenances?: boolean | Prisma.Tenant$maintenancesArgs<ExtArgs>;
    _count?: boolean | Prisma.TenantCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["tenant"]>;
export type TenantSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    slug?: boolean;
    taxNumber?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["tenant"]>;
export type TenantSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    slug?: boolean;
    taxNumber?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["tenant"]>;
export type TenantSelectScalar = {
    id?: boolean;
    name?: boolean;
    slug?: boolean;
    taxNumber?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type TenantOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "name" | "slug" | "taxNumber" | "createdAt" | "updatedAt", ExtArgs["result"]["tenant"]>;
export type TenantInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    users?: boolean | Prisma.Tenant$usersArgs<ExtArgs>;
    customerProfiles?: boolean | Prisma.Tenant$customerProfilesArgs<ExtArgs>;
    locations?: boolean | Prisma.Tenant$locationsArgs<ExtArgs>;
    vehicles?: boolean | Prisma.Tenant$vehiclesArgs<ExtArgs>;
    reservations?: boolean | Prisma.Tenant$reservationsArgs<ExtArgs>;
    rentals?: boolean | Prisma.Tenant$rentalsArgs<ExtArgs>;
    payments?: boolean | Prisma.Tenant$paymentsArgs<ExtArgs>;
    maintenances?: boolean | Prisma.Tenant$maintenancesArgs<ExtArgs>;
    _count?: boolean | Prisma.TenantCountOutputTypeDefaultArgs<ExtArgs>;
};
export type TenantIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type TenantIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $TenantPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Tenant";
    objects: {
        users: Prisma.$TenantUserPayload<ExtArgs>[];
        customerProfiles: Prisma.$CustomerProfilePayload<ExtArgs>[];
        locations: Prisma.$LocationPayload<ExtArgs>[];
        vehicles: Prisma.$VehiclePayload<ExtArgs>[];
        reservations: Prisma.$ReservationPayload<ExtArgs>[];
        rentals: Prisma.$RentalPayload<ExtArgs>[];
        payments: Prisma.$PaymentPayload<ExtArgs>[];
        maintenances: Prisma.$VehicleMaintenancePayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        name: string;
        slug: string;
        taxNumber: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["tenant"]>;
    composites: {};
};
export type TenantGetPayload<S extends boolean | null | undefined | TenantDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$TenantPayload, S>;
export type TenantCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<TenantFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: TenantCountAggregateInputType | true;
};
export interface TenantDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Tenant'];
        meta: {
            name: 'Tenant';
        };
    };
    findUnique<T extends TenantFindUniqueArgs>(args: Prisma.SelectSubset<T, TenantFindUniqueArgs<ExtArgs>>): Prisma.Prisma__TenantClient<runtime.Types.Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends TenantFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, TenantFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__TenantClient<runtime.Types.Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends TenantFindFirstArgs>(args?: Prisma.SelectSubset<T, TenantFindFirstArgs<ExtArgs>>): Prisma.Prisma__TenantClient<runtime.Types.Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends TenantFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, TenantFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__TenantClient<runtime.Types.Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends TenantFindManyArgs>(args?: Prisma.SelectSubset<T, TenantFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends TenantCreateArgs>(args: Prisma.SelectSubset<T, TenantCreateArgs<ExtArgs>>): Prisma.Prisma__TenantClient<runtime.Types.Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends TenantCreateManyArgs>(args?: Prisma.SelectSubset<T, TenantCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends TenantCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, TenantCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends TenantDeleteArgs>(args: Prisma.SelectSubset<T, TenantDeleteArgs<ExtArgs>>): Prisma.Prisma__TenantClient<runtime.Types.Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends TenantUpdateArgs>(args: Prisma.SelectSubset<T, TenantUpdateArgs<ExtArgs>>): Prisma.Prisma__TenantClient<runtime.Types.Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends TenantDeleteManyArgs>(args?: Prisma.SelectSubset<T, TenantDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends TenantUpdateManyArgs>(args: Prisma.SelectSubset<T, TenantUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends TenantUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, TenantUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends TenantUpsertArgs>(args: Prisma.SelectSubset<T, TenantUpsertArgs<ExtArgs>>): Prisma.Prisma__TenantClient<runtime.Types.Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends TenantCountArgs>(args?: Prisma.Subset<T, TenantCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], TenantCountAggregateOutputType> : number>;
    aggregate<T extends TenantAggregateArgs>(args: Prisma.Subset<T, TenantAggregateArgs>): Prisma.PrismaPromise<GetTenantAggregateType<T>>;
    groupBy<T extends TenantGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: TenantGroupByArgs['orderBy'];
    } : {
        orderBy?: TenantGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, TenantGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTenantGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: TenantFieldRefs;
}
export interface Prisma__TenantClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    users<T extends Prisma.Tenant$usersArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Tenant$usersArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TenantUserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    customerProfiles<T extends Prisma.Tenant$customerProfilesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Tenant$customerProfilesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CustomerProfilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    locations<T extends Prisma.Tenant$locationsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Tenant$locationsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    vehicles<T extends Prisma.Tenant$vehiclesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Tenant$vehiclesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$VehiclePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    reservations<T extends Prisma.Tenant$reservationsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Tenant$reservationsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    rentals<T extends Prisma.Tenant$rentalsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Tenant$rentalsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RentalPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    payments<T extends Prisma.Tenant$paymentsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Tenant$paymentsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    maintenances<T extends Prisma.Tenant$maintenancesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Tenant$maintenancesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$VehicleMaintenancePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface TenantFieldRefs {
    readonly id: Prisma.FieldRef<"Tenant", 'String'>;
    readonly name: Prisma.FieldRef<"Tenant", 'String'>;
    readonly slug: Prisma.FieldRef<"Tenant", 'String'>;
    readonly taxNumber: Prisma.FieldRef<"Tenant", 'String'>;
    readonly createdAt: Prisma.FieldRef<"Tenant", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Tenant", 'DateTime'>;
}
export type TenantFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TenantSelect<ExtArgs> | null;
    omit?: Prisma.TenantOmit<ExtArgs> | null;
    include?: Prisma.TenantInclude<ExtArgs> | null;
    where: Prisma.TenantWhereUniqueInput;
};
export type TenantFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TenantSelect<ExtArgs> | null;
    omit?: Prisma.TenantOmit<ExtArgs> | null;
    include?: Prisma.TenantInclude<ExtArgs> | null;
    where: Prisma.TenantWhereUniqueInput;
};
export type TenantFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TenantSelect<ExtArgs> | null;
    omit?: Prisma.TenantOmit<ExtArgs> | null;
    include?: Prisma.TenantInclude<ExtArgs> | null;
    where?: Prisma.TenantWhereInput;
    orderBy?: Prisma.TenantOrderByWithRelationInput | Prisma.TenantOrderByWithRelationInput[];
    cursor?: Prisma.TenantWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TenantScalarFieldEnum | Prisma.TenantScalarFieldEnum[];
};
export type TenantFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TenantSelect<ExtArgs> | null;
    omit?: Prisma.TenantOmit<ExtArgs> | null;
    include?: Prisma.TenantInclude<ExtArgs> | null;
    where?: Prisma.TenantWhereInput;
    orderBy?: Prisma.TenantOrderByWithRelationInput | Prisma.TenantOrderByWithRelationInput[];
    cursor?: Prisma.TenantWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TenantScalarFieldEnum | Prisma.TenantScalarFieldEnum[];
};
export type TenantFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TenantSelect<ExtArgs> | null;
    omit?: Prisma.TenantOmit<ExtArgs> | null;
    include?: Prisma.TenantInclude<ExtArgs> | null;
    where?: Prisma.TenantWhereInput;
    orderBy?: Prisma.TenantOrderByWithRelationInput | Prisma.TenantOrderByWithRelationInput[];
    cursor?: Prisma.TenantWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TenantScalarFieldEnum | Prisma.TenantScalarFieldEnum[];
};
export type TenantCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TenantSelect<ExtArgs> | null;
    omit?: Prisma.TenantOmit<ExtArgs> | null;
    include?: Prisma.TenantInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TenantCreateInput, Prisma.TenantUncheckedCreateInput>;
};
export type TenantCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.TenantCreateManyInput | Prisma.TenantCreateManyInput[];
    skipDuplicates?: boolean;
};
export type TenantCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TenantSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.TenantOmit<ExtArgs> | null;
    data: Prisma.TenantCreateManyInput | Prisma.TenantCreateManyInput[];
    skipDuplicates?: boolean;
};
export type TenantUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TenantSelect<ExtArgs> | null;
    omit?: Prisma.TenantOmit<ExtArgs> | null;
    include?: Prisma.TenantInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TenantUpdateInput, Prisma.TenantUncheckedUpdateInput>;
    where: Prisma.TenantWhereUniqueInput;
};
export type TenantUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.TenantUpdateManyMutationInput, Prisma.TenantUncheckedUpdateManyInput>;
    where?: Prisma.TenantWhereInput;
    limit?: number;
};
export type TenantUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TenantSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.TenantOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TenantUpdateManyMutationInput, Prisma.TenantUncheckedUpdateManyInput>;
    where?: Prisma.TenantWhereInput;
    limit?: number;
};
export type TenantUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TenantSelect<ExtArgs> | null;
    omit?: Prisma.TenantOmit<ExtArgs> | null;
    include?: Prisma.TenantInclude<ExtArgs> | null;
    where: Prisma.TenantWhereUniqueInput;
    create: Prisma.XOR<Prisma.TenantCreateInput, Prisma.TenantUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.TenantUpdateInput, Prisma.TenantUncheckedUpdateInput>;
};
export type TenantDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TenantSelect<ExtArgs> | null;
    omit?: Prisma.TenantOmit<ExtArgs> | null;
    include?: Prisma.TenantInclude<ExtArgs> | null;
    where: Prisma.TenantWhereUniqueInput;
};
export type TenantDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TenantWhereInput;
    limit?: number;
};
export type Tenant$usersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TenantUserSelect<ExtArgs> | null;
    omit?: Prisma.TenantUserOmit<ExtArgs> | null;
    include?: Prisma.TenantUserInclude<ExtArgs> | null;
    where?: Prisma.TenantUserWhereInput;
    orderBy?: Prisma.TenantUserOrderByWithRelationInput | Prisma.TenantUserOrderByWithRelationInput[];
    cursor?: Prisma.TenantUserWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TenantUserScalarFieldEnum | Prisma.TenantUserScalarFieldEnum[];
};
export type Tenant$customerProfilesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CustomerProfileSelect<ExtArgs> | null;
    omit?: Prisma.CustomerProfileOmit<ExtArgs> | null;
    include?: Prisma.CustomerProfileInclude<ExtArgs> | null;
    where?: Prisma.CustomerProfileWhereInput;
    orderBy?: Prisma.CustomerProfileOrderByWithRelationInput | Prisma.CustomerProfileOrderByWithRelationInput[];
    cursor?: Prisma.CustomerProfileWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CustomerProfileScalarFieldEnum | Prisma.CustomerProfileScalarFieldEnum[];
};
export type Tenant$locationsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type Tenant$vehiclesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VehicleSelect<ExtArgs> | null;
    omit?: Prisma.VehicleOmit<ExtArgs> | null;
    include?: Prisma.VehicleInclude<ExtArgs> | null;
    where?: Prisma.VehicleWhereInput;
    orderBy?: Prisma.VehicleOrderByWithRelationInput | Prisma.VehicleOrderByWithRelationInput[];
    cursor?: Prisma.VehicleWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.VehicleScalarFieldEnum | Prisma.VehicleScalarFieldEnum[];
};
export type Tenant$reservationsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type Tenant$rentalsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RentalSelect<ExtArgs> | null;
    omit?: Prisma.RentalOmit<ExtArgs> | null;
    include?: Prisma.RentalInclude<ExtArgs> | null;
    where?: Prisma.RentalWhereInput;
    orderBy?: Prisma.RentalOrderByWithRelationInput | Prisma.RentalOrderByWithRelationInput[];
    cursor?: Prisma.RentalWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RentalScalarFieldEnum | Prisma.RentalScalarFieldEnum[];
};
export type Tenant$paymentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PaymentSelect<ExtArgs> | null;
    omit?: Prisma.PaymentOmit<ExtArgs> | null;
    include?: Prisma.PaymentInclude<ExtArgs> | null;
    where?: Prisma.PaymentWhereInput;
    orderBy?: Prisma.PaymentOrderByWithRelationInput | Prisma.PaymentOrderByWithRelationInput[];
    cursor?: Prisma.PaymentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PaymentScalarFieldEnum | Prisma.PaymentScalarFieldEnum[];
};
export type Tenant$maintenancesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type TenantDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TenantSelect<ExtArgs> | null;
    omit?: Prisma.TenantOmit<ExtArgs> | null;
    include?: Prisma.TenantInclude<ExtArgs> | null;
};
export {};
