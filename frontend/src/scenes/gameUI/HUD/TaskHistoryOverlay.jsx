import React from "react";
import { X, CheckCircle, XCircle, Clock } from "lucide-react";
import { TASK_REGISTRY } from "../../missions/tasks/TaskRegistry";

export default function TaskHistoryOverlay({ onClose, taskResults }) {
  const allTasks = Object.values(TASK_REGISTRY);

  const displayTasks = [...allTasks];
  while (displayTasks.length < 9) {
    displayTasks.push({
      id: `FUTURE_TASK_${displayTasks.length + 1}`,
      name: `Classified Mission ${displayTasks.length + 1} (Coming Soon)`,
    });
  }

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 pointer-events-auto backdrop-blur-[2px]">
      <div className="bg-white p-5 rounded-3xl border-4 border-indigo-900 shadow-[6px_6px_0_0_#4338ca] w-[480px] max-h-[80vh] flex flex-col translate-y-[-20px]">
        <div className="flex items-center justify-between mb-6 pb-4 border-b-4 border-indigo-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-100 rounded-xl flex items-center justify-center font-black text-base text-indigo-900">
              📊
            </div>
            <h2 className="text-xl font-black text-indigo-900 uppercase">
              Mission History
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-red-100 hover:text-red-600 rounded-xl transition-colors text-indigo-900"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div
          className="overflow-y-auto pr-2 space-y-3 flex-1"
          style={{ scrollbarWidth: "thin" }}
        >
          {displayTasks.map((task, idx) => {
            const resultObj = taskResults.find((r) => r.taskId === task.id);
            const status = resultObj?.result || "PENDING";

            let StatusIcon = Clock;
            let statusColor = "text-gray-400";
            let bgColor = "bg-gray-50 border-gray-200";

            if (status === "PASS") {
              StatusIcon = CheckCircle;
              statusColor = "text-green-500";
              bgColor =
                "bg-green-50 border-green-200 shadow-[2px_2px_0_0_#bbf7d0]";
            } else if (status === "FAIL") {
              StatusIcon = XCircle;
              statusColor = "text-red-500";
              bgColor = "bg-red-50 border-red-200 shadow-[2px_2px_0_0_#fecaca]";
            } else if (task.id.startsWith("FUTURE")) {
              bgColor = "bg-gray-100 border-gray-200 opacity-60 border-dashed";
            }

            return (
              <div
                key={task.id}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${bgColor}`}
              >
                <div className="text-sm font-black text-indigo-900 w-8 h-8 flex items-center justify-center bg-white rounded-xl border-2 border-indigo-100 shadow-sm shrink-0">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-indigo-900 truncate">
                    {task.name}
                  </h3>
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mt-0.5">
                    {status}
                  </p>
                </div>
                <StatusIcon className={`w-6 h-6 shrink-0 ${statusColor}`} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
