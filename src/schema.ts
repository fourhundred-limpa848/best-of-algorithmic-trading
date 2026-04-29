import { z } from "zod";

export const configurationSchema = z.object({
  markdown_header_file: z.string(),
  markdown_footer_file: z.string(),
});

export const categorySchema = z.object({
  category: z.string(),
  title: z.string(),
  subtitle: z.string().optional(),
});

export const labelSchema = z.object({
  label: z.string(),
  image: z.string(),
  description: z.string(),
});

export const projectEntrySchema = z
  .object({
    name: z.string().min(1),
    category: z.string().min(1),
    resource: z.boolean().optional(),
    homepage: z.string().optional(),
    github_id: z.string().optional(),
    gitlab_id: z.string().optional(),
    description: z.string().optional(),
    labels: z.array(z.string()).optional(),
    pypi_id: z.string().optional(),
    npm_id: z.string().optional(),
    conda_id: z.string().optional(),
    show: z.boolean().optional(),
  })
  .superRefine((val, ctx) => {
    const isResource = val.resource === true;
    if (isResource) {
      if (!val.homepage) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Project "${val.name}": resource entries must include homepage`,
          path: ["homepage"],
        });
      }
      return;
    }
    if (!val.github_id && !val.gitlab_id) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Project "${val.name}": non-resource entries need github_id or gitlab_id`,
        path: ["github_id"],
      });
    }
  });

export const projectsFileSchema = z.object({
  configuration: configurationSchema,
  categories: z.array(categorySchema).min(1),
  labels: z.array(labelSchema).min(1),
  projects: z.array(projectEntrySchema).min(1),
});

export type ProjectsFile = z.infer<typeof projectsFileSchema>;
