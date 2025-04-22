'use client';

import React from 'react';
import EditablePageTemplate from '@/templates/pages/EditablePageTemplate';

const EditableTemplateExamplePage = () => {
  const handleSave = (data: any) => {
    console.log('Saved data:', data);
    // 여기서 데이터를 서버에 저장하거나 상태를 업데이트할 수 있습니다.
  };

  return (
    <EditablePageTemplate
      title="Editable Template Example"
      description="This is an example of an editable page template"
      header={
        <div className="bg-blue-500 text-white p-4">
          <h1 className="text-2xl font-bold">Editable Header</h1>
        </div>
      }
      footer={
        <div className="bg-gray-800 text-white p-4 mt-8">
          <p>© 2024 Editable Footer</p>
        </div>
      }
      className="bg-gray-100"
      isEditable={true}
      onSave={handleSave}
    >
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Main Content</h2>
        <p className="text-gray-700 mb-4">
          This is an example of how to use the editable page template. You can edit
          the title, description, header, and footer content.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">Section 1</h3>
            <p>Content for section 1</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">Section 2</h3>
            <p>Content for section 2</p>
          </div>
        </div>
      </div>
    </EditablePageTemplate>
  );
};

export default EditableTemplateExamplePage; 