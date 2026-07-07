import { motion } from 'motion/react';

interface StartPageProps {
  onStart: () => void;
}

export function StartPage({ onStart }: StartPageProps) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-x-hidden bg-[#10162f] px-4 py-10 text-white sm:px-6">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[10%] top-[15%] h-1 w-1 bg-white" />
        <div className="absolute left-[25%] top-[30%] h-1 w-1 bg-[#ffe066]" />
        <div className="absolute left-[75%] top-[20%] h-1 w-1 bg-white" />
        <div className="absolute left-[85%] top-[45%] h-1 w-1 bg-[#8be9fd]" />
        <div className="absolute left-[15%] top-[70%] h-1 w-1 bg-[#8be9fd]" />
        <div className="absolute left-[65%] top-[75%] h-1 w-1 bg-white" />
      </div>

      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 flex w-full max-w-4xl flex-col items-center px-2 text-center sm:px-6"
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <p className="mb-4 text-[10px] tracking-[0.25em] text-[#8be9fd] sm:text-sm sm:tracking-[0.5em]">
            ✦ AI CAREER ROLEPLAY ✦
          </p>
          <h1 className="break-words text-4xl font-black leading-tight tracking-wider text-[#ffe066] drop-shadow-[4px_4px_0_#7c3aed] sm:text-5xl md:text-7xl">
            CAREER QUEST AI
          </h1>
        </motion.div>

        <p className="mt-7 max-w-xl text-sm leading-7 text-[#d6d9ff] sm:mt-8 sm:text-base sm:leading-8 md:text-xl">
          Gặp sếp, khách hàng, đồng đội và QA.
          <br />
          Hoàn thành nhiệm vụ. Phản ứng trong tình huống thật.
          <br />
          Khám phá cách bạn làm việc.
        </p>

        <motion.button
          type="button"
          onClick={onStart}
          whileHover={{ scale: 1.06, y: -4 }}
          whileTap={{ scale: 0.95 }}
          className="mt-10 w-full max-w-md cursor-pointer border-4 border-[#ffe066] bg-[#7c3aed] px-5 py-4 text-base font-black tracking-wider text-white shadow-[6px_6px_0_#000] transition-colors hover:bg-[#9333ea] sm:mt-12 sm:w-auto sm:px-8 sm:py-5 sm:text-lg md:text-2xl"
        >
          ▶ BẮT ĐẦU HÀNH TRÌNH
        </motion.button>

        <motion.p
          animate={{ opacity: [0.35, 1, 0.35] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          className="mt-8 text-[10px] tracking-[0.25em] text-[#8be9fd] sm:mt-10 sm:text-sm sm:tracking-[0.4em]"
        >
          PRESS START
        </motion.p>

        <p className="mt-8 text-xs text-[#7c83a8] sm:mt-10">VERSION 2.0 · AI ROLEPLAY</p>
      </motion.section>

      <div className="pointer-events-none fixed bottom-0 h-12 w-full border-t-4 border-[#60459b] bg-[#28204f] sm:h-20" />
      <CrtOverlay />
    </main>
  );
}

function CrtOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 opacity-[0.08]"
      style={{
        backgroundImage:
          'repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, #000 4px)',
      }}
    />
  );
}
