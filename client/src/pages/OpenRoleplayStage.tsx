import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';

import type { PlayerProfile } from './PlayerProfilePage';
import { CharacterBriefingPage } from './CharacterBriefingPage';
import type { OpenMission } from '../game/hybridMissionData';
import type { OpenAnswer, RoleplayTurn } from '../game/hybridMissionTypes';
import {
  getRoleplayActor,
  getRoleplayScenario,
} from '../game/roleplayScenarioData';
import {
  sendRoleplayTurn,
  type RoleplayIntro,
  type RoleplayReply,
} from '../services/roleplayService';

interface OpenRoleplayStageResult {
  openAnswer: OpenAnswer;
  roleplayTurns: RoleplayTurn[];
}

interface OpenRoleplayStageProps {
  mission: OpenMission;
  playerProfile: PlayerProfile;
  onBack: () => void;
  onComplete: (result: OpenRoleplayStageResult) => void;
}

type Screen = 'briefing' | 'conversation';

interface ChatMessage {
  id: string;
  speaker: 'actor' | 'player';
  name: string;
  avatar: string;
  text: string;
}

export function OpenRoleplayStage({
  mission,
  playerProfile,
  onBack,
  onComplete,
}: OpenRoleplayStageProps) {
  const scenario = getRoleplayScenario(mission.stageId);
  const actor = scenario ? getRoleplayActor(scenario.actorId) : null;
  const [screen, setScreen] = useState<Screen>('briefing');
  const [intro, setIntro] = useState<RoleplayIntro | null>(null);
  const [interactionId, setInteractionId] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [playerResponses, setPlayerResponses] = useState<string[]>([]);
  const [roleplayTurns, setRoleplayTurns] = useState<RoleplayTurn[]>([]);
  const [answer, setAnswer] = useState('');
  const [secondsPassed, setSecondsPassed] = useState(0);
  const [turnNumber, setTurnNumber] = useState(1);
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [completionReply, setCompletionReply] = useState<RoleplayReply | null>(null);

  useEffect(() => {
    setScreen('briefing');
    setIntro(null);
    setInteractionId('');
    setMessages([]);
    setPlayerResponses([]);
    setRoleplayTurns([]);
    setAnswer('');
    setSecondsPassed(0);
    setTurnNumber(1);
    setIsSending(false);
    setErrorMessage('');
    setCompletionReply(null);
  }, [mission.id]);

  useEffect(() => {
    if (screen !== 'conversation' || completionReply) {
      return;
    }

    const timer = window.setInterval(() => {
      setSecondsPassed((current) => current + 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [screen, completionReply]);

  const currentPrompt = useMemo(() => {
    const lastActorMessage = [...messages].reverse().find((item) => item.speaker === 'actor');
    return lastActorMessage?.text ?? scenario?.initialQuestion ?? '';
  }, [messages, scenario?.initialQuestion]);

  if (!scenario || !actor) {
    return null;
  }

  const activeScenario = scenario;

  if (screen === 'briefing') {
    return (
      <CharacterBriefingPage
        stageId={mission.stageId}
        playerProfile={playerProfile}
        onBack={onBack}
        onAccept={(acceptedIntro) => {
          setIntro(acceptedIntro);
          setInteractionId(acceptedIntro.interactionId);
          setMessages([
            {
              id: `actor-intro-${mission.id}`,
              speaker: 'actor',
              name: acceptedIntro.actorName,
              avatar: acceptedIntro.actorAvatar,
              text: acceptedIntro.question || scenario.initialQuestion || acceptedIntro.message,
            },
          ]);
          setScreen('conversation');
        }}
      />
    );
  }

  async function submitAnswer() {
    const cleanAnswer = answer.trim();

    if (cleanAnswer.length < mission.minimumLength) {
      setErrorMessage(
        `Hãy mô tả cụ thể hơn. Cần ít nhất ${mission.minimumLength} ký tự để nhân vật có thể phản ứng đúng ngữ cảnh.`,
      );
      return;
    }

    setErrorMessage('');
    setIsSending(true);

    const playerMessage: ChatMessage = {
      id: `player-${mission.id}-${turnNumber}-${Date.now()}`,
      speaker: 'player',
      name: playerProfile.fullName,
      avatar: '🧑‍💻',
      text: cleanAnswer,
    };

    setMessages((current) => [...current, playerMessage]);
    setAnswer('');

    try {
      const reply = await sendRoleplayTurn({
        stageId: mission.stageId,
        playerProfile,
        previousInteractionId: interactionId || intro?.interactionId,
        eventType: turnNumber === 1 ? 'player_response' : 'follow_up_response',
        playerMessage: cleanAnswer,
        turnNumber,
        timeTaken: secondsPassed,
      });

      const actorResponseText = reply.shouldContinue && reply.followUpQuestion
        ? `${reply.message}\n\n${reply.followUpQuestion}`
        : reply.message;

      setInteractionId(reply.interactionId || interactionId);
      setPlayerResponses((current) => [...current, cleanAnswer]);
      setRoleplayTurns((current) => [
        ...current,
        {
          stageId: mission.stageId,
          stageNumber: mission.stageNumber,
          actorId: reply.actorId,
          actorName: reply.actorName,
          actorRole: reply.actorRole,
          aiMessage: actorResponseText,
          playerResponse: cleanAnswer,
          eventType: turnNumber === 1 ? 'player_response' : 'follow_up_response',
          timeTaken: secondsPassed,
          observation: reply.observation,
        },
      ]);
      setMessages((current) => [
        ...current,
        {
          id: `actor-${mission.id}-${turnNumber}-${Date.now()}`,
          speaker: 'actor',
          name: reply.actorName,
          avatar: reply.actorAvatar,
          text: actorResponseText,
        },
      ]);

      const reachedMaxTurns = turnNumber >= activeScenario.maxConversationTurns;

      if (reply.stageComplete || !reply.shouldContinue || reachedMaxTurns) {
        setCompletionReply(reply);
      } else {
        setTurnNumber((current) => current + 1);
      }
    } finally {
      setIsSending(false);
    }
  }

  function finishStage() {
    const responses = [...playerResponses];

    if (responses.length === 0 && answer.trim()) {
      responses.push(answer.trim());
    }

    onComplete({
      openAnswer: {
        stageId: mission.id,
        question: activeScenario.initialQuestion ?? currentPrompt,
        answer: responses.join('\n\n--- PHẢN HỒI TIẾP THEO ---\n\n'),
        timeTaken: secondsPassed,
      },
      roleplayTurns,
    });
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#0d1024] px-3 py-4 text-white sm:px-5 sm:py-6 lg:px-8">
      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <header className="border-4 border-[#4d568c] bg-[#181d3a] p-4 shadow-[6px_6px_0_#070a17]">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-[10px] tracking-[0.3em] text-[#8be9fd] sm:text-xs">
                LIVE ROLEPLAY · STAGE {mission.stageNumber} / 6
              </p>
              <h1 className="mt-2 text-xl font-black text-[#ffe066] sm:text-3xl">
                {mission.title}
              </h1>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              <HudBox label="CHARACTER" value={actor.name} />
              <HudBox label="TURN" value={`${turnNumber} / ${activeScenario.maxConversationTurns}`} />
              <HudBox label="TIME" value={formatTime(secondsPassed)} />
            </div>
          </div>
        </header>

        <section className="mt-5 grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside
            className="border-4 p-4 shadow-[6px_6px_0_#070a17] sm:p-5"
            style={{
              borderColor: actor.accent,
              backgroundColor: actor.softAccent,
            }}
          >
            <div className="text-center">
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-7xl"
              >
                {actor.avatar}
              </motion.div>
              <h2 className="mt-4 text-xl font-black text-[#ffe066]">{actor.name}</h2>
              <p className="mt-2 text-xs leading-6 text-[#d6d9ff]">{actor.role}</p>
            </div>

            <div className="mt-5 border-2 border-[#4d568c] bg-[#0f1430] p-3">
              <p className="text-[9px] tracking-[0.2em] text-[#8be9fd] sm:text-xs">
                AI ĐANG QUAN SÁT
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {mission.evaluationFocus.map((item) => (
                  <span
                    key={item}
                    className="border border-[#4d568c] bg-[#181d3a] px-2 py-1 text-[10px] text-[#c4c8e8] sm:text-xs"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </aside>

          <section className="min-w-0 overflow-hidden border-4 border-[#8be9fd] bg-[#11162f] shadow-[6px_6px_0_#070a17] sm:shadow-[10px_10px_0_#070a17]">
            <div className="border-b-4 border-[#4d568c] bg-[#181d3a] p-4 sm:p-5">
              <p className="text-[10px] tracking-[0.25em] text-[#8be9fd] sm:text-xs">
                CONVERSATION LOG
              </p>
              <p className="mt-2 text-xs leading-6 text-[#aeb4dc] sm:text-sm">
                Nhân vật sẽ phản ứng với chính câu trả lời của bạn và có thể hỏi sâu thêm.
              </p>
            </div>

            <div className="max-h-[520px] space-y-4 overflow-y-auto p-4 sm:p-5">
              {messages.map((message) => (
                <ChatBubble key={message.id} message={message} />
              ))}
              {isSending && (
                <div className="border-l-4 border-[#8be9fd] bg-[#181d3a] p-4 text-sm text-[#c4c8e8]">
                  {actor.name} đang suy nghĩ và phản ứng...
                </div>
              )}
            </div>

            {!completionReply ? (
              <div className="border-t-4 border-[#30375f] bg-[#181d3a] p-4 sm:p-5">
                <label className="text-[10px] font-black tracking-[0.25em] text-[#8be9fd] sm:text-xs">
                  PHẢN HỒI CỦA BẠN
                </label>
                <textarea
                  value={answer}
                  disabled={isSending}
                  onChange={(event) => {
                    setAnswer(event.target.value);
                    setErrorMessage('');
                  }}
                  rows={6}
                  placeholder="Hãy nói rõ bạn sẽ làm gì, nói gì và vì sao..."
                  className="mt-3 min-h-[160px] w-full resize-y border-4 border-[#4d568c] bg-[#0c1025] p-4 text-sm leading-7 text-white outline-none placeholder:text-[#686e91] focus:border-[#ffe066] disabled:opacity-60 sm:text-base"
                />

                <div className="mt-2 flex flex-col gap-2 text-xs sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-[#7c83a8]">Không cần dùng thuật ngữ chuyên môn.</span>
                  <span className="font-black text-[#ffe066]">
                    {answer.trim().length} / {mission.minimumLength}
                  </span>
                </div>

                {errorMessage && (
                  <div className="mt-3 border-2 border-[#ff5c7a] bg-[#38162b] p-3 text-sm text-[#ffd6de]">
                    ⚠ {errorMessage}
                  </div>
                )}

                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={onBack}
                    className="border-4 border-[#7c83a8] bg-[#282d50] px-5 py-3 font-black"
                  >
                    ◀ QUAY LẠI
                  </button>
                  <motion.button
                    type="button"
                    disabled={isSending}
                    onClick={() => void submitAnswer()}
                    whileHover={isSending ? undefined : { y: -4 }}
                    className="flex-1 border-4 border-[#ffe066] bg-[#7c3aed] px-6 py-4 font-black shadow-[6px_6px_0_#000] disabled:opacity-50"
                  >
                    {isSending ? 'AI ĐANG PHẢN HỒI...' : 'GỬI PHẢN HỒI ▶'}
                  </motion.button>
                </div>
              </div>
            ) : (
              <div className="border-t-4 border-[#63e6a8] bg-[#112a27] p-4 sm:p-5">
                <p className="text-[10px] tracking-[0.25em] text-[#63e6a8] sm:text-xs">
                  ROLEPLAY STAGE COMPLETE
                </p>
                <p className="mt-3 text-sm leading-7 text-[#d6ffec] sm:text-base">
                  {completionReply.message}
                </p>
                <motion.button
                  type="button"
                  onClick={finishStage}
                  whileHover={{ y: -4 }}
                  className="mt-5 w-full border-4 border-[#ffe066] bg-[#7c3aed] px-6 py-4 font-black shadow-[6px_6px_0_#000]"
                >
                  {mission.stageNumber === 6 ? 'BẮT ĐẦU PHÂN TÍCH ▶' : 'GẶP NHÂN VẬT TIẾP THEO ▶'}
                </motion.button>
              </div>
            )}
          </section>
        </section>
      </div>
      <CrtOverlay />
    </main>
  );
}

function ChatBubble({ message }: { message: ChatMessage }) {
  const isPlayer = message.speaker === 'player';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={isPlayer ? 'ml-auto max-w-[88%]' : 'mr-auto max-w-[92%]'}
    >
      <div
        className={[
          'border-4 p-4',
          isPlayer
            ? 'border-[#7c3aed] bg-[#211944]'
            : 'border-[#4d568c] bg-[#181d3a]',
        ].join(' ')}
      >
        <p className="text-[10px] font-black tracking-[0.2em] text-[#8be9fd] sm:text-xs">
          {message.avatar} {message.name}
        </p>
        <p className="mt-3 whitespace-pre-line text-sm leading-7 text-[#f1f2ff] sm:text-base sm:leading-8">
          {message.text}
        </p>
      </div>
    </motion.div>
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
