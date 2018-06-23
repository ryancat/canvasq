const world = 'ttt';

export function hello(word: string = world): string {
  return `Hello ${world}! `;
}