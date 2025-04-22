'use client';

import React, { ReactNode, useState, useCallback } from 'react';
import BaseLayout from '../layouts/BaseLayout';

interface EditablePageTemplateProps {
  children: ReactNode;
  title?: string;
  description?: string;
  header?: ReactNode;
  footer?: ReactNode;
  className?: string;
  isEditable?: boolean;
  onSave?: (data: any) => void;
}

const EditablePageTemplate: React.FC<EditablePageTemplateProps> = ({
  children,
  title: initialTitle = 'Default Title',
  description: initialDescription = 'Default Description',
  header: initialHeader,
  footer: initialFooter,
  className = '',
  isEditable = false,
  onSave,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [header, setHeader] = useState(initialHeader);
  const [footer, setFooter] = useState(initialFooter);

  const handleEditToggle = useCallback(() => {
    setIsEditing(prev => !prev);
  }, []);

  const handleSave = useCallback(() => {
    if (onSave) {
      onSave({
        title,
        description,
        header,
        footer,
      });
    }
    setIsEditing(false);
  }, [title, description, header, footer, onSave]);

  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  }, []);

  const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  }, []);

  const handleHeaderChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setHeader(e.target.value);
  }, []);

  const handleFooterChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFooter(e.target.value);
  }, []);

  return (
    <BaseLayout className={className}>
      {isEditable && (
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={handleEditToggle}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {isEditing ? 'Preview' : 'Edit'}
          </button>
        </div>
      )}

      {isEditing ? (
        <div className="container mx-auto px-4 py-8">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={handleDescriptionChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={3}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Header Content</label>
            <textarea
              value={typeof header === 'string' ? header : ''}
              onChange={handleHeaderChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={3}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Footer Content</label>
            <textarea
              value={typeof footer === 'string' ? footer : ''}
              onChange={handleFooterChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={3}
            />
          </div>
          <button
            onClick={handleSave}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Save Changes
          </button>
        </div>
      ) : (
        <>
          {header && <header>{header}</header>}
          <div className={`container mx-auto px-4 py-8 ${className}`}>
            {children}
          </div>
          {footer && <footer>{footer}</footer>}
        </>
      )}
    </BaseLayout>
  );
};

export default EditablePageTemplate; 