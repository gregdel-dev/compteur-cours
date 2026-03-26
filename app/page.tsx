// app/page.tsx
'use client';

import { useEffect, useState } from 'react';

import { calculerHeuresTotales } from '@/lib/calculs';
import  { Heures } from "../lib/types"
import { addUrl, getUrlListe } from '@/lib/fonctions';

export default function Home() {
  const [url, setUrl] = useState('');
  const [urlListe, setUrlListe] = useState({})
  const [deadline, setDeadline] = useState("2026-06-06");
  const [heures, setHeures] = useState<Heures | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSelecting, setIsSelecting] = useState(true)
  const [isAdding, setIsAdding]=useState(false)
  const [nom, setNom]=useState("")
  const params = new URLSearchParams(window.location.search);
  const nomArg = params.get("nom")
  const deadlineArg = params.get("deadline")
  const urlBase = window.location.origin
  const [urlPerso, setUrlPerso]= useState('')


  useEffect(() => {
    if (nomArg) {setLoading(true); setIsSelecting(false)}
    
    const initiate = async () => {
      
      if(deadlineArg) setDeadline(deadlineArg)
      if (nomArg) setNom(nomArg) 
      await fetchUrlListe()
      if (nomArg) await handleCalculate();
      setUrlPerso(`${urlBase}?nom=${nom}&deadline=${deadline}`)
    };
    initiate();
  }, [nomArg, nom, url])
  const fetchUrlListe = async () => {
    const urls= await getUrlListe();
    const urlSearch = (nom ? urls[nom] : undefined) || " "
    if (urlSearch) await setUrl(urlSearch)
    setUrlListe(urls)
  }
  const formSubmit= async (data : FormData)=>{
    if (data.get("nom") && data.get("url")) await addUrl(data.get("nom") as string, data.get("url") as string)
    else return
    await fetchUrlListe()
    setIsAdding(false)
    setIsSelecting(true)
  }
  const handleCalculate = async () => {
    if (!url) return

  
    setIsSelecting(false)
    setLoading(true);
    setError('');
    setHeures(null);

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Impossible de récupérer le fichier ICS. Vérifiez l\'URL ou les restrictions CORS.');
      
      const icsText = await response.text();
      
      // Étape 2 : Calculer
      const deadlineDate = new Date(deadline);
      console.log("test", deadline, deadlineDate)
      const result = calculerHeuresTotales(icsText, deadlineDate);
      

      setHeures(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
      
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Compteur d'heures de cours
        </h1>
        <p></p>
        <div className="space-y-4">
          
        {isSelecting && (
          <div className='space-y-3'>
            <div>
            <p>Emploi du temps</p>
            <select name="url" onChange={(e) =>{setUrl( e.target.value ); setNom(e.target.options[e.target.selectedIndex].textContent)}} className="bg-gray-200 p-2 rounded-lg shadow w-full max-w-md">
              <option value="">Selectionnez un emploi du temps</option>
              {Object.entries(urlListe).map(([nom, url]) => (
                <option value={String(url)}>{nom}</option>
              ))}
              <option value="" onClick={()=> {setIsAdding(true); setIsSelecting(false)}}>+ Ajouter un emploi du temps</option>
              
            </select>
            </div>
              <div>
            <p>Date de fin</p>
            <input
              type="date"
              defaultValue={new Date(deadline).toISOString().split("T")[0]}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setDeadline(e.target.value)}
              className="bg-gray-200 p-2 rounded-lg shadow w-full max-w-md"
            />
            </div>
            
            <button className='bg-blue-500 px-2 rounded-lg shadow text-white' onClick={async ()=>{handleCalculate()}}>Calculer </button>
          </div>

        )}
        {isAdding && (
          <form action={formSubmit} className='space-y-3'>
            <div>
              <label htmlFor="nom">Nom</label>
              <input type="text" name="nom" id="nom" required className='bg-gray-200 p-2 rounded-lg shadow w-full max-w-md' />
            </div>
            <div>
              <label htmlFor="url">Url d'emploi du temps</label>
              <input type="text" name="url" id="url" required className='bg-gray-200 p-2 rounded-lg shadow w-full max-w-md' />
              <a href="/aide" className='text-sm text-blue-600 underline hover:text-blue-400' target="_blank" rel="noopener noreferrer">Où trouver mon url d'emploi du temps ?</a>
            </div>
            <button className='bg-blue-500 px-2 rounded-lg shadow text-white' type='submit'>Enregistrer</button>
          </form>
        )}

          

          {error && (
            <p className="text-red-500 text-sm mt-4 text-center">{error}</p>
          )}
          {loading && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded text-center">
              <p className="text-gray-600">Chargement ...</p>
            </div>
            
          )}
          {heures !== null && (
            <div>
            <button className='bg-blue-500 px-2 rounded-lg shadow text-white mx-16'onClick={()=> {setHeures(null) ; setIsSelecting(true)}}>Choisir un autre emploi du temps</button>
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded text-center">
              <p className="text-gray-600">Heures restantes avant le {deadline} :</p>
              <p className="text-4 font-bold text-green-700">Total : {heures?.total} h</p>
              <p className="text-4 font-bold text-green-700">Total de cours annulés : {heures?.totalAnnule} h</p>
              <p className="text-4 font-bold text-green-700">Total de jours : {heures?.totalJours}</p>
              <p className="text-4 font-bold text-green-700">Total de semaines : {heures?.totalSemaines}</p>
              <p className="text-4 font-bold text-green-700">Total de congés : {heures?.totalConges}</p>
              <br />
              {Array.from(heures.cours.entries()).map(([nom,nb])=>(
                <p className="text-4 font-bold text-green-700">
                  {nom} : {nb} h
                </p>
              ))}
              
            </div>
            <p>Lien personnalisée <a href={urlPerso} className='text-sm text-blue-600 underline hover:text-blue-400'>{urlPerso}</a></p>
            </div>

          )}

        </div>
      </div>
      
     
    </main>
  );
}