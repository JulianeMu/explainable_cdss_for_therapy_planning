var bar_chart_evidences_div_id = "#bar_chart_example";

var bar_chart_legend_div_id = "#bar_chart_legend";

var axis_height = 55;
var evidence_height = 30;
var font_size_bar = 15;
var width_line_without_text;
var width_text;
let width_bar = 120;

const recomm_changer_space = 65;
let x_pos_circles;

var bar_chart_element_id_ending = '_bar_chart_element';
var bar_chart_plot_id = 'bar_chart_plot';
var bar_chart_plot_negative_id = 'bar_chart_plot_negative';


const local_relevance_minus = 15;

function initialize_bar_chart_example(evidences) {

    var style = getComputedStyle(d3.select(bar_chart_evidences_div_id).node());
    //d3.select(bar_chart_evidences_div_id).style('height', parseFloat(d3.select('#plot').style('height')) -60+ 'px');



    var evidences_plot = d3.select(bar_chart_evidences_div_id).append('div')
        .attr('id', bar_chart_plot_id)
        .attr('class', 'bar_chart_plot')
        .style('width', 'calc(100%)')
        .style('height', 'calc(100% - ' + axis_height + 'px)')
        .style('position', 'relative')
        .style('float', 'top')
        .style('background-color', style.getPropertyValue('--element-background-color'))
        .style('overflow-y', 'auto');

    width_text = min_x + 25;
    x_pos_circles = width_bar + width_text + recomm_changer_space;

    //if (evidence_height * evidences.length > evidences_plot.node().getBoundingClientRect().height) {

        width_line_without_text = evidences_plot.node().getBoundingClientRect().width - x_pos_circles;

   // }

    var heading_svg = d3.select(bar_chart_legend_div_id).append('svg')
        .style('width', 'calc(100%)')
        .style('height', 'calc(100%)')
        .style('position', 'relative')
        .style('float', 'top')
        .style('background-color', style.getPropertyValue('--main-background-color'));

    heading_svg.append('text')
        .attr('font-size', font_size_bar - 4 + 'px')
        .attr('alignment-baseline', 'central')
        .text('sort by:')
        .attr('text-anchor', 'end')
        //.attr('font-weight', 800)
        .attr('font-size', '1em')
        .attr('transform', 'translate('+ (parseFloat(evidences_plot.node().getBoundingClientRect().width) - recomm_changer_space - 90 - 10) + ',' + 18 + ')')
        .style('fill', style.getPropertyValue('--main-font-color'));


    var select = d3.select(bar_chart_legend_div_id)
        .append('select')
        .attr('class', 'select')
        .attr('id', 'dropdown_menu_state')
        .style('top', 10 + 'px')
        .style('right', 20 + 'px')
        .style('max-width', 90 + 'px')
        .style('position', 'absolute');

    add_update_dropdown_menu_options(evidences[0].relevancies, evidences);


    heading_svg.append('text')
        .attr('font-size', font_size_bar - 4 + 'px')
        .attr('alignment-baseline', 'central')
        .text('evidence')
        .attr('font-size', '1em')
        .attr('text-anchor', 'start')
        .attr('transform', 'translate('+ 10 + ',' + 40 + ')')
        .style('fill', style.getPropertyValue('--main-font-color'));


    heading_svg.append('text')
        .attr('alignment-baseline', 'central')
        .text('|')
        .attr('font-size', '3em')
        .attr('text-anchor', 'start')
        .attr('transform', 'translate('+ (min_x - min_width_state-7 ) + ',' + 50 + ')')
        .style('fill', style.getPropertyValue('--main-font-color'))
        .style('opacity', 0.3);


    heading_svg.append('text')
        .attr('font-size', font_size_bar - 4 + 'px')
        .attr('alignment-baseline', 'central')
        .text('state')
        .attr('font-size', '1em')
        .attr('text-anchor', 'start')
        .attr('transform', 'translate('+ (min_x - min_width_state + 7) + ',' + 40 + ')')
        .style('fill', style.getPropertyValue('--main-font-color'));

    heading_svg.append('text')
        .attr('alignment-baseline', 'central')
        .text('|')
        .attr('font-size', '3em')
        .attr('text-anchor', 'start')
        .attr('transform', 'translate('+ (min_x ) + ',' + 50 + ')')
        .style('fill', style.getPropertyValue('--main-font-color'))
        .style('opacity', 0.3);

    heading_svg.append('text')
        .attr('font-size', font_size_bar - 4 + 'px')
        .attr('alignment-baseline', 'central')
        .text('recomm.')
        .attr('font-size', '1em')
        .attr('text-anchor', 'start')
        .attr('transform', 'translate('+ (width_text - 10) + ',' + 40 + ')')
        .style('fill', style.getPropertyValue('--main-font-color'));

    heading_svg.append('text')
        .attr('alignment-baseline', 'central')
        .text('|')
        .attr('font-size', '3em')
        .attr('text-anchor', 'start')
        .attr('transform', 'translate('+ (width_text +recomm_changer_space - 15 ) + ',' + 50 + ')')
        .style('fill', style.getPropertyValue('--main-font-color'))
        .style('opacity', 0.3);

    heading_svg.append('text')
        .attr('font-size', font_size_bar - 4 + 'px')
        .attr('alignment-baseline', 'central')
        .text('changer')
        .attr('font-size', '1em')
        .attr('text-anchor', 'start')
        .attr('transform', 'translate('+ (width_text - 10) + ',' + 60 + ')')
        .style('fill', style.getPropertyValue('--main-font-color'));

    heading_svg.append('text')
        .attr('alignment-baseline', 'central')
        .text('global relevance')
        .attr('font-size', '1em')
        .attr('text-anchor', 'start')
        .attr('transform', 'translate('+ (width_text + recomm_changer_space ) + ',' + 40 + ')')
        .style('fill', style.getPropertyValue('--main-font-color'));


    var linearGradient_new = heading_svg.append("defs")
        .append("linearGradient")
        .attr("id", "linear-gradient_new")
        .attr("gradientTransform", "rotate(0)");

    linearGradient_new = update_color_gradient(1, 0, linearGradient_new);


    // relevance axis
    var relevance_axis_svg = heading_svg.append('svg')
        .style('width', width_bar + 'px') //Math.floor(width_line_without_text) + 'px')
        .attr('height', '100%')
        .attr('x', width_text + recomm_changer_space + 'px')
        .attr('y', 55+'px');


    relevance_axis_svg
        .append('rect')
        .style('width', width_bar + 'px') //Math.floor(width_line_without_text) + 'px')
        .attr('height', '10px')
        .style('fill', 'url(#linear-gradient_new)');

    heading_svg.append('text')
        .attr('alignment-baseline', 'central')
        .text('|')
        .attr('font-size', '3em')
        .attr('text-anchor', 'start')
        .attr('transform', 'translate('+ x_pos_circles + ',' + 50 + ')')
        .style('fill', style.getPropertyValue('--main-font-color'))
        .style('opacity', 0.3);

    heading_svg.append('text')
        .attr('id', 'local_relevance_to_text')
        .attr('font-size', font_size_bar - 4 + 'px')
        .attr('alignment-baseline', 'central')
        .text('local relevance to \u00A0 \u00A0"' + selected_outcome_node_and_evidences[0].node_label + '"\u00A0 \u00A0 states')
        .attr('font-size', '1em')
        .attr('text-anchor', 'middle')
        .attr('transform', 'translate('+ (x_pos_circles + width_line_without_text/2 ) + ',' + 40 + ')')
        .style('fill', style.getPropertyValue('--main-font-color'));

    update_bar_chart(evidences);

    var axis_div = d3.select(bar_chart_evidences_div_id).append('div')
        .attr('id', 'bar_chart_axis')
        .style('width', '100%')
        .style('height', axis_height - 1 + 'px')
        .style('position', 'relative')
        .style('float', 'bottom')
        .style('overflow-y:', 'hidden')
        .style('padding-top', '10px')
        .style('background-color', style.getPropertyValue("--main-background-color"));


    var axis_svg = axis_div.append('svg')
        .attr('id', 'axis_div')
        .attr('width', '100%')
        .attr('height', '100%');

    /*// left side of axis div_relevance
    axis_svg.append('rect')
        .style('width', 15 + 'px')
        .attr('height', '10px')
        .style('fill', colorScale_rainbow(0));

    axis_svg.append('text')
        .attr('font-size', font_size_bar - 4 + 'px')
        .attr('alignment-baseline', 'central')
        .text('global relevance')
        .attr('text-anchor', 'start')
        .attr('transform', 'translate(22,' + 5 + ')')
        .style('fill', style.getPropertyValue('--main-font-color'));*/

   /* var linearGradient_new = axis_svg.append("defs")
        .append("linearGradient")
        .attr("id", "linear-gradient_new")
        .attr("gradientTransform", "rotate(0)");

    linearGradient_new = update_color_gradient(1, 0, linearGradient_new); */


    /*// relevance axis
    var relevance_axis_svg = axis_svg.append('svg')
        .style('width', width_bar + 'px') //Math.floor(width_line_without_text) + 'px')
        .attr('height', '100%')
        .attr('x', width_text + recomm_changer_space + 'px');


    relevance_axis_svg
        .append('rect')
        .style('width', width_bar + 'px') //Math.floor(width_line_without_text) + 'px')
        .attr('height', '10px')
        .style('fill', 'url(#linear-gradient_new)');*/

    /*//append ticks
    relevance_axis_svg.append('text')
        .attr('font-size', font_size_bar - 4 + 'px')
        .attr('alignment-baseline', 'central')
        .text('not relevant')
        .attr('text-anchor', 'start')
        .attr('transform', 'translate(0,' + (evidence_height / 2 + 5) + ')')
        .style('fill', style.getPropertyValue('--main-font-color'));

    relevance_axis_svg.append('text')
        .attr('font-size', font_size_bar - 4 + 'px')
        .attr('alignment-baseline', 'central')
        .text('relevant')
        .attr('text-anchor', 'middle')
        .attr('transform', 'translate(' + (Math.floor(width_line_without_text) / 2) + ',' + (evidence_height / 2 + 5) + ')')
        .style('fill', style.getPropertyValue('--main-font-color'));

    relevance_axis_svg.append('text')
        .attr('font-size', font_size_bar - 4 + 'px')
        .attr('alignment-baseline', 'central')
        .text('highly relevant')
        .attr('text-anchor', 'end')
        .attr('transform', 'translate(' + Math.floor(width_line_without_text) + ',' + (evidence_height / 2 + 5) + ')')
        .style('fill', style.getPropertyValue('--main-font-color'));
*/
    // left side of axis div_relevance
    axis_svg.append('circle')
        .attr("cx", 10)
        .attr("cx", 10)
        .attr("cy", 10)
        .attr('r', 5 + 'px')
        .style("stroke-width", circle_stroke_width)
        .style("stroke", colorScale_rainbow(1))
        .style('fill', colorScale_rainbow(1));

    axis_svg.append('text')
        .attr('font-size', font_size_bar - 4 + 'px')
        .attr('alignment-baseline', 'central')
        .text('indicating for:')
        .attr('text-anchor', 'start')
        .attr('font-size', '1em')
        .attr('transform', 'translate(22,' + 10 + ')')
        .style('fill', style.getPropertyValue('--main-font-color'));

    // left side of axis div_relevance
    axis_svg.append('circle')
        .attr("cx", 10)
        .attr("cy", 35)
        .attr('r', 5 + 'px')
        .style("stroke-width", circle_stroke_width)
        .style("stroke", colorScale_rainbow(1))
        .style('fill', style.getPropertyValue('--element-background-color'));

    axis_svg.append('text')
        .attr('font-size', font_size_bar - 4 + 'px')
        .attr('alignment-baseline', 'central')
        .text('indicating against:')
        .attr('font-size', '1em')
        .attr('text-anchor', 'start')
        .attr('transform', 'translate(22,' + (35) + ')')
        .style('fill', style.getPropertyValue('--main-font-color'));

    let state_axis_svg_top = heading_svg.append('svg')
        .attr('id', 'state_axis_svg_top')
        .style('width', Math.floor(width_line_without_text) + 'px')
        .attr('height', 50+'%')
        .attr('y', 47+'px')
        .attr('x', x_pos_circles + 'px');

    // state axis
    let state_axis_svg = axis_svg.append('svg')
        .attr('id', 'state_axis_svg')
        .style('width', Math.floor(width_line_without_text) + 'px')
        .attr('height', '100%')
        .attr('x', x_pos_circles + 'px');


    add_update_state_axis_top(evidences[0].relevancies);
    add_update_state_axis(evidences[0].relevancies);

    /*axis_svg.append('circle')
        .attr("cx", 180)
        .attr("cy", evidence_height + 65)
        .attr('r', 5 + 'px')
        .style("stroke-width", circle_stroke_width)
        .style("stroke", 'grey')
        .style('fill', 'grey');

    axis_svg.append('text')
        .attr('font-size', font_size_bar - 4 + 'px')
        .attr('alignment-baseline', 'central')
        .text('recommendation changer')
        .attr('text-anchor', 'start')
        .attr('transform', 'translate(5,' + (evidence_height + 65) + ')')
        .style('fill', style.getPropertyValue('--main-font-color'));*/

    create_side_nav('plot');

    var evidences_plot_negative = d3.select(bar_chart_evidences_div_id).append('div')
        .attr('id', bar_chart_plot_negative_id)
        .attr('class', 'bar_chart_plot')
        .style('width', 'calc(100%)')
        .style('height', 0 + 'px)')
        .style('position', 'relative')
        .style('float', 'top')
        .style('background-color', style.getPropertyValue('--element-background-color'))
        .style('overflow-y', 'auto');

}


function add_bar_chart_line(current_evidence, evidences_plot, i) {

    var style = getComputedStyle(d3.select(bar_chart_evidences_div_id).node());

    // max state
    var max_node_state = current_evidence.states[0].reduce(function (prev, current) {
        return (prev.probability > current.probability) ? prev : current
    });

    var node_line_svg = evidences_plot.append('svg')
        .attr('id', current_evidence.node_id + bar_chart_element_id_ending)
        .style('width', '100%')
        .style('height', evidence_height + 'px')
        .style('position', 'absolute')
        .style('background-color', function () {
            if (current_evidence.is_virtual_evidence) {
                return virtual_evidence_highlighting_color;
            } else {
                if (i % 2 === 0) {
                    return '#f0f4f9';
                } else {
                    return "#e9eef6";
                }
            }
        })
        .attr('x', 0 + 'px')
        .style('top', i * evidence_height + i * 5 + 'px')
        .on('click', function () {
            update_structured_exploration(current_evidence.node_id);
        })
        .on('mouseover', function () {
            d3.select(this).style('background-color', d3.rgb(d3.select(this).style('background-color')).darker(0.3));
        })
        .on('mouseout', function () {
            d3.select(this).style('background-color', d3.rgb(d3.select(this).style('background-color')).brighter(0.3));
        });

    node_line_svg.append('text')
        .attr('id', 'node_name_text')
        .attr('font-size', font_size_bar + 'px')
        .attr('alignment-baseline', 'central')
        .text(split_text_to_fill_the_width(lookup_table_get_name_by_id(current_evidence.node_label), font_size_bar, text_ending_node))
        .attr('transform', 'translate(10,' + evidence_height / 2 + ')')
        .style('fill', style.getPropertyValue('--main-font-color'))
        .on('mousemove', function () {
            show_tooltip_only_text(lookup_table_get_name_by_id(current_evidence.node_label) + ": " + current_evidence.states[0].filter(x => parseFloat(x.probability) === 1)[0].name);
        })
        .on('mouseout', function () {
            hide_tool_tip();
        });


    node_line_svg.append('text')
        .attr('id', 'node_state_text')
        .attr('font-size', font_size_bar + 'px')
        .attr('alignment-baseline', 'central')
        .text(function () {
            return split_text_to_fill_the_width(lookup_table_get_name_by_id(max_node_state.name), font_size_bar, text_ending_state)
        })
        .attr('transform', 'translate(' + (min_x - min_width_state + 7) + ',' + evidence_height / 2 + ')')
        .style('fill', style.getPropertyValue('--navbar-highlight-font-color'))
        .on('mousemove', function () {
            show_tooltip_only_text(lookup_table_get_name_by_id(current_evidence.node_label) + ": " + current_evidence.states[0].filter(x => parseFloat(x.probability) === 1)[0].name);
        })
        .on('mouseout', function () {
            hide_tool_tip();
        });


    var fill_color = colorScale_rainbow(current_evidence.overall_relevance);

    // resulting_in_evidence_change
    node_line_svg.append('circle')
        .attr('id', 'resulting_in_evidence_change')
        .attr("cx", width_text + recomm_changer_space/2 - 15)
        .attr("cy", 15)
        .attr('r', function () {
            if (current_evidence.resulting_in_max_state_change) {
                return 5;
            } else {
                return 0;
            }
        })
        .style("stroke-width", circle_stroke_width)
        .style("stroke", 'grey')
        .style('fill', 'grey')
        .on('mousemove', function () {
            show_tooltip_max_state_change(current_evidence);
        })
        .on('mouseout', function () {
            hide_tool_tip();
        });


    node_line_svg.append('rect')
        .attr('width', current_evidence.overall_relevance * width_bar + 'px')
        .attr('height', 20 + 'px')
        .attr('x', width_text + recomm_changer_space)
        .attr('y', (evidence_height - 20) / 2)
        .attr('fill', fill_color)
        //.attr('opacity', 0.5)
        .on('mousemove', function () {
            var text = 'less relevant';
            if (current_evidence.overall_relevance < 0.25) {
                text = 'less relevant';
            } else if (current_evidence.overall_relevance < 0.75) {
                text = 'relevant';
            } else {
                text = 'highly relevant';
            }

            show_tooltip_only_text(text);
            //d3.select(this).attr('opacity', 0.8);

        })
        .on('mouseout', function () {
            hide_tool_tip();
            //d3.select(this).attr('opacity', 0.5);
        });

    for (var state_index = 0; state_index < current_evidence.relevancies.length; state_index++) {

        node_line_svg.append('circle')
            .attr('id', state_index)
            .attr("cx", x_pos_circles + ((width_line_without_text - local_relevance_minus) / current_evidence.relevancies.length) * state_index + ((width_line_without_text - local_relevance_minus) / current_evidence.relevancies.length) / 2)//x(current_node_lines.point.x) + x_padding)
            .attr("cy", 15)
            .attr('r', compute_radius(current_evidence.relevancies[state_index].relevance))
            .style("stroke-width", circle_stroke_width)
            .style("stroke", fill_color)
            .style('fill', function () {
                if (current_evidence.relevancies[state_index].relevance > 0) {
                    return fill_color;
                } else {
                    return style.getPropertyValue("--element-background-color");
                }
            })
            .on('mousemove', function () {
                if ((current_evidence.relevancies[this.id].relevance * 100).toFixed(2) < 0) {
                    show_tooltip_only_text((current_evidence.relevancies[this.id].relevance * 100).toFixed(2) + '%');
                } else {
                    show_tooltip_only_text('+' + (current_evidence.relevancies[this.id].relevance * 100).toFixed(2) + '%');
                }
            })
            .on('mouseout', function () {
                hide_tool_tip();
            });
    }
}

function update_bar_chart(evidences, sort_by_relevance_index, positive) {


    var current_bar_plot_id = bar_chart_plot_id;
    var byRelevance = evidences.slice(0);
    if (sort_by_relevance_index === undefined) {
        byRelevance.sort(function (a, b) {
            var x = a.overall_relevance;
            var y = b.overall_relevance;
            return x > y ? -1 : x < y ? 1 : 0;
        });

        d3.select('#dropdown_menu_state').property("value", get_language__label_by_id(language_id_string_all_evidences));

    } else if (positive) {

        byRelevance.sort(function (a, b) {

            var x = a.relevancies[sort_by_relevance_index].relevance;
            var y = b.relevancies[sort_by_relevance_index].relevance;
            return x > y ? -1 : x < y ? 1 : 0;
        });
    } else {
        byRelevance.sort(function (a, b) {

            var x = a.relevancies[sort_by_relevance_index].relevance;
            var y = b.relevancies[sort_by_relevance_index].relevance;
            return x > y ? -1 : x < y ? 1 : 0;
        });
        current_bar_plot_id = bar_chart_plot_negative_id;
    }

    var style = getComputedStyle(d3.select(bar_chart_evidences_div_id).node());

    // remove not presented elements
    var all_node_elements = $('[id*="_bar_chart_element"]');
    for (var node_elements = 0; node_elements < all_node_elements.length; node_elements++) {
        var found = false;
        if (all_node_elements[node_elements].parentNode.id === current_bar_plot_id) {
            for (var i = 0; i < byRelevance.length; i++) {
                if (all_node_elements[node_elements].id.split('_bar_chart_element')[0] === byRelevance[i].node_id) {
                    found = true;
                    break;
                }
            }
        } else {
            found = true;
        }

        if (!found) {

            d3.select('#' + current_bar_plot_id).select('#' + all_node_elements[node_elements].id)
                .style('opacity', 0)
                .remove();
        }
    }


    // go through all evidences from backend
    for (var i = 0; i < byRelevance.length; i++) {
        var current_evidence = byRelevance[i];

        var current_bar_chart_element = d3.select('#' + current_bar_plot_id).select('#' + current_evidence.node_id + '_bar_chart_element');

        if (current_bar_chart_element.empty()) {
            add_bar_chart_line(current_evidence, d3.select('#' + current_bar_plot_id), i);
        }

        // max state
        var max_node_state = current_evidence.states[0].reduce(function (prev, current) {
            return (prev.probability > current.probability) ? prev : current
        });

        current_bar_chart_element.selectAll('text').each(function () {
            this.current_evidence_ = current_evidence;
            d3.select(this).on('mousemove', function () {
                show_tooltip_only_text(this.current_evidence_.node_label + ": " + this.current_evidence_.states[0].filter(x => parseFloat(x.probability) === 1)[0].name);
                //show_tool_tip_pie(this.current_evidence_);
            });
            if (this.id === 'node_state_text') {
                d3.select(this)
                    .transition().duration(transition_duration).text(function () {
                    return split_text_to_fill_the_width(lookup_table_get_name_by_id(max_node_state.name), font_size_bar, text_ending_state)
                })
            }
        });

        current_bar_chart_element
            .transition().duration(transition_duration)
            .style('background-color', function () {

                if (current_evidence.is_virtual_evidence) {
                    return virtual_evidence_highlighting_color;
                } else {
                    if (i % 2 === 0) {
                        return '#f0f4f9';
                    } else {
                        return "#e9eef6";
                    }
                }
            })
            .style('top', i * evidence_height + i * 5 + 'px');

        var fill_color = colorScale_rainbow(current_evidence.overall_relevance);

        current_bar_chart_element.selectAll('rect').each(function () {
            this.current_evidence_2 = current_evidence;

            d3.select(this)
                .transition().duration(transition_duration)
                .attr('width', current_evidence.overall_relevance * width_bar + 'px')
                .attr('fill', fill_color);
            d3.select(this)
                .on('mousemove', function () {
                    var text = 'not relevant';
                    if (this.current_evidence_2.overall_relevance < 0.25) {
                        text = 'less relevant';
                    } else if (this.current_evidence_2.overall_relevance < 0.75) {
                        text = 'relevant';
                    } else {
                        text = 'highly relevant';
                    }

                    show_tooltip_only_text(text);
                    d3.select(this).attr('opacity', 0.8);
                });
        });


        current_bar_chart_element.selectAll('circle').each(function () {
            if (d3.select(this).attr('id') !== "resulting_in_evidence_change") {
                d3.select(this).transition().duration(transition_duration)
                    .attr('r', 0 + 'px')
                    .remove();
            } else {
                if (current_evidence.resulting_in_max_state_change) {

                    this.current_evidence_ = current_evidence;
                    d3.select(this).transition().duration(transition_duration)
                        .attr('r', 5 + 'px');
                    d3.select(this).on('mousemove', function () {
                        show_tooltip_max_state_change(this.current_evidence_);
                    });
                } else {
                    d3.select(this).transition().duration(transition_duration)
                        .attr('r', 0 + 'px');
                }

            }
        });


        for (var state_index = 0; state_index < current_evidence.relevancies.length; state_index++) {
            add_circle_function(current_evidence);
            function add_circle_function(current_evidence) {

                current_bar_chart_element.append('circle')
                    .attr('id', state_index)
                    .attr("cx", x_pos_circles + ((width_line_without_text - local_relevance_minus) / current_evidence.relevancies.length) * state_index + ((width_line_without_text - local_relevance_minus) / current_evidence.relevancies.length) / 2)//x(current_node_lines.point.x) + x_padding)
                    .attr("cy", 15)
                    .attr('r', 0)
                    .style("stroke-width", circle_stroke_width)
                    .style("stroke", fill_color)
                    .style('fill', function () {
                        if (current_evidence.relevancies[state_index].relevance > 0) {
                            return fill_color;
                        } else {
                            return style.getPropertyValue("--element-background-color");
                        }
                    })
                    .on('mousemove', function () {
                        if ((current_evidence.relevancies[this.id].relevance * 100).toFixed(2) < 0) {
                            show_tooltip_only_text((current_evidence.relevancies[this.id].relevance * 100).toFixed(2) + '%');
                        } else {
                            show_tooltip_only_text('+' + (current_evidence.relevancies[this.id].relevance * 100).toFixed(2) + '%');
                        }
                    })
                    .on('mouseout', function () {
                        hide_tool_tip();
                    })
                    .transition().duration(transition_duration)
                    .attr('r', compute_radius(current_evidence.relevancies[state_index].relevance))//Math.abs(current_evidence.relevancies[state_index].relevance) * evidence_height/2)            ;

            }
        }
    }


    d3.selectAll(bar_chart_evidences_div_id).selectAll('#state_id').each(function () {
        d3.select(this).transition().duration(transition_duration).style('opacity', 0).remove();
    });

}

function add_update_state_axis(state_relevancies) {
    let style = getComputedStyle(d3.select(bar_chart_evidences_div_id).node());
    for (let state_index = 0; state_index < state_relevancies.length; state_index++) {

        d3.select('#state_axis_svg').append('text')
            .attr('id', 'state_id')
            .attr('font-size', font_size_bar - 4 + 'px')
            .attr('alignment-baseline', 'central')
            .text('|')
            .attr('text-anchor', 'middle')
            .attr('transform', 'translate(' + (((width_line_without_text - local_relevance_minus) / state_relevancies.length) * state_index + ((width_line_without_text - local_relevance_minus) / state_relevancies.length) / 2) + ',' + 15 + ')')
            .style('fill', style.getPropertyValue('--main-font-color'))
            .attr('opacity', 0)
            .style('font-weight', style.getPropertyValue("--highlight-font-weight"))
            .transition()
            .duration(transition_duration)
            .attr('opacity', 1);

        d3.select('#state_axis_svg').append('text')
            .attr('id', 'state_id')
            .attr('font-size', font_size_bar - 4 + 'px')
            .attr('alignment-baseline', 'central')
            .text(state_relevancies[state_index].state)
            .attr('text-anchor', 'middle')
            .attr('font-size', '0.9em')
            .attr('transform', 'translate(' + (((width_line_without_text - local_relevance_minus) / state_relevancies.length) * state_index + ((width_line_without_text - local_relevance_minus) / state_relevancies.length) / 2) + ',' + (30) + ')')
            .style('fill', style.getPropertyValue('--main-font-color'))
            .attr('opacity', 0)
            .style('font-weight', style.getPropertyValue("--highlight-font-weight"))
            .transition()
            .duration(transition_duration)
            .attr('opacity', 1);
    }
}


function add_update_state_axis_top(state_relevancies) {
    let style = getComputedStyle(d3.select(bar_chart_evidences_div_id).node());

    d3.select('#local_relevance_to_text')
        .attr('font-size', font_size_bar - 4 + 'px')
        .attr('alignment-baseline', 'central')
        .text('local relevance to \u00A0 \u00A0"' + selected_outcome_node_and_evidences[0].node_label + '"\u00A0 \u00A0 states')
        .attr('font-size', '1em')
        .attr('text-anchor', 'middle')
        .attr('transform', 'translate('+ (x_pos_circles + width_line_without_text/2 ) + ',' + 40 + ')')
        .style('fill', style.getPropertyValue('--main-font-color'));

    d3.select('#state_axis_svg_top').selectAll('text').remove();
    for (let state_index = 0; state_index < state_relevancies.length; state_index++) {

        d3.select('#state_axis_svg_top').append('text')
            .attr('id', 'state_id')
            .attr('font-size', font_size_bar - 4 + 'px')
            .attr('alignment-baseline', 'central')
            .text(state_relevancies[state_index].state)
            .attr('text-anchor', 'middle')
            .attr('font-size', '0.9em')
            .attr('transform', 'translate(' + (((width_line_without_text - local_relevance_minus) / state_relevancies.length) * state_index + ((width_line_without_text - local_relevance_minus) / state_relevancies.length) / 2) + ',' + (15) + ')')
            .style('fill', style.getPropertyValue('--main-font-color'))
            .attr('opacity', 0)
            .style('font-weight', style.getPropertyValue("--highlight-font-weight"))
            .transition()
            .duration(transition_duration)
            .attr('opacity', 1);
    }
}

function add_update_dropdown_menu_options(relevancies, evidences) {

    var data = [];
    data.push({state: get_language__label_by_id(language_id_string_all_evidences)});
    relevancies.forEach(function (element) {
        data.push(element);
    });


    var options2 = d3.select("#dropdown_menu_state").selectAll("option")
        .data(data);

    options2.exit().remove();

    options2.enter()
        .append("option")
        .merge(options2)
        .text(function (d) {
            return d.state;
        });

    d3.select('#dropdown_menu_state').on('change', function () {
        update_bar_chart_plot_by_dropdown_state_relevance(d3.select(this).property('value'), evidences);
    })
}

function compute_radius(relevance) {
    var radius = Math.abs(relevance) * evidence_height;

    if (radius > 0 && radius < 1) {
        radius = 1;
    } else if (radius > evidence_height / 2 - 2) {
        radius = evidence_height / 2 - 2;
    }
    return radius;
}

function highlight_searched_element_with_scroll(searched_element_id) {
    var myElement_d3 = d3.select('#' + searched_element_id + bar_chart_element_id_ending);

    if (!myElement_d3.empty()) {
        //code before the pause
        setTimeout(function(){
            var color_before = myElement_d3.style('background-color');
            var topPos = parseFloat(myElement_d3.style('top'));

            $(myElement_d3.node().parentNode)
                //.delay(transition_duration+5)
                .animate({scrollTop: parseFloat(myElement_d3.style('top'))}, transition_duration); // smooth scrolling behaviour

            // highlight through red background color
            myElement_d3.transition()
                //.delay(transition_duration+5)
                .duration(transition_duration)
                .style('background-color', '#ffcccc')
                .transition().delay(9 * transition_duration).duration(transition_duration)
                .style('background-color', function () {
                    return color_before;
                });
        }, transition_duration+5);


    }
}

function update_bar_chart_plot_by_dropdown_state_relevance(selected_state, evidences) {
    var height_positive = 'calc(100% - ' + axis_height + 'px)';
    var height_negative = '0px';

    add_update_dropdown_menu_options(evidences[0].relevancies, evidences);

    var relevancies_for_updating_state_axis = evidences[0].relevancies;

    if (selected_state === get_language__label_by_id(language_id_string_all_evidences)) {
        update_bar_chart(evidences);
    } else {
        height_positive = 'calc((100% - ' + axis_height + 'px)/2 - 4px)';
        height_negative = 'calc((100% - ' + axis_height + 'px)/2 - 4px)';

        var state_index;

        for (var i = 0; i < evidences[0].relevancies.length; i++) {
            if (evidences[0].relevancies[i].state === selected_state) {
                state_index = i;
            }
        }

        var rel_positive = [];
        var rel_negative = [];
        for (var i = 0; i < evidences.length; i++) {
            if (evidences[i].relevancies[state_index].relevance > 0) {
                rel_positive.push(evidences[i]);

            } else if (evidences[i].relevancies[state_index].relevance < 0) {
                rel_negative.push(evidences[i]);

            }
        }

        update_bar_chart(rel_positive, state_index, true);
        update_bar_chart(rel_negative, state_index, false);

        $('#' + bar_chart_plot_id).animate({scrollTop: 0 + 'px'}, transition_duration); // smooth scrolling behaviour

        var all_children_negative = d3.select('#' + bar_chart_plot_negative_id).node().children;

        if (all_children_negative.length > 0) {
            var topPos = d3.select(all_children_negative[all_children_negative.length - 1]).style('top');

            $('#' + bar_chart_plot_negative_id).animate({scrollTop: topPos}, transition_duration); // smooth scrolling behaviour
        }
    }

    d3.select('#' + bar_chart_plot_id).transition().duration(transition_duration).style('height', height_positive);
    d3.select('#' + bar_chart_plot_negative_id).transition().duration(transition_duration).style('height', height_negative);

    add_update_state_axis_top(relevancies_for_updating_state_axis);
    add_update_state_axis(relevancies_for_updating_state_axis);

    if (selected_state) {
        // highlight selected state in axis
        d3.select('#state_axis_svg').selectAll('text').each(function () {

            if (d3.select(this).text() === selected_state) {
                d3.select(this)
                    //.transition().duration(transition_duration)
                    .attr('font-size', font_size_bar + 'px')
                    .attr('font-weight', 600)
                    .style('fill', '#C71585')//colorScale_rainbow(0.5));//'#6a63b2');
            }
        });

        d3.select('#state_axis_svg_top').selectAll('text').each(function () {

            if (d3.select(this).text() === selected_state) {
                d3.select(this)
                    //.transition().duration(transition_duration)
                    .attr('font-size', font_size_bar + 'px')
                    //.attr('font-weight', 600)
                    .style('fill', '#C71585')//colorScale_rainbow(0.5));//'#6a63b2');
            }
        });

    }

}