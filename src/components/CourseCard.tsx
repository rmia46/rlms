import { Link } from "react-router-dom";
import { type Course } from "../types/data";

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const totalMaterials = course.modules.flatMap((m) => m.materials).length;
  const completedMaterials = course.modules
    .flatMap((m) => m.materials)
    .filter((l) => l && l.completed).length;
  const progress = totalMaterials > 0 ? (completedMaterials / totalMaterials) * 100 : 0;

  return (
    <Link to={`/courses/${course.id}`}>
      <div className="card w-full bg-base-100 shadow-xl border border-border-accent hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.05] cursor-pointer">
        <div className="card-body">
          <h2 className="card-title text-gradient">{course.title}</h2>
          <p>{course.description}</p>
          <div className="mt-4">
            <p className="text-sm">Progress: {Math.round(progress)}%</p>
            <progress
              className="progress progress-primary w-full"
              value={progress}
              max="100"
            />
          </div>
        </div>
      </div>
    </Link>
  );
}