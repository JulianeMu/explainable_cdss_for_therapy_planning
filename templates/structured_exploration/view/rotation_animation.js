var rotate_boolean = [];
var rotation_direction = [];
var duration = myDuration / 4;

function animate_current_chart_element(current_node__or__whole_page, id, dataset, type, div_id_chart) {

    set_animation_duration_is_over_false(div_id_chart);


    var bool_contains = false;
    var index = 0;
    for (var i = 0; i< rotate_boolean.length; i++) {
        if (rotate_boolean[i].div_id === div_id_chart) {
            bool_contains = true;
            index = i;
        }
    }

    if (rotate_boolean.length === 0 || !bool_contains) {
        rotate_boolean.push({
            div_id: div_id_chart,
            bool: true
        });

        rotation_direction.push({
                div_id: div_id_chart,
                bool: true
            }
        );
        index = rotate_boolean.length -1;
    }


    var parent_div = document.getElementById(div_id_chart);

    var div,
        deg = rotate_boolean[index].bool ? 90 : 0; //animation_counter * -90;

    for (var i = 0; i< parent_div.children.length; i++) {
        if (parent_div.children[i].id === id) {
            div = parent_div.children[i];
        }
    }

    // use whole chart in case of whole rotation
    if (!current_node__or__whole_page) {
        div = document.getElementById(div_id_chart);
    }


    div.style.transitionDelay = 0 + "ms ";
    div.style.transitionDuration = duration / 2 + "ms";
    div.style.transitionProperty = "all";
    div.style.transitionTimingFunction = 'linear';

    div.style.webkitTransform = 'rotateY(' + deg + 'deg)';
    div.style.mozTransform = 'rotateY(' + deg + 'deg)';
    div.style.msTransform = 'rotateY(' + deg + 'deg)';
    div.style.oTransform = 'rotateY(' + deg + 'deg)';
    div.style.transform = 'rotateY(' + deg + 'deg)';


    if (rotate_boolean[index].bool) {

        rotate_boolean[index].bool = false;


        if (rotation_direction[index].bool) {
            d3.select('#' + div_id_chart).selectAll('#' + 'line')
                .transition()
                .duration(duration)
                .attr('opacity', 0.1);
        } else {
            d3.select('#' + div_id_chart).selectAll('#' + 'line')
                .transition()
                .duration(duration)
                .attr('opacity', 1);
        }

        //wait till first animation is finished
        setTimeout(function (d) {

            if (current_node__or__whole_page) {
                if (rotation_direction[index].bool) {
                    rotate_forward_currentNode(id, dataset, type, div_id_chart);
                } else {
                    rotate_backwards_currentNode(id, dataset, type, div_id_chart);
                }
            } else {
                if (rotation_direction[index].bool) {
                    d3.select('#' + div_id_chart).select('#home_buttonsvg').attr('opacity', 0);
                    d3.select('#' + div_id_chart).select('#backward_buttonsvg').attr('opacity', 0);
                    d3.select('#' + div_id_chart).select('#foreward_buttonsvg').attr('opacity', 0);
                }
            }

            //run animation again
            rotate_to_90_degree(current_node__or__whole_page, div, id, dataset, type, div_id_chart)
        }, duration / 2);
    } else {
        rotate_boolean[index].bool = true;
        rotation_direction[index].bool = !rotation_direction[index].bool;
        setTimeout(function (d) {
            set_animation_duration_is_over_true(div_id_chart);
        }, duration / 2);
    }
}

function rotate_to_90_degree(current_node__or__whole_page, div, id, dataset, type, div_id_chart) {
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
        animate_current_chart_element(current_node__or__whole_page, id, dataset, type, div_id_chart)
    }, duration / 2);
}


function rotate_forward_currentNode(id, dataset, type, div_id_chart) {
    tooltip.style('display', 'none');

    d3.select('#' + div_id_chart).select('#' + type.type).selectAll("path")
        .attr('opacity', 0.2)
        .on('mouseover', function (d) {

        })
        .on('mouseout', function (d) {

        });

    d3.select('#' + div_id_chart).select('#' + type.type).selectAll('#most_probable_state').attr('opacity', 0);
    d3.select('#' + div_id_chart).select('#' + type.type).selectAll('#node_name').attr('opacity', 0.1);

    create_all_states_view(id, dataset, type, div_id_chart);
}


function rotate_backwards_currentNode(id, dataset, type, div_id_chart) {
    d3.select('#' + div_id_chart).select('#' + type.type).selectAll("path")
        .attr('opacity', 0.9)
        .on('mouseover', function (d) {
            show_tooltip(d.data.name + ": " + (parseFloat(d.data.probability) * 100).toFixed(1) + "%", this, true);
        })
        .on('mouseout', function (d) {
            hide_tooltip(this, true);
        });

    d3.select('#' + div_id_chart).select('#' + type.type).selectAll('#states_all').remove();
    d3.select('#' + div_id_chart).select('#' + type.type).selectAll('#most_probable_state').attr('opacity', 1);
    d3.select('#' + div_id_chart).select('#' + type.type).selectAll('#node_name').attr('opacity', 1);


    if (!rotation_mostImportant_all[get_index_of_div_id_chart_in_variables(div_id_chart, rotation_mostImportant_all)].bool) {
        setTimeout(function (d) {

            //TODO I need to fix this behaviour
            // create a new div because otherwise something strange is happening
            var old_node = type.group_nodes[0];
            d3.select('#' + div_id_chart).select('#' + id).remove();

            create_donut_divs(old_node, div_id_chart, old_node.layout.pos_y, old_node.layout.pos_x, old_node.layout.node_width, old_node.layout.node_height, type);
        }, duration);
    }
}