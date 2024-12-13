const dataset = [
  { caseTitle: "Abandoned Vehicle", areaHighest: "South Boston", resolutionTime: "> 24 hours", requests: 62031 },
  { caseTitle: "Street Cleaning", areaHighest: "Dorchester", resolutionTime: "< 2 hours", requests: 45670 },
  { caseTitle: "Code Enforcement", areaHighest: "South End", resolutionTime: "2 - 24 hours", requests: 32552 },
  { caseTitle: "Sanitation", areaHighest: "Dorchester", resolutionTime: "2 - 24 hours", requests: 28350 },
  { caseTitle: "Highway Maintenance", areaHighest: "West Roxbury", resolutionTime: "> 24 hours", requests: 21305 },
];

// Set up dimensions for the graph
const width = 700;
const height = 500;
const margin = { top: 20, right: 30, bottom: 50, left: 80 };
const colorScale = d3.scaleLinear()
  .domain([0, d3.max(dataset, d => d.requests)])
  .range(["#4A90E2", "#9013FE"]);

// Create the SVG container
const svg = d3.select("#plot")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

// Create a tooltip div
const tooltip = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0)
  .style("position", "absolute")
  .style("pointer-events", "none")
  .style("background-color", "rgba(255, 255, 255, 0.9)")
  .style("color", "#333")
  .style("border", "1px solid #ccc")
  .style("border-radius", "5px")
  .style("padding", "10px")
  .style("box-shadow", "0 2px 5px rgba(0, 0, 0, 0.2)")
  .style("font-size", "14px");

// Set up the scales
const x = d3.scaleBand()
  .domain(dataset.map(d => d.caseTitle))
  .range([margin.left, width - margin.right])
  .padding(0.1);

const y = d3.scaleLinear()
  .domain([0, d3.max(dataset, d => d.requests)]).nice()
  .range([height - margin.bottom, margin.top]);

// Append bars and set initial values
const bars = svg.append("g")
  .selectAll(".bar")
  .data(dataset)
  .enter()
  .append("rect")
  .attr("class", "bar")
  .attr("x", d => x(d.caseTitle))
  .attr("y", height - margin.bottom)
  .attr("width", x.bandwidth())
  .attr("height", 0)
  .attr("fill", d => colorScale(d.requests))
  .on("mouseover", function(event, d) {
    tooltip.transition()
      .duration(200)
      .style("opacity", 1);
    tooltip.html(`
      <strong>Category:</strong> ${d.caseTitle}<br>
      <strong>Area - highest requests:</strong> ${d.areaHighest}<br>
      <strong>Resolution Time:</strong> ${d.resolutionTime}<br>
      <strong>Requests:</strong> ${d.requests}
    `);
    tooltip.style("left", (event.clientX + 10) + "px")
           .style("top", (event.clientY - 28) + "px");

    // Apply blur effect to the hovered bar
    d3.select(this)
      .style("filter", "blur(2px)");  // Blur the hovered bar
  })
  .on("mouseout", function() {
    tooltip.transition()
      .duration(200)
      .style("opacity", 0);

    // Remove the blur effect
    d3.select(this)
      .style("filter", "none");  // Reset filter to remove blur
  });

// Transition bars from 0 to their value
bars.transition()
  .duration(1000)
  .attr("y", d => y(d.requests))
  .attr("height", d => height - margin.bottom - y(d.requests));

// Append x-axis
svg.append("g")
  .attr("class", "x-axis")
  .attr("transform", `translate(0,${height - margin.bottom})`)
  .call(d3.axisBottom(x));

// Append y-axis
svg.append("g")
  .attr("class", "y-axis")
  .attr("transform", `translate(${margin.left},0)`)
  .call(d3.axisLeft(y));

// Add labels for x-axis and y-axis
svg.append("text")
  .attr("class", "x-label")
  .attr("x", width / 2)
  .attr("y", height - 10)
  .attr("text-anchor", "middle")
  .text("Categories");

svg.append("text")
  .attr("class", "y-label")
  .attr("transform", "rotate(-90)")
  .attr("x", -height / 2)
  .attr("y", margin.left - 60)
  .attr("text-anchor", "middle")
  .text("Number of Requests");
