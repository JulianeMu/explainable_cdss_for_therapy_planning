// <a href="http://www.onlinewebfonts.com">oNline Web Fonts</a>

var icons_opacity_disabled = 0.2;
var icons_opacity_enabled = 1;

var do_not_calculate_again = false;

/**
 * add icons to div elements
 * create on click behavior
 * @param name
 * @param div_name
 */
function add_icon_to_chart(name, div_name, chart_div_id) {
    d3.xml("icons/" + name + ".svg").mimeType("image/svg+xml").get(function (error, xml) {
        if (error) throw error;

        d3.select('#' + chart_div_id).select('#' + div_name).node().appendChild(xml.documentElement);
        //document.getElementById(chart_div_id).getElementById(div_name).appendChild(xml.documentElement);

        var svg = d3.select('#' + chart_div_id).select('#' + div_name).select('svg')
            .attr('id', div_name + 'svg');

        svg.attr('width', '30px')
            .attr('height', '30px')
            .style('fill', getComputedStyle(d3.select(div_id_chart).node()).getPropertyValue('--main-font-color'));

        var splitted_chart_div_id = chart_div_id.split('icons')[0];

        // backward button
        if (div_name === icon_values[5].div_name) {
            svg.attr('transform', 'rotate(180 0 0)');
            svg.on('click', function () {

                if (svg.attr('opacity') + "" === icons_opacity_enabled + "") {
                    do_not_calculate_again = true;

                    go_one_node_back(calculated_node_objects_per_div[get_index_of_chart_div_id(splitted_chart_div_id)].calculated_node_objects, get_chart_div_id(splitted_chart_div_id));
                }
            })
                .attr('opacity', icons_opacity_disabled);

            // foreward button
        } else if (div_name === icon_values[4].div_name) {
            svg.on('click', function () {

                if (svg.attr('opacity') + "" === icons_opacity_enabled + "") {
                    do_not_calculate_again = true;
                    go_one_node_up(get_chart_div_id(splitted_chart_div_id));
                }
            })
                .attr('opacity', icons_opacity_disabled);

            // rotation button
        } else if (div_name === icon_values[1].div_name) {
            svg.on('click', function () {
                if (svg.attr('opacity') + "" === icons_opacity_enabled + "") {

                    animate_whole_chart_element(get_chart_div_id(splitted_chart_div_id));
                    initial_view = false;
                }
            });

            // home button
        } else if (div_name === icon_values[2].div_name) {
            svg.on('click', function () {
                if (svg.attr('opacity') + "" === icons_opacity_enabled + "") {
                    do_not_calculate_again = true;
                    push_new_node_types(get_chart_div_id(splitted_chart_div_id), calculated_node_objects_per_div[get_index_of_chart_div_id(splitted_chart_div_id)].calculated_node_objects, true);
                }
            })
                .attr('opacity', icons_opacity_disabled)

            // search button
        } else if (div_name === icon_values[3].div_name) {
            svg.on('click', function () {
                if (svg.attr('opacity') + "" === icons_opacity_enabled + "") {
                    if (parseFloat(d3.select('#' + splitted_chart_div_id).select('#mySidenav').style('width')) === 0) {
                        search_in_all_nodes(get_chart_div_id(splitted_chart_div_id));
                    } else {
                        closeNav(splitted_chart_div_id);
                    }
                }
            });

            // close button
        } else if (div_name === icon_values[0].div_name) {
            svg.on('click', function () {
                if (svg.attr('opacity') + "" === icons_opacity_enabled + "") {

                    d3.select('#' + splitted_chart_div_id + '_view_element').remove();

                    var whole_view_width = parseFloat(d3.select('#whole_view').style('width'));
                    var whole_view_height = parseFloat(d3.select('#whole_view').style('height'));

                    var chart_count = d3.selectAll('.view_element').size();

                    var new_created_chart_layout = [];
                    switch (chart_count) {
                        case 1:
                            new_created_chart_layout.push({
                                width: whole_view_width,
                                height: whole_view_height
                            });

                            break;
                        case 2:
                            new_created_chart_layout.push({
                                width: whole_view_width/2,
                                height: whole_view_height
                            });

                            new_created_chart_layout.push({
                                width: whole_view_width/2,
                                height: whole_view_height
                            });

                            break;
                        case 3:

                            new_created_chart_layout.push({
                                width: whole_view_width/2,
                                height: whole_view_height/2
                            });

                            new_created_chart_layout.push({
                                width: whole_view_width/2,
                                height: whole_view_height/2
                            });

                            new_created_chart_layout.push({
                                width: whole_view_width,
                                height: whole_view_height/2
                            });

                            break;
                    }


                    var index = 0;
                    d3.selectAll('.view_element').each(function (d) {
                        var chartid = this.id.split('_view_element')[0];


                        d3.select('#' + this.id).style('width', new_created_chart_layout[index].width + 'px');
                        d3.select('#' + this.id).style('height', new_created_chart_layout[index].height + 'px');

                        update_chart(chartid);

                        index++;
                    })

                }
            });
        }
    });
}

/**
 * push new node type to history
 * @param nodes
 * @param node_types_on_home
 */
function push_new_node_types(div_id_chart, nodes, node_types_on_home) {
    tooltip.style('display', 'none');

    calculated_node_objects_per_div[get_index_of_chart_div_id(div_id_chart)].selected_nodes_to_go_back_forward[calculated_node_objects_per_div[get_index_of_chart_div_id(div_id_chart)].index_selected_nodes_to_go_back_forward] = JSON.parse(JSON.stringify(nodes));

    calculated_node_objects_per_div[get_index_of_chart_div_id(div_id_chart)].index_selected_nodes_to_go_back_forward += 1;

    //in case of go back --> remove all nodes after
    calculated_node_objects_per_div[get_index_of_chart_div_id(div_id_chart)].selected_nodes_to_go_back_forward.length = calculated_node_objects_per_div[get_index_of_chart_div_id(div_id_chart)].index_selected_nodes_to_go_back_forward;
    if (node_types_on_home) {

        var node_types = JSON.parse(JSON.stringify(calculated_node_objects_per_div[get_index_of_chart_div_id(div_id_chart)].selected_nodes_to_go_back_forward[0]));

        children_parents_of_children_parents__are_calculated = true;

        get_all_information_of_selected_node(function (response) {

            response = calculate_layout_of_nodes(response, div_id_chart);
            //div_id_chart, new_selected_node_id, nodes_in_case_of_go_home, direction, old_nodes, new_nodes
            animate_divs_on_click(div_id_chart, response[1].group_nodes[0].id, response, 1, calculated_node_objects_per_div[get_index_of_chart_div_id(div_id_chart)].calculated_node_objects, response);
        }, node_types[1].group_nodes[0].id, JSON.parse(JSON.stringify(calculated_node_objects_per_div[get_index_of_chart_div_id(div_id_chart)].calculated_node_objects)), get_chart_div_id(div_id_chart));

        //animate_divs_on_click(div_id_chart, node_types[1].group_nodes[0].id, node_types, 1);
    }
}

/**
 * go one step back behavior
 * @param nodes
 */
function go_one_node_back(nodes, div_id_chart) {

    tooltip.style('display', 'none');
    calculated_node_objects_per_div[get_index_of_chart_div_id(div_id_chart)].selected_nodes_to_go_back_forward[calculated_node_objects_per_div[get_index_of_chart_div_id(div_id_chart)].index_selected_nodes_to_go_back_forward] = JSON.parse(JSON.stringify(nodes));

    calculated_node_objects_per_div[get_index_of_chart_div_id(div_id_chart)].index_selected_nodes_to_go_back_forward--;

    var node_types = JSON.parse(JSON.stringify(calculated_node_objects_per_div[get_index_of_chart_div_id(div_id_chart)].selected_nodes_to_go_back_forward[calculated_node_objects_per_div[get_index_of_chart_div_id(div_id_chart)].index_selected_nodes_to_go_back_forward]));


    children_parents_of_children_parents__are_calculated = true;

    //animate_divs_on_click(div_id_chart, response[1].group_nodes[0].id, response, 1, calculated_node_objects_per_div[get_index_of_chart_div_id(div_id_chart)].calculated_node_objects, response);

    get_all_information_of_selected_node(function (response) {

        response = calculate_layout_of_nodes(response, div_id_chart);
        //div_id_chart, new_selected_node_id, nodes_in_case_of_go_home, direction, old_nodes, new_nodes
        animate_divs_on_click(div_id_chart, response[1].group_nodes[0].id, response, -1, calculated_node_objects_per_div[get_index_of_chart_div_id(div_id_chart)].calculated_node_objects, response);
    }, node_types[1].group_nodes[0].id, JSON.parse(JSON.stringify(calculated_node_objects_per_div[get_index_of_chart_div_id(div_id_chart)].calculated_node_objects)), get_chart_div_id(div_id_chart));


    //animate_divs_on_click(div_id_chart, node_types[1].group_nodes[0].id, node_types, -1);
}

/**
 * go one node forward behavior
 */
function go_one_node_up(div_id_chart) {
    tooltip.style('display', 'none');
    calculated_node_objects_per_div[get_index_of_chart_div_id(div_id_chart)].index_selected_nodes_to_go_back_forward++;

    var node_types1 = JSON.parse(JSON.stringify(calculated_node_objects_per_div[get_index_of_chart_div_id(div_id_chart)].selected_nodes_to_go_back_forward[calculated_node_objects_per_div[get_index_of_chart_div_id(div_id_chart)].index_selected_nodes_to_go_back_forward]));


    children_parents_of_children_parents__are_calculated = true;

    get_all_information_of_selected_node(function (response) {

        response = calculate_layout_of_nodes(response, div_id_chart);
        //div_id_chart, new_selected_node_id, nodes_in_case_of_go_home, direction, old_nodes, new_nodes
        animate_divs_on_click(div_id_chart, response[1].group_nodes[0].id, response, 1, calculated_node_objects_per_div[get_index_of_chart_div_id(div_id_chart)].calculated_node_objects, response);
    }, node_types1[1].group_nodes[0].id, JSON.parse(JSON.stringify(calculated_node_objects_per_div[get_index_of_chart_div_id(div_id_chart)].calculated_node_objects)), get_chart_div_id(div_id_chart));


    //animate_divs_on_click(div_id_chart, node_types1[1].group_nodes[0].id, node_types1, 1);
}

function search_in_all_nodes(div_id_chart) {

    callNodeList(function (response) {

        node_list = response;
        var side_nav_id = 'mySidenav';

        $('#' + div_id_chart + ' #' + side_nav_id + ' :not(#close_canvas)').remove();//document.querySelectorAll("mySidenav > div:not(#close_canvas)"))

        var canvas_height = parseFloat(d3.select('#' + div_id_chart).style('height')) - parseFloat(d3.select('#' + div_id_chart).select('#' + side_nav_id).style('top')) - parseFloat(d3.select('#' + div_id_chart).select('#' + side_nav_id).style('padding-top'));
        // create input box

        d3.select('#' + div_id_chart).select('#' + side_nav_id).style('height', canvas_height + 'px');

        var label_search_input_box = d3.select('#' + div_id_chart).select('#' + side_nav_id).append('input')
            .attr('id', 'node_name_input_box')
            .attr('type', 'text')
            .attr('placeholder', 'Search for nodes...');


        //create node list
        var list_div = d3.select('#' + div_id_chart).select('#' + side_nav_id).append('div')
            .attr('id', 'canvas_list_div');


        var list_nodes = list_div.append('ul')
            .attr('id', 'list_of_all_nodes');

        var added_string_to_id = '_searchlistelement';
        for (var i = 0; i < node_list.length; i++) {

            var node_ref = list_nodes.append('li')
                .attr('id', node_list[i][1] + added_string_to_id)
                .on('click', function (d) {
                    var selected_id = this.id.split(added_string_to_id)[0];

                    // in case of selected id equals already centered node id --> do nothing
                    if (selected_id !== calculated_node_objects_per_div[get_index_of_chart_div_id(div_id_chart)].calculated_node_objects[1].group_nodes[0].id) {
                        push_new_node_types(get_chart_div_id(div_id_chart), calculated_node_objects_per_div[get_index_of_chart_div_id(div_id_chart)].calculated_node_objects);

                        get_all_information_of_selected_node(function (response) {

                            response = calculate_layout_of_nodes(response, div_id_chart);
                            //div_id_chart, new_selected_node_id, nodes_in_case_of_go_home, direction, old_nodes, new_nodes
                            animate_divs_on_click(div_id_chart, response[1].group_nodes[0].id, response, 1, calculated_node_objects_per_div[get_index_of_chart_div_id(div_id_chart)].calculated_node_objects, response);
                        }, selected_id, JSON.parse(JSON.stringify(calculated_node_objects_per_div[get_index_of_chart_div_id(div_id_chart)].calculated_node_objects)), get_chart_div_id(div_id_chart));
                    }

                    closeNav(div_id_chart);
                });

            var textnode = node_ref.append('a')
                .attr('href', '#')
                .text(lookup_table_get_name_by_id(node_list[i][2]));
        }

        // resize list element
        list_div.style('height', canvas_height - document.getElementById('canvas_list_div').offsetTop + 60 + 'px');

        label_search_input_box.on('keyup', function (d) {
            search_function(div_id_chart, label_search_input_box.attr('id'))
        });

        function search_function(div_id_chart, input_box_id) {
            var input, filter, ul, li, a, i;

            input = d3.select('#' + div_id_chart).select('#' + input_box_id).node();//document.getElementById("node_name_input_box");

            filter = input.value.toUpperCase();
            ul = d3.select('#' + div_id_chart).select("#list_of_all_nodes").node();
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

        openNav(div_id_chart);


    }, net_name, patient_id, net_version, username, password, true);
}


function openNav(div_id_chart) {
    d3.select('#' + div_id_chart).select('#' + 'mySidenav').transition().duration(myDuration).style('width', 300 + 'px');
}

function closeNav(div_id_chart) {
    d3.select('#' + div_id_chart).select('#' + 'mySidenav').transition().duration(myDuration).style('width', 0 + 'px');
}

