-- Script SQL per aggiornare il ruolo dell'utente
-- Sostituisci 'tuo-email@example.com' con il tuo vero indirizzo email
-- E sostituisci 'ADMIN' con 'SELLER' se preferisci essere un venditore

UPDATE User 
SET role = 'ADMIN' 
WHERE email = 'tuo-email@example.com';

-- Verifica che l'aggiornamento sia avvenuto
SELECT id, name, email, role FROM User WHERE email = 'tuo-email@example.com';