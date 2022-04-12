if(window.location.protocol == "http:") {
    var oUrl = window.location.href
    oUrl = oUrl.replace(/^http:\/\//i, 'https://')
    window.location.replace(oUrl)
}
//Replace 'REPLACE_ME' with your json url
var jsonUrl = 'REPLACE_ME'
var orders = []
orders = JSON.parse(sessionStorage.getItem("orders"))
if (orders == null) {
    fetch(jsonUrl)
        .then(res => res.json())
        .then(res => orders = res)
}

function search() {
    //Storing the array to sessionStorage here due to .finally executing too fast (Possibly before all of the .then have been executed, even though thats not how it should function afaik)
    sessionStorage.setItem("orders", JSON.stringify(orders))
    var searchErrorHelper = 0
    var searchType = 0
    var searchObject = document.getElementById("search").value
    searchType += document.forms.querySelection.selection.value
    if (0 < searchType) {
        if (searchType == 1) {
            searchErrorHelper = 1
            for (const order of orders) {
                if (order.customerid == searchObject) {
                    searchErrorHelper = 4
                    //set search variable to sessionStorage
                    sessionStorage.setItem("searchObject", searchObject)
                    //set the searchtype variable to storage, used for proper handling of searched orders.
                    sessionStorage.setItem("lastSearchType", 1)
                    //Then finally send the user to the page that shows the orders
                    window.location.href = "order.html"
                }
            }
        } else if (searchType == 2) {
            searchErrorHelper = 2
            for (const order of orders) {
                if (order.orderid == searchObject) {
                    searchErrorHelper = 4
                    sessionStorage.setItem("searchObject", searchObject)
                    sessionStorage.setItem("lastSearchType", 2)
                    window.location.href = "order.html"
                }
            }
        } else if (searchType == 3) {
            searchErrorHelper = 3
            for (const order of orders) {
                if (order.customer == searchObject) {
                    searchErrorHelper = 4
                    sessionStorage.setItem("searchObject", searchObject)
                    sessionStorage.setItem("lastSearchType", 3)
                    window.location.href = "order.html"
                }
            }
        }
    }
    checkError(searchErrorHelper)
}

//Check for errors, should not show the error when the user has given a valid search term. 
function checkError(errorValue) {
    if (errorValue == 1) {
        document.getElementById("searchError").style.visibility = "visible"
        document.getElementById("searchError").innerHTML = "Asiakasnumeroa ei löytynyt."
        console.error("Customer number not found")
    } else if (errorValue == 2) {
        document.getElementById("searchError").style.visibility = "visible"
        document.getElementById("searchError").innerHTML = "Tilausnumeroa ei löytynyt."
        console.error("Order number not found")
    } else if (errorValue == 3) {
        document.getElementById("searchError").style.visibility = "visible"
        document.getElementById("searchError").innerHTML = "Asiakasta ei löytynyt"
        console.error("Customer not found.")
    } else if (errorValue == 4) {
        console.log("All clear")
    } else {
        document.getElementById("searchError").style.visibility = "visible"
        document.getElementById("searchError").innerHTML = "Hakutapaa ei ole valittu"
        console.error("User has not selected the search type")
    }
}
