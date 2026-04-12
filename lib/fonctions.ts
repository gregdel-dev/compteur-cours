/**
 * Calcule le numéro de la semaine ISO (1-53) pour une date donnée.
 * La semaine 1 est celle contenant le premier jeudi de l'année.
 * La semaine commence le lundi.
 */

import ICAL from 'ical.js';



export function getWeekNumber(date: Date): number {
    // Créer une copie en UTC pour éviter les problèmes de fuseau horaire
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    
    // Décaler la date au jeudi le plus proche de cette semaine
    // getUTCDay() : 0 (Dim) -> 7, 1 (Lun) -> 1, ..., 6 (Sam) -> 6
    const dayNum = d.getUTCDay() || 7; 
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    
    // Premier jour de l'année (1er Janvier)
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    
    // Calculer le nombre de jours écoulés depuis le début de l'année jusqu'au jeudi de la semaine cible
    const diffTime = d.getTime() - yearStart.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Nombre de jours
    
    // Diviser par 7 pour avoir le numéro de semaine
    return Math.ceil(diffDays / 7);
}

export function pasUnDoublon(event : ICAL.Event) : boolean{
    if (event.summary=="FORMATION HUMAINE ET CHRETIENN" && !event.description.startsWith("MERY"))
        return false
    if (event.summary == "NUMERIQUE SC.INFORM." && event.description.startsWith("X NSI SNT X."))
        return false


    return true
}



export async function addUrl (nom : string, url : string){
    await fetch('/api/data_compteur', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nom: nom, url : url })
    })
}

export async function getUrlListe() {
    const data = await fetch('/api/data_compteur')
      .then(res => res.json())
 return data.urlListe  
}


