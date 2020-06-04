
// global variables for multi language
var language_eng = 'eng';
var language_de = 'de';

var current_language = language_eng;

/**
 * get language label by id
 * @param id
 * @returns string label
 */
function get_language__label_by_id(id) {
    var result = language_string.filter(function (obj) {
        return obj.id === id;
    });

    if (result.length === 0) {
        return id;
    } else {

        if (current_language === language_eng) {
            return result[0].eng;
        } else if (current_language === language_de) {
            return result[0].de;
        }
    }
}

var language_id_heading = 'heading';
var language_id_simulation_version = 'version';
var language_id_label_relevance = 'relevance_label';
var language_id_label_sap_id = 'sap_id';
var language_id_filter_methods = 'filter_methods';
var language_id_outcome_variables = 'outcome_variables';
var language_id_further_information = 'further_information';
var language_id_important_information = 'language_id_important_information';
var language_id_TNM_guidelines = 'language_id_TNM_guidelines';
var language_id_doctorsletter = 'language_id_doctorsletter';
var language_id_therapy = 'language_id_therapy';
var language_id_surgery = 'language_id_surgery';
var language_id_radiation = 'language_id_radiation';
var language_id_chemotherapy = 'language_id_chemotherapy';
var language_id_targetedtherapy = 'language_id_targetedtherapy';
var language_id_byStage = 'language_id_byStage';
var language_id_Recurrent = 'language_id_Recurrent';

var language_id_string_cancel = 'string_cancel';
var language_id_string_submit = 'string_submit';
var language_id_string_unset_evidence = "language_id_string_unset_evidence";
var language_id_string_all_evidences = "language_id_string_all_evidences";

// global variable of all used strings
var language_string = [
    {id: language_id_heading, eng: 'Evidence View', de: 'Relevanz der Informationen'},
    {id: language_id_simulation_version, eng: 'version:', de: 'Version:'},
    {id: language_id_label_relevance, eng: 'relevance', de: 'Relevanz'},
    {id: language_id_label_sap_id, eng: 'Patient-ID:', de: 'Patienten-Id:'},
    {id: language_id_filter_methods, eng: 'Filter Methods', de: 'Filter'},
    {id: language_id_outcome_variables, eng: 'Outcome View', de: 'Zu Untersuchende Informationen'},
    {id: language_id_further_information, eng: 'Document View', de: 'Weitere Informationen'},
    //{id: language_id_TNM_guidelines, eng: 'Guidelines', de: 'TNM-Richtlinien'},
    // menstruation BN
    {id: language_id_TNM_guidelines, eng: 'TNM-Guidelines', de: 'TNM-Richtlinien'},
    {id: language_id_important_information, eng: 'Indications', de: 'Angaben'},
    {id: language_id_doctorsletter, eng: 'Doctor\'s Letters', de: 'Arztbriefe'},
    {id: language_id_therapy, eng: 'Therapy', de: 'Therapie'},
    {id: language_id_surgery, eng: 'Surgery', de: 'Operation'},
    {id: language_id_radiation, eng: 'Radiation', de: 'Bestrahlung'},
    {id: language_id_chemotherapy, eng: 'Chemotherapy', de: 'Chemotherapie'},
    {id: language_id_targetedtherapy, eng: 'targeted Therapy', de: 'gezielte Krebstherapie'},
    {id: language_id_byStage, eng: 'by Stage', de: 'nach Stadium'},
    {id: language_id_Recurrent, eng: 'Recurrent', de: 'Wiederkehrender Tumor'},
    {id: language_id_string_cancel, eng:'CANCEL', de:'Abbrechen'},
    {id: language_id_string_submit, eng:'SUBMIT: ', de:'Einreichen: '},
    {id: language_id_string_unset_evidence, eng: 'UNSET EVIDENCE', de:'Zurücksetzen'},
    {id: language_id_string_all_evidences, eng: 'global', de:'global'}

];