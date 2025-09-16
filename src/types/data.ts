export interface Material {
  id: string;
  title: string;
  type: "text" | "link" | "video" | "pdf";
  url?: string; // Optional for 'text' type
  content?: string; // Optional for 'link', 'video', 'pdf' types
  completed: boolean;
}

export interface Module {
  id: string;
  title: string;
  materials: Material[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  modules: Module[];
}

export interface CourseData {
  courses: Course[];
}