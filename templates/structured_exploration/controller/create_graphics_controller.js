/**
 * go through each node and create the div elements for each node
 */
function create_graphics_of_node(group_of_nodes, node_type, div_id_chart) {

    myDuration_lines = 0;

    for (var i = 0; i < group_of_nodes.length; i++) {


        //current_node, parent_div, pos_top, pos_left, width, height, node_type)
        create_donut_divs(group_of_nodes[i], div_id_chart, group_of_nodes[i].layout.pos_y, group_of_nodes[i].layout.pos_x, group_of_nodes[i].layout.node_width, group_of_nodes[i].layout.node_height, node_type);

        if (!rotation_mostImportant_all[get_index_of_div_id_chart_in_variables(div_id_chart, rotation_mostImportant_all)].bool ) {
            create_lines(group_of_nodes[i].id, node_type, group_of_nodes[i].layout, "", div_id_chart);
        }
    }
}

/**
 * create the div element for the donut chart for each node
 *
 * @param current_node
 * @param parent_div
 * @param pos_top
 * @param pos_left
 * @param width
 * @param height
 * @param node_type
 */
function create_donut_divs(current_node, parent_div, pos_top, pos_left, width, height, node_type) {

    var id = current_node.id;
    var div_donut = d3.select('#' + parent_div)
        .append('div')
        .attr('class', 'donut_chart_divs')
        .attr('id', id)
        .style('position', 'absolute')
        .style('top', pos_top + 'px')
        .style('left', pos_left + "px")
        .style('width', width + "px")
        .style('height', height + "px");

    //TODO remove [] for states in case of right backend
    create_donut(current_node, current_node.states, node_type, div_donut);
}


/**
 * checks if all nodes are calculated
 * this is needed because of the unequal time the nodes are get from the BN
 *
 */
function set_all_nodes(div_id_chart) {

    var node_types_layout = calculate_layout_of_nodes(calculated_node_objects_per_div[get_index_of_chart_div_id(div_id_chart)].calculated_node_objects, div_id_chart);
    calculated_node_objects_per_div[get_index_of_chart_div_id(div_id_chart)].calculated_node_objects = JSON.parse(JSON.stringify(node_types_layout));

    if (!rotation_mostImportant_all[get_index_of_div_id_chart_in_variables(div_id_chart, rotation_mostImportant_all)].bool) {


        remove_all_divs_from_chart(div_id_chart);
        for (var j = 0; j < node_types_layout.length; j++) {
            create_graphics_of_node(node_types_layout[j].group_nodes, node_types_layout[j], div_id_chart);
        }
    }
}


/**
 * removes all donut elements from chart
 */
function remove_all_divs_from_chart(div_id_chart) {
    d3.select('#' + div_id_chart).selectAll('.donut_chart_divs').remove();
    d3.select('#' + div_id_chart).selectAll('.line_divs').remove();
}

/**
 * get the node type by type (parent, child, current)
 * @param type
 */
function filter_by_node_type(type, nodes) {

    return (nodes.filter(function (o) {
        return o.type === type;
    })[0]);
}

