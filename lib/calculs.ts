import ICAL from 'ical.js';
//import { useState } from 'react';
import  { Heures } from "./types"
import { getWeekNumber, pasUnDoublon } from './fonctions';


export function calculerHeuresTotales(icsText: string, deadline : Date){
    const jcalData = ICAL.parse(icsText);
    const comp = new ICAL.Component(jcalData);
    const vevents = comp.getAllSubcomponents('vevent');
    const heures= new Heures()

    const days=[new Date().toDateString()]
    const weeks= [0]
    vevents.forEach((vevent)=>{
        const event = new ICAL.Event(vevent);

        //if (event.startDate.toJSDate().getDate()===new Date("2026-03-31").getDate()) console.log(event.summary,event.startDate.toJSDate(), event.startDate.toJSDate().toDateString())

        if (pasUnDoublon(event)) {
            const startDate=event.startDate.toJSDate()
            //console.log(event.description)
            
            if (startDate< deadline && startDate> new Date()){
                
                if (!days.includes(event.startDate.toJSDate().toDateString())) {
                    heures.totalJours +=1
                    days.push(event.startDate.toJSDate().toDateString())
                    
                    if(!weeks.includes(getWeekNumber(event.startDate.toJSDate())) && event.summary!==" ") {
                        heures.totalSemaines+=1
                        weeks.push(getWeekNumber(event.startDate.toJSDate()))
                        console.log(getWeekNumber(event.startDate.toJSDate()), startDate, deadline, new Date())
                    }

                }
                const duree = Math.round((event.endDate.toJSDate().getTime() - event.startDate.toJSDate().getTime()) / (1000 * 60 * 60))
                if (event.summary===" ") heures.totalConges+=1
                else if (event.summary.startsWith("ANNULE")) heures.totalAnnule+=duree
                else {
                    heures.total += duree
                    heures.cours.set(event.summary,(heures.cours.get(event.summary) || 0)+duree)
                    
                }

            }
        }

    })

    heures.total=Math.trunc(heures.total)
    heures.totalAnnule=Math.trunc(heures.totalAnnule)
    return  heures
}
