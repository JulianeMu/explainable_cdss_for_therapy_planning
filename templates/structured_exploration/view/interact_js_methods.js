function create_interact_js_methods() {
    interact('.view_element')
        .resizable({
            // resize from all edges and corners
            edges: {left: false, right: true, bottom: false, top: false},

            // keep the edges inside the parent
            restrictEdges: {
                outer: 'parent',
                endOnly: true
            },

            // minimum size
            restrictSize: {
                min: {width: 300, height: 400},
            },

            inertia: true,
        })
        .on('resizemove', function (event) {
                var target = event.target,
                    x = (parseFloat(target.getAttribute('data-x')) || 0),
                    y = (parseFloat(target.getAttribute('data-y')) || 0);

                var chart_view_id = target.id.split('_view_element')[0];

                // update the element's style
                //target.style.width = event.rect.width + 'px';
                //target.style.height = event.rect.height + 'px';

                d3.select('#' + target.id).style('width', event.rect.width + 'px');
                d3.select('#' + target.id).style('height', event.rect.height + 'px');

                // translate when resizing from top or left edges
                x += event.deltaRect.left;
                y += event.deltaRect.top;

                //x += event.rect.left;
                //y += event.rect.top;

                target.style.webkitTransform = target.style.transform =
                    'translate(' + x + 'px,' + y + 'px)';

                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);


                update_chart(chart_view_id);

            }
        );
}