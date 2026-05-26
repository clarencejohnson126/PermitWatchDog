import { z } from 'zod';
export declare const FilingSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    source_url: z.ZodString;
    publish_date: z.ZodDate;
    gemeinde: z.ZodString;
    title: z.ZodString;
    content_text: z.ZodString;
    pdf_storage_path: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    source_url: string;
    publish_date: Date;
    gemeinde: string;
    title: string;
    content_text: string;
    id?: string | undefined;
    pdf_storage_path?: string | undefined;
}, {
    source_url: string;
    publish_date: Date;
    gemeinde: string;
    title: string;
    content_text: string;
    id?: string | undefined;
    pdf_storage_path?: string | undefined;
}>;
export type Filing = z.infer<typeof FilingSchema>;
export declare const AlertRiskFlagSchema: z.ZodEnum<["LOW", "MEDIUM", "HIGH", "NO_IMPACT_BESTANDSSCHUTZ", "NO_IMPACT_OTHER"]>;
export type AlertRiskFlag = z.infer<typeof AlertRiskFlagSchema>;
