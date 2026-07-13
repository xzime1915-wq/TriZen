"use client";

import { ArrowDown, Check, Lock, MousePointer2 } from "lucide-react";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";

const STEPS = [
  {
    n: "01",
    kicker: "Stuck on rough glide?",
    title: "Unlock a smoother surface",
    body: "TRIZEN glass and tuned PTFE options remove drag so your aim feels lighter from the first swipe.",
  },
  {
    n: "02",
    kicker: "Need control too?",
    title: "Dial in speed and stopping",
    body: "Low-friction movement pairs with a planted base, giving flicks speed without losing the brake point.",
  },
  {
    n: "03",
    kicker: "Setup keeps shifting?",
    title: "Keep the desk locked",
    body: "Stable materials, clean edges, and esports-first sizing keep your gear steady through long sessions.",
  },
  {
    n: "04",
    kicker: "Ready for ranked?",
    title: "Play with confidence",
    body: "Pick your TRIZEN gear, check out your way, and bring the upgrade straight into your next match.",
  },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function HomeProcess() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);
  const arrowRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef(0);
  const targetProgressRef = useRef(0);
  const cardThresholdsRef = useRef<number[]>([]);
  const [progress, setProgress] = useState(0);
  const [activeCount, setActiveCount] = useState(0);

  useEffect(() => {
    let measureFrame = 0;
    let motionFrame = 0;
    let isAnimating = false;

    const syncActiveCount = (nextProgress: number) => {
      const nextCount = cardThresholdsRef.current.filter(
        (threshold) => nextProgress + 0.001 >= threshold,
      ).length;

      setActiveCount((current) =>
        current === nextCount ? current : nextCount,
      );
    };

    const animateProgress = () => {
      const current = progressRef.current;
      const target = targetProgressRef.current;
      const distance = target - current;
      const nextProgress =
        Math.abs(distance) < 0.0005 ? target : current + distance * 0.12;

      progressRef.current = nextProgress;
      setProgress(nextProgress);
      syncActiveCount(nextProgress);

      if (nextProgress !== target) {
        motionFrame = requestAnimationFrame(animateProgress);
        return;
      }

      isAnimating = false;
    };

    const startAnimation = () => {
      if (isAnimating) return;
      isAnimating = true;
      motionFrame = requestAnimationFrame(animateProgress);
    };

    const measureProgress = (immediate = false) => {
      if (!stageRef.current || !railRef.current || !arrowRef.current) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        progressRef.current = 1;
        targetProgressRef.current = 1;
        setProgress(1);
        setActiveCount(STEPS.length);
        return;
      }

      const railRect = railRef.current.getBoundingClientRect();
      const arrowHeight = arrowRef.current.offsetHeight;
      const arrowTravel = Math.max(
        railRef.current.offsetHeight - arrowHeight,
        1,
      );
      const revealLine = window.innerHeight * 0.68;
      const nextTarget = clamp(
        (revealLine - railRect.top - arrowHeight / 2) / arrowTravel,
        0,
        1,
      );

      const cards = stageRef.current.querySelectorAll<HTMLElement>(
        ".trizen-unlock-card",
      );
      cardThresholdsRef.current = Array.from(cards, (card) =>
        clamp(
          (card.offsetTop +
            card.offsetHeight / 2 -
            railRef.current!.offsetTop -
            arrowHeight / 2) /
            arrowTravel,
          0,
          1,
        ),
      );

      targetProgressRef.current = nextTarget;

      if (immediate) {
        progressRef.current = nextTarget;
        setProgress(nextTarget);
        syncActiveCount(nextTarget);
        return;
      }

      startAnimation();
    };

    const requestMeasure = () => {
      cancelAnimationFrame(measureFrame);
      measureFrame = requestAnimationFrame(() => measureProgress());
    };

    measureProgress(true);
    window.addEventListener("scroll", requestMeasure, { passive: true });
    window.addEventListener("resize", requestMeasure);

    return () => {
      cancelAnimationFrame(measureFrame);
      cancelAnimationFrame(motionFrame);
      window.removeEventListener("scroll", requestMeasure);
      window.removeEventListener("resize", requestMeasure);
    };
  }, []);

  const currentIndex = activeCount - 1;

  return (
    <section
      className="trizen-process-section"
      style={
        {
          "--unlock-progress": progress,
        } as CSSProperties
      }
    >
      <div className="trizen-process-sticky">
        <div className="container-trizen-full">
          <div className="trizen-process-heading">
            <p className="trizen-process-eyebrow">Scroll to unlock</p>
            <h2 className="trizen-display-title mt-4">Your upgrade path</h2>
            <p className="trizen-process-copy">
              Keep scrolling and reveal each TRIZEN advantage one step at a
              time.
            </p>
          </div>

          <div ref={stageRef} className="trizen-unlock-stage">
            <div ref={railRef} className="trizen-unlock-rail" aria-hidden>
              <div className="trizen-unlock-rail-track" />
              <div className="trizen-unlock-rail-fill" />
              <div ref={arrowRef} className="trizen-unlock-arrow">
                <ArrowDown size={22} strokeWidth={2.4} />
              </div>
            </div>

            <div className="trizen-unlock-list">
              {STEPS.map((step, index) => {
                const isActive = index < activeCount;
                const isCurrent = index === currentIndex;

                return (
                  <article
                    key={step.n}
                    className={[
                      "trizen-unlock-card",
                      isActive ? "trizen-unlock-card--active" : "",
                      isCurrent ? "trizen-unlock-card--current" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    <div className="trizen-unlock-status" aria-hidden>
                      {isActive ? <Check size={18} /> : <Lock size={17} />}
                    </div>

                    <div className="trizen-unlock-content">
                      <span className="trizen-process-num">{step.n}</span>
                      <p className="trizen-unlock-kicker">{step.kicker}</p>
                      <h3 className="trizen-process-title">{step.title}</h3>
                      <p className="trizen-unlock-body">{step.body}</p>
                    </div>

                    <div className="trizen-unlock-icon" aria-hidden>
                      <MousePointer2 size={28} strokeWidth={1.5} />
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
