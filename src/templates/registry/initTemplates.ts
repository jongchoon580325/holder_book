import templateRegistry from './templateRegistry';
import DarkTemplate from '../presets/darkTemplate';

export function initializeTemplates() {
  // 기본 템플릿 등록
  templateRegistry.registerTemplate(DarkTemplate);
  
  // 추후 더 많은 템플릿 등록 가능
}

export function useTemplate(templateId: string) {
  const template = templateRegistry.getTemplate(templateId);
  if (!template) {
    throw new Error(`Template with id ${templateId} not found`);
  }
  return template;
} 