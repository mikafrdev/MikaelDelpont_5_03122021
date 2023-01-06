/*
    Récupération des données mockées d'un produit
    - Si aucun paramètre n'est passé alors on affiche tous les produits
    - Si un ID est renseigné en paramètre alors on affiche uniquement les données d'un produit

*/
getMockedData = async (productID) => {
    let canap = await fetch('http://localhost:3000/api/products/' + productID)
    .then((response) => {
        if (response.ok) {
            return response.json()
        }else{
            console.log("Problème server")
        }
    })
    .then((data) => {
        return data

    })
    .catch((error) => { console.error('Error:', error) })
    return canap
}

/*
    Affichage des informations d'un canapé en affichant pour chacun une couleur par ligne
    calcul le prix des articles en fonction des quantités sélectionnées
*/
displayProducts = (productsMocked, productsMerged, option) => {
    
    //Supprime tous les articles de l'affichage uniquement
    if (option == "refresh") {
        var e = document.getElementById("cart__items")
        var child = e.lastElementChild
        
        while (child) {
            e.removeChild(child)
            child = e.lastElementChild
        }
    }

    const node_parent = document.getElementById('cart__items')

    if (productsMerged.length) {
        productsMerged.forEach(function (product) {
            const node_article = document.createElement("article")
            node_article.setAttribute("class", "cart__item")
            node_article.setAttribute("data-id", product.id)
            node_parent.appendChild(node_article)

            let node_div = document.createElement("div")
            node_div.setAttribute("class", "cart__item__img")
            node_article.appendChild(node_div)

            let node_h2 = document.createElement("h2")
            node_h2.innerHTML = product.name
            node_div.appendChild(node_h2)

            node_img = document.createElement("img")
            node_img.setAttribute("src", product.imageUrl)
            node_img.setAttribute("alt", product.altTxt)
            node_div.appendChild(node_img)

            node_container_details = document.createElement("div")
            node_container_details.setAttribute("class", "cart__content")
            node_article.appendChild(node_container_details)

            product.details.forEach(function (details) {
                node_div = document.createElement("div")
                node_div.setAttribute("class", "cart__item__content")
                node_div.setAttribute("data-id", product.id)
                node_div.setAttribute("data-color", details.color)
                node_container_details.appendChild(node_div)

                const node_div_2 = document.createElement("div")
                node_div_2.setAttribute("class", "cart__item__content__description")
                node_div.appendChild(node_div_2)

                let node_p = document.createElement("p")
                node_p.innerHTML = details.color
                node_div_2.appendChild(node_p)

                node_p = document.createElement("p")
                node_p.setAttribute("class", "pricequantity")
                node_p.innerHTML = product.price * details.quantity + " €"
                node_div_2.appendChild(node_p)

                node_div_3 = document.createElement("div")
                node_div_3.setAttribute("class", "cart__item__content__settings")
                node_div_2.appendChild(node_div_3)

                let node_div_4 = document.createElement("div")
                node_div_4.setAttribute("class", "cart__item__content__settings__quantity")
                node_div_3.appendChild(node_div_4)

                let node_p_quantite = document.createElement("p")
                node_p_quantite.innerHTML = "Qté : " + details.quantity
                node_div_4.appendChild(node_p_quantite)

                const node_input = document.createElement("input")
                node_input.setAttribute("data-price", product.price)
                node_input.setAttribute("data-color", details.color)
                node_input.setAttribute("type", "number")
                node_input.setAttribute("class", "itemQuantity")
                node_input.setAttribute("name", "itemQuantity")
                node_input.setAttribute("min", "1")
                node_input.setAttribute("max", "100")
                node_input.setAttribute("value", details.quantity)
                node_div_4.appendChild(node_input)

                node_div_4 = document.createElement("div")
                node_div_4.setAttribute("class", "cart__item__content__settings__delete")
                node_div_3.appendChild(node_div_4)

                node_p_supprimer = document.createElement("p")
                node_p_supprimer.setAttribute("class", "deleteItem")
                node_p_supprimer.setAttribute("data-id", product.id)
                node_p_supprimer.setAttribute("data-color", details.color)
                node_p_supprimer.innerHTML = "Supprimer"
                node_div_4.appendChild(node_p_supprimer)
            })
        })
    }else{
        node_message = document.createElement("div")
        node_message.setAttribute("class", "cart__item")
        node_message.innerHTML = "Votre panier est vide, merci d'ajouter des articles pour pouvoir passer une commande."
        node_parent.appendChild(node_message)
    }

    changeProductQuantity(productsMocked)
    updatePrices()
    updateQuantities()
    deleteOrder(productsMocked)
}

changeProductQuantity = (productsMocked) => {
    const elementsQuantity = document.getElementsByClassName("itemQuantity")

    for (const element of elementsQuantity) {
        element.addEventListener('click', function () {    
            let productColor = element.getAttribute("data-color")
            const productId = element.closest(".cart__item").getAttribute("data-id")
            let ProductValueLocalStorage = new Array
            ProductValueLocalStorage = getProductValueLocalStorage(productId)

            let index = ProductValueLocalStorage.findIndex(function (todo, index) {
                return todo.color == productColor
            })

            newProductDetail = {
                color: productColor,
                quantity: element.value
            }

            ProductValueLocalStorage.splice(index, 1, newProductDetail)
            setProductValueLocalStorage(productId, ProductValueLocalStorage)
            let productsMerged = getProductsMerged(productsMocked)
            displayProducts(productsMocked, productsMerged, "refresh")
        })
    }
    
}

const getProductValueLocalStorage = (productId) => {
    const valueLocalStorage = JSON.parse(localStorage.getItem(productId))
    return valueLocalStorage
}

let setProductValueLocalStorage = (productId, valueLocalStorage) => {
    console.log(productId)
    console.log(valueLocalStorage)
    let valueLocalStorageStringified = JSON.stringify(valueLocalStorage)
    localStorage.setItem(productId, valueLocalStorageStringified)
}

//Retourne un tableau d'objets contenant les informations des produits et de la commande imbriqués
const getProductsMerged = (productsMocked) => {
    let order = new Array
    let productsDatasOrder = new Array

    for (let i = 0; i < localStorage.length; i++) {
        let idLocalStorage = localStorage.key(i)
        let valueLocalStorage = JSON.parse(localStorage.getItem(idLocalStorage))

        //On récupère toutes les informations des produits présents dans le local storage en faisant matcher leur ID avec celui de la BDD
        let productsDataOrder = productsMocked.find(function (val, index) {
            //console.log("val._id, idLocalStorage : ", val._id, idLocalStorage)
            if (val._id == idLocalStorage) return val
        })

        order = {
            id: idLocalStorage,
            altTxt: productsDataOrder.altTxt,
            description: productsDataOrder.description,
            imageUrl: productsDataOrder.imageUrl,
            name: productsDataOrder.name,
            price: productsDataOrder.price,
            details: valueLocalStorage
        }

        productsDatasOrder.push(order)
    }
    return productsDatasOrder
}

/*
    Supprime un enregistrement losrqu'on clique sur le texte "Supprimer"
    - Si 1 seule couleur est présente pour 1 canapé, on supprime tout le bloc image du canapé + commande
    - Si plusieurs couleurs sont renseignées, on ne supprime que la ligne concernée
    - Les informations du localStorage sont mise à jour
*/
deleteOrder = (productsMocked) => {
    let deleteElement = document.getElementsByClassName("deleteItem")

    for (const element of deleteElement) {
        element.addEventListener('click', () => {
            //console.log(element)
            let productId = element.getAttribute("data-id")
            let productColor = element.getAttribute("data-color")
            let valueLocalStorage = getProductValueLocalStorage(productId)
            let indexRowColor = valueLocalStorage.findIndex(row => row.color == productColor)   //Retourne l'index de la couleur correspondante dans le localstorage

            //Si l'utilisateur supprime le produit avec 1 seule couleur
            if (valueLocalStorage.length == 1) {
                localStorage.removeItem(productId)
            } else {    //Si l'utilisateur supprime le produit avec plusieurs couleurs
                valueLocalStorage.splice(indexRowColor, 1)  //Retourne un tableau correspondant à la couleur + quantité depuis le local storage
                //console.log(valueLocalStorage)
                setProductValueLocalStorage(productId, valueLocalStorage)
            }
            let productsMerged = getProductsMerged(productsMocked)
            displayProducts(productsMocked, productsMerged, "refresh")
        })
    }
}

updatePrices = () => {
    const productsPrices = document.getElementsByClassName("pricequantity")
    const totalPrice = document.getElementById("totalPrice")
    let productPriceCleaned = 0

    for (const productNode of productsPrices) {
        productPriceCleaned = productPriceCleaned + parseInt(productNode.innerHTML.substring(0, productNode.innerHTML.length - 2))
    }
    totalPrice.innerHTML = productPriceCleaned
}

updateQuantities = () => {
    const totalQuantity = document.getElementById("totalQuantity")
    const productsQuantity = document.getElementsByClassName("itemQuantity")
    let productQuantityCleaned = 0

    for (const productNode of productsQuantity) {
        productQuantityCleaned = productQuantityCleaned + parseInt(productNode.value.substring(0, productNode.value.length))
    }
    totalQuantity.innerHTML = productQuantityCleaned
}

const main = async () => {
    //Enregistrement en dur pour les tests - A supprimer
    /*
    localStorage.setItem('8906dfda133f4c20a9d0e34f18adcf06', '[{"color":"Grey","quantity":"1"},{"color":"Purple","quantity":"1"},{"color":"Blue","quantity":"2"}]')
    localStorage.setItem('a6ec5b49bd164d7fbe10f37b6363f9fb', '[{"color":"Pink","quantity":"2"},{"color":"Brown","quantity":"3"},{"color":"Yellow","quantity":"3"},{"color":"White","quantity":"3"}]')
    localStorage.setItem('034707184e8e4eefb46400b5a3774b5f', '[{"color":"Silver","quantity":"3"}]')
    */

    //Récupération des données de tous les produits présents dans la BDD
    const productsMocked = await getMockedData("")

    //Récupération de toutes les informations des produits présents dans le local storage
    const productsMerged = getProductsMerged(productsMocked)
    displayProducts(productsMocked, productsMerged) //Affichage des produits 

    /*************** Ecouter le clic sur le submit du formulaire ***************/
    const formInputs = document.querySelectorAll('#formUser input[type=text], #formUser input[type=email]')
    formUser.addEventListener('submit', function (event) {
        event.preventDefault()  //Empêche le formulaire d'être exécuté
        isValid = checkForm(formInputs)

        if (isValid) {
            fetchPostOrder()
        }
    })

    checkForm = (formInputs) => {
        let inputRegExp
        let testInput
        let isValid = true

        for (const formInput of formInputs) {
            if (formInput.name == "firstName" || formInput.name == "lastName") {
                inputRegExp = new RegExp('[a-zA-Z0-9à-üÀ-Ü-\'\s]')
            }
            if (formInput.name == "adress") {
                inputRegExp = new RegExp('([0-9a-zA-Z,\. ]*) ?([0-9]{5}) ?([a-zA-Z]*)')
            }
            if (formInput.name == "city") {
                //[a-zA-Z0-9à-üÀ-Ü-\'\s]
                inputRegExp = new RegExp('/^[a-zA-Z.\'-]+(?:[\s-][\/a-zA-Z.]+)*$/gm')
            }
            if (formInput.email == "email") {
                //(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))
                //^.+@.+\..+
                //^([a-zA-Z0-9_-])+([.]?[a-zA-Z0-9_-]{1,})*@([a-zA-Z0-9-_]{2,}[.])+[a-zA-Z]{2,3}$
                inputRegExp = new RegExp('^([a-zA-Z0-9_-])+([.]?[a-zA-Z0-9_-]{1,})*@([a-zA-Z0-9-_]{2,}[.])+[a-zA-Z]{2,3}$')
            }

            testInput = inputRegExp.test(formInput.value)

            if (testInput) {
                formInput.nextElementSibling.innerHTML = ""
                console.log(formInput.name + " valide")
            } else {
                formInput.nextElementSibling.innerHTML = formInput.name + " invalide"
                console.log(formInput.name + " invalide")
                isValid = false
            }
        }
        return isValid
    }

    fetchPostOrder = () => {
        let contact = {
            firstName: "test",
            lastName: "test",
            address: "1 rue du test",
            city: "Ville-test",
            email: "unemail@testemail.com"
        }

        let products = ["034707184e8e4eefb46400b5a3774b5f"]

        let fetchPostUrl = "http://localhost:3000/api/products/order"
        let fetchBody = { contact, products }

        console.log(JSON.stringify(fetchBody))

        fetch(fetchPostUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify(fetchBody)
        })
            .then((res) => {
                if (res.ok) {
                    return res.json()
                } else {
                    console.log("Problème server")
                }
            })
            .then((data) => {
                console.log('Success:', data)
                //document.location.href="confirmation.html?orderId="+data.orderId
                return data
            })
            .catch((error) => {
                console.error('Error:', error)

            })
    }
    //fetchPostOrder()

} //END MAIN

main()