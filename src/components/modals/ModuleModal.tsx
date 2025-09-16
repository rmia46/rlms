import type { ChangeEvent } from 'react';

interface ModuleModalProps {
  title: string;
  setTitle: (title: string) => void;
  onSave: () => void;
  onClose: () => void;
}

const ModuleModal = ({ title, setTitle, onSave, onClose }: ModuleModalProps) => {
  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);

  return (
    <dialog id="module_modal" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Module</h3>
        <form className="py-4">
          <div className="form-control">
            <label className="label">Module Title</label>
            <input type="text" placeholder="e.g., React Basics" className="input input-bordered w-full" value={title} onChange={handleTitleChange} />
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

export default ModuleModal;