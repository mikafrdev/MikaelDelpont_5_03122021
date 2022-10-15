//Récupération des données d'un canapé en scannant l'url qui renseigne son ID 
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