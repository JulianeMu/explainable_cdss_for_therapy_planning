

function initialize_heading() {

    initialize_svgs_text('#heading_text', 'mode_text_id', get_language__label_by_id(language_id_heading));
    initialize_svgs_text('#patient_name', 'patient_name_text_id', 'Jane Doe', true);

    initialize_svgs_text('#sap_id', 'sap_id_text_id', get_language__label_by_id(language_id_label_sap_id), true);

    var select = d3.select('#sap_number_id')
        .append('select')
        .attr('class', 'select')
        .attr('id', 'dropdown_menu_sap_id')
        //.style('top', evidence_height + 65 + 'px')
        //.style('right', 20 + 'px')
        .style('width', parseFloat(d3.select('#sap_number_id').style('width')) - 4 + 'px')
        //.style('max-width', parseFloat(d3.select('#sap_number_id').style('width')) - 4 + 'px')
        //.style('position', 'absolute');

    var data = [];
    data.push({sap_id: 'CaseEndomCancer'}, {sap_id: 'CaseEndomCancer2'});


    var options2 = d3.select("#dropdown_menu_sap_id").selectAll("option")
        .data(data);

    options2.exit().remove();

    options2.enter()
        .append("option")
        .merge(options2)
        .text(function (d) {
            return d.sap_id;
        });

    d3.select('#dropdown_menu_sap_id').on('change', function () {

        update_cases(function(response){
            virtual_evidences = [];
            all_outcome_node_ids_real = all_outcome_node_ids_initial;
            currently_selected_outcome_node_id = all_outcome_node_ids_real[0];
            if (response) {
                update_list_of_evidences(function (response) {
                    if (response) {
                        update_after_new_outcome_node(function(response){
                            //highlight_searched_element_with_scroll(id);
                        }, true);

                    }
                });
            }
        }, d3.select(this).property('value'));
        //update_sap_id_number();//update_bar_chart_plot_by_dropdown_state_relevance(d3.select(this).property('value'), evidences);
    });

/*    d3.select('#sap_number_id').append('input')
        .attr('type', 'number')
        .style('width', parseFloat(d3.select('#sap_number_id').style('width')) - 4 + 'px')
        .on('input', update_sap_id_number);*/
}

function initialize_svgs_text(div_id, svg_id, text, start_end) {
    var svg_heading = d3.select(div_id).append('svg')
        .attr('width', d3.select(div_id).style('width'))
        .attr('height', d3.select(div_id).style('height'));


    svg_heading
        .append('text')
        .attr('id', svg_id)
        .attr('font-size', '1.2em')
        .text(text)
        .attr('text-anchor', function () {

            var anchor = 'start';

            if (start_end !== undefined) {
                anchor = 'end';
            }

            return anchor;
        })
        .attr('transform', function () {

            var x_pos = 0;
            if (start_end !== undefined) {
              x_pos = parseFloat(d3.select(div_id).style('width'));
            }

            return 'translate(' + (x_pos) + ',' + (33 / 2) + ')';
        });
}

function update_sap_id_number() {
    console.log('click')
}
