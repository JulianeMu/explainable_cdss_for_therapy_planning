function create_all_states_view(id, dataset, type, div_id_chart) {

    if (id === 'UICC_stage__patient') {
        dataset = new_therapy_states;
    }

    var text_pixel_size = 13;

    var svg = d3.select('#' + div_id_chart).select('#' + id).select('svg');
    if (!rotation_mostImportant_all[get_index_of_div_id_chart_in_variables(div_id_chart, rotation_mostImportant_all)].bool) {
        svg = d3.select('#' + div_id_chart).select('#' + type.type);
    }

    var div_width = parseFloat(d3.select('#' + div_id_chart).select('#' + id).style("width"));
    var div_height = parseFloat(d3.select('#' + div_id_chart).select('#' + id).style("height"));

    var color = d3.scaleLinear().domain([0, dataset.length - 1])
        .interpolate(d3.interpolateHcl)
        .range([d3.color(type.color[0][0]), d3.color(type.color[0][1])]);

    var svg_for_texts = svg.append('svg')
        .attr('id', 'states_all')
        .attr('width', div_width - 40)
        .attr('height', div_height);

    var svg_text_name = svg_for_texts.append('svg')
        .attr('id', 'states_text');


    var svg_text_prob = svg_for_texts.append('svg')
        .attr('id', 'states_prop');


    var latest_y_pos = [];
    var computed_text_lengths = [];
    var max_y = 0;
    var max_text_length = 0;
    var rectangle_widths = [];

    fill_svgs_text(svg_text_name, true);

    svg_text_prob.selectAll('rect')
        .data(dataset)
        .enter()
        .append('rect')
        .attr('width', function(d, i) {
            rectangle_widths.push((svg_for_texts.attr('width') - max_text_length - 50 )* (d.probability));
            return rectangle_widths[i];
        })
        .attr('height', text_pixel_size)
        .attr('x', 0)
        .attr('y', function(d, i) {
            return latest_y_pos[i] - text_pixel_size +1;
        })
        .attr("opacity", 1)
        .attr('fill', function (d) {
            return color(dataset.indexOf(d));
        })
        .attr('stroke', function (d) {
            return color(dataset.indexOf(d));
        });

    fill_svgs_text(svg_text_prob, false);

    /**
     * fill svgs and text
     * @param svg
     * @param name_or_prop
     */
    function fill_svgs_text(svg, name_or_prop) {

        latest_y_pos = [];

        svg.selectAll('text')
            .data(dataset)
            .enter()
            .append('text')
            .attr('y', function (d, i) {
                latest_y_pos.push((i + 1) * 25);
                return latest_y_pos[i]
            })
            .attr('x', function (d, i) {
                if (name_or_prop) {
                    return 0;
                } else {
                    return rectangle_widths[i] + 5;
                }
            })
            .style('font-size', text_pixel_size + 'px')
            .attr('fill', 'white')
            .text(function (d) {
                if (name_or_prop) {
                    return d.name + ": "
                } else {
                    return (parseFloat(d.probability)*100).toFixed(1) + "%"
                }

            })
            .each(function (d, i) {
                computed_text_lengths.push(this.getComputedTextLength());
            });



        if (name_or_prop) {
            max_text_length = d3.max(computed_text_lengths) + 20;
            max_y = d3.max(latest_y_pos);
        }

        svg
            .attr('x', function (d) {

                if (name_or_prop) {
                    return 0;
                } else {
                    return max_text_length;
                }
            })
            .attr('width', function (d) {
                if (name_or_prop) {
                    return max_text_length;
                } else {
                    return svg_for_texts.attr('width') - max_text_length;
                }
            })
            .attr('height', max_y + 5);
    }


    svg_for_texts
        .attr('height', max_y + 5)
        .attr('x', div_width / 2 - svg_for_texts.attr('width') / 2 + "px")
        .attr('y', div_height / 2 - svg_for_texts.attr('height') / 2+ "px");

    svg.on('click', function (d) {

        if (rotation_mostImportant_all[get_index_of_div_id_chart_in_variables(div_id_chart, rotation_mostImportant_all)].bool) {
            animate_current_chart_element2(id, dataset, type, div_id_chart);
        } else {

            open_set_evidence_dialog(div_id_chart, id, false)

            //animate_current_chart_element(true, id, dataset, type, div_id_chart);
        }
    });
}