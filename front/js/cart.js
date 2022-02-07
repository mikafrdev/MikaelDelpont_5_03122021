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

fetch('https://example.com/profile', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data),
})
.then((response) => response.json())
//Then with the data from the response in JSON...
.then((data) => {
  console.log('Success:', data);
})
//Then with the error genereted...
.catch((error) => {
  console.error('Error:', error);
});
*/

class Product {

    constructor() {
    }

    getMockedData = async () => {    
        const getAllProducts = () => fetch('http://localhost:3000/api/products')
        .then(res => res.json())
        .catch(err => console.log("Oh no", err))
    }

    displayProduct = (product) => {

        console.log("displayProduct")
    
        const node_IMGcnt =  document.getElementsByClassName('item__img')
        const node_IMG = document.createElement("img")
        node_IMG.setAttribute("src", product.imageUrl)
        node_IMG.setAttribute("alt", product.altTxt)
        node_IMGcnt[0].appendChild(node_IMG)
    
        const node_h1 =  document.getElementById('title')
        node_h1.textContent = product.name
    
        const node_price =  document.getElementById('price')
        node_price.textContent = product.price
    
        const node_description =  document.getElementById('description')
        node_description.textContent = product.description
    
        const node_select =  document.getElementById('colors')
        
        for(const color in product.colors){
            const node_option = document.createElement("option")
            node_option.setAttribute("value", product.colors[color])
            node_option.textContent = product.colors[color]
            node_select.appendChild(node_option)
        }
    }
}

class Order {

    constructor() {}

    isValideForm = () => {
        
        console.log("isValideForm")
        
        let colorSelected = document.getElementById("colors").value
        let quantitySelected = document.getElementById("quantity").value

        console.log("colorSelected : "+colorSelected)
        console.log("quantitySelected : "+quantitySelected)

        if (colorSelected == "" || quantitySelected == 0) {
            return false
        }else{
            return true
        }
    }

    //Au clic sur le bouton "Ajouter au panier"
    addOrder = (product) => {

        console.log("isValideForm() : "+this.isValideForm())
 
        if (this.isValideForm()) {

            console.log("Formulaire valide")
            
            let orderKey = {
                id: product._id,
                color: document.getElementById('colors').value
            }

            let OrderKeyStringified = JSON.stringify(orderKey)
            let OrderValueStringified = JSON.stringify(document.getElementById('quantity').value)

            localStorage.setItem(OrderKeyStringified, OrderValueStringified)
        }else{
    
            alert("Formulaire non valide")
        }
    }
    
    checkOrder = () => {
        console.log("checkOrder")
        if (this.colorSelected != "" && this.quantitySelected != 0) {

            console.log("Formulaire valide")
        }else{
            console.log("Formulaire KO : PB sélection couleur ou quantité")
        }
    }
}

const getIdProductFromUrl = () => {
    const queryString = window.location.search
    const searchID = new URLSearchParams(queryString)
    const productID = searchID.get('id')

    return productID
}

const _retrieveKanapMockedData = () => fetch('http://localhost:3000/api/products')
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

const _main = async () => {

    let kanapProduct = new Product()
    let kanapPage = await kanapProduct.getMockedData()
    kanapProduct.displayProduct(kanapPage)

    let kanapOrder = new Order()
    
    document.getElementById("addToCart").onclick = function() {
        console.log("onclick fonction !")
        kanapOrder.addOrder(kanapPage)
    }
}

function allStorage() {

    var values = [],
        keys = Object.keys(localStorage),
        i = keys.length;

    while ( i-- ) {
        values.push( localStorage.getItem(keys[i]) );
    }

    return values;
}


const getAllProducts = () => fetch('http://localhost:3000/api/products')
    .then(res => res.json())
    .then(data => {
        //console.log(data)
        return data
    })
    .catch(err => console.log("Oh no", err))


const main = async () => {

    const kanapsProduct = new Product()
    let kanapsOrder = []
    
    const kanaps = await getAllProducts()

    //console.log("kanaps.length : ", kanaps.length)
    //console.log("localStorage.length : ", localStorage.length)

    //console.log("kanaps : ", kanaps)
    //console.log("localStorage : ", localStorage)
    
    for (let i=0; i < localStorage.length; i++) {
        
            for (let j=0; j < kanaps.length; j++) {
            
            keyLS = JSON.parse(localStorage.key(i))

            //console.log("kanaps[i]._id : ", kanaps[i]._id)
            //console.log("keyLS.id : ", keyLS.id)
            
            if (kanaps[j]._id == keyLS.id) {
   

                /*
                kanapsOrder[i] = [
                    { id: keyLS['id'] },
                    { colors: keyLS['color'] },
                    { altTxt: kanaps[1]._id },
                    { description: kanaps[i].description },
                    { imageUrl: kanaps[i].imageUrl },
                    { name: kanaps[i].name },
                    { price: kanaps[i].price },
                    { quantity: JSON.parse(localStorage.getItem(localStorage.key(i))) }
                ]
                */
                
                    kanapsOrder[i] = {
                        id: keyLS['id'],
                        colors: keyLS['color'],
                        altTxt: kanaps[i].altTxt,
                        description: kanaps[i].description,
                        imageUrl: kanaps[i].imageUrl,
                        name: kanaps[i].name,
                        price: kanaps[i].price,
                        quantity: JSON.parse(localStorage.getItem(localStorage.key(i)))
                    }
                
                
            }
        }
    }

    //let test1 = Object.values(kanapsOrder)    

    console.log("kanapsOrder : ", kanapsOrder)
    console.log("kanapsOrder : ", kanapsOrder[2][0])
    
    
    const kanapsOrderSorted = kanapsOrder.sort(function(a, b){
        //console.log("a et b : ", a, b)
        return a.a[0].localeCompare(b.b[0])
    })
    

    //console.log("kanapsOrderSorted : ", kanapsOrderSorted)
    
    //console.log("David : ", test2)
    
    //kanapsOrder.sort(function(a, b){return a.id - b.id})

    //console.log("kanapsOrder array : ", (kanapsOrder))
    //await kanapsOrder.sort(function(a, b){return a.id - b.id})
    //console.log("kanapsOrder : ", kanapsOrder)

}

main()