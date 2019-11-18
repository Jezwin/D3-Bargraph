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
  
  const title = 'Top 10 populous countries';
  const xAxisLabel = 'Population';
  const yAxisLabel = 'Country';
  const direction = 'horizontal';
  

  
  const margin = {top: 60, right: 40, bottom: 70, left: 180};
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  
  //Value accessors. Limits the specifity of code to xValue and yValue
  const xValue = direction == 'horizontal'? d => d.population : d => d.country;
 	const yValue = direction == 'horizontal'? d => d.country: d => d.population;
 	
  //console.log(xValue)
 
  const setScales = () => {
			if(direction == 'horizontal') {
				return setHorizontalScales();
			} else {
				return setVerticalScales();
			}
		}
	
  const setHorizontalScales = () => {
    
  	 //Maps values from domain to corresponding values in range(Data Space to Screen Space)
  const xScaleEval = scaleLinear()
  	.domain([0, max(data, xValue)])
  	.range([0, innerWidth])
  	.nice(); //Smooth edging of axes
  
  //Separate the bars and determine their heights
  const yScaleEval = scaleBand()
  	.domain(data.map(yValue))
  	.range([0, innerHeight])
  	.padding(0.1);
  
    return {yScale: yScaleEval, xScale: xScaleEval};
    
  }
  
   const setVerticalScales = () => {
    
  	 //Maps values from domain to corresponding values in range(Data Space to Screen Space)
  const yScaleEval = scaleLinear()
  	.domain([max(data, yValue),0])
  	.range([0, innerHeight])
  	.nice(); //Smooth edging of axes
  
  //Separate the bars and determine their heights
  const xScaleEval = scaleBand()
  	.domain(data.map(xValue))
  	.range([0, innerWidth])
  	.padding(0.1);
  
    return {yScale: yScaleEval, xScale: xScaleEval};
    
  }
  
  
  
   const xScale = setScales().xScale;
   const yScale = setScales().yScale;
    
    //The axes space
  const g = svg.append('g')
  	.attr('transform', 'translate('+margin.left+', '+margin.top+')');
  
  //Formatting numbers
  const theAxisTickFormat = number =>
  	format('.3s')(number)
  		.replace('G', 'B');
 
  const xAxis =  axisBottom(xScale)
  	//The vertical grid
  	.tickSize(-innerHeight)
  	.tickPadding(10); //Label distance from X axis
 
  const yAxis = axisLeft(yScale)
  	//The horizontal grid
  	.tickSize(-innerWidth)
  	.tickPadding(10); //Label distance from Y axis;
  
   direction == 'horizontal'? xAxis.tickFormat(theAxisTickFormat) : yAxis.tickFormat(theAxisTickFormat);
  
  
  //Call to Y axis
  const yAxisG = g.append('g').call(yAxis);
  //Remove/Add '.tick line' to show/hide the horizontal grid
  yAxisG.selectAll('.domain').remove();
  
  //Y Axis Label
	yAxisG.append('text')
  	.attr('y', -110)
  	.attr('class', 'axis-label')
  	.attr('x', -innerHeight/2)
  	.attr('fill', 'black')
  	.attr('transform', 'rotate(-90)')
  	.attr('text-anchor', 'middle')
  	.text(yAxisLabel);
  
  //Call to X axis
  const xAxisG = g.append('g').call(xAxis)
  	.attr('transform', 'translate(0, '+innerHeight+')');
  
  // Remove lines and ticks(not ticks in this)
  xAxisG.select('.domain').remove();
  
  //X Axis Label
  xAxisG.append('text')
  	.attr('y', 60)
  	.attr('class', 'axis-label')
  	.attr('x', innerWidth/2)
  	.attr('fill', 'black')
  	.text(xAxisLabel);
  
  
   const createBar = () => {
			if(direction == 'horizontal') {
				createHorizontalBar();
			} else {
				createVerticalBar();
			}
		}
 	
  
  const createHorizontalBar = () => {
    
	g.selectAll('rect').data(data)
  	.enter().append('rect')
  	.attr('y', d => yScale(yValue(d)))
  	.attr('width', d => xScale(xValue(d)))
  	.attr('height', yScale.bandwidth());
  }
  
   const createVerticalBar = () => {
    
	g.selectAll('rect').data(data)
  	.enter().append('rect')
  	.attr('x', d=> xScale(xValue(d)))
  	.attr('y', d => yScale(yValue(d)))
  	.attr('height', d => innerHeight-yScale(yValue(d)))
  	.attr('width', xScale.bandwidth())
  }
   
  
  
  createBar();
  g.append('text')
  	.attr('class', 'title')
  	.attr('y', -10)
  	.text(title);
};

//Fetch the csv and calls the render() method
csv('data.csv').then(data => { 
  //Returns a promise that resolves when data is loaded
  data.forEach(d => {
  d.population = +d.population*1000;
  });
 render(data)
});

