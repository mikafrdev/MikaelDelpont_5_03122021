class Product {

    displayProduct = (kanap) => {

        console.log("displayKanaps")
        let htmlContent
    
        for(const i in kanap){
    
            htmlContent = `
                <article class="cart__item" data-id="${kanap[i].id}">
    
                    <div class="cart__item__img">
                        <h2>${kanap[i].name}</h2>
                        <img src="${kanap[i].imageUrl}" alt="${kanap[i].altTxt}" />
                    </div>
    
                    <div class="cart__content">
            `
            let details = kanap[i].details
            for(const j in details){
                htmlContent+= `
                            <div class="cart__item__content">
                                <div class="cart__item__content__description">
                                    <p>${details[j].color}</p>
                                    <p class="pricequantity">${kanap[i].price * details[j].quantity} €</p>
                                    <div class="cart__item__content__settings">
                                        <div class="cart__item__content__settings__quantity">
                                            <p>Qté : ${details[j].quantity}</p>
                                            <input data-price="${kanap[i].price}" type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${details[j].quantity}" />
                                        </div>
                                        <div class="cart__item__content__settings__delete">
                                            <p class="deleteItem" data-id="${kanap[i].id}" data-color="${details[j].color}">Supprimer</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                `
            }
            htmlContent+= `
                    </div>
    
                </article>
                `
            document.querySelector('#cart__items').insertAdjacentHTML('afterend', htmlContent)
        }
    }
}

class Order {

    //
    getProductValueFromLocalStorage = (orderValueLS) => {

        let i = 0
        while (i < orderValueLS.length) {

            if ( colorChoice == orderValueLS[i].color ) return i
            i++
        }
        return -1
    }

    //Retourne un tableau d'objets contenant les informations des produits et de la commande imbriqués
    retrieveOrder = (products) => {
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

    setOrder = (id, NewOrderValue) => {
        JSON.stringify(OrderValueStringified)
        let OrderValueStringified = JSON.stringify(NewOrderValue)
        localStorage.setItem(id, OrderValueStringified)
    }

    deleteOrder = () => {
        let deleteLinks = document.getElementsByClassName("deleteItem")

        for (var i=0; i < deleteLinks.length; i++) {

            deleteLinks[i].onclick = function () {
                deleteLinks = document.getElementsByClassName("deleteItem")
                let idProductSelected = this.getAttribute("data-id")
                let colorProductSelected = this.getAttribute("data-color")
                let getValueFromLocalStorage = localStorage.getItem(idProductSelected)
                let valueLocalStorage = JSON.parse(getValueFromLocalStorage)
                let indexRowColor
                let getParentCardNode
                
                indexRowColor = valueLocalStorage.findIndex(row =>row.color == colorProductSelected)
                
                //Si l'utilisateur supprime le produit avec 1 seule couleur
                if (valueLocalStorage.length == 1) {
                    this.closest(".cart__item").remove()
                    localStorage.removeItem(idProductSelected)
                
                //Si l'utilisateur supprime le produit avec plusieurs couleurs
                }else{
                    valueLocalStorage.splice(indexRowColor, 1)
                    getParentCardNode = this.closest(".cart__item__content")
                    getParentCardNode.remove()
                    localStorage.removeItem(idProductSelected)
                    
                    //Order.setOrder(idProductSelected, valueLocalStorage) - A FAIRE
                    let OrderValueStringified = JSON.stringify(valueLocalStorage)
                    localStorage.setItem(idProductSelected, OrderValueStringified)
                }
            }
        }
    }

    _setPricebyProduct = () => {
        const changeProductsPrice = document.getElementsByClassName("deleteItem")
        changeProductsPrice.forEach(element => {
            console.log("TEST : ", changeProductsPrice[element])
        })
    }
}

const getAllProducts = () => fetch('http://localhost:3000/api/products')
    .then(res => res.json())
    .then(data => {
        //console.log(data)
        return data
    })
    .catch(err => console.log("Oh no", err))

const main = async () => {

    localStorage.setItem('8906dfda133f4c20a9d0e34f18adcf06', '[{"color":"Grey","quantity":"1"},{"color":"Purple","quantity":"1"},{"color":"Blue","quantity":"2"}]')
    localStorage.setItem('a6ec5b49bd164d7fbe10f37b6363f9fb', '[{"color":"Pink","quantity":"2"},{"color":"Brown","quantity":"3"},{"color":"Yellow","quantity":"3"},{"color":"White","quantity":"3"}]')
    localStorage.setItem('034707184e8e4eefb46400b5a3774b5f', '[{"color":"Silver","quantity":"3"}]')
    
    const kanaps = await getAllProducts()
    const kanapProduct = new Product()
    const order = new Order()
    const kanapsOrder = order.retrieveOrder(kanaps)
    kanapProduct.displayProduct(kanapsOrder)

    const changeProductsPrice = document.getElementsByClassName("itemQuantity")

    for (let i = 0; i < changeProductsPrice.length; i++) {
        changeProductsPrice[i].onclick = function () {

            let currentProductBasicPrice = this.getAttribute("data-price")
            let newProductPriceQuantity = currentProductBasicPrice*this.value
            this.parentNode.firstElementChild.innerHTML = "Qté : "+this.value
            changeProductsPrice[i].closest(".cart__item__content__description").children[1].innerHTML = newProductPriceQuantity+" €"

        }
    }

    //order.setPricebyProduct()
    order.deleteOrder()
}

main()
