import React, { PropTypes, Component } from 'react'
import * as d3 from 'd3'

class BarChart extends Component {
  componentDidMount() {
    this.buildChart()
  }


  buildChart() {
    const chart = d3.select(`#${this.props.pollData.id}`)
    chart.style('background-color', 'red').style('fill', 'blue')
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
    votes: PropTypes.array.isRequired,
    createdBy: PropTypes.string.isRequired,
    dateCreated: PropTypes.number.isRequired,
    id: PropTypes.string.isRequired
  })
}

export default BarChart
