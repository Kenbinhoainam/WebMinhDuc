export const navigation = [
  ["/", "Trang chủ"],
  ["/about-us", "Giới thiệu"],
  ["/services", "Dịch vụ"],
  ["/jobs", "Việc làm"],
  ["/careers", "Tuyển dụng nội bộ"],
  ["/news", "Tin tức"],
  ["/contact", "Liên hệ"],
];
export const subnavigation: Record<string, string[][]> = {
  "/about-us": [
    ["/about-us#profile", "Hồ sơ năng lực"],
    ["/about-us#history", "Quá trình hình thành và phát triển"],
    ["/about-us#partners", "Đối tác tiêu biểu"],
    ["/about-us#achievements", "Thành tựu và dấu ấn"],
  ],
  "/services": [
    ["/services/labor-supply", "Giới thiệu và cung ứng nhân lực"],
    ["/services/labor-leasing", "Cho thuê lao động"],
    ["/services/recruitment", "Headhunt - lao động có tay nghề"],
    [
      "/services/college-admissions",
      "Chương trình tuyển sinh cho các trường cao đẳng đại học",
    ],
    [
      "/services/hr-consulting",
      "Setup cơ cấu tổ chức và phần mềm cho doanh nghiệp",
    ],
  ],
  "/jobs": [
    [
      "/jobs?skillLevel=Ph%E1%BB%95%20th%C3%B4ng#job-listings",
      "Lao động phổ thông",
    ],
    [
      "/jobs?skillLevel=Tay%20ngh%E1%BB%81#job-listings",
      "Lao động có tay nghề",
    ],
    ["/education", "Tuyển sinh"],
  ],
  "/news": [
    ["/news?category=workers#news-listings", "Thông tin về lao động"],
    ["/events", "Hoạt động của Minh Đức Vina"],
  ],
};
// Parent styling follows its child destinations without claiming the parent is the current page.
export function sectionHasChild(url: string, pathname: string) {
  const isEducation = pathname === '/education' || pathname.startsWith('/education/');
  if (isEducation) return url === '/services';
  return (subnavigation[url] || []).some(([to]) => {
    const path = to.split(/[?#]/, 1)[0];
    return (
      path !== url && (pathname === path || pathname.startsWith(`${path}/`))
    );
  });
}
