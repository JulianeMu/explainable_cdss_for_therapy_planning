/**
 * Created by Jule on 26.07.17.
 */


var node_padding = 35;
var path_index_split = '_index';
var radius_space_to_div = 55;
var min_radius = 10;
var min_width_height_donut = 75;
var font_size = '1.05em';


var children_type = 'children';
var current_node_type = 'current_node';
var parent_type = 'parent_type';

const splitter = "___";
const state_label = "state";

/**
 * This function creates a donut chart including click action
 * @param current_node        node name/id
 * @param dataset   state names and probabilities
 * @param type
 */
function create_donut(current_node, dataset, type, div_chart, boolean_create_click_animation) {

    // translate UICC_stage__patient to therapy state
    // just for Statusseminar
    // if (current_node.id === 'UICC_stage__patient') {
    //     for (var i = 0; i < dataset.length; i++) {
    //         dataset[i] = new_therapy_states;
    //     }
    // }

    //get div width and height
    var div_width = parseFloat(div_chart.style("width"));
    var div_height = parseFloat(div_chart.style("height"));

    // get minimum of div height and width
    var min_div_height_width = Math.min(div_height, div_width) - radius_space_to_div;

    var outerRadius = min_div_height_width / 2;


    // set inner radius to 0 in case of not enough space
    var inner_text_shown = 0;

    if (outerRadius < min_radius) {
        outerRadius = min_radius;
        min_div_height_width = min_radius * 2;
        inner_text_shown = 0;
    }


    //if there is enough space do this
    if (min_div_height_width >= min_width_height_donut) {
        inner_text_shown = 1;
    }


    var transform_x = div_width / 2 - min_div_height_width / 2;
    var text_anchor = 'middle';
    var transform_x_text = div_width / 2;

    var transform_y_text = div_height / 2 - min_div_height_width / 2;

    if (type.type === parent_type) {
        transform_x = div_width - min_div_height_width - node_padding;
        text_anchor = 'end';
        transform_x_text = div_width - node_padding;

        if (outerRadius <= min_radius) {
            transform_x_text -= (2 * outerRadius + 10);
            transform_y_text = 0;
        }

    } else if (type.type === children_type) {
        transform_x = node_padding;
        text_anchor = 'start';
        transform_x_text = node_padding;


        if (outerRadius <= min_radius) {
            transform_x_text += (2 * outerRadius + 10);
            transform_y_text = 0;
        }
    }

    var transform_y = div_height / 2 - min_div_height_width / 2;


    var svg = div_chart
        .append('svg')
        .attr('id', type.type + "")
        .attr('width', div_width + 'px')
        .attr('height', min_div_height_width + 'px')
        .attr('transform', 'translate(' + transform_x +
            ',' + transform_y + ')');

    var outer_inner_radius = calculate_layout_of_states(dataset.length, inner_text_shown, outerRadius);

    var svg_node_text = div_chart
        .append('svg')
        .attr('id', "node_text")
        .attr('width', div_width)
        .attr('height', 20 + 'px')
        .attr('transform', 'translate(' + 0 +
            ',' + transform_y_text + ')');

    // node name
    var text_node_name = svg_node_text.append("text")
        .attr('id', 'node_name')
        .attr("text-anchor", 'start')
        .attr('font-size', font_size)
        .attr('y', '0.3em')
        .attr('font-weight', 700)
        .text(function (d) {
            console.log(current_node)
            return current_node.name;
        })
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


    for (var i = dataset.length - 1; i > -1; i--) {

        var color_range = [d3.color(type.color[i][0]), d3.color(type.color[i][1])];

        if (i > 0) {
            var all_similar = true;

            for (var j = 0; j < dataset[0].length; j++) {
                if (parseFloat(dataset[i][j].probability).toFixed(3) !== parseFloat(dataset[0][j].probability).toFixed(3)) {
                    all_similar = false;
                }
            }

            if (all_similar) {
                color_range = [d3.color(type.color[0][0]), d3.color(type.color[0][1])];
            }
        }
        // colors for observed nodes
        if (current_node.isObserved[i]) {
            color_range = [d3.color(color_observed[0]), d3.color(color_observed[1])];
        }

        var color = d3.scaleLinear().domain([0, dataset[i].length - 1])
            .interpolate(d3.interpolateHcl)
            .range(color_range);

        for (var dataset_index = 0; dataset_index < dataset[i].length; dataset_index++) {
            dataset[i][dataset_index].index = i;
        }
        drawPieChart(dataset[i], outer_inner_radius[i].outerRadius, outer_inner_radius[i].innerRadius, i);

        if (i === 0) {
            /* ------- TEXT LABELS -------*/

            var max_value = Math.max.apply(Math, dataset[i].map(function (o) {
                return o.probability;
            }));

            var result = dataset[i].filter(function (obj) {
                return parseFloat(obj.probability) === max_value;
            });


            // inner circle text labels in case of enough space
            // most probable node state and probability

            if (min_div_height_width >= min_width_height_donut) {

                svg.append("text")
                    .attr('id', 'most_probable_state')
                    .attr("text-anchor", "middle")
                    .attr('font-size', font_size)
                    .attr('y', '-0.3em')
                    .attr('font-weight', 400)
                    .text(function (d) {
                        return result[0].name
                    })
                    .attr('transform', 'translate(' + (min_div_height_width / 2) +
                        ',' + (min_div_height_width / 2) + ')');

                svg.append("text")
                    .attr('id', 'most_probable_state')
                    .attr("text-anchor", "middle")
                    .attr('font-size', font_size)
                    .attr('y', '1em')
                    .attr('font-weight', 400)
                    .text((parseFloat(result[0].probability) * 100).toFixed(1) + "%")
                    .attr('transform', 'translate(' + (min_div_height_width / 2) +
                        ',' + (min_div_height_width / 2) + ')');
            }

        }


    }


    function drawPieChart(dataset_current, outerRadius, innerRadius, index) {

        var pie = d3.pie()
            .value(function (d) {
                return d.probability;
            })
            .sort(null);


        var arc = d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius - 1);

        var g = svg.selectAll(".arc")
            .data(pie(dataset_current))
            .enter().append("g");


        var path = g.append('path')
            .attr('id', function (d) {
                return current_node.id + 'node_' + index + splitter + state_label + splitter + current_node.states[index].indexOf(d.data)
            })
            .attr('d', arc)
            .attr('fill', function (d) {

                if (index > 0) {

                    var higher_similar_less = 'higher';

                    if (parseFloat(dataset[index][d.index].probability).toFixed(3) < parseFloat(dataset[0][d.index].probability).toFixed(3)) {
                        higher_similar_less = 'less';
                    } else if (parseFloat(dataset[index][d.index].probability).toFixed(3) === parseFloat(dataset[0][d.index].probability).toFixed(3)) {
                        higher_similar_less = 'similar';
                    }

                    if (higher_similar_less === 'similar') {
                        return color(dataset_current.indexOf(d.data));
                    } else {

                        var t = textures.lines()
                            .lighter()
                            .size(8)
                            .orientation(texture_orientation_bigger)
                            .background(color(dataset_current.indexOf(d.data)));

                        if (higher_similar_less === 'less') {
                            t = textures.lines()
                                .lighter()
                                .size(8)
                                .orientation(texture_orientation_smaller)
                                .background(color(dataset_current.indexOf(d.data)));
                        }

                        g.call(t);
                        return t.url();
                    }
                } else {
                    return color(dataset_current.indexOf(d.data));
                }
            })
            .attr("opacity", 0.8)
            .attr('transform', 'translate(' + (min_div_height_width / 2) +
                ',' + (min_div_height_width / 2) + ')');

        /*--------------------------------------------------on click animation----------------------------------------------------*/

        if (!boolean_create_click_animation) {
            animation_on_click(current_node.id, calculated_node_objects_per_div[get_index_of_chart_div_id(get_chart_div_id_by_div(div_chart.node()))].calculated_node_objects, get_chart_div_id_by_div(div_chart.node()));
        }
        /*--------------------------------------------------on mouse over animation----------------------------------------------------*/

        path.on('mouseover', function (d) {

            for (let i=0; i< 2; i++) {
                let id_splitted = d3.select(this).attr('id').split(splitter + state_label );
                let current_id = id_splitted[0].slice(0, -1) + i + splitter + state_label  + id_splitted[1];

                d3.select('#' + current_id).attr('opacity', 1).style('stroke', 'black');
            }

            let last_prob = undefined;
            if (current_node.states.length>1) {
                last_prob = current_node.states[1].filter(x => x.name === d.data.name)[0].probability;
            }

            show_tooltip(d.data.name, current_node.states[0].filter(x => x.name === d.data.name)[0].probability, last_prob, this, true);

            //show_tooltip(d.data.name + ": " + (parseFloat(d.data.probability) * 100).toFixed(1) + "%", this, true);
        });

        path.on('mousemove', function (d) {

            for (let i=0; i< 2; i++) {
                let id_splitted = d3.select(this).attr('id').split(splitter + state_label );
                let current_id = id_splitted[0].slice(0, -1) + i + splitter + state_label  + id_splitted[1];
                d3.select('#' + current_id).attr('opacity', 1).style('stroke', 'black');
            }

            let last_prob = undefined;
            if (current_node.states.length>1) {
                last_prob = current_node.states[1].filter(x => x.name === d.data.name)[0].probability;
            }
            show_tooltip(d.data.name, current_node.states[0].filter(x => x.name === d.data.name)[0].probability, last_prob, this);

            //move_tooltip(d.data.name + ": " + (parseFloat(d.data.probability) * 100).toFixed(1) + "%", this);
        });

        path.on('mouseout', function () {
            for (let i=0; i< 2; i++) {
                let id_splitted = d3.select(this).attr('id').split(splitter + state_label );
                let current_id = id_splitted[0].slice(0, -1) + i + splitter + state_label  + id_splitted[1];
                d3.select('#' + current_id).attr('opacity', 0.8).style('stroke', 'none');
            }
            hide_tooltip(this, true);
        });

        /********************** for app usage *************************************/
        path.on('dbclick', function (d) {

            if (tooltip.style('display') === 'none') {
                show_tooltip(d.data.name + ": " + (parseFloat(d.data.probability) * 100).toFixed(1) + "%", this, true);
            } else {
                hide_tooltip(this, true);
            }

        });
    }
}

function get_position_of_tooltip() {

}

function calculate_layout_of_states(dataset_length, inner_text_shown, outerRadius) {

    var pow_variable = 1.8;
    // circle width is calculated as follows:
    // 1a + 1/2a + 1/4 a + ... = outerRadius
    // width_inner_circle = a
    var helper_variable_to_calculate_inner_circle = 0;
    for (var i = 0; i < dataset_length + inner_text_shown; i++) {
        helper_variable_to_calculate_inner_circle += 1 / Math.pow(pow_variable, i);
    }

    var width_inner_circle = outerRadius / helper_variable_to_calculate_inner_circle;

    var outer_inner_radius = [];
    var innerRadius = outerRadius;
    for (var i = 0; i < dataset_length; i++) {
        var pieWidth = width_inner_circle / Math.pow(pow_variable, i + inner_text_shown);
        outerRadius = innerRadius;
        innerRadius = outerRadius - pieWidth;
        outer_inner_radius[i] = {
            outerRadius: outerRadius,
            innerRadius: innerRadius
        };
    }


    return outer_inner_radius;
}
