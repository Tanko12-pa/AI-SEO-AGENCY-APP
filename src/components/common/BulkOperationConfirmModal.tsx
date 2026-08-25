import React from "react";
import {
  AlertTriangle,
  Trash2,
  Archive,
  X,
  ShieldAlert,
  CheckCircle2,
} from "lucide-react";

export type BulkActionType = "delete" | "archive" | "unarchive";

interface BulkOperationConfirmModalProps {
  isOpen: boolean;
  actionType: BulkActionType;
  selectedItemCount: number;
  itemNames: string[];
  totalSearchVolumeImpact?: number;
  onConfirm: () => void;
  onCancel: () => void;
  isProcessing?: boolean;
}

export const BulkOperationConfirmModal: React.FC<BulkOperationConfirmModalProps> = ({
  isOpen,
  actionType,
  selectedItemCount,
  itemNames,
  totalSearchVolumeImpact = 0,
  onConfirm,
  onCancel,
  isProcessing = false,
}) => {
  if (!isOpen) return null;

  const isDelete = actionType === "delete";
  const isArchive = actionType === "archive";

  const actionTitle = isDelete
    ? "Confirm Bulk Keyword Deletion"
    : isArchive
    ? "Confirm Bulk Keyword Archival"
    : "Confirm Bulk Keyword Restoration";

  const actionDescription = isDelete
    ? `Are you sure you want to permanently delete these ${selectedItemCount} keyword nodes? This action cannot be undone and will remove them from live ranking tracking and AI Overview monitoring.`
    : isArchive
    ? `Archive ${selectedItemCount} keyword nodes? Archived keywords are hidden from default dashboard metrics but can be restored anytime.`
    : `Restore ${selectedItemCount} archived keyword nodes back to active tracking?`;

  return (
    <div
      id="bulk-operation-confirm-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white dark:bg-[#071207] border border-gray-200 dark:border-[#1e421e] rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header Strip */}
        <div
          className={`p-5 flex items-center justify-between border-b ${
            isDelete
              ? "bg-red-50/80 dark:bg-[#200c0c] border-red-200 dark:border-red-900/50"
              : "bg-amber-50/80 dark:bg-[#1a1405] border-amber-200 dark:border-amber-900/50"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${
                isDelete
                  ? "bg-red-600 text-white shadow-sm"
                  : "bg-[#ffa500] text-slate-950 shadow-sm"
              }`}
            >
              {isDelete ? (
                <Trash2 className="w-5 h-5" />
              ) : isArchive ? (
                <Archive className="w-5 h-5" />
              ) : (
                <CheckCircle2 className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3
                className={`text-base font-black ${
                  isDelete
                    ? "text-red-950 dark:text-red-200"
                    : "text-amber-950 dark:text-amber-200"
                }`}
              >
                {actionTitle}
              </h3>
              <p
                className={`text-xs ${
                  isDelete
                    ? "text-red-800/80 dark:text-red-300/80"
                    : "text-amber-800/80 dark:text-amber-300/80"
                }`}
              >
                Safety verification safeguard
              </p>
            </div>
          </div>

          <button
            onClick={onCancel}
            disabled={isProcessing}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
            {actionDescription}
          </p>

          {/* Volume Impact Warning */}
          {totalSearchVolumeImpact > 0 && isDelete && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-[#1f0b0b] border border-red-200 dark:border-[#421616] flex items-center gap-2.5 text-xs text-red-900 dark:text-red-200">
              <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
              <div>
                <strong>Impact Warning:</strong> Deleting these keywords removes{" "}
                <span className="font-bold text-red-700 dark:text-red-400 font-mono">
                  ~{totalSearchVolumeImpact.toLocaleString()}
                </span>{" "}
                monthly search volume from your active ranking model.
              </div>
            </div>
          )}

          {/* Selected Keywords Preview Chips */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Targeted Keywords ({itemNames.length}):
            </div>
            <div className="max-h-36 overflow-y-auto p-2.5 rounded-xl bg-gray-50 dark:bg-[#050e05] border border-gray-200 dark:border-[#142e14] flex flex-wrap gap-1.5">
              {itemNames.slice(0, 12).map((name, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-white dark:bg-[#0d1f0d] border border-gray-200 dark:border-[#1e421e] text-[11px] font-semibold text-gray-800 dark:text-gray-200"
                >
                  {name}
                </span>
              ))}
              {itemNames.length > 12 && (
                <span className="px-2 py-0.5 rounded-md bg-gray-200 dark:bg-gray-800 text-[11px] font-bold text-gray-600 dark:text-gray-400">
                  +{itemNames.length - 12} more
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-gray-50 dark:bg-[#091609] border-t border-gray-100 dark:border-[#142e14] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            disabled={isProcessing}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-[#1e421e] bg-white dark:bg-[#050e05] text-gray-700 dark:text-gray-300 text-xs font-semibold hover:bg-gray-50 dark:hover:bg-[#0d1f0d] transition-colors"
          >
            Cancel & Keep
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isProcessing}
            className={`px-5 py-2 rounded-lg text-xs font-bold shadow-sm transition-all active:scale-98 flex items-center gap-1.5 ${
              isDelete
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-[#004d00] hover:bg-[#003800] text-white"
            }`}
          >
            {isDelete ? <Trash2 className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
            <span>
              {isProcessing
                ? "Processing..."
                : isDelete
                ? `Confirm Deletion (${selectedItemCount})`
                : `Confirm Action (${selectedItemCount})`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
