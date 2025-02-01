"use client";

import { useEffect, useState } from "react";
import { motion, useAnimation, useMotionValue, useTransform } from "framer-motion";
import { Loader2 } from "lucide-react";

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}

export function PullToRefresh({ onRefresh, children }: PullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [startY, setStartY] = useState(0);
  const pullY = useMotionValue(0);
  const controls = useAnimation();

  const pullProgress = useTransform(pullY, [0, 80], [0, 1]);
  const refresherRotate = useTransform(pullProgress, [0, 1], [0, 180]);

  useEffect(() => {
    let touchStartY = 0;
    let isPulling = false;

    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        touchStartY = e.touches[0].clientY;
        isPulling = true;
        setStartY(touchStartY);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPulling) return;

      const currentY = e.touches[0].clientY;
      const diff = currentY - startY;

      if (diff > 0 && window.scrollY === 0) {
        e.preventDefault();
        pullY.set(Math.min(diff * 0.5, 80));
      }
    };

    const handleTouchEnd = async () => {
      if (!isPulling) return;
      isPulling = false;

      if (pullY.get() >= 80) {
        setIsRefreshing(true);
        pullY.set(60);
        
        try {
          await onRefresh();
        } finally {
          await controls.start({
            y: 0,
            transition: { type: "spring", damping: 20 },
          });
          setIsRefreshing(false);
          pullY.set(0);
        }
      } else {
        controls.start({
          y: 0,
          transition: { type: "spring", damping: 20 },
        });
        pullY.set(0);
      }
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [controls, onRefresh, pullY, startY]);

  return (
    <div className="relative">
      <motion.div
        style={{ y: pullY }}
        animate={controls}
        className="w-full"
      >
        <motion.div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            top: "-40px",
            rotate: refresherRotate,
          }}
        >
          <Loader2 
            className={`h-6 w-6 ${isRefreshing ? "animate-spin text-primary" : "text-muted-foreground"}`}
          />
        </motion.div>
        {children}
      </motion.div>
    </div>
  );
}
