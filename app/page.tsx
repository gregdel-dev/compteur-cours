// app/page.tsx
'use client';

import { useEffect, useState } from 'react';

import { calculerHeuresTotales } from '@/lib/calculs';
import { Libertinus_Keyboard } from 'next/font/google';
import  { Heures } from "../lib/types"

export default function Home() {
  const [url, setUrl] = useState('');
  
  const [deadline, setDeadline] = useState("2026-04-1");
  const [heures, setHeures] = useState<Heures | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  useEffect(() => {
    
    const initiate = async () => {
      await setUrl("https://api.ecoledirecte.com/v3/ical/E/4956/5a55393456574a43613056565a6a687865546c4f4d31706a576d73764f4864736458424361474633.ics")
      await handleCalculate();
      //setHours(2);
    };
    initiate();
  }, [])
  const handleCalculate = async () => {
    
  
    
    setLoading(true);
    setError('');
    setHeures(null);

    try {
      // Étape 1 : Récupérer le contenu ICS
      // Si vous avez des erreurs CORS ici, il faudra déplacer ce fetch dans une API Route (app/api/fetch-ics/route.ts)
      const urlMoi= "https://api.ecoledirecte.com/v3/ical/E/4956/5a55393456574a43613056565a6a687865546c4f4d31706a576d73764f4864736458424361474633.ics"
      const response = await fetch(urlMoi);
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
          
            

          

          {error && (
            <p className="text-red-500 text-sm mt-4 text-center">{error}</p>
          )}
          {loading && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded text-center">
              <p className="text-gray-600">Chargement ...</p>
            </div>
            
          )}
          {heures !== null && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded text-center">
              <p className="text-gray-600">Heures restantes avant le {deadline} :</p>
              <p className="text-4 font-bold text-green-700">Total : {heures?.total} h</p>
              <p className="text-4 font-bold text-green-700">Total de cours annulés : {heures?.totalAnnule} h</p>
              <p className="text-4 font-bold text-green-700">Total de jours : {heures?.totalJours} </p>
              <p className="text-4 font-bold text-green-700">Total de semaines : {heures?.totalSemaines}</p>
              <br />
              {Array.from(heures.cours.entries()).map(([nom,nb])=>(
                <p className="text-4 font-bold text-green-700">
                  {nom} : {nb} h
                </p>
              ))}
              
            </div>
          )}

        </div>
      </div>
      
     
    </main>
  );
}