import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const caseStudies = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/case-studies' }),
  schema: z.object({
    title: z.string(),
    client: z.string(),
    summary: z.string().optional(),
    sector: z.string(),
    year: z.string().optional(),
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
    stack: z.array(z.string()).optional(),
    figure: z.string().optional(),
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
