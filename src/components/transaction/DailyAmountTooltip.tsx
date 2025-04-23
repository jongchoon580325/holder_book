interface DailyAmountTooltipProps {
  date: string;
  income: number;
  expense: number;
  position: 'top' | 'middle' | 'bottom';
}

export default function DailyAmountTooltip({ date, income, expense, position }: DailyAmountTooltipProps) {
  const balance = income - expense;
  
  return (
    <div 
      className={`
        absolute z-[9999]
        ${position === 'top' 
          ? 'left-full top-0' 
          : position === 'bottom'
          ? 'left-full bottom-0'
          : 'left-full top-1/2 -translate-y-1/2'
        }
        ml-2
        p-4 bg-gray-800/95 rounded-lg shadow-lg border border-gray-700 
        min-w-[220px] whitespace-nowrap
      `}
    >
      <div className="space-y-3">
        <div className="flex items-center gap-4">
          <span className="text-gray-400 min-w-[40px]">수입</span>
          <span className="text-blue-400 font-medium ml-auto">
            {income.toLocaleString()}원
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 min-w-[40px]">지출</span>
          <span className="text-red-400 font-medium ml-auto">
            {expense.toLocaleString()}원
          </span>
        </div>
        <div className="flex items-center gap-4 pt-2 border-t border-gray-700">
          <span className="text-gray-400 min-w-[40px]">잔액</span>
          <span className={`font-medium ml-auto ${balance >= 0 ? "text-blue-400" : "text-red-400"}`}>
            {balance.toLocaleString()}원
          </span>
        </div>
      </div>
      {/* 툴팁 화살표 */}
      <div className={`
        absolute 
        ${position === 'top' 
          ? 'top-[14px]' 
          : position === 'bottom'
          ? 'bottom-[14px]'
          : 'top-1/2 -translate-y-1/2'
        }
        -left-2
      `}>
        <div className="border-[6px] border-transparent border-r-gray-800/95" />
      </div>
    </div>
  );
} 