import React, { PropTypes, Component } from 'react'
import * as d3 from 'd3'

class BarChart extends Component {
  constructor(props) {
    super(props)

    this.state = {
      chart: document.createElement('div')
    }
  }


  componentDidMount() {
    this.buildChart(this.props.pollData)
  }

  buildChart({ entries, id }) {
    // const chart = d3.select(`#${id}`)
    const chartHTML = document.createElement('div')
    const chart = d3.select(chartHTML).append('svg')
    const padding = { left: 30, top: 10, right: 10, bottom: 20 }
    const chartWidth = (600 - (padding.left + padding.right))
    const chartHeight = (400 - (padding.top + padding.bottom))

    const xScale = d3.scaleBand()
        .rangeRound([0, chartWidth])
        .domain(entries.map(entry => entry.name))
        .paddingOuter(0.05)
        .padding(0.05)
    const yScale = d3.scaleLinear()
        .range([chartHeight, 0])
        .domain([0, d3.max(entries, entry => entry.votes.length)])

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

    this.setState({ chart: chartHTML })

    innerChart.selectAll('rect')
        .data(entries).enter()
      .append('rect')
        .attr('fill', 'orange')
        .attr('width', xScale.bandwidth())
        .attr('height', (entry) => chartHeight - yScale(entry.votes.length))
        .attr('x', entry => xScale(entry.name))
        .attr('y', entry => (yScale(entry.votes.length)))
        .on('click', bar => console.log(bar))

    innerChart.append('g')
        .classed('.x.axis', true)
        .attr('transform', `translate(0, ${chartHeight})`)
        .call(xAxis)

    innerChart.append('g')
        .classed('.y.axis', true)
        .attr('transform', 'translate(0, 0)')
        .call(yAxis)

    function onBarClicked(bar) {
      console.log('clicked')
      const duration = 750
      bar.votes.push(Math.floor(Math.random() * 9999999999))
      xScale.domain(entries.map(entry => entry.name))
      yScale.domain([0, d3.max(entries, entry => entry.votes.length)])

      innerChart.select('.x.axis')
          .call(xAxis)
      innerChart.select('.y.axis')
          .call(yAxis)
    }

    this.setState({ chart: chartHTML })
  }


  // <svg id={this.props.pollData.id}>{this.state.updates}</svg>
  render() {
    return (
      <div> <center>
        <h3>{this.props.pollData.name}</h3>
        <div dangerouslySetInnerHTML={{ __html: (this.state.chart.innerHTML) }}></div>
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
