import { useEffect, useRef } from 'react';

// ---------------------------------------------------------
// Modal — Reusable popup/modal component
// Supports title, content, and confirm/cancel actions
// Closes on backdrop click and Escape key
// ---------------------------------------------------------

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  children: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'danger';
}

export default function Modal({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      data-testid="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        data-testid="modal-backdrop"
      />

      {/* Modal Content */}
      <div
        ref={modalRef}
        className="relative bg-white rounded-xl shadow-xl max-w-md w-full animate-scale-in"
        data-testid="modal-content"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-200">
          <h2 id="modal-title" className="text-lg font-semibold text-surface-800" data-testid="modal-title">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-surface-400 hover:text-surface-600 transition-colors p-1 rounded-lg hover:bg-surface-100"
            data-testid="modal-close-button"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4" data-testid="modal-body">
          {children}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-surface-200 bg-surface-50 rounded-b-xl">
          <button
            onClick={onClose}
            className="btn-secondary"
            data-testid="modal-cancel-button"
          >
            {cancelText}
          </button>
          {onConfirm && (
            <button
              onClick={onConfirm}
              className={variant === 'danger' ? 'btn-danger' : 'btn-primary'}
              data-testid="modal-confirm-button"
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
