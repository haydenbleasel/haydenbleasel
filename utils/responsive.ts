import { useState, useLayoutEffect } from "react";
import { useMediaQuery } from "react-responsive";

const breakpoints = {
  mobile: "576px",
  tablet: "768px",
  laptop: "992px",
  desktop: "1200px",
  desktopLarge: "1440px",
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

  const isDesktopLarge = useMediaQuery({
    maxWidth: breakpoints.desktopLarge,
  });

  useLayoutEffect(() => {
    if (typeof window !== "undefined") setIsClient(true);
  }, []);

  return {
    isDesktopLarge: isClient ? isDesktopLarge : true,
    isDesktop: isClient ? isDesktop : false,
    isLaptop: isClient ? isLaptop : false,
    isTablet: isClient ? isTablet : false,
    isMobile: isClient ? isMobile : false,
  };
}

export default useResponsive;
