/**
 * AnimationLayer — renders cross-boundary flight animations in the
 * slide frame's overlay (z:50).
 *
 * Each active flight is a motion.div positioned absolutely within the
 * slide frame, animating from its source rect to its target rect.
 * When the animation completes the flight is dismissed and the consumer's
 * onComplete callback fires.
 *
 * Uses motion.dev's AnimatePresence for enter/exit orchestration.
 */

'use client';

import { motion, AnimatePresence } from 'motion/react';
import { useSlideAnimation } from '@/hooks/useSlideAnimation';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function AnimationLayer() {
  const { flights, dismiss } = useSlideAnimation();

  return (
    <AnimatePresence>
      {flights.map((flight) => {
        const { id, from, to, transition } = flight;

        // Build motion.dev transition config
        const motionTransition = transition.spring
          ? {
              type: 'spring' as const,
              stiffness: transition.spring.stiffness ?? 300,
              damping: transition.spring.damping ?? 25,
              mass: transition.spring.mass ?? 1,
            }
          : {
              duration: transition.duration ?? 0.6,
              ease: (transition.ease ?? [0.16, 1, 0.3, 1]) as [number, number, number, number],
            };

        return (
          <motion.div
            key={id}
            initial={{
              x: from.x,
              y: from.y,
              width: from.width,
              height: from.height,
              opacity: 1,
            }}
            animate={{
              x: to.x,
              y: to.y,
              width: to.width,
              height: to.height,
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={motionTransition}
            onAnimationComplete={() => dismiss(id)}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              pointerEvents: 'none',
              overflow: 'hidden',
            }}
          >
            {flight.render()}
          </motion.div>
        );
      })}
    </AnimatePresence>
  );
}
