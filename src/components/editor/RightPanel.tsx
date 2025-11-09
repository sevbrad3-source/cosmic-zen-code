import { Send, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface RightPanelProps {
  activePanel: string;
  onClose: () => void;
}

const RightPanel = ({ activePanel, onClose }: RightPanelProps) => {
  if (!activePanel) return null;

  return (
    <div className="w-80 bg-sidebar-bg border-l border-border flex flex-col">
      <div className="h-9 px-3 flex items-center justify-between border-b border-border">
        <span className="text-xs uppercase tracking-wide font-semibold text-text-secondary">
          {activePanel === "ai" && "AI Assistant"}
          {activePanel === "chat" && "Team Chat"}
          {activePanel === "notifications" && "Notifications"}
          {activePanel === "database" && "Database"}
          {activePanel === "collaborators" && "Collaborators"}
        </span>
        <button
          onClick={onClose}
          className="w-6 h-6 flex items-center justify-center hover:bg-sidebar-hover rounded transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {activePanel === "ai" && (
          <div className="flex flex-col h-full">
            <div className="flex-1 p-3 space-y-3">
              <div className="bg-panel-bg rounded p-2 text-sm">
                <div className="text-text-secondary text-xs mb-1">AI Assistant</div>
                <div className="text-text-primary">How can I help you with your code today?</div>
              </div>
              <div className="bg-editor-active-line rounded p-2 text-sm ml-6">
                <div className="text-text-primary">Explain this function</div>
              </div>
              <div className="bg-panel-bg rounded p-2 text-sm">
                <div className="text-text-secondary text-xs mb-1">AI Assistant</div>
                <div className="text-text-primary">This is a React functional component that renders the main App structure...</div>
              </div>
            </div>
            <div className="p-3 border-t border-border">
              <div className="flex gap-2">
                <Input 
                  placeholder="Ask AI anything..." 
                  className="flex-1 bg-input-bg border-input-border focus:border-input-focus text-sm h-8"
                />
                <button className="w-8 h-8 flex items-center justify-center bg-primary hover:bg-primary-hover text-primary-foreground rounded transition-colors">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
        
        {activePanel === "chat" && (
          <div className="p-3 text-text-secondary text-sm">
            <div className="space-y-2">
              <div className="bg-panel-bg rounded p-2">
                <div className="text-text-primary font-medium text-xs">John Doe</div>
                <div className="text-text-secondary text-xs mt-1">Updated the authentication module</div>
                <div className="text-text-muted text-xs mt-1">2 minutes ago</div>
              </div>
            </div>
          </div>
        )}
        
        {activePanel === "notifications" && (
          <div className="p-3 text-text-secondary text-sm space-y-2">
            <div className="bg-panel-bg rounded p-2 border-l-2 border-primary">
              <div className="text-text-primary text-xs font-medium">Build completed</div>
              <div className="text-text-secondary text-xs mt-1">Successfully deployed to production</div>
            </div>
            <div className="bg-panel-bg rounded p-2 border-l-2 border-border">
              <div className="text-text-primary text-xs font-medium">New pull request</div>
              <div className="text-text-secondary text-xs mt-1">Feature/new-dashboard by @dev</div>
            </div>
          </div>
        )}
        
        {activePanel === "database" && (
          <div className="p-3 text-text-secondary text-sm">
            <div className="space-y-1">
              <div className="text-xs text-text-muted uppercase tracking-wide mb-2">Tables</div>
              <div className="bg-panel-bg hover:bg-sidebar-hover rounded p-2 cursor-pointer transition-colors">
                <div className="text-text-primary text-xs font-mono">users</div>
              </div>
              <div className="bg-panel-bg hover:bg-sidebar-hover rounded p-2 cursor-pointer transition-colors">
                <div className="text-text-primary text-xs font-mono">projects</div>
              </div>
              <div className="bg-panel-bg hover:bg-sidebar-hover rounded p-2 cursor-pointer transition-colors">
                <div className="text-text-primary text-xs font-mono">sessions</div>
              </div>
            </div>
          </div>
        )}
        
        {activePanel === "collaborators" && (
          <div className="p-3 text-text-secondary text-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                  JD
                </div>
                <div>
                  <div className="text-text-primary text-xs font-medium">John Doe</div>
                  <div className="text-text-muted text-xs">Editing App.tsx</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RightPanel;
