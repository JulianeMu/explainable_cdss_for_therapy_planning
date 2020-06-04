
function open_in_new_window(node_id) {
    var new_id = makeid();

    var whole_view_width = parseFloat(d3.select('#whole_view').style('width'));
    var whole_view_height = parseFloat(d3.select('#whole_view').style('height'));

    var chart_count = d3.selectAll('.view_element').size();

    var new_created_chart_layout = {};

    switch (chart_count) {
        case 1:
            new_created_chart_layout.width = whole_view_width/2;
            new_created_chart_layout.height = whole_view_height;
            break;
        case 2:
            new_created_chart_layout.width = whole_view_width;
            new_created_chart_layout.height = whole_view_height/2;
            break;
        case 3:
            new_created_chart_layout.width = whole_view_width/2;
            new_created_chart_layout.height = whole_view_height/2;
            break;
    }

    create_chart_div(new_id, new_created_chart_layout.width, new_created_chart_layout.height, node_id);

    d3.selectAll('.view_element').each(function (d) {
        var chartid = this.id.split('_view_element')[0];

        if (chartid !== new_id) {
            d3.select('#' + this.id).style('width', whole_view_width/2 + 'px');
            d3.select('#' + this.id).style('height', new_created_chart_layout.height + 'px');

            update_chart(chartid);
        }
    })
}

function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 7; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return 'a' + text;
}

function update_chart(div_id_chart) {

    var target = [];
    target.id = div_id_chart + '_view_element';

    remove_all_divs_from_chart(target.id);


    var index = 0;
    var bool_contains = false;

    for (var i = 0; i < rotate_boolean_whole.length; i++) {
        if (rotate_boolean_whole[i].div_id === div_id_chart) {
            bool_contains = true;
            index = i;
        }
    }

    if (rotate_boolean_whole.length === 0 || !bool_contains) {
        rotate_boolean_whole.push({
            div_id: div_id_chart,
            bool: true
        });

        rotation_direction_whole.push({
                div_id: div_id_chart,
                bool: true
            }
        );
        index = rotate_boolean_whole.length - 1;
    }

//    d3.select('#'+target.id).select('#'+div_id_chart).style('height', parseFloat(view_element.clientHeight) - parseFloat(icons_div.clientHeight) - parseFloat(window.getComputedStyle(view_element).getPropertyValue('padding-top'))  - parseFloat(window.getComputedStyle(view_element).getPropertyValue('padding-bottom'))+ 'px';

    d3.select('#'+target.id).select('#'+div_id_chart).style('height', parseFloat(d3.select('#'+target.id).node().clientHeight) - parseFloat(d3.select('#'+target.id).select('.icons').node().clientHeight) - parseFloat(window.getComputedStyle(d3.select('#'+target.id).node()).getPropertyValue('padding-top'))  - parseFloat(window.getComputedStyle(d3.select('#'+target.id).node()).getPropertyValue('padding-bottom')) + 'px');

    if (rotation_direction_whole[index].bool) {

        set_calculation_duration_is_over_false(div_id_chart);

        // get_influence_of_evidences_on_target(function (response) {
        //     getNodeObjects_with_Virtual_evidences(function (target_nodes) {
        //
        //         create_influence_of_evidences_view(div_id_chart, response, target_nodes)
        //         set_calculation_duration_is_over_true(div_id_chart);
        //
        //     }, target_variables);
        // }, net_name, patient_id, net_version, [currently_selected_target_variable], username, password, true);
    } else {
        set_all_nodes(div_id_chart);

        if (parseFloat(d3.select('#'+target.id).select('#mySidenav').style('width')) > 0) {
            var side_nav_id = 'mySidenav';
            var canvas_height = parseFloat(d3.select('#' + div_id_chart).style('height')) - parseFloat(d3.select('#' + div_id_chart).select('#' + side_nav_id).style('top')) - parseFloat(d3.select('#' + div_id_chart).select('#' + side_nav_id).style('padding-top'));

            d3.select('#' + target.id).select('#mySidenav').style('height', canvas_height + 'px');
            d3.select('#' + target.id).select('#canvas_list_div').style('height', canvas_height - document.getElementById('canvas_list_div').offsetTop + 60 + 'px');
        }
    }
}