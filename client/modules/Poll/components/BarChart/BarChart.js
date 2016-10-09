import React, { PropTypes, Component } from 'react'
import * as d3 from 'd3'

class BarChart extends Component {
  componentDidMount() {
    this.buildChart(this.props.pollData)
  }


  buildChart({ entries, id }) {
    const chart = d3.select(`#${id}`)
    const padding = { left: 20, top: 10, right: 10, bottom: 20 }
    const chartWidth = (600 - (padding.left + padding.right))
    const chartHeight = (400 - (padding.top + padding.bottom))

    const xScale = d3.scaleBand()
        .rangeRound([0, chartWidth])
        .domain(entries.map((entry) => entry.name))
        .paddingOuter(0.05)
        .padding(0.05)
    const yScale = d3.scaleLinear()
        // .range([chartHeight, 0])
        // .domain([0, d3.max(entries, (entry) => entry.votes.length)])

        // .range([chartHeight, 0])
        // .domain([d3.max(entries, (entry) => entry.votes.length), 0])

        .range([chartHeight, 0])
        .domain([0, d3.max(entries, (entry) => entry.votes.length)])

    let currentMax = { length: 0, name: '' }
    for (let i = 0; i < entries.length; i++) {
      const length = entries[i].votes.length
      if (currentMax.length < length) {
        currentMax = {
          length,
          name: entries[i].name
        }
      }
    }

    let currentMin = { length: currentMax.length, name: currentMax.name }
    for (let i = 0; i < entries.length; i++) {
      const length = entries[i].votes.length
      if (currentMin.length > length) {
        currentMin = {
          length,
          name: entries[i].name
        }
      }
    }
    console.log('max:', currentMax, ' min:', currentMin)

    const xAxis = d3.axisBottom(xScale)
    const yAxis = d3.axisLeft(yScale)

    chart
        .attr('width', (chartWidth + padding.left + padding.right))
        .attr('height', (chartHeight + padding.top + padding.bottom))
        .style('background-color', 'lightblue')
    const innerChart = chart.append('g')
        .attr('transform', `translate(${padding.left}, ${padding.top})`)
        .attr('width', chartWidth)
        .attr('height', chartHeight)

    innerChart.selectAll('rect')
        .data(entries).enter()
      .append('rect')
        .attr('fill', 'orange')
        .attr('width', xScale.bandwidth())
        .attr('height', (entry) => {
          console.log('name:', entry.name, '    pos:', yScale(entry.votes.length))
          return chartHeight - yScale(entry.votes.length)
        })
        .attr('x', entry => xScale(entry.name))
        .attr('y', entry => (yScale(entry.votes.length)))

    console.log('fuck', yScale(currentMax.length))

    innerChart.append('g')
        .attr('transform', `translate(0, ${chartHeight})`)
        .call(xAxis)

    innerChart.append('g')
        .attr('transform', 'translate(0, 0)')
        .call(yAxis)
  }


  render() {
    return (
      <div> <center>
        <h3>{this.props.pollData.name}</h3>
        <svg id={this.props.pollData.id}></svg>
      </center> </div>
    )
  }
}

BarChart.propTypes = {
  pollData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    entries: PropTypes.array.isRequired,
    createdBy: PropTypes.string.isRequired,
    dateCreated: PropTypes.number.isRequired,
    id: PropTypes.string.isRequired
  })
}

export default BarChart
