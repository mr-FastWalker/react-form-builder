import { v4 as uuidv4 } from 'uuid';

export const makeFieldsList = (rawString: string) => {
  const lines = rawString.split('\n');

  return lines.map((line) => {
    const [label, fieldType] = line.split(';');
    return {
      id: uuidv4(),
      title: label || null,
      type: fieldType || null
    };
  });
}