//const db = require('@/lib/db')
import db from '@/lib/db'
import {checkApiKey, forbidenReponse} from '@/lib/Gestion/auth'

export async function GET(req) {
    if (!checkApiKey(req)) return forbidenReponse()

  const data = db.prepare('SELECT * FROM Produits').all();
  const produitsIndexes = data.reduce((element, produit) => {
      element[produit.code_barre] = produit;
      return element;
    }, {});
  return Response.json(produitsIndexes);
}