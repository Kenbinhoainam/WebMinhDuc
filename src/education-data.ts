/** Prototype programs shared by page content and static route metadata. No UI imports. */
export const educationPrograms = [
  {
    slug: 'tu-xa-quan-tri', title: 'Quản trị kinh doanh', mode: 'Từ xa',
    description: 'Tìm hiểu kiến thức nền tảng về quản trị và vận hành kinh doanh.',
    detail: 'Hình thức học từ xa phù hợp với người muốn chủ động sắp xếp thời gian học. Nội dung, thời lượng và điều kiện tuyển sinh cần được xác nhận với đơn vị đào tạo.',
    seo: {
      title: 'Quản trị kinh doanh từ xa',
      description: 'Khám phá chương trình Quản trị kinh doanh từ xa và thử tư vấn hoặc đăng ký học.',
    },
  },
  {
    slug: 'chinh-quy-cong-nghe', title: 'Công nghệ kỹ thuật chính quy', mode: 'Chính quy',
    description: 'Khám phá kiến thức nền tảng về công nghệ và ứng dụng.',
    detail: 'Hình thức chính quy dành cho người quan tâm đến môi trường học tập tập trung. Lịch học, điều kiện và nội dung cụ thể cần được xác nhận với đơn vị đào tạo.',
    seo: {
      title: 'Công nghệ kỹ thuật chính quy',
      description: 'Tìm hiểu chương trình Công nghệ kỹ thuật chính quy trong bản minh họa tuyển sinh.',
    },
  },
  {
    slug: 'tu-xa-ke-toan', title: 'Kế toán', mode: 'Từ xa',
    description: 'Tìm hiểu kiến thức cơ bản về kế toán và nghiệp vụ doanh nghiệp.',
    detail: 'Chương trình minh họa hình thức học từ xa. Người học cần xác nhận chương trình, điều kiện và chi phí trước khi quyết định đăng ký.',
    seo: {
      title: 'Kế toán từ xa',
      description: 'Tìm hiểu chương trình Kế toán từ xa và trải nghiệm các bước chuẩn bị hồ sơ.',
    },
  },
] as const;
