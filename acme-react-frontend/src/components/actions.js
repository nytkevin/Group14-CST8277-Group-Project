import React from "react";

export default function Actions({
  onSubmit,
  onCancel,
  onEdit,
  onDelete,
  editing,
}) {
  return (
    <div className="flex space-x-2">
      {onSubmit && (
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {editing ? "Update" : "Submit"}
        </button>
      )}
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Cancel
        </button>
      )}
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
        >
          Edit
        </button>
      )}
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
        >
          Delete
        </button>
      )}
    </div>
  );
}
