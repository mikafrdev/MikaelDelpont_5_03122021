class Product {

    constructor() {
        //console.log("Constructeur OK")
    }

    getMockedData = async () => {

        const productID = getIdFromUrl()
    
        let canap = await fetch('http://localhost:3000/api/products/' + productID)
        .then((response) => {
            if (response.ok) {
                //console.log("Réponse ok du server")
                return response.json();
            }else{
                console.log("Problème server")
            }
        })
        .then((data) => { 
            //console.log('Success:', data)
            return data
        })
        .catch((error) => { console.error('Error:', error) });

        return canap
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

        if (colorSelected == "" || quantitySelected == 0) {
            return false
        }else{
            return true
        }
    }

    isColorStillOrdered = (orderValueLS, colorChoice) => {

        let i = 0
        while (i < orderValueLS.length) {

            if ( colorChoice == orderValueLS[i].color ) return i
            i++
        }
        return -1
    }

    //Au clic sur le bouton "Ajouter au panier"
    addOrder = (product) => {
 
        if (this.isValideForm()) {
            const getValueFromLocalStorage = localStorage.getItem(product._id)
            const valueFronLocalStorage = JSON.parse(getValueFromLocalStorage)
            const colorChoice = document.getElementById('colors').value
            const quantityChoice = document.getElementById('quantity').value
            let NewOrderValue = {}

            if(valueFronLocalStorage){

                const indexSameColor = this.isColorStillOrdered (valueFronLocalStorage, colorChoice)

                if(indexSameColor != -1){

                    NewOrderValue = valueFronLocalStorage
                    NewOrderValue[indexSameColor].quantity = quantityChoice
                }else{

                    NewOrderValue = {color: colorChoice, quantity: quantityChoice}
                    valueFronLocalStorage.push(NewOrderValue)
                    NewOrderValue = valueFronLocalStorage
                }

            }else{

                NewOrderValue = [
                    {color: colorChoice, quantity: quantityChoice}
                ]
            }

            let OrderValueStringified = JSON.stringify(NewOrderValue)
            localStorage.setItem(product._id, OrderValueStringified)

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

const getIdFromUrl = () => {
    const queryString = window.location.search
    const searchID = new URLSearchParams(queryString)
    const productID = searchID.get('id')

    return productID
}

const main = async () => {

    //localStorage.setItem('107fb5b75607497b96722bda5b504926', '{"colors":["Blue","green"],"quantity":["3"]}')
    //localStorage.setItem('107fb5b75607497b96722bda5b504926', '{"orders":{"colors":"Red","quantity":"3"}}')
    
    let kanapProduct = new Product()
    let kanapPage = await kanapProduct.getMockedData()
    kanapProduct.displayProduct(kanapPage)

    let kanapOrder = new Order()
    
    document.getElementById("addToCart").onclick = function() {
        console.log("onclick fonction !")
        kanapOrder.addOrder(kanapPage)
    }
}

main()