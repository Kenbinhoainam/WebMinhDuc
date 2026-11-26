// src/i18n.tsx
import { createContext, useContext, useEffect as useEffect2, useId, useRef as useRef2, useState as useState2 } from "react";
import { useLocation } from "react-router-dom";

// src/i18n-runtime/jsx-runtime.tsx
import { jsx as reactJsx, jsxs as reactJsxs, Fragment } from "react/jsx-runtime";
import { Link, NavLink } from "react-router-dom";

// src/i18n-runtime/catalog.ts
var catalogs = {};
function lookup(locale, key, kind = "merged") {
  return catalogs[locale]?.[kind][key];
}

// src/i18n-runtime/jsx-runtime.tsx
import { useEffect, useImperativeHandle, useRef, useState } from "react";

// src/media-manifest.json
var media_manifest_default = {
  "/assets/hero-poster.jpg": {
    width: 1920,
    height: 1080,
    variants: [
      {
        width: 480,
        src: "/optimized/assets/hero-poster-480.webp"
      },
      {
        width: 960,
        src: "/optimized/assets/hero-poster-960.webp"
      },
      {
        width: 1600,
        src: "/optimized/assets/hero-poster-1600.webp"
      }
    ]
  },
  "/assets/minh-duc-logo.jpg": {
    width: 1182,
    height: 1182,
    variants: [
      {
        width: 96,
        src: "/optimized/assets/minh-duc-logo-96.webp"
      },
      {
        width: 192,
        src: "/optimized/assets/minh-duc-logo-192.webp"
      },
      {
        width: 288,
        src: "/optimized/assets/minh-duc-logo-288.webp"
      }
    ]
  },
  "/mirror/www.hr2b.com/wp-content/uploads/2025/08/khung-luong-canh-tranh.jpg": {
    width: 1200,
    height: 628,
    variants: [
      {
        width: 480,
        src: "/optimized/mirror/www.hr2b.com/wp-content/uploads/2025/08/khung-luong-canh-tranh-480.webp"
      },
      {
        width: 960,
        src: "/optimized/mirror/www.hr2b.com/wp-content/uploads/2025/08/khung-luong-canh-tranh-960.webp"
      },
      {
        width: 1200,
        src: "/optimized/mirror/www.hr2b.com/wp-content/uploads/2025/08/khung-luong-canh-tranh-1200.webp"
      }
    ]
  },
  "/mirror/www.hr2b.com/wp-content/uploads/2025/08/staffing-logictis-1.jpg": {
    width: 1200,
    height: 628,
    variants: [
      {
        width: 480,
        src: "/optimized/mirror/www.hr2b.com/wp-content/uploads/2025/08/staffing-logictis-1-480.webp"
      },
      {
        width: 960,
        src: "/optimized/mirror/www.hr2b.com/wp-content/uploads/2025/08/staffing-logictis-1-960.webp"
      },
      {
        width: 1200,
        src: "/optimized/mirror/www.hr2b.com/wp-content/uploads/2025/08/staffing-logictis-1-1200.webp"
      }
    ]
  },
  "/mirror/www.hr2b.com/wp-content/uploads/2025/09/Co-hoi-viec-lam-scaled.jpg": {
    width: 2560,
    height: 1440,
    variants: [
      {
        width: 480,
        src: "/optimized/mirror/www.hr2b.com/wp-content/uploads/2025/09/Co-hoi-viec-lam-scaled-480.webp"
      },
      {
        width: 960,
        src: "/optimized/mirror/www.hr2b.com/wp-content/uploads/2025/09/Co-hoi-viec-lam-scaled-960.webp"
      },
      {
        width: 1600,
        src: "/optimized/mirror/www.hr2b.com/wp-content/uploads/2025/09/Co-hoi-viec-lam-scaled-1600.webp"
      }
    ]
  },
  "/mirror/www.hr2b.com/wp-content/uploads/2025/09/GPNS-1.jpg": {
    width: 1114,
    height: 1280,
    variants: [
      {
        width: 480,
        src: "/optimized/mirror/www.hr2b.com/wp-content/uploads/2025/09/GPNS-1-480.webp"
      },
      {
        width: 960,
        src: "/optimized/mirror/www.hr2b.com/wp-content/uploads/2025/09/GPNS-1-960.webp"
      },
      {
        width: 1114,
        src: "/optimized/mirror/www.hr2b.com/wp-content/uploads/2025/09/GPNS-1-1114.webp"
      }
    ]
  },
  "/mirror/www.hr2b.com/wp-content/uploads/2025/09/GPNS-2.jpg": {
    width: 1114,
    height: 1280,
    variants: [
      {
        width: 480,
        src: "/optimized/mirror/www.hr2b.com/wp-content/uploads/2025/09/GPNS-2-480.webp"
      },
      {
        width: 960,
        src: "/optimized/mirror/www.hr2b.com/wp-content/uploads/2025/09/GPNS-2-960.webp"
      },
      {
        width: 1114,
        src: "/optimized/mirror/www.hr2b.com/wp-content/uploads/2025/09/GPNS-2-1114.webp"
      }
    ]
  },
  "/mirror/www.hr2b.com/wp-content/uploads/2025/09/GPNS-3.jpg": {
    width: 1114,
    height: 1280,
    variants: [
      {
        width: 480,
        src: "/optimized/mirror/www.hr2b.com/wp-content/uploads/2025/09/GPNS-3-480.webp"
      },
      {
        width: 960,
        src: "/optimized/mirror/www.hr2b.com/wp-content/uploads/2025/09/GPNS-3-960.webp"
      },
      {
        width: 1114,
        src: "/optimized/mirror/www.hr2b.com/wp-content/uploads/2025/09/GPNS-3-1114.webp"
      }
    ]
  },
  "/mirror/www.hr2b.com/wp-content/uploads/2025/09/Lien-he.jpg": {
    width: 2048,
    height: 1127,
    variants: [
      {
        width: 480,
        src: "/optimized/mirror/www.hr2b.com/wp-content/uploads/2025/09/Lien-he-480.webp"
      },
      {
        width: 960,
        src: "/optimized/mirror/www.hr2b.com/wp-content/uploads/2025/09/Lien-he-960.webp"
      },
      {
        width: 1600,
        src: "/optimized/mirror/www.hr2b.com/wp-content/uploads/2025/09/Lien-he-1600.webp"
      }
    ]
  },
  "/mirror/www.hr2b.com/wp-content/uploads/2025/09/Staff-oursourcing.jpg": {
    width: 2121,
    height: 1245,
    variants: [
      {
        width: 480,
        src: "/optimized/mirror/www.hr2b.com/wp-content/uploads/2025/09/Staff-oursourcing-480.webp"
      },
      {
        width: 960,
        src: "/optimized/mirror/www.hr2b.com/wp-content/uploads/2025/09/Staff-oursourcing-960.webp"
      },
      {
        width: 1600,
        src: "/optimized/mirror/www.hr2b.com/wp-content/uploads/2025/09/Staff-oursourcing-1600.webp"
      }
    ]
  },
  "/mirror/www.hr2b.com/wp-content/uploads/2025/09/Tin-tuc.jpg": {
    width: 1920,
    height: 1440,
    variants: [
      {
        width: 480,
        src: "/optimized/mirror/www.hr2b.com/wp-content/uploads/2025/09/Tin-tuc-480.webp"
      },
      {
        width: 960,
        src: "/optimized/mirror/www.hr2b.com/wp-content/uploads/2025/09/Tin-tuc-960.webp"
      },
      {
        width: 1600,
        src: "/optimized/mirror/www.hr2b.com/wp-content/uploads/2025/09/Tin-tuc-1600.webp"
      }
    ]
  },
  "/mirror/www.hr2b.com/wp-content/uploads/2025/10/Executive-Search-banner.jpg": {
    width: 2203,
    height: 1361,
    variants: [
      {
        width: 480,
        src: "/optimized/mirror/www.hr2b.com/wp-content/uploads/2025/10/Executive-Search-banner-480.webp"
      },
      {
        width: 960,
        src: "/optimized/mirror/www.hr2b.com/wp-content/uploads/2025/10/Executive-Search-banner-960.webp"
      },
      {
        width: 1600,
        src: "/optimized/mirror/www.hr2b.com/wp-content/uploads/2025/10/Executive-Search-banner-1600.webp"
      }
    ]
  },
  "/mirror/www.hr2b.com/wp-content/uploads/2025/10/HR2B-2-1.png": {
    width: 1180,
    height: 1185,
    variants: [
      {
        width: 480,
        src: "/optimized/mirror/www.hr2b.com/wp-content/uploads/2025/10/HR2B-2-1-480.webp"
      },
      {
        width: 960,
        src: "/optimized/mirror/www.hr2b.com/wp-content/uploads/2025/10/HR2B-2-1-960.webp"
      },
      {
        width: 1180,
        src: "/optimized/mirror/www.hr2b.com/wp-content/uploads/2025/10/HR2B-2-1-1180.webp"
      }
    ]
  },
  "/mirror/www.hr2b.com/wp-content/uploads/2025/10/about-banner.jpg": {
    width: 2048,
    height: 1364,
    variants: [
      {
        width: 480,
        src: "/optimized/mirror/www.hr2b.com/wp-content/uploads/2025/10/about-banner-480.webp"
      },
      {
        width: 960,
        src: "/optimized/mirror/www.hr2b.com/wp-content/uploads/2025/10/about-banner-960.webp"
      },
      {
        width: 1600,
        src: "/optimized/mirror/www.hr2b.com/wp-content/uploads/2025/10/about-banner-1600.webp"
      }
    ]
  },
  "/mirror/www.hr2b.com/wp-content/uploads/2026/11/bao-mat-thong-tin-tien-luong.jpg": {
    width: 840,
    height: 480,
    variants: [
      {
        width: 480,
        src: "/optimized/mirror/www.hr2b.com/wp-content/uploads/2026/11/bao-mat-thong-tin-tien-luong-480.webp"
      },
      {
        width: 840,
        src: "/optimized/mirror/www.hr2b.com/wp-content/uploads/2026/11/bao-mat-thong-tin-tien-luong-840.webp"
      }
    ]
  },
  "/assets/minh-duc-about.webp": {
    width: 960,
    height: 960,
    variants: [
      {
        width: 480,
        src: "/optimized/assets/minh-duc-about-480.webp"
      },
      {
        width: 960,
        src: "/optimized/assets/minh-duc-about-960.webp"
      }
    ]
  },
  "/mirror/www.hr2b.com/wp-content/uploads/2025/09/carrer-2.jpg": {
    width: 1432,
    height: 728,
    variants: [
      {
        width: 480,
        src: "/optimized/mirror/www.hr2b.com/wp-content/uploads/2025/09/carrer-2-480.webp"
      },
      {
        width: 960,
        src: "/optimized/mirror/www.hr2b.com/wp-content/uploads/2025/09/carrer-2-960.webp"
      },
      {
        width: 1432,
        src: "/optimized/mirror/www.hr2b.com/wp-content/uploads/2025/09/carrer-2-1432.webp"
      }
    ]
  },
  "/mirror/www.hr2b.com/wp-content/uploads/2025/09/carrer-7.jpg": {
    width: 708,
    height: 548,
    variants: [
      {
        width: 480,
        src: "/optimized/mirror/www.hr2b.com/wp-content/uploads/2025/09/carrer-7-480.webp"
      },
      {
        width: 708,
        src: "/optimized/mirror/www.hr2b.com/wp-content/uploads/2025/09/carrer-7-708.webp"
      }
    ]
  },
  "/mirror/www.hr2b.com/wp-content/uploads/2025/10/HR2B-Careers-banner.jpg": {
    width: 2121,
    height: 1414,
    variants: [
      {
        width: 480,
        src: "/optimized/mirror/www.hr2b.com/wp-content/uploads/2025/10/HR2B-Careers-banner-480.webp"
      },
      {
        width: 960,
        src: "/optimized/mirror/www.hr2b.com/wp-content/uploads/2025/10/HR2B-Careers-banner-960.webp"
      },
      {
        width: 1600,
        src: "/optimized/mirror/www.hr2b.com/wp-content/uploads/2025/10/HR2B-Careers-banner-1600.webp"
      }
    ]
  },
  "/mirror/www.hr2b.com/wp-content/uploads/2026/03/3b0086c1a42d03735a3c40.webp": {
    width: 2560,
    height: 1555,
    variants: [
      {
        width: 480,
        src: "/optimized/mirror/www.hr2b.com/wp-content/uploads/2026/03/3b0086c1a42d03735a3c40-480.webp"
      },
      {
        width: 960,
        src: "/optimized/mirror/www.hr2b.com/wp-content/uploads/2026/03/3b0086c1a42d03735a3c40-960.webp"
      },
      {
        width: 1600,
        src: "/optimized/mirror/www.hr2b.com/wp-content/uploads/2026/03/3b0086c1a42d03735a3c40-1600.webp"
      }
    ]
  },
  "/mirror/www.hr2b.com/wp-content/uploads/2026/03/527e361144089156c819-Copy-scaled-1.webp": {
    width: 2560,
    height: 1920,
    variants: [
      {
        width: 480,
        src: "/optimized/mirror/www.hr2b.com/wp-content/uploads/2026/03/527e361144089156c819-Copy-scaled-1-480.webp"
      },
      {
        width: 960,
        src: "/optimized/mirror/www.hr2b.com/wp-content/uploads/2026/03/527e361144089156c819-Copy-scaled-1-960.webp"
      },
      {
        width: 1600,
        src: "/optimized/mirror/www.hr2b.com/wp-content/uploads/2026/03/527e361144089156c819-Copy-scaled-1-1600.webp"
      }
    ]
  },
  "/mirror/www.hr2b.com/wp-content/uploads/2026/03/8a378a5d89b102ef5ba0-1.webp": {
    width: 2224,
    height: 1668,
    variants: [
      {
        width: 480,
        src: "/optimized/mirror/www.hr2b.com/wp-content/uploads/2026/03/8a378a5d89b102ef5ba0-1-480.webp"
      },
      {
        width: 960,
        src: "/optimized/mirror/www.hr2b.com/wp-content/uploads/2026/03/8a378a5d89b102ef5ba0-1-960.webp"
      },
      {
        width: 1600,
        src: "/optimized/mirror/www.hr2b.com/wp-content/uploads/2026/03/8a378a5d89b102ef5ba0-1-1600.webp"
      }
    ]
  },
  "/mirror/www.hr2b.com/wp-content/uploads/2026/03/9da65dca662ec170983f4-1.webp": {
    width: 2556,
    height: 1916,
    variants: [
      {
        width: 480,
        src: "/optimized/mirror/www.hr2b.com/wp-content/uploads/2026/03/9da65dca662ec170983f4-1-480.webp"
      },
      {
        width: 960,
        src: "/optimized/mirror/www.hr2b.com/wp-content/uploads/2026/03/9da65dca662ec170983f4-1-960.webp"
      },
      {
        width: 1600,
        src: "/optimized/mirror/www.hr2b.com/wp-content/uploads/2026/03/9da65dca662ec170983f4-1-1600.webp"
      }
    ]
  },
  "/mirror/www.hr2b.com/wp-content/uploads/2026/03/carrer-5.webp": {
    width: 708,
    height: 548,
    variants: [
      {
        width: 480,
        src: "/optimized/mirror/www.hr2b.com/wp-content/uploads/2026/03/carrer-5-480.webp"
      },
      {
        width: 708,
        src: "/optimized/mirror/www.hr2b.com/wp-content/uploads/2026/03/carrer-5-708.webp"
      }
    ]
  },
  "/mirror/www.hr2b.com/wp-content/uploads/2026/03/carrer-6.webp": {
    width: 708,
    height: 548,
    variants: [
      {
        width: 480,
        src: "/optimized/mirror/www.hr2b.com/wp-content/uploads/2026/03/carrer-6-480.webp"
      },
      {
        width: 708,
        src: "/optimized/mirror/www.hr2b.com/wp-content/uploads/2026/03/carrer-6-708.webp"
      }
    ]
  },
  "/mirror/www.hr2b.com/wp-content/uploads/2026/03/carrer-9.webp": {
    width: 708,
    height: 548,
    variants: [
      {
        width: 480,
        src: "/optimized/mirror/www.hr2b.com/wp-content/uploads/2026/03/carrer-9-480.webp"
      },
      {
        width: 708,
        src: "/optimized/mirror/www.hr2b.com/wp-content/uploads/2026/03/carrer-9-708.webp"
      }
    ]
  },
  "/mirror/www.hr2b.com/wp-content/uploads/2026/03/office3@2x-1.webp": {
    width: 1600,
    height: 1e3,
    variants: [
      {
        width: 480,
        src: "/optimized/mirror/www.hr2b.com/wp-content/uploads/2026/03/office3@2x-1-480.webp"
      },
      {
        width: 960,
        src: "/optimized/mirror/www.hr2b.com/wp-content/uploads/2026/03/office3@2x-1-960.webp"
      },
      {
        width: 1600,
        src: "/optimized/mirror/www.hr2b.com/wp-content/uploads/2026/03/office3@2x-1-1600.webp"
      }
    ]
  },
  "/mirror/www.hr2b.com/wp-content/uploads/2026/04/buddy-2.png": {
    width: 1213,
    height: 628,
    variants: [
      {
        width: 480,
        src: "/optimized/mirror/www.hr2b.com/wp-content/uploads/2026/04/buddy-2-480.webp"
      },
      {
        width: 960,
        src: "/optimized/mirror/www.hr2b.com/wp-content/uploads/2026/04/buddy-2-960.webp"
      },
      {
        width: 1213,
        src: "/optimized/mirror/www.hr2b.com/wp-content/uploads/2026/04/buddy-2-1213.webp"
      }
    ]
  },
  "/mirror/www.hr2b.com/wp-content/uploads/2026/09/1788597214879_7428492010007057447_g8267310010752724363_f3c3800b0d2cbaaa1e0696a2df8d0d13.jpg": {
    width: 2560,
    height: 1920,
    variants: [
      {
        width: 480,
        src: "/optimized/mirror/www.hr2b.com/wp-content/uploads/2026/09/1788597214879_7428492010007057447_g8267310010752724363_f3c3800b0d2cbaaa1e0696a2df8d0d13-480.webp"
      },
      {
        width: 960,
        src: "/optimized/mirror/www.hr2b.com/wp-content/uploads/2026/09/1788597214879_7428492010007057447_g8267310010752724363_f3c3800b0d2cbaaa1e0696a2df8d0d13-960.webp"
      },
      {
        width: 1600,
        src: "/optimized/mirror/www.hr2b.com/wp-content/uploads/2026/09/1788597214879_7428492010007057447_g8267310010752724363_f3c3800b0d2cbaaa1e0696a2df8d0d13-1600.webp"
      }
    ]
  },
  "/mirror/www.hr2b.com/wp-content/uploads/2026/09/1788599249654_8201555599254488289_g8680945066893583432_0191b3144d58edba41f107318209623a.jpg": {
    width: 2560,
    height: 1920,
    variants: [
      {
        width: 480,
        src: "/optimized/mirror/www.hr2b.com/wp-content/uploads/2026/09/1788599249654_8201555599254488289_g8680945066893583432_0191b3144d58edba41f107318209623a-480.webp"
      },
      {
        width: 960,
        src: "/optimized/mirror/www.hr2b.com/wp-content/uploads/2026/09/1788599249654_8201555599254488289_g8680945066893583432_0191b3144d58edba41f107318209623a-960.webp"
      },
      {
        width: 1600,
        src: "/optimized/mirror/www.hr2b.com/wp-content/uploads/2026/09/1788599249654_8201555599254488289_g8680945066893583432_0191b3144d58edba41f107318209623a-1600.webp"
      }
    ]
  },
  "/assets/minhduc-v16/team-yearend.webp": {
    width: 7728,
    height: 5152,
    variants: [
      {
        width: 480,
        src: "/assets/minhduc-v16/team-yearend-480.webp"
      },
      {
        width: 960,
        src: "/assets/minhduc-v16/team-yearend-960.webp"
      },
      {
        width: 1600,
        src: "/assets/minhduc-v16/team-yearend.webp"
      }
    ]
  },
  "/assets/minhduc-v16/yearend-gifts.webp": {
    width: 7728,
    height: 5152,
    variants: [
      {
        width: 480,
        src: "/assets/minhduc-v16/yearend-gifts-480.webp"
      },
      {
        width: 960,
        src: "/assets/minhduc-v16/yearend-gifts-960.webp"
      },
      {
        width: 1600,
        src: "/assets/minhduc-v16/yearend-gifts.webp"
      }
    ]
  },
  "/assets/minhduc-v16/culture-birthday.webp": {
    width: 4e3,
    height: 1868,
    variants: [
      {
        width: 480,
        src: "/assets/minhduc-v16/culture-birthday-480.webp"
      },
      {
        width: 960,
        src: "/assets/minhduc-v16/culture-birthday-960.webp"
      },
      {
        width: 1600,
        src: "/assets/minhduc-v16/culture-birthday.webp"
      }
    ]
  },
  "/assets/minhduc-v16/recruitment-field.webp": {
    width: 3e3,
    height: 4e3,
    variants: [
      {
        width: 480,
        src: "/assets/minhduc-v16/recruitment-field-480.webp"
      },
      {
        width: 960,
        src: "/assets/minhduc-v16/recruitment-field-960.webp"
      },
      {
        width: 1600,
        src: "/assets/minhduc-v16/recruitment-field.webp"
      }
    ]
  },
  "/assets/minhduc-v16/recruitment-event.webp": {
    width: 2560,
    height: 1706,
    variants: [
      {
        width: 480,
        src: "/assets/minhduc-v16/recruitment-event-480.webp"
      },
      {
        width: 960,
        src: "/assets/minhduc-v16/recruitment-event-960.webp"
      },
      {
        width: 1600,
        src: "/assets/minhduc-v16/recruitment-event.webp"
      }
    ]
  },
  "/assets/minhduc-v16/community.webp": {
    width: 2560,
    height: 1920,
    variants: [
      {
        width: 480,
        src: "/assets/minhduc-v16/community-480.webp"
      },
      {
        width: 960,
        src: "/assets/minhduc-v16/community-960.webp"
      },
      {
        width: 1600,
        src: "/assets/minhduc-v16/community.webp"
      }
    ]
  },
  "/assets/minhduc-v18/industrial-campus.webp": {
    width: 1672,
    height: 941,
    variants: [
      {
        width: 480,
        src: "/assets/minhduc-v18/industrial-campus-480.webp"
      },
      {
        width: 960,
        src: "/assets/minhduc-v18/industrial-campus-960.webp"
      },
      {
        width: 1600,
        src: "/assets/minhduc-v18/industrial-campus.webp"
      }
    ]
  },
  "/assets/minhduc-v18/learning-space.webp": {
    width: 1672,
    height: 941,
    variants: [
      {
        width: 480,
        src: "/assets/minhduc-v18/learning-space-480.webp"
      },
      {
        width: 960,
        src: "/assets/minhduc-v18/learning-space-960.webp"
      },
      {
        width: 1600,
        src: "/assets/minhduc-v18/learning-space.webp"
      }
    ]
  },
  "/assets/minhduc-v18/about-team.webp": {
    width: 4e3,
    height: 1868,
    variants: [
      {
        width: 480,
        src: "/assets/minhduc-v18/about-team-480.webp"
      },
      {
        width: 960,
        src: "/assets/minhduc-v18/about-team-960.webp"
      },
      {
        width: 1600,
        src: "/assets/minhduc-v18/about-team.webp"
      }
    ]
  },
  "/assets/minhduc-v18/contact-team.webp": {
    width: 3e3,
    height: 4e3,
    variants: [
      {
        width: 480,
        src: "/assets/minhduc-v18/contact-team-480.webp"
      },
      {
        width: 960,
        src: "/assets/minhduc-v18/contact-team-960.webp"
      },
      {
        width: 1600,
        src: "/assets/minhduc-v18/contact-team.webp"
      }
    ]
  },
  "/assets/minhduc-v18/field-team.webp": {
    width: 3840,
    height: 2160,
    variants: [
      {
        width: 480,
        src: "/assets/minhduc-v18/field-team-480.webp"
      },
      {
        width: 960,
        src: "/assets/minhduc-v18/field-team-960.webp"
      },
      {
        width: 1600,
        src: "/assets/minhduc-v18/field-team.webp"
      }
    ]
  },
  "/assets/minhduc-v18/birthday-gifts.webp": {
    width: 4e3,
    height: 1868,
    variants: [
      {
        width: 480,
        src: "/assets/minhduc-v18/birthday-gifts-480.webp"
      },
      {
        width: 960,
        src: "/assets/minhduc-v18/birthday-gifts-960.webp"
      },
      {
        width: 1600,
        src: "/assets/minhduc-v18/birthday-gifts.webp"
      }
    ]
  },
  "/assets/minhduc-v18/red-gifts.webp": {
    width: 4e3,
    height: 1868,
    variants: [
      {
        width: 480,
        src: "/assets/minhduc-v18/red-gifts-480.webp"
      },
      {
        width: 960,
        src: "/assets/minhduc-v18/red-gifts-960.webp"
      },
      {
        width: 1600,
        src: "/assets/minhduc-v18/red-gifts.webp"
      }
    ]
  },
  "/assets/minhduc-v18/event-hall.webp": {
    width: 2560,
    height: 1920,
    variants: [
      {
        width: 480,
        src: "/assets/minhduc-v18/event-hall-480.webp"
      },
      {
        width: 960,
        src: "/assets/minhduc-v18/event-hall-960.webp"
      },
      {
        width: 1600,
        src: "/assets/minhduc-v18/event-hall.webp"
      }
    ]
  },
  "/assets/minhduc-meeting-10s.webp": {
    width: 1024,
    height: 576,
    variants: [
      {
        width: 240,
        src: "/optimized/assets/minhduc-meeting-10s-240.webp"
      },
      {
        width: 512,
        src: "/optimized/assets/minhduc-meeting-10s-512.webp"
      },
      {
        width: 1024,
        src: "/assets/minhduc-meeting-10s.webp"
      }
    ]
  },
  "/assets/minhduc-working-60s.webp": {
    width: 1024,
    height: 576,
    variants: [
      {
        width: 240,
        src: "/optimized/assets/minhduc-working-60s-240.webp"
      },
      {
        width: 512,
        src: "/optimized/assets/minhduc-working-60s-512.webp"
      },
      {
        width: 1024,
        src: "/assets/minhduc-working-60s.webp"
      }
    ]
  }
};

// src/media.ts
var images = media_manifest_default;
var originalsByVariant = /* @__PURE__ */ new Map();
for (const [original, image] of Object.entries(images)) {
  for (const variant of image.variants) originalsByVariant.set(variant.src, original);
}
function originalImageSource(src) {
  return originalsByVariant.get(src) ?? src;
}
function responsiveImage(src, sizes = "100vw") {
  const image = images[src];
  if (!image) return void 0;
  return { src: image.variants[image.variants.length - 1].src, srcSet: image.variants.map((v) => `${v.src} ${v.width}w`).join(", "), sizes, width: image.width, height: image.height };
}

// src/i18n-runtime/jsx-runtime.tsx
function translate(value, locale) {
  if (locale === "vi") return value;
  if (typeof value === "string") {
    const direct = lookup(locale, value);
    if (direct) return direct;
    const trimmed = value.trim(), translated = lookup(locale, trimmed);
    return translated ? value.replace(trimmed, translated) : value;
  }
  if (Array.isArray(value)) return value.map((item) => translate(item, locale));
  return value;
}
var translatedAttrs = ["aria-label", "aria-description", "placeholder", "title", "alt"];
function RecoverableImage({ properties, original }) {
  const [retryOriginal, setRetryOriginal] = useState(false);
  const image = useRef(null);
  const handled = useRef(null);
  useImperativeHandle(properties.ref, () => image.current, [retryOriginal]);
  function onError(event) {
    const node = event.currentTarget;
    if (handled.current === node) return;
    handled.current = node;
    const canRetry = !retryOriginal && (properties.srcSet || properties.src !== original);
    if (canRetry && (!node.currentSrc || node.currentSrc !== new URL(original, node.baseURI).href)) {
      setRetryOriginal(true);
      return;
    }
    properties.onError?.(event);
  }
  useEffect(() => {
    const node = image.current;
    if (node?.complete && !node.naturalWidth && node.src && handled.current !== node) {
      node.dispatchEvent(new Event("error"));
    }
  }, [retryOriginal]);
  return reactJsx("img", {
    ...properties,
    ...retryOriginal ? { src: original, srcSet: void 0, sizes: void 0 } : {},
    ref: image,
    onError
  }, retryOriginal ? "original" : "requested");
}
function Intrinsic({ element, properties, multiple }) {
  const locale = useLocale();
  const props = { ...properties };
  if (element === "img" && typeof props.src === "string") {
    const classes = String(props.className || "");
    const sizes = typeof props.sizes === "string" ? props.sizes : classes.includes("info-article-cover") ? "(max-width: 800px) calc(100vw - 40px), 720px" : classes.includes("info-rounded-photo") ? "(max-width: 800px) calc(100vw - 40px), 600px" : props.src.includes("minh-duc-logo") ? "90px" : "(max-width: 575px) calc(100vw - 36px), (max-width: 1023px) 50vw, 680px";
    const optimized = responsiveImage(props.src, sizes);
    if (optimized) {
      props.src = optimized.src;
      props.srcSet ??= optimized.srcSet;
      props.sizes ??= optimized.sizes;
      props.width ??= optimized.width;
      props.height ??= optimized.height;
      props.decoding ??= "async";
    }
  }
  if (element === "option" && props.value === void 0 && typeof props.children === "string") props.value = props.children;
  props.children = translate(props.children, locale);
  for (const attr of translatedAttrs) if (typeof props[attr] === "string") props[attr] = translate(props[attr], locale);
  if (element === "img" && typeof props.src === "string") {
    const original = originalImageSource(properties.src);
    if (props.srcSet || props.onError || original !== props.src) {
      return reactJsx(RecoverableImage, { properties: props, original }, JSON.stringify([original, props.src, props.srcSet]));
    }
  }
  return (multiple ? reactJsxs : reactJsx)(element, props);
}
function Component({ component, properties, multiple }) {
  const locale = useLocale();
  const props = { ...properties, children: translate(properties.children, locale) };
  for (const attr of translatedAttrs) if (typeof props[attr] === "string") props[attr] = translate(props[attr], locale);
  return (multiple ? reactJsxs : reactJsx)(component, props);
}
function make(factory, type, props, key) {
  return typeof type === "string" ? reactJsx(Intrinsic, { element: type, properties: props, multiple: factory === reactJsxs }, key) : type === Link || type === NavLink ? reactJsx(Component, { component: type, properties: props, multiple: factory === reactJsxs }, key) : factory(type, props, key);
}
var jsx = (type, props, key) => make(reactJsx, type, props, key);
var jsxs = (type, props, key) => make(reactJsxs, type, props, key);

// src/LocalFlag.tsx
function LocalFlag({ locale }) {
  const star = "50,17 54,30 68,30 57,38 61,52 50,44 39,52 43,38 32,30 46,30";
  return /* @__PURE__ */ jsxs("svg", { className: "locale-flag", viewBox: "0 0 100 60", "aria-hidden": "true", focusable: "false", children: [
    locale === "vi" && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("path", { fill: "#da251d", d: "M0 0h100v60H0z" }),
      /* @__PURE__ */ jsx("polygon", { fill: "#ffdf00", points: star })
    ] }),
    locale === "en" && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("path", { fill: "#012169", d: "M0 0h100v60H0z" }),
      /* @__PURE__ */ jsx("path", { d: "M0 0l100 60M100 0L0 60", stroke: "#fff", strokeWidth: "13" }),
      /* @__PURE__ */ jsx("path", { d: "M0 0l100 60M100 0L0 60", stroke: "#c8102e", strokeWidth: "5" }),
      /* @__PURE__ */ jsx("path", { d: "M50 0v60M0 30h100", stroke: "#fff", strokeWidth: "20" }),
      /* @__PURE__ */ jsx("path", { d: "M50 0v60M0 30h100", stroke: "#c8102e", strokeWidth: "11" })
    ] }),
    locale === "zh" && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("path", { fill: "#de2910", d: "M0 0h100v60H0z" }),
      /* @__PURE__ */ jsx("polygon", { fill: "#ffde00", points: "20,7 22.9,15.8 32.1,15.8 24.6,21.2 27.5,30 20,24.6 12.5,30 15.4,21.2 7.9,15.8 17.1,15.8" }),
      /* @__PURE__ */ jsxs("g", { fill: "#ffde00", children: [
        /* @__PURE__ */ jsx("polygon", { points: "40,5 41,8 44,8 41.5,10 42.5,13 40,11 37.5,13 38.5,10 36,8 39,8" }),
        /* @__PURE__ */ jsx("polygon", { points: "48,14 49,17 52,17 49.5,19 50.5,22 48,20 45.5,22 46.5,19 44,17 47,17" }),
        /* @__PURE__ */ jsx("polygon", { points: "48,26 49,29 52,29 49.5,31 50.5,34 48,32 45.5,34 46.5,31 44,29 47,29" }),
        /* @__PURE__ */ jsx("polygon", { points: "40,35 41,38 44,38 41.5,40 42.5,43 40,41 37.5,43 38.5,40 36,38 39,38" })
      ] })
    ] }),
    locale === "ko" && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("path", { fill: "#fff", d: "M0 0h100v60H0z" }),
      /* @__PURE__ */ jsx("circle", { cx: "50", cy: "30", r: "15", fill: "#cd2e3a" }),
      /* @__PURE__ */ jsx("path", { d: "M35 30a15 15 0 0 0 30 0c0-4.1-3.4-7.5-7.5-7.5S50 25.9 50 30s-3.4 7.5-7.5 7.5S35 34.1 35 30", fill: "#0047a0" }),
      /* @__PURE__ */ jsxs("g", { stroke: "#111", strokeWidth: "3", children: [
        /* @__PURE__ */ jsx("path", { d: "M15 13l10 7m-13-3l10 7m-13-3l10 7M75 40l10 7m-13-3l10 7m-13-3l10 7" }),
        /* @__PURE__ */ jsx("path", { d: "M75 20l4-3m2-1l4-3M72 24l10-7M69 28l4-3m2-1l4-3M15 47l4-3m2-1l4-3M12 51l4-3m2-1l4-3M9 55l4-3m2-1l4-3" })
      ] })
    ] }),
    locale === "ja" && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("path", { fill: "#fff", d: "M0 0h100v60H0z" }),
      /* @__PURE__ */ jsx("circle", { cx: "50", cy: "30", r: "18", fill: "#bc002d" })
    ] })
  ] });
}

// src/i18n.tsx
var locales = ["vi", "en", "zh", "ko", "ja"];
var localeNames = { vi: "Ti\u1EBFng Vi\u1EC7t", en: "English", zh: "\u7B80\u4F53\u4E2D\u6587", ko: "\uD55C\uAD6D\uC5B4", ja: "\u65E5\u672C\u8A9E" };
var localeCodes = { vi: "VI", en: "EN", zh: "ZH", ko: "KO", ja: "JA" };
var languageTags = { vi: "vi", en: "en", zh: "zh-Hans", ko: "ko", ja: "ja" };
function localeFromPath(pathname) {
  const segment = pathname.split("/")[1];
  return locales.includes(segment) && segment !== "vi" ? segment : "vi";
}
function localeBase(locale) {
  return locale === "vi" ? "" : `/${locale}`;
}
function stripLocale(pathname) {
  if (/^\/vi\/?$/.test(pathname)) return "/";
  const locale = localeFromPath(pathname);
  return locale === "vi" ? pathname : pathname.slice(localeBase(locale).length) || "/";
}
function localizedPath(pathname, locale) {
  const path = stripLocale(pathname);
  return `${localeBase(locale)}${path === "/" && locale !== "vi" ? "" : path}` || "/";
}
function languageSwitchUrl(pathname, search, hash, locale) {
  return localizedPath(pathname, locale) + search + hash;
}
var LocaleContext = createContext("vi");
var LocaleProvider = LocaleContext.Provider;
var useLocale = () => useContext(LocaleContext);
function useTranslation() {
  const locale = useLocale();
  return (text) => text[locale];
}
function LanguageSelector() {
  const locale = useLocale();
  const location = useLocation();
  const [open, setOpen] = useState2(false);
  const rootRef = useRef2(null);
  const triggerRef = useRef2(null);
  const panelId = useId();
  useEffect2(() => {
    if (!open) return;
    const outside = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    const escape = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    const otherOverlay = (event) => {
      const owner = event.detail?.owner;
      if (owner === "language") return;
      if (owner === "resize" && rootRef.current?.querySelector(".language-panel")?.contains(document.activeElement)) triggerRef.current?.focus();
      setOpen(false);
    };
    document.addEventListener("header-overlay-open", otherOverlay);
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("header-overlay-open", otherOverlay);
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);
  return /* @__PURE__ */ jsxs("div", { className: "language-selector", ref: rootRef, onBlur: (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
  }, children: [
    /* @__PURE__ */ jsxs("button", { ref: triggerRef, type: "button", className: "language-trigger", "data-locale": locale, "aria-label": `Language / Ng\xF4n ng\u1EEF: ${localeNames[locale]}`, "aria-expanded": open, "aria-controls": panelId, onClick: () => {
      if (!open) document.dispatchEvent(new window.CustomEvent("header-overlay-open", { detail: { owner: "language" } }));
      setOpen((value) => !value);
    }, children: [
      /* @__PURE__ */ jsx(LocalFlag, { locale }),
      /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: localeCodes[locale] }),
      /* @__PURE__ */ jsx("svg", { className: "language-chevron", viewBox: "0 0 16 16", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "m4 6 4 4 4-4", fill: "none", stroke: "currentColor", strokeWidth: "1.7", strokeLinecap: "round", strokeLinejoin: "round" }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { id: panelId, className: "language-panel", hidden: !open, children: [
      /* @__PURE__ */ jsx("p", { className: "language-panel-title", children: "Language / Ng\xF4n ng\u1EEF" }),
      /* @__PURE__ */ jsx("ul", { children: locales.map((code) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs("a", { href: languageSwitchUrl(location.pathname, location.search, location.hash, code), lang: languageTags[code], "aria-current": code === locale ? "true" : void 0, children: [
        /* @__PURE__ */ jsx(LocalFlag, { locale: code }),
        /* @__PURE__ */ jsx("span", { children: localeNames[code] }),
        code === locale && /* @__PURE__ */ jsx("svg", { className: "language-check", viewBox: "0 0 16 16", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "m3 8 3.2 3.2L13 4.5", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round" }) })
      ] }) }, code)) })
    ] })
  ] });
}
export {
  LanguageSelector,
  LocaleProvider,
  languageSwitchUrl,
  languageTags,
  localeBase,
  localeFromPath,
  localeNames,
  locales,
  localizedPath,
  stripLocale,
  useLocale,
  useTranslation
};
