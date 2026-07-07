const actors = {
  'boss-byte': {
    id: 'boss-byte',
    name: 'BOSS BYTE',
    role: 'Senior Developer · Quản lý trực tiếp',
    company: 'Pixel Tech Corp',
    avatar: '👨‍💻',
    personality:
      'Thẳng thắn, thực tế, thích quan sát cách suy nghĩ hơn là câu trả lời học thuộc. Không nói lộ đáp án ngay.',
  },
  'client-linh': {
    id: 'client-linh',
    name: 'CHỊ LINH',
    role: 'Khách hàng · Quản lý vận hành',
    company: 'Nova Retail',
    avatar: '👩‍💼',
    personality:
      'Tập trung vào giá trị thực tế, không dùng thuật ngữ kỹ thuật, phản ứng như một khách hàng thật.',
  },
  'qa-an': {
    id: 'qa-an',
    name: 'AN QA',
    role: 'QA Engineer · Người kiểm thử',
    company: 'Pixel Tech Corp',
    avatar: '🧪',
    personality:
      'Cẩn thận, cụ thể, luôn nghĩ đến trường hợp sai và chỉ ra vấn đề mà không làm thay người chơi.',
  },
  'pm-trang': {
    id: 'pm-trang',
    name: 'CHỊ TRANG',
    role: 'Project Manager · Quản lý dự án',
    company: 'Pixel Tech Corp',
    avatar: '📋',
    personality:
      'Bình tĩnh nhưng quyết liệt, hỏi rõ thứ tự ưu tiên, thời gian và cách thông báo rủi ro.',
  },
  'teammate-minh': {
    id: 'teammate-minh',
    name: 'MINH',
    role: 'Đồng đội · Frontend Developer',
    company: 'Pixel Tech Corp',
    avatar: '🧑‍🤝‍🧑',
    personality:
      'Thân thiện nhưng đang chịu áp lực tiến độ. Phản ứng tự nhiên với cách người chơi giao tiếp và phối hợp.',
  },
  'mentor-nova': {
    id: 'mentor-nova',
    name: 'MENTOR NOVA',
    role: 'Career Mentor · Người phỏng vấn cuối',
    company: 'Career Quest AI',
    avatar: '🧭',
    personality:
      'Điềm tĩnh, không phán xét, hỏi sâu để tìm động lực thật thay vì câu trả lời đẹp.',
  },
};

const scenarios = {
  'drag-stage-1': {
    id: 'drag-stage-1',
    stageNumber: 1,
    mode: 'drag',
    actorId: 'boss-byte',
    missionTitle: 'SẮP XẾP QUY TRÌNH ĐẦU TIÊN',
    missionObjective:
      'Nhận hai giá trị, xử lý chúng theo đúng thứ tự và đưa ra kết quả cuối cùng.',
    context:
      'Ngày làm việc đầu tiên. Boss Byte muốn quan sát cách người chơi chia một việc đơn giản thành các bước.',
    correctSolution: ['input', 'input', 'add', 'print'],
    maxAttempts: 5,
    maxConversationTurns: 0,
  },
  'drag-stage-2': {
    id: 'drag-stage-2',
    stageNumber: 2,
    mode: 'drag',
    actorId: 'client-linh',
    missionTitle: 'BÁO CÁO TỪ NHIỀU DỮ LIỆU',
    missionObjective:
      'Tạo một quy trình xử lý cả danh sách thay vì làm thủ công từng giá trị.',
    context:
      'Khách hàng cần tổng hợp nhiều số liệu cho một báo cáo và muốn kết quả nhanh, dễ hiểu.',
    correctSolution: ['input', 'loop', 'add', 'print'],
    maxAttempts: 4,
    maxConversationTurns: 0,
  },
  'drag-stage-3': {
    id: 'drag-stage-3',
    stageNumber: 3,
    mode: 'drag',
    actorId: 'qa-an',
    missionTitle: 'KIỂM TRA TRƯỚC KHI XỬ LÝ',
    missionObjective:
      'Duyệt dữ liệu, kiểm tra điều kiện phù hợp, xử lý rồi mới hiển thị kết quả.',
    context:
      'QA An phát hiện rằng không phải dữ liệu nào cũng nên được xử lý giống nhau.',
    correctSolution: ['array', 'loop', 'condition', 'add', 'print'],
    maxAttempts: 3,
    maxConversationTurns: 0,
  },
  'open-stage-4': {
    id: 'open-stage-4',
    stageNumber: 4,
    mode: 'open',
    actorId: 'pm-trang',
    missionTitle: '30 PHÚT TRƯỚC DEADLINE',
    missionObjective:
      'Thể hiện cách xác định ưu tiên, xử lý rủi ro và giao tiếp khi thời gian rất ít.',
    context:
      'Một phần công việc nhóm không cho kết quả như mong đợi và chỉ còn 30 phút trước hạn cuối.',
    initialQuestion:
      'Kết quả hiện chưa đạt yêu cầu, trong khi chỉ còn 30 phút. Bạn sẽ làm gì tiếp theo? Hãy nói rõ thứ tự hành động và lý do.',
    maxConversationTurns: 2,
  },
  'open-stage-5': {
    id: 'open-stage-5',
    stageNumber: 5,
    mode: 'open',
    actorId: 'teammate-minh',
    missionTitle: 'KHI ĐỒNG ĐỘI ĐANG CHỜ BẠN',
    missionObjective:
      'Thể hiện cách giao tiếp, phối hợp và bảo vệ tiến độ chung khi bản thân đang bận xử lý việc khó.',
    context:
      'Minh cần kết quả từ người chơi để tiếp tục, trong khi một thành viên khác liên tục hỏi tiến độ.',
    initialQuestion:
      'Tớ đang chờ phần của cậu để làm tiếp, nhưng tớ biết cậu cũng đang xử lý việc khó. Cậu sẽ trao đổi và sắp xếp công việc thế nào?',
    maxConversationTurns: 2,
  },
  'open-stage-6': {
    id: 'open-stage-6',
    stageNumber: 6,
    mode: 'open',
    actorId: 'mentor-nova',
    missionTitle: 'NHÌN LẠI CẢ HÀNH TRÌNH',
    missionObjective:
      'Nhận diện điều tạo hứng thú, điều gây căng thẳng và kiểu công việc khiến người chơi có hoặc mất động lực.',
    context:
      'Sau 5 thử thách, Mentor Nova muốn nghe cảm nhận thật thay vì một đáp án đúng.',
    initialQuestion:
      'Trong hành trình vừa rồi, phần nào khiến bạn hứng thú nhất và phần nào khiến bạn khó chịu, căng thẳng hoặc mất động lực nhất? Vì sao?',
    maxConversationTurns: 2,
  },
};

function getScenario(stageId) {
  return scenarios[stageId] || null;
}

function getActor(actorId) {
  return actors[actorId] || null;
}

module.exports = {
  actors,
  scenarios,
  getScenario,
  getActor,
};
