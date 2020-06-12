function initialize_outcome_variables_view(all_outcome_nodes) {

    //ToDo: Enable more outcome variables --> Auswahlliste
    //ToDo: Mach zweite Zeile auf für mehr als 3 Nodes

    var parent_div_id = '#outcome';
    var padding_between_divs = 5;

    var min_width_outcome_node = 100, //130, //100
        min_height_outcome_node = 140;

    var heading_outcome_text_svg = append_heading(parent_div_id, language_id_outcome_variables);
    heading_outcome_text_svg.attr('width', parseFloat(heading_outcome_text_svg.attr('width')) - 30 + 'px');
    append_plus(parent_div_id);

    var outcome_nodes_div = d3.select(parent_div_id).append('div')
        .style('top', 45 + 'px')
        .style('left', padding_between_divs + 'px')
        .style('position', 'absolute')
        .style('width', parseFloat(d3.select(parent_div_id).style('width')) - 3 * padding_between_divs + 'px')
        .style('height', parseFloat(d3.select(parent_div_id).style('height')) - 30 - padding_between_divs + 'px')
        .style('overflow-y', 'auto');

    var outcome_node_div_width = min_width_outcome_node;
    var outcome_node_div_height = min_height_outcome_node;

    let outcome_nodes_amount = 4;
    var calculated_width = (parseFloat(outcome_nodes_div.style('width')) - outcome_nodes_amount * padding_between_divs - padding_between_divs)/ outcome_nodes_amount;
   // var calculated_width = (parseFloat(outcome_nodes_div.style('width')) - all_outcome_nodes.length * padding_between_divs - padding_between_divs)/ all_outcome_nodes.length;

    if (outcome_node_div_width < calculated_width) {
        outcome_node_div_width = calculated_width;
    }

    for (var i = 0; i < all_outcome_nodes.length; i++) {
        //outcome_node, outcome_nodes_div, outcome_node_div_width, outcome_node_div_height, x_pos, y_pos
        var x_pos = i%outcome_nodes_amount * (outcome_node_div_width + padding_between_divs) + padding_between_divs;
        var y_pos = Math.floor(i/outcome_nodes_amount) * outcome_node_div_height + Math.floor(i/outcome_nodes_amount) * 20;
        append_outcome_node_div(all_outcome_nodes[i], outcome_nodes_div, outcome_node_div_width, outcome_node_div_height, x_pos, y_pos);
    }
    create_side_nav(parent_div_id.split("#")[1]);


    //highlight_currently_selected_outcome_node(all_outcome_nodes, currently_selected_outcome_node_id);
}


function append_plus(parent_div_id) {

    var svg_plus = d3.select(parent_div_id).append('svg')
        .attr('id', 'svg_add_outcome')
        .attr('width', 30 + 'px')
        .attr('height', 30 + 'px')
        .style('padding-bottom', 10 + 'px')
        .style('position', 'absolute')
        .style('right', 10+'px')
        .style('top', 10+'px')
        .style('fill', getComputedStyle(d3.select(parent_div_id).node()).getPropertyValue('--main-font-color'));

    $.get('icons/add_button.svg', function(data){
        $('#svg_add_outcome').append(data.documentElement)
    });


    svg_plus.on('click', function () {
        add_outcome(parent_div_id.split('#')[1]);
    })
    
}

function append_outcome_node_div(outcome_node, outcome_nodes_div, outcome_node_div_width, outcome_node_div_height, x_pos, y_pos) {

    var current_div = outcome_nodes_div.append('div')
        .attr('id', outcome_node.node_id + outcome_node_div_ending)
        .style('left', x_pos + 'px')
        .style('top', y_pos + 'px')
        .style('position', 'absolute')
        .style('width', outcome_node_div_width + 'px')
        .style('height', outcome_node_div_height + 'px');

    var svg = current_div.append('svg')
        .style('width', current_div.style('width'))
        .style('height', current_div.style('height'));

    create_text_pie(outcome_node, current_div);

    var node_width = parseFloat(current_div.style('width')) - 5;

    current_div.selectAll('text').each(function () {
        var length = this.getComputedTextLength();

        if (node_width < length) {
            var old_text = d3.select(this).text();
            var old_text_splitted = old_text.split(':');

            old_text_splitted[0] = old_text_splitted[0].slice(0, -1);
            old_text_splitted[0] = old_text_splitted[0] + '...';

            d3.select(this).text(old_text_splitted[0]);

            remove_letters_from_text(this, node_width);
        }
    });

    function remove_letters_from_text (textnode, node_width) {
        var length = textnode.getComputedTextLength();

        if (node_width < length) {

            var old_text = d3.select(textnode).text();
            var old_text_splitted = old_text.split('...');

            old_text_splitted[0] = old_text_splitted[0].slice(0, -1);

            d3.select(textnode).text(old_text_splitted[0] + '...' + old_text_splitted[1]);

            remove_letters_from_text(textnode, node_width);
        }
    }

    svg.on('click', function () {

        if (currently_selected_outcome_node_id !== this.parentNode.id.split(outcome_node_div_ending)[0]) {
            currently_selected_outcome_node_id = this.parentNode.id.split(outcome_node_div_ending)[0];

            update_after_new_outcome_node(function (response){
            },true);

        }
    });
}

function highlight_currently_selected_outcome_node(all_outcome_nodes, currently_selected_outcome_node) {

    for (var i = 0; i < all_outcome_nodes.length; i++) {
        var color_scale_for_highlighting = colorScale_background;

        if (all_outcome_nodes[i].node_id === currently_selected_outcome_node) {
            color_scale_for_highlighting = colorScale_highlighting;
        }

        var outer_radius = Math.min(parseFloat(d3.select('#' + all_outcome_nodes[i].node_id + outcome_node_div_ending).select('svg').style('width')), parseFloat(d3.select('#' + all_outcome_nodes[i].node_id + outcome_node_div_ending).select('svg').style('height'))) / 2 - 40;
        var outer_radius_old = outer_radius;
        //if (all_outcome_nodes[i].node_id === currently_selected_outcome_node) {
            outer_radius = outer_radius + 20;
            d3.select('#' + currently_selected_outcome_node_id + outcome_node_div_ending).style('background-color', '#d8e3ee'); //'#EAF0F6');
        //}

        //d3.select('#' + currently_selected_outcome_node_id + outcome_node_div_ending);
        //background-color
        var all_path_elements = d3.select('#' + all_outcome_nodes[i].node_id + outcome_node_div_ending).select('svg').selectAll('g');
        all_path_elements.each(function (graph, index) {

            var outer_radi = outer_radius;
            var outer_radi_old = outer_radius_old;
            d3.select(this).select('path')
                .transition()
                .duration(transition_duration)
                //.attr('fill', color_scale_for_highlighting((1/(all_path_elements.size()-1)) * index ))
                //.attr('stroke', color_scale_for_highlighting(1))
                .attrTween("d", function arcTween(d) {
                    var innerRadius = 0;
                    if (all_outcome_nodes[0].states.length>1) {
                        innerRadius = outer_radi/2+1;
                    }
                    if (this.id.includes('node_1')) {
                        outer_radi = outer_radi/2;
                        innerRadius = 0;
                    }

                        var i = d3.interpolateNumber(outer_radi_old, outer_radi); //<-- radius of 0 to donut
                        return function (t) {
                            var r = i(t),
                                arc = d3.arc()
                                    .outerRadius(r)
                                    .innerRadius(innerRadius);
                                    //.innerRadius(outer_radius_old_pie + 1);
                            return arc(d); //<-- return arc path
                        };

                });

        });
    }
}