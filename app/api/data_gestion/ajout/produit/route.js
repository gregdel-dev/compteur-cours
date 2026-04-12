import db from '@/lib/db'
import {checkApiKey, forbidenReponse} from '@/lib/Gestion/auth'

export async function POST(req) {
    if (!checkApiKey(req)) return forbidenReponse()
  const newItem = await req.json();
    db.prepare('INSERT INTO Produits (code_barre, nom, marque, poids, url_image) VALUES(?,?,?,?,?)').run(newItem.code_barre, newItem.nom, newItem.marque, newItem.poids, newItem.url_image)
  return Response.json({ success: true });

}