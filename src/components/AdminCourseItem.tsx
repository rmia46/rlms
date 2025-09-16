import { useState, useCallback, useRef } from 'react';
import { useCourseStore } from '../store/useCourseStore';
import { Edit, Trash2, PlusCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useToastStore } from '../store/useToastStore';
import { type Course, type Module, type Material } from '../types/data';
import AdminModuleItem from './AdminModuleItem';
import MaterialModal from './modals/MaterialModal';

interface AdminCourseItemProps {
  course: Course;
  courseId: string;
  onEdit: (course: Course) => void;
  onDelete: (courseId: string) => void;
  onOpenModuleModal: (courseId: string, module?: Module) => void;
  onDeleteModule: (courseId: string, moduleId: string) => void;
}

const AdminCourseItem = ({ course, courseId, onEdit, onDelete, onOpenModuleModal, onDeleteModule }: AdminCourseItemProps) => {
  const { updateCourse } = useCourseStore();
  const { setToast } = useToastStore();
  const materialModalRef = useRef<HTMLDialogElement>(null);

  const [editingMaterial, setEditingMaterial] = useState<{ courseId: string; moduleId: string; material: Material | null } | null>(null);
  const [materialTitle, setMaterialTitle] = useState('');
  const [materialType, setMaterialType] = useState<Material['type']>('text');
  const [materialUrl, setMaterialUrl] = useState('');
  const [materialContent, setMaterialContent] = useState('');
  
  const handleOpenMaterialModal = useCallback((moduleId: string, material: Material | null = null) => {
    const newMaterial = material || { id: 'new-' + uuidv4(), title: '', type: 'text', completed: false };
    setEditingMaterial({ courseId, moduleId, material: newMaterial });
    
    setMaterialTitle(newMaterial.title || '');
    setMaterialType(newMaterial.type || 'text');
    setMaterialUrl(newMaterial.url || '');
    setMaterialContent(newMaterial.content || '');
    materialModalRef.current?.showModal();
  }, [courseId]);

  const handleSaveMaterial = useCallback(async () => {
    if (editingMaterial) {
      const isNew = editingMaterial.material?.id.startsWith('new-') ?? false;

      const newMaterialData: Partial<Material> = { title: materialTitle, type: materialType };
      if (materialType === 'text') {
        newMaterialData.content = materialContent;
      } else {
        newMaterialData.url = materialUrl;
      }

      const updatedCourses = useCourseStore.getState().data.courses.map(c => {
        if (c.id === editingMaterial.courseId) {
          const updatedModules = (c.modules ?? []).map(m => {
            if (m.id === editingMaterial.moduleId) {
              let updatedMaterials;
              if (isNew) {
                updatedMaterials = [...(m.materials ?? []), { ...newMaterialData, id: uuidv4(), completed: false } as Material];
              } else {
                updatedMaterials = (m.materials ?? []).map(mat =>
                  mat.id === editingMaterial.material?.id ? { ...mat, ...newMaterialData } as Material : mat
                );
              }
              return { ...m, materials: updatedMaterials };
            }
            return m;
          });
          return { ...c, modules: updatedModules };
        }
        return c;
      });

      try {
        await updateCourse(updatedCourses);
        setToast(`Material ${isNew ? 'created' : 'updated'} successfully!`, 'success');
        setEditingMaterial(null);
        materialModalRef.current?.close();
      } catch (error) {
        setToast(`Error ${isNew ? 'creating' : 'updating'} material.`, 'error');
      }
    }
  }, [editingMaterial, materialTitle, materialType, materialUrl, materialContent, updateCourse, setToast]);

  const handleDeleteMaterial = useCallback(async (moduleId: string, materialId: string) => {
    if (window.confirm('Are you sure you want to delete this material?')) {
      const updatedCourses = useCourseStore.getState().data.courses.map(c => {
        if (c.id === course.id) {
          const updatedModules = (c.modules ?? []).map(m => {
            if (m.id === moduleId) {
              const updatedMaterials = (m.materials ?? []).filter(mat => mat.id !== materialId);
              return { ...m, materials: updatedMaterials };
            }
            return m;
          });
          return { ...c, modules: updatedModules };
        }
        return c;
      });

      try {
        await updateCourse(updatedCourses);
        setToast('Material deleted successfully!', 'success');
      } catch (error) {
        setToast('Error deleting material.', 'error');
      }
    }
  }, [course.id, updateCourse, setToast]);

  const handleCloseMaterialModal = useCallback(() => {
    setEditingMaterial(null);
    materialModalRef.current?.close();
  }, []);

  return (
    <div className="card w-full bg-base-100 shadow-xl border border-border-accent p-6 transition-all duration-300 transform hover:scale-[1.005] hover:shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gradient">{course.title}</h2>
        <div className="space-x-2">
          <button className="btn btn-sm btn-soft" onClick={() => onEdit(course)}>
            <Edit className="w-5 h-5 text-gradient" />
          </button>
          <button className="btn btn-sm btn-outline btn-error" onClick={() => onDelete(course.id)}>
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
      <p className="text-sm text-gray-500">{course.description}</p>
      <div className="divider"></div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gradient">Modules</h3>
        <button className="btn btn-sm btn-soft" onClick={() => onOpenModuleModal(courseId)}>
          <PlusCircle className="w-4 h-4 text-gradient" /> Add Module
        </button>
      </div>
      <div className="space-y-4">
        {(course.modules ?? []).map(module => (
          <AdminModuleItem
            key={module.id}
            module={module}
            onEdit={() => onOpenModuleModal(courseId, module)}
            onDelete={(moduleId) => onDeleteModule(courseId, moduleId)}
            onOpenMaterialModal={handleOpenMaterialModal}
            onDeleteMaterial={(materialId) => handleDeleteMaterial(module.id, materialId)}
          />
        ))}
      </div>
      <MaterialModal
        ref={materialModalRef}
        title={materialTitle}
        type={materialType}
        url={materialUrl}
        content={materialContent}
        setTitle={setMaterialTitle}
        setType={setMaterialType}
        setUrl={setMaterialUrl}
        setContent={setMaterialContent}
        onSave={handleSaveMaterial}
        onClose={handleCloseMaterialModal}
      />
    </div>
  );
};

export default AdminCourseItem;