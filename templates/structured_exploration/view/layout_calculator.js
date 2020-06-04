/**
 * This method calculates all needed layout parameters for each node
 */
function calculate_layout_of_nodes(node_types, div_id_chart) {


    console.log(node_types)
    for (var index_node_types = 0; index_node_types < node_types.length; index_node_types ++) {


        var current_node_layout = node_types[index_node_types];


        //sort the group nodes by name
        var sortedObjs = current_node_layout.group_nodes.sort(dynamicSort('name'));

        var is_t_state = false;
        var is_m_state = false;
        var is_n_state = false;

        var sorted_tnm = [];
        if (current_node_layout.group_nodes.length === 3) {
            for (var index_sort_tnm = 0; index_sort_tnm < current_node_layout.group_nodes.length; index_sort_tnm++) {
                if (current_node_layout.group_nodes[index_sort_tnm].id === 'larynx_T_state__patient') {
                    is_t_state = true;
                    sorted_tnm[0] = current_node_layout.group_nodes[index_sort_tnm];
                } else if (current_node_layout.group_nodes[index_sort_tnm].id === 'N_state__patient') {
                    is_n_state = true;
                    sorted_tnm[1] = current_node_layout.group_nodes[index_sort_tnm];
                } else if (current_node_layout.group_nodes[index_sort_tnm].id === 'M_state__patient') {
                    is_m_state = true;
                    sorted_tnm[2] = current_node_layout.group_nodes[index_sort_tnm];
                }
            }
        }

        if (is_n_state && is_m_state && is_t_state) {
            sortedObjs = sorted_tnm;
        }

        current_node_layout.group_nodes = sortedObjs;

        //calculate node width
        current_node_layout.node_width = parseFloat(d3.select('#' + div_id_chart).style('width')) / node_types.length;

        //calculate node height
        if (current_node_layout.group_nodes.length > 0) {
            current_node_layout.node_height = parseFloat(d3.select('#' + div_id_chart).style('height')) / current_node_layout.group_nodes.length;
        }
        if (index_node_types != 1 && current_node_layout.group_nodes.length === 1) {
            current_node_layout.node_height = parseFloat(d3.select('#' + div_id_chart).style('height')) / 2;
        }



        // go through all nodes and calculate + set the layout parameters
        for (var index_group_nodes = 0; index_group_nodes < current_node_layout.group_nodes.length; index_group_nodes ++) {
            var current_group_node = current_node_layout.group_nodes[index_group_nodes];

            var pos_x = 0;
            var pos_y = 0;

            // go through width of all calculated_node_objects before
            // add them to current pos_x
            for (var index_pos_x = 0; index_pos_x < index_node_types; index_pos_x ++) {
                pos_x += parseFloat(node_types[index_pos_x].node_width);
            }




            // go through height of all nodes in group_node before
            // add them to current pos_y
            if (index_group_nodes > 0) {
                pos_y += current_node_layout.group_nodes[index_group_nodes-1].layout.pos_y + current_node_layout.group_nodes[index_group_nodes-1].layout.node_height;
            }
            if (index_node_types != 1 && current_node_layout.group_nodes.length === 1) {
                pos_y = parseFloat(d3.select('#' + div_id_chart).style('height')) / 2 - current_node_layout.node_height / 2;
            }

            if (current_node_layout.type !== current_node_layout) {
                //node_height *= current_group_node.importance_of_information;
            }

            var radius = (Math.min(current_node_layout.node_width, current_node_layout.node_height) - radius_space_to_div) /2;

            if (radius < min_radius) {
                radius = min_radius;
            }

            var innerRadius = 0;

            if (Math.min(current_node_layout.node_width, current_node_layout.node_height) >= min_width_height_donut) {
                innerRadius = radius - current_node_layout.donut_inner_radius;
            }

            var color = color_parent_current_children.parent;

            if (current_node_layout.type === current_node_type) {
                color = color_parent_current_children.current;
            } else if (current_node_layout.type === children_type) {
                color = color_parent_current_children.children;
            }



            current_group_node.layout = {
                pos_x: pos_x,
                pos_y: pos_y,
                node_width: current_node_layout.node_width,
                node_height: current_node_layout.node_height,
                radius: radius,
                inner_radius: innerRadius,
                color: color
            };


            //set in current node again
            current_node_layout.group_nodes[index_group_nodes] = current_group_node;
        }

        //set in global variable again
        node_types[index_node_types] = current_node_layout;
    }

    return node_types;
}


function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}