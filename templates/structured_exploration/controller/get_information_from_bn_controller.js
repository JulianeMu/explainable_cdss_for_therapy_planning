/**
 * sets all parameters which are not changed during one session
 *
 * @param netName
 * @param patientID
 * @param netVersion
 * @param userName
 * @param password_
 */
function set_netName_patientID_netVersion_username_password(netName, patientID, netVersion, userName, password_) {
    net_name = netName;
    patient_id = patientID;
    net_version = netVersion;
    username = userName;
    password = password_;
}

/**
 * creates the node object for currently selected node
 *
 * @param current_node_id
 */
// used in the beginning (create_chart) and at searching for nodes
function get_all_information_of_selected_node(callback, current_node_id, calculated_node_objects, div_id_chart) {

    set_calculation_duration_is_over_false(div_id_chart);

    //get current node object
    getNodeObjects_with_Virtual_evidences(function (current_node) {

        calculated_node_objects[1].group_nodes = current_node;

        current_node = current_node[0];

        create_parents_children_for_node(function (response) {

            console.log(current_node_id)
            response = calculate_layout_of_nodes(response, div_id_chart);
            callback(response);
        }, current_node, calculated_node_objects, div_id_chart);

    }, [current_node_id]);
}

/**
 * get children and parent nodes for current node
 * @param current_node
 */
//only used by get_all_information_of_selected_node
function create_parents_children_for_node(callback, current_node, calculated_node_objects, div_id_chart) {

    set_calculation_duration_is_over_false(div_id_chart);

    var ajax_index_children_parents = 0;
    var ajax_end_children_parents = 2; // for children and parents

    //get children of current node object
    if (current_node.children_ids.length > 0) {
        getNodeObjects_with_Virtual_evidences(function (response) {
            ajax_index_children_parents++;

            calculated_node_objects[2].group_nodes = response;

            if (ajax_index_children_parents === ajax_end_children_parents) {
                set_calculation_duration_is_over_true(div_id_chart);
                callback(calculated_node_objects);
            }

        }, current_node.children_ids);


    } else {
        ajax_index_children_parents++;

        calculated_node_objects[2].group_nodes = [];

        if (ajax_index_children_parents === ajax_end_children_parents) {
            set_calculation_duration_is_over_true(div_id_chart);
            callback(calculated_node_objects);
        }
    }

    //get parents of current node object
    if (current_node.parents_ids.length > 0) {
        getNodeObjects_with_Virtual_evidences(function (response) {

            ajax_index_children_parents++;

            calculated_node_objects[0].group_nodes = response;

            if (ajax_index_children_parents === ajax_end_children_parents) {
                set_calculation_duration_is_over_true(div_id_chart);
                callback(calculated_node_objects);
            }

        }, current_node.parents_ids);
    } else {

        ajax_index_children_parents++;

        calculated_node_objects[0].group_nodes = [];

        if (ajax_index_children_parents === ajax_end_children_parents) {
            set_calculation_duration_is_over_true(div_id_chart);
            callback(calculated_node_objects);
        }
    }
}


/**
 * get children and parent nodes for current node
 * @param current_node
 */
// This is used to get all parents and children of parents and children, especially by at click animation
function create_parents_children_OF_parents_children_for_node(callback, calculated_node_objects, div_id_chart) {

    set_calculation_parents_children_duration_is_over_false(div_id_chart);

    var ajax_index_children_parents_OF_children_parents = 0;
    var ajax_end_children_parents = 2; // for children and parents

    for (var i = 0; i < calculated_node_objects.length; i++) {
        if (i !== 1) {
            getAllNodesForChildrenParents(function (response, index) {
                ajax_index_children_parents_OF_children_parents++;

                calculated_node_objects[index].group_nodes = response;

                if (ajax_index_children_parents_OF_children_parents === ajax_end_children_parents) {


                    callback(calculated_node_objects);
                    set_calculation_parents_children_duration_is_over_true(div_id_chart);
                }

            }, JSON.parse(JSON.stringify(calculated_node_objects[i].group_nodes)), i);
        }
    }
}


/**
 * get all parents and children for a list of nodes
 * @param callback
 * @param node_list
 */
function getAllNodesForChildrenParents(callback, node_list, index) {

    var ajax_index = 0;
    var ajax_end = node_list.length;
    var new_node_list = [];


    if (node_list.length === 0) {
        callback([], index);

    }
    //get children and parents of children
    for (var j = 0; j < node_list.length; j++) {

        get_childnodes_parentnodes_of_node(function (response) {
            new_node_list.push(response);
            ajax_index++;

            if (ajax_index === ajax_end) {

                callback(new_node_list, index);
            }
        }, node_list[j], j);
    }
}

/**
 * get all parents and children for a node
 * @param callback
 * @param node
 */
function get_childnodes_parentnodes_of_node(callback, node) {

    var ajax_index = 0;
    var ajax_end = 2;

    if (node.children_ids.length > 0) {
        getNodeObjects_with_Virtual_evidences(function (response) {

            node.child_nodes = response;
            ajax_index++;
            if (ajax_index == ajax_end) {
                callback(node);
            }
        }, node.children_ids);
    } else {
        node.child_nodes = [];

        ajax_index++;
        if (ajax_index == ajax_end) {
            callback(node);
        }
    }


    if (node.parents_ids.length > 0) {
        getNodeObjects_with_Virtual_evidences(function (response) {

            node.parent_nodes = response;
            ajax_index++;
            if (ajax_index == ajax_end) {
                callback(node);
            }
        }, node.parents_id);
    } else {
        node.parent_nodes = [];
        ajax_index++;
        if (ajax_index == ajax_end) {
            callback(node);
        }
    }
}


function save_node_list(callback) {
    callNodeList(function (response) {
        node_list = response;
        callback(node_list);
    }, net_name, patient_id, net_version, username, password, true);
}

function get_name_index_from_node_list(node_id) {
    node_list.filter(function (o) {
        return o[1] === node_id[0];
    });
}
