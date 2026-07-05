"use client";

import { Cloud, Database, Download, KeyRound, Upload } from "lucide-react";
import { useState } from "react";
import { useMathStore } from "@/store/use-math-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function SettingsView() {
  const { exportJSON, importJSON, storageMode, aiSettings, setAISettings } = useMathStore();
  const [backup, setBackup] = useState("");

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Storage</CardTitle>
          <Database className="h-4 w-4 text-white/35" />
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-white/55">
          <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
            <div className="text-xs uppercase tracking-[0.14em] text-white/35">Active mode</div>
            <div className="mt-2 text-2xl font-semibold text-white">{storageMode === "local" ? "Local-first" : "Supabase ready"}</div>
            <p className="mt-2">Your curriculum, sessions, resources, reviews, and settings persist in this browser using local storage.</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
            <div className="flex items-center gap-2 font-semibold text-white">
              <Cloud className="h-4 w-4 text-cyan-200" />
              Hosted backend path
            </div>
            <p className="mt-2">Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to enable Supabase sync. Railway can host a thin sync/API worker if you want server-side OpenRouter calls, PDF generation, or scheduled reports.</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>OpenRouter</CardTitle>
          <KeyRound className="h-4 w-4 text-white/35" />
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="block text-sm text-white/55">
            API key
            <input
              className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-black/25 px-3 text-white outline-none focus:border-blue-400/50"
              placeholder="Use OPENROUTER_API_KEY on the server"
              type="password"
              value={aiSettings.apiKey}
              onChange={(event) => setAISettings({ apiKey: event.target.value })}
            />
            <span className="mt-2 block text-xs text-white/35">For deployed AI, set `OPENROUTER_API_KEY` in Netlify/Railway env vars. Browser input is not sent to the server.</span>
          </label>
          <label className="block text-sm text-white/55">
            Model
            <input
              className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-black/25 px-3 text-white outline-none focus:border-blue-400/50"
              value={aiSettings.model}
              onChange={(event) => setAISettings({ model: event.target.value })}
            />
          </label>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Import and Export</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button variant="primary" onClick={() => setBackup(exportJSON())}>
              <Download className="h-4 w-4" />
              Export JSON
            </Button>
            <Button variant="outline" onClick={() => backup && importJSON(backup)}>
              <Upload className="h-4 w-4" />
              Restore backup
            </Button>
          </div>
          <textarea value={backup} onChange={(event) => setBackup(event.target.value)} className="scrollbar-soft min-h-80 w-full rounded-lg border border-white/10 bg-black/30 p-4 font-mono text-xs text-white/55 outline-none" placeholder="Version backups appear here." />
        </CardContent>
      </Card>
    </div>
  );
}
