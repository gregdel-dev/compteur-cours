//const db = require('@/lib/db')
import db from '@/lib/db'
import {checkApiKey, forbidenReponse} from '@/lib/Gestion/auth'

export async function GET(req) {
    if (!checkApiKey(req)) return forbidenReponse()

  const emplacements = db.prepare('SELECT * FROM Emplacements').all();
  const data = emplacements.reduce((element, emplacement) => {
      const stock=db.prepare(`
        SELECT id, id_emplacement, date_peremption, quantite, Stock.code_barre, Produits.nom, Produits.marque, Produits.poids, Produits.url_image 
        FROM Stock 
        JOIN Produits ON Stock.code_barre = Produits.code_barre
        WHERE id_emplacement= ?`).all(emplacement.id)
      const stockIndexe = stock.reduce((element, ligne) => {
      element[ligne.id] = ligne;
      return element;
    }, {});
      element[emplacement.id] = {"id": emplacement.id , "nom" : emplacement.nom, "produits" : stockIndexe}
      return element;
    }, {});
  return Response.json(data);
}