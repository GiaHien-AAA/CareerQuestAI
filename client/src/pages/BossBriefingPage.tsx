import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

import type { PlayerProfile } from './PlayerProfilePage';

interface BossBriefingPageProps {
  playerProfile: PlayerProfile;
  onBack: () => void;
  onAcceptMission: () => void;
}

export function BossBriefingPage({
  playerProfile,
  onBack,
  onAcceptMission,
}: BossBriefingPageProps) {
  const dialogues = getBossDialogues(playerProfile);
  const [dialogIndex, setDialogIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const currentDialog = dialogues[dialogIndex];
  const isLastDialog = dialogIndex === dialogues.length - 1;

  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    let characterIndex = 0;

    const timer = window.setInterval(() => {
      characterIndex += 1;
      setDisplayedText(currentDialog.slice(0, characterIndex));

      if (characterIndex >= currentDialog.length) {
        window.clearInterval(timer);
        setIsTyping(false);
      }
    }, 22);

    return () => window.clearInterval(timer);
  }, [currentDialog]);

  function advanceDialogue() {
    if (isTyping) {
      setDisplayedText(currentDialog);
      setIsTyping(false);
      return;
    }

    if (!isLastDialog) {
      setDialogIndex((current) => current + 1);
    }
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#0d1024] px-3 py-4 text-white sm:px-5 sm:py-6 lg:px-8">
      <div className="relative z-10 mx-auto w-full max-w-[1400px]">
        <header className="border-4 border-[#4d568c] bg-[#181d3a] p-4 shadow-[6px_6px_0_#070a17]">
          <p className="text-[10px] tracking-[0.3em] text-[#8be9fd] sm:text-xs">
            PIXEL TECH CORP · DAY 01
          </p>
          <h1 className="mt-2 text-xl font-black text-[#ffe066] sm:text-3xl">
            NGÀY LÀM VIỆC ĐẦU TIÊN
          </h1>
          <p className="mt-2 text-sm text-[#aeb4dc]">
            PLAYER: <span className="font-black text-[#63e6a8]">{playerProfile.fullName}</span>
          </p>
        </header>

        <section className="mt-5 grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
          <motion.aside
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex min-h-[300px] flex-col items-center justify-center border-4 border-[#7c3aed] bg-[#211944] p-5 shadow-[8px_8px_0_#070a17] lg:min-h-[520px]"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-center"
            >
              <div className="flex h-40 w-40 items-center justify-center border-4 border-[#ffe066] bg-[#28204f] text-7xl shadow-[7px_7px_0_#070a17]">
                👨‍💻
              </div>
              <h2 className="mt-5 text-2xl font-black text-[#ffe066]">BOSS BYTE</h2>
              <p className="mt-2 text-xs tracking-[0.2em] text-[#8be9fd]">SENIOR DEVELOPER</p>
            </motion.div>
          </motion.aside>

          <section className="overflow-hidden border-4 border-[#8be9fd] bg-[#11162f] shadow-[8px_8px_0_#070a17]">
            <div className="border-b-4 border-[#4d568c] bg-[#181d3a] p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] tracking-[0.25em] text-[#8be9fd] sm:text-xs">
                    BOSS BRIEFING
                  </p>
                  <h2 className="mt-2 text-lg font-black text-[#ffe066] sm:text-2xl">
                    HÀNH TRÌNH AI ROLEPLAY
                  </h2>
                </div>
                <span className="text-xs font-black text-[#63e6a8]">
                  {dialogIndex + 1} / {dialogues.length}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={advanceDialogue}
              className="min-h-[300px] w-full p-5 text-left sm:p-7 lg:min-h-[400px]"
            >
              <p className="text-base leading-8 text-[#f2f3ff] sm:text-lg sm:leading-9 lg:text-xl lg:leading-10">
                {displayedText}
                {isTyping && (
                  <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="ml-1 inline-block h-5 w-3 bg-[#ffe066]"
                  />
                )}
              </p>

              {!isTyping && !isLastDialog && (
                <p className="mt-8 text-right text-xs font-black text-[#8be9fd] sm:text-sm">
                  BẤM ĐỂ TIẾP TỤC ▼
                </p>
              )}
            </button>

            {!isTyping && isLastDialog && (
              <div className="border-t-4 border-[#4d568c] bg-[#181d3a] p-4 sm:p-6">
                <div className="mb-4 border-l-4 border-[#63e6a8] bg-[#112a27] p-4 text-sm leading-7 text-[#d6ffec] sm:text-base">
                  Trước mỗi task, nhân vật mới sẽ được giới thiệu. AI sẽ nhập vai người đó để giao nhiệm vụ và phản ứng với cách bạn xử lý.
                </div>
                <motion.button
                  type="button"
                  onClick={onAcceptMission}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full border-4 border-[#ffe066] bg-[#7c3aed] px-6 py-4 text-base font-black shadow-[7px_7px_0_#000] sm:text-lg"
                >
                  ⚔ BẮT ĐẦU ROLEPLAY
                </motion.button>
              </div>
            )}
          </section>
        </section>

        <div className="mt-7 pb-10">
          <button
            type="button"
            onClick={onBack}
            className="w-full border-4 border-[#7c83a8] bg-[#282d50] px-5 py-4 font-black sm:w-auto"
          >
            ◀ QUAY LẠI BẢN ĐỒ
          </button>
        </div>
      </div>
      <CrtOverlay />
    </main>
  );
}

function getBossDialogues(playerProfile: PlayerProfile) {
  return [
    `Chào ${playerProfile.fullName}. Tôi là Boss Byte. Hôm nay bạn sẽ không chỉ làm bài tập — bạn sẽ bước vào một ngày làm việc mô phỏng.`,
    'Bạn sẽ gặp nhiều người khác nhau: sếp, khách hàng, QA, quản lý dự án, đồng đội và mentor.',
    'Mỗi nhân vật sẽ được giới thiệu trước khi giao task. Sau khi bạn nhận nhiệm vụ, AI sẽ giữ đúng vai đó và phản ứng với cách bạn làm.',
    'Ba task đầu quan sát cách bạn sắp xếp quy trình. Ba stage sau là hội thoại nhiều lượt, nơi nhân vật có thể hỏi sâu hơn dựa trên chính câu trả lời của bạn.',
    'Đừng cố đoán “đáp án đẹp”. Hãy xử lý theo cách bạn thực sự sẽ làm. Hệ thống sẽ dùng cả hành động, phản hồi và lịch sử roleplay để phân tích cuối hành trình.',
    'Sẵn sàng bước vào nhiệm vụ đầu tiên chưa?',
  ];
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
