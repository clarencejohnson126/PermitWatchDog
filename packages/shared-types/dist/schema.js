"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertRiskFlagSchema = exports.FilingSchema = void 0;
const zod_1 = require("zod");
exports.FilingSchema = zod_1.z.object({
    id: zod_1.z.string().optional(),
    source_url: zod_1.z.string().url(),
    publish_date: zod_1.z.date(),
    gemeinde: zod_1.z.string(),
    title: zod_1.z.string(),
    content_text: zod_1.z.string(),
    pdf_storage_path: zod_1.z.string().optional()
});
exports.AlertRiskFlagSchema = zod_1.z.enum([
    'LOW',
    'MEDIUM',
    'HIGH',
    'NO_IMPACT_BESTANDSSCHUTZ',
    'NO_IMPACT_OTHER'
]);
