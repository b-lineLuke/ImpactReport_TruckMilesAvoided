function addressArrayRouter(clientAddress, addressesArray) {
  var directions = Maps.newDirectionFinder().setOrigin(clientAddress).setDestination(clientAddress).setOptimizeWaypoints(true).setMode(Maps.DirectionFinder.Mode.DRIVING);

  for (var j = 0; j < addressesArray.length; j++) {
    try {
      // code that may throw an exception
      directions.addWaypoint(addressesArray[j]);

    } catch (error) {
      // code to handle the exception
      Logger.log('The account address: ' + addressesArray[j] + ' did not work')
    }
    

  }

  var directionsFile = directions.getDirections();


  var route = directionsFile.routes[0];
  return route;
}

