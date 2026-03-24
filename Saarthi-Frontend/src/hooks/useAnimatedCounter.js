import { useState, useEffect, useRef } from 'react';

export function useAnimatedCounter(targetValue, duration = 500) {
    const [displayValue, setDisplayValue] = useState(targetValue);
    const previousValue = useRef(targetValue);
    const animationRef = useRef(null);

    useEffect(() => {
        const start = previousValue.current;
        const end = typeof targetValue === 'number' ? targetValue : parseFloat(targetValue) || 0;

        if (start === end) return;

        const startTime = performance.now();

        function animate(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);

            const current = Math.round(start + (end - start) * eased);
            setDisplayValue(current);

            if (progress < 1) {
                animationRef.current = requestAnimationFrame(animate);
            } else {
                previousValue.current = end;
            }
        }

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [targetValue, duration]);

    return displayValue;
}
