import { useState, useCallback, useRef } from 'react';
import { useCourseStore } from '../store/useCourseStore';
import { PlusCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useToastStore } from '../store/useToastStore';
import CourseModal from '../components/modals/CourseModal';
import { type Course, type Module } from '../types/data';
import AdminCourseItem from '../components/AdminCourseItem';
import ModuleModal from '../components/modals/ModuleModal';

const AdminPanel = () => {
  const { data, updateCourse } = useCourseStore();
  const { setToast } = useToastStore();
  const moduleModalRef = useRef<HTMLDialogElement>(null);

  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  
  const [editingModule, setEditingModule] = useState<{ courseId: string; module: Module | null } | null>(null);
  const [moduleTitle, setModuleTitle] = useState('');

  // --- Course Handlers ---
  const handleOpenAddCourseModal = useCallback(() => {
    setEditingCourse({ id: 'new-' + uuidv4(), title: '', description: '', modules: [] });
    setCourseTitle('');
    setCourseDescription('');
    (document.getElementById('course_modal') as HTMLDialogElement).showModal();
  }, []);

  const handleSaveCourse = useCallback(async () => {
    if (editingCourse) {
      const currentCourses = useCourseStore.getState().data.courses;
      let updatedCourses;
      const isNew = editingCourse.id.startsWith('new-');

      if (isNew) {
        updatedCourses = [...currentCourses, {
          id: uuidv4(),
          title: courseTitle,
          description: courseDescription,
          modules: [],
        }];
      } else {
        updatedCourses = currentCourses.map(c =>
          c.id === editingCourse.id
            ? { ...c, title: courseTitle, description: courseDescription }
            : c
        );
      }

      try {
        await updateCourse(updatedCourses);
        setToast(`Course ${isNew ? 'created' : 'updated'} successfully!`, 'success');
        setEditingCourse(null);
        (document.getElementById('course_modal') as HTMLDialogElement).close();
      } catch (error) {
        setToast(`Error ${isNew ? 'creating' : 'updating'} course.`, 'error');
      }
    }
  }, [editingCourse, courseTitle, courseDescription, updateCourse, setToast]);

  const handleEditCourse = useCallback((course: Course) => {
    setEditingCourse(course);
    setCourseTitle(course.title);
    setCourseDescription(course.description);
    (document.getElementById('course_modal') as HTMLDialogElement).showModal();
  }, []);

  const handleDeleteCourse = useCallback(async (courseId: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      const updatedCourses = useCourseStore.getState().data.courses.filter(c => c.id !== courseId);
      try {
        await updateCourse(updatedCourses);
        setToast('Course deleted successfully!', 'success');
      } catch (error) {
        setToast('Error deleting course.', 'error');
      }
    }
  }, [updateCourse, setToast]);

  const handleCloseCourseModal = useCallback(() => {
    setEditingCourse(null);
    (document.getElementById('course_modal') as HTMLDialogElement).close();
  }, []);

  // --- Module Handlers (Centralized) ---
  const handleOpenModuleModal = useCallback((courseId: string, module: Module | null = null) => {
    setEditingModule({ courseId, module });
    setModuleTitle(module?.title || '');
    moduleModalRef.current?.showModal();
  }, [setEditingModule, setModuleTitle]);

  const handleSaveModule = useCallback(async () => {
  if (!editingModule) return;

  const isNew = !editingModule.module; // This will be true if editingModule.module is null or undefined
  const updatedCourses = useCourseStore.getState().data.courses.map(c => {
    if (c.id === editingModule.courseId) {
      const updatedModules = isNew
        ? [...(c.modules ?? []), { id: uuidv4(), title: moduleTitle, materials: [] }]
        : (c.modules ?? []).map(m => m.id === editingModule.module?.id ? { ...m, title: moduleTitle } : m);
      return { ...c, modules: updatedModules };
    }
    return c;
  });

  try {
    await updateCourse(updatedCourses);
    setToast(`Module ${isNew ? 'created' : 'updated'} successfully!`, 'success');
    setEditingModule(null);
    moduleModalRef.current?.close();
  } catch {
    setToast(`Error ${isNew ? 'creating' : 'updating'} module.`, 'error');
  }
}, [editingModule, moduleTitle, updateCourse, setToast]);

  const handleDeleteModule = useCallback(async (courseId: string, moduleId: string) => {
    if (window.confirm('Are you sure you want to delete this module?')) {
      const updatedCourses = useCourseStore.getState().data.courses.map(c => {
        if (c.id === courseId) {
          const updatedModules = (c.modules ?? []).filter(m => m.id !== moduleId);
          return { ...c, modules: updatedModules };
        }
        return c;
      });

      try {
        await updateCourse(updatedCourses);
        setToast('Module deleted successfully!', 'success');
      } catch (error) {
        setToast('Error deleting module.', 'error');
      }
    }
  }, [updateCourse, setToast]);

  const handleCloseModuleModal = useCallback(() => {
    setEditingModule(null);
    moduleModalRef.current?.close();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gradient">Admin Panel</h1>
        <button className="btn btn-primary" onClick={handleOpenAddCourseModal}>
          <PlusCircle className="w-6 h-6" /> Add Course
        </button>
      </div>
      <div className="space-y-6">
        {(data.courses ?? []).map(course => (
          <AdminCourseItem
            key={course.id}
            courseId={course.id} // Passing courseId explicitly
            course={course}
            onEdit={handleEditCourse}
            onDelete={handleDeleteCourse}
            onOpenModuleModal={handleOpenModuleModal}
            onDeleteModule={handleDeleteModule}
          />
        ))}
      </div>
      <CourseModal
        title={courseTitle}
        description={courseDescription}
        setTitle={setCourseTitle}
        setDescription={setCourseDescription}
        onSave={handleSaveCourse}
        onClose={handleCloseCourseModal}
      />
      <ModuleModal
        ref={moduleModalRef}
        title={moduleTitle}
        setTitle={setModuleTitle}
        onSave={handleSaveModule}
        onClose={handleCloseModuleModal}
      />
    </div>
  );
};

export default AdminPanel;