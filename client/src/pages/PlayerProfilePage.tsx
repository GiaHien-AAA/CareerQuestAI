import { useState, type FormEvent } from 'react';
import { motion } from 'motion/react';

export type UserType = 'student' | 'university' | 'worker';

export interface PlayerProfile {
  fullName: string;
  email: string;
  userType: UserType;
}

interface PlayerProfilePageProps {
  onBack: () => void;
  onContinue: (profile: PlayerProfile) => void;
}

const userTypeOptions: Array<{
  value: UserType;
  icon: string;
  title: string;
  description: string;
}> = [
  {
    value: 'student',
    icon: '🎒',
    title: 'HỌC SINH',
    description: 'Đang tìm hiểu ngành nghề cho tương lai.',
  },
  {
    value: 'university',
    icon: '🎓',
    title: 'SINH VIÊN',
    description: 'Muốn khám phá mức độ phù hợp với nghề.',
  },
  {
    value: 'worker',
    icon: '💼',
    title: 'ĐI LÀM',
    description: 'Muốn trải nghiệm một hướng nghề nghiệp mới.',
  },
];

export function PlayerProfilePage({
  onBack,
  onContinue,
}: PlayerProfilePageProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState<UserType>('university');
  const [errorMessage, setErrorMessage] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanName = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();
    const validationError = validateProfile(cleanName, cleanEmail);

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    onContinue({
      fullName: cleanName,
      email: cleanEmail,
      userType,
    });
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#0d1024] px-3 py-6 text-white sm:px-6 sm:py-10 lg:px-8">
      <BackgroundDecor />

      <div className="relative z-10 mx-auto w-full max-w-5xl">
        <header className="text-center">
          <p className="text-[10px] tracking-[0.35em] text-[#8be9fd] sm:text-xs sm:tracking-[0.5em]">
            CAREER QUEST AI
          </p>
          <h1 className="mt-3 text-2xl font-black text-[#ffe066] sm:text-3xl lg:text-5xl">
            TẠO HỒ SƠ NGƯỜI CHƠI
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#aeb4dc] sm:text-base">
            AI sẽ gọi tên bạn và điều chỉnh cách nhập vai theo giai đoạn hiện tại của bạn.
          </p>
        </header>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-7 overflow-hidden border-4 border-[#8be9fd] bg-[#11162f] shadow-[6px_6px_0_#070a17] sm:shadow-[10px_10px_0_#070a17]"
        >
          <div className="border-b-4 border-[#4d568c] bg-[#181d3a] p-4 sm:p-5">
            <p className="text-[10px] tracking-[0.3em] text-[#8be9fd] sm:text-xs">
              PLAYER REGISTRATION
            </p>
            <h2 className="mt-2 text-xl font-black text-[#ffe066] sm:text-2xl">
              THÔNG TIN CƠ BẢN
            </h2>
          </div>

          <div className="p-4 sm:p-6 lg:p-8">
            <div className="grid gap-5 md:grid-cols-2">
              <FormField
                label="HỌ VÀ TÊN"
                value={fullName}
                placeholder="Ví dụ: Phan Gia Hiển"
                type="text"
                onChange={(value) => {
                  setFullName(value);
                  setErrorMessage('');
                }}
              />
              <FormField
                label="EMAIL"
                value={email}
                placeholder="Ví dụ: player@gmail.com"
                type="email"
                onChange={(value) => {
                  setEmail(value);
                  setErrorMessage('');
                }}
              />
            </div>

            <section className="mt-7">
              <p className="text-[10px] font-black tracking-[0.25em] text-[#8be9fd] sm:text-xs">
                BẠN ĐANG Ở GIAI ĐOẠN NÀO?
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {userTypeOptions.map((option) => {
                  const selected = option.value === userType;
                  return (
                    <motion.button
                      key={option.value}
                      type="button"
                      onClick={() => setUserType(option.value)}
                      whileHover={{ y: -4 }}
                      whileTap={{ scale: 0.97 }}
                      className={[
                        'min-h-[150px] border-4 p-4 text-left',
                        selected
                          ? 'border-[#ffe066] bg-[#7c3aed] shadow-[5px_5px_0_#070a17]'
                          : 'border-[#4d568c] bg-[#181d3a] hover:border-[#8be9fd]',
                      ].join(' ')}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="text-4xl">{option.icon}</span>
                        <span className="font-black text-[#ffe066]">{selected ? '✓' : ''}</span>
                      </div>
                      <p className="mt-4 font-black text-[#ffe066]">{option.title}</p>
                      <p className="mt-2 text-xs leading-6 text-[#d6d9ff] sm:text-sm">
                        {option.description}
                      </p>
                    </motion.button>
                  );
                })}
              </div>
            </section>

            {errorMessage && (
              <div className="mt-6 border-4 border-[#ff5c7a] bg-[#38162b] p-4 text-sm leading-6 text-[#ffd6de]">
                ⚠ {errorMessage}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 border-t-4 border-[#30375f] bg-[#181d3a] p-4 sm:flex-row sm:p-5">
            <button
              type="button"
              onClick={onBack}
              className="border-4 border-[#7c83a8] bg-[#282d50] px-5 py-3 font-black"
            >
              ◀ QUAY LẠI
            </button>
            <motion.button
              type="submit"
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.97 }}
              className="flex-1 border-4 border-[#ffe066] bg-[#7c3aed] px-6 py-4 text-base font-black shadow-[6px_6px_0_#000] sm:text-lg"
            >
              TIẾP TỤC HÀNH TRÌNH ▶
            </motion.button>
          </div>
        </motion.form>
      </div>

      <CrtOverlay />
    </main>
  );
}

function FormField({
  label,
  value,
  placeholder,
  type,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  type: 'text' | 'email';
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-[10px] font-black tracking-[0.25em] text-[#8be9fd] sm:text-xs">
        {label}
      </span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-3 w-full border-4 border-[#4d568c] bg-[#0c1025] px-4 py-3 text-sm text-white outline-none placeholder:text-[#686e91] focus:border-[#ffe066] sm:px-5 sm:py-4 sm:text-base"
      />
    </label>
  );
}

function validateProfile(fullName: string, email: string) {
  if (fullName.length < 2) {
    return 'Họ và tên cần có ít nhất 2 ký tự.';
  }

  if (!/^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(email) || email.includes('..')) {
    return 'Email chưa hợp lệ. Ví dụ đúng: player@gmail.com';
  }

  return '';
}

function BackgroundDecor() {
  return (
    <div className="pointer-events-none fixed inset-0">
      <div className="absolute left-[7%] top-[10%] h-1 w-1 bg-white" />
      <div className="absolute right-[8%] top-[18%] h-1 w-1 bg-[#8be9fd]" />
      <div className="absolute bottom-[18%] left-[15%] h-1 w-1 bg-[#ffe066]" />
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
