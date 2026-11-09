import { Tag, FolderTree } from 'lucide-react';
import { getCategories, getDestinations } from '@/lib/db';
import { deleteCategoryAction } from '@/lib/admin-actions';
import { DeleteButton } from '@/components/admin/delete-button';
import { CategoryCreateForm } from '@/components/admin/category-form';

export const instant = false;

export default async function CategoriesPage() {
  const [categories, destinations] = await Promise.all([
    getCategories(),
    getDestinations(),
  ]);

  function getDestinationCount(catId: string) {
    return destinations.filter((d) => d.categoryId === catId).length;
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold text-cream tracking-tight">Categories</h1>
        <p className="mt-1 text-cream/50 text-sm">
          Organize destinations into categories (e.g. Kerala, International, Domestic, Honeymoon).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Category List */}
        <div className="lg:col-span-7 bg-navy-900 rounded-2xl border border-cream/10 overflow-hidden">
          <div className="p-5 border-b border-cream/10 flex items-center gap-2">
            <FolderTree className="size-4 text-gold-400" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-cream/70">
              Active Categories ({categories.length})
            </h2>
          </div>

          {categories.length === 0 ? (
            <div className="p-8 text-center text-cream/40 text-sm">
              No categories created yet.
            </div>
          ) : (
            <div className="divide-y divide-cream/5">
              {categories.map((cat) => {
                const count = getDestinationCount(cat.id);
                const deleteAction = deleteCategoryAction.bind(null, cat.id);

                return (
                  <div
                    key={cat.id}
                    className="p-4 sm:px-6 flex items-center justify-between hover:bg-cream/[0.02] transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2.5">
                        <Tag className="size-3.5 text-gold-400/80 shrink-0" />
                        <span className="font-medium text-cream text-base">{cat.name}</span>
                        <span className="text-[10px] font-mono uppercase bg-cream/10 text-cream/60 px-2 py-0.5 rounded">
                          {cat.slug}
                        </span>
                      </div>
                      <p className="text-xs text-cream/40 mt-1">
                        {count} destination{count !== 1 ? 's' : ''} assigned
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <DeleteButton
                        action={deleteAction}
                        itemName={cat.name}
                        itemType="category"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Add Category Form */}
        <div className="lg:col-span-5 bg-navy-900 rounded-2xl border border-cream/10 p-6">
          <h2 className="text-base font-semibold text-cream mb-1">Add New Category</h2>
          <p className="text-xs text-cream/50 mb-5">
            Add a category that travelers can filter by on the website.
          </p>

          <CategoryCreateForm />
        </div>
      </div>
    </div>
  );
}
