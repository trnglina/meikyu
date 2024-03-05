import { Uuid25 } from 'uuid25';

export const formatUrlId = (uuid: string): string => {
  const uuid25 = Uuid25.parse(uuid);
  return uuid25.value;
};

export const parseUrlId = (uuid: string): string => {
  const uuid25 = Uuid25.parse(uuid);
  return uuid25.toHyphenated();
};
