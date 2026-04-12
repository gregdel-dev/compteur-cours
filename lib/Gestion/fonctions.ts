import db from '@/lib/db'
import fs from 'fs';
import path from 'path';

/*
const dataPath = path.join(process.cwd(), 'data.json');
if (!fs.existsSync(dataPath)) {
            fs.writeFileSync(dataPath, JSON.stringify({}))
        }

async function save(data: Promise<any>) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}
*/



export async function get() {
    
  const data =db.prepare("")
  return data;
}


export async function ajout_emplacement() {
  db.prepare("")

  return Response.json({ success: true });
}