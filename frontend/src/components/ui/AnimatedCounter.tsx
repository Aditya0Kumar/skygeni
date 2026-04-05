import { useEffect, useState } from 'react';
import { motion, useSpring, useTransform, animate } from 'framer-motion';

interface Props {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
}

const AnimatedCounter: React.FC<Props> = ({ value, prefix = "", suffix = "", decimals = 0, duration = 1.2 }) => {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    const controls = animate(displayValue, value, {
      duration,
      ease: [0.16, 1, 0.3, 1], // Custom bounce-out ease
      onUpdate: (latest) => setDisplayValue(latest)
    });

    return () => controls.stop();
  }, [value]);

  const formatted = displayValue.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <motion.span>
      {prefix}{formatted}{suffix}
    </motion.span>
  );
};

export default AnimatedCounter;
