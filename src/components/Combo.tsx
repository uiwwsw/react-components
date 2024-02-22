// import { MouseEvent } from 'react';

import useTheme, { WithTheme } from '#/useTheme';
import { createPortal } from 'react-dom';

import Input, { InputProps } from './Input';
import { ChangeEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react';
import Smooth from './Smooth';
import usePosition from '#/usePosition';
import Button from './Button';
import Toast from './Toast';
import Delay from './Delay';

interface ComboProps extends Omit<InputProps, 'onChange'>, WithTheme {
  onChange?: (value: string) => unknown;
  defaultValue?: string;
  options?: {
    disabled?: boolean;
    value: string;
    label: string;
  }[];
}
const Combo = ({
  children,
  placeholder = '선택해주세요.',
  defaultValue = '',
  onChange,
  options,
  componentName = 'combo',
  themeColor,
  themeSize,
  name,
  // className,
  ...props
}: ComboProps) => {
  const sto = useRef(0);
  const ref = useRef<HTMLLabelElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const theme = useTheme({ themeColor, themeSize, componentName });
  const [value, setValue] = useState(defaultValue);
  const [filter, setFilter] = useState('');
  const [visible, setVisible] = useState(false);
  const label = useMemo(
    () => (visible ? filter : options?.find((x) => x.value === value)?.label ?? ''),
    [filter, value, visible],
  );
  const { position, trigger } = usePosition({ ref, hasWidth: true });
  const filteredOptions = useMemo(() => options?.filter((option) => option.label.includes(filter)), [options, filter]);
  const isEmpty = !filteredOptions?.length;
  const handleKeyDownForNextFocus = (e: KeyboardEvent) => {
    if (e.code === 'Tab' && layerRef.current) {
      const firstTarget = layerRef.current.childNodes[0];
      if (firstTarget instanceof HTMLButtonElement) firstTarget.focus();
      e.preventDefault();
      e.stopPropagation();
    }
  };
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === 'Tab' && layerRef.current) {
      const childNodes = layerRef.current.childNodes;
      if (childNodes[childNodes.length - 1] === e.target) {
        ref.current?.focus();
      }
    }
  };
  const handleFocusForOpen = () => {
    clearTimeout(sto.current);
    setVisible(true);
    trigger();
  };
  const handleFilter = (e: ChangeEvent<HTMLInputElement>) => setFilter(e.currentTarget.value);
  const handleFocusCapture = () => clearTimeout(sto.current);
  const handleBlurForClose = () => (sto.current = setTimeout(() => setVisible(false), 0));
  const handleChange = (newValue: string) => {
    setValue(newValue);
    handleBlurForClose();
    onChange && onChange(newValue);
  };

  useEffect(() => {
    window.addEventListener('resize', handleBlurForClose);
    window.addEventListener('scroll', handleBlurForClose);
    return () => {
      window.removeEventListener('resize', handleBlurForClose);
      window.removeEventListener('scroll', handleBlurForClose);
    };
  }, []);
  return (
    <>
      <Delay show={visible && isEmpty} before={5000} after={1000}>
        <Toast show={visible && isEmpty}>검색 결과가 없을 땐 검색어를 바꿔보세요~</Toast>
      </Delay>
      <Input
        {...props}
        placeholder={visible ? '검색어를 입력해보아요.' : placeholder}
        themeColor={themeColor}
        themeSize={themeSize}
        reverseLabel={position?.bottom !== undefined}
        onChange={handleFilter}
        value={label}
        ref={ref}
        onKeyDown={handleKeyDownForNextFocus}
        onFocus={handleFocusForOpen}
        onBlur={handleBlurForClose}
      >
        {children}
      </Input>
      {createPortal(
        <Smooth>
          {visible && (
            <div
              ref={layerRef}
              onFocusCapture={handleFocusCapture}
              onKeyDownCapture={handleKeyDown}
              style={position}
              className={theme}
            >
              {filteredOptions?.map((option) => (
                <Button
                  value={option.value}
                  name={name}
                  themeColor={themeColor}
                  themeSize={themeSize}
                  key={option.value}
                  disabled={option.disabled}
                  onClick={() => handleChange(option.value)}
                  className="w-full"
                >
                  {option.label}
                </Button>
              ))}
              {isEmpty && <div className="combo__empty">{filter ? '검색결과가 없습니다' : '내용이 없습니다'}</div>}
            </div>
          )}
        </Smooth>,
        document.body,
      )}
    </>
  );
};

export default Combo;
