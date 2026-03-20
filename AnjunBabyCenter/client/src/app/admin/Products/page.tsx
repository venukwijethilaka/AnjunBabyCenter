"use client"
import React, { useState, useMemo } from 'react'
import ProductCard from './productCard'
import {
  useGetProductsQuery,
  Product,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetCategoriesQuery
} from '@/state/api'
import { Plus, Search, X, Package } from 'lucide-react'
import dynamic from 'next/dynamic'
import { getAllSubcategories } from './categoryUtils'

// Lazy load heavy modals (they contain rich text editors & image uploaders)
const CreateProductModal = dynamic(() => import('./CreateProductModal'), { ssr: false })
const EditProductModal = dynamic(() => import('./EditProductModal'), { ssr: false })
const DeleteProductModal = dynamic(() => import('./DeleteProductModal'), { ssr: false })

const ProductPage = () => {
  const { data: products, isLoading, error } = useGetProductsQuery()
  const { data: categories = [] } = useGetCategoriesQuery()
  const [createProduct] = useCreateProductMutation()
  const [updateProduct] = useUpdateProductMutation()
  const [deleteProduct] = useDeleteProductMutation()

  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>()
  const [searchTerm, setSearchTerm] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const subcategories = useMemo(() => getAllSubcategories(categories), [categories])

  const filteredProducts = useMemo(() => {
    if (!products) return []
    if (!searchTerm.trim()) return products
    const lower = searchTerm.toLowerCase()
    // Strip HTML tags from description for plain-text search
    const stripHtml = (html: string) => html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
    return (products || []).filter(Boolean).filter(p =>
      p.name.toLowerCase().includes(lower) ||
      stripHtml(p.description).toLowerCase().includes(lower) ||
      (p.color && p.color.toLowerCase().includes(lower)) ||
      (p.size && p.size.toLowerCase().includes(lower))
    )
  }, [products, searchTerm])

  if (isLoading) return (
    <div className="min-h-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
        <p className="text-blue-600 font-bold">Loading Products...</p>
      </div>
    </div>
  )
  if (error) return <div className="p-8 text-red-600 font-bold">Error Loading Products</div>

  return (
    <div className="min-h-full bg-slate-50">
      <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">

        {/* ── Header ── */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-2xl">
              <Package className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-800">Products</h1>
              <p className="text-slate-500 text-sm font-medium mt-0.5">{products?.length || 0} products in your store</p>
            </div>
          </div>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-2.5 px-6 py-3.5 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-0.5 active:scale-95 transition-all"
          >
            <Plus size={20} />
            Add New Product
          </button>
        </header>

        {/* ── Search ── */}
        <div className="bg-white rounded-[24px] border border-blue-50 shadow-sm p-5">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, description, color, or size..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-13 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 font-medium text-slate-700 transition-all"
              style={{ paddingLeft: '3.25rem' }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            )}
          </div>
          {searchTerm && (
            <p className="text-xs text-slate-400 font-medium mt-2 ml-1">
              {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''} for "{searchTerm}"
            </p>
          )}
        </div>

        {/* ── Grid ── */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={(p) => { setSelectedProduct(p); setEditModalOpen(true) }}
                onDelete={(p) => { setSelectedProduct(p); setDeleteModalOpen(true) }}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[28px] border border-blue-50 shadow-sm flex flex-col items-center justify-center py-20 gap-4">
            <div className="p-5 bg-blue-50 rounded-[24px]">
              <Search className="text-blue-300 w-10 h-10" />
            </div>
            <p className="text-slate-500 font-bold text-lg">No products found</p>
            <p className="text-slate-400 text-sm">Try adjusting your search terms</p>
          </div>
        )}
      </div>

      <CreateProductModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={async (data) => { setIsSubmitting(true); await createProduct(data).unwrap(); setIsSubmitting(false); setCreateModalOpen(false); }}
        categories={subcategories}
        isLoading={isSubmitting}
      />

      {selectedProduct && (
        <EditProductModal
          isOpen={editModalOpen}
          onClose={() => { setEditModalOpen(false); setSelectedProduct(undefined) }}
          onSubmit={async (data) => { if (!selectedProduct.id) return; setIsSubmitting(true); await updateProduct({ id: selectedProduct.id, data }).unwrap(); setIsSubmitting(false); setEditModalOpen(false); }}
          product={selectedProduct}
          categories={subcategories}
          isLoading={isSubmitting}
        />
      )}

      <DeleteProductModal
        isOpen={deleteModalOpen}
        onClose={() => { setDeleteModalOpen(false); setSelectedProduct(undefined) }}
        onConfirm={async () => { if (!selectedProduct?.id) return; setIsSubmitting(true); await deleteProduct(selectedProduct.id).unwrap(); setIsSubmitting(false); setDeleteModalOpen(false); }}
        productName={selectedProduct?.name}
        productId={selectedProduct?.id}
        isLoading={isSubmitting}
      />
    </div>
  )
}

export default ProductPage
