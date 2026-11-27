/** Lightweight editorial registry for navigation, search, cards and metadata. */
export type EditorialImageData = {
  src: string;
  alt: string;
  orientation?: 'portrait';
  caption?: string;
};
export type ArticleTable = {
  caption: string;
  headers: [string, string];
  rows: [string, string][];
};
export type ArticleSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  ordered?: boolean;
  table?: ArticleTable;
  images?: (EditorialImageData & {caption: string})[];
};
export type ArticleSummary = {
  slug: string;
  title: string;
  category: 'Dành cho người lao động' | 'Dành cho doanh nghiệp' | 'Góc nhân sự';
  image?: EditorialImageData;
  date: string;
  excerpt: string;
  seo?: {title: string; description: string};
};
export type Article = ArticleSummary & {sections: ArticleSection[]};
export const articles: ArticleSummary[] = [
  {
    "slug": "doc-thong-tin-thu-nhap-va-ca-lam",
    "title": "Đọc tin tuyển dụng: tách rõ thu nhập, phụ cấp và ca làm",
    "category": "Dành cho người lao động",
    "date": "2026-11-27",
    "excerpt": "Biến một con số thu nhập hấp dẫn thành những câu hỏi có thể kiểm chứng trước khi chọn việc.",
    "image": {
      "src": "/WebMinhDuc/assets/minhduc-working-60s.webp",
      "alt": "Nhân viên Minh Đức xem tài liệu cùng nhau tại bàn làm việc",
      "caption": "Tài liệu là điểm bắt đầu để các bên cùng kiểm tra thông tin."
    }
  },
  {
    "slug": "nhung-dip-gap-nhau-cua-nguoi-minh-duc",
    "title": "Những dịp gặp nhau của người Minh Đức",
    "category": "Góc nhân sự",
    "date": "2026-11-27",
    "excerpt": "Một chiếc bánh sinh nhật, những hộp quà cuối năm và một buổi cầm chổi ngoài sân. Bộ ảnh tư liệu ghi lại ba dịp đồng nghiệp Minh Đức Vina ở bên nhau.",
    "image": {
      "src": "/WebMinhDuc/assets/minhduc-v16/team-yearend.webp",
      "alt": "Tập thể Minh Đức Vina chụp ảnh trước phông sân khấu tiệc tất niên.",
      "caption": "Khoảnh khắc chụp ảnh chung trong buổi tất niên của Minh Đức Vina."
    }
  },
  {
    "slug": "phong-van-nha-may-lan-dau",
    "title": "Phỏng vấn nhà máy lần đầu: chuẩn bị câu trả lời từ trải nghiệm thật",
    "category": "Dành cho người lao động",
    "date": "2026-11-26",
    "excerpt": "Không cần một bài giới thiệu cầu kỳ. Điều cần thiết là thông tin rõ, ví dụ thật và câu hỏi đúng.",
    "image": {
      "src": "/WebMinhDuc/assets/minhduc-v18/field-team.webp",
      "alt": "Các nhân viên Minh Đức trao đổi tại một điểm làm việc ngoài trời",
      "caption": "Ghi nhận hoạt động của đội ngũ Minh Đức tại hiện trường."
    }
  },
  {
    "slug": "chuan-bi-truoc-ngay-nhan-viec",
    "title": "Trước ngày nhận việc: một danh sách để bớt cập rập",
    "category": "Dành cho người lao động",
    "date": "2026-11-25",
    "excerpt": "Xác nhận đúng cổng vào, lịch hẹn và người liên hệ để tập trung vào việc làm quen công việc mới.",
    "image": {
      "src": "/WebMinhDuc/assets/minhduc-v18/field-team.webp",
      "alt": "Các nhân viên Minh Đức trao đổi tại một điểm làm việc ngoài trời",
      "caption": "Ghi nhận hoạt động của đội ngũ Minh Đức tại hiện trường."
    }
  },
  {
    "slug": "kiem-tra-cham-cong-va-bang-luong",
    "title": "Đối chiếu chấm công và bảng lương: bắt đầu từ dữ liệu nào?",
    "category": "Dành cho người lao động",
    "date": "2026-11-24",
    "excerpt": "Ghi chép theo ngày giúp bạn đặt câu hỏi rõ ràng khi số liệu công hoặc khoản thanh toán chưa khớp.",
    "image": {
      "src": "/WebMinhDuc/assets/minhduc-working-60s.webp",
      "alt": "Nhân viên Minh Đức xem tài liệu cùng nhau tại bàn làm việc",
      "caption": "Tài liệu là điểm bắt đầu để các bên cùng kiểm tra thông tin."
    }
  },
  {
    "slug": "ban-yeu-cau-nhan-luc-cho-nha-may",
    "title": "Một bản yêu cầu nhân lực đủ rõ để bắt đầu tìm nguồn",
    "category": "Dành cho doanh nghiệp",
    "date": "2026-11-23",
    "excerpt": "Gói nhu cầu vào một bản ngắn, có người xác nhận và cách cập nhật, thay vì nhiều tin nhắn rời rạc.",
    "image": {
      "src": "/WebMinhDuc/assets/minhduc-meeting-10s.webp",
      "alt": "Đội ngũ Minh Đức cùng trao đổi quanh bàn họp",
      "caption": "Hình ảnh trao đổi công việc của đội ngũ Minh Đức."
    }
  },
  {
    "slug": "theo-doi-pheu-tuyen-dung",
    "title": "Theo dõi tuyển dụng theo từng bước: nhìn đúng điểm đang tắc",
    "category": "Dành cho doanh nghiệp",
    "date": "2026-11-22",
    "excerpt": "Tách người quan tâm, lịch hẹn và người đến thực tế để tránh đánh giá chiến dịch chỉ bằng một tổng số.",
    "image": {
      "src": "/WebMinhDuc/assets/minhduc-working-60s.webp",
      "alt": "Nhân viên Minh Đức xem tài liệu cùng nhau tại bàn làm việc",
      "caption": "Tài liệu là điểm bắt đầu để các bên cùng kiểm tra thông tin."
    }
  },
  {
    "slug": "ban-giao-giua-tuyen-dung-va-san-xuat",
    "title": "Bàn giao từ tuyển dụng sang sản xuất: ai xác nhận điều gì?",
    "category": "Góc nhân sự",
    "date": "2026-11-21",
    "excerpt": "Một lần bàn giao có cấu trúc giúp thông tin ứng viên và yêu cầu công việc không bị đứt đoạn.",
    "image": {
      "src": "/WebMinhDuc/assets/minhduc-meeting-10s.webp",
      "alt": "Đội ngũ Minh Đức cùng trao đổi quanh bàn họp",
      "caption": "Hình ảnh trao đổi công việc của đội ngũ Minh Đức."
    }
  },
  {
    "slug": "phan-hoi-ung-vien-ro-rang",
    "title": "Phản hồi ứng viên rõ ràng khi kết quả chưa có hoặc lịch thay đổi",
    "category": "Góc nhân sự",
    "date": "2026-11-20",
    "excerpt": "Một tin nhắn ngắn vẫn có thể nêu đủ tình trạng, bước tiếp theo và mốc cập nhật, mà không hứa thay người quyết định."
  },
  {
    "slug": "ho-so-xin-viec",
    "title": "Chuẩn bị hồ sơ xin việc tại nhà máy: bắt đầu từ đâu?",
    "category": "Dành cho người lao động",
    "image": {
      "src": "/WebMinhDuc/assets/minhduc-v16/recruitment-field.webp",
      "alt": "Nhân viên Minh Đức cầm tài liệu trong buổi làm việc ngoài trời",
      "orientation": "portrait",
      "caption": "Ghi nhận hoạt động của đội ngũ Minh Đức tại hiện trường."
    },
    "date": "2026-11-12",
    "excerpt": "Một danh sách gọn gàng giúp bạn chuẩn bị hồ sơ và hỏi đúng thông tin trước ngày phỏng vấn.",
    "seo": {
      "title": "Chuẩn bị hồ sơ xin việc tại nhà máy",
      "description": "Cẩm nang Minh Đức: chuẩn bị hồ sơ xin việc tại nhà máy với những gợi ý thực tế cho hành trình việc làm."
    }
  },
  {
    "slug": "nhu-cau-tuyen-dung",
    "title": "Lập kế hoạch bổ sung lao động theo từng đợt sản xuất",
    "category": "Dành cho doanh nghiệp",
    "image": {
      "src": "/WebMinhDuc/assets/minhduc-working-60s.webp",
      "alt": "Đội ngũ Minh Đức trao đổi tài liệu tại bàn làm việc",
      "caption": "Tài liệu là điểm bắt đầu để các bên cùng kiểm tra thông tin."
    },
    "date": "2026-11-10",
    "excerpt": "Làm rõ nhu cầu từ đầu giúp các bên phối hợp nhất quán trong quá trình tìm nguồn và tiếp nhận.",
    "seo": {
      "title": "Lập kế hoạch bổ sung lao động",
      "description": "Cẩm nang Minh Đức: lập kế hoạch bổ sung lao động với những gợi ý thực tế cho hành trình việc làm."
    }
  },
  {
    "slug": "chon-cong-viec-phu-hop",
    "title": "Những câu hỏi nên làm rõ trước khi nhận việc",
    "category": "Dành cho người lao động",
    "image": {
      "src": "/WebMinhDuc/assets/minhduc-v18/field-team.webp",
      "alt": "Nhóm nhân viên Minh Đức trao đổi ngoài trời",
      "caption": "Ghi nhận hoạt động của đội ngũ Minh Đức tại hiện trường."
    },
    "date": "2026-11-08",
    "excerpt": "Hiểu rõ công việc, thời gian và thu nhập giúp bạn lựa chọn công việc phù hợp hơn.",
    "seo": {
      "title": "Những câu hỏi trước khi nhận việc",
      "description": "Cẩm nang Minh Đức: những câu hỏi trước khi nhận việc với những gợi ý thực tế cho hành trình việc làm."
    }
  },
  {
    "slug": "thong-tin-tuyen-dung-minh-bach",
    "title": "Thông tin tuyển dụng rõ ràng tạo nên kết nối tốt hơn",
    "category": "Góc nhân sự",
    "date": "2026-11-05",
    "excerpt": "Sự nhất quán giữa tin tuyển dụng, tư vấn và thực tế tiếp nhận giúp giảm hiểu nhầm.",
    "seo": {
      "title": "Thông tin tuyển dụng rõ ràng",
      "description": "Cẩm nang Minh Đức: thông tin tuyển dụng rõ ràng với những gợi ý thực tế cho hành trình việc làm."
    }
  },
  {
    "slug": "don-tiep-lao-dong-moi",
    "title": "Chuẩn bị ngày đầu làm việc cho người lao động mới",
    "category": "Dành cho doanh nghiệp",
    "image": {
      "src": "/WebMinhDuc/assets/minhduc-meeting-10s.webp",
      "alt": "Đội ngũ Minh Đức ngồi họp quanh bàn",
      "caption": "Hình ảnh trao đổi công việc của đội ngũ Minh Đức."
    },
    "date": "2026-11-02",
    "excerpt": "Từ lịch hẹn đến người hướng dẫn, những chi tiết nhỏ giúp ngày đầu diễn ra thuận lợi.",
    "seo": {
      "title": "Chuẩn bị ngày đầu làm việc",
      "description": "Cẩm nang Minh Đức: chuẩn bị ngày đầu làm việc với những gợi ý thực tế cho hành trình việc làm."
    }
  },
  {
    "slug": "an-toan-thong-tin-khi-tim-viec",
    "title": "Giữ an toàn thông tin cá nhân khi tìm việc trực tuyến",
    "category": "Góc nhân sự",
    "date": "2026-10-30",
    "excerpt": "Xác minh nguồn tin, bảo vệ giấy tờ và thận trọng trước những yêu cầu chưa rõ ràng.",
    "seo": {
      "title": "An toàn thông tin khi tìm việc",
      "description": "Cẩm nang Minh Đức: an toàn thông tin khi tìm việc với những gợi ý thực tế cho hành trình việc làm."
    }
  }
];

export const categories = [
  ['all', 'Tất cả'], ['workers', 'Dành cho người lao động'],
  ['employers', 'Dành cho doanh nghiệp'], ['hr', 'Góc nhân sự'],
] as const;
export const articleHref = (slug: string) => '/news/' + slug;
export const leadArticle = articles.find(article => article.slug === 'nhu-cau-tuyen-dung') ?? articles[0];
export const featuredArticles = articles.filter(article => ['don-tiep-lao-dong-moi', 'an-toan-thong-tin-khi-tim-viec'].includes(article.slug));
