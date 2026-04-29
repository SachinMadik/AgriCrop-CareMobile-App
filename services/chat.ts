import { api, fetchWithRetry } from "./api";
import { mockChatReply } from "./mockData";

export async function sendChat(messages: { role: string; content: string }[]) {
  try {
    return await fetchWithRetry(() =>
      api.post("/chat", { messages }, { timeout: 20000 }).then((r) => r.data)
    );
  } catch {
    console.log("[chat] API failed — using offline reply");
    return mockChatReply;
  }
}
