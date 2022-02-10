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

const _retrieveKanapMockedData = () => fetch('http://localhost:3000/api/products')
    .then(res => res.json())
    //.then(data => console.log(data))
    .catch(err => console.log("Oh no", err))

const displayKanaps = (kanap) => {

    console.log("displayKanaps")
    console.log("kanap : ", kanap)

    let isSameId = true

    for(const val in kanap){

        let htmlContent = `
        <article class="cart__item" data-id="${kanap[val].id}" data-color="{product-color}">
            <div class="cart__item__img">
                <img src="${kanap[val].imageUrl}" alt="${kanap[val].altTxt}">
            </div>
            <div class="cart__item__content">
                <div class="cart__item__content__description">
                    <h2>${kanap[val].name}</h2>
                    <p>${kanap[val].color}</p>
                    <p>${kanap[val].price} €</p>
                </div>
                <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                        <p>Qté : ${kanap[val].quantity}</p>
                        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${kanap[val].quantity}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                        <p class="deleteItem">Supprimer</p>
                    </div>
                </div>
            </div>`
            
            if (isSameId) {

                +`<div class="cart__item__content">
                <div class="cart__item__content__description">
                    <p>${kanap[val].color}</p>
                    <p>${kanap[val].price} €</p>
                </div>
                <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                        <p>Qté : ${kanap[val].quantity}</p>
                        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${kanap[val].quantity}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                        <p class="deleteItem">Supprimer</p>
                    </div>
                </div>
            </div>
            `
            }
            `
        </article>
        `
        document.querySelector('#cart__items').insertAdjacentHTML('afterend', htmlContent)
        
    }
}

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

function getOneOrderComparedToLocalStorage(products) {
    products.find(function(val, index) {
        if(val._id == idLocalStorage)
            return true
    })
}

//Retourne un tableau d'objets contenant les informations des produits et de la commande imbriqués
const retrieveOrder = (products) => {
    let order = new Array
    let kanapsOrder = new Array

    for (let i=0; i<localStorage.length; i++) {
        idLocalStorage = JSON.parse(localStorage.key(i)).id

        //var kanapOrder = getOneOrderComparedToLocalStorage(products)
        let kanapOrder = products.find(function(val, index) {
            if(val._id == idLocalStorage) return val
        })

        order = {
            id : idLocalStorage,
            color : JSON.parse(localStorage.key(i)).color,
            quantity : JSON.parse(localStorage.getItem(localStorage.key(i))),
            altTxt : kanapOrder.altTxt,
            description : kanapOrder.description,
            imageUrl : kanapOrder.imageUrl,
            name : kanapOrder.name,
            price : kanapOrder.price
        }

        kanapsOrder.push(order)
    }
    return kanapsOrder
}

const main = async () => {
    
    const kanaps = await getAllProducts()

    const kanapsOrder = retrieveOrder(kanaps)

    const kanapsOrderSorted = kanapsOrder.sort((a, b) => a.id.localeCompare(b.id))

    displayKanaps(kanapsOrderSorted)

    
}

main()