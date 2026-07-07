export type RoleplayActorId =
  | 'boss-byte'
  | 'client-linh'
  | 'qa-an'
  | 'pm-trang'
  | 'teammate-minh'
  | 'mentor-nova';

export type RoleplayStageId =
  | 'drag-stage-1'
  | 'drag-stage-2'
  | 'drag-stage-3'
  | 'open-stage-4'
  | 'open-stage-5'
  | 'open-stage-6';

export type RoleplayStageMode = 'drag' | 'open';

export interface RoleplayActor {
  id: RoleplayActorId;
  name: string;
  role: string;
  company: string;
  avatar: string;
  accent: string;
  softAccent: string;
  description: string;
  personality: string;
}

export interface RoleplayScenario {
  id: RoleplayStageId;
  stageNumber: number;
  mode: RoleplayStageMode;
  actorId: RoleplayActorId;
  missionTitle: string;
  missionObjective: string;
  context: string;
  initialQuestion?: string;
  maxConversationTurns: number;
}

export const roleplayActors: Record<RoleplayActorId, RoleplayActor> = {
  'boss-byte': {
    id: 'boss-byte',
    name: 'BOSS BYTE',
    role: 'Senior Developer · Quản lý trực tiếp',
    company: 'Pixel Tech Corp',
    avatar: '👨‍💻',
    accent: '#7c3aed',
    softAccent: '#211944',
    description:
      'Người giao việc đầu tiên. Khó tính vừa đủ, thích nhìn cách bạn suy nghĩ hơn là nghe câu trả lời học thuộc.',
    personality:
      'Thẳng thắn, thực tế, không nói lộ đáp án ngay và luôn yêu cầu người chơi giải thích cách nghĩ.',
  },
  'client-linh': {
    id: 'client-linh',
    name: 'CHỊ LINH',
    role: 'Khách hàng · Quản lý vận hành',
    company: 'Nova Retail',
    avatar: '👩‍💼',
    accent: '#ff9aaa',
    softAccent: '#3a1d37',
    description:
      'Khách hàng cần kết quả rõ ràng và dễ sử dụng. Chị không quan tâm thuật ngữ kỹ thuật, chỉ quan tâm công việc có giải quyết đúng nhu cầu hay không.',
    personality:
      'Nói ngắn gọn, tập trung vào giá trị thực tế, có thể đổi yêu cầu khi phát hiện nhu cầu mới.',
  },
  'qa-an': {
    id: 'qa-an',
    name: 'AN QA',
    role: 'QA Engineer · Người kiểm thử',
    company: 'Pixel Tech Corp',
    avatar: '🧪',
    accent: '#63e6a8',
    softAccent: '#112a27',
    description:
      'Người chuyên tìm ra trường hợp dễ sai trước khi sản phẩm đến tay khách hàng.',
    personality:
      'Cẩn thận, hay hỏi “nếu trường hợp này xảy ra thì sao?”, phản hồi cụ thể nhưng không làm thay người chơi.',
  },
  'pm-trang': {
    id: 'pm-trang',
    name: 'CHỊ TRANG',
    role: 'Project Manager · Quản lý dự án',
    company: 'Pixel Tech Corp',
    avatar: '📋',
    accent: '#ffb84d',
    softAccent: '#3a2816',
    description:
      'Người chịu trách nhiệm tiến độ. Chị muốn biết bạn ưu tiên việc gì khi thời gian không đủ.',
    personality:
      'Bình tĩnh nhưng quyết liệt, luôn hỏi rõ thứ tự ưu tiên và cách bạn thông báo rủi ro.',
  },
  'teammate-minh': {
    id: 'teammate-minh',
    name: 'MINH',
    role: 'Đồng đội · Frontend Developer',
    company: 'Pixel Tech Corp',
    avatar: '🧑‍🤝‍🧑',
    accent: '#8be9fd',
    softAccent: '#14263b',
    description:
      'Một đồng đội đang phụ thuộc vào phần việc của bạn để tiếp tục công việc của mình.',
    personality:
      'Thân thiện nhưng chịu áp lực tiến độ, phản ứng tự nhiên với cách bạn giao tiếp và phối hợp.',
  },
  'mentor-nova': {
    id: 'mentor-nova',
    name: 'MENTOR NOVA',
    role: 'Career Mentor · Người phỏng vấn cuối',
    company: 'Career Quest AI',
    avatar: '🧭',
    accent: '#ffe066',
    softAccent: '#312b17',
    description:
      'Người giúp bạn nhìn lại điều gì tạo hứng thú, điều gì làm bạn mất năng lượng và vì sao.',
    personality:
      'Điềm tĩnh, không phán xét, thường hỏi sâu thêm để tìm động lực thật thay vì câu trả lời “đẹp”.',
  },
};

export const roleplayScenarios: RoleplayScenario[] = [
  {
    id: 'drag-stage-1',
    stageNumber: 1,
    mode: 'drag',
    actorId: 'boss-byte',
    missionTitle: 'SẮP XẾP QUY TRÌNH ĐẦU TIÊN',
    missionObjective:
      'Nhận hai giá trị, xử lý chúng theo đúng thứ tự và đưa ra kết quả cuối cùng.',
    context:
      'Ngày làm việc đầu tiên. Boss Byte muốn quan sát cách bạn chia một việc đơn giản thành các bước.',
    maxConversationTurns: 0,
  },
  {
    id: 'drag-stage-2',
    stageNumber: 2,
    mode: 'drag',
    actorId: 'client-linh',
    missionTitle: 'BÁO CÁO TỪ NHIỀU DỮ LIỆU',
    missionObjective:
      'Tạo một quy trình xử lý cả danh sách thay vì làm thủ công từng giá trị.',
    context:
      'Khách hàng cần tổng hợp nhiều số liệu cho một báo cáo và muốn kết quả nhanh, dễ hiểu.',
    maxConversationTurns: 0,
  },
  {
    id: 'drag-stage-3',
    stageNumber: 3,
    mode: 'drag',
    actorId: 'qa-an',
    missionTitle: 'KIỂM TRA TRƯỚC KHI XỬ LÝ',
    missionObjective:
      'Duyệt dữ liệu, kiểm tra điều kiện phù hợp, xử lý rồi mới hiển thị kết quả.',
    context:
      'QA An phát hiện rằng không phải dữ liệu nào cũng nên được xử lý giống nhau.',
    maxConversationTurns: 0,
  },
  {
    id: 'open-stage-4',
    stageNumber: 4,
    mode: 'open',
    actorId: 'pm-trang',
    missionTitle: '30 PHÚT TRƯỚC DEADLINE',
    missionObjective:
      'Thể hiện cách bạn xác định ưu tiên, xử lý rủi ro và giao tiếp khi thời gian rất ít.',
    context:
      'Một phần công việc nhóm không cho kết quả như mong đợi và chỉ còn 30 phút trước hạn cuối.',
    initialQuestion:
      'Kết quả hiện chưa đạt yêu cầu, trong khi chỉ còn 30 phút. Bạn sẽ làm gì tiếp theo? Hãy nói rõ thứ tự hành động và lý do.',
    maxConversationTurns: 2,
  },
  {
    id: 'open-stage-5',
    stageNumber: 5,
    mode: 'open',
    actorId: 'teammate-minh',
    missionTitle: 'KHI ĐỒNG ĐỘI ĐANG CHỜ BẠN',
    missionObjective:
      'Thể hiện cách bạn giao tiếp, phối hợp và bảo vệ tiến độ chung khi bản thân đang bận xử lý việc khó.',
    context:
      'Minh cần kết quả từ bạn để tiếp tục, trong khi một thành viên khác liên tục hỏi tiến độ.',
    initialQuestion:
      'Tớ đang chờ phần của cậu để làm tiếp, nhưng tớ biết cậu cũng đang xử lý việc khó. Cậu sẽ trao đổi và sắp xếp công việc thế nào?',
    maxConversationTurns: 2,
  },
  {
    id: 'open-stage-6',
    stageNumber: 6,
    mode: 'open',
    actorId: 'mentor-nova',
    missionTitle: 'NHÌN LẠI CẢ HÀNH TRÌNH',
    missionObjective:
      'Nhận diện điều tạo hứng thú, điều gây căng thẳng và kiểu công việc khiến bạn có hoặc mất động lực.',
    context:
      'Sau 5 thử thách, Mentor Nova muốn nghe cảm nhận thật thay vì một đáp án “đúng”.',
    initialQuestion:
      'Trong hành trình vừa rồi, phần nào khiến bạn hứng thú nhất và phần nào khiến bạn khó chịu, căng thẳng hoặc mất động lực nhất? Vì sao?',
    maxConversationTurns: 2,
  },
];

export function getRoleplayScenario(stageId: RoleplayStageId) {
  return roleplayScenarios.find((scenario) => scenario.id === stageId);
}

export function getRoleplayActor(actorId: RoleplayActorId) {
  return roleplayActors[actorId];
}
