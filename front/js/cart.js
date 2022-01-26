/*
const newContact = {
    firstName: string,
    lastName: string,
    address: string,
    city: string,
    email: string
}
*/
//products: [string] <-- array of product _id

/*
const recupKanap = fetch("http://localhost:3000/api/order/", {
    method: "POST",
    //body: JSON.stringify(newKanap),
    headers: {
        "Content-Type": "application/json"
    }
})
*/

const queryString = window.location.search
const searchID = new URLSearchParams(queryString)
const isIDinQuery = searchID.get('id')
const productID = searchID.get('id')

retrieveAllOrders = () => {

    console.log("retrieveAllOrders")

    var orders = [];
    for (var i = 0; i<localStorage.length; i++) {
        orders[i] = localStorage.getItem(localStorage.key(i));
    }

    return orders
}

const retrieveKanapMockedData = () => fetch('http://localhost:3000/api/products')
    .then(res => res.json())
    //.then(data => console.log(data))
    .catch(err => console.log("Oh no", err))

const displayKanaps = (kanapsData) => {

    for(const val in kanapsData){

        if (kanapsData[val]._id) {

            const node_root =  document.getElementById('cart__items')
            const node_article = document.createElement("article")
            node_article.setAttribute("class", "cart__item")
            node_article.setAttribute("data-id", kanapData._id)
            node_article.setAttribute("data-color", kanapData.colors)
            node_node_root.appendChild(node_article)
        }
    }
    
    
    /*
    for(const val in kanapsData){

        const node_A = document.createElement("a")
        node_A.setAttribute("href", "./product.html?id="+kanapsData[val]._id)

        const node_ARTICLE = document.createElement("article")
        node_A.appendChild(node_ARTICLE)

        const node_IMG = document.createElement("img")
        node_IMG.setAttribute("src", kanapsData[val].imageUrl)
        node_IMG.setAttribute("alt", kanapsData[val].altTxt)
        node_ARTICLE.appendChild(node_IMG)

        const node_H3 = document.createElement("h3")
        node_H3.setAttribute("class", "productName")
        node_H3.textContent = kanapsData[val].name
        node_ARTICLE.appendChild(node_H3)

        const node_P = document.createElement("p")
        node_P.setAttribute("class", "productDescription")
        node_P.textContent = kanapsData[val].description
        node_ARTICLE.appendChild(node_P)

        document.getElementById("items").appendChild(node_A)

    }
    */

}

var getLocaStorageKeys = [];
    for (var i = 0; i<localStorage.length; i++) {
        getLocaStorageKeys[i] = JSON.parse(localStorage.getItem(localStorage.key(i)));

        //console.log(getLocaStorageKeys[i])
    }

const main = async () => {
    retrieveAllOrders()
    const kanapsData = await retrieveKanapMockedData()
    //displayKanaps(kanapsData)

    for(const val in kanapsData){
        console.log(kanapsData[val]._id)
        kanapsOrderId
    }
}

main()