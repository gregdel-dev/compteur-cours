const Database=require('better-sqlite3')
const path= require('path')

const dbPath=path.join(process.cwd(), 'data', 'stock.sqlite')
console.log(dbPath)

const db= new Database(dbPath)
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');


function initDb (){
    const createTableEmplacements = `
    CREATE TABLE IF NOT EXISTS Emplacements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nom TEXT NOT NULL 
    ) ; `
    const createTableProduits=
    `CREATE TABLE IF NOT EXISTS Produits (
        code_barre TEXT PRIMARY KEY,
        nom TEXT NOT NULL,
        marque TEXT NOT NULL,
        poids INTEGER NOT NULL,
        url_image TEXT NOT NULL
    )`

    const createTableStock=
    `CREATE TABLE IF NOT EXISTS Stock (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_emplacement Integer NOT NULL,
        code_barre Text NOT NULL, 
        date_peremption Date NOT NULL, 
        quantite Integer NOT NULL, 

        FOREIGN KEY (id_emplacement) REFERENCES Emplacements(id) ON DELETE SET NULL,
        FOREIGN KEY (code_barre) REFERENCES Produits(code_barre) ON DELETE SET NULL
    )
    `
    const createIndexCodeBarre = `
        CREATE INDEX IF NOT EXISTS idx_code_barre ON Produits(code_barre)`

    try {
        db.prepare(createTableEmplacements).run()
        db.prepare(createTableProduits).run()
        db.prepare(createTableStock).run()
        db.prepare(createIndexCodeBarre).run();
    }catch (error) {
        console.error('❌ Erreur lors de l\'initialisation de la DB:', error.message);
        throw error;
    }
}
initDb()
module.exports = db;