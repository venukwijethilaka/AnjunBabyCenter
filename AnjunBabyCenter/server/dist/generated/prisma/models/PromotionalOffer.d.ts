import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
/**
 * Model PromotionalOffer
 *
 */
export type PromotionalOfferModel = runtime.Types.Result.DefaultSelection<Prisma.$PromotionalOfferPayload>;
export type AggregatePromotionalOffer = {
    _count: PromotionalOfferCountAggregateOutputType | null;
    _avg: PromotionalOfferAvgAggregateOutputType | null;
    _sum: PromotionalOfferSumAggregateOutputType | null;
    _min: PromotionalOfferMinAggregateOutputType | null;
    _max: PromotionalOfferMaxAggregateOutputType | null;
};
export type PromotionalOfferAvgAggregateOutputType = {
    id: number | null;
    offerPrice: runtime.Decimal | null;
    productId: number | null;
};
export type PromotionalOfferSumAggregateOutputType = {
    id: number | null;
    offerPrice: runtime.Decimal | null;
    productId: number | null;
};
export type PromotionalOfferMinAggregateOutputType = {
    id: number | null;
    title: string | null;
    description: string | null;
    offerPrice: runtime.Decimal | null;
    endDate: Date | null;
    isActive: boolean | null;
    productId: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type PromotionalOfferMaxAggregateOutputType = {
    id: number | null;
    title: string | null;
    description: string | null;
    offerPrice: runtime.Decimal | null;
    endDate: Date | null;
    isActive: boolean | null;
    productId: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type PromotionalOfferCountAggregateOutputType = {
    id: number;
    title: number;
    description: number;
    offerPrice: number;
    endDate: number;
    isActive: number;
    productId: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type PromotionalOfferAvgAggregateInputType = {
    id?: true;
    offerPrice?: true;
    productId?: true;
};
export type PromotionalOfferSumAggregateInputType = {
    id?: true;
    offerPrice?: true;
    productId?: true;
};
export type PromotionalOfferMinAggregateInputType = {
    id?: true;
    title?: true;
    description?: true;
    offerPrice?: true;
    endDate?: true;
    isActive?: true;
    productId?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type PromotionalOfferMaxAggregateInputType = {
    id?: true;
    title?: true;
    description?: true;
    offerPrice?: true;
    endDate?: true;
    isActive?: true;
    productId?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type PromotionalOfferCountAggregateInputType = {
    id?: true;
    title?: true;
    description?: true;
    offerPrice?: true;
    endDate?: true;
    isActive?: true;
    productId?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type PromotionalOfferAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which PromotionalOffer to aggregate.
     */
    where?: Prisma.PromotionalOfferWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of PromotionalOffers to fetch.
     */
    orderBy?: Prisma.PromotionalOfferOrderByWithRelationInput | Prisma.PromotionalOfferOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.PromotionalOfferWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` PromotionalOffers from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` PromotionalOffers.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned PromotionalOffers
    **/
    _count?: true | PromotionalOfferCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: PromotionalOfferAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: PromotionalOfferSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: PromotionalOfferMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: PromotionalOfferMaxAggregateInputType;
};
export type GetPromotionalOfferAggregateType<T extends PromotionalOfferAggregateArgs> = {
    [P in keyof T & keyof AggregatePromotionalOffer]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregatePromotionalOffer[P]> : Prisma.GetScalarType<T[P], AggregatePromotionalOffer[P]>;
};
export type PromotionalOfferGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PromotionalOfferWhereInput;
    orderBy?: Prisma.PromotionalOfferOrderByWithAggregationInput | Prisma.PromotionalOfferOrderByWithAggregationInput[];
    by: Prisma.PromotionalOfferScalarFieldEnum[] | Prisma.PromotionalOfferScalarFieldEnum;
    having?: Prisma.PromotionalOfferScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: PromotionalOfferCountAggregateInputType | true;
    _avg?: PromotionalOfferAvgAggregateInputType;
    _sum?: PromotionalOfferSumAggregateInputType;
    _min?: PromotionalOfferMinAggregateInputType;
    _max?: PromotionalOfferMaxAggregateInputType;
};
export type PromotionalOfferGroupByOutputType = {
    id: number;
    title: string;
    description: string | null;
    offerPrice: runtime.Decimal;
    endDate: Date;
    isActive: boolean;
    productId: number;
    createdAt: Date;
    updatedAt: Date;
    _count: PromotionalOfferCountAggregateOutputType | null;
    _avg: PromotionalOfferAvgAggregateOutputType | null;
    _sum: PromotionalOfferSumAggregateOutputType | null;
    _min: PromotionalOfferMinAggregateOutputType | null;
    _max: PromotionalOfferMaxAggregateOutputType | null;
};
type GetPromotionalOfferGroupByPayload<T extends PromotionalOfferGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<PromotionalOfferGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof PromotionalOfferGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], PromotionalOfferGroupByOutputType[P]> : Prisma.GetScalarType<T[P], PromotionalOfferGroupByOutputType[P]>;
}>>;
export type PromotionalOfferWhereInput = {
    AND?: Prisma.PromotionalOfferWhereInput | Prisma.PromotionalOfferWhereInput[];
    OR?: Prisma.PromotionalOfferWhereInput[];
    NOT?: Prisma.PromotionalOfferWhereInput | Prisma.PromotionalOfferWhereInput[];
    id?: Prisma.IntFilter<"PromotionalOffer"> | number;
    title?: Prisma.StringFilter<"PromotionalOffer"> | string;
    description?: Prisma.StringNullableFilter<"PromotionalOffer"> | string | null;
    offerPrice?: Prisma.DecimalFilter<"PromotionalOffer"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    endDate?: Prisma.DateTimeFilter<"PromotionalOffer"> | Date | string;
    isActive?: Prisma.BoolFilter<"PromotionalOffer"> | boolean;
    productId?: Prisma.IntFilter<"PromotionalOffer"> | number;
    createdAt?: Prisma.DateTimeFilter<"PromotionalOffer"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"PromotionalOffer"> | Date | string;
    product?: Prisma.XOR<Prisma.ProductScalarRelationFilter, Prisma.ProductWhereInput>;
};
export type PromotionalOfferOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    offerPrice?: Prisma.SortOrder;
    endDate?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    productId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    product?: Prisma.ProductOrderByWithRelationInput;
};
export type PromotionalOfferWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    AND?: Prisma.PromotionalOfferWhereInput | Prisma.PromotionalOfferWhereInput[];
    OR?: Prisma.PromotionalOfferWhereInput[];
    NOT?: Prisma.PromotionalOfferWhereInput | Prisma.PromotionalOfferWhereInput[];
    title?: Prisma.StringFilter<"PromotionalOffer"> | string;
    description?: Prisma.StringNullableFilter<"PromotionalOffer"> | string | null;
    offerPrice?: Prisma.DecimalFilter<"PromotionalOffer"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    endDate?: Prisma.DateTimeFilter<"PromotionalOffer"> | Date | string;
    isActive?: Prisma.BoolFilter<"PromotionalOffer"> | boolean;
    productId?: Prisma.IntFilter<"PromotionalOffer"> | number;
    createdAt?: Prisma.DateTimeFilter<"PromotionalOffer"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"PromotionalOffer"> | Date | string;
    product?: Prisma.XOR<Prisma.ProductScalarRelationFilter, Prisma.ProductWhereInput>;
}, "id">;
export type PromotionalOfferOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    offerPrice?: Prisma.SortOrder;
    endDate?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    productId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.PromotionalOfferCountOrderByAggregateInput;
    _avg?: Prisma.PromotionalOfferAvgOrderByAggregateInput;
    _max?: Prisma.PromotionalOfferMaxOrderByAggregateInput;
    _min?: Prisma.PromotionalOfferMinOrderByAggregateInput;
    _sum?: Prisma.PromotionalOfferSumOrderByAggregateInput;
};
export type PromotionalOfferScalarWhereWithAggregatesInput = {
    AND?: Prisma.PromotionalOfferScalarWhereWithAggregatesInput | Prisma.PromotionalOfferScalarWhereWithAggregatesInput[];
    OR?: Prisma.PromotionalOfferScalarWhereWithAggregatesInput[];
    NOT?: Prisma.PromotionalOfferScalarWhereWithAggregatesInput | Prisma.PromotionalOfferScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"PromotionalOffer"> | number;
    title?: Prisma.StringWithAggregatesFilter<"PromotionalOffer"> | string;
    description?: Prisma.StringNullableWithAggregatesFilter<"PromotionalOffer"> | string | null;
    offerPrice?: Prisma.DecimalWithAggregatesFilter<"PromotionalOffer"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    endDate?: Prisma.DateTimeWithAggregatesFilter<"PromotionalOffer"> | Date | string;
    isActive?: Prisma.BoolWithAggregatesFilter<"PromotionalOffer"> | boolean;
    productId?: Prisma.IntWithAggregatesFilter<"PromotionalOffer"> | number;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"PromotionalOffer"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"PromotionalOffer"> | Date | string;
};
export type PromotionalOfferCreateInput = {
    title: string;
    description?: string | null;
    offerPrice: runtime.Decimal | runtime.DecimalJsLike | number | string;
    endDate: Date | string;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    product: Prisma.ProductCreateNestedOneWithoutPromotionalOffersInput;
};
export type PromotionalOfferUncheckedCreateInput = {
    id?: number;
    title: string;
    description?: string | null;
    offerPrice: runtime.Decimal | runtime.DecimalJsLike | number | string;
    endDate: Date | string;
    isActive?: boolean;
    productId: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type PromotionalOfferUpdateInput = {
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    offerPrice?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    endDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    product?: Prisma.ProductUpdateOneRequiredWithoutPromotionalOffersNestedInput;
};
export type PromotionalOfferUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    offerPrice?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    endDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    productId?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PromotionalOfferCreateManyInput = {
    id?: number;
    title: string;
    description?: string | null;
    offerPrice: runtime.Decimal | runtime.DecimalJsLike | number | string;
    endDate: Date | string;
    isActive?: boolean;
    productId: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type PromotionalOfferUpdateManyMutationInput = {
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    offerPrice?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    endDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PromotionalOfferUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    offerPrice?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    endDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    productId?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PromotionalOfferListRelationFilter = {
    every?: Prisma.PromotionalOfferWhereInput;
    some?: Prisma.PromotionalOfferWhereInput;
    none?: Prisma.PromotionalOfferWhereInput;
};
export type PromotionalOfferOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type PromotionalOfferCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    offerPrice?: Prisma.SortOrder;
    endDate?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    productId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type PromotionalOfferAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    offerPrice?: Prisma.SortOrder;
    productId?: Prisma.SortOrder;
};
export type PromotionalOfferMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    offerPrice?: Prisma.SortOrder;
    endDate?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    productId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type PromotionalOfferMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    offerPrice?: Prisma.SortOrder;
    endDate?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    productId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type PromotionalOfferSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    offerPrice?: Prisma.SortOrder;
    productId?: Prisma.SortOrder;
};
export type PromotionalOfferCreateNestedManyWithoutProductInput = {
    create?: Prisma.XOR<Prisma.PromotionalOfferCreateWithoutProductInput, Prisma.PromotionalOfferUncheckedCreateWithoutProductInput> | Prisma.PromotionalOfferCreateWithoutProductInput[] | Prisma.PromotionalOfferUncheckedCreateWithoutProductInput[];
    connectOrCreate?: Prisma.PromotionalOfferCreateOrConnectWithoutProductInput | Prisma.PromotionalOfferCreateOrConnectWithoutProductInput[];
    createMany?: Prisma.PromotionalOfferCreateManyProductInputEnvelope;
    connect?: Prisma.PromotionalOfferWhereUniqueInput | Prisma.PromotionalOfferWhereUniqueInput[];
};
export type PromotionalOfferUncheckedCreateNestedManyWithoutProductInput = {
    create?: Prisma.XOR<Prisma.PromotionalOfferCreateWithoutProductInput, Prisma.PromotionalOfferUncheckedCreateWithoutProductInput> | Prisma.PromotionalOfferCreateWithoutProductInput[] | Prisma.PromotionalOfferUncheckedCreateWithoutProductInput[];
    connectOrCreate?: Prisma.PromotionalOfferCreateOrConnectWithoutProductInput | Prisma.PromotionalOfferCreateOrConnectWithoutProductInput[];
    createMany?: Prisma.PromotionalOfferCreateManyProductInputEnvelope;
    connect?: Prisma.PromotionalOfferWhereUniqueInput | Prisma.PromotionalOfferWhereUniqueInput[];
};
export type PromotionalOfferUpdateManyWithoutProductNestedInput = {
    create?: Prisma.XOR<Prisma.PromotionalOfferCreateWithoutProductInput, Prisma.PromotionalOfferUncheckedCreateWithoutProductInput> | Prisma.PromotionalOfferCreateWithoutProductInput[] | Prisma.PromotionalOfferUncheckedCreateWithoutProductInput[];
    connectOrCreate?: Prisma.PromotionalOfferCreateOrConnectWithoutProductInput | Prisma.PromotionalOfferCreateOrConnectWithoutProductInput[];
    upsert?: Prisma.PromotionalOfferUpsertWithWhereUniqueWithoutProductInput | Prisma.PromotionalOfferUpsertWithWhereUniqueWithoutProductInput[];
    createMany?: Prisma.PromotionalOfferCreateManyProductInputEnvelope;
    set?: Prisma.PromotionalOfferWhereUniqueInput | Prisma.PromotionalOfferWhereUniqueInput[];
    disconnect?: Prisma.PromotionalOfferWhereUniqueInput | Prisma.PromotionalOfferWhereUniqueInput[];
    delete?: Prisma.PromotionalOfferWhereUniqueInput | Prisma.PromotionalOfferWhereUniqueInput[];
    connect?: Prisma.PromotionalOfferWhereUniqueInput | Prisma.PromotionalOfferWhereUniqueInput[];
    update?: Prisma.PromotionalOfferUpdateWithWhereUniqueWithoutProductInput | Prisma.PromotionalOfferUpdateWithWhereUniqueWithoutProductInput[];
    updateMany?: Prisma.PromotionalOfferUpdateManyWithWhereWithoutProductInput | Prisma.PromotionalOfferUpdateManyWithWhereWithoutProductInput[];
    deleteMany?: Prisma.PromotionalOfferScalarWhereInput | Prisma.PromotionalOfferScalarWhereInput[];
};
export type PromotionalOfferUncheckedUpdateManyWithoutProductNestedInput = {
    create?: Prisma.XOR<Prisma.PromotionalOfferCreateWithoutProductInput, Prisma.PromotionalOfferUncheckedCreateWithoutProductInput> | Prisma.PromotionalOfferCreateWithoutProductInput[] | Prisma.PromotionalOfferUncheckedCreateWithoutProductInput[];
    connectOrCreate?: Prisma.PromotionalOfferCreateOrConnectWithoutProductInput | Prisma.PromotionalOfferCreateOrConnectWithoutProductInput[];
    upsert?: Prisma.PromotionalOfferUpsertWithWhereUniqueWithoutProductInput | Prisma.PromotionalOfferUpsertWithWhereUniqueWithoutProductInput[];
    createMany?: Prisma.PromotionalOfferCreateManyProductInputEnvelope;
    set?: Prisma.PromotionalOfferWhereUniqueInput | Prisma.PromotionalOfferWhereUniqueInput[];
    disconnect?: Prisma.PromotionalOfferWhereUniqueInput | Prisma.PromotionalOfferWhereUniqueInput[];
    delete?: Prisma.PromotionalOfferWhereUniqueInput | Prisma.PromotionalOfferWhereUniqueInput[];
    connect?: Prisma.PromotionalOfferWhereUniqueInput | Prisma.PromotionalOfferWhereUniqueInput[];
    update?: Prisma.PromotionalOfferUpdateWithWhereUniqueWithoutProductInput | Prisma.PromotionalOfferUpdateWithWhereUniqueWithoutProductInput[];
    updateMany?: Prisma.PromotionalOfferUpdateManyWithWhereWithoutProductInput | Prisma.PromotionalOfferUpdateManyWithWhereWithoutProductInput[];
    deleteMany?: Prisma.PromotionalOfferScalarWhereInput | Prisma.PromotionalOfferScalarWhereInput[];
};
export type PromotionalOfferCreateWithoutProductInput = {
    title: string;
    description?: string | null;
    offerPrice: runtime.Decimal | runtime.DecimalJsLike | number | string;
    endDate: Date | string;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type PromotionalOfferUncheckedCreateWithoutProductInput = {
    id?: number;
    title: string;
    description?: string | null;
    offerPrice: runtime.Decimal | runtime.DecimalJsLike | number | string;
    endDate: Date | string;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type PromotionalOfferCreateOrConnectWithoutProductInput = {
    where: Prisma.PromotionalOfferWhereUniqueInput;
    create: Prisma.XOR<Prisma.PromotionalOfferCreateWithoutProductInput, Prisma.PromotionalOfferUncheckedCreateWithoutProductInput>;
};
export type PromotionalOfferCreateManyProductInputEnvelope = {
    data: Prisma.PromotionalOfferCreateManyProductInput | Prisma.PromotionalOfferCreateManyProductInput[];
    skipDuplicates?: boolean;
};
export type PromotionalOfferUpsertWithWhereUniqueWithoutProductInput = {
    where: Prisma.PromotionalOfferWhereUniqueInput;
    update: Prisma.XOR<Prisma.PromotionalOfferUpdateWithoutProductInput, Prisma.PromotionalOfferUncheckedUpdateWithoutProductInput>;
    create: Prisma.XOR<Prisma.PromotionalOfferCreateWithoutProductInput, Prisma.PromotionalOfferUncheckedCreateWithoutProductInput>;
};
export type PromotionalOfferUpdateWithWhereUniqueWithoutProductInput = {
    where: Prisma.PromotionalOfferWhereUniqueInput;
    data: Prisma.XOR<Prisma.PromotionalOfferUpdateWithoutProductInput, Prisma.PromotionalOfferUncheckedUpdateWithoutProductInput>;
};
export type PromotionalOfferUpdateManyWithWhereWithoutProductInput = {
    where: Prisma.PromotionalOfferScalarWhereInput;
    data: Prisma.XOR<Prisma.PromotionalOfferUpdateManyMutationInput, Prisma.PromotionalOfferUncheckedUpdateManyWithoutProductInput>;
};
export type PromotionalOfferScalarWhereInput = {
    AND?: Prisma.PromotionalOfferScalarWhereInput | Prisma.PromotionalOfferScalarWhereInput[];
    OR?: Prisma.PromotionalOfferScalarWhereInput[];
    NOT?: Prisma.PromotionalOfferScalarWhereInput | Prisma.PromotionalOfferScalarWhereInput[];
    id?: Prisma.IntFilter<"PromotionalOffer"> | number;
    title?: Prisma.StringFilter<"PromotionalOffer"> | string;
    description?: Prisma.StringNullableFilter<"PromotionalOffer"> | string | null;
    offerPrice?: Prisma.DecimalFilter<"PromotionalOffer"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    endDate?: Prisma.DateTimeFilter<"PromotionalOffer"> | Date | string;
    isActive?: Prisma.BoolFilter<"PromotionalOffer"> | boolean;
    productId?: Prisma.IntFilter<"PromotionalOffer"> | number;
    createdAt?: Prisma.DateTimeFilter<"PromotionalOffer"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"PromotionalOffer"> | Date | string;
};
export type PromotionalOfferCreateManyProductInput = {
    id?: number;
    title: string;
    description?: string | null;
    offerPrice: runtime.Decimal | runtime.DecimalJsLike | number | string;
    endDate: Date | string;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type PromotionalOfferUpdateWithoutProductInput = {
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    offerPrice?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    endDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PromotionalOfferUncheckedUpdateWithoutProductInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    offerPrice?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    endDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PromotionalOfferUncheckedUpdateManyWithoutProductInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    offerPrice?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    endDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PromotionalOfferSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    title?: boolean;
    description?: boolean;
    offerPrice?: boolean;
    endDate?: boolean;
    isActive?: boolean;
    productId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    product?: boolean | Prisma.ProductDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["promotionalOffer"]>;
export type PromotionalOfferSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    title?: boolean;
    description?: boolean;
    offerPrice?: boolean;
    endDate?: boolean;
    isActive?: boolean;
    productId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    product?: boolean | Prisma.ProductDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["promotionalOffer"]>;
export type PromotionalOfferSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    title?: boolean;
    description?: boolean;
    offerPrice?: boolean;
    endDate?: boolean;
    isActive?: boolean;
    productId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    product?: boolean | Prisma.ProductDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["promotionalOffer"]>;
export type PromotionalOfferSelectScalar = {
    id?: boolean;
    title?: boolean;
    description?: boolean;
    offerPrice?: boolean;
    endDate?: boolean;
    isActive?: boolean;
    productId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type PromotionalOfferOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "title" | "description" | "offerPrice" | "endDate" | "isActive" | "productId" | "createdAt" | "updatedAt", ExtArgs["result"]["promotionalOffer"]>;
export type PromotionalOfferInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    product?: boolean | Prisma.ProductDefaultArgs<ExtArgs>;
};
export type PromotionalOfferIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    product?: boolean | Prisma.ProductDefaultArgs<ExtArgs>;
};
export type PromotionalOfferIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    product?: boolean | Prisma.ProductDefaultArgs<ExtArgs>;
};
export type $PromotionalOfferPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "PromotionalOffer";
    objects: {
        product: Prisma.$ProductPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        title: string;
        description: string | null;
        offerPrice: runtime.Decimal;
        endDate: Date;
        isActive: boolean;
        productId: number;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["promotionalOffer"]>;
    composites: {};
};
export type PromotionalOfferGetPayload<S extends boolean | null | undefined | PromotionalOfferDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$PromotionalOfferPayload, S>;
export type PromotionalOfferCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<PromotionalOfferFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: PromotionalOfferCountAggregateInputType | true;
};
export interface PromotionalOfferDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['PromotionalOffer'];
        meta: {
            name: 'PromotionalOffer';
        };
    };
    /**
     * Find zero or one PromotionalOffer that matches the filter.
     * @param {PromotionalOfferFindUniqueArgs} args - Arguments to find a PromotionalOffer
     * @example
     * // Get one PromotionalOffer
     * const promotionalOffer = await prisma.promotionalOffer.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PromotionalOfferFindUniqueArgs>(args: Prisma.SelectSubset<T, PromotionalOfferFindUniqueArgs<ExtArgs>>): Prisma.Prisma__PromotionalOfferClient<runtime.Types.Result.GetResult<Prisma.$PromotionalOfferPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one PromotionalOffer that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PromotionalOfferFindUniqueOrThrowArgs} args - Arguments to find a PromotionalOffer
     * @example
     * // Get one PromotionalOffer
     * const promotionalOffer = await prisma.promotionalOffer.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PromotionalOfferFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, PromotionalOfferFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__PromotionalOfferClient<runtime.Types.Result.GetResult<Prisma.$PromotionalOfferPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first PromotionalOffer that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PromotionalOfferFindFirstArgs} args - Arguments to find a PromotionalOffer
     * @example
     * // Get one PromotionalOffer
     * const promotionalOffer = await prisma.promotionalOffer.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PromotionalOfferFindFirstArgs>(args?: Prisma.SelectSubset<T, PromotionalOfferFindFirstArgs<ExtArgs>>): Prisma.Prisma__PromotionalOfferClient<runtime.Types.Result.GetResult<Prisma.$PromotionalOfferPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first PromotionalOffer that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PromotionalOfferFindFirstOrThrowArgs} args - Arguments to find a PromotionalOffer
     * @example
     * // Get one PromotionalOffer
     * const promotionalOffer = await prisma.promotionalOffer.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PromotionalOfferFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, PromotionalOfferFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__PromotionalOfferClient<runtime.Types.Result.GetResult<Prisma.$PromotionalOfferPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more PromotionalOffers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PromotionalOfferFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PromotionalOffers
     * const promotionalOffers = await prisma.promotionalOffer.findMany()
     *
     * // Get first 10 PromotionalOffers
     * const promotionalOffers = await prisma.promotionalOffer.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const promotionalOfferWithIdOnly = await prisma.promotionalOffer.findMany({ select: { id: true } })
     *
     */
    findMany<T extends PromotionalOfferFindManyArgs>(args?: Prisma.SelectSubset<T, PromotionalOfferFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PromotionalOfferPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a PromotionalOffer.
     * @param {PromotionalOfferCreateArgs} args - Arguments to create a PromotionalOffer.
     * @example
     * // Create one PromotionalOffer
     * const PromotionalOffer = await prisma.promotionalOffer.create({
     *   data: {
     *     // ... data to create a PromotionalOffer
     *   }
     * })
     *
     */
    create<T extends PromotionalOfferCreateArgs>(args: Prisma.SelectSubset<T, PromotionalOfferCreateArgs<ExtArgs>>): Prisma.Prisma__PromotionalOfferClient<runtime.Types.Result.GetResult<Prisma.$PromotionalOfferPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many PromotionalOffers.
     * @param {PromotionalOfferCreateManyArgs} args - Arguments to create many PromotionalOffers.
     * @example
     * // Create many PromotionalOffers
     * const promotionalOffer = await prisma.promotionalOffer.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends PromotionalOfferCreateManyArgs>(args?: Prisma.SelectSubset<T, PromotionalOfferCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many PromotionalOffers and returns the data saved in the database.
     * @param {PromotionalOfferCreateManyAndReturnArgs} args - Arguments to create many PromotionalOffers.
     * @example
     * // Create many PromotionalOffers
     * const promotionalOffer = await prisma.promotionalOffer.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many PromotionalOffers and only return the `id`
     * const promotionalOfferWithIdOnly = await prisma.promotionalOffer.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends PromotionalOfferCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, PromotionalOfferCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PromotionalOfferPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a PromotionalOffer.
     * @param {PromotionalOfferDeleteArgs} args - Arguments to delete one PromotionalOffer.
     * @example
     * // Delete one PromotionalOffer
     * const PromotionalOffer = await prisma.promotionalOffer.delete({
     *   where: {
     *     // ... filter to delete one PromotionalOffer
     *   }
     * })
     *
     */
    delete<T extends PromotionalOfferDeleteArgs>(args: Prisma.SelectSubset<T, PromotionalOfferDeleteArgs<ExtArgs>>): Prisma.Prisma__PromotionalOfferClient<runtime.Types.Result.GetResult<Prisma.$PromotionalOfferPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one PromotionalOffer.
     * @param {PromotionalOfferUpdateArgs} args - Arguments to update one PromotionalOffer.
     * @example
     * // Update one PromotionalOffer
     * const promotionalOffer = await prisma.promotionalOffer.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends PromotionalOfferUpdateArgs>(args: Prisma.SelectSubset<T, PromotionalOfferUpdateArgs<ExtArgs>>): Prisma.Prisma__PromotionalOfferClient<runtime.Types.Result.GetResult<Prisma.$PromotionalOfferPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more PromotionalOffers.
     * @param {PromotionalOfferDeleteManyArgs} args - Arguments to filter PromotionalOffers to delete.
     * @example
     * // Delete a few PromotionalOffers
     * const { count } = await prisma.promotionalOffer.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends PromotionalOfferDeleteManyArgs>(args?: Prisma.SelectSubset<T, PromotionalOfferDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more PromotionalOffers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PromotionalOfferUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PromotionalOffers
     * const promotionalOffer = await prisma.promotionalOffer.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends PromotionalOfferUpdateManyArgs>(args: Prisma.SelectSubset<T, PromotionalOfferUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more PromotionalOffers and returns the data updated in the database.
     * @param {PromotionalOfferUpdateManyAndReturnArgs} args - Arguments to update many PromotionalOffers.
     * @example
     * // Update many PromotionalOffers
     * const promotionalOffer = await prisma.promotionalOffer.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more PromotionalOffers and only return the `id`
     * const promotionalOfferWithIdOnly = await prisma.promotionalOffer.updateManyAndReturn({
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
    updateManyAndReturn<T extends PromotionalOfferUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, PromotionalOfferUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PromotionalOfferPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one PromotionalOffer.
     * @param {PromotionalOfferUpsertArgs} args - Arguments to update or create a PromotionalOffer.
     * @example
     * // Update or create a PromotionalOffer
     * const promotionalOffer = await prisma.promotionalOffer.upsert({
     *   create: {
     *     // ... data to create a PromotionalOffer
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PromotionalOffer we want to update
     *   }
     * })
     */
    upsert<T extends PromotionalOfferUpsertArgs>(args: Prisma.SelectSubset<T, PromotionalOfferUpsertArgs<ExtArgs>>): Prisma.Prisma__PromotionalOfferClient<runtime.Types.Result.GetResult<Prisma.$PromotionalOfferPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of PromotionalOffers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PromotionalOfferCountArgs} args - Arguments to filter PromotionalOffers to count.
     * @example
     * // Count the number of PromotionalOffers
     * const count = await prisma.promotionalOffer.count({
     *   where: {
     *     // ... the filter for the PromotionalOffers we want to count
     *   }
     * })
    **/
    count<T extends PromotionalOfferCountArgs>(args?: Prisma.Subset<T, PromotionalOfferCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], PromotionalOfferCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a PromotionalOffer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PromotionalOfferAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PromotionalOfferAggregateArgs>(args: Prisma.Subset<T, PromotionalOfferAggregateArgs>): Prisma.PrismaPromise<GetPromotionalOfferAggregateType<T>>;
    /**
     * Group by PromotionalOffer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PromotionalOfferGroupByArgs} args - Group by arguments.
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
    groupBy<T extends PromotionalOfferGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: PromotionalOfferGroupByArgs['orderBy'];
    } : {
        orderBy?: PromotionalOfferGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, PromotionalOfferGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPromotionalOfferGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the PromotionalOffer model
     */
    readonly fields: PromotionalOfferFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for PromotionalOffer.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__PromotionalOfferClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    product<T extends Prisma.ProductDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ProductDefaultArgs<ExtArgs>>): Prisma.Prisma__ProductClient<runtime.Types.Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
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
 * Fields of the PromotionalOffer model
 */
export interface PromotionalOfferFieldRefs {
    readonly id: Prisma.FieldRef<"PromotionalOffer", 'Int'>;
    readonly title: Prisma.FieldRef<"PromotionalOffer", 'String'>;
    readonly description: Prisma.FieldRef<"PromotionalOffer", 'String'>;
    readonly offerPrice: Prisma.FieldRef<"PromotionalOffer", 'Decimal'>;
    readonly endDate: Prisma.FieldRef<"PromotionalOffer", 'DateTime'>;
    readonly isActive: Prisma.FieldRef<"PromotionalOffer", 'Boolean'>;
    readonly productId: Prisma.FieldRef<"PromotionalOffer", 'Int'>;
    readonly createdAt: Prisma.FieldRef<"PromotionalOffer", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"PromotionalOffer", 'DateTime'>;
}
/**
 * PromotionalOffer findUnique
 */
export type PromotionalOfferFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PromotionalOffer
     */
    select?: Prisma.PromotionalOfferSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PromotionalOffer
     */
    omit?: Prisma.PromotionalOfferOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PromotionalOfferInclude<ExtArgs> | null;
    /**
     * Filter, which PromotionalOffer to fetch.
     */
    where: Prisma.PromotionalOfferWhereUniqueInput;
};
/**
 * PromotionalOffer findUniqueOrThrow
 */
export type PromotionalOfferFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PromotionalOffer
     */
    select?: Prisma.PromotionalOfferSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PromotionalOffer
     */
    omit?: Prisma.PromotionalOfferOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PromotionalOfferInclude<ExtArgs> | null;
    /**
     * Filter, which PromotionalOffer to fetch.
     */
    where: Prisma.PromotionalOfferWhereUniqueInput;
};
/**
 * PromotionalOffer findFirst
 */
export type PromotionalOfferFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PromotionalOffer
     */
    select?: Prisma.PromotionalOfferSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PromotionalOffer
     */
    omit?: Prisma.PromotionalOfferOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PromotionalOfferInclude<ExtArgs> | null;
    /**
     * Filter, which PromotionalOffer to fetch.
     */
    where?: Prisma.PromotionalOfferWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of PromotionalOffers to fetch.
     */
    orderBy?: Prisma.PromotionalOfferOrderByWithRelationInput | Prisma.PromotionalOfferOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for PromotionalOffers.
     */
    cursor?: Prisma.PromotionalOfferWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` PromotionalOffers from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` PromotionalOffers.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of PromotionalOffers.
     */
    distinct?: Prisma.PromotionalOfferScalarFieldEnum | Prisma.PromotionalOfferScalarFieldEnum[];
};
/**
 * PromotionalOffer findFirstOrThrow
 */
export type PromotionalOfferFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PromotionalOffer
     */
    select?: Prisma.PromotionalOfferSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PromotionalOffer
     */
    omit?: Prisma.PromotionalOfferOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PromotionalOfferInclude<ExtArgs> | null;
    /**
     * Filter, which PromotionalOffer to fetch.
     */
    where?: Prisma.PromotionalOfferWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of PromotionalOffers to fetch.
     */
    orderBy?: Prisma.PromotionalOfferOrderByWithRelationInput | Prisma.PromotionalOfferOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for PromotionalOffers.
     */
    cursor?: Prisma.PromotionalOfferWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` PromotionalOffers from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` PromotionalOffers.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of PromotionalOffers.
     */
    distinct?: Prisma.PromotionalOfferScalarFieldEnum | Prisma.PromotionalOfferScalarFieldEnum[];
};
/**
 * PromotionalOffer findMany
 */
export type PromotionalOfferFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PromotionalOffer
     */
    select?: Prisma.PromotionalOfferSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PromotionalOffer
     */
    omit?: Prisma.PromotionalOfferOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PromotionalOfferInclude<ExtArgs> | null;
    /**
     * Filter, which PromotionalOffers to fetch.
     */
    where?: Prisma.PromotionalOfferWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of PromotionalOffers to fetch.
     */
    orderBy?: Prisma.PromotionalOfferOrderByWithRelationInput | Prisma.PromotionalOfferOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing PromotionalOffers.
     */
    cursor?: Prisma.PromotionalOfferWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` PromotionalOffers from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` PromotionalOffers.
     */
    skip?: number;
    distinct?: Prisma.PromotionalOfferScalarFieldEnum | Prisma.PromotionalOfferScalarFieldEnum[];
};
/**
 * PromotionalOffer create
 */
export type PromotionalOfferCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PromotionalOffer
     */
    select?: Prisma.PromotionalOfferSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PromotionalOffer
     */
    omit?: Prisma.PromotionalOfferOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PromotionalOfferInclude<ExtArgs> | null;
    /**
     * The data needed to create a PromotionalOffer.
     */
    data: Prisma.XOR<Prisma.PromotionalOfferCreateInput, Prisma.PromotionalOfferUncheckedCreateInput>;
};
/**
 * PromotionalOffer createMany
 */
export type PromotionalOfferCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many PromotionalOffers.
     */
    data: Prisma.PromotionalOfferCreateManyInput | Prisma.PromotionalOfferCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * PromotionalOffer createManyAndReturn
 */
export type PromotionalOfferCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PromotionalOffer
     */
    select?: Prisma.PromotionalOfferSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the PromotionalOffer
     */
    omit?: Prisma.PromotionalOfferOmit<ExtArgs> | null;
    /**
     * The data used to create many PromotionalOffers.
     */
    data: Prisma.PromotionalOfferCreateManyInput | Prisma.PromotionalOfferCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PromotionalOfferIncludeCreateManyAndReturn<ExtArgs> | null;
};
/**
 * PromotionalOffer update
 */
export type PromotionalOfferUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PromotionalOffer
     */
    select?: Prisma.PromotionalOfferSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PromotionalOffer
     */
    omit?: Prisma.PromotionalOfferOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PromotionalOfferInclude<ExtArgs> | null;
    /**
     * The data needed to update a PromotionalOffer.
     */
    data: Prisma.XOR<Prisma.PromotionalOfferUpdateInput, Prisma.PromotionalOfferUncheckedUpdateInput>;
    /**
     * Choose, which PromotionalOffer to update.
     */
    where: Prisma.PromotionalOfferWhereUniqueInput;
};
/**
 * PromotionalOffer updateMany
 */
export type PromotionalOfferUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update PromotionalOffers.
     */
    data: Prisma.XOR<Prisma.PromotionalOfferUpdateManyMutationInput, Prisma.PromotionalOfferUncheckedUpdateManyInput>;
    /**
     * Filter which PromotionalOffers to update
     */
    where?: Prisma.PromotionalOfferWhereInput;
    /**
     * Limit how many PromotionalOffers to update.
     */
    limit?: number;
};
/**
 * PromotionalOffer updateManyAndReturn
 */
export type PromotionalOfferUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PromotionalOffer
     */
    select?: Prisma.PromotionalOfferSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the PromotionalOffer
     */
    omit?: Prisma.PromotionalOfferOmit<ExtArgs> | null;
    /**
     * The data used to update PromotionalOffers.
     */
    data: Prisma.XOR<Prisma.PromotionalOfferUpdateManyMutationInput, Prisma.PromotionalOfferUncheckedUpdateManyInput>;
    /**
     * Filter which PromotionalOffers to update
     */
    where?: Prisma.PromotionalOfferWhereInput;
    /**
     * Limit how many PromotionalOffers to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PromotionalOfferIncludeUpdateManyAndReturn<ExtArgs> | null;
};
/**
 * PromotionalOffer upsert
 */
export type PromotionalOfferUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PromotionalOffer
     */
    select?: Prisma.PromotionalOfferSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PromotionalOffer
     */
    omit?: Prisma.PromotionalOfferOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PromotionalOfferInclude<ExtArgs> | null;
    /**
     * The filter to search for the PromotionalOffer to update in case it exists.
     */
    where: Prisma.PromotionalOfferWhereUniqueInput;
    /**
     * In case the PromotionalOffer found by the `where` argument doesn't exist, create a new PromotionalOffer with this data.
     */
    create: Prisma.XOR<Prisma.PromotionalOfferCreateInput, Prisma.PromotionalOfferUncheckedCreateInput>;
    /**
     * In case the PromotionalOffer was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.PromotionalOfferUpdateInput, Prisma.PromotionalOfferUncheckedUpdateInput>;
};
/**
 * PromotionalOffer delete
 */
export type PromotionalOfferDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PromotionalOffer
     */
    select?: Prisma.PromotionalOfferSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PromotionalOffer
     */
    omit?: Prisma.PromotionalOfferOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PromotionalOfferInclude<ExtArgs> | null;
    /**
     * Filter which PromotionalOffer to delete.
     */
    where: Prisma.PromotionalOfferWhereUniqueInput;
};
/**
 * PromotionalOffer deleteMany
 */
export type PromotionalOfferDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which PromotionalOffers to delete
     */
    where?: Prisma.PromotionalOfferWhereInput;
    /**
     * Limit how many PromotionalOffers to delete.
     */
    limit?: number;
};
/**
 * PromotionalOffer without action
 */
export type PromotionalOfferDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PromotionalOffer
     */
    select?: Prisma.PromotionalOfferSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PromotionalOffer
     */
    omit?: Prisma.PromotionalOfferOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PromotionalOfferInclude<ExtArgs> | null;
};
export {};
//# sourceMappingURL=PromotionalOffer.d.ts.map