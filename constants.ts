import { FontOption } from './types';

export const FONT_OPTIONS: FontOption[] = [
  // Sans-serif
  { label: 'Arial', value: 'Arial, "Helvetica Neue", Helvetica, sans-serif', category: 'sans-serif' },
  { label: 'Verdana', value: 'Verdana, Geneva, Tahoma, sans-serif', category: 'sans-serif' },
  { label: 'Helvetica', value: 'Helvetica, Arial, sans-serif', category: 'sans-serif' },
  { label: 'Tahoma', value: 'Tahoma, Verdana, Segoe, sans-serif', category: 'sans-serif' },
  { label: 'Trebuchet MS', value: '"Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande", "Lucida Sans", Arial, sans-serif', category: 'sans-serif' },
  { label: 'Impact', value: 'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif', category: 'sans-serif' },
  { label: 'System UI', value: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif', category: 'sans-serif' },

  // Serif
  { label: 'Times New Roman', value: '"Times New Roman", Times, Baskerville, Georgia, serif', category: 'serif' },
  { label: 'Georgia', value: 'Georgia, Times, "Times New Roman", serif', category: 'serif' },
  { label: 'Garamond', value: 'Garamond, Baskerville, "Baskerville Old Face", "Hoefler Text", "Times New Roman", serif', category: 'serif' },
  { label: 'Palatino', value: 'Palatino, "Palatino Linotype", "Book Antiqua", serif', category: 'serif' },

  // Monospace
  { label: 'Courier New', value: '"Courier New", Courier, "Lucida Sans Typewriter", "Lucida Typewriter", monospace', category: 'monospace' },
  { label: 'Consolas', value: 'Consolas, monaco, monospace', category: 'monospace' },
  { label: 'Lucida Console', value: '"Lucida Console", "Lucida Sans Typewriter", monaco, "Bitstream Vera Sans Mono", monospace', category: 'monospace' },

  // Other
  { label: 'Comic Sans MS', value: '"Comic Sans MS", "Comic Sans", cursive', category: 'cursive' },
];
