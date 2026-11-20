import { X } from "lucide-react";
import "./Modal.scss";
import { createPortal } from "react-dom";
import { useEffect } from "react";
const Modal = ({ title, children, actionButtons, isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  return createPortal(
    <div className={`modal-wrapper ${isOpen ? "open" : "close"}`}>
      <div className="modal-inner">
        <div className="modal-header">
          <div className="modal-title">{title}</div>
          <button type="button" className="modal-close" onClick={onClose}>
            <X color="#fff" />
          </button>
        </div>
        <div className="modal-body">{children}</div>
        <div className="modal-footer">{actionButtons}</div>
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
