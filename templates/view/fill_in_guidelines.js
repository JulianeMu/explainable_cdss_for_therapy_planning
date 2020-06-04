function fill_in_guidelines(parent_div_id) {
    var button_ids = [//language_id_important_information,
        language_id_doctorsletter];//, language_id_doctorsletter];


    var navbar = d3.select(parent_div_id).append('div').attr('class', 'navbar').attr('id', navbar_id);

    for (var j = 0; j < button_ids.length; j++) {
        navbar.append('a').attr('href', '#' + button_ids[j])
            .text(get_language__label_by_id(button_ids[j]))
            .on('click', function () {
                update_guidelines_text(d3.select(this).attr('href').split('#')[1])
            });
    }

    var dropdown_menu = navbar.append('div').attr('class', 'dropdown');

    // for menstruation BN
    var dropdown_menu_button = dropdown_menu.append('button').attr('id', button_dropdown_id).attr('class', 'dropbtn')
        .on('click', function () {
            document.getElementById(dropdown_element_id).classList.toggle("show");
        })
        .text(get_language__label_by_id(language_id_therapy));

    dropdown_menu_button.append('i').attr('class', 'fa fa-caret-down');

    var dropdown_content = dropdown_menu.append('div').attr('class', 'dropdown-content').attr('id', dropdown_element_id);

    var dropdown_content_ids = [language_id_surgery, language_id_radiation, language_id_chemotherapy, language_id_targetedtherapy, language_id_byStage, language_id_Recurrent];

    for (var i = 0; i < dropdown_content_ids.length; i++) {
        dropdown_content.append('a').attr('href', '#' + dropdown_content_ids[i]).text(get_language__label_by_id(dropdown_content_ids[i])).on('click', function () {
            update_guidelines_text(d3.select(this).attr('href').split('#')[1]);
        });
    }

    navbar.append('a').attr('href', '#' + language_id_TNM_guidelines)
        .text(get_language__label_by_id(language_id_TNM_guidelines))
        .on('click', function () {
            close_dropdown_menu();
            update_guidelines_text(language_id_TNM_guidelines);
            /*if (div.selectAll('svg').size() === 0) {
                div.append('svg')
                    .attr('x', 0 + 'px')
                    .attr('y', 0 + 'px')
                    .style('width', div.style('width'))
                    .style('height', 0 + 'px');
            }
            var svg_for_guidelines = d3.select('#' + guidelines_element_id).select('svg');

            var height = 0;

            for (var i = 0; i < tnm_guidelines_strings.length; i++) {
                var text = tnm_guidelines_strings[i].eng;
                if (current_language === language_de) {
                    text = tnm_guidelines_strings[i].de;
                }
                height = append_text(svg_for_guidelines, tnm_guidelines_strings[i].id, text, tnm_guidelines_strings[i].style, height);
            }
            svg_for_guidelines.style('height', height + 10 + 'px');*/
        });

    var div = d3.select(parent_div_id).append('div').attr('id', guidelines_element_id).attr('class', 'guidelines');

    var parent_height = parseFloat(d3.select(parent_div_id).node().getBoundingClientRect().height);

    div.style('height', parent_height
        - parseFloat(navbar.style('height'))//height_others
        - parseFloat(div.style('margin-top')) - parseFloat(div.style('margin-bottom'))
        - parseFloat(div.style('padding-top')) - parseFloat(div.style('padding-bottom'))
        -50
        + 'px');
}


function highlight_navbar_element_after_click(element_to_highlight) {

    var navbar = d3.select('#' + navbar_id);
    var style = getComputedStyle(navbar.node());
    navbar.selectAll('*').each(function () {

        var bool_href_check = this.href !== undefined && element_to_highlight !== undefined && this.href.split('#')[1] === element_to_highlight;

        if (bool_href_check && this.parentNode.id === dropdown_element_id) {
            d3.select(this).style('font-weight', style.getPropertyValue('--highlight-font-weight'));
            d3.select('#' + button_dropdown_id).style('font-weight', style.getPropertyValue('--highlight-font-weight'));

        } else if (bool_href_check) {
            d3.select(this).style('font-weight', style.getPropertyValue('--highlight-font-weight'));
        } else {
            d3.select(this).style('font-weight', style.getPropertyValue('--main-font-weight'));
        }
    })
}

function get_absolute_height_of_element(element) {
    var height = parseFloat(d3.select(element).style('height'));
    height += parseFloat(d3.select(element).style('margin-top')) + parseFloat(d3.select(element).style('margin-bottom'));
    height += parseFloat(d3.select(element).style('padding-top')) + parseFloat(d3.select(element).style('padding-bottom'));

    return height;
}

function update_guidelines_text(id) {
    highlight_navbar_element_after_click(id);
    set_guidelines_text_for_rehighlighting(return_htlm_code(id));
}

function set_guidelines_text_for_rehighlighting(return_string, word_to_highlight) {
    close_dropdown_menu();

    if (word_to_highlight === undefined) {
        get_outcome_node_evidences(function (all_outcome_nodes) {
            var selected_outcome_node = all_outcome_nodes.find(function (node) {
                return node.node_id === currently_selected_outcome_node_id;
            });

            var max_state = selected_outcome_node.states[0].reduce(function (prev, current) {
                return (prev.probability > current.probability) ? prev : current
            }); //returns object

            update_highlighting(return_string, max_state.state);
        });
    } else {
        update_highlighting(return_string, word_to_highlight);
    }


    function update_highlighting(return_string, word_to_highlight) {

        return_string = remove_highlighting(return_string);

        var splitted_word_to_highlight = word_to_highlight.split(' ');
        for (var i = 0; i< splitted_word_to_highlight.length; i++) {

            if (splitted_word_to_highlight[i].length === 1 && splitted_word_to_highlight[i].match(/[a-z]/i)) {

                return_string = highlight_specific_words(splitted_word_to_highlight[i].charAt(0).toLowerCase() + splitted_word_to_highlight[i].substr(1), return_string);
                return_string = highlight_specific_words(splitted_word_to_highlight[i].charAt(0).toUpperCase() + splitted_word_to_highlight[i].substr(1), return_string);
            } else if (splitted_word_to_highlight[i].length > 1) {

                return_string = highlight_specific_words(splitted_word_to_highlight[i].charAt(0).toLowerCase() + splitted_word_to_highlight[i].substr(1), return_string);
                return_string = highlight_specific_words(splitted_word_to_highlight[i].charAt(0).toUpperCase() + splitted_word_to_highlight[i].substr(1), return_string);
            }
        }

        document.getElementById(guidelines_element_id).innerHTML = return_string;
    }
}

function close_dropdown_menu() {
    var myDropdown = document.getElementById(dropdown_element_id);
    if (myDropdown.classList.contains('show')) {
        myDropdown.classList.remove('show');
    }

    document.getElementById(guidelines_element_id).innerHTML = '';

    var svg_for_guidelines = d3.select('#' + guidelines_element_id).select('svg');
    svg_for_guidelines.selectAll('*').remove();
    svg_for_guidelines.style('height', 0 + 'px');
}

function wrap(text, width, x_indent) {

    var number_of_tspans = 1;
    var words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = parseFloat(text.attr("y")),
        tspan = text.text(null).append("tspan").attr("x", x_indent).attr("y", y + 'px');
    while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = text.append("tspan").attr("x", x_indent).attr("y", y).attr("dy", function () {
                var abc = ++lineNumber * lineHeight;
                return abc + "em"
            }).text(word);
            number_of_tspans++;
        }
    }
    return number_of_tspans;
}


function append_text(svg, tnm_id, text, style_class, y) {

    var text_svg = svg.append('text')
        .attr('id', tnm_id)
        .text(text);

    // if (style_class.id === style_id_title) {
    //     console.log('abc');
    //     text_svg.attr('class', 'h1');
    //     console.log(text_svg)
    // }
    for (var i = 0; i < style_class.attributes.length; i++) {
        text_svg.attr(style_class.attributes[i].attribute, style_class.attributes[i].value);
    }

    text_svg.attr('y', parseFloat(text_svg.attr('y')) + y + style_class.padding_before + 'px');


    var x_indent = parseFloat(text_svg.attr('x'));
    var number_of_tspans = wrap(text_svg, parseFloat(svg.style('width')) - 30 - parseFloat(text_svg.attr('x')), x_indent);


    if (!style_class.id.includes('_left') && !style_class.id.includes('_stage_table')) {
        y = (y + (number_of_tspans * 1.1 * parseFloat(text_svg.attr('font-size')))) + style_class.padding_before;
    } else {
        y = parseFloat(text_svg.attr('y'));
    }

    return y;
}