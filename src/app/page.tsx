"use client";

import { useState, type FormEvent } from "react";
import { defaultUrl } from "@/lib/formData";

export default function Home() {
  const [url, setUrl] = useState(defaultUrl);
  const [status, setStatus] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const healthCheck = async () => {
    try {
      const response = await fetch("/api/healthcheck", {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error("Health check failed");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      console.error("Health check error:", message);
    }
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);
    setIsRunning(true);

    // const opened = window.open(url, "_blank");
    // if (!opened) {
    //   setStatus("Pop-up blocked: allow pop-ups to open the target page.");
    // }

    try {
      const response = await fetch("/api/fill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error ?? "Automation failed");
      }

      setStatus(
        "Playwright is done. Check the automation run for the filled form in the headless browser."
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      setStatus(message);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-10 px-6 py-16">
        <header className="space-y-3">
          <p className="text-sm uppercase tracking-[0.4em] text-slate-400">
            Visa form helper
          </p>
          <h1 className="text-3xl font-semibold sm:text-4xl">
            Open the target form and let Playwright fill it with the provided
            data.
          </h1>
          <p className="max-w-2xl text-base text-slate-300">
            Click run to open the URL in a new tab and trigger a server-side
            Playwright run that completes the form using the preset JSON
            payload. Adjust the URL if needed.
          </p>
        </header>
        <button
          onClick={healthCheck}
              className="inline-flex shrink-0 items-center justify-center rounded-2xl bg-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:bg-slate-700"
        >
          Run Health Check
        </button>

        <form
          onSubmit={onSubmit}
          className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-2xl shadow-indigo-500/10"
        >
          <label className="text-sm font-medium text-slate-200" htmlFor="url">
            Form URL
          </label>
          <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center">
            <input
              id="url"
              name="url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-base text-slate-100 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/40"
              placeholder="https://example.com/form"
              required
              type="url"
            />
            <button
              type="submit"
              disabled={isRunning}
              className="inline-flex shrink-0 items-center justify-center rounded-2xl bg-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:bg-slate-700"
            >
              {isRunning ? "Running..." : "Open + Fill"}
            </button>
          </div>
          <p className="mt-3 text-sm text-slate-400">
            A new tab opens in your browser. The Playwright run executes on the
            server and fills the form in a headless Chromium instance.
          </p>
          {status && (
            <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200">
              {status}
            </div>
          )}
        </form>
      </main>
    </div>
  );
}
