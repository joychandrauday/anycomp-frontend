'use client';

import React, { Children, useRef, useState, useLayoutEffect, ReactNode } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

interface StepperProps {
  children: ReactNode;
  activeStep: number;
  stepContainerClassName?: string;
  contentClassName?: string;
}

export default function Stepper({
  children,
  activeStep,
  stepContainerClassName = '',
  contentClassName = '',
}: StepperProps) {
  const stepsArray = Children.toArray(children);
  const totalSteps = stepsArray.length;

  /**
   * RESOLUTION: Adjusting state during render.
   * This is the React-recommended way to handle "prev" state without useEffect.
   * React will immediately re-run the component with the updated state 
   * before the browser paints, avoiding the cascading render lag.
   */
  const [prevStep, setPrevStep] = useState(activeStep);
  const [direction, setDirection] = useState(0);

  if (activeStep !== prevStep) {
    setDirection(activeStep > prevStep ? 1 : -1);
    setPrevStep(activeStep);
  }

  return (
    <div className="flex flex-col w-full">
      {/* Visual Step Indicators */}
      <div className={`${stepContainerClassName} flex w-full items-center justify-between p-4 mb-4`}>
        {stepsArray.map((_, index) => (
          <React.Fragment key={index}>
            <StepIndicator
              stepIndex={index}
              activeStep={activeStep}
            />
            {index < totalSteps - 1 && (
              <StepConnector isComplete={activeStep > index} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Content Area */}
      <StepContentWrapper
        currentStep={activeStep}
        direction={direction}
        className={contentClassName}
      >
        {stepsArray[activeStep]}
      </StepContentWrapper>
    </div>
  );
}

interface StepContentWrapperProps {
  currentStep: number;
  direction: number;
  children: ReactNode;
  className?: string;
}

function StepContentWrapper({ currentStep, direction, children, className }: StepContentWrapperProps) {
  const [parentHeight, setParentHeight] = useState<number | string>('auto');
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (containerRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setParentHeight(entry.contentRect.height);
        }
      });

      resizeObserver.observe(containerRef.current);
      return () => resizeObserver.disconnect();
    }
  }, [children]);

  return (
    <motion.div
      style={{ position: 'relative', overflow: 'hidden' }}
      animate={{ height: parentHeight }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={className}
    >
      <AnimatePresence initial={false} mode="popLayout" custom={direction}>
        <motion.div
          key={currentStep}
          custom={direction}
          variants={stepVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 35 },
            opacity: { duration: 0.2 }
          }}
          ref={containerRef}
          className="w-full"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

const stepVariants: Variants = {
  enter: (dir: number) => ({
    x: dir > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: '0%',
    opacity: 1,
  },
  exit: (dir: number) => ({
    x: dir > 0 ? '-100%' : '100%',
    opacity: 0,
  }),
};

function StepIndicator({ stepIndex, activeStep }: { stepIndex: number; activeStep: number }) {
  const isComplete = activeStep > stepIndex;
  const isActive = activeStep === stepIndex;

  return (
    <motion.div
      className="flex items-center justify-center h-8 w-8 rounded-full border-2 border-[#5227FF] relative shrink-0"
      animate={{
        backgroundColor: isComplete || isActive ? '#5227FF' : 'transparent',
        borderColor: '#5227FF',
        scale: isActive ? 1.1 : 1
      }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
    >
      {isComplete ? (
        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-white text-xs">
          ✓
        </motion.span>
      ) : (
        <span className={`${isActive ? 'text-white' : 'text-[#5227FF]'} text-xs font-bold`}>
          {stepIndex + 1}
        </span>
      )}
    </motion.div>
  );
}

function StepConnector({ isComplete }: { isComplete: boolean }) {
  return (
    <div className="flex-1 h-0.5 mx-2 bg-gray-200 overflow-hidden rounded-full">
      <motion.div
        className="h-full bg-[#5227FF]"
        initial={{ width: '0%' }}
        animate={{ width: isComplete ? '100%' : '0%' }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      />
    </div>
  );
}

export function Step({ children }: { children?: ReactNode }) {
  return <div className="w-full p-1">{children}</div>;
}