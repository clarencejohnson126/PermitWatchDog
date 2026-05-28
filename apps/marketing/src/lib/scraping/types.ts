export type SourceType =
  | 'bekanntmachung'
  | 'vergabe'
  | 'amtsblatt_pdf'
  | 'bauleitplanung';

export type ParseConfidence = 'high' | 'low' | 'failed';

export interface ScrapedRecord {
  source_url: string;
  publish_date: Date;
  gemeinde: string;
  title: string;
  content_text: string;
  pdf_storage_path?: string | null;
  auslegung_end_date?: Date | null;
  parse_confidence?: ParseConfidence | null;
  source_type: SourceType;
}
