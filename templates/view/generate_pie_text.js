var outer_radius_old_pie = 12;

function create_text_pie(current_node, div_for_text_pie, dont_show_node_label) {

    var max_state = current_node.states[0].reduce(function (prev, current) {
        return (prev.probability > current.probability) ? prev : current
    }); //returns object


    var outer_radius = parseFloat(div_for_text_pie.style('height')) / 2 - 21;

    if (!dont_show_node_label) {
        // initialize text in tooltip
        div_for_text_pie.select('svg')
            .append('text')
            .attr('text-anchor', 'middle')
            .attr('transform', 'translate(' + parseFloat(div_for_text_pie.style('width')) / 2 + ', 13)')
            .style('font-weight', 'bold')
            .text(lookup_table_get_name_by_id(current_node.node_label));//current_node.node_label);
    } else {
        outer_radius = Math.min(parseFloat(div_for_text_pie.style('width')), parseFloat(div_for_text_pie.style('height'))) / 2 - 21;
    }

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
        }
        drawPieChart(div_for_text_pie, current_node, outer_radius_for_current, inner_radius_for_current, max_state, i, color);//colorScale_background);
    }
    //drawPieChart(div_for_text_pie, current_node, outer_radius, 50, max_state, 0);


    // initialize text in tooltip
    div_for_text_pie.select('svg')
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('transform', 'translate(' + parseFloat(div_for_text_pie.style('width')) / 2 + ', ' + (20 + 2 * outer_radius + 17) + ')')
        .text(function () {
            if (max_state.state === undefined) {
                return max_state.name + ': ' + (max_state.probability * 100).toFixed(1) + '%';
            }
            return max_state.state + ': ' + (max_state.probability * 100).toFixed(1)  + '%';
        });

    // div_for_text_pie.select('svg').selectAll('text')
    //     .on('mousemove', function () {
    //         show_tool_tip_pie(current_node);
    //     })
    //     .on('mouseout', function () {
    //         hide_tool_tip();
    //     });
}

const splitter = "___";
const state_label = "state";
function drawPieChart(div_for_text_pie, current_node, outer_radius, innerRadius, max_state, index, colorScale) {

    //pie chart
    var pie = d3.pie()
        .value(function (d) {
            return d.probability;
        })
        .sort(null);


    arc = d3.arc().innerRadius(innerRadius)
        .outerRadius(outer_radius);

    var g = div_for_text_pie.select('svg').selectAll(".arc")
        .data(pie(current_node.states[index]))
        .enter().append("g");

    var path = g.append('path')
        .attr('d', arc)
        .attr('id', function (d) {
            return current_node.node_id + tooltip_pie_ending + 'node_' + index + splitter + state_label + splitter + current_node.states[index].indexOf(d.data)
        })
        .attr('fill', function (d) {
            if (index > 0) {

                var higher_similar_less = 'higher';

                if (parseFloat(current_node.states[index][d.index].probability).toFixed(3) < parseFloat(current_node.states[0][d.index].probability).toFixed(3)) {
                    higher_similar_less = 'less';
                } else if (parseFloat(current_node.states[index][d.index].probability).toFixed(3) === parseFloat(current_node.states[0][d.index].probability).toFixed(3)) {
                    higher_similar_less = 'similar';
                }

                if (higher_similar_less === 'similar') {
                    return colorScale(current_node.states[index].indexOf(d.data));
                } else {

                    const texture_orientation_smaller = "diagonal" ;
                    const texture_orientation_bigger = "6/8";//"3/8";

                    let t = textures.lines()
                        .lighter()
                        .size(8)
                        .orientation(texture_orientation_bigger)
                        .background(colorScale(current_node.states[index].indexOf(d.data)));

                    if (higher_similar_less === 'less') {
                        t = textures.lines()
                            .lighter()
                            .size(8)
                            .orientation(texture_orientation_smaller)
                            .background(colorScale(current_node.states[index].indexOf(d.data)));
                    }

                    g.call(t);
                    return t.url();
                }
            } else {
                return colorScale(current_node.states[index].indexOf(d.data));
            }
            //return colorScale_background((1 / (current_node.states[index].length - 1)) * current_node.states[index].indexOf(d.data));
        })
        .attr("opacity", 0.9)//max_state.probability)
        .attr('transform', function () {
            return 'translate(' + (parseFloat(div_for_text_pie.select('svg').style('width')) / 2) +
                ',' + (parseFloat(div_for_text_pie.select('svg').style('height')) / 2) + ')'
        });
//(outer_radius + 20) + ')')
//.attr('stroke', colorScale(current_node.states[index].length))//colorScale_background(1))
//.attr('stroke-opacity', max_state.probability);

//------------------------------------------------------------------------------------


// var path = g.append('path')
//     .attr('id', type.type + path_index_split + index)
//     .attr('d', arc)
//     .attr('fill', function (d) {
//
//         if (index > 0) {
//
//             var higher_similar_less = 'higher';
//
//             if (parseFloat(dataset[index][d.index].probability).toFixed(3) < parseFloat(dataset[0][d.index].probability).toFixed(3)) {
//                 higher_similar_less = 'less';
//             } else if (parseFloat(dataset[index][d.index].probability).toFixed(3) === parseFloat(dataset[0][d.index].probability).toFixed(3)) {
//                 higher_similar_less = 'similar';
//             }
//
//             if (higher_similar_less === 'similar') {
//                 return color(dataset_current.indexOf(d.data));
//             } else {
//
//                 var t = textures.lines()
//                     .lighter()
//                     .orientation(texture_orientation_bigger)
//                     .background(color(dataset_current.indexOf(d.data)));
//
//                 if (higher_similar_less === 'less') {
//                     t = textures.lines()
//                         .lighter()
//                         .orientation(texture_orientation_smaller)
//                         .background(color(dataset_current.indexOf(d.data)));
//                 }
//
//                 g.call(t);
//                 return t.url();
//             }
//         } else {
//             return color(dataset_current.indexOf(d.data));
//         }
//     })
//     .attr("opacity", 0.8)
//     .attr('transform', 'translate(' + (min_div_height_width / 2) +
//         ',' + (min_div_height_width / 2) + ')');

    /*--------------------------------------------------on mouse over animation----------------------------------------------------*/

    path.on('mousemove', function (d) {

        for (let i=0; i< 2; i++) {
            let id_splitted = d3.select(this).attr('id').split(splitter + state_label );
            let current_id = id_splitted[0].slice(0, -1) + i + splitter + state_label  + id_splitted[1];
            d3.select('#' + current_id).attr('opacity', 1).style('stroke', 'black');
        }

        let last_prob = undefined;
        if (current_node.states.length>1) {
            last_prob = current_node.states[1].filter(x => x.state === d.data.state)[0].probability;
        }
        show_tooltip_pie_chart_glyph(d.data.state, current_node.states[0].filter(x => x.state === d.data.state)[0].probability, last_prob)
        //show_tooltip_only_text(d.data.state + ": " + (parseFloat(d.data.probability) * 100).toFixed(1) + "%", this);
    });

    path.on('mouseout', function () {
        hide_tool_tip();
        for (let i=0; i< 2; i++) {
            let id_splitted = d3.select(this).attr('id').split(splitter + state_label );
            let current_id = id_splitted[0].slice(0, -1) + i + splitter + state_label  + id_splitted[1];
            d3.select('#' + current_id).attr('opacity', 0.9).style('stroke', 'none');
        }
    });
}