import { ChevronsUpDown, Bell } from "lucide-react";

interface HeaderProps {
  title?: string;
}

export function Header({ title = "MindTrack" }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white z-10 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-md mr-2 bg-primary flex items-center justify-center text-white font-bold">
            M
          </div>
          <h1 className="text-lg font-semibold text-[hsl(var(--neutral-darker))]">{title}</h1>
        </div>
        <div>
          <button type="button" className="p-1 rounded-full text-[hsl(var(--neutral-dark))] hover:bg-[hsl(var(--neutral-light))]">
            <Bell size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
