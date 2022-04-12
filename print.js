if(window.location.protocol == "http:") {
    var oUrl = window.location.href
    oUrl = oUrl.replace(/^http:\/\//i, 'https://')
    window.location.replace(oUrl)
}


var orders = JSON.parse(sessionStorage.getItem("orders"))
var orderid = sessionStorage.getItem("printThis")

function printOrder() {
    for (const order of orders) {
        if (order.orderid == orderid) {
            console.log(order)
            console.log("Hello from no.1")
            buildList(order)

        }
    }
}

function buildList(order) {
    document.getElementById("pageName").innerHTML = "Tilaus " + order.orderid
    //Create section for customer info
    var orderHandled = ""
    if (order.orderHandled != undefined) {
        orderHandled = "käsitelty"
    } else {
        orderHandled = "käsittelemättä"
    }
    var customerDataTable = "<table class=\"table table-bordered\"><tr><th>Asiakkaan tunnus</th><td>" +
        order.customerid +
        "</td></tr><tr><th>Asiakas</th><td>" +
        order.customer +
        "</td></tr><tr><th>Laskutusosoite</th><td>" +
        order.invaddr +
        "</td></tr><tr><th>Toimitusosoite</th><td>" +
        order.delivaddr +
        "</td></tr><tr><th>Toimituspäivä</th><td>" +
        order.deliverydate +
        "</td></tr><tr><th>Myyjä</th><td>" +
        order.respsalesperson +
        "</td></tr><tr><th>Kommentit</th><td>" +
        order.comment +
        "</td></tr><tr><th>Hinta</th><td>" +
        order.totalprice +
        "</td></tr><tr><th scope=\"row\">Käsittelyn tila</th><td>" + orderHandled + "</td></tr></table><br>";

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
        //Create sections for products 
        orderProducts += "<br><table class=\"table table-bordered\"><tr><th>Tuotekoodi</th><td>" +
            product.code +
            "</td></tr><tr><th>Tuote</th><td>" +
            product.product +
            "</td></tr><tr><th>Tuotekuvaus</th><td>" +
            product.description +
            "</td></tr><tr><th>Valmistajan tunnus</th><td>" +
            product.suppliercode +
            "</td></tr><tr><th>Määrä</th><td>" +
            product.qty +
            "</td></tr><tr><th>Yksikköhinta</th><td>" +
            product.unit_price +
            "</td></tr><tr><th>Hyllypaikka</th><td>" +
            product.shelf_pos +
            "</td></tr><tr><th>Kerätty</th><td>" + handled +
            "</td></tr><tr><th>Kommentit</th><td>" + commentsection +
            "</td></tr></table><br>";
    }

    var orderTitle = "<h1>Tilaus " + order.orderid + "</h1>"
    var orderContainer = "<div id=\"order\" class=\"row table-responsive\">" + orderTitle + customerDataTable + "<h2> Tuotteet</h2>" + orderProducts + "</div><br>"
    document.getElementById("content").innerHTML = orderContainer
    window.print()
}
printOrder()