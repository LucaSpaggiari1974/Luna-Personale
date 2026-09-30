# Luna backend

Backend separato per Luna. L'app iPhone deve chiamare questo servizio e non contenere chiavi segrete.

Endpoint previsto: POST /v1/chat/completions
Formato compatibile OpenAI. Il backend inoltra la richiesta al modello configurato tramite variabili d'ambiente.

Variabili: MODEL_API_BASE_URL, MODEL_API_KEY, MODEL_NAME.

Non inserire mai MODEL_API_KEY nel repository pubblico.
