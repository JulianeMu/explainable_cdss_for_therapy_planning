/**
 * this method includes the presentation of the set evidence dialog and its functionalities
 * @param div_id_chart
 * @param parent_element
 */
function open_set_evidence_dialog(div_id_chart, parent_element, evidence_OR_state_inspection) {


    d3.select('#' + div_id_chart).select('#' + 'side_nav_set_evidence')
        .style('height', parseFloat(d3.select('#' + div_id_chart).style('height')) - 60 + "px");

    getNodeObjects_with_Virtual_evidences(function (response) {

        show_set_evidence_dialog(response[0], div_id_chart, evidence_OR_state_inspection);

    }, [parent_element.id]);

}


function show_set_evidence_dialog(node_to_inspect, div_id_chart, evidence_OR_state_inspection) {

    var line_height = 30;
    var space_between_lines = 5;

    var current_nodes = JSON.parse(JSON.stringify(calculated_node_objects_per_div[get_index_of_chart_div_id(div_id_chart)].calculated_node_objects));

    var type = current_nodes [1];


    var id = node_to_inspect.id;

    var states = node_to_inspect.states;

    var div_evidence_left_side = d3.select('#' + div_id_chart).select('#' + 'side_nav_set_evidence')
        .append('div')
        .attr('class', 'donut_chart_divs')
        .attr('id', id)
        .style('position', 'absolute')
        .style('top', 60 + 'px')
        .style('left', 0 + "px")
        .style('width', parseFloat(d3.select('#' + div_id_chart).style('width')) / 3 + "px")
        .style('height', parseFloat(d3.select('#' + div_id_chart).style('height')) - 60 + "px")
        .on('click', closeNav_set_evidence(div_id_chart));

    create_donut(node_to_inspect, states, type, div_evidence_left_side, true);

    // disable on click for set evidence view
    d3.select('#' + div_id_chart).select('#' + 'side_nav_set_evidence').select('.donut_chart_divs').select('svg').on('click', function () {
        //closeNav_set_evidence(div_id_chart);
    });


    var div_evidence_right_side = d3.select('#' + div_id_chart).select('#' + 'side_nav_set_evidence')
        .append('div')
        .attr('class', 'evidence_right_side')
        .attr('id', id + 'evidence_right_side')
        .style('position', 'absolute')
        .style('top', 60 + 'px')
        .style('left', parseFloat(div_evidence_left_side.style('width')) + "px")
        .style('width', parseFloat(d3.select('#' + div_id_chart).style('width')) - parseFloat(div_evidence_left_side.style('width')) + "px")
        .style('height', parseFloat(d3.select('#' + div_id_chart).style('height')) - 60 + "px");

    var padding_left = 20;


    var all_sliders = [];

    var div_evidences_input = div_evidence_right_side
        .append('div')
        //.attr('class', 'evidence_right_side')
        .attr('id', 'evidences_input')
        .style('position', 'absolute')
        .style('top', 0 + 'px')
        .style('left', 0 + "px")
        .style('width', parseFloat(div_evidence_right_side.style('width')) + "px")
        .style('height', parseFloat(div_evidence_right_side.style('height')) - line_height - padding_left + "px")
        .style('overflow-y', 'auto');

    var width_of_input_div_including_padding = parseFloat(div_evidences_input.style('width')) - padding_left - 7;
    for (var i = 0; i < states[0].length; i++) {

        for (var j = 0; j < states.length; j++) {

            var color_values = [d3.color(type.color[j][0]), d3.color(type.color[j][1])];

            if (j > 0) {
                var all_similar = true;
                for (var k = 0; k < states[0].length; k++) {
                    if (parseFloat(states[j][k].probability).toFixed(3) !== parseFloat(states[0][k].probability).toFixed(3)) {
                        all_similar = false;
                    }
                }

                if (all_similar) {
                    color_values = [d3.color(type.color[0][0]), d3.color(type.color[0][1])];
                }
            }


            if (node_to_inspect.isObserved[j]) {
                color_values = [d3.color(color_observed[0]), d3.color(color_observed[1])];
            }
            var color = d3.scaleLinear().domain([0, states[0].length - 1])
                .interpolate(d3.interpolateHcl)
                .range(color_values);


            var pos_top = i * (line_height + space_between_lines) * states.length + j * (line_height);
            if ((all_similar && states.length > 1)) {
                pos_top = i * (line_height + space_between_lines);
            }

            if (!(all_similar && j > 0)) {
                var current_state = states[j][i];
                var state_name = current_state.name;


                var div_rect_text = div_evidences_input.append('div')
                    .attr('id', state_name + 'rect_text' + j)
                    .style('width', width_of_input_div_including_padding / 2 + 'px')
                    .style('height', line_height + 'px')
                    .style('position', 'absolute')
                    .style('top', pos_top + 'px')
                    .style('left', 0 + "px");


                var width_rect = 20;
                // state text
                var svg_text = div_rect_text.append('svg')
                    .attr('width', parseFloat(div_rect_text.style('width')) - width_rect - padding_left + 'px')
                    .attr('height', div_rect_text.style('height'))
                    .attr('x', 0 + 'px');

                var width_text = parseFloat(svg_text.attr('width')) - padding_left;


                svg_text
                    .append('text')
                    .attr('id', 'mode_text_id')
                    .attr('font-size', '1em')
                    .attr('font-weight', 100)
                    //.style('fill', 'white')
                    .text(state_name)
                    .attr("text-anchor", "end")
                    .attr('transform', 'translate(' + width_text +
                        ',' + (line_height / 2) + ')');


                // state color
                var svg_rect = div_rect_text.append('svg')
                    .attr('width', width_rect + padding_left + 'px')
                    .attr('height', parseFloat(div_rect_text.style('height')) + 'px');

                svg_rect.append('rect')
                    .attr('x', 0 + 'px')
                    .attr('y', 0 + 'px')
                    .attr('width', parseFloat(svg_rect.attr('width')) - padding_left + 'px')
                    .attr('height', parseFloat(div_rect_text.style('height')) / 2 + 4 + 'px')
                    .style('fill', color(i));


                /**************************************slider*****************************/

                var div_text_input_width = 95;

                var div_slider_width = width_of_input_div_including_padding //parseFloat(div_evidences_input.style('width'))
                    - parseFloat(div_rect_text.style('width'))
                    - div_text_input_width;

                var div_slider = div_evidences_input.append('div')
                    .attr('id', state_name + 'slider_div' + j)
                    .style('width', div_slider_width + 'px')
                    .style('height', line_height + 'px')
                    //.style('border', '1px solid white')
                    .style('position', 'absolute')
                    .style('top', pos_top + 'px')
                    .style('left', parseFloat(div_rect_text.style('width')) + "px");

                var current_slider = div_slider.append('input')
                    .attr('id', state_name + 'slider' + j)
                    .attr('data-slider-id', state_name + 'slider_graph_' + j)
                    .attr('type', 'text')
                    .attr('data-slider-min', 0.0)
                    .attr('data-slider-max', 100.0)
                    .attr('data-slider-step', 0.1)
                    .attr('data-slider-value', (parseFloat(current_state.probability) * 100).toFixed(1))
                    .style('width', div_slider_width + 'px');


                // div_slider.node().'.slider-selection')
                var slider = new Slider('#' + state_name + 'slider' + j, {
                    tooltip: 'always',
                    formatter: function (value) {

                        var state_id = this.id.split('slider_graph_')[0];

                        var input_box = d3.select('#' + state_id + 'percentage_input_box' + this.id.split('slider_graph_')[1]);

                        if (!input_box.empty()) {
                            input_box.node().value = value;


                            var states_slider = [];
                            var states_at_pos_0 = [];
                            for (var i = 0; i < all_sliders.length; i++) {
                                var slider_state_id = all_sliders[i].element.id.split('slider')[0];

                                if (value === 100) {
                                    if (state_id !== slider_state_id) {
                                        all_sliders[i].setValue(0);
                                    }
                                }
                                states_at_pos_0.push({
                                    name: slider_state_id,
                                    probability: all_sliders[i].getValue() / 100
                                });
                            }

                            states_slider.push(states_at_pos_0);

                            if (node_to_inspect.states.length > 1) {
                                states_slider.push(node_to_inspect.states[1]);
                            }

                            d3.select('#' + div_id_chart).select('#' + 'side_nav_set_evidence').select('#' + id).selectAll('*').remove();


                            create_donut(node_to_inspect, states_slider, type, div_evidence_left_side, true);


                            check_if_100_percent_in_total(states, all_sliders, div_id_chart);
                        }
                        return 'Current value: ' + value;
                    }
                });

                if (!evidence_OR_state_inspection || j > 0) {
                    slider.disable();
                }
                if (j === 0) {
                    all_sliders.push(slider);
                }


                d3.select('#' + slider.sliderElem.id).select('.slider-selection').style('background', color(i));


                /**************************************text_input*****************************/

                var percentage_width = 20;
                var div_text_input = div_evidences_input.append('div')
                    .attr('id', state_name + 'text_input_div' + j)
                    .style('width', div_text_input_width - padding_left + 'px')
                    .style('height', line_height + 'px')
                    //.style('border', '1px solid white')
                    .style('position', 'absolute')
                    .style('top', pos_top + 'px')
                    .style('left', parseFloat(div_rect_text.style('width')) + div_slider_width + padding_left + "px");

                var div_input = div_text_input.append('div')
                    .attr('id', state_name + 'input_div' + j)
                    .style('width', parseFloat(div_text_input.style('width')) - percentage_width + 'px')
                    .style('height', line_height + 'px')
                    //.style('border', '1px solid white')
                    .style('position', 'absolute')
                    .style('top', 0 + 'px')
                    .style('left', 0 + "px");


                var percentage_input_box = div_input.append('input')
                    .attr('id', state_name + 'percentage_input_box' + j)
                    .attr('type', 'number')
                    .attr('min', 0.0)
                    .attr('max', 100.0)
                    .attr('step', 0.1)
                    .attr('value', (parseFloat(current_state.probability) * 100).toFixed(1))
                    .style('y', '0px')
                    .style('width', parseFloat(div_input.style('width')) - 5 + 'px')
                    //.attr('placeholder', (parseFloat(current_state.probability).toFixed(2) * 100).toFixed(0) +' % ')
                    .style('text-align', 'right')
                    .on('input', function () {

                        var state_id = this.id.split('percentage_input_box')[0];

                        for (var k = 0; k < all_sliders.length; k++) {
                            if (all_sliders[k].element.id.split('slider')[0] === state_id) {
                                all_sliders[k].setValue(this.value);
                                break;
                            }
                        }
                    });

                if (!evidence_OR_state_inspection || j > 0) {
                    percentage_input_box.attr('disabled', true);
                }

                var div_percentage = div_text_input.append('div')
                    .attr('id', state_name + 'percentage_div' + j)
                    .style('width', percentage_width + 'px')
                    .style('height', line_height + 'px')
                    //.style('border', '1px solid white')
                    .style('position', 'absolute')
                    .style('top', 0 + 'px')
                    .style('left', parseFloat(div_input.style('width')) + "px");

                var svg_text_percentage = div_percentage.append('svg')
                    .attr('width', parseFloat(div_percentage.style('width')) + 'px')
                    .attr('height', div_percentage.style('height'))
                    .attr('x', parseFloat(percentage_input_box.style('width')) + 5 + 'px');

                svg_text_percentage
                    .append('text')
                    .attr('id', 'percentage')
                    .attr('font-size', '1em')
                    .attr('font-weight', 100)
                    //.style('fill', 'white')
                    .text('%')
                    .attr('transform', 'translate(' + (0) +
                        ',' + (line_height / 2) + ')');
            }
        }
    }


    /*********************************submit and cancel button***********************/

    if (evidence_OR_state_inspection) {

        var found_in_evidences = false;
        for (var i = 0; i < virtual_evidences.length; i++) {
            if (virtual_evidences[i].id === id) {
                virtual_evidences[i].values = [];

                for (var j = 0; j < all_sliders.length; j++) {
                    virtual_evidences[i].values.push((all_sliders[j].getValue() / 100).toFixed(3));
                }
                found_in_evidences = true;
            }
        }

        var div_buttons_cancel_submit = div_evidence_right_side.append('div')
            .attr('id', 'buttons' + div_id_chart)
            .style('width', parseFloat(div_evidence_right_side.style('width')) - padding_left + 'px')
            .style('height', line_height + 'px')
            .style('position', 'absolute')
            //.style('border', '1px solid white')
            .style('top', parseFloat(div_evidence_right_side.style('height')) - line_height - padding_left + 'px')
            .style('left', 0 + "px");


        if (found_in_evidences) {

            var svg_unset_evidence = div_buttons_cancel_submit.append('svg')
                .attr('width', parseFloat(div_buttons_cancel_submit.style('width')) / 3 + 'px')
                .attr('height', div_buttons_cancel_submit.style('height'))
                .on('click', function () {

                    var object_evidences = [];
                    var index_in_virtual_evidences = 0;

                    for (var j = 0; j < virtual_evidences.length; j++) {
                        if (virtual_evidences[j].id === id) {
                            index_in_virtual_evidences = j;
                        } else {
                            object_evidences.push(virtual_evidences[j]);
                        }
                    }

                    virtual_evidences = object_evidences;



                    get_all_information_of_selected_node(function (response) {

                        response = calculate_layout_of_nodes(response, div_id_chart);

                        closeNav_set_evidence(div_id_chart);

                        calculated_node_objects_per_div[get_index_of_chart_div_id(div_id_chart)].calculated_node_objects = response;

                        update_chart(div_id_chart);

                        if (virtual_evidences.length > 0) {
                            d3.select('#' + unset_all_local_changes_button_id).style('opacity', icons_opacity_enabled)
                        } else {
                            d3.select('#' + unset_all_local_changes_button_id).style('opacity', icons_opacity_disabled)
                        }

                    }, calculated_node_objects_per_div[get_index_of_chart_div_id(div_id_chart)].calculated_node_objects[1].group_nodes[0].id, JSON.parse(JSON.stringify(calculated_node_objects_per_div[get_index_of_chart_div_id(div_id_chart)].calculated_node_objects)), get_chart_div_id(div_id_chart));
                });

            var rect_button_unset_evidence = svg_unset_evidence.append("rect")       // attach a rectangle
                .attr("x", 0)         // position the left of the rectangle
                .attr("y", 0)          // position the top of the rectangle
                .attr("height", svg_unset_evidence.attr('height'))    // set the height
                .attr("width", parseFloat(svg_unset_evidence.attr('width')) - padding_left + 'px')     // set the width
                .attr("rx", 3)         // set the x corner curve radius
                .attr("ry", 3)        // set the y corner curve radius
                .style('fill', d3.color(type.color[0][0]));


            svg_unset_evidence.append('text')
                .attr('id', 'cancel')
                .attr('font-size', '1em')
                .attr('font-weight', 900)
                .style('fill', 'black')//color(states[0].length -1 ))
                .text(get_language__label_by_id(language_id_string_unset_evidence))
                .attr("text-anchor", "middle")
                .attr("alignment-baseline", "middle")
                .attr('transform', 'translate(' + (parseFloat(rect_button_unset_evidence.attr('width')) / 2) +
                    ',' + (line_height / 2) + ')');


            var svg_cancel = div_buttons_cancel_submit.append('svg')
                .attr('width', parseFloat(div_buttons_cancel_submit.style('width')) / 3 + 'px')
                .attr('height', div_buttons_cancel_submit.style('height'))
                .on('click', function () {
                    closeNav_set_evidence(div_id_chart);
                });

            var rect_button_cancel = svg_cancel.append("rect")       // attach a rectangle
                .attr("x", padding_left/2)         // position the left of the rectangle
                .attr("y", 0)          // position the top of the rectangle
                .attr("height", svg_cancel.attr('height'))    // set the height
                .attr("width", parseFloat(svg_cancel.attr('width')) - padding_left + 'px')     // set the width
                .attr("rx", 3)         // set the x corner curve radius
                .attr("ry", 3)        // set the y corner curve radius
                .style('fill', d3.color(type.color[0][0]));


            svg_cancel.append('text')
                .attr('id', 'cancel')
                .attr('font-size', '1em')
                .attr('font-weight', 900)
                .style('fill', 'black')//color(states[0].length -1 ))
                .text(get_language__label_by_id(language_id_string_cancel))
                .attr("text-anchor", "middle")
                .attr("alignment-baseline", "middle")
                .attr('transform', 'translate(' + (parseFloat(rect_button_cancel.attr('width')) / 2 + padding_left/2) +
                    ',' + (line_height / 2) + ')');

            var svg_submit = div_buttons_cancel_submit.append('svg')
                .attr('id', 'submit_evidence')
                .attr('width', parseFloat(div_buttons_cancel_submit.style('width')) / 3 + 'px')
                .attr('height', div_buttons_cancel_submit.style('height'))
                .on('click', function () {
                    if (parseFloat(this.style.opacity) === 1) {

                        var found_in_evidences = false;
                        for (var i = 0; i < virtual_evidences.length; i++) {
                            if (virtual_evidences[i].id === id) {
                                virtual_evidences[i].values = [];

                                for (var j = 0; j < all_sliders.length; j++) {
                                    virtual_evidences[i].values.push((all_sliders[j].getValue() / 100).toFixed(3));
                                }
                                found_in_evidences = true;
                            }
                        }

                        if (!found_in_evidences) {

                            var object_evidences = [];
                            for (var j = 0; j < all_sliders.length; j++) {
                                object_evidences.push((all_sliders[j].getValue() / 100).toFixed(3));
                            }

                            virtual_evidences.push({
                                id: id,
                                values: object_evidences
                            })
                        }



                        get_all_information_of_selected_node(function (response) {

                            response = calculate_layout_of_nodes(response, div_id_chart);

                            closeNav_set_evidence(div_id_chart);

                            calculated_node_objects_per_div[get_index_of_chart_div_id(div_id_chart)].calculated_node_objects = response;

                            update_chart(div_id_chart);
                            d3.select('#' + unset_all_local_changes_button_id).style('opacity', icons_opacity_enabled);


                        }, calculated_node_objects_per_div[get_index_of_chart_div_id(div_id_chart)].calculated_node_objects[1].group_nodes[0].id, JSON.parse(JSON.stringify(calculated_node_objects_per_div[get_index_of_chart_div_id(div_id_chart)].calculated_node_objects)), get_chart_div_id(div_id_chart));


                        /*var rs = "";
                        rs += "<cases>";
                        rs += "<case name='defaultCase' category='generatedCase'>";
                        rs += "<description>This case was automatically generated</description>";

                        console.log(id)

                        rs += "<softevidence node='" + id + "'>";
                        for (var i = 0; i < states[0].length; i++) {
                            for (var j = 0; j < all_sliders.length; j++) {
                                if (states[0][i].name === all_sliders[j].element.id.split('slider')[1]) {
                                    var value = (all_sliders[j].getValue() / 100).toFixed(2);
                                    console.log(all_sliders[j].getValue());

                                    if ((i + 1) != states[0].length) {
                                        rs += value + " ";
                                    } else {
                                        rs += value;
                                    }

                                }
                            }
                        }
                        rs += "</softevidence>";
                        rs += "</case>";
                        rs += "</cases>";

                        var o = {};
                        o['caseText'] = rs;

                        console.log("o");
                        console.log(o);
                        var cnJson = JSON.stringify(o);

                        console.log("cnJson");
                        console.log(cnJson);
                        if (cnJson) {

                            console.log(cnJson)

                            postNetValuesAndSave(function (response) {
                                console.log(response);

                                get_net_list_by_name_and_patientID(function (response) {
                                    console.log(response)
                                    closeNav_set_evidence(div_id_chart);

                                }, net_name, patient_id, username, password, true);

                            }, net_name, patient_id, net_version, cnJson, username, password, true);
                        }*/
                    }
                })
            ;

            var rect_button_submit = svg_submit.append("rect")       // attach a rectangle
                .attr("x", padding_left)         // position the left of the rectangle
                .attr("y", 0)          // position the top of the rectangle
                .attr("height", svg_submit.attr('height'))    // set the height
                .attr("width", parseFloat(svg_submit.attr('width')) - padding_left + 'px')     // set the width
                .attr("rx", 3)         // set the x corner curve radius
                .attr("ry", 3)        // set the y corner curve radius
                .style('fill', d3.color(type.color[0][0]));

            svg_submit.append('text')
                .attr('id', 'submit')
                .attr('font-size', '1em')
                .attr('font-weight', 900)
                .style('fill', 'black')//color(states[0].length -1 ))
                .text(get_language__label_by_id(language_id_string_submit))
                .attr("text-anchor", "middle")
                .attr("alignment-baseline", "middle")
                .attr('transform', 'translate(' + (parseFloat(rect_button_submit.attr('width')) / 2 + padding_left) +
                    ',' + (line_height / 2) + ')');


        } else {

            var svg_cancel = div_buttons_cancel_submit.append('svg')
                .attr('width', parseFloat(div_buttons_cancel_submit.style('width')) / 2 + 'px')
                .attr('height', div_buttons_cancel_submit.style('height'))
                .on('click', function () {
                    closeNav_set_evidence(div_id_chart);
                });

            var rect_button_cancel = svg_cancel.append("rect")       // attach a rectangle
                .attr("x", 0)         // position the left of the rectangle
                .attr("y", 0)          // position the top of the rectangle
                .attr("height", svg_cancel.attr('height'))    // set the height
                .attr("width", parseFloat(svg_cancel.attr('width')) - padding_left + 'px')     // set the width
                .attr("rx", 3)         // set the x corner curve radius
                .attr("ry", 3)        // set the y corner curve radius
                .style('fill', d3.color(type.color[0][0]));


            svg_cancel.append('text')
                .attr('id', 'cancel')
                .attr('font-size', '1em')
                .attr('font-weight', 900)
                .style('fill', 'black')//color(states[0].length -1 ))
                .text(get_language__label_by_id(language_id_string_cancel))
                .attr("text-anchor", "middle")
                .attr("alignment-baseline", "middle")
                .attr('transform', 'translate(' + (parseFloat(rect_button_cancel.attr('width')) / 2) +
                    ',' + (line_height / 2) + ')');

            var svg_submit = div_buttons_cancel_submit.append('svg')
                .attr('id', 'submit_evidence')
                .attr('width', parseFloat(div_buttons_cancel_submit.style('width')) / 2 + 'px')
                .attr('height', div_buttons_cancel_submit.style('height'))
                .on('click', function () {
                    if (parseFloat(this.style.opacity) === 1) {

                        var found_in_evidences = false;
                        for (var i = 0; i < virtual_evidences.length; i++) {
                            if (virtual_evidences[i].id === id) {
                                virtual_evidences[i].values = [];

                                for (var j = 0; j < all_sliders.length; j++) {
                                    virtual_evidences[i].values.push((all_sliders[j].getValue() / 100).toFixed(3));
                                }
                                found_in_evidences = true;
                            }
                        }

                        if (!found_in_evidences) {

                            var object_evidences = [];
                            for (var j = 0; j < all_sliders.length; j++) {
                                object_evidences.push((all_sliders[j].getValue() / 100).toFixed(3));
                            }

                            virtual_evidences.push({
                                id: id,
                                values: object_evidences
                            })
                        }

                        get_all_information_of_selected_node(function (response) {

                            response = calculate_layout_of_nodes(response, div_id_chart);

                            closeNav_set_evidence(div_id_chart);

                            calculated_node_objects_per_div[get_index_of_chart_div_id(div_id_chart)].calculated_node_objects = response;

                            update_chart(div_id_chart);

                            d3.select('#' + unset_all_local_changes_button_id).style('opacity', icons_opacity_enabled);


                        }, calculated_node_objects_per_div[get_index_of_chart_div_id(div_id_chart)].calculated_node_objects[1].group_nodes[0].id, JSON.parse(JSON.stringify(calculated_node_objects_per_div[get_index_of_chart_div_id(div_id_chart)].calculated_node_objects)), get_chart_div_id(div_id_chart));


                        /*var rs = "";
                        rs += "<cases>";
                        rs += "<case name='defaultCase' category='generatedCase'>";
                        rs += "<description>This case was automatically generated</description>";

                        console.log(id)

                        rs += "<softevidence node='" + id + "'>";
                        for (var i = 0; i < states[0].length; i++) {
                            for (var j = 0; j < all_sliders.length; j++) {
                                if (states[0][i].name === all_sliders[j].element.id.split('slider')[1]) {
                                    var value = (all_sliders[j].getValue() / 100).toFixed(2);
                                    console.log(all_sliders[j].getValue());

                                    if ((i + 1) != states[0].length) {
                                        rs += value + " ";
                                    } else {
                                        rs += value;
                                    }

                                }
                            }
                        }
                        rs += "</softevidence>";
                        rs += "</case>";
                        rs += "</cases>";

                        var o = {};
                        o['caseText'] = rs;

                        console.log("o");
                        console.log(o);
                        var cnJson = JSON.stringify(o);

                        console.log("cnJson");
                        console.log(cnJson);
                        if (cnJson) {

                            console.log(cnJson)

                            postNetValuesAndSave(function (response) {
                                console.log(response);

                                get_net_list_by_name_and_patientID(function (response) {
                                    console.log(response)
                                    closeNav_set_evidence(div_id_chart);

                                }, net_name, patient_id, username, password, true);

                            }, net_name, patient_id, net_version, cnJson, username, password, true);
                        }*/
                    }
                })
            ;

            var rect_button_submit = svg_submit.append("rect")       // attach a rectangle
                .attr("x", padding_left)         // position the left of the rectangle
                .attr("y", 0)          // position the top of the rectangle
                .attr("height", svg_submit.attr('height'))    // set the height
                .attr("width", parseFloat(svg_submit.attr('width')) - padding_left + 'px')     // set the width
                .attr("rx", 3)         // set the x corner curve radius
                .attr("ry", 3)        // set the y corner curve radius
                .style('fill', d3.color(type.color[0][0]));

            svg_submit.append('text')
                .attr('id', 'submit')
                .attr('font-size', '1em')
                .attr('font-weight', 900)
                .style('fill', 'black')//color(states[0].length -1 ))
                .text(get_language__label_by_id(language_id_string_submit))
                .attr("text-anchor", "middle")
                .attr("alignment-baseline", "middle")
                .attr('transform', 'translate(' + (parseFloat(rect_button_submit.attr('width')) / 2 + padding_left) +
                    ',' + (line_height / 2) + ')');

        }

        check_if_100_percent_in_total(states, all_sliders, div_id_chart);

    }
    openNav_set_evidence(div_id_chart, evidence_OR_state_inspection)
}

/**
 * the states need to be 100 % in sum
 * furthermore, the states should be unequal to original ones
 * @param states
 * @param all_sliders
 * @param div_id_chart
 */
function check_if_100_percent_in_total(states, all_sliders, div_id_chart) {
    var sum = 0;
    var equals_states = true;

    for (var i = 0; i < states[0].length; i++) {
        for (var j = 0; j < all_sliders.length; j++) {
            if (states[0][i].name === all_sliders[j].element.id.split('slider')[0]) {
                sum += all_sliders[j].getValue();

                if ((parseFloat(states[0][i].probability) * 100).toFixed(1) + '' !== all_sliders[j].getValue() + '') {
                    equals_states = false;

                }
            }
        }
    }

    sum = sum.toFixed(1);

    if (sum === parseFloat(100).toFixed(1) && !equals_states) {
        d3.select('#' + div_id_chart).select('#submit_evidence').style('opacity', '1');
    } else {
        d3.select('#' + div_id_chart).select('#submit_evidence').style('opacity', '0.5');
    }

    d3.select('#' + div_id_chart).select('#submit_evidence').select('text').text(get_language__label_by_id(language_id_string_submit) + sum + '%')
}


/**********************************************open and close canvas menu*******************************************/

function openNav_set_evidence(div_id_chart, evidence_OR_state_inspection) {

    var text = evidence_OR_state_inspection ? get_language__label_by_id(language_id_string_set_evidence_global) : get_language__label_by_id(language_id_string_inspect_global);

    d3.select('#' + div_id_chart + '_mode_text').select('svg').select('text').text(text);
    d3.select('#' + div_id_chart).select('#' + 'side_nav_set_evidence').transition().duration(myDuration / 2).style('width', d3.select('#' + div_id_chart).style('width'));
    disable_all_icons(div_id_chart);
}

function closeNav_set_evidence(div_id_chart) {
    d3.select('#' + div_id_chart).select('#' + 'side_nav_set_evidence')
        .transition().duration(myDuration / 2)
        .style('width', 0 + 'px')
        .on('end', function () {
                d3.select('#' + div_id_chart).select('#' + 'side_nav_set_evidence').selectAll('.donut_chart_divs').remove();
                d3.select('#' + div_id_chart).select('#' + 'side_nav_set_evidence').selectAll('.evidence_right_side').remove();
            }
        );

    var index = get_index_rotation_direction(div_id_chart);

    if (rotation_direction_whole[index].bool) {
        d3.select('#' + div_id_chart + '_mode_text').select('svg').select('text').text(get_language__label_by_id(language_id_string_overview_mode));
    } else {
        d3.select('#' + div_id_chart + '_mode_text').select('svg').select('text').text(get_language__label_by_id(language_id_string_exploration_mode));
    }


    disable_all_icons_for_views(div_id_chart);
    check_if_enabled(div_id_chart);

}