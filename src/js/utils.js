var _ = require("underscore")


util = {}

utils.Centroid = function(v_array) {
  var first = v_array[0]

  var corners = _.reduce(v_array, function(prev, next) {

    return {
      X: {
        max: next.x > prev.X.max ? next.x : prev.X.max,
        min: next.x < prev.X.min ? next.x : prev.X.min
      },
      Y: {
        max: next.y > prev.Y.max ? next.y : prev.Y.max,
        min: next.y < prev.Y.min ? next.y : prev.Y.min
      }
    }

  }, {
    X: {
      max: first.x,
      min: first.x
    },
    Y: {
      max: first.y,
      min: first.y
    }
  })

  return new THREE.Vector3(
    ((corners.X.max - corners.X.min) / 2) + corners.X.min, ((corners.Y.max - corners.Y.min) / 2) + corners.Y.min,
    0
  )
}


module.exports = utils