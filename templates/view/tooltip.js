var duration_tooltip = 200;

function initialize_tool_tip() {
    // Define the div for the tooltip
    tooltip_div = d3.select("#whole_view").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style('z-index', 90);

    tooltip_div.append('svg')
        .style('width', '100%')//tooltip_div.style('width'))
        .style('height', '100%')//tooltip_div.style('height'))
        .style('left', 5 + 'px');
}

function remove_tooltip_content() {
    tooltip_div.select('svg').selectAll("*").remove();
}


function show_tooltip_max_state_change(current_evidence) {
    remove_tooltip_content();

    tooltip_div.transition()
        .duration(duration_tooltip)
        .style("opacity", 1);
    tooltip_div
        .style("left", (d3.event.pageX) + 20 + "px")
        .style("top", (d3.event.pageY) + "px");

    tooltip_div
        .style("top", (d3.event.pageY) - parseFloat(tooltip_div.style('height')) - 5 + "px");

    tooltip_div.select('svg')
        .style('width', '100%')
        .style('height', '100%');

    var style = getComputedStyle(d3.select(bar_chart_evidences_div_id).node());

    var tooltip_padding = 10;

    var text_max_state_before = tooltip_div.select('svg').append('text')
        .attr('font-size', font_size_bar - 4 + 'px')
        .attr('alignment-baseline', 'central')
        .text(current_evidence.max_state_without_current_evidence)
        .attr('text-anchor', 'start')
        .style("font-size", 16)
        .attr('transform', 'translate(' + tooltip_padding + ',' + (15) + ')')
        .style('fill', style.getPropertyValue('--main-font-color'))
        .style('font-weight', style.getPropertyValue("--highlight-font-weight"));

    var arrow_start = 2 * tooltip_padding + text_max_state_before.node().getComputedTextLength();

    var data = [
        {id: 2, name: 'arrow', path: 'M 0,0 m -5,-5 L 5,0 L -5,5 Z', viewbox: '-5 -5 10 10'}
    ];

    var lineFunction = d3.line()
        .x(function (d) {
            return d.x;
        })
        .y(function (d) {
            return d.y;
        });
    //.curve(d3.linear());

    var lineData = [
        {"x": arrow_start, "y": 15},
        {"x": arrow_start + 50, "y": 15},
        {"x": arrow_start + 50 - 5, "y": 10},
        {"x": arrow_start + 50, "y": 15},
        {"x": arrow_start + 50 - 5, "y": 20}
    ];

    var lineGraph = tooltip_div.select('svg').append("path")
        .attr("d", lineFunction(lineData))
        .attr("stroke", style.getPropertyValue('--main-font-color'))
        .attr("stroke-width", 1)
        .attr("fill", "none");


    var text_max_state_after = tooltip_div.select('svg').append('text')
        .attr('font-size', font_size_bar - 4 + 'px')
        .attr('alignment-baseline', 'central')
        .text(current_evidence.max_state_with_current_evidence)
        .attr('text-anchor', 'start')
        .style("font-size", 16)
        .attr('transform', 'translate(' + (tooltip_padding + 50 + arrow_start) + ',' + (15) + ')')
        .style('fill', 'black')//style.getPropertyValue('--main-font-color'))
        .style('font-weight', style.getPropertyValue("--highlight-font-weight"));


    tooltip_div.style('width', 2 * tooltip_padding + 50 + arrow_start + text_max_state_after.node().getComputedTextLength() + 'px');
    tooltip_div.style('height', 30 + 'px');


    tooltip_div.select('svg')
        .style('width', '100%')
        .style('height', '100%');

    if (parseFloat(tooltip_div.style('left')) + parseFloat(tooltip_div.style('width')) > document.body.clientWidth - 5) {
        tooltip_div.style('left', document.body.clientWidth - parseFloat(tooltip_div.style('width')) - 5 + 'px');
    }
}


function show_tooltip_pie_chart_glyph(node_state, current_prob, last_prob) {
    remove_tooltip_content();

    tooltip_div.transition()
        .duration(duration_tooltip)
        .style("opacity", 1);
    tooltip_div
        .style("left", (d3.event.pageX) + 20 + "px")
        .style("top", (d3.event.pageY) + "px");

    tooltip_div
        .style("top", (d3.event.pageY) - parseFloat(tooltip_div.style('height')) - 5 + "px");

    tooltip_div.select('svg')
        .style('width', '100%')
        .style('height', '100%');

    var style = getComputedStyle(d3.select(bar_chart_evidences_div_id).node());

    var tooltip_padding = 10;


    let node_label_text = tooltip_div.select('svg').append('text')
        .attr('font-size', font_size_bar - 4 + 'px')
        .attr('alignment-baseline', 'central')
        .text(node_state)
        .attr('text-anchor', 'start')
        .style("font-size", 16)
        .attr('transform', 'translate(' + tooltip_padding + ',' + (15) + ')')
        .style('fill', style.getPropertyValue('--main-font-color'))
        .style('font-weight', style.getPropertyValue("--highlight-font-weight"));

    let max_width = 2 * tooltip_padding + node_label_text.node().getComputedTextLength();

    var text_max_state_before = tooltip_div.select('svg').append('text')
        .attr('font-size', font_size_bar - 4 + 'px')
        .attr('alignment-baseline', 'central')
        .style("font-size", 16)
        .text(function () {
            if (last_prob) {
                return (parseFloat(last_prob) * 100).toFixed(1) + "%"
            }
            return (parseFloat(current_prob) * 100).toFixed(1) + "%"
        })
        .attr('text-anchor', 'start')
        .attr('transform', 'translate(' + tooltip_padding + ',' + (40) + ')')
        .style('fill', style.getPropertyValue('--main-font-color'))
        .style('font-weight', style.getPropertyValue("--highlight-font-weight"));

    max_width = 2 * tooltip_padding + text_max_state_before.node().getComputedTextLength() > max_width ? 2 * tooltip_padding + text_max_state_before.node().getComputedTextLength() : max_width;

    if (last_prob) {
        var arrow_start = 2 * tooltip_padding + text_max_state_before.node().getComputedTextLength();

        var data = [
            {id: 2, name: 'arrow', path: 'M 0,0 m -5,-5 L 5,0 L -5,5 Z', viewbox: '-5 -5 10 10'}
        ];

        var lineFunction = d3.line()
            .x(function (d) {
                return d.x;
            })
            .y(function (d) {
                return d.y;
            });
        //.curve(d3.linear());

        var lineData = [
            {"x": arrow_start, "y": 40},
            {"x": arrow_start + 50, "y": 40},
            {"x": arrow_start + 50 - 5, "y": 35},
            {"x": arrow_start + 50, "y": 40},
            {"x": arrow_start + 50 - 5, "y": 45}
        ];

        var lineGraph = tooltip_div.select('svg').append("path")
            .attr("d", lineFunction(lineData))
            .attr("stroke", style.getPropertyValue('--main-font-color'))
            .attr("stroke-width", 1)
            .attr("fill", "none");


        var text_max_state_after = tooltip_div.select('svg').append('text')
            .attr('font-size', font_size_bar - 4 + 'px')
            .attr('alignment-baseline', 'central')
            .text((parseFloat(current_prob) * 100).toFixed(1) + "%")
            .attr('text-anchor', 'start')
            .style("font-size", 16)
            .attr('transform', 'translate(' + (tooltip_padding + 50 + arrow_start) + ',' + (40) + ')')
            .style('fill', 'black')//style.getPropertyValue('--main-font-color'))
            .style('font-weight', style.getPropertyValue("--highlight-font-weight"));

        max_width = 2 * tooltip_padding + 50 + arrow_start + text_max_state_after.node().getComputedTextLength() > max_width ? 2 * tooltip_padding + 50 + arrow_start + text_max_state_after.node().getComputedTextLength() : max_width;
    }

    tooltip_div.style('width', max_width + 'px');
    tooltip_div.style('height', 55 + 'px');


    tooltip_div.select('svg')
        .style('width', '100%')
        .style('height', '100%');

    if (parseFloat(tooltip_div.style('left')) + parseFloat(tooltip_div.style('width')) > document.body.clientWidth - 5) {
        tooltip_div.style('left', document.body.clientWidth - parseFloat(tooltip_div.style('width')) - 5 + 'px');
    }
}


function show_tooltip_only_text(text) {
    remove_tooltip_content();

    tooltip_div.transition()
        .duration(duration_tooltip)
        .style("opacity", 1);
    tooltip_div
        .style("left", (d3.event.pageX) + 20 + "px")
        .style("top", (d3.event.pageY) + "px");

    tooltip_div
        .style("top", (d3.event.pageY) - parseFloat(tooltip_div.style('height')) - 5 + "px");

    tooltip_div.select('svg')
        .style('width', '100%')
        .style('height', '100%');

    var style = getComputedStyle(d3.select(bar_chart_evidences_div_id).node());

    var tooltip_padding = 10;

    var text_max_state_before = tooltip_div.select('svg').append('text')
        .attr('font-size', font_size_bar - 4 + 'px')
        .attr('alignment-baseline', 'central')
        .text(text)
        .attr('text-anchor', 'start')
        .style("font-size", 16)
        .attr('transform', 'translate(' + tooltip_padding + ',' + (15) + ')')
        .style('fill', style.getPropertyValue('--main-font-color'))
        .style('font-weight', style.getPropertyValue("--highlight-font-weight"));

    var arrow_start = 2 * tooltip_padding + text_max_state_before.node().getComputedTextLength();

    tooltip_div.style('width', arrow_start + 'px');
    tooltip_div.style('height', 30 + 'px');


    tooltip_div.select('svg')
        .style('width', '100%')
        .style('height', '100%');

    if (parseFloat(tooltip_div.style('left')) + parseFloat(tooltip_div.style('width')) > document.body.clientWidth - 5) {
        tooltip_div.style('left', document.body.clientWidth - parseFloat(tooltip_div.style('width')) - 5 + 'px');
    }
}


function hide_tool_tip() {
    tooltip_div.transition()
        .duration(duration_tooltip)
        .style("opacity", 0);
}


function show_tool_tip_pie(current_node) {

    remove_tooltip_content();

    tooltip_div.transition()
        .duration(duration_tooltip)
        .style("opacity", 1);
    tooltip_div
        .style("left", (d3.event.pageX) + 20 + "px")
        .style("top", (d3.event.pageY) + "px");

    tooltip_div.style('width', 350 + 'px')
        .style('height', 260 + 'px');

    tooltip_div.select('svg')
        .style('width', tooltip_div.style('width'))//'100%')//tooltip_div.style('width'))
        .style('height', tooltip_div.style('height'));

    var style = getComputedStyle(d3.select(bar_chart_evidences_div_id).node());

    const padding_left = 15;
    const padding_top = 25;

    let padding_between = 100;
    for (let s_index_helper = 0; s_index_helper < current_node.states[0].length; s_index_helper++) {
        if (padding_between < current_node.states[0][s_index_helper].state.length * 11) {
            padding_between = current_node.states[0][s_index_helper].state.length * 11;
        }
    }

    padding_between += 50;

    let add_padding_between = 0;

    let max_y_size = 0;
    let max_x_size = 0;


    for (let index = 0; index < current_node.states.length; index++) {
        for (let states_index = 0; states_index < current_node.states[0].length; states_index++) {
            if (index === 0) {

                tooltip_div.select('svg').append('text')
                    .attr('text-anchor', 'start')
                    .attr('transform', 'translate(' + padding_left + ', ' + (states_index * 25 + padding_top) + ')')
                    .style('font-weight', 'bold')
                    .style("font-size", 16)
                    .text(current_node.states[0][states_index].state)
                    .style('fill', style.getPropertyValue('--main-font-color'))
                    .style('font-weight', style.getPropertyValue("--highlight-font-weight"));
            }

            add_padding_between = padding_between + padding_left

            if (index === 1) {
                add_padding_between = padding_between + padding_left + 100;
            }

            tooltip_div.select('svg').append('text')
                .attr('text-anchor', 'end')
                .attr('transform', 'translate(' + add_padding_between + ', ' + (states_index * 25 + padding_top) + ')')
                .style('font-weight', 'bold')
                .style("font-size", 16)
                .text((current_node.states[index][states_index].probability * 100).toFixed(1) + '%')
                .style('fill', style.getPropertyValue('--main-font-color'))
                .style('font-weight', style.getPropertyValue("--highlight-font-weight"));

            var color_range = colors_pies[index];

            var all_similar = true;

            if(index > 0) {
                for (let j = 0; j < current_node.states[0].length; j++) {
                    if (parseFloat(current_node.states[index][j].probability).toFixed(3) !== parseFloat(current_node.states[0][j].probability).toFixed(3)) {
                        all_similar = false;
                    }
                }
            }

            if (all_similar) {
                color_range = colors_pies[0];
            } else {
                color_range = colors_pies[1];
            }

            // colors for observed nodes
            if (current_node.isObserved[index]) {
                color_range = [d3.color(color_observed[0]), d3.color(color_observed[1])];
            }

            var color = d3.scaleLinear().domain([0, current_node.states[index].length - 1])
                .interpolate(d3.interpolateHcl)
                .range(color_range);

            tooltip_div.select('svg').append('rect')
                .style('width', 10)
                .style('height', 10)
                .style('fill', color(states_index))
                .attr('transform', 'translate(' + (add_padding_between + 10) + ', ' + (states_index * 25 + padding_top - 10) + ')');

            if (max_y_size < states_index * 25 + padding_top - 10) {
                max_y_size = states_index * 25 + padding_top - 10;
            }

            if (max_x_size < add_padding_between + 20) {
                max_x_size = add_padding_between + 20;
            }
        }
    }

    tooltip_div.style('width', (max_x_size + padding_left) + 'px')
        .style('height', (max_y_size + padding_top) + 'px');

    tooltip_div.select('svg')
        .style('width', (max_x_size + padding_left))
        .style('height', max_y_size + padding_top);

    tooltip_div
        .style("top", (d3.event.pageY) - parseFloat(tooltip_div.style('height')) - 20 + "px");

    if (parseFloat(tooltip_div.style('left')) + parseFloat(tooltip_div.style('width')) > document.body.clientWidth - 5) {
        tooltip_div.style('left', document.body.clientWidth - parseFloat(tooltip_div.style('width')) - 5 + 'px');
    }
}

function create_text_pie_tooltip(current_node, div_for_text_pie, dont_show_node_label) {

    var max_state = current_node.states[0].reduce(function (prev, current) {
        return (prev.probability > current.probability) ? prev : current
    }); //returns object

    const margin = 100;
    var outer_radius = parseFloat(div_for_text_pie.style('width')) / 2 - margin;

    if (!dont_show_node_label) {
        // initialize text in tooltip
        div_for_text_pie.select('svg')
            .append('text')
            .attr('text-anchor', 'middle')
            .attr('transform', 'translate(' + parseFloat(div_for_text_pie.style('width')) / 2 + ', 13)')
            .style('font-weight', 'bold')
            .style("font-size", 16)
            .text(lookup_table_get_name_by_id(current_node.node_label));//current_node.node_label);
    }

    let inner_radius = 0;

    for (var i = 0; i < current_node.states.length; i++) {
        var color_range = colors_pies[0];//[d3.color(type.color[i][0]), d3.color(type.color[i][1])];


        if (i > 0) {
            var all_similar = true;

            for (var j = 0; j < current_node.states[0].length; j++) {
                if (parseFloat(current_node.states[i][j].probability).toFixed(3) !== parseFloat(current_node.states[0][j].probability).toFixed(3)) {
                    all_similar = false;
                }
            }

            if (all_similar) {
                color_range = colors_pies[0];//[d3.color(type.color[0][0]), d3.color(type.color[0][1])];
            } else {
                color_range = colors_pies[1];
            }
        }
        // colors for observed nodes
        if (current_node.isObserved[i]) {
            color_range = [d3.color(color_observed[0]), d3.color(color_observed[1])];
        }

        var color = d3.scaleLinear().domain([0, current_node.states[i].length - 1])
            .interpolate(d3.interpolateHcl)
            .range(color_range);

        for (var dataset_index = 0; dataset_index < current_node.states[i].length; dataset_index++) {
            current_node.states[i][dataset_index].index = i;
        }


        var outer_radius_for_current = outer_radius;
        var inner_radius_for_current = 0;

        if (current_node.states.length > 1 && i === 1) {
            outer_radius_for_current = outer_radius / 2//outer_radius_old_pie;//outer_radius/4;

            //inner_radius_for_current = outer_radius/(i+1)+2;
        }
        if (current_node.states.length > 1 && i === 0) {

            inner_radius_for_current = outer_radius / 2 + 1;//outer_radius_old_pie + 1;//outer_radius/(4)+2;
            inner_radius = inner_radius_for_current;
        }

        drawPieChart(div_for_text_pie, current_node, outer_radius_for_current, inner_radius_for_current, max_state, i, color);//colorScale_background);
    }

    //pie chart
    var pie = d3.pie()
        .value(function (d) {
            return d.probability;
        })
        .sort(null);

    let arc = d3.arc()
        .innerRadius(inner_radius)
        .outerRadius(outer_radius);

    var outerArc = d3.arc()
        .innerRadius(outer_radius * 1.1)
        .outerRadius(outer_radius * 1.1);

    // Add the polylines between chart and labels:
    div_for_text_pie.select('svg').select('g')
        .selectAll('allPolylines')
        .data(pie(current_node.states[0]))
        .enter()
        .append('polyline')
        .attr("stroke", "black")
        .style("fill", "none")
        .attr("stroke-width", 1)
        .attr('points', function (d) {
            var posA = arc.centroid(d) // line insertion in the slice
            var posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
            var posC = outerArc.centroid(d); // Label position = almost the same as posB
            var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
            posC[0] = outer_radius * 1.35 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left

            return [posA, posB, posC]
        })
        .attr('transform', 'translate(' + (parseFloat(div_for_text_pie.style("width")) / 2) + ',' + (parseFloat(div_for_text_pie.style("height")) / 2) + ')');

    // Add the polylines between chart and labels:
    let text_labels = div_for_text_pie.select('svg').select('g')
        .selectAll('allLabels')
        .data(pie(current_node.states[0]))
        .enter()
        .append('text')
        .style("font-size", 16)
        .text(function (d) {
            let label_string = d.data.state;
            if (label_string.length > 10) {
                label_string = label_string.substring(0, 10) + '...'
            }
            return label_string;
        })
        .attr('transform', function (d) {
            var pos = outerArc.centroid(d);
            var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
            pos[0] = outer_radius * 1.4 * (midangle < Math.PI ? 1 : -1);

            let x_pos_translate = parseFloat(div_for_text_pie.style("width")) / 2 + pos[0];
            return 'translate(' + x_pos_translate + ',' + (parseFloat(div_for_text_pie.style("height")) / 2 + pos[1]) + ')';
        })
        .style('text-anchor', function (d) {
            var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
            return (midangle < Math.PI ? 'start' : 'end')
        });

    // relax the label!
    var alpha = 1,
        spacing = 10;

    function relax() {
        var again = false;
        text_labels.each(function (d, i) {
            var a = this,
                da = d3.select(a),
                y1 = da.attr('y');
            text_labels.each(function (d, j) {
                var b = this;
                if (a === b) {
                    return;
                }

                let db = d3.select(b);
                if (da.attr('text-anchor') !== db.attr('text-anchor')) {
                    return;
                }

                var y2 = db.attr('y');
                let deltaY = y1 - y2;

                if (Math.abs(deltaY) > spacing) {
                    return;
                }

                again = true;
                let sign = deltaY > 0 ? 1 : -1;
                var adjust = sign * alpha;
                da.attr('y', +y1 + adjust);
                db.attr('y', +y2 - adjust);
            });
        });

        if (again) {
            var labelElements = text_labels[0];
            // lines.attr('y2', function(d, i) {
            //     var labelForLine = d3.select(labelElements[i]);
            //     return labelForLine.attr('y');
            // });
            setTimeout(relax, 2);
        }
    }

    //relax();

    // initialize text in tooltip
    div_for_text_pie.select('svg')
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('transform', 'translate(' + parseFloat(div_for_text_pie.style('width')) / 2 + ', ' + (parseFloat(div_for_text_pie.style('height')) - 6) + ')')
        .style("font-size", 16)
        .text(function () {
            if (max_state.state === undefined) {
                return max_state.name + ': ' + (max_state.probability * 100).toFixed(1) + '%';
            }
            return max_state.state + ': ' + (max_state.probability * 100).toFixed(1) + '%';
        });

}