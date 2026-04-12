import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(),'data', 'data.json');


export async function GET() {
    if (!fs.existsSync(filePath)) {
			fs.writeFileSync(filePath, JSON.stringify({}))
		}
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  data.urlListe = data.urlListe || {}
  return Response.json(data);
}


export async function POST(req) {
  const newItem = await req.json();
    if (!fs.existsSync(filePath)) {
                fs.writeFileSync(filePath, JSON.stringify({}))
            }
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  data.urlListe = data.urlListe || {}
  data.urlListe[newItem.nom]=newItem.url;

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  return Response.json({ success: true });
}