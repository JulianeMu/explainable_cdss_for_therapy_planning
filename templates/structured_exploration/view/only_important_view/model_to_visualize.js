
var current_node_ids ;// ["M_state__patient", "N_state__patient", "larynx_T_state__patient"];
var child_node_ids  ;// ["UICC_stage__patient"];
var  parent_node_ids ;//["N_count__patient"];
var node_types_important = [];
var node_types_important_per_div = [];

/**
 * This method is just needed for testing reasons
 * This method needs to be updated after implementing the Sensitivity Analysis
 */
function create_objects_for_important(div_id_chart) {
    set_calculation_duration_is_over_false(div_id_chart);


    node_types_important = [{
        type: parent_type,
        node_width: 0,
        node_height: 0,
        color: color_parent_current_children.parent,
        donut_inner_radius: 20,
        min_height_donut: 140,
        min_width_donut: 300,
        pos_x: 0,
        is_calculated: false,
        group_nodes: []
    }, {
        type: current_node_type,
        node_width: 0,
        node_height: 0,
        color: color_parent_current_children.current,
        donut_inner_radius: 40,
        min_height_donut: 140,
        min_width_donut: 300,
        pos_x: 1/3,
        is_calculated: false,
        group_nodes: []
    }, {
        type: children_type,
        node_width: 0,
        node_height: 0,
        color: color_parent_current_children.children,
        donut_inner_radius: 20,
        min_height_donut: 140,
        min_width_donut: 300,
        pos_x: 2/3,
        is_calculated: false,
        group_nodes: []
    }];

    node_types_important_per_div.push({
        div_name: div_id_chart,
        node_types_important: node_types_important
    });

    //get current node object
    getNodeObjects_with_Virtual_evidences(function (response) {
        var current_nodes = response;
        node_types_important[1].group_nodes = current_nodes;

        getNodeObjects_with_Virtual_evidences(function (response) {
            var parent_nodes = response;
            node_types_important[0].group_nodes = parent_nodes;
            getNodeObjects_with_Virtual_evidences(function (response) {
                var child_nodes = response;

                node_types_important[2].group_nodes = child_nodes;

                node_types_important_per_div[get_index_of_chart_div_id(div_id_chart, node_types_important_per_div)].node_types_important = node_types_important;

                create_graphics_for_most_important_view(div_id_chart);

                set_calculation_duration_is_over_true(div_id_chart);

            }, child_node_ids);

        }, parent_node_ids);

    }, current_node_ids);
}

function create_graphics_for_most_important_view(div_id_chart) {

    remove_all_divs_from_chart(div_id_chart);

    node_types_important_per_div[get_index_of_chart_div_id(div_id_chart, node_types_important_per_div)].node_types_important = calculate_layout_of_nodes(node_types_important_per_div[get_index_of_chart_div_id(div_id_chart, node_types_important_per_div)].node_types_important, div_id_chart);

    node_types_important_per_div[get_index_of_chart_div_id(div_id_chart, node_types_important_per_div)].node_types_important[0].group_nodes[0].layout.node_height = 150;
    node_types_important_per_div[get_index_of_chart_div_id(div_id_chart, node_types_important_per_div)].node_types_important[0].group_nodes[0].layout.pos_y = 160 + 250/2 -  150/2;


    for (var i = 0; i< node_types_important_per_div[get_index_of_chart_div_id(div_id_chart, node_types_important_per_div)].node_types_important[1].group_nodes.length; i++) {
        var height;
        var pos_y;
        if (node_types_important_per_div[get_index_of_chart_div_id(div_id_chart, node_types_important_per_div)].node_types_important[1].group_nodes[i].id === 'N_state__patient') {
            height = 250;
            pos_y = 160;
        } else if (node_types_important_per_div[get_index_of_chart_div_id(div_id_chart, node_types_important_per_div)].node_types_important[1].group_nodes[i].id === 'M_state__patient') {
            height = 160;
            pos_y = 0;
        } else {
            height = 250;
            pos_y = 160+250;
        }

        node_types_important_per_div[get_index_of_chart_div_id(div_id_chart, node_types_important_per_div)].node_types_important[1].group_nodes[i].layout.node_height = height;
        node_types_important_per_div[get_index_of_chart_div_id(div_id_chart, node_types_important_per_div)].node_types_important[1].group_nodes[i].layout.pos_y = pos_y;
    }


    // create nodes
    for (var j = 0; j < node_types_important_per_div[get_index_of_chart_div_id(div_id_chart, node_types_important_per_div)].node_types_important.length; j++) {
        create_graphics_of_node(node_types_important_per_div[get_index_of_chart_div_id(div_id_chart, node_types_important_per_div)].node_types_important[j].group_nodes, node_types_important_per_div[get_index_of_chart_div_id(div_id_chart, node_types_important_per_div)].node_types_important[j], div_id_chart);
    }

    myDuration_lines = 0;
    // create lines
    for (var j = 0; j < node_types_important_per_div[get_index_of_chart_div_id(div_id_chart, node_types_important_per_div)].node_types_important.length; j++) {
        for (var k = 0; k< node_types_important_per_div[get_index_of_chart_div_id(div_id_chart, node_types_important_per_div)].node_types_important[j].group_nodes.length; k++) {
            if (node_types_important_per_div[get_index_of_chart_div_id(div_id_chart, node_types_important_per_div)].node_types_important[j].type === parent_type ) {
                //id, nodeType, current_node, middle_node) {

                create_lines(node_types_important_per_div[get_index_of_chart_div_id(div_id_chart, node_types_important_per_div)].node_types_important[j].group_nodes[k].id, node_types_important_per_div[get_index_of_chart_div_id(div_id_chart, node_types_important_per_div)].node_types_important[j], node_types_important_per_div[get_index_of_chart_div_id(div_id_chart, node_types_important_per_div)].node_types_important[j].group_nodes[k].layout, get_node_object_by_id(node_types_important_per_div[get_index_of_chart_div_id(div_id_chart, node_types_important_per_div)].node_types_important, "N_state__patient").layout, div_id_chart);
            } else if (node_types_important_per_div[get_index_of_chart_div_id(div_id_chart, node_types_important_per_div)].node_types_important[j].type === current_node_type) {
                create_lines(node_types_important_per_div[get_index_of_chart_div_id(div_id_chart, node_types_important_per_div)].node_types_important[j].group_nodes[k].id, node_types_important_per_div[get_index_of_chart_div_id(div_id_chart, node_types_important_per_div)].node_types_important[0], node_types_important_per_div[get_index_of_chart_div_id(div_id_chart, node_types_important_per_div)].node_types_important[j].group_nodes[k].layout, get_node_object_by_id(node_types_important_per_div[get_index_of_chart_div_id(div_id_chart, node_types_important_per_div)].node_types_important, "UICC_stage__patient").layout, div_id_chart);
            }
        }
    }
}