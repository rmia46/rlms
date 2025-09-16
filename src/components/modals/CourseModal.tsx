import type { ChangeEvent } from 'react';

interface CourseModalProps {
  title: string;
  description: string;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  onSave: () => void;
  onClose: () => void;
}

const CourseModal = ({ title, description, setTitle, setDescription, onSave, onClose }: CourseModalProps) => {
  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);
  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value);

  return (
    <dialog id="course_modal" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Course</h3>
        <form className="py-4">
          <div className="form-control mb-4">
            <label className="label">Course Title</label>
            <input type="text" placeholder="e.g., Web Development" className="input input-bordered w-full" value={title} onChange={handleTitleChange} />
          </div>
          <div className="form-control">
            <label className="label">Description</label>
            <textarea placeholder="A brief description of the course." className="textarea textarea-bordered w-full" value={description} onChange={handleDescriptionChange} />
          </div>
        </form>
        <div className="modal-action">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={onSave}>Save</button>
        </div>
      </div>
    </dialog>
  );
};

export default CourseModal;