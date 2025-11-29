import { LuSearch } from "react-icons/lu";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const SearchBar = ({ searchQuery, setSearchQuery }: SearchBarProps) => {
  return (
    <div className="p-4 pb-2">
      <div className="relative group">
        {/* Search Icon with dynamic color on focus */}
        <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors duration-200 pointer-events-none">
          <LuSearch size={16} />
        </div>
        
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="
            w-full 
            pl-10 pr-4 py-2.5 
            bg-white 
            border border-slate-200 
            rounded-xl 
            text-sm text-slate-700 
            placeholder:text-slate-400 
            outline-none 
            transition-all duration-200
            hover:border-slate-300 hover:bg-slate-50/50
            focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10
            shadow-sm
          "
        />
        
        {/* Optional: Clear button if query exists (logic not strictly required but good for UX) */}
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-100 transition-colors"
          >
            <span className="sr-only">Clear</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        )}
      </div>
    </div>
  );
};