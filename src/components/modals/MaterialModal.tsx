import { type Material } from '../../types/data';

interface MaterialModalProps {
  title: string;
  type: Material['type'];
  url: string;
  content: string;
  setTitle: (title: string) => void;
  setType: (type: Material['type']) => void;
  setUrl: (url: string) => void;
  setContent: (content: string) => void;
  onSave: () => void;
  onClose: () => void;
}

const MaterialModal = ({ title, type, url, content, setTitle, setType, setUrl, setContent, onSave, onClose }: MaterialModalProps) => {
  return (
    <dialog id="material_modal" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Material</h3>
        <form className="py-4">
          <div className="form-control mb-4">
            <label className="label">Material Title</label>
            <input type="text" placeholder="e.g., Introduction to HTML" className="input input-bordered w-full" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="form-control mb-4">
            <label className="label">Material Type</label>
            <select className="select select-bordered w-full" value={type} onChange={(e) => setType(e.target.value as Material['type'])}>
              <option value="text">Text/HTML</option>
              <option value="link">Web Link</option>
              <option value="video">Video</option>
              <option value="pdf">PDF</option>
            </select>
          </div>
          {type === 'text' && (
            <div className="form-control mb-4">
              <label className="label">Content (Text or HTML)</label>
              <textarea placeholder="Enter text or HTML content here." className="textarea textarea-bordered w-full" value={content} onChange={(e) => setContent(e.target.value)} />
            </div>
          )}
          {type !== 'text' && (
            <div className="form-control">
              <label className="label">URL</label>
              <input type="url" placeholder="https://..." className="input input-bordered w-full" value={url} onChange={(e) => setUrl(e.target.value)} />
            </div>
          )}
        </form>
        <div className="modal-action">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={onSave}>Save</button>
        </div>
      </div>
    </dialog>
  );
};

export default MaterialModal;