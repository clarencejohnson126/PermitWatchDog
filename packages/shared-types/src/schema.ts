import { z } from 'zod';

export const FilingSchema = z.object({
  id: z.string().optional(),
  source_url: z.string().url(),
  publish_date: z.date(),
  gemeinde: z.string(),
  title: z.string(),
  content_text: z.string(),
  pdf_storage_path: z.string().optional()
});

export type Filing = z.infer<typeof FilingSchema>;

export const AlertRiskFlagSchema = z.enum([
  'LOW',
  'MEDIUM',
  'HIGH',
  'NO_IMPACT_BESTANDSSCHUTZ',
  'NO_IMPACT_OTHER'
]);

export type AlertRiskFlag = z.infer<typeof AlertRiskFlagSchema>;
