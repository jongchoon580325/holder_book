import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Editable Template Example',
  description: 'This is an example of an editable page template',
};

export default function EditableTemplateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 