var unset_all_local_changes_button_id = 'unset_all_local_evidences_button';

function create_legend(div_id_chart) {

    //d3.select('#legend').style('width', d3.select('#whole_view').style('width'))

    var legend_entries_first_row = [{
        text: get_language__label_by_id(language_id_string_observed),
        color: color_observed
    }, {
        text: get_language__label_by_id(language_id_string_computed),
        color: color_parent_current_children.current[0]
    }, {
        text: get_language__label_by_id(language_id_string_earlier_version),
        color: color_parent_current_children.current[1]
    }];

    var legend_entries_second_row = [{
        text: get_language__label_by_id(language_id_string_smaller_values),
        color: color_parent_current_children.current[1],
        texture: 'bigger'
    }, {
        text: get_language__label_by_id(language_id_string_bigger_values),
        color: color_parent_current_children.current[1],
        texture: 'smaller'
    }];

    var legend_entry_unset_all_evidences_button = {
        text: get_language__label_by_id(language_id_string_unset_all_evidences),
        color: color_observed[0]
    };


    var margin = {
        top: 10,
        left: 5,
        right: 20,
        bottom: 10
    };

    var legend_entries_layout = {
        width: 320,
        height: 20
    };

    var padding = 10;


    var width_rect = 60;

    var width = parseFloat(d3.select('#legend').style('width')) - margin.left - margin.right;
    var height = parseFloat(d3.select('#legend').style('height')) - margin.top - margin.bottom;

    var legend_svg = d3.select('#legend').append('svg')
        .style("width", width + margin.left + margin.right + 'px')
        .style("height", height + margin.top + margin.bottom + 'px')
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    var svg_element = legend_svg.append('svg')
        .attr('width', width)
        .attr('height', 40);

    svg_element
        .append('text')
        .attr('id', 'mode_text_id')
        .attr('font-size', font_size)
        .attr('font-weight', 100)
        .text(get_language__label_by_id(language_id_string_legend))
        .attr('transform', 'translate(' + (0) +
            ',' + (40 / 2) + ')');


    for (var i = 0; i < legend_entries_first_row.length; i++) {
        var svg_legend_entries = legend_svg.append('svg')
            .attr('width', legend_entries_layout.width + 'px')
            .attr('height', legend_entries_layout.height + 'px')
            .attr('y', legend_entries_layout.height * 2 + 'px')
            .attr('x', i * legend_entries_layout.width);


        create_rectangle(svg_legend_entries, legend_entries_first_row[i].color, i);
        create_text(svg_legend_entries, legend_entries_first_row[i].text);
    }


    for (var i = 0; i < legend_entries_second_row.length; i++) {
        var svg_legend_entries = legend_svg.append('svg')
            .attr('width', legend_entries_layout.width + 'px')
            .attr('height', legend_entries_layout.height + 'px')
            .attr('y', legend_entries_layout.height * 4 - legend_entries_layout.height / 2 + 'px')
            .attr('x', i * legend_entries_layout.width);


        create_rectangle(svg_legend_entries, legend_entries_second_row[i].color, i + 3, legend_entries_second_row[i].texture);
        create_text(svg_legend_entries, legend_entries_second_row[i].text)
    }

    // unset button
    var svg_legend_entries = legend_svg.append('svg')
        .attr('id', unset_all_local_changes_button_id)
        .attr('width', legend_entries_layout.width + 'px')
        .attr('height', legend_entries_layout.height + 'px')
        .attr('y', legend_entries_layout.height * 4 - legend_entries_layout.height / 2 + 'px')
        .attr('x', 2* legend_entries_layout.width)
        .attr('border', '1px solid white')
        .style('opacity', icons_opacity_disabled);

    //create_rectangle(svg_legend_entries, legend_entry_unset_all_evidences_button.color, 0, undefined, true);
    //create_text(svg_legend_entries, legend_entry_unset_all_evidences_button.text, true);

    svg_legend_entries.on('click', function () {

        if (this.style.opacity + '' === icons_opacity_enabled + '') {
            virtual_evidences = [];

            d3.select('#' + unset_all_local_changes_button_id).style('opacity', icons_opacity_disabled);


            get_all_information_of_selected_node(function (response) {

                response = calculate_layout_of_nodes(response, div_id_chart);

                closeNav_set_evidence(div_id_chart);

                calculated_node_objects_per_div[get_index_of_chart_div_id(div_id_chart)].calculated_node_objects = response;

                update_chart(div_id_chart);

            }, calculated_node_objects_per_div[get_index_of_chart_div_id(div_id_chart)].calculated_node_objects[1].group_nodes[0].id, JSON.parse(JSON.stringify(calculated_node_objects_per_div[get_index_of_chart_div_id(div_id_chart)].calculated_node_objects)), get_chart_div_id(div_id_chart));
        }
    });

    /************************************functions***********************************/

    function create_text(svg_element, text, unset_button) {
        var svg_element = svg_element.append('svg')
            .attr('width', function() {
                if (unset_button) {
                    return legend_entries_layout.width;
                } else {
                    return legend_entries_layout.width - width_rect;
                }
            })
            .attr('height', legend_entries_layout.height)
            .attr('x', function() {
                if (unset_button) {
                    return 0+'px';
                } else {
                    return width_rect + padding + 'px'
                }
            });


        svg_element
            .append('text')
            .attr('id', 'mode_text_id')
            .attr('font-size', font_size)
            .attr('font-weight', 100)
            //.style('fill', 'white')
            .attr('alignment-baseline', 'central')
            .text(text)
            .attr('transform', 'translate(' + (0) +
                ',' + (legend_entries_layout.height / 2) + ')');

        if (unset_button) {
            svg_element.select('text').attr('x', width_rect/4)
                //.attr('transform', 'translate(' + width_rect/2 + ', 0)')
                //.style('text-anchor', 'middle');
        }

    }


    function create_rectangle(svg_element, color, index, smaller_bigger, unset_button) {

        var smaller_bigger = smaller_bigger;
        var svg_rect = svg_element.append('svg')
            .attr('width', function () {
                if (unset_button) {
                    return legend_entries_layout.width + 'px'
                }
                return width_rect + 'px';
            })
            .attr('height', legend_entries_layout.height + 'px');

        var gradient = svg_rect.append("defs")
            .append("linearGradient")
            .attr("id", "gradient" + index)
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "100%")
            .attr("y2", "0%")
            .attr("spreadMethod", "pad");

        gradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", color[0])
            .attr("stop-opacity", 1);

        gradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", color[1])
            .attr("stop-opacity", 1);


        svg_rect.append('rect')
            .attr('x', 0 + 'px')
            .attr('y', 0 + 'px')
            .attr('width', parseFloat(svg_rect.attr('width')) + 'px')
            .attr('height', legend_entries_layout.height + 'px')
            .style('fill', function () {
                if (smaller_bigger) {
                    var t = textures.lines()
                        .lighter()
                        .orientation(texture_orientation_smaller)
                        .background("white");

                    if (smaller_bigger === 'smaller') {
                        t = textures.lines()
                            .lighter()
                            .orientation(texture_orientation_bigger )
                            .background('white');
                    }

                    var g = d3.select(this.parentNode);
                    g.call(t);
                    return t.url();
                } else if (unset_button) {
                    return 'none';
                } else {
                    return "url(#gradient" + index + ")";
                }
            })
            .style('stroke', function () {
                if (unset_button) {
                    return color;
                }
            })
            .style('stroke-width', function () {
                if (unset_button) {
                    return 2;
                }
            });
    }
}