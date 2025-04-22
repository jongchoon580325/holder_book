'use client';

import React from 'react';
import EditablePageTemplate from '@/templates/pages/EditablePageTemplate';

const TemplateExamplePage = () => {
  return (
    <EditablePageTemplate
      title="Smart Holder"
      description="Your Personal Finance Partner"
      header={
        <nav className="bg-gray-800 border-b border-gray-700">
          <div className="container mx-auto px-4 py-3">
            <div className="flex justify-end">
              <div className="space-x-4">
                <a href="#" className="text-gray-300 hover:text-white">Home</a>
                <a href="#" className="text-gray-300 hover:text-white">Features</a>
                <a href="#" className="text-gray-300 hover:text-white">About</a>
                <a href="#" className="text-gray-300 hover:text-white">Contact</a>
              </div>
            </div>
          </div>
        </nav>
      }
      footer={
        <footer className="bg-gray-800 border-t border-gray-700 py-4 mt-auto">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm text-gray-300">
              Smart Holder - Your Personal Finance Partner | Built with ❤️ by Najongchoon | Contact: najongchoon@gmail.com
            </p>
          </div>
        </footer>
      }
      className="min-h-screen bg-gray-900 flex flex-col"
    >
      <div className="container mx-auto px-4 py-8 max-w-[90vw] flex-grow">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Welcome to Smart Holder</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Your comprehensive solution for personal finance management. 
            Track, analyze, and optimize your financial journey with ease.
          </p>
          <div className="border-b border-dashed border-gray-700 my-8"></div>
        </div>
      </div>
    </EditablePageTemplate>
  );
};

export default TemplateExamplePage; 