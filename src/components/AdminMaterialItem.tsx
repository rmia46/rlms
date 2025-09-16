import { Edit, Trash2 } from 'lucide-react';
import { type Material } from '../types/data';

interface AdminMaterialItemProps {
  material: Material;
  onEdit: () => void;
  onDelete: () => void;
}

const AdminMaterialItem = ({ material, onEdit, onDelete }: AdminMaterialItemProps) => {
  return (
    <li className="flex items-center justify-between">
      <span>{material.title}</span>
      <div className="space-x-1">
        <button className="btn btn-xs btn-soft" onClick={onEdit}>
          <Edit className="w-3 h-3 bg-gradient-to-r from-gradient-start to-gradient-end text-gradient" />
        </button>
        <button className="btn btn-xs btn-outline btn-error" onClick={onDelete}>
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </li>
  );
};

export default AdminMaterialItem;