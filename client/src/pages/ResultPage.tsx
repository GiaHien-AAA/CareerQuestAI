import { useEffect, useState, type ReactNode } from 'react';
import { motion } from 'motion/react';

import type { PlayerProfile } from './PlayerProfilePage';
import type { HybridMissionResult } from '../game/hybridMissionTypes';

interface ResultPageProps {
  playerProfile: PlayerProfile;
  missionResult: HybridMissionResult;
  onReplayMission: () => void;
  onBackToCareer: () => void;
}

export function ResultPage({
  playerProfile,
  missionResult,
  onReplayMission,
  onBackToCareer,
}: ResultPageProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const { analysis } = missionResult;
  const hasReliableData = analysis.careerFit !== 'CHƯA ĐỦ DỮ LIỆU ĐỂ KẾT LUẬN';

  useEffect(() => {
    let current = 0;
    const target = analysis.overallScore;

    const timer = window.setInterval(() => {
      current += 1;
      setDisplayScore(Math.min(current, target));

      if (current >= target) {
        window.clearInterval(timer);
      }
    }, 18);

    return () => window.clearInterval(timer);
  }, [analysis.overallScore]);

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#0d1024] px-3 py-4 text-white sm:px-5 sm:py-6 lg:px-8">
      <div className="relative z-10 mx-auto w-full max-w-[1500px]">
        <header className="border-4 border-[#4d568c] bg-[#181d3a] p-4 shadow-[6px_6px_0_#070a17] sm:p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-[10px] tracking-[0.3em] text-[#63e6a8] sm:text-xs">
                AI ROLEPLAY ANALYSIS COMPLETE
              </p>
              <h1 className="mt-2 text-2xl font-black text-[#ffe066] sm:text-4xl lg:text-5xl">
                HỒ SƠ NĂNG LỰC
              </h1>
              <p className="mt-3 text-sm text-[#c4c8e8] sm:text-base">
                Kết quả của <strong className="text-[#8be9fd]">{playerProfile.fullName}</strong>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <HudBox label="STAGES" value="6 / 6" />
              <HudBox label="ROLEPLAY TURNS" value={`${missionResult.roleplayTurns.length}`} />
              <HudBox label="TIME" value={formatTime(missionResult.timeTaken)} />
              <HudBox label="ATTEMPTS" value={`${missionResult.attemptsUsed}`} />
            </div>
          </div>
        </header>

        <div className="mt-5 grid gap-5 xl:grid-cols-[340px_minmax(0,1fr)] xl:gap-7">
          <aside className="space-y-5">
            <section
              className={[
                'border-4 bg-[#181d3a] p-5 text-center shadow-[8px_8px_0_#070a17]',
                hasReliableData ? 'border-[#ffe066]' : 'border-[#ffb84d]',
              ].join(' ')}
            >
              <p className="text-[10px] tracking-[0.35em] text-[#8be9fd] sm:text-xs">OVERALL SCORE</p>
              <p className="mt-5 text-6xl font-black text-[#ffe066] drop-shadow-[4px_4px_0_#7c3aed] sm:text-8xl">
                {displayScore}
              </p>
              <p className="mt-2 text-lg font-black text-[#8be9fd]">/ 100</p>
              <div className="my-6 h-5 overflow-hidden border-2 border-[#070a17] bg-[#0f1430]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${analysis.overallScore}%` }}
                  transition={{ duration: 1.3 }}
                  className="h-full bg-[#63e6a8]"
                />
              </div>
              <div className="border-4 border-[#7c3aed] bg-[#211944] p-4">
                <p className="text-[10px] tracking-[0.25em] text-[#8be9fd] sm:text-xs">CAREER FIT</p>
                <h2 className="mt-3 text-lg font-black leading-7 text-[#ffe066] sm:text-xl">{analysis.careerFit}</h2>
              </div>
            </section>

            <section className="border-4 border-[#4d568c] bg-[#11162f] p-4 shadow-[6px_6px_0_#070a17] sm:p-5">
              <p className="text-[10px] tracking-[0.25em] text-[#8be9fd] sm:text-xs">EXPERIENCE DATA</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <MiniStat label="DRAG TASKS" value="3" />
                <MiniStat label="ROLEPLAY STAGES" value="3" />
                <MiniStat label="AI TURNS" value={`${missionResult.roleplayTurns.length}`} />
                <MiniStat label="BEHAVIOR EVENTS" value={`${missionResult.behaviorEvents.length}`} />
              </div>
            </section>
          </aside>

          <section className="min-w-0 space-y-5">
            <Panel title="PHÂN TÍCH 7 NĂNG LỰC" category="SKILL ANALYSIS" icon="📊">
              <div className="grid gap-5 md:grid-cols-2">
                <SkillBar label="TƯ DUY PHÂN TÍCH" icon="🧠" value={analysis.scores.analyticalThinking} />
                <SkillBar label="GIẢI QUYẾT VẤN ĐỀ" icon="🛠️" value={analysis.scores.problemSolving} />
                <SkillBar label="GIAO TIẾP" icon="💬" value={analysis.scores.communication} />
                <SkillBar label="LÀM VIỆC NHÓM" icon="🤝" value={analysis.scores.teamwork} />
                <SkillBar label="KHẢ NĂNG THÍCH NGHI" icon="⚡" value={analysis.scores.adaptability} />
                <SkillBar label="XỬ LÝ ÁP LỰC" icon="🧘" value={analysis.scores.pressureHandling} />
                <SkillBar label="SỰ KIÊN TRÌ" icon="🔥" value={analysis.scores.persistence} />
              </div>
            </Panel>

            <Panel title="PHONG CÁCH TƯ DUY" category="THINKING STYLE" icon="🧩">
              <p className="text-sm leading-7 text-[#e4e6ff] sm:text-base sm:leading-8">{analysis.thinkingStyle}</p>
            </Panel>

            <Panel title="NHẬN XÉT CÁ NHÂN" category="AI SUMMARY" icon="🤖">
              <p className="text-sm leading-7 text-[#e4e6ff] sm:text-base sm:leading-8">{analysis.personalizedSummary}</p>
            </Panel>

            <div className="grid gap-5 lg:grid-cols-2">
              <Panel title="ĐIỂM MẠNH" category="STRENGTHS" icon="⭐">
                <ResultList items={analysis.strengths} empty="Chưa đủ dữ liệu để xác định điểm mạnh nổi bật." tone="success" />
              </Panel>
              <Panel title="CẦN PHÁT TRIỂN" category="IMPROVEMENTS" icon="📈">
                <ResultList items={analysis.improvements} empty="Chưa có gợi ý phát triển." tone="warning" />
              </Panel>
            </div>

            <Panel title="VAI TRÒ CÓ THỂ PHÙ HỢP" category="CAREER PATH" icon="💼">
              {analysis.suitableRoles.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {analysis.suitableRoles.map((role) => (
                    <div key={role} className="border-4 border-[#4d568c] bg-[#181d3a] p-4 text-center">
                      <p className="text-4xl">{roleIcon(role)}</p>
                      <p className="mt-3 font-black leading-6 text-[#ffe066]">{role}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm leading-7 text-[#aeb4dc]">Chưa đủ dữ liệu để gợi ý vai trò nghề nghiệp.</p>
              )}
            </Panel>

            {!hasReliableData && (
              <div className="border-4 border-[#ffb84d] bg-[#3a2816] p-4 text-sm leading-7 text-[#ffe0b3] shadow-[6px_6px_0_#070a17] sm:p-5 sm:text-base">
                ⚠ Kết quả chưa đủ tin cậy. Hãy trải nghiệm lại và mô tả rõ cách bạn suy nghĩ để AI có thêm bằng chứng.
              </div>
            )}
          </section>
        </div>

        <div className="mt-8 flex flex-col gap-3 pb-10 sm:flex-row">
          <button
            type="button"
            onClick={onBackToCareer}
            className="border-4 border-[#7c83a8] bg-[#282d50] px-5 py-4 font-black shadow-[5px_5px_0_#000]"
          >
            ◀ BẢN ĐỒ NGHỀ NGHIỆP
          </button>
          <button
            type="button"
            onClick={onReplayMission}
            className="flex-1 border-4 border-[#ffe066] bg-[#7c3aed] px-6 py-4 text-base font-black shadow-[6px_6px_0_#000] sm:text-lg"
          >
            ↻ TRẢI NGHIỆM LẠI
          </button>
        </div>
      </div>
      <CrtOverlay />
    </main>
  );
}

function Panel({
  title,
  category,
  icon,
  children,
}: {
  title: string;
  category: string;
  icon: string;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden border-4 border-[#8be9fd] bg-[#11162f] shadow-[6px_6px_0_#070a17]">
      <div className="border-b-4 border-[#30375f] bg-[#181d3a] p-4 sm:p-5">
        <p className="text-[10px] tracking-[0.25em] text-[#8be9fd] sm:text-xs">{category}</p>
        <h2 className="mt-2 text-lg font-black text-[#ffe066] sm:text-xl">{icon} {title}</h2>
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </section>
  );
}

function SkillBar({ label, icon, value }: { label: string; icon: string; value: number }) {
  return (
    <div>
      <div className="mb-2 flex items-start justify-between gap-3">
        <p className="text-xs font-black leading-5 text-[#d6d9ff] sm:text-sm">{icon} {label}</p>
        <p className="shrink-0 font-black text-[#ffe066]">{value}%</p>
      </div>
      <div className="h-4 overflow-hidden border-2 border-[#070a17] bg-[#0f1430] sm:h-5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1 }}
          className={value >= 80 ? 'h-full bg-[#63e6a8]' : value >= 60 ? 'h-full bg-[#ffe066]' : 'h-full bg-[#ff5c7a]'}
        />
      </div>
    </div>
  );
}

function ResultList({
  items,
  empty,
  tone,
}: {
  items: string[];
  empty: string;
  tone: 'success' | 'warning';
}) {
  if (items.length === 0) {
    return <p className="text-sm leading-7 text-[#aeb4dc]">{empty}</p>;
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div
          key={`${item}-${index}`}
          className={[
            'border-l-4 bg-[#181d3a] p-3 text-sm leading-6',
            tone === 'success' ? 'border-[#63e6a8] text-[#d6ffec]' : 'border-[#ffb84d] text-[#ffe0b3]',
          ].join(' ')}
        >
          {tone === 'success' ? '✓' : '▶'} {item}
        </div>
      ))}
    </div>
  );
}

function HudBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 border-2 border-[#4d568c] bg-[#0f1430] px-2 py-2 text-center">
      <p className="text-[8px] tracking-wider text-[#8be9fd]">{label}</p>
      <p className="mt-1 truncate text-xs font-black text-[#ffe066] sm:text-sm">{value}</p>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-2 border-[#4d568c] bg-[#0f1430] p-3 text-center">
      <p className="text-[8px] tracking-[0.15em] text-[#8be9fd]">{label}</p>
      <p className="mt-2 font-black text-[#ffe066]">{value}</p>
    </div>
  );
}

function roleIcon(role: string) {
  const normalized = role.toLowerCase();
  if (normalized.includes('software')) return '💻';
  if (normalized.includes('business')) return '📊';
  if (normalized.includes('qa') || normalized.includes('tester')) return '🔍';
  if (normalized.includes('support')) return '🛠️';
  return '📋';
}

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
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
