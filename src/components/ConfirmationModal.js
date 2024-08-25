import React from "react";

const ConfirmationModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="backdrop" onClick={onCancel}></div>
      <dialog open={isOpen} className="confirmation-modal">
        <div className="confirmation-modal-text">
          <p>Are you sure you want to delete this recipe?</p>
          <div className="confirmation-modal-buttons">
            <button onClick={onCancel} className="btn">
              Cancel
            </button>
            <button onClick={onConfirm} className="btn btn-danger">
              Delete
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default ConfirmationModal;
