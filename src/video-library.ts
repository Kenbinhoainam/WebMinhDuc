import heroAssets from './hero-assets.json';
import type {Translation} from './i18n';

export type LibraryVideo = {
  id: string;
  kind: 'full' | 'excerpt' | 'photo';
  title: Translation;
  description: Translation;
  src: string;
  poster: string;
  thumbnail: {small: string; large: string};
  duration: number;
  webm?: string;
};

// The full film and its three excerpts come from the client-supplied “Giới thiệu doanh nghiệp Minh Đức Vina. 2026.mp4”.
// Source SHA-256 and full-film encoding details are recorded in docs/flagship/minhduc-media-v14.md.
// Times below refer to the original 30 fps film. Each excerpt retains the corresponding source audio.
const videos: readonly Omit<LibraryVideo,'thumbnail'>[] = [
  {
    id: 'company-film',
    kind: 'full',
    title: {
      vi: 'Phim giới thiệu Minh Đức Vina',
      en: 'Minh Đức Vina company film',
      zh: 'Minh Đức Vina 企业介绍影片',
      ko: 'Minh Đức Vina 회사 소개 영상',
      ja: 'Minh Đức Vina 会社紹介映像',
    },
    description: {
      vi: 'Tìm hiểu Minh Đức Vina qua hình ảnh đội ngũ, các văn phòng và những buổi gặp gỡ người lao động.',
      en: 'Meet Minh Đức Vina through scenes of its team, offices and gatherings with workers.',
      zh: '通过团队、办公室以及与劳动者见面的画面，了解 Minh Đức Vina。',
      ko: '팀과 사무실, 근로자들과의 만남을 통해 Minh Đức Vina를 소개합니다.',
      ja: '社員やオフィスの様子、働く方々との交流を通して、Minh Đức Vina を紹介します。',
    },
    src: heroAssets.video,
    webm: heroAssets.webm,
    poster: heroAssets.poster,
    duration: 132.133333,
  },
  {
    // Source 00:21–00:39. Poster at 00:24.8.
    id: 'leadership',
    kind: 'excerpt',
    title: {
      vi: 'Ban lãnh đạo và quản lý các chi nhánh',
      en: 'Company and branch leadership',
      zh: '公司及分支机构负责人',
      ko: '회사와 지사를 이끄는 사람들',
      ja: '会社と各拠点の責任者',
    },
    description: {
      vi: 'Phim giới thiệu từng gương mặt cùng chức danh của họ tại công ty và các chi nhánh.',
      en: 'Portraits introduce the people leading the company and its branches, with their names and roles.',
      zh: '通过姓名、职务和肖像，认识公司及分支机构的负责人。',
      ko: '인물 사진과 이름, 직책을 통해 회사와 지사의 책임자를 소개합니다.',
      ja: '名前と役職を添えたポートレートで、本社と各拠点の責任者を紹介します。',
    },
    src: '/WebMinhDuc/assets/video-library/leadership.mp4',
    poster: '/WebMinhDuc/assets/video-library/leadership.webp',
    duration: 18,
  },
  {
    // Source 00:58–01:10. Poster at 01:02.3.
    id: 'office-meeting',
    kind: 'excerpt',
    title: {
      vi: 'Một buổi làm việc tại văn phòng',
      en: 'A working session at the office',
      zh: '办公室里的一次工作会议',
      ko: '사무실에서 열린 업무 회의',
      ja: 'オフィスでの打ち合わせ',
    },
    description: {
      vi: 'Các thành viên cùng xem tài liệu, ghi chép và trao đổi quanh bàn họp tại văn phòng Minh Đức Vina.',
      en: 'Team members review documents, take notes and talk around the meeting table at Minh Đức Vina.',
      zh: '团队成员在 Minh Đức Vina 办公室围坐一桌，查看资料、做笔记并交流。',
      ko: 'Minh Đức Vina 직원들이 회의 테이블에 둘러앉아 자료를 살펴보고 메모하며 의견을 나눕니다.',
      ja: 'Minh Đức Vina の社員がテーブルを囲み、資料を確認しながらメモを取り、意見を交わします。',
    },
    src: '/WebMinhDuc/assets/video-library/office-meeting.mp4',
    poster: '/WebMinhDuc/assets/video-library/office-meeting.webp',
    duration: 12,
  },
  {
    // Source 01:11–01:27. Poster at 01:16.8.
    id: 'worker-gatherings',
    kind: 'excerpt',
    title: {
      vi: 'Gặp gỡ người lao động',
      en: 'Meeting workers',
      zh: '与劳动者见面',
      ko: '근로자들과의 만남',
      ja: '働く方々との交流',
    },
    description: {
      vi: 'Những cuộc gặp trước văn phòng, tại hội trường và ngoài trời cùng người lao động.',
      en: 'Meetings with workers outside the office, in a meeting hall and outdoors.',
      zh: '记录在办公室门前、会场和户外与劳动者见面的场景。',
      ko: '사무실 앞과 행사장, 야외에서 근로자들을 만나는 모습입니다.',
      ja: 'オフィスの前や会場、屋外で働く方々と会う様子を収めています。',
    },
    src: '/WebMinhDuc/assets/video-library/worker-gatherings.mp4',
    poster: '/WebMinhDuc/assets/video-library/worker-gatherings.webp',
    duration: 16,
  },
  {
    // Five audited Minh Đức photographs, in playback order. See v18/media.json and v16-media.json
    // in docs/flagship for original-source records. Each still is shown for 5 s with 0.5 s dissolves.
    // v18/field-team → v16/recruitment-event → v16/community → v16/culture-birthday → v16/team-yearend.
    // No original sound accompanies the photographs. The poster is the opening frame.
    id: 'team-photo-story',
    kind: 'photo',
    title: {
      vi: 'Nhịp làm việc và những dịp sum họp',
      en: 'Working days and team celebrations',
      zh: '工作日常与团队欢聚',
      ko: '일터에서 함께한 시간과 팀 모임',
      ja: '仕事の日々と仲間の集い',
    },
    description: {
      vi: 'Năm bức ảnh theo chân đội ngũ từ hiện trường, hội trường đến hoạt động cộng đồng, buổi sinh nhật và tiệc tất niên. Phim không lời.',
      en: 'Five photographs follow the team from fieldwork and a meeting hall to a community activity, a birthday and a year-end gathering. A silent film.',
      zh: '五张照片记录团队在工作现场、会场、社区活动、生日会和年终聚会的身影。本片无声。',
      ko: '현장과 행사장, 지역사회 활동, 생일 모임과 송년회에서 함께한 팀의 모습을 다섯 장의 사진에 담았습니다. 무음 영상입니다.',
      ja: '現場や会場での仕事、地域活動、誕生日会、年末の集まりを、5枚の写真でたどります。音声はありません。',
    },
    src: '/WebMinhDuc/assets/video-library/team-photo-story.mp4',
    poster: '/WebMinhDuc/assets/video-library/team-photo-story.webp',
    duration: 23,
  },
];

export const videoLibrary: readonly LibraryVideo[] = videos.map(video => {
  const path = '/WebMinhDuc/assets/video-library/thumbs/' + video.id;
  return {...video, thumbnail:{small:path + '-160.webp', large:path + '-320.webp'}};
});
