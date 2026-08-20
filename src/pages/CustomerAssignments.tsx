import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { useToast } from "../context/ToastContext";
import { EMPLOYEES } from "../data/mockData";
import { can } from "../lib/permissions";
import type { Customer } from "../types";

const EMPTY_FORM: Omit<Customer, "id"> = {
  name: "",
  phone: "",
  ownerSellerId: null,
  taxNumber: "",
  crNumber: "",
  street: "",
  district: "",
  city: "",
  region: "",
  postalCode: "",
  buildingNumber: "",
};

export function CustomerAssignments() {
  const { currentEmployee } = useAuth();
  const { customers, updateCustomer, addCustomer, requestCustomer, customerRequests } = useData();
  const { showToast } = useToast();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<Omit<Customer, "id">>(EMPTY_FORM);

  if (!currentEmployee) return null;

  const canSeeAll = can(currentEmployee.role, "customers.viewAll");
  const canApprove = can(currentEmployee.role, "customers.approve");
  const canRequest = can(currentEmployee.role, "customers.requestAdd");
  const myPendingRequests = customerRequests.filter(
    (r) => r.status === "pending" && r.requestedBy === currentEmployee.id,
  );
  const visibleCustomers = canSeeAll
    ? customers
    : customers.filter((c) => c.ownerSellerId === currentEmployee.id || c.ownerSellerId === null);

  function canEdit(customer: Customer) {
    if (canSeeAll) return true;
    return customer.ownerSellerId === currentEmployee!.id;
  }

  function sellerName(id: string | null) {
    if (!id) return "زبون عابر — يخدمه أي بائع";
    return EMPLOYEES.find((e) => e.id === id)?.fullName ?? "-";
  }

  const selected = customers.find((c) => c.id === selectedId) ?? null;

  function openEdit(c: Customer) {
    setCreating(false);
    setSelectedId(c.id);
    setForm({ ...c });
  }

  function openCreate() {
    setCreating(true);
    setSelectedId(null);
    setForm(EMPTY_FORM);
  }

  function handleSave() {
    if (!form.name.trim() || !currentEmployee) return;
    if (creating) {
      // Only the owner may create a customer outright; everyone else files a
      // request that the owner has to approve first.
      if (canApprove) {
        addCustomer({ id: `c-${Date.now()}`, ...form }, currentEmployee.fullName);
        showToast("تمت إضافة العميل");
      } else {
        requestCustomer({
          requestedBy: currentEmployee.id,
          requestedByName: currentEmployee.fullName,
          customer: form,
        });
        showToast("تم إرسال طلب إضافة العميل لاعتماد صاحب الشركة");
      }
      setCreating(false);
    } else if (selected) {
      updateCustomer(selected.id, form, currentEmployee.fullName);
      showToast("تم حفظ تعديلات العميل");
    }
  }

  const sellers = EMPLOYEES.filter((e) => e.role === "seller");
  const showForm = creating || !!selected;
  const editable = creating || (selected ? canEdit(selected) : false);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold text-neutral-800">{canSeeAll ? "عملاء الشركة" : "عملائي"}</h1>
          <p className="text-sm text-neutral-500">كل عميل ثابت له بائع مسؤول عنه، والعملاء العابرون يقدر يخدمهم أي بائع</p>
        </div>
        {(canApprove || canRequest) && (
          <button
            onClick={openCreate}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-bold text-white hover:bg-brand-700"
          >
            {canApprove ? "+ إضافة عميل" : "+ طلب إضافة عميل"}
          </button>
        )}
      </div>

      {!canApprove && canRequest && (
        <div className="rounded-xl border border-status-warn bg-status-warn-bg/40 p-4 text-xs text-neutral-700">
          إضافة أي عميل جديد تحتاج اعتماد صاحب الشركة — يُرسل طلبك ويُضاف العميل بعد الموافقة فقط.
          {myPendingRequests.length > 0 && (
            <div className="mt-2 font-semibold">
              طلباتك المعلّقة: {myPendingRequests.map((r) => r.customer.name).join("، ")}
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="overflow-x-auto rounded-xl border border-brand-100 bg-white lg:col-span-2">
          <table className="w-full text-right text-sm">
            <thead className="bg-brand-50 text-xs text-brand-700">
              <tr>
                <th className="px-4 py-3 font-semibold">اسم العميل</th>
                <th className="px-4 py-3 font-semibold">الجوال</th>
                <th className="px-4 py-3 font-semibold">الرقم الضريبي</th>
                <th className="px-4 py-3 font-semibold">البائع المسؤول</th>
              </tr>
            </thead>
            <tbody>
              {visibleCustomers.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => openEdit(c)}
                  className={`cursor-pointer border-t border-neutral-100 hover:bg-brand-50/40 ${
                    selectedId === c.id ? "bg-brand-50/60" : ""
                  }`}
                >
                  <td className="px-4 py-3 font-medium text-neutral-800">{c.name}</td>
                  <td className="px-4 py-3 text-neutral-500">{c.phone}</td>
                  <td className="px-4 py-3 text-neutral-500 tabular-nums">{c.taxNumber || "—"}</td>
                  <td className="px-4 py-3 text-neutral-500">{sellerName(c.ownerSellerId)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-xl border border-brand-100 bg-white p-5">
          {!showForm ? (
            <div className="text-sm text-neutral-400">اضغط على عميل من الجدول لعرض بياناته الكاملة أو تعديلها</div>
          ) : (
            <div className="space-y-3">
              <div className="text-sm font-bold text-neutral-800">{creating ? "عميل جديد" : "بيانات العميل"}</div>

              <Field label="اسم المنشأة / العميل" value={form.name} disabled={!editable} onChange={(v) => setForm((f) => ({ ...f, name: v }))} />
              <Field label="الجوال" value={form.phone} disabled={!editable} onChange={(v) => setForm((f) => ({ ...f, phone: v }))} type="tel" tabular />

              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">البائع المسؤول</label>
                <select
                  value={form.ownerSellerId ?? ""}
                  disabled={!editable || !canSeeAll}
                  onChange={(e) => setForm((f) => ({ ...f, ownerSellerId: e.target.value || null }))}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm disabled:bg-neutral-50 disabled:text-neutral-400"
                >
                  <option value="">زبون عابر (بدون بائع ثابت)</option>
                  {sellers.map((s) => (
                    <option key={s.id} value={s.id}>{s.fullName}</option>
                  ))}
                </select>
              </div>

              <div className="border-t border-neutral-100 pt-3">
                <div className="mb-2 text-xs font-semibold text-neutral-500">بيانات الفوترة الضريبية</div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <Field label="الرقم الضريبي" value={form.taxNumber ?? ""} disabled={!editable} onChange={(v) => setForm((f) => ({ ...f, taxNumber: v }))} tabular inputMode="numeric" />
                  <Field label="السجل التجاري" value={form.crNumber ?? ""} disabled={!editable} onChange={(v) => setForm((f) => ({ ...f, crNumber: v }))} tabular inputMode="numeric" />
                </div>
              </div>

              <div className="border-t border-neutral-100 pt-3">
                <div className="mb-2 text-xs font-semibold text-neutral-500">العنوان الوطني</div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <Field label="الشارع" value={form.street ?? ""} disabled={!editable} onChange={(v) => setForm((f) => ({ ...f, street: v }))} />
                  <Field label="رقم المبنى" value={form.buildingNumber ?? ""} disabled={!editable} onChange={(v) => setForm((f) => ({ ...f, buildingNumber: v }))} tabular inputMode="numeric" />
                  <Field label="الحي" value={form.district ?? ""} disabled={!editable} onChange={(v) => setForm((f) => ({ ...f, district: v }))} />
                  <Field label="المدينة" value={form.city ?? ""} disabled={!editable} onChange={(v) => setForm((f) => ({ ...f, city: v }))} />
                  <Field label="المنطقة" value={form.region ?? ""} disabled={!editable} onChange={(v) => setForm((f) => ({ ...f, region: v }))} />
                  <Field label="الرمز البريدي" value={form.postalCode ?? ""} disabled={!editable} onChange={(v) => setForm((f) => ({ ...f, postalCode: v }))} tabular inputMode="numeric" />
                </div>
              </div>

              {editable && (
                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={handleSave}
                    className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-bold text-white hover:bg-brand-700"
                  >
                    {creating ? "إضافة العميل" : "حفظ التعديلات"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  disabled,
  tabular,
  inputMode,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  tabular?: boolean;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-neutral-500">{label}</label>
      <input
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        inputMode={inputMode}
        type={type}
        className={`w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-brand-600 focus:outline-none disabled:bg-neutral-50 disabled:text-neutral-400 ${tabular ? "tabular-nums" : ""}`}
      />
    </div>
  );
}
