import { useEffect, useRef, useState } from 'react';
import Lottie from 'lottie-web';

const PresumiAnimation = () => {
    const presumiRef = useRef(null);
    const [animationLoaded, setAnimationLoaded] = useState(false);

    useEffect(() => {
        if (presumiRef.current && !animationLoaded) {
            const container: Element = presumiRef.current!;

            Lottie.loadAnimation({
                container,
                renderer: 'svg',
                loop: true,
                autoplay: true,
                path: '/files/presumi.json',
            });

            setAnimationLoaded(true);
        }
    }, [presumiRef]);

    return (
        <div ref={presumiRef} />
    )
}

export default PresumiAnimation;