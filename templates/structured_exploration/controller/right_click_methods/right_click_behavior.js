
var menu = [
    {
        title: get_language__label_by_id(language_id_string_set_evidence_global),
        action: function () {
            open_set_evidence_dialog(get_chart_div_id_by_div(this), this.parentNode, true);
        },
        disabled: function () {


            // check if selected node as children, if not enable set evidence
            var current_node_objects = calculated_node_objects_per_div[get_index_of_chart_div_id(get_chart_div_id_by_div(this.parentNode), calculated_node_objects_per_div)];
            get_node_object_by_id(current_node_objects.calculated_node_objects, this.parentNode.id);

            //if (this.parentNode.id !== 'UICC_stage__patient' && current_object.children_ids.length === 0) {
                return false;
            //} else {
            //    return true;
            //}
        }
    }
    /*,
    {
        title: string_open_in_new_window.toLowerCase(), //'Remove Node',
        action: function (d, i) {
            open_in_new_window(this.parentNode.id);
        },
        disabled: function (elm, d, i) {
            if (d3.selectAll('.view_element').size() < 2) {
                return false;
            } else {
                return true;
            }
        }
    }*/
];


