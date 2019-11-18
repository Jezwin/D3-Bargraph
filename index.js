import {
  select, 
  csv, 
  scaleLinear, 
  max,
  scaleBand,
  axisLeft,
  axisBottom,
  format
} from 'd3';

const svg = select('svg');
const height = +svg.attr('height');
const width = +svg.attr('width');

const render = data => {
  
  //Value accessors. Limits the specifity of code to xValue and yValue
  const xValue = d => d.population;
  const yValue = d => d.country;
  
  const margin = {top: 60, right: 40, bottom: 70, left: 180};
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  
  //Maps values from domain to corresponding values in range(Data Space to Screen Space)
  const xScale = scaleLinear()
  	.domain([0, max(data, xValue)])
  	.range([0, innerWidth])
  	.nice(); //Smooth edging of axes
  
  //Separate the bars and determine their heights
  const yScale = scaleBand()
  	.domain(data.map(yValue))
  	.range([0, innerHeight])
  	.padding(0.1);
  
  //The axes space
  const g = svg.append('g')
  	.attr('transform', 'translate('+margin.left+', '+margin.top+')');
  
  //Formatting numbers
  const xAxisTickFormat = number =>
  	format('.3s')(number)
  		.replace('G', 'B');
  const xAxis =  axisBottom(xScale)
  	.tickFormat(xAxisTickFormat)
  	//The vertical grid
  	.tickSize(-innerHeight);
  
  
  const yAxis = axisLeft(yScale)
  	//The horizontal grid
  	.tickSize(-innerWidth);
  g.append('g')
    .call(yAxis)
  	//Remove '.tick line' to show the horizontal grid
  	.selectAll('.domain, .tick line')
  		.remove();
  
  //Call to X axis
  const xAxisG = g.append('g').call(xAxis)
  	.attr('transform', 'translate(0, '+innerHeight+')');
  
  // Remove lines and ticks(not ticks in this)
  xAxisG.select('.domain').remove();
  
  xAxisG.append('text')
  	.attr('y', 60)
  	.attr('class', 'axis-label')
  	.attr('x', innerWidth/2)
  	.attr('fill', 'black')
  	.text('Population');
  
	g.selectAll('rect').data(data)
  	.enter().append('rect')
  	.attr('y', d => yScale(yValue(d)))
  	.attr('width', d => xScale(xValue(d)))
  	.attr('height', yScale.bandwidth())
  
  const xTitle = innerWidth/2;
  g.append('text')
  	.attr('class', 'title')
  	.attr('y', -10)
  	.text('The Bargraph');
};

csv('data.csv').then(data => { 
  //Returns a promise that resolves when data is loaded
  data.forEach(d => {
  d.population = +d.population*1000;
  });
 render(data)
});

