// Curated "health" icon names. These now live in the SINGLE icon library
// (/tp-icons/{linear,bulk,bold}) like every other icon — there is no separate
// medical icon set anymore. This list is kept only as a convenience so the
// medical showcase + icon picker can surface the health subset.

export const tpMedicalIconNames = [
  "ambulance",
  "anxiety",
  "bandage",
  "bandage-02",
  "blood",
  "blood-3",
  "brain",
  "call-hospital",
  "capsule-3",
  "cardiogram",
  "clipboard-activity",
  "diagnosis",
  "dna",
  "ectrocardiogram-monitor-02",
  "electrocardiogram-monitor-01",
  "emergency",
  "empathy",
  "eye",
  "first-aid",
  "give-blood",
  "give-pill",
  "gynec",
  "hand-soap",
  "health-care",
  "health-file-02",
  "health-file-03",
  "health-folder",
  "heart-rate",
  "heart-rate-monitor",
  "hiv",
  "hospital",
  "hospital-3",
  "hospital-bed",
  "hospital-building-3",
  "hospital-building-4",
  "injection",
  "lab",
  "lifebuoy",
  "location-hospital",
  "lungs",
  "mask",
  "medical-book",
  "medical-document",
  "medical-file",
  "medical-information",
  "medical-record",
  "medical-report",
  "medical-service",
  "mental-health",
  "microscope",
  "obstetric",
  "operating-scissors-01",
  "pill",
  "pill-tablet",
  "pills-3",
  "plaster",
  "stethoscope",
  "stomach-care",
  "surgical-scissors-02",
  "syrup",
  "tablets",
  "test-tube",
  "test-tube-02",
  "thermometer",
  "tooth",
  "transfusion",
  "ultrasound-monitor-01",
  "ultrasound-monitor-02",
  "virus",
  "virus-lab-research",
  "wheel-chair-3",
  "wheelchair"
];

const SET = new Set(tpMedicalIconNames);

// Normalise a loose token ("Heart Rate") to the library name ("heart-rate").
export function resolveTPMedicalIconName(name) {
  if (typeof name !== "string") return null;
  const k = name.trim().toLowerCase().replace(/\s+/g, "-");
  return SET.has(k) ? k : (SET.has(name) ? name : null);
}
