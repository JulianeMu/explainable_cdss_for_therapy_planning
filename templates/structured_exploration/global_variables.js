/*
/!**
 * Created by MuellerJ on 07.08.2017.
 *!/

//----------------------------window properties--------------------------//


var div_id_chart = "#chart";

var myDuration = 2000/2;
var myDuration_lines = 2000/2;

var min_width_height_donut = 140;
var min_radius = 10;

var node_list = [];


var node_data_types = ['personal_data', 'anomaly', 'examination_data', 'deterministic_decision'];


var radius_space_to_div = 40;

var children_type = 'children';
var current_node_type = 'current_node';
var parent_type = 'parent_type';
var font_size = '1.05em';


var children_parents_of_children_parents__are_calculated = false;
var initial_view = true;

//var color_parent_current_children = [['#ffffff', "#465a65"], ["#ccffff", '#79919d'], ["#ccffff", '#4db7ad']];
var color_parent_current_children =
    {
        parent: [['#ccf0f6', "#00373f"], ['#f2d0d0', "#800000"], ['#98FB98', "#228B22"]],
        current: [["#b2e9f2", '#006e7f'], ['#f2d0d0', "#800000"], ['#98FB98', "#228B22"]],
        children: [["#b2e9f2", '#004954'], ['#f2d0d0', "#800000"], ['#98FB98', "#228B22"]]
    }
;

var color_observed = ['#98FB98', "#196719"];


var animation_duration_is_over = [];//true;
var check_if_all_calculated = [];//false;
var check_if_all_parents_children_calculated = [];
var rotation_mostImportant_all = [];//true;


var virtual_evidences = [];
//------------------------------model-----------------------//

var net_name;
var patient_id;
var net_version;
var username;
var password;

//------------------------------read out json-----------------------//
var network = [];


var just_for_testing_matthaeus = true;*/


/**
 * Created by MuellerJ on 07.08.2017.
 */

//----------------------------window properties--------------------------//



var texture_orientation_smaller = "diagonal" ;
var texture_orientation_bigger = "6/8";//"3/8";

var current_node_id;
var div_id_chart = "#chart";

var myDuration = 2000/2;
var myDuration_lines = 2000/2;


var node_list = [];


var node_data_types = ['personal_data', 'anomaly', 'examination_data', 'deterministic_decision'];






var children_parents_of_children_parents__are_calculated = false;
var initial_view = true;

//var color_parent_current_children = [['#ffffff', "#465a65"], ["#ccffff", '#79919d'], ["#ccffff", '#4db7ad']];
var color_parent_current_children =
    {
        // blueish, reddish, greenish
        parent: [['#ccf0f6', "#00373f"], ['#f2d0d0', "#800000"], ['#98FB98', "#228B22"]],
        current: [["#b2e9f2", '#006e7f'], ['#f2d0d0', "#800000"], ['#98FB98', "#228B22"]],
        children: [["#b2e9f2", '#004954'], ['#f2d0d0', "#800000"], ['#98FB98', "#228B22"]]
    }
;

var color_observed = ['#FFFFCC', "#FFA500"];
//var color_observed = ['#98FB98', "#196719"];


var animation_duration_is_over = [];//true;
var check_if_all_calculated = [];//false;
var check_if_all_parents_children_calculated = [];
var rotation_mostImportant_all = [];//true;


var virtual_evidences = [];
var target_variables = ['UICC_stage__patient'];//['larynx_T_state__patient', 'N_state__patient', 'M_state__patient'];
//var target_variables = ["Therapy"];//['UICC_stage__patient'];//['larynx_T_state__patient', 'N_state__patient', 'M_state__patient'];

var currently_selected_target_variable;

// for ANDES
//var target_variables = ["SNode_5"];
//var currently_selected_target_variable = target_variables[0];
//------------------------------model-----------------------//

var net_name;
var patient_id;
var net_version;
var username;
var password;

//------------------------------read out json-----------------------//
var network = [];


var just_for_testing_matthaeus = true;