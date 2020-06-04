
function return_doctorsletters() {

    var return_string = "";
    var today = new Date();
    var last_doctorsletter = new Date();
    last_doctorsletter.setDate(today.getDate() - 7);

    var last_doctorsletter2 = new Date();
    last_doctorsletter.setDate(today.getDate() - 14);

    var doctorsletters_dates = [last_doctorsletter, last_doctorsletter2];
    for (var i = 0; i<doctorsletters_dates.length; i++) {
        return_string += "<h1>" + doctorsletters_dates[i].toDateString() + "</h1>" +
            "<p>\n" +
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vestibulum eget justo et euismod. Phasellus porta elementum arcu, congue accumsan lectus vestibulum et. In pulvinar condimentum lectus sit amet lacinia. Vestibulum lacinia neque ac scelerisque finibus. Fusce sagittis, massa vel efficitur pretium, justo ex eleifend odio, in malesuada sem tortor in ante. Vestibulum luctus aliquam quam. Etiam eu orci sed enim malesuada scelerisque. Nulla lobortis porta libero, eu porttitor odio porttitor ut. Cras gravida mi pretium libero egestas vehicula. Nulla dignissim rutrum quam porta lacinia. Sed vel ultricies orci, vel pretium nibh. Etiam turpis enim, molestie ut rhoncus vel, vehicula ut quam.\n" +
            "</p>\n" +
            "<p>\n" +
            "Nullam ornare dapibus viverra. Donec mattis mauris euismod tortor posuere iaculis. Cras laoreet sed nulla quis sagittis. Aliquam et augue ac arcu maximus condimentum. Fusce id bibendum mi, ut pellentesque sem. Morbi nen auctor dui. Fusce ut tellus ut risus sodales mollis. Ut nen varius felis. Donec quis nulla leo. Ut fermentum nulla at ornare sollicitudin. Donec varius sapien vitae nisi elementum consequat. Maecenas eu felis at neque porta eleifend ut ut diam.\n" +
            "</p>\n" +
            "<p>\n" +
            "Nunc ut cursus arcu. Nunc ex purus, consequat in auctor suscipit, rhoncus consequat purus. Donec placerat id ipsum in tempor. Suspendisse eleifend sagittis sagittis. Donec lorem lorem, dignissim a dolor nen, rutrum sagittis augue. Nullam eget lacus semper, rhoncus sapien eu, dictum quam. Quisque facilisis purus sit amet ante vestibulum, at aliquam magna aliquet.\n" +
            "</p>"
    }

    return return_string;
}

