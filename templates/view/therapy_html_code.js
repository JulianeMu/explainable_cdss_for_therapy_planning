

function return_htlm_code(label_id) {
    var return_string = "";
    if (label_id === language_id_surgery) {
        return_string = return_surgery_html_code();
    } else if (label_id === language_id_radiation) {
        return_string = return_radiation_html_code();
    } else if(label_id === language_id_chemotherapy) {
        return_string = return_chemotherapy_html_code();
    } else if(label_id === language_id_targetedtherapy) {
        return_string = return_targeted_therapy_html_code();
    } else if (label_id === language_id_byStage) {
        return_string = return_by_stage_html_code();
    } else if (label_id === language_id_Recurrent) {
        return_string = return_recurrent_html_code();
    } else if (label_id === language_id_TNM_guidelines) {
        return_string = return_tnm_guidelines();
    }

    //return_string = return_string + "<p>\n Source: <a href=\"https://www.cancer.org/cancer/acs-medical-content-and-news-staff.html\">The American Cancer Society medical and editorial content team.</a> November 27, 2017 </p>";

    if (label_id === language_id_doctorsletter) {
        return_string = return_doctorsletters();
    } else if(label_id === language_id_important_information) {
        return_string = return_indications();
    }

    return return_string;
}

function remove_highlighting(text) {
    text = text.replaceAll('</mark>', '');
    text = text.replaceAll('<mark>', '');
    return text;
}

function highlight_specific_words(word_to_highlight, text) {


    text = text.replaceAll(' '+word_to_highlight +' ', ' <mark>' + word_to_highlight + '</mark> ');
    text = text.replaceAll('>'+word_to_highlight +' ', '><mark>' + word_to_highlight + '</mark> ');
    text = text.replaceAll('>'+word_to_highlight +'<', '><mark>' + word_to_highlight + '</mark><');
    text = text.replaceAll(' '+word_to_highlight +'<', ' <mark>' + word_to_highlight + '</mark><');
    text = text.replaceAll(' '+word_to_highlight +'.', ' <mark>' + word_to_highlight + '</mark>.');

    return text;
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

