let ticks = 3;
let linearGradient;

let margin = {top: 20, right: 45, bottom: 90, left: 80};
let zoom;
let gY;
let min_x = 180;
let min_width_state = 75;
let circle_stroke_width = 1;

let min_y_domain = 0.0;
let max_y_domain = 1;

function update_color_gradient(min, max, linearGradient) {

    linearGradient.selectAll('*').remove();

    /*linearGradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", color_not_relevant);

    linearGradient.append("stop")
        .attr("offset", "25%")
        .attr("stop-color", color_not_relevant);

    linearGradient.append("stop")
        .attr("offset", "25.01%")
        .attr("stop-color", color_relevant);

    linearGradient.append("stop")
        .attr("offset", "75%")
        .attr("stop-color", color_relevant);

    linearGradient.append("stop")
        .attr("offset", "75.01%")
        .attr("stop-color", color_highly_relevant);

    linearGradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", color_highly_relevant);*/


    linearGradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", colorScale_rainbow(max));

    linearGradient.append("stop")
        .attr("offset", "25%")
        .attr("stop-color", colorScale_rainbow(min + 0.75 * (max - min)));

    linearGradient.append("stop")
        .attr("offset", "25.01%")
        .attr("stop-color", colorScale_rainbow(min + 0.7499 * (max - min)));

    linearGradient.append("stop")
        .attr("offset", "75%")
        .attr("stop-color", colorScale_rainbow(min + 0.25 * (max - min)));

    linearGradient.append("stop")
        .attr("offset", "75%")
        .attr("stop-color", colorScale_rainbow(min + 0.2499 * (max - min)));

    linearGradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", colorScale_rainbow(min));



    return linearGradient;
}

/**
 *
 * @param outcome_node
 * @param all_evidences
 * @param duration
 */
function update_chart(outcome_node, all_evidences, duration) {

    if (duration === undefined) {
        duration = transition_duration;
    }

    let line_ids = [];
    d3.select('#plot').selectAll('line').each(function () {

        if (this.id.includes(line_ending) && line_ids.indexOf(this.id) === -1) {

            line_ids.push(this.id);
            d3.selectAll('#' + this.id)
                .transition()
                .duration(duration / 2)
                .style('opacity', 0)
                .remove();
        }
    });

    let circle_ids = [];
    d3.select('#plot').selectAll('circle').each(function () {

        if (this.id.includes(circle_ending_others) && circle_ids.indexOf(this.id) === -1) {

            circle_ids.push(this.id);
            d3.selectAll('#' + this.id)
                .transition()
                .duration(duration / 2)
                .style('opacity', 0)
                .remove();
        }
    });

    if (duration > 0) {

        yAxis = d3.axisLeft(y).ticks(ticks, "%").tickFormat(function (d) {
            if (d < 0.33) {
                return 'not relevant';
            } else if (d < 0.66) {
                return 'relevant';
            } else {
                return 'highly relevant';
            }
        });

        // update y Axis
        d3.select('#' + scatter_plot_id).select(".axis--y")
            .transition(transition_duration)
            .delay(transition_duration / 2)
            .call(yAxis);
    }

    xAxis = d3.axisBottom(x);


    // Define Extent for each Dataset
    x.domain(outcome_node.states.map(function (d) {
        return d.state;
    }));


    let y_scale = yAxis.scale();
    // update x Axis
    d3.select('#' + scatter_plot_id).select(".axis--x")
        .transition(transition_duration)
        .delay(transition_duration / 2)
        .call(xAxis);

    let max_shown_domain_local = y_scale.domain()[1];
    let min_shown_domain_local = y_scale.domain()[0];

    linearGradient = update_color_gradient(min_shown_domain_local, max_shown_domain_local, linearGradient);

    // update y Axis color
    d3.select('#' + scatter_plot_id).select(".axis--y")
        .style('fill', 'url(#linear-gradient)');


    let height_plot = d3.select('#' + scatter_plot_id).select(".axis--y").select('path').node().getBBox().height;

    // draw circles and lines
    for (let i = 0; i < all_evidences.length; i++) {
        (function () {


            let current_node_lines = all_evidences[i];
            let current_overall_relevance = current_node_lines.overall_relevance;

            if (max_y_domain < current_overall_relevance) {
                max_y_domain = current_node_lines.overall_relevance;
                y.domain([min_y_domain - y_axis_plus, max_y_domain + y_axis_plus]);

            }

            if (current_node_lines.overall_relevance < min_shown_domain_local) {
                current_overall_relevance = current_node_lines.point.relevance - 10;
            } else if (current_node_lines.overall_relevance > max_shown_domain_local) {
                current_overall_relevance = current_node_lines.point.relevance + 10;
            }

            // max state
            let max_node_state = current_node_lines.states.reduce(function (prev, current) {
                return (prev.probability > current.probability) ? prev : current
            });

            let style = getComputedStyle(d3.select('#' + scatter_plot_id).node());

            // check if circle already exists
            // if the circle does not exist, create a new one
            if (d3.select('#' + current_node_lines.node_id + circle_ending_main).node() === null) {

                d3.select('#' + scatter_plot_id).append("circle")
                    .attr('id', current_node_lines.node_id + circle_ending_main)
                    .attr("class", "bar")
                    .on('mousemove', function () {
                        show_tool_tip_pie(current_node_lines);
                    })
                    .on('mouseout', function () {
                        hide_tool_tip();
                    })
                    .on('click', function () {
                        update_structured_exploration(current_node_lines.node_id);
                    });

                // node label
                let text_node = d3.select('#' + scatter_plot_id).append('text')
                    .attr('id', current_node_lines.node_id + text_ending_node)
                    .style('text-anchor', 'start')
                    .style("alignment-baseline", "middle")
                    .style('fill', style.getPropertyValue('--main-font-color'))
                    .text(function () {
                        return lookup_table_get_name_by_id(current_node_lines.node_id)// + prob;
                    })
                    .on('mousemove', function () {
                        show_tool_tip_pie(current_node_lines);
                    })
                    .on('mouseout', function () {
                        hide_tool_tip();
                    })
                    .on('click', function () {
                        update_structured_exploration(current_node_lines.node_id);
                    });


                d3.select('#' + scatter_plot_id).append('text')
                    .attr('id', current_node_lines.node_id + text_ending_state)
                    .style('text-anchor', 'start')
                    .style("alignment-baseline", "middle")
                    .style('fill', style.getPropertyValue('--navbar-highlight-font-color'))
                    .text(function () {
                        if (max_node_state.state === undefined) {
                            return max_node_state.name;
                        }
                        return max_node_state.state;
                    })
                    .on('mousemove', function () {
                        show_tool_tip_pie(current_node_lines);
                    })
                    .on('mouseout', function () {
                        hide_tool_tip();
                    })
                    .on('click', function () {
                        update_structured_exploration(current_node_lines.node_id);
                    });

            }

            let computed_multiplicator = (height_plot / ((max_shown_domain_local - min_shown_domain_local) * 100)) / 10;
            if (computed_multiplicator > 7) {
                computed_multiplicator = 7;
            }
            let radius = compute_radius(current_node_lines.point.relevance, multiplicator_to_enlarge, current_node_lines.overall_relevance, computed_multiplicator);

            function compute_radius(relevance, multiplicator_to_enlarge, overall_relevance, computed_multiplicator) {

                //let radius = relevance + multiplicator_to_enlarge * overall_relevance;
                let radius = multiplicator_to_enlarge * overall_relevance;


                radius = radius * computed_multiplicator;

                radius = relevance * radius;


                radius = 1.0083 * Math.pow(radius / 0.01, .5716) * min_radius_main_circle;

                return radius;
            }

            /*// ToDo: Collision detection
            // slider_min_value, slider_max_value, height_of_plot
            //let radius = current_node_lines.point.relevance * multiplicator_to_enlarge;
            let radius = current_node_lines.point.relevance + multiplicator_to_enlarge * current_node_lines.overall_relevance;

            let computed_multiplicator = (height_plot / ((max_shown_domain - min_shown_domain) * 100)) / 5;
            if (computed_multiplicator > 7) {
                computed_multiplicator = 7;
            }
            radius = radius * computed_multiplicator;

            // radius = 0.7 * radius + 9 * current_overall_relevance * computed_multiplicator;
            if (radius < min_radius_main_circle) {
                radius = min_radius_main_circle;
            }*/

            let fill_color;
            if (current_node_lines.is_virtual_evidence) {
                fill_color = virtual_evidence_highlighting_color;
            } else {
                fill_color = colorScale_rainbow(current_overall_relevance);
            }
            // if so just animate the circle
            d3.select('#' + current_node_lines.node_id + circle_ending_main)
                .transition()
                .delay(duration / 2)
                .duration(duration)
                .attr("cx", x(current_node_lines.point.x) + x_padding)
                .attr("cy", y_scale(current_overall_relevance))
                .attr('r', radius)
                .style("width", x.bandwidth())
                .style("stroke-width", circle_stroke_width)
                .style("stroke", fill_color)
                .style('fill', fill_color);//colorScale_foreground(current_node_lines.point.index * color_scale_letiable));//color);

            let font_size = current_node_lines.overall_relevance * multiplicator_to_enlarge * computed_multiplicator * 3;//3.5 * radius;
            if (font_size > max_font_size) {
                font_size = max_font_size;
            } else if (font_size < min_font_size) {
                font_size = 0;
                if (current_node_lines.is_virtual_evidence) {
                    font_size = min_font_size;
                }
            }

            font_size = Math.round(font_size);


            //positioning of node labels
            d3.selectAll('#' + current_node_lines.node_id + text_ending_node)
                .transition()
                .delay(duration / 2)
                .duration(duration)
                .attr('font-size', font_size + 'px')
                .attr('x', 10)
                .style('fill', function () {
                    if (current_node_lines.resulting_in_max_state_change) {
                        return "red";//style.getPropertyValue('--main-font-color');
                    }
                    return style.getPropertyValue('--main-font-color');
                })
                .attr("y", y_scale(current_overall_relevance))
                .text(function () {
                    return split_text_to_fill_the_width(lookup_table_get_name_by_id(current_node_lines.node_id), font_size, text_ending_node)
                });


            d3.selectAll('#' + current_node_lines.node_id + text_ending_state)
                .transition()
                .delay(duration / 2)
                .duration(duration)
                .attr('x', function () {
                    return min_x - min_width_state;
                })
                .attr("y", y_scale(current_overall_relevance))
                .attr('font-size', font_size + 'px')
                .text(function () {
                    let prob;

                    if (max_node_state.state === undefined) {
                        prob = max_node_state.name;
                    } else {
                        prob = max_node_state.state;
                    }
                    return split_text_to_fill_the_width(prob, font_size, text_ending_state);
                    //return lookup_table_get_name_by_id(current_node_lines.node_id)// + prob;
                });


            let first_relevance_state = null, last_relevance_state = null;

            // draw circles for other ones
            for (let k = 0; k < current_node_lines.relevancies.length; k++) {

                (function () {
                    let current_relevance = current_node_lines.relevancies[k];

                    if (current_relevance.state !== current_node_lines.point.x) {
                        d3.select('#' + scatter_plot_id).append("circle")
                            .attr('id', current_node_lines.node_id + circle_ending_others)
                            .attr("class", "bar")
                            .on('mousemove', function () {
                                show_tool_tip_pie(current_node_lines);
                            })
                            .on('mouseout', function () {
                                hide_tool_tip();
                            })
                            .on('click', function () {
                                update_structured_exploration(current_node_lines.node_id);
                            })
                            .transition()
                            .delay(duration / 2)
                            .duration(duration)
                            .attr("cx", x(current_relevance.state) + x_padding)
                            .attr("cy", y_scale(current_overall_relevance))
                            .attr('r', function () {

                                let r = compute_radius(Math.abs(current_relevance.relevance), multiplicator_to_enlarge, current_node_lines.overall_relevance, computed_multiplicator);

                                //let r = Math.abs(current_relevance.relevance) * radius;
                                if (r < 0) {
                                    r = 0;
                                }
                                return r;
                            })
                            .style("width", x.bandwidth())
                            .style('fill', function () {
                                if (current_relevance.relevance > 0) {
                                    return fill_color;
                                } else {
                                    return getComputedStyle(d3.select('#' + scatter_plot_id).node()).getPropertyValue("--element-background-color"); //"transparent"
                                }

                            })
                            .attr("stroke-width", circle_stroke_width)
                            .attr("stroke", fill_color)
                            //colorScale_foreground(current_node_lines.point.index * color_scale_variable))
                            .style('opacity', 1);
                    }

                    // get the first and last relevance bigger than min_relevance_to_show
                    if (first_relevance_state === null && current_relevance.relevance > min_relevance_to_show) {
                        first_relevance_state = current_relevance.state;
                    }

                    if (current_relevance.relevance > min_relevance_to_show) {
                        last_relevance_state = current_relevance.state;
                    }
                })();
            }

            // draw line
            d3.select('#' + scatter_plot_id)
                .append('line')
                .attr('id', current_node_lines.node_id + line_ending)
                .attr("x1", x(current_node_lines.relevancies[0].state) + x_padding)
                .attr("x2", x(current_node_lines.relevancies[current_node_lines.relevancies.length - 1].state) + x_padding)
                .attr("y1", y_scale(current_overall_relevance))
                .attr("y2", y_scale(current_overall_relevance))
                .style("stroke", fill_color) //colorScale_foreground(current_node_lines.point.index * color_scale_variable))
                .style("stroke-width", function () {
                    return 1;
                })
                .attr("stroke-linejoin", "round")
                .attr("stroke-linecap", "round")
                .style('opacity', 0)
                .transition()
                .delay(duration / 2 + duration)
                .duration(duration)
                .style('opacity', 0.05)
                .on('end', function () {
                    // circle element shall be in foreground
                    let line_element = document.getElementById(current_node_lines.node_id + line_ending);
                    let firstChild = document.getElementById(current_node_lines.node_id + circle_ending_main);

                    line_element.parentNode.insertBefore(line_element, firstChild);
                });

            /*if (first_relevance_state !== null && last_relevance_state !== null) {

                console.log(current_node_lines);
                // draw line
                d3.select('#' + scatter_plot_id)
                    .append('line')
                    .attr('id', current_node_lines.node_id + line_ending)
                    .attr("x1", x(first_relevance_state) + x_padding)
                    .attr("x2", x(last_relevance_state) + x_padding)
                    .attr("y1", y_scale(current_overall_relevance))
                    .attr("y2", y_scale(current_overall_relevance))
                    .style("stroke", colorScale_rainbow(current_overall_relevance)) //colorScale_foreground(current_node_lines.point.index * color_scale_variable))
                    .style("stroke-width", function () {
                        return 2;
                    })
                    .attr("stroke-linejoin", "round")
                    .attr("stroke-linecap", "round")
                    .style('opacity', 0)
                    .transition()
                    .delay(duration / 2 + duration)
                    .duration(duration)
                    .style('opacity', 0.05)
                    .on('end', function () {
                        // circle element shall be in foreground
                        let line_element = document.getElementById(current_node_lines.node_id + line_ending);
                        let firstChild = document.getElementById(current_node_lines.node_id + circle_ending_main);

                        line_element.parentNode.insertBefore(line_element, firstChild);
                    });
            }*/
        })();
    }
}

function split_text_to_fill_the_width(text, font_size, node_or_state) {

    let width;
    if (node_or_state === text_ending_node) {
        width = min_x - min_width_state - 10 - 10;
    } else {
        width = min_width_state;
    }
    if (getTextWidth(text, font_size, "Fira Sans, sans serif") > width) {

        let concatenated_text = text.split('...');
        concatenated_text[1] = '...';
        text = concatenated_text[0].substring(0, concatenated_text[0].length - 1);
        text = text + '...';
        return split_text_to_fill_the_width(text, font_size, node_or_state);
    } else {
        return text;
    }
}

function getTextWidth(text, fontSize, fontFace) {
    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');
    context.font = fontSize + 'px ' + fontFace;
    return context.measureText(text).width;
}

function update_structured_exploration(node_id, do_not_scroll) {
    document.getElementById('iframe_structured_exploration').src = "./structured_exploration/structured_exploration.html?node=" + node_id;

    if (!do_not_scroll) {
        d3.transition()
            .delay(50)
            .duration(transition_duration)
            .tween("scroll", scrollTween(document.body.getBoundingClientRect().height - window.innerHeight + 10));

        function scrollTween(offset) {
            return function () {
                let i = d3.interpolateNumber(window.pageYOffset || document.documentElement.scrollTop, offset);
                return function (t) {
                    scrollTo(0, i(t));
                };
            };
        }
    }
}


function create_side_nav(parent_id) {
    // ------------------------create side navigation
    let icon_div_search = document.createElement('div');
    icon_div_search.id = side_nav_id;
    icon_div_search.setAttribute('class', 'sidenav');

    let side_nav_node__search = document.createElement('a');
    side_nav_node__search.id = 'close_canvas';
    side_nav_node__search.href = "javascript:void(0)";
    side_nav_node__search.setAttribute('class', 'closebtn');
    side_nav_node__search.onclick = function () {
        closeNav(parent_id);
    };
    side_nav_node__search.textContent = decodeURI('%C3%97'); //times sign
    icon_div_search.appendChild(side_nav_node__search);
    d3.select('#' + parent_id).node().appendChild(icon_div_search);

    let icon_div_setEvidence = document.createElement('div');
    icon_div_setEvidence.id = 'side_nav_set_evidence';
    icon_div_setEvidence.setAttribute('class', 'sidenav');

    let side_nav_node__setEvidence = document.createElement('a');
    side_nav_node__setEvidence.id = 'close_canvas';
    side_nav_node__setEvidence.href = "javascript:void(0)";
    side_nav_node__setEvidence.setAttribute('class', 'closebtn');
    side_nav_node__setEvidence.onclick = function () {
        closeNav_set_evidence(div_id_chart);
    };
    side_nav_node__setEvidence.textContent = decodeURI('%C3%97'); //times sign

    // add all elements to chart div
    icon_div_setEvidence.appendChild(side_nav_node__setEvidence);
    d3.select('#' + parent_id).node().appendChild(icon_div_setEvidence);

}

function add_evidence(parent_id) {

    get_all_observable_nodes(function (response) {

        let node_list = [];
        for (let i = 0; i < response.length; i++) {
            node_list[i] = lookup_table_get_name_by_id(response[i].node_id);
        }
        //node_list = response;


        $('#' + parent_id + ' #' + side_nav_id + ' :not(#close_canvas)').remove();//document.querySelectorAll("mySidenav > div:not(#close_canvas)"))

        let canvas_height = parseFloat(d3.select('#' + parent_id).style('height'))
            - parseFloat(d3.select('#' + parent_id).select('#' + side_nav_id).style('top'))
            - parseFloat(d3.select('#' + parent_id).select('#' + side_nav_id).style('padding-top'))
            //- parseFloat(d3.select('#' + parent_id).select('#node_name_input_box').style('height'))
            - 0; //padding

        // create input box

        d3.select('#' + parent_id).select('#' + side_nav_id).style('height', canvas_height + 'px');
        let canvas_width = parseFloat(d3.select('#' + parent_id).style('width'));

        let label_search_input_box = d3.select('#' + parent_id).select('#' + side_nav_id).append('input')
            .attr('id', 'node_name_input_box')
            .attr('type', 'text')
            .attr('placeholder', 'Search for nodes...')
            .on('click', function () {
                // select another node
                d3.select(this).node().value = "";
                list_div.transition().duration(transition_duration).style('width', canvas_width + 'px');
                d3.select('#' + set_evidence_dialog_id).transition().duration(transition_duration).style('left', canvas_width + 'px').on('end', function () {
                    d3.select(this).remove();
                });
            });


        //create node list
        let list_div = d3.select('#' + parent_id).select('#' + side_nav_id).append('div')
            .attr('id', 'canvas_list_div');


        let list_nodes = list_div.append('ul')
            .attr('id', 'list_of_all_nodes');

        let added_string_to_id = '_searchlistelement';
        for (let i = 0; i < node_list.length; i++) {

            let node_ref = list_nodes.append('li')
                .attr('id', response[i].node_id + added_string_to_id)
                .on('click', function (d) {
                    let selected_id = this.id.split(added_string_to_id)[0];

                    d3.select('#node_name_input_box').node().value = lookup_table_get_name_by_id(node_ref.select('a').text());

                    d3.select('#canvas_list_div').transition().duration(transition_duration).style('width', 0 + 'px');

                    open_set_evidence_dialog(side_nav_id, selected_id, canvas_width, canvas_height, true);
                });


            let textnode = node_ref.append('a')
                .attr('href', '#')
                .text(response[i].node_name)//lookup_table_get_name_by_id(node_list[i]))
                .style('background-color', function () {
                        if (response[i].is_evidence) {
                            return evidence_highlighting_color;
                        } else if (response[i].is_virtual_evidence) {
                            return virtual_evidence_highlighting_color;
                        }
                    }
                );
        }

        // resize list element
        list_div.style('height', canvas_height - document.getElementById('canvas_list_div').offsetTop + 60 + 'px');
        label_search_input_box.on('keyup', function (d) {
            search_function(parent_id, label_search_input_box.attr('id'))
        });

        function search_function(parent_id, input_box_id) {
            let input, filter, ul, li, a, i;

            input = d3.select('#' + parent_id).select('#' + input_box_id).node();//document.getElementById("node_name_input_box");

            filter = input.value.toUpperCase();
            ul = d3.select('#' + parent_id).select("#list_of_all_nodes").node();
            li = ul.getElementsByTagName("li");
            for (i = 0; i < li.length; i++) {
                a = li[i].getElementsByTagName("a")[0];
                if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
                    li[i].style.display = "";
                } else {
                    li[i].style.display = "none";
                }
            }
        }

        openNav(parent_id, canvas_width);
    });
}

function add_outcome(parent_id) {

    callNodeList_new(function (response) {
    //get_all_observable_nodes(function (response) {

        let node_list = [];
        for (let i = 0; i < response.length; i++) {
            node_list[i] = lookup_table_get_name_by_id(response[i][1]);
        }
        //node_list = response;

        $('#' + parent_id + ' #' + side_nav_id + ' :not(#close_canvas)').remove();//document.querySelectorAll("mySidenav > div:not(#close_canvas)"))

        // create input box

        d3.select('#' + parent_id).select('#' + side_nav_id).style('height', canvas_height + 'px');
        let canvas_width = parseFloat(d3.select('#' + parent_id).style('width'));

        let label_search_input_box = d3.select('#' + parent_id).select('#' + side_nav_id).append('input')
            .attr('id', 'node_name_input_box')
            .attr('type', 'text')
            .attr('placeholder', 'Search for nodes...')
            .on('click', function () {
                // select another node
                d3.select(this).node().value = "";
                list_div.transition().duration(transition_duration).style('width', canvas_width + 'px');
                d3.select('#' + set_evidence_dialog_id).transition().duration(transition_duration).style('left', canvas_width + 'px').on('end', function () {
                    d3.select(this).remove();
                });
            });

        let canvas_height = parseFloat(d3.select('#' + parent_id).style('height'))
            - parseFloat(d3.select('#' + parent_id).select('#' + side_nav_id).style('top'))
            - parseFloat(d3.select('#' + parent_id).select('#' + side_nav_id).style('padding-top'))
            - parseFloat(d3.select('#' + parent_id).select('#node_name_input_box').style('height'))
            - 20; //padding


        //create node list
        let list_div = d3.select('#' + parent_id).select('#' + side_nav_id).append('div')
            .attr('id', 'canvas_list_div');


        let list_nodes = list_div.append('ul')
            .attr('id', 'list_of_all_nodes');

        let added_string_to_id = '_searchlistelement';
        for (let i = 0; i < node_list.length; i++) {

            let node_ref = list_nodes.append('li')
                .attr('id', response[i][1] + added_string_to_id)
                .on('click', function (d) {
                    let selected_id = this.id.split(added_string_to_id)[0];

                    d3.select('#node_name_input_box').node().value = lookup_table_get_name_by_id(selected_id);

                    if (all_outcome_node_ids_real.indexOf(selected_id) === -1) {
                        all_outcome_node_ids_real.push(selected_id);
                    }

                    currently_selected_outcome_node_id = selected_id;
                    update_after_new_outcome_node(function (response) {
                    }, true);

                    closeNav(parent_id);
                });


            let textnode = node_ref.append('a')
                .attr('href', '#')
                .text(lookup_table_get_name_by_id(node_list[i]))
                .style('background-color', function () {
                        if (all_outcome_node_ids_real.indexOf(response[i][1]) > -1) {
                            return evidence_highlighting_color;
                        } //else if (response[i].is_virtual_evidence) {
                          //  return virtual_evidence_highlighting_color;
                        //}
                        //return "white";
                    }
                );
        }

        // resize list element
        list_div.style('height', canvas_height - document.getElementById('canvas_list_div').offsetTop + 60 + 'px');
        label_search_input_box.on('keyup', function (d) {
            search_function(parent_id, label_search_input_box.attr('id'))
        });

        function search_function(parent_id, input_box_id) {
            let input, filter, ul, li, a, i;

            input = d3.select('#' + parent_id).select('#' + input_box_id).node();//document.getElementById("node_name_input_box");

            filter = input.value.toUpperCase();
            ul = d3.select('#' + parent_id).select("#list_of_all_nodes").node();
            li = ul.getElementsByTagName("li");
            for (i = 0; i < li.length; i++) {
                a = li[i].getElementsByTagName("a")[0];
                if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
                    li[i].style.display = "";
                } else {
                    li[i].style.display = "none";
                }
            }
        }

        openNav(parent_id, canvas_width);
    });
}

function openNav(parent_div_id, canvas_width) {
    d3.select('#' + parent_div_id).select('#' + 'mySidenav').transition().duration(transition_duration).style('width', canvas_width + 'px');
}

function closeNav(parent_id) {
    d3.select('#' + parent_id).select('#' + 'mySidenav').transition().duration(transition_duration).style('width', 0 + 'px');
}
