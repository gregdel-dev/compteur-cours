export function checkApiKey(request){
    const apiKey = request.headers.get('x-api-key')
    const expectedKey = process.env.API_SECRET_KEY
    console.log(apiKey, expectedKey)
    if (!apiKey || apiKey!==expectedKey) return false
    return true
}
export function forbidenReponse(){
    return Response.json({ message: 'Accès refusé : Clé API invalide ou manquante.' }, 
      { status: 401 })
}