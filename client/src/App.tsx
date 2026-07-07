import { useState } from 'react';

import { StartPage } from './pages/StartPage';
import {
  PlayerProfilePage,
  type PlayerProfile,
} from './pages/PlayerProfilePage';
import { CareerSelectPage } from './pages/CareerSelectPage';
import { BossBriefingPage } from './pages/BossBriefingPage';
import { HybridMissionPage } from './pages/HybridMissionPage';
import { ResultPage } from './pages/ResultPage';
import type { HybridMissionResult } from './game/hybridMissionTypes';

type GameScreen =
  | 'start'
  | 'profile'
  | 'career'
  | 'boss'
  | 'workspace'
  | 'result';

const DEMO_CAREER_ID = 'it';

function App() {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('start');
  const [playerProfile, setPlayerProfile] = useState<PlayerProfile | null>(null);
  const [selectedCareerId, setSelectedCareerId] = useState<string | null>(null);
  const [missionResult, setMissionResult] = useState<HybridMissionResult | null>(null);

  if (currentScreen === 'start') {
    return (
      <StartPage
        onStart={() => {
          setPlayerProfile(null);
          setSelectedCareerId(null);
          setMissionResult(null);
          setCurrentScreen('profile');
        }}
      />
    );
  }

  if (currentScreen === 'profile') {
    return (
      <PlayerProfilePage
        onBack={() => setCurrentScreen('start')}
        onContinue={(profile) => {
          setPlayerProfile(profile);
          setSelectedCareerId(null);
          setMissionResult(null);
          setCurrentScreen('career');
        }}
      />
    );
  }

  if (currentScreen === 'career' && playerProfile) {
    return (
      <CareerSelectPage
        playerProfile={playerProfile}
        onBack={() => setCurrentScreen('profile')}
        onSelectCareer={(careerId) => {
          if (careerId !== DEMO_CAREER_ID) {
            return;
          }

          setSelectedCareerId(careerId);
          setMissionResult(null);
          setCurrentScreen('boss');
        }}
      />
    );
  }

  if (
    currentScreen === 'boss' &&
    playerProfile &&
    selectedCareerId === DEMO_CAREER_ID
  ) {
    return (
      <BossBriefingPage
        playerProfile={playerProfile}
        onBack={() => setCurrentScreen('career')}
        onAcceptMission={() => {
          setMissionResult(null);
          setCurrentScreen('workspace');
        }}
      />
    );
  }

  if (
    currentScreen === 'workspace' &&
    playerProfile &&
    selectedCareerId === DEMO_CAREER_ID
  ) {
    return (
      <HybridMissionPage
        playerProfile={playerProfile}
        onBack={() => setCurrentScreen('boss')}
        onComplete={(result) => {
          setMissionResult(result);
          setCurrentScreen('result');
        }}
      />
    );
  }

  if (
    currentScreen === 'result' &&
    playerProfile &&
    selectedCareerId === DEMO_CAREER_ID &&
    missionResult
  ) {
    return (
      <ResultPage
        playerProfile={playerProfile}
        missionResult={missionResult}
        onReplayMission={() => {
          setMissionResult(null);
          setCurrentScreen('workspace');
        }}
        onBackToCareer={() => {
          setSelectedCareerId(null);
          setMissionResult(null);
          setCurrentScreen('career');
        }}
      />
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0d1024] px-4 text-white">
      <section className="w-full max-w-2xl border-4 border-[#ff5c7a] bg-[#11162f] p-6 text-center shadow-[8px_8px_0_#070a17]">
        <p className="text-6xl">🛠️</p>
        <h1 className="mt-5 text-2xl font-black text-[#ffe066]">GAME STATE ERROR</h1>
        <p className="mt-4 text-sm leading-7 text-[#c4c8e8]">
          Dữ liệu phiên chơi không đồng bộ. Hãy bắt đầu lại từ màn hình chính.
        </p>
        <button
          type="button"
          onClick={() => {
            setPlayerProfile(null);
            setSelectedCareerId(null);
            setMissionResult(null);
            setCurrentScreen('start');
          }}
          className="mt-6 w-full border-4 border-[#ffe066] bg-[#7c3aed] px-6 py-4 font-black shadow-[6px_6px_0_#000]"
        >
          ↻ BẮT ĐẦU LẠI
        </button>
      </section>
    </main>
  );
}

export default App;
