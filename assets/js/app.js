

var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select(".census_chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


// Initial Params
var chosenXAxis = "poverty"; // xAxis
var chosenYAxis = "healthcare" // yAxis - healthcare


// functions in functions.js


/////////////////////////////////////////////////////////////
// Retrieve data from the CSV file and execute everything below
d3.csv("./assets/data/data.csv").then(function (censusData, err) {
  if (err) throw err;

  if (DEBUG) {
    console.log(censusData);
  };

  // parse data convert to int
  censusData.forEach(function (data) {
    data.poverty = +data.poverty;
    data.age = +data.age;
    data.income = +data.income;
    data.healthcare = +data.healthcare;
    data.smokes = +data.smokes;
    data.obesity = +data.obesity;
  });



  // xLinearScale function above csv import
  var xLinearScale = xScale(censusData, chosenXAxis);


  // Create y scale function
  var yLinearScale = yScale(censusData, chosenYAxis)


  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);


  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);


  // append y axis
  var yAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .call(leftAxis);


  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .classed("stateCircle", true)
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 15)

    //.text(d=> d.abbr)
    .attr("fill", "blue")
    .attr("opacity", "1")

    
  // Append circle text 
  var circlesTextGroup = chartGroup.selectAll("circles")
    .data(censusData)
    .enter()
    .append("text")
    .classed("stateText", true)
    .attr("dx", d => xLinearScale(d[chosenXAxis]))
    .attr("dy", d => (yLinearScale(d[chosenYAxis]) + 5))
    .attr("font-size", "12px")
    .text(d => d.abbr);


  // Create group for  3 x- axis labels
  var xLabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var povertyPerLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty (%)");

  var ageLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age (Median)");

  var houseIncomeLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Household Income (Median)");

  // Labels for y axis
  var yLabelsGroup = chartGroup.append("g")
    .attr("transform", "rotate(-90)");

  var healthcareLabel = yLabelsGroup.append("text")
    //.attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 55)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("value", "healthcare")
    //.classed("axis-text", true)
    .classed("active", true)
    .text("Lacks HealthCare (%)");

  var smokesLabel = yLabelsGroup.append("text")
    //.attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 35)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("value", "smokes")
    //.classed("axis-text", true)
    .classed("inactive", true)
    .text("Smokes (%)");

  var obeseLabel = yLabelsGroup.append("text")
    //.attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 15)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("value", "obesity")
    //.classed("axis-text", true)
    .classed("inactive", true)
    .text("Obese (%)");


  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(censusData, chosenXAxis, chosenYAxis, circlesGroup);
  // updateDataToolTip
  // var circlesGroup = updateDataToolTip(censusData, chosenXAxis, chosenYAxis, circlesGroup);

  // x axis labels event listener
  xLabelsGroup.selectAll("text")
    .on("click", function () {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXaxis with value
        chosenXAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(censusData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderXAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderXCircles(circlesGroup, xLinearScale, chosenXAxis);

        // Update the circle text xAxis  
        circlesTextGroup = renderXCircText(circlesTextGroup, xLinearScale, chosenXAxis)

        // updates tooltips with new info
        circlesGroup = updateToolTip(censusData, chosenXAxis, chosenYAxis, circlesGroup);

        // updates dataToolTip with new info
        // circlesGroup = updateDataToolTip(censusData, chosenXAxis, chosenYAxis, circlesGroup)

        // changes classes to change bold text
        if (chosenXAxis === "age") {
          povertyPerLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
          houseIncomeLabel
            .classed("active", false)
            .classed("inactive", true);

        }
        else if (chosenXAxis === "income") {
          povertyPerLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          houseIncomeLabel
            .classed("active", true)
            .classed("inactive", false);
        } else {
          povertyPerLabel
            .classed("active", true)
            .classed("inactive", false);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          houseIncomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }
      }
    });

  // y axis labels event listener
  yLabelsGroup.selectAll("text")
    .on("click", function () {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenYAxis) {

        // replaces chosenYaxis with value
        chosenYAxis = value;

        if (DEBUG) {
          console.log(`In YLabel on Click: Chosen: ${chosenYAxis}, Value: ${value}`);
        }

        // // functions here found above csv import
        // // updates y scale for new data
        yLinearScale = yScale(censusData, chosenYAxis);

        // // updates y axis with transition
        yAxis = renderYAxes(yLinearScale, yAxis);

        // // updates circles with new y values
        circlesGroup = renderYCircles(circlesGroup, yLinearScale, chosenYAxis);

        // Update the circle text yAxis  
        circlesTextGroup = renderYCircText(circlesTextGroup, yLinearScale, chosenYAxis)

        // updates tooltips with new info
        circlesGroup = updateToolTip(censusData, chosenXAxis, chosenYAxis, circlesGroup);

        // updates dataToolTip with new info
        // circlesGroup = updateDataToolTip(censusData, chosenXAxis, chosenYAxis, circlesGroup)

        // changes classes to change bold text
        if (chosenYAxis === "healthcare") {
          healthcareLabel
            .classed("active", true)
            .classed("inactive", false);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
          obeseLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenYAxis === "smokes") {
          healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
          smokesLabel
            .classed("active", true)
            .classed("inactive", false);
          obeseLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {  // Default of obese
          healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
          obeseLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });


}).catch(function (error) {
  console.log(error);
});