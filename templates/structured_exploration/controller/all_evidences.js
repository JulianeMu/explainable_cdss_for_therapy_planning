
function create_all_evidences(div_id_chart) {
    get_all_evidences(function (response) {

        create_treeData(response, div_id_chart)
    }, net_name, patient_id, net_version, username, password, true);
}

function create_treeData(children, div_id_chart) {
    var treeData = {
        name: 'Therapieentscheidung',
        children: []
    };

    for (var i = 0; i< children.length; i++) {
        treeData.children.push({
            name: children[i][2]
        })
    }

    show_treeData(treeData, div_id_chart);

}

function show_treeData(treeData, div_id_chart) {

    // set the dimensions and margins of the diagram
    var margin = {top: 10, right: 150, bottom: 10, left: 340},
        width = parseFloat(d3.select('#' + div_id_chart).style('width')) - margin.left - margin.right,
        height = parseFloat(d3.select('#' + div_id_chart).style('height')) - margin.top - margin.bottom;

// declares a tree layout and assigns the size
    var treemap = d3.tree()
        .size([height, width]);

//  assigns the data to a hierarchy using parent-child relationships
    var nodes = d3.hierarchy(treeData, function(d) {
        return d.children;
    });

// maps the node data to the tree layout
    nodes = treemap(nodes);

// append the svg object to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
    var svg = d3.select("#" + div_id_chart).append("svg")
            .attr('id', 'all_evidences')
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom),
        g = svg.append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

//adds the links between the nodes
    var link = g.selectAll(".link")
        .data( nodes.descendants().slice(1))
        .enter().append("path")
        .attr("class", "link")
        .attr("d", function(d, i) {
            return "M" + parseFloat(width - d.y) + "," + d.x
                + "C" + parseFloat(width - ((d.y + d.parent.y) / 2)) + "," + d.x
                + " " + parseFloat(width - ((d.y + d.parent.y) / 2)) + "," + d.parent.x
                + " " + parseFloat(width - (d.parent.y)) + "," + d.parent.x;
        });

// adds each node as a group
    var node = g.selectAll(".node")
        .data(nodes.descendants())
        .enter().append("g")
        .attr("class", function(d) {
            return "node" +
                (d.children ? " node--internal" : " node--leaf"); })
        .attr("transform", function(d, i) {
            return "translate(" + parseFloat(width - d.y) + "," + d.x + ")"; });

// adds the circle to the node
    node.append("circle")
        .attr("r", 5);

//adds the text to the node
    node.append("text")
        .attr("dy", ".35em")
        .attr("x", function(d) { return d.children ? 15 : -15; })
        .style("text-anchor", function(d) {
            return d.children ? "start" : "end"; })
        .text(function(d) { return d.data.name; })
    //.style('fill', 'white');

}