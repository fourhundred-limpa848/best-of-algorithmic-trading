import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseDocument } from "yaml";
import { projectsFileSchema } from "./schema.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const projectsPath = join(root, "projects.yaml");

function loadProjectsYaml(): unknown {
  const raw = readFileSync(projectsPath, "utf8");
  const doc = parseDocument(raw);
  if (doc.errors.length > 0) {
    const msg = doc.errors.map((e) => e.message).join("; ");
    throw new Error(`YAML parse error: ${msg}`);
  }
  return doc.toJSON();
}

function main(): void {
  let data: unknown;
  try {
    data = loadProjectsYaml();
  } catch (e) {
    console.error(e instanceof Error ? e.message : e);
    process.exit(1);
    return;
  }

  const parsed = projectsFileSchema.safeParse(data);
  if (!parsed.success) {
    console.error(parsed.error.flatten());
    process.exit(1);
    return;
  }

  const { categories, labels, projects } = parsed.data;
  const categoryIds = new Set(categories.map((c) => c.category));
  const labelIds = new Set(labels.map((l) => l.label));

  const errors: string[] = [];

  for (const p of projects) {
    if (!categoryIds.has(p.category)) {
      errors.push(`Project "${p.name}": unknown category "${p.category}"`);
    }
    if (p.labels) {
      for (const lb of p.labels) {
        if (!labelIds.has(lb)) {
          errors.push(`Project "${p.name}": unknown label "${lb}"`);
        }
      }
    }
  }

  const seenGithub = new Map<string, string>();
  const seenGitlab = new Map<string, string>();
  for (const p of projects) {
    if (p.github_id) {
      const prev = seenGithub.get(p.github_id);
      if (prev) errors.push(`Duplicate github_id "${p.github_id}": "${prev}" and "${p.name}"`);
      else seenGithub.set(p.github_id, p.name);
    }
    if (p.gitlab_id) {
      const prev = seenGitlab.get(p.gitlab_id);
      if (prev) errors.push(`Duplicate gitlab_id "${p.gitlab_id}": "${prev}" and "${p.name}"`);
      else seenGitlab.set(p.gitlab_id, p.name);
    }
  }

  if (errors.length > 0) {
    console.error(errors.join("\n"));
    process.exit(1);
  }

  console.log(
    `OK: ${projects.length} projects, ${categories.length} categories, ${labels.length} labels`,
  );
}

main();
