import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { CHAT_DEFS, CHAT_MESSAGES } from "../data/mockData";
import type { ChatKey, ChatMessage } from "../types";

const STATUS_STYLES: Record<NonNullable<ChatMessage["status"]>, { label: string; className: string }> = {
  pending: { label: "بانتظار المطابقة", className: "bg-status-warn-bg text-status-warn" },
  resolved: { label: "تم الحل", className: "bg-status-good-bg text-status-good" },
  approved: { label: "معتمد", className: "bg-status-good-bg text-status-good" },
  mismatch: { label: "فيه فرق", className: "bg-status-bad-bg text-status-bad" },
};

export function Chats() {
  const { currentEmployee } = useAuth();
  const visibleChats = CHAT_DEFS.filter((c) => currentEmployee && c.roles.includes(currentEmployee.role));
  const [active, setActive] = useState<ChatKey>(visibleChats[0]?.key ?? "sales");
  const [draft, setDraft] = useState("");
  const [messagesByChat, setMessagesByChat] = useState(CHAT_MESSAGES);

  const activeDef = CHAT_DEFS.find((c) => c.key === active);
  const messages = messagesByChat[active] ?? [];
  const canDecide =
    currentEmployee &&
    activeDef?.requiresApproval &&
    ["owner", "accountant"].includes(currentEmployee.role);

  function decide(messageId: string, next: "approved" | "mismatch" | "resolved") {
    setMessagesByChat((prev) => ({
      ...prev,
      [active]: (prev[active] ?? []).map((m) => (m.id === messageId ? { ...m, status: next } : m)),
    }));
  }

  function sendMessage() {
    if (!draft.trim() || !currentEmployee) return;
    const newMsg: ChatMessage = {
      id: `local-${Date.now()}`,
      author: currentEmployee.fullName,
      role: currentEmployee.role,
      time: new Date().toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" }),
      text: draft.trim(),
      status: activeDef?.requiresApproval ? "pending" : undefined,
    };
    setMessagesByChat((prev) => ({ ...prev, [active]: [...(prev[active] ?? []), newMsg] }));
    setDraft("");
  }

  return (
    <div className="flex h-[calc(100vh-140px)] gap-4">
      <aside className="w-64 shrink-0 space-y-2 overflow-y-auto rounded-xl border border-brand-100 bg-white p-3">
        {visibleChats.map((c) => (
          <button
            key={c.key}
            onClick={() => setActive(c.key)}
            className={`block w-full rounded-lg px-3 py-2.5 text-right text-sm transition ${
              active === c.key ? "bg-brand-600 text-white" : "text-neutral-700 hover:bg-brand-50"
            }`}
          >
            <div className="font-semibold">{c.label}</div>
          </button>
        ))}
      </aside>

      <section className="flex flex-1 flex-col rounded-xl border border-brand-100 bg-white">
        {activeDef && (
          <>
            <div className="border-b border-neutral-100 px-5 py-4">
              <div className="font-bold text-neutral-800">{activeDef.label}</div>
              <div className="text-xs text-neutral-400">{activeDef.description}</div>
              <div className="mt-2 flex gap-2">
                {activeDef.requiresApproval && (
                  <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-semibold text-brand-700">
                    يتطلب موافقة قبل التفعيل
                  </span>
                )}
                {activeDef.requiresAttachment && (
                  <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[11px] font-semibold text-neutral-500">
                    يتطلب إرفاق صورة/إثبات
                  </span>
                )}
              </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
              {messages.map((m) => (
                <div key={m.id} className="rounded-lg border border-neutral-100 p-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-neutral-800">{m.author}</div>
                    <div className="text-[11px] text-neutral-400">{m.time}</div>
                  </div>
                  <div className="mt-1 text-sm text-neutral-600">{m.text}</div>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {m.hasAttachment && (
                      <span className="rounded bg-neutral-100 px-2 py-0.5 text-[11px] text-neutral-500">📎 مرفق</span>
                    )}
                    {m.status && (
                      <span className={`rounded px-2 py-0.5 text-[11px] font-semibold ${STATUS_STYLES[m.status].className}`}>
                        {STATUS_STYLES[m.status].label}
                      </span>
                    )}
                    {canDecide && m.status === "pending" && (
                      <div className="mr-auto flex gap-1.5">
                        <button
                          onClick={() => decide(m.id, "approved")}
                          className="rounded bg-status-good-bg px-2.5 py-1 text-[11px] font-semibold text-status-good hover:opacity-80"
                        >
                          موافقة
                        </button>
                        <button
                          onClick={() => decide(m.id, "mismatch")}
                          className="rounded bg-status-bad-bg px-2.5 py-1 text-[11px] font-semibold text-status-bad hover:opacity-80"
                        >
                          رفض
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 border-t border-neutral-100 p-4">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="اكتب رسالتك..."
                className="flex-1 rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-brand-600 focus:outline-none"
              />
              {activeDef.requiresAttachment && (
                <button className="rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-500 hover:bg-neutral-50">
                  📎 إرفاق
                </button>
              )}
              <button
                onClick={sendMessage}
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-bold text-white hover:bg-brand-700"
              >
                إرسال
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
