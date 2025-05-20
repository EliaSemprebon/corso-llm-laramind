**Categoria: Problemi Elettrici**

---

**Problema:** Il dispositivo non si accende nonostante sia collegato all'alimentazione.

**Soluzione:** Questo tipo di guasto può essere dovuto a un'alimentazione insufficiente, un cavo difettoso o un corto circuito interno. Verificare innanzitutto il corretto funzionamento dell’adattatore e del cavo di alimentazione usando un multimetro per misurare la tensione in uscita. Assicurarsi che la presa a cui è collegato il dispositivo sia funzionante. Se il problema persiste, smontare il dispositivo (se previsto dal produttore) e controllare la presenza di eventuali segni di bruciature o componenti danneggiati. In presenza di fusibili interni, verificarne lo stato e sostituirli se interrotti. Infine, testare la continuità del circuito di alimentazione sulla scheda madre con un tester.

---

**Problema:** Il dispositivo si spegne improvvisamente durante l'utilizzo.

**Soluzione:** Questo sintomo potrebbe indicare un surriscaldamento o un assorbimento di corrente superiore al previsto. Controllare se il dispositivo presenta segni di temperatura anomala. Verificare il corretto funzionamento del sistema di raffreddamento, se presente (ventole, dissipatori). Usare un amperometro per misurare l'assorbimento di corrente sotto carico: valori troppo alti potrebbero indicare un corto su uno dei componenti interni. Pulire le griglie di ventilazione e assicurarsi che l'alimentatore sia dimensionato correttamente.

---

**Problema:** L'indicatore LED di stato lampeggia in modo anomalo o non si accende.

**Soluzione:** Un LED che non si accende o lampeggia in modo errato può essere sintomo di problemi nella linea di alimentazione o nel circuito di segnalazione. Verificare che il LED non sia guasto usando un multimetro in modalità diodo. Se funziona, controllare i segnali di controllo che arrivano al LED dal microcontrollore o dal regolatore. Misurare le tensioni di riferimento nei punti previsti dal circuito. In caso di anomalia, ispezionare i regolatori di tensione o i transistor pilota.

---

**Problema:** Si avverte una scossa elettrica toccando il dispositivo in metallo.

**Soluzione:** Questo è un problema grave legato a una dispersione di corrente. Il primo passo è scollegare immediatamente il dispositivo dalla rete elettrica. Misurare la resistenza tra la carcassa metallica e il terminale di terra dell'alimentazione: dovrebbe essere nulla o molto bassa. Se non è presente collegamento a terra, modificarne l’installazione. Verificare anche la presenza di tensioni residue sul telaio metallico. Aprire il dispositivo per cercare punti in cui fili o componenti scoperti potrebbero toccare la carcassa. Applicare isolamento ove necessario e ripristinare le connessioni di messa a terra.

---

**Problema:** Il dispositivo emette odore di bruciato durante il funzionamento.

**Soluzione:** Un odore di bruciato è indicativo di un possibile surriscaldamento critico o cortocircuito interno. Spegnere immediatamente il dispositivo e scollegarlo dalla rete. Aprire l’involucro protettivo e ispezionare visivamente i componenti: condensatori gonfi, resistori anneriti o tracce danneggiate sono segnali inequivocabili. Usare una lente di ingrandimento per rilevare eventuali microfratture sui chip o nelle saldature. Se possibile, testare i singoli componenti con strumenti di misura adeguati (es. ESR per condensatori). Sostituire ogni parte danneggiata e testare nuovamente prima della rimessa in funzione.

---

**Problema:** Il caricamento della batteria è molto lento o non avviene.

**Soluzione:** Le cause più comuni sono un circuito di ricarica danneggiato, una batteria usurata o un cavo inadatto. Utilizzare un alimentatore certificato e testare con cavi differenti. Accedere ai parametri di diagnostica del dispositivo per leggere i valori di corrente e tensione durante la carica. Confrontare con le specifiche della batteria. Se le letture sono anomale, il circuito di regolazione potrebbe essere guasto: controllare eventuali MOSFET, IC di ricarica o diodi di protezione. In caso di batteria usurata, verificarne la capacità residua e considerare la sostituzione.

---

**Problema:** Il dispositivo vibra o emette rumori anomali.

**Soluzione:** Vibrazioni o rumori elettrici possono indicare componenti in risonanza, spesso bobine o trasformatori. Aprire il dispositivo e individuare la sorgente del rumore. Se proviene da un induttore, assicurarsi che sia ben saldato e non allentato. Applicare eventualmente una vernice isolante per evitare risonanze. Se il rumore è udibile anche senza carico, il problema potrebbe essere nel circuito PWM di alimentazione: verificare la frequenza e sostituire il regolatore se necessario.

---

**Problema:** Si verificano scariche elettriche all'accensione (spark o scintille).

**Soluzione:** Questo può essere causato da un assorbimento improvviso all'accensione o da condensatori di ingresso guasti. Controllare il circuito di filtro EMI e il gruppo d’ingresso AC. Misurare il tempo di carica dei condensatori all’accensione: se la corrente iniziale è troppo elevata, potrebbe essere necessario inserire una resistenza NTC per limitare l’inrush current. Verificare inoltre lo stato dei condensatori di filtro: se gonfi o scoloriti, devono essere sostituiti.

---

**Problema:** Il display rimane spento ma il dispositivo sembra funzionare.

**Soluzione:** Se le funzioni base sono operative ma il display è nero, il problema può essere nel circuito di retroilluminazione o nell’alimentazione del pannello. Verificare la presenza di tensione nei pin della retroilluminazione con un multimetro. Se manca, controllare i fusibili in serie e il regolatore dedicato. Testare anche il segnale di accensione del display inviato dal processore principale. In caso di display OLED, verificare che non ci siano pixel bruciati o linea dati interrotta.

---

**Problema:** Il dispositivo presenta interferenze quando collegato ad altri apparati elettronici.

**Soluzione:** Le interferenze possono derivare da scarsa schermatura o disturbi EMI non soppressi. Controllare che il dispositivo sia dotato di gabbia di Faraday o materiali conduttivi attorno ai punti critici. Misurare il rumore emesso con uno spettro EMI (se disponibile) o osservare l’effetto su apparati vicini (es. radio, altoparlanti). Applicare filtri di rete, ferriti su cavi e assicurarsi che la messa a terra sia corretta. Valutare l'aggiunta di condensatori di disaccoppiamento vicino agli integrati più rumorosi.
