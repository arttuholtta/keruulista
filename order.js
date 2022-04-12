if(window.location.protocol == "http:") {
    var oUrl = window.location.href
    oUrl = oUrl.replace(/^http:\/\//i, 'https://')
    window.location.replace(oUrl)
}

//get all the required variables

var orders = JSON.parse(sessionStorage.getItem("orders"))
var searchType = sessionStorage.getItem("lastSearchType")
var searchObject = sessionStorage.getItem("searchObject")
var orderList = []
var lastOpened = sessionStorage.getItem("lastOpened")

//1 = customerId, 2 = orderid, 3 = customer

if (searchType == 1) {
    document.getElementById("searchTerms").innerHTML += "Tilaukset asiakasnumerolla: " + searchObject
    var orderAmount = 0
    var oAHelperId = ""
    for (const order of orders) {
        if (order.customerid == searchObject) {
            orderAmount++
            buildList(order)
            oAHelperId = order.orderid
            if (order.orderid == lastOpened) {
                showOrder(lastOpened)
            }
        }
        
    }
    if (orderAmount == 1) {
        showOrder(oAHelperId)
    }
} else if (searchType == 2) {
    for (const order of orders) {
        if (order.orderid == searchObject) {
            document.getElementById("dropDown").style.visibility = "hidden"
            buildList(order)
            showOrder(order.orderid)
        }
    }
} else if (searchType == 3) {
    document.getElementById("searchTerms").innerHTML += "Näytetään tilaukset asiakkaalta: " + searchObject
    var orderAmount = 0
    var oAHelperId = ""
    for (const order of orders) {
        if (order.customer == searchObject) {
            orderAmount++
            buildList(order)
            if (order.orderid == lastOpened) {
                showOrder(lastOpened)
            }
            oAHelperId = order.orderid
        }
    }
    if (orderAmount == 1) {
        showOrder(oAHelperId)
    }
}
var ordermagic = ""

function buildList(order) {
    //Create section for customer info
    var orderHandled = ""
    if (order.orderHandled != undefined) {
        orderHandled = "käsitelty"
    } else {
        orderHandled = "käsittelemättä"
    }
    var customerDataTable = "<table class=\"table table-bordered\"><tr><th scope=\"row\">Asiakkaan tunnus</th><td>" +
        order.customerid +
        "</td></tr><tr><th scope=\"row\">Asiakas</th><td>" +
        order.customer +
        "</td></tr><tr><th scope=\"row\">Laskutusosoite</th><td>" +
        order.invaddr +
        "</td></tr><tr><th scope=\"row\">Toimitusosoite</th><td>" +
        order.delivaddr +
        "</td></tr><tr><th scope=\"row\">Toimituspäivä</th><td>" +
        order.deliverydate +
        "</td></tr><tr><th scope=\"row\">Myyjä</th><td>" +
        order.respsalesperson +
        "</td></tr><tr><th scope=\"row\">Kommentit</th><td>" +
        order.comment +
        "</td></tr><tr><th scope=\"row\">Hinta</th><td>" +
        order.totalprice +
        "</td></tr><tr><th scope=\"row\">Käsittelyn tila</th><td>" + orderHandled + "</td></table><div class=\"form-floating\"><button class=\"btn btn-primary btn-lg\" onclick=\"printOrder(" + order.orderid + ")\">Tulosta tilauksen kollilista</button><button class=\"btn btn-primary btn-lg\" onclick=\"confirmOrder(" + order.orderid + ")\">Merkitse tilaus käsiteltyksi</button></div><br>";

    var orderProducts = ""

    for (const product of order.products) {
        ordermagic = "'" + order.orderid + "','" + product.code + "'"
        var handled = "Ei"
        if (product.handled != undefined) {
            handled = "Kyllä"
        }
        var commentsection = ""
        if (product.comment != undefined) {
            commentsection = product.comment
        }
        //Create section(s) for products 
        orderProducts += "<div class=\"row\"><table class=\"table table-bordered \"><tr><th scope=\"row\">Tuotekoodi</th><td>" +
            product.code +
            "</td></tr><tr><th scope=\"row\">Tuote</th><td>" +
            product.product +
            "</td></tr><tr><th scope=\"row\">Tuotekuvaus</th><td>" +
            product.description +
            "</td></tr><tr><th scope=\"row\">Valmistajan tunnus</th><td>" +
            product.suppliercode +
            "</td></tr><tr><th scope=\"row\">Määrä</th><td>" +
            product.qty +
            "</td></tr><tr><th scope=\"row\">Yksikköhinta</th><td>" +
            product.unit_price +
            "</td></tr><tr><th scope=\"row\">Hyllypaikka</th><td>" +
            product.shelf_pos +
            "</td></tr><tr><th scope=\"row\">Kerätty</th><td>" + handled +
            "</td></tr><tr><th scope=\"row\">Kommentit</th><td>" + commentsection +
            "</td></tr></table></div><div class=\"form-floating\"><textarea class=\"form-control\" placeholder=\"Kommentoi\" id=\"" +
            product.code + "\"></textarea><label for=\"" + product.code +
            "\">&nbsp Kommentoi</label><button style=\"margin-top:10px;\" class=\"btn btn-primary btn-lg\" onclick=\"addComment(" + ordermagic +
            ")\">Lisää kommentti</button><button style=\"margin-top:10px;\" class=\"btn btn-primary btn-lg\"  onclick=\"confirmProduct(" + ordermagic +
            ")\">Kuittaa kerätyksi</button></div>";
    }

    var orderTitle = "<h1>Tilaus " + order.orderid + "</h1>"
    //Build the order
    var orderContainer = "<div id=\"" + order.orderid + "\" class=\"order row table-responsive\" style=\"visibility:hidden; position:absolute; height:0; \">" + orderTitle + customerDataTable + "<h2 style=\"margin-top:10px;\"> Tuotteet</h2>" + orderProducts + "<br></div>";
    document.getElementById("content").innerHTML += orderContainer
    document.getElementById("orderList").innerHTML += "<li><a class=\"dropdown-item\" onclick=\"showOrder(" + order.orderid + ")\">Tilaus " + order.orderid + "</a></li>"
    orderList.push(order.orderid)
}


//Add handling status and comments to the correct products that are in the correct orders.
function confirmProduct(orderid, productcode) {
    orders.forEach((order, index) => {
        if (order.orderid === orderid) {
            orders[index].products.forEach((product, index2) => {
                if (product.code === productcode) {
                    orders[index].products[index2]["handled"] = true
                }
            })
        }
    });
    sessionStorage.setItem("orders", JSON.stringify(orders))
    document.location.reload()
}

function addComment(orderid, productcode) {
    commentadd = document.getElementById(productcode).value
    orders.forEach((order, index) => {
        if (order.orderid === orderid) {
            orders[index].products.forEach((product, index2) => {
                if (product.code === productcode) {
                    if (orders[index].products[index2]["comment"] != undefined) {
                        if (commentadd != "") {
                            orders[index].products[index2]["comment"] += "<br>" + commentadd
                        }
                    } else {
                        orders[index].products[index2]["comment"] = commentadd
                    }
                }
            })
        }
    });
    sessionStorage.setItem("orders", JSON.stringify(orders))
    document.location.reload()
}

function confirmOrder(orderid) {
    orders.forEach((order, index) => {
        if (order.orderid == orderid) {
            orders[index]["orderHandled"] = true
            for (const product of orders[index].products) {
                product["handled"] = true
            }
        }
    });
    sessionStorage.setItem("orders", JSON.stringify(orders))
    document.location.reload()
}
//Creates printable iframe for the page
function printOrder(orderid) {
    sessionStorage.setItem("printThis", orderid)
    var hiddenPrint = document.createElement("iframe")
    hiddenPrint.setAttribute("src", "print.html")
    hiddenPrint.style.visibility = "hidden"
    hiddenPrint.style.position = "fixed"
    hiddenPrint.setAttribute("id", "hiddenPrint")
    hiddenPrint.style.right = 0
    hiddenPrint.style.bottom = 0
    document.body.appendChild(hiddenPrint)
    setTimeout(() => {
        document.body.removeChild(hiddenPrint)
    }, 1000)
}

function showOrder(orderid) {
    document.getElementById("searchHelper").innerHTML = ""
    for (const order of orderList) {
        document.getElementById(order).style.visibility = "hidden"
        document.getElementById(order).style.height = "0"
    }
    document.getElementById(orderid).style.visibility = "visible"
    document.getElementById(orderid).style.height = "auto"
    sessionStorage.setItem("lastOpened", orderid)
}