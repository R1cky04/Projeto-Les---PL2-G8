import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type StationModel = runtime.Types.Result.DefaultSelection<Prisma.$StationPayload>;
export type AggregateStation = {
    _count: StationCountAggregateOutputType | null;
    _avg: StationAvgAggregateOutputType | null;
    _sum: StationSumAggregateOutputType | null;
    _min: StationMinAggregateOutputType | null;
    _max: StationMaxAggregateOutputType | null;
};
export type StationAvgAggregateOutputType = {
    id: number | null;
    capacity: number | null;
};
export type StationSumAggregateOutputType = {
    id: number | null;
    capacity: number | null;
};
export type StationMinAggregateOutputType = {
    id: number | null;
    name: string | null;
    location: string | null;
    capacity: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    createdBy: string | null;
};
export type StationMaxAggregateOutputType = {
    id: number | null;
    name: string | null;
    location: string | null;
    capacity: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    createdBy: string | null;
};
export type StationCountAggregateOutputType = {
    id: number;
    name: number;
    location: number;
    capacity: number;
    createdAt: number;
    updatedAt: number;
    createdBy: number;
    _all: number;
};
export type StationAvgAggregateInputType = {
    id?: true;
    capacity?: true;
};
export type StationSumAggregateInputType = {
    id?: true;
    capacity?: true;
};
export type StationMinAggregateInputType = {
    id?: true;
    name?: true;
    location?: true;
    capacity?: true;
    createdAt?: true;
    updatedAt?: true;
    createdBy?: true;
};
export type StationMaxAggregateInputType = {
    id?: true;
    name?: true;
    location?: true;
    capacity?: true;
    createdAt?: true;
    updatedAt?: true;
    createdBy?: true;
};
export type StationCountAggregateInputType = {
    id?: true;
    name?: true;
    location?: true;
    capacity?: true;
    createdAt?: true;
    updatedAt?: true;
    createdBy?: true;
    _all?: true;
};
export type StationAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StationWhereInput;
    orderBy?: Prisma.StationOrderByWithRelationInput | Prisma.StationOrderByWithRelationInput[];
    cursor?: Prisma.StationWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | StationCountAggregateInputType;
    _avg?: StationAvgAggregateInputType;
    _sum?: StationSumAggregateInputType;
    _min?: StationMinAggregateInputType;
    _max?: StationMaxAggregateInputType;
};
export type GetStationAggregateType<T extends StationAggregateArgs> = {
    [P in keyof T & keyof AggregateStation]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateStation[P]> : Prisma.GetScalarType<T[P], AggregateStation[P]>;
};
export type StationGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StationWhereInput;
    orderBy?: Prisma.StationOrderByWithAggregationInput | Prisma.StationOrderByWithAggregationInput[];
    by: Prisma.StationScalarFieldEnum[] | Prisma.StationScalarFieldEnum;
    having?: Prisma.StationScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: StationCountAggregateInputType | true;
    _avg?: StationAvgAggregateInputType;
    _sum?: StationSumAggregateInputType;
    _min?: StationMinAggregateInputType;
    _max?: StationMaxAggregateInputType;
};
export type StationGroupByOutputType = {
    id: number;
    name: string;
    location: string;
    capacity: number;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string | null;
    _count: StationCountAggregateOutputType | null;
    _avg: StationAvgAggregateOutputType | null;
    _sum: StationSumAggregateOutputType | null;
    _min: StationMinAggregateOutputType | null;
    _max: StationMaxAggregateOutputType | null;
};
type GetStationGroupByPayload<T extends StationGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<StationGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof StationGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], StationGroupByOutputType[P]> : Prisma.GetScalarType<T[P], StationGroupByOutputType[P]>;
}>>;
export type StationWhereInput = {
    AND?: Prisma.StationWhereInput | Prisma.StationWhereInput[];
    OR?: Prisma.StationWhereInput[];
    NOT?: Prisma.StationWhereInput | Prisma.StationWhereInput[];
    id?: Prisma.IntFilter<"Station"> | number;
    name?: Prisma.StringFilter<"Station"> | string;
    location?: Prisma.StringFilter<"Station"> | string;
    capacity?: Prisma.IntFilter<"Station"> | number;
    createdAt?: Prisma.DateTimeFilter<"Station"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Station"> | Date | string;
    createdBy?: Prisma.StringNullableFilter<"Station"> | string | null;
};
export type StationOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    location?: Prisma.SortOrder;
    capacity?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrderInput | Prisma.SortOrder;
};
export type StationWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    name?: string;
    AND?: Prisma.StationWhereInput | Prisma.StationWhereInput[];
    OR?: Prisma.StationWhereInput[];
    NOT?: Prisma.StationWhereInput | Prisma.StationWhereInput[];
    location?: Prisma.StringFilter<"Station"> | string;
    capacity?: Prisma.IntFilter<"Station"> | number;
    createdAt?: Prisma.DateTimeFilter<"Station"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Station"> | Date | string;
    createdBy?: Prisma.StringNullableFilter<"Station"> | string | null;
}, "id" | "name">;
export type StationOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    location?: Prisma.SortOrder;
    capacity?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.StationCountOrderByAggregateInput;
    _avg?: Prisma.StationAvgOrderByAggregateInput;
    _max?: Prisma.StationMaxOrderByAggregateInput;
    _min?: Prisma.StationMinOrderByAggregateInput;
    _sum?: Prisma.StationSumOrderByAggregateInput;
};
export type StationScalarWhereWithAggregatesInput = {
    AND?: Prisma.StationScalarWhereWithAggregatesInput | Prisma.StationScalarWhereWithAggregatesInput[];
    OR?: Prisma.StationScalarWhereWithAggregatesInput[];
    NOT?: Prisma.StationScalarWhereWithAggregatesInput | Prisma.StationScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"Station"> | number;
    name?: Prisma.StringWithAggregatesFilter<"Station"> | string;
    location?: Prisma.StringWithAggregatesFilter<"Station"> | string;
    capacity?: Prisma.IntWithAggregatesFilter<"Station"> | number;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Station"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Station"> | Date | string;
    createdBy?: Prisma.StringNullableWithAggregatesFilter<"Station"> | string | null;
};
export type StationCreateInput = {
    name: string;
    location: string;
    capacity: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    createdBy?: string | null;
};
export type StationUncheckedCreateInput = {
    id?: number;
    name: string;
    location: string;
    capacity: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    createdBy?: string | null;
};
export type StationUpdateInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    location?: Prisma.StringFieldUpdateOperationsInput | string;
    capacity?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type StationUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    location?: Prisma.StringFieldUpdateOperationsInput | string;
    capacity?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type StationCreateManyInput = {
    id?: number;
    name: string;
    location: string;
    capacity: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    createdBy?: string | null;
};
export type StationUpdateManyMutationInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    location?: Prisma.StringFieldUpdateOperationsInput | string;
    capacity?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type StationUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    location?: Prisma.StringFieldUpdateOperationsInput | string;
    capacity?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type StationCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    location?: Prisma.SortOrder;
    capacity?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
};
export type StationAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    capacity?: Prisma.SortOrder;
};
export type StationMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    location?: Prisma.SortOrder;
    capacity?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
};
export type StationMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    location?: Prisma.SortOrder;
    capacity?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
};
export type StationSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    capacity?: Prisma.SortOrder;
};
export type StringFieldUpdateOperationsInput = {
    set?: string;
};
export type IntFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string;
};
export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null;
};
export type StationSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    location?: boolean;
    capacity?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    createdBy?: boolean;
}, ExtArgs["result"]["station"]>;
export type StationSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    location?: boolean;
    capacity?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    createdBy?: boolean;
}, ExtArgs["result"]["station"]>;
export type StationSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    location?: boolean;
    capacity?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    createdBy?: boolean;
}, ExtArgs["result"]["station"]>;
export type StationSelectScalar = {
    id?: boolean;
    name?: boolean;
    location?: boolean;
    capacity?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    createdBy?: boolean;
};
export type StationOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "name" | "location" | "capacity" | "createdAt" | "updatedAt" | "createdBy", ExtArgs["result"]["station"]>;
export type $StationPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Station";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        name: string;
        location: string;
        capacity: number;
        createdAt: Date;
        updatedAt: Date;
        createdBy: string | null;
    }, ExtArgs["result"]["station"]>;
    composites: {};
};
export type StationGetPayload<S extends boolean | null | undefined | StationDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$StationPayload, S>;
export type StationCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<StationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: StationCountAggregateInputType | true;
};
export interface StationDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Station'];
        meta: {
            name: 'Station';
        };
    };
    findUnique<T extends StationFindUniqueArgs>(args: Prisma.SelectSubset<T, StationFindUniqueArgs<ExtArgs>>): Prisma.Prisma__StationClient<runtime.Types.Result.GetResult<Prisma.$StationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends StationFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, StationFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__StationClient<runtime.Types.Result.GetResult<Prisma.$StationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends StationFindFirstArgs>(args?: Prisma.SelectSubset<T, StationFindFirstArgs<ExtArgs>>): Prisma.Prisma__StationClient<runtime.Types.Result.GetResult<Prisma.$StationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends StationFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, StationFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__StationClient<runtime.Types.Result.GetResult<Prisma.$StationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends StationFindManyArgs>(args?: Prisma.SelectSubset<T, StationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends StationCreateArgs>(args: Prisma.SelectSubset<T, StationCreateArgs<ExtArgs>>): Prisma.Prisma__StationClient<runtime.Types.Result.GetResult<Prisma.$StationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends StationCreateManyArgs>(args?: Prisma.SelectSubset<T, StationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends StationCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, StationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends StationDeleteArgs>(args: Prisma.SelectSubset<T, StationDeleteArgs<ExtArgs>>): Prisma.Prisma__StationClient<runtime.Types.Result.GetResult<Prisma.$StationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends StationUpdateArgs>(args: Prisma.SelectSubset<T, StationUpdateArgs<ExtArgs>>): Prisma.Prisma__StationClient<runtime.Types.Result.GetResult<Prisma.$StationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends StationDeleteManyArgs>(args?: Prisma.SelectSubset<T, StationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends StationUpdateManyArgs>(args: Prisma.SelectSubset<T, StationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends StationUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, StationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends StationUpsertArgs>(args: Prisma.SelectSubset<T, StationUpsertArgs<ExtArgs>>): Prisma.Prisma__StationClient<runtime.Types.Result.GetResult<Prisma.$StationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends StationCountArgs>(args?: Prisma.Subset<T, StationCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], StationCountAggregateOutputType> : number>;
    aggregate<T extends StationAggregateArgs>(args: Prisma.Subset<T, StationAggregateArgs>): Prisma.PrismaPromise<GetStationAggregateType<T>>;
    groupBy<T extends StationGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: StationGroupByArgs['orderBy'];
    } : {
        orderBy?: StationGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, StationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: StationFieldRefs;
}
export interface Prisma__StationClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface StationFieldRefs {
    readonly id: Prisma.FieldRef<"Station", 'Int'>;
    readonly name: Prisma.FieldRef<"Station", 'String'>;
    readonly location: Prisma.FieldRef<"Station", 'String'>;
    readonly capacity: Prisma.FieldRef<"Station", 'Int'>;
    readonly createdAt: Prisma.FieldRef<"Station", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Station", 'DateTime'>;
    readonly createdBy: Prisma.FieldRef<"Station", 'String'>;
}
export type StationFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StationSelect<ExtArgs> | null;
    omit?: Prisma.StationOmit<ExtArgs> | null;
    where: Prisma.StationWhereUniqueInput;
};
export type StationFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StationSelect<ExtArgs> | null;
    omit?: Prisma.StationOmit<ExtArgs> | null;
    where: Prisma.StationWhereUniqueInput;
};
export type StationFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StationSelect<ExtArgs> | null;
    omit?: Prisma.StationOmit<ExtArgs> | null;
    where?: Prisma.StationWhereInput;
    orderBy?: Prisma.StationOrderByWithRelationInput | Prisma.StationOrderByWithRelationInput[];
    cursor?: Prisma.StationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.StationScalarFieldEnum | Prisma.StationScalarFieldEnum[];
};
export type StationFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StationSelect<ExtArgs> | null;
    omit?: Prisma.StationOmit<ExtArgs> | null;
    where?: Prisma.StationWhereInput;
    orderBy?: Prisma.StationOrderByWithRelationInput | Prisma.StationOrderByWithRelationInput[];
    cursor?: Prisma.StationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.StationScalarFieldEnum | Prisma.StationScalarFieldEnum[];
};
export type StationFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StationSelect<ExtArgs> | null;
    omit?: Prisma.StationOmit<ExtArgs> | null;
    where?: Prisma.StationWhereInput;
    orderBy?: Prisma.StationOrderByWithRelationInput | Prisma.StationOrderByWithRelationInput[];
    cursor?: Prisma.StationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.StationScalarFieldEnum | Prisma.StationScalarFieldEnum[];
};
export type StationCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StationSelect<ExtArgs> | null;
    omit?: Prisma.StationOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.StationCreateInput, Prisma.StationUncheckedCreateInput>;
};
export type StationCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.StationCreateManyInput | Prisma.StationCreateManyInput[];
    skipDuplicates?: boolean;
};
export type StationCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StationSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.StationOmit<ExtArgs> | null;
    data: Prisma.StationCreateManyInput | Prisma.StationCreateManyInput[];
    skipDuplicates?: boolean;
};
export type StationUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StationSelect<ExtArgs> | null;
    omit?: Prisma.StationOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.StationUpdateInput, Prisma.StationUncheckedUpdateInput>;
    where: Prisma.StationWhereUniqueInput;
};
export type StationUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.StationUpdateManyMutationInput, Prisma.StationUncheckedUpdateManyInput>;
    where?: Prisma.StationWhereInput;
    limit?: number;
};
export type StationUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StationSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.StationOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.StationUpdateManyMutationInput, Prisma.StationUncheckedUpdateManyInput>;
    where?: Prisma.StationWhereInput;
    limit?: number;
};
export type StationUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StationSelect<ExtArgs> | null;
    omit?: Prisma.StationOmit<ExtArgs> | null;
    where: Prisma.StationWhereUniqueInput;
    create: Prisma.XOR<Prisma.StationCreateInput, Prisma.StationUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.StationUpdateInput, Prisma.StationUncheckedUpdateInput>;
};
export type StationDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StationSelect<ExtArgs> | null;
    omit?: Prisma.StationOmit<ExtArgs> | null;
    where: Prisma.StationWhereUniqueInput;
};
export type StationDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StationWhereInput;
    limit?: number;
};
export type StationDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StationSelect<ExtArgs> | null;
    omit?: Prisma.StationOmit<ExtArgs> | null;
};
export {};
