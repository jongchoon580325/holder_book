import { Category, CategoryType } from '@/types/category';

interface CategoryFormData {
  type: CategoryType;
  section: string;
  category: string;
  subcategory: string;
}

interface SortableRowProps {
  id: string;
  category: Category;
  index: number;
  startIndex: number;
  editingId: number | null;
  formData: CategoryFormData;
  buttonClassName: any;
  inputClassName: string;
  type: CategoryType;
  onEdit: (category: Category) => void;
  onSave: (id: number) => void;
  onDelete: (id: number) => void;
  setEditingId: (id: number | null) => void;
  setFormData: (data: CategoryFormData) => void;
  moveCategory: (index: number, direction: 'up' | 'down') => void;
  totalLength: number;
}

export function SortableRow({
  id,
  category,
  index,
  startIndex,
  editingId,
  formData,
  buttonClassName,
  inputClassName,
  type,
  onEdit,
  onSave,
  onDelete,
  setEditingId,
  setFormData,
  moveCategory,
  totalLength
}: SortableRowProps) {
  const handleEdit = () => {
    setEditingId(Number(category.id));
    setFormData({
      type: category.type,
      section: category.section,
      category: category.category,
      subcategory: category.subcategory
    });
  };

  const handleSave = () => {
    onSave(Number(category.id));
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({
      type: type,
      section: '',
      category: '',
      subcategory: ''
    });
  };

  // ... rest of the component code ...
} 