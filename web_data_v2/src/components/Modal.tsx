import { ComponentChildren } from "preact";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ComponentChildren;
  className?: string;
  overlayClassName?: string;
}

/**
 * Modal component that renders children when isOpen is true
 * @param isOpen - Whether the modal is open
 * @param onClose - Callback when the modal should close
 * @param children - Content to render inside the modal
 * @param className - Optional CSS class for the modal container
 * @param overlayClassName - Optional CSS class for the overlay
 */
export function Modal({
  isOpen,
  onClose,
  children,
  className = "modal",
  overlayClassName = "modal-overlay",
}: ModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div id="arm-modal" class="key-modal open">
      <div class={className} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

