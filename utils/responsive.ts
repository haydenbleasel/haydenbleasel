import { useState, useLayoutEffect } from 'react';
import { useMediaQuery } from 'react-responsive';

const breakpoints = {
    mobile: '575.98px',
    tablet: '767.98px',
    laptop: '991.98px',
    desktop: '1199.98px',
};

function useResponsive() {
    const [isClient, setIsClient] = useState(false);

    const isMobile = useMediaQuery({
        maxWidth: breakpoints.mobile,
    });

    const isTablet = useMediaQuery({
        maxWidth: breakpoints.tablet,
    });

    const isLaptop = useMediaQuery({
        maxWidth: breakpoints.laptop,
    });

    const isDesktop = useMediaQuery({
        maxWidth: breakpoints.desktop,
    });

    useLayoutEffect(() => {
        if (typeof window !== 'undefined') setIsClient(true);
    }, []);

    return {
        isDesktop: isClient ? isDesktop : true,
        isLaptop: isClient ? isLaptop : false,
        isTablet: isClient ? isTablet : false,
        isMobile: isClient ? isMobile : false,
    };
}

export default useResponsive;