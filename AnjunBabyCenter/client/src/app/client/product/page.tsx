'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Heart, ShoppingCart, Filter, Search, X, ArrowUpDown, Check, Plus, Minus, XCircle } from 'lucide-react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useGetProductsQuery, useGetCategoriesQuery, Product, useAddToCartMutation } from '@/state/api';
import Navbar from '../(components)/NavBar';
import Footer from '../Footer/page';

// ─── Toast System ────────────────────────────────────────────────────────────
type Toast = {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
  thumbnail?: string;
  icon?: React.ReactNode;
};

let toastCounter = 0;

function ToastStack({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: number) => void }) {
  return (
    <div className="fixed top-6 right-6 z-[200] flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center gap-3 px-4 py-3.5 rounded-2xl shadow-2xl border backdrop-blur-sm
            scale-100 opacity-100 animate-in slide-in-from-right-8 duration-300
            ${t.type === 'success' ? 'bg-theme-toggle-bg border-theme-border text-theme-primary' :
              t.type === 'error' ? 'bg-rose-50 border-rose-200 text-rose-700' :
                'bg-blue-50 border-blue-200 text-blue-700'
            }`}
        >
          {t.thumbnail ? (
            <img src={t.thumbnail} alt="" className="w-10 h-10 rounded-xl object-cover bg-white shadow-sm" />
          ) : (
            <div className="p-1.5 bg-white/50 rounded-xl">
              {t.icon || (t.type === 'success' ? <Heart className="w-5 h-5 fill-current" /> :
                t.type === 'error' ? <XCircle className="w-5 h-5" /> : null)}
            </div>
          )}
          <p className="font-bold text-sm pr-4">{t.message}</p>
          <button onClick={() => onDismiss(t.id)} className="p-1 hover:bg-black/5 rounded-lg transition-colors absolute right-2 top-1/2 -translate-y-1/2">
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

// --- CUSTOM DUAL RANGE SLIDER COMPONENT ---
function DualRangeSlider({
  minPrefix = "Rs. ", min, max, globalMin, globalMax, onChangeCommit
}: {
  minPrefix?: string, min: number, max: number, globalMin: number, globalMax: number, onChangeCommit: (min: number, max: number) => void
}) {
  const [localMin, setLocalMin] = useState(min);
  const [localMax, setLocalMax] = useState(max);

  useEffect(() => { setLocalMin(min); setLocalMax(max); }, [min, max]);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalMin(Math.min(Number(e.target.value), localMax - 1));
  };
  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalMax(Math.max(Number(e.target.value), localMin + 1));
  };
  const handleMouseUp = () => onChangeCommit(localMin, localMax);

  const range = globalMax - globalMin || 1;
  const minPercent = ((localMin - globalMin) / range) * 100;
  const maxPercent = ((localMax - globalMin) / range) * 100;

  return (
    <div className="w-full px-2 mt-6">
      <div className="relative h-6 flex items-center">
        <div className="absolute left-0 right-0 h-2.5 bg-gray-100 rounded-full top-1/2 -translate-y-1/2 overflow-hidden">
          {/* Using bg-theme-primary */}
          <div className="absolute h-full bg-theme-primary rounded-full transition-all duration-150" style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }} />
        </div>
        <input type="range" min={globalMin} max={globalMax} step="1" value={localMin} onChange={handleMinChange} onMouseUp={handleMouseUp} onTouchEnd={handleMouseUp} className="absolute w-full h-2 top-1/2 -translate-y-1/2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-theme-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md cursor-pointer z-10" />
        <input type="range" min={globalMin} max={globalMax} step="1" value={localMax} onChange={handleMaxChange} onMouseUp={handleMouseUp} onTouchEnd={handleMouseUp} className="absolute w-full h-2 top-1/2 -translate-y-1/2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-theme-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md cursor-pointer z-20" />
      </div>
      <div className="flex justify-between items-center mt-6 text-sm font-bold text-gray-700">
        <span className="px-4 py-2 bg-white shadow-sm border border-gray-100 rounded-2xl">{minPrefix}{localMin}</span>
        <span className="text-gray-300">-</span>
        <span className="px-4 py-2 bg-white shadow-sm border border-gray-100 rounded-2xl">{minPrefix}{localMax}</span>
      </div>
    </div>
  );
}

export default function BabyProductsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [addingToCart, setAddingToCart] = useState<number | null>(null);
  const [wishlistedProducts, setWishlistedProducts] = useState<number[]>([]);

  // ── Toasts ──
  const [toasts, setToasts] = useState<Toast[]>([]);
  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = ++toastCounter;
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);
  const dismissToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const [expandedCats, setExpandedCats] = useState<string[]>([]);
  const [hasAutoExpanded, setHasAutoExpanded] = useState(false);

  // 1. DATA FETCHING
  const { data: products = [], isLoading: productsLoading } = useGetProductsQuery();
  const { data: rawCategories = [] } = useGetCategoriesQuery();
  const [addToCartMutation] = useAddToCartMutation();

  // FETCH WISHLIST ON LOAD
  useEffect(() => {
    const fetchWishlist = async () => {
      const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        try {
          const token = localStorage.getItem('token') || sessionStorage.getItem('token');
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/wishlist/${user.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.ok) {
            const wishlist = await response.json();
            const wishlistedIds = wishlist.items.map((item: any) => item.productId);
            setWishlistedProducts(wishlistedIds);
          }
        } catch (error) {
          console.error("Error fetching wishlist", error);
        }
      }
    };
    fetchWishlist();
  }, []);

  // 2. URL STATE & DEBOUNCED SEARCH
  const categoryParam = searchParams.get('category');
  const selectedCategories = categoryParam ? categoryParam.split(',') : [];
  const sortBy = searchParams.get('sort') || 'featured';

  const urlSearch = searchParams.get('search') || '';
  const [localSearchQuery, setLocalSearchQuery] = useState(urlSearch);

  useEffect(() => { setLocalSearchQuery(urlSearch); }, [urlSearch]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => updateURL({ search: localSearchQuery || undefined }), 500);
    return () => clearTimeout(delayDebounceFn);
  }, [localSearchQuery]);

  const { globalMinPrice, globalMaxPrice } = useMemo(() => {
    if (!products || products.length === 0) return { globalMinPrice: 0, globalMaxPrice: 1000 };
    const prices = products.map(p => Number(p.price));
    return { globalMinPrice: Math.floor(Math.min(...prices)), globalMaxPrice: Math.ceil(Math.max(...prices)) };
  }, [products]);

  const minPrice = searchParams.has('minPrice') ? Number(searchParams.get('minPrice')) : globalMinPrice;
  const maxPrice = searchParams.has('maxPrice') ? Number(searchParams.get('maxPrice')) : globalMaxPrice;

  // 3. URL HELPER
  const updateURL = (paramsUpdate: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(paramsUpdate).forEach(([key, value]) => {
      if (value === undefined || value === '') params.delete(key);
      else params.set(key, String(value));
    });
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const categoryTree = useMemo(() => {
    const parents = rawCategories.filter(c => !c.parentId && c.isActive);
    return parents.map(parent => ({
      ...parent,
      children: rawCategories.filter(c => c.parentId === parent.id && c.isActive)
    }));
  }, [rawCategories]);

  // AUTO-EXPAND ACCORDIONS ONCE
  useEffect(() => {
    if (categoryTree.length > 0 && !hasAutoExpanded) {
      const categoriesToExpand: string[] = [];
      categoryTree.forEach(parent => {
        const parentName = parent.name.toLowerCase();
        const hasSelectedChild = parent.children.some(child => selectedCategories.includes(child.name.toLowerCase()));
        if (selectedCategories.includes(parentName) || hasSelectedChild) {
          categoriesToExpand.push(parentName);
        }
      });
      if (categoriesToExpand.length > 0) setExpandedCats(categoriesToExpand);
      setHasAutoExpanded(true);
    }
  }, [categoryTree, selectedCategories, hasAutoExpanded]);

  // 4. MULTI-CATEGORY TOGGLE
  const toggleCategory = (catName: string, childrenNames: string[] = []) => {
    let newCats = [...selectedCategories];
    if (newCats.includes(catName)) {
      newCats = newCats.filter(c => c !== catName && !childrenNames.includes(c));
    } else {
      newCats.push(catName);
      childrenNames.forEach(child => { if (!newCats.includes(child)) newCats.push(child); });
    }
    updateURL({ category: newCats.length > 0 ? newCats.join(',') : undefined });
  };

  const toggleExpand = (catName: string) => {
    setExpandedCats(prev => prev.includes(catName) ? prev.filter(c => c !== catName) : [...prev, catName]);
  };

  // 5. FILTER & SORT LOGIC
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        let isInCategory = true;
        if (selectedCategories.length > 0) {
          isInCategory = selectedCategories.some(catName => {
            const activeCat = rawCategories.find(c => c.name.toLowerCase() === catName.toLowerCase());
            return p.categoryId === activeCat?.id || p.category?.parentId === activeCat?.id;
          });
        }
        const matchesSearch = (p.name || '').toLowerCase().includes((searchParams.get('search') || '').toLowerCase());
        const matchesPrice = Number(p.price) >= minPrice && Number(p.price) <= maxPrice;

        return p.availability && isInCategory && matchesSearch && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return Number(a.price) - Number(b.price);
        if (sortBy === 'price-high') return Number(b.price) - Number(a.price);
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return 0; // featured
      });
  }, [products, selectedCategories, searchParams, sortBy, minPrice, maxPrice, rawCategories]);

  // Handle Add to Cart
  const handleAddToCart = async (product: Product) => {
    try {
      const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (!userStr) {
        addToast({ message: 'Please log in to add items to cart', type: 'error', icon: <XCircle className="w-5 h-5" /> });
        router.push('/client/sign-in');
        return;
      }
      const user = JSON.parse(userStr);
      setAddingToCart(product.id);
      await addToCartMutation({ userId: Number(user.id), productId: product.id, quantity: 1 }).unwrap();
      const thumbnail = product.images?.find((img: any) => img.isMain)?.url || product.images?.[0]?.url;
      addToast({ message: `${product.name} added to cart!`, type: 'success', thumbnail });
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error(error);
      addToast({ message: 'Failed to add to cart. Please try again.', type: 'error', icon: <XCircle className="w-5 h-5" /> });
    } finally {
      setAddingToCart(null);
    }
  };

  // Handle Wishlist Toggle
  const handleWishlistToggle = async (product: Product) => {
    try {
      const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (!userStr) {
        addToast({ message: 'Please log in to use wishlist', type: 'error', icon: <XCircle className="w-5 h-5" /> });
        router.push('/client/sign-in');
        return;
      }
      const user = JSON.parse(userStr);
      const isWishlisted = wishlistedProducts.includes(product.id);
      const thumbnail = product.images?.find((img: any) => img.isMain)?.url || product.images?.[0]?.url;

      if (isWishlisted) {
        setWishlistedProducts(prev => prev.filter(id => id !== product.id));
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/wishlist/${user.id}/${product.id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        addToast({ message: `Removed from wishlist`, type: 'info', thumbnail });
      } else {
        setWishlistedProducts(prev => [...prev, product.id]);
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/wishlist`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ userId: Number(user.id), productId: product.id }),
        });
        addToast({ message: `${product.name} added to wishlist! ❤️`, type: 'success', thumbnail });
      }
      window.dispatchEvent(new Event('wishlistUpdated'));
    } catch (error) {
      console.error(error);
      addToast({ message: 'Failed to update wishlist', type: 'error', icon: <XCircle className="w-5 h-5" /> });
    }
  };

  // --- CUSTOM CHECKBOX ---
  const CustomCheckbox = ({ checked, label, isSub = false }: { checked: boolean, label: string, isSub?: boolean }) => (
    <div className={`flex items-center gap-3 cursor-pointer group w-full py-2 px-3 rounded-2xl transition-all ${checked ? 'bg-theme-bg/80' : 'hover:bg-gray-50'}`}>
      <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${checked ? 'bg-theme-primary border-theme-primary shadow-sm' : 'border-gray-300 bg-white group-hover:border-theme-light'}`}>
        {checked && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3.5} />}
      </div>
      <span className={`transition-colors ${isSub ? 'text-[13px]' : 'text-[15px]'} ${checked ? 'text-gray-900 font-bold' : 'text-gray-600 font-medium group-hover:text-gray-900'}`}>{label}</span>
    </div>
  );

  // --- REUSABLE FILTER JSX ---
  const filterSectionJSX = (
    <div className="space-y-8">
      {/* Search */}
      <div>
        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 pl-1">Search</h3>
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-theme-primary transition-colors" />
          <input
            type="text" value={localSearchQuery} onChange={(e) => setLocalSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl text-sm font-medium focus:border-theme-border focus:bg-white outline-none transition-all placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Categories Accordion */}
      <div>
        <div className="flex justify-between items-center mb-4 pl-1">
          <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Categories</h3>
          {selectedCategories.length > 0 && (
            <button onClick={() => updateURL({ category: undefined })} className="text-[11px] font-bold text-theme-primary hover:opacity-80 hover:underline">Clear All</button>
          )}
        </div>

        <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
          {categoryTree.map((parent) => {
            const parentKey = parent.name.toLowerCase();
            const childrenKeys = parent.children.map(c => c.name.toLowerCase());
            const isExpanded = expandedCats.includes(parentKey);

            return (
              <div key={parent.id} className="bg-white border border-gray-100/80 rounded-3xl overflow-hidden transition-all duration-300 hover:border-theme-toggle-bg shadow-sm">
                <div className="flex items-center justify-between pr-3 pl-1 py-1">
                  <div className="flex-1" onClick={() => toggleCategory(parentKey, childrenKeys)}>
                    <CustomCheckbox label={parent.name} checked={selectedCategories.includes(parentKey)} />
                  </div>
                  {parent.children.length > 0 && (
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleExpand(parentKey); }}
                      className={`p-2 rounded-2xl transition-all ${isExpanded ? 'bg-theme-toggle-bg text-theme-primary shadow-inner' : 'bg-gray-50 text-gray-400 hover:bg-theme-bg hover:text-theme-primary'}`}
                    >
                      {isExpanded ? <Minus className="w-4 h-4" strokeWidth={3} /> : <Plus className="w-4 h-4" strokeWidth={3} />}
                    </button>
                  )}
                </div>

                {/* Subcategories */}
                {isExpanded && parent.children.length > 0 && (
                  <div className="px-3 pb-3 pt-1 space-y-1 bg-gray-50/50 animate-in slide-in-from-top-2 fade-in duration-200 rounded-b-3xl">
                    <div className="pl-4 border-l-2 border-theme-border space-y-1 py-2">
                      {parent.children.map(child => {
                        const childKey = child.name.toLowerCase();
                        return (
                          <div key={child.id} onClick={() => toggleCategory(childKey)}>
                            <CustomCheckbox isSub label={child.name} checked={selectedCategories.includes(childKey)} />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Price Range Slider */}
      <div className="pt-4 border-t border-gray-100">
        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 pl-1">Price Range</h3>
        <DualRangeSlider
          minPrefix="Rs. " min={minPrice} max={maxPrice} globalMin={globalMinPrice} globalMax={globalMaxPrice}
          onChangeCommit={(min, max) => updateURL({ minPrice: min, maxPrice: max })}
        />
      </div>
    </div>
  );

  if (productsLoading) return <div className="h-screen flex items-center justify-center text-theme-primary font-bold">Loading Store...</div>;

  return (
    <div className="min-h-screen bg-gray-50/40">
      <Navbar />

      {/* ── Rich Toast System ── */}
      <ToastStack toasts={toasts} onDismiss={dismissToast} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-[120px] pb-20">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* --- SIDEBAR (PC) --- */}
          <aside className="hidden lg:block w-[320px] shrink-0 bg-white p-7 rounded-[32px] shadow-sm border border-gray-100 h-fit sticky top-28">
            {filterSectionJSX}
          </aside>

          {/* --- MAIN GRID --- */}
          <main className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-white p-4 sm:px-6 rounded-[28px] shadow-sm border border-gray-100">
              <button onClick={() => setIsMobileFilterOpen(true)} className="lg:hidden flex items-center justify-center gap-2 text-theme-primary font-bold p-3.5 bg-theme-bg rounded-2xl w-full sm:w-auto">
                <Filter className="w-5 h-5" /> Filter & Sort
              </button>

              <div className="text-sm font-bold text-gray-400 uppercase tracking-tight text-center sm:text-left">
                Showing <span className="text-gray-900 px-1">{filteredProducts.length}</span> Products
              </div>

              <div className="hidden sm:flex items-center gap-3 bg-gray-50 px-5 py-3 rounded-2xl">
                <ArrowUpDown className="w-4 h-4 text-theme-light shrink-0" />
                <select value={sortBy} onChange={(e) => updateURL({ sort: e.target.value })} className="bg-transparent text-sm font-bold text-gray-700 outline-none cursor-pointer">
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
              {filteredProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  addingToCart={addingToCart}
                  onAddToCart={handleAddToCart}
                  isWishlisted={wishlistedProducts.includes(p.id)}
                  onWishlist={handleWishlistToggle}
                />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-32 bg-white rounded-[40px] border border-gray-100 shadow-sm">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-2xl font-black text-gray-800">No matching products</h3>
                <p className="text-gray-500 mt-2 font-medium">Try adjusting your filters or search terms.</p>
                <button onClick={() => updateURL({ category: undefined, search: undefined, minPrice: undefined, maxPrice: undefined })} className="mt-8 px-8 py-3.5 bg-theme-primary text-white font-bold rounded-2xl shadow-lg hover:bg-theme-bg-hover transition-all hover:-translate-y-1">Clear All Filters</button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* --- MOBILE FILTER DRAWER --- */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-[200] lg:hidden">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" onClick={() => setIsMobileFilterOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-[85%] max-w-[360px] bg-white p-6 md:p-8 shadow-2xl animate-in slide-in-from-right duration-300 rounded-l-[40px] overflow-y-auto flex flex-col">
            <div className="flex justify-between items-center mb-6 shrink-0">
              <h2 className="text-2xl font-black text-gray-900">Filters</h2>
              <button onClick={() => setIsMobileFilterOpen(false)} className="p-2.5 bg-gray-100 rounded-full text-gray-500 hover:bg-theme-toggle-bg hover:text-theme-primary transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-6 pb-6 border-b border-gray-100 shrink-0">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 pl-1">Sort By</h3>
              <div className="flex items-center gap-3 bg-gray-50 px-4 py-3.5 rounded-2xl w-full">
                <ArrowUpDown className="w-4 h-4 text-theme-light shrink-0" />
                <select value={sortBy} onChange={(e) => updateURL({ sort: e.target.value })} className="w-full bg-transparent text-sm font-bold text-gray-700 outline-none cursor-pointer">
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
              {filterSectionJSX}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100 shrink-0 pb-10">
              <button onClick={() => setIsMobileFilterOpen(false)} className="w-full py-4 bg-theme-primary text-white font-bold rounded-2xl shadow-lg active:scale-95 transition-all text-lg">
                Show {filteredProducts.length} Results
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

// PRODUCT CARD COMPONENT
function ProductCard({
  product,
  addingToCart,
  onAddToCart,
  isWishlisted,
  onWishlist
}: {
  product: Product,
  addingToCart: number | null,
  onAddToCart: (p: Product) => void,
  isWishlisted: boolean,
  onWishlist: (p: Product) => void
}) {
  const router = useRouter();
  const thumbnail = product.images?.[0]?.url || '/placeholder-baby.png';

  return (
    <div className="p-2 -m-2 group">
      <div
        className="bg-white rounded-[28px] p-4 border border-gray-100 shadow-sm group-hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer group-hover:-translate-y-1 relative"
        onClick={() => router.push(`/client/product/${product.id}`)}
      >
        <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-gray-50 mb-5">
          <img src={thumbnail} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />

          <button
            onClick={(e) => { e.stopPropagation(); onWishlist(product); }}
            className="absolute top-3 right-3 p-2.5 text-theme-light hover:text-theme-primary hover:bg-theme-bg transition-all active:scale-95 shadow-sm hover:shadow-md bg-white/90 backdrop-blur-sm rounded-2xl z-10"
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-theme-primary text-theme-primary' : 'text-theme-border'}`} />
          </button>
        </div>

        <div className="flex flex-col flex-grow px-1">
          <h3 className="font-extrabold text-gray-800 text-[15px] leading-snug line-clamp-2 mb-2">{product.name}</h3>
          <p className="text-theme-primary font-black text-lg mt-auto pb-4">Rs. {Number(product.price).toLocaleString()}</p>

          <button
            onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
            disabled={addingToCart === product.id}
            className="w-full bg-theme-bg text-theme-primary py-3 rounded-2xl font-bold hover:bg-theme-primary hover:text-white transition-colors flex justify-center items-center gap-2 shadow-sm"
          >
            {addingToCart === product.id ? (
              <div className="w-5 h-5 border-[3px] border-current border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <><ShoppingCart className="w-5 h-5" /> Add to Cart</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}