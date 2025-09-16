import { useCourseStore } from '../store/useCourseStore';
import { CourseCard } from '../components/CourseCard';

const Dashboard = () => {
  const courses = useCourseStore((state) => state.data.courses);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl leading-tight font-bold text-center mb-8 text-gradient">My Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.length > 0 ? (
          (courses ?? []).map((course) => <CourseCard key={course.id} course={course} />)
        ) : (
          <p className="text-center text-gray-500 col-span-full">No courses available. Start adding some!</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;