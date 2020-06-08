/**
 * *********************GETTER*****************************************************************************************************
 */


function initializeBN(callback) {
    var sURL = hostURL + "/initializeBN/";
    //console.log(sURL);
    $.ajax({
        url: sURL,
        type: 'GET',
        success: function (response) {
            callback(JSON.parse(response));
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
function callNodeList(callback) {

    var sURL = hostURL + "/get_node_list_from_net_by_name_patientid_version/";

    $.ajax({
        url: sURL,
        type: "GET",
        contentType: 'application/json; charset=utf-8',
    }).done(function(response) {
        callback(JSON.parse(response));
    })
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
function get_all_evidences(callback) {

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



/**
 * *********************SETTER***********************************************************************************************
 */


/**
 * * get node object
 * including parent node ids and children node ids
 * indluding setting virtual evidences
 * @param callback
 * @param nodeids
 */
function getNodeObjects_with_Virtual_evidences(callback, nodeids) {

    var sURL = hostURL + "/get_node_object_with_virtual_evidences/";

    var values = {
        node_ids: nodeids,
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
            callback(JSON.parse(response));
        }
    });
}
