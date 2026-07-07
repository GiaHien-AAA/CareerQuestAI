function buildRoleplaySystemInstruction({ scenario, actor, playerProfile }) {
  return `
Bạn đang nhập vai ${actor.name}, ${actor.role} tại ${actor.company}.

TÍNH CÁCH NHÂN VẬT:
${actor.personality}

BỐI CẢNH STAGE ${scenario.stageNumber}:
${scenario.context}

NGƯỜI CHƠI:
- Tên: ${playerProfile.fullName}
- Nhóm: ${getUserTypeLabel(playerProfile.userType)}

LUẬT ROLEPLAY BẮT BUỘC:
1. Luôn giữ đúng vai ${actor.name}. Không nói rằng bạn là AI, mô hình ngôn ngữ hay trợ lý.
2. Nói bằng tiếng Việt tự nhiên, phù hợp với vai trò nghề nghiệp.
3. Người chơi có thể chưa biết CNTT. Không đánh giá thấp họ vì thiếu thuật ngữ chuyên môn.
4. Phản ứng dựa trên hành động/câu trả lời cụ thể của người chơi.
5. Không tâng bốc chung chung. Không xúc phạm. Không chẩn đoán tâm lý.
6. Với task kéo thả: không nói lộ toàn bộ đáp án ngay. Gợi ý tăng dần theo số lần sai. Chỉ khi đã dùng hết lượt mới có thể mô tả quy trình gần đầy đủ.
7. Với hội thoại mở: hỏi sâu vào lý do, thứ tự ưu tiên, giao tiếp hoặc phương án thay thế. Không hỏi câu kiến thức chuyên môn.
8. Không thay đổi sang nhân vật khác trong cùng stage.
9. Câu trả lời ngắn gọn, rõ ràng, giữ cảm giác đang nói chuyện với một người thật trong công việc.
`;
}

function buildIntroInput({ scenario, actor, playerProfile }) {
  return `
Hãy bắt đầu màn giới thiệu nhân vật trước khi giao nhiệm vụ.

Yêu cầu:
- Chào ${playerProfile.fullName} theo đúng tính cách của ${actor.name}.
- Tự giới thiệu rất ngắn vai trò của mình.
- Nói bối cảnh hiện tại bằng ngôn ngữ tự nhiên.
- Giao nhiệm vụ: ${scenario.missionObjective}
- ${scenario.initialQuestion ? `Kết thúc bằng câu hỏi mở đầu này, có thể diễn đạt tự nhiên hơn nhưng không đổi ý: ${scenario.initialQuestion}` : 'Không hỏi câu hỏi mở; người chơi sẽ bấm NHẬN NHIỆM VỤ rồi vào task kéo thả.'}
- Không nói về điểm số hay hệ thống đánh giá.
`;
}

function buildTurnInput({
  scenario,
  eventType,
  playerMessage,
  playerAction,
  attemptNumber,
  turnNumber,
}) {
  if (eventType === 'wrong_attempt') {
    return `
Người chơi vừa chạy task nhưng sai.

Thứ tự block họ đã chọn:
${formatAction(playerAction)}

Lần thử hiện tại: ${attemptNumber}/${scenario.maxAttempts}
Đáp án nội bộ để bạn hiểu lỗi (KHÔNG được nói lộ nguyên chuỗi trừ khi đã hết lượt):
${formatAction(scenario.correctSolution)}

Hãy phản ứng đúng vai:
- Chỉ ra kiểu sai dựa trên thứ tự hiện tại: thiếu block, thừa block, xử lý quá sớm, hiển thị quá sớm, thiếu bước lặp/kiểm tra...
- Nếu chưa hết lượt: đưa một gợi ý đủ để người chơi tự sửa, không nói toàn bộ đáp án.
- Nếu đã hết lượt: có thể giải thích quy trình gần đầy đủ để người chơi hiểu và làm lại.
- shouldContinue=false, stageComplete=false, followUpQuestion="".
`;
  }

  if (eventType === 'success_attempt') {
    return `
Người chơi vừa hoàn thành đúng task.

Thứ tự block:
${formatAction(playerAction)}

Số lần thử: ${attemptNumber}

Hãy phản ứng đúng vai:
- Công nhận hành vi cụ thể: biết sắp xếp trình tự, sửa sai, dùng lặp hoặc kiểm tra đúng chỗ.
- Không tâng bốc quá mức.
- Nói ngắn gọn điều bạn quan sát được.
- shouldContinue=false, stageComplete=true, followUpQuestion="", hint="".
`;
  }

  const isLastTurn = Number(turnNumber) >= Number(scenario.maxConversationTurns);

  return `
Người chơi vừa trả lời bạn trong cuộc roleplay.

Lượt trả lời: ${turnNumber}/${scenario.maxConversationTurns}
Câu trả lời của người chơi:
${playerMessage}

Hãy phản ứng đúng vai ${scenario.actorId}.

${isLastTurn
    ? `Đây là lượt cuối của stage. Hãy phản hồi trực tiếp vào điều người chơi vừa nói, tóm tắt rất ngắn điều bạn hiểu về cách họ xử lý tình huống. Không hỏi thêm. shouldContinue=false, stageComplete=true, followUpQuestion="".`
    : `Hãy phản hồi vào một chi tiết cụ thể trong câu trả lời, sau đó đặt đúng MỘT câu hỏi tiếp nối để làm rõ lý do, ưu tiên, cách giao tiếp hoặc phương án dự phòng. Câu hỏi phải phụ thuộc vào câu trả lời vừa rồi, không được dùng câu hỏi chung chung. shouldContinue=true, stageComplete=false.`}
`;
}

function getUserTypeLabel(userType) {
  if (userType === 'student') return 'Học sinh';
  if (userType === 'worker') return 'Người đi làm';
  return 'Sinh viên';
}

function formatAction(action) {
  if (!Array.isArray(action) || action.length === 0) {
    return '(không có block)';
  }

  return action.join(' → ');
}

module.exports = {
  buildRoleplaySystemInstruction,
  buildIntroInput,
  buildTurnInput,
};
