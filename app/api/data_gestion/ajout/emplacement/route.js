import db from '@/lib/db'
import {checkApiKey, forbidenReponse} from '@/lib/Gestion/auth'

export async function POST(req) {
    if (!checkApiKey(req)) return forbidenReponse()
  const newItem = await req.json();
    db.prepare('INSERT INTO Emplacements (nom) VALUES (?)').run(newItem.nom)
  return Response.json({ success: true });

}