import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { Button } from "../../components/ui/button";
import type { CategoryNode } from "../../types/category";
import type { Product } from "../../types/product";
import * as categoryService from "../../services/categoryService";
import * as productService from "../../services/productService";
import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import { ActiveFilters } from "../../components/auction/ActiveFilters";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { ProductListCard } from "../../components/auction/ProductListCard";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { CategoryFilter } from "../../components/auction/CategoryFilter";
import { Separator } from "../../components/ui/separator";
import { Slider } from "../../components/ui/slider";

export default function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total: 0,
    totalPages: 0,
  });
  const [priceRange, setPriceRange] = useState([0, 5000]);

  const searchQuery = searchParams.get("q") || "";
  const categorySlugs = searchParams.getAll("categorySlug");
  const currentPage = parseInt(searchParams.get("page") || "1");
  const sortParam = searchParams.get("sort") || "endTime:asc";

  useEffect(() => {
    if (!searchParams.has("sort")) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("sort", "endTime:asc");
      setSearchParams(newParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const mappedCategories = await categoryService.getCategories();
        setCategories(mappedCategories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setProductsLoading(true);
        const result = await productService.searchProducts({
          q: searchQuery || undefined,
          categorySlug: categorySlugs.length > 0 ? categorySlugs : undefined,
          page: currentPage,
          limit: 9,
          sort: sortParam,
        });
        setProducts(result.data);
        setPagination(result.pagination);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, categorySlugs.join(","), currentPage, sortParam]);

  const handleCategoryChange = (categoryIds: string[], checked: boolean) => {
    const newParams = new URLSearchParams(searchParams);
    
    // Remove all existing categorySlug params first
    newParams.delete("categorySlug");
    
    let updatedSlugs: string[];
    if (checked) {
      // Add the new category IDs to existing ones
      updatedSlugs = [...new Set([...categorySlugs, ...categoryIds])];
    } else {
      // Remove the unchecked category IDs
      updatedSlugs = categorySlugs.filter(slug => !categoryIds.includes(slug));
    }
    
    // Append all updated slugs
    updatedSlugs.forEach(slug => newParams.append("categorySlug", slug));
    
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const handleRemoveSearch = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("q");
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const handleRemoveCategory = (categoryId: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("categorySlug");
    const remaining = categorySlugs.filter(slug => slug !== categoryId);
    remaining.forEach(slug => newParams.append("categorySlug", slug));
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const handleClearAllFilters = () => {
    const newParams = new URLSearchParams();
    newParams.set("sort", sortParam);
    setSearchParams(newParams);
  };

  const handleSortChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("sort", value);
    setSearchParams(newParams);
  };

  const handlePageChange = (page: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", page.toString());
    setSearchParams(newParams);
  };

  const getSelectedCategoriesWithNames = () => {
    const selected: Array<{ id: string; name: string }> = [];
    
    const findCategory = (cats: CategoryNode[], slug: string): CategoryNode | null => {
      for (const cat of cats) {
        if (cat.id === slug) return cat;
        if (cat.children) {
          const found = findCategory(cat.children, slug);
          if (found) return found;
        }
      }
      return null;
    };
    
    categorySlugs.forEach(slug => {
      const cat = findCategory(categories, slug);
      if (cat) {
        selected.push({ id: cat.id, name: cat.name });
      }
    });
    
    return selected;
  };

  return (
    <MainLayout>
      {/* Loading Overlay */}
      {productsLoading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-accent border-t-transparent"></div>
            <p className="text-sm text-muted-foreground">Loading products...</p>
          </div>
        </div>
      )}

      {/* Main Layout */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="w-72 flex-shrink-0 hidden lg:block">
            <div className="sticky top-24 space-y-6" style={{ pointerEvents: productsLoading ? 'none' : 'auto', opacity: productsLoading ? 0.6 : 1 }}>
              {/* Filters Card */}
              <Card className="border-border">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <SlidersHorizontal className="h-5 w-5 text-accent" />
                    Filters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Categories */}
                  <div>
                    <h3 className="text-sm mb-3">Categories</h3>
                    {categoriesLoading ? (
                      <div className="text-sm text-muted-foreground">Loading categories...</div>
                    ) : (
                      <CategoryFilter
                        categories={categories}
                        selectedCategories={categorySlugs}
                        onCategoryChange={handleCategoryChange}
                      />
                    )}
                  </div>

                  <Separator />

                  {/* Price Range */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm">Price Range</h3>
                      <span className="text-xs text-accent">
                        ${priceRange[0]} - ${priceRange[1]}
                      </span>
                    </div>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      min={0}
                      max={5000}
                      step={50}
                      className="py-4"
                    />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>$0</span>
                      <span>$5,000</span>
                    </div>
                  </div>

                  <Separator />

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      const newParams = new URLSearchParams(searchParams);
                      newParams.delete("categorySlug");
                      newParams.set("page", "1");
                      setSearchParams(newParams);
                      setPriceRange([0, 5000]);
                    }}
                  >
                    Reset Filters
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="border-border bg-card/50">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Active Listings
                    </span>
                    <span className="text-accent">1,247</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">New Today</span>
                    <span className="text-success">83</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Ending Soon</span>
                    <span className="text-destructive">42</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Top Bar */}
            <div className="mb-6 space-y-4">
              {/* Active Filters & Sort */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                {(searchQuery || categorySlugs.length > 0) && (
                  <ActiveFilters
                    searchQuery={searchQuery}
                    selectedCategories={getSelectedCategoriesWithNames()}
                    onRemoveSearch={handleRemoveSearch}
                    onRemoveCategory={handleRemoveCategory}
                    onClearAll={handleClearAllFilters}
                  />
                )}

                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Sort by:
                  </span>
                  <Select value={sortParam} onValueChange={handleSortChange} disabled={productsLoading}>
                    <SelectTrigger className="w-[180px] h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="endTime:asc">
                        Time: Ending Soon
                      </SelectItem>
                      <SelectItem value="createdAt:desc">
                        Time: Newly Listed
                      </SelectItem>
                      <SelectItem value="currentBid:asc">
                        Price: Low to High
                      </SelectItem>
                      <SelectItem value="currentBid:desc">
                        Price: High to Low
                      </SelectItem>
                      <SelectItem value="bidCount:desc">Most Bids</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Results Count */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing{" "}
                  <span className="text-foreground">
                    {(currentPage - 1) * 9 + 1}-
                    {Math.min(currentPage * 9, pagination.total)}
                  </span>{" "}
                  of <span className="text-foreground">{pagination.total}</span>{" "}
                  results
                </p>
                <Button variant="ghost" size="sm" className="lg:hidden">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </div>
            </div>

            {/* Product Grid */}
            {productsLoading ? (
              <div className="text-center py-12">Loading products...</div>
            ) : products.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No products found
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                {products.map((product) => (
                  <ProductListCard key={product.id} {...product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2" style={{ pointerEvents: productsLoading ? 'none' : 'auto', opacity: productsLoading ? 0.6 : 1 }}>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="icon"
                    onClick={() => handlePageChange(page)}
                    className={currentPage === page ? "border-accent" : ""}
                  >
                    {page}
                  </Button>
                )
              )}

              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  handlePageChange(Math.min(pagination.totalPages, currentPage + 1))
                }
                disabled={currentPage === pagination.totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </main>
        </div>
      </div>
    </MainLayout>
  );
}
