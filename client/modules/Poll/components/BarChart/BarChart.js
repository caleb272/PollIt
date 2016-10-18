import React, { PropTypes, Component } from 'react'
import * as d3 from 'd3'
import ReactFauxDOM from 'react-faux-dom'
import { connect } from 'react-redux'

import votingTools from '../../../../../tools/voting_tools'

import { updatePollRequest } from '../../PollActions'
import { getUser } from '../../PollReducer'

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
    let pollEntries = entries
    const that = this
    const fauxDOM = ReactFauxDOM.createElement('div')
    const padding = { left: 30, top: 10, right: 10, bottom: 20 }
    const chartWidth = (600 - (padding.left + padding.right))
    const chartHeight = (400 - (padding.top + padding.bottom))

    const xScale = d3.scaleBand()
        .rangeRound([0, chartWidth])
        .domain(pollEntries.map(entry => entry.title))
        .paddingOuter(0.05)
        .padding(0.05)
    const yScale = d3.scaleLinear()
        .range([chartHeight, 0])
        .domain(getYScaleDomain())

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
        .data(pollEntries).enter()
      .append('rect')
        .attr('fill', 'orange')
        .attr('width', xScale.bandwidth())
        .attr('height', getBarHeight)
        .attr('x', entry => xScale(entry.title))
        .attr('y', entry => yScale(entry.votes.length))
        .on('click', voteOnBar)

    chart.append('g')
        .classed('x axis', true)
        .attr('transform', `translate(0, ${chartHeight})`)
        .call(xAxis)

    const yAxisElement = chart.append('g')
        .classed('y axis', true)
        .attr('transform', 'translate(0, 0)')
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


    function voteOnBar(bar) {
      votingTools.voteOnPollEntries(that.props.user.github_id, bar.title, pollEntries)
      updateVotedOnBars()

      // use the data on the client side to figure out what changes on the chart
      // then once the server returns the data verify and update if necessary
      that.props.dispatch(updatePollRequest(that.props.pollData.cuid, bar.title, that.props.user.github_id))
        .then(() => {
          // get the difference between the new and old state also modify it if there is one so D3 knows something changed
          const newEntries = that.props.pollData.entries
          for (let i = 0; i < newEntries.length; i++) {
            if (pollEntries[i].votes !== newEntries[i].votes) {
              pollEntries[i].votes = newEntries[i].votes
            }
          }
          updateVotedOnBars(bar)
        })
    }


    function updateVotedOnBars(bar) {
      const transitionDuration = 500

      xScale.domain(pollEntries.map(entry => entry.title))
      yScale.domain(getYScaleDomain())

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
  }),
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    github_id: PropTypes.string.isRequired
  }),
  dispatch: PropTypes.func.isRequired
}


function mapStateToProps(state) {
  return {
    user: getUser(state)
  }
}


export default connect(mapStateToProps)(BarChart)
