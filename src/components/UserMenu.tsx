"use client";

import { useState } from "react";
import { UserProfile } from "@/store/auth";

interface UserMenuProps {
  profile: UserProfile;
  onSignOut: () => void;
}

export function UserMenu({ profile, onSignOut }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-white/10 transition-colors"
      >
        {profile.avatarUrl ? (
          <img
            src={profile.avatarUrl}
            alt={profile.displayName || "User"}
            className="w-7 h-7 rounded-full border border-white/20"
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-wc-purple flex items-center justify-center text-white text-xs font-bold">
            {(profile.displayName || profile.email || "U")[0].toUpperCase()}
          </div>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-50" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-10 z-50 bg-[#1e1b3a] border border-white/10 rounded-xl p-3 shadow-xl min-w-[200px]">
            <div className="px-2 py-1.5 border-b border-white/10 mb-2">
              <p className="text-sm font-medium text-white truncate">
                {profile.displayName || "Usuario"}
              </p>
              <p className="text-[10px] text-white/40 truncate">
                {profile.email}
              </p>
            </div>
            <button
              onClick={() => {
                setIsOpen(false);
                onSignOut();
              }}
              className="w-full text-left px-2 py-1.5 rounded-md text-xs text-white/60 hover:text-white hover:bg-white/5 transition-colors"
            >
              🚪 Cerrar sesión
            </button>
          </div>
        </>
      )}
    </div>
  );
}
