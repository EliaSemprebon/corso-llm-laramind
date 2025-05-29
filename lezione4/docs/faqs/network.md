**Categoria: Problemi Rete e Comunicazione**

---

**Problema:** Il dispositivo non si connette alla rete Wi-Fi.

**Soluzione:** Verificare se la rete Wi-Fi è visibile da altri dispositivi. Accedere al pannello di controllo del dispositivo e controllare lo stato della scheda di rete. Se il modulo Wi-Fi risulta disabilitato, attivarlo. Controllare che il dispositivo non sia troppo lontano dal router e che non ci siano interferenze elettromagnetiche (es. microonde, telefoni cordless). Se il problema persiste, reimpostare le impostazioni di rete del dispositivo e reinserire le credenziali della rete Wi-Fi. Aggiornare i driver del modulo Wi-Fi, se disponibile. Come ultima risorsa, eseguire un reset completo del dispositivo.

---

**Problema:** Il dispositivo si disconnette spesso dalla rete Wi-Fi.

**Soluzione:** Le disconnessioni frequenti possono essere dovute a interferenze, configurazioni errate o firmware non aggiornato. Posizionare il dispositivo vicino al router e assicurarsi che sia connesso a una rete stabile. Impostare un canale Wi-Fi fisso sul router per evitare salti di frequenza. Verificare se il dispositivo è configurato per risparmio energetico: disattivare le impostazioni di autospegnimento del Wi-Fi. Aggiornare il firmware del dispositivo e del router. Se disponibile, forzare una connessione a 2.4 GHz per migliorare la portata.

---

**Problema:** Il dispositivo non riceve dati dal server centrale.

**Soluzione:** Verificare se il dispositivo ha accesso a Internet eseguendo un test di ping dal suo pannello di controllo. Controllare la configurazione DNS e gateway. Se i dati non vengono ricevuti, accertarsi che le porte richieste dal server siano aperte sulla rete locale. Controllare l’indirizzo IP del server nelle impostazioni del dispositivo: eventuali errori o cambiamenti nell’IP possono bloccare la comunicazione. Infine, analizzare i log di rete per eventuali timeout o pacchetti scartati.

---

**Problema:** Il dispositivo non è visibile nella rete locale.

**Soluzione:** Questo può indicare problemi con l'indirizzo IP o il servizio di discovery. Assicurarsi che il dispositivo sia impostato con un IP statico corretto o che il DHCP sia attivo e funzionante. Verificare la presenza del dispositivo nella tabella DHCP del router. Controllare che non ci siano conflitti IP con altri dispositivi. Utilizzare un tool di scansione di rete per cercare l’indirizzo MAC. Se il discovery automatico non funziona, impostare manualmente l’indirizzo IP.

---

**Problema:** La comunicazione tramite Bluetooth non funziona.

**Soluzione:** Verificare che il Bluetooth sia abilitato sul dispositivo e che sia visibile. Assicurarsi che il dispositivo da collegare non sia già accoppiato con un altro terminale. Disaccoppiare e riaccoppiare i dispositivi manualmente. Verificare la versione del Bluetooth: alcuni dispositivi richiedono una versione minima per il pairing. Se il problema continua, cancellare la cache Bluetooth e riavviare entrambi i dispositivi. Aggiornare il firmware del modulo Bluetooth, se supportato.

---

**Problema:** Ritardi nella comunicazione dati via Ethernet.

**Soluzione:** Analizzare il cablaggio fisico: un cavo danneggiato o non schermato può introdurre latenza. Utilizzare cavi Cat5e o superiori. Verificare che non vi siano loop di rete non gestiti, che causano congestione. Accedere al pannello di rete del dispositivo e controllare le statistiche di trasmissione (errori, collisioni, pacchetti persi). Se il dispositivo è collegato tramite switch, assicurarsi che supporti le specifiche richieste (es. full-duplex). In caso di problemi persistenti, utilizzare uno sniffer di pacchetti per identificare il punto critico nella rete.

---

**Problema:** Il dispositivo riceve dati incompleti o corrotti.

**Soluzione:** Questo tipo di problema può derivare da interferenze, bassa qualità del segnale o buffer sovraccarichi. Verificare la stabilità del collegamento (Wi-Fi o Ethernet). Controllare l’integrità dei pacchetti con strumenti di diagnostica del dispositivo. Abilitare, se presente, la correzione automatica degli errori (FEC). Se si utilizzano protocolli UDP, considerare il passaggio a TCP per maggiore affidabilità. Monitorare la temperatura di esercizio del modulo di rete, poiché il surriscaldamento può causare errori nei dati trasmessi.

---

**Problema:** Il dispositivo non riesce a sincronizzarsi con il server NTP.

**Soluzione:** Controllare se il server NTP configurato è raggiungibile tramite rete. Utilizzare un comando ping o traceroute dal pannello amministrativo. Verificare che l’ora del sistema non sia eccessivamente sfasata rispetto all'NTP (alcuni server rifiutano grandi differenze). Controllare che la porta UDP 123 sia aperta nel firewall. Se il server NTP è interno all’azienda, assicurarsi che sia correttamente configurato e in funzione. Come misura temporanea, sincronizzare manualmente l’orologio e riprovare dopo qualche minuto.

---

**Problema:** Il dispositivo non invia notifiche push o e-mail.

**Soluzione:** Le notifiche richiedono connettività stabile e corretta configurazione SMTP o API di push. Verificare che il dispositivo sia connesso a Internet e che i parametri del server SMTP siano corretti. Controllare le credenziali, le porte e i protocolli (SSL/TLS). Se si utilizza un servizio cloud, assicurarsi che le chiavi API siano valide. Consultare i log per eventuali errori di autenticazione o timeout. Se si usano filtri antispam, verificare che le notifiche non vengano bloccate in uscita o da servizi di protezione della rete.

---

**Problema:** Il dispositivo non stabilisce connessioni MQTT con il broker.

**Soluzione:** Controllare se l’indirizzo del broker MQTT configurato è corretto. Verificare la presenza del broker in rete e che stia ascoltando sulla porta configurata (generalmente 1883 o 8883 per SSL). Se è richiesta autenticazione, assicurarsi che utente e password siano corretti. Esaminare i log del broker e del dispositivo per messaggi di connessione rifiutata. Se si utilizza TLS, controllare i certificati e l’ora di sistema (un orologio errato può invalidare il certificato). Provare a connettersi da un client MQTT esterno per verificare il funzionamento del broker.
