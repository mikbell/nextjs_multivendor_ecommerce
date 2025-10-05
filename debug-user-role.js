// Script per verificare il ruolo dell'utente attualmente loggato
// Puoi eseguire questo nella console del browser nella pagina di login/dashboard

console.log('Verifica ruolo utente...');

// Se stai usando Clerk, puoi accedere alle informazioni utente così:
if (window.Clerk) {
    window.Clerk.user?.then(user => {
        console.log('User ID:', user?.id);
        console.log('Email:', user?.primaryEmailAddress?.emailAddress);
        console.log('Private Metadata:', user?.privateMetadata);
        console.log('Public Metadata:', user?.publicMetadata);
        console.log('Unsafe Metadata:', user?.unsafeMetadata);
    });
} else {
    console.log('Clerk non trovato. Controlla se sei nella pagina giusta.');
}