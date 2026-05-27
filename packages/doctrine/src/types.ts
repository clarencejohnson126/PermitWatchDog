export type LifecycleStage = 
  | 'pre-Antrag' 
  | 'Antrag eingereicht' 
  | 'Antrag genehmigt' 
  | 'im Bau' 
  | 'Rohbau' 
  | 'Ausbau' 
  | 'abgenommen';

export type Filing = {
  title: string;
  content_text: string;
  source_type: 'bekanntmachung' | 'vergabe' | 'amtsblatt_pdf';
};

export type ProjectProfile = {
  project_name?: string;
  address?: string;
  gemarkung?: string;
  gemeinde?: string;
  project_type?: string;
  lifecycle_stage: LifecycleStage | string;
  bescheid_auflagen: string[];
  abstandsflaeche_nachbarn: string[];
};

export type DoctrineOutput = {
  verdict: 'LOW' | 'MEDIUM' | 'HIGH' | 'NO_IMPACT_BESTANDSSCHUTZ' | 'NO_IMPACT_OTHER';
  reasoning: string;
  confidence: number;
  pierced_by: 'GEFAHRENABWEHR' | 'AUFLAGE' | 'NEW_ANTRAG' | 'RECHTSWIDRIG' | 'RETROACTIVE' | 'NEIGHBOR_AUSLEGUNG' | null;
  applicable_doctrine_layer: 'BESTANDSSCHUTZ' | 'VERTRAUENSSCHUTZ' | 'VERHAELTNISMAESSIGKEIT' | 'UEBERGANGSREGELUNG' | 'NONE';
  requires_llm_draft: boolean;
};

export type DoctrineInput = {
  filing: Filing;
  project: ProjectProfile;
};
