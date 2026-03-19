import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

// ── Model providers ──────────────────────────────────────────────────────

export type ModelProvider = "claude-opus" | "claude-sonnet" | "gpt-4o" | "gpt-4o-mini";

interface ModelConfig {
  label: string;
  reason: string;
  provider: "anthropic" | "openai";
  model: string;
}

const MODELS: Record<ModelProvider, ModelConfig> = {
  "claude-opus": {
    label: "Claude Opus",
    reason: "Deep code reasoning, complex logic refactors",
    provider: "anthropic",
    model: "claude-sonnet-4-20250514",
  },
  "claude-sonnet": {
    label: "Claude Sonnet",
    reason: "Balanced code edits, API logic, data flow",
    provider: "anthropic",
    model: "claude-sonnet-4-20250514",
  },
  "gpt-4o": {
    label: "GPT-4o",
    reason: "UI components, styling, structured output",
    provider: "openai",
    model: "gpt-4o",
  },
  "gpt-4o-mini": {
    label: "GPT-4o Mini",
    reason: "Small tweaks, text changes, diagram labels",
    provider: "openai",
    model: "gpt-4o-mini",
  },
};

// ── Task classification ──────────────────────────────────────────────────

export type TaskType =
  | "complex-logic"    // algorithm changes, data flow rewrites
  | "api-integration"  // API routes, external service calls
  | "ui-component"     // React component changes, styling
  | "diagram-update"   // Mermaid diagram label/structure changes
  | "small-tweak";     // text changes, config tweaks

interface ClassifiedTask {
  code: string;
  comments: string[];
  taskType: TaskType;
  chosenModel: ModelProvider;
  reasoning: string;
  files: string[];
}

// Files that hold complex backend logic
const COMPLEX_FILES = new Set([
  "src/lib/dataforseo.ts",
]);

const API_FILES = new Set([
  "src/app/api/gbp-audit/route.ts",
]);

const UI_FILES = new Set([
  "src/components/funnel/step-business-scan.tsx",
  "src/components/funnel/step-market-scan.tsx",
  "src/components/funnel/step-results.tsx",
  "src/components/funnel/step-choose-option.tsx",
]);

function classifyTask(code: string, commentTexts: string[], files: string[]): { taskType: TaskType; reasoning: string } {
  const joined = commentTexts.join(" ").toLowerCase();
  const hasComplexFile = files.some((f) => COMPLEX_FILES.has(f));
  const hasApiFile = files.some((f) => API_FILES.has(f));
  const hasUiFile = files.some((f) => UI_FILES.has(f));

  // Keyword signals for complexity
  const complexSignals = ["algorithm", "refactor", "rewrite", "restructure", "logic", "flow", "ranking", "scoring", "competitor"];
  const uiSignals = ["style", "color", "layout", "button", "card", "animation", "display", "show", "hide", "ui", "ux", "design"];
  const smallSignals = ["rename", "text", "label", "typo", "change to", "update to", "set to", "use"];

  const isComplex = complexSignals.some((s) => joined.includes(s));
  const isUi = uiSignals.some((s) => joined.includes(s));
  const isSmall = smallSignals.some((s) => joined.includes(s)) && joined.length < 80;

  if (isSmall && !isComplex) {
    return { taskType: "small-tweak", reasoning: `Simple change for ${code}: short comment, likely a value/text update` };
  }
  if (hasComplexFile && (isComplex || !isUi)) {
    return { taskType: "complex-logic", reasoning: `${code} touches ${files[0]} (core data pipeline) with logic-heavy changes` };
  }
  if (hasApiFile && !hasUiFile) {
    return { taskType: "api-integration", reasoning: `${code} targets API route — server-side integration logic` };
  }
  if (hasUiFile || isUi) {
    return { taskType: "ui-component", reasoning: `${code} involves React component changes or styling` };
  }
  if (hasComplexFile) {
    return { taskType: "complex-logic", reasoning: `${code} touches complex backend logic in ${files[0]}` };
  }
  return { taskType: "api-integration", reasoning: `${code} — general server-side code change` };
}

function pickModel(taskType: TaskType): ModelProvider {
  switch (taskType) {
    case "complex-logic":
      return "claude-opus";
    case "api-integration":
      return "claude-sonnet";
    case "ui-component":
      return "gpt-4o";
    case "diagram-update":
      return "gpt-4o-mini";
    case "small-tweak":
      return "gpt-4o-mini";
  }
}

// ── Public API ───────────────────────────────────────────────────────────

export function classifyAndRoute(
  entries: [string, string[]][],
  nodeFiles: Record<string, string[]>,
): ClassifiedTask[] {
  return entries.map(([code, comments]) => {
    const files = nodeFiles[code] ?? [];
    const { taskType, reasoning } = classifyTask(code, comments, files);
    const chosenModel = pickModel(taskType);
    return { code, comments, taskType, chosenModel, reasoning, files };
  });
}

export function getModelConfig(model: ModelProvider): ModelConfig {
  return MODELS[model];
}

// ── Execute a code edit using the routed model ───────────────────────────

export async function executeEdit(
  model: ModelProvider,
  systemPrompt: string,
  userPrompt: string,
): Promise<string> {
  const config = MODELS[model];

  if (config.provider === "anthropic") {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set");
    const client = new Anthropic({ apiKey });
    const msg = await client.messages.create({
      model: config.model,
      max_tokens: 16384,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });
    const block = msg.content.find((b) => b.type === "text");
    return block?.type === "text" ? block.text : "";
  }

  // OpenAI
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not set");
  const client = new OpenAI({ apiKey });
  const completion = await client.chat.completions.create({
    model: config.model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.2,
  });
  return completion.choices[0]?.message?.content?.trim() ?? "";
}
