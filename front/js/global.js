/*
    Récupération des données mockées d'un produit
    - Si aucun paramètre n'est passé alors on affiche tous les produits
    - Si un ID est renseigné en paramètre alors on affiche uniquement les données d'un produit

*/
getMockedData = async (productID) => {

    let canap = await fetch('http://localhost:3000/api/products/' + productID)
    .then((response) => {
        if (response.ok) {
            //console.log("Réponse ok du server")
            return response.json()
        }else{
            console.log("Problème server")
        }
    })
    .then((data) => { 
        //console.log('Success:', data)
        return data
    })
    .catch((error) => { console.error('Error:', error) })

    return canap
}

/*
    Si le formulaire est valide, la fonction met à jour les données du Local Storage avec un nouvel enregistrement
*/
setOrder = (product) => {

    if (this.isValideForm()) {
        const getValueLocalStorage = localStorage.getItem(product._id)
        const valueLocalStorage = JSON.parse(getValueLocalStorage)
        const colorChoice = document.getElementById('colors').value
        const quantityChoice = document.getElementById('quantity').value
        let newOrderValue = {}

        //S'il y a déjà l'ID du canapé dans le localStorage
        if(valueLocalStorage){

            const indexSameColor = this.isColorStillOrdered (valueLocalStorage, colorChoice)

            //Si le canapé et la couleur sont présents dans le localStorage, on remplace l'ancien enregistrement par le nouveau
            if(indexSameColor != -1){
                newOrderValue = valueLocalStorage
                newOrderValue[indexSameColor].quantity = quantityChoice

            //Si le canapé est présent dans le localStorage mais pas la couleur, on ajoute un enregistrement avec la nouvelle couleur
            }else{
                newOrderValue = {color: colorChoice, quantity: quantityChoice}
                valueLocalStorage.push(newOrderValue)
                newOrderValue = valueLocalStorage
            }

        //Si l'ID du canapé n'est pas trouvé dans le localStorage, on ajoute un nouvel enregistrement
        }else{
            newOrderValue = [
                {color: colorChoice, quantity: quantityChoice}
            ]
        }

        //Les données sont converties en STRING avant d'être enregistrées dans le localStorage
        let OrderValueStringified = JSON.stringify(newOrderValue)
        localStorage.setItem(product._id, OrderValueStringified)

        alert("L'article a été ajouté dans le panier")

    //Si le formulaire n'est pas valide
    }else{
        alert("La couleur et/ou le nombre d'articles n'ont pas été renseignés")
    }
}