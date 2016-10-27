import React, { PropTypes } from 'react'
import * as d3 from 'd3'
import ReactFauxDOM from 'react-faux-dom'
import { connect } from 'react-redux'

const BarChart = React.createClass({
  mixins: [
    ReactFauxDOM.mixins.core,
    ReactFauxDOM.mixins.anim
  ],

  getInitialState() {
    return {
      chart: '...loading'
    }
  },


  componentDidMount() {
    setTimeout(() => {
      console.log(window.getComputedStyle(this.refs.chart, null).getPropertyValue('width'))
      this.buildChart(this.props.pollData)
    }, 100)
    // // console.log(this.refs.svg.getDOMNode().offsetWidth)
    // const x = ReactFauxDOM.createElement('div')
    // x.textContent = 'fuck'
    // this.setState({ chart: x.toReact() })
    // // this.buildChart(this.props.pollData)
    // this.refs.rootView.measure((ox, oy, width, height) => {
    //   this.setState({ rootViewHeight: height })
    // })
  },

  buildChart({ entries }) {
    let containingDivWidth = window.getComputedStyle(this.refs.chart, null).getPropertyValue('width')
    containingDivWidth = Number(containingDivWidth.replace(/[a-z]*/gi, ''))
    const height = (containingDivWidth / 4) * 3

    let pollEntries = entries
    const that = this
    const fauxDOM = ReactFauxDOM.createElement('div')
    // const fauxDOM = this.connectFauxDOM('div.renderedD3', 'chart')
    const padding = { left: 30, top: 10, right: 10, bottom: 20 }
    const chartWidth = (containingDivWidth - (padding.left + padding.right))
    const chartHeight = (height - (padding.top + padding.bottom))

    const xScale = d3.scaleBand()
        .rangeRound([0, chartWidth])
        .domain(pollEntries.map(entry => entry.title))
        .paddingOuter(0.05)
        .padding(0.05)

    const yScale = d3.scaleLinear()
        .range([chartHeight, 0])
        .domain(getYScaleDomain())

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10)
        .domain([0, pollEntries.length])

    const xAxis = d3.axisBottom(xScale)
    const yAxis = d3.axisLeft(yScale)

    let chart = d3.select(fauxDOM).append('svg')
        .attr('width', (chartWidth + padding.left + padding.right))
        .attr('height', (chartHeight + padding.top + padding.bottom))
        .style('background-color', 'blue')

    chart = chart.append('g')
        .classed('inner-chart', true)
        .attr('transform', `translate(${padding.left}, ${padding.top})`)
        .attr('width', chartWidth)
        .attr('height', chartHeight)


    const bars = chart.selectAll('rect')
        .data(pollEntries).enter()
      .append('rect')
        .attr('fill', (entry) => colorScale(entry.originalEntryIndex))
        .attr('width', xScale.bandwidth())
        .attr('height', getBarHeight)
        .attr('x', entry => xScale(entry.title))
        .attr('y', entry => yScale(entry.votes.length))
        .on('click', callOnBarClickEvent)

    const xAxisElement = chart.append('g')
        .classed('x axis', true)
        .attr('transform', `translate(0, ${chartHeight})`)
        .attr('shape-rendering', 'crispEdges')
        .call(xAxis)

    const yAxisElement = chart.append('g')
        .classed('y axis', true)
        .attr('transform', 'translate(0, 0)')
        .attr('shape-rendering', 'crispEdges')
        .call(yAxis)

    function getYScaleDomain() {
      const lowestVotedBar = d3.min(pollEntries, entry => entry.votes.length)
      const heighestVotedBar = d3.max(pollEntries, entry => entry.votes.length)
      return [
        lowestVotedBar > 0 ? 0 : -1,
        heighestVotedBar > 0 ? heighestVotedBar : 1
      ]
    }


    function getBarHeight(entry) {
      return chartHeight - yScale(entry.votes.length)
    }


    function callOnBarClickEvent(bar) {
      const eventCallback = that.props.barClickedEvent
      if (eventCallback) {
        eventCallback(bar, updateVotedOnBars.bind(this))
      }
    }


    function updateVotedOnBars() {
      pollEntries = that.props.pollData.entries
      const transitionDuration = 500

      xScale.domain(pollEntries.map(entry => entry.title))
      yScale.domain(getYScaleDomain())

      let counter = 0

      bars
          .data(that.props.pollData.entries)
          .transition()
          .duration(transitionDuration)
          .attr('fill', entry => colorScale(entry.originalEntryIndex))
          .attr('height', entry => chartHeight - yScale(entry.votes.length))
          .attr('x', entry => xScale(entry.title))
          .attr('y', entry => yScale(entry.votes.length))
          .ease(frame => {
            // this is a hack so the chart gets updated every time the first entry gets updated
            // beginning of hack
            counter++
            if (counter >= entries.length) {
              counter = 0
              that.updateChartState(fauxDOM)
            }
            // end of hack
            return ease(frame)
          })
          .on('end', () => {
            // call the x and y axis elements to make the text crisp again
            xAxisElement.call(xAxis)
            yAxisElement.call(yAxis)

            that.updateChartState(fauxDOM)
          })

      xAxisElement
          .transition()
          .duration(transitionDuration)
          .ease(ease)
          .call(xAxis)

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

    if (that.props.setTriggerUpdate) {
      that.props.setTriggerUpdate(() => {
        this.buildChart(this.props.pollData)
      })
    }
  },


  updateChartState(fauxDOM) {
    this.setState({ chart: fauxDOM.toReact() })
  },


  render() {
    return (
      <div className="renderedD3" id="renderedD3" style={{ width: '100%' }} ref="chart">
        {this.state.chart}
      </div>
    )
  }
})


BarChart.propTypes = {
  pollData: PropTypes.shape({
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    authorID: PropTypes.string.isRequired,
    sortOrder: PropTypes.string.isRequired,
    entries: PropTypes.array.isRequired,
    cuid: PropTypes.string.isRequired,
    dateCreated: PropTypes.number.isRequired
  }),
  dispatch: PropTypes.func.isRequired,
  barClickedEvent: PropTypes.func,
  setTriggerUpdate: PropTypes.func
}


export default connect()(BarChart)
