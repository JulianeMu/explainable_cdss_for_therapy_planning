
// /**
//  * get language label by id
//  * @param id
//  * @returns string label
//  */
// function get_language__TNM_guidelines_by_id(id) {
//     var result = tnm_guidelines_strings.filter(function (obj) {
//         return obj.id === id;
//     });
//
//     if (result.length === 0) {
//         return id;
//     } else {
//
//         if (current_language === language_eng) {
//             return result[0].eng;
//         } else if (current_language === language_de) {
//             return result[0].de;
//         }
//     }
// }

var tnm_id_heading = 'heading';
var tnm_icd_codes = 'tnm_icd_codes';
var tnm_heading_Rules_for_Classification  = 'tnm_heading_Rules_for_Classification';
var tnm_heading_Anatomical_Sites_and_Subsites = 'tnm_heading_Anatomical_Sites_and_Subsites';
var tnm_heading_Regional_Lymph_Nodes = 'tnm_heading_Regional_Lymph_Nodes';
var tnm_heading_TNM_Clinical_Classification = 'tnm_heading_TNM_Clinical_Classification';
var tnm_heading2_T_Clinical_Classification = 'tnm_heading2_T_Clinical_Classification';
var tnm_heading3_Supraglottis = 'tnm_heading3_Supraglottis';
var tnm_heading3_Glottis = 'tnm_heading3_Glottis';
var tnm_heading3_Subglottis = 'tnm_heading3_Subglottis';
var tnm_heading2_N_Clinical_Classification = 'tnm_heading2_N_Clinical_Classification';
var tnm_heading2_M_Clinical_Classification = 'tnm_heading2_M_Clinical_Classification';
var tnm_heading_TNM_Pathological_Classification = 'tnm_heading_TNM_Pathological_Classification';
var tnm_heading2_pN_Regional_Lymph_Nodes = 'tnm_heading2_pN_Regional_Lymph_Nodes';
var tnm_heading_stage = 'tnm_heading_stage';
var tnm_heading_prognostic_factors_grid = 'tnm_heading_prognostic_factors_grid';
// global variable of all used strings
var tnm_guidelines_strings = [
    {id: tnm_id_heading, eng: 'TNM-Guidelines: Larynx', de: 'Larynx', style: style_title},
    {id: tnm_icd_codes, eng: '(ICD-O-3 C32.0-2, C10.1)', de:'(ICD-O-3 C32.0-2, C10.1)', style: style_title_icd},

    {id: tnm_heading_Rules_for_Classification, eng: 'Rules for Classification', de: 'Klassifizierungsgesetze', style: style_heading},
    {id: "", eng: 'The classification applies only to carcinomas. There should be histological confirmation of the disease. The following are the procedures for assessing T, N, and M categories:', de: '', style: style_text_usual},
    {id: "", eng: 'T categories', de:'', style: style_text_usual_indented_TNM_left},
    {id: "", eng: 'Physical examination, laryngoscopy, and imaging', de:'', style: style_text_usual_indented_TNM_right},
    {id: "", eng: 'N categories', de:'', style: style_text_usual_indented_TNM_left},
    {id: "", eng: 'Physical examination and imaging', de:'', style: style_text_usual_indented_TNM_right},
    {id: "", eng: 'M categories', de:'', style: style_text_usual_indented_TNM_left},
    {id: "", eng: 'Physical examination and imaging', de:'', style: style_text_usual_indented_TNM_right},

    {id: tnm_heading_Anatomical_Sites_and_Subsites, eng: 'Anatomical Sites and Subsites', de:'', style: style_heading},
    {id: "", eng: '1. Supraglottis (C32.1)', de:'', style: style_text_usual},
    {id: "", eng: 'a)', de:'', style: style_text_usual_indented_enumeration_left},
    {id: "", eng: 'Suprahyoid epiglottis [including tip, lingual (anterior) (C10.1), and laryngeal surfaces]', de:'', style: style_text_usual_indented_enumeration_right},
    {id: "", eng: 'b)', de:'', style: style_text_usual_indented_enumeration_left},
    {id: "", eng: 'Aryepiglottic fold, laryngeal aspect', de:'', style: style_text_usual_indented_enumeration_right},
    {id: "", eng: 'c)', de:'', style: style_text_usual_indented_enumeration_left},
    {id: "", eng: 'Arytenoid', de:'', style: style_text_usual_indented_enumeration_right},
    {id: "", eng: 'd)', de:'', style: style_text_usual_indented_enumeration_left},
    {id: "", eng: 'Infrahyoid epiglottis', de:'', style: style_text_usual_indented_enumeration_right},
    {id: "", eng: 'e)', de:'', style: style_text_usual_indented_enumeration_left},
    {id: "", eng: 'Ventricular bands (false cords)', de:'', style: style_text_usual_indented_enumeration_right},
    {id: "", eng: '2. Glottis (C32.0)', de:'', style: style_text_usual},
    {id: "", eng: 'a)', de:'', style: style_text_usual_indented_enumeration_left},
    {id: "", eng: 'Vocal cords', de:'', style: style_text_usual_indented_enumeration_right},
    {id: "", eng: 'b)', de:'', style: style_text_usual_indented_enumeration_left},
    {id: "", eng: 'Anterior commissure', de:'', style: style_text_usual_indented_enumeration_right},
    {id: "", eng: 'c)', de:'', style: style_text_usual_indented_enumeration_left},
    {id: "", eng: 'Posterior commissure', de:'', style: style_text_usual_indented_enumeration_right},
    {id: "", eng: '3. Subglottis (C32.2)', de:'', style: style_text_usual},

    {id: tnm_heading_Regional_Lymph_Nodes, eng: 'Regional Lymph Nodes', de:'', style: style_heading},
    {id: "", eng: 'The regional lymph nodes are the cervical nodes. ', de:'', style: style_text_usual},


    {id: tnm_heading_TNM_Clinical_Classification, eng: 'TNM Clinical Classification ', de:'', style: style_heading},

    {id: tnm_heading2_T_Clinical_Classification, eng: 'T-Primary Tumour', de:'', style: style_heading2},
    {id: "", eng: 'TX', de:'', style: style_text_usual_indented_enumeration_left},
    {id: "", eng: 'Primary tumour cannot be assessed', de:'', style: style_text_usual_indented_enumeration_right},
    {id: "", eng: 'T0', de:'', style: style_text_usual_indented_enumeration_left},
    {id: "", eng: 'No evidence of primary tumour', de:'', style: style_text_usual_indented_enumeration_right},
    {id: "", eng: 'Tis', de:'', style: style_text_usual_indented_enumeration_left},
    {id: "", eng: 'Carcinoma in situ', de:'', style: style_text_usual_indented_enumeration_right},

    {id: tnm_heading3_Supraglottis, eng: 'Supraglottis', de:'', style: style_heading3},
    {id: "", eng: 'T1', de:'', style: style_text_usual_indented_enumeration_left},
    {id: "", eng: 'Tumour limited to one subsite of supraglottis with normal vocal cord mobility', de:'', style: style_text_usual_indented_enumeration_right},
    {id: "", eng: 'T2', de:'', style: style_text_usual_indented_enumeration_left},
    {id: "", eng: 'Tumour invades mucosa of more than one adjacent subsite of supraglottis or glottis or region outside the supraglottis (e.g., mucosa of base of tongue, vallecula, medial wall of piriform sinus) without fixation of the larynx', de:'', style: style_text_usual_indented_enumeration_right},
    {id: "", eng: 'T3', de:'', style: style_text_usual_indented_enumeration_left},
    {id: "", eng: 'Tumour limited to larynx with vocal cord fixation and/or invades any of the following: postcricoid area, pre epiglottic space, paraglottic space, and/or inner cortex of thyroid cartilage', de:'', style: style_text_usual_indented_enumeration_right},
    {id: "", eng: 'T4a', de:'', style: style_text_usual_indented_enumeration_left},
    {id: "", eng: 'Tumour invades through the thyroid cartilage and/or invades tissues beyond the larynx, e.g., trachea, soft tissues of neck including deep/extrinsic muscle of tongue (genioglossus, hyoglossus, palatoglossus, and styloglossus), strap muscles, thyroid, or oesophagus', de:'', style: style_text_usual_indented_enumeration_right},
    {id: "", eng: 'T4b', de:'', style: style_text_usual_indented_enumeration_left},
    {id: "", eng: 'Tumour invades prevertebral space, encases carotid artery, or mediastinal structures', de:'', style: style_text_usual_indented_enumeration_right},

    {id: tnm_heading3_Glottis, eng: 'Glottis', de:'', style: style_heading3},
    {id: "", eng: 'T1', de:'', style: style_text_usual_indented_enumeration_left},
    {id: "", eng: 'Tumour limited to vocal cord(s) (may involve anterior or posterior commissure) with normal mobility', de:'', style: style_text_usual_indented_enumeration_right},
    {id: "", eng: 'T1a', de:'', style: style_text_usual_double_indented_enumeration_left},
    {id: "", eng: 'Tumour limited to one vocal cord ', de:'', style: style_text_usual_double_indented_enumeration_right},
    {id: "", eng: 'T1b', de:'', style: style_text_usual_double_indented_enumeration_left},
    {id: "", eng: 'Tumour involves both vocal cords ', de:'', style: style_text_usual_double_indented_enumeration_right},
    {id: "", eng: 'T2', de:'', style: style_text_usual_indented_enumeration_left},
    {id: "", eng: 'Tumour extends to supraglottis and/or subglottis, and/or with impaired vocal cord mobility', de:'', style: style_text_usual_indented_enumeration_right},
    {id: "", eng: 'T3', de:'', style: style_text_usual_indented_enumeration_left},
    {id: "", eng: 'Tumour limited to larynx with vocal cord fixation and/or invades paraglottic space, and/or inner cortex of the thyroid cartilage', de:'', style: style_text_usual_indented_enumeration_right},
    {id: "", eng: 'T4a', de:'', style: style_text_usual_indented_enumeration_left},
    {id: "", eng: 'Tumour invades through the outer cortex of the thyroid cartilage, and/or invades tissues beyond the larynx, e.g., trachea, soft tissues of neck including deep/extrinsic muscle of tongue (genioglossus, hyoglossus, palatoglossus, and styloglossus), strap muscles, thyroid, oesophagus', de:'', style: style_text_usual_indented_enumeration_right},
    {id: "", eng: 'T4b', de:'', style: style_text_usual_indented_enumeration_left},
    {id: "", eng: 'Tumour invades prevertebral space, encases carotid artery, or mediastinal structures', de:'', style: style_text_usual_indented_enumeration_right},

    {id: tnm_heading3_Subglottis, eng: 'Subglottis', de:'', style: style_heading3},
    {id: "", eng: 'T1', de:'', style: style_text_usual_indented_enumeration_left},
    {id: "", eng: 'Tumour limited to subglottis', de:'', style: style_text_usual_indented_enumeration_right},
    {id: "", eng: 'T2', de:'', style: style_text_usual_indented_enumeration_left},
    {id: "", eng: 'Tumour extends to vocal cord(s) with normal or impaired mobility', de:'', style: style_text_usual_indented_enumeration_right},
    {id: "", eng: 'T3', de:'', style: style_text_usual_indented_enumeration_left},
    {id: "", eng: 'Tumour limited to larynx with vocal cord fixation', de:'', style: style_text_usual_indented_enumeration_right},
    {id: "", eng: 'T4a', de:'', style: style_text_usual_indented_enumeration_left},
    {id: "", eng: 'Tumour invades cricoid or thyroid cartilage and/or invades tissues beyond the larynx, e.g., trachea, soft tissues of neck including deep/extrinsic muscle of tongue (genioglossus, hyoglossus, pala toglossus, and styloglossus), strap muscles, thyroid, oesophagus ', de:'', style: style_text_usual_indented_enumeration_right},
    {id: "", eng: 'T4b', de:'', style: style_text_usual_indented_enumeration_left},
    {id: "", eng: 'Tumour invades prevertebral space, encases carotid artery, or mediastinal structures', de:'', style: style_text_usual_indented_enumeration_right},

    {id: tnm_heading2_N_Clinical_Classification, eng: 'N-Regional Lymph Nodes', de:'', style: style_heading2},
    {id: "", eng: 'N1', de:'', style: style_text_usual_indented_enumeration_left},
    {id: "", eng: 'Metastasis in a single ipsilateral lymph node, 3cm or less in greatest dimension without extranodal extension ', de:'', style: style_text_usual_indented_enumeration_right},
    {id: "", eng: 'N2', de:'', style: style_text_usual_indented_enumeration_left},
    {id: "", eng: 'Metastasis described as: ', de:'', style: style_text_usual_indented_enumeration_right},
    {id: "", eng: 'N2a', de:'', style: style_text_usual_double_indented_enumeration_left},
    {id: "", eng: 'Metastasis in a single ipsilateral lymph node, more than 3cm but not more than 6cm in greatest dimension without extranodal extension', de:'', style: style_text_usual_double_indented_enumeration_right},
    {id: "", eng: 'N2b', de:'', style: style_text_usual_double_indented_enumeration_left},
    {id: "", eng: 'Metastasis in multiple ipsilateral lymph nodes, none more than 6cm in greatest dimension, without extranodal extension', de:'', style: style_text_usual_double_indented_enumeration_right},
    {id: "", eng: 'N2c', de:'', style: style_text_usual_double_indented_enumeration_left},
    {id: "", eng: 'Metastasis in bilateral or contralateral lymph nodes, none more than 6cm in greatest dimension, without extranodal extension', de:'', style: style_text_usual_double_indented_enumeration_right},
    {id: "", eng: 'N3a', de:'', style: style_text_usual_indented_enumeration_left},
    {id: "", eng: 'Metastasis in a lymph node more than 6cm in greatest dimension without extranodal extension', de:'', style: style_text_usual_indented_enumeration_right},
    {id: "", eng: 'N3b', de:'', style: style_text_usual_indented_enumeration_left},
    {id: "", eng: 'Metastasis in a single or multiple lymph nodes with clinical extranodal extension (The presence of skin involvement or soft tissue invasion with deep fixation/tethering to underlying muscle or adjacent structures or clinical signs of nerve involvement is classified as clinical extra nodal extension.)', de:'', style: style_text_usual_indented_enumeration_right},

    {id: tnm_heading2_M_Clinical_Classification, eng: 'M-Distant Metastasis', de:'', style: style_heading2},
    {id: "", eng: 'M0', de:'', style: style_text_usual_indented_enumeration_left},
    {id: "", eng: 'No distant metastasis ', de:'', style: style_text_usual_indented_enumeration_right},
    {id: "", eng: 'M1', de:'', style: style_text_usual_indented_enumeration_left},
    {id: "", eng: 'Distant metastasis ', de:'', style: style_text_usual_indented_enumeration_right},

    {id: tnm_heading_TNM_Pathological_Classification, eng: 'TNM Pathological Classification', de:'', style: style_heading},
    {id:'', eng:'The pT categories correspond to the clinical T categories.', de:'', style: style_text_usual},

    {id:tnm_heading2_pN_Regional_Lymph_Nodes, eng:'pN – Regional Lymph Nodes', de:'', style: style_heading2},
    {id:'', eng:'Histological examination of a selective neck dissection specimen will ordinarily include 10 or more lymph nodes. Histological examination of a radical or modified radical neck dissection specimen will ordinarily include 15 or more lymph nodes.', de:'', style: style_text_usual},
    {id: "", eng: 'pNX', de:'', style: style_text_usual_indented_enumeration_left},
    {id: "", eng: 'Regional lymph nodes cannot be assessed', de:'', style: style_text_usual_indented_enumeration_right},
    {id: "", eng: 'pN0', de:'', style: style_text_usual_indented_enumeration_left},
    {id: "", eng: 'No regional lymph node metastasis', de:'', style: style_text_usual_indented_enumeration_right},
    {id: "", eng: 'pN1', de:'', style: style_text_usual_indented_enumeration_left},
    {id: "", eng: 'Metastasis in a single ipsilateral lymph node, 3cm or less in greatest dimension without extranodal extension', de:'', style: style_text_usual_indented_enumeration_right},
    {id: "", eng: 'pN2', de:'', style: style_text_usual_indented_enumeration_left},
    {id: "", eng: 'Metastasis described as:', de:'', style: style_text_usual_indented_enumeration_right},
    {id: "", eng: 'pN2a', de:'', style: style_text_usual_double_indented_enumeration_left},
    {id: "", eng: 'Metastasis in a single ipsilateral lymph node, less than 3cm in greatest dimension with extranodal extension or more than 3cm but not more than 6cm in greatest dimension without extranodal extension', de:'', style: style_text_usual_double_indented_enumeration_right},
    {id: "", eng: 'pN2b', de:'', style: style_text_usual_double_indented_enumeration_left},
    {id: "", eng: 'Metastasis in multiple ipsilateral lymph nodes, none more than 6cm in greatest dimension, without extranodal extension', de:'', style: style_text_usual_double_indented_enumeration_right},
    {id: "", eng: 'pN2c', de:'', style: style_text_usual_double_indented_enumeration_left},
    {id: "", eng: 'Metastasis in bilateral or contralateral lymph nodes, none more than 6cm in greatest dimension, without extranodal extension', de:'', style: style_text_usual_double_indented_enumeration_right},
    {id: "", eng: 'pN3a', de:'', style: style_text_usual_indented_enumeration_left},
    {id: "", eng: 'Metastasis in a lymph node more than 6cm in greatest dimension without extranodal extension', de:'', style: style_text_usual_indented_enumeration_right},
    {id: "", eng: 'pN3b', de:'', style: style_text_usual_indented_enumeration_left},
    {id: "", eng: 'Metastasis in a lymph node more than 3cm in greatest dimension with extranodal extension or multiple ipsilateral, or any contralateral or bilateral node(s) with extranodal extension', de:'', style: style_text_usual_indented_enumeration_right},

    {id:tnm_heading_stage, eng:'Stage', de:'', style: style_heading},
    {id: "", eng: 'Stage 0', de:'', style: style_text_stage_table_1},
    {id: "", eng: 'Tis', de:'', style: style_text_stage_table_2},
    {id: "", eng: 'N0', de:'', style: style_text_stage_table_3},
    {id: "", eng: 'M0', de:'', style: style_text_stage_table_4},

    {id: "", eng: 'Stage I', de:'', style: style_text_stage_table_1},
    {id: "", eng: 'T1', de:'', style: style_text_stage_table_2},
    {id: "", eng: 'N0', de:'', style: style_text_stage_table_3},
    {id: "", eng: 'M0', de:'', style: style_text_stage_table_4},

    {id: "", eng: 'Stage II', de:'', style: style_text_stage_table_1},
    {id: "", eng: 'T2', de:'', style: style_text_stage_table_2},
    {id: "", eng: 'N0', de:'', style: style_text_stage_table_3},
    {id: "", eng: 'M0', de:'', style: style_text_stage_table_4},

    {id: "", eng: 'Stage III', de:'', style: style_text_stage_table_1},
    {id: "", eng: 'T3', de:'', style: style_text_stage_table_2},
    {id: "", eng: 'N0', de:'', style: style_text_stage_table_3},
    {id: "", eng: 'M0', de:'', style: style_text_stage_table_4},

    {id: "", eng: '', de:'', style: style_text_stage_table_1},
    {id: "", eng: 'T1,T2,T3', de:'', style: style_text_stage_table_2},
    {id: "", eng: 'N1', de:'', style: style_text_stage_table_3},
    {id: "", eng: 'M0', de:'', style: style_text_stage_table_4},


    {id: "", eng: 'Stage IVA', de:'', style: style_text_stage_table_1},
    {id: "", eng: 'T4a', de:'', style: style_text_stage_table_2},
    {id: "", eng: 'N0,N1', de:'', style: style_text_stage_table_3},
    {id: "", eng: 'M0', de:'', style: style_text_stage_table_4},

    {id: "", eng: '', de:'', style: style_text_stage_table_1},
    {id: "", eng: 'T1,T2,T3,T4a', de:'', style: style_text_stage_table_2},
    {id: "", eng: 'N2', de:'', style: style_text_stage_table_3},
    {id: "", eng: 'M0', de:'', style: style_text_stage_table_4},

    {id: "", eng: 'Stage IVB', de:'', style: style_text_stage_table_1},
    {id: "", eng: 'T4b', de:'', style: style_text_stage_table_2},
    {id: "", eng: 'Any N', de:'', style: style_text_stage_table_3},
    {id: "", eng: 'M0', de:'', style: style_text_stage_table_4},

    {id: "", eng: '', de:'', style: style_text_stage_table_1},
    {id: "", eng: 'Any T', de:'', style: style_text_stage_table_2},
    {id: "", eng: 'N3', de:'', style: style_text_stage_table_3},
    {id: "", eng: 'M0', de:'', style: style_text_stage_table_4},

    {id: "", eng: 'Stage IVC', de:'', style: style_text_stage_table_1},
    {id: "", eng: 'Any T', de:'', style: style_text_stage_table_2},
    {id: "", eng: 'Any N', de:'', style: style_text_stage_table_3},
    {id: "", eng: 'M1', de:'', style: style_text_stage_table_4},


    {id:tnm_heading_prognostic_factors_grid, eng:'Prognostic Factors Grid', de:'', style: style_heading},
    {id:'', eng:'Prognostic factors for survival for laryngeal and hypopharyngeal carcinoma', de:'', style: style_text_usual},

    {id:'', eng:'Prognostic factors - Essential', de:'', style: style_heading2},
    {id:'', eng:'Tumour related', de:'', style: style_heading3},
    {id:'', eng:'T, N, M categories, Extracapsular extension', de:'', style: style_text_usual},
    {id:'', eng:'Host related', de:'', style: style_heading3},
    {id:'', eng:'Co morbidities, Age > 70 years, Performance status', de:'', style: style_text_usual},
    {id:'', eng:'Environment related', de:'', style: style_heading3},
    {id:'', eng:'Able to provide standard treatment (resources), Treatment quality, Resection margins', de:'', style: style_text_usual},

    {id:'', eng:'Prognostic factors - Additional', de:'', style: style_heading2},
    {id:'', eng:'Tumour related', de:'', style: style_heading3},
    {id:'', eng:'Regions/subsites involved, Low neck nodes, Tumour volume, Vocal cord impairment, Tracheostomy', de:'', style: style_text_usual},
    {id:'', eng:'Host related', de:'', style: style_heading3},
    {id:'', eng:'Gender, Laryngeal function', de:'', style: style_text_usual},
    {id:'', eng:'Environment related', de:'', style: style_heading3},
    {id:'', eng:'Nutrition, Social/environmental (e.g. anatomical station), Overall treatment time', de:'', style: style_text_usual},

    {id:'', eng:'Prognostic factors - New and promising', de:'', style: style_heading2},
    {id:'', eng:'Tumour related', de:'', style: style_heading3},
    {id:'', eng:'Tumour markers: TP53, VEGF, cyclin D1 amplifi cation, EGFR, Bcl 2 Tumour, HPV status, Chemoresistance genes', de:'', style: style_text_usual},
    {id:'', eng:'Host related', de:'', style: style_heading3},
    {id:'', eng:'Baseline, quality of life', de:'', style: style_text_usual},
    {id:'', eng:'Environment related', de:'', style: style_heading3},
    {id:'', eng:'Optical imaging, New sensitizers in photodynamic therapy', de:'', style: style_text_usual},


    {id:'', eng:'Source: UICC Manual of Clinical Oncology, Ninth Edition. Edited by Brian O’Sullivan, James D. Brierley, Anil K. D’Cruz, Martin F. Fey, Raphael Pollock, Jan B. Vermorken and Shao Hui Huang. © 2015 UICC. Published 2015 by John Wiley & Sons, Ltd.', de:'', style: style_text_usual_small}
    ];