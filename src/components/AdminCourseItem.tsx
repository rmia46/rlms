import { useState, useCallback } from 'react';
import { useCourseStore } from '../store/useCourseStore';
import { Edit, Trash2, PlusCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useToastStore } from '../store/useToastStore';
import { type Course, type Module, type Material } from '../types/data';
import ModuleModal from './modals/ModuleModal';
import AdminModuleItem from './AdminModuleItem';
import MaterialModal from './modals/MaterialModal';

interface AdminCourseItemProps {
  course: Course;
  onEdit: (course: Course) => void;
  onDelete: (courseId: string) => void;
}

const AdminCourseItem = ({ course, onEdit, onDelete }: AdminCourseItemProps) => {
  const { updateCourse } = useCourseStore();
  const { setToast } = useToastStore();
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [moduleTitle, setModuleTitle] = useState('');

  const [editingMaterial, setEditingMaterial] = useState<{ courseId: string; moduleId: string; material: Material | null } | null>(null);
  const [materialTitle, setMaterialTitle] = useState('');
  const [materialType, setMaterialType] = useState<Material['type']>('text');
  const [materialUrl, setMaterialUrl] = useState('');
  const [materialContent, setMaterialContent] = useState('');

  // --- Module Handlers ---
  const handleOpenAddModuleModal = useCallback(() => {
    setEditingModule({ id: 'new-' + uuidv4(), title: '', materials: [] });
    setModuleTitle('');
    (document.getElementById('module_modal') as HTMLDialogElement).showModal();
  }, []);

  const handleSaveModule = useCallback(async () => {
    if (editingModule) {
      const isNew = editingModule.id.startsWith('new-');
      const updatedModules = isNew
        ? [...(course.modules ?? []), { id: uuidv4(), title: moduleTitle, materials: [] }]
        : (course.modules ?? []).map(m => m.id === editingModule.id ? { ...m, title: moduleTitle } : m);
      
      const updatedCourses = useCourseStore.getState().data.courses.map(c =>
        c.id === course.id ? { ...c, modules: updatedModules } : c
      );

      try {
        await updateCourse(updatedCourses);
        setToast(`Module ${isNew ? 'created' : 'updated'} successfully!`, 'success');
        setEditingModule(null);
        (document.getElementById('module_modal') as HTMLDialogElement).close();
      } catch (error) {
        setToast(`Error ${isNew ? 'creating' : 'updating'} module.`, 'error');
      }
    }
  }, [editingModule, moduleTitle, course, updateCourse, setToast]);

  const handleEditModule = useCallback((module: Module) => {
    setEditingModule(module);
    setModuleTitle(module.title);
    (document.getElementById('module_modal') as HTMLDialogElement).showModal();
  }, []);

  const handleDeleteModule = useCallback(async (moduleId: string) => {
    if (window.confirm('Are you sure you want to delete this module?')) {
      const updatedModules = (course.modules ?? []).filter(m => m.id !== moduleId);
      const updatedCourses = useCourseStore.getState().data.courses.map(c =>
        c.id === course.id ? { ...c, modules: updatedModules } : c
      );

      try {
        await updateCourse(updatedCourses);
        setToast('Module deleted successfully!', 'success');
      } catch (error) {
        setToast('Error deleting module.', 'error');
      }
    }
  }, [course, updateCourse, setToast]);

  const handleCloseModuleModal = useCallback(() => {
    setEditingModule(null);
    (document.getElementById('module_modal') as HTMLDialogElement).close();
  }, []);

  // --- Material Handlers ---
  const handleOpenMaterialModal = useCallback((moduleId: string, material: Material | null = null) => {
    const newMaterial = material || { id: 'new-' + uuidv4(), title: '', type: 'text', completed: false };
    setEditingMaterial({ courseId: course.id, moduleId, material: newMaterial });
    
    setMaterialTitle(newMaterial.title || '');
    setMaterialType(newMaterial.type || 'text');
    setMaterialUrl(newMaterial.url || '');
    setMaterialContent(newMaterial.content || '');
    (document.getElementById('material_modal') as HTMLDialogElement).showModal();
  }, [course.id]);

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
        (document.getElementById('material_modal') as HTMLDialogElement).close();
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
    (document.getElementById('material_modal') as HTMLDialogElement).close();
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
        <button className="btn btn-sm btn-soft" onClick={handleOpenAddModuleModal}>
          <PlusCircle className="w-4 h-4 text-gradient" /> Add Module
        </button>
      </div>
      <div className="space-y-4">
        {(course.modules ?? []).map(module => (
          <AdminModuleItem
            key={module.id}
            module={module}
            onEdit={handleEditModule}
            onDelete={handleDeleteModule}
            onOpenMaterialModal={handleOpenMaterialModal}
            onDeleteMaterial={(materialId) => handleDeleteMaterial(module.id, materialId)}
          />
        ))}
      </div>
      <ModuleModal
        title={moduleTitle}
        setTitle={setModuleTitle}
        onSave={handleSaveModule}
        onClose={handleCloseModuleModal}
      />
      <MaterialModal
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