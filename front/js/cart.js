//Affichage des informations d'un canapé en affichant pour chacun une couleur par ligne 
displayProducts = (productsData) => {

    console.log("displayproductsDatas")
    let htmlContent

    for(const i in productsData){

        console.log(productsData[i].details)
        console.log(productsData[i].details[1].color)
        //console.log(typeof(productsData[i].details))

        htmlContent = `
            <article class="cart__item" data-id="${productsData[i].id}" data-color="${productsData[i].color}">


                <div class="cart__item__img">
                    <h2>${productsData[i].name}</h2>
                    <img src="${productsData[i].imageUrl}" alt="${productsData[i].altTxt}" />
                </div>

                <div class="cart__content">
        `
        let details = productsData[i].details
        for(const j in details){
            htmlContent+= `
                        <div class="cart__item__content">
                            <div class="cart__item__content__description">
                                <p>${details[j].color}</p>
                                <p class="pricequantity">${productsData[i].price * details[j].quantity} €</p>
                                <div class="cart__item__content__settings">
                                    <div class="cart__item__content__settings__quantity">
                                        <p>Qté : ${details[j].quantity}</p>
                                        <input data-price="${productsData[i].price}" type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${details[j].quantity}" />
                                    </div>
                                    <div class="cart__item__content__settings__delete">
                                        <p class="deleteItem" data-id="${productsData[i].id}" data-color="${details[j].color}">Supprimer</p>
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


//Retourne un tableau d'objets contenant les informations des produits et de la commande imbriqués
getProductsLocalStorage = (products) => {
    let order = new Array
    let productsDatasOrder = new Array

    for (let i=0; i<localStorage.length; i++) {
        
        let idLocalStorage = localStorage.key(i)
        let valueLocalStorage = JSON.parse(localStorage.getItem(idLocalStorage))

        //On récupère toutes les informations des produits présents dans le local storage en faisant matcher leur ID avec celui de la BDD
        let productsDataOrder = products.find(function(val, index) {
            if (val._id == idLocalStorage) return val
        })

        order = {
            id : idLocalStorage,
            altTxt : productsDataOrder.altTxt,
            description : productsDataOrder.description,
            imageUrl : productsDataOrder.imageUrl,
            name : productsDataOrder.name,
            price : productsDataOrder.price,
            details : valueLocalStorage
        }

        productsDatasOrder.push(order)
    }
    return productsDatasOrder
}

//Récupère le contenu du local storage sous la forme d'un tableau d'objets
getProductsFromLocalStorage = () => {
    let productsFromLocalStorage = new Array
    let idLocalStorage
    let i = 0
    for (let i=0; i<localStorage.length; i++) {
        idLocalStorage = localStorage.key(i)
        //console.log("Test : "+JSON.parse(localStorage.getItem(idLocalStorage)))
        productsFromLocalStorage.push({
            id : localStorage.key(i),
            color: JSON.parse(localStorage.getItem(idLocalStorage))
        })
    }
    //console.log(productsFromLocalStorage)
    return productsFromLocalStorage
}

//Work in progress ...
getProductValueFromLocalStorage = (orderValueLS) => {
    let i = 0
    while (i < orderValueLS.length) {

        if ( colorChoice == orderValueLS[i].color ) return i
        i++
    }
    return -1
}

/*
    Supprime un enregistrement losrqu'on clique sur le texte "Supprimer"
    - Si 1 seule couleur est présente pour 1 canapé, on supprime tout le bloc image du canapé + commande
    - Si plusieurs couleurs sont renseignées, on ne supprime que la ligne concernée
    - Les informations du localStorage sont mise à jour
*/
deleteOrder = () => {
    console.log("deleteOrder")
    let deleteLinks = document.getElementsByClassName("deleteItem")

    for (let i=0; i < deleteLinks.length; i++) {

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

//Work in progress
_setPricebyProduct = () => {
    const changeProductsPrice = document.getElementsByClassName("deleteItem")
    changeProductsPrice.forEach(element => {
        console.log("TEST : ", changeProductsPrice[element])
    })
}

//BUG
_onClickAddQuantity = () => {
    const changeProductQuantity = document.getElementsByClassName("itemQuantity")

    for (let i = 0; i < changeProductQuantity.length; i++) {
        changeProductQuantity[i].onclick = function () {

            let currentProductBasicPrice = this.getAttribute("data-price")
            let newProductPriceQuantity = currentProductBasicPrice * this.value
            this.parentNode.firstElementChild.innerHTML = "Qté : "+this.value

            //A VOIR AVEC DIDIER
            let productsFromLocalStorage = this.getProductsFromLocalStorage()
            let countColorProductsFromLocalstorage = 0
            
            for (let j = 0; j < productsFromLocalStorage.length; j++) {
                for (let k = 0; k < productsFromLocalStorage[j].color.length; k++) {
                    countColorProductsFromLocalstorage += parseInt(productsFromLocalStorage[j].color[k].quantity)
                }
            }

            //changeProductQuantity[i].closest(".cart__item__content__description").children[1].innerHTML = newProductPriceQuantity+" €"
            document.getElementById("totalQuantity").innerHTML = countColorProductsFromLocalstorage
        }
    }
}

//WIP...
getQuantityFromLocalStorage = (Products) => {

}

//Work in progress
setOrder = (id, NewOrderValue) => {
    JSON.stringify(OrderValueStringified)
    let OrderValueStringified = JSON.stringify(NewOrderValue)
    localStorage.setItem(id, OrderValueStringified)
}

const main = async () => {

    //Enregistrement en dur pour les tests - A supprimer
    //localStorage.setItem('8906dfda133f4c20a9d0e34f18adcf06', '[{"color":"Grey","quantity":"1"},{"color":"Purple","quantity":"1"},{"color":"Blue","quantity":"2"}]')
    //localStorage.setItem('a6ec5b49bd164d7fbe10f37b6363f9fb', '[{"color":"Pink","quantity":"2"},{"color":"Brown","quantity":"3"},{"color":"Yellow","quantity":"3"},{"color":"White","quantity":"3"}]')
    //localStorage.setItem('034707184e8e4eefb46400b5a3774b5f', '[{"color":"Silver","quantity":"3"}]')
    
    //On récupère les données de tous les canapés depuis la BDD
    
    //Récupération des données de tous les produitss avec un argument vide passé en paramètre de la fonction <getMockedData>
    const productsData = await getMockedData("")
    
    //Affichage de tous les produits
    const productsLocalStorage = getProductsLocalStorage(productsData)
    
    //On affiche les canapés présents dans le localStorage
    displayProducts(productsLocalStorage)

    //BUG - voir _onClickAddQuantity
    //onClickAddQuantity()

    //Début gestion des prix
    const changeProductQuantity = document.getElementsByClassName("itemQuantity")

    for (let i = 0; i < changeProductQuantity.length; i++) {
        changeProductQuantity[i].onclick = function () {

            console.log("Click change quantity")

            let _id = this.closest("article").getAttribute("data-id")
            let colorChoice = this.closest("article").getAttribute("data-color")

            let valueLocalStorageById = JSON.parse(localStorage.getItem(_id))

            const _index = valueLocalStorageById.findIndex(object => {
                console.log(object.color)
                console.log(colorChoice)
                return object.color == colorChoice
            })

            console.log(valueLocalStorageById)

            const index = valueLocalStorageById.map(object => object.color).indexOf(colorChoice)

            console.log("indexColorRow : "+index)

            /*
            while () {
                i++
            }
            */
            
            let newValueLocalStorage = {

            }
            //newOrderValue = {color: colorChoice, quantity: quantityChoice}
            //valueLocalStorage.push(NewOrderValue)
            //localStorage.setItem('myCat', 'Tom')

            /*
            productsFromLocalStorage.push({
                id : localStorage.key(i),
                color: JSON.parse(localStorage.getItem(idLocalStorage))
            })
            */
            //order.addOrder(productsDataPage)

            /*
            let currentProductBasicPrice = this.getAttribute("data-price")
            let newProductPriceQuantity = currentProductBasicPrice * this.value
            this.parentNode.firstElementChild.innerHTML = "Qté : "+this.value

            let productsFromLocalStorage = order.getProductsFromLocalStorage()
            let countColorProductsFromLocalstorage = 0
            
            for (let j = 0; j < productsFromLocalStorage.length; j++) {
                for (let k = 0; k < productsFromLocalStorage[j].color.length; k++) {
                    countColorProductsFromLocalstorage += parseInt(productsFromLocalStorage[j].color[k].quantity)
                }
            }

            //changeProductQuantity[i].closest(".cart__item__content__description").children[1].innerHTML = newProductPriceQuantity+" €"
            document.getElementById("totalQuantity").innerHTML = countColorProductsFromLocalstorage
            */
        }
    }

    //Fin gestion des prix

    //order.setPricebyProduct()
    deleteOrder()
}

main()
