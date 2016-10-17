import React, { PropTypes, Component } from 'react'
import * as d3 from 'd3'
import ReactFauxDOM from 'react-faux-dom'
import { connect } from 'react-redux'

import { updatePollRequest } from '../../PollActions'

class BarChart extends Component {
  constructor(props) {
    super(props)
    this.state = {
      chart: null
    }
  }


  componentDidMount() {
    this.buildChart(this.props.pollData)
  }


  buildChart({ entries }) {
    const that = this
    const fauxDOM = ReactFauxDOM.createElement('div')
    const padding = { left: 30, top: 10, right: 10, bottom: 20 }
    const chartWidth = (600 - (padding.left + padding.right))
    const chartHeight = (400 - (padding.top + padding.bottom))

    const xScale = d3.scaleBand()
        .rangeRound([0, chartWidth])
        .domain(entries.map(entry => entry.title))
        .paddingOuter(0.05)
        .padding(0.05)
    const yScale = d3.scaleLinear()
        .range([chartHeight, 0])
        .domain([0, d3.max(entries, entry => entry.votes.length)])

    const xAxis = d3.axisBottom(xScale)
    const yAxis = d3.axisLeft(yScale)

    const chart = d3.select(fauxDOM).append('svg')
        .attr('width', (chartWidth + padding.left + padding.right))
        .attr('height', (chartHeight + padding.top + padding.bottom))
        .style('background-color', 'lightblue')
      .append('g')
        .classed('inner-chart', true)
        .attr('transform', `translate(${padding.left}, ${padding.top})`)
        .attr('width', chartWidth)
        .attr('height', chartHeight)

    const bars = chart.selectAll('rect')
        .data(entries).enter()
      .append('rect')
        .attr('fill', 'orange')
        .attr('width', xScale.bandwidth())
        .attr('height', getBarHeight)
        .attr('x', entry => xScale(entry.title))
        .attr('y', entry => yScale(entry.votes.length))
        .on('click', (bar) => {
          // this.props.dispatch(updatePollRequest(this.props.pollData.title, 0, bar.title))
          this.props.dispatch(updatePollRequest(this.props.pollData.cuid, 0, bar.title))
            .then(updatedPoll => onBarClicked(bar))
        })

    chart.append('g')
        .classed('x axis', true)
        .attr('transform', `translate(0, ${chartHeight})`)
        .call(xAxis)

    const yAxisElement = chart.append('g')
        .classed('y axis', true)
        .attr('transform', 'translate(0, 0)')
        .call(yAxis)

    function getBarHeight(entry) {
      return chartHeight - yScale(entry.votes.length)
    }


    function onBarClicked(bar) {
      const transitionDuration = 500
      bar.votes.push(Math.floor(Math.random() * 9999999999))

      xScale.domain(entries.map(entry => entry.title))
      yScale.domain([0, d3.max(entries, entry => entry.votes.length)])

      bars
          .transition()
          .duration(transitionDuration)
          .attr('height', (entry) => chartHeight - yScale(entry.votes.length))
          .attr('y', entry => (yScale(entry.votes.length)))
          .ease((frame) => {
            that.updateChartState(fauxDOM)
            return ease(frame)
          })

      yAxisElement
          .transition()
          .duration(transitionDuration)
          .ease(ease)
          .call(yAxis)

      function ease(frame) {
        /* make these in the options when setting up the chart */
        // return d3.easeBounceInOut(frame)
        // return d3.easeCubicInOut(frame)
        return d3.easeExpOut(frame)
      }
    }

    this.updateChartState(fauxDOM)
  }


  updateChartState(fauxDOM) {
    this.setState({ chart: fauxDOM.toReact() })
  }


  render() {
    return <div>{this.state.chart}</div>
  }
}


BarChart.propTypes = {
  pollData: PropTypes.shape({
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    authorID: PropTypes.string.isRequired,
    entries: PropTypes.array.isRequired,
    cuid: PropTypes.string.isRequired,
    dateCreated: PropTypes.number.isRequired
  })
}

// export default BarChart
export default connect()(BarChart)
