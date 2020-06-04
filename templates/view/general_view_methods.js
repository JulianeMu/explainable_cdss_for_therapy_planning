
function append_heading(parent_div_id, heading_text_id, textanchor_end) {
    var svg_text = d3.select(parent_div_id).append('svg')
        .attr('width', parseFloat(d3.select(parent_div_id).node().getBoundingClientRect().width) + 'px')
        .attr('height', 30 + 'px')
        .style('padding-bottom', 10 + 'px');

    svg_text
        .append('text')
        .attr('id', 'outcome_text')
        .attr('font-size', '1.5em')
        .attr('font-weight', 700)
        .text(get_language__label_by_id(heading_text_id))
        .style('fill', getComputedStyle(svg_text.node()).getPropertyValue('--main-font-color'))
        .attr('text-anchor', function () {
            if (textanchor_end) {
                return 'end';
            }
        })
        .attr('transform', function () {
            if (textanchor_end) {
                return 'translate(' + (parseFloat(svg_text.attr('width'))) +
                    ',' + (parseFloat(svg_text.attr('height'))-5) + ')';
            }
            return 'translate(' + (0) +
                ',' + (parseFloat(svg_text.attr('height'))-5) + ')';
        });
    return svg_text;
}