const {
  createRoleplayIntro,
  createRoleplayTurn,
} = require('../services/aiRoleplayService');
const {
  getScenario,
} = require('../services/roleplayScenarioData');

async function handleRoleplayIntro(req, res) {
  try {
    const input = validateIntroInput(req.body);
    const result = await createRoleplayIntro(input);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return handleError(error, res);
  }
}

async function handleRoleplayTurn(req, res) {
  try {
    const input = validateTurnInput(req.body);
    const result = await createRoleplayTurn(input);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return handleError(error, res);
  }
}

function validateIntroInput(body) {
  if (!body || typeof body !== 'object') {
    throw createHttpError(400, 'INVALID_REQUEST_BODY', 'Dữ liệu roleplay không hợp lệ.');
  }

  const stageId = String(body.stageId || '').trim();
  const playerProfile = validatePlayerProfile(body.playerProfile);

  if (!getScenario(stageId)) {
    throw createHttpError(404, 'ROLEPLAY_STAGE_NOT_FOUND', 'Không tìm thấy stage roleplay.');
  }

  return {
    stageId,
    playerProfile,
  };
}

function validateTurnInput(body) {
  const base = validateIntroInput(body);
  const allowedEvents = [
    'wrong_attempt',
    'success_attempt',
    'player_response',
    'follow_up_response',
  ];
  const eventType = String(body.eventType || '').trim();

  if (!allowedEvents.includes(eventType)) {
    throw createHttpError(400, 'INVALID_ROLEPLAY_EVENT', 'Loại sự kiện roleplay không hợp lệ.');
  }

  return {
    ...base,
    previousInteractionId: String(body.previousInteractionId || '').trim(),
    eventType,
    playerMessage: String(body.playerMessage || '').trim(),
    playerAction: Array.isArray(body.playerAction)
      ? body.playerAction.map((item) => String(item || '').trim()).filter(Boolean)
      : [],
    attemptNumber: Math.max(0, Number(body.attemptNumber) || 0),
    turnNumber: Math.max(1, Number(body.turnNumber) || 1),
    timeTaken: Math.max(0, Number(body.timeTaken) || 0),
  };
}

function validatePlayerProfile(value) {
  if (!value || typeof value !== 'object') {
    throw createHttpError(400, 'INVALID_PLAYER_PROFILE', 'Thông tin người chơi không hợp lệ.');
  }

  const fullName = String(value.fullName || '').trim();
  const email = String(value.email || '').trim();
  const userType = String(value.userType || '').trim();

  if (fullName.length < 2) {
    throw createHttpError(400, 'INVALID_PLAYER_NAME', 'Tên người chơi không hợp lệ.');
  }

  if (!['student', 'university', 'worker'].includes(userType)) {
    throw createHttpError(400, 'INVALID_USER_TYPE', 'Nhóm người dùng không hợp lệ.');
  }

  return {
    fullName,
    email,
    userType,
  };
}

function handleError(error, res) {
  const statusCode = Number(error && error.statusCode) || 500;
  const code = String((error && error.code) || 'ROLEPLAY_INTERNAL_ERROR');
  const message =
    statusCode >= 500
      ? 'Hệ thống roleplay gặp lỗi. Vui lòng thử lại.'
      : String((error && error.message) || 'Yêu cầu roleplay không hợp lệ.');

  if (statusCode >= 500) {
    console.error('[ROLEPLAY] Controller error:', error);
  }

  return res.status(statusCode).json({
    success: false,
    message,
    error: { code },
  });
}

function createHttpError(statusCode, code, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.code = code;
  return error;
}

module.exports = {
  handleRoleplayIntro,
  handleRoleplayTurn,
};
