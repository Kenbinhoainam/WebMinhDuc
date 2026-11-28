import {articles, type Article, type ArticleSection} from './editorial-data';

/** Long-form content is imported only by the lazy news reader/archive module. */
export const articleSections: Record<string, ArticleSection[]> = {
  "doc-thong-tin-thu-nhap-va-ca-lam": [
    {
      "heading": "Đừng chỉ nhìn vào con số lớn nhất",
      "paragraphs": [
        "Một mức “thu nhập đến…” có thể gộp lương cơ bản, phụ cấp và tiền làm thêm. Hãy hỏi phần nào ổn định, phần nào phụ thuộc số ngày công hoặc điều kiện cụ thể. Hai tin có tổng thu nhập giống nhau vẫn có thể đòi hỏi thời gian làm việc rất khác nhau."
      ],
      "bullets": [
        "Khoản cố định được tính theo tháng, ngày hay giờ?",
        "Phụ cấp áp dụng từ ngày nào và có điều kiện gì?",
        "Con số được nêu đã trừ những khoản nào, nếu có?"
      ]
    },
    {
      "heading": "So sánh bằng cùng một lịch làm việc",
      "paragraphs": [
        "Hãy ghi hai cơ hội lên cùng một bảng: giờ bắt đầu, giờ kết thúc, số ngày làm, thời gian đi lại và các khoản đã xác nhận. Ví dụ, một công việc gần nhà với giờ giấc phù hợp có thể đáp ứng nhu cầu của bạn tốt hơn mức thu nhập cao hơn nhưng phụ thuộc nhiều vào làm thêm. Đây là cách cân nhắc, không phải dự đoán số tiền bạn sẽ nhận."
      ],
      "table": {
        "caption": "Thông tin nên đặt cạnh nhau khi so sánh việc làm",
        "headers": [
          "Thông tin cần xác minh",
          "Tình huống và câu hỏi"
        ],
        "rows": [
          [
            "Ca làm và thời gian đi lại",
            "Khi hai nơi có cùng giờ bắt đầu, hỏi rõ giờ kết thúc và tính thời gian đi lại đến từng nơi."
          ],
          [
            "Khoản cố định và phụ cấp",
            "Nếu tin chỉ nêu tổng thu nhập, hỏi khoản nào cố định và phụ cấp nào phụ thuộc số ngày công."
          ],
          [
            "Giờ làm thêm",
            "Nếu một tin tính cả giờ làm thêm, xin ví dụ chỉ tính theo lịch bình thường để dễ so sánh."
          ]
        ]
      },
      "bullets": [
        "Ghi riêng thông tin đã xác nhận và điều còn chờ trả lời.",
        "Hỏi cách thông báo khi đổi ca hoặc thay đổi lịch."
      ]
    },
    {
      "heading": "Xin một ví dụ có đủ giả định",
      "paragraphs": [
        "Bạn có thể hỏi: “Nếu tôi làm đủ lịch bình thường và không làm thêm, cách tính sẽ như thế nào?”. Sau đó đề nghị chỉ rõ các khoản trong ví dụ và lưu lại câu trả lời. Nếu người tư vấn chưa có dữ liệu, hãy hẹn thời điểm xác nhận thay vì tự điền con số còn thiếu."
      ]
    }
  ],
  "nhung-dip-gap-nhau-cua-nguoi-minh-duc": [
    {
      "heading": "Một chiếc bánh để cùng mừng sinh nhật",
      "paragraphs": [
        "Ở buổi sinh nhật, mọi người đứng sát lại phía sau chiếc bàn nhỏ bày bánh và hoa quả. Một vài đồng nghiệp giơ tay làm hình trái tim. Bức hình chụp cùng những túi quà ghi lại một khoảnh khắc khác của buổi gặp ngay trong căn phòng quen thuộc."
      ],
      "images": [
        {
          "src": "/WebMinhDuc/assets/minhduc-v18/birthday-gifts.webp",
          "alt": "Đồng nghiệp đứng cạnh nhau với những túi quà giấy bên bàn sinh nhật.",
          "caption": "Những túi quà trong buổi sinh nhật cùng đồng nghiệp."
        }
      ]
    },
    {
      "heading": "Trên sân khấu buổi tất niên",
      "paragraphs": [
        "Từ chỗ chụp ảnh chung có thể thấy cả căn phòng và phông sân khấu phía sau các đồng nghiệp. Đến phần trao quà, góc máy gần hơn cho thấy từng chiếc hộp và túi giấy. Hai góc nhìn của buổi tất niên ghi lại cả tập thể lẫn những người nhận quà."
      ],
      "images": [
        {
          "src": "/WebMinhDuc/assets/minhduc-v16/yearend-gifts.webp",
          "alt": "Nhóm người cầm quà trên sân khấu, phía trước có nhiều hộp quà màu đỏ.",
          "caption": "Trao quà trong buổi tất niên."
        }
      ]
    },
    {
      "heading": "Một buổi cùng làm việc ngoài sân",
      "paragraphs": [
        "Bức ảnh cuối được chụp ngoài trời. Trước dãy nhà và sườn núi, người trong nhóm vẫn cầm chổi, hót rác và dụng cụ khi đứng vào hàng chụp hình. Bộ ảnh khép lại ở một hoạt động thường ngày, khác với khung cảnh bàn tiệc trong hai phần trước."
      ],
      "images": [
        {
          "src": "/WebMinhDuc/assets/minhduc-v16/community.webp",
          "alt": "Cả nhóm cầm dụng cụ vệ sinh trước tòa nhà, phía sau là sườn núi.",
          "caption": "Ảnh tư liệu hoạt động cộng đồng của Minh Đức Vina."
        }
      ]
    }
  ],
  "phong-van-nha-may-lan-dau": [
    {
      "heading": "Chuẩn bị lời giới thiệu trong một phút",
      "paragraphs": [
        "Giới thiệu ngắn về khu vực bạn sống, công việc đã làm và thời điểm có thể bắt đầu. Nếu chưa từng làm ở nhà máy, hãy nói rõ điều đó. Một ví dụ về việc tuân thủ giờ giấc, làm theo hướng dẫn hoặc phối hợp với người khác có ích hơn việc nhận mình có kỹ năng chưa từng sử dụng."
      ]
    },
    {
      "heading": "Dùng một tình huống cụ thể để trả lời",
      "paragraphs": [
        "Với câu hỏi “Bạn xử lý việc chưa biết thế nào?”, bạn có thể kể theo ba phần: việc được giao, cách hỏi hoặc kiểm tra, và kết quả. Không cần biến câu chuyện thành thành tích lớn. Người phỏng vấn cần hiểu bạn nhận hướng dẫn và phản hồi ra sao."
      ],
      "bullets": [
        "Chỉ kể việc bạn thực sự tham gia.",
        "Nói rõ phần bạn làm và phần đồng đội hỗ trợ.",
        "Nếu chưa hiểu câu hỏi, xin giải thích lại trước khi trả lời."
      ]
    },
    {
      "heading": "Kết thúc bằng việc xác nhận bước tiếp theo",
      "paragraphs": [
        "Hỏi cách nhận kết quả, đầu mối liên hệ và giấy tờ chỉ cần bổ sung khi được yêu cầu. Trước khi rời buổi trao đổi, nhắc lại lịch hoặc việc bạn cần làm tiếp theo. Nếu có bài kiểm tra tay nghề, hãy hỏi nội dung và hướng dẫn an toàn trước khi bắt đầu; không vận hành thiết bị chưa được hướng dẫn."
      ]
    }
  ],
  "chuan-bi-truoc-ngay-nhan-viec": [
    {
      "heading": "Kiểm tra lại lịch hẹn bằng thông tin đầy đủ",
      "paragraphs": [
        "Tên nhà máy hoặc tên khu công nghiệp chưa đủ để tìm đúng nơi tiếp nhận. Hỏi rõ địa chỉ, cổng vào, điểm tập trung và số điện thoại có thể liên hệ lúc đến. Nếu đi xe đưa đón, cần xác nhận điểm đón, giờ có mặt và cách xử lý khi lỡ chuyến."
      ],
      "bullets": [
        "Lưu địa chỉ và số liên hệ để xem được khi mạng yếu.",
        "Ước tính thời gian đi lại và thêm khoảng dự phòng.",
        "Báo sớm nếu bạn không thể đến đúng lịch."
      ]
    },
    {
      "heading": "Chuẩn bị theo danh sách đã được xác nhận",
      "paragraphs": [
        "Xếp giấy tờ cần mang vào một túi riêng; không tự nộp bản gốc nếu chưa hiểu mục đích và quy trình nhận lại. Hỏi trước về trang phục, đồ dùng cá nhân và những vật không được mang vào khu vực làm việc. Không cần mua thêm thiết bị bảo hộ khi chưa có hướng dẫn cụ thể từ đơn vị tiếp nhận."
      ]
    },
    {
      "heading": "Ghi lại điều cần hỏi trong ngày đầu",
      "paragraphs": [
        "Ngày đầu có nhiều thông tin mới, nên bạn có thể bỏ sót tên người hướng dẫn hoặc cách báo nghỉ. Một ghi chú ngắn giúp bạn hỏi lại đúng việc. Sau buổi hướng dẫn, nhắc lại bằng lời của mình cách chấm công, nơi cần có mặt và người hỗ trợ khi chưa rõ nhiệm vụ."
      ]
    }
  ],
  "kiem-tra-cham-cong-va-bang-luong": [
    {
      "heading": "Giữ một bản ghi đơn giản của riêng bạn",
      "paragraphs": [
        "Bạn có thể ghi ngày làm, ca được phân công, giờ vào ra và lần đổi lịch đã được xác nhận. Mục đích là có căn cứ trao đổi khi cần, không thay thế hệ thống chấm công của doanh nghiệp. Không chụp màn hình hoặc tài liệu chứa thông tin của đồng nghiệp nếu bạn không được phép."
      ]
    },
    {
      "heading": "Đối chiếu từng phần thay vì chỉ nhìn tổng tiền",
      "paragraphs": [
        "Bắt đầu bằng kỳ tính lương và số ngày hoặc giờ được ghi nhận, sau đó xem các khoản cố định, khoản theo điều kiện và khoản khấu trừ được thể hiện. Một khác biệt có thể xuất phát từ ngày chốt công hoặc thay đổi lịch chưa cập nhật. Hãy kiểm tra nguyên nhân trước khi kết luận."
      ],
      "bullets": [
        "Kỳ trên bảng lương có trùng khoảng thời gian bạn đang tính không?",
        "Ca đổi, ngày nghỉ hoặc giờ bổ sung đã được cập nhật chưa?",
        "Khoản chưa rõ cần được giải thích bằng căn cứ nào?"
      ]
    },
    {
      "heading": "Gửi câu hỏi ngắn và có thể kiểm tra",
      "paragraphs": [
        "Thay vì nhắn “lương bị thiếu”, hãy nêu kỳ lương, ngày cần kiểm tra và số liệu bạn đang đối chiếu. Ví dụ: “Xin kiểm tra ca ngày 12; bản ghi của tôi có thay đổi ca đã xác nhận nhưng chưa thấy ở kỳ này”. Gửi qua đầu mối được hướng dẫn, hỏi thời gian phản hồi và lưu lại nội dung trao đổi."
      ]
    }
  ],
  "ban-yeu-cau-nhan-luc-cho-nha-may": [
    {
      "heading": "Viết theo vị trí và thời điểm tiếp nhận",
      "paragraphs": [
        "“Cần thêm người” chưa cho biết công đoạn nào đang thiếu hoặc khi nào có thể tiếp nhận. Một bản yêu cầu nên chỉ rõ vị trí, nhiệm vụ chính, địa điểm, số lượng dự kiến và lịch nhận theo đợt. Nếu số lượng còn thay đổi, ghi khoảng dự kiến và thời điểm chốt thay vì coi đó là con số đã duyệt."
      ]
    },
    {
      "heading": "Tách yêu cầu bắt buộc khỏi điều có thể đào tạo",
      "paragraphs": [
        "Bộ phận vận hành và nhân sự nên cùng rà lại tiêu chí. Một kỹ năng có thể hướng dẫn trong thời gian đầu không nên được mô tả như kinh nghiệm bắt buộc nếu thực tế không cần. Ngược lại, điều kiện liên quan an toàn hoặc năng lực thực hiện nhiệm vụ cần được diễn đạt cụ thể và kiểm tra theo quy trình phù hợp."
      ],
      "bullets": [
        "Nhiệm vụ thực tế và điều kiện tại nơi làm việc.",
        "Lịch ca, cách thông báo thay đổi và người xác nhận.",
        "Cơ cấu thu nhập đã được duyệt để tư vấn.",
        "Các tiêu chí có thể điều chỉnh và thẩm quyền quyết định."
      ]
    },
    {
      "heading": "Gắn phiên bản cho mọi thay đổi",
      "paragraphs": [
        "Ghi ngày cập nhật và một đầu mối duyệt nội dung. Khi đổi ca hoặc lịch nhận, gửi lại bản thay thế có đánh dấu phần đổi và xác nhận các đầu mối đã nhận. Ứng viên đã được tư vấn theo bản trước cần được thông báo những điểm ảnh hưởng đến lựa chọn của họ."
      ]
    }
  ],
  "theo-doi-pheu-tuyen-dung": [
    {
      "heading": "Thống nhất một định nghĩa trước khi đếm",
      "paragraphs": [
        "Một lượt để lại số điện thoại không đồng nghĩa với một ứng viên đã xác nhận lịch. Hãy định nghĩa rõ các bước: quan tâm, đã liên hệ, phù hợp để trao đổi, có lịch hẹn, đã đến và đã tiếp nhận. Mỗi người cần một mã theo dõi nội bộ để tránh đếm trùng khi đến từ nhiều kênh."
      ]
    },
    {
      "heading": "Dùng ví dụ để kiểm tra cách đọc tỷ lệ",
      "paragraphs": [
        "Trong ví dụ giả định, 40 lịch hẹn dẫn đến 28 người đến, tức tỷ lệ đến theo lịch là 70%. Con số này chỉ có ý nghĩa khi cùng một khoảng thời gian và cùng quy tắc ghi nhận. Không nên lấy người đến của tuần này chia cho lịch hẹn của tuần khác, hoặc coi một tỷ lệ mẫu là cam kết kết quả."
      ],
      "table": {
        "caption": "Ví dụ giả định về tỷ lệ có mặt theo lịch hẹn",
        "headers": [
          "Chỉ số",
          "Cách đọc"
        ],
        "rows": [
          [
            "Lịch hẹn đã xác nhận",
            "40 lịch trong cùng kỳ."
          ],
          [
            "Đã ghi nhận có mặt",
            "28 người đã đến theo lịch."
          ],
          [
            "Tỷ lệ có mặt",
            "28 ÷ 40 = 70%."
          ],
          [
            "Chưa ghi nhận có mặt",
            "12 người chưa được ghi nhận có mặt. Số này không cho biết họ đã từ chối, đổi lịch hay bỏ việc."
          ]
        ]
      },
      "bullets": [
        "Ghi nguồn, ngày hẹn và trạng thái cập nhật gần nhất.",
        "Phân biệt chưa đến, xin đổi lịch và đã từ chối.",
        "Theo dõi lý do được ứng viên chia sẻ; không tự suy đoán."
      ]
    },
    {
      "heading": "Chọn một thay đổi nhỏ rồi đo lại",
      "paragraphs": [
        "Nếu nhiều người đã có lịch nhưng không tìm được cổng vào, cải thiện chỉ dẫn có thể hữu ích hơn tăng ngân sách tìm nguồn. Nếu nhiều người từ chối sau tư vấn, hãy rà lại nội dung tin với thông tin thực tế. Ghi ngày áp dụng thay đổi và so sánh các nhóm có điều kiện tương đồng trước khi kết luận."
      ]
    }
  ],
  "ban-giao-giua-tuyen-dung-va-san-xuat": [
    {
      "heading": "Thống nhất đầu vào trước ngày tiếp nhận",
      "paragraphs": [
        "Nhân sự, tuyển dụng và người phụ trách tiếp nhận cần cùng biết lịch dự kiến, vị trí, người hướng dẫn và các nội dung còn chờ xác nhận. Chỉ chuyển thông tin cần cho bước tiếp theo; không chia sẻ hồ sơ cá nhân rộng hơn phạm vi cần thiết. Một danh sách ngắn với trạng thái rõ ràng thường dễ sử dụng hơn nhiều tệp không có phiên bản."
      ]
    },
    {
      "heading": "Phân công một người cho mỗi điểm xác nhận",
      "paragraphs": [
        "Người tư vấn không nên tự xác nhận thay cho bộ phận tiếp nhận về ca hoặc vị trí còn trống. Mỗi điểm cần có người phụ trách và cách báo lại. Nếu kế hoạch thay đổi, cập nhật cả danh sách tiếp nhận lẫn thông tin đã gửi cho ứng viên."
      ],
      "bullets": [
        "Tuyển dụng xác nhận ứng viên đã nhận đủ hướng dẫn.",
        "Bộ phận tiếp nhận xác nhận lịch, địa điểm và người đón.",
        "Người hướng dẫn xác nhận bước làm quen công việc.",
        "Đầu mối nhân sự tiếp nhận vấn đề chưa giải quyết."
      ],
      "ordered": true
    },
    {
      "heading": "Khép vòng bàn giao bằng phản hồi",
      "paragraphs": [
        "Sau buổi tiếp nhận, đối chiếu ai đã đến, ai đổi lịch và vấn đề nào cần theo dõi. Tránh dùng một trạng thái “xong” cho tất cả trường hợp. Một ghi chú như “đã đến, chờ xác nhận lịch hướng dẫn” giúp ca sau hiểu đúng việc còn lại và tránh phải hỏi lại ứng viên."
      ]
    }
  ],
  "phan-hoi-ung-vien-ro-rang": [
    {
      "heading": "Phân biệt đã nhận thông tin với đã có kết quả",
      "paragraphs": [
        "Thông báo đã nhận hồ sơ chỉ xác nhận bước tiếp nhận, không phải thông báo trúng tuyển. Khi chưa có quyết định, hãy nói đúng trạng thái và việc đang chờ. Cách viết rõ ràng giúp ứng viên chủ động kế hoạch của mình thay vì hiểu nhầm một lời cảm ơn là cam kết nhận việc."
      ]
    },
    {
      "heading": "Dùng ba phần cho một tin nhắn cập nhật",
      "paragraphs": [
        "Một cấu trúc có thể dùng là: tình trạng hiện tại, hành động tiếp theo và mốc cập nhật. Ví dụ: “Thông tin của bạn đã được tiếp nhận; chúng tôi đang chờ bộ phận phụ trách xác nhận lịch. Chúng tôi sẽ cập nhật lại vào mốc đã thống nhất, kể cả khi lịch chưa chốt”. Chỉ ghi mốc mà đội phụ trách có thể thực hiện."
      ],
      "bullets": [
        "Nêu vị trí hoặc lịch hẹn đang được trao đổi.",
        "Chỉ rõ ứng viên có cần làm gì ngay lúc này không.",
        "Để lại kênh phản hồi khi ứng viên muốn đổi hoặc hủy lịch."
      ]
    },
    {
      "heading": "Đóng trao đổi một cách tôn trọng",
      "paragraphs": [
        "Khi một vị trí không còn phù hợp hoặc lịch không thể tiếp tục, thông báo ngắn gọn và tránh nhận xét thiếu căn cứ về ứng viên. Nếu đề xuất cơ hội khác, hãy hỏi họ có muốn nhận thêm thông tin không. Ghi nhận lựa chọn đó để tránh tiếp tục liên hệ trái mong muốn."
      ]
    }
  ],
  "ho-so-xin-viec": [
    {
      "heading": "Xác nhận yêu cầu của từng vị trí",
      "paragraphs": [
        "Mỗi nhà máy có thể có quy trình và yêu cầu hồ sơ khác nhau. Trước khi chuẩn bị giấy tờ, hãy hỏi rõ vị trí ứng tuyển, địa điểm tiếp nhận và người phụ trách. Một danh sách được xác nhận giúp bạn tránh đi lại nhiều lần."
      ]
    },
    {
      "heading": "Sắp xếp thông tin dễ kiểm tra",
      "paragraphs": [
        "Ghi lại họ tên, số điện thoại, khu vực sinh sống, kinh nghiệm và thời gian có thể bắt đầu làm việc. Nếu chưa có kinh nghiệm, bạn vẫn có thể giới thiệu khả năng học hỏi và điều kiện làm việc mong muốn."
      ],
      "bullets": [
        "Thông tin liên hệ còn sử dụng được.",
        "Giấy tờ theo danh sách do đơn vị tiếp nhận xác nhận.",
        "Bản sao khi được yêu cầu; giữ gìn giấy tờ gốc.",
        "Các câu hỏi về công việc, ca làm và điều kiện nhận việc."
      ]
    },
    {
      "heading": "Bảo vệ thông tin cá nhân",
      "paragraphs": [
        "Chỉ gửi hồ sơ cho đầu mối đã được xác minh. Không công khai ảnh giấy tờ tùy thân trên mạng xã hội. Khi được yêu cầu cung cấp thêm dữ liệu, hãy hỏi mục đích sử dụng và cách lưu giữ."
      ]
    },
    {
      "heading": "Kiểm tra lần cuối trước khi gửi hồ sơ",
      "paragraphs": [
        "Trước khi gửi, mở lại tệp hoặc ảnh để kiểm tra độ rõ, thông tin liên hệ và tên vị trí. Chỉ gửi những giấy tờ được yêu cầu cho đúng giai đoạn. Nếu chưa chắc có cần một tài liệu hay không, hỏi đầu mối tiếp nhận trước khi bổ sung."
      ],
      "bullets": [
        "Xác nhận đúng người nhận và kênh tiếp nhận chính thức.",
        "Kiểm tra số điện thoại để nhà tuyển dụng có thể gọi lại.",
        "Đặt tên tệp dễ nhận biết, tránh thông tin cá nhân không cần thiết.",
        "Hỏi bước tiếp theo và lưu thông tin đã gửi để đối chiếu."
      ],
      "ordered": true
    }
  ],
  "nhu-cau-tuyen-dung": [
    {
      "heading": "Bắt đầu từ kế hoạch vận hành",
      "paragraphs": [
        "Một kế hoạch bổ sung lao động nên bắt đầu bằng câu hỏi: công đoạn nào cần người, vào thời điểm nào và để thực hiện nhiệm vụ gì? Tổng số tuyển chưa phản ánh đủ nhu cầu nếu người đến không đúng ca hoặc chưa thể vào công đoạn cần hỗ trợ. Vì vậy, nhân sự và vận hành cần cùng xác nhận đầu bài trước khi mở rộng tìm nguồn.",
        "Tách nhu cầu thay thế người nghỉ khỏi nhu cầu tăng theo kế hoạch sản xuất. Với phần còn phụ thuộc đơn hàng, ghi rõ giả định và ngày rà soát. Một khoảng dự kiến được giải thích rõ tốt hơn một con số chắc chắn trên giấy nhưng chưa có người xác nhận."
      ],
      "bullets": [
        "Vị trí và công đoạn cần bổ sung.",
        "Số lượng theo từng ca, từng đợt tiếp nhận.",
        "Người duyệt nhu cầu và mốc rà soát tiếp theo."
      ]
    },
    {
      "heading": "Lập lịch theo khả năng tiếp nhận thực tế",
      "paragraphs": [
        "Ngày cần người làm việc và ngày có thể tiếp nhận hồ sơ không nhất thiết là một. Hãy đi ngược từ mốc vận hành để dành thời gian cho trao đổi, xác nhận lịch, thủ tục và hướng dẫn ban đầu. Đồng thời kiểm tra khả năng tiếp nhận của bảo vệ, nhân sự, người hướng dẫn và bộ phận phân ca.",
        "Nếu đội hướng dẫn chỉ có thể hỗ trợ một nhóm trong một buổi, việc mời tất cả ứng viên đến cùng lúc có thể tạo thời gian chờ. Chia đợt theo khả năng phục vụ đã xác nhận và thông báo rõ cho từng người. Không dùng số lượng đến đông làm thước đo duy nhất cho một buổi tiếp nhận."
      ],
      "bullets": [
        "Địa điểm và phương án đi lại nếu có.",
        "Ca làm, yêu cầu cơ bản và điều kiện làm việc.",
        "Thu nhập, cách tính và các khoản cần làm rõ.",
        "Đầu mối xác nhận lịch phỏng vấn, nhận việc."
      ]
    },
    {
      "heading": "Thống nhất thông tin trước khi tìm nguồn",
      "paragraphs": [
        "Mỗi bên tham gia cần nhận cùng một phiên bản về vị trí, ca làm, địa điểm và cơ cấu thu nhập được phép tư vấn. Các điều kiện chưa xác nhận phải được đánh dấu để không trở thành lời hứa trong tin nhắn cho ứng viên. Một bảng ngắn có tên người chịu trách nhiệm thường dễ cập nhật hơn nhiều bản mô tả gửi rời rạc."
      ],
      "bullets": [
        "Mục đã xác nhận: có thể dùng khi tư vấn.",
        "Mục đang chờ: ghi người xác nhận và thời hạn cập nhật.",
        "Mục thay đổi: nêu phiên bản mới thay cho phiên bản nào."
      ],
      "images": [
        {
          "src": "/WebMinhDuc/assets/minhduc-meeting-10s.webp",
          "alt": "Các thành viên Minh Đức họp và cùng xem tài liệu",
          "caption": "Một đầu bài chung giúp các đầu mối kiểm tra cùng thông tin trước khi tìm nguồn. Ảnh hoạt động đội ngũ Minh Đức."
        }
      ]
    },
    {
      "heading": "Phân biệt nhu cầu, lịch hẹn và dự kiến đến",
      "paragraphs": [
        "Ba con số này phục vụ ba câu hỏi khác nhau: nhà máy cần bao nhiêu người, đã có bao nhiêu lịch xác nhận và dự kiến ai sẽ đến trong từng đợt. Không cộng người chỉ mới để lại thông tin vào nhóm đã xác nhận. Nếu cần dự báo số người đến, dùng dữ liệu phù hợp cùng kỳ, ghi giả định và cập nhật khi có phản hồi mới."
      ],
      "bullets": [
        "Một ứng viên chỉ có một mã theo dõi trong cùng kế hoạch.",
        "Tách lịch đổi, lịch hủy và trường hợp chưa liên hệ được.",
        "Chỉ ghi lý do ứng viên thực sự cung cấp."
      ]
    },
    {
      "heading": "Theo dõi và cập nhật theo giai đoạn",
      "paragraphs": [
        "Một lần cập nhật ngắn nên trả lời: số liệu nào thay đổi, nguyên nhân đã biết là gì và ai cần hành động tiếp theo. Nếu ứng viên không tìm được cổng vào, sửa chỉ dẫn; nếu ca làm chưa rõ, xác nhận với vận hành; nếu đội tiếp nhận quá tải, điều chỉnh lịch. Tăng tìm nguồn trước khi hiểu nguyên nhân có thể chỉ đưa thêm người vào một bước đang tắc."
      ],
      "bullets": [
        "Đối chiếu số liệu đến một giờ chốt thống nhất.",
        "Giao một người phụ trách cho từng việc còn mở.",
        "Ghi mốc cập nhật để người khác không phải hỏi lại."
      ],
      "ordered": true
    },
    {
      "heading": "Kết thúc đợt bằng những điều có thể tái sử dụng",
      "paragraphs": [
        "Sau mỗi đợt, lưu lại bản yêu cầu cuối, các thay đổi quan trọng và những câu hỏi ứng viên thường gặp. Phân biệt vấn đề do thông tin, lịch tiếp nhận và điều kiện công việc để chọn cách cải thiện phù hợp. Mục tiêu là lần phối hợp tiếp theo rõ ràng hơn, không phải biến một kết quả riêng lẻ thành cam kết cho mọi đợt tuyển."
      ],
      "images": [
        {
          "src": "/WebMinhDuc/assets/minhduc-working-60s.webp",
          "alt": "Nhóm Minh Đức cùng đối chiếu tài liệu công việc",
          "caption": "Ghi lại việc đã xác nhận và việc còn mở giúp lần bàn giao sau liền mạch hơn."
        }
      ]
    }
  ],
  "chon-cong-viec-phu-hop": [
    {
      "heading": "Công việc hằng ngày là gì?",
      "paragraphs": [
        "Hãy hỏi về nhiệm vụ cụ thể, môi trường làm việc, yêu cầu thể lực và hướng dẫn ban đầu. Đừng ngại đề nghị giải thích lại những thuật ngữ chưa quen."
      ]
    },
    {
      "heading": "Thời gian và thu nhập được tính ra sao?",
      "paragraphs": [
        "Làm rõ ca làm, ngày nghỉ, chính sách làm thêm và cách xác nhận chấm công. Với thu nhập, cần phân biệt khoản cố định, phụ cấp và khoản phụ thuộc điều kiện."
      ],
      "bullets": [
        "Thời điểm trả lương và hình thức nhận lương.",
        "Điều kiện áp dụng các khoản phụ cấp.",
        "Thông tin hợp đồng và bảo hiểm cần được xác nhận.",
        "Đầu mối hỗ trợ khi có thắc mắc."
      ]
    },
    {
      "heading": "Lưu lại các thông tin đã xác nhận",
      "paragraphs": [
        "Giữ tin tuyển dụng và nội dung trao đổi cần thiết. Trước khi đi nhận việc, xác nhận địa chỉ, thời gian, giấy tờ cần mang và số điện thoại liên hệ."
      ]
    }
  ],
  "thong-tin-tuyen-dung-minh-bach": [
    {
      "heading": "Một nguồn thông tin thống nhất",
      "paragraphs": [
        "Tin tuyển dụng nên dùng ngôn ngữ dễ hiểu và nêu các điều kiện chính. Khi nhiều đầu mối cùng tham gia, cần thống nhất nội dung được phép chia sẻ và cách cập nhật thay đổi."
      ]
    },
    {
      "heading": "Trình bày đủ điều kiện",
      "paragraphs": [
        "Thông tin thu nhập cần đi kèm cách tính hoặc điều kiện áp dụng. Các quyền lợi chưa được xác nhận không nên trình bày như cam kết. Điều này giúp ứng viên cân nhắc cơ hội phù hợp với nhu cầu thực tế."
      ]
    },
    {
      "heading": "Dành chỗ cho phản hồi",
      "paragraphs": [
        "Một kênh để ứng viên hỏi lại thông tin giúp đơn vị tuyển dụng nhận ra những điểm chưa rõ. Các câu hỏi thường gặp có thể được bổ sung vào nội dung tuyển dụng ở lần cập nhật tiếp theo."
      ]
    }
  ],
  "don-tiep-lao-dong-moi": [
    {
      "heading": "Trước ngày tiếp nhận",
      "paragraphs": [
        "Gửi hướng dẫn dễ đọc về địa chỉ, cổng vào, giờ có mặt và giấy tờ cần mang. Xác nhận một đầu mối có thể liên hệ khi người lao động cần hỗ trợ."
      ]
    },
    {
      "heading": "Trong ngày đầu tiên",
      "paragraphs": [
        "Dành thời gian giới thiệu công việc, quy định và các hướng dẫn an toàn cần thiết. Kiểm tra người lao động đã hiểu nội dung thay vì chỉ đưa tài liệu."
      ],
      "bullets": [
        "Giới thiệu người quản lý hoặc hướng dẫn trực tiếp.",
        "Hướng dẫn khu vực làm việc và sinh hoạt.",
        "Làm rõ quy trình chấm công, báo nghỉ và hỏi đáp.",
        "Ghi nhận các thắc mắc phát sinh."
      ]
    },
    {
      "heading": "Sau khi bắt đầu công việc",
      "paragraphs": [
        "Một lần hỏi thăm ngắn giúp phát hiện khó khăn ban đầu. Thông tin phản hồi có thể hỗ trợ cải thiện quy trình tiếp nhận cho những đợt tiếp theo."
      ]
    }
  ],
  "an-toan-thong-tin-khi-tim-viec": [
    {
      "heading": "Kiểm tra nguồn tin",
      "paragraphs": [
        "Đối chiếu tên doanh nghiệp, số liên hệ và địa điểm tuyển dụng. Khi có điều chưa rõ, hãy tìm kênh liên hệ chính thức và hỏi trực tiếp trước khi cung cấp hồ sơ."
      ]
    },
    {
      "heading": "Chia sẻ vừa đủ thông tin",
      "paragraphs": [
        "Ở bước tư vấn ban đầu, chỉ chia sẻ thông tin cần cho việc trao đổi công việc. Không gửi mã xác thực, mật khẩu hoặc thông tin tài khoản ngân hàng cho người tuyển dụng."
      ]
    },
    {
      "heading": "Cẩn trọng với yêu cầu chuyển tiền",
      "paragraphs": [
        "Nếu có yêu cầu đóng phí hoặc chuyển tiền, hãy làm rõ đơn vị nhận, mục đích, căn cứ và chứng từ. Dừng trao đổi khi gặp dấu hiệu đáng ngờ và xác minh qua một kênh độc lập."
      ]
    }
  ]
};

export function getArticle(slug: string): Article | undefined {
  const article = articles.find(item => item.slug === slug);
  const sections = articleSections[slug];
  return article && sections ? {...article, sections} : undefined;
}
