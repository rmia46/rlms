import { useState, useCallback } from 'react';
import { useCourseStore } from '../store/useCourseStore';
import { PlusCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useToastStore } from '../store/useToastStore';
import CourseModal from '../components/modals/CourseModal';
import { type Course } from '../types/data';
import AdminCourseItem from '../components/AdminCourseItem';

const AdminPanel = () => {
  const { data, updateCourse } = useCourseStore();
  const { setToast } = useToastStore();
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');

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

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gradient-start to-gradient-end text-gradient">Admin Panel</h1>
        <button className="btn btn-primary" onClick={handleOpenAddCourseModal}>
          <PlusCircle className="w-6 h-6" /> Add Course
        </button>
      </div>
      <div className="space-y-6">
        {(data.courses ?? []).map(course => (
          <AdminCourseItem
            key={course.id}
            course={course}
            onEdit={handleEditCourse}
            onDelete={handleDeleteCourse}
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
    </div>
  );
};

export default AdminPanel;