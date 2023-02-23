function impactReport() {
  var client = "Son of Man";
  var clientAddress = "1140 SE 7th Ave, Portland, OR 97214";
  var startDate = new Date("1/1/2022");
  var endDate = new Date("1/1/2023");


  // This calls the spreadsheet containing account addresses using the URL

  // This spreadsheet is the output sheet for the script.
  var ss2022ImpactReporting = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1Lbb50I-7rOPdMc_ckEP5RmGa33osITi6NDzABCGs9XM/edit#gid=0");

  // These sheets are the sheets used as data inputs.
  var ssRdd = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1Fn4NdLgOpKVLRrnJ3SzLkYvx75swedsjibQqlfnRldE/edit#gid=0");
  var ssAccountsAddressBook = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1nQKhJ3NSbKYwboxrmThhFXwM8GhUOTZqrJRFtu3UbsQ/edit#gid=0")

  

  /*********************************************** Main Script Actions Begin Here********************************************************************** */
  // Sheet containing account address book transformed to an array  
  var accountAddressBookArray = ssAccountsAddressBook.getSheetByName("ACCOUNTS ADDRESS BOOK").getDataRange().getValues();

  // SET rddClientFiltered var as an array using the rddFilteredByClient function.
  var rddClientFiltered = rddFilteredByClient(ssRdd, client, startDate, endDate);

  // Function creates new sheet and names the sheet "client name" + "Impact Report"
  ss2022ImpactReporting.insertSheet().setName(client + " Impact Report");

  // SET listOfDays var as an array of dates set to midnight. Each date represents a day that the client was delivered on and will be used to determine which days
  // to create routes for.
  var listOfDays = getListOfDays(rddClientFiltered);

  // SET var n as an int that will be a counter.
  var n = 1;

  for (var i = 0; i < listOfDays.length; i++) {
    var day = listOfDays[i];
    var dayArray = rddClientFiltered.filter(function (a) {
      var dayCheck = a[0].setHours(0, 0, 0, 0)
      return day == dayCheck
    })
    var addressesAndAccountsArray = createAddressesAndAccountsArray(dayArray, accountAddressBookArray);
    var singleDayAddressesArray = addressesAndAccountsArray[0];
    var singleDayAccountsArray = addressesAndAccountsArray[1];

    // route is a built-in object in Google Scripts
    var route = addressArrayRouter(clientAddress, singleDayAddressesArray);
    // Retuns unknown if route encounters error
    if (route == undefined) {
      var routedSingleDayAccountsArray = singleDayAccountsArray;
      var routedSingleDayAddressesArray = singleDayAddressesArray;
      var numberOfRouteLegs = singleDayAccountsArray.length;
      var routeDistance1 = "Unknown";
    }
    else {
      var routeDistance1 = routeDistance(route);

      // This code block reorders accounts and address array to correspont with routed order
      var routedSingleDayAddressesArray = routedAddressesArray(route, singleDayAddressesArray);
      var routedSingleDayAccountsArray = routedAccountsArray(singleDayAddressesArray, routedSingleDayAddressesArray, singleDayAccountsArray);
      var numberOfRouteLegs = Number(route.legs.length);
      var routeDistance1 = routeDistance1;
    }

    var singleDayAccountsString = arrayToCsvString(routedSingleDayAccountsArray);
    var singleDayAddressesString = arrayToCsvString(routedSingleDayAddressesArray)


    var newSheetName = client + " Impact Report";

    ss2022ImpactReporting.getSheetByName(newSheetName).getRange(n, 1).setValue(new Date(day));
    ss2022ImpactReporting.getSheetByName(newSheetName).getRange(n, 2).setValue(numberOfRouteLegs);
    ss2022ImpactReporting.getSheetByName(newSheetName).getRange(n, 3).setValue(numberOfRouteLegs - 1);
    ss2022ImpactReporting.getSheetByName(newSheetName).getRange(n, 4).setValue(routeDistance1);
    ss2022ImpactReporting.getSheetByName(newSheetName).getRange(n, 5).setValue(singleDayAccountsString);
    ss2022ImpactReporting.getSheetByName(newSheetName).getRange(n, 6).setValue(singleDayAddressesString);
    n = n + 1;
    Logger.log(new Date(day))
  }





}
