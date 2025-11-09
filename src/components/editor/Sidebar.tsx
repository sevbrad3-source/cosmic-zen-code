import { ChevronRight, ChevronDown, FileText, Folder } from "lucide-react";
import { useState } from "react";

interface FileItem {
  name: string;
  type: "file" | "folder";
  children?: FileItem[];
}

const mockFiles: FileItem[] = [
  {
    name: "src",
    type: "folder",
    children: [
      {
        name: "components",
        type: "folder",
        children: [
          { name: "Header.tsx", type: "file" },
          { name: "Sidebar.tsx", type: "file" },
          { name: "Footer.tsx", type: "file" },
        ],
      },
      { name: "App.tsx", type: "file" },
      { name: "index.tsx", type: "file" },
      { name: "styles.css", type: "file" },
    ],
  },
  {
    name: "public",
    type: "folder",
    children: [
      { name: "index.html", type: "file" },
      { name: "favicon.ico", type: "file" },
    ],
  },
  { name: "package.json", type: "file" },
  { name: "tsconfig.json", type: "file" },
  { name: "README.md", type: "file" },
];

interface FileTreeProps {
  items: FileItem[];
  level?: number;
}

const FileTree = ({ items, level = 0 }: FileTreeProps) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    src: true,
    components: true,
  });

  const toggleExpand = (name: string) => {
    setExpanded((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div>
      {items.map((item) => (
        <div key={item.name}>
          <button
            onClick={() => item.type === "folder" && toggleExpand(item.name)}
            className="w-full flex items-center gap-1 px-2 py-0.5 text-sm hover:bg-sidebar-hover transition-colors text-text-primary group"
            style={{ paddingLeft: `${level * 12 + 8}px` }}
          >
            {item.type === "folder" && (
              <span className="w-4 h-4 flex items-center justify-center text-text-secondary">
                {expanded[item.name] ? (
                  <ChevronDown className="w-3.5 h-3.5" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5" />
                )}
              </span>
            )}
            {item.type === "folder" ? (
              <Folder className="w-4 h-4 text-primary flex-shrink-0" />
            ) : (
              <FileText className="w-4 h-4 text-text-secondary flex-shrink-0 ml-4" />
            )}
            <span className="truncate">{item.name}</span>
          </button>
          {item.type === "folder" && expanded[item.name] && item.children && (
            <FileTree items={item.children} level={level + 1} />
          )}
        </div>
      ))}
    </div>
  );
};

interface SidebarProps {
  activeView: string;
}

const Sidebar = ({ activeView }: SidebarProps) => {
  if (!activeView) return null;

  return (
    <div className="w-64 bg-sidebar-bg border-r border-border flex flex-col">
      <div className="h-9 px-3 flex items-center border-b border-border">
        <span className="text-xs uppercase tracking-wide font-semibold text-text-secondary">
          {activeView === "explorer" && "Explorer"}
          {activeView === "search" && "Search"}
          {activeView === "source" && "Source Control"}
          {activeView === "run" && "Run and Debug"}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {activeView === "explorer" && (
          <div className="py-1">
            <FileTree items={mockFiles} />
          </div>
        )}
        {activeView === "search" && (
          <div className="p-3 text-text-secondary text-sm">Search functionality</div>
        )}
        {activeView === "source" && (
          <div className="p-3 text-text-secondary text-sm">No changes detected</div>
        )}
        {activeView === "run" && (
          <div className="p-3 text-text-secondary text-sm">Run and debug</div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
