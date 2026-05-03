import type { ComponentProps, ReactNode } from "react";

interface Job {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: ReactNode;
  logo: (props: ComponentProps<"svg">) => ReactNode;
}

const OpenAILogo = (props: ComponentProps<"svg">) => (
  <svg
    fill="none"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <title>OpenAI</title>
    <path
      d="M9.20507 8.658V6.39835C9.20507 6.20803 9.27647 6.06524 9.4429 5.9702L13.9861 3.3538C14.6046 2.99703 15.3419 2.8306 16.1029 2.8306C18.9573 2.8306 20.7651 5.04273 20.7651 7.39743C20.7651 7.56388 20.7651 7.75419 20.7412 7.94451L16.0316 5.1853C15.7462 5.01887 15.4607 5.01887 15.1753 5.1853L9.20507 8.658ZM19.8136 17.4589V12.0593C19.8136 11.7262 19.6707 11.4884 19.3853 11.3219L13.4152 7.84923L15.3656 6.73122C15.532 6.63618 15.6749 6.63618 15.8413 6.73122L20.3845 9.34764C21.6928 10.1089 22.5727 11.7262 22.5727 13.296C22.5727 15.1036 21.5025 16.7687 19.8136 17.4586V17.4589ZM7.80172 12.7016L5.85129 11.56C5.68484 11.465 5.61345 11.3222 5.61345 11.1319V5.89904C5.61345 3.35401 7.56388 1.42724 10.2042 1.42724C11.2032 1.42724 12.1307 1.76035 12.9158 2.35493L8.23009 5.0666C7.94473 5.23305 7.80193 5.47089 7.80193 5.804V12.7019L7.80172 12.7016ZM12 15.1278L9.20507 13.558V10.228L12 8.65823L14.7946 10.228V13.558L12 15.1278ZM13.7958 22.3587C12.7967 22.3587 11.8692 22.0256 11.0841 21.4311L15.7698 18.7193C16.0552 18.5529 16.198 18.3151 16.198 17.982V11.0841L18.1724 12.2258C18.3388 12.3208 18.4101 12.4636 18.4101 12.6539V17.8868C18.4101 20.4317 16.4358 22.3587 13.7958 22.3587ZM8.15846 17.0545L3.61527 14.4381C2.30695 13.6769 1.42701 12.0595 1.42701 10.4897C1.42701 8.65823 2.52115 7.01703 4.20985 6.32717V11.7503C4.20985 12.0834 4.35265 12.3213 4.63801 12.4877L10.5846 15.9365L8.63414 17.0545C8.46769 17.1496 8.32489 17.1496 8.15846 17.0545ZM7.89698 20.9555C5.20917 20.9555 3.23487 18.9335 3.23487 16.436C3.23487 16.2457 3.25874 16.0554 3.28239 15.8651L7.96815 18.5768C8.2535 18.7432 8.53909 18.7432 8.82445 18.5768L14.7946 15.128V17.3877C14.7946 17.578 14.7233 17.7207 14.5568 17.8157L10.0136 20.4322C9.39516 20.7889 8.65777 20.9555 7.89676 20.9555H7.89698ZM13.7958 23.7858C16.6738 23.7858 19.0761 21.7402 19.6234 19.0286C22.2873 18.3387 24 15.8412 24 13.2962C24 11.6312 23.2864 10.0138 22.0019 8.84832C22.1209 8.34877 22.1924 7.84923 22.1924 7.34991C22.1924 3.94861 19.4331 1.40336 16.2458 1.40336C15.6037 1.40336 14.9852 1.49841 14.3667 1.71259C13.2962 0.665983 11.8215 0 10.2042 0C7.32604 0 4.92381 2.04547 4.37652 4.75714C1.7126 5.447 0 7.94451 0 10.4895C0 12.1546 0.713504 13.7719 1.99795 14.9374C1.87903 15.437 1.80764 15.9365 1.80764 16.4359C1.80764 19.8371 4.56683 22.3823 7.7542 22.3823C8.3963 22.3823 9.01477 22.2874 9.63322 22.0732C10.7035 23.1198 12.1782 23.7858 13.7958 23.7858Z"
      fill="currentColor"
    />
  </svg>
);

const VercelLogo = (props: ComponentProps<"svg">) => (
  <svg
    fill="none"
    viewBox="0 0 24 21"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <title>Vercel</title>
    <path d="M11.8508 0L23.7015 20.5263H0L11.8508 0Z" fill="currentColor" />
  </svg>
);

const CorelliumLogo = (props: ComponentProps<"svg">) => (
  <svg
    fill="none"
    viewBox="0 0 16 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <title>Corellium</title>
    <path
      clipRule="evenodd"
      d="M6.4704 24C6.7272 24 6.984 23.9328 7.2096 23.8008L13.7472 19.8816C14.1744 19.6248 14.5152 19.2744 14.7624 18.8568C15 18.4296 15.132 17.9544 15.132 17.472V3.1704C15.132 3.0096 15.1032 2.8488 15.036 2.6856C14.9784 2.5344 14.8848 2.3904 14.76 2.2776C14.6472 2.1648 14.5032 2.0688 14.352 2.0112C14.2008 1.9536 14.04 1.9152 13.8672 1.9152C13.6392 1.9152 13.4208 1.9824 13.2312 2.1048L10.0416 4.0032C10.6776 4.6968 11.0184 5.5968 11.0184 6.5376V17.4984C11.0184 17.916 10.9152 18.3336 10.7064 18.6936C10.4976 19.0536 10.1856 19.3584 9.8232 19.5672C9.4536 19.776 9.036 19.8792 8.6184 19.872C8.1912 19.872 7.7832 19.7496 7.4232 19.5312L5.0232 18.0984V22.5768C5.0232 22.7664 5.0616 22.956 5.1264 23.1264C5.2032 23.2968 5.3064 23.4576 5.4384 23.592C5.5704 23.7264 5.7336 23.8296 5.904 23.8968C6.0744 23.964 6.264 24 6.4536 24H6.4704Z"
      fill="currentColor"
      fillRule="evenodd"
    />
    <path
      clipRule="evenodd"
      d="M5.9376 5.3712L8.3568 3.9096L2.16 0.1992C1.932 0.0672 1.6848 0 1.4304 0C1.2408 0 1.0608 0.0384 0.8904 0.1128C0.72 0.1896 0.5592 0.2832 0.4248 0.4176C0.2928 0.5496 0.1872 0.7032 0.1128 0.8736C0.0384 1.044 0 1.224 0 1.4136V12.3744C0 12.8592 0.1224 13.3512 0.3696 13.7784C0.6072 14.2056 0.9576 14.5656 1.3848 14.8224L4.0896 16.4352V8.616C4.0896 7.9608 4.26 7.3152 4.5936 6.756C4.9152 6.1872 5.3808 5.712 5.94 5.3808V5.3712H5.9376Z"
      fill="currentColor"
      fillRule="evenodd"
    />
    <path
      clipRule="evenodd"
      d="M5.0352 8.6064V16.9848L7.92 18.7128C8.1384 18.8448 8.3856 18.912 8.6424 18.912C8.832 18.912 9.0216 18.8736 9.1824 18.7992C9.3528 18.7224 9.5136 18.6192 9.648 18.4944C9.78 18.3624 9.8856 18.2088 9.96 18.0384C10.0344 17.868 10.0632 17.6784 10.0632 17.4984V6.5472C10.0632 6.168 9.9864 5.7888 9.8352 5.4456C9.684 5.0952 9.4656 4.7808 9.1896 4.5144L6.3984 6.1752C5.9712 6.432 5.6304 6.7824 5.3832 7.2096C5.1456 7.6368 5.0328 8.1216 5.0328 8.604L5.0352 8.6064Z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
);

const JellypepperLogo = (props: ComponentProps<"svg">) => (
  <svg
    fill="none"
    viewBox="0 0 19 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <title>Jellypepper</title>
    <path
      d="M12.0687 11.1586C11.614 10.8342 11.1033 10.6814 10.5404 10.7858C10.3951 9.79792 9.54147 9.24993 8.7736 9.26484C8.39712 9.2723 8.30021 9.16792 8.27784 8.79142C8.25175 8.36645 8.31139 7.95267 8.40085 7.53889C8.6916 6.22298 9.10908 4.93317 9.15381 3.5688C9.17245 3.03946 9.1389 2.52503 8.91152 2.04414C8.47167 1.10847 7.53607 0.929536 6.77192 1.61917C6.40663 1.95095 6.13825 2.34236 5.95187 2.80088C5.71704 3.37869 5.56793 3.97886 5.41883 4.57903C5.08708 5.95085 4.6696 7.30403 4.46086 8.70195C4.42359 8.95544 4.37886 9.21638 4.14775 9.45123C3.96883 8.68704 3.78245 7.95639 3.68181 7.21084C3.43207 5.4066 3.26805 3.5949 3.20469 1.77201C3.18978 1.39924 3.13386 1.03391 2.94003 0.702143C2.61574 0.157887 2.02679 -0.125425 1.49748 0.0535087C0.819072 0.280903 0.345677 0.720782 0.170483 1.43652C0.0586575 1.89503 0.00647224 2.361 0.00274472 2.83443C-0.0121654 4.32554 0.0362926 5.81292 0.0847504 7.30403C0.107115 7.91166 0.125753 8.51929 0.166756 9.12319C0.256216 10.3571 0.353132 11.591 0.464958 12.8249C0.539508 13.6636 0.554418 14.5061 0.599148 15.3486C0.614058 15.6207 0.573056 15.8891 0.584238 16.165C0.610331 16.8024 0.755704 17.4138 0.874985 18.0326C1.09491 19.1658 1.26265 20.2991 1.27756 21.4584C1.28874 22.1667 1.32602 22.8712 1.34465 23.5795C1.34838 23.7249 1.3782 23.8479 1.51239 23.9299C1.65031 24.0119 1.79196 24.0268 1.93733 23.9486C2.09016 23.8665 2.1237 23.7286 2.11998 23.5721C2.09016 22.7892 2.07897 22.0101 2.05661 21.2273C2.02679 20.0679 1.84787 18.9347 1.62422 17.8052C1.47139 17.0261 1.34093 16.2507 1.37075 15.4492C1.40057 14.7037 1.35211 13.9618 1.28874 13.22C1.16946 11.7774 1.02781 10.3347 0.934625 8.89207C0.86753 7.82592 0.841437 6.75978 0.833982 5.68991C0.8228 4.56039 0.699791 3.4346 0.826527 2.30509C0.871257 1.92113 0.901077 1.53344 1.11727 1.20539C1.29992 0.933265 1.56085 0.672321 1.89633 0.735694C2.25044 0.802794 2.35481 1.16066 2.38836 1.49243C2.41445 1.72728 2.39954 1.96586 2.41818 2.20071C2.51137 3.39733 2.57473 4.59767 2.71265 5.79056C2.7872 6.42801 2.84312 7.06919 2.97358 7.69918C3.13759 8.48574 3.29415 9.27603 3.46561 10.0626C3.50289 10.2303 3.58117 10.3906 3.64081 10.5509C3.71536 10.7522 3.87191 10.8454 4.0732 10.8454C4.25957 10.8454 4.39749 10.7448 4.48323 10.5733C4.65096 10.2415 4.82616 9.91348 4.99762 9.58171C5.03117 9.51461 5.05354 9.44378 5.06845 9.36922C5.41138 7.75882 5.82886 6.16333 6.23516 4.56785C6.36935 4.0385 6.49609 3.50916 6.71228 3.00591C6.8763 2.62195 7.09249 2.27899 7.43542 2.03296C7.75599 1.80184 7.87154 1.86894 8.08774 2.13734C8.27412 2.36846 8.33003 2.65177 8.34867 2.93508C8.39712 3.66945 8.31885 4.39637 8.16602 5.1121C7.98337 5.95831 7.75226 6.79706 7.57707 7.64326C7.44288 8.29562 7.34224 8.9629 7.72244 9.55188C6.8763 10.4093 6.51473 11.4046 6.72719 12.5527C6.80547 12.9703 6.79802 13.2871 6.45508 13.5518C6.42899 13.5742 6.39917 13.5891 6.3619 13.6077C6.29107 13.5481 6.22398 13.4921 6.16061 13.4362C5.59403 12.9292 4.97526 12.4931 4.28567 12.1725C4.03965 12.0569 3.79363 11.9339 3.5178 11.8967C3.32397 11.8668 3.15623 11.9712 3.10777 12.139C3.05931 12.3104 3.14505 12.4335 3.27551 12.5155C3.39106 12.5863 3.52525 12.6273 3.65199 12.6758C4.51677 13.0187 5.24364 13.5555 5.89596 14.2041C5.79904 14.3346 5.69467 14.4204 5.58657 14.5061C5.04981 14.9273 4.50559 15.2144 3.83091 14.7633C3.60726 14.6142 3.38361 14.6925 3.27924 14.8789C3.17859 15.0578 3.23078 15.2032 3.4768 15.3672C4.04338 15.7437 4.63978 15.822 5.27346 15.5499C5.89596 15.2852 6.38799 14.864 6.80174 14.3384C7.00303 14.0849 7.18568 13.8202 7.43542 13.6077C8.00201 13.1268 8.72142 13.2759 9.04571 13.9432C9.0979 14.055 9.14263 14.1743 9.16872 14.2936C9.38865 15.2852 9.08672 16.1538 8.44185 16.877C7.3646 18.081 5.9295 18.3793 4.38631 18.3122C4.27448 18.3084 4.17011 18.2786 4.05829 18.3159C3.92037 18.3643 3.816 18.4389 3.80482 18.5992C3.79363 18.7558 3.86818 18.8564 3.99865 18.931C4.12166 18.9981 4.25957 19.013 4.39376 19.0204C5.68722 19.0875 6.90984 18.8601 8.03555 18.1929C8.12874 18.1369 8.20329 18.0475 8.34121 18.0512C8.40831 18.3681 8.31139 18.6626 8.23311 18.9571C8.05046 19.6355 7.7299 20.2469 7.29378 20.7986C7.13349 20.9999 7.14468 21.149 7.29378 21.2944C7.44288 21.436 7.6628 21.4435 7.838 21.3056C7.88645 21.2683 7.93118 21.2198 7.96846 21.1714C8.74006 20.1835 9.19481 19.0764 9.16499 17.8089C9.15754 17.4548 9.15381 17.1267 9.42592 16.8583C9.52656 16.7577 9.53029 16.5713 9.69803 16.5228C9.88813 16.4669 9.99623 16.3103 10.123 16.1724C10.615 15.6319 11.1108 15.0876 11.6587 14.603C11.7146 14.5546 11.7519 14.4427 11.8749 14.4986C11.8749 14.8192 11.8749 15.1398 11.8749 15.4604C11.8712 16.6608 11.6885 17.8275 11.2971 18.9608C10.9989 19.8256 10.6858 20.6868 10.492 21.5851C10.3988 22.0101 10.3168 22.4351 10.287 22.8675C10.2683 23.1247 10.4025 23.2813 10.6336 23.3148C10.8573 23.3484 11.0064 23.2254 11.0548 22.9607C11.0921 22.7408 11.1145 22.5208 11.1518 22.3009C11.3046 21.395 11.5767 20.519 11.8935 19.6579C12.3297 18.4762 12.613 17.2572 12.6577 16.0009C12.6875 15.1473 12.7509 14.2936 12.7397 13.4362C12.736 13.2349 12.7583 13.0411 12.777 12.8435C12.8552 12.1539 12.6428 11.5686 12.0687 11.1586ZM8.91152 12.6385C8.85561 12.7279 8.81088 12.7578 8.70651 12.7205C8.38221 12.6087 8.05047 12.5788 7.72244 12.6832C7.55843 12.7317 7.52116 12.631 7.50252 12.5192C7.47643 12.3477 7.46897 12.1725 7.45406 12.0271C7.48015 11.4158 7.65535 10.879 7.99082 10.4018C8.36358 9.86874 9.17245 9.83147 9.56011 10.3496C9.7614 10.618 9.81358 11.2555 9.62721 11.5537C9.39237 11.9153 9.14263 12.2694 8.91152 12.6385ZM11.901 13.1045C11.7892 13.343 11.6401 13.5555 11.4611 13.7419C11.0176 14.2042 10.5181 14.6142 10.0261 15.1659C10.0671 14.4465 9.96641 13.8463 9.56384 13.3319C9.47438 13.2163 9.50793 13.138 9.57502 13.0374C9.82849 12.6571 10.0671 12.2657 10.3317 11.8929C10.7492 11.3039 11.5133 11.3599 11.8637 12.001C12.0538 12.3589 12.0799 12.7279 11.901 13.1045Z"
      fill="currentColor"
    />
    <path
      d="M16.8803 5.3904C16.099 5.40586 15.2657 6.10923 15.2937 6.75077C15.3298 7.57395 15.9027 8.34689 16.9123 8.39713C17.7016 8.43578 18.4308 7.71694 18.4268 6.9556C18.4188 6.12082 17.6816 5.37494 16.8803 5.3904ZM16.9764 7.65124C16.6559 7.69375 16.2873 7.4155 16.1992 7.05995C16.091 6.62324 16.4275 6.16334 16.8843 6.11696C17.0285 6.1015 17.1447 6.1672 17.2449 6.25609C17.4452 6.43773 17.5654 6.66188 17.5654 6.97879C17.5654 7.29183 17.309 7.60487 16.9764 7.65124Z"
      fill="currentColor"
    />
  </svg>
);

const PalantirLogo = (props: ComponentProps<"svg">) => (
  <svg
    fill="none"
    viewBox="0 0 634 800"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <title>Palantir</title>
    <path
      d="M588.3 600L316.675 706L45.05 600L0 678.125L316.675 800L633.35 678.125L588.3 600ZM316.675 0C141.8 0 0 141.8 0 316.675C0 491.55 141.8 633.35 316.675 633.35C491.55 633.35 633.35 491.55 633.35 316.675C633.35 141.8 491.55 0 316.675 0ZM316.675 535.95C195.7 535.95 97.8 437.9 97.8 317.075C97.8 196.1 195.725 98.075 316.675 98.075C437.625 98.075 535.55 196.125 535.55 317.075C535.55 437.9 437.625 535.95 316.675 535.95Z"
      fill="currentColor"
    />
  </svg>
);

const jobs: Job[] = [
  {
    company: "OpenAI",
    description: "Working on the new frontier of intelligence. Stay tuned.",
    endDate: "Present",
    logo: OpenAILogo,
    role: "Member of Technical Staff",
    startDate: "Mar 2026",
  },
  {
    company: "Vercel",
    description: (
      <>
        Created{" "}
        <a
          href="https://streamdown.ai/"
          rel="noopener noreferrer"
          target="_blank"
        >
          Streamdown
        </a>
        ,{" "}
        <a
          href="https://elements.ai-sdk.dev/"
          rel="noopener noreferrer"
          target="_blank"
        >
          AI Elements
        </a>
        ,{" "}
        <a
          href="https://www.npmjs.com/package/remend"
          rel="noopener noreferrer"
          target="_blank"
        >
          Remend
        </a>
        ,{" "}
        <a
          href="https://github.com/vercel-labs/tersa"
          rel="noopener noreferrer"
          target="_blank"
        >
          Tersa
        </a>
        ,{" "}
        <a
          href="https://github.com/vercel-labs/openreview"
          rel="noopener noreferrer"
          target="_blank"
        >
          OpenReview
        </a>
        ,{" "}
        <a
          href="https://github.com/vercel-labs/vectr"
          rel="noopener noreferrer"
          target="_blank"
        >
          Vectr
        </a>{" "}
        and{" "}
        <a
          href="https://www.npm.bet/"
          rel="noopener noreferrer"
          target="_blank"
        >
          npm.bet
        </a>
        . Helped ship{" "}
        <a
          href="https://chat-sdk.dev/"
          rel="noopener noreferrer"
          target="_blank"
        >
          Chat SDK
        </a>
        ,{" "}
        <a
          href="https://vercel.com/platforms"
          rel="noopener noreferrer"
          target="_blank"
        >
          Platforms
        </a>
        ,{" "}
        <a
          href="https://vercel.com/blog/workflow-builder-build-your-own-workflow-automation-platform"
          rel="noopener noreferrer"
          target="_blank"
        >
          Workflow Builder
        </a>{" "}
        and{" "}
        <a
          href="https://vercel.com/academy"
          rel="noopener noreferrer"
          target="_blank"
        >
          Academy
        </a>
        ; rebuilt all our docs sites (e.g.{" "}
        <a href="https://v0.app/docs" rel="noopener noreferrer" target="_blank">
          v0
        </a>
        ,{" "}
        <a
          href="https://useworkflow.dev/docs/getting-started"
          rel="noopener noreferrer"
          target="_blank"
        >
          Workflow
        </a>
        ,{" "}
        <a
          href="https://turborepo.dev/docs"
          rel="noopener noreferrer"
          target="_blank"
        >
          Turborepo
        </a>
        ) and co-authored{" "}
        <a
          href="https://www.components.build/"
          rel="noopener noreferrer"
          target="_blank"
        >
          components.build
        </a>
        .
      </>
    ),
    endDate: "Mar 2026",
    logo: VercelLogo,
    role: "DX Engineer",
    startDate: "Jun 2025",
  },
  {
    company: "Corellium",
    description: (
      <>
        Started the frontend engineering team, then led the Product, Design and
        Support teams. Rebranded the company and helped it grow from seed to
        Series A funding, then subsequent{" "}
        <a
          href="https://techcrunch.com/2025/06/05/phone-unlocking-firm-cellebrite-to-acquire-mobile-testing-startup-corellium-for-170m/"
          rel="noopener noreferrer"
          target="_blank"
        >
          acquisition
        </a>{" "}
        from Cellebrite.
      </>
    ),
    endDate: "Jan 2025",
    logo: CorelliumLogo,
    role: "Chief Product Officer",
    startDate: "Nov 2021",
  },
  {
    company: "Jellypepper",
    description: (
      <>
        Started and ran an award-winning digital agency. Worked with early stage
        startups working on self-driving car technology, AI, biotech, crypto,
        drone delivery, cybersecurity and orbital logistics.{" "}
        <a
          href="https://raw.studio/blog/raw-studio-acquires-jellypepper-to-expand-its-reach-to-the-startup-ecosystem/"
          rel="noopener noreferrer"
          target="_blank"
        >
          Acquired
        </a>{" "}
        by Raw Studio.
      </>
    ),
    endDate: "Jul 2023",
    logo: JellypepperLogo,
    role: "Director",
    startDate: "Nov 2017",
  },
  {
    company: "Palantir",
    description:
      "Part of a small team tasked with designing an anti-fraud focused pilot project. Designed a platform allowing for node-based graphing, time-based visualization for object frequency analysis, and a rich data exploration interface.",
    endDate: "Dec 2015",
    logo: PalantirLogo,
    role: "Product Design Intern",
    startDate: "Oct 2015",
  },
];

const JobCard = ({ job }: { job: Job }) => (
  <div className="grid sm:grid-cols-[48px_1fr] gap-4 rounded-xl">
    <div className="flex aspect-square w-12 sm:w-full translate-y-0.5 items-center justify-center rounded-lg border text-foreground">
      <job.logo className="size-6 fill-current" />
    </div>
    <div className="grid gap-3">
      <div className="flex items-start justify-between gap-4">
        <div className="grid">
          <p className="font-medium text-foreground">{job.company}</p>
          <p>{job.role}</p>
        </div>
        <p>
          {job.startDate} → {job.endDate}
        </p>
      </div>
      <p>{job.description}</p>
    </div>
  </div>
);

export const Work = () => (
  <div className="grid gap-8">
    {jobs.map((job) => (
      <JobCard job={job} key={job.company} />
    ))}

    <div className="border-t border-dotted w-full" />

    <p>
      Earlier in my career, I was Head of Product and Design at Spaceship (later{" "}
      <a
        href="https://www.afr.com/technology/cannon-brookes-backed-spaceship-acquired-in-80m-deal-20240926-p5kdo9"
        rel="noopener noreferrer"
        target="_blank"
      >
        acquired
      </a>{" "}
      by eToro); contracted for many clients through{" "}
      <a
        href="https://campaignbrief.com/timberland-launches-new-timbstrails-immersive-digital-storytelling-experience-via-r-ga-australia/"
        rel="noopener noreferrer"
        target="_blank"
      >
        R/GA
      </a>{" "}
      and a handful of other roles you can read about on my{" "}
      <a
        href="https://www.linkedin.com/in/haydenbleasel/"
        rel="noopener noreferrer"
        target="_blank"
      >
        LinkedIn
      </a>
      . I&apos;ve also been fortunate to work with many great companies such as
      Australian Ethical, Canva, Clipchamp, Google, National Geographic, Nike,
      R/GA, Timberland, Toyota, Westfield and many more. I{" "}
      <a
        href="https://eslint.org/blog/2022/08/redesigning-eslint/"
        rel="noopener noreferrer"
        target="_blank"
      >
        rebranded ESLint
      </a>{" "}
      and redesigned the{" "}
      <a
        href="https://nodejs.org/en/blog/announcements/diving-into-the-nodejs-website-redesign/"
        rel="noopener noreferrer"
        target="_blank"
      >
        Node.js website
      </a>
      .
    </p>
  </div>
);
