import { useParams } from 'react-router-dom';
import { useCourseStore } from '../store/useCourseStore';
import { type Course, type Material } from '../types/data';
import { CheckCircle } from 'lucide-react';

const CourseView = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { data, updateCourse } = useCourseStore();

  const course: Course | undefined = data.courses.find(c => c.id === courseId);

  // Toggle material completion
  const handleMaterialCompletion = async (moduleId: string, materialId: string) => {
    if (!course) return;

    const updatedCourses = data.courses.map(c =>
      c.id === course.id
        ? {
            ...c,
            modules: (c.modules ?? []).map(m =>
              m.id === moduleId
                ? {
                    ...m,
                    materials: (m.materials ?? []).map(mat =>
                      mat.id === materialId ? { ...mat, completed: !mat.completed } : mat
                    ),
                  }
                : m
            ),
          }
        : c
    );

    await updateCourse(updatedCourses);
  };

  // Extract Google Drive file ID
  const getGoogleDriveFileId = (url: string) => {
    const regexes = [
      /\/d\/([a-zA-Z0-9_-]+)/, // /d/FILE_ID/view
      /id=([a-zA-Z0-9_-]+)/,   // ?id=FILE_ID
    ];
    for (const regex of regexes) {
      const match = url.match(regex);
      if (match && match[1]) return match[1];
    }
    return null;
  };

  // Render material content
  const renderMaterialContent = (material: Material) => {
    const url = material.url ?? '';
    const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');
    const isVimeo = url.includes('vimeo.com');
    const isVideoFile = /\.(mp4|webm|ogg|mov|flv)$/i.test(url);

    switch (material.type) {
      case 'text':
        return <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: material.content || '' }} />;

      case 'link':
        return (
          <a href={url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            Go to Link
          </a>
        );

      case 'video':
        if (isYouTube) {
          const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i);
          const embedUrl = match ? `https://www.youtube.com/embed/${match[1]}` : '';
          return <iframe className="w-full aspect-video rounded-lg" src={embedUrl} title={material.title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>;
        } else if (isVimeo) {
          const match = url.match(/(?:vimeo\.com\/(?:video\/)?)(\d+)/i);
          const embedUrl = match ? `https://player.vimeo.com/video/${match[1]}` : '';
          return <iframe className="w-full aspect-video rounded-lg" src={embedUrl} title={material.title} frameBorder="0" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen></iframe>;
        } else if (isVideoFile) {
          return <video className="w-full aspect-video rounded-lg" src={url} controls />;
        } else {
          return <iframe className="w-full aspect-video rounded-lg" src={url} title={material.title} frameBorder="0" allowFullScreen></iframe>;
        }

      case 'pdf': {
        const fileId = getGoogleDriveFileId(url);
        const pdfSrc = fileId
          ? `https://docs.google.com/viewer?url=https://drive.google.com/uc?id=${fileId}&embedded=true`
          : url;

        return <iframe className="w-full aspect-video rounded-lg" src={pdfSrc} title={material.title} frameBorder="0" allowFullScreen />;
      }

      default:
        return null;
    }
  };

  if (!course) {
    return (
      <div className="text-center p-8">
        <h1 className="text-4xl font-bold text-gradient">Course not found.</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="card w-full bg-base-100 shadow-xl border border-border-accent p-6 mb-6">
        <h1 className="text-4xl font-bold mb-2 text-gradient">{course.title}</h1>
        <p className="text-lg text-gray-500">{course.description}</p>
      </div>

      <div className="space-y-6">
        {(course.modules ?? []).map(module => (
          <div key={module.id} className="card bg-base-200 shadow-md border border-border-accent p-4">
            <h2 className="text-2xl font-semibold mb-4 text-gradient">{module.title}</h2>
            <div className="divider"></div>
            <div className="space-y-4">
              {(module.materials ?? []).map(material => (
                <div key={material.id} className="flex flex-col p-4 bg-base-100 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-4">
                      <CheckCircle
                        className={`w-6 h-6 cursor-pointer ${material.completed ? 'text-success' : 'text-gray-400'}`}
                        onClick={() => handleMaterialCompletion(module.id, material.id)}
                      />
                      <div>
                        <h3 className="text-lg font-medium">{material.title}</h3>
                        <p className="text-sm text-gray-500">{material.type.toUpperCase()}</p>
                      </div>
                    </div>
                  </div>
                  {renderMaterialContent(material)}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseView;
