import { Edit, Trash2, PlusCircle } from 'lucide-react';
import { type Module, type Material } from '../types/data';
import AdminMaterialItem from './AdminMaterialItem';

interface AdminModuleItemProps {
  module: Module;
  onEdit: (module: Module) => void;
  onDelete: (moduleId: string) => void;
  onOpenMaterialModal: (moduleId: string, material?: Material) => void;
  onDeleteMaterial: (materialId: string) => void;
}

const AdminModuleItem = ({ module, onEdit, onDelete, onOpenMaterialModal, onDeleteMaterial }: AdminModuleItemProps) => {
  return (
    <div key={module.id} className="card bg-base-200 shadow-md border border-border-accent p-4 transition-all duration-300 transform hover:scale-[1.005]">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-gradient">{module.title}</h4>
        <div className="space-x-2">
          <button className="btn btn-sm btn-soft" onClick={() => onEdit(module)}>
            <Edit className="w-4 h-4 text-gradient" />
          </button>
          <button className="btn btn-sm btn-outline btn-error" onClick={() => onDelete(module.id)}>
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="divider"></div>
      <div className="flex justify-between items-center mb-2">
        <h5 className="font-bold text-gradient">Materials</h5>
        <button className="btn btn-xs btn-soft" onClick={() => onOpenMaterialModal(module.id)}>
          <PlusCircle className="w-4 h-4 text-gradient" /> Add Material
        </button>
      </div>
      <ul className="list-disc list-inside">
        {(module.materials ?? []).map(material => (
          <AdminMaterialItem
            key={material.id}
            material={material}
            onEdit={() => onOpenMaterialModal(module.id, material)}
            onDelete={() => onDeleteMaterial(material.id)}
          />
        ))}
      </ul>
    </div>
  );
};

export default AdminModuleItem;