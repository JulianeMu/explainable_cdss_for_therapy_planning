/*
var icon_values = [
    {
        div_name: 'close_button',
        file_name: 'close'
    },
/!*    {
        div_name: 'rotation_button',
        file_name: 'rotate'
    },*!/
    {
        div_name: 'home_button',
        file_name: 'home'
    },
    {
        div_name: 'search_button',
        file_name: 'search'
    },
    {
        div_name: 'foreward_button',
        file_name: 'right_arrow'
    },
    {
        div_name: 'backward_button',
        file_name: 'right_arrow'
    }];

var tooltip;

var calculated_node_objects_per_div = [];

function create_chart_div(id, div_width, div_height, node_id) {

    var view_element = document.createElement('div');
    view_element.id = id + '_view_element';
    view_element.setAttribute('class', 'view_element');

    var legend_height = 0;//parseFloat(document.getElementById('legend').clientHeight);

    var view_element_width = 100+ '%';
    var view_element_height = parseFloat(document.getElementById('whole_view').clientHeight) - legend_height;

    if (div_width) {
        view_element_width = div_width;
    }
    if (div_height) {
        view_element_height = div_height - legend_height;
    }

    view_element.style.width = view_element_width + 'px';
    view_element.style.height = view_element_height + 'px';


    var div_id_chart = id;
    //create div_element
    var chart_div = document.createElement('div');
    chart_div.id = id;
    chart_div.setAttribute('class', 'chart');



    var icons_div = document.createElement('div');
    icons_div.id = id + 'icons';
    icons_div.setAttribute('class', 'icons');

    var mode_text = document.createElement('div');
    mode_text.id = id + '_mode_text';
    mode_text.setAttribute('class', 'mode_text');
    icons_div.appendChild(mode_text);


    for (var i = 0; i < icon_values.length; i++) {

        if (node_id) {
            create_icons_div(icon_values[i]);
        } else {
            if (i > 0) {
                if (just_for_testing_matthaeus && i === 1) {

                } else {
                    create_icons_div(icon_values[i]);
                }
            }
        }
    }

    //create icons
    function create_icons_div(icon_values) {
        var icon_div = document.createElement('div');
        icon_div.id = icon_values.div_name;
        icon_div.setAttribute('class', 'buttons');
        icons_div.appendChild(icon_div);

        // create the icon from svg file
        // add functionality
        add_icon_to_chart(icon_values.file_name, icon_values.div_name, icons_div.id);
    }

    // create side navigation
    var side_nav_id = 'mySidenav';
    var icon_div_search = document.createElement('div');
    icon_div_search.id = side_nav_id;
    icon_div_search.setAttribute('class', 'sidenav');

    var side_nav_node__search = document.createElement('a');
    side_nav_node__search.id = 'close_canvas';
    side_nav_node__search.href = "javascript:void(0)";
    side_nav_node__search.setAttribute('class', 'closebtn');
    side_nav_node__search.onclick = function () {
        closeNav(div_id_chart);
    };
    side_nav_node__search.textContent = decodeURI('%C3%97'); //times sign
    icon_div_search.appendChild(side_nav_node__search);
    chart_div.appendChild(icon_div_search);


    var icon_div_setEvidence = document.createElement('div');
    icon_div_setEvidence.id = 'side_nav_set_evidence';
    icon_div_setEvidence.setAttribute('class', 'sidenav');

    var side_nav_node__setEvidence = document.createElement('a');
    side_nav_node__setEvidence.id = 'close_canvas';
    side_nav_node__setEvidence.href = "javascript:void(0)";
    side_nav_node__setEvidence.setAttribute('class', 'closebtn');
    side_nav_node__setEvidence.onclick = function () {
        closeNav_set_evidence(div_id_chart);
    };
    side_nav_node__setEvidence.textContent = decodeURI('%C3%97'); //times sign

    // add all elements to chart div
    icon_div_setEvidence.appendChild(side_nav_node__setEvidence);
    chart_div.appendChild(icon_div_setEvidence);

    view_element.appendChild(icons_div);
    view_element.appendChild(chart_div);

    document.getElementById('whole_view').appendChild(view_element);

    // set height of chart
    chart_div.style.height = parseFloat(view_element.clientHeight) - parseFloat(icons_div.clientHeight) - parseFloat(window.getComputedStyle(view_element).getPropertyValue('padding-top'))  - parseFloat(window.getComputedStyle(view_element).getPropertyValue('padding-bottom'))+ 'px';
    chart_div.style.width = parseFloat(view_element.clientWidth) - parseFloat(window.getComputedStyle(view_element).getPropertyValue('padding-left')) - parseFloat(window.getComputedStyle(view_element).getPropertyValue('padding-right'))+ 'px';


    var svg_element = d3.select('#' + id + '_mode_text').append('svg')
        .attr('width', 370)
        .attr('height', 40);
    svg_element
        .append('text')
        .attr('id', 'mode_text_id')
        .attr('font-size', '1.2em')
        .attr('font-weight', 100)
        //.style('fill', 'white')
        .text(function () {
            if (node_id) {
                return get_language__label_by_id(language_id_string_exploration_mode);
            } else {
                return get_language__label_by_id(language_id_string_overview_mode);
            }
        })
        .attr('transform', 'translate(' + (0) +
            ',' + (40 / 2) + ')');


    //defining the node layers and used colors
    var calculated_node_objects = [{
        type: parent_type,
        node_width: 0,
        node_height: 0,
        color: color_parent_current_children.parent,
        donut_inner_radius: 20,
        min_height_donut: 140,
        min_width_donut: 300,
        pos_x: 0,
        is_calculated: false,
        group_nodes: []
    }, {
        type: current_node_type,
        node_width: 0,
        node_height: 0,
        color: color_parent_current_children.current,
        donut_inner_radius: 20,
        min_height_donut: 140,
        min_width_donut: 300,
        pos_x: 1 / 3,
        is_calculated: false,
        group_nodes: []
    }, {
        type: children_type,
        node_width: 0,
        node_height: 0,
        color: color_parent_current_children.children,
        donut_inner_radius: 20,
        min_height_donut: 140,
        min_width_donut: 300,
        pos_x: 2 / 3,
        is_calculated: false,
        group_nodes: []
    }];


    calculated_node_objects_per_div.push({
        div_name: id,
        calculated_node_objects: calculated_node_objects,
        selected_nodes_to_go_back_forward: [],
        index_selected_nodes_to_go_back_forward: 0
    });


    //create_variables
    animation_duration_is_over.push({
        div_id: id,
        bool: true
    });
    check_if_all_calculated.push({
        div_id: id,
        bool: false
    });
    check_if_all_parents_children_calculated.push({
        div_id: id,
        bool: false
    });
    rotation_mostImportant_all.push({
        div_id: id,
        bool: true
    });

    var selected_node_id = node_id;
    if (!node_id) {

        // fill with values
        // important view
        //create_all_evidences(id)

        set_calculation_duration_is_over_false(div_id_chart);


        if (!just_for_testing_matthaeus)

        //create_objects_for_important(id);
            selected_node_id = current_node_id;
    }



    //get nodes for only important visualization
    get_all_information_of_selected_node(function (response) {

        calculated_node_objects_per_div[get_index_of_chart_div_id(id)].calculated_node_objects = response;

        //create_parents_children_OF_parents_children_for_node(function (response) {
        set_calculation_parents_children_duration_is_over_true(div_id_chart);

        if (node_id || just_for_testing_matthaeus) {
            rotate_forward_wholeChart(id);
        }
        //}, response, id);
    }, selected_node_id, calculated_node_objects, id);
}*/


var icon_values = [
    {
        div_name: 'close_button',
        file_name: 'close'
    },
    {
        div_name: 'rotation_button',
        file_name: 'rotate'
    },
    {
        div_name: 'home_button',
        file_name: 'home'
    },
    {
        div_name: 'search_button',
        file_name: 'search'
    },
    {
        div_name: 'foreward_button',
        file_name: 'right_arrow'
    },
    {
        div_name: 'backward_button',
        file_name: 'right_arrow'
    }];

var tooltip;

var calculated_node_objects_per_div = [];

function create_chart_div(id, div_width, div_height, node_id) {

    var view_element = document.createElement('div');
    view_element.id = id + '_view_element';
    view_element.setAttribute('class', 'view_element');


    var div_id_chart = id;
    //create div_element
    var chart_div = document.createElement('div');
    chart_div.id = id;
    chart_div.setAttribute('class', 'chart');

    if (div_width) {
        view_element.style.width = div_width + 'px';
    }
    if (div_height) {
        view_element.style.height = div_height + 'px';
    }


    var icons_div = document.createElement('div');
    icons_div.id = id + 'icons';
    icons_div.setAttribute('class', 'icons');

    var mode_text = document.createElement('div');
    mode_text.id = id + '_mode_text';
    mode_text.setAttribute('class', 'mode_text');
    icons_div.appendChild(mode_text);


    for (var i = 0; i < icon_values.length; i++) {

        if (node_id) {
            create_icons_div(icon_values[i]);
        } else {
            if (i > 0) {
                if (just_for_testing_matthaeus && i === 1) {

                } else {
                    create_icons_div(icon_values[i]);
                }
            }
        }
    }

    //create icons
    function create_icons_div(icon_values) {
        var icon_div = document.createElement('div');
        icon_div.id = icon_values.div_name;
        icon_div.setAttribute('class', 'buttons');
        icons_div.appendChild(icon_div);

        // create the icon from svg file
        // add functionality
        add_icon_to_chart(icon_values.file_name, icon_values.div_name, icons_div.id);
    }

    // create side navigation
    var side_nav_id = 'mySidenav';
    var icon_div_search = document.createElement('div');
    icon_div_search.id = side_nav_id;
    icon_div_search.setAttribute('class', 'sidenav');

    var side_nav_node__search = document.createElement('a');
    side_nav_node__search.id = 'close_canvas';
    side_nav_node__search.href = "javascript:void(0)";
    side_nav_node__search.setAttribute('class', 'closebtn');
    side_nav_node__search.onclick = function () {
        closeNav(div_id_chart);
    };
    side_nav_node__search.textContent = decodeURI('%C3%97'); //times sign
    icon_div_search.appendChild(side_nav_node__search);
    chart_div.appendChild(icon_div_search);


    var icon_div_setEvidence = document.createElement('div');
    icon_div_setEvidence.id = 'side_nav_set_evidence';
    icon_div_setEvidence.setAttribute('class', 'sidenav');

    var side_nav_node__setEvidence = document.createElement('a');
    side_nav_node__setEvidence.id = 'close_canvas';
    side_nav_node__setEvidence.href = "javascript:void(0)";
    side_nav_node__setEvidence.setAttribute('class', 'closebtn');
    side_nav_node__setEvidence.onclick = function () {
        closeNav_set_evidence(div_id_chart);
    };
    side_nav_node__setEvidence.textContent = decodeURI('%C3%97'); //times sign

    // add all elements to chart div
    icon_div_setEvidence.appendChild(side_nav_node__setEvidence);
    chart_div.appendChild(icon_div_setEvidence);

    view_element.appendChild(icons_div);
    view_element.appendChild(chart_div);

    document.getElementById('whole_view').appendChild(view_element);

    chart_div.style.height = parseFloat(view_element.clientHeight) - parseFloat(icons_div.clientHeight) + 'px';

    var svg_element = d3.select('#' + id + '_mode_text').append('svg')
        .attr('width', 150)
        .attr('height', 40);
    svg_element
        .append('text')
        .attr('id', 'mode_text_id')
        .attr('font-size', '1em')
        .attr('font-weight', 100)
        .style('fill', 'white')
        .text(function (d) {
            if (node_id) {
                return get_language__label_by_id(language_id_string_exploration_mode);
            } else {
                return get_language__label_by_id(language_id_string_overview_mode);
            }
        })
        .attr('transform', 'translate(' + (0) +
            ',' + (40 / 2) + ')');

    // initialize tooltip
    tooltip = d3.select('#' + id)
        .append('div')
        .attr('id', 'tooltip')
        .attr('class', 'tooltip')
        .style("opacity", 0)
        .style('z-index', 90);

    tooltip.append('svg')
        .style('width', '100%')//tooltip_div.style('width'))
        .style('height', '100%')//tooltip_div.style('height'))
        .style('left', 5+'px');


    //defining the node layers and used colors
    var calculated_node_objects = [{
        type: parent_type,
        node_width: 0,
        node_height: 0,
        color: color_parent_current_children.parent,
        donut_inner_radius: 20,
        min_height_donut: 140,
        min_width_donut: 300,
        pos_x: 0,
        is_calculated: false,
        group_nodes: []
    }, {
        type: current_node_type,
        node_width: 0,
        node_height: 0,
        color: color_parent_current_children.current,
        donut_inner_radius: 20,
        min_height_donut: 140,
        min_width_donut: 300,
        pos_x: 1 / 3,
        is_calculated: false,
        group_nodes: []
    }, {
        type: children_type,
        node_width: 0,
        node_height: 0,
        color: color_parent_current_children.children,
        donut_inner_radius: 20,
        min_height_donut: 140,
        min_width_donut: 300,
        pos_x: 2 / 3,
        is_calculated: false,
        group_nodes: []
    }];


    calculated_node_objects_per_div.push({
        div_name: id,
        calculated_node_objects: calculated_node_objects,
        selected_nodes_to_go_back_forward: [],
        index_selected_nodes_to_go_back_forward: 0
    });


    //create_variables
    animation_duration_is_over.push({
        div_id: id,
        bool: true
    });
    check_if_all_calculated.push({
        div_id: id,
        bool: false
    });
    check_if_all_parents_children_calculated.push({
        div_id: id,
        bool: false
    });
    rotation_mostImportant_all.push({
        div_id: id,
        bool: true
    });

    var selected_node_id = node_id;
    if (!node_id) {

        // fill with values
        // important view
        //create_all_evidences(id)

        if (!just_for_testing_matthaeus)
            create_objects_for_important(id);
        selected_node_id = current_node_id;
    }

    //get nodes for only important visualization
    get_all_information_of_selected_node(function (response) {

        calculated_node_objects_per_div[get_index_of_chart_div_id(id)].calculated_node_objects = response;

        //create_parents_children_OF_parents_children_for_node(function (response) {
        set_calculation_parents_children_duration_is_over_true(div_id_chart);

        if (node_id || just_for_testing_matthaeus) {
            rotate_forward_wholeChart(id);
        }
        //}, response, id);
    }, selected_node_id, calculated_node_objects, id);
}
