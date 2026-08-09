import { useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { CHAT_DEFS, CHAT_MESSAGES, EMPLOYEES, EMPLOYEE_MANAGER_THREADS } from "../data/mockData";
import { getEffectiveThreadId, THREAD_VIEWER_ROLES } from "../lib/chatAccess";
import type { ChatKey, ChatMessage } from "../types";

const STATUS_STYLES: Record<NonNullable<ChatMessage["status"]>, { label: string; className: string }> = {
  pending: { label: "بانتظار المطابقة", className: "bg-status-warn-bg text-status-warn" },
  resolved: { label: "تم الحل", className: "bg-status-good-bg text-status-good" },
  approved: { label: "معتمد", className: "bg-status-good-bg text-status-good" },
  mismatch: { label: "فيه فرق", className: "bg-status-bad-bg text-status-bad" },
};

const CHAT_AUDIT_CATEGORY: Partial<Record<ChatKey, string>> = {
  price_changes: "تدقيق الأسعار",
  transfers: "تدقيق حسابات العملاء",
};

export function Chats() {
  const { currentEmployee } = useAuth();
  const { addAuditEntry } = useData();
  const visibleChats = CHAT_DEFS.filter((c) => currentEmployee && c.roles.includes(currentEmployee.role));
  const [active, setActive] = useState<ChatKey>(visibleChats[0]?.key ?? "sales");
  const [draft, setDraft] = useState("");
  const [messagesByChat, setMessagesByChat] = useState(CHAT_MESSAGES);
  const [threadsByEmployee, setThreadsByEmployee] = useState(EMPLOYEE_MANAGER_THREADS);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(
    Object.keys(EMPLOYEE_MANAGER_THREADS)[0] ?? null,
  );
  const [pendingAttachment, setPendingAttachment] = useState<{ name: string; url: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!currentEmployee) return null;

  const activeDef = CHAT_DEFS.find((c) => c.key === active);
  const isEmployeeManagerChat = active === "employee_manager";
  const isThreadViewer = THREAD_VIEWER_ROLES.includes(currentEmployee.role);

  const effectiveThreadId = isEmployeeManagerChat
    ? getEffectiveThreadId(currentEmployee.id, currentEmployee.role, selectedThreadId)
    : null;

  const messages = isEmployeeManagerChat
    ? (effectiveThreadId ? (threadsByEmployee[effectiveThreadId] ?? []) : [])
    : (messagesByChat[active] ?? []);

  const canDecide =
    !isEmployeeManagerChat &&
    activeDef?.requiresApproval &&
    ["owner", "manager", "accountant"].includes(currentEmployee.role);

  function decide(messageId: string, next: "approved" | "mismatch" | "resolved") {
    const message = (messagesByChat[active] ?? []).find((m) => m.id === messageId);
    setMessagesByChat((prev) => ({
      ...prev,
      [active]: (prev[active] ?? []).map((m) => (m.id === messageId ? { ...m, status: next } : m)),
    }));
    const category = CHAT_AUDIT_CATEGORY[active];
    if (message && category && currentEmployee) {
      addAuditEntry({
        category,
        who: message.author,
        action: message.text,
        when: new Date().toLocaleString("ar-SA", { dateStyle: "short", timeStyle: "short" }),
        before: "بانتظار المطابقة",
        after: next === "approved" ? "معتمد" : next === "mismatch" ? "فيه فرق" : "تم الحل",
        approvedBy: currentEmployee.fullName,
        result: next === "mismatch" ? "flagged" : "cleared",
      });
    }
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
      hasAttachment: !!pendingAttachment,
      attachmentName: pendingAttachment?.name,
      attachmentUrl: pendingAttachment?.url,
    };
    setPendingAttachment(null);

    if (isEmployeeManagerChat && effectiveThreadId) {
      setThreadsByEmployee((prev) => ({ ...prev, [effectiveThreadId]: [...(prev[effectiveThreadId] ?? []), newMsg] }));
      if (isThreadViewer && !selectedThreadId) setSelectedThreadId(effectiveThreadId);
    } else {
      setMessagesByChat((prev) => ({ ...prev, [active]: [...(prev[active] ?? []), newMsg] }));
    }
    setDraft("");
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingAttachment({ name: file.name, url: URL.createObjectURL(file) });
    e.target.value = "";
  }

  const threadEmployees = EMPLOYEES.filter((e) => !THREAD_VIEWER_ROLES.includes(e.role));

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

      {isEmployeeManagerChat && isThreadViewer && (
        <aside className="w-56 shrink-0 space-y-1.5 overflow-y-auto rounded-xl border border-brand-100 bg-white p-3">
          <div className="mb-1 px-1 text-[11px] font-semibold text-neutral-400">محادثات الموظفين</div>
          {threadEmployees.map((emp) => (
            <button
              key={emp.id}
              onClick={() => setSelectedThreadId(emp.id)}
              className={`block w-full rounded-lg px-3 py-2 text-right text-xs transition ${
                selectedThreadId === emp.id ? "bg-brand-50 text-brand-700 font-semibold" : "text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              {emp.fullName}
            </button>
          ))}
        </aside>
      )}

      <section className="flex flex-1 flex-col rounded-xl border border-brand-100 bg-white">
        {activeDef && (
          <>
            <div className="border-b border-neutral-100 px-5 py-4">
              <div className="font-bold text-neutral-800">
                {activeDef.label}
                {isEmployeeManagerChat && isThreadViewer && selectedThreadId && (
                  <span className="text-sm font-normal text-neutral-400">
                    {" "}— {EMPLOYEES.find((e) => e.id === selectedThreadId)?.fullName}
                  </span>
                )}
              </div>
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
                {isEmployeeManagerChat && (
                  <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[11px] font-semibold text-neutral-500">
                    محادثة خاصة — لا يطّلع عليها أحد غيركما
                  </span>
                )}
              </div>
            </div>

            {isEmployeeManagerChat && isThreadViewer && !selectedThreadId ? (
              <div className="flex flex-1 items-center justify-center text-sm text-neutral-400">
                اختر موظفًا من القائمة لعرض محادثته
              </div>
            ) : (
              <>
                <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
                  {messages.length === 0 && (
                    <div className="text-center text-xs text-neutral-400">لا توجد رسائل بعد</div>
                  )}
                  {messages.map((m) => (
                    <div key={m.id} className="rounded-lg border border-neutral-100 p-3">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold text-neutral-800">{m.author}</div>
                        <div className="text-[11px] text-neutral-400">{m.time}</div>
                      </div>
                      <div className="mt-1 text-sm text-neutral-600">{m.text}</div>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        {m.hasAttachment && (
                          m.attachmentUrl ? (
                            <a
                              href={m.attachmentUrl}
                              target="_blank"
                              rel="noreferrer"
                              download={m.attachmentName}
                              className="rounded bg-neutral-100 px-2 py-0.5 text-[11px] text-brand-700 underline"
                            >
                              📎 {m.attachmentName ?? "مرفق"}
                            </a>
                          ) : (
                            <span className="rounded bg-neutral-100 px-2 py-0.5 text-[11px] text-neutral-500">📎 مرفق</span>
                          )
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

                <div className="border-t border-neutral-100 p-4">
                  {pendingAttachment && (
                    <div className="mb-2 flex items-center gap-2 text-xs text-neutral-500">
                      <span className="rounded bg-brand-50 px-2 py-1 text-brand-700">📎 {pendingAttachment.name}</span>
                      <button onClick={() => setPendingAttachment(null)} className="text-neutral-400 hover:text-status-bad">
                        إزالة
                      </button>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <input
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                      placeholder="اكتب رسالتك..."
                      className="flex-1 rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-brand-600 focus:outline-none"
                    />
                    {activeDef.requiresAttachment && (
                      <>
                        <input ref={fileInputRef} type="file" onChange={handleFileChange} className="hidden" />
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-500 hover:bg-neutral-50"
                        >
                          📎 إرفاق
                        </button>
                      </>
                    )}
                    <button
                      onClick={sendMessage}
                      className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-bold text-white hover:bg-brand-700"
                    >
                      إرسال
                    </button>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </section>
    </div>
  );
}
