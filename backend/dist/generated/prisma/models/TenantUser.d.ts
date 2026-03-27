import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type TenantUserModel = runtime.Types.Result.DefaultSelection<Prisma.$TenantUserPayload>;
export type AggregateTenantUser = {
    _count: TenantUserCountAggregateOutputType | null;
    _min: TenantUserMinAggregateOutputType | null;
    _max: TenantUserMaxAggregateOutputType | null;
};
export type TenantUserMinAggregateOutputType = {
    id: string | null;
    tenantId: string | null;
    userId: string | null;
    role: $Enums.TenantUserRole | null;
    isActive: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type TenantUserMaxAggregateOutputType = {
    id: string | null;
    tenantId: string | null;
    userId: string | null;
    role: $Enums.TenantUserRole | null;
    isActive: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type TenantUserCountAggregateOutputType = {
    id: number;
    tenantId: number;
    userId: number;
    role: number;
    isActive: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type TenantUserMinAggregateInputType = {
    id?: true;
    tenantId?: true;
    userId?: true;
    role?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type TenantUserMaxAggregateInputType = {
    id?: true;
    tenantId?: true;
    userId?: true;
    role?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type TenantUserCountAggregateInputType = {
    id?: true;
    tenantId?: true;
    userId?: true;
    role?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type TenantUserAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TenantUserWhereInput;
    orderBy?: Prisma.TenantUserOrderByWithRelationInput | Prisma.TenantUserOrderByWithRelationInput[];
    cursor?: Prisma.TenantUserWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | TenantUserCountAggregateInputType;
    _min?: TenantUserMinAggregateInputType;
    _max?: TenantUserMaxAggregateInputType;
};
export type GetTenantUserAggregateType<T extends TenantUserAggregateArgs> = {
    [P in keyof T & keyof AggregateTenantUser]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateTenantUser[P]> : Prisma.GetScalarType<T[P], AggregateTenantUser[P]>;
};
export type TenantUserGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TenantUserWhereInput;
    orderBy?: Prisma.TenantUserOrderByWithAggregationInput | Prisma.TenantUserOrderByWithAggregationInput[];
    by: Prisma.TenantUserScalarFieldEnum[] | Prisma.TenantUserScalarFieldEnum;
    having?: Prisma.TenantUserScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: TenantUserCountAggregateInputType | true;
    _min?: TenantUserMinAggregateInputType;
    _max?: TenantUserMaxAggregateInputType;
};
export type TenantUserGroupByOutputType = {
    id: string;
    tenantId: string;
    userId: string;
    role: $Enums.TenantUserRole;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    _count: TenantUserCountAggregateOutputType | null;
    _min: TenantUserMinAggregateOutputType | null;
    _max: TenantUserMaxAggregateOutputType | null;
};
type GetTenantUserGroupByPayload<T extends TenantUserGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<TenantUserGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof TenantUserGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], TenantUserGroupByOutputType[P]> : Prisma.GetScalarType<T[P], TenantUserGroupByOutputType[P]>;
}>>;
export type TenantUserWhereInput = {
    AND?: Prisma.TenantUserWhereInput | Prisma.TenantUserWhereInput[];
    OR?: Prisma.TenantUserWhereInput[];
    NOT?: Prisma.TenantUserWhereInput | Prisma.TenantUserWhereInput[];
    id?: Prisma.StringFilter<"TenantUser"> | string;
    tenantId?: Prisma.StringFilter<"TenantUser"> | string;
    userId?: Prisma.StringFilter<"TenantUser"> | string;
    role?: Prisma.EnumTenantUserRoleFilter<"TenantUser"> | $Enums.TenantUserRole;
    isActive?: Prisma.BoolFilter<"TenantUser"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"TenantUser"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"TenantUser"> | Date | string;
    tenant?: Prisma.XOR<Prisma.TenantScalarRelationFilter, Prisma.TenantWhereInput>;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type TenantUserOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    tenant?: Prisma.TenantOrderByWithRelationInput;
    user?: Prisma.UserOrderByWithRelationInput;
};
export type TenantUserWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    tenantId_userId?: Prisma.TenantUserTenantIdUserIdCompoundUniqueInput;
    AND?: Prisma.TenantUserWhereInput | Prisma.TenantUserWhereInput[];
    OR?: Prisma.TenantUserWhereInput[];
    NOT?: Prisma.TenantUserWhereInput | Prisma.TenantUserWhereInput[];
    tenantId?: Prisma.StringFilter<"TenantUser"> | string;
    userId?: Prisma.StringFilter<"TenantUser"> | string;
    role?: Prisma.EnumTenantUserRoleFilter<"TenantUser"> | $Enums.TenantUserRole;
    isActive?: Prisma.BoolFilter<"TenantUser"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"TenantUser"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"TenantUser"> | Date | string;
    tenant?: Prisma.XOR<Prisma.TenantScalarRelationFilter, Prisma.TenantWhereInput>;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id" | "tenantId_userId">;
export type TenantUserOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.TenantUserCountOrderByAggregateInput;
    _max?: Prisma.TenantUserMaxOrderByAggregateInput;
    _min?: Prisma.TenantUserMinOrderByAggregateInput;
};
export type TenantUserScalarWhereWithAggregatesInput = {
    AND?: Prisma.TenantUserScalarWhereWithAggregatesInput | Prisma.TenantUserScalarWhereWithAggregatesInput[];
    OR?: Prisma.TenantUserScalarWhereWithAggregatesInput[];
    NOT?: Prisma.TenantUserScalarWhereWithAggregatesInput | Prisma.TenantUserScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"TenantUser"> | string;
    tenantId?: Prisma.StringWithAggregatesFilter<"TenantUser"> | string;
    userId?: Prisma.StringWithAggregatesFilter<"TenantUser"> | string;
    role?: Prisma.EnumTenantUserRoleWithAggregatesFilter<"TenantUser"> | $Enums.TenantUserRole;
    isActive?: Prisma.BoolWithAggregatesFilter<"TenantUser"> | boolean;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"TenantUser"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"TenantUser"> | Date | string;
};
export type TenantUserCreateInput = {
    id?: string;
    role: $Enums.TenantUserRole;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    tenant: Prisma.TenantCreateNestedOneWithoutUsersInput;
    user: Prisma.UserCreateNestedOneWithoutMembershipsInput;
};
export type TenantUserUncheckedCreateInput = {
    id?: string;
    tenantId: string;
    userId: string;
    role: $Enums.TenantUserRole;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type TenantUserUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumTenantUserRoleFieldUpdateOperationsInput | $Enums.TenantUserRole;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    tenant?: Prisma.TenantUpdateOneRequiredWithoutUsersNestedInput;
    user?: Prisma.UserUpdateOneRequiredWithoutMembershipsNestedInput;
};
export type TenantUserUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenantId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumTenantUserRoleFieldUpdateOperationsInput | $Enums.TenantUserRole;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TenantUserCreateManyInput = {
    id?: string;
    tenantId: string;
    userId: string;
    role: $Enums.TenantUserRole;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type TenantUserUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumTenantUserRoleFieldUpdateOperationsInput | $Enums.TenantUserRole;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TenantUserUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenantId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumTenantUserRoleFieldUpdateOperationsInput | $Enums.TenantUserRole;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TenantUserListRelationFilter = {
    every?: Prisma.TenantUserWhereInput;
    some?: Prisma.TenantUserWhereInput;
    none?: Prisma.TenantUserWhereInput;
};
export type TenantUserOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type TenantUserTenantIdUserIdCompoundUniqueInput = {
    tenantId: string;
    userId: string;
};
export type TenantUserCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type TenantUserMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type TenantUserMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tenantId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type TenantUserCreateNestedManyWithoutTenantInput = {
    create?: Prisma.XOR<Prisma.TenantUserCreateWithoutTenantInput, Prisma.TenantUserUncheckedCreateWithoutTenantInput> | Prisma.TenantUserCreateWithoutTenantInput[] | Prisma.TenantUserUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.TenantUserCreateOrConnectWithoutTenantInput | Prisma.TenantUserCreateOrConnectWithoutTenantInput[];
    createMany?: Prisma.TenantUserCreateManyTenantInputEnvelope;
    connect?: Prisma.TenantUserWhereUniqueInput | Prisma.TenantUserWhereUniqueInput[];
};
export type TenantUserUncheckedCreateNestedManyWithoutTenantInput = {
    create?: Prisma.XOR<Prisma.TenantUserCreateWithoutTenantInput, Prisma.TenantUserUncheckedCreateWithoutTenantInput> | Prisma.TenantUserCreateWithoutTenantInput[] | Prisma.TenantUserUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.TenantUserCreateOrConnectWithoutTenantInput | Prisma.TenantUserCreateOrConnectWithoutTenantInput[];
    createMany?: Prisma.TenantUserCreateManyTenantInputEnvelope;
    connect?: Prisma.TenantUserWhereUniqueInput | Prisma.TenantUserWhereUniqueInput[];
};
export type TenantUserUpdateManyWithoutTenantNestedInput = {
    create?: Prisma.XOR<Prisma.TenantUserCreateWithoutTenantInput, Prisma.TenantUserUncheckedCreateWithoutTenantInput> | Prisma.TenantUserCreateWithoutTenantInput[] | Prisma.TenantUserUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.TenantUserCreateOrConnectWithoutTenantInput | Prisma.TenantUserCreateOrConnectWithoutTenantInput[];
    upsert?: Prisma.TenantUserUpsertWithWhereUniqueWithoutTenantInput | Prisma.TenantUserUpsertWithWhereUniqueWithoutTenantInput[];
    createMany?: Prisma.TenantUserCreateManyTenantInputEnvelope;
    set?: Prisma.TenantUserWhereUniqueInput | Prisma.TenantUserWhereUniqueInput[];
    disconnect?: Prisma.TenantUserWhereUniqueInput | Prisma.TenantUserWhereUniqueInput[];
    delete?: Prisma.TenantUserWhereUniqueInput | Prisma.TenantUserWhereUniqueInput[];
    connect?: Prisma.TenantUserWhereUniqueInput | Prisma.TenantUserWhereUniqueInput[];
    update?: Prisma.TenantUserUpdateWithWhereUniqueWithoutTenantInput | Prisma.TenantUserUpdateWithWhereUniqueWithoutTenantInput[];
    updateMany?: Prisma.TenantUserUpdateManyWithWhereWithoutTenantInput | Prisma.TenantUserUpdateManyWithWhereWithoutTenantInput[];
    deleteMany?: Prisma.TenantUserScalarWhereInput | Prisma.TenantUserScalarWhereInput[];
};
export type TenantUserUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: Prisma.XOR<Prisma.TenantUserCreateWithoutTenantInput, Prisma.TenantUserUncheckedCreateWithoutTenantInput> | Prisma.TenantUserCreateWithoutTenantInput[] | Prisma.TenantUserUncheckedCreateWithoutTenantInput[];
    connectOrCreate?: Prisma.TenantUserCreateOrConnectWithoutTenantInput | Prisma.TenantUserCreateOrConnectWithoutTenantInput[];
    upsert?: Prisma.TenantUserUpsertWithWhereUniqueWithoutTenantInput | Prisma.TenantUserUpsertWithWhereUniqueWithoutTenantInput[];
    createMany?: Prisma.TenantUserCreateManyTenantInputEnvelope;
    set?: Prisma.TenantUserWhereUniqueInput | Prisma.TenantUserWhereUniqueInput[];
    disconnect?: Prisma.TenantUserWhereUniqueInput | Prisma.TenantUserWhereUniqueInput[];
    delete?: Prisma.TenantUserWhereUniqueInput | Prisma.TenantUserWhereUniqueInput[];
    connect?: Prisma.TenantUserWhereUniqueInput | Prisma.TenantUserWhereUniqueInput[];
    update?: Prisma.TenantUserUpdateWithWhereUniqueWithoutTenantInput | Prisma.TenantUserUpdateWithWhereUniqueWithoutTenantInput[];
    updateMany?: Prisma.TenantUserUpdateManyWithWhereWithoutTenantInput | Prisma.TenantUserUpdateManyWithWhereWithoutTenantInput[];
    deleteMany?: Prisma.TenantUserScalarWhereInput | Prisma.TenantUserScalarWhereInput[];
};
export type TenantUserCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.TenantUserCreateWithoutUserInput, Prisma.TenantUserUncheckedCreateWithoutUserInput> | Prisma.TenantUserCreateWithoutUserInput[] | Prisma.TenantUserUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.TenantUserCreateOrConnectWithoutUserInput | Prisma.TenantUserCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.TenantUserCreateManyUserInputEnvelope;
    connect?: Prisma.TenantUserWhereUniqueInput | Prisma.TenantUserWhereUniqueInput[];
};
export type TenantUserUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.TenantUserCreateWithoutUserInput, Prisma.TenantUserUncheckedCreateWithoutUserInput> | Prisma.TenantUserCreateWithoutUserInput[] | Prisma.TenantUserUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.TenantUserCreateOrConnectWithoutUserInput | Prisma.TenantUserCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.TenantUserCreateManyUserInputEnvelope;
    connect?: Prisma.TenantUserWhereUniqueInput | Prisma.TenantUserWhereUniqueInput[];
};
export type TenantUserUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.TenantUserCreateWithoutUserInput, Prisma.TenantUserUncheckedCreateWithoutUserInput> | Prisma.TenantUserCreateWithoutUserInput[] | Prisma.TenantUserUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.TenantUserCreateOrConnectWithoutUserInput | Prisma.TenantUserCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.TenantUserUpsertWithWhereUniqueWithoutUserInput | Prisma.TenantUserUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.TenantUserCreateManyUserInputEnvelope;
    set?: Prisma.TenantUserWhereUniqueInput | Prisma.TenantUserWhereUniqueInput[];
    disconnect?: Prisma.TenantUserWhereUniqueInput | Prisma.TenantUserWhereUniqueInput[];
    delete?: Prisma.TenantUserWhereUniqueInput | Prisma.TenantUserWhereUniqueInput[];
    connect?: Prisma.TenantUserWhereUniqueInput | Prisma.TenantUserWhereUniqueInput[];
    update?: Prisma.TenantUserUpdateWithWhereUniqueWithoutUserInput | Prisma.TenantUserUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.TenantUserUpdateManyWithWhereWithoutUserInput | Prisma.TenantUserUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.TenantUserScalarWhereInput | Prisma.TenantUserScalarWhereInput[];
};
export type TenantUserUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.TenantUserCreateWithoutUserInput, Prisma.TenantUserUncheckedCreateWithoutUserInput> | Prisma.TenantUserCreateWithoutUserInput[] | Prisma.TenantUserUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.TenantUserCreateOrConnectWithoutUserInput | Prisma.TenantUserCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.TenantUserUpsertWithWhereUniqueWithoutUserInput | Prisma.TenantUserUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.TenantUserCreateManyUserInputEnvelope;
    set?: Prisma.TenantUserWhereUniqueInput | Prisma.TenantUserWhereUniqueInput[];
    disconnect?: Prisma.TenantUserWhereUniqueInput | Prisma.TenantUserWhereUniqueInput[];
    delete?: Prisma.TenantUserWhereUniqueInput | Prisma.TenantUserWhereUniqueInput[];
    connect?: Prisma.TenantUserWhereUniqueInput | Prisma.TenantUserWhereUniqueInput[];
    update?: Prisma.TenantUserUpdateWithWhereUniqueWithoutUserInput | Prisma.TenantUserUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.TenantUserUpdateManyWithWhereWithoutUserInput | Prisma.TenantUserUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.TenantUserScalarWhereInput | Prisma.TenantUserScalarWhereInput[];
};
export type EnumTenantUserRoleFieldUpdateOperationsInput = {
    set?: $Enums.TenantUserRole;
};
export type TenantUserCreateWithoutTenantInput = {
    id?: string;
    role: $Enums.TenantUserRole;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutMembershipsInput;
};
export type TenantUserUncheckedCreateWithoutTenantInput = {
    id?: string;
    userId: string;
    role: $Enums.TenantUserRole;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type TenantUserCreateOrConnectWithoutTenantInput = {
    where: Prisma.TenantUserWhereUniqueInput;
    create: Prisma.XOR<Prisma.TenantUserCreateWithoutTenantInput, Prisma.TenantUserUncheckedCreateWithoutTenantInput>;
};
export type TenantUserCreateManyTenantInputEnvelope = {
    data: Prisma.TenantUserCreateManyTenantInput | Prisma.TenantUserCreateManyTenantInput[];
    skipDuplicates?: boolean;
};
export type TenantUserUpsertWithWhereUniqueWithoutTenantInput = {
    where: Prisma.TenantUserWhereUniqueInput;
    update: Prisma.XOR<Prisma.TenantUserUpdateWithoutTenantInput, Prisma.TenantUserUncheckedUpdateWithoutTenantInput>;
    create: Prisma.XOR<Prisma.TenantUserCreateWithoutTenantInput, Prisma.TenantUserUncheckedCreateWithoutTenantInput>;
};
export type TenantUserUpdateWithWhereUniqueWithoutTenantInput = {
    where: Prisma.TenantUserWhereUniqueInput;
    data: Prisma.XOR<Prisma.TenantUserUpdateWithoutTenantInput, Prisma.TenantUserUncheckedUpdateWithoutTenantInput>;
};
export type TenantUserUpdateManyWithWhereWithoutTenantInput = {
    where: Prisma.TenantUserScalarWhereInput;
    data: Prisma.XOR<Prisma.TenantUserUpdateManyMutationInput, Prisma.TenantUserUncheckedUpdateManyWithoutTenantInput>;
};
export type TenantUserScalarWhereInput = {
    AND?: Prisma.TenantUserScalarWhereInput | Prisma.TenantUserScalarWhereInput[];
    OR?: Prisma.TenantUserScalarWhereInput[];
    NOT?: Prisma.TenantUserScalarWhereInput | Prisma.TenantUserScalarWhereInput[];
    id?: Prisma.StringFilter<"TenantUser"> | string;
    tenantId?: Prisma.StringFilter<"TenantUser"> | string;
    userId?: Prisma.StringFilter<"TenantUser"> | string;
    role?: Prisma.EnumTenantUserRoleFilter<"TenantUser"> | $Enums.TenantUserRole;
    isActive?: Prisma.BoolFilter<"TenantUser"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"TenantUser"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"TenantUser"> | Date | string;
};
export type TenantUserCreateWithoutUserInput = {
    id?: string;
    role: $Enums.TenantUserRole;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    tenant: Prisma.TenantCreateNestedOneWithoutUsersInput;
};
export type TenantUserUncheckedCreateWithoutUserInput = {
    id?: string;
    tenantId: string;
    role: $Enums.TenantUserRole;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type TenantUserCreateOrConnectWithoutUserInput = {
    where: Prisma.TenantUserWhereUniqueInput;
    create: Prisma.XOR<Prisma.TenantUserCreateWithoutUserInput, Prisma.TenantUserUncheckedCreateWithoutUserInput>;
};
export type TenantUserCreateManyUserInputEnvelope = {
    data: Prisma.TenantUserCreateManyUserInput | Prisma.TenantUserCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type TenantUserUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.TenantUserWhereUniqueInput;
    update: Prisma.XOR<Prisma.TenantUserUpdateWithoutUserInput, Prisma.TenantUserUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.TenantUserCreateWithoutUserInput, Prisma.TenantUserUncheckedCreateWithoutUserInput>;
};
export type TenantUserUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.TenantUserWhereUniqueInput;
    data: Prisma.XOR<Prisma.TenantUserUpdateWithoutUserInput, Prisma.TenantUserUncheckedUpdateWithoutUserInput>;
};
export type TenantUserUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.TenantUserScalarWhereInput;
    data: Prisma.XOR<Prisma.TenantUserUpdateManyMutationInput, Prisma.TenantUserUncheckedUpdateManyWithoutUserInput>;
};
export type TenantUserCreateManyTenantInput = {
    id?: string;
    userId: string;
    role: $Enums.TenantUserRole;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type TenantUserUpdateWithoutTenantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumTenantUserRoleFieldUpdateOperationsInput | $Enums.TenantUserRole;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutMembershipsNestedInput;
};
export type TenantUserUncheckedUpdateWithoutTenantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumTenantUserRoleFieldUpdateOperationsInput | $Enums.TenantUserRole;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TenantUserUncheckedUpdateManyWithoutTenantInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumTenantUserRoleFieldUpdateOperationsInput | $Enums.TenantUserRole;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TenantUserCreateManyUserInput = {
    id?: string;
    tenantId: string;
    role: $Enums.TenantUserRole;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type TenantUserUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumTenantUserRoleFieldUpdateOperationsInput | $Enums.TenantUserRole;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    tenant?: Prisma.TenantUpdateOneRequiredWithoutUsersNestedInput;
};
export type TenantUserUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenantId?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumTenantUserRoleFieldUpdateOperationsInput | $Enums.TenantUserRole;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TenantUserUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenantId?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumTenantUserRoleFieldUpdateOperationsInput | $Enums.TenantUserRole;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TenantUserSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tenantId?: boolean;
    userId?: boolean;
    role?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["tenantUser"]>;
export type TenantUserSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tenantId?: boolean;
    userId?: boolean;
    role?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["tenantUser"]>;
export type TenantUserSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tenantId?: boolean;
    userId?: boolean;
    role?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["tenantUser"]>;
export type TenantUserSelectScalar = {
    id?: boolean;
    tenantId?: boolean;
    userId?: boolean;
    role?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type TenantUserOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "tenantId" | "userId" | "role" | "isActive" | "createdAt" | "updatedAt", ExtArgs["result"]["tenantUser"]>;
export type TenantUserInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type TenantUserIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type TenantUserIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tenant?: boolean | Prisma.TenantDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $TenantUserPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "TenantUser";
    objects: {
        tenant: Prisma.$TenantPayload<ExtArgs>;
        user: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        tenantId: string;
        userId: string;
        role: $Enums.TenantUserRole;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["tenantUser"]>;
    composites: {};
};
export type TenantUserGetPayload<S extends boolean | null | undefined | TenantUserDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$TenantUserPayload, S>;
export type TenantUserCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<TenantUserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: TenantUserCountAggregateInputType | true;
};
export interface TenantUserDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['TenantUser'];
        meta: {
            name: 'TenantUser';
        };
    };
    findUnique<T extends TenantUserFindUniqueArgs>(args: Prisma.SelectSubset<T, TenantUserFindUniqueArgs<ExtArgs>>): Prisma.Prisma__TenantUserClient<runtime.Types.Result.GetResult<Prisma.$TenantUserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends TenantUserFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, TenantUserFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__TenantUserClient<runtime.Types.Result.GetResult<Prisma.$TenantUserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends TenantUserFindFirstArgs>(args?: Prisma.SelectSubset<T, TenantUserFindFirstArgs<ExtArgs>>): Prisma.Prisma__TenantUserClient<runtime.Types.Result.GetResult<Prisma.$TenantUserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends TenantUserFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, TenantUserFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__TenantUserClient<runtime.Types.Result.GetResult<Prisma.$TenantUserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends TenantUserFindManyArgs>(args?: Prisma.SelectSubset<T, TenantUserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TenantUserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends TenantUserCreateArgs>(args: Prisma.SelectSubset<T, TenantUserCreateArgs<ExtArgs>>): Prisma.Prisma__TenantUserClient<runtime.Types.Result.GetResult<Prisma.$TenantUserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends TenantUserCreateManyArgs>(args?: Prisma.SelectSubset<T, TenantUserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends TenantUserCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, TenantUserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TenantUserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends TenantUserDeleteArgs>(args: Prisma.SelectSubset<T, TenantUserDeleteArgs<ExtArgs>>): Prisma.Prisma__TenantUserClient<runtime.Types.Result.GetResult<Prisma.$TenantUserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends TenantUserUpdateArgs>(args: Prisma.SelectSubset<T, TenantUserUpdateArgs<ExtArgs>>): Prisma.Prisma__TenantUserClient<runtime.Types.Result.GetResult<Prisma.$TenantUserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends TenantUserDeleteManyArgs>(args?: Prisma.SelectSubset<T, TenantUserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends TenantUserUpdateManyArgs>(args: Prisma.SelectSubset<T, TenantUserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends TenantUserUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, TenantUserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TenantUserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends TenantUserUpsertArgs>(args: Prisma.SelectSubset<T, TenantUserUpsertArgs<ExtArgs>>): Prisma.Prisma__TenantUserClient<runtime.Types.Result.GetResult<Prisma.$TenantUserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends TenantUserCountArgs>(args?: Prisma.Subset<T, TenantUserCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], TenantUserCountAggregateOutputType> : number>;
    aggregate<T extends TenantUserAggregateArgs>(args: Prisma.Subset<T, TenantUserAggregateArgs>): Prisma.PrismaPromise<GetTenantUserAggregateType<T>>;
    groupBy<T extends TenantUserGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: TenantUserGroupByArgs['orderBy'];
    } : {
        orderBy?: TenantUserGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, TenantUserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTenantUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: TenantUserFieldRefs;
}
export interface Prisma__TenantUserClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    tenant<T extends Prisma.TenantDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.TenantDefaultArgs<ExtArgs>>): Prisma.Prisma__TenantClient<runtime.Types.Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface TenantUserFieldRefs {
    readonly id: Prisma.FieldRef<"TenantUser", 'String'>;
    readonly tenantId: Prisma.FieldRef<"TenantUser", 'String'>;
    readonly userId: Prisma.FieldRef<"TenantUser", 'String'>;
    readonly role: Prisma.FieldRef<"TenantUser", 'TenantUserRole'>;
    readonly isActive: Prisma.FieldRef<"TenantUser", 'Boolean'>;
    readonly createdAt: Prisma.FieldRef<"TenantUser", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"TenantUser", 'DateTime'>;
}
export type TenantUserFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TenantUserSelect<ExtArgs> | null;
    omit?: Prisma.TenantUserOmit<ExtArgs> | null;
    include?: Prisma.TenantUserInclude<ExtArgs> | null;
    where: Prisma.TenantUserWhereUniqueInput;
};
export type TenantUserFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TenantUserSelect<ExtArgs> | null;
    omit?: Prisma.TenantUserOmit<ExtArgs> | null;
    include?: Prisma.TenantUserInclude<ExtArgs> | null;
    where: Prisma.TenantUserWhereUniqueInput;
};
export type TenantUserFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type TenantUserFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type TenantUserFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type TenantUserCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TenantUserSelect<ExtArgs> | null;
    omit?: Prisma.TenantUserOmit<ExtArgs> | null;
    include?: Prisma.TenantUserInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TenantUserCreateInput, Prisma.TenantUserUncheckedCreateInput>;
};
export type TenantUserCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.TenantUserCreateManyInput | Prisma.TenantUserCreateManyInput[];
    skipDuplicates?: boolean;
};
export type TenantUserCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TenantUserSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.TenantUserOmit<ExtArgs> | null;
    data: Prisma.TenantUserCreateManyInput | Prisma.TenantUserCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.TenantUserIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type TenantUserUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TenantUserSelect<ExtArgs> | null;
    omit?: Prisma.TenantUserOmit<ExtArgs> | null;
    include?: Prisma.TenantUserInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TenantUserUpdateInput, Prisma.TenantUserUncheckedUpdateInput>;
    where: Prisma.TenantUserWhereUniqueInput;
};
export type TenantUserUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.TenantUserUpdateManyMutationInput, Prisma.TenantUserUncheckedUpdateManyInput>;
    where?: Prisma.TenantUserWhereInput;
    limit?: number;
};
export type TenantUserUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TenantUserSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.TenantUserOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TenantUserUpdateManyMutationInput, Prisma.TenantUserUncheckedUpdateManyInput>;
    where?: Prisma.TenantUserWhereInput;
    limit?: number;
    include?: Prisma.TenantUserIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type TenantUserUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TenantUserSelect<ExtArgs> | null;
    omit?: Prisma.TenantUserOmit<ExtArgs> | null;
    include?: Prisma.TenantUserInclude<ExtArgs> | null;
    where: Prisma.TenantUserWhereUniqueInput;
    create: Prisma.XOR<Prisma.TenantUserCreateInput, Prisma.TenantUserUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.TenantUserUpdateInput, Prisma.TenantUserUncheckedUpdateInput>;
};
export type TenantUserDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TenantUserSelect<ExtArgs> | null;
    omit?: Prisma.TenantUserOmit<ExtArgs> | null;
    include?: Prisma.TenantUserInclude<ExtArgs> | null;
    where: Prisma.TenantUserWhereUniqueInput;
};
export type TenantUserDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TenantUserWhereInput;
    limit?: number;
};
export type TenantUserDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TenantUserSelect<ExtArgs> | null;
    omit?: Prisma.TenantUserOmit<ExtArgs> | null;
    include?: Prisma.TenantUserInclude<ExtArgs> | null;
};
export {};
