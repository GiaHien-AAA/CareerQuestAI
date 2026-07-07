import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

import type { PlayerProfile } from './PlayerProfilePage';
import {
  getRoleplayActor,
  getRoleplayScenario,
  type RoleplayStageId,
} from '../game/roleplayScenarioData';
import {
  getRoleplayIntro,
  type RoleplayIntro,
} from '../services/roleplayService';

interface CharacterBriefingPageProps {
  stageId: RoleplayStageId;
  playerProfile: PlayerProfile;
  onBack: () => void;
  onAccept: (intro: RoleplayIntro) => void;
}

export function CharacterBriefingPage({
  stageId,
  playerProfile,
  onBack,
  onAccept,
}: CharacterBriefingPageProps) {
  const scenario = getRoleplayScenario(stageId);
  const actor = scenario ? getRoleplayActor(scenario.actorId) : null;
  const [intro, setIntro] = useState<RoleplayIntro | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    setIsLoading(true);

    void getRoleplayIntro(stageId, playerProfile).then((result) => {
      if (!cancelled) {
        setIntro(result);
        setIsLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [playerProfile, stageId]);

  if (!scenario || !actor) {
    return null;
  }

  const missionTitle = intro?.missionTitle ?? scenario.missionTitle;
  const missionObjective = intro?.missionObjective ?? scenario.missionObjective;

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#0d1024] px-3 py-6 text-white sm:px-6 sm:py-10 lg:px-8">
      <BriefingBackground accent={actor.accent} />

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <div className="text-center">
          <p className="text-[10px] tracking-[0.35em] text-[#8be9fd] sm:text-xs sm:tracking-[0.5em]">
            CHARACTER INTRODUCTION
          </p>
          <p className="mt-3 text-sm font-black text-[#ffe066] sm:text-base">
            STAGE {scenario.stageNumber} / 6
          </p>
        </div>

        <div className="mt-6 grid gap-5 md:mt-8 md:grid-cols-[250px_minmax(0,1fr)] lg:grid-cols-[320px_minmax(0,1fr)]">
          <motion.aside
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex min-h-[260px] flex-col items-center justify-center border-4 p-5 shadow-[6px_6px_0_#070a17] md:min-h-[520px] md:shadow-[10px_10px_0_#070a17]"
            style={{
              borderColor: actor.accent,
              backgroundColor: actor.softAccent,
            }}
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-center"
            >
              <div
                className="mx-auto flex h-32 w-32 items-center justify-center border-4 border-[#070a17] bg-[#181d3a] text-6xl shadow-[7px_7px_0_#070a17] sm:h-40 sm:w-40 sm:text-7xl"
              >
                {actor.avatar}
              </div>

              <h1 className="mt-5 text-xl font-black text-[#ffe066] sm:text-2xl">
                {actor.name}
              </h1>

              <p className="mt-2 text-xs leading-6 text-[#d6d9ff] sm:text-sm">
                {actor.role}
              </p>

              <p className="mt-1 text-[10px] tracking-[0.2em] text-[#8be9fd] sm:text-xs">
                {actor.company}
              </p>
            </motion.div>

            <div className="mt-6 w-full border-2 border-[#4d568c] bg-[#0f1430] p-3 text-left">
              <p className="text-[9px] tracking-[0.2em] text-[#8be9fd] sm:text-xs">
                NHÂN VẬT NÀY LÀ AI?
              </p>
              <p className="mt-2 text-xs leading-6 text-[#c4c8e8] sm:text-sm">
                {actor.description}
              </p>
            </div>
          </motion.aside>

          <motion.section
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            className="overflow-hidden border-4 border-[#8be9fd] bg-[#11162f] shadow-[6px_6px_0_#070a17] md:shadow-[10px_10px_0_#070a17]"
          >
            <div className="border-b-4 border-[#4d568c] bg-[#181d3a] p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] tracking-[0.3em] text-[#8be9fd] sm:text-xs">
                    NEW ROLEPLAY MISSION
                  </p>
                  <h2 className="mt-2 text-xl font-black text-[#ffe066] sm:text-2xl lg:text-3xl">
                    {missionTitle}
                  </h2>
                </div>

                <span
                  className="border-2 px-3 py-2 text-xs font-black"
                  style={{
                    borderColor: actor.accent,
                    backgroundColor: actor.softAccent,
                    color: actor.accent,
                  }}
                >
                  {scenario.mode === 'drag' ? 'LOGIC TASK' : 'ROLEPLAY CHAT'}
                </span>
              </div>
            </div>

            <div className="p-4 sm:p-6 lg:p-7">
              <div
                className="border-l-4 bg-[#181d3a] p-4 sm:p-5"
                style={{ borderLeftColor: actor.accent }}
              >
                <p className="text-[10px] tracking-[0.25em] text-[#8be9fd] sm:text-xs">
                  {actor.name} NÓI
                </p>

                {isLoading ? (
                  <LoadingMessage />
                ) : (
                  <p className="mt-4 text-sm leading-7 text-[#f1f2ff] sm:text-base sm:leading-8">
                    {intro?.message}
                  </p>
                )}
              </div>

              <div className="mt-5 border-l-4 border-[#ffe066] bg-[#292315] p-4 sm:p-5">
                <p className="text-[10px] tracking-[0.25em] text-[#ffe066] sm:text-xs">
                  NHIỆM VỤ CỦA BẠN
                </p>
                <p className="mt-3 text-sm leading-7 text-[#fff7cf] sm:text-base sm:leading-8">
                  {missionObjective}
                </p>
              </div>

              <div className="mt-5 border-l-4 border-[#63e6a8] bg-[#112a27] p-4">
                <p className="text-[10px] tracking-[0.25em] text-[#63e6a8] sm:text-xs">
                  BỐI CẢNH
                </p>
                <p className="mt-3 text-sm leading-7 text-[#d6ffec]">
                  {scenario.context}
                </p>
              </div>

              {intro?.question && (
                <div className="mt-5 border-4 border-[#4d568c] bg-[#0f1430] p-4 sm:p-5">
                  <p className="text-[10px] tracking-[0.25em] text-[#8be9fd] sm:text-xs">
                    CÂU HỎI MỞ ĐẦU
                  </p>
                  <p className="mt-3 text-sm leading-7 text-white sm:text-base sm:leading-8">
                    {intro.question}
                  </p>
                </div>
              )}

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={onBack}
                  className="border-4 border-[#7c83a8] bg-[#282d50] px-5 py-3 font-black"
                >
                  ◀ QUAY LẠI
                </button>

                <motion.button
                  type="button"
                  disabled={isLoading || !intro}
                  onClick={() => {
                    if (intro) {
                      onAccept(intro);
                    }
                  }}
                  whileHover={isLoading ? undefined : { y: -4 }}
                  whileTap={isLoading ? undefined : { scale: 0.97 }}
                  className="flex-1 border-4 border-[#ffe066] bg-[#7c3aed] px-6 py-4 text-base font-black shadow-[6px_6px_0_#000] disabled:cursor-not-allowed disabled:opacity-50 sm:text-lg"
                >
                  {isLoading ? 'ĐANG KẾT NỐI NHÂN VẬT...' : 'NHẬN NHIỆM VỤ ▶'}
                </motion.button>
              </div>
            </div>
          </motion.section>
        </div>
      </div>

      <CrtOverlay />
    </main>
  );
}

function LoadingMessage() {
  return (
    <div className="mt-4 flex items-center gap-3 text-sm text-[#c4c8e8] sm:text-base">
      <motion.span
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="inline-block"
      >
        ◌
      </motion.span>
      AI đang nhập vai và chuẩn bị lời giao nhiệm vụ...
    </div>
  );
}

function BriefingBackground({ accent }: { accent: string }) {
  return (
    <div className="pointer-events-none fixed inset-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#1a2354_0%,#0d1024_48%,#080b19_100%)]" />
      <div className="absolute left-[7%] top-[12%] h-1 w-1 bg-white" />
      <div className="absolute right-[10%] top-[18%] h-1 w-1 bg-[#8be9fd]" />
      <div
        className="absolute bottom-[14%] left-[16%] h-2 w-2 opacity-70"
        style={{ backgroundColor: accent }}
      />
    </div>
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
