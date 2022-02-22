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

    _displayProduct = (kanap) => {

        console.log("displayProduct")
        console.log(kanap)

        const container = document.getElementById("cart__items")
        let node_article
        let node_div
        let node_div_div
        let node_img
        let node_p
        let node_h2


          /*<article class="cart__item" data-id="{product-ID}" data-color="{product-color}">
                <div class="cart__item__img">
                  <img src="../images/product01.jpg" alt="Photographie d'un canapé">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>Nom du produit</h2>
                    <p>Vert</p>
                    <p>42,00 €</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté : </p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="42">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                </div>
            </article> */

        for(const i in kanap){
            
            node_article = document.createElement("article")
            node_article.setAttribute("class", "cart__item")
            node_article.setAttribute("data-id", kanap[i].id)
            node_article.setAttribute("data-color", kanap[i].color)
            node_article.setAttribute("class", "cart__item")
            container.appendChild(node_article)

            node_div = document.createElement("div")
            node_div.setAttribute("class", "cart__item__img")
            node_article.appendChild(node_div)

            node_img = document.createElement("img")
            node_img.setAttribute("src", kanap[i].imageUrl)
            node_img.setAttribute("alt", kanap[i].altTxt)
            node_div.appendChild(node_img)

            node_div = document.createElement("div")
            node_div.setAttribute("class", "cart__item__content")
            node_article.appendChild(node_div)

            node_div_div = document.createElement("div")
            node_div_div.setAttribute("class", "cart__item__content__description")
            node_div.appendChild(node_div_div)

            node_h2 = document.createElement("h2")
            node_h2.textContent = kanap[i].name
            node_div_div.appendChild(node_h2)

            node_p = document.createElement("p")
            node_p.textContent = kanap[i].details[0].color
            console.log("TEST : ", kanap[i].details[0].color)
            node_div_div.appendChild(node_p)

            node_p = document.createElement("p")
            node_p.textContent = kanap[i].price+" €"
            node_div_div.appendChild(node_p)

            node_div = document.createElement("div")
            node_div.setAttribute("class", "cart__item__content__settings")
            node_div_div.parentElement.appendChild(node_div)

            node_div_div = document.createElement("div")
            node_div_div.setAttribute("class", "cart__item__content__settings__quantity")
            node_div.appendChild(node_div_div)

            node_p = document.createElement("p")
            node_p.textContent = "Qté : "+kanap[i].details[0].quantity
            node_div_div.appendChild(node_p)

            const node_input = document.createElement("input")
            node_input.setAttribute("class", "itemQuantity")
            node_input.setAttribute("type", "number")
            node_input.setAttribute("name", "itemQuantity")
            node_input.setAttribute("min", 1)
            node_input.setAttribute("max", 100)
            node_input.setAttribute("value", kanap[i].details[0].quantity)
            node_div_div.appendChild(node_input)

            node_div = document.createElement("div")
            node_div.setAttribute("class", "cart__item__content__settings__delete")
            node_div_div.parentElement.appendChild(node_div)

            node_p = document.createElement("p")
            node_p.setAttribute("class", "deleteItem")
            node_p.textContent = "Supprimer"
            node_div.appendChild(node_p)
        }

        /*

        for(const color in product.colors){
            const node_option = document.createElement("option")
            node_option.setAttribute("value", product.colors[color])
            node_option.textContent = product.colors[color]
            node_select.appendChild(node_option)
        }

        */

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
            </div>
        </article>
        `
        document.querySelector('#cart__items').insertAdjacentHTML('afterend', htmlContent)

        const node_root =  document.getElementsByClassName('cart__item__content__description')
        console.log(node_root.innerHTML)
        const node_p = document.createElement("p")
        //node_IMG.setAttribute("src", product.imageUrl)
        node_p.textContent = kanap[val].color
        node_root.appendChild(node_p)
        
    }
}

const displayProduct = (kanap) => {

    console.log("displayKanaps")

    let htmlContent = `
        <article class="cart__item" data-id="001" data-color="{product-color}">
            <div class="cart__item__img">
                <img src="http://localhost:3000/images/kanap02.jpeg" alt="kanap">
            </div>
            <div class="cart__item__content">
                <div class="cart__item__content__description">
                    <h2>Kanap Cyllène</h2>
                    <p>Rouge</p>
                    <p>123 €</p>
                </div>
                <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                        <p>Qté : 4</p>
                        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="4">
                    </div>
                    <div class="cart__item__content__settings__delete">
                        <p class="deleteItem">Supprimer</p>
                    </div>
                </div>
            </div>
        </article>
        `
        //document.querySelector('#cart__items').insertAdjacentHTML('afterend', htmlContent)

        htmlContent = `
        <article class="cart__item" data-id="001" data-color="{product-color}">

            <div class="cart__item__img">
                <h2>Kanap Cyllène</h2>
                <img src="http://localhost:3000/images/kanap02.jpeg" alt="kanap">
            </div>

            <div class="cart__content">

                <div class="cart__item__content">
                    <div class="cart__item__content__description">
                        <p>Rouge</p>
                        <p>123 €</p>
                        <div class="cart__item__content__settings">
                            <div class="cart__item__content__settings__quantity">
                                <p>Qté : 4</p>
                                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="4">
                            </div>
                            
                        </div>
                        <div class="cart__item__content__settings__delete">
                            <p class="deleteItem">Supprimer</p>
                        </div>
                    </div>
                </div>

                <div class="cart__item__content">
                    <div class="cart__item__content__description">
                        <p>Rouge</p>
                        <p>123 €</p>
                        <div class="cart__item__content__settings">
                            <div class="cart__item__content__settings__quantity">
                                <p>Qté : 4</p>
                                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="4">
                            </div>
                            <div class="cart__item__content__settings__delete">
                                <p class="deleteItem">Supprimer</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="cart__item__content">
                    <div class="cart__item__content__description">
                        <p>Rouge</p>
                        <p>123 €</p>
                        <div class="cart__item__content__settings">
                            <div class="cart__item__content__settings__quantity">
                                <p>Qté : 4</p>
                                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="4">
                            </div>
                            <div class="cart__item__content__settings__delete">
                                <p class="deleteItem">Supprimer</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </article>
        `
        document.querySelector('#cart__items').insertAdjacentHTML('afterend', htmlContent)

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
        
        let idLocalStorage = localStorage.key(i)
        let valueFronLocalStorage = JSON.parse(localStorage.getItem(idLocalStorage))

        //On récupère les informations du produit correspondant à l'ID de la boucle
        let kanapOrder = products.find(function(val, index) {
            if (val._id == idLocalStorage) return val
        })

        order = {
            id : idLocalStorage,
            altTxt : kanapOrder.altTxt,
            description : kanapOrder.description,
            imageUrl : kanapOrder.imageUrl,
            name : kanapOrder.name,
            price : kanapOrder.price,
            details : valueFronLocalStorage
        }

        kanapsOrder.push(order)
    }
    return kanapsOrder
}

const main = async () => {
    
    const kanaps = await getAllProducts()

    const kanapsOrder = retrieveOrder(kanaps)

    //console.log("kanapsOrder : ", kanapsOrder)

    //const kanapsOrderSorted = kanapsOrder.sort((a, b) => a.id.localeCompare(b.id))

    let kanapProduct = new Product()
    displayProduct(kanapsOrder)
}

main()