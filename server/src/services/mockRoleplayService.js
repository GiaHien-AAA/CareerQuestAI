const {
  getScenario,
  getActor,
} = require('./roleplayScenarioData');

function createRoleplayIntroMock({ stageId, playerProfile }) {
  const scenario = requireScenario(stageId);
  const actor = requireActor(scenario.actorId);

  return {
    interactionId: '',
    stageId,
    actorId: actor.id,
    actorName: actor.name,
    actorRole: actor.role,
    actorAvatar: actor.avatar,
    missionTitle: scenario.missionTitle,
    missionObjective: scenario.missionObjective,
    message: getIntroMessage(scenario, actor, playerProfile),
    question: scenario.initialQuestion || '',
    tone: getIntroTone(actor.id),
    source: 'mock',
  };
}

function createRoleplayTurnMock(input) {
  const scenario = requireScenario(input.stageId);
  const actor = requireActor(scenario.actorId);

  if (input.eventType === 'wrong_attempt') {
    const feedback = getWrongAttemptFeedback(scenario, input);

    return buildReply({
      input,
      actor,
      message: feedback.message,
      hint: feedback.hint,
      observation: feedback.observation,
      tone: 'challenging',
      shouldContinue: false,
      stageComplete: false,
    });
  }

  if (input.eventType === 'success_attempt') {
    return buildReply({
      input,
      actor,
      message: getSuccessMessage(scenario, actor, input),
      hint: '',
      observation: 'Người chơi hoàn thành đúng quy trình và có khả năng tiếp tục sau phản hồi.',
      tone: 'encouraging',
      shouldContinue: false,
      stageComplete: true,
    });
  }

  const turnNumber = Number(input.turnNumber) || 1;
  const isLastTurn = turnNumber >= scenario.maxConversationTurns;

  if (isLastTurn) {
    return buildReply({
      input,
      actor,
      message: getCompletionMessage(actor, input.playerMessage),
      hint: '',
      observation: 'Người chơi đã giải thích thêm cách ra quyết định trong cuộc hội thoại nhiều lượt.',
      tone: 'encouraging',
      shouldContinue: false,
      stageComplete: true,
    });
  }

  return buildReply({
    input,
    actor,
    message: getFirstTurnReaction(actor, input.playerMessage),
    followUpQuestion: getFollowUpQuestion(scenario, input.playerMessage),
    hint: '',
    observation: 'Người chơi đã đưa ra phương án ban đầu; cần hỏi sâu hơn về lý do hoặc phương án dự phòng.',
    tone: 'serious',
    shouldContinue: true,
    stageComplete: false,
  });
}

function buildReply({
  input,
  actor,
  message,
  followUpQuestion = '',
  hint,
  observation,
  tone,
  shouldContinue,
  stageComplete,
}) {
  return {
    interactionId: input.previousInteractionId || '',
    stageId: input.stageId,
    actorId: actor.id,
    actorName: actor.name,
    actorRole: actor.role,
    actorAvatar: actor.avatar,
    message,
    followUpQuestion,
    hint,
    shouldContinue,
    stageComplete,
    observation,
    tone,
    source: 'mock',
  };
}

function getIntroMessage(scenario, actor, playerProfile) {
  const name = playerProfile.fullName;

  const messages = {
    'drag-stage-1': `${name}, tôi là Boss Byte. Trước khi giao việc khó, tôi muốn xem bạn có biết sắp xếp một quy trình đơn giản theo đúng thứ tự hay không. Đừng nghĩ đây là bài kiểm tra code; hãy nghĩ như đang tổ chức công việc.`,
    'drag-stage-2': `Chào ${name}, tôi là Linh từ Nova Retail. Tôi có nhiều số liệu cần tổng hợp cho báo cáo. Tôi không quan tâm bạn dùng thuật ngữ gì, tôi chỉ cần quy trình xử lý được cả danh sách và cho ra kết quả rõ ràng.`,
    'drag-stage-3': `${name}, tôi là An, QA của dự án. Tôi phát hiện một rủi ro: không phải dữ liệu nào cũng nên được xử lý ngay. Tôi muốn bạn sắp xếp quy trình có bước kiểm tra trước khi xử lý.`,
    'open-stage-4': `${name}, tôi là Trang, quản lý dự án. Chúng ta đang có một vấn đề sát deadline. Tôi cần nghe cách bạn ưu tiên và cách bạn thông báo rủi ro, không cần một câu trả lời “hoàn hảo”.`,
    'open-stage-5': `Chào ${name}, tớ là Minh, đồng đội của cậu. Tớ đang chờ phần việc của cậu để làm tiếp và cả nhóm cũng đang bị hỏi tiến độ. Tớ muốn biết cậu sẽ trao đổi với bọn tớ thế nào.`,
    'open-stage-6': `${name}, tôi là Mentor Nova. Tôi không chấm bạn đúng hay sai ở phần này. Tôi muốn nghe điều gì thực sự khiến bạn có năng lượng và điều gì làm bạn mất động lực trong hành trình vừa rồi.`,
  };

  return messages[scenario.id] || `${name}, tôi là ${actor.name}. ${scenario.context}`;
}

function getWrongAttemptFeedback(scenario, input) {
  const action = Array.isArray(input.playerAction) ? input.playerAction : [];
  const expected = scenario.correctSolution || [];
  const attempt = Number(input.attemptNumber) || 1;
  const usedAllAttempts = attempt >= scenario.maxAttempts;

  if (action.length < expected.length) {
    return {
      message: 'Quy trình hiện tại chưa đủ để hoàn thành yêu cầu. Bạn đang thiếu một bước cần thiết.',
      hint: usedAllAttempts
        ? `Hãy nhìn lại toàn bộ chuỗi công việc: ${expected.join(' → ')}.`
        : 'Hãy kiểm tra xem dữ liệu đã được lấy, duyệt hoặc kiểm tra đầy đủ trước khi đưa ra kết quả chưa.',
      observation: 'Người chơi chạy chương trình khi quy trình còn thiếu bước.',
    };
  }

  if (action.length > expected.length) {
    return {
      message: 'Bạn đang thêm nhiều bước hơn mức cần thiết. Quy trình dài hơn không có nghĩa là tốt hơn.',
      hint: usedAllAttempts
        ? `Quy trình cốt lõi là ${expected.join(' → ')}.`
        : 'Hãy loại bước lặp hoặc xử lý không tạo thêm giá trị cho kết quả cuối.',
      observation: 'Người chơi có xu hướng thêm thừa bước khi chưa chắc chắn.',
    };
  }

  return {
    message: 'Bạn đã có đủ các thành phần, nhưng thứ tự khiến một hành động xảy ra trước khi điều kiện cần thiết được chuẩn bị.',
    hint: usedAllAttempts
      ? `Hãy thử theo logic ${expected.join(' → ')}.`
      : attempt >= 2
        ? 'Xem lại bước nào phải xảy ra trước: có dữ liệu, duyệt hoặc kiểm tra, xử lý, rồi mới hiển thị.'
        : 'Tự hỏi: bước này có thể chạy khi bước trước chưa hoàn tất không?',
    observation: 'Người chơi có đủ thành phần nhưng cần điều chỉnh thứ tự xử lý.',
  };
}

function getSuccessMessage(scenario, actor, input) {
  const attempts = Number(input.attemptNumber) || 1;

  if (actor.id === 'client-linh') {
    return attempts === 1
      ? 'Được rồi, quy trình này xử lý cả danh sách theo một luồng rõ ràng. Với tôi, điều quan trọng là bạn không bắt người dùng làm lại cùng một việc thủ công.'
      : 'Ổn rồi. Sau vài lần điều chỉnh, bạn đã tạo được quy trình xử lý cả danh sách. Tôi đánh giá cao việc bạn sửa cách làm thay vì bỏ cuộc.';
  }

  if (actor.id === 'qa-an') {
    return 'Tốt. Bạn đã đặt bước kiểm tra trước khi xử lý. Đó là điểm QA luôn quan tâm: ngăn lỗi trước khi nó đi sâu hơn vào quy trình.';
  }

  return attempts === 1
    ? 'Tốt. Bạn đã sắp xếp đúng trình tự ngay từ đầu: chuẩn bị dữ liệu, xử lý rồi mới đưa ra kết quả.'
    : 'Tốt. Quan trọng không phải bạn sai bao nhiêu lần, mà là bạn đã dùng phản hồi để điều chỉnh trình tự và hoàn thành task.';
}

function getFirstTurnReaction(actor, playerMessage) {
  const shortText = String(playerMessage || '').slice(0, 120);
  return `${actor.name}: Tôi hiểu hướng bạn đang chọn. Phần “${shortText || 'cách xử lý này'}” cho tôi thấy bạn đã có một ưu tiên ban đầu, nhưng tôi muốn làm rõ thêm trước khi kết thúc tình huống.`;
}

function getFollowUpQuestion(scenario) {
  const questions = {
    'open-stage-4': 'Nếu việc bạn ưu tiên đầu tiên không thể sửa kịp trong 30 phút, bạn sẽ đổi kế hoạch và thông báo với nhóm như thế nào?',
    'open-stage-5': 'Nếu Minh không đồng ý với thứ tự ưu tiên của bạn và vẫn cần kết quả ngay, bạn sẽ nói gì để cả hai tiếp tục làm việc?',
    'open-stage-6': 'Điều bạn vừa nói phản ánh loại công việc nào khiến bạn muốn tiếp tục lâu dài, và loại công việc nào bạn muốn tránh?',
  };

  return questions[scenario.id] || 'Nếu cách đầu tiên không hiệu quả, bạn sẽ thay đổi kế hoạch thế nào?';
}

function getCompletionMessage(actor) {
  return `${actor.name}: Cảm ơn. Câu trả lời thứ hai giúp tôi hiểu rõ hơn không chỉ bạn sẽ làm gì, mà còn cách bạn thay đổi khi tình huống không đi đúng kế hoạch.`;
}

function getIntroTone(actorId) {
  if (actorId === 'mentor-nova') return 'calm';
  if (actorId === 'teammate-minh') return 'concerned';
  return 'serious';
}

function requireScenario(stageId) {
  const scenario = getScenario(stageId);

  if (!scenario) {
    throw new Error(`Unknown roleplay stage: ${stageId}`);
  }

  return scenario;
}

function requireActor(actorId) {
  const actor = getActor(actorId);

  if (!actor) {
    throw new Error(`Unknown roleplay actor: ${actorId}`);
  }

  return actor;
}

module.exports = {
  createRoleplayIntroMock,
  createRoleplayTurnMock,
};
