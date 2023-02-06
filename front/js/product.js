//Génère du code HTML pour afficher les informations du produit grace à l'ID présent en paramètre de l'URL
displayProduct = (product) => {        

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

/*
    Si le formulaire est valide, la fonction met à jour les données du Local Storage 
    avec un nouvel enregistrement
    
    Paramètres :
    idProduct => ID du produit présent sur la page - l'ID est récupéré dans le paramètre 'id' de l'URL
*/
setOrder = (idProduct) => {

    if (isValideForm()) {
        const getValueLocalStorage = localStorage.getItem(idProduct)
        const valueLocalStorage = JSON.parse(getValueLocalStorage)
        const colorChoice = document.getElementById('colors').value
        const quantityChoice = parseInt(document.getElementById('quantity').value)
        let newOrderValue = {}

        //S'il y a déjà l'ID du canapé dans le localStorage
        if(valueLocalStorage){
            const indexSameColor = isColorStillOrdered (valueLocalStorage, colorChoice)

            //Si le canapé et la couleur sont présents dans le localStorage, on remplace l'ancien enregistrement par le nouveau
            if(indexSameColor != -1){
                newOrderValue = valueLocalStorage
                newOrderValue[indexSameColor].quantity = parseInt(newOrderValue[indexSameColor].quantity) + quantityChoice

            //Si le canapé est présent dans le localStorage mais pas la couleur, on ajoute un enregistrement avec la nouvelle couleur
            }else{
                newOrderValue = {
                    color: colorChoice, 
                    quantity: quantityChoice
                }
                valueLocalStorage.push(newOrderValue)
                newOrderValue = valueLocalStorage
            }

        //Si l'ID du canapé n'est pas trouvé dans le localStorage, on ajoute un nouvel enregistrement
        }else{
            newOrderValue = [
                {
                    color: colorChoice, 
                    quantity: quantityChoice
                }
            ]
        }

        //Les données sont converties en STRING avant d'être enregistrées dans le localStorage
        let OrderValueStringified = JSON.stringify(newOrderValue)
        localStorage.setItem(idProduct, OrderValueStringified)

        alert("L'article a été ajouté dans le panier")

    //Si le formulaire n'est pas valide
    }else{
        alert("La couleur et/ou le nombre d'articles n'ont pas été renseignés")
    }
}

//Vérification qu'une couleur et qu'un nombre d'article ont bien été renseignés
isValideForm = () => {
    let colorSelected = document.getElementById("colors").value
    let quantitySelected = document.getElementById("quantity").value
    if (colorSelected == "" || quantitySelected == 0) {
        return false
    }else{
        return true
    }
}

/*
    Vérifie que la couleur de l'article est déjà présente dans le localStorage sinon on renvoie -1
    La vérification est réalisée 

    Paramètres :
    orderValueLS => Tableau contenant pour un produit tous les éléments {color, quantity} présents dans le localstorage
    colorChoice => couleur sélectionné par l'internaute
*/
isColorStillOrdered = (orderValueLS, colorChoice) => {
    let i = 0
    while (i < orderValueLS.length) {
        if ( colorChoice == orderValueLS[i].color ) return i
        i++
    }
    return -1
}

//Retourne l'id du produit présent dans l'url de la page
const getIdFromUrl = () => {
    const queryString = window.location.search
    const searchID = new URLSearchParams(queryString)
    const productID = searchID.get('id')

    return productID
}

const main = async () => {
    //Récupération de l'ID du produit affiché sur la page
    const idProduct = getIdFromUrl()
    
    //Récupération des données du produit en passant en paramètre l'id produit présente dans l'url
    const product = await getMockedData(idProduct)
    
    //Affichage des informations du produit
    displayProduct(product)
    
    //En cliquant sur le bouton "Ajouter au panier" on exécute la fonction setOrder
    document.getElementById("addToCart").onclick = function() {
        setOrder(idProduct)
    }
}

main()