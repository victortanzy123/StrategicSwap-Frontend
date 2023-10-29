"use client";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";


const variants = {
    inactive: {
        opacity: 1,
        // y: 0,
        transition: {
          duration: 1,
          ease: 'easeInOut'
        },
      }, 
      out: {
        opacity: 0,
        // y: -100,
        transition: {
          duration: 1,
          ease: 'easeInOut'
        }
      },
      in: {
        // y: 100,
        opacity: 0,
        transition: {
          duration: 1,
          ease: 'easeInOut'
        }
      },
  };

  const onExitComplete = () => {
    window.scrollTo({ top: 0 })
  }

  export const Transition = ({children}: {children: React.ReactNode}) => {
   return (
    <>
    <AnimatePresence mode='wait' onExitComplete={onExitComplete}>
      <motion.div
      // className="fixed inset-0 overflow-y-auto"
        variants={variants}
        initial="in"
        animate="inactive"
        exit="out"
        transition={{ delay: 0.25 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  </>
   )
  }