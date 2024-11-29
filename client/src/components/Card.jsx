import React from "react";

const Card = ({
  course,
  primaryAction, // e.g., { label: 'View Details', onClick: () => {} }
  secondaryAction, // e.g., { label: 'Upload Video', onClick: () => {} }
  tertiaryAction, // Optional, e.g., { label: 'Unenroll', onClick: () => {} }
  lastAction, // Optional, e.g., { label: 'Enroll Course', onClick: () => {} }
}) => {
  return (
    <div className="bg-white dark:bg-secondary-dark-bg p-6 rounded-lg shadow-md border border-gray-300">
      <h3 className="text-lg font-bold text-gray-800 dark:text-white">
        {course.title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mt-2">
        {course.description}
      </p>
      <p className="text-gray-800 dark:text-gray-200 font-semibold mt-2">
        Price: ${course.price}
      </p>
      <div className="flex gap-4 mt-4">
        {primaryAction && (
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={primaryAction.onClick}
          >
            {primaryAction.label}
          </button>
        )}
        {secondaryAction && (
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={secondaryAction.onClick}
          >
            {secondaryAction.label}
          </button>
        )}
        {tertiaryAction && (
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={tertiaryAction.onClick}
          >
            {tertiaryAction.label}
          </button>
        )}
        {lastAction && (
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={lastAction.onClick}
          >
            {lastAction.label}
          </button>
        )}
      </div>
    </div>
  );
};

export default Card;
