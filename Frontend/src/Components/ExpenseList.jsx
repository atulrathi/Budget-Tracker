import { 
  Search, 
  Edit2, 
  Trash2, 
  Receipt, 
  Calendar,
  Tag,
  ChevronDown,
  ChevronUp,
  Loader2
} from "lucide-react";

const LIST_LIMIT = 6;

export default function ExpenseList({
  expenses,
  allCount,
  loading,
  search,
  setSearch,
  showAll,
  setShowAll,
  onEdit,
  onDelete,
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-lg overflow-hidden">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-gray-50 to-slate-50 px-8 py-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Receipt className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Transaction History</h2>
              <p className="text-sm text-gray-600">
                {allCount} transaction{allCount !== 1 ? 's' : ''} total
              </p>
            </div>
          </div>

          {/* SEARCH */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              placeholder="Search by title, category, or date..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowAll(false);
              }}
              className="w-full border-2 border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-400"
            />
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-600 font-medium">Loading transactions...</p>
          </div>
        ) : expenses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
              <Receipt className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {search ? "No results found" : "No expenses yet"}
            </h3>
            <p className="text-gray-600">
              {search 
                ? `No transactions match "${search}". Try a different search.`
                : "Start tracking your expenses to see them here."
              }
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {expenses.map((exp, index) => {
              const date = new Date(exp.createdAt);
              const formattedDate = date.toLocaleDateString("en-IN", {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              });
              
              return (
                <div
                  key={exp._id}
                  className="group relative bg-gradient-to-r from-gray-50 to-white hover:from-blue-50 hover:to-indigo-50 border border-gray-200 rounded-xl p-5 transition-all duration-300 hover:shadow-md hover:border-blue-200"
                >
                  {/* Mobile Layout */}
                  <div className="flex flex-col sm:hidden gap-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-base mb-1 capitalize">
                          {exp.type}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Tag className="w-3 h-3" />
                          <span className="capitalize">{exp.category}</span>
                        </div>
                      </div>
                      <span className="text-lg font-bold text-red-600">
                        ₹{Number(exp.amount).toLocaleString('en-IN')}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        {formattedDate}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => onEdit(exp)}
                          className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-xs font-semibold flex items-center gap-1"
                        >
                          <Edit2 className="w-3 h-3" />
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(exp._id)}
                          className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-xs font-semibold flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden sm:flex justify-between items-center">
                    <div className="flex items-center gap-4 flex-1">
                      {/* Index Badge */}
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      
                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-base mb-1 capitalize truncate">
                          {exp.type}
                        </h3>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1.5 text-gray-600">
                            <Tag className="w-3.5 h-3.5" />
                            <span className="capitalize">{exp.category}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-gray-500">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{formattedDate}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Amount & Actions */}
                    <div className="flex items-center gap-6">
                      <span className="text-2xl font-bold text-red-600 min-w-[120px] text-right">
                        ₹{Number(exp.amount).toLocaleString('en-IN')}
                      </span>
                      
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onEdit(exp)}
                          className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all hover:scale-105"
                          title="Edit expense"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(exp._id)}
                          className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all hover:scale-105"
                          title="Delete expense"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* VIEW MORE/LESS */}
        {!loading && expenses.length > 0 && allCount > LIST_LIMIT && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all font-semibold shadow-lg hover:shadow-xl"
            >
              {showAll ? (
                <>
                  <ChevronUp className="w-5 h-5" />
                  View Less
                </>
              ) : (
                <>
                  <ChevronDown className="w-5 h-5" />
                  View More ({allCount - expenses.length} hidden)
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}