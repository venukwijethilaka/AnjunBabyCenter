import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
/**
 * Model LoyaltyLevel
 *
 */
export type LoyaltyLevelModel = runtime.Types.Result.DefaultSelection<Prisma.$LoyaltyLevelPayload>;
export type AggregateLoyaltyLevel = {
    _count: LoyaltyLevelCountAggregateOutputType | null;
    _avg: LoyaltyLevelAvgAggregateOutputType | null;
    _sum: LoyaltyLevelSumAggregateOutputType | null;
    _min: LoyaltyLevelMinAggregateOutputType | null;
    _max: LoyaltyLevelMaxAggregateOutputType | null;
};
export type LoyaltyLevelAvgAggregateOutputType = {
    id: number | null;
    minPoints: number | null;
    discount: number | null;
};
export type LoyaltyLevelSumAggregateOutputType = {
    id: number | null;
    minPoints: number | null;
    discount: number | null;
};
export type LoyaltyLevelMinAggregateOutputType = {
    id: number | null;
    name: string | null;
    minPoints: number | null;
    color: string | null;
    badgeColor: string | null;
    updatedAt: Date | null;
    discount: number | null;
};
export type LoyaltyLevelMaxAggregateOutputType = {
    id: number | null;
    name: string | null;
    minPoints: number | null;
    color: string | null;
    badgeColor: string | null;
    updatedAt: Date | null;
    discount: number | null;
};
export type LoyaltyLevelCountAggregateOutputType = {
    id: number;
    name: number;
    minPoints: number;
    color: number;
    badgeColor: number;
    updatedAt: number;
    discount: number;
    _all: number;
};
export type LoyaltyLevelAvgAggregateInputType = {
    id?: true;
    minPoints?: true;
    discount?: true;
};
export type LoyaltyLevelSumAggregateInputType = {
    id?: true;
    minPoints?: true;
    discount?: true;
};
export type LoyaltyLevelMinAggregateInputType = {
    id?: true;
    name?: true;
    minPoints?: true;
    color?: true;
    badgeColor?: true;
    updatedAt?: true;
    discount?: true;
};
export type LoyaltyLevelMaxAggregateInputType = {
    id?: true;
    name?: true;
    minPoints?: true;
    color?: true;
    badgeColor?: true;
    updatedAt?: true;
    discount?: true;
};
export type LoyaltyLevelCountAggregateInputType = {
    id?: true;
    name?: true;
    minPoints?: true;
    color?: true;
    badgeColor?: true;
    updatedAt?: true;
    discount?: true;
    _all?: true;
};
export type LoyaltyLevelAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which LoyaltyLevel to aggregate.
     */
    where?: Prisma.LoyaltyLevelWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of LoyaltyLevels to fetch.
     */
    orderBy?: Prisma.LoyaltyLevelOrderByWithRelationInput | Prisma.LoyaltyLevelOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.LoyaltyLevelWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` LoyaltyLevels from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` LoyaltyLevels.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned LoyaltyLevels
    **/
    _count?: true | LoyaltyLevelCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: LoyaltyLevelAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: LoyaltyLevelSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: LoyaltyLevelMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: LoyaltyLevelMaxAggregateInputType;
};
export type GetLoyaltyLevelAggregateType<T extends LoyaltyLevelAggregateArgs> = {
    [P in keyof T & keyof AggregateLoyaltyLevel]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateLoyaltyLevel[P]> : Prisma.GetScalarType<T[P], AggregateLoyaltyLevel[P]>;
};
export type LoyaltyLevelGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LoyaltyLevelWhereInput;
    orderBy?: Prisma.LoyaltyLevelOrderByWithAggregationInput | Prisma.LoyaltyLevelOrderByWithAggregationInput[];
    by: Prisma.LoyaltyLevelScalarFieldEnum[] | Prisma.LoyaltyLevelScalarFieldEnum;
    having?: Prisma.LoyaltyLevelScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: LoyaltyLevelCountAggregateInputType | true;
    _avg?: LoyaltyLevelAvgAggregateInputType;
    _sum?: LoyaltyLevelSumAggregateInputType;
    _min?: LoyaltyLevelMinAggregateInputType;
    _max?: LoyaltyLevelMaxAggregateInputType;
};
export type LoyaltyLevelGroupByOutputType = {
    id: number;
    name: string;
    minPoints: number;
    color: string;
    badgeColor: string;
    updatedAt: Date;
    discount: number;
    _count: LoyaltyLevelCountAggregateOutputType | null;
    _avg: LoyaltyLevelAvgAggregateOutputType | null;
    _sum: LoyaltyLevelSumAggregateOutputType | null;
    _min: LoyaltyLevelMinAggregateOutputType | null;
    _max: LoyaltyLevelMaxAggregateOutputType | null;
};
type GetLoyaltyLevelGroupByPayload<T extends LoyaltyLevelGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<LoyaltyLevelGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof LoyaltyLevelGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], LoyaltyLevelGroupByOutputType[P]> : Prisma.GetScalarType<T[P], LoyaltyLevelGroupByOutputType[P]>;
}>>;
export type LoyaltyLevelWhereInput = {
    AND?: Prisma.LoyaltyLevelWhereInput | Prisma.LoyaltyLevelWhereInput[];
    OR?: Prisma.LoyaltyLevelWhereInput[];
    NOT?: Prisma.LoyaltyLevelWhereInput | Prisma.LoyaltyLevelWhereInput[];
    id?: Prisma.IntFilter<"LoyaltyLevel"> | number;
    name?: Prisma.StringFilter<"LoyaltyLevel"> | string;
    minPoints?: Prisma.IntFilter<"LoyaltyLevel"> | number;
    color?: Prisma.StringFilter<"LoyaltyLevel"> | string;
    badgeColor?: Prisma.StringFilter<"LoyaltyLevel"> | string;
    updatedAt?: Prisma.DateTimeFilter<"LoyaltyLevel"> | Date | string;
    discount?: Prisma.IntFilter<"LoyaltyLevel"> | number;
};
export type LoyaltyLevelOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    minPoints?: Prisma.SortOrder;
    color?: Prisma.SortOrder;
    badgeColor?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    discount?: Prisma.SortOrder;
};
export type LoyaltyLevelWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    name?: string;
    AND?: Prisma.LoyaltyLevelWhereInput | Prisma.LoyaltyLevelWhereInput[];
    OR?: Prisma.LoyaltyLevelWhereInput[];
    NOT?: Prisma.LoyaltyLevelWhereInput | Prisma.LoyaltyLevelWhereInput[];
    minPoints?: Prisma.IntFilter<"LoyaltyLevel"> | number;
    color?: Prisma.StringFilter<"LoyaltyLevel"> | string;
    badgeColor?: Prisma.StringFilter<"LoyaltyLevel"> | string;
    updatedAt?: Prisma.DateTimeFilter<"LoyaltyLevel"> | Date | string;
    discount?: Prisma.IntFilter<"LoyaltyLevel"> | number;
}, "id" | "name">;
export type LoyaltyLevelOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    minPoints?: Prisma.SortOrder;
    color?: Prisma.SortOrder;
    badgeColor?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    discount?: Prisma.SortOrder;
    _count?: Prisma.LoyaltyLevelCountOrderByAggregateInput;
    _avg?: Prisma.LoyaltyLevelAvgOrderByAggregateInput;
    _max?: Prisma.LoyaltyLevelMaxOrderByAggregateInput;
    _min?: Prisma.LoyaltyLevelMinOrderByAggregateInput;
    _sum?: Prisma.LoyaltyLevelSumOrderByAggregateInput;
};
export type LoyaltyLevelScalarWhereWithAggregatesInput = {
    AND?: Prisma.LoyaltyLevelScalarWhereWithAggregatesInput | Prisma.LoyaltyLevelScalarWhereWithAggregatesInput[];
    OR?: Prisma.LoyaltyLevelScalarWhereWithAggregatesInput[];
    NOT?: Prisma.LoyaltyLevelScalarWhereWithAggregatesInput | Prisma.LoyaltyLevelScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"LoyaltyLevel"> | number;
    name?: Prisma.StringWithAggregatesFilter<"LoyaltyLevel"> | string;
    minPoints?: Prisma.IntWithAggregatesFilter<"LoyaltyLevel"> | number;
    color?: Prisma.StringWithAggregatesFilter<"LoyaltyLevel"> | string;
    badgeColor?: Prisma.StringWithAggregatesFilter<"LoyaltyLevel"> | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"LoyaltyLevel"> | Date | string;
    discount?: Prisma.IntWithAggregatesFilter<"LoyaltyLevel"> | number;
};
export type LoyaltyLevelCreateInput = {
    name: string;
    minPoints: number;
    color: string;
    badgeColor: string;
    updatedAt?: Date | string;
    discount?: number;
};
export type LoyaltyLevelUncheckedCreateInput = {
    id?: number;
    name: string;
    minPoints: number;
    color: string;
    badgeColor: string;
    updatedAt?: Date | string;
    discount?: number;
};
export type LoyaltyLevelUpdateInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    minPoints?: Prisma.IntFieldUpdateOperationsInput | number;
    color?: Prisma.StringFieldUpdateOperationsInput | string;
    badgeColor?: Prisma.StringFieldUpdateOperationsInput | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    discount?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type LoyaltyLevelUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    minPoints?: Prisma.IntFieldUpdateOperationsInput | number;
    color?: Prisma.StringFieldUpdateOperationsInput | string;
    badgeColor?: Prisma.StringFieldUpdateOperationsInput | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    discount?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type LoyaltyLevelCreateManyInput = {
    id?: number;
    name: string;
    minPoints: number;
    color: string;
    badgeColor: string;
    updatedAt?: Date | string;
    discount?: number;
};
export type LoyaltyLevelUpdateManyMutationInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    minPoints?: Prisma.IntFieldUpdateOperationsInput | number;
    color?: Prisma.StringFieldUpdateOperationsInput | string;
    badgeColor?: Prisma.StringFieldUpdateOperationsInput | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    discount?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type LoyaltyLevelUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    minPoints?: Prisma.IntFieldUpdateOperationsInput | number;
    color?: Prisma.StringFieldUpdateOperationsInput | string;
    badgeColor?: Prisma.StringFieldUpdateOperationsInput | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    discount?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type LoyaltyLevelCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    minPoints?: Prisma.SortOrder;
    color?: Prisma.SortOrder;
    badgeColor?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    discount?: Prisma.SortOrder;
};
export type LoyaltyLevelAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    minPoints?: Prisma.SortOrder;
    discount?: Prisma.SortOrder;
};
export type LoyaltyLevelMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    minPoints?: Prisma.SortOrder;
    color?: Prisma.SortOrder;
    badgeColor?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    discount?: Prisma.SortOrder;
};
export type LoyaltyLevelMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    minPoints?: Prisma.SortOrder;
    color?: Prisma.SortOrder;
    badgeColor?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    discount?: Prisma.SortOrder;
};
export type LoyaltyLevelSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    minPoints?: Prisma.SortOrder;
    discount?: Prisma.SortOrder;
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
export type LoyaltyLevelSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    minPoints?: boolean;
    color?: boolean;
    badgeColor?: boolean;
    updatedAt?: boolean;
    discount?: boolean;
}, ExtArgs["result"]["loyaltyLevel"]>;
export type LoyaltyLevelSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    minPoints?: boolean;
    color?: boolean;
    badgeColor?: boolean;
    updatedAt?: boolean;
    discount?: boolean;
}, ExtArgs["result"]["loyaltyLevel"]>;
export type LoyaltyLevelSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    minPoints?: boolean;
    color?: boolean;
    badgeColor?: boolean;
    updatedAt?: boolean;
    discount?: boolean;
}, ExtArgs["result"]["loyaltyLevel"]>;
export type LoyaltyLevelSelectScalar = {
    id?: boolean;
    name?: boolean;
    minPoints?: boolean;
    color?: boolean;
    badgeColor?: boolean;
    updatedAt?: boolean;
    discount?: boolean;
};
export type LoyaltyLevelOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "name" | "minPoints" | "color" | "badgeColor" | "updatedAt" | "discount", ExtArgs["result"]["loyaltyLevel"]>;
export type $LoyaltyLevelPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "LoyaltyLevel";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        name: string;
        minPoints: number;
        color: string;
        badgeColor: string;
        updatedAt: Date;
        discount: number;
    }, ExtArgs["result"]["loyaltyLevel"]>;
    composites: {};
};
export type LoyaltyLevelGetPayload<S extends boolean | null | undefined | LoyaltyLevelDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$LoyaltyLevelPayload, S>;
export type LoyaltyLevelCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<LoyaltyLevelFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: LoyaltyLevelCountAggregateInputType | true;
};
export interface LoyaltyLevelDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['LoyaltyLevel'];
        meta: {
            name: 'LoyaltyLevel';
        };
    };
    /**
     * Find zero or one LoyaltyLevel that matches the filter.
     * @param {LoyaltyLevelFindUniqueArgs} args - Arguments to find a LoyaltyLevel
     * @example
     * // Get one LoyaltyLevel
     * const loyaltyLevel = await prisma.loyaltyLevel.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LoyaltyLevelFindUniqueArgs>(args: Prisma.SelectSubset<T, LoyaltyLevelFindUniqueArgs<ExtArgs>>): Prisma.Prisma__LoyaltyLevelClient<runtime.Types.Result.GetResult<Prisma.$LoyaltyLevelPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one LoyaltyLevel that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LoyaltyLevelFindUniqueOrThrowArgs} args - Arguments to find a LoyaltyLevel
     * @example
     * // Get one LoyaltyLevel
     * const loyaltyLevel = await prisma.loyaltyLevel.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LoyaltyLevelFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, LoyaltyLevelFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__LoyaltyLevelClient<runtime.Types.Result.GetResult<Prisma.$LoyaltyLevelPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first LoyaltyLevel that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoyaltyLevelFindFirstArgs} args - Arguments to find a LoyaltyLevel
     * @example
     * // Get one LoyaltyLevel
     * const loyaltyLevel = await prisma.loyaltyLevel.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LoyaltyLevelFindFirstArgs>(args?: Prisma.SelectSubset<T, LoyaltyLevelFindFirstArgs<ExtArgs>>): Prisma.Prisma__LoyaltyLevelClient<runtime.Types.Result.GetResult<Prisma.$LoyaltyLevelPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first LoyaltyLevel that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoyaltyLevelFindFirstOrThrowArgs} args - Arguments to find a LoyaltyLevel
     * @example
     * // Get one LoyaltyLevel
     * const loyaltyLevel = await prisma.loyaltyLevel.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LoyaltyLevelFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, LoyaltyLevelFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__LoyaltyLevelClient<runtime.Types.Result.GetResult<Prisma.$LoyaltyLevelPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more LoyaltyLevels that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoyaltyLevelFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LoyaltyLevels
     * const loyaltyLevels = await prisma.loyaltyLevel.findMany()
     *
     * // Get first 10 LoyaltyLevels
     * const loyaltyLevels = await prisma.loyaltyLevel.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const loyaltyLevelWithIdOnly = await prisma.loyaltyLevel.findMany({ select: { id: true } })
     *
     */
    findMany<T extends LoyaltyLevelFindManyArgs>(args?: Prisma.SelectSubset<T, LoyaltyLevelFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LoyaltyLevelPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a LoyaltyLevel.
     * @param {LoyaltyLevelCreateArgs} args - Arguments to create a LoyaltyLevel.
     * @example
     * // Create one LoyaltyLevel
     * const LoyaltyLevel = await prisma.loyaltyLevel.create({
     *   data: {
     *     // ... data to create a LoyaltyLevel
     *   }
     * })
     *
     */
    create<T extends LoyaltyLevelCreateArgs>(args: Prisma.SelectSubset<T, LoyaltyLevelCreateArgs<ExtArgs>>): Prisma.Prisma__LoyaltyLevelClient<runtime.Types.Result.GetResult<Prisma.$LoyaltyLevelPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many LoyaltyLevels.
     * @param {LoyaltyLevelCreateManyArgs} args - Arguments to create many LoyaltyLevels.
     * @example
     * // Create many LoyaltyLevels
     * const loyaltyLevel = await prisma.loyaltyLevel.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends LoyaltyLevelCreateManyArgs>(args?: Prisma.SelectSubset<T, LoyaltyLevelCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many LoyaltyLevels and returns the data saved in the database.
     * @param {LoyaltyLevelCreateManyAndReturnArgs} args - Arguments to create many LoyaltyLevels.
     * @example
     * // Create many LoyaltyLevels
     * const loyaltyLevel = await prisma.loyaltyLevel.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many LoyaltyLevels and only return the `id`
     * const loyaltyLevelWithIdOnly = await prisma.loyaltyLevel.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends LoyaltyLevelCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, LoyaltyLevelCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LoyaltyLevelPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a LoyaltyLevel.
     * @param {LoyaltyLevelDeleteArgs} args - Arguments to delete one LoyaltyLevel.
     * @example
     * // Delete one LoyaltyLevel
     * const LoyaltyLevel = await prisma.loyaltyLevel.delete({
     *   where: {
     *     // ... filter to delete one LoyaltyLevel
     *   }
     * })
     *
     */
    delete<T extends LoyaltyLevelDeleteArgs>(args: Prisma.SelectSubset<T, LoyaltyLevelDeleteArgs<ExtArgs>>): Prisma.Prisma__LoyaltyLevelClient<runtime.Types.Result.GetResult<Prisma.$LoyaltyLevelPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one LoyaltyLevel.
     * @param {LoyaltyLevelUpdateArgs} args - Arguments to update one LoyaltyLevel.
     * @example
     * // Update one LoyaltyLevel
     * const loyaltyLevel = await prisma.loyaltyLevel.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends LoyaltyLevelUpdateArgs>(args: Prisma.SelectSubset<T, LoyaltyLevelUpdateArgs<ExtArgs>>): Prisma.Prisma__LoyaltyLevelClient<runtime.Types.Result.GetResult<Prisma.$LoyaltyLevelPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more LoyaltyLevels.
     * @param {LoyaltyLevelDeleteManyArgs} args - Arguments to filter LoyaltyLevels to delete.
     * @example
     * // Delete a few LoyaltyLevels
     * const { count } = await prisma.loyaltyLevel.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends LoyaltyLevelDeleteManyArgs>(args?: Prisma.SelectSubset<T, LoyaltyLevelDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more LoyaltyLevels.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoyaltyLevelUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LoyaltyLevels
     * const loyaltyLevel = await prisma.loyaltyLevel.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends LoyaltyLevelUpdateManyArgs>(args: Prisma.SelectSubset<T, LoyaltyLevelUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more LoyaltyLevels and returns the data updated in the database.
     * @param {LoyaltyLevelUpdateManyAndReturnArgs} args - Arguments to update many LoyaltyLevels.
     * @example
     * // Update many LoyaltyLevels
     * const loyaltyLevel = await prisma.loyaltyLevel.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more LoyaltyLevels and only return the `id`
     * const loyaltyLevelWithIdOnly = await prisma.loyaltyLevel.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends LoyaltyLevelUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, LoyaltyLevelUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LoyaltyLevelPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one LoyaltyLevel.
     * @param {LoyaltyLevelUpsertArgs} args - Arguments to update or create a LoyaltyLevel.
     * @example
     * // Update or create a LoyaltyLevel
     * const loyaltyLevel = await prisma.loyaltyLevel.upsert({
     *   create: {
     *     // ... data to create a LoyaltyLevel
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LoyaltyLevel we want to update
     *   }
     * })
     */
    upsert<T extends LoyaltyLevelUpsertArgs>(args: Prisma.SelectSubset<T, LoyaltyLevelUpsertArgs<ExtArgs>>): Prisma.Prisma__LoyaltyLevelClient<runtime.Types.Result.GetResult<Prisma.$LoyaltyLevelPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of LoyaltyLevels.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoyaltyLevelCountArgs} args - Arguments to filter LoyaltyLevels to count.
     * @example
     * // Count the number of LoyaltyLevels
     * const count = await prisma.loyaltyLevel.count({
     *   where: {
     *     // ... the filter for the LoyaltyLevels we want to count
     *   }
     * })
    **/
    count<T extends LoyaltyLevelCountArgs>(args?: Prisma.Subset<T, LoyaltyLevelCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], LoyaltyLevelCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a LoyaltyLevel.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoyaltyLevelAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LoyaltyLevelAggregateArgs>(args: Prisma.Subset<T, LoyaltyLevelAggregateArgs>): Prisma.PrismaPromise<GetLoyaltyLevelAggregateType<T>>;
    /**
     * Group by LoyaltyLevel.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoyaltyLevelGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
    **/
    groupBy<T extends LoyaltyLevelGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: LoyaltyLevelGroupByArgs['orderBy'];
    } : {
        orderBy?: LoyaltyLevelGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, LoyaltyLevelGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLoyaltyLevelGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the LoyaltyLevel model
     */
    readonly fields: LoyaltyLevelFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for LoyaltyLevel.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__LoyaltyLevelClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
/**
 * Fields of the LoyaltyLevel model
 */
export interface LoyaltyLevelFieldRefs {
    readonly id: Prisma.FieldRef<"LoyaltyLevel", 'Int'>;
    readonly name: Prisma.FieldRef<"LoyaltyLevel", 'String'>;
    readonly minPoints: Prisma.FieldRef<"LoyaltyLevel", 'Int'>;
    readonly color: Prisma.FieldRef<"LoyaltyLevel", 'String'>;
    readonly badgeColor: Prisma.FieldRef<"LoyaltyLevel", 'String'>;
    readonly updatedAt: Prisma.FieldRef<"LoyaltyLevel", 'DateTime'>;
    readonly discount: Prisma.FieldRef<"LoyaltyLevel", 'Int'>;
}
/**
 * LoyaltyLevel findUnique
 */
export type LoyaltyLevelFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoyaltyLevel
     */
    select?: Prisma.LoyaltyLevelSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the LoyaltyLevel
     */
    omit?: Prisma.LoyaltyLevelOmit<ExtArgs> | null;
    /**
     * Filter, which LoyaltyLevel to fetch.
     */
    where: Prisma.LoyaltyLevelWhereUniqueInput;
};
/**
 * LoyaltyLevel findUniqueOrThrow
 */
export type LoyaltyLevelFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoyaltyLevel
     */
    select?: Prisma.LoyaltyLevelSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the LoyaltyLevel
     */
    omit?: Prisma.LoyaltyLevelOmit<ExtArgs> | null;
    /**
     * Filter, which LoyaltyLevel to fetch.
     */
    where: Prisma.LoyaltyLevelWhereUniqueInput;
};
/**
 * LoyaltyLevel findFirst
 */
export type LoyaltyLevelFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoyaltyLevel
     */
    select?: Prisma.LoyaltyLevelSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the LoyaltyLevel
     */
    omit?: Prisma.LoyaltyLevelOmit<ExtArgs> | null;
    /**
     * Filter, which LoyaltyLevel to fetch.
     */
    where?: Prisma.LoyaltyLevelWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of LoyaltyLevels to fetch.
     */
    orderBy?: Prisma.LoyaltyLevelOrderByWithRelationInput | Prisma.LoyaltyLevelOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for LoyaltyLevels.
     */
    cursor?: Prisma.LoyaltyLevelWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` LoyaltyLevels from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` LoyaltyLevels.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of LoyaltyLevels.
     */
    distinct?: Prisma.LoyaltyLevelScalarFieldEnum | Prisma.LoyaltyLevelScalarFieldEnum[];
};
/**
 * LoyaltyLevel findFirstOrThrow
 */
export type LoyaltyLevelFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoyaltyLevel
     */
    select?: Prisma.LoyaltyLevelSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the LoyaltyLevel
     */
    omit?: Prisma.LoyaltyLevelOmit<ExtArgs> | null;
    /**
     * Filter, which LoyaltyLevel to fetch.
     */
    where?: Prisma.LoyaltyLevelWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of LoyaltyLevels to fetch.
     */
    orderBy?: Prisma.LoyaltyLevelOrderByWithRelationInput | Prisma.LoyaltyLevelOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for LoyaltyLevels.
     */
    cursor?: Prisma.LoyaltyLevelWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` LoyaltyLevels from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` LoyaltyLevels.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of LoyaltyLevels.
     */
    distinct?: Prisma.LoyaltyLevelScalarFieldEnum | Prisma.LoyaltyLevelScalarFieldEnum[];
};
/**
 * LoyaltyLevel findMany
 */
export type LoyaltyLevelFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoyaltyLevel
     */
    select?: Prisma.LoyaltyLevelSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the LoyaltyLevel
     */
    omit?: Prisma.LoyaltyLevelOmit<ExtArgs> | null;
    /**
     * Filter, which LoyaltyLevels to fetch.
     */
    where?: Prisma.LoyaltyLevelWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of LoyaltyLevels to fetch.
     */
    orderBy?: Prisma.LoyaltyLevelOrderByWithRelationInput | Prisma.LoyaltyLevelOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing LoyaltyLevels.
     */
    cursor?: Prisma.LoyaltyLevelWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` LoyaltyLevels from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` LoyaltyLevels.
     */
    skip?: number;
    distinct?: Prisma.LoyaltyLevelScalarFieldEnum | Prisma.LoyaltyLevelScalarFieldEnum[];
};
/**
 * LoyaltyLevel create
 */
export type LoyaltyLevelCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoyaltyLevel
     */
    select?: Prisma.LoyaltyLevelSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the LoyaltyLevel
     */
    omit?: Prisma.LoyaltyLevelOmit<ExtArgs> | null;
    /**
     * The data needed to create a LoyaltyLevel.
     */
    data: Prisma.XOR<Prisma.LoyaltyLevelCreateInput, Prisma.LoyaltyLevelUncheckedCreateInput>;
};
/**
 * LoyaltyLevel createMany
 */
export type LoyaltyLevelCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many LoyaltyLevels.
     */
    data: Prisma.LoyaltyLevelCreateManyInput | Prisma.LoyaltyLevelCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * LoyaltyLevel createManyAndReturn
 */
export type LoyaltyLevelCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoyaltyLevel
     */
    select?: Prisma.LoyaltyLevelSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the LoyaltyLevel
     */
    omit?: Prisma.LoyaltyLevelOmit<ExtArgs> | null;
    /**
     * The data used to create many LoyaltyLevels.
     */
    data: Prisma.LoyaltyLevelCreateManyInput | Prisma.LoyaltyLevelCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * LoyaltyLevel update
 */
export type LoyaltyLevelUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoyaltyLevel
     */
    select?: Prisma.LoyaltyLevelSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the LoyaltyLevel
     */
    omit?: Prisma.LoyaltyLevelOmit<ExtArgs> | null;
    /**
     * The data needed to update a LoyaltyLevel.
     */
    data: Prisma.XOR<Prisma.LoyaltyLevelUpdateInput, Prisma.LoyaltyLevelUncheckedUpdateInput>;
    /**
     * Choose, which LoyaltyLevel to update.
     */
    where: Prisma.LoyaltyLevelWhereUniqueInput;
};
/**
 * LoyaltyLevel updateMany
 */
export type LoyaltyLevelUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update LoyaltyLevels.
     */
    data: Prisma.XOR<Prisma.LoyaltyLevelUpdateManyMutationInput, Prisma.LoyaltyLevelUncheckedUpdateManyInput>;
    /**
     * Filter which LoyaltyLevels to update
     */
    where?: Prisma.LoyaltyLevelWhereInput;
    /**
     * Limit how many LoyaltyLevels to update.
     */
    limit?: number;
};
/**
 * LoyaltyLevel updateManyAndReturn
 */
export type LoyaltyLevelUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoyaltyLevel
     */
    select?: Prisma.LoyaltyLevelSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the LoyaltyLevel
     */
    omit?: Prisma.LoyaltyLevelOmit<ExtArgs> | null;
    /**
     * The data used to update LoyaltyLevels.
     */
    data: Prisma.XOR<Prisma.LoyaltyLevelUpdateManyMutationInput, Prisma.LoyaltyLevelUncheckedUpdateManyInput>;
    /**
     * Filter which LoyaltyLevels to update
     */
    where?: Prisma.LoyaltyLevelWhereInput;
    /**
     * Limit how many LoyaltyLevels to update.
     */
    limit?: number;
};
/**
 * LoyaltyLevel upsert
 */
export type LoyaltyLevelUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoyaltyLevel
     */
    select?: Prisma.LoyaltyLevelSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the LoyaltyLevel
     */
    omit?: Prisma.LoyaltyLevelOmit<ExtArgs> | null;
    /**
     * The filter to search for the LoyaltyLevel to update in case it exists.
     */
    where: Prisma.LoyaltyLevelWhereUniqueInput;
    /**
     * In case the LoyaltyLevel found by the `where` argument doesn't exist, create a new LoyaltyLevel with this data.
     */
    create: Prisma.XOR<Prisma.LoyaltyLevelCreateInput, Prisma.LoyaltyLevelUncheckedCreateInput>;
    /**
     * In case the LoyaltyLevel was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.LoyaltyLevelUpdateInput, Prisma.LoyaltyLevelUncheckedUpdateInput>;
};
/**
 * LoyaltyLevel delete
 */
export type LoyaltyLevelDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoyaltyLevel
     */
    select?: Prisma.LoyaltyLevelSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the LoyaltyLevel
     */
    omit?: Prisma.LoyaltyLevelOmit<ExtArgs> | null;
    /**
     * Filter which LoyaltyLevel to delete.
     */
    where: Prisma.LoyaltyLevelWhereUniqueInput;
};
/**
 * LoyaltyLevel deleteMany
 */
export type LoyaltyLevelDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which LoyaltyLevels to delete
     */
    where?: Prisma.LoyaltyLevelWhereInput;
    /**
     * Limit how many LoyaltyLevels to delete.
     */
    limit?: number;
};
/**
 * LoyaltyLevel without action
 */
export type LoyaltyLevelDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoyaltyLevel
     */
    select?: Prisma.LoyaltyLevelSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the LoyaltyLevel
     */
    omit?: Prisma.LoyaltyLevelOmit<ExtArgs> | null;
};
export {};
//# sourceMappingURL=LoyaltyLevel.d.ts.map