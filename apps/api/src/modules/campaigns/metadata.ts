export interface CampaignMetadata {
  id: string;
  creatorId: string;
  title: string;
  description: string;
  goalXLM: number;
  deadline: string;
  tags: string[];
  visibility: "public" | "private" | "unlisted";
  createdAt: string;
  updatedAt: string;
}

export type CreateCampaignInput = Omit<CampaignMetadata, "id" | "createdAt" | "updatedAt">;

export function buildCampaignMetadata(input: CreateCampaignInput): CampaignMetadata {
  const now = new Date().toISOString();
  return { ...input, id: `campaign-${Date.now()}`, createdAt: now, updatedAt: now };
}

export function validateCampaignMetadata(input: CreateCampaignInput): string[] {
  const errors: string[] = [];
  if (!input.title.trim()) errors.push("Title is required");
  if (input.goalXLM <= 0) errors.push("Goal must be greater than 0");
  if (new Date(input.deadline) <= new Date()) errors.push("Deadline must be in the future");
  return errors;
}
