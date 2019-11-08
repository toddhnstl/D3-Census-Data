const DEBUG = true; // Controls console logging

const money = new Intl.NumberFormat('en-US',
  { style: 'currency', currency: 'USD',
  minimumFractionDigits: 0 });


// function used for updating x-scale var upon click on axis label
function xScale(censusData, chosenXAxis) {
    // create scales
    if (DEBUG){
      console.log(`function xScale`);
    };
  
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(censusData, d => d[chosenXAxis]),
        d3.max(censusData, d => d[chosenXAxis])
      ])
      .range([0, width]);
  
    return xLinearScale;
  }
  
  // function used for updating xAxis var upon click on axis label
  function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
  }
  
  // function used for updating circles group with a transition to
  // new x value circles
  function renderXCircles(circlesGroup, newXScale, chosenXaxis) {
  
    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]));
  
    return circlesGroup;
  }
  
  // function used for rendering the circle text x (dx) coords
  function renderXCircText(circlesTextGroup, xLinearScale, chosenXAxis) {
  
    if (DEBUG){
      console.log(`renderXCircText Chosen x is: ${chosenXAxis}`);
    }
    circlesTextGroup.transition()
      .duration(1000)
      .attr("dx", d => xLinearScale(d[chosenXAxis]));
  
    return circlesTextGroup;
  }
  
  // function used for updating x-scale var upon click on axis label
  function yScale(censusData, chosenYAxis) {
    // create scales
    if (DEBUG){
      console.log(`function yScale: ${chosenYAxis}`);
    };
  
    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(censusData, d => d[chosenYAxis])])
      .range([height, 0]);
  
    return yLinearScale;  
  }
  
  // function used for updating yAxis var upon click on axis label
  function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
  
    // if (DEBUG){
    //   console.log(`in renderYAxes leftAxis is: ${leftAxis}`);
    // }
  
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  
    return yAxis;
  }
  
  
  
  // function used for updating circles group with a transition to
  // new y value circles
  function renderYCircles(circlesGroup, yLinearScale, chosenYAxis) {
  
    if (DEBUG){
      console.log(`Render Y circles Chosen Y is: ${chosenYAxis}`);
    }
    circlesGroup.transition()
      .duration(1000)
      .attr("cy", d => yLinearScale(d[chosenYAxis]));
  
    return circlesGroup;
  }
  
  function renderYCircText(circlesTextGroup, yLinearScale, chosenYAxis) {
  
    if (DEBUG){
      console.log(`Render Y circles Chosen Y is: ${chosenYAxis}`);
    }
    circlesTextGroup.transition()
      .duration(1000)
      .attr("dy", d => yLinearScale(d[chosenYAxis]));
  
    return circlesTextGroup;
  }
  
  // function to format the xtoolTip text
  function xToolTipText(data, chosenXAxis){
    var xText = ''
  
    if (DEBUG){
      console.log(`ChosenX: ${chosenXAxis}`);
    }
    switch (chosenXAxis){
      case 'poverty':
        xText = `Poverty: ${data[chosenXAxis]} (%)`;
        break;
      case 'age':
        xText = `Age: ${data[chosenXAxis]} (Median)`;
        break;
      case 'income':
        xText = `Income: ${data[chosenXAxis]} (Median)`;
        break;
    }
    return xText;
  }
  
  function yToolTipText(data, chosenYAxis){
    var yText = ''
    switch (chosenYAxis){
      case 'healthcare':
        yText = `Healthcare: ${data[chosenYAxis]} (%)`;
        break;
      case 'smokes':
        yText = `Smokes: ${data[chosenYAxis]} (%)`;
        break;        
      case 'obesity':
        yText = `Obesity: ${data[chosenYAxis]} (%)`;
        break;        
  
    }
    return yText;
  }
  
  var toolTip;

  // // function used for updating circles group with new tooltip
  function updateToolTip(censusData, chosenXAxis, chosenYAxis, circlesGroup) {
    if(DEBUG){
      console.log(`In updateToolTip: xAxis ${chosenXAxis}, y: ${chosenYAxis}`);
    }
  
    toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([-10, -10])
      .html(function(d) {
        label = `${d.abbr}<br>${xToolTipText(d,chosenXAxis)}<br>${yToolTipText(d, chosenYAxis)}`
        return (label);
      });
  
    circlesGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
  
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data, this);
      });
  
    return circlesGroup;
  }

    // // function used for updating circles group with new tooltip
    function updateDataToolTip(censusData, chosenXAxis, chosenYAxis, circlesGroup) {
      if(DEBUG){
        console.log(`In updateDataToolTip: xAxis ${chosenXAxis}, y: ${chosenYAxis}`);
      }
    

      var dataToolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-15, -15])
        .html(function(d) {
          label = `${d.abbr}<br>
          Poverty: ${d["poverty"]} (%)<br>
          Age: ${d["age"]}<br>
          income:  ${money.format(d["income"])}<br>
          HealthCare: ${d["healthcare"]} (%)<br>
          Obesity: ${d["obesity"]} (%)<br>
          Smokes: ${d["smokes"]} (%)<br>` // Close label
          return (label);
        });
    
      circlesGroup.call(dataToolTip);
    
      circlesGroup.on("click", function(data) {
        dataToolTip.show(data, this);
        toolTip.hide(data, this);
      })
    
        // onmouseout event
        .on("mouseleave", function(data, index) {
          dataToolTip.hide(data, this);
        });
    
      return circlesGroup;
    }