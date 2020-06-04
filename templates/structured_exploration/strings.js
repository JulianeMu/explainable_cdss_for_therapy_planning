


var language_german = 'de';
var language_english = 'eng';

var default_language = language_english;


var language_id_string_overview_mode = 'string_overview_mode';
var language_id_string_exploration_mode = 'string_exploration_mode';
var language_id_string_set_evidence_global = 'string_set_evidence_global';
var language_id_string_inspect_global = 'string_inspect_global';
var language_id_string_cancel = 'string_cancel';
var language_id_string_submit = 'string_submit';
var language_id_string_unset_evidence = 'string_unset_evidence';
var language_id_string_unset_all_evidences = 'string_unset_all_evidences';
var language_id_string_show_more = 'string_show_more';

var language_id_string_show_less = 'string_show_less';
var language_id_string_legend = 'string_legend';
var language_id_string_observed = 'string_observed';
var language_id_string_computed = 'string_computed';
var language_id_string_earlier_version = 'string_earlier_version';
var language_id_string_smaller_values = 'string_smaller_values';
var language_id_string_bigger_values = 'string_bigger_values';
var language_id_string_tooltip_backwards = 'string_tooltip_backwards';
var language_id_string_tooltip_forwards = 'string_tooltip_forwards';
var language_id_string_tooltip_search = 'string_tooltip_search';
var language_id_string_tooltip_home = 'string_tooltip_home';
var language_id_string_tooltip_rotate_forward = 'string_tooltip_rotate_forward';
var language_id_string_tooltip_rotate_backwards = 'string_tooltip_rotate_backwards';
var language_id_string_tooltip_close = 'string_tooltip_close';
var language_id_string_patient_information_diagnoses_value = 'string_patient_information_diagnoses_value';
var language_id_string_no_patient_information_given = 'language_id_string_no_patient_information_given';



var language_string = [
    {id: language_id_string_overview_mode, english: 'RELEVANCE OF EVIDENCES', german: 'Relevanz der Patienteninformationen'},
    {id: language_id_string_exploration_mode, english: 'EXPLORATION', german: 'Exploration'},
    {id: language_id_string_set_evidence_global, english: 'SET EVIDENCE', german: 'Abänderung der Patienteninformationen'},
    {id: language_id_string_inspect_global, english: 'NODE INSPECTION', german: 'Inspektion'},
    {id: language_id_string_cancel, english:'CANCEL', german:'Abbrechen'},
    {id: language_id_string_submit, english:'SUBMIT: ', german:'Einreichen: '},
    {id: language_id_string_unset_evidence, english: 'UNSET EVIDENCE', german:'Zurücksetzen'},
    {id: language_id_string_unset_all_evidences, english: 'unset all local evidences', german:'Zurücksetzen aller lokalen Änderungen'},
    {id: language_id_string_show_more, english: 'show more evidences', german:'zeige mehr'},

    {id: language_id_string_show_less, english: 'show less evidences', german:'zeige weniger'},
    {id: language_id_string_legend, english: 'LEGEND', german: 'Legende'},
    {id: language_id_string_observed, english: 'nodes having evidences', german:'Patienteninformationen'},
    {id: language_id_string_computed, english:'computed nodes', german:'berechnete Werte'},
    {id: language_id_string_earlier_version, english:'previous evidence configuration', german:'Initialversion'},
    {id: language_id_string_smaller_values, english:'increased probabilities', german:'größere Wahrscheinlichkeit'},
    {id: language_id_string_bigger_values, english:'decreased probabilities', german:'niedrigere Wahrscheinlichkeit'},
    {id: language_id_string_tooltip_backwards, english: 'navigate one step back', german:'rückwärts'},
    {id: language_id_string_tooltip_forwards, english: 'navigate one step beyond', german:'vorwärts'},
    {id: language_id_string_tooltip_search, english:'search for nodes', german:'Suche'},
    {id: language_id_string_tooltip_home, english:'navigate to origin', german:'Navigiere zum Ausgangspunkt'},
    {id: language_id_string_tooltip_rotate_forward, english: 'show exploration mode', german:'Explorationsmodus'},
    {id: language_id_string_tooltip_rotate_backwards, english:'show influence of evidences', german:'Relevanz der Evidenzen'},
    {id: language_id_string_tooltip_close, english:'close view', german:'Schließen'},
    {id: language_id_string_patient_information_diagnoses_value, english:'malignant laryngeal cancer', german:'bösartiger Kehlkopfkrebs'},

    {id: language_id_string_no_patient_information_given, english: 'No present patient evidences', german: 'Keine Patienteninformationen vorhanden'}
];

var string_open_in_new_window = 'open in new window';

/********************************************** Tooltip ********************************/

var string_tooltip_rotate = get_language__label_by_id(language_id_string_tooltip_rotate_forward);


/********************************************** Patient Information ********************************/

var string_patient_information_headline = 'PATIENT INFORMATION';
var string_patient_information_name = 'NAME';
var string_patient_information_age = 'AGE';
var string_patient_information_id = 'ID';
var string_patient_information_diagnoses = 'DIAGNOSIS';


var string_patient_information_name_value = 'Max Mustermann';
var string_patient_information_age_value = '64';
var string_patient_information_id_value = '123456';


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

        if (default_language === language_english) {
            return result[0].english;
        } else if (default_language === language_german) {
            return result[0].german;
        }
    }
}