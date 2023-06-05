import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

type DummyData = {
  id: string;
  value: number;
  region: string;
}

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {
  
  ngOnInit() {
    this.drawChart();
  }

  drawChart() {
    const margin = { top: 70, right: 40, bottom: 60, left: 50 }
    const width = 660 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;


    const DUMMY_DATA: DummyData[] = [
      { id: 'd1', value: 10, region: 'USA' },
      { id: 'd2', value: 11, region: 'India' },
      { id: 'd3', value: 12, region: 'China' },
      { id: 'd4', value: 6, region: 'Germany' },
      { id: 'd4', value: 17, region: 'Canada' },
    ];
    
    const xScale = d3
      .scaleBand()
      .domain(DUMMY_DATA.map((dataPoint) => dataPoint.region))
      .rangeRound([0, width])
      .padding(0.1);
    
    const yScale = d3.scaleLinear()
      .domain([0, (d3.max(DUMMY_DATA.map(d => d.value)) ?? 15) + 5])
      .range([height, 0]);
    
    const container = d3.select('svg')
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    //bars
    const bars = container
      .selectAll('.bar')
      .data(DUMMY_DATA)
      .enter()
      .append('rect')
      .style('fill', '#720570')
      .attr('width', xScale.bandwidth())
      .attr('height', (data) => height - yScale(data.value))
      .attr('x', data => xScale(data.region) ?? 0)
      .attr('y', data => yScale(data.value));
    
      // x axis
      const xAxis = d3.axisBottom(xScale)
        .tickSize(0)
        .tickPadding(10);
      container.append('g')
        .attr('transform', `translate(0, ${height})`)
        .style("font-size", "12px")
        .call(xAxis);
  
        // y axis
      const yAxis = d3.axisLeft(yScale)
        .ticks(5)
        .tickSize(5)
        .tickPadding(10);
      container.append('g')
        .attr('class', 'y axis')
        .style("font-size", "12px")
        .call(yAxis);

      // grid lines
      container.selectAll("line.horizontal-grid")
        .data(yScale.ticks(5))
        .enter()
        .append("line")
        .attr("class", "horizontal-grid")
        .attr("x1", 0)
        .attr("y1", d => yScale(d))
        .attr("x2", width)
        .attr("y2", d => yScale(d))
        .style("stroke", "gray")
        .style("stroke-width", 0.5)
        .style("stroke-dasharray", "3 3");

      // Add labels to the end of each bar
      container.selectAll(".label")
      .data(DUMMY_DATA)
      .enter().append("text")
      .attr("y", d => { return yScale(d.value) - 5; })
      .attr("x", d => (xScale(d.region) ?? 0) + xScale.bandwidth() / 2)
      .attr("dx", "-.5em")
      .style("font-family", "sans-serif")
      .style("font-size", "10px")
      .style("font-weight", "bold")
      .style('fill', '#3c3d28')
      .text(function (d) { return d.value; });
  }
}
