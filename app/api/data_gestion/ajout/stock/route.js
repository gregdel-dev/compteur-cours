import db from '@/lib/db'
import {checkApiKey, forbidenReponse} from '@/lib/Gestion/auth'

export async function POST(req) {
    if (!checkApiKey(req)) return forbidenReponse()
  const newItem = await req.json();
    db.prepare('INSERT INTO Stock (id_emplacement, code_barre, date_peremption, quantite) VALUES(?,?,?,?)').run(newItem.id_emplacement, newItem.code_barre, newItem.date_peremption, newItem.quantite)
  return Response.json({ success: true });

}