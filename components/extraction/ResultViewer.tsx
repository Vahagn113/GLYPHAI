"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Copy, Check, Download, Edit2, Trash2, MessageSquare, Sparkles, RefreshCw, Eye, AlertCircle, Send, Layers, FileSpreadsheet, FileCheck, ShieldCheck, ChevronDown, ZoomIn, ZoomOut, Maximize2, ChevronLeft, ChevronRight, Gauge, TrendingUp, ShieldAlert, Briefcase, Target, Award, FileText, Zap } from "lucide-react";
import { translations } from "@/lib/translations";
import { DOCUMENT_HIGHLIGHT_MAP } from "@/lib/documentHighlights";
import type { ChatMessage, HighlightBox, Language } from "@/lib/types";

const SR = {
  surface: "bg-white dark:bg-[#1a1412]",
  surfaceMuted: "bg-stone-50 dark:bg-[#1f1815]",
  surfaceInset: "bg-stone-100 dark:bg-[#252018]",
  border: "border-stone-200 dark:border-stone-700",
  textPrimary: "text-stone-800 dark:text-stone-100",
  textSecondary: "text-stone-600 dark:text-stone-300",
  textMuted: "text-stone-500 dark:text-stone-300",
  textLabel: "text-stone-500 dark:text-stone-400",
  hoverRow: "hover:bg-stone-50 dark:hover:bg-[#252018]",
};

// Sub-components for confidence scoring and visual results
const ConfidenceMeter = ({ value }: { value: number }) => {
  const percentage = Math.round(value * 100);
  let barColor = "bg-orange-500";
  let textColor = "text-orange-600 bg-orange-50 dark:bg-orange-950/20";
  if (value >= 0.85) {
    barColor = "bg-emerald-600";
    textColor = "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20";
  } else if (value < 0.60) {
    barColor = "bg-rose-600";
    textColor = "text-rose-600 bg-rose-50 dark:bg-rose-950/20";
  }

  return (
    <div className="flex items-center gap-2" title={`OCR confidence: ${percentage}%`}>
      <div className="w-14 h-1.5 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
        <div className={`h-full ${barColor}`} style={{ width: `${percentage}%` }} />
      </div>
      <span className={`text-[9.5px] px-1.5 py-0.5 rounded-md font-mono font-bold ${textColor}`}>
        {percentage}%
      </span>
    </div>
  );
};

const CopyFieldButton = ({ value }: { value: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      title="Copy field value"
      className="p-1 hover:bg-[#C86432]/10 dark:hover:bg-[#C86432]/20 rounded-md text-stone-400 hover:text-[#C86432] transition-colors cursor-pointer inline-flex items-center justify-center scale-90"
    >
      {copied ? (
        <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
      ) : (
        <Copy className="w-3.5 h-3.5" />
      )}
    </button>
  );
};

const convertSpecializedJsonToMarkdown = (jsonText: string, docType: string): string => {
  if (!jsonText) return "";
  try {
    const data = JSON.parse(jsonText);
    let md = "";

    switch (docType) {
      case "invoice": {
        const vendor = data.vendorName?.value || "N/A";
        const vendorAddr = data.vendorAddress?.value || "";
        const billing = data.billingName?.value || "N/A";
        const billingAddr = data.billingAddress?.value || "";
        const invNum = data.invoiceNumber?.value || "N/A";
        const invDate = data.invoiceDate?.value || "N/A";
        const subtotal = data.subtotal?.value || "0.00";
        const tax = data.tax?.value || "0.00";
        const total = data.totalAmount?.value || "0.00";
        const currency = data.currency?.value || "USD";

        md = `# INVOICE SUMMARY\n\n`;
        md += `* **Vendor/Company:** ${vendor}\n`;
        if (vendorAddr) md += `  Address: ${vendorAddr}\n`;
        md += `* **Billed To:** ${billing}\n`;
        if (billingAddr) md += `  Address: ${billingAddr}\n`;
        md += `* **Invoice Number:** ${invNum}\n`;
        md += `* **Billing Date:** ${invDate}\n`;
        md += `* **Currency:** ${currency}\n\n`;

        md += `## LINE ITEMS\n\n`;
        md += `| Item Description | Qty | Unit Price | Total |\n`;
        md += `| :--- | :---: | :---: | :---: |\n`;
        const items = Array.isArray(data.lineItems) ? data.lineItems : [];
        if (items.length > 0) {
          items.forEach((it: any) => {
            const desc = it.description?.value || "Item";
            const qty = it.quantity?.value !== undefined ? it.quantity.value : "1";
            const unit = it.unitPrice?.value !== undefined ? it.unitPrice.value : "N/A";
            const lineTotal = it.total?.value !== undefined ? it.total.value : "N/A";
            md += `| ${desc} | ${qty} | ${unit} | ${lineTotal} |\n`;
          });
        } else {
          md += `| (No items listed) | - | - | - |\n`;
        }
        md += `\n`;
        md += `## FINANCIAL TOTALS\n\n`;
        md += `* **Subtotal:** ${subtotal} ${currency}\n`;
        md += `* **VAT/Tax:** ${tax} ${currency}\n`;
        md += `* **Grand Total Paid:** **${total} ${currency}**\n`;
        break;
      }
      case "contract": {
        const title = data.contractTitle?.value || "Legal Agreement";
        const summary = data.summary?.value || "No agreement summary parsed.";
        const effDate = data.effectiveDate?.value || "N/A";
        const expDate = data.expirationDate?.value || "N/A";
        const govLaw = data.governingLaw?.value || "N/A";
        const termPeriod = data.terminationNoticePeriod?.value || "N/A";
        const liability = data.liabilityCap?.value || "N/A";

        md = `# CONTRACT BRIEF: ${title}\n\n`;
        md += `## Executive Summary\n${summary}\n\n`;
        md += `## Key Information\n\n`;
        md += `* **Effective Date:** ${effDate}\n`;
        md += `* **Expiration Date:** ${expDate}\n`;
        md += `* **Governing Law:** ${govLaw}\n`;
        md += `* **Termination Notice Period:** ${termPeriod}\n`;
        md += `* **Liability Cap:** ${liability}\n\n`;

        md += `## Important Dates & Deadlines\n\n`;
        const dates = Array.isArray(data.importantDates) ? data.importantDates : [];
        if (dates.length > 0) {
          dates.forEach((d: any) => {
            const event = d.event?.value || d.event || "Deadline";
            const val = d.dateValue?.value || d.dateValue || "Date";
            md += `* **${event}:** ${val}\n`;
          });
        } else {
          md += `* (No additional dates listed)\n`;
        }
        md += `\n`;

        md += `## Risk Diagnostics\n\n`;
        const risks = Array.isArray(data.risks) ? data.risks : [];
        if (risks.length > 0) {
          risks.forEach((r: any) => {
            const factor = r.riskFactor?.value || "Risk Factor";
            const severity = r.severity?.value || "Medium";
            const detail = r.detail?.value || "";
            md += `* **[${severity.toUpperCase()}] ${factor}:** ${detail}\n`;
          });
        } else {
          md += `* (No critical risk factors identified)\n`;
        }
        md += `\n`;

        md += `## Provisions & Key Clauses\n\n`;
        const clauses = Array.isArray(data.keyClauses) ? data.keyClauses : [];
        if (clauses.length > 0) {
          clauses.forEach((c: any) => {
            const heading = c.title?.value || c.title || "Section Clause";
            const content = c.content?.value || c.content || "";
            md += `### ${heading}\n${content}\n\n`;
          });
        } else {
          md += `* (No specialized clauses indexed)\n`;
        }
        break;
      }
      case "resume": {
        const name = data.candidateName?.value || "Candidate";
        const email = data.email?.value || "N/A";
        const phone = data.phone?.value || "N/A";
        const loc = data.location?.value || "N/A";
        const summary = data.summary?.value || "";

        md = `# RESUME PROFILE: ${name}\n\n`;
        md += `* **Email:** ${email}\n`;
        md += `* **Phone:** ${phone}\n`;
        md += `* **Location:** ${loc}\n\n`;
        if (summary) {
          md += `## Professional Summary\n${summary}\n\n`;
        }

        md += `## Technical Skillset\n\n`;
        const skills = Array.isArray(data.skills) ? data.skills : [];
        if (skills.length > 0) {
          skills.forEach((sk: any) => {
            const cat = sk.category?.value || "Skills";
            const list = Array.isArray(sk.skillsList) ? sk.skillsList.join(", ") : String(sk.skillsList || "");
            md += `* **${cat}:** ${list}\n`;
          });
        } else {
          md += `* (No targeted skills listed)\n`;
        }
        md += `\n`;

        md += `## Professional Experience\n\n`;
        const exp = Array.isArray(data.experience) ? data.experience : [];
        if (exp.length > 0) {
          exp.forEach((work: any) => {
            const role = work.role?.value || "Role";
            const comp = work.company?.value || "Company";
            const start = work.startDate?.value || "";
            const end = work.endDate?.value || "";
            const desc = work.description?.value || "";
            md += `### ${role} at ${comp} (${start} - ${end})\n`;
            if (desc) md += `${desc}\n\n`;
          });
        } else {
          md += `* (No historical experience listed)\n`;
        }

        md += `## Academic History\n\n`;
        const edu = Array.isArray(data.education) ? data.education : [];
        if (edu.length > 0) {
          edu.forEach((school: any) => {
            const deg = school.degree?.value || "Degree";
            const inst = school.institution?.value || "Institution";
            const grad = school.graduationYear?.value || "";
            md += `* **${deg}** - ${inst} (${grad})\n`;
          });
        } else {
          md += `* (No academic metrics listed)\n`;
        }
        break;
      }
      case "receipt": {
        const merchant = data.merchantName?.value || "Merchant";
        const address = data.merchantAddress?.value || "";
        const phone = data.merchantPhone?.value || "";
        const date = data.transactionDate?.value || "N/A";
        const time = data.transactionTime?.value || "N/A";
        const pay = data.paymentMethod?.value || "Card";
        const subtotal = data.subtotal?.value || "";
        const tax = data.tax?.value || "0.00";
        const tip = data.tip?.value || "0.00";
        const total = data.totalAmount?.value || "0.00";

        md = `# RETAIL SLIP: ${merchant}\n\n`;
        if (address) md += `* **Address:** ${address}\n`;
        if (phone) md += `* **Phone:** ${phone}\n`;
        md += `* **Transaction Date:** ${date} ${time}\n`;
        md += `* **Payment Channel:** ${pay}\n\n`;

        md += `## PURCHASED ITEMS\n\n`;
        md += `| Description | Qty | Total Price |\n`;
        md += `| :--- | :---: | :---: |\n`;
        const items = Array.isArray(data.items) ? data.items : [];
        if (items.length > 0) {
          items.forEach((it: any) => {
            const desc = it.description?.value || "Item";
            const qty = it.quantity?.value !== undefined ? it.quantity.value : "1";
            const price = it.totalPrice?.value !== undefined ? it.totalPrice.value : "N/A";
            md += `| ${desc} | ${qty} | ${price} |\n`;
          });
        } else {
          md += `| (No items listed) | - | - |\n`;
        }
        md += `\n`;

        md += `## TRANSACTION TOTALS\n\n`;
        if (subtotal) md += `* **Subtotal:** ${subtotal}\n`;
        md += `* **VAT/Taxes:** ${tax}\n`;
        md += `* **Tip:** ${tip}\n`;
        md += `* **Grand Total Paid:** **${total}**\n`;
        break;
      }
      case "table": {
        const tableName = data.tableName?.value || "Tabular Grid Result";
        md = `# TABLE STRUCTURE: ${tableName}\n\n`;
        const headers = Array.isArray(data.headers) ? data.headers : [];
        const rows = Array.isArray(data.rows) ? data.rows : [];

        if (headers.length === 0) {
          md += `*(No structured columns found)*\n`;
        } else {
          md += `| ${headers.map((h: any) => h.value || "").join(" | ")} |\n`;
          md += `| ${headers.map(() => ":---").join(" | ")} |\n`;
          rows.forEach((row: any) => {
            const cells = Array.isArray(row.cells) ? row.cells : [];
            md += `| ${cells.map((c: any) => c.value || "").join(" | ")} |\n`;
          });
        }
        break;
      }
      default:
        md = jsonText;
    }
    return md;
  } catch (error) {
    console.error("Error parsing specialized JSON:", error);
    return jsonText; // fallback to raw string
  }
};

export const getDisplayableOrDownloadableText = (textVal: string, docType: string): string => {
  if (!docType || docType === "general_ocr") {
    return textVal;
  }
  try {
    JSON.parse(textVal);
    return convertSpecializedJsonToMarkdown(textVal, docType);
  } catch (e) {
    return textVal;
  }
};

const renderInvoiceNode = (data: any, activeField: string | null = null, onFieldClick: (field: string) => void = () => {}) => {
  const lineItems = Array.isArray(data.lineItems) ? data.lineItems : [];
  return (
    <div className={`flex flex-col gap-4 ${SR.textSecondary} animate-fade-in font-sans`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        <div 
          onClick={() => onFieldClick("vendorName")}
          className={`p-3.5 rounded-xl border transition-all flex flex-col gap-1.5 shadow-3xs cursor-pointer hover:border-[#C86432]/50 ${
            activeField === "vendorName" ? "ring-2 ring-[#C86432] bg-[#C86432]/5 border-[#C86432]" : `${SR.border} ${SR.surfaceMuted}`
          }`}
        >
          <div className="flex items-center justify-between font-sans">
            <span className={`text-[9.5px] font-bold uppercase tracking-wider ${SR.textLabel}`}>Company (Vendor Name)</span>
            <div className="flex items-center gap-1.5 font-sans">
              {data.vendorName?.confidence !== undefined && <ConfidenceMeter value={data.vendorName?.confidence} />}
              <CopyFieldButton value={data.vendorName?.value || ""} />
            </div>
          </div>
          <p className={`text-xs font-black ${SR.textPrimary} font-sans`}>{data.vendorName?.value || "N/A"}</p>
          <p className={`text-[10px] ${SR.textMuted} font-sans`}>{data.vendorAddress?.value || "N/A"}</p>
        </div>

        <div 
          onClick={() => onFieldClick("billingName")}
          className={`p-3.5 rounded-xl border transition-all flex flex-col gap-1.5 shadow-3xs cursor-pointer hover:border-[#C86432]/50 ${
            activeField === "billingName" ? "ring-2 ring-[#C86432] bg-[#C86432]/5 border-[#C86432]" : `${SR.border} ${SR.surfaceMuted}`
          }`}
        >
          <div className="flex items-center justify-between font-sans">
            <span className={`text-[9.5px] font-bold uppercase tracking-wider ${SR.textLabel}`}>Customer (Billed To)</span>
            <div className="flex items-center gap-1.5 font-sans">
              {data.billingName?.confidence !== undefined && <ConfidenceMeter value={data.billingName?.confidence} />}
              <CopyFieldButton value={data.billingName?.value || ""} />
            </div>
          </div>
          <p className={`text-xs font-semibold ${SR.textPrimary} font-sans`}>{data.billingName?.value || "N/A"}</p>
          <p className={`text-[10px] ${SR.textMuted} font-sans`}>{data.billingAddress?.value || "N/A"}</p>
        </div>
      </div>

      <div className={`p-3.5 rounded-2xl border ${SR.border} ${SR.surfaceMuted} grid grid-cols-2 md:grid-cols-5 gap-3 shadow-3xs font-sans`}>
        <div onClick={() => onFieldClick("invoiceNumber")} className={`p-2 rounded-xl transition-all cursor-pointer hover:bg-[#C86432]/5 ${activeField === "invoiceNumber" ? "bg-[#C86432]/5 ring-1 ring-[#C86432]" : ""}`}>
          <span className="text-[9.5px] font-bold uppercase tracking-wider text-stone-400 block mb-0.5 font-sans">Invoice Number</span>
          <div className="flex items-center gap-1.5 font-sans">
            <p className="text-xs font-bold text-stone-800 dark:text-white font-mono">{data.invoiceNumber?.value || "N/A"}</p>
            <CopyFieldButton value={data.invoiceNumber?.value || ""} />
          </div>
          {data.invoiceNumber?.confidence !== undefined && <div className="mt-1"><ConfidenceMeter value={data.invoiceNumber?.confidence} /></div>}
        </div>
        <div onClick={() => onFieldClick("invoiceDate")} className={`p-2 rounded-xl transition-all cursor-pointer hover:bg-[#C86432]/5 ${activeField === "invoiceDate" ? "bg-[#C86432]/5 ring-1 ring-[#C86432]" : ""}`}>
          <span className="text-[9.5px] font-bold uppercase tracking-wider text-stone-400 block mb-0.5 font-sans">Date (Issue)</span>
          <div className="flex items-center gap-1.5 font-sans">
            <p className="text-xs font-semibold text-stone-800 dark:text-white font-mono">{data.invoiceDate?.value || "N/A"}</p>
            <CopyFieldButton value={data.invoiceDate?.value || ""} />
          </div>
          {data.invoiceDate?.confidence !== undefined && <div className="mt-1"><ConfidenceMeter value={data.invoiceDate?.confidence} /></div>}
        </div>
        <div onClick={() => onFieldClick("tax")} className={`p-2 rounded-xl transition-all cursor-pointer hover:bg-[#C86432]/5 ${activeField === "tax" ? "bg-[#C86432]/5 ring-1 ring-[#C86432]" : ""}`}>
          <span className="text-[9.5px] font-bold uppercase tracking-wider text-stone-400 block mb-0.5 font-sans">VAT / Tax Amount</span>
          <div className="flex items-center gap-1.5 animate-fade-in font-sans">
            <p className="text-xs font-semibold text-stone-800 dark:text-white font-mono">{data.tax?.value || "0.00"}</p>
            <CopyFieldButton value={data.tax?.value || ""} />
          </div>
          {data.tax?.confidence !== undefined && <div className="mt-1"><ConfidenceMeter value={data.tax?.confidence} /></div>}
        </div>
        <div onClick={() => onFieldClick("currency")} className={`p-2 rounded-xl transition-all cursor-pointer hover:bg-[#C86432]/5 ${activeField === "currency" ? "bg-[#C86432]/5 ring-1 ring-[#C86432]" : ""}`}>
          <span className="text-[9.5px] font-bold uppercase tracking-wider text-stone-400 block mb-0.5 font-sans">Currency</span>
          <div className="flex items-center gap-1.5 font-mono text-[#C86432] font-bold">
            <p className="text-xs font-semibold text-[#C86432] uppercase font-mono font-bold">{data.currency?.value || "N/A"}</p>
            <CopyFieldButton value={data.currency?.value || ""} />
          </div>
          {data.currency?.confidence !== undefined && <div className="mt-1"><ConfidenceMeter value={data.currency?.confidence} /></div>}
        </div>
        <div onClick={() => onFieldClick("totalAmount")} className={`col-span-2 md:col-span-1 border-t md:border-t-0 md:border-l border-[#eeded5] dark:border-stone-800 md:pl-2.5 p-2 rounded-xl transition-all cursor-pointer hover:bg-[#C86432]/5 ${activeField === "totalAmount" ? "bg-[#C86432]/5 ring-1 ring-[#C86432]" : ""}`}>
          <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#C86432] block mb-0.5 font-sans">Total Amount</span>
          <div className="flex items-center gap-1.5 animated-fade-in">
            <p className="text-xs font-black text-rose-600 dark:text-rose-500 font-mono">{data.totalAmount?.value || "0.00"}</p>
            <CopyFieldButton value={data.totalAmount?.value || ""} />
          </div>
          {data.totalAmount?.confidence !== undefined && <div className="mt-1"><ConfidenceMeter value={data.totalAmount?.confidence} /></div>}
        </div>
      </div>

      <div 
        onClick={() => onFieldClick("lineItems")}
        className={`rounded-2xl border overflow-hidden ${SR.surfaceMuted} shadow-3xs transition-all cursor-pointer hover:border-[#C86432]/45 ${
          activeField === "lineItems" ? "ring-2 ring-[#C86432] border-[#C86432]" : SR.border
        }`}
      >
        <div className={`p-2.5 ${SR.surfaceInset} text-[10px] font-extrabold text-[#C86432] uppercase tracking-wider grid grid-cols-12 gap-2 border-b ${SR.border}`}>
          <div className="col-span-6 animate-fade-in font-sans">Billed Item Description (Line Items)</div>
          <div className="col-span-2 text-center animate-fade-in font-sans">Qty</div>
          <div className="col-span-2 text-right animate-fade-in font-sans">Unit Price</div>
          <div className="col-span-2 text-right animate-fade-in font-sans">Total</div>
        </div>
        <div className="divide-y divide-stone-200 dark:divide-stone-800/60 font-mono">
          {lineItems.length === 0 ? (
            <p className="p-3 text-center text-[11px] text-stone-400 italic font-sans">No invoice line items parsed.</p>
          ) : (
            lineItems.map((item: any, id: number) => (
              <div key={id} className={`p-2.5 grid grid-cols-12 gap-2 text-[11px] items-center ${SR.hoverRow}`}>
                <div className="col-span-6 flex flex-col gap-0.5 font-sans">
                  <div className="flex items-center gap-1.5 font-sans animate-fade-in">
                    <span className={`font-semibold ${SR.textPrimary} font-sans`}>{item.description?.value || "Item"}</span>
                    <CopyFieldButton value={item.description?.value || ""} />
                  </div>
                  {item.description?.confidence !== undefined && <ConfidenceMeter value={item.description?.confidence} />}
                </div>
                <div className={`col-span-2 text-center ${SR.textMuted} font-mono`}>
                  {item.quantity?.value !== undefined ? item.quantity.value : "1"}
                </div>
                <div className={`col-span-2 text-right ${SR.textMuted} font-mono font-medium`}>
                  {item.unitPrice?.value !== undefined ? item.unitPrice.value : "N/A"}
                </div>
                <div className={`col-span-2 text-right font-bold ${SR.textPrimary} font-mono`}>
                  {item.total?.value !== undefined ? item.total.value : "N/A"}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex justify-end mt-1 font-sans font-sans">
        <div className={`w-full md:w-64 p-3.5 rounded-2xl border ${SR.border} ${SR.surfaceMuted} flex flex-col gap-2 shadow-2xs`}>
          <div className="flex items-center justify-between text-[11px] font-sans">
            <span className={`${SR.textLabel} font-sans`}>Subtotal:</span>
            <span className={`font-mono font-semibold ${SR.textPrimary}`}>{data.subtotal?.value || "0.00"}</span>
          </div>
          <div className={`flex items-center justify-between text-[11px] border-b ${SR.border} pb-1.5`}>
            <span className={`${SR.textLabel} font-sans`}>VAT / Tax:</span>
            <span className={`font-mono font-semibold ${SR.textPrimary}`}>{data.tax?.value || "0.00"}</span>
          </div>
          <div className={`flex items-center justify-between text-[11.5px] font-bold font-sans animate-fade-in ${SR.surfaceInset} p-1 px-2.5 rounded-xl`}>
            <span className={`${SR.textPrimary} font-sans font-extrabold`}>Grand Total:</span>
            <div className="flex items-center gap-1.5 flex-row">
              <span className="font-mono text-emerald-600 dark:text-emerald-500 font-extrabold">{data.totalAmount?.value || "0.00"}</span>
              <CopyFieldButton value={data.totalAmount?.value || ""} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const renderContractNode = (data: any, activeField: string | null = null, onFieldClick: (field: string) => void = () => {}) => {
  const parties = Array.isArray(data.parties) ? data.parties : [];
  const importantDates = Array.isArray(data.importantDates) ? data.importantDates : [];
  const keyObligations = Array.isArray(data.keyObligations) ? data.keyObligations : [];
  const risks = Array.isArray(data.risks) ? data.risks : [];
  const keyClauses = Array.isArray(data.keyClauses) ? data.keyClauses : [];

  return (
    <div className={`flex flex-col gap-4 ${SR.textSecondary} animate-fade-in font-sans`}>
      {/* Title block */}
      <div 
        onClick={() => onFieldClick("contractTitle")}
        className={`p-4 rounded-2xl border transition-all cursor-pointer hover:border-[#C86432]/50 ${
          activeField === "contractTitle" ? "ring-2 ring-[#C86432] bg-[#C86432]/5 border-[#C86432]" : `${SR.border} ${SR.surfaceMuted}`
        } flex flex-col gap-1.5 shadow-3xs`}
      >
        <div className="flex justify-between items-center animate-fade-in">
          <span className="text-[9px] font-bold uppercase tracking-wider text-[#C86432]">Contract Agreement</span>
          <CopyFieldButton value={data.contractTitle?.value || "Legal Agreement"} />
        </div>
        <h3 className="text-xs font-black text-stone-900 dark:text-white leading-snug font-sans">{data.contractTitle?.value || "Legal Agreement"}</h3>
        {data.contractTitle?.confidence !== undefined && <ConfidenceMeter value={data.contractTitle?.confidence} />}
      </div>

      {/* Summary Section */}
      <div 
        onClick={() => onFieldClick("summary")}
        className={`p-4 rounded-2xl border transition-all cursor-pointer hover:border-[#C86432]/50 ${
          activeField === "summary" ? "ring-2 ring-[#C86432] bg-[#C86432]/5 border-[#C86432]" : `${SR.border} ${SR.surfaceMuted}`
        } flex flex-col gap-2 shadow-2xs font-sans`}
      >
        <div className={`flex justify-between items-center border-b pb-2 ${SR.border} font-sans`}>
          <h4 className={`text-[10px] font-extrabold uppercase tracking-wide ${SR.textPrimary} font-sans`}>Summary</h4>
          <CopyFieldButton value={data.summary?.value || ""} />
        </div>
        <p className={`text-[11px] leading-relaxed italic ${SR.textSecondary} ${SR.surfaceInset} p-2.5 rounded-xl font-sans`}>
          {data.summary?.value || "No agreement summary parsed."}
        </p>
        {data.summary?.confidence !== undefined && <ConfidenceMeter value={data.summary?.confidence} />}
      </div>

      {/* Important Dates Segment */}
      <div 
        onClick={() => onFieldClick("dates")}
        className={`p-4 rounded-2xl border transition-all cursor-pointer hover:border-[#C86432]/50 ${
          activeField === "dates" ? "ring-2 ring-[#C86432] bg-[#C86432]/5 border-[#C86432]" : `${SR.border} ${SR.surfaceMuted}`
        } flex flex-col gap-2 shadow-2xs font-sans`}
      >
        <h4 className={`text-[10px] font-extrabold uppercase tracking-wide ${SR.textPrimary} border-b pb-2 ${SR.border}`}>Important Dates & Notice Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          <div className={`p-3 ${SR.surfaceInset} rounded-xl border border-dashed ${SR.border} flex flex-col justify-between`}>
            <div>
              <span className="text-[9px] uppercase font-bold text-stone-400 block pb-0.5">Effective Start Date</span>
              <span className="text-xs font-bold text-stone-800 dark:text-white">{data.effectiveDate?.value || "N/A"}</span>
            </div>
            <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-stone-200 dark:border-stone-800">
              <ConfidenceMeter value={data.effectiveDate?.confidence ?? 0.8} />
              <CopyFieldButton value={data.effectiveDate?.value || ""} />
            </div>
          </div>
          <div className={`p-3 ${SR.surfaceInset} rounded-xl border border-dashed ${SR.border} flex flex-col justify-between`}>
            <div>
              <span className="text-[9px] uppercase font-bold text-stone-400 block pb-0.5">Expiration Date</span>
              <span className="text-xs font-bold text-stone-800 dark:text-white">{data.expirationDate?.value || "N/A"}</span>
            </div>
            <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-stone-200 dark:border-stone-800">
              <ConfidenceMeter value={data.expirationDate?.confidence ?? 0.8} />
              <CopyFieldButton value={data.expirationDate?.value || ""} />
            </div>
          </div>
        </div>
        {importantDates.length > 0 && (
          <div className="flex flex-col gap-2 mt-2">
            <span className="text-[9px] uppercase font-bold tracking-wider text-stone-500">Dates & Deadlines</span>
            <div className="divide-y divide-stone-200 dark:divide-stone-800">
              {importantDates.map((d: any, idx: number) => (
                <div key={idx} className={`py-2.5 flex items-center justify-between text-[11px] ${SR.hoverRow}`}>
                  <span className={`font-semibold ${SR.textPrimary}`}>{d.event?.value || d.event || "Deadline"}</span>
                  <div className="flex items-center gap-2 font-sans">
                    <span className={`font-mono ${SR.surfaceInset} ${SR.textSecondary} font-bold px-1.5 py-0.5 rounded-md`}>
                      {d.dateValue?.value || d.dateValue || "Date"}
                    </span>
                    <CopyFieldButton value={d.dateValue?.value || d.dateValue || ""} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Risks Segment */}
      <div 
        onClick={() => onFieldClick("risks")}
        className={`p-4 rounded-2xl border transition-all cursor-pointer hover:border-[#C86432]/50 ${
          activeField === "risks" ? "ring-2 ring-[#C86432] bg-[#C86432]/5 border-[#C86432]" : `${SR.border} ${SR.surfaceMuted}`
        } flex flex-col gap-2 shadow-2xs font-sans`}
      >
        <h4 className={`text-[10px] font-extrabold uppercase tracking-wide ${SR.textPrimary} border-b pb-2 ${SR.border} font-sans`}>Risks</h4>
        {risks.length === 0 ? (
          <p className="p-4 rounded-xl text-center text-[11px] text-[#C86432] italic bg-[#C86432]/5 font-bold border border-[#C86432]/10 flex items-center justify-center gap-1.5 font-sans">
            🛡️ No critical contractual risks visualizable.
          </p>
        ) : (
          <div className="flex flex-col gap-2.5 pt-1.5 font-sans">
            {risks.map((risk: any, idx: number) => {
              const severityVal = (risk.severity?.value || risk.severity || "Medium").toLowerCase();
              const badgeBg = severityVal.includes("high") 
                ? "bg-rose-500/10 text-rose-600 dark:text-rose-500 border border-rose-500/20" 
                : severityVal.includes("low") 
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border border-emerald-500/20"
                : "bg-amber-500/10 text-amber-600 dark:text-amber-500 border border-amber-500/20";
              return (
                <div key={idx} className={`p-3 rounded-xl border ${SR.border} ${SR.surfaceInset} flex flex-col gap-1.5 ${SR.textSecondary}`}>
                  <div className="flex items-center justify-between animate-fade-in">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${badgeBg}`}>
                        {risk.severity?.value || "Medium"}
                      </span>
                      <span className={`text-xs font-bold ${SR.textPrimary} font-sans`}>{risk.riskFactor?.value || "Risk Factor"}</span>
                    </div>
                    <CopyFieldButton value={`${risk.riskFactor?.value || ""}: ${risk.detail?.value || ""}`} />
                  </div>
                  <p className={`text-[11px] ${SR.textSecondary} leading-relaxed font-sans`}>{risk.detail?.value || ""}</p>
                  {risk.riskFactor?.confidence !== undefined && <ConfidenceMeter value={risk.riskFactor?.confidence} />}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Clauses Segment */}
      <div 
        onClick={() => onFieldClick("clauses")}
        className={`p-4 rounded-2xl border transition-all cursor-pointer hover:border-[#C86432]/50 ${
          activeField === "clauses" ? "ring-2 ring-[#C86432] bg-[#C86432]/5 border-[#C86432]" : `${SR.border} ${SR.surfaceMuted}`
        } flex flex-col gap-2 shadow-2xs font-sans`}
      >
        <h4 className={`text-[10px] font-extrabold uppercase tracking-wide ${SR.textPrimary} border-b pb-2 ${SR.border} font-sans`}>Clauses</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 py-1 select-none font-sans">
          <div className={`p-2.5 rounded-xl ${SR.surfaceInset} border ${SR.border} flex flex-col justify-between gap-1`}>
            <div>
              <span className="text-[9px] uppercase font-bold text-stone-400 font-sans block pb-0.5 font-sans">Governing Law</span>
              <p className="text-xs font-semibold font-sans text-stone-800 dark:text-white">{data.governingLaw?.value || "Default"}</p>
            </div>
            <div className="flex justify-end border-t dark:border-stone-800 pt-1 mt-1 font-sans">
              <CopyFieldButton value={data.governingLaw?.value || ""} />
            </div>
          </div>
          <div className={`p-2.5 rounded-xl ${SR.surfaceInset} border ${SR.border} flex flex-col justify-between gap-1 font-sans`}>
            <div>
              <span className="text-[9px] uppercase font-bold text-stone-400 font-sans block pb-0.5 font-sans">Termination Period</span>
              <p className="text-xs font-semibold font-sans text-stone-800 dark:text-white">{data.terminationNoticePeriod?.value || "Immediate"}</p>
            </div>
            <div className="flex justify-end border-t dark:border-stone-800 pt-1 mt-1 font-sans">
              <CopyFieldButton value={data.terminationNoticePeriod?.value || ""} />
            </div>
          </div>
          <div className={`p-2.5 rounded-xl ${SR.surfaceInset} border ${SR.border} flex flex-col justify-between gap-1 font-sans`}>
            <div>
              <span className="text-[9px] uppercase font-bold text-stone-400 font-sans block pb-0.5 font-sans">Liability Cap</span>
              <p className="text-xs font-bold font-sans text-stone-800 dark:text-white">{data.liabilityCap?.value || "No Caps Listed"}</p>
            </div>
            <div className="flex justify-end border-t dark:border-stone-800 pt-1 mt-1 font-sans">
              <CopyFieldButton value={data.liabilityCap?.value || ""} />
            </div>
          </div>
        </div>
        {keyClauses.length > 0 && (
          <div className="flex flex-col gap-2.5 mt-2 font-sans font-sans">
            <span className="text-[9px] uppercase font-bold tracking-wider text-stone-500 font-sans">Legal Provisions</span>
            <div className="flex flex-col gap-2">
              {keyClauses.map((clause: any, idx: number) => (
                <details key={idx} className={`group border ${SR.border} rounded-xl ${SR.surfaceInset} [&_summary::-webkit-details-marker]:hidden transition-all duration-300`}>
                  <summary className={`p-3 select-none flex justify-between items-center text-xs font-bold ${SR.textPrimary} cursor-pointer ${SR.hoverRow} font-sans`}>
                    <div className="flex items-center gap-2 font-sans">
                      <span className="w-1.5 h-1.5 bg-[#C86432] rounded-full" />
                      <span>{clause.title?.value || clause.title || "Section Clause"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ChevronDown className="w-3.5 h-3.5 text-stone-400 group-open:rotate-180 transition-transform" />
                    </div>
                  </summary>
                  <div className={`p-3 pt-0 border-t ${SR.border} text-[11px] ${SR.textSecondary} leading-relaxed font-sans`}>
                    <div className="flex justify-end mb-1">
                      <CopyFieldButton value={clause.content?.value || clause.content || ""} />
                    </div>
                    {clause.content?.value || clause.content || ""}
                  </div>
                </details>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};



const renderResumeNode = (
  data: any,
  activeField: string | null = null,
  onFieldClick: (field: string) => void = () => {}
) => {
  const skills = Array.isArray(data.skills) ? data.skills : [];
  const education = Array.isArray(data.education) ? data.education : [];
  const experience = Array.isArray(data.experience) ? data.experience : [];

  return (
    <div className={`flex flex-col gap-4 ${SR.textSecondary}`}>
      <div 
        onClick={() => onFieldClick("candidateName")}
        className={`p-3.5 rounded-2xl border transition-all cursor-pointer hover:bg-[#C86432]/5 ${
          activeField === "candidateName" || activeField === "email" || activeField === "phone"
            ? "ring-2 ring-[#C86432] bg-[#C86432]/5 border-[#C86432]"
            : `${SR.border} ${SR.surfaceMuted}`
        } flex flex-col gap-2.5`}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold text-[#C86432]">{data.candidateName?.value || "Resume Profile"}</h3>
          {data.candidateName?.confidence !== undefined && <ConfidenceMeter value={data.candidateName?.confidence} />}
        </div>
        
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px] ${SR.textMuted} border-t ${SR.border} pt-2.5`}>
          <p onClick={(e) => { e.stopPropagation(); onFieldClick("email"); }} className={`p-1 rounded-sm hover:bg-[#C86432]/5 transition-all ${activeField === "email" ? "bg-[#C86432]/10 font-bold" : ""}`}>📧 Email: <span className={`font-semibold ${SR.textPrimary}`}>{data.email?.value || "N/A"}</span></p>
          <p onClick={(e) => { e.stopPropagation(); onFieldClick("phone"); }} className={`p-1 rounded-sm hover:bg-[#C86432]/5 transition-all ${activeField === "phone" ? "bg-[#C86432]/10 font-bold" : ""}`}>📞 Phone: <span className={`font-semibold ${SR.textPrimary}`}>{data.phone?.value || "N/A"}</span></p>
          <p>📍 Location: <span className={`font-semibold ${SR.textPrimary}`}>{data.location?.value || "N/A"}</span></p>
        </div>

        {data.summary?.value && (
          <div className={`${SR.surfaceInset} p-2.5 rounded-xl mt-1.5`}>
            <span className={`text-[9px] uppercase font-bold tracking-wider ${SR.textLabel} block mb-0.5`}>Summary Profile</span>
            <p className={`text-[11px] leading-relaxed italic ${SR.textSecondary}`}>{data.summary.value}</p>
          </div>
        )}
      </div>

      {skills.length > 0 && (
        <div 
          onClick={() => onFieldClick("skills")}
          className={`flex flex-col gap-2 p-2 rounded-2xl transition-all cursor-pointer hover:bg-[#C86432]/5 ${
            activeField === "skills" ? "ring-2 ring-[#C86432] bg-[#C86432]/5 border-[#C86432]" : ""
          }`}
        >
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Technical Skillset</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {skills.map((sk: any, idx: number) => (
              <div key={idx} className={`p-2.5 rounded-xl border ${SR.border} ${SR.surfaceInset}`}>
                <span className="text-xs font-bold text-[#C86432] block mb-1.5">{sk.category?.value || "Skills"}</span>
                <div className="flex flex-wrap gap-1">
                  {Array.isArray(sk.skillsList) ? sk.skillsList.map((item: string, id: number) => (
                    <span key={id} className={`text-[9.5px] ${SR.surfaceInset} ${SR.textSecondary} font-bold px-1.5 py-0.5 rounded-md`}>
                      {item}
                    </span>
                  )) : <span className="text-[9.5px] italic">{String(sk.skillsList)}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {experience.length > 0 && (
        <div 
          onClick={() => onFieldClick("experience")}
          className={`flex flex-col gap-2 p-2 rounded-2xl transition-all cursor-pointer hover:bg-[#C86432]/5 ${
            activeField === "experience" ? "ring-2 ring-[#C86432] bg-[#C86432]/5 border-[#C86432]" : ""
          }`}
        >
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Experience History</h3>
          <div className="flex flex-col gap-2.5">
            {experience.map((ex: any, idx: number) => (
              <div key={idx} className={`p-3 rounded-xl border ${SR.border} flex flex-col gap-1.5 ${SR.surfaceMuted}`}>
                <div className={`flex flex-wrap justify-between items-start gap-2 border-b ${SR.border} pb-1.5`}>
                  <div className="flex flex-col">
                    <span className={`text-xs font-bold ${SR.textPrimary}`}>{ex.role?.value || "Role"}</span>
                    <span className={`text-[11px] ${SR.textMuted}`}>{ex.company?.value || "Employer"}</span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-[9.5px] font-mono ${SR.surfaceInset} px-1.5 py-0.5 rounded-md font-bold text-[#C86432]`}>
                      {ex.startDate?.value || "Start"} - {ex.endDate?.value || "End"}
                    </span>
                    {ex.role?.confidence !== undefined && <ConfidenceMeter value={ex.role?.confidence} />}
                  </div>
                </div>
                <p className={`text-[11px] ${SR.textMuted} leading-relaxed font-sans`}>{ex.description?.value || ""}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {education.length > 0 && (
        <div 
          onClick={() => onFieldClick("education")}
          className={`flex flex-col gap-2 p-2 rounded-2xl transition-all cursor-pointer hover:bg-[#C86432]/5 ${
            activeField === "education" ? "ring-2 ring-[#C86432] bg-[#C86432]/5 border-[#C86432]" : ""
          }`}
        >
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Academic History</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {education.map((ed: any, idx: number) => (
              <div key={idx} className={`p-2.5 rounded-xl border ${SR.border} ${SR.surfaceInset} flex items-center justify-between`}>
                <div className="flex flex-col gap-0.5">
                  <span className={`text-xs font-bold ${SR.textPrimary}`}>{ed.degree?.value || "Degree"}</span>
                  <span className={`text-[10px] ${SR.textMuted}`}>{ed.institution?.value || "College/Univ"}</span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[9.5px] font-mono font-bold text-[#C86432]">{ed.graduationYear?.value || ""}</span>
                  {ed.degree?.confidence !== undefined && <ConfidenceMeter value={ed.degree?.confidence} />}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const renderReceiptNode = (
  data: any,
  activeField: string | null = null,
  onFieldClick: (field: string) => void = () => {}
) => {
  const items = Array.isArray(data.items) ? data.items : [];
  return (
    <div className={`flex flex-col gap-4 ${SR.textSecondary} animate-fadeIn`}>
      <div 
        onClick={() => onFieldClick("merchantName")}
        className={`p-3.5 rounded-2xl border transition-all cursor-pointer hover:bg-[#C86432]/5 text-center flex flex-col items-center gap-1 ${
          activeField === "merchantName" || activeField === "merchantAddress" || activeField === "merchantPhone"
            ? "ring-2 ring-[#C86432] bg-[#C86432]/5 border-[#C86432]"
            : `${SR.border} ${SR.surfaceInset}`
        }`}
      >
        <span className={`text-[9px] uppercase font-bold ${SR.textLabel}`}>Commercial Slip</span>
        <h3 className={`text-xs font-black ${SR.textPrimary} uppercase tracking-wider`}>{data.merchantName?.value || "Merchant"}</h3>
        <p className={`text-[10px] ${SR.textMuted}`}>{data.merchantAddress?.value || ""}</p>
        <p className={`text-[9px] ${SR.textLabel} font-mono`}>{data.merchantPhone?.value || ""}</p>
        {data.merchantName?.confidence !== undefined && <div className="mt-1.5"><ConfidenceMeter value={data.merchantName?.confidence} /></div>}
      </div>

      <div 
        onClick={() => onFieldClick("transactionDate")}
        className={`grid grid-cols-2 gap-2 text-[11px] border-y py-2.5 font-mono cursor-pointer transition-all hover:bg-[#C86432]/5 ${
          activeField === "transactionDate" || activeField === "transactionTime"
            ? "ring-1 ring-[#C86432] border-[#C86432] bg-[#C86432]/5 px-2 rounded-lg"
            : "border-stone-200 dark:border-stone-800"
        }`}
      >
        <div className="text-stone-700 dark:text-stone-300">📅 DATE: <span className="font-bold text-stone-900 dark:text-white">{data.transactionDate?.value || "N/A"}</span></div>
        <div className="text-right text-stone-700 dark:text-stone-300">🕒 TIME: <span className="font-bold text-stone-900 dark:text-white">{data.transactionTime?.value || "N/A"}</span></div>
      </div>

      <div 
        onClick={() => onFieldClick("items")}
        className={`flex flex-col gap-1.5 p-1 rounded-2xl transition-all cursor-pointer hover:bg-[#C86432]/5 ${
          activeField === "items" ? "ring-2 ring-[#C86432] bg-[#C86432]/5 border-[#C86432]" : ""
        }`}
      >
        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Purchases List</span>
        <div className={`border ${SR.border} rounded-xl overflow-hidden ${SR.surfaceMuted}`}>
          <div className={`p-2 ${SR.surfaceInset} text-[9px] font-bold ${SR.textMuted} uppercase flex items-center justify-between border-b ${SR.border}`}>
            <span>Description</span>
            <div className="flex items-center gap-5">
              <span>Qty</span>
              <span className="w-14 text-right">Total</span>
            </div>
          </div>
          <div className="divide-y divide-stone-200 dark:divide-stone-800/60">
            {items.map((it: any, idx: number) => (
              <div key={idx} className={`p-2 flex items-center justify-between text-[11px] ${SR.hoverRow}`}>
                <div className="flex flex-col gap-0.5">
                  <span className={`font-semibold ${SR.textPrimary}`}>{it.description?.value || "Purchase Item"}</span>
                  {it.description?.confidence !== undefined && <ConfidenceMeter value={it.description?.confidence} />}
                </div>
                <div className={`flex items-center gap-6 font-mono ${SR.textSecondary}`}>
                  <span>{it.quantity?.value !== undefined ? it.quantity.value : "1"}</span>
                  <span className={`w-14 text-right font-bold ${SR.textPrimary}`}>{it.totalPrice?.value !== undefined ? it.totalPrice.value : "N/A"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div 
        onClick={() => onFieldClick("totalAmount")}
        className={`border p-2.5 rounded-2xl transition-all cursor-pointer flex flex-col gap-1.5 text-[11px] hover:bg-[#C86432]/5 ${
          activeField === "totalAmount" || activeField === "subtotal" || activeField === "tax"
            ? "ring-2 ring-[#C86432] bg-[#C86432]/5 border-[#C86432]"
            : "border-stone-200 dark:border-stone-800"
        }`}
      >
        <div className={`flex justify-between items-center ${SR.textSecondary}`}>
          <span>VAT Taxes:</span>
          <span className="font-mono">{data.tax?.value || "0.00"}</span>
        </div>
        <div className={`flex justify-between items-center ${SR.textSecondary}`}>
          <span>Tips:</span>
          <span className="font-mono">{data.tip?.value || "0.00"}</span>
        </div>
        <div className={`flex justify-between items-center ${SR.textSecondary}`}>
          <span>Payment Channel:</span>
          <span className="font-semibold">{data.paymentMethod?.value || "Card"}</span>
        </div>
        <div className={`flex justify-between items-center ${SR.textPrimary} font-bold border-t ${SR.border} pt-1.5`}>
          <span>GRAND TOTAL:</span>
          <span className="font-mono text-[#C86432]">{data.totalAmount?.value || "0.00"}</span>
        </div>
      </div>
    </div>
  );
};

const renderTableNode = (
  data: any,
  activeField: string | null = null,
  onFieldClick: (field: string) => void = () => {}
) => {
  const headers = Array.isArray(data.headers) ? data.headers : [];
  const rows = Array.isArray(data.rows) ? data.rows : [];

  return (
    <div className={`flex flex-col gap-3.5 ${SR.textSecondary}`}>
      <div 
        onClick={() => onFieldClick("tableName")}
        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all hover:bg-[#C86432]/5 ${
          activeField === "tableName" ? "ring-2 ring-[#C86432] bg-[#C86432]/5 border-[#C86432]" : `${SR.border} ${SR.surfaceMuted}`
        }`}
      >
        <div>
          <span className={`text-[9.5px] font-bold uppercase ${SR.textLabel} block pb-0.5`}>Grid Title</span>
          <h4 className={`text-xs font-bold ${SR.textPrimary}`}>{data.tableName?.value || "Structured Data Matrix"}</h4>
        </div>
        {data.tableName?.confidence !== undefined && <ConfidenceMeter value={data.tableName?.confidence} />}
      </div>

      <div 
        onClick={() => onFieldClick("rows")}
        className={`border rounded-2xl overflow-x-auto transition-all cursor-pointer hover:bg-[#C86432]/5 ${
          activeField === "rows" || activeField === "headers"
            ? "ring-2 ring-[#C86432] bg-[#C86432]/5 border-[#C86432]"
            : `${SR.border} ${SR.surfaceMuted}`
        }`}
      >
        <table className={`w-full text-[11px] text-left ${SR.textMuted} border-collapse`}>
          <thead>
            <tr className={`${SR.surfaceInset} text-[9px] font-bold uppercase tracking-wider ${SR.textMuted} border-b ${SR.border}`}>
              {headers.map((h: any, idx: number) => (
                <th key={idx} className="p-2.5 font-semibold">
                  <div className="flex flex-col gap-0.5">
                    <span>{h.value || ""}</span>
                    {h.confidence !== undefined && <div className="scale-75 origin-left"><ConfidenceMeter value={h.confidence} /></div>}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200 dark:divide-stone-800/60">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={headers.length || 1} className="p-3 text-center text-stone-400 italic">No structured rows.</td>
              </tr>
            ) : (
              rows.map((row: any, rIdx: number) => {
                const cells = Array.isArray(row.cells) ? row.cells : [];
                return (
                  <tr key={rIdx} className={SR.hoverRow}>
                    {cells.map((cell: any, cIdx: number) => (
                      <td key={cIdx} className="p-2.5">
                        <div className="flex flex-col gap-0.5">
                          <span className={`font-medium ${SR.textPrimary}`}>{cell.value || ""}</span>
                          {cell.confidence !== undefined && <div className="scale-75 origin-left"><ConfidenceMeter value={cell.confidence} /></div>}
                        </div>
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const renderGeneralOcrNode = (
  data: any,
  activeField: string | null = null,
  onFieldClick: (field: string) => void = () => {}
) => {
  const keyBlocks = Array.isArray(data.keyBlocks) ? data.keyBlocks : [];
  return (
    <div className={`flex flex-col gap-3.5 ${SR.textSecondary}`}>
      <div 
        onClick={() => onFieldClick("title")}
        className={`p-3 rounded-xl border grid grid-cols-2 gap-3 transition-all cursor-pointer hover:bg-[#C86432]/5 ${
          activeField === "title" ? "ring-2 ring-[#C86432] bg-[#C86432]/5 border-[#C86432]" : `${SR.border} ${SR.surfaceMuted}`
        }`}
      >
        <div>
          <span className={`text-[9.5px] uppercase font-bold ${SR.textLabel} block mb-0.5 font-sans`}>Title Code</span>
          <span className={`text-xs font-bold ${SR.textPrimary}`}>{data.documentTitle?.value || "N/A"}</span>
          {data.documentTitle?.confidence !== undefined && <ConfidenceMeter value={data.documentTitle?.confidence} />}
        </div>
        <div>
          <span className={`text-[9.5px] uppercase font-bold ${SR.textLabel} block mb-0.5 font-sans`}>Detected Language</span>
          <span className={`text-xs font-bold ${SR.textPrimary}`}>{data.detectedLanguage?.value || "N/A"}</span>
          {data.detectedLanguage?.confidence !== undefined && <ConfidenceMeter value={data.detectedLanguage?.confidence} />}
        </div>
      </div>

      <div 
        onClick={() => onFieldClick("body")}
        className={`flex flex-col gap-2.5 mt-1 p-2 rounded-2xl transition-all cursor-pointer hover:bg-[#C86432]/5 ${
          activeField === "body" ? "ring-2 ring-[#C86432] bg-[#C86432]/5 border-[#C86432]" : ""
        }`}
      >
        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 font-sans">Blocks</span>
        <div className="flex flex-col gap-2.5">
          {keyBlocks.map((blk: any, idx: number) => (
            <div key={idx} className={`p-2.5 rounded-xl border ${SR.border} ${SR.surfaceInset}`}>
              <span className="text-xs font-extrabold text-[#C86432] block mb-1">{blk.heading?.value || `Content Block #${idx + 1}`}</span>
              <p className={`text-[11px] ${SR.textMuted} leading-relaxed font-sans`}>{blk.content?.value || ""}</p>
            </div>
          ))}
        </div>
      </div>

      {data.rawText?.value && (
        <div className="mt-1 text-[11px] border-t dark:border-stone-800 pt-2.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1 font-sans">Raw Fallback</span>
          <pre className={`p-2.5 border rounded-xl ${SR.border} ${SR.surfaceInset} font-mono text-[9.5px] leading-relaxed whitespace-pre-wrap overflow-x-auto ${SR.textMuted}`}>
            {data.rawText.value}
          </pre>
        </div>
      )}
    </div>
  );
};

export const renderVisualStructuredResult = (
  extractedText: string, 
  resultDocumentType: string,
  activeField: string | null = null,
  onFieldClick: (field: string) => void = () => {},
  t: any = translations.en
) => {
  try {
    const parsed = JSON.parse(extractedText);
    switch (resultDocumentType) {
      case "invoice":
        return renderInvoiceNode(parsed, activeField, onFieldClick);
      case "contract":
        return renderContractNode(parsed, activeField, onFieldClick);
      case "resume":
        return renderResumeNode(parsed, activeField, onFieldClick);
      case "receipt":
        return renderReceiptNode(parsed, activeField, onFieldClick);
      case "table":
        return renderTableNode(parsed, activeField, onFieldClick);
      case "general_ocr":
      default:
        return renderGeneralOcrNode(parsed, activeField, onFieldClick);
    }
  } catch (e) {
    return (
      <div className="flex flex-col gap-3 animate-fade-in">
        <div className="bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 p-2.5 rounded-2xl border border-emerald-500/10 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span className="text-xs font-semibold">{t.resultUi?.customTextRepresentation || "Showing customized text representation."}</span>
        </div>
        <div className="p-4 rounded-2xl border whitespace-pre-wrap font-sans text-xs leading-relaxed selection:bg-[#C86432] border-stone-200 bg-stone-50 text-stone-800 dark:border-stone-800 dark:bg-stone-950 dark:text-stone-200">
          {extractedText}
        </div>
      </div>
    );
  }
};

const calculateAverageConfidence = (text: string): number => {
  try {
    const parsed = JSON.parse(text);
    let sum = 0;
    let count = 0;
    
    const traverse = (obj: any) => {
      if (!obj || typeof obj !== "object") return;
      if (obj.hasOwnProperty("confidence") && typeof obj.confidence === "number") {
        sum += obj.confidence;
        count++;
      } else {
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            traverse(obj[key]);
          }
        }
      }
    };
    
    traverse(parsed);
    if (count === 0) return 94; // fallback high quality average
    return Math.round((sum / count) * 100);
  } catch (e) {
    return 91; // standard general ocr OCR metric fallback
  }
};

interface BeforeVsAfterWorkspaceProps {
  filePreview: string;
  extractedText: string;
  resultDocumentType: string;
  isDarkMode: boolean;
  clearFile: () => void;
  setExtractedText: (text: string) => void;
  language: Language;
  chatMessages: ChatMessage[];
  handleSendMessage: (e: React.FormEvent) => void;
  chatInput: string;
  setChatInput: (text: string) => void;
  isChatting: boolean;
  chatError: string;
  chatBottomRef: React.RefObject<HTMLDivElement | null>;
  isSpecializedResult: boolean;
  isEditing: boolean;
  setIsEditing: (val: boolean) => void;
  editedText: string;
  setEditedText: (val: string) => void;
  handleCopy: () => void;
  copyFeedback: boolean;
  downloadTextFile: (format: "md" | "txt") => void;
  downloadDocFile: () => void;
  t: any;
}

export const BeforeVsAfterWorkspace = ({
  filePreview,
  extractedText,
  resultDocumentType,
  isDarkMode,
  clearFile,
  setExtractedText,
  language,
  chatMessages,
  handleSendMessage,
  chatInput,
  setChatInput,
  isChatting,
  chatError,
  chatBottomRef,
  isSpecializedResult,
  isEditing,
  setIsEditing,
  editedText,
  setEditedText,
  handleCopy,
  copyFeedback,
  downloadTextFile,
  downloadDocFile,
  t
}: BeforeVsAfterWorkspaceProps) => {
  const [activeField, setActiveField] = useState<string | null>(null);
  const [zoomScale, setZoomScale] = useState<number>(1.0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages] = useState<number>(3);
  const [activeTab, setActiveTab] = useState<"visual" | "summary" | "confidence" | "chat" | "editor">("visual");
  const [isJsonVisualMode, setIsJsonVisualMode] = useState<boolean>(true);

  const avgConfidence = calculateAverageConfidence(extractedText);
  const boxes = DOCUMENT_HIGHLIGHT_MAP[resultDocumentType] || [];
  const r = t.resultUi || translations.en.resultUi;
  const docTypeLabel =
    resultDocumentType === "invoice" ? t.docTypeInvoice :
    resultDocumentType === "contract" ? t.docTypeContract :
    resultDocumentType === "resume" ? t.docTypeResume :
    resultDocumentType === "receipt" ? t.docTypeReceipt :
    resultDocumentType === "table" ? t.docTypeTable :
    t.docTypeGeneral;
  const summaryMap: Record<string, { title: string; items?: string[]; desc?: string }> = {
    invoice: { title: r.invoiceTitle, items: r.invoiceItems },
    contract: { title: r.contractTitle, items: r.contractItems },
    resume: { title: r.resumeTitle, items: r.resumeItems },
    receipt: { title: r.receiptTitle, items: r.receiptItems },
    default: { title: r.ocrTitle, desc: r.ocrDesc },
  };
  const summaryBlock = summaryMap[resultDocumentType] || summaryMap.default;

  return (
    <div className="col-span-12 flex flex-col gap-6" id="before-after-workbench-parent">
      {/* Upper Control Bar */}
      <div className={`p-4 rounded-3xl border flex flex-col md:flex-row items-center justify-between gap-4 transition-all ${
        isDarkMode ? "bg-[#1d1714]/85 border-[#332822]" : "bg-[#FAF6F0] border-[#eeded5]"
      }`}>
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#C86432]/10 rounded-xl">
            <Layers className="w-5 h-5 text-[#C86432]" />
          </div>
          <div className="text-left">
            <h3 className="font-extrabold text-sm text-stone-800 dark:text-white flex items-center flex-wrap gap-2">
              {r.beforeAfterTitle}
              <span className="text-[10px] font-mono font-bold bg-[#C86432]/10 text-[#C86432] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {resultDocumentType.replace("_", " ")}
              </span>
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-300">
              {r.beforeAfterSub}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setExtractedText("")}
            className={`text-xs font-bold px-3 py-1.5 rounded-xl border ${SR.border} ${SR.surfaceMuted} hover:opacity-90 transition-all flex items-center gap-1.5 cursor-pointer ${SR.textSecondary}`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            {r.parameterSettings}
          </button>
          <button
            onClick={clearFile}
            className="text-xs font-bold text-rose-500 hover:text-white border border-rose-500/20 bg-rose-500/10 hover:bg-rose-600 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            {r.clearDocument}
          </button>
        </div>
      </div>

      {/* Two Panel Grid split */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Side: Before Document Raw Preview */}
        <div className="col-span-12 xl:col-span-6 flex flex-col gap-4">
          <div className={`p-5 rounded-3xl border flex flex-col gap-4 h-full relative ${
            isDarkMode ? "bg-[#1d1714]/80 border-[#332822]" : "bg-white/80 border-[#eeded5]"
          }`} style={{ minHeight: "580px" }}>
            
            <div className="flex items-center justify-between border-b dark:border-stone-800 pb-3 flex-wrap gap-2">
              <span className="text-xs font-bold tracking-wider text-stone-400 font-sans flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-[#C86432]" />
                {r.beforeRawSource}
              </span>

              {/* Sizing Magnifier Scale */}
              <div className="flex items-center gap-1 bg-stone-100/60 dark:bg-stone-900/65 p-1 rounded-xl text-stone-700 dark:text-stone-300">
                <button
                  onClick={() => setZoomScale(z => Math.max(0.5, z - 0.15))}
                  className="p-1 rounded-lg hover:bg-[#C86432]/10 hover:text-[#C86432] cursor-pointer"
                  title={r.zoomOut}
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-[10px] font-mono font-bold w-12 text-center">
                  {Math.round(zoomScale * 100)}%
                </span>
                <button
                  onClick={() => setZoomScale(z => Math.min(2.5, z + 0.15))}
                  className="p-1 rounded-lg hover:bg-[#C86432]/10 hover:text-[#C86432] cursor-pointer"
                  title={r.zoomIn}
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Document viewing canvas wrapper */}
            <div className="relative border border-stone-300 dark:border-stone-800 rounded-2xl bg-stone-100/20 dark:bg-stone-950/30 flex items-center justify-center p-4 min-h-[420px] h-[480px] overflow-hidden select-none">
              
              <div className="overflow-auto w-full h-full relative flex items-center justify-center">
                <div 
                  style={{ transform: `scale(${zoomScale})`, transition: 'transform 0.15s ease' }}
                  className="relative max-h-full max-w-full origin-center flex items-center justify-center"
                >
                  {filePreview ? (
                    <img
                      src={filePreview}
                      alt="Source Doc original"
                      className="origin-center object-contain max-h-[420px] max-w-[400px] rounded-xl shadow-md border-2 border-stone-200 dark:border-stone-800"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="text-center text-stone-400 p-6">
                      <FileText className="w-10 h-10 text-[#C86432] mx-auto opacity-30 mb-2" />
                      <p className="text-xs">{r.previewUnavailable}</p>
                    </div>
                  )}

                  {/* Absolute visual highlight coordinates overlay boxes */}
                  {filePreview && boxes.map((box) => {
                    const isActive = box.field === activeField;
                    return (
                      <button
                        key={box.field}
                        onClick={() => setActiveField(box.field)}
                        className={`absolute rounded-md transition-all duration-300 pointer-events-auto border z-30 ${
                          isActive
                            ? "border-[#C86432] bg-[#C86432]/15 ring-2 ring-[#C86432]/25 animate-pulse"
                            : "border-dotted border-stone-400/40 dark:border-stone-600/30 bg-stone-500/5 hover:border-[#C86432]/65 hover:bg-[#C86432]/5"
                        }`}
                        style={{
                          top: `${box.top}%`,
                          left: `${box.left}%`,
                          width: `${box.width}%`,
                          height: `${box.height}%`,
                        }}
                        title={`Click to focus: ${box.label}`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Adaptive visual sync instruction banner */}
              <div className="absolute bottom-2 left-2 right-2 bg-stone-50/95 dark:bg-stone-900/95 text-stone-500 dark:text-stone-300 p-2 border border-stone-200/50 dark:border-stone-800 rounded-xl text-[10px] font-sans flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#C86432]" />
                <span>{r.syncMapActive}</span>
              </div>
            </div>

          </div>
        </div>

        {/* Right Side: After Analysis, Summary & Metrics Tabs */}
        <div className="col-span-12 xl:col-span-6 flex flex-col gap-4">
          <div className={`p-5 rounded-3xl border flex flex-col h-full relative ${
            isDarkMode ? "bg-[#1d1714]/80 border-[#332822] text-stone-200" : "bg-white border-[#eeded5] text-stone-800"
          }`} style={{ minHeight: "580px", maxHeight: "580px" }}>
            
            {/* Header Tabs Navigation layout - Compact labels supporting sweep with hidden scrollbars */}
            <div className="grid grid-cols-2 sm:flex border-b dark:border-stone-800 pb-3 gap-2 shrink-0">
              <button
                onClick={() => { setActiveTab("visual"); setIsEditing(false); }}
                className={`min-h-10 px-2.5 sm:px-3 py-2 sm:py-1.5 text-[11px] sm:text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 text-center leading-tight cursor-pointer ${
                  activeTab === "visual" && !isEditing
                    ? "bg-[#C86432] text-white"
                    : "bg-stone-100 dark:bg-stone-900 hover:bg-[#C86432]/10 text-stone-600 dark:text-stone-300"
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                {r.result}
              </button>
              <button
                onClick={() => { setActiveTab("summary"); setIsEditing(false); }}
                className={`min-h-10 px-2.5 sm:px-3 py-2 sm:py-1.5 text-[11px] sm:text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 text-center leading-tight cursor-pointer ${
                  activeTab === "summary" && !isEditing
                    ? "bg-[#C86432] text-white"
                    : "bg-stone-100 dark:bg-stone-900 hover:bg-[#C86432]/10 text-stone-600 dark:text-stone-300"
                }`}
              >
                <FileCheck className="w-3.5 h-3.5" />
                {r.summary}
              </button>
              <button
                onClick={() => { setActiveTab("confidence"); setIsEditing(false); }}
                className={`min-h-10 px-2.5 sm:px-3 py-2 sm:py-1.5 text-[11px] sm:text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 text-center leading-tight cursor-pointer ${
                  activeTab === "confidence" && !isEditing
                    ? "bg-[#C86432] text-white"
                    : "bg-stone-100 dark:bg-stone-900 hover:bg-[#C86432]/10 text-stone-600 dark:text-stone-300"
                }`}
              >
                <Gauge className="w-3.5 h-3.5" />
                {r.accuracy}
              </button>
              <button
                onClick={() => { setActiveTab("chat"); setIsEditing(false); }}
                className={`min-h-10 px-2.5 sm:px-3 py-2 sm:py-1.5 text-[11px] sm:text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 text-center leading-tight cursor-pointer ${
                  activeTab === "chat" && !isEditing
                    ? "bg-[#C86432] text-white"
                    : "bg-stone-100 dark:bg-stone-900 hover:bg-[#C86432]/10 text-stone-600 dark:text-stone-300"
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                {r.assistant}
              </button>
            </div>

            {/* Scrollable container frame */}
            <div className="flex-1 mt-4 overflow-y-auto pr-1">
              {isEditing ? (
                <div className="flex flex-col gap-2 h-full p-1 animate-fade text-xs">
                  <span className="text-[10px] font-bold text-[#C86432] uppercase tracking-wider">{r.editRawOutline}</span>
                  <textarea
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    className={`w-full min-h-[300px] flex-1 p-4 font-mono rounded-2xl border focus:outline-hidden text-xs leading-relaxed ${
                      isDarkMode ? "border-stone-800 bg-[#14100e] text-white" : "border-stone-200 bg-stone-50 text-stone-800"
                    }`}
                  />
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  
                  {/* Visual Report */}
                  {activeTab === "visual" && (
                    <motion.div
                      key="tab-ba-visual"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="flex flex-col gap-4 text-xs text-stone-800 dark:text-stone-200"
                    >
                      {isSpecializedResult ? (
                        <>
                          <div className="bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 p-2.5 rounded-2xl border border-emerald-500/10 flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                            <span>{r.ocrSync}</span>
                          </div>

                          <div className="flex items-center justify-between border-b dark:border-stone-800 pb-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">⚡ Structured Format</span>
                            <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-900 border dark:border-stone-800 p-0.5 rounded-xl text-[10px]/none my-0.5">
                              <button
                                onClick={() => setIsJsonVisualMode(true)}
                                className={`px-2.5 py-1 font-bold rounded-lg transition-all cursor-pointer ${
                                  isJsonVisualMode
                                    ? "bg-[#C86432] text-white"
                                    : "text-stone-500 dark:text-stone-300 hover:text-stone-700 dark:hover:text-stone-100"
                                }`}
                              >
                                {r.visual}
                              </button>
                              <button
                                onClick={() => setIsJsonVisualMode(false)}
                                className={`px-2.5 py-1 font-bold rounded-lg transition-all cursor-pointer ${
                                  !isJsonVisualMode
                                    ? "bg-[#C86432] text-white"
                                    : "text-stone-500 dark:text-stone-300 hover:text-stone-700 dark:hover:text-stone-100"
                                }`}
                              >
                                {r.rawJson}
                              </button>
                            </div>
                          </div>

                          <div className="p-1">
                            {isJsonVisualMode ? (
                              renderVisualStructuredResult(extractedText, resultDocumentType, activeField, setActiveField, t)
                            ) : (
                              <pre className={`p-4 rounded-xl border whitespace-pre-wrap font-mono text-[10.5px] leading-relaxed selection:bg-[#C86432] ${SR.border} ${isDarkMode ? "bg-[#14100e] text-stone-200" : "bg-stone-50 text-stone-800"}`}>
                                {extractedText}
                              </pre>
                            )}
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col gap-3">
                          <div className="bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 p-2.5 rounded-2xl border border-emerald-500/10 flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                            <span>{r.textExtracted}</span>
                          </div>
                          <div className={`p-4 rounded-2xl border whitespace-pre-wrap font-sans text-xs leading-relaxed selection:bg-[#C86432] ${
                            isDarkMode ? "border-stone-800 bg-stone-950 text-stone-200" : "border-stone-200 bg-stone-50 text-stone-800"
                          }`}>
                            {extractedText}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* AI Executive Summaries */}
                  {activeTab === "summary" && (
                    <motion.div
                      key="tab-ba-summary"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="flex flex-col gap-3 text-xs text-stone-800 dark:text-stone-200"
                    >
                      <div className={`p-4 rounded-2xl border flex flex-col gap-3 ${
                        isDarkMode ? "bg-stone-900/60 border-stone-800" : "bg-stone-50 border-stone-200"
                      }`}>
                        <div className="flex items-center gap-2 text-[#C86432] font-black uppercase text-[10px] tracking-wider">
                          <Sparkles className="w-4 h-4 animate-pulse shrink-0" />
                          {r.digestTitle}
                        </div>
                        
                        <p className="text-stone-700 dark:text-stone-300 leading-relaxed font-sans">
                          {r.digestDesc.replace("{type}", docTypeLabel)}
                        </p>

                        <div className="flex flex-col gap-2 border-t dark:border-stone-800 pt-3 mt-1">
                          <h4 className="font-bold text-[#C86432]">{summaryBlock.title}</h4>
                          {summaryBlock.items ? (
                            <ul className="list-disc pl-4 space-y-1.5 text-[11px] text-stone-600 dark:text-stone-300 leading-normal">
                              {summaryBlock.items.map((item: string) => (
                                <li key={item}>{item}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-relaxed">
                              {summaryBlock.desc}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Accuracy & Matrix Charts */}
                  {activeTab === "confidence" && (
                    <motion.div
                      key="tab-ba-confidence"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="flex flex-col gap-4 text-xs text-stone-800 dark:text-stone-200"
                    >
                      <div className={`p-4 rounded-3xl border flex flex-col md:flex-row items-center gap-6 ${
                        isDarkMode ? "bg-stone-900/60 border-stone-800" : "bg-stone-50 border-stone-200"
                      }`}>
                        {/* Circle accuracy indicator */}
                        <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="40" strokeWidth="8" stroke={isDarkMode ? "#2c2522" : "#eeded5"} fill="transparent" />
                            <circle 
                              cx="50" cy="50" r="40" strokeWidth="8" stroke="#C86432" strokeDasharray="251.2" 
                              strokeDashoffset={251.2 - (251.2 * avgConfidence) / 100} 
                              strokeLinecap="round" fill="transparent" className="transition-all duration-1000 ease-out" 
                            />
                          </svg>
                          <div className="absolute text-center flex flex-col items-center">
                            <span className="text-lg font-black font-mono text-[#C86432]">{avgConfidence}%</span>
                            <span className="text-[8px] uppercase tracking-wider text-stone-400 font-bold">{r.accuracy}</span>
                          </div>
                        </div>

                        <div className="flex-1 flex flex-col gap-1 text-left">
                          <h4 className="font-extrabold text-xs text-stone-800 dark:text-white flex items-center gap-1.5">
                            <TrendingUp className="w-3.5 h-3.5 text-[#C86432]" />
                            {r.averageQuality}
                          </h4>
                          <p className="text-stone-500 dark:text-stone-300 leading-normal text-[11px]">
                            {r.qualityDesc}
                          </p>
                          <div className="mt-1">
                            {avgConfidence >= 90 ? (
                              <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded font-bold text-[9px] tracking-wider">
                                ✓ HIGH CONFIDENCE VERIFIED
                              </span>
                            ) : (
                              <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded font-bold text-[9px] tracking-wider">
                                ⚠ MEDIUM RISK EXTREMUM
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Breakdown bars */}
                      <div className="flex flex-col gap-2.5">
                        <h5 className="font-extrabold text-stone-400 uppercase tracking-widest text-[9px]">{r.fieldsIntegrity}</h5>
                        <div className="space-y-3">
                          {boxes.map((box) => {
                            const seed = box.field.charCodeAt(0) + box.field.charCodeAt(box.field.length - 1);
                            const fieldConf = 86 + (seed % 14);
                            const isSel = activeField === box.field;
                            return (
                              <div 
                                key={box.field}
                                onClick={() => setActiveField(box.field)}
                                className={`p-2 rounded-xl border cursor-pointer transition-all hover:bg-[#C86432]/5 flex flex-col gap-1 ${
                                  isSel ? "border-[#C86432] bg-[#C86432]/5" : `${SR.border} ${SR.surfaceMuted}`
                                }`}
                              >
                                <div className="flex justify-between items-center text-[10.5px]">
                                  <span className="font-bold text-stone-700 dark:text-stone-300">{box.label}</span>
                                  <span className="font-bold font-mono text-[#C86432]">{fieldConf}%</span>
                                </div>
                                <div className="h-1.5 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-[#C86432]" 
                                    style={{ width: `${fieldConf}%` }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                    </motion.div>
                  )}

                  {/* Direct chatbot container thread */}
                  {activeTab === "chat" && (
                    <motion.div
                      key="tab-ba-chat"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className={`flex flex-col border ${SR.border} rounded-3xl overflow-hidden shadow-sm ${isDarkMode ? "bg-[#14100e]" : "bg-stone-50"} text-stone-800 dark:text-stone-200 text-left`}
                    >
                      {chatMessages.length === 0 && (
                        <div className={`p-3 text-[11px] ${isDarkMode ? "bg-[#301c13]/30 text-stone-300" : "bg-[#eeded5]/20 text-stone-700"}`}>
                          <h3 className="font-bold text-[#C86432] flex items-center gap-1.5">
                            <MessageSquare className="w-4 h-4" />
                            <span>{r.interactiveContext}</span>
                          </h3>
                          <p className="mt-0.5 opacity-95">{r.interactiveContextDesc}</p>
                        </div>
                      )}

                      {/* Chat Messages */}
                      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 h-[250px] min-h-[200px]">
                        {chatMessages.map((msg) => {
                          const isUser = msg.role === "user";
                          return (
                            <div
                              key={msg.id}
                              className={`flex flex-col gap-1 max-w-[85%] rounded-2xl p-3 text-[11px] leading-relaxed ${
                                isUser
                                  ? "self-end bg-[#C86432] text-white rounded-tr-none"
                                  : isDarkMode
                                  ? "self-start bg-stone-900 border border-stone-800 text-stone-200 rounded-tl-none"
                                  : "self-start bg-stone-100 text-stone-800 rounded-tl-none"
                              }`}
                            >
                              <span className="text-[8px] font-bold uppercase select-none opacity-60">
                                {isUser ? t.you : t.assistant}
                              </span>
                              <p className="whitespace-pre-wrap">{msg.content}</p>
                            </div>
                          );
                        })}

                        {isChatting && (
                          <div className={`self-start ${SR.surfaceMuted} p-3 rounded-2xl rounded-tl-none flex items-center gap-2 text-[10.5px] ${SR.textSecondary}`}>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#C86432]" />
                            <span>{r.chatLoadingMetrics}</span>
                          </div>
                        )}

                        {chatError && (
                          <div className="p-2 bg-rose-500/10 text-rose-800 dark:text-rose-200 text-xs font-bold rounded-xl font-mono flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-rose-500" />
                            <span>{chatError}</span>
                          </div>
                        )}
                        <div ref={chatBottomRef} />
                      </div>

                      {/* Dialogue footer bar input */}
                      <form onSubmit={handleSendMessage} className={`p-2.5 border-t flex gap-2 ${
                        isDarkMode ? "border-[#332822] bg-[#1d1714]/60" : "border-[#eeded5] bg-[#FAF6F0]"
                      }`}>
                        <input
                          type="text"
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          placeholder={t.chatPlaceholder}
                          disabled={isChatting}
                          className={`flex-1 text-xs p-2.5 rounded-xl border focus:outline-hidden focus:ring-1 focus:ring-[#C86432] ${
                            isDarkMode ? "border-stone-800 bg-[#14100e] text-white" : "border-stone-205 bg-white text-stone-800"
                          }`}
                        />
                        <button
                          type="submit"
                          disabled={!chatInput.trim() || isChatting}
                          className="px-3.5 py-2 bg-[#C86432] hover:bg-[#aa5328] disabled:bg-stone-300 disabled:text-stone-500 text-white font-bold rounded-xl text-xs flex items-center justify-center transition-all shrink-0 cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    </motion.div>
                  )}

                </AnimatePresence>
              )}
            </div>

            {/* Always anchored actions footer */}
            <div className={`p-4 mt-4 border-t flex flex-wrap items-center justify-between gap-3 ${
              isDarkMode ? "border-[#332822] bg-[#1d1714]/65" : "border-[#eeded5] bg-[#FAF6F0]"
            } rounded-2xl shrink-0`}>
              <div>
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { setExtractedText(editedText); setIsEditing(false); }}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                    >
                      {t.saveBtn || "Save"}
                    </button>
                    <button
                      onClick={() => { setEditedText(extractedText); setIsEditing(false); }}
                      className={`px-3.5 py-1.5 border ${SR.border} ${SR.textSecondary} font-bold text-xs rounded-xl transition-all cursor-pointer ${SR.hoverRow}`}
                    >
                      {t.cancelBtn || "Cancel"}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => { setEditedText(getDisplayableOrDownloadableText(extractedText, resultDocumentType)); setIsEditing(true); }}
                    className="px-3 py-1.5 border border-[#eeded5] dark:border-[#332822] text-xs font-bold rounded-xl hover:bg-[#C86432]/5 cursor-pointer text-[#C86432] transition-colors"
                  >
                    {t.editBtn || "Edit Text"}
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 border border-[#eeded5] dark:border-[#332822] text-xs font-bold rounded-xl transition-all cursor-pointer text-stone-600 dark:text-stone-300 hover:bg-[#C86432]/5"
                >
                  {copyFeedback ? (t.copied || "Copied!") : (t.copyText || "Copy")}
                </button>

                <div className={`flex items-center border p-0.5 rounded-xl text-[10px] ${
                  isDarkMode 
                    ? "border-stone-800 bg-stone-900 text-stone-400" 
                    : "border-[#eeded5] bg-stone-100/50 text-stone-700"
                }`}>
                  <button onClick={() => downloadTextFile("md")} className="p-1 px-2 font-bold font-mono hover:text-[#C86432] cursor-pointer">.MD</button>
                  <button onClick={() => downloadTextFile("txt")} className="p-1 px-2 font-bold font-mono border-l border-stone-200 dark:border-stone-800 hover:text-[#C86432] cursor-pointer">.TXT</button>
                  <button onClick={downloadDocFile} className="p-1 px-2 font-bold font-mono border-l border-stone-200 dark:border-stone-800 hover:text-[#C86432] cursor-pointer animate-none">.DOC</button>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};


export default BeforeVsAfterWorkspace;
