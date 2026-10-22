import React, { useState, useEffect, useRef } from "react";
import { Search, X, User, Check, Loader2, Phone, Mail, ShieldAlert } from "lucide-react";
import { getAllUsers } from "../../api/authApi";
import useDebounce from "../../hooks/useDebounce";

export default function UserSearchMultiSelect({
  selectedUsers = [],
  onChange,
  disabled = false,
  error = "",
}) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 350);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search users API
  useEffect(() => {
    let active = true;

    const searchUsers = async () => {
      if (!debouncedQuery || debouncedQuery.trim().length < 1) {
        setUsers([]);
        return;
      }
      try {
        setLoading(true);
        const res = await getAllUsers({
          search: debouncedQuery.trim(),
          page: 1,
          pageSize: 20,
          status: "active",
        });

        if (!active) return;
        const list = res?.data || (Array.isArray(res) ? res : []);
        setUsers(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error("Error searching users:", err);
        if (active) setUsers([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    searchUsers();
    return () => {
      active = false;
    };
  }, [debouncedQuery]);

  const handleSelectUser = (user) => {
    const exists = selectedUsers.some((u) => (u._id || u) === (user._id || user));
    if (exists) {
      // Remove
      onChange(selectedUsers.filter((u) => (u._id || u) !== (user._id || user)));
    } else {
      // Add
      onChange([...selectedUsers, user]);
    }
  };

  const handleRemoveUser = (userId, e) => {
    e?.stopPropagation();
    onChange(selectedUsers.filter((u) => (u._id || u) !== userId));
  };

  const handleClearAll = (e) => {
    e?.stopPropagation();
    onChange([]);
  };

  return (
    <div className="space-y-2.5" ref={containerRef}>
      {/* Search Input Box */}
      <div className="relative">
        <div
          className={`flex items-center min-h-[44px] w-full rounded-xl border bg-white px-3 py-2 text-sm transition-all dark:bg-gray-900 ${
            error
              ? "border-red-500 ring-2 ring-red-500/20"
              : isOpen
              ? "border-brand-500 ring-2 ring-brand-500/20 dark:border-brand-400"
              : "border-gray-300 dark:border-gray-700 hover:border-gray-400"
          } ${disabled ? "opacity-60 cursor-not-allowed bg-gray-50 dark:bg-gray-800" : ""}`}
        >
          <Search className="w-4 h-4 text-gray-400 shrink-0 mr-2" />
          <input
            type="text"
            className="w-full bg-transparent text-gray-800 dark:text-white placeholder:text-gray-400 outline-none text-sm"
            placeholder={
              selectedUsers.length > 0
                ? "Type name, phone, email or User ID to add more..."
                : "Type name, phone, email or User ID to search..."
            }
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            disabled={disabled}
          />

          {loading && <Loader2 className="w-4 h-4 animate-spin text-brand-500 shrink-0 ml-2" />}

          {query && !loading && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Autocomplete Dropdown */}
        {isOpen && (
          <div className="absolute z-50 left-0 right-0 mt-1.5 max-h-64 overflow-y-auto rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl dark:border-gray-800 dark:bg-gray-900">
            {loading ? (
              <div className="flex items-center justify-center py-6 text-xs text-gray-400">
                <Loader2 className="w-4 h-4 animate-spin mr-2 text-brand-500" />
                Searching active users...
              </div>
            ) : debouncedQuery.trim().length === 0 ? (
              <div className="py-4 px-3 text-center text-xs text-gray-400">
                Start typing customer name, email, or phone number to search
              </div>
            ) : users.length === 0 ? (
              <div className="py-5 px-3 text-center text-xs text-gray-500 dark:text-gray-400">
                No active users found matching &ldquo;{debouncedQuery}&rdquo;
              </div>
            ) : (
              <div className="space-y-1">
                {users.map((u) => {
                  const isSelected = selectedUsers.some(
                    (su) => (su._id || su) === (u._id || u)
                  );
                  const fullName =
                    [u.firstName, u.lastName].filter(Boolean).join(" ") ||
                    u.name ||
                    "Unnamed User";

                  return (
                    <div
                      key={u._id}
                      onClick={() => handleSelectUser(u)}
                      className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-brand-50/80 dark:bg-brand-500/15 text-brand-900 dark:text-brand-300"
                          : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {u.profile ? (
                          <img
                            src={u.profile}
                            alt={fullName}
                            className="w-8 h-8 rounded-full object-cover shrink-0 border border-gray-200 dark:border-gray-700"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400 font-bold flex items-center justify-center text-xs shrink-0">
                            {fullName.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs truncate text-gray-900 dark:text-white">
                              {fullName}
                            </span>
                            {u.userId && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                                {u.userId}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                            {u.phone && (
                              <span className="flex items-center gap-1">
                                <Phone className="w-2.5 h-2.5 text-gray-400" />
                                {u.phone}
                              </span>
                            )}
                            {u.email && (
                              <span className="flex items-center gap-1 truncate">
                                <Mail className="w-2.5 h-2.5 text-gray-400" />
                                {u.email}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 ml-2">
                        {isSelected ? (
                          <div className="w-5 h-5 rounded-full bg-brand-500 text-white flex items-center justify-center">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        ) : (
                          <span className="text-[11px] font-medium text-brand-600 dark:text-brand-400 hover:underline">
                            + Add
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Selected Users Chips Display */}
      {selectedUsers.length > 0 ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 px-0.5">
            <span className="font-medium text-brand-600 dark:text-brand-400">
              Whitelisted Customers ({selectedUsers.length})
            </span>
            <button
              type="button"
              onClick={handleClearAll}
              className="text-[11px] text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
            >
              Clear All
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-800">
            {selectedUsers.map((user) => {
              const uid = user._id || user;
              const name =
                [user.firstName, user.lastName].filter(Boolean).join(" ") ||
                user.name ||
                (typeof user === "string" ? `ID: ${user.slice(-6)}` : "Customer");
              const sub = user.phone || user.email || (typeof user === "string" ? "" : user.userId);

              return (
                <span
                  key={uid}
                  className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-lg text-xs font-medium bg-white dark:bg-gray-800 border border-brand-200 dark:border-brand-500/30 text-gray-800 dark:text-gray-200 shadow-2xs group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0"></span>
                  <span className="truncate max-w-[130px] font-semibold text-gray-900 dark:text-white">
                    {name}
                  </span>
                  {sub && (
                    <span className="text-[10px] text-gray-500 dark:text-gray-400 font-mono">
                      ({sub})
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={(e) => handleRemoveUser(uid, e)}
                    className="p-0.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors ml-0.5"
                    title="Remove user"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 text-[11px] text-amber-700 dark:text-amber-400">
          <ShieldAlert className="w-4 h-4 shrink-0 text-amber-500" />
          <span>
            Target restriction is set to <strong>SPECIFIC</strong>. You must search and add at least one whitelisted customer above.
          </span>
        </div>
      )}

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
