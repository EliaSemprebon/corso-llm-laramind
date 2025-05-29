**Categoria: Problemi di Calibrazione**

---

**Problema:** I sensori restituiscono valori incoerenti rispetto agli standard attesi.

**Soluzione:** Verificare che i sensori siano installati correttamente e non soggetti a interferenze ambientali (es. vibrazioni, temperature estreme). Accedere al pannello diagnostico del dispositivo per confrontare i valori grezzi con quelli elaborati. Eseguire una calibrazione manuale seguendo la procedura indicata nel manuale tecnico, assicurandosi di utilizzare riferimenti certificati (es. strumenti di misura esterni). Se i valori rimangono errati, reinstallare il firmware del modulo sensori e ripetere il processo.

---

**Problema:** Dopo la calibrazione, il dispositivo mostra uno scostamento costante nei valori letti.

**Soluzione:** Questo può essere dovuto a un errore di offset non correttamente registrato. Verificare i file di configurazione o i parametri di calibrazione salvati nella memoria del dispositivo. Reimpostare il valore di offset a zero e ripetere la calibrazione da un ambiente neutro e stabile. In caso di scostamento persistente, confrontare i dati con un secondo dispositivo calibrato e correggere manualmente i coefficienti di taratura.

---

**Problema:** La procedura automatica di calibrazione fallisce.

**Soluzione:** Le procedure automatiche possono fallire se i parametri ambientali non rientrano nei limiti previsti. Assicurarsi che il dispositivo si trovi in condizioni ideali di temperatura, umidità e orientamento. Controllare che il firmware supporti la calibrazione automatica e non sia corrotto. Riavviare il dispositivo e riprovare. Se fallisce nuovamente, utilizzare la modalità manuale o assistita, verificando passo per passo l’output del sistema.

---

**Problema:** La calibrazione viene eseguita correttamente ma non viene salvata.

**Soluzione:** Accertarsi che la memoria del dispositivo non sia piena o protetta in scrittura. Consultare i log per messaggi relativi alla scrittura fallita. Alcuni dispositivi richiedono un comando esplicito per salvare i parametri (es. "Save and Apply"). Se disponibile, eseguire un test di scrittura sulla memoria EEPROM o NVRAM. In caso di errore persistente, aggiornare il firmware di gestione o sostituire il modulo di memoria.

---

**Problema:** Dopo un riavvio, i valori calibrati tornano ai valori di default.

**Soluzione:** Questo indica che i dati di calibrazione non vengono memorizzati correttamente. Verificare che la sequenza di salvataggio della calibrazione sia completata correttamente prima del riavvio. Alcuni dispositivi richiedono un riavvio software controllato per completare il commit dei dati. Controllare che non siano presenti errori nei file di configurazione. Se il dispositivo usa un file system embedded, verificare che non sia corrotto o montato in sola lettura.

---

**Problema:** Il dispositivo richiede una calibrazione troppo frequentemente.

**Soluzione:** Calibrazioni troppo frequenti possono essere sintomo di instabilità hardware o di impostazioni di sensibilità troppo elevate. Verificare lo stato fisico del sensore e la qualità dell'alimentazione elettrica. Accedere alle impostazioni avanzate per modificare la soglia di deriva accettabile. Controllare che non vi siano aggiornamenti firmware che modificano il comportamento del ciclo di calibrazione. In alcuni casi, è necessario sostituire i sensori se soggetti a usura.

---

**Problema:** Il dispositivo segnala errore di calibrazione per un solo asse o parametro.

**Soluzione:** Identificare quale parametro o asse (es. X, Y, Z) fallisce. Verificare che il sensore corrispondente sia attivo e correttamente alimentato. Controllare la linearità della risposta su quell’asse con test incrementali. In caso di sensore triassiale, ruotare il dispositivo in tutte le direzioni e confrontare la risposta. Se l’errore è ripetibile solo su un asse, considerare la sostituzione del componente.

---

**Problema:** I valori calibrati mostrano una deriva nel tempo.

**Soluzione:** La deriva può derivare da variazioni ambientali, problemi termici o instabilità elettronica. Analizzare il comportamento del dispositivo in ambienti differenti e con temperature controllate. Monitorare i dati nel tempo per identificare una curva di deriva. Se il firmware lo consente, attivare una calibrazione automatica periodica. In alternativa, introdurre un sistema di compensazione software basato su condizioni ambientali.

---

**Problema:** Il dispositivo non consente di avviare la calibrazione.

**Soluzione:** Verificare che l'utente abbia i permessi adeguati (alcune calibrazioni richiedono privilegi da amministratore). Controllare che non ci siano task attivi in background che bloccano il modulo sensori. Aggiornare l'interfaccia utente o il software di configurazione. Se la voce di menu è disattivata, consultare la documentazione tecnica: alcuni modelli consentono la calibrazione solo in condizioni particolari (ad esempio, temperatura stabile o orientamento specifico).

---

**Problema:** Dopo la calibrazione, il dispositivo mostra dati fluttuanti o instabili.

**Soluzione:** Fluttuazioni e instabilità dopo la calibrazione indicano un possibile problema di rumore o filtraggio. Verificare se sono attivi algoritmi di filtro digitale (es. media mobile, Kalman). Aumentare eventualmente la finestra di filtraggio. Controllare il cablaggio dei sensori per eventuali disturbi o connessioni deboli. Se si tratta di sensori ambientali, isolare il dispositivo da fonti di interferenza come ventilatori, riscaldatori o luce diretta. Se il problema non si risolve, sostituire il modulo sensore.
