import { useEffect, useRef, useState } from 'react';
import Lottie from 'lottie-web';

const PresumiAnimation = () => {
    const presumiRef = useRef<HTMLDivElement>(null);
    const [animationLoaded, setAnimationLoaded] = useState(false);

    useEffect(() => {
        let animation;

        if (presumiRef.current && !animationLoaded) {
            animation = Lottie.loadAnimation({
                container: presumiRef.current,
                renderer: 'svg',
                loop: true,
                autoplay: true,
                path: '/files/presumi.json',
            });

            setAnimationLoaded(true);
        }

        return () => {
            animation?.destroy();
        }
    }, [presumiRef]);

    return (
        <div ref={presumiRef} />
    )
}

export default PresumiAnimation;