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
import { Plus, Search, X } from 'lucide-react'
import CreateProductModal from './CreateProductModal'
import EditProductModal from './EditProductModal'
import DeleteProductModal from './DeleteProductModal'
import { getAllSubcategories } from './categoryUtils'

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

  const subcategories = useMemo(() => {
    return getAllSubcategories(categories)
  }, [categories])

  const filteredProducts = useMemo(() => {
    if (!products) return []
    if (!searchTerm.trim()) return products

    const lowerSearchTerm = searchTerm.toLowerCase()
    return products.filter(Boolean).filter(product =>
      product.name.toLowerCase().includes(lowerSearchTerm) ||
      product.description.toLowerCase().includes(lowerSearchTerm) ||
      (product.color && product.color.toLowerCase().includes(lowerSearchTerm)) ||
      (product.size && product.size.toLowerCase().includes(lowerSearchTerm))
    )
  }, [products, searchTerm])

  if (isLoading) return <div className="p-4">Loading...</div>
  if (error) return <div className="p-4 text-red-600">Error Loading Products...</div>

  return (
    // ✅ SCROLL CONTAINER (THIS FIXES YOUR ISSUE)
    <div className="h-screen overflow-y-auto">
      <div className="p-4 space-y-4">
        <div className="flex gap-4 items-center">
          <button
            onClick={() => setCreateModalOpen(true)}
            className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl shadow-md hover:bg-green-700 font-medium"
          >
            <Plus size={20} />
            Create New Product
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={(p) => {
                setSelectedProduct(p)
                setEditModalOpen(true)
              }}
              onDelete={(p) => {
                setSelectedProduct(p)
                setDeleteModalOpen(true)
              }}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12">
          <Search className="text-gray-300 mb-4" size={48} />
          <p className="text-gray-500 text-lg">No products found</p>
        </div>
      )}

      <CreateProductModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={async (data) => {
          setIsSubmitting(true)
          await createProduct(data).unwrap()
          setIsSubmitting(false)
          setCreateModalOpen(false)
        }}
        categories={subcategories}
        isLoading={isSubmitting}
      />

      {selectedProduct && (
        <EditProductModal
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false)
            setSelectedProduct(undefined)
          }}
          onSubmit={async (data) => {
            if (!selectedProduct.id) return
            setIsSubmitting(true)
            await updateProduct({ id: selectedProduct.id, data }).unwrap()
            setIsSubmitting(false)
            setEditModalOpen(false)
          }}
          product={selectedProduct}
          categories={subcategories}
          isLoading={isSubmitting}
        />
      )}

      <DeleteProductModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false)
          setSelectedProduct(undefined)
        }}
        onConfirm={async () => {
          if (!selectedProduct?.id) return
          setIsSubmitting(true)
          await deleteProduct(selectedProduct.id).unwrap()
          setIsSubmitting(false)
          setDeleteModalOpen(false)
        }}
        productName={selectedProduct?.name}
        productId={selectedProduct?.id}
        isLoading={isSubmitting}
      />
    </div>
  )
}

export default ProductPage
