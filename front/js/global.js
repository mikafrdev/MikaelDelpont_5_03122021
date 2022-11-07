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