// @TODO: YOUR CODE HERE!
//set up chart
var svgWidth = 1000;
var svgHeight = 500;
var margin = {top: 20, right: 40, bottom: 60, left: 100};
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// scg wrapper
var svg = d3
    .select('.chart')
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
var chart = svg.append('g');

// append div to create tooltips and assign as class
d3.select(".chart").append("div").attr("class", "tooltip").style("opacity", 0);

// retrieve data

d3.csv("./data/data.csv", function(error, healthData) {
    if (error) return console.warn(error);
    
    console.log(healthData);

// d3.csv("../../data/data.csv").then(healthData) {
//     console.log(healthData);
// // d3.csv("../../data/data.csv", function(error, healthData) {
// //     if (error) throw error;
// //     console.log(data);
// });
// const data = await d3.csv("../../data/data.csv");
// console.log(data)
// d3.csv("../../data/data.csv").then(render);



healthData.forEach(function(data) {
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;
    });

    var yLinearScale = d3.scaleLinear().range([height, 0]);
    var xLinearScale = d3.scaleLinear().range([0, width]);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    var xMin;
    var xMax;
    var yMin;
    var yMax;

    xMin = d3.min(healthData, function(data) {
        return +data.obesity * 0.95;
    });

    xMax = d3.max(healthData, function(data) {
        return +data.obesity * 1.05;
    });

    yMin = d3.min(healthData, function(data) {
        return +data.smokes * 0.98;
    });

    yMax = d3.max(healthData, function(data) {
        return +data.smokes * 1.02;
    });

    xLinearScale.domain([xMin, xMax]);
    yLinearScale.domain([yMin, yMax]);

    // tooltip
    var toolTip = d3
        .tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(data) {
            var stateName = data.state;
            var obese = +data.obesity;
            var smokers = +data.smokes;
            return (
                stateName + '% <br> Obese: ' + obese + '% <br> Smokers: ' + smokers + '%'
            );
        });
    // create tooltip
    chart.call(toolTip);

    chart.selectAll("circle")
        .data(healthData)
        .enter()
        .append("circle")
        .attr("cx", function(data, index) {
            return xLinearScale(data.obesity)
        })
        .attr("cy", function(data, index) {
            return yLinearScale(data.smokes)
        })
        .attr("r", "15")
        .attr("fill", "lightblue")
        //display tooltip on click
        .on("mouseenter", function(data) {
            toolTip.show(data);
        })
        //hide on mouseout
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });

    //append label to each point
    chart.append("text")
        .style("text-anchor", "middle")
        .style("font-size", "12px")
        .selectAll("tspan")
        .data(healthData)
        .enter()
        .append("tspan")
        .attr("x", function(data) {
                return xLinearScale(data.obesity - 0);
        })
        .attr("y", function(data) {
                return yLinearScale(data.smokes - 0.2);
        })
        .text(function(data) {
                return data.abbr
            });
    chart
        .append("g")
        .attr('transform', `translate(0, ${height})`)
        .call(bottomAxis);

    chart.append("g").call(leftAxis);
    
    chart
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0-margin.left + 40)
        .attr("x", 0 - height/2)
        .attr("dy","1em")
        .attr("class", "axis-text")
        .text("Smokers (%)")

    //append x-axis labels
    chart
        .append("text")
        .attr(
            "transform",
            "translate(" + width / 2 + " ," + (height + margin.top + 30) + ")"
        )
        .attr("class", "axis-text")
        .text("Obese (%)");
});