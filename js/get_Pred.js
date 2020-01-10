
const group = [7, 4, 22, 25]

// var request = new XMLHttpRequest()
// request.open('GET', 'https://analysis.tgr.dyn-o-saur.com/location', true)
// request.onload = function() {
// Begin accessing JSON data here
// var data = JSON.parse(this.response)
data = [[-70, -56, -43, -76]]
console.log(data)

tf.loadLayersModel('model.json').then(model => {
  const input = tf.tensor(data)

  const predicted = model.predict(input)

  const predProp = predicted.arraySync()[0]

  const maxIndex = predProp.indexOf(Math.max(...predProp))

  console.log(group[maxIndex])

})

