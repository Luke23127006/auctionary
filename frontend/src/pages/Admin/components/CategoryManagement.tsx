import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Badge } from "../../../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import {
  FolderTree,
  Plus,
  ChevronRight,
  ChevronDown,
  Trash2,
  Package,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../components/ui/alert-dialog";
import { useAdminCategories } from "../../../hooks/useAdminCategories";

export function CategoryManagement() {
  // Use admin categories hook for all data and handlers
  const {
    categories,
    stats,
    loading,
    error,
    expandedCategories,
    toggleExpanded,
    handleCreate,
    handleDelete,
    refetch,
  } = useAdminCategories();
  // Local UI state for add dialog
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryParent, setNewCategoryParent] = useState<number | null>(
    null
  );

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;

    try {
      await handleCreate({
        name: newCategoryName,
        parentId: newCategoryParent,
      });
      // Success toast is handled by hook
      setNewCategoryName("");
      setNewCategoryParent(null);
      setAddDialogOpen(false);
    } catch (error) {
      // Error toast is handled by hook, keep dialog open
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-4">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderTree className="h-5 w-5" />
              Category Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-20 bg-secondary/50 animate-pulse rounded-lg"
                />
              ))}
            </div>
            <div className="h-64 bg-secondary/50 animate-pulse rounded-lg" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-4">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderTree className="h-5 w-5" />
              Category Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="py-12 text-center space-y-4">
              <div className="text-destructive text-lg font-medium">
                Failed to load categories
              </div>
              <p className="text-muted-foreground">{error}</p>
              <Button onClick={refetch} variant="outline">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Empty state
  if (categories.length === 0) {
    return (
      <div className="space-y-4">
        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FolderTree className="h-5 w-5" />
                Category Management
              </CardTitle>
              <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Category
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-border">
                  <DialogHeader>
                    <DialogTitle>Add New Category</DialogTitle>
                    <DialogDescription>
                      Create a new category for organizing auctions.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Category Name</Label>
                      <Input
                        id="name"
                        placeholder="Enter category name"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button onClick={handleAddCategory}>Add Category</Button>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="py-12 text-center space-y-2">
              <div className="text-muted-foreground">No categories yet</div>
              <p className="text-sm text-muted-foreground">
                Create your first category to get started
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl mb-2">Category Management</h1>
          <p className="text-sm text-muted-foreground">
            Organize and manage auction categories
          </p>
        </div>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-5 w-5" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-accent/30">
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>
                Create a new category or subcategory for organizing auctions
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="categoryName">
                  Category Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="categoryName"
                  placeholder="e.g., Smartphones"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="parentCategory">
                  Parent Category (Optional)
                </Label>
                <select
                  id="parentCategory"
                  value={newCategoryParent ?? ""}
                  onChange={(e) =>
                    setNewCategoryParent(
                      e.target.value ? Number(e.target.value) : null
                    )
                  }
                  className="w-full h-10 px-3 rounded-lg bg-background border border-border text-sm"
                >
                  <option value="">None (Main Category)</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setAddDialogOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button onClick={handleAddCategory} className="flex-1">
                  Add Category
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl mb-1">{stats.mainCategories}</div>
                <div className="text-xs text-muted-foreground">
                  Main Categories
                </div>
              </div>
              <div className="p-2 rounded-lg bg-accent/10 border border-accent/30">
                <FolderTree className="h-5 w-5 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl mb-1">{stats.subcategories}</div>
                <div className="text-xs text-muted-foreground">
                  Subcategories
                </div>
              </div>
              <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/30">
                <FolderTree className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl mb-1">{stats.totalCategories}</div>
                <div className="text-xs text-muted-foreground">
                  Total Categories
                </div>
              </div>
              <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/30">
                <Package className="h-5 w-5 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Tree */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-lg">Category Tree</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {categories.map((category) => (
              <div key={category.id}>
                {/* Main Category */}
                <div className="group hover:bg-secondary/30 transition-colors">
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3 flex-1">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => toggleExpanded(category.id)}
                        className="h-6 w-6 p-0"
                      >
                        {expandedCategories.has(category.id) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>

                      <div className="p-2 rounded-lg bg-accent/10 border border-accent/30">
                        <FolderTree className="h-4 w-4 text-accent" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span>{category.name}</span>
                          <Badge className="bg-secondary text-foreground border-border text-xs">
                            {category.subcategories?.length || 0} subcategories
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-card border-red-500/30">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Category</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{category.name}"?
                              {category.subcategories &&
                                category.subcategories.length > 0 && (
                                  <span>
                                    {" "}
                                    This will also affect{" "}
                                    {category.subcategories.length}{" "}
                                    subcategories.
                                  </span>
                                )}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() =>
                                handleDelete(category.id, category.name)
                              }
                              className="bg-destructive text-white hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>

                {/* Subcategories */}
                {expandedCategories.has(category.id) &&
                  category.subcategories && (
                    <div className="bg-secondary/20">
                      {category.subcategories.map((sub) => (
                        <div
                          key={sub.id}
                          className="group hover:bg-secondary/50 transition-colors"
                        >
                          <div className="flex items-center justify-between p-4 pl-16">
                            <div className="flex items-center gap-3 flex-1">
                              <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/30">
                                <FolderTree className="h-3 w-3 text-blue-500" />
                              </div>

                              <span className="text-sm">{sub.name}</span>
                            </div>

                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-destructive"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="bg-card border-red-500/30">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Delete Subcategory
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete "
                                      {sub.name}"?
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        handleDelete(sub.id, sub.name)
                                      }
                                      className="bg-destructive text-white hover:bg-destructive/90"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
