import { useState } from 'react';
import { motion } from 'motion/react';

import type { PlayerProfile } from './PlayerProfilePage';

interface CareerSelectPageProps {
  playerProfile: PlayerProfile;
  onBack: () => void;
  onSelectCareer: (careerId: string) => void;
}

interface CareerData {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  unlocked: boolean;
  tags: string[];
}

const careers: CareerData[] = [
  {
    id: 'it',
    icon: '💻',
    title: 'CÔNG NGHỆ THÔNG TIN',
    subtitle: 'IT WORLD · OPEN',
    description:
      'Roleplay với sếp, khách hàng, QA, quản lý dự án và đồng đội trong 6 thử thách.',
    unlocked: true,
    tags: ['Tư duy logic', 'Giao tiếp', 'Làm việc nhóm'],
  },
  {
    id: 'marketing',
    icon: '📢',
    title: 'MARKETING',
    subtitle: 'CREATIVE WORLD · LOCKED',
    description: 'Thế giới sáng tạo và chiến lược truyền thông.',
    unlocked: false,
    tags: ['Sáng tạo', 'Khách hàng', 'Chiến lược'],
  },
  {
    id: 'design',
    icon: '🎨',
    title: 'THIẾT KẾ',
    subtitle: 'DESIGN WORLD · LOCKED',
    description: 'Thế giới quan sát và giải quyết vấn đề bằng hình ảnh.',
    unlocked: false,
    tags: ['Sáng tạo', 'Quan sát', 'Trải nghiệm'],
  },
  {
    id: 'finance',
    icon: '💰',
    title: 'TÀI CHÍNH',
    subtitle: 'FINANCE WORLD · LOCKED',
    description: 'Thế giới phân tích dữ liệu và đánh giá rủi ro.',
    unlocked: false,
    tags: ['Phân tích', 'Số liệu', 'Quyết định'],
  },
];

export function CareerSelectPage({
  playerProfile,
  onBack,
  onSelectCareer,
}: CareerSelectPageProps) {
  const [lockedCareer, setLockedCareer] = useState<CareerData | null>(null);

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#0d1024] px-3 py-4 text-white sm:px-5 sm:py-6 lg:px-8">
      <div className="relative z-10 mx-auto w-full max-w-[1400px]">
        <header className="border-4 border-[#4d568c] bg-[#181d3a] p-4 shadow-[6px_6px_0_#070a17]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-[10px] tracking-[0.25em] text-[#8be9fd] sm:text-xs">
                PLAYER ONLINE
              </p>
              <h2 className="mt-2 truncate text-lg font-black text-[#ffe066] sm:text-2xl">
                {playerProfile.fullName}
              </h2>
            </div>
            <div className="border-2 border-[#63e6a8] bg-[#112a27] px-4 py-2 text-xs font-black text-[#63e6a8]">
              ● DEMO: IT WORLD
            </div>
          </div>
        </header>

        <section className="mx-auto mt-8 max-w-3xl text-center">
          <p className="text-[10px] tracking-[0.4em] text-[#8be9fd] sm:text-xs">
            CAREER WORLD MAP
          </p>
          <h1 className="mt-3 text-3xl font-black text-[#ffe066] drop-shadow-[3px_3px_0_#7c3aed] sm:text-5xl lg:text-6xl">
            CHỌN THẾ GIỚI
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#c4c8e8] sm:text-base">
            Trong bản demo, bạn sẽ trải nghiệm một ngày làm việc mô phỏng trong lĩnh vực CNTT.
          </p>
        </section>

        <section className="mt-7 grid gap-4 md:grid-cols-2 lg:gap-6">
          {careers.map((career, index) => (
            <motion.button
              key={career.id}
              type="button"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              whileHover={career.unlocked ? { y: -5 } : undefined}
              onClick={() => {
                if (career.unlocked) {
                  onSelectCareer(career.id);
                } else {
                  setLockedCareer(career);
                }
              }}
              className={[
                'relative min-h-[300px] overflow-hidden border-4 p-5 text-left shadow-[6px_6px_0_#070a17] sm:p-6',
                career.unlocked
                  ? 'border-[#8be9fd] bg-[#181d3a] hover:border-[#ffe066]'
                  : 'border-[#444a6d] bg-[#15182c] opacity-75',
              ].join(' ')}
            >
              {!career.unlocked && (
                <div className="absolute right-4 top-4 border-2 border-[#7c83a8] bg-[#0f1430] px-3 py-2 text-xs font-black text-[#aeb4dc]">
                  🔒 COMING SOON
                </div>
              )}
              <p className="text-5xl sm:text-6xl">{career.icon}</p>
              <p className="mt-5 text-[10px] tracking-[0.2em] text-[#8be9fd] sm:text-xs">
                {career.subtitle}
              </p>
              <h2 className="mt-2 text-xl font-black text-[#ffe066] sm:text-3xl">
                {career.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#c4c8e8] sm:text-base">
                {career.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {career.tags.map((tag) => (
                  <span
                    key={tag}
                    className="border-2 border-[#4d568c] bg-[#0f1430] px-3 py-2 text-xs text-[#c4c8e8]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.button>
          ))}
        </section>

        {lockedCareer && (
          <div className="mx-auto mt-6 max-w-3xl border-4 border-[#ffb84d] bg-[#3a2816] p-4 text-sm leading-7 text-[#ffe0b3] shadow-[6px_6px_0_#070a17] sm:p-5 sm:text-base">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <span className="text-4xl">🔒</span>
              <p className="flex-1">
                <strong className="text-[#ffd18b]">{lockedCareer.title}</strong> chưa được mở trong bản demo. Hãy chọn Công nghệ thông tin để tiếp tục.
              </p>
              <button
                type="button"
                onClick={() => setLockedCareer(null)}
                className="border-4 border-[#ffb84d] bg-[#7a3f12] px-4 py-3 font-black"
              >
                ĐÃ HIỂU
              </button>
            </div>
          </div>
        )}

        <div className="mt-8 pb-10">
          <button
            type="button"
            onClick={onBack}
            className="w-full border-4 border-[#7c83a8] bg-[#282d50] px-5 py-4 font-black shadow-[5px_5px_0_#000] sm:w-auto"
          >
            ◀ QUAY LẠI HỒ SƠ
          </button>
        </div>
      </div>
      <CrtOverlay />
    </main>
  );
}

function CrtOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 opacity-[0.05]"
      style={{
        backgroundImage:
          'repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, #000 4px)',
      }}
    />
  );
}
