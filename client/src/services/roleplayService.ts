import type { PlayerProfile } from '../pages/PlayerProfilePage';
import {
  getRoleplayActor,
  getRoleplayScenario,
  type RoleplayActorId,
  type RoleplayStageId,
} from '../game/roleplayScenarioData';

export type RoleplayTone =
  | 'calm'
  | 'serious'
  | 'encouraging'
  | 'concerned'
  | 'challenging';

export interface RoleplayIntro {
  interactionId: string;
  stageId: RoleplayStageId;
  actorId: RoleplayActorId;
  actorName: string;
  actorRole: string;
  actorAvatar: string;
  missionTitle: string;
  missionObjective: string;
  message: string;
  question: string;
  tone: RoleplayTone;
  source: 'gemini' | 'mock' | 'frontend-fallback';
}

export interface RoleplayReply {
  interactionId: string;
  stageId: RoleplayStageId;
  actorId: RoleplayActorId;
  actorName: string;
  actorRole: string;
  actorAvatar: string;
  message: string;
  followUpQuestion: string;
  hint: string;
  shouldContinue: boolean;
  stageComplete: boolean;
  observation: string;
  tone: RoleplayTone;
  source: 'gemini' | 'mock' | 'frontend-fallback';
}

export type RoleplayEventType =
  | 'wrong_attempt'
  | 'success_attempt'
  | 'player_response'
  | 'follow_up_response';

export interface RoleplayTurnRequest {
  stageId: RoleplayStageId;
  playerProfile: PlayerProfile;
  previousInteractionId?: string;
  eventType: RoleplayEventType;
  playerMessage?: string;
  playerAction?: string[];
  attemptNumber?: number;
  turnNumber?: number;
  timeTaken?: number;
}

interface ApiSuccess<T> {
  success: true;
  data: T;
}

const API_BASE_URL = getApiBaseUrl();
const REQUEST_TIMEOUT_MS = 12000;
const introCache = new Map<string, Promise<RoleplayIntro>>();

export async function getRoleplayIntro(
  stageId: RoleplayStageId,
  playerProfile: PlayerProfile,
): Promise<RoleplayIntro> {
  const cacheKey = `${stageId}:${playerProfile.fullName}:${playerProfile.userType}`;
  const cached = introCache.get(cacheKey);

  if (cached) {
    return cached;
  }

  const request = (async () => {
    try {
      return await postJson<RoleplayIntro>('/api/roleplay/intro', {
        stageId,
        playerProfile,
      });
    } catch (error) {
      console.warn('[ROLEPLAY] Intro fallback activated.', error);
      return createFrontendIntroFallback(stageId, playerProfile);
    }
  })();

  introCache.set(cacheKey, request);

  // Giữ promise trong thời gian ngắn để React StrictMode không gọi API hai lần,
  // nhưng xóa sau đó để lần chơi lại có thể nhận lời giới thiệu AI mới.
  void request.finally(() => {
    window.setTimeout(() => {
      if (introCache.get(cacheKey) === request) {
        introCache.delete(cacheKey);
      }
    }, 1000);
  });

  return request;
}

export async function sendRoleplayTurn(
  request: RoleplayTurnRequest,
): Promise<RoleplayReply> {
  try {
    return await postJson<RoleplayReply>('/api/roleplay/turn', request);
  } catch (error) {
    console.warn('[ROLEPLAY] Turn fallback activated.', error);
    return createFrontendTurnFallback(request);
  }
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    const payload = (await response.json()) as ApiSuccess<T> | {
      success: false;
      message?: string;
    };

    if (!response.ok || payload.success !== true) {
      throw new Error(
        'message' in payload && payload.message
          ? payload.message
          : `Roleplay API error: HTTP ${response.status}`,
      );
    }

    return payload.data;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

function createFrontendIntroFallback(
  stageId: RoleplayStageId,
  playerProfile: PlayerProfile,
): RoleplayIntro {
  const scenario = getRoleplayScenario(stageId);

  if (!scenario) {
    throw new Error(`Không tìm thấy scenario ${stageId}.`);
  }

  const actor = getRoleplayActor(scenario.actorId);

  return {
    interactionId: '',
    stageId,
    actorId: actor.id,
    actorName: actor.name,
    actorRole: actor.role,
    actorAvatar: actor.avatar,
    missionTitle: scenario.missionTitle,
    missionObjective: scenario.missionObjective,
    message: `${playerProfile.fullName}, tôi là ${actor.name}. ${scenario.context} Tôi muốn bạn xử lý tình huống theo cách tự nhiên nhất của mình.`,
    question: scenario.initialQuestion ?? '',
    tone: 'serious',
    source: 'frontend-fallback',
  };
}

function createFrontendTurnFallback(
  request: RoleplayTurnRequest,
): RoleplayReply {
  const scenario = getRoleplayScenario(request.stageId);

  if (!scenario) {
    throw new Error(`Không tìm thấy scenario ${request.stageId}.`);
  }

  const actor = getRoleplayActor(scenario.actorId);
  const attempt = request.attemptNumber ?? 1;

  if (request.eventType === 'wrong_attempt') {
    return {
      interactionId: request.previousInteractionId ?? '',
      stageId: request.stageId,
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      actorAvatar: actor.avatar,
      message:
        attempt === 1
          ? 'Cách sắp xếp hiện tại chưa tạo ra quy trình hợp lý. Đừng thử ngẫu nhiên; hãy nhìn lại việc nào cần xảy ra trước.'
          : 'Bạn đang tiến gần hơn, nhưng trình tự vẫn còn một điểm chưa hợp lý. Hãy kiểm tra xem dữ liệu đã sẵn sàng trước khi xử lý chưa.',
      followUpQuestion: '',
      hint:
        attempt >= 3
          ? 'Hãy nghĩ theo chuỗi: có dữ liệu → xử lý → đưa ra kết quả.'
          : 'Tự hỏi: bước này có thể xảy ra khi bước trước chưa hoàn tất không?',
      shouldContinue: false,
      stageComplete: false,
      observation: 'Người chơi cần điều chỉnh trình tự xử lý.',
      tone: 'challenging',
      source: 'frontend-fallback',
    };
  }

  if (request.eventType === 'success_attempt') {
    return {
      interactionId: request.previousInteractionId ?? '',
      stageId: request.stageId,
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      actorAvatar: actor.avatar,
      message:
        'Tốt. Bạn đã sắp xếp công việc theo một trình tự có thể giải thích được, thay vì chỉ thử cho đến khi may mắn đúng.',
      followUpQuestion: '',
      hint: '',
      shouldContinue: false,
      stageComplete: true,
      observation: 'Người chơi hoàn thành đúng quy trình.',
      tone: 'encouraging',
      source: 'frontend-fallback',
    };
  }

  const isFirstTurn = (request.turnNumber ?? 1) <= 1;

  return {
    interactionId: request.previousInteractionId ?? '',
    stageId: request.stageId,
    actorId: actor.id,
    actorName: actor.name,
    actorRole: actor.role,
    actorAvatar: actor.avatar,
    message: isFirstTurn
      ? 'Tôi đã hiểu cách bạn định xử lý. Tôi muốn biết rõ hơn điều gì khiến bạn chọn thứ tự đó.'
      : 'Cảm ơn. Cách bạn giải thích giúp tôi hiểu rõ hơn cách bạn suy nghĩ trong tình huống này.',
    followUpQuestion: isFirstTurn
      ? 'Nếu bước ưu tiên đầu tiên của bạn không hiệu quả, bạn sẽ thay đổi kế hoạch như thế nào?'
      : '',
    hint: '',
    shouldContinue: isFirstTurn,
    stageComplete: !isFirstTurn,
    observation: 'Người chơi đã mô tả cách xử lý tình huống.',
    tone: isFirstTurn ? 'challenging' : 'encouraging',
    source: 'frontend-fallback',
  };
}

function getApiBaseUrl() {
  const configuredUrl = import.meta.env.VITE_API_BASE_URL;

  if (typeof configuredUrl === 'string' && configuredUrl.trim()) {
    return configuredUrl.trim().replace(/\/+$/, '');
  }

  return 'http://localhost:3000';
}
