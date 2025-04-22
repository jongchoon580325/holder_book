import { Template, TemplateMetadata } from './types';

class TemplateRegistry {
  private templates: Map<string, Template> = new Map();

  registerTemplate(template: Template) {
    this.templates.set(template.metadata.id, template);
  }

  getTemplate(id: string): Template | undefined {
    return this.templates.get(id);
  }

  getAllTemplates(): Template[] {
    return Array.from(this.templates.values());
  }

  getTemplatesByCategory(category: string): Template[] {
    return this.getAllTemplates().filter(
      template => template.metadata.category === category
    );
  }
}

export const templateRegistry = new TemplateRegistry();

// 싱글톤 인스턴스로 export
export default templateRegistry; 