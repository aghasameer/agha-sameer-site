import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const caseStudies = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/case-studies' }),
  schema: z.object({
    title: z.string(),
    client: z.string(),
    tags: z.array(z.string()).optional(), // what it's about — e.g. "GovTech", "IoT", "Aviation" — not tech stack
    sector: z.string(),
    role: z.string().optional(), // one line: what I personally did on this
    year: z.string().optional(), // e.g. "2019" or "2019–2021"
    figures: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
    order: z.number().optional(),
    draft: z.boolean().optional().default(false),
  }),
});

const products = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/products' }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    tags: z.array(z.string()).optional(), // what it IS — e.g. "HR Tech", "Payroll", "SaaS" — not tech stack
    stack: z.array(z.string()).optional(), // tech stack, shown secondary/small, not the headline tags
    role: z.string().optional(),
    figures: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
    launched: z.string().optional(), // e.g. "2016"
    logo: z.string().optional(),
    order: z.number().optional(),
    draft: z.boolean().optional().default(false),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    originallyOn: z.string().optional(),
    draft: z.boolean().optional().default(false),
  }),
});

export const collections = {
  'case-studies': caseStudies,
  products,
  blog,
};
