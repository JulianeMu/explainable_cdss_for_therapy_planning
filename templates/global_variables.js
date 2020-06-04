var language_german = 'de';
var language_english = 'eng';

var default_language = language_english;

var list_of_all_evidences_ids = [];
var global_list_of_all_evidences_nodes = [];
var global_all_outcome_nodes = [];
var global_selected_outcome_node;

/****************************************** view *******************************************************/
var x;
var y;
var transition_duration = 500;
var x_padding = 0;

var selected_outcome_node_and_evidences;

var slider_div_id = 'relevance_percentage';

var plot_id = 'svg_plot';
var circle_ending_main = '_circle_main';
var circle_ending_others = '_circle_others';

var line_ending = '_line';
var text_ending_node = '_text_node';
var text_ending_state = '_text_state';
var tooltip_pie_ending = '_tooltip_pie';
var outcome_node_div_ending = '_outcome_node_div';

var side_nav_id = 'mySidenav';

var scatter_plot_id = 'scatter_plot';

var text_space = 4;

var xAxis;
var yAxis;

var max_font_size = 12;
var min_font_size = 8;

var multiplicator_to_enlarge = 30;

var color_parent_current_children =
    {
        // blueish, reddish, greenish
        parent: [['#ccf0f6', "#00373f"], ['#f2d0d0', "#800000"], ['#98FB98', "#228B22"]],
        current: [["#b2e9f2", '#006e7f'], ['#f2d0d0', "#800000"], ['#98FB98', "#228B22"]],
        children: [["#b2e9f2", '#004954'], ['#f2d0d0', "#800000"], ['#98FB98', "#228B22"]]
    }
;

var color_observed = ['#FFFFCC', "#FFA500"];


var min_relevance_to_show = 0.01;
var colors_pies =
    // blueish, reddish, yellowish
    [["#b2e9f2", '#006e7f'], ['#f2d0d0', "#800000"], ['#98FB98', "#228B22"]]
;

var colorScale_background = d3.interpolateBlues; //d3.entries(colorbrewer)[5].value[4];//d3.scaleOrdinal(d3.PuBu);
var colorScale_foreground = d3.interpolateBuPu;
var colorScale_highlighting = d3.interpolateReds;
//var colorScale_rainbow = d3.interpolateRainbow;//;interpolateBlues

const color_not_relevant = '#BFBCD2';
const color_relevant = '#7E78A5';
const color_highly_relevant = '#302C49';


var colorScale_rainbow = d3.scaleLinear().domain([0,0.25,0.2501, 0.75, 0.7501, 1])
    //.interpolate(d3.interpolateHcl)
    .range([color_not_relevant,color_not_relevant,color_relevant, color_relevant, color_highly_relevant, color_highly_relevant]);//d3.rgb('#9933ff'), d3.rgb('#cc0099'), d3.rgb('#cc0000'), d3.rgb('#8b0000')]);


// HNO
//var all_outcome_node_ids_real = ["UICC_stage__patient", "larynx_T_state__patient", "N_state__patient", "M_state__patient"];
//var all_outcome_node_ids_initial = ["UICC_stage__patient", "larynx_T_state__patient", "N_state__patient", "M_state__patient"];

//endom cancer
var all_outcome_node_ids_real = ["Therapy", "Histology"];
var all_outcome_node_ids_initial = ["Therapy", "Histology"];

// menstrual phase
//var all_outcome_node_ids_real = ["Phase"];
//var all_outcome_node_ids_initial = ["Phase"];



var currently_selected_outcome_node_id;

var tooltip_div;
var y_axis_plus = 0.0;

var slider_min_relevance = 0;
var slider_max_relevance = 100;

var relevance_slider_div;

var min_radius_main_circle = 2;
var max_radius_main_circle = 20;



var style_id_title = 'text_title';
var style_id_title_icd = 'text_title_icd';
var style_id_heading = 'text_heading';
var style_id_heading2 = 'text_heading2';
var style_id_heading3 = 'text_heading3';
var style_id_usual = 'text_usual';
var style_id_text_usual_indented_TNM_left = 'style_id_text_usual_indented_TNM_left';
var style_id_text_usual_indented_TNM_right = 'style_id_text_usual_indented_TNM_right';
var style_id_text_usual_indented_enumeration_left = 'style_id_text_usual_indented_enumeration_left';
var style_id_text_usual_indented_enumeration_right = 'style_id_text_usual_indented_enumeration_right';
var style_id_text_usual_double_indented_left = 'style_id_text_usual_double_indented_left';
var style_id_text_usual_double_indented_right = 'style_id_text_usual_double_indented_right';
var style_id_text_stage_table_1 = 'style_id_text_stage_table_1';
var style_id_text_stage_table_2 = 'style_id_text_stage_table_2';
var style_id_text_stage_table_3 = 'style_id_text_stage_table_3';
var style_id_text_stage_table_4 = 'style_id_text_stage_table_4';
var style_id_usual_small = 'style_id_usual_small';

var dropdown_element_id = 'myDropdown2';
var navbar_id = 'navbar';
var guidelines_element_id = 'guidelines';
var button_dropdown_id = 'button_dropdown';

var font_size_title = 30;
var font_size_heading = 20;
var font_size_usual = 16;

var padding_before = 10;

var virtual_evidences = [];

var virtual_evidence_highlighting_color = "#ffedcc";
var evidence_highlighting_color = "#98AFC7";
var style_title = {
    id: style_id_title,
    attributes: [
        {attribute: 'font-size', value: font_size_title + 'px'},
        {attribute: 'font-weight', value: 'bolder'},
        {attribute: 'y', value: font_size_title + 'px'},
        {attribute: 'x', value: 0 + 'px'}
    ],
    padding_before: 0
};

var style_title_icd = {
    id: style_id_title_icd,
    attributes: [
        {attribute: 'font-size', value: font_size_heading + 'px'},
        {attribute: 'font-weight', value: 'bolder'},
        {attribute: 'y', value: font_size_heading + 'px'},
        {attribute: 'fill', value: 'darkgrey'},
        {attribute: 'x', value: 0 + 'px'}
    ],
    padding_before: 0
};

var style_heading = {
    id: style_id_heading,
    attributes: [
        {attribute: 'font-size', value: font_size_heading + 'px'},
        {attribute: 'y', value: font_size_heading + 'px'},
        {attribute: 'font-weight', value: 'bold'},
        {attribute: 'x', value: 0 + 'px'}
    ],
    padding_before: padding_before * 2
};

var style_heading2 = {
    id: style_id_heading2,
    attributes: [
        {attribute: 'font-size', value: font_size_heading + 'px'},
        {attribute: 'y', value: font_size_heading + 'px'},
        {attribute: 'font-weight', value: 'bold'},
        {attribute: 'x', value: 0 + 'px'},
        {attribute: 'fill', value: 'darkgrey'}

    ],
    padding_before: padding_before * 2
};

var style_heading3 = {
    id: style_id_heading3,
    attributes: [
        {attribute: 'font-size', value: font_size_heading + 'px'},
        {attribute: 'y', value: font_size_heading + 'px'},
        {attribute: 'font-weight', value: 'light'},
        {attribute: 'fill', value: 'darkgrey'},
        {attribute: 'x', value: 0 + 'px'},
        {attribute: 'font-style', value: 'italic'}
    ],
    padding_before: padding_before * 2
};

var style_text_usual = {
    id: style_id_usual,
    attributes: [
        {attribute: 'font-size', value: font_size_usual + 'px'},
        {attribute: 'y', value: font_size_usual + 'px'},
        {attribute: 'x', value: 0 + 'px'}
    ],
    padding_before: padding_before
};

var style_text_usual_indented_TNM_left = {
    id: style_id_text_usual_indented_TNM_left,
    attributes: [
        {attribute: 'font-size', value: font_size_usual + 'px'},
        {attribute: 'x', value: '30px'},
        {attribute: 'y', value: font_size_usual + 'px'},
        {attribute: 'font-style', value: 'italic'}
    ],
    padding_before: padding_before
};

var style_text_usual_indented_TNM_right = {
    id: style_id_text_usual_indented_TNM_right,
    attributes: [
        {attribute: 'font-size', value: font_size_usual + 'px'},
        {attribute: 'y', value: font_size_usual + 'px'},
        {attribute: 'x', value: '150px'}],
    padding_before: -font_size_usual
};

var style_text_usual_indented_enumeration_left = {
    id: style_id_text_usual_indented_enumeration_left,
    attributes: [
        {attribute: 'font-size', value: font_size_usual + 'px'},
        {attribute: 'x', value: '30px'},
        {attribute: 'y', value: font_size_usual + 'px'},
        {attribute: 'font-style', value: 'italic'}
    ],
    padding_before: padding_before
};

var style_text_usual_indented_enumeration_right = {
    id: style_id_text_usual_indented_enumeration_right,
    attributes: [
        {attribute: 'font-size', value: font_size_usual + 'px'},
        {attribute: 'y', value: font_size_usual + 'px'},
        {attribute: 'x', value: '80px'}],
    padding_before: -font_size_usual
};

var style_text_usual_double_indented_enumeration_left = {
    id: style_id_text_usual_double_indented_left,
    attributes: [
        {attribute: 'font-size', value: font_size_usual + 'px'},
        {attribute: 'y', value: font_size_usual + 'px'},
        {attribute: 'x', value: '80px'},
        {attribute: 'font-style', value: 'italic'}],
    padding_before: padding_before
};

var style_text_usual_double_indented_enumeration_right = {
    id: style_id_text_usual_double_indented_right,
    attributes: [
        {attribute: 'font-size', value: font_size_usual + 'px'},
        {attribute: 'y', value: font_size_usual + 'px'},
        {attribute: 'x', value: '130px'}],
    padding_before: -font_size_usual
};

var style_text_stage_table_1 = {
    id: style_id_text_stage_table_1,
    attributes: [
        {attribute: 'font-size', value: font_size_usual + 'px'},
        {attribute: 'y', value: font_size_usual + 'px'},
        {attribute: 'x', value: '30px'},
        {attribute: 'font-style', value: 'italic'}],
    padding_before: padding_before
};

var style_text_stage_table_2 = {
    id: style_id_text_stage_table_2,
    attributes: [
        {attribute: 'font-size', value: font_size_usual + 'px'},
        {attribute: 'y', value: font_size_usual + 'px'},
        {attribute: 'x', value: '130px'}],
    padding_before: -font_size_usual
};

var style_text_stage_table_3 = {
    id: style_id_text_stage_table_3,
    attributes: [
        {attribute: 'font-size', value: font_size_usual + 'px'},
        {attribute: 'y', value: font_size_usual + 'px'},
        {attribute: 'x', value: '250px'}],
    padding_before: -font_size_usual
};

var style_text_stage_table_4 = {
    id: style_id_text_stage_table_4,
    attributes: [
        {attribute: 'font-size', value: font_size_usual + 'px'},
        {attribute: 'y', value: font_size_usual + 'px'},
        {attribute: 'x', value: '320px'}],
    padding_before: -font_size_usual
};

var style_text_usual_small = {
    id: style_id_usual_small,
    attributes: [
        {attribute: 'font-size', value: font_size_usual - 4 + 'px'},
        {attribute: 'y', value: font_size_usual - 4 + 'px'},
        {attribute: 'x', value: 0 + 'px'}
    ],
    padding_before: padding_before + 6
};

var arc;

var bool_after_highlight = false;
