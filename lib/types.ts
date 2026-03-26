export class Heures {
    total: number ;
    totalAnnule: number ;
    totalJours: number;
    totalSemaines : number;
    cours : Map<string, number>;
    totalConges : number;

    constructor() {
        this.total = 0;
        this.totalAnnule = 0;
        this.totalJours=0;
        this.totalSemaines=0;
        this.cours=new Map();
        this.totalConges = 0;
    }
}