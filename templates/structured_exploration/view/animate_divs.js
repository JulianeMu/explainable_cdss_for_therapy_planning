/**
 *
 * @param div_id_chart
 * @param new_selected_node_id
 * @param nodes_in_case_of_go_home node to go home
 * @param direction -1 in case of go backwards, 1 in case of go foreward
 * @param old_nodes
 * @param new_nodes
 */
function animate_divs_on_click(div_id_chart, new_selected_node_id, nodes_in_case_of_go_home, direction, old_nodes, new_nodes) {

    set_animation_duration_is_over_false(div_id_chart);


    var before_selected_node_id = filter_by_node_type(current_node_type, old_nodes).group_nodes[0].id;


    // check if is also there in new presentation
    // if not do this
    if (checkIfEmptyObject(get_node_object_by_id(old_nodes, new_selected_node_id))) {

        calculated_node_objects_per_div[get_index_of_chart_div_id(div_id_chart)].calculated_node_objects = JSON.parse(JSON.stringify(new_nodes));

        do_not_calculate_again = false;

        nodes_in_case_of_go_home = calculate_layout_of_nodes(nodes_in_case_of_go_home, div_id_chart);
        animate_divs_on_home(nodes_in_case_of_go_home, direction, div_id_chart);

        // if so do this
    } else {


        calculated_node_objects_per_div[get_index_of_chart_div_id(div_id_chart)].calculated_node_objects = JSON.parse(JSON.stringify(new_nodes));


        do_not_calculate_again = false;

        //get child_divs from chart
        var child_divs = d3.select('#' + div_id_chart).selectAll('.donut_chart_divs')._groups[0];

        //get currently selected object from old and new nodes
        var old_position_selected_object = get_node_object_by_id(old_nodes, new_selected_node_id);
        var new_position_selected_object = get_node_object_by_id(new_nodes, new_selected_node_id);

        var old_type_selected = d3.select('#' + div_id_chart).select('#' + new_selected_node_id).select('svg').attr('id');

        var before_selected_node_in_old_layout = get_node_object_by_id(old_nodes, before_selected_node_id);
        var before_selected_node_in_new_layout = get_node_object_by_id(new_nodes, before_selected_node_id);

        var pos_x_direction = new_position_selected_object.layout.pos_x - old_position_selected_object.layout.pos_x + 10;
        var pos_y_direction = before_selected_node_in_new_layout.layout.pos_y - before_selected_node_in_old_layout.layout.pos_y;


        var already_transformed_nodes_ids = [];

        //hide and remove all nodes except the selected one
        for (var i = 0; i < child_divs.length; i++) {

            var new_layout_node_object = get_node_object_by_id(new_nodes, child_divs[i].id);

            let old_type = parent_type;
            if (old_nodes[1].group_nodes.filter(x => x.id === child_divs[i].id).length > 0) {
                old_type = current_node_type;
            } else if (old_nodes[2].group_nodes.filter(x => x.id === child_divs[i].id).length > 0) {
                old_type = children_type;
            }

            // check if exists in new layout
            // if so do this
            if (new_layout_node_object.name !== undefined) {

                var child_div_id = child_divs[i].id;
                already_transformed_nodes_ids.push(child_div_id);


                var old_object = get_node_object_by_id(old_nodes, child_div_id);
                var new_object = get_node_object_by_id(new_nodes, child_div_id);

                // move the selected node to the middle
                animate_divs('#' + child_div_id, new_object, old_object, div_id_chart);

                // just do it once for each line even in case of relabeling
                if (child_div_id !== before_selected_node_id ) {

                    if (new_object.type === "current_node") {
                        animate_lines(div_id_chart, child_div_id, before_selected_node_in_new_layout.layout, new_object.layout, false, before_selected_node_id);
                    } else {
                        d3.select('#' + div_id_chart).select('#' + new_object.id +'_line')
                            .style('opacity', 0)
                            .remove();

                           create_lines(new_object.id, new_object, new_object.layout, new_position_selected_object.layout, div_id_chart, true);
                    }
                }
                animation_on_click(child_div_id, new_nodes, div_id_chart);

                // animate nodes which are not already in view
            } else {

                var old_object_current = get_node_object_by_id(old_nodes, child_divs[i].id);

                var new_pos_y = 0;

                var current_type_selected = d3.select('#' + child_divs[i].id).select('svg').attr('id');

                if (pos_y_direction > 0) {
                    pos_y_direction += -before_selected_node_in_new_layout.layout.node_height + before_selected_node_in_old_layout.layout.node_height
                } else {
                    pos_y_direction += before_selected_node_in_new_layout.layout.node_height - before_selected_node_in_old_layout.layout.node_height
                }

                if ((old_type_selected === parent_type && current_type_selected === children_type) || (old_type_selected === children_type && current_type_selected === parent_type)) {
                    new_pos_y = old_object_current.layout.pos_y + pos_y_direction;
                } else if (old_object_current.layout.pos_y < old_position_selected_object.layout.pos_y) {
                    new_pos_y = old_object_current.layout.pos_y - parseFloat(d3.select('#' + div_id_chart).style('width'));
                } else {
                    new_pos_y = old_object_current.layout.pos_y + parseFloat(d3.select('#' + div_id_chart).style('height'));
                }

                var new_pos_x = old_object_current.layout.pos_x + pos_x_direction;

                // change div height, weight and position
                d3.select('#' + div_id_chart).select('#' + child_divs[i].id)
                    .transition()
                    .duration(myDuration)
                    .style('left', old_object_current.layout.pos_x + pos_x_direction + 'px')
                    .style('top', new_pos_y + 'px')
                    .remove();


                var new_position_layout = {
                    node_height: parseFloat(d3.select('#' + div_id_chart).select('#' + child_divs[i].id).style('height')),
                    node_width: parseFloat(d3.select('#' + div_id_chart).select('#' + child_divs[i].id).style('width')),
                    pos_x: new_pos_x,
                    pos_y: new_pos_y
                };
                animate_lines(div_id_chart, child_divs[i].id, new_position_layout, before_selected_node_in_new_layout.layout, true);


            }
        }

        // create nodes which are not already viewed
        for (var j = 0; j < new_nodes.length; j++) {

            var group_of_nodes = new_nodes[j].group_nodes;
            for (var i = 0; i < group_of_nodes.length; i++) {

                if (already_transformed_nodes_ids.indexOf(group_of_nodes[i].id) === -1) {

                    group_of_nodes[i].type = current_node_type;

                    if (new_nodes[j].type === parent_type) {
                        group_of_nodes[i].type = parent_type;

                    } else if (new_nodes[j].type === children_type) {
                        group_of_nodes[i].type = children_type;
                    }


                    var set_pos_y = 0;
                    if (before_selected_node_in_new_layout.layout.pos_y > group_of_nodes[i].layout.pos_y) {
                        set_pos_y = group_of_nodes[i].layout.pos_y - parseFloat(d3.select('#' + div_id_chart).style('height'));//new_node_layout_as_current.layout.pos_y;
                    } else {
                        set_pos_y = group_of_nodes[i].layout.pos_y + parseFloat(d3.select('#' + div_id_chart).style('height')); //new_node_layout_as_current.layout.pos_y;
                    }
                    //current_node, parent_div, pos_top, pos_left, width, height, node_type)
                    create_donut_divs(group_of_nodes[i], div_id_chart, set_pos_y, group_of_nodes[i].layout.pos_x - pos_x_direction, group_of_nodes[i].layout.node_width, group_of_nodes[i].layout.node_height, new_nodes[j]);

                    var new_nodes_layout_to_animate = [];

                    new_nodes_layout_to_animate.pos_x = group_of_nodes[i].layout.pos_x - pos_x_direction;
                    new_nodes_layout_to_animate.pos_y = set_pos_y;
                    new_nodes_layout_to_animate.node_height = group_of_nodes[i].layout.node_height;
                    new_nodes_layout_to_animate.node_width = group_of_nodes[i].layout.node_width;


                    myDuration_lines = 2000;

                    create_lines(group_of_nodes[i].id, new_nodes[j], new_nodes_layout_to_animate, old_position_selected_object.layout, div_id_chart);
                    animate_lines(div_id_chart, group_of_nodes[i].id, group_of_nodes[i].layout, new_position_selected_object.layout);

                    animate_divs('#' + group_of_nodes[i].id, group_of_nodes[i], "", div_id_chart);
                    animation_on_click(group_of_nodes[i].id, new_nodes, div_id_chart);
                }
            }
        }
    }
}

/**
 *
 * @param child_div_id
 * @param new_nodes
 * @param div_id_chart
 */
function animation_on_click(child_div_id, new_nodes, div_id_chart) {

    var svg = d3.select('#' + div_id_chart).select('#' + child_div_id).select('svg');

    svg.attr('id', get_node_type_object_by_id(new_nodes, child_div_id));

    //svg.selectAll('path').each(function (value) {
        //let old_index = this.id.split(splitter + state_label)[0].slice(-1);

        //this.id =
//        var old_index = this.id.split(path_index_split)[1];
        //return current_node.id + 'node_' + index + splitter + state_label + splitter + current_node.states[index].indexOf(d.data)

        //this.id = get_node_type_object_by_id(new_nodes, child_div_id) + path_index_split + old_index;
    //});

    on_click_method(svg, child_div_id, new_nodes, div_id_chart);

    var text_node_name = d3.select('#' + div_id_chart).select('#' + child_div_id).select('#node_text');
    on_click_method(text_node_name, child_div_id, new_nodes, div_id_chart);
}

function on_click_method(svg, child_div_id, new_nodes, div_id_chart) {
    svg.on('click', function () {

        if (animation_duration_is_over[get_index_of_div_id_chart_in_variables(div_id_chart, animation_duration_is_over)].bool && check_if_all_calculated[get_index_of_div_id_chart_in_variables(div_id_chart, check_if_all_calculated)].bool && check_if_all_parents_children_calculated[get_index_of_div_id_chart_in_variables(div_id_chart, check_if_all_parents_children_calculated)].bool) {
            if (!rotation_mostImportant_all[get_index_of_div_id_chart_in_variables(div_id_chart, rotation_mostImportant_all)].bool) {

                // do this in exploration mode

                // animate to child/parent
                if (child_div_id !== filter_by_node_type(current_node_type, new_nodes).group_nodes[0].id) {

                    push_new_node_types(get_chart_div_id(div_id_chart), calculate_layout_of_nodes(calculated_node_objects_per_div[get_index_of_chart_div_id(div_id_chart)].calculated_node_objects, div_id_chart));

                    // get all information for child/parent to present
                    get_all_information_of_selected_node(function (response) {

                        response = calculate_layout_of_nodes(response, div_id_chart);

                        animate_divs_on_click(div_id_chart, child_div_id, undefined, undefined, new_nodes, response);

                    }, child_div_id, JSON.parse(JSON.stringify(calculated_node_objects_per_div[get_index_of_chart_div_id(div_id_chart)].calculated_node_objects)), get_chart_div_id(div_id_chart));


                    // show states
                } else {

                    //animate_current_chart_element(true, child_div_id, get_node_object_by_id(calculated_node_objects_per_div[get_index_of_chart_div_id(div_id_chart)].calculated_node_objects, child_div_id).states, filter_by_node_type(get_node_type_object_by_id(calculated_node_objects_per_div[get_index_of_chart_div_id(div_id_chart)].calculated_node_objects, child_div_id), calculated_node_objects_per_div[get_index_of_chart_div_id(div_id_chart)].calculated_node_objects), div_id_chart);
                    show_set_evidence_dialog(get_node_object_by_id(calculated_node_objects_per_div[get_index_of_chart_div_id(div_id_chart)].calculated_node_objects, child_div_id), div_id_chart, false);
                }

                // do this in overview mode
            } else {
                show_set_evidence_dialog(get_node_object_by_id(node_types_important_per_div[get_index_of_chart_div_id(div_id_chart, node_types_important_per_div)].node_types_important, child_div_id), div_id_chart, false);

                //animate_current_chart_element2(child_div_id, get_node_object_by_id(node_types_important_per_div[get_index_of_chart_div_id(div_id_chart, node_types_important_per_div)].node_types_important, child_div_id).states, filter_by_node_type(get_node_type_object_by_id(node_types_important_per_div[get_index_of_chart_div_id(div_id_chart, node_types_important_per_div)].node_types_important, child_div_id), node_types_important_per_div[get_index_of_chart_div_id(div_id_chart, node_types_important_per_div)].node_types_important), div_id_chart);
            }
        }
    });

    if (!just_for_testing_matthaeus) {
        svg.on('contextmenu', d3.contextMenu(menu));
    }
}

/**
 * animates the movement from the currently selected node to the middle
 * @param id
 * @param div_width
 * @param div_height
 * @param pos_left
 * @param pos_top
 */
function animate_divs(id, new_object, old_object, div_id_chart) {

    var div_width = new_object.layout.node_width;
    var div_height = new_object.layout.node_height;
    var pos_left = new_object.layout.pos_x;
    var pos_top = new_object.layout.pos_y;
    var innerRadius_new = new_object.layout.inner_radius;
    var radius_new = new_object.layout.radius;
    var new_color = [];
    var dataset = new_object.states; // TODO remove [] in case of right backend
    var min_div_height_width = Math.min(div_width, div_height) - radius_space_to_div;

    if (radius_new <= min_radius) {
        radius_new = min_radius;
        min_div_height_width = min_radius * 2;
    }

    var type = new_object.type;

    if (old_object.type) {
        type = old_object.type;
    }

    // change div height, weight and position
    d3.select('#' + div_id_chart).select(id)
        .transition()
        .duration(myDuration)
        .style('width', div_width + 'px')
        .style('height', div_height + 'px')
        .style('left', pos_left + 'px')
        .style('top', pos_top + 'px')
        .on('end', function (d) {
            set_animation_duration_is_over_true(div_id_chart);

            if (Math.min(div_width, div_height) - radius_space_to_div >= min_width_height_donut && d3.select(id).select('svg').selectAll('#most_probable_state').empty()) {

                var max_value = Math.max.apply(Math, dataset[0].map(function (o) {
                    return o.probability;
                }));

                var result = dataset[0].filter(function (obj) {
                    return parseFloat(obj.probability) === max_value;
                });

                d3.select('#' + div_id_chart).select(id).select('svg').append("text")
                    .attr('id', 'most_probable_state')
                    .attr("text-anchor", "middle")
                    .attr('font-size', '1em')
                    .attr('y', '-0.3em')
                    //.style('fill', 'white')
                    .text(function (d) {
                        // if (id === 'UICC_stage__patient') {
                        //     return 'Chemotherapie';
                        // }

                        return result[0].name
                    })
                    .attr('transform', 'translate(' + (min_div_height_width / 2) +
                        ',' + (min_div_height_width / 2) + ')');

                d3.select('#' + div_id_chart).select(id).select('svg').append("text")
                    .attr('id', 'most_probable_state')
                    .attr("text-anchor", "middle")
                    .attr('font-size', '0.8em')
                    .attr('y', '1em')
                    //.style('fill', 'white')
                    .text((parseFloat(result[0].probability) * 100).toFixed(1) + "%")
                    .attr('transform', 'translate(' + (min_div_height_width / 2) +
                        ',' + (min_div_height_width / 2) + ')');

            } else if (Math.min(div_width, div_height) - radius_space_to_div < min_width_height_donut && !d3.select(id).select('svg').selectAll('#most_probable_state').empty()) {
                d3.select('#' + div_id_chart).select(id).select('svg').selectAll('#most_probable_state').remove();
            }
        });


    var transform_x = div_width / 2 - min_div_height_width / 2;
    var text_anchor = 'middle';
    var transform_x_text = div_width / 2;
    var transform_y_text = div_height / 2 - min_div_height_width / 2;

    var text_width = div_width;

    if (new_object.type === parent_type) {
        transform_x = div_width - min_div_height_width - node_padding;
        text_anchor = 'end';
        transform_x_text = div_width - node_padding;

        if (radius_new <= min_radius) {
            transform_x_text -= (2 * radius_new + 10);
            transform_y_text = 0;
            //text_width -= 2*radius_new;
        }
    } else if (new_object.type === children_type) {
        transform_x = node_padding;
        text_anchor = 'start';
        transform_x_text = node_padding;

        if (radius_new <= min_radius) {
            transform_x_text += (2 * radius_new + 10);
            transform_y_text = div_height / 2 - 10;
            text_width -= (2 * radius_new);
        }
    }

    var transform_y = div_height / 2 - min_div_height_width / 2;


    // change svg width and height
    d3.select('#' + div_id_chart).select(id).select('#' + type).transition()
        .duration(myDuration)
        .attr('width', min_div_height_width)
        .attr('height', min_div_height_width)
        .attr('transform', 'translate(' + transform_x +
            ',' + transform_y + ')');

    // transform most probable state text
    d3.select('#' + div_id_chart).select(id).selectAll('#most_probable_state').transition()
        .duration(myDuration)
        .attr('transform', 'translate(' + (min_div_height_width / 2) +
            ',' + (min_div_height_width / 2) + ')');

    // transform node name text
    d3.select('#' + div_id_chart).select(id).selectAll('#node_text').transition()
        .duration(myDuration)
        .attr('width', text_width + 'px')
        .attr('transform', 'translate(' + 0 +
            ',' + transform_y_text + ')');


    d3.select('#' + div_id_chart).select(id).select('#node_text').select('#node_name').transition()
        .duration(myDuration)
        .attr('transform', function (d) {
            var x_padding = 0;
            var text_box_width = this.getBBox().width;
            if (text_anchor === 'start') {
                x_padding = transform_x_text;
            } else if (text_anchor === 'middle') {
                x_padding = transform_x_text - text_box_width / 2;
            } else {
                x_padding = transform_x_text - text_box_width;
            }
            return 'translate(' + x_padding + ', ' + 10 + ')';
        });


    var color_after_animation = [];
    var all_similar = [];

    for (var i = 0; i < dataset.length; i++) {

        new_color[i] = new_object.layout.color[i];

        if (i > 0) {
            all_similar[i] = true;
            for (var j = 0; j < dataset[0].length; j++) {
                if (parseFloat(dataset[i][j].probability).toFixed(3) !== parseFloat(dataset[0][j].probability).toFixed(3)) {
                    all_similar[i] = false;
                }
            }

            if (all_similar[i]) {
                new_color[i] = new_object.layout.color[0];
            }
        }

        if (new_object.isObserved[i]) {
            new_color[i] = color_observed;
        }


        // calculates new colors for states
        color_after_animation[dataset.length - 1 - i] = d3.scaleLinear().domain([0, dataset[i].length - 1])
            .interpolate(d3.interpolateHcl)
            .range([d3.color(new_color[i][0]), d3.color(new_color[i][1])]);
    }


    if (old_object && old_object !== "") {

        var allPaths = d3.select('#' + div_id_chart).select(id).selectAll('path');
        var inner_text_shown_old = 1;

        if (d3.select('#' + div_id_chart).select(id).select('#most_probable_state').empty()) {
            inner_text_shown_old = 0;
        }

        var inner_text_shown_new = 1;
        if (Math.min(div_width, div_height) - radius_space_to_div < min_width_height_donut) {
            inner_text_shown_new = 0;
        }

        var outer_inner_radius_old = calculate_layout_of_states(dataset.length, inner_text_shown_old, old_object.layout.radius);
        var outer_inner_radius_new = calculate_layout_of_states(dataset.length, inner_text_shown_new, new_object.layout.radius);


        // change donut charts position, radius and color
        d3.select('#' + div_id_chart).select(id).selectAll('path').transition()
            .duration(myDuration)
            .attr('transform', 'translate(' + (min_div_height_width / 2) +
                ',' + (min_div_height_width / 2) + ')')
            .attr('fill', function (d) {

                if (d.data.name === dataset[d.data.index][d.index].name && d.data.probability === dataset[d.data.index][d.index].probability) {

                    //console.log('sim + ' + all_similar[dataset.length - 1 - i])
                    if (d.data.index > 0 && !all_similar[dataset.length - 1 - d.data.index]) {
                        var higher_similar_less = 'higher';
                        if (parseFloat(dataset[d.data.index][d.index].probability).toFixed(3) < parseFloat(dataset[0][d.index].probability).toFixed(3)) {
                            higher_similar_less = 'less';
                        } else if (parseFloat(dataset[d.data.index][d.index].probability).toFixed(3) === parseFloat(dataset[0][d.index].probability).toFixed(3)) {
                            higher_similar_less = 'similar';
                        }

                        if (higher_similar_less === 'similar') {
                            return color_after_animation[dataset.length - 1 - d.data.index](d.index);
                        } else {

                            var g = d3.select(this.parentNode);
                            var t = textures.lines()
                                .lighter()
                                .orientation(texture_orientation_bigger)
                                .background(color_after_animation[dataset.length - 1 - d.data.index](d.index));

                            if (higher_similar_less === 'less') {
                                t = textures.lines()
                                    .lighter()
                                    .orientation(texture_orientation_smaller)
                                    .background(color_after_animation[dataset.length - 1 - d.data.index](d.index));
                            }

                            g.call(t);
                            return t.url();
                        }
                    } else {

                        return color_after_animation[dataset.length - 1 - d.data.index](d.index);
                    }
                }
            })
            .attrTween("d", arcTween);
    }

    /**
     * This function is used to change the inner and outer radius of the donutchart
     * @param d
     * @returns {Function}
     */
    function arcTween(d, index) {

        var i = d3.interpolate(this._current, d);

        // inner radius and outer radius
        var inner_radius, outer_radius;

        var index_to_use = d.data.index;

        inner_radius = d3.interpolate(outer_inner_radius_old[index_to_use].innerRadius, outer_inner_radius_new[index_to_use].innerRadius);
        outer_radius = d3.interpolate(outer_inner_radius_old[index_to_use].outerRadius - 1, outer_inner_radius_new[index_to_use].outerRadius - 1);

        this._current = i(0);

        return function (t) {
            var r = inner_radius(t),
                outer_r = outer_radius(t),
                arc = d3.arc()
                    .outerRadius(outer_r)
                    .innerRadius(r);

            return arc(i(t))
        }
    }
}

/**
 *
 * @param nodes
 * @param node_id
 * @returns {Array}
 */
function get_node_object_by_id(nodes, node_id) {
    var new_node = [];
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].group_nodes !== undefined && nodes[i].group_nodes.length > 0) {
            for (var j = 0; j < nodes[i].group_nodes.length; j++) {
                if (nodes[i].group_nodes[j].id == node_id) {
                    new_node = nodes[i].group_nodes[j];
                    new_node.type = nodes[i].type;
                    break;
                }
            }
        }
    }
    return new_node;
}


function get_node_type_object_by_id(nodes, node_id) {
    var new_node_type = "";
    for (var i = 0; i < nodes.length; i++) {
        for (var j = 0; j < nodes[i].group_nodes.length; j++) {
            if (nodes[i].group_nodes[j].id == node_id) {
                new_node_type = nodes[i].type;
                break;
            }
        }
    }
    return new_node_type;
}

function get_nodes_by_type(nodes, type) {
    var new_node_type = [];
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].type == type) {
            new_node_type = nodes[i].group_nodes;
            break;
        }
    }
    return new_node_type;
}

/**
 * if there is no relation between currently presented divs and new ones
 * @param new_nodes
 */
function animate_divs_on_home(new_nodes, direction, div_id_chart) {

    set_animation_duration_is_over_false(div_id_chart);
    //get child_divs from chart
    var child_divs = d3.select('#' + div_id_chart).selectAll('.donut_chart_divs')._groups[0];

    // set calculated_node_objects again
    calculated_node_objects_per_div[get_index_of_chart_div_id(div_id_chart)].calculated_node_objects = new_nodes;

    //hide and remove all nodes except the selected one
    for (var i = 0; i < child_divs.length; i++) {

        var new_id = child_divs[i].id + "a";

        var new_id_line = child_divs[i].id + "_line_a";
        d3.select('#' + div_id_chart).select('#' + child_divs[i].id + '_line').attr('id', new_id_line);
        d3.select('#' + div_id_chart).select('#' + child_divs[i].id).attr('id', new_id);

        // change div position
        d3.select('#' + div_id_chart).select('#' + new_id)
            .transition()
            .duration(myDuration)
            .style('left', parseFloat(d3.select('#' + div_id_chart).select('#' + new_id).style('left')) - direction * parseFloat(d3.select('#' + div_id_chart).style('width')) + 'px')
            .remove();

        // this is needed because there is one line less than node
        if (!d3.select('#' + div_id_chart).select('#' + new_id_line).empty()) {

            // change line_div position
            d3.select('#' + div_id_chart).select('#' + new_id_line)
                .transition()
                .duration(myDuration)
                .style('left', parseFloat(d3.select('#' + div_id_chart).select('#' + new_id_line).style('left')) - direction * parseFloat(d3.select('#' + div_id_chart).style('width')) + 'px')
                .remove();
        }
    }


    var new_selected_node = get_nodes_by_type(new_nodes, current_node_type)[0];
    var new_selected_node_layout_to_animate = [];

    new_selected_node_layout_to_animate.pos_x = new_selected_node.layout.pos_x + direction * parseFloat(d3.select('#' + div_id_chart).style('width'));
    new_selected_node_layout_to_animate.pos_y = new_selected_node.layout.pos_y;
    new_selected_node_layout_to_animate.node_height = new_selected_node.layout.node_height;
    new_selected_node_layout_to_animate.node_width = new_selected_node.layout.node_width;

    // create nodes which are not already viewed
    for (var j = 0; j < new_nodes.length; j++) {

        var group_of_nodes = new_nodes[j].group_nodes;
        for (var i = 0; i < group_of_nodes.length; i++) {

            group_of_nodes[i].type = current_node_type;

            if (new_nodes[j].type === parent_type) {
                group_of_nodes[i].type = parent_type;

            } else if (new_nodes[j].type === children_type) {
                group_of_nodes[i].type = children_type;
            }


            var pos_x = group_of_nodes[i].layout.pos_x;
            var pos_y = group_of_nodes[i].layout.pos_y;
            //current_node, parent_div, pos_top, pos_left, width, height, node_type)
            create_donut_divs(group_of_nodes[i], div_id_chart, pos_y, pos_x + direction * parseFloat(d3.select('#' + div_id_chart).style('width')), group_of_nodes[i].layout.node_width, group_of_nodes[i].layout.node_height, new_nodes[j]);
            animate_divs('#' + group_of_nodes[i].id, group_of_nodes[i], "", div_id_chart);

            var new_nodes_layout_to_animate = [];


            new_nodes_layout_to_animate.pos_x = pos_x + direction * parseFloat(d3.select('#' + div_id_chart).style('width'));
            new_nodes_layout_to_animate.pos_y = pos_y;
            new_nodes_layout_to_animate.node_height = group_of_nodes[i].layout.node_height;
            new_nodes_layout_to_animate.node_width = group_of_nodes[i].layout.node_width;

            myDuration_lines = 2000;
            create_lines(group_of_nodes[i].id, new_nodes[j], new_nodes_layout_to_animate, new_selected_node_layout_to_animate, div_id_chart);
            animate_lines(div_id_chart, group_of_nodes[i].id, group_of_nodes[i].layout, new_selected_node.layout);

            animation_on_click(group_of_nodes[i].id, new_nodes, div_id_chart);
        }

    }


}

function checkIfEmptyObject(obj) {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop))
            return false;
    }

    return true;
}