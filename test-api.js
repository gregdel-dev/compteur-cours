// test-api.js
async function testPost() {
  const data = {
    id_emplacement: 2,
    code_barre : "3024360123459",
    date_peremption : "2026-123",
    quantite : 15
  };

  try {
    const response = await fetch('http://localhost:3000/api/data_gestion/get/recherche?chaine=ca', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', "x-api-key":"Y+gI#lSP8N&faclf+O?h6geGu@-3truxi0uvunUsTihajud" },
      //body: JSON.stringify(data)
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Succès:', result);
    } else {
      console.error('❌ Erreur API:', response.status, result);
    }
  } catch (error) {
    console.error('❌ Erreur de connexion:', error);
  }
}

testPost();