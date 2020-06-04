/**
 * initialize the view
 *@author Juliane Müller
 */
function initialization() {

    //initializeBN(function (response) {
    //    if (response) {

            update_evidences(function (response) {
                document.getElementById('iframe_structured_exploration').src = "./structured_exploration/structured_exploration.html";
                // initializeBN(function (response) {
                //     if (response) {

                update_list_of_evidences(function (response) {
                    //console.log(response);
                });

                get_outcome_node_evidences(function (all_outcome_nodes, outcome_node, evidences) {

                    selected_outcome_node_and_evidences = [outcome_node, evidences];

                    initialize_heading();
                    initialize_guidelines();
                    initialize_outcome_variables_view(all_outcome_nodes, outcome_node);

                    update_after_new_outcome_node(function (response) {
                    }, false);
                    d3.select('#' + navbar_id).select('a').dispatch('click'); // click on first navigation bar element --> indications

                    initialize_bar_chart_example(evidences);
                    initialize_tool_tip();
                });
            }, virtual_evidences);
    //    }
    //});
}

function update_list_of_evidences(callback) {
    list_of_all_evidences_ids = [];
    get_list_of_all_evidences(function (all_evidences_list) {
        for (var i = 0; i < all_evidences_list.length; i++) {
            list_of_all_evidences_ids[i] = all_evidences_list[i][1];
        }

        initialize_search_input_box();
        callback(true);
    });
}

function get_outcome_node_evidences(callback) {

    get_all_targets_new(function (all_outcome_nodes) {

        var all_outcome_nodes_formatted = [];
        for (var i = 0; i < all_outcome_nodes.length; i++) {
            all_outcome_nodes_formatted[i] = {
                node_id: all_outcome_nodes[i].id,
                node_label: all_outcome_nodes[i].name,
                isObserved: all_outcome_nodes[i].isObserved,
                states: [[]]
            };

            for (var k = 0; k< all_outcome_nodes[i].states.length; k++) {
                var states_ = [];
                for (var j = 0; j < all_outcome_nodes[i].states[k].length; j++) {
                    states_[j] = {
                        state: all_outcome_nodes[i].states[k][j].name,
                        probability: all_outcome_nodes[i].states[k][j].probability
                    }
                }
                all_outcome_nodes_formatted[i].states[k] = states_;
            }
        }

        if (currently_selected_outcome_node_id === undefined) {
            currently_selected_outcome_node_id = all_outcome_nodes_formatted[0].node_id;
        }

        var outcome_node_new = all_outcome_nodes_formatted.filter(function (e) {
            return e.node_id === currently_selected_outcome_node_id;
        });
        outcome_node_new = outcome_node_new[0];

        //get_all_evidences_for_outcome(function (evidences) {
        get_influence_of_evidences_on_target(function (evidences_new) {

            global_list_of_all_evidences_nodes = evidences_new;
            global_all_outcome_nodes = all_outcome_nodes_formatted;
            global_selected_outcome_node = outcome_node_new;
            callback(all_outcome_nodes_formatted, outcome_node_new, evidences_new);

        }, [currently_selected_outcome_node_id]);


    }, all_outcome_node_ids_real);


}

function compute_min_max_relevance_values(all_evidences) {
    slider_min_relevance = 0;

    // var overall_values = all_evidences.map(function (o) {
    //     return o.overall_relevance;
    // });

    slider_max_relevance = Math.max.apply(Math, all_evidences.map(function (o) {
        return o.overall_relevance;
    }));
}

function update_after_new_outcome_node(callback, collect_information_from_backend) {
    if (collect_information_from_backend) {
        get_outcome_node_evidences(function (all_outcome_nodes, outcome_node, evidences) {

            selected_outcome_node_and_evidences = [outcome_node, evidences];

            compute_min_max_relevance_values(evidences);
            //update_chart(outcome_node, evidences);

            d3.select('#outcome').selectAll('*').remove();
            initialize_outcome_variables_view(all_outcome_nodes, outcome_node);

            //update_relevance_slider_values();
            highlight_currently_selected_outcome_node(all_outcome_nodes, currently_selected_outcome_node_id);

            var selected_outcome_node = all_outcome_nodes.find(function (node) {
                return node.node_id === currently_selected_outcome_node_id;
            });

            var max_state = selected_outcome_node.states.reduce(function (prev, current) {
                return (prev.probability > current.probability) ? prev : current
            }); //returns object

            //console.log(max_state);
            try {
                set_guidelines_text_for_rehighlighting(document.getElementById('guidelines').innerHTML, max_state.state);
            } catch (e) {

            }

            update_structured_exploration(currently_selected_outcome_node_id, true);
            update_bar_chart_plot_by_dropdown_state_relevance(get_language__label_by_id(language_id_string_all_evidences), evidences);


            var myElement_d3 = d3.select('#' + currently_selected_outcome_node_id + outcome_node_div_ending);

            if (!myElement_d3.empty()) {
                var color_before = myElement_d3.style('background-color');
                var topPos = parseFloat(myElement_d3.style('top'));

                $(myElement_d3.node().parentNode).animate({scrollTop: topPos}, transition_duration); // smooth scrolling behaviour

                // highlight through red background color
                myElement_d3.transition().duration(transition_duration)
                    .style('background-color', '#ffcccc')
                    .transition().delay(3 * transition_duration).duration(transition_duration)
                    .style('background-color', color_before);

            }
            callback(true);
        });
    } else {
        selected_outcome_node_and_evidences = [global_selected_outcome_node, global_list_of_all_evidences_nodes];

        compute_min_max_relevance_values(global_list_of_all_evidences_nodes);
        //update_chart(global_selected_outcome_node, global_list_of_all_evidences_nodes);
        //update_relevance_slider_values();
        highlight_currently_selected_outcome_node(global_all_outcome_nodes, currently_selected_outcome_node_id);

        var selected_outcome_node = global_all_outcome_nodes.find(function (node) {
            return node.node_id === currently_selected_outcome_node_id;
        });

        var max_state = selected_outcome_node.states.reduce(function (prev, current) {
            return (prev.probability > current.probability) ? prev : current
        }); //returns object

        set_guidelines_text_for_rehighlighting(document.getElementById('guidelines').innerHTML, max_state.state);
        callback(true);
    }

}

function initialize_search_input_box() {

    //d3.select("#myInput").append('transition').ease(d3.easeExp).duration(0.4);
    d3.select("#myInput").on('click', function () {
        //console.log(d3.select("#myInput").attr("value"));

    });

    function autocomplete(inp, arr) {
        /*the autocomplete function takes two arguments,
        the text field element and an array of possible autocompleted values:*/
        var currentFocus;
        /*execute a function when someone writes in the text field:*/
        inp.addEventListener("input", function (e) {

            var enter_clicked = false;
            var a, b, i, val = this.value;
            var this_element = this;
            /*close any already open lists of autocompleted values*/
            closeAllLists();
            if (!val) {
                return false;
            }
            currentFocus = -1;
            /*create a DIV element that will contain the items (values):*/
            a = document.createElement("DIV");
            a.setAttribute("id", this.id + "autocomplete-list");
            a.setAttribute("class", "autocomplete-items");
            /*append the DIV element as a child of the autocomplete container:*/
            this.parentNode.appendChild(a);
            /*for each item in the array...*/
            for (i = 0; i < arr.length; i++) {
                /*check if the item starts with the same letters as the text field value:*/
                if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                    /*create a DIV element for each matching element:*/
                    b = document.createElement("DIV");
                    /*make the matching letters bold:*/
                    b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                    b.innerHTML += arr[i].substr(val.length);
                    /*insert a input field that will hold the current array item's value:*/
                    b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                    /*execute a function when someone clicks on the item value (DIV element):*/
                    b.addEventListener("click", function (e) {
                        /*insert the value for the autocomplete text field:*/
                        inp.value = this.getElementsByTagName("input")[0].value;
                        /*close the list of autocompleted values,
                        (or any other open lists of autocompleted values:*/

                        var selected_evidence;

                        list_of_evidences = global_list_of_all_evidences_nodes;

                        var selected_element_id = lookup_table_get_id_by_name(inp.value);
                        for (var j = 0; j < list_of_evidences.length; j++) {

                            if (list_of_evidences[j].node_id === selected_element_id) {
                                selected_evidence = list_of_evidences[j];
                                highlight_searched_element_with_scroll(selected_evidence.node_id);

                                //highlight_searched_evidence(selected_evidence);
                                enter_clicked = true;
                                this_element.value = "";
                                break;
                            }
                        }
                        closeAllLists();
                    });
                    a.appendChild(b);
                }
            }
        });
        /*execute a function presses a key on the keyboard:*/
        inp.addEventListener("keydown", function (e) {
            var x = document.getElementById(this.id + "autocomplete-list");
            if (x) x = x.getElementsByTagName("div");
            if (e.keyCode == 40) {
                /*If the arrow DOWN key is pressed,
                increase the currentFocus variable:*/
                currentFocus++;
                /*and and make the current item more visible:*/
                addActive(x);
            } else if (e.keyCode == 38) { //up
                /*If the arrow UP key is pressed,
                decrease the currentFocus variable:*/
                currentFocus--;
                /*and and make the current item more visible:*/
                addActive(x);
            } else if (e.keyCode == 13) {
                /*If the ENTER key is pressed, prevent the form from being submitted,*/
                e.preventDefault();
                if (currentFocus > -1) {
                    /*and simulate a click on the "active" item:*/
                    if (x) x[currentFocus].click();
                }
            }
        });

        function addActive(x) {
            /*a function to classify an item as "active":*/
            if (!x) return false;
            /*start by removing the "active" class on all items:*/
            removeActive(x);
            if (currentFocus >= x.length) currentFocus = 0;
            if (currentFocus < 0) currentFocus = (x.length - 1);
            /*add class "autocomplete-active":*/
            x[currentFocus].classList.add("autocomplete-active");
        }

        function removeActive(x) {
            /*a function to remove the "active" class from all autocomplete items:*/
            for (var i = 0; i < x.length; i++) {
                x[i].classList.remove("autocomplete-active");
            }
        }

        function closeAllLists(elmnt) {
            /*close all autocomplete lists in the document,
            except the one passed as an argument:*/
            var x = document.getElementsByClassName("autocomplete-items");
            for (var i = 0; i < x.length; i++) {
                if (elmnt != x[i] && elmnt != inp) {
                    x[i].parentNode.removeChild(x[i]);
                }
            }
        }

        /*execute a function when someone clicks in the document:*/
        document.addEventListener("click", function (e) {
            closeAllLists(e.target);
        });
    }

    var evidences_labels = [];
    var list_of_evidences = [];

    evidences_labels = list_of_all_evidences_ids;

    for (var i = 0; i < evidences_labels.length; i++) {
        evidences_labels[i] = lookup_table_get_name_by_id(evidences_labels[i]);
    }
    //console.log(evidences_labels)
    // get_outcome_node_evidences(function (all_outcome_nodes, outcome_node, evidences) {
    //     list_of_evidences = evidences;
    //
    //     for (var i = 0; i < evidences.length; i++) {
    //         evidences_labels.push(evidences[i].node_label)
    //     }
    // });

    /*initiate the autocomplete function on the "myInput" element, and pass along the countries array as possible autocomplete values:*/
    autocomplete(document.getElementById("myInput"), evidences_labels);
}