export const sizeArr = ['sm', 'md', 'lg'] as const;
export const colorArr = ['primary', 'secondary'] as const;
export type SIZE = (typeof sizeArr)[number];
export type COLOR = (typeof colorArr)[number];
export interface WithTheme<T> {
  themeColor?: COLOR;
  themeSize?: SIZE;
  componentName?: T;
}

const useTheme = <T>({ themeColor, themeSize, componentName }: WithTheme<T>) =>
  componentName
    ? `${componentName}${themeColor ? ` ${componentName}--${themeColor}` : ''}${
        themeSize ? ` ${componentName}--${themeSize}` : ''
      }`
    : '';

export default useTheme;
