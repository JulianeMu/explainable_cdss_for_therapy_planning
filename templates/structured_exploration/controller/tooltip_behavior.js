/**
 * show tooltip
 *
 * @param node_state
 * @param current_prob
 * @param last_prob
 * @param element   element on tooltip
 * @param change_opacity
 */
function show_tooltip(node_state, current_prob, last_prob, element, change_opacity) {

    tooltip.select('svg').selectAll("*").remove();

    let style = getComputedStyle(d3.select(div_id_chart).node());

    const font_size = 18;

    var tooltip_padding = 10;

    let node_label_text = tooltip.select('svg').append('text')
        .attr('alignment-baseline', 'central')
        .text(node_state)
        .attr('text-anchor', 'start')
        .attr('transform', 'translate('+ tooltip_padding+ ',' + (15)  + ')')
        .style('fill', style.getPropertyValue('--main-font-color'))
        .style('font-weight', 700);

    let max_width = 2 * tooltip_padding + node_label_text.node().getComputedTextLength();

    var text_max_state_before = tooltip.select('svg').append('text')
        .attr('alignment-baseline', 'central')
        .text(function() {
            if (last_prob) {
                return (parseFloat(last_prob) * 100).toFixed(1) + "%"
            }
            return (parseFloat(current_prob) * 100).toFixed(1) + "%"
        })
        .attr('text-anchor', 'start')
        .attr('transform', 'translate('+ tooltip_padding+ ',' + (40)  + ')')
        .style('fill', style.getPropertyValue('--main-font-color'))
        .style('font-weight', 700);


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

        var lineGraph = tooltip.select('svg').append("path")
            .attr("d", lineFunction(lineData))
            .attr("stroke", style.getPropertyValue('--main-font-color'))//style.getPropertyValue('--main-font-color'))
            .attr("stroke-width", 1)
            .attr("fill", "none");


        var text_max_state_after = tooltip.select('svg').append('text')
            .attr('alignment-baseline', 'central')
            .text((parseFloat(current_prob) * 100).toFixed(1) + "%")
            .attr('text-anchor', 'start')
            .attr('transform', 'translate(' + (tooltip_padding + 50 + arrow_start) + ',' + (40) + ')')
            .style('fill', style.getPropertyValue('--main-font-color'))
            .style('font-weight', 700);

        max_width = 2*tooltip_padding + 50 + arrow_start + text_max_state_after.node().getComputedTextLength() > max_width ? 2*tooltip_padding + 50 + arrow_start + text_max_state_after.node().getComputedTextLength() : max_width;
    }

    tooltip.style('width', max_width + 'px');
    tooltip.style('height', 55 + 'px');


    tooltip.select('svg')
        .style('width', '100%')
        .style('height', '100%');

    if (parseFloat(tooltip.style('left')) + parseFloat(tooltip.style('width')) > document.body.clientWidth - 5) {
        tooltip.style('left', document.body.clientWidth - parseFloat(tooltip.style('width')) - 5 + 'px');
    }

    var tooltip_layout = calculate_tooltip_pos(node_state, current_prob, last_prob);

    tooltip.style("left", tooltip_layout.left + "px")
        .style("top", tooltip_layout.top + "px")
        .style('opacity', 1);

    tooltip.style('display', 'block');

    if (change_opacity) {
        d3.select(element).attr("opacity", 1);
    }
}


/**
 *
 * @param node_state
 * @param current_prob
 * @param last_prob
 * @param element
 */
function move_tooltip(node_state, current_prob, last_prob, element) {

    current_prob = (parseFloat(current_prob) * 100).toFixed(1) + "%";
    if (last_prob) {
        last_prob = (parseFloat(last_prob) * 100).toFixed(1) + "%"
    }

    var tooltip_layout = calculate_tooltip_pos(node_state, current_prob, last_prob);

    //tooltip.select('.label').text(text);
    tooltip.style('width', tooltip_layout.width + 'px');

    tooltip.style("left", tooltip_layout.left + "px")
        .style("top", tooltip_layout.top + "px");
}


function calculate_tooltip_pos(node_state, current_prob, last_prob) {

    function getTextWidth(node_state, fontSize, fontFace) {
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        context.font = fontSize + 'px ' + fontFace;
        return context.measureText(node_state).width;
    }


    var text_width = getTextWidth(node_state, 22, 'Arial');
    text_width = getTextWidth(current_prob, 22, 'Arial') > text_width ? getTextWidth(current_prob, 22, 'Arial') : text_width;


    var chart_width = parseFloat(d3.select('#whole_view').style('width'));
    var mouse_pos_x = parseFloat(d3.event.pageX) + 20;


    var tooltip_pos_x = mouse_pos_x;

    if (chart_width < mouse_pos_x + text_width + 40) {

        tooltip_pos_x = chart_width - text_width - 40;
    }

    var chart_height = parseFloat(d3.select('#whole_view').style('height'));
    var mouse_pos_y = d3.event.pageY;
    var tooltip_height = parseFloat(tooltip.style('height'));

    var tooltip_pos_y = mouse_pos_y - 50;
    if (chart_height < mouse_pos_y + tooltip_height) {
        tooltip_pos_y = chart_height - tooltip_height - 30;
    }

    var tooltip_layout = {
        top: tooltip_pos_y,
        left: tooltip_pos_x,
        width: text_width,
        height: tooltip_height
    };

    return tooltip_layout;
}

/**
 * hide tooltip
 *
 * @param element
 */
function hide_tooltip(element, change_opacity) {
    tooltip.style('display', 'none');

    if (change_opacity) {
        d3.select(element).attr("opacity", 0.8);
    }
}