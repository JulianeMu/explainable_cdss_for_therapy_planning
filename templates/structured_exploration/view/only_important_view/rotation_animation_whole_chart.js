var rotate_boolean_whole = [];//true;
var rotation_direction_whole = []; //true;
var duration_whole = myDuration / 2;

function animate_whole_chart_element(div_id_chart) {

    var index = get_index_rotation_direction(div_id_chart);

    set_animation_duration_is_over_false(div_id_chart);

    var div = document.getElementById(div_id_chart),
        deg = rotate_boolean_whole[index].bool ? 90 : 0; //animation_counter * -90;


    div.style.transitionDelay = 0 + "ms ";
    div.style.transitionDuration = duration_whole / 2 + "ms";
    div.style.transitionProperty = "all";
    div.style.transitionTimingFunction = 'linear';

    div.style.webkitTransform = 'rotateY(' + deg + 'deg)';
    div.style.mozTransform = 'rotateY(' + deg + 'deg)';
    div.style.msTransform = 'rotateY(' + deg + 'deg)';
    div.style.oTransform = 'rotateY(' + deg + 'deg)';
    div.style.transform = 'rotateY(' + deg + 'deg)';


    if (rotate_boolean_whole[index].bool) {

        rotate_boolean_whole[index].bool = false;

        //wait till first animation is finished
        setTimeout(function (d) {

                if (rotation_direction_whole[index].bool) {
                    rotate_forward_wholeChart(div_id_chart);
                } else {
                    rotate_backwards_wholeChart(div_id_chart);
                }

            //run animation again
            rotate_to_90_degree_wholeChart(div)
        }, duration_whole / 2);
    } else {
        rotate_boolean_whole[index].bool = true;
        //rotation_direction_whole[index].bool = !rotation_direction_whole[index].bool;
        setTimeout(function (d) {
            //rotation_direction_whole[index].bool = true;
            set_animation_duration_is_over_true(div_id_chart);
        }, duration_whole / 2);
    }
}

function rotate_to_90_degree_wholeChart(div) {
    var //div = document.getElementById(current_node_type),
        deg = 90;


    div.style.webkitTransform = 'rotateY(' + deg + 'deg)';
    div.style.mozTransform = 'rotateY(' + deg + 'deg)';
    div.style.msTransform = 'rotateY(' + deg + 'deg)';
    div.style.oTransform = 'rotateY(' + deg + 'deg)';
    div.style.transform = 'rotateY(' + deg + 'deg)';

    //wait till first animation is finished
    setTimeout(function (d) {

        //run animation again
        animate_whole_chart_element(div.id)
    }, duration_whole / 2);
}


/**
 * show exploration mode
 */
function rotate_forward_wholeChart(div_id_chart) {

    d3.select('#' + div_id_chart + '_view_element').select('#mode_text_id').text(get_language__label_by_id(language_id_string_exploration_mode));

    rotation_mostImportant_all[get_index_of_div_id_chart_in_variables(div_id_chart, rotation_mostImportant_all)].bool = false;

    d3.select('#' + div_id_chart + '_view_element').selectAll('#all_evidences').remove();

    remove_all_divs_from_chart(div_id_chart);
    set_all_nodes(div_id_chart);

    disable_all_icons_for_views(div_id_chart);
    check_if_enabled(div_id_chart);

    rotation_direction2_perDiv = [];

    rotation_direction_whole[get_index_rotation_direction(div_id_chart)].bool = !rotation_direction_whole[get_index_rotation_direction(div_id_chart)].bool;

}

/**
 * show most important nodes
 */
function rotate_backwards_wholeChart(div_id_chart) {

    d3.select('#' + div_id_chart + '_view_element').select('#mode_text_id').text(get_language__label_by_id(language_id_string_overview_mode));

    rotation_mostImportant_all[get_index_of_div_id_chart_in_variables(div_id_chart, rotation_mostImportant_all)].bool = true;

    remove_all_divs_from_chart(div_id_chart);

    d3.select('#' + div_id_chart).select('#home_buttonsvg').attr('opacity', 0);
    d3.select('#' + div_id_chart).select('#backward_buttonsvg').attr('opacity', 0);
    d3.select('#' + div_id_chart).select('#foreward_buttonsvg').attr('opacity', 0);

    //create_all_evidences(div_id_chart);
    create_objects_for_important(div_id_chart);

    rotation_direction_whole[get_index_rotation_direction(div_id_chart)].bool = !rotation_direction_whole[get_index_rotation_direction(div_id_chart)].bool;

}


function get_index_rotation_direction(div_id_chart) {

    var bool_contains = false;
    var index = 0;
    for (var i = 0; i< rotate_boolean_whole.length; i++) {
        if (rotate_boolean_whole[i].div_id === div_id_chart) {
            bool_contains = true;
            index = i;
        }
    }

    if (rotate_boolean_whole.length === 0 || !bool_contains) {
        rotate_boolean_whole.push({
            div_id: div_id_chart,
            bool: true
        });

        rotation_direction_whole.push({
                div_id: div_id_chart,
                bool: true
            }
        );
        index = rotate_boolean_whole.length -1;
    }

    return index;
}