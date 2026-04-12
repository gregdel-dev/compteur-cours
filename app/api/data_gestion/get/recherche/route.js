//const db = require('@/lib/db')
import db from '@/lib/db'
import {checkApiKey, forbidenReponse} from '@/lib/Gestion/auth'

export async function GET(req) {
    if (!checkApiKey(req)) return forbidenReponse()
    const { searchParams } = new URL(req.url);
    const chaine = searchParams.get("chaine")
    console.log(chaine)
  const data = db.prepare(`
        SELECT id, id_emplacement, date_peremption, quantite, Stock.code_barre, Produits.nom, Produits.marque, Produits.poids, Produits.url_image 
        FROM Stock 
        JOIN Produits ON Stock.code_barre = Produits.code_barre
        WHERE nom LIKE ? or marque LIKE ?`).all(`%${chaine}%`, `%${chaine}%`);
  const produitsIndexes = data.reduce((element, ligne) => {
      element[ligne.id] = ligne;
      return element;
    }, {});
  return Response.json(produitsIndexes);
}