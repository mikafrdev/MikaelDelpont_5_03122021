const getIdFromUrl = () => {
    const queryString = window.location.search
    const searchID = new URLSearchParams(queryString)
    const productID = searchID.get('id')

    return productID
}

//Récupération des données mockées d'un canapé en scannant l'url qui renseigne son ID 
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