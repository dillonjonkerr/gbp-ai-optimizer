import { NextRequest, NextResponse } from "next/server";
import type { AuditResult, BusinessInfo } from "@/lib/types";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: NextRequest) {
  try {
    const { result, businessInfo } = (await request.json()) as {
      result: AuditResult;
      businessInfo: BusinessInfo;
    };

    const you = result.marketScan.yourProfile;
    const comp = result.marketScan.competitorProfile;
    const competitor = result.marketScan.primaryCompetitorName;
    const keywords = result.marketScan.keywords;
    const comparison = result.comparison;

    const keywordRows = keywords
      .map(
        (kw) => `
      <tr>
        <td>${escapeHtml(kw.keyword)}</td>
        <td class="num">${kw.volume.toLocaleString()}</td>
        <td class="center">${kw.yourRank ? `#${kw.yourRank}` : "Not ranked"}</td>
        <td class="center">${kw.competitorRank ? `#${kw.competitorRank}` : "—"}</td>
        <td class="center priority-${kw.priority}">${kw.priority.toUpperCase()}</td>
      </tr>`,
      )
      .join("\n");

    const recommendations = result.recommendations
      .map((r) => `<li>${escapeHtml(r)}</li>`)
      .join("\n");

    const posts = result.suggestedPosts
      .map((p) => `<li>${escapeHtml(p)}</li>`)
      .join("\n");

    const qa = result.suggestedQA
      .map(
        (q) =>
          `<div class="qa"><strong>Q: ${escapeHtml(q.question)}</strong><br/>A: ${escapeHtml(q.answer)}</div>`,
      )
      .join("\n");

    const opportunities = comparison.missedOpportunities
      .map((o) => `<li>${escapeHtml(o)}</li>`)
      .join("\n");

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(businessInfo.businessName)} — GBP Optimization Report</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1e293b; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 40px 24px; }
  h1 { font-size: 28px; font-weight: 800; margin-bottom: 4px; }
  h2 { font-size: 18px; font-weight: 700; margin: 32px 0 12px; padding-bottom: 8px; border-bottom: 2px solid #e2e8f0; }
  h3 { font-size: 14px; font-weight: 700; margin: 20px 0 8px; }
  p { margin-bottom: 12px; font-size: 14px; color: #475569; }
  .badge { display: inline-block; background: #f0f9ff; border: 1px solid #bae6fd; color: #0369a1; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 20px; margin-bottom: 12px; }
  .header-sub { font-size: 14px; color: #64748b; margin-bottom: 24px; }
  .stats { display: flex; gap: 16px; margin: 20px 0; }
  .stat { flex: 1; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; text-align: center; }
  .stat-value { font-size: 24px; font-weight: 800; color: #0f172a; }
  .stat-label { font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 2px; }
  .stat-alert .stat-value { color: #dc2626; }
  .comparison { display: flex; gap: 20px; margin: 16px 0; }
  .comparison-col { flex: 1; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; }
  .comparison-col h3 { margin-top: 0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; }
  .comparison-col .name { font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 8px; }
  .row { display: flex; justify-content: space-between; padding: 4px 0; font-size: 13px; }
  .row-label { color: #64748b; }
  .row-value { font-weight: 600; }
  .win { color: #059669; }
  .lose { color: #dc2626; }
  table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 13px; }
  th { background: #f8fafc; text-align: left; padding: 10px 12px; font-weight: 600; color: #64748b; border-bottom: 2px solid #e2e8f0; }
  td { padding: 10px 12px; border-bottom: 1px solid #f1f5f9; }
  td.num { text-align: right; font-variant-numeric: tabular-nums; }
  td.center { text-align: center; }
  .priority-high { color: #dc2626; font-weight: 700; }
  .priority-medium { color: #d97706; font-weight: 600; }
  .priority-low { color: #64748b; }
  ul { padding-left: 20px; margin: 8px 0 16px; }
  li { font-size: 13px; color: #475569; margin-bottom: 6px; }
  .qa { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 8px; font-size: 13px; }
  .ai-summary { background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 12px; padding: 16px; margin: 16px 0; font-size: 14px; color: #0c4a6e; }
  .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center; }
  @media print { body { padding: 20px; } .stats { page-break-inside: avoid; } table { page-break-inside: auto; } tr { page-break-inside: avoid; } }
</style>
</head>
<body>

<div class="badge">Paint &amp; Profits — GBP Optimization Report</div>
<h1>${escapeHtml(businessInfo.businessName)}</h1>
<p class="header-sub">${escapeHtml(you.address)} · Generated ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>

<div class="stats">
  <div class="stat">
    <div class="stat-value">${comparison.score}</div>
    <div class="stat-label">Your Score</div>
  </div>
  <div class="stat">
    <div class="stat-value">${comparison.competitorScore}</div>
    <div class="stat-label">Competitor Avg</div>
  </div>
  <div class="stat stat-alert">
    <div class="stat-value">${keywords.length}</div>
    <div class="stat-label">Keyword Gaps</div>
  </div>
  <div class="stat stat-alert">
    <div class="stat-value">${result.marketScan.estimatedMissedTraffic.toLocaleString()}</div>
    <div class="stat-label">Missed Searches/Mo</div>
  </div>
</div>

<div class="ai-summary">
  <strong>AI Analysis:</strong> ${escapeHtml(comparison.aiSummary)}
</div>

${comp ? `
<h2>You vs ${escapeHtml(competitor)}</h2>
<div class="comparison">
  <div class="comparison-col">
    <h3>Your Business</h3>
    <div class="name">${escapeHtml(you.name)}</div>
    <div class="row"><span class="row-label">Rating</span><span class="row-value ${you.rating >= (comp?.rating ?? 0) ? "win" : "lose"}">${you.rating.toFixed(1)} ★</span></div>
    <div class="row"><span class="row-label">Reviews</span><span class="row-value ${you.reviewCount >= (comp?.reviewCount ?? 0) ? "win" : "lose"}">${you.reviewCount}</span></div>
    <div class="row"><span class="row-label">Photos</span><span class="row-value ${you.photoCount >= (comp?.photoCount ?? 0) ? "win" : "lose"}">${you.photoCount}</span></div>
    <div class="row"><span class="row-label">Website</span><span class="row-value">${you.hasWebsite ? "Yes" : "Missing"}</span></div>
    <div class="row"><span class="row-label">Phone</span><span class="row-value">${you.hasPhone ? "Yes" : "Missing"}</span></div>
  </div>
  <div class="comparison-col">
    <h3>Top Competitor</h3>
    <div class="name">${escapeHtml(comp.name)}</div>
    <div class="row"><span class="row-label">Rating</span><span class="row-value ${comp.rating >= you.rating ? "win" : "lose"}">${comp.rating.toFixed(1)} ★</span></div>
    <div class="row"><span class="row-label">Reviews</span><span class="row-value ${comp.reviewCount >= you.reviewCount ? "win" : "lose"}">${comp.reviewCount}</span></div>
    <div class="row"><span class="row-label">Photos</span><span class="row-value ${comp.photoCount >= you.photoCount ? "win" : "lose"}">${comp.photoCount}</span></div>
    <div class="row"><span class="row-label">Website</span><span class="row-value">${comp.hasWebsite ? "Yes" : "Missing"}</span></div>
    <div class="row"><span class="row-label">Phone</span><span class="row-value">${comp.hasPhone ? "Yes" : "Missing"}</span></div>
  </div>
</div>
` : ""}

<h2>Keyword Gap Report</h2>
<p>${keywords.length} keywords where ${escapeHtml(competitor)} outranks you, sorted by opportunity.</p>
<table>
  <thead>
    <tr>
      <th>Keyword</th>
      <th>Volume</th>
      <th style="text-align:center">Your Rank</th>
      <th style="text-align:center">Their Rank</th>
      <th style="text-align:center">Priority</th>
    </tr>
  </thead>
  <tbody>
    ${keywordRows}
  </tbody>
</table>

${opportunities ? `
<h2>Missed Opportunities</h2>
<ul>${opportunities}</ul>
` : ""}

<h2>Recommendations</h2>
<ul>${recommendations}</ul>

<h2>Suggested Google Posts</h2>
<ul>${posts}</ul>

<h2>Suggested Q&amp;A Entries</h2>
${qa}

<div class="footer">
  <p>Generated by Paint &amp; Profits · paintandprofits.com</p>
  <p>To save as PDF: Open this file in your browser → File → Print → Save as PDF</p>
</div>

</body>
</html>`;

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html",
        "Content-Disposition": `attachment; filename="${businessInfo.businessName.replace(/[^a-zA-Z0-9]/g, "-")}-GBP-Report.html"`,
      },
    });
  } catch (error) {
    console.error("[audit-pdf]", error);
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 },
    );
  }
}
