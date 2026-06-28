interface ChecklistItem {
  label: string;
  required: boolean;
  envKey?: string;
}

const releaseChecklist: ChecklistItem[] = [
  { label: "DATABASE_URL is set in production env", required: true, envKey: "DATABASE_URL" },
  { label: "STELLAR_SECRET_KEY is set and valid", required: true, envKey: "STELLAR_SECRET_KEY" },
  { label: "NEXT_PUBLIC_API_URL points to production", required: true, envKey: "NEXT_PUBLIC_API_URL" },
  { label: "JWT_SECRET is rotated for this release", required: true, envKey: "JWT_SECRET" },
  { label: "STRIPE_SECRET_KEY is live key (not test)", required: true, envKey: "STRIPE_SECRET_KEY" },
  { label: "SENTRY_DSN is set for error tracking", required: false, envKey: "SENTRY_DSN" },
  { label: "ANALYTICS_KEY is configured", required: false, envKey: "ANALYTICS_KEY" },
];

export function runReleaseChecklist(): void {
  console.log("Release Checklist\n" + "=".repeat(40));
  let passed = 0;
  for (const item of releaseChecklist) {
    const ok = item.envKey ? Boolean(process.env[item.envKey]) : false;
    const status = ok ? "OK" : item.required ? "MISSING (required)" : "- optional";
    console.log(`  [${status}] ${item.label}`);
    if (ok) passed++;
  }
  console.log(`\n${passed}/${releaseChecklist.length} items verified.`);
}

runReleaseChecklist();
