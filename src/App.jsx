import React, { useEffect, useMemo, useState } from "react";
import { Search, Filter, ShieldAlert, FileText, Stethoscope, CalendarClock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

const RULES = [{"id": "R0001", "syndrome": "Von Hippel–Lindau disease", "gene": "VHL", "target": "Retinal hemangioblastoma", "method": "Ophthalmology exam with dilated fundoscopy", "category": "Ophthalmology", "startText": "Diagnosis", "minAge": 0, "stopText": "", "maxAge": null, "frequency": "Annual", "intervalMin": 12, "intervalMax": 12, "sex": "All", "lifelong": true, "symptom": false, "notes": "Annual surveillance recommended.", "sourceFile": "ccr-24-3525.pdf", "sourceTitle": "Update on Surveillance in Von Hippel–Lindau Disease", "extractionType": "direct_table_snippet", "confidence": "high", "priority": 10}, {"id": "R0002", "syndrome": "Von Hippel–Lindau disease", "gene": "VHL", "target": "CNS hemangioblastoma", "method": "Brain and spine MRI with contrast", "category": "MRI", "startText": "11 years", "minAge": 11, "stopText": "", "maxAge": null, "frequency": "Every 2 years", "intervalMin": 24, "intervalMax": 24, "sex": "All", "lifelong": true, "symptom": false, "notes": "Consensus recommendation; lower threshold for earlier imaging if symptomatic.", "sourceFile": "ccr-24-3525.pdf", "sourceTitle": "Update on Surveillance in Von Hippel–Lindau Disease", "extractionType": "direct_table_snippet", "confidence": "high", "priority": 10}, {"id": "R0003", "syndrome": "Von Hippel–Lindau disease", "gene": "VHL", "target": "Endolymphatic sac tumor", "method": "Audiogram", "category": "Audiology", "startText": "11 years", "minAge": 11, "stopText": "", "maxAge": null, "frequency": "Every 2 years", "intervalMin": 24, "intervalMax": 24, "sex": "All", "lifelong": true, "symptom": false, "notes": "Serial surveillance for ELST.", "sourceFile": "ccr-24-3525.pdf", "sourceTitle": "Update on Surveillance in Von Hippel–Lindau Disease", "extractionType": "direct_table_snippet", "confidence": "high", "priority": 10}, {"id": "R0004", "syndrome": "Von Hippel–Lindau disease", "gene": "VHL", "target": "Pheochromocytoma/paraganglioma", "method": "Blood pressure and plasma or urine metanephrines", "category": "Laboratory", "startText": "5 years", "minAge": 5, "stopText": "", "maxAge": null, "frequency": "Annual", "intervalMin": 12, "intervalMax": 12, "sex": "All", "lifelong": true, "symptom": false, "notes": "Biochemical surveillance and BP checks.", "sourceFile": "ccr-24-3525.pdf", "sourceTitle": "Update on Surveillance in Von Hippel–Lindau Disease", "extractionType": "direct_table_snippet", "confidence": "high", "priority": 10}, {"id": "R0005", "syndrome": "Von Hippel–Lindau disease", "gene": "VHL", "target": "Renal cell carcinoma / pancreatic lesions", "method": "Abdominal MRI", "category": "MRI", "startText": "15 years", "minAge": 15, "stopText": "", "maxAge": null, "frequency": "Every 2 years", "intervalMin": 24, "intervalMax": 24, "sex": "All", "lifelong": true, "symptom": false, "notes": "Abdominal surveillance for renal and pancreatic manifestations.", "sourceFile": "ccr-24-3525.pdf", "sourceTitle": "Update on Surveillance in Von Hippel–Lindau Disease", "extractionType": "direct_table_snippet", "confidence": "high", "priority": 10}, {"id": "R0006", "syndrome": "DICER1 tumor predisposition", "gene": "DICER1", "target": "Pleuropulmonary blastoma", "method": "Chest imaging / chest x-ray surveillance", "category": "Imaging", "startText": "Infancy", "minAge": 0, "stopText": "8 years", "maxAge": 8, "frequency": "Every 6 months", "intervalMin": 6, "intervalMax": 6, "sex": "All", "lifelong": false, "symptom": false, "notes": "Standardized to every-6-month intervals in 2023 update.", "sourceFile": "ccr-24-1947.pdf", "sourceTitle": "Update on Pediatric Surveillance Recommendations for PTEN Hamartoma Tumor Syndrome, DICER1-Related Tumor Predisposition, and Tuberous Sclerosis Complex", "extractionType": "direct_table_snippet", "confidence": "high", "priority": 9}, {"id": "R0007", "syndrome": "DICER1 tumor predisposition", "gene": "DICER1", "target": "Sertoli-Leydig cell tumor / ovarian tumors", "method": "Pelvic ultrasound", "category": "Ultrasound", "startText": "Birth/diagnosis", "minAge": 0, "stopText": "40 years", "maxAge": 40, "frequency": "Every 6–12 months", "intervalMin": 6, "intervalMax": 12, "sex": "Female", "lifelong": false, "symptom": false, "notes": "2023 update moved pelvic ultrasound start from age 8 to birth/diagnosis because early tumors were reported before age 8.", "sourceFile": "ccr-24-1947.pdf", "sourceTitle": "Update on Pediatric Surveillance Recommendations for PTEN Hamartoma Tumor Syndrome, DICER1-Related Tumor Predisposition, and Tuberous Sclerosis Complex", "extractionType": "direct_table_snippet", "confidence": "high", "priority": 9}, {"id": "R0008", "syndrome": "DICER1 tumor predisposition", "gene": "DICER1", "target": "Thyroid disease / thyroid cancer", "method": "Clinical exam and thyroid ultrasound consideration", "category": "Thyroid", "startText": "8 years", "minAge": 8, "stopText": "40 years", "maxAge": 40, "frequency": "Variable", "intervalMin": null, "intervalMax": null, "sex": "All", "lifelong": false, "symptom": false, "notes": "Use syndrome-specific thyroid surveillance; confirm final interval against source table.", "sourceFile": "ccr-24-1947.pdf", "sourceTitle": "Update on Pediatric Surveillance Recommendations for PTEN Hamartoma Tumor Syndrome, DICER1-Related Tumor Predisposition, and Tuberous Sclerosis Complex", "extractionType": "direct_table_snippet", "confidence": "medium", "priority": 9}, {"id": "R0009", "syndrome": "DICER1 tumor predisposition", "gene": "DICER1", "target": "Ciliary body medulloepithelioma / ocular findings", "method": "Ophthalmology exam", "category": "Ophthalmology", "startText": "3 years", "minAge": 3, "stopText": "10 years", "maxAge": 10, "frequency": "Annual", "intervalMin": 12, "intervalMax": 12, "sex": "All", "lifelong": false, "symptom": false, "notes": "Eye surveillance for childhood ocular manifestations.", "sourceFile": "ccr-24-1947.pdf", "sourceTitle": "Update on Pediatric Surveillance Recommendations for PTEN Hamartoma Tumor Syndrome, DICER1-Related Tumor Predisposition, and Tuberous Sclerosis Complex", "extractionType": "direct_table_snippet", "confidence": "medium", "priority": 9}, {"id": "R0010", "syndrome": "PTEN hamartoma tumor syndrome", "gene": "PTEN", "target": "Differentiated thyroid carcinoma", "method": "Thyroid ultrasound", "category": "Ultrasound", "startText": "12 years", "minAge": 12, "stopText": "", "maxAge": null, "frequency": "Annual", "intervalMin": 12, "intervalMax": 12, "sex": "All", "lifelong": true, "symptom": false, "notes": "2023 update moved thyroid ultrasound start age from 7 to 12 years.", "sourceFile": "ccr-24-1947.pdf", "sourceTitle": "Update on Pediatric Surveillance Recommendations for PTEN Hamartoma Tumor Syndrome, DICER1-Related Tumor Predisposition, and Tuberous Sclerosis Complex", "extractionType": "direct_table_snippet", "confidence": "high", "priority": 9}, {"id": "R0011", "syndrome": "Tuberous sclerosis complex", "gene": "TSC1/TSC2", "target": "Renal angiomyolipoma / renal lesions", "method": "Renal ultrasound until age 12 then MRI", "category": "Renal", "startText": "Diagnosis", "minAge": 0, "stopText": "", "maxAge": null, "frequency": "Ongoing", "intervalMin": null, "intervalMax": null, "sex": "All", "lifelong": true, "symptom": false, "notes": "2023 update: ultrasound until 12 years, then transition to MRI; baseline renal MRI at diagnosis when possible.", "sourceFile": "ccr-24-1947.pdf", "sourceTitle": "Update on Pediatric Surveillance Recommendations for PTEN Hamartoma Tumor Syndrome, DICER1-Related Tumor Predisposition, and Tuberous Sclerosis Complex", "extractionType": "direct_table_snippet", "confidence": "high", "priority": 9}, {"id": "R0012", "syndrome": "Tuberous sclerosis complex", "gene": "TSC1/TSC2", "target": "Brain lesions / SEGAs", "method": "Brain MRI", "category": "MRI", "startText": "Diagnosis", "minAge": 0, "stopText": "25 years", "maxAge": 25, "frequency": "Every 1–3 years", "intervalMin": 12, "intervalMax": 36, "sex": "All", "lifelong": false, "symptom": false, "notes": "MRI surveillance for CNS manifestations, frequency varies by age and prior findings.", "sourceFile": "ccr-24-1947.pdf", "sourceTitle": "Update on Pediatric Surveillance Recommendations for PTEN Hamartoma Tumor Syndrome, DICER1-Related Tumor Predisposition, and Tuberous Sclerosis Complex", "extractionType": "direct_table_snippet", "confidence": "medium", "priority": 9}, {"id": "R0013", "syndrome": "Hereditary retinoblastoma", "gene": "RB1", "target": "Intraocular retinoblastoma", "method": "Serial ophthalmic exam under anesthesia / detailed retinal exam", "category": "Ophthalmology", "startText": "Birth", "minAge": 0, "stopText": "7 years", "maxAge": 7, "frequency": "Stepped schedule", "intervalMin": null, "intervalMax": null, "sex": "All", "lifelong": false, "symptom": false, "notes": "Detailed cadence is age-stepped; this row represents the overall childhood ophthalmic surveillance program.", "sourceFile": "ccr-24-2488.pdf", "sourceTitle": "Update on Retinoblastoma Predisposition and Surveillance Recommendations for Children", "extractionType": "direct_table_snippet", "confidence": "high", "priority": 9}, {"id": "R0014", "syndrome": "Hereditary retinoblastoma", "gene": "RB1", "target": "Trilateral retinoblastoma / intracranial tumor", "method": "Brain MRI", "category": "MRI", "startText": "Diagnosis", "minAge": 0, "stopText": "4 years", "maxAge": 4, "frequency": "Every 6 months", "intervalMin": 6, "intervalMax": 6, "sex": "All", "lifelong": false, "symptom": false, "notes": "Consensus approach includes baseline brain MRI with serial surveillance through age 4.", "sourceFile": "ccr-24-2488.pdf", "sourceTitle": "Update on Retinoblastoma Predisposition and Surveillance Recommendations for Children", "extractionType": "direct_table_snippet", "confidence": "high", "priority": 9}, {"id": "R0015", "syndrome": "Li–Fraumeni syndrome", "gene": "TP53", "target": "General childhood malignancy surveillance", "method": "Comprehensive physical examination", "category": "Clinical exam", "startText": "Birth", "minAge": 0, "stopText": "18 years", "maxAge": 18, "frequency": "Every 3–4 months", "intervalMin": 3, "intervalMax": 4, "sex": "All", "lifelong": false, "symptom": false, "notes": "Part of updated Toronto Protocol.", "sourceFile": "ccr-24-3278.pdf", "sourceTitle": "Update on Cancer Screening Recommendations for Individuals with Li–Fraumeni Syndrome", "extractionType": "prior_build_summary", "confidence": "medium", "priority": 8}, {"id": "R0016", "syndrome": "Li–Fraumeni syndrome", "gene": "TP53", "target": "Adrenocortical tumor / abdominal tumors", "method": "Abdominal ultrasound", "category": "Ultrasound", "startText": "Birth", "minAge": 0, "stopText": "18 years", "maxAge": 18, "frequency": "Every 3–4 months", "intervalMin": 3, "intervalMax": 4, "sex": "All", "lifelong": false, "symptom": false, "notes": "Childhood surveillance per updated Toronto Protocol summary.", "sourceFile": "Pasted text.txt", "sourceTitle": "Claude progress transcript", "extractionType": "prior_build_summary", "confidence": "medium", "priority": 8}, {"id": "R0017", "syndrome": "Li–Fraumeni syndrome", "gene": "TP53", "target": "Whole-body malignancy screening", "method": "Whole-body MRI", "category": "MRI", "startText": "Birth", "minAge": 0, "stopText": "", "maxAge": null, "frequency": "Annual", "intervalMin": 12, "intervalMax": 12, "sex": "All", "lifelong": true, "symptom": false, "notes": "Annual WBMRI included in 2023 update summary.", "sourceFile": "Pasted text.txt", "sourceTitle": "Claude progress transcript", "extractionType": "prior_build_summary", "confidence": "medium", "priority": 8}, {"id": "R0018", "syndrome": "Li–Fraumeni syndrome", "gene": "TP53", "target": "Brain tumors", "method": "Brain MRI", "category": "MRI", "startText": "Birth", "minAge": 0, "stopText": "", "maxAge": null, "frequency": "Annual", "intervalMin": 12, "intervalMax": 12, "sex": "All", "lifelong": true, "symptom": false, "notes": "Annual brain MRI included in 2023 update summary.", "sourceFile": "Pasted text.txt", "sourceTitle": "Claude progress transcript", "extractionType": "prior_build_summary", "confidence": "medium", "priority": 8}, {"id": "R0019", "syndrome": "Li–Fraumeni syndrome", "gene": "TP53", "target": "Hematologic malignancy surveillance", "method": "CBC", "category": "Laboratory", "startText": "Birth", "minAge": 0, "stopText": "18 years", "maxAge": 18, "frequency": "Every 3–4 months", "intervalMin": 3, "intervalMax": 4, "sex": "All", "lifelong": false, "symptom": false, "notes": "CBC included in childhood Toronto Protocol summary.", "sourceFile": "Pasted text.txt", "sourceTitle": "Claude progress transcript", "extractionType": "prior_build_summary", "confidence": "medium", "priority": 8}, {"id": "R0020", "syndrome": "NF2-related schwannomatosis", "gene": "NF2", "target": "Vestibular schwannoma / CNS tumors", "method": "Brain MRI", "category": "MRI", "startText": "Childhood", "minAge": 10, "stopText": "", "maxAge": null, "frequency": "Annual", "intervalMin": 12, "intervalMax": 12, "sex": "All", "lifelong": true, "symptom": false, "notes": "Annual brain MRI noted in prior structured extraction summary.", "sourceFile": "Pasted text.txt", "sourceTitle": "Claude progress transcript", "extractionType": "prior_build_summary", "confidence": "medium", "priority": 8}, {"id": "R0021", "syndrome": "SMARCB1-related schwannomatosis", "gene": "SMARCB1", "target": "Schwannomas / meningioma surveillance", "method": "MRI surveillance", "category": "MRI", "startText": "Childhood/adolescence", "minAge": 10, "stopText": "", "maxAge": null, "frequency": "Every 3 years", "intervalMin": 36, "intervalMax": 36, "sex": "All", "lifelong": true, "symptom": false, "notes": "Every-3-year interval noted in prior extraction summary.", "sourceFile": "Pasted text.txt", "sourceTitle": "Claude progress transcript", "extractionType": "prior_build_summary", "confidence": "medium", "priority": 8}, {"id": "R0022", "syndrome": "LZTR1-related schwannomatosis", "gene": "LZTR1", "target": "Schwannoma surveillance", "method": "MRI surveillance", "category": "MRI", "startText": "Childhood/adolescence", "minAge": 10, "stopText": "", "maxAge": null, "frequency": "Every 3 years", "intervalMin": 36, "intervalMax": 36, "sex": "All", "lifelong": true, "symptom": false, "notes": "No surveillance if incidentally identified variant and no schwannoma history; otherwise MRI surveillance summarized from prior build.", "sourceFile": "Pasted text.txt", "sourceTitle": "Claude progress transcript", "extractionType": "prior_build_summary", "confidence": "medium", "priority": 8}, {"id": "R0023", "syndrome": "Beckwith–Wiedemann syndrome / spectrum", "gene": "11p15-related", "target": "Wilms tumor", "method": "Renal ultrasound", "category": "Ultrasound", "startText": "Birth", "minAge": 0, "stopText": "7 years", "maxAge": 7, "frequency": "Every 3 months", "intervalMin": 3, "intervalMax": 3, "sex": "All", "lifelong": false, "symptom": false, "notes": "Subtype nuance: IC1 GOM has the highest Wilms risk (about 20%); pUPD11 has intermediate risk (about 8%) and is also linked to hepatoblastoma; IC2 LOM has lower overall Wilms risk (around 1%) with tumors tending more toward hepatoblastoma. Because blood subtype may not reflect mosaic tissue subtype, AACR recommends the general BWSp Wilms/hepatoblastoma screening approach for all BWSp except CDKN1C pathogenic variants.", "sourceFile": "ccr-24-2100.pdf", "sourceTitle": "Update on Surveillance for Wilms Tumor and Hepatoblastoma in Beckwith–Wiedemann Syndrome and Other Predisposition Syndromes", "extractionType": "direct_table_snippet", "confidence": "medium", "priority": 8}, {"id": "R0024", "syndrome": "Beckwith–Wiedemann syndrome / spectrum", "gene": "11p15-related", "target": "Hepatoblastoma", "method": "Abdominal ultrasound and AFP", "category": "Ultrasound/Lab", "startText": "Birth", "minAge": 0, "stopText": "30 months", "maxAge": 2.5, "frequency": "Every 3 months", "intervalMin": 3, "intervalMax": 3, "sex": "All", "lifelong": false, "symptom": false, "notes": "Subtype nuance: hepatoblastoma risk appears to end earlier in BWSp, so AFP plus abdominal ultrasound is focused on early childhood only. IC2 LOM tumors are more often hepatoblastoma-predominant, while pUPD11 also carries hepatoblastoma risk. CDKN1C pathogenic variants have no reported Wilms tumor or hepatoblastoma in the cited series; those patients should shift away from AFP/Wilms screening and instead follow neuroblastoma-focused surveillance.", "sourceFile": "ccr-24-2100.pdf", "sourceTitle": "Update on Surveillance for Wilms Tumor and Hepatoblastoma in Beckwith–Wiedemann Syndrome and Other Predisposition Syndromes", "extractionType": "direct_table_snippet", "confidence": "medium", "priority": 8}, {"id": "R0025", "syndrome": "TRIM28-related Wilms predisposition", "gene": "TRIM28", "target": "Wilms tumor", "method": "Renal ultrasound", "category": "Ultrasound", "startText": "Birth/diagnosis", "minAge": 0, "stopText": "8 years", "maxAge": 8, "frequency": "Every 3 months", "intervalMin": 3, "intervalMax": 3, "sex": "All", "lifelong": false, "symptom": false, "notes": "Emerging Wilms predisposition gene with consensus surveillance recommendation.", "sourceFile": "ccr-24-3271.pdf", "sourceTitle": "Update on Surveillance Guidelines in Emerging Wilms Tumor Predisposition Syndromes", "extractionType": "prior_build_summary", "confidence": "high", "priority": 8}, {"id": "R0026", "syndrome": "REST-related Wilms predisposition", "gene": "REST", "target": "Wilms tumor", "method": "Renal ultrasound", "category": "Ultrasound", "startText": "Birth/diagnosis", "minAge": 0, "stopText": "8 years", "maxAge": 8, "frequency": "Every 3 months", "intervalMin": 3, "intervalMax": 3, "sex": "All", "lifelong": false, "symptom": false, "notes": "Emerging Wilms predisposition gene with consensus surveillance recommendation.", "sourceFile": "ccr-24-3271.pdf", "sourceTitle": "Update on Surveillance Guidelines in Emerging Wilms Tumor Predisposition Syndromes", "extractionType": "prior_build_summary", "confidence": "high", "priority": 8}, {"id": "R0027", "syndrome": "DIS3L2-related Wilms predisposition", "gene": "DIS3L2", "target": "Wilms tumor", "method": "Renal ultrasound", "category": "Ultrasound", "startText": "Birth/diagnosis", "minAge": 0, "stopText": "8 years", "maxAge": 8, "frequency": "Every 3 months", "intervalMin": 3, "intervalMax": 3, "sex": "All", "lifelong": false, "symptom": false, "notes": "Emerging Wilms predisposition gene with consensus surveillance recommendation.", "sourceFile": "ccr-24-3271.pdf", "sourceTitle": "Update on Surveillance Guidelines in Emerging Wilms Tumor Predisposition Syndromes", "extractionType": "prior_build_summary", "confidence": "high", "priority": 8}, {"id": "R0028", "syndrome": "CTR9-related Wilms predisposition", "gene": "CTR9", "target": "Wilms tumor", "method": "Renal ultrasound", "category": "Ultrasound", "startText": "Birth/diagnosis", "minAge": 0, "stopText": "8 years", "maxAge": 8, "frequency": "Every 3 months", "intervalMin": 3, "intervalMax": 3, "sex": "All", "lifelong": false, "symptom": false, "notes": "Emerging Wilms predisposition gene with consensus surveillance recommendation.", "sourceFile": "ccr-24-3271.pdf", "sourceTitle": "Update on Surveillance Guidelines in Emerging Wilms Tumor Predisposition Syndromes", "extractionType": "prior_build_summary", "confidence": "high", "priority": 8}, {"id": "R0029", "syndrome": "Hereditary leiomyomatosis and renal cell carcinoma", "gene": "FH", "target": "Renal cell carcinoma", "method": "Renal MRI", "category": "MRI", "startText": "10 years", "minAge": 10, "stopText": "", "maxAge": null, "frequency": "Annual", "intervalMin": 12, "intervalMax": 12, "sex": "All", "lifelong": true, "symptom": false, "notes": "Prompt surgical resection if lesion detected, regardless of size.", "sourceFile": "ccr-24-3860.pdf", "sourceTitle": "Update on Cancer Screening in Children with Syndromes of Bone Lesions, Hereditary Leiomyomatosis and Renal Cell Carcinoma Syndrome, and Other Rare Syndromes", "extractionType": "prior_build_summary", "confidence": "high", "priority": 8}, {"id": "R0030", "syndrome": "Ollier disease", "gene": "IDH1/IDH2-associated mosaic", "target": "Malignant transformation of enchondromas", "method": "Physical exam plus whole-body MRI", "category": "Imaging", "startText": "Diagnosis", "minAge": 0, "stopText": "", "maxAge": null, "frequency": "Physical exam every 6–12 months; imaging individualized", "intervalMin": 6, "intervalMax": 12, "sex": "All", "lifelong": true, "symptom": false, "notes": "High transformation risk; educate on rapid growth or persistent pain.", "sourceFile": "ccr-24-3860.pdf", "sourceTitle": "Update on Cancer Screening in Children with Syndromes of Bone Lesions, Hereditary Leiomyomatosis and Renal Cell Carcinoma Syndrome, and Other Rare Syndromes", "extractionType": "prior_build_summary", "confidence": "medium", "priority": 8}, {"id": "R0031", "syndrome": "Maffucci syndrome", "gene": "IDH1/IDH2-associated mosaic", "target": "Malignant transformation / chondrosarcoma", "method": "Physical exam plus whole-body MRI", "category": "Imaging", "startText": "Diagnosis", "minAge": 0, "stopText": "", "maxAge": null, "frequency": "Physical exam every 6–12 months; imaging individualized", "intervalMin": 6, "intervalMax": 12, "sex": "All", "lifelong": true, "symptom": false, "notes": "High transformation risk; educate on mass growth or pain.", "sourceFile": "ccr-24-3860.pdf", "sourceTitle": "Update on Cancer Screening in Children with Syndromes of Bone Lesions, Hereditary Leiomyomatosis and Renal Cell Carcinoma Syndrome, and Other Rare Syndromes", "extractionType": "prior_build_summary", "confidence": "medium", "priority": 8}, {"id": "R0032", "syndrome": "Hereditary multiple osteochondromas", "gene": "EXT1/EXT2", "target": "Chondrosarcoma risk", "method": "Baseline imaging and lifelong clinical surveillance", "category": "Imaging", "startText": "Childhood", "minAge": 5, "stopText": "", "maxAge": null, "frequency": "Periodic", "intervalMin": null, "intervalMax": null, "sex": "All", "lifelong": true, "symptom": false, "notes": "Lower risk than Ollier/Maffucci but surveillance recommended lifelong.", "sourceFile": "ccr-24-3860.pdf", "sourceTitle": "Update on Cancer Screening in Children with Syndromes of Bone Lesions, Hereditary Leiomyomatosis and Renal Cell Carcinoma Syndrome, and Other Rare Syndromes", "extractionType": "prior_build_summary", "confidence": "medium", "priority": 8}, {"id": "R0033", "syndrome": "Neurofibromatosis type 1", "gene": "NF1", "target": "Optic pathway glioma", "method": "Visual screening and ophthalmologic monitoring", "category": "Ophthalmology", "startText": "Infancy", "minAge": 0, "stopText": "8 years", "maxAge": 8, "frequency": "Regular ophthalmology follow-up", "intervalMin": null, "intervalMax": null, "sex": "All", "lifelong": false, "symptom": false, "notes": "Routine MRI not recommended for asymptomatic OPG surveillance; exam-driven approach.", "sourceFile": "ccr-24-1098.pdf", "sourceTitle": "Update on Pediatric Cancer Surveillance Recommendations for Patients with Neurofibromatosis Type 1, Noonan Syndrome, CBL Syndrome, Costello Syndrome, and Related RASopathies", "extractionType": "prior_build_summary", "confidence": "high", "priority": 8}, {"id": "R0034", "syndrome": "Neurofibromatosis type 1", "gene": "NF1", "target": "Plexiform neurofibroma tumor burden / MPNST risk context", "method": "Postpubertal whole-body MRI baseline", "category": "MRI", "startText": "Post-puberty", "minAge": 15, "stopText": "", "maxAge": null, "frequency": "Baseline once", "intervalMin": null, "intervalMax": null, "sex": "All", "lifelong": false, "symptom": false, "notes": "Baseline postpubertal WBMRI noted in 2023 update summary.", "sourceFile": "ccr-24-1098.pdf", "sourceTitle": "Update on Pediatric Cancer Surveillance Recommendations for Patients with Neurofibromatosis Type 1, Noonan Syndrome, CBL Syndrome, Costello Syndrome, and Related RASopathies", "extractionType": "prior_build_summary", "confidence": "high", "priority": 8}, {"id": "R0035", "syndrome": "Costello syndrome", "gene": "HRAS", "target": "Rhabdomyosarcoma", "method": "Abdominopelvic ultrasound", "category": "Ultrasound", "startText": "Birth", "minAge": 0, "stopText": "14 years", "maxAge": 14, "frequency": "Every 3 months", "intervalMin": 3, "intervalMax": 3, "sex": "All", "lifelong": false, "symptom": false, "notes": "Exact protocol summarized in prior build.", "sourceFile": "ccr-24-1098.pdf", "sourceTitle": "Update on Pediatric Cancer Surveillance Recommendations for Patients with Neurofibromatosis Type 1, Noonan Syndrome, CBL Syndrome, Costello Syndrome, and Related RASopathies", "extractionType": "prior_build_summary", "confidence": "high", "priority": 8}, {"id": "R0036", "syndrome": "Costello syndrome", "gene": "HRAS", "target": "Neuroblastoma", "method": "Abdominopelvic ultrasound / urine catecholamines", "category": "Ultrasound/Lab", "startText": "Birth", "minAge": 0, "stopText": "10 years", "maxAge": 10, "frequency": "Every 6–12 months", "intervalMin": 6, "intervalMax": 12, "sex": "All", "lifelong": false, "symptom": false, "notes": "Protocol summarized from prior build.", "sourceFile": "ccr-24-1098.pdf", "sourceTitle": "Update on Pediatric Cancer Surveillance Recommendations for Patients with Neurofibromatosis Type 1, Noonan Syndrome, CBL Syndrome, Costello Syndrome, and Related RASopathies", "extractionType": "prior_build_summary", "confidence": "high", "priority": 8}, {"id": "R0037", "syndrome": "Costello syndrome", "gene": "HRAS", "target": "Bladder transitional cell carcinoma", "method": "Urinalysis", "category": "Laboratory", "startText": "10 years", "minAge": 10, "stopText": "", "maxAge": null, "frequency": "Annual", "intervalMin": 12, "intervalMax": 12, "sex": "All", "lifelong": true, "symptom": false, "notes": "Protocol summarized from prior build.", "sourceFile": "ccr-24-1098.pdf", "sourceTitle": "Update on Pediatric Cancer Surveillance Recommendations for Patients with Neurofibromatosis Type 1, Noonan Syndrome, CBL Syndrome, Costello Syndrome, and Related RASopathies", "extractionType": "prior_build_summary", "confidence": "high", "priority": 8}, {"id": "R0038", "syndrome": "Noonan syndrome", "gene": "PTPN11/SOS1/RAF1/etc.", "target": "General tumor risk", "method": "Clinical vigilance rather than fixed lab surveillance", "category": "Clinical exam", "startText": "Childhood", "minAge": 0, "stopText": "", "maxAge": null, "frequency": "Routine care", "intervalMin": null, "intervalMax": null, "sex": "All", "lifelong": true, "symptom": false, "notes": "2023 update removed routine CBC recommendation.", "sourceFile": "ccr-24-1098.pdf", "sourceTitle": "Update on Pediatric Cancer Surveillance Recommendations for Patients with Neurofibromatosis Type 1, Noonan Syndrome, CBL Syndrome, Costello Syndrome, and Related RASopathies", "extractionType": "prior_build_summary", "confidence": "high", "priority": 8}, {"id": "R0039", "syndrome": "Ataxia telangiectasia", "gene": "ATM", "target": "General malignancy surveillance", "method": "Clinical review with symptom-based evaluation", "category": "Clinical exam", "startText": "Diagnosis", "minAge": 0, "stopText": "", "maxAge": null, "frequency": "Routine", "intervalMin": null, "intervalMax": null, "sex": "All", "lifelong": true, "symptom": false, "notes": "2023 update removed annual CBC from standard surveillance set.", "sourceFile": "ccr-24-1611.pdf", "sourceTitle": "Update on Recommendations for Cancer Screening and Surveillance in Children with Genomic Instability Disorders", "extractionType": "prior_build_summary", "confidence": "high", "priority": 8}, {"id": "R0040", "syndrome": "Nijmegen breakage syndrome", "gene": "NBN", "target": "General malignancy surveillance", "method": "Clinical review with symptom-based evaluation", "category": "Clinical exam", "startText": "Diagnosis", "minAge": 0, "stopText": "", "maxAge": null, "frequency": "Routine", "intervalMin": null, "intervalMax": null, "sex": "All", "lifelong": true, "symptom": false, "notes": "2023 update removed annual CBC from standard surveillance set.", "sourceFile": "ccr-24-1611.pdf", "sourceTitle": "Update on Recommendations for Cancer Screening and Surveillance in Children with Genomic Instability Disorders", "extractionType": "prior_build_summary", "confidence": "high", "priority": 8}, {"id": "R0041", "syndrome": "Bloom syndrome", "gene": "BLM", "target": "Colorectal neoplasia", "method": "Colonoscopy", "category": "Endoscopy", "startText": "10–12 years", "minAge": 10, "stopText": "", "maxAge": null, "frequency": "Variable", "intervalMin": null, "intervalMax": null, "sex": "All", "lifelong": true, "symptom": false, "notes": "2023 update moved colonoscopy start from 15 to 10–12 years; WBMRI for lymphoma not recommended.", "sourceFile": "ccr-24-1611.pdf", "sourceTitle": "Update on Recommendations for Cancer Screening and Surveillance in Children with Genomic Instability Disorders", "extractionType": "prior_build_summary", "confidence": "high", "priority": 8}, {"id": "R0042", "syndrome": "Fanconi anemia", "gene": "FA pathway genes", "target": "Hematologic malignancy and marrow failure", "method": "CBC and marrow-focused surveillance", "category": "Laboratory", "startText": "Diagnosis", "minAge": 0, "stopText": "", "maxAge": null, "frequency": "Protocolized", "intervalMin": null, "intervalMax": null, "sex": "All", "lifelong": true, "symptom": false, "notes": "Includes subtype-specific imaging for FANCD1/BRCA2 in prior build summary.", "sourceFile": "ccr-24-1611.pdf", "sourceTitle": "Update on Recommendations for Cancer Screening and Surveillance in Children with Genomic Instability Disorders", "extractionType": "prior_build_summary", "confidence": "medium", "priority": 8}, {"id": "R0043", "syndrome": "Dyskeratosis congenita / telomere biology disorder", "gene": "TBD genes", "target": "Marrow failure and HNSCC surveillance", "method": "CBC, annual marrow evaluation, head/neck surveillance", "category": "Laboratory/Clinical", "startText": "Diagnosis", "minAge": 0, "stopText": "", "maxAge": null, "frequency": "CBC every 6 months; annual marrow; HNSCC surveillance from 10", "intervalMin": 6, "intervalMax": 12, "sex": "All", "lifelong": true, "symptom": false, "notes": "Summarized from prior build.", "sourceFile": "ccr-24-1611.pdf", "sourceTitle": "Update on Recommendations for Cancer Screening and Surveillance in Children with Genomic Instability Disorders", "extractionType": "prior_build_summary", "confidence": "high", "priority": 8}, {"id": "R0044", "syndrome": "Xeroderma pigmentosum", "gene": "XP genes", "target": "Skin cancer", "method": "Dermatology exam", "category": "Dermatology", "startText": "Diagnosis", "minAge": 0, "stopText": "", "maxAge": null, "frequency": "Every 3 months", "intervalMin": 3, "intervalMax": 3, "sex": "All", "lifelong": true, "symptom": false, "notes": "XPC-specific AML surveillance noted in prior build summary.", "sourceFile": "ccr-24-1611.pdf", "sourceTitle": "Update on Recommendations for Cancer Screening and Surveillance in Children with Genomic Instability Disorders", "extractionType": "prior_build_summary", "confidence": "high", "priority": 8}, {"id": "R0045", "syndrome": "Rothmund–Thomson syndrome", "gene": "RECQL4", "target": "Osteosarcoma", "method": "Clinical vigilance with possible WBMRI consideration", "category": "Clinical/MRI", "startText": "Childhood", "minAge": 5, "stopText": "", "maxAge": null, "frequency": "Individualized", "intervalMin": null, "intervalMax": null, "sex": "All", "lifelong": true, "symptom": false, "notes": "WBMRI considered with caveats in prior build summary.", "sourceFile": "ccr-24-1611.pdf", "sourceTitle": "Update on Recommendations for Cancer Screening and Surveillance in Children with Genomic Instability Disorders", "extractionType": "prior_build_summary", "confidence": "medium", "priority": 8}, {"id": "R0046", "syndrome": "Mosaic variegated aneuploidy", "gene": "BUB1B/TRIP13/etc.", "target": "Wilms tumor / embryonal tumor surveillance", "method": "Renal ultrasound", "category": "Ultrasound", "startText": "Birth", "minAge": 0, "stopText": "7 years", "maxAge": 7, "frequency": "Every 3 months", "intervalMin": 3, "intervalMax": 3, "sex": "All", "lifelong": false, "symptom": false, "notes": "Prior build summary included q3 month renal ultrasound to age 7.", "sourceFile": "ccr-24-1611.pdf", "sourceTitle": "Update on Recommendations for Cancer Screening and Surveillance in Children with Genomic Instability Disorders", "extractionType": "prior_build_summary", "confidence": "high", "priority": 8}, {"id": "R0047", "syndrome": "Familial adenomatous polyposis", "gene": "APC", "target": "Hepatoblastoma", "method": "Abdominal ultrasound and AFP", "category": "Ultrasound/Lab", "startText": "Infancy", "minAge": 0, "stopText": "7 years", "maxAge": 7, "frequency": "Every 3 months", "intervalMin": 3, "intervalMax": 3, "sex": "All", "lifelong": false, "symptom": false, "notes": "2023 update strengthened hepatoblastoma screening recommendation.", "sourceFile": "ccr-24-0953.pdf", "sourceTitle": "Pediatric Cancer Screening in Hereditary Gastrointestinal Cancer Risk Syndromes: An Update from the AACR Childhood Cancer Predisposition Working Group", "extractionType": "prior_build_summary", "confidence": "high", "priority": 8}, {"id": "R0048", "syndrome": "Familial adenomatous polyposis", "gene": "APC", "target": "Thyroid carcinoma", "method": "Thyroid ultrasound", "category": "Ultrasound", "startText": "16 years", "minAge": 16, "stopText": "", "maxAge": null, "frequency": "Periodic", "intervalMin": null, "intervalMax": null, "sex": "All", "lifelong": true, "symptom": false, "notes": "Thyroid ultrasound starts at age 16 per prior build summary.", "sourceFile": "ccr-24-0953.pdf", "sourceTitle": "Pediatric Cancer Screening in Hereditary Gastrointestinal Cancer Risk Syndromes: An Update from the AACR Childhood Cancer Predisposition Working Group", "extractionType": "prior_build_summary", "confidence": "medium", "priority": 8}, {"id": "R0049", "syndrome": "Peutz–Jeghers syndrome", "gene": "STK11", "target": "Intussusception / GI polyp burden", "method": "GI surveillance plus symptom education", "category": "Endoscopy", "startText": "Childhood", "minAge": 8, "stopText": "", "maxAge": null, "frequency": "Protocolized", "intervalMin": null, "intervalMax": null, "sex": "All", "lifelong": true, "symptom": false, "notes": "Clear intussusception education emphasized in 2023 update.", "sourceFile": "ccr-24-0953.pdf", "sourceTitle": "Pediatric Cancer Screening in Hereditary Gastrointestinal Cancer Risk Syndromes: An Update from the AACR Childhood Cancer Predisposition Working Group", "extractionType": "prior_build_summary", "confidence": "medium", "priority": 8}, {"id": "R0050", "syndrome": "Juvenile polyposis syndrome", "gene": "SMAD4/BMPR1A", "target": "GI polyposis surveillance", "method": "GI surveillance", "category": "Endoscopy", "startText": "Childhood", "minAge": 8, "stopText": "", "maxAge": null, "frequency": "Protocolized", "intervalMin": null, "intervalMax": null, "sex": "All", "lifelong": true, "symptom": false, "notes": "2023 update removed small bowel screening recommendation.", "sourceFile": "ccr-24-0953.pdf", "sourceTitle": "Pediatric Cancer Screening in Hereditary Gastrointestinal Cancer Risk Syndromes: An Update from the AACR Childhood Cancer Predisposition Working Group", "extractionType": "prior_build_summary", "confidence": "medium", "priority": 8}, {"id": "R0051", "syndrome": "Hereditary pheochromocytoma/paraganglioma syndrome", "gene": "SDHB", "target": "Pheochromocytoma/paraganglioma", "method": "Blood pressure and plasma or urine metanephrines", "category": "Laboratory", "startText": "6 years", "minAge": 6, "stopText": "", "maxAge": null, "frequency": "Annual", "intervalMin": 12, "intervalMax": 12, "sex": "All", "lifelong": true, "symptom": false, "notes": "Gene-specific start age based on 2023 AACR update.", "sourceFile": "ccr-24-4354.pdf", "sourceTitle": "Update on Tumor Surveillance for Children with Hereditary Pheochromocytoma/Paraganglioma Syndromes", "extractionType": "direct_table_snippet", "confidence": "high", "priority": 8}, {"id": "R0052", "syndrome": "Hereditary pheochromocytoma/paraganglioma syndrome", "gene": "SDHB", "target": "Pheochromocytoma/paraganglioma", "method": "MRI from skull base to pelvis", "category": "MRI", "startText": "10 years", "minAge": 10, "stopText": "", "maxAge": null, "frequency": "Every 2–3 years", "intervalMin": 24, "intervalMax": 36, "sex": "All", "lifelong": true, "symptom": false, "notes": "Gene-specific imaging schedule.", "sourceFile": "ccr-24-4354.pdf", "sourceTitle": "Update on Tumor Surveillance for Children with Hereditary Pheochromocytoma/Paraganglioma Syndromes", "extractionType": "direct_table_snippet", "confidence": "high", "priority": 8}, {"id": "R0053", "syndrome": "Hereditary pheochromocytoma/paraganglioma syndrome", "gene": "SDHD", "target": "Pheochromocytoma/paraganglioma", "method": "Blood pressure and plasma or urine metanephrines", "category": "Laboratory", "startText": "10 years", "minAge": 10, "stopText": "", "maxAge": null, "frequency": "Annual", "intervalMin": 12, "intervalMax": 12, "sex": "All", "lifelong": true, "symptom": false, "notes": "SDHD maternal inheritance exception applies.", "sourceFile": "ccr-24-4354.pdf", "sourceTitle": "Update on Tumor Surveillance for Children with Hereditary Pheochromocytoma/Paraganglioma Syndromes", "extractionType": "direct_table_snippet", "confidence": "high", "priority": 8}, {"id": "R0054", "syndrome": "Hereditary pheochromocytoma/paraganglioma syndrome", "gene": "SDHD", "target": "Pheochromocytoma/paraganglioma", "method": "MRI from skull base to pelvis", "category": "MRI", "startText": "15 years", "minAge": 15, "stopText": "", "maxAge": null, "frequency": "Every 2–3 years", "intervalMin": 24, "intervalMax": 36, "sex": "All", "lifelong": true, "symptom": false, "notes": "SDHD maternal inheritance exception applies.", "sourceFile": "ccr-24-4354.pdf", "sourceTitle": "Update on Tumor Surveillance for Children with Hereditary Pheochromocytoma/Paraganglioma Syndromes", "extractionType": "direct_table_snippet", "confidence": "high", "priority": 8}, {"id": "R0055", "syndrome": "Hereditary pheochromocytoma/paraganglioma syndrome", "gene": "SDHA", "target": "Pheochromocytoma/paraganglioma", "method": "Blood pressure and plasma or urine metanephrines", "category": "Laboratory", "startText": "10 years", "minAge": 10, "stopText": "", "maxAge": null, "frequency": "Annual", "intervalMin": 12, "intervalMax": 12, "sex": "All", "lifelong": true, "symptom": false, "notes": "Lower penetrance but surveillance still recommended.", "sourceFile": "ccr-24-4354.pdf", "sourceTitle": "Update on Tumor Surveillance for Children with Hereditary Pheochromocytoma/Paraganglioma Syndromes", "extractionType": "direct_table_snippet", "confidence": "high", "priority": 8}, {"id": "R0056", "syndrome": "Hereditary pheochromocytoma/paraganglioma syndrome", "gene": "SDHA", "target": "Pheochromocytoma/paraganglioma", "method": "MRI from skull base to pelvis", "category": "MRI", "startText": "15 years", "minAge": 15, "stopText": "", "maxAge": null, "frequency": "Every 2–3 years", "intervalMin": 24, "intervalMax": 36, "sex": "All", "lifelong": true, "symptom": false, "notes": "Lower penetrance but surveillance still recommended.", "sourceFile": "ccr-24-4354.pdf", "sourceTitle": "Update on Tumor Surveillance for Children with Hereditary Pheochromocytoma/Paraganglioma Syndromes", "extractionType": "direct_table_snippet", "confidence": "high", "priority": 8}, {"id": "R0057", "syndrome": "Hereditary pheochromocytoma/paraganglioma syndrome", "gene": "MAX", "target": "Pheochromocytoma/paraganglioma", "method": "Blood pressure and plasma or urine metanephrines", "category": "Laboratory", "startText": "10 years", "minAge": 10, "stopText": "", "maxAge": null, "frequency": "Annual", "intervalMin": 12, "intervalMax": 12, "sex": "All", "lifelong": true, "symptom": false, "notes": "Gene-specific surveillance in 2023 update.", "sourceFile": "ccr-24-4354.pdf", "sourceTitle": "Update on Tumor Surveillance for Children with Hereditary Pheochromocytoma/Paraganglioma Syndromes", "extractionType": "direct_table_snippet", "confidence": "high", "priority": 8}, {"id": "R0058", "syndrome": "Hereditary pheochromocytoma/paraganglioma syndrome", "gene": "MAX", "target": "Pheochromocytoma/paraganglioma", "method": "MRI from skull base to pelvis", "category": "MRI", "startText": "15 years", "minAge": 15, "stopText": "", "maxAge": null, "frequency": "Every 2–3 years", "intervalMin": 24, "intervalMax": 36, "sex": "All", "lifelong": true, "symptom": false, "notes": "Gene-specific surveillance in 2023 update.", "sourceFile": "ccr-24-4354.pdf", "sourceTitle": "Update on Tumor Surveillance for Children with Hereditary Pheochromocytoma/Paraganglioma Syndromes", "extractionType": "direct_table_snippet", "confidence": "high", "priority": 8}, {"id": "R0059", "syndrome": "Hereditary pheochromocytoma/paraganglioma syndrome", "gene": "TMEM127", "target": "Pheochromocytoma/paraganglioma", "method": "Blood pressure and plasma or urine metanephrines", "category": "Laboratory", "startText": "10 years", "minAge": 10, "stopText": "", "maxAge": null, "frequency": "Annual", "intervalMin": 12, "intervalMax": 12, "sex": "All", "lifelong": true, "symptom": false, "notes": "Gene-specific surveillance in 2023 update.", "sourceFile": "ccr-24-4354.pdf", "sourceTitle": "Update on Tumor Surveillance for Children with Hereditary Pheochromocytoma/Paraganglioma Syndromes", "extractionType": "direct_table_snippet", "confidence": "high", "priority": 8}, {"id": "R0060", "syndrome": "Hereditary pheochromocytoma/paraganglioma syndrome", "gene": "TMEM127", "target": "Pheochromocytoma/paraganglioma", "method": "MRI from skull base to pelvis", "category": "MRI", "startText": "15 years", "minAge": 15, "stopText": "", "maxAge": null, "frequency": "Every 2–3 years", "intervalMin": 24, "intervalMax": 36, "sex": "All", "lifelong": true, "symptom": false, "notes": "Gene-specific surveillance in 2023 update.", "sourceFile": "ccr-24-4354.pdf", "sourceTitle": "Update on Tumor Surveillance for Children with Hereditary Pheochromocytoma/Paraganglioma Syndromes", "extractionType": "direct_table_snippet", "confidence": "high", "priority": 8}, {"id": "R0061", "syndrome": "Neuroblastoma predisposition", "gene": "ALK", "target": "Neuroblastoma", "method": "Abdominal ultrasound and urine catecholamines", "category": "Ultrasound/Lab", "startText": "Birth", "minAge": 0, "stopText": "10 years", "maxAge": 10, "frequency": "Every 3 months <6y then every 6 months to 10y", "intervalMin": 3, "intervalMax": 6, "sex": "All", "lifelong": false, "symptom": false, "notes": "Common hereditary NB surveillance approach; confirm exact cadence against full table.", "sourceFile": "ccr-24-0237.pdf", "sourceTitle": "Neuroblastoma Predisposition and Surveillance—An Update from the 2023 AACR Childhood Cancer Predisposition Workshop", "extractionType": "direct_table_snippet", "confidence": "medium", "priority": 8}, {"id": "R0062", "syndrome": "Neuroblastoma predisposition", "gene": "PHOX2B", "target": "Neuroblastoma", "method": "Abdominal ultrasound and urine catecholamines", "category": "Ultrasound/Lab", "startText": "Birth", "minAge": 0, "stopText": "10 years", "maxAge": 10, "frequency": "Every 3 months <6y then every 6 months to 10y", "intervalMin": 3, "intervalMax": 6, "sex": "All", "lifelong": false, "symptom": false, "notes": "Common hereditary NB surveillance approach; confirm exact cadence against full table.", "sourceFile": "ccr-24-0237.pdf", "sourceTitle": "Neuroblastoma Predisposition and Surveillance—An Update from the 2023 AACR Childhood Cancer Predisposition Workshop", "extractionType": "direct_table_snippet", "confidence": "medium", "priority": 8}, {"id": "R0063", "syndrome": "Constitutional mismatch repair deficiency", "gene": "PMS2/MSH6/MSH2/MLH1 biallelic", "target": "Brain tumors", "method": "Brain MRI", "category": "MRI", "startText": "Early childhood", "minAge": 2, "stopText": "20 years", "maxAge": 20, "frequency": "Every 6 months", "intervalMin": 6, "intervalMax": 6, "sex": "All", "lifelong": false, "symptom": false, "notes": "Starter row from replication repair deficiency schema; verify final age bounds in full table.", "sourceFile": "ccr-23-3994.pdf", "sourceTitle": "Clinical Updates and Surveillance Recommendations for DNA Replication Repair Deficiency Syndromes in Children and Young Adults", "extractionType": "direct_table_snippet", "confidence": "medium", "priority": 7}, {"id": "R0064", "syndrome": "Constitutional mismatch repair deficiency", "gene": "PMS2/MSH6/MSH2/MLH1 biallelic", "target": "GI malignancy/polyposis", "method": "Upper endoscopy and colonoscopy", "category": "Endoscopy", "startText": "6 years", "minAge": 6, "stopText": "", "maxAge": null, "frequency": "Annual", "intervalMin": 12, "intervalMax": 12, "sex": "All", "lifelong": true, "symptom": false, "notes": "Starter row; confirm exact intervals and age thresholds from full source table.", "sourceFile": "ccr-23-3994.pdf", "sourceTitle": "Clinical Updates and Surveillance Recommendations for DNA Replication Repair Deficiency Syndromes in Children and Young Adults", "extractionType": "direct_table_snippet", "confidence": "medium", "priority": 7}, {"id": "R0065", "syndrome": "Polymerase proofreading-associated polyposis", "gene": "POLE/POLD1", "target": "Colorectal neoplasia", "method": "Colonoscopy", "category": "Endoscopy", "startText": "Adolescence", "minAge": 14, "stopText": "", "maxAge": null, "frequency": "Every 1–2 years", "intervalMin": 12, "intervalMax": 24, "sex": "All", "lifelong": true, "symptom": false, "notes": "Starter row from replication repair deficiency paper.", "sourceFile": "ccr-23-3994.pdf", "sourceTitle": "Clinical Updates and Surveillance Recommendations for DNA Replication Repair Deficiency Syndromes in Children and Young Adults", "extractionType": "direct_table_snippet", "confidence": "medium", "priority": 7}, {"id": "R0066", "syndrome": "Childhood brain tumor predisposition", "gene": "SMARCB1/SMARCA4", "target": "Atypical teratoid/rhabdoid tumor / CNS surveillance", "method": "Brain MRI", "category": "MRI", "startText": "Infancy", "minAge": 0, "stopText": "5 years", "maxAge": 5, "frequency": "Every 3 months", "intervalMin": 3, "intervalMax": 3, "sex": "All", "lifelong": false, "symptom": false, "notes": "Starter surveillance row reflecting rhabdoid tumor predisposition context.", "sourceFile": "2342.pdf", "sourceTitle": "Update on Cancer Predisposition Syndromes and Surveillance Guidelines for Childhood Brain Tumors", "extractionType": "direct_table_snippet", "confidence": "medium", "priority": 7}, {"id": "R0067", "syndrome": "Childhood brain tumor predisposition", "gene": "SUFU/PTCH1", "target": "Medulloblastoma / brain tumor surveillance", "method": "Brain MRI", "category": "MRI", "startText": "Infancy", "minAge": 0, "stopText": "8 years", "maxAge": 8, "frequency": "Every 3–6 months", "intervalMin": 3, "intervalMax": 6, "sex": "All", "lifelong": false, "symptom": false, "notes": "Starter row; confirm syndrome-specific intervals from source table.", "sourceFile": "2342.pdf", "sourceTitle": "Update on Cancer Predisposition Syndromes and Surveillance Guidelines for Childhood Brain Tumors", "extractionType": "direct_table_snippet", "confidence": "medium", "priority": 7}, {"id": "R0068", "syndrome": "Childhood brain tumor predisposition", "gene": "TP53", "target": "CNS tumor surveillance within LFS context", "method": "Brain MRI", "category": "MRI", "startText": "Birth", "minAge": 0, "stopText": "", "maxAge": null, "frequency": "Annual", "intervalMin": 12, "intervalMax": 12, "sex": "All", "lifelong": true, "symptom": false, "notes": "Included here for CNS-tumor-oriented lookup as well.", "sourceFile": "2342.pdf", "sourceTitle": "Update on Cancer Predisposition Syndromes and Surveillance Guidelines for Childhood Brain Tumors", "extractionType": "direct_table_snippet", "confidence": "medium", "priority": 7}, {"id": "R0069", "syndrome": "MEN2A", "gene": "RET", "target": "Medullary thyroid carcinoma / endocrine neoplasia surveillance", "method": "RET-specific endocrine surveillance", "category": "Endocrine", "startText": "Childhood", "minAge": 3, "stopText": "", "maxAge": null, "frequency": "Protocolized", "intervalMin": null, "intervalMax": null, "sex": "All", "lifelong": true, "symptom": false, "notes": "Full detailed table still needs second-pass extraction.", "sourceFile": "ccr-24-3301.pdf", "sourceTitle": "Updated Recommendations for Pediatric Surveillance in Hereditary Endocrine Neoplasia Syndromes: Multiple Endocrine Neoplasias, Hyperparathyroidism–Jaw Tumor Syndrome, and Carney Complex", "extractionType": "prior_build_summary", "confidence": "low", "priority": 6}, {"id": "R0070", "syndrome": "MEN2B", "gene": "RET", "target": "Medullary thyroid carcinoma / endocrine neoplasia surveillance", "method": "RET-specific endocrine surveillance", "category": "Endocrine", "startText": "Infancy", "minAge": 0, "stopText": "", "maxAge": null, "frequency": "Protocolized", "intervalMin": null, "intervalMax": null, "sex": "All", "lifelong": true, "symptom": false, "notes": "Full detailed table still needs second-pass extraction.", "sourceFile": "ccr-24-3301.pdf", "sourceTitle": "Updated Recommendations for Pediatric Surveillance in Hereditary Endocrine Neoplasia Syndromes: Multiple Endocrine Neoplasias, Hyperparathyroidism–Jaw Tumor Syndrome, and Carney Complex", "extractionType": "prior_build_summary", "confidence": "low", "priority": 6}, {"id": "R0071", "syndrome": "MEN1", "gene": "MEN1", "target": "Pituitary adenoma surveillance", "method": "Pituitary MRI", "category": "MRI", "startText": "15 years", "minAge": 15, "stopText": "", "maxAge": null, "frequency": "Protocolized", "intervalMin": null, "intervalMax": null, "sex": "All", "lifelong": true, "symptom": false, "notes": "2023 update moved pituitary MRI start age from 5 to 15 years.", "sourceFile": "ccr-24-3301.pdf", "sourceTitle": "Updated Recommendations for Pediatric Surveillance in Hereditary Endocrine Neoplasia Syndromes: Multiple Endocrine Neoplasias, Hyperparathyroidism–Jaw Tumor Syndrome, and Carney Complex", "extractionType": "prior_build_summary", "confidence": "high", "priority": 6}, {"id": "R0072", "syndrome": "HPT-JT syndrome", "gene": "CDC73", "target": "Hyperparathyroidism / jaw tumor surveillance", "method": "Biochemical and imaging surveillance", "category": "Endocrine", "startText": "Childhood", "minAge": 5, "stopText": "", "maxAge": null, "frequency": "Protocolized", "intervalMin": null, "intervalMax": null, "sex": "All", "lifelong": true, "symptom": false, "notes": "Detailed table present in source but not fully normalized yet.", "sourceFile": "ccr-24-3301.pdf", "sourceTitle": "Updated Recommendations for Pediatric Surveillance in Hereditary Endocrine Neoplasia Syndromes: Multiple Endocrine Neoplasias, Hyperparathyroidism–Jaw Tumor Syndrome, and Carney Complex", "extractionType": "prior_build_summary", "confidence": "low", "priority": 6}, {"id": "R0073", "syndrome": "Carney complex", "gene": "PRKAR1A", "target": "Endocrine and other neoplasia surveillance", "method": "Clinical, endocrine, and imaging surveillance", "category": "Endocrine", "startText": "Childhood", "minAge": 5, "stopText": "", "maxAge": null, "frequency": "Protocolized", "intervalMin": null, "intervalMax": null, "sex": "All", "lifelong": true, "symptom": false, "notes": "Detailed table present in source but not fully normalized yet.", "sourceFile": "ccr-24-3301.pdf", "sourceTitle": "Updated Recommendations for Pediatric Surveillance in Hereditary Endocrine Neoplasia Syndromes: Multiple Endocrine Neoplasias, Hyperparathyroidism–Jaw Tumor Syndrome, and Carney Complex", "extractionType": "prior_build_summary", "confidence": "low", "priority": 6}, {"id": "R0074", "syndrome": "MEN1", "gene": "MEN1", "target": "Pancreatic neuroendocrine tumors / endocrine tumors", "method": "MEN1 biochemical and imaging surveillance", "category": "Endocrine", "startText": "Childhood/adolescence", "minAge": 10, "stopText": "", "maxAge": null, "frequency": "Protocolized", "intervalMin": null, "intervalMax": null, "sex": "All", "lifelong": true, "symptom": false, "notes": "PTH removed from pediatric surveillance set in 2023 update.", "sourceFile": "Pasted text.txt", "sourceTitle": "Claude progress transcript", "extractionType": "prior_build_summary", "confidence": "medium", "priority": 6}, {"id": "R0075", "syndrome": "Hereditary retinoblastoma", "gene": "RB1", "target": "Subsequent malignant neoplasms", "method": "Education and symptom-directed evaluation; avoid radiation when possible", "category": "Clinical exam", "startText": "Childhood", "minAge": 0, "stopText": "", "maxAge": null, "frequency": "Lifelong vigilance", "intervalMin": null, "intervalMax": null, "sex": "All", "lifelong": true, "symptom": false, "notes": "Panel lacked consensus on routine WBMRI for SMN surveillance.", "sourceFile": "Pasted text.txt", "sourceTitle": "Claude progress transcript", "extractionType": "prior_build_summary", "confidence": "high", "priority": 6}, {"id": "R0077", "syndrome": "NF2-related schwannomatosis", "gene": "NF2", "target": "Hearing / vestibular schwannoma effects", "method": "Audiology evaluation", "category": "Audiology", "startText": "Childhood", "minAge": 8, "stopText": "", "maxAge": null, "frequency": "Annual", "intervalMin": 12, "intervalMax": 12, "sex": "All", "lifelong": true, "symptom": false, "notes": "Starter supportive row for usability in the app.", "sourceFile": "ccr-24-2171.pdf", "sourceTitle": "Update on Cancer and Central Nervous System Tumor Surveillance in Pediatric NF2-, SMARCB1-, and LZTR1-Related Schwannomatosis", "extractionType": "direct_table_snippet", "confidence": "medium", "priority": 7}, {"id": "R0078", "syndrome": "Von Hippel–Lindau disease", "gene": "VHL", "target": "Retinal hemangioblastoma", "method": "Prompt ophthalmology review if visual symptoms", "category": "Ophthalmology", "startText": "Any age", "minAge": 0, "stopText": "", "maxAge": null, "frequency": "Symptom-triggered", "intervalMin": null, "intervalMax": null, "sex": "All", "lifelong": true, "symptom": true, "notes": "Useful symptom-triggered supportive row.", "sourceFile": "ccr-24-3525.pdf", "sourceTitle": "Update on Surveillance in Von Hippel–Lindau Disease", "extractionType": "direct_table_snippet", "confidence": "medium", "priority": 4}, {"id": "R0079", "syndrome": "Li–Fraumeni syndrome", "gene": "TP53", "target": "Breast cancer surveillance transition to adulthood", "method": "Breast MRI", "category": "MRI", "startText": "20 years", "minAge": 20, "stopText": "", "maxAge": null, "frequency": "Annual", "intervalMin": 12, "intervalMax": 12, "sex": "Female", "lifelong": true, "symptom": false, "notes": "Adult transition guidance noted in prior build summary.", "sourceFile": "Pasted text.txt", "sourceTitle": "Claude progress transcript", "extractionType": "prior_build_summary", "confidence": "high", "priority": 4}, {"id": "R0080", "syndrome": "MEN1", "gene": "MEN1", "target": "Hyperparathyroidism", "method": "PTH removed from pediatric surveillance set", "category": "Other", "startText": "", "minAge": null, "stopText": "", "maxAge": null, "frequency": "Removed", "intervalMin": null, "intervalMax": null, "sex": "All", "lifelong": true, "symptom": false, "notes": "From prior extraction summary.", "sourceFile": "Pasted text.txt", "sourceTitle": "Claude progress transcript", "extractionType": "prior_build_summary", "confidence": "medium", "priority": 31}];

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function normalize(text) {
  return (text || "").toLowerCase().trim();
}

function matchesSex(ruleSex, selectedSex) {
  if (!ruleSex || ruleSex === "All" || selectedSex === "All") return true;
  return ruleSex === selectedSex;
}

function hasAgeValue(age) {
  return age !== "" && age !== null && age !== undefined && !Number.isNaN(Number(age));
}

function isActiveForAge(rule, age) {
  if (rule.symptom || !hasAgeValue(age)) return false;
  const numericAge = Number(age);
  const minOk = rule.minAge === null || numericAge >= rule.minAge;
  const maxOk = rule.maxAge === null || numericAge <= rule.maxAge;
  return minOk && maxOk;
}

function sourceBadge(confidence) {
  if (confidence === "high") return "bg-emerald-100 text-emerald-800 border-emerald-200";
  if (confidence === "medium") return "bg-slate-100 text-slate-700 border-slate-200";
  return "bg-slate-100 text-slate-700 border-slate-200";
}

function sourceLabel(confidence) {
  if (confidence === "high") return "Direct from guidelines";
  return "Check guideline recommendation";
}

function uniqueSyndromes(rules) {
  return Array.from(new Set(rules.map((r) => r.syndrome))).sort((a, b) => a.localeCompare(b));
}

function tokenize(text) {
  return normalize(text)
    .replace(/[^a-z0-9]+/g, " ")
    .split(" ")
    .filter(Boolean);
}

function syndromeAliases(rule) {
  const aliases = new Set([
    rule.syndrome,
    rule.gene,
    ...(rule.syndrome || "").split(/[\/,()]+/),
    ...(rule.gene || "").split(/[\/,()]+/),
  ]);

  if (rule.syndrome === "Li–Fraumeni syndrome") {
    aliases.add("li fraumeni");
    aliases.add("lfs");
    aliases.add("p53");
    aliases.add("tp53");
  }
  if (rule.syndrome === "Von Hippel–Lindau disease") {
    aliases.add("von hippel lindau");
    aliases.add("vhl syndrome");
  }
  if (rule.syndrome === "DICER1 tumor predisposition") {
    aliases.add("dicer1 syndrome");
  }
  if (rule.syndrome === "Beckwith–Wiedemann syndrome / spectrum") {
    aliases.add("beckwith wiedemann");
    aliases.add("bwsp");
    aliases.add("bws");
  }
  if (rule.syndrome === "Hereditary retinoblastoma") {
    aliases.add("retinoblastoma");
    aliases.add("rb1");
  }
  if (rule.syndrome === "Neurofibromatosis type 1") {
    aliases.add("nf1");
  }
  if (rule.syndrome === "Tuberous sclerosis complex") {
    aliases.add("tsc");
    aliases.add("tsc1");
    aliases.add("tsc2");
  }
  if (rule.syndrome === "PTEN hamartoma tumor syndrome") {
    aliases.add("phts");
    aliases.add("pten syndrome");
  }

  return Array.from(aliases)
    .flatMap((item) => tokenize(item))
    .concat(Array.from(aliases).map((item) => normalize(item)));
}

function buildSyndromeLookup(rules) {
  const map = new Map();
  rules.forEach((rule) => {
    const existing = map.get(rule.syndrome) || { syndrome: rule.syndrome, keywords: new Set() };
    syndromeAliases(rule).forEach((alias) => existing.keywords.add(alias));
    map.set(rule.syndrome, existing);
  });
  return Array.from(map.values()).map((entry) => ({
    syndrome: entry.syndrome,
    keywords: Array.from(entry.keywords),
  }));
}

function smartMatchSyndrome(query, syndromeLookup) {
  const q = normalize(query);
  if (!q || q.length < 2) return null;

  let best = null;
  let bestScore = 0;

  syndromeLookup.forEach((entry) => {
    let score = 0;
    entry.keywords.forEach((keyword) => {
      if (keyword === q) score = Math.max(score, 100);
      else if (keyword.startsWith(q)) score = Math.max(score, 70);
      else if (keyword.includes(q)) score = Math.max(score, 50);
    });
    if (normalize(entry.syndrome).includes(q)) score = Math.max(score, 80);
    if (score > bestScore) {
      best = entry.syndrome;
      bestScore = score;
    }
  });

  return bestScore >= 70 ? best : null;
}

export default function PediatricSurveillanceLookupApp() {
  const [query, setQuery] = useState("");
  const [selectedSyndrome, setSelectedSyndrome] = useState("All syndromes");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("All");
  const [showOnlyActive, setShowOnlyActive] = useState(true);

  const syndromeOptions = useMemo(() => uniqueSyndromes(RULES), []);
  const syndromeLookup = useMemo(() => buildSyndromeLookup(RULES), []);
  const hasAge = hasAgeValue(age);
  const numericAge = hasAge ? Number(age) : null;
  const smartSyndrome = useMemo(() => smartMatchSyndrome(query, syndromeLookup), [query, syndromeLookup]);

  useEffect(() => {
    if (smartSyndrome && selectedSyndrome !== smartSyndrome) {
      setSelectedSyndrome(smartSyndrome);
    }
    if (!query.trim() && selectedSyndrome !== "All syndromes") {
      setSelectedSyndrome("All syndromes");
    }
  }, [smartSyndrome, query, selectedSyndrome]);

  const filtered = useMemo(() => {
    const q = normalize(query);
    return RULES.filter((rule) => {
      const syndromeOk =
        selectedSyndrome === "All syndromes" || rule.syndrome === selectedSyndrome;
      const textOk =
        !q ||
        [rule.syndrome, rule.gene, rule.target, rule.method, rule.notes, rule.sourceTitle]
          .join(" ")
          .toLowerCase()
          .includes(q);
      const sexOk = matchesSex(rule.sex, sex);
      const activeOk = !showOnlyActive || !hasAge || isActiveForAge(rule, numericAge);
      return syndromeOk && textOk && sexOk && activeOk;
    }).sort((a, b) => (a.priority ?? 999) - (b.priority ?? 999));
  }, [query, selectedSyndrome, sex, showOnlyActive, numericAge]);

  const activeNow = hasAge ? filtered.filter((r) => isActiveForAge(r, numericAge)) : filtered.filter((r) => !r.symptom);
  const later = hasAge ? filtered.filter((r) => !isActiveForAge(r, numericAge) && !r.symptom) : [];
  const symptomTriggered = filtered.filter((r) => r.symptom);

  const headline = selectedSyndrome === "All syndromes" ? "All syndromes" : selectedSyndrome;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="rounded-2xl shadow-sm border-slate-200 bg-white">
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-slate-900 p-3 text-white">
                  <Stethoscope className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Pediatric Cancer Surveillance Lookup</CardTitle>
                  <CardDescription className="mt-1 text-base">
                    Search a syndrome, enter age and sex, and review surveillance rules that apply now.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <div className="xl:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">Smart syndrome search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                    <Input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Type p53, tp53, Li-Fraumeni, VHL, DICER1..."
                      className="pl-9 rounded-xl"
                    />
                  </div>
                  <div className="mt-2 text-xs text-slate-500">
                    Examples: <span className="font-medium">p53</span> → Li–Fraumeni syndrome, <span className="font-medium">VHL</span> → Von Hippel–Lindau disease.
                  </div>
                  {smartSyndrome && (
                    <div className="mt-2 text-sm text-emerald-700">
                      Matched syndrome: <span className="font-semibold">{smartSyndrome}</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Exact syndrome picker</label>
                  <Select value={selectedSyndrome} onValueChange={setSelectedSyndrome}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All syndromes">All syndromes</SelectItem>
                      {syndromeOptions.map((name) => (
                        <SelectItem key={name} value={name}>{name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-3 grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Age</label>
                    <Input value={age} onChange={(e) => setAge(e.target.value)} type="number" min="0" step="0.1" placeholder="Leave blank for all-age view" className="rounded-xl" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Sex</label>
                    <Select value={sex} onValueChange={setSex}>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Male">Male</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  variant={showOnlyActive ? "default" : "outline"}
                  className="rounded-xl"
                  onClick={() => setShowOnlyActive((v) => !v)}
                >
                  <Filter className="mr-2 h-4 w-4" />
                  {hasAge ? (showOnlyActive ? "Showing active now" : "Show all relevant rules") : "Age blank: showing all-age view"}
                </Button>
                <Badge variant="outline" className="rounded-full px-3 py-1 text-sm">{headline}</Badge>
                <Badge variant="outline" className="rounded-full px-3 py-1 text-sm">{hasAge ? `Age ${numericAge}` : "All-age view"}</Badge>
                <Badge variant="outline" className="rounded-full px-3 py-1 text-sm">{sex}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm border-slate-200 bg-white">
            <CardHeader>
              <CardTitle className="text-lg">Important note</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-700">
              <div className="flex gap-2">
                <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                <p>This is a prototype clinical reference tool built from structured surveillance rows. It is not a substitute for clinical judgment or direct review of the source paper.</p>
              </div>
              <div className="flex gap-2">
                <FileText className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                <p>Rows labeled <strong>Direct from guidelines</strong> are more directly tied to extracted guideline tables. Rows labeled <strong>Check guideline recommendation</strong> should be checked against the source paper before relying on exact details.</p>
              </div>
              <div className="flex gap-2">
                <CalendarClock className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                <p>If an age is entered, the app highlights rules active at that age and sex. If age is left blank, the app shows the all-age view for the selected condition.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <SummaryCard title={hasAge ? "Active now" : "All-age view"} value={activeNow.length} subtitle={hasAge ? "Rules currently in range" : "All non-symptom routine rules"} />
          <SummaryCard title="Later / transition" value={later.length} subtitle={hasAge ? "Rules outside current age band" : "Enter age to see future transitions"} />
          <SummaryCard title="Symptom-triggered" value={symptomTriggered.length} subtitle="Non-routine alerts" />
        </div>

        <Tabs defaultValue="active" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 rounded-2xl bg-white border border-slate-200 overflow-hidden">
            <TabsTrigger value="active" className="rounded-none">Active now</TabsTrigger>
            <TabsTrigger value="later" className="rounded-none">Later / transition</TabsTrigger>
            <TabsTrigger value="all" className="rounded-none">All matching rules</TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            <RuleList title={hasAge ? "What applies now" : "All-age view"} rules={activeNow} age={numericAge} />
          </TabsContent>

          <TabsContent value="later">
            <RuleList title="Future or transition rules" rules={later} age={numericAge} />
          </TabsContent>

          <TabsContent value="all">
            <RuleList title="All matching rules" rules={filtered} age={numericAge} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function SummaryCard({ title, value, subtitle }) {
  return (
    <Card className="rounded-2xl shadow-sm border-slate-200 bg-white">
      <CardContent className="p-5">
        <div className="text-sm text-slate-500">{title}</div>
        <div className="mt-2 text-3xl font-semibold text-slate-900">{value}</div>
        <div className="mt-1 text-sm text-slate-600">{subtitle}</div>
      </CardContent>
    </Card>
  );
}

function RuleList({ title, rules, age }) {
  if (!rules.length) {
    return (
      <Card className="rounded-2xl shadow-sm border-slate-200 bg-white">
        <CardContent className="p-8 text-center text-slate-600">No matching rules found for this selection.</CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl shadow-sm border-slate-200 bg-white">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{rules.length} matching rules at the current filters.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[65vh] pr-4">
          <div className="space-y-4">
            {rules.map((rule) => {
              const active = isActiveForAge(rule, age);
              const sourceSearchUrl = rule.sourceFile === "Pasted text.txt"
                ? null
                : `https://aacrjournals.org/search-results?f_SiteID=5135&page=1&q=${encodeURIComponent(rule.sourceTitle)}`;
              return (
                <div key={rule.id} className={cn("rounded-2xl border p-4", active ? "border-emerald-200 bg-emerald-50/60" : "border-slate-200 bg-white") }>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="text-lg font-semibold text-slate-900">{rule.syndrome}</div>
                      <div className="mt-1 text-sm text-slate-600">{rule.gene ? `${rule.gene} · ` : ""}{rule.target}</div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {active && <Badge className="rounded-full bg-emerald-600">Active now</Badge>}
                      {!age && !rule.symptom && <Badge variant="outline" className="rounded-full">All-age view</Badge>}
                      {rule.symptom && <Badge variant="outline" className="rounded-full">Symptom-triggered</Badge>}
                      {sourceSearchUrl ? (
                        <a href={sourceSearchUrl} target="_blank" rel="noreferrer">
                          <Badge variant="outline" className={cn("rounded-full border cursor-pointer hover:bg-slate-50", sourceBadge(rule.confidence))}>{sourceLabel(rule.confidence)}</Badge>
                        </a>
                      ) : (
                        <Badge variant="outline" className={cn("rounded-full border", sourceBadge(rule.confidence))}>{sourceLabel(rule.confidence)}</Badge>
                      )}
                      <Badge variant="outline" className="rounded-full">{rule.category}</Badge>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-4 md:grid-cols-3">
                    <Info label="Method" value={rule.method} />
                    <Info label="Start" value={rule.startText || (rule.minAge != null ? `${rule.minAge} years` : "—")} />
                    <Info label="Stop" value={rule.stopText || (rule.maxAge != null ? `${rule.maxAge} years` : rule.lifelong ? "Lifelong / ongoing" : "—")} />
                  </div>

                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <Info label="Frequency" value={rule.frequency || "—"} />
                    <Info label="Sex filter" value={rule.sex || "All"} />
                  </div>

                  {rule.notes && (
                    <div className="mt-4 rounded-xl bg-slate-100 p-3 text-sm text-slate-700">
                      <span className="font-medium text-slate-900">Important detail:</span> {rule.notes}
                    </div>
                  )}

                  <div className="mt-4 text-xs text-slate-500">
                    Source: {rule.sourceTitle} ({rule.sourceFile})
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 text-sm text-slate-900">{value || "—"}</div>
    </div>
  );
}
