export interface TemplateMetadata {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Template {
  metadata: TemplateMetadata;
  component: React.ComponentType<any>;
  defaultProps?: Record<string, any>;
} 