import mergeClassName from '#/mergeClassName';
import { CSSProperties, ReactNode, useEffect, useState } from 'react';
interface UseSmoothProps {
  children?: ReactNode;
  className?: string;
  type?: 'fade' | 'drop' | 'zoom';
  style?: CSSProperties;
}
const Smooth = ({ children, className, type = 'fade', ...props }: UseSmoothProps) => {
  const [show, setShow] = useState(false);
  const [clone, setClone] = useState(children);
  const [hide, setHide] = useState(false);
  const handleAnimationEnd = () => {
    if (!show) setHide(true);
  };
  useEffect(() => {
    if (!children) return setShow(false);

    setClone(children);
    setHide(false);
    setShow(true);
  }, [children]);
  return hide ? null : (
    <div
      {...props}
      className={mergeClassName(type, `${type}--${show ? 'in' : 'out'}`, className)}
      onAnimationEnd={handleAnimationEnd}
    >
      {clone}
    </div>
  );
};

export default Smooth;