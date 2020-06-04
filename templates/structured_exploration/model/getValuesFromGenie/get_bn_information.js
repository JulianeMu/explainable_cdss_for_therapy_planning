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


// /**
//  * Call all nodes from a net by name, patientid, version as list.
//  */
// function get_all_targets(callback, name, patientid, version, username, password, isAsync) {
//
//     var sURL = hostURL + "/get_all_target_nodes_from_net_by_name_patientid_version?name=" + name
//         +"\&patientid=" + patientid
//         +"\&version=" + version;
//
//     //console.log(sURL);
//
//     $.ajax({
//         url: sURL,
//         type: 'GET',
//         dataType: 'json',
//         async: isAsync,
//         crossDomain: true,
//         headers:
//             {
//                 Authorization: 'Basic ' + btoa(username + ":" + password)
//             },
//         success: function (response) {
//
//             callback(response);
//         }
//     });
// }


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
        console.log(JSON.parse(response))
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


/**
 * get node object
 * including parent node ids and children node ids
 */
function getNodeObjects_with_Virtual_evidences(callback, name, patientid, version, nodeid, username, password, isAsync) {

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            //console.log(this.responseXML)
            callback(function_get_node_objects(this));
            //myFunction(this);
        }
    };

    var file = "TEST/TNM.xdsl".substr(0, "TEST/TNM.xdsl".lastIndexOf(".")) + ".xml";
    xhttp.open("GET", file, true);

    xhttp.send();

    function function_get_node_objects(xml) {
        var xmlDoc = xml.responseXML;

        var node_objects = [];
        for (var index_node = 0; index_node < nodeid.length; index_node++) {


            var node = xmlDoc.getElementById(nodeid[index_node]);


            if (node !== null) {

                var node_object = {};
                node_object.id = nodeid[index_node];
                node_object.name = nodeid[index_node];
                node_object.states = [];
                node_object.children_ids = [];
                node_object.parents_ids = [];
                node_object.index = 0;
                node_object.isObserved = [];


                for (var i = 0; i < node.children.length; i++) {

                    if (node.children[i].tagName === 'state') {
                        node_object.states.push({
                            name: node.children[i].id,
                            probability: 0.1
                        });
                    } else if (node.children[i].tagName === 'parents') {
                        var nodes_string = node.children[i].textContent;
                        node_object.parents_ids = get_node_ids(nodes_string);
                    } else if (node.children[i].tagName === 'children') {
                        var nodes_string = node.children[i].textContent;
                        node_object.children_ids = get_node_ids(nodes_string);
                    }
                }

                node_object.states = [node_object.states];

                node_object.isObserved.push(false);

                for (var abc = 0; abc < xmlDoc.getElementsByTagName('cpt').length; abc++) {

                    var cpt_element =  xmlDoc.getElementsByTagName('cpt')[abc];
                    for (var abc2 = 0; abc2 < cpt_element.children.length; abc2++) {
                        if (cpt_element.children[abc2].tagName === 'parents') {
                            var nodes_string = cpt_element.children[abc2].textContent;
                            var list_parent_ids = get_node_ids(nodes_string);
                            for (var abc3 = 0; abc3< list_parent_ids.length; abc3 ++) {
                                if (list_parent_ids [abc3] === nodeid[index_node]) {
                                    node_object.children_ids.push(cpt_element.id);
                                }
                            }
                        }
                    }
                }


                function get_node_ids(nodes_string) {
                    var node_ids = nodes_string.split(' ');

                    var all_ids = [];
                    for (var k = 0; k < node_ids.length; k++) {
                        all_ids.push(node_ids[k]);
                    }

                    return all_ids;
                }

                node_objects.push(node_object);
            }
        }

        return node_objects;

    }
}

