var rotate_boolean2 = true;
var rotation_direction2 = true;
var duration2 = myDuration / 2;
var rotation_direction2_perDiv = [];
var index = 0;



function animate_current_chart_element2(id, dataset, type, div_id_chart) {

    var is_included = false;

    for (var i = 0; i < rotation_direction2_perDiv.length; i++) {
        if (rotation_direction2_perDiv[i].id === id) {
            index = i;
            is_included = true;
            rotation_direction2 = rotation_direction2_perDiv[i].bool;
        }
    }

    if (!is_included) {
        rotation_direction2_perDiv.push({id: id, bool: true});
        rotation_direction2 = true;
    }


    set_animation_duration_is_over_false(div_id_chart);

    var parent_div = document.getElementById(div_id_chart);

    var div,
        deg = rotate_boolean2 ? 90 : 0; //animation_counter * -90;

    for (var i = 0; i< parent_div.children.length; i++) {
        if (parent_div.children[i].id === id) {
            div = parent_div.children[i];
        }
    }


    div.style.transitionDelay = 0 + "ms ";
    div.style.transitionDuration = duration2 / 2 + "ms";
    div.style.transitionProperty = "all";
    div.style.transitionTimingFunction = 'linear';

    div.style.webkitTransform = 'rotateY(' + deg + 'deg)';
    div.style.mozTransform = 'rotateY(' + deg + 'deg)';
    div.style.msTransform = 'rotateY(' + deg + 'deg)';
    div.style.oTransform = 'rotateY(' + deg + 'deg)';
    div.style.transform = 'rotateY(' + deg + 'deg)';



    if (!d3.select('#' + div_id_chart).selectAll('#states_all').empty()) {

        d3.select('#' + div_id_chart).selectAll('#' + 'line')
            .transition()
            .duration(duration/2)
            .attr('opacity', 0.1);
    } else {

        d3.select('#' + div_id_chart).selectAll('#' + 'line')
            .transition()
            .duration(duration/2)
            .attr('opacity', 1);
    }

    if (rotate_boolean2) {

        rotate_boolean2 = false;



        //wait till first animation is finished
        setTimeout(function (d) {

            if (rotation_direction2) {

                rotate_forward_currentNode2(id, dataset, type, div_id_chart);

            } else {

                rotate_backwards_currentNode2(id, dataset, div_id_chart);
            }

            //run animation again
            rotate_to_90_degree2(div, id, dataset, div_id_chart)
        }, duration2 / 2);
    } else {
        rotate_boolean2 = true;

        rotation_direction2_perDiv[index].bool = !rotation_direction2;
        rotation_direction2 = !rotation_direction2;
        setTimeout(function (d) {
            set_animation_duration_is_over_true(div_id_chart);
        }, duration2 / 2);
    }
}

function rotate_to_90_degree2(div, id, dataset, div_id_chart) {
    var //div = document.getElementById(current_node_type),
        deg = 90;

    div.style.webkitTransform = 'rotateY(' + deg + 'deg)';
    div.style.mozTransform = 'rotateY(' + deg + 'deg)';
    div.style.msTransform = 'rotateY(' + deg + 'deg)';
    div.style.oTransform = 'rotateY(' + deg + 'deg)';
    div.style.transform = 'rotateY(' + deg + 'deg)';

    //wait till first animation is finished
    setTimeout(function (d) {

        //run animation again
        animate_current_chart_element2(id, dataset, "", div_id_chart)
    }, duration2 / 2);
}


function rotate_forward_currentNode2(id, dataset, type, div_id_chart) {
    tooltip.style('display', 'none');

    d3.select('#' + div_id_chart).select('#' + id).select('svg').selectAll("path")
        .attr('opacity', 0.2)
        .on('mouseover', function (d) {

        })
        .on('mouseout', function (d) {

        });

    d3.select('#' + div_id_chart).select('#' + id).select('svg').selectAll('#most_probable_state').attr('opacity', 0);
    d3.select('#' + div_id_chart).select('#' + id).select('svg').selectAll('#node_name').attr('opacity', 0.1);

    create_all_states_view(id, dataset, type, div_id_chart);
}


function rotate_backwards_currentNode2(id, dataset, div_id_chart) {
    d3.select('#' + div_id_chart).select('#' + id).select('svg').selectAll("path")
        .attr('opacity', 0.8)
        .on('mouseover', function (d) {
            show_tooltip(d, this);
        })
        .on('mouseout', function (d) {
            hide_tooltip(this);
        });

    d3.select('#' + div_id_chart).select('#' + id).select('svg').selectAll('#states_all').remove();
    d3.select('#' + div_id_chart).select('#' + id).select('svg').selectAll('#most_probable_state').attr('opacity', 1);
    d3.select('#' + div_id_chart).select('#' + id).select('svg').selectAll('#node_name').attr('opacity', 1);
}