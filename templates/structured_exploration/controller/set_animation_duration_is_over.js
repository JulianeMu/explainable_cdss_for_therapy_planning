function set_animation_duration_is_over_true(div_id_chart) {
    animation_duration_is_over[get_index_of_div_id_chart_in_variables(div_id_chart, animation_duration_is_over)].bool = true;

    check_if_enabled(div_id_chart);
}

function set_animation_duration_is_over_false(div_id_chart) {

    animation_duration_is_over[get_index_of_div_id_chart_in_variables(div_id_chart, animation_duration_is_over)].bool = false;
    disable_all_icons_for_views(div_id_chart);

}


function set_calculation_duration_is_over_true(div_id_chart) {
    check_if_all_calculated[get_index_of_div_id_chart_in_variables(div_id_chart, check_if_all_calculated)].bool = true;
    check_if_enabled(div_id_chart);
}

function set_calculation_parents_children_duration_is_over_true(div_id_chart) {
    check_if_all_parents_children_calculated[get_index_of_div_id_chart_in_variables(div_id_chart, check_if_all_parents_children_calculated)].bool = true;

    check_if_enabled(div_id_chart);
}

function set_calculation_duration_is_over_false(div_id_chart) {
    check_if_all_calculated[get_index_of_div_id_chart_in_variables(div_id_chart, check_if_all_calculated)].bool  = false;
    disable_all_icons_for_views(div_id_chart);

}

function set_calculation_parents_children_duration_is_over_false(div_id_chart) {

    check_if_all_parents_children_calculated[get_index_of_div_id_chart_in_variables(div_id_chart, check_if_all_parents_children_calculated)].bool  = false;
    disable_all_icons_for_views(div_id_chart);

}

function get_index_of_div_id_chart_in_variables(div_id_chart, variable) {
    for (var i = 0; i< variable.length; i++) {
        if (variable[i].div_id === get_chart_div_id(div_id_chart)) {
            return i;
        }
    }
}

function check_if_enabled(div_id_chart) {

    
    if (animation_duration_is_over[get_index_of_div_id_chart_in_variables(div_id_chart, animation_duration_is_over)].bool && check_if_all_calculated[get_index_of_div_id_chart_in_variables(div_id_chart, check_if_all_calculated)].bool && check_if_all_parents_children_calculated[get_index_of_div_id_chart_in_variables(div_id_chart, check_if_all_calculated)].bool) {


        if (!rotation_mostImportant_all[get_index_of_div_id_chart_in_variables(div_id_chart, rotation_mostImportant_all)].bool) {

            d3.select('#' + div_id_chart+ '_view_element').select('#search_buttonsvg').attr('opacity', icons_opacity_enabled);

            if (calculated_node_objects_per_div[get_index_of_chart_div_id(div_id_chart)].selected_nodes_to_go_back_forward.length > 0) {
                if (filter_by_node_type(current_node_type, calculated_node_objects_per_div[get_index_of_chart_div_id(div_id_chart)].calculated_node_objects).group_nodes[0].id !== filter_by_node_type(current_node_type, calculated_node_objects_per_div[get_index_of_chart_div_id(div_id_chart)].selected_nodes_to_go_back_forward[0]).group_nodes[0].id) {
                    d3.select('#' + div_id_chart+ '_view_element').select('#home_buttonsvg').attr('opacity', icons_opacity_enabled);
                }

                if (calculated_node_objects_per_div[get_index_of_chart_div_id(div_id_chart)].index_selected_nodes_to_go_back_forward > 0) {
                    d3.select('#' + div_id_chart+ '_view_element').select('#backward_buttonsvg').attr('opacity', icons_opacity_enabled);
                }

                if (calculated_node_objects_per_div[get_index_of_chart_div_id(div_id_chart)].index_selected_nodes_to_go_back_forward + 1 < calculated_node_objects_per_div[get_index_of_chart_div_id(div_id_chart)].selected_nodes_to_go_back_forward.length) {
                    d3.select('#' + div_id_chart+ '_view_element').select('#foreward_buttonsvg').attr('opacity', icons_opacity_enabled);
                }

/*                // maybe not really important?!
                //TODO
                if (rotation_direction[index].bool) {
                    //set_all_nodes();
                }*/
            }
        }

        d3.select('#' + div_id_chart+ '_view_element').select('#rotation_buttonsvg').attr('opacity', icons_opacity_enabled);
        d3.select('#' + div_id_chart+ '_view_element').select('#close_buttonsvg').attr('opacity', icons_opacity_enabled);
        $("body").css("cursor", "default");

    }
}

function disable_all_icons_for_views(div_id_chart) {

    $("body").css("cursor", "progress");

    d3.select('#' + div_id_chart+ '_view_element').select('#rotation_buttonsvg').attr('opacity', icons_opacity_disabled);
    d3.select('#' + div_id_chart+ '_view_element').select('#close_buttonsvg').attr('opacity', icons_opacity_disabled);

    if (!rotation_mostImportant_all[get_index_of_div_id_chart_in_variables(div_id_chart, rotation_mostImportant_all)].bool) {
        d3.select('#' + div_id_chart+ '_view_element').select('#home_buttonsvg').attr('opacity', icons_opacity_disabled);
        d3.select('#' + div_id_chart+ '_view_element').select('#foreward_buttonsvg').attr('opacity', icons_opacity_disabled);
        d3.select('#' + div_id_chart+ '_view_element').select('#backward_buttonsvg').attr('opacity', icons_opacity_disabled);
        d3.select('#' + div_id_chart+ '_view_element').select('#search_buttonsvg').attr('opacity', icons_opacity_disabled);
    } else {
        d3.select('#' + div_id_chart + '_view_element').select('#home_buttonsvg').attr('opacity', 0);
        d3.select('#' + div_id_chart+ '_view_element').select('#foreward_buttonsvg').attr('opacity', 0);
        d3.select('#' + div_id_chart+ '_view_element').select('#backward_buttonsvg').attr('opacity', 0);
        d3.select('#' + div_id_chart+ '_view_element').select('#search_buttonsvg').attr('opacity', 0);
    }
}

function disable_all_icons(div_id_chart) {

/*    var all_icons = d3.select('#' + div_id_chart+ '_view_element').selectAll('.buttons');
    console.log(all_icons.length)

    for (var i = 0; i < all_icons.length; i++) {
        d3.select('#' + div_id_chart+ '_view_element').select('#' + all_icons[i].id).attr('opacity', 0);
    }*/

    d3.select('#' + div_id_chart + '_view_element').select('#home_buttonsvg').attr('opacity', 0);
    d3.select('#' + div_id_chart+ '_view_element').select('#foreward_buttonsvg').attr('opacity', 0);
    d3.select('#' + div_id_chart+ '_view_element').select('#backward_buttonsvg').attr('opacity', 0);
    d3.select('#' + div_id_chart+ '_view_element').select('#search_buttonsvg').attr('opacity', 0);
    d3.select('#' + div_id_chart+ '_view_element').select('#rotation_buttonsvg').attr('opacity', 0);

}