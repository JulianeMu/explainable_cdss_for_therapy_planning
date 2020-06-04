function initialize_guidelines() {

    var parent_div_id = '#guidelines_all';

    // d3.select(parent_div_id).append('div')
    //     .attr('id', 'button_filter')
    //     .style('width', 'calc(50% - 0px)')
    //     .style('height', 30 + 'px')
    //     .style('position', 'relative')
    //     .style('float', 'left')
    //     .style('padding-bottom', 10 + 'px');
    //
    // d3.select(parent_div_id).append('div')
    //     .attr('id', 'button_further_information')
    //     .style('width', 'calc(50% - 0px)')
    //     .style('height', 30 + 'px')
    //     .style('position', 'relative')
    //     .style('float', 'left')
    //     .style('padding-bottom', 10 + 'px');


    //append_heading('#button_filter', language_id_filter_methods);
    //append_heading('#button_further_information', language_id_further_information, true);
    //append_heading('#button_further_information', language_id_further_information);
    append_heading(parent_div_id, language_id_further_information);

    // d3.select(parent_div_id).append('div')
    //     .attr('id', 'guidelines_change')
    //     .style('width', '100%')
    //     .style('height', "calc(100% - 40px)")
    //     .style('position', 'relative')
    //     .style('float', 'left');

    //parent_div_id = "#guidelines_change";

    // d3.select('#button_filter').select('svg').on('click', function () {
    //     d3.select(parent_div_id).selectAll('*').remove();
    //     initialize_filter_methods_new();
    // });
    //
    // d3.select('#button_further_information').select('svg').on('click', function () {
    //     d3.select(parent_div_id).selectAll('*').remove();
    //     fill_in_guidelines(parent_div_id);
    //     set_guidelines_text_for_rehighlighting(document.getElementById('guidelines').innerHTML, "");//max_state.state);
    // });

    fill_in_guidelines(parent_div_id);
}