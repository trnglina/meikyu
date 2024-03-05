import en from '$strings/en.ftl?raw';
import ja from '$strings/ja.ftl?raw';
import { FluentResource } from '@fluent/bundle';

export const RESOURCES = {
  en: new FluentResource(en),
  ja: new FluentResource(ja),
} as const;
