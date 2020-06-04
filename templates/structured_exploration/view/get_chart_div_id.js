
function get_chart_div_id(div_name) {
    if (document.getElementById(div_name).className === 'chart') {
        return div_name;
    } else {
        return get_chart_div_id(document.getElementById(div_name).parentNode.id);
    }
}

function get_index_of_chart_div_id(div_name, node_objects) {
    var current_chart_div_id = get_chart_div_id(div_name);

    if (node_objects === undefined) {
        node_objects = calculated_node_objects_per_div;
    }

    for (var i = 0; i< node_objects.length; i++) {
        if (node_objects[i].div_name === current_chart_div_id) {
            return i;
        }
    }
}

function get_chart_div_id_by_div(div) {

    if (div.className === 'chart') {
        return div.id;
    } else {
        return get_chart_div_id_by_div(div.parentNode);
    }
}