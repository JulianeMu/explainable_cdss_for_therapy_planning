const hostURL = "http://127.0.0.1:5000" //"http://localhost:8080";


/**
 * * get node object
 * including parent node ids and children node ids
 * indluding setting virtual evidences
 * @param callback
 * @param nodeids
 */
function get_all_targets_new(callback, nodeids) {

    var sURL = hostURL + "/get_target_nodes/";

    var values = {
        node_ids: nodeids
    };

    values = JSON.stringify(values);

    $.ajax({
        url: sURL,
        type: 'POST',
        data: values,
        contentType: "application/json",
        dataType: 'json',
        success: function (response) {
            callback(JSON.parse(response));
        }
    });
}

function initializeBN(callback) {
    var sURL = hostURL + "/initializeBN/";

    $.ajax({
        url: sURL,
        type: 'GET',
        success: function (response) {

            callback(response);
        }
    });
}

/**
 * Call all nodes from a net by name, patientid, version as list.
 *
 * @return [0] handle index
 * @return [1] id
 * @return [2] name
 * @return [3] isTarget
 * @return [4] isEvidence (is observed)
 */
function callNodeList_new(callback) {

    var sURL = hostURL + "/get_node_list_from_net_by_name_patientid_version/";

    $.ajax({
        url: sURL,
        type: 'GET',
        success: function (response) {
            callback(JSON.parse(response));
        }
    });
}

/**
 *
 * This method calculates the strength of influence of all nodes having evidences on target
 *
 * returns an ArrayList
 * @return [0] targetid
 * @return [1] nodeid
 * @return [2] euclidean distance
 * @param callback
 * @param targetids
 */
function get_influence_of_evidences_on_target(callback, targetids) {

    var sURL = hostURL + "/get_influence_of_evidences_on_target/";

    var values = {
        node_ids: targetids,
        virtualEvidenceObjects: virtual_evidences
    };

    values = JSON.stringify(values);

    $.ajax({
        url: sURL,
        type: 'POST',
        data: values,
        contentType: "application/json",
        dataType: 'json',
        success: function (response) {
            callback(response);
        }
    });
}

function get_list_of_all_evidences(callback) {
    var sURL = hostURL + "/get_all_evidences/";

    $.ajax({
        url: sURL,
        type: 'GET',
        dataType: 'json',
        success: function (response) {

            callback(JSON.parse(response));
        }
    });
}

function get_all_observable_nodes(callback) {
    var sURL = hostURL + "/get_all_observable_nodes/";

    $.ajax({
        url: sURL,
        type: 'GET',
        dataType: 'json',
        success: function (response) {

            callback(response);
        }
    });
}


function update_cases(callback, case_id) {
    var sURL = hostURL + "/update_case/";

    let values = JSON.stringify(case_id);

    $.ajax({
        url: sURL,
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        data: values,
        success: function (response) {

            callback(JSON.parse(response));
        }
    });
}


/**
 *
 * This method calculates the strength of influence of all nodes having evidences on target
 *
 * returns an ArrayList
 * @return [0] targetid
 * @return [1] nodeid
 * @return [2] euclidean distance
 * @param callback
 * @param targetids
 */
function update_evidences(callback, virtual_evidences) {

    var sURL = hostURL + "/update_evidences/";

    var values = {
        node_ids: [],
        virtualEvidenceObjects: virtual_evidences
    };

    values = JSON.stringify(values);

    $.ajax({
        url: sURL,
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        data: values,
    }).done(function(response) {

        callback(JSON.parse(response));
    })
}


