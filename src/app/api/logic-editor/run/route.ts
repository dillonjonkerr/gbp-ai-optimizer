import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { classifyAndRoute, executeEdit, getModelConfig, type ModelProvider } from "@/lib/ai-router";

const COMMENTS_PATH = path.join(process.cwd(), "logic-comments.json");
const MMD_PATH = path.join(process.cwd(), "miro-logic-flow.mmd");

type CommentsMap = Record<string, string[]>;

const NODE_FILES: Record<string, string[]> = {
  U1: ["src/components/funnel/step-business-scan.tsx"],
  U2: ["src/components/funnel/step-business-scan.tsx"],
  U3: ["src/components/funnel/step-business-scan.tsx"],
  U4: ["src/components/funnel/step-business-scan.tsx"],
  U5: ["src/components/funnel/step-business-scan.tsx"],
  U6: ["src/components/funnel/step-business-scan.tsx"],
  S1: ["src/components/funnel/step-market-scan.tsx"],
  S2: ["src/components/funnel/step-market-scan.tsx"],
  S3: ["src/components/funnel/step-market-scan.tsx"],
  A1: ["src/app/api/gbp-audit/route.ts"],
  A2: ["src/app/api/gbp-audit/route.ts"],
  E1: ["src/app/api/gbp-audit/route.ts"],
  E2: ["src/app/api/gbp-audit/route.ts"],
  G1: ["src/app/api/gbp-audit/route.ts"],
  G2: ["src/app/api/gbp-audit/route.ts"],
  G3: ["src/app/api/gbp-audit/route.ts"],
  G4: ["src/app/api/gbp-audit/route.ts"],
  P1: ["src/app/api/gbp-audit/route.ts"],
  O1: ["src/app/api/gbp-audit/route.ts"],
  O2: ["src/app/api/gbp-audit/route.ts"],
  O3: ["src/app/api/gbp-audit/route.ts"],
  K1: ["src/lib/dataforseo.ts"],
  K2: ["src/lib/dataforseo.ts"],
  K3: ["src/lib/dataforseo.ts"],
  K4: ["src/lib/dataforseo.ts"],
  K5: ["src/lib/dataforseo.ts"],
  K6: ["src/lib/dataforseo.ts"],
  V1: ["src/lib/dataforseo.ts"],
  V2: ["src/lib/dataforseo.ts"],
  V3: ["src/lib/dataforseo.ts"],
  V4: ["src/lib/dataforseo.ts"],
  V5: ["src/lib/dataforseo.ts"],
  V6: ["src/lib/dataforseo.ts"],
  R1: ["src/lib/dataforseo.ts"],
  R2: ["src/lib/dataforseo.ts"],
  R3: ["src/lib/dataforseo.ts"],
  R4: ["src/lib/dataforseo.ts"],
  R5: ["src/lib/dataforseo.ts"],
  R6: ["src/lib/dataforseo.ts"],
  R7: ["src/lib/dataforseo.ts"],
  C1: ["src/lib/dataforseo.ts", "src/app/api/gbp-audit/route.ts"],
  C2: ["src/lib/dataforseo.ts", "src/app/api/gbp-audit/route.ts"],
  C3: ["src/lib/dataforseo.ts", "src/app/api/gbp-audit/route.ts"],
  C4: ["src/lib/dataforseo.ts", "src/app/api/gbp-audit/route.ts"],
  C5: ["src/lib/dataforseo.ts", "src/app/api/gbp-audit/route.ts"],
  F1: ["src/app/api/gbp-audit/route.ts"],
  F2: ["src/app/api/gbp-audit/route.ts"],
  F3: ["src/app/api/gbp-audit/route.ts"],
  F4: ["src/app/api/gbp-audit/route.ts"],
  F5: ["src/app/api/gbp-audit/route.ts"],
  T1: ["src/components/funnel/step-market-scan.tsx"],
  D1: ["src/components/funnel/step-results.tsx"],
  D2: ["src/components/funnel/step-results.tsx"],
  D3: ["src/components/funnel/step-results.tsx"],
  D4: ["src/components/funnel/step-results.tsx"],
  D5: ["src/components/funnel/step-results.tsx"],
  D6: ["src/components/funnel/step-results.tsx"],
  D7: ["src/components/funnel/step-results.tsx"],
  D8: ["src/components/funnel/step-results.tsx"],
  D9: ["src/components/funnel/step-results.tsx"],
};

const NODE_DESCRIPTIONS: Record<string, string> = {
  U1: "User opens the page", U2: "Types their business name", U3: "Google suggests matching businesses",
  U4: "Picks their business from the list", U5: "Hits the scan button",
  U6: "Business name + city + website sent to the scan engine",
  S1: "Loading screen appears", S2: "Progress bar fills up", S3: "Discovery messages appear",
  A1: "Scan starts on the server", A2: "Too many scans check (3 per hour max)",
  E1: "Shows error: Try again later", E2: "Shows error: Business not found",
  G1: "Search Google for the business", G2: "Get the Google listing ID",
  G3: "Pull full business details", G4: "Save as profile",
  P1: "Two jobs run at the same time",
  O1: "AI reads the profile data", O2: "AI scores it 0-100",
  O3: "AI writes visibility score, summary, opportunities",
  K1: "Create 5 basic search terms", K2: "Ask DataForSEO: what do people search?",
  K3: "Does the business have a website?", K4: "Ask DataForSEO: keywords for website",
  K5: "Skip, use keywords we have", K6: "Combine all keywords",
  V1: "Get monthly search counts", V2: "Got data for most keywords?",
  V3: "Try state-level data", V4: "Got data now?",
  V5: "Pick top 10 keywords", V6: "Try national data or estimates",
  R1: "Google each of the 10 keywords", R2: "For each keyword: where does business rank?",
  R3: "Tally businesses in results", R4: "Primary competitor = ranks highest most often",
  R5: "Find keywords where competitor beats you", R6: "Estimate clicks lost per keyword",
  R7: "Total: gap keywords, competitor, missed clicks",
  C1: "Find competitor on Google", C2: "Try A: Search competitor by name",
  C3: "Try B: Search best painter in city", C4: "Try C: Placeholder with better stats",
  C5: "Competitor profile ready",
  F1: "Bundle everything together", F2: "Profile vs competitor, gap keywords",
  F3: "AI score, summary, opportunities", F4: "Post ideas, Q&A suggestions",
  F5: "Send to browser",
  T1: "Progress bar 100%, flip to results",
  D1: "RESULTS PAGE", D2: "Big headline: invisible for X of Y keywords",
  D3: "Missed calls card", D4: "Visibility score circle",
  D5: "You vs Competitor side by side", D6: "Biggest keyword you're missing",
  D7: "AI summary paragraph", D8: "Show Me How to Fix This button",
  D9: "Choice page: DIY or AI Optimization",
};

export const maxDuration = 120;

async function readComments(): Promise<CommentsMap> {
  try {
    const data = await fs.readFile(COMMENTS_PATH, "utf-8");
    return JSON.parse(data) as CommentsMap;
  } catch {
    return {};
  }
}

async function writeComments(comments: CommentsMap): Promise<void> {
  await fs.writeFile(COMMENTS_PATH, JSON.stringify(comments, null, 2), "utf-8");
}

function extractCode(raw: string): string {
  const match = raw.match(/```(?:[\w]*)\n?([\s\S]*?)```/);
  return match ? match[1].trim() : raw.trim();
}

// Streamed SSE response so the UI can show real-time progress
export async function POST() {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      function send(event: string, data: unknown) {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      }

      try {
        const comments = await readComments();
        const entries = Object.entries(comments).filter(([, arr]) => arr.length > 0);

        if (entries.length === 0) {
          send("done", { success: true, message: "No comments to action", tasks: [] });
          controller.close();
          return;
        }

        // Step 1: Classify all tasks and pick models
        const tasks = classifyAndRoute(entries as [string, string[]][], NODE_FILES);
        send("plan", {
          tasks: tasks.map((t) => ({
            code: t.code,
            taskType: t.taskType,
            model: t.chosenModel,
            modelLabel: getModelConfig(t.chosenModel).label,
            reasoning: t.reasoning,
            comments: t.comments,
            files: t.files,
          })),
        });

        const cwd = process.cwd();
        const results: { code: string; model: string; modelLabel: string; file: string; status: "applied" | "skipped" | "error"; error?: string }[] = [];

        // Group tasks by file (same file edits batched together, same model)
        const fileGroups = new Map<string, { model: ModelProvider; nodes: { code: string; comments: string[] }[] }>();
        for (const task of tasks) {
          for (const file of task.files) {
            const existing = fileGroups.get(file);
            if (existing) {
              existing.nodes.push({ code: task.code, comments: task.comments });
              // Upgrade model if a harder task needs the same file
              const priority: ModelProvider[] = ["claude-opus", "claude-sonnet", "gpt-4o", "gpt-4o-mini"];
              if (priority.indexOf(task.chosenModel) < priority.indexOf(existing.model)) {
                existing.model = task.chosenModel;
              }
            } else {
              fileGroups.set(file, {
                model: task.chosenModel,
                nodes: [{ code: task.code, comments: task.comments }],
              });
            }
          }
        }

        // Step 2: Execute edits file-by-file
        for (const [filePath, group] of Array.from(fileGroups.entries())) {
          const config = getModelConfig(group.model);
          const nodeCodes = group.nodes.map((n) => n.code).join(", ");

          send("task-start", {
            file: filePath,
            nodes: nodeCodes,
            model: group.model,
            modelLabel: config.label,
            reason: config.reason,
          });

          try {
            const absPath = path.join(cwd, filePath);
            const content = await fs.readFile(absPath, "utf-8");

            const editDescriptions = group.nodes
              .map(
                (n) =>
                  `Node ${n.code} (${NODE_DESCRIPTIONS[n.code] ?? n.code}):\n${n.comments.map((c) => `- ${c}`).join("\n")}`
              )
              .join("\n\n");

            const systemPrompt = `You are a dedicated code agent for the GBP AI Optimizer. Apply the requested changes precisely. Return ONLY the complete updated file content — no explanation, no markdown wrapping unless the original file is markdown. Preserve formatting, imports, and style.`;
            const userPrompt = `Apply these logic flow changes to ${filePath}:\n\n${editDescriptions}\n\nCurrent file:\n\`\`\`\n${content}\n\`\`\`\n\nReturn the complete updated file in a single code block.`;

            const raw = await executeEdit(group.model, systemPrompt, userPrompt);
            const newContent = extractCode(raw);

            if (newContent && newContent !== content) {
              await fs.writeFile(absPath, newContent, "utf-8");
              for (const n of group.nodes) {
                results.push({ code: n.code, model: group.model, modelLabel: config.label, file: filePath, status: "applied" });
              }
              send("task-done", { file: filePath, nodes: nodeCodes, status: "applied", model: config.label });
            } else {
              for (const n of group.nodes) {
                results.push({ code: n.code, model: group.model, modelLabel: config.label, file: filePath, status: "skipped" });
              }
              send("task-done", { file: filePath, nodes: nodeCodes, status: "skipped", model: config.label });
            }
          } catch (err) {
            const msg = err instanceof Error ? err.message : "Unknown error";
            for (const n of group.nodes) {
              results.push({ code: n.code, model: group.model, modelLabel: config.label, file: filePath, status: "error", error: msg });
            }
            send("task-done", { file: filePath, nodes: nodeCodes, status: "error", error: msg, model: config.label });
          }
        }

        // Step 3: Update diagram
        let mmdContent: string | null = null;
        try {
          mmdContent = await fs.readFile(MMD_PATH, "utf-8");
        } catch { /* ignore */ }

        if (mmdContent) {
          send("task-start", { file: "miro-logic-flow.mmd", nodes: "diagram", model: "gpt-4o-mini", modelLabel: "GPT-4o Mini", reason: "Diagram label updates" });

          const systemPrompt = `You maintain a Mermaid flowchart. If the user's changes affect how a node should be described in the diagram, update the node label. Return ONLY the complete .mmd file. Preserve all syntax, classDef, and structure.`;
          const userPrompt = `Comments applied:\n${entries.map(([c, arr]) => `${c}: ${arr.join("; ")}`).join("\n")}\n\nCurrent diagram:\n\`\`\`\n${mmdContent}\n\`\`\`\n\nIf any node descriptions should change based on these comments, update them. Otherwise return the diagram unchanged.`;

          try {
            const raw = await executeEdit("gpt-4o-mini", systemPrompt, userPrompt);
            const newMmd = extractCode(raw);
            if (newMmd && newMmd !== mmdContent) {
              await fs.writeFile(MMD_PATH, newMmd, "utf-8");
              results.push({ code: "diagram", model: "gpt-4o-mini", modelLabel: "GPT-4o Mini", file: "miro-logic-flow.mmd", status: "applied" });
              send("task-done", { file: "miro-logic-flow.mmd", nodes: "diagram", status: "applied", model: "GPT-4o Mini" });
            } else {
              send("task-done", { file: "miro-logic-flow.mmd", nodes: "diagram", status: "skipped", model: "GPT-4o Mini" });
            }
          } catch (err) {
            send("task-done", { file: "miro-logic-flow.mmd", nodes: "diagram", status: "error", error: err instanceof Error ? err.message : "Unknown", model: "GPT-4o Mini" });
          }
        }

        // Step 4: Clear actioned comments
        await writeComments({});
        const applied = results.filter((r) => r.status === "applied").length;
        send("done", { success: true, message: `Agent applied ${applied} change(s) across ${fileGroups.size} file(s)`, tasks: results });

      } catch (err) {
        send("error", { message: err instanceof Error ? err.message : "Agent failed" });
      }

      controller.close();
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
