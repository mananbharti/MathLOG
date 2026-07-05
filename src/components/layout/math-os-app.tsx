"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  Bot,
  CalendarDays,
  CircleDot,
  Database,
  FileText,
  Gauge,
  GitBranch,
  Map,
  KanbanSquare,
  Library,
  Orbit,
  PanelTop,
  Search,
  Settings,
  Sparkles
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Command } from "cmdk";
import { useMathStore } from "@/store/use-math-store";
import { Button } from "@/components/ui/button";
import { Dashboard } from "@/features/dashboard/dashboard";
import { TopicsTable } from "@/features/topics/topics-table";
import { KanbanBoard } from "@/features/topics/kanban-board";
import { CalendarView } from "@/features/calendar/calendar-view";
import { AnalyticsDashboard } from "@/features/analytics/analytics-dashboard";
import { KnowledgeGraph } from "@/features/graph/knowledge-graph";
import { ResourcesView } from "@/features/resources/resources-view";
import { NotesView } from "@/features/notes/notes-view";
import { AICoach } from "@/features/ai/ai-coach";
import { SettingsView } from "@/features/settings-view";
import { TodayFocus } from "@/features/today/today-focus";
import { KnowledgeGalaxy } from "@/features/galaxy/knowledge-galaxy";
import { AITimeline } from "@/features/timeline/ai-timeline";
import { ResearchReadiness } from "@/features/readiness/research-readiness";
import { AIWhiteboard } from "@/features/whiteboard/ai-whiteboard";
import { FormulaExplorer } from "@/features/formulas/formula-explorer";

const navItems = [
  { label: "Today", icon: PanelTop },
  { label: "Dashboard", icon: Gauge },
  { label: "Galaxy", icon: Orbit },
  { label: "Topics", icon: Database },
  { label: "Board", icon: KanbanSquare },
  { label: "Calendar", icon: CalendarDays },
  { label: "Analytics", icon: BarChart3 },
  { label: "AI Timeline", icon: Map },
  { label: "Knowledge Graph", icon: GitBranch },
  { label: "Formula Explorer", icon: CircleDot },
  { label: "Readiness", icon: Sparkles },
  { label: "Whiteboard", icon: FileText },
  { label: "Resources", icon: Library },
  { label: "Notes", icon: FileText },
  { label: "AI Coach", icon: Bot },
  { label: "Settings", icon: Settings }
];

export function MathOSApp() {
  const { activeView, setActiveView, topics, selectTopic } = useMathStore();
  const [commandOpen, setCommandOpen] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    }
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen((open) => !open);
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "n") {
        event.preventDefault();
        setActiveView("Notes");
      }
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === "a") {
        event.preventDefault();
        setActiveView("AI Coach");
      }
      if (event.key === "Escape") setCommandOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [setActiveView]);

  const currentIndex = navItems.findIndex((item) => item.label === activeView);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
      if (event.key.toLowerCase() === "j") {
        setActiveView(navItems[Math.min(navItems.length - 1, currentIndex + 1)]?.label ?? "Dashboard");
      }
      if (event.key.toLowerCase() === "k") {
        setActiveView(navItems[Math.max(0, currentIndex - 1)]?.label ?? "Dashboard");
      }
      if (event.key === "Enter" && activeView === "Dashboard") setActiveView("Topics");
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeView, currentIndex, setActiveView]);

  const screen = useMemo(() => {
    switch (activeView) {
      case "Today":
        return <TodayFocus />;
      case "Galaxy":
        return <KnowledgeGalaxy />;
      case "Topics":
        return <TopicsTable />;
      case "Board":
        return <KanbanBoard />;
      case "Calendar":
        return <CalendarView />;
      case "Analytics":
        return <AnalyticsDashboard />;
      case "AI Timeline":
        return <AITimeline />;
      case "Knowledge Graph":
        return <KnowledgeGraph />;
      case "Formula Explorer":
        return <FormulaExplorer />;
      case "Readiness":
        return <ResearchReadiness />;
      case "Whiteboard":
        return <AIWhiteboard />;
      case "Resources":
        return <ResourcesView />;
      case "Notes":
        return <NotesView />;
      case "AI Coach":
        return <AICoach />;
      case "Settings":
        return <SettingsView />;
      default:
        return <Dashboard />;
    }
  }, [activeView]);

  return (
    <div className="flex min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 border-r border-white/10 bg-black/35 p-4 backdrop-blur-2xl lg:block">
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-3 px-2 py-3">
            <img src="/logo-mark.svg" alt="MATH.OS" className="h-11 w-11 rounded-lg shadow-lg shadow-blue-950/40" />
            <div>
              <div className="text-lg font-bold tracking-normal">MATH.OS</div>
              <div className="text-xs text-white/45">Research math cockpit</div>
            </div>
          </div>

          <button
            onClick={() => setCommandOpen(true)}
            className="mt-5 flex h-10 items-center justify-between rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm text-white/45 transition hover:bg-white/[0.07]"
          >
            <span className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Search everything
            </span>
            <kbd className="rounded border border-white/10 bg-black/30 px-1.5 py-0.5 text-[10px] text-white/45">Ctrl K</kbd>
          </button>

          <nav className="scrollbar-soft mt-6 flex-1 space-y-1 overflow-auto pr-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeView === item.label;
              return (
                <button
                  key={item.label}
                  onClick={() => setActiveView(item.label)}
                  className={`group relative flex h-10 w-full items-center gap-3 rounded-lg px-3 text-sm transition-all duration-300 ${
                    active ? "text-white" : "text-white/55 hover:bg-white/[0.04] hover:text-white/85"
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 rounded-lg bg-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                      <div className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                    </motion.div>
                  )}
                  <Icon className={`relative z-10 h-4 w-4 transition-transform duration-300 ${active ? "text-cyan-300 scale-110 icon-glow" : "group-hover:scale-110"}`} />
                  <span className="relative z-10 font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="mt-4 rounded-lg border border-white/10 bg-white/[0.035] p-4">
            <div className="text-xs font-medium uppercase tracking-[0.14em] text-white/35">Current Focus</div>
            <div className="mt-3 text-sm font-semibold text-white">Start with Sets, then Sequences and Series</div>
            <div className="mt-2 h-1.5 rounded-full bg-white/10">
              <div className="h-1.5 w-[46%] rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-400" />
            </div>
          </div>
        </div>
      </aside>

      <main className="min-w-0 flex-1 pb-24 lg:pb-0 lg:pl-72">
        <header className="sticky top-0 z-40 bg-[#03040b]/60 px-5 py-4 backdrop-blur-3xl lg:px-8 border-b border-white/[0.06] shadow-sm">
          <div className="absolute bottom-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 lg:block">
                <img src="/logo-mark.svg" alt="MATH.OS" className="h-9 w-9 rounded-lg lg:hidden" />
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/35">Learning operating system</p>
                  <h1 className="mt-1 text-2xl font-semibold tracking-normal text-white">{activeView}</h1>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setCommandOpen(true)}>
                <Search className="h-4 w-4" />
                Command
              </Button>
              <Button variant="primary" size="sm" onClick={() => setActiveView("AI Coach")}>
                <Bot className="h-4 w-4" />
                Ask AI
              </Button>
            </div>
          </div>
        </header>

        <div className="p-5 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              {screen}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center justify-center lg:hidden">
        <div className="flex items-center gap-1 rounded-full border border-white/10 bg-[#050814]/80 p-1.5 shadow-[0_20px_40px_rgba(0,0,0,0.5)] backdrop-blur-3xl">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const active = activeView === item.label;
            return (
              <button 
                key={item.label} 
                onClick={() => setActiveView(item.label)} 
                className={`group relative flex flex-col items-center justify-center rounded-full px-4 py-2 transition-all duration-300 ${active ? "text-white" : "text-white/40 hover:text-white/70"}`}
              >
                {active && (
                  <motion.div
                    layoutId="mobileNavActive"
                    className="absolute inset-0 rounded-full bg-blue-600/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon className={`relative z-10 h-5 w-5 ${active ? "text-blue-100" : ""}`} />
                <span className="relative z-10 mt-1 text-[10px] font-medium tracking-wide">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <button
        onClick={() => setActiveView("AI Coach")}
        className="group fixed bottom-24 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-sky-400 via-indigo-500 to-purple-500 shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-all duration-300 hover:scale-110 hover:shadow-[0_0_50px_rgba(99,102,241,0.6)] lg:bottom-6"
        aria-label="Open AI mentor"
      >
        <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-sky-400 via-indigo-500 to-purple-500 blur-md opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
        <Sparkles className="relative h-6 w-6 text-white" />
      </button>

      <AnimatePresence>
        {commandOpen ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4 pt-24 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCommandOpen(false)}
          >
            <motion.div
              className="glass w-full max-w-2xl overflow-hidden rounded-lg"
              initial={{ scale: 0.98, y: 8 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.98, y: 8 }}
              onClick={(event) => event.stopPropagation()}
            >
              <Command className="bg-transparent">
                <Command.Input className="h-14 w-full border-b border-white/10 bg-transparent px-4 text-sm outline-none placeholder:text-white/35" placeholder="Search topics, notes, resources, commands..." />
                <Command.List className="max-h-[420px] overflow-auto p-2">
                  <Command.Empty className="px-3 py-8 text-center text-sm text-white/40">No results found.</Command.Empty>
                  <Command.Group heading="Navigation" className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.14em] [&_[cmdk-group-heading]]:text-white/35">
                    {navItems.map((item) => (
                      <Command.Item
                        key={item.label}
                        value={item.label}
                        className="rounded-lg px-3 py-2 text-sm text-white/70 aria-selected:bg-white/10 aria-selected:text-white"
                        onSelect={() => {
                          setActiveView(item.label);
                          setCommandOpen(false);
                        }}
                      >
                        Open {item.label}
                      </Command.Item>
                    ))}
                  </Command.Group>
                  <Command.Group heading="Topics" className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.14em] [&_[cmdk-group-heading]]:text-white/35">
                    {topics.map((topic) => (
                      <Command.Item
                        key={topic.id}
                        value={`${topic.title} ${topic.tags.join(" ")} ${topic.markdownNotes}`}
                        className="rounded-lg px-3 py-2 text-sm text-white/70 aria-selected:bg-white/10 aria-selected:text-white"
                        onSelect={() => {
                          selectTopic(topic.id);
                          setCommandOpen(false);
                        }}
                      >
                        {topic.title}
                        <span className="ml-2 text-xs text-white/35">{topic.status}</span>
                      </Command.Item>
                    ))}
                  </Command.Group>
                </Command.List>
              </Command>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
