


var lineFunction = d3.line()
//.curve(d3.curveCatmullRom.alpha(0.2))
    .curve(d3.curveMonotoneX)
    .x(function (d) {
        return d.x;
    })
    .y(function (d) {
        return d.y
    });


function create_lines(id, nodeType, current_node, middle_node, div_id_chart, animate_after_click) {

    if (nodeType.type !== current_node_type) {

        if (middle_node === undefined || middle_node ==="") {
            middle_node = filter_by_node_type(current_node_type, calculated_node_objects_per_div[get_index_of_chart_div_id(div_id_chart)].calculated_node_objects).group_nodes[0].layout;
        }
        var layout = calculate_layout_of_lines(current_node, middle_node);

        create_line_div();

        function create_line_div() {

            d3.select('#' + div_id_chart)
                .append('div')
                .attr('class', 'line_divs')
                .attr('id', id + '_line')
                .style('position', 'absolute')
                .style('top', layout.divData.pos_y + 'px')
                .style('left', layout.divData.pos_x + "px")
                .style('width', layout.divData.width + "px")
                .style('height', layout.divData.height + "px");
            //.style("border", "1px solid white");


            var svgContainer = d3.select('#' + div_id_chart).select('#' + id + '_line').append("svg")
                .attr('id', 'line')
                .attr("width", layout.divData.width + 'px')
                .attr("height", layout.divData.height + 'px');
            //.style("border", "1px solid green");

            //The line SVG Path we draw
            var lineGraph = svgContainer.append("path")
                .attr('id', "line_path")
                .attr('class', 'line_path')
                .attr("d", lineFunction(layout.lineData))
                //.attr("stroke", "white")
                .attr("stroke-width", 2)
                .attr("fill", "none")
                .style('opacity', 0)
                .transition()
                .duration(function () {
                    if (animate_after_click) {
                        return myDuration * 1.5;
                    }
                    return myDuration_lines/2;
                })
                .style('opacity', 1);
        }
    }
}

/**
 * layout params need pos_x, pos_y, node_width, node_height
 *
 * @param child_parent_node_layout
 * @param middle_node_layout
 * @returns {Array}
 */
function calculate_layout_of_lines(child_parent_node_layout, middle_node_layout) {
    var pos_x_1, pos_y_1, pos_x_2, pos_y_2, pos_x_3, pos_y_3;

    var layout = [];
    var lineData = [];
    var divData = [];

    var space_second_point = 5;
    var space_point = space_second_point;

    // child - right
    if (child_parent_node_layout.pos_x > middle_node_layout.pos_x) {
        pos_x_1 = child_parent_node_layout.pos_x + 30;
        pos_x_2 = pos_x_1 - space_second_point;
        pos_x_3 = middle_node_layout.pos_x + middle_node_layout.node_width - 30 + 2;

        //parent - left
    } else {
        pos_x_1 = child_parent_node_layout.pos_x + child_parent_node_layout.node_width - 30;
        pos_x_2 = pos_x_1 + space_second_point;
        pos_x_3 = middle_node_layout.pos_x + 30 - 2;
        space_point = -space_point;

    }

    pos_y_1 = child_parent_node_layout.pos_y + child_parent_node_layout.node_height / 2;
    pos_y_2 = pos_y_1;
    pos_y_3 = middle_node_layout.pos_y + (middle_node_layout.node_height / 2);

    var div_height = Math.abs(pos_y_3 - pos_y_1);
    if (div_height < 20) {
        div_height = 20;
    }

    divData = {
        height: div_height + 2* space_second_point ,
        width: Math.abs(pos_x_3 - pos_x_1),
        pos_x: Math.min(pos_x_1, pos_x_3),
        pos_y: Math.min(pos_y_1, pos_y_3)
    };

    lineData.push({x: pos_x_1 - Math.min(pos_x_3, pos_x_1), y: pos_y_1 - Math.min(pos_y_1, pos_y_3) });
    lineData.push({x: pos_x_2 - Math.min(pos_x_3, pos_x_1), y: pos_y_2 - Math.min(pos_y_1, pos_y_3) });
    lineData.push({x: pos_x_3 - Math.min(pos_x_3, pos_x_1) + space_point, y: pos_y_3 - Math.min(pos_y_1, pos_y_3 )});
    lineData.push({x: pos_x_3 - Math.min(pos_x_3, pos_x_1), y: pos_y_3 - Math.min(pos_y_1, pos_y_3)});


    layout.divData = divData;
    layout.lineData = lineData;

    return layout;
}

/**
 *
 * @param id
 * @param layout_childParent
 * @param layout_middle_node
 * @param bool_remove
 * @param new_id
 */
function animate_lines(div_id_chart, id, layout_childParent, layout_middle_node, bool_remove, new_id) {

    var new_layout_line = calculate_layout_of_lines(layout_childParent, layout_middle_node);


    // switching first and last point
    if (new_id && new_layout_line.lineData[new_layout_line.lineData.length-1].x < new_layout_line.lineData[0].x) {
        new_layout_line = new_layout_line.reverse();
    }

    if (bool_remove) {
        d3.select('#' + div_id_chart).select('#' + id+'_line')
            .transition()
            .duration(myDuration)
            .style('opacity', 0)
            .style('top', new_layout_line.divData.pos_y + 'px')
            .style('left', new_layout_line.divData.pos_x + 'px')
            .style('height', new_layout_line.divData.height + "px")
            .style('width', new_layout_line.divData.width + "px")
            .remove();
    } else {

        d3.select('#' + div_id_chart).select('#' + id+'_line')
            .transition()
            .duration(myDuration)
            .style('top', new_layout_line.divData.pos_y + 'px')
            .style('left', new_layout_line.divData.pos_x + 'px')
            .style('height', new_layout_line.divData.height + "px")
            .style('width', new_layout_line.divData.width + "px");
    }

    d3.select('#' + div_id_chart).select('#' + id + '_line').select("#line")
        .transition()
        .duration(myDuration)
        .attr("width", new_layout_line.divData.width + 'px')
        .attr("height", new_layout_line.divData.height + 'px')
        .on('end', function (d) {
            if (new_id !== undefined) {
                d3.select('#' + div_id_chart).select('#' + id+'_line').attr('id', new_id+'_line')
            }
        });


    d3.select('#' + div_id_chart).select('#' + id+'_line').select('path#line_path')
        .transition()
        .duration(myDuration)
        .style('opacity', function(d) {
            if (bool_remove) {
                return 0;
            }
        })
        .attr('d', lineFunction(new_layout_line.lineData))
}


/*


var lineFunction = d3.line()
    //.curve(d3.curveCatmullRom.alpha(0.2))
    .curve(d3.curveMonotoneX)
    .x(function (d) {
        return d.x;
    })
    .y(function (d) {
        return d.y
    });


function create_lines(id, nodeType, current_node, middle_node, div_id_chart) {
    if (nodeType.type !== current_node_type) {

        if (middle_node === undefined || middle_node ==="") {
            middle_node = filter_by_node_type(current_node_type, calculated_node_objects_per_div[get_index_of_chart_div_id(div_id_chart)].calculated_node_objects).group_nodes[0].layout;
        }
        var layout = calculate_layout_of_lines(current_node, middle_node);

        create_line_div();

        function create_line_div() {

            d3.select('#' + div_id_chart)
                .append('div')
                .attr('class', 'line_divs')
                .attr('id', id + '_line')
                .style('position', 'absolute')
                .style('top', layout.divData.pos_y + 'px')
                .style('left', layout.divData.pos_x + "px")
                .style('width', layout.divData.width + "px")
                .style('height', layout.divData.height + "px")
                //.style("border", "1px solid white");


            var svgContainer = d3.select('#' + div_id_chart).select('#' + id + '_line').append("svg")
                .attr('id', 'line')
                .attr("width", layout.divData.width + 'px')
                .attr("height", layout.divData.height + 'px')
            //.style("border", "1px solid green");

            //The line SVG Path we draw
            var lineGraph = svgContainer.append("path")
                .attr('id', "line_path")
                .attr("d", lineFunction(layout.lineData))
                .attr("stroke", getComputedStyle(svgContainer.node()).getPropertyValue('--main-font-color'))
                .attr("stroke-width", 2)
                .attr("fill", "none")
                .style('opacity', 0)
                .transition()
                .duration(myDuration_lines/2)
                .style('opacity', 1);
        }
    }
}

/!**
 * layout params need pos_x, pos_y, node_width, node_height
 *
 * @param child_parent_node_layout
 * @param middle_node_layout
 * @returns {Array}
 *!/
function calculate_layout_of_lines(child_parent_node_layout, middle_node_layout) {
    var pos_x_1, pos_y_1, pos_x_2, pos_y_2, pos_x_3, pos_y_3;

    var layout = [];
    var lineData = [];
    var divData = [];

    var space_second_point = 5;
    var space_point = space_second_point;

    // child - right
    if (child_parent_node_layout.pos_x > middle_node_layout.pos_x) {
        pos_x_1 = child_parent_node_layout.pos_x + 30;
        pos_x_2 = pos_x_1 - space_second_point;
        pos_x_3 = middle_node_layout.pos_x + middle_node_layout.node_width - 30 + 2;

        //parent - left
    } else {
        pos_x_1 = child_parent_node_layout.pos_x + child_parent_node_layout.node_width - 30;
        pos_x_2 = pos_x_1 + space_second_point;
        pos_x_3 = middle_node_layout.pos_x + 30 - 2;
        space_point = -space_point;

    }

    pos_y_1 = child_parent_node_layout.pos_y + child_parent_node_layout.node_height / 2;
    pos_y_2 = pos_y_1;
    pos_y_3 = middle_node_layout.pos_y + (middle_node_layout.node_height / 2);

    var div_height = Math.abs(pos_y_3 - pos_y_1);
    if (div_height < 20) {
        div_height = 20;
    }

    divData = {
        height: div_height + 2* space_second_point ,
        width: Math.abs(pos_x_3 - pos_x_1),
        pos_x: Math.min(pos_x_1, pos_x_3),
        pos_y: Math.min(pos_y_1, pos_y_3)
    };

    lineData.push({x: pos_x_1 - Math.min(pos_x_3, pos_x_1), y: pos_y_1 - Math.min(pos_y_1, pos_y_3) });
    lineData.push({x: pos_x_2 - Math.min(pos_x_3, pos_x_1), y: pos_y_2 - Math.min(pos_y_1, pos_y_3) });
    lineData.push({x: pos_x_3 - Math.min(pos_x_3, pos_x_1) + space_point, y: pos_y_3 - Math.min(pos_y_1, pos_y_3 )});
    lineData.push({x: pos_x_3 - Math.min(pos_x_3, pos_x_1), y: pos_y_3 - Math.min(pos_y_1, pos_y_3)})


    layout.divData = divData;
    layout.lineData = lineData;

    return layout;
}

/!**
 *
 * @param id
 * @param layout_childParent
 * @param layout_middle_node
 * @param bool_remove
 * @param new_id
 *!/
function animate_lines(div_id_chart, id, layout_childParent, layout_middle_node, bool_remove, new_id) {

    var new_layout_line = calculate_layout_of_lines(layout_childParent, layout_middle_node);


    // switching first and last point
    if (new_id && new_layout_line.lineData[new_layout_line.lineData.length-1].x < new_layout_line.lineData[0].x) {
        new_layout_line = new_layout_line.reverse();
    }


    if (bool_remove) {
        d3.select('#' + div_id_chart).select('#' + id+'_line')
            .transition()
            .duration(myDuration)
            .style('opacity', 0)
            .style('top', new_layout_line.divData.pos_y + 'px')
            .style('left', new_layout_line.divData.pos_x + 'px')
            .style('height', new_layout_line.divData.height + "px")
            .style('width', new_layout_line.divData.width + "px")
            .remove();
    } else {

        d3.select('#' + div_id_chart).select('#' + id+'_line')
            .transition()
            .duration(myDuration)
            .style('top', new_layout_line.divData.pos_y + 'px')
            .style('left', new_layout_line.divData.pos_x + 'px')
            .style('height', new_layout_line.divData.height + "px")
            .style('width', new_layout_line.divData.width + "px");
    }

    d3.select('#' + div_id_chart).select('#' + id + '_line').select("#line")
        .transition()
        .duration(myDuration)
        .attr("width", new_layout_line.divData.width + 'px')
        .attr("height", new_layout_line.divData.height + 'px')
        .on('end', function (d) {
            if (new_id !== undefined) {
                d3.select('#' + div_id_chart).select('#' + id+'_line').attr('id', new_id+'_line')
            }
        });


    d3.select('#' + div_id_chart).select('#' + id+'_line').select('path#line_path')
        .transition()
        .duration(myDuration)
        .style('opacity', function(d) {
            if (bool_remove) {
                return 0;
            }
        })
        .attr('d', lineFunction(new_layout_line.lineData))
}*/
