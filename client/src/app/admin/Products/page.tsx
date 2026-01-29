"use client"
import React, { useState, useMemo } from 'react'
import ProductCard from './productCard'
import { useGetProductsQuery, Product, useCreateProductMutation, useUpdateProductMutation, useDeleteProductMutation, useGetCategoriesQuery } from '@/state/api'
import { Plus, Search, X } from 'lucide-react'
import CreateProductModal from './CreateProductModal'
import EditProductModal from './EditProductModal'
import DeleteProductModal from './DeleteProductModal'
import { getAllSubcategories } from './categoryUtils'

const ProductPage = () => { // Changed 'page' to 'ProductPage' for better convention
    const { data: products, isLoading, error } = useGetProductsQuery();
    const { data: categories = [] } = useGetCategoriesQuery();
    const [createProduct] = useCreateProductMutation();
    const [updateProduct] = useUpdateProductMutation();
    const [deleteProduct] = useDeleteProductMutation();
    
    const [createModalOpen, setCreateModalOpen] = useState(false)
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState<Product | undefined>()
    const [searchTerm, setSearchTerm] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Get only subcategories (children categories)
    const subcategories = useMemo(() => {
      return getAllSubcategories(categories)
    }, [categories])

    // Filter products based on search term
    const filteredProducts = useMemo(() => {
      if (!products) return []
      if (!searchTerm.trim()) return products

      const lowerSearchTerm = searchTerm.toLowerCase()
      return products.filter(product => 
        product.name.toLowerCase().includes(lowerSearchTerm) ||
        product.description.toLowerCase().includes(lowerSearchTerm) ||
        (product.color && product.color.toLowerCase().includes(lowerSearchTerm)) ||
        (product.size && product.size.toLowerCase().includes(lowerSearchTerm))
      )
    }, [products, searchTerm])

    const handleOpenCreateModal = () => setCreateModalOpen(true)
    const handleCloseCreateModal = () => setCreateModalOpen(false)

    const handleOpenEditModal = (product: Product) => {
        setSelectedProduct(product)
        setEditModalOpen(true)
    }

    const handleCloseEditModal = () => {
        setEditModalOpen(false)
        setSelectedProduct(undefined)
    }

    const handleOpenDeleteModal = (product: Product) => {
        setSelectedProduct(product)
        setDeleteModalOpen(true)
    }

    const handleCloseDeleteModal = () => {
        setDeleteModalOpen(false)
        setSelectedProduct(undefined)
    }

    // --- UPDATED CREATE HANDLER ---
    const handleCreateProduct = async (formData: any) => {
        try {
            setIsSubmitting(true)
            
            // The Modal already sends the correct structure:
            // { name, description, price, quantity, categoryId, images: [] ... }
            // We pass it directly to the mutation.
            
            await createProduct(formData).unwrap()
            
            alert('Product created successfully!')
            handleCloseCreateModal()
        } catch (err: any) {
            console.error('Error creating product:', err)
            // This alert will show the specific validation error from your backend
            alert(`Error: ${err?.data?.message || err?.message || 'Failed to create product'}`)
        } finally {
            setIsSubmitting(false)
        }
    }

    // --- UPDATED EDIT HANDLER ---
    const handleEditProduct = async (formData: any) => {
        try {
            setIsSubmitting(true)

            if (!selectedProduct?.id) {
                alert('Product ID not found')
                return
            }

            // Similarly, we pass the formData directly as it contains the new 'images' array
            await updateProduct({ 
                id: selectedProduct.id, 
                data: formData 
            }).unwrap()
            
            alert('Product updated successfully!')
            handleCloseEditModal()
        } catch (err: any) {
            console.error('Error updating product:', err)
            alert(`Error: ${err?.data?.message || err?.message || 'Failed to update product'}`)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeleteProduct = async () => {
        try {
            setIsSubmitting(true)
            if (!selectedProduct?.id) return

            await deleteProduct(selectedProduct.id).unwrap()
            alert('Product deleted successfully!')
            handleCloseDeleteModal()
        } catch (err: any) {
            console.error('Error deleting product:', err)
            alert('Error deleting product')
        } finally {
            setIsSubmitting(false)
        }
    }

    if(isLoading) return(<div className="p-4">Loading...</div>);
    if(error) return(<div className="p-4 text-red-600">Error Loading Products...</div>);

    return (
      <div className="">
        <div className="p-4 space-y-4">
          <div className="flex gap-4 items-center">
            <button 
              onClick={handleOpenCreateModal}
              className='cursor-pointer flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl shadow-md hover:bg-green-700 font-medium'
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
                <button onClick={() => setSearchTerm('')} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              )}
            </div>
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4'>
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product}
                onEdit={handleOpenEditModal}
                onDelete={handleOpenDeleteModal}
              />
            ))}
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center p-12'>
            <Search className="text-gray-300 mb-4" size={48} />
            <p className="text-gray-500 text-lg">No products found</p>
          </div>
        )}

        <CreateProductModal 
          isOpen={createModalOpen}
          onClose={handleCloseCreateModal}
          onSubmit={handleCreateProduct}
          categories={subcategories}
          isLoading={isSubmitting}
        />

        {selectedProduct && (
            <EditProductModal 
                isOpen={editModalOpen}
                onClose={handleCloseEditModal}
                onSubmit={handleEditProduct}
                product={selectedProduct}
                categories={subcategories}
                isLoading={isSubmitting}
            />
        )}

        <DeleteProductModal 
          isOpen={deleteModalOpen}
          onClose={handleCloseDeleteModal}
          onConfirm={handleDeleteProduct}
          productName={selectedProduct?.name}
          productId={selectedProduct?.id}
          isLoading={isSubmitting}
        />
      </div>
    )
}

export default ProductPage