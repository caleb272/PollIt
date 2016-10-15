import privateVariables from './privateEnvVariables'

export default function (varName) {
  if (!process.env[varName]) {
    loadEnvs()
  }

  return process.env[varName]
}


function loadEnvs() {
  Object.keys(privateVariables)
    .forEach(current => {
      process.env[current] = process.env[current] || privateVariables[current]
    })
}
