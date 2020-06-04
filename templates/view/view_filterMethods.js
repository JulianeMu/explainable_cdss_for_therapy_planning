// /**
//  * @author juliane müller
//  */
// function initialize_filterMethods(all_versions, evidences) {
//
//     var parent_div_id = '#filter_methods';
//
//     append_heading(parent_div_id, language_id_filter_methods);
//     //initialize_first_row_version(parent_div_id, all_versions);
//     initialize_relevance_slider(parent_div_id, evidences);
//     //initialize_update_button(parent_div_id);
// }
//
//
// function initialize_left_side_label_filter_div_svg(parent_div_id, current_id, text) {
//     var svg_simulation_version = d3.select(parent_div_id).append('div')
//         .attr('id', current_id + '_id')
//         .style('width', parseFloat(d3.select(parent_div_id).style('width')) / 3 + 'px')
//         .style('height', 40 + 'px')
//         .style('position', 'relative')
//         .style('float', 'left')
//         .append('svg')
//         .attr('width', parseFloat(d3.select(parent_div_id).style('width')) / 3 + 'px')
//         .attr('height', 40 + 'px');
//
//
//     svg_simulation_version
//         .append('text')
//         .attr('id', current_id + '_text')
//         .attr('font-size', '1.2em')
//         .text(text)
//         .attr('transform', 'translate(' + (0) +
//             ',' + (33 / 2) + ')');
// }
//
// function initialize_right_side_label_filter_div(parent_div_id, current_id) {
//     return d3.select(parent_div_id).append('div')
//         .attr('id', current_id + '_right_side')
//         .style('width', parseFloat(d3.select(parent_div_id).style('width')) / 3 * 2 - 5 + 'px')
//         .style('height', 40 + 'px')
//         .style('position', 'relative')
//         .style('float', 'left');
// }
//
//
// /**
//  * @author juliane müller
//  */
// function initialize_first_row_version(parent_div_id) {
//     var testing_versions = ['1-abc', '2-abc'];
//
//     var current_div_id = 'simulation_version';
//
//     initialize_left_side_label_filter_div_svg(parent_div_id, current_div_id, get_language__label_by_id(language_id_simulation_version));
//
//     // dropdown menu version
//     var simulation_version_dropdown_div = initialize_right_side_label_filter_div(parent_div_id, current_div_id);
//
//     simulation_version_dropdown_div
//         .append("select")
//         .style('width', simulation_version_dropdown_div.style('width'))
//         .selectAll("option")
//         .data(testing_versions)
//         .enter()
//         .append("option")
//         .attr("value", function (d) {
//             return d;
//         })
//         .text(function (d) {
//             return d;
//         });
// }
//
// /**
//  *
//  * @param parent_div_id
//  */
// function initialize_relevance_slider(parent_div_id) {
//
//     initialize_left_side_label_filter_div_svg(parent_div_id, slider_div_id, get_language__label_by_id(language_id_label_relevance) + ':');
//
//     var relevance_slider_main_div = initialize_right_side_label_filter_div(parent_div_id, slider_div_id);
//
//     relevance_slider_main_div.style('width', parseFloat(d3.select('#' + slider_div_id + '_right_side').style('width')) - 20 + 'px');
//     relevance_slider_main_div.style('padding-left', '10px').style('padding-right', '10px');
//    // relevance_slider_div.style('height', parseFloat(relevance_slider_div.style('height')) + 60 + 'px');
//
//     relevance_slider_main_div.append('div')
//         .attr('id', slider_div_id + '_slider')
//         .attr('class', 'slider');
//
//     relevance_slider_div = document.getElementById(slider_div_id + '_slider');
//     noUiSlider.create(relevance_slider_div, {
//         start: [0, 100],
//         connect: true,
//         range: {
//             'min': 0,
//             'max': 100
//         },
//         step: 10,
//         margin: 10,
//         pips: {
//             mode: 'steps',
//             stepped: true,
//             density: 10
//         }
//     });
//
//     update_relevance_slider_values();
//     relevance_slider_div.noUiSlider.on('update', function(values) {
//
//         slider_min_relevance = values[0] * 0.01;
//         slider_max_relevance = values[1] * 0.01;
//
//         get_outcome_node_evidences(function (all_outcome_nodes, outcome_node, evidences) {
//             update_chart(outcome_node, evidences);
//         });
//     });
//
//     d3.selectAll('.noUi-value').each(function () {
//         d3.select(this).style('top', parseFloat(d3.select(this).style('top')) + 5 + 'px');
//     });
// }
//
//
// /**
//  * @author Juliane Müller
//  */
// function update_relevance_slider_values() {
//     relevance_slider_div.noUiSlider.set([Math.floor(slider_min_relevance * 10) * 10, Math.ceil(slider_max_relevance * 10) * 10]);
// }