
# --- Explicações auxiliares para prompts e estrutura narrativa ---
# Conceito: o conceito refere-se à ideia subjacente ou à premissa fundamental que orienta toda a obra. É a ideia central, a visão ou a essência que dá propósito e coesão ao texto, elevando o engajamento intelectual acima das táticas narrativas convencionais.
# Tema: ideia central, tópico principal ou mensagem subjacente que o autor deseja transmitir ao leitor. É o cerne da narrativa, a base sobre a qual todo o conteúdo é desenvolvido, e não deve ser confundido com o enredo ou a trama.
# Logline: uma logline é um resumo extremamente conciso da história principal, geralmente contida em uma ou duas frases, que captura a essência do conflito central e dos personagens envolvidos.
# Protagonista: O herói é o personagem central da narrativa, em torno do qual a trama se desenrola. A história é vivenciada através de seus olhos, e o leitor o acompanha em sua jornada.
#   - Ações Excepcionais: Tradicionalmente, o herói é associado a atos de bravura, coragem e nobreza, enfrentando desafios e adversidades para solucionar situações críticas, muitas vezes baseadas em princípios morais e éticos.
#   - Transformação: Um elemento crucial do herói literário é a sua capacidade de mudar. Ele não termina a história da mesma forma que começou; os eventos da trama o impactam e promovem seu crescimento, seja para melhor ou pior, o que é fundamental para um arco narrativo envolvente.
# Antagonista: No contexto de escrita de livros, são personagens ou forças que se opõem ao protagonista, criando e intensificando os conflitos que movem a história.
#   - Oposição ao Protagonista: A função principal de um antagonista é dificultar o caminho do protagonista para alcançar seus objetivos, sejam eles externos (como encontrar um tesouro) ou internos (como superar um defeito de caráter).
#   - Fonte de Conflito: Eles geram o conflito essencial para o desenvolvimento da trama e o crescimento do personagem principal. Sem um antagonista, a jornada do herói careceria de desafios e a história não avançaria de forma envolvente.
#   - Tipos de antagonistas:
#     * Outro Personagem: O tipo mais comum, como um rival, um inimigo ou até mesmo um amigo com objetivos opostos.
#     * Uma Força ou Energia: Pode ser um sistema opressivo, a sociedade, uma força da natureza, ou uma entidade sobrenatural.
#     * Um Aspecto Interno: O próprio protagonista pode lutar contra seus defeitos de personalidade, medos, indecisão ou vícios, que atuam como forças antagônicas.

import os
import json
import requests
from typing import Any, Dict, List, Optional

from book_dataclasses import Book


class LLMentryPoint:
    def __init__( self, api_key: str, base_url: str = "https://api.openai.com/v1", model: str = "gpt-3.5-turbo" ):
        self.api_key = api_key
        self.base_url = base_url
        self.model = model

    def generate(self, prompt: str, temperature: float  , max_tokens: int   ) -> str:
            url = _build_endpoint(self.base_url, "chat/completions")
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
            }
            payload = {
                "model": self.model,
                "messages": [
                    {"role": "system", "content": _PROMPTS["system_structure"]},
                    {"role": "user", "content": prompt},
                ],
                "temperature": temperature,
                "max_tokens": max_tokens,
            }
            # Ensure all message contents are strings (some servers reject objects)
            for m in payload["messages"]:
                if not isinstance(m.get("content"), str):
                    m["content"] = json.dumps(m.get("content"), ensure_ascii=False)
            resp = requests.post(url, headers=headers, json=payload, timeout=60)
            resp.raise_for_status()
            data = resp.json()
            content = data["choices"][0]["message"]["content"]
            return content
        
    def generate_json(
            self,
            prompts: List[Dict[str, str]],
            temperature: float ,
            max_tokens: int = 1500,
            response_schema: Optional[Dict[str, Any]] = None,
        ) -> Dict[str, Any]:
            """
            Request structured output when `response_schema` is provided (LM Studio style).

            - If `response_schema` is None, falls back to calling `generate` and JSON-parsing the content.
            - If `response_schema` is provided, the request payload will include
              `response_format` set to the supplied schema. The function will attempt
              to parse `choices[0].message.content` as JSON and return the parsed object.
            """
 

            # Build request that asks for structured output
            url = _build_endpoint(self.base_url, "chat/completions")
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
            }
            messages = prompts
        
            payload = {
                "model": self.model,
                "messages": messages,
                "temperature": temperature,
                "max_tokens": max_tokens,
                "response_format": response_schema,
            }

            # Ensure message contents are strings (some servers require string content)
            for m in payload["messages"]:
                if not isinstance(m.get("content"), str):
                    m["content"] = json.dumps(m.get("content"), ensure_ascii=False)

            resp = requests.post(url, headers=headers, json=payload, timeout=60)
            try:
                resp.raise_for_status()
            except requests.exceptions.HTTPError:
                # Attach payload to the exception message to ease debugging of malformed requests
                raise
            data = resp.json()

           
            # Extract the assistant message content
            try:
                content = data["choices"][0]["message"]["content"]
            except Exception:
                # Unexpected response shape: return raw response
                return {"raw_response": data}

            # Try parsing content as JSON
            try:
                return json.loads(content)
            except Exception:
                # Some structured responses may already be JSON objects in the response
                # or the server might return structured data in a different field. Try
                # to walk the response looking for a parsed value.
                # Check for a 'structured' field in the choice (LM Studio variations)
                try:
                    # Some servers attach structured output at choices[0].message.content
                    # but sometimes as choices[0].output_parsed or similar; return best-effort
                    if "response" in data:
                        return data["response"]
                except Exception:
                    pass

                # Fallback: return the raw content string
                return {"content": content}

_PROMPT_PATH = os.path.join(os.path.dirname(__file__), "llm_prompts.json")
def _load_prompts():
    with open(_PROMPT_PATH, "r", encoding="utf-8") as f:
        return json.load(f)
_PROMPTS = _load_prompts()


def choose(msg, items):
    import random
    print( )
    for x in items:
        print( "  - ", x)
    choice = random.choice(items)
    print(f"{msg} : {choice}")
    return  choice

class LLMBookGenerator:
    def __init__(self,  api_key: str, base_url: str = "https://api.openai.com/v1", model: str = "gpt-3.5-turbo" , temperature: float = 0.6, max_tokens: int = 1500 ):
        self.api_key = api_key
        self.base_url = base_url
        self.model = model
        self.entrypoint = LLMentryPoint(api_key=api_key, base_url=base_url, model=model)
        self.prompts = _load_prompts()
        self.temperature = temperature
        self.max_tokens = max_tokens

    def _parse_structured(self, result: Any, key: Optional[str] = None) -> Any:
        """
        Helper to parse structured responses returned by `generate_json`.
        Accepts multiple shapes and returns:
        - If `key` provided and result is dict containing key: return that value
        - If result is dict and contains a single list-like value, return that list
        - If result is string, try JSON-parsing and attempt same extraction
        - Otherwise, return None or an appropriate fallback
        """
        # If result is a dict and contains the key
        if isinstance(result, dict):
            if key and key in result:
                return result[key]

            # find first list value
            for v in result.values():
                if isinstance(v, list):
                    return v

            return None

        # If result is a JSON string, try to parse
        if isinstance(result, str):
            try:
                parsed = json.loads(result)
                return self._parse_structured(parsed, key)
            except Exception:
                return None

        # Unknown shape
        return None

    def generate_conceitos(self, book: Book, extra_summary: Optional[Dict[str, Any]] = None) -> list[str]:
        schema = {
            "type": "json_schema",
            "json_schema": {
                "name": "conceitos",
                "schema": {
                    "type": "object",
                    "properties": {
                        "conceitos": {
                            "type": "array",
                            "items": {"type": "string"},
                            "minItems": 4,
                        }
                    },
                    "required": ["conceitos"],
                },
            },
        }   

        prompt_system = self.prompts.get("system_conceito")
        prompt_user = self.prompts.get("user_conceito")
        prompts = [
            {"role": "system", "content": prompt_system},
            {"role": "user", "content": prompt_user},
        ]

        # Include genre from book (previous step) when available to guide conceito generation
        genero = getattr(book, "genre", None) or getattr(book, "genero", None)
        if genero:
            prompts[-1]["content"] += f" Context: genero: {genero}"

        if extra_summary:
            try:
                ctx = json.dumps(extra_summary, ensure_ascii=False)
            except Exception:
                ctx = str(extra_summary)
            prompts[-1]["content"] += f" More context: {ctx}"

        result = self.entrypoint.generate_json(prompts, response_schema=schema, temperature= self.temperature, max_tokens=self.max_tokens)
        if isinstance(result, dict):
            if "conceitos" in result and isinstance(result["conceitos"], list):
                return [str(x).strip() for x in result["conceitos"] if x]
        # fallback defaults
        return [
            "Um mundo onde os sonhos influenciam a realidade",
            "A busca pela identidade numa sociedade dividida",
            "Amor proibido em tempos de guerra",
            "O preço do progresso tecnológico",
        ]


    def generate_genres(self, extra_summary: Optional[Dict[str, Any]] = None) -> list[str]:
        # Use LM Studio / OpenAI-style structured JSON schema to request a list of genres
        schema = {
            "type": "json_schema",
            "json_schema": {
                "name": "genres",
                "schema": {
                    "type": "object",
                    "properties": {
                        "genres": {
                            "type": "array",
                            "items": {"type": "string"},
                            "minItems": 4,
                        }
                    },
                    "required": ["genres"],
                },
            },
        }
        # prefer configured prompts when available
        prompt_system = self.prompts.get("system_genre", self.prompts.get("system_structure", "You are a helpful AI assistant."))
        prompt_user = self.prompts.get("user_genre", "Generate a short list of distinct book genres suited for a fiction author.")

        prompts = [
            {"role": "system", "content": prompt_system},
            {"role": "user", "content": prompt_user},
        ]
        
        if extra_summary:
            try:
                ctx = json.dumps(extra_summary, ensure_ascii=False)
            except Exception:
                ctx = str(extra_summary)
            prompts[-1]["content"] += f" Context: {ctx}"

        result = self.entrypoint.generate_json(prompts, response_schema=schema, temperature= self.temperature, max_tokens=self.max_tokens)

        # `generate_json` should return a parsed object when response_schema is used.
        # Handle a few possible shapes defensively.
        if isinstance(result, dict):
            # Typical LM Studio shape: {"genres": [..]}
            if "genres" in result and isinstance(result["genres"], list):
                return [str(x).strip() for x in result["genres"] if x]

            # Sometimes structured output is nested under a top-level name
            for v in result.values():
                if isinstance(v, list) and all(isinstance(i, str) for i in v):
                    return [i.strip() for i in v]

            # If parsing produced other fields, try to find first list of strings
            for v in result.values():
                if isinstance(v, list):
                    cleaned = [str(x).strip() for x in v if isinstance(x, (str, int, float))]
                    if cleaned:
                        return cleaned

            return []

        # If result is a string, try JSON parsing fallback
        if isinstance(result, str):
            try:
                parsed = json.loads(result)
                if isinstance(parsed, list):
                    return [str(x).strip() for x in parsed]
                if isinstance(parsed, dict) and "genres" in parsed:
                    return [str(x).strip() for x in parsed["genres"]]
            except Exception:
                pass

        # fallback default genres
        return ["Fantasy", "Science Fiction", "Romance", "Mystery", "Historical", "Horror"]


    def generate_temas(self, book: Book, extra_summary: Optional[Dict[str, Any]] = None) -> list[str]:
        """
        Generate candidate themes ('temas') using structured JSON schema.
        Returns a list of tema strings.
        """
        schema = {
            "type": "json_schema",
            "json_schema": {
                "name": "temas",
                "schema": {
                    "type": "object",
                    "properties": {
                        "temas": {
                            "type": "array",
                            "items": {"type": "string"},
                            "minItems": 8,
                        }
                    },
                    "required": ["temas"],
                },
            },
        }

        prompt_system = self.prompts.get("system_tema", "You are an assistant that generates themes.")
        prompt_user_template = self.prompts.get("user_tema", "Generate themes for the given concept and genre.")

        conceito = getattr(book, "conceito", "")
        genero = getattr(book, "genre", None) or getattr(book, "genero", "")

        # Replace template placeholders if present
        prompt_user = prompt_user_template.replace("{{conceito}}", str(conceito)).replace("{{genero}}", str(genero))

        prompts = [
            {"role": "system", "content": prompt_system},
            {"role": "user", "content": prompt_user},
        ]

        if extra_summary:
            try:
                ctx = json.dumps(extra_summary, ensure_ascii=False)
            except Exception:
                ctx = str(extra_summary)
            prompts[-1]["content"] += f" Context: {ctx}"

        result = self.entrypoint.generate_json(prompts, response_schema=schema, temperature= self.temperature, max_tokens=self.max_tokens)

        # Defensive parsing
        if isinstance(result, dict):
            if "temas" in result and isinstance(result["temas"], list):
                return [str(x).strip() for x in result["temas"] if x]

            for v in result.values():
                if isinstance(v, list) and all(isinstance(i, str) for i in v):
                    return [i.strip() for i in v]

            for v in result.values():
                if isinstance(v, list):
                    cleaned = [str(x).strip() for x in v if isinstance(x, (str, int, float))]
                    if cleaned:
                        return cleaned

            return []

        if isinstance(result, str):
            try:
                parsed = json.loads(result)
                if isinstance(parsed, list):
                    return [str(x).strip() for x in parsed]
                if isinstance(parsed, dict) and "temas" in parsed:
                    return [str(x).strip() for x in parsed["temas"]]
            except Exception:
                pass

        return []


    def generate_tramas(self, book: Book, extra_summary: Optional[Dict[str, Any]] = None) -> list[str]:
        """
        Generate candidate 'tramas' (plot summaries) using structured JSON schema.
        Returns a list of trama strings.
        """
        schema = {
            "type": "json_schema",
            "json_schema": {
                "name": "tramas",
                "schema": {
                    "type": "object",
                    "properties": {
                        "tramas": {
                            "type": "array",
                            "items": {"type": "string"},
                            "minItems": 6,
                        }
                    },
                    "required": ["tramas"],
                },
            },
        }

        # prefer configured prompts when available
        prompt_system = self.prompts.get("system_trama", "Você é um assistente que gera tramas (resumos de trama) de histórias em JSON válido.")
        prompt_user_default = self.prompts.get("user_trama", None)
        # Try to incorporate book context if available (previous variable: conceito)
        conceito = getattr(book, "conceito", None)
        genero = getattr(book, "genre", None) or getattr(book, "genero", None)

        if prompt_user_default:
            # substitute placeholders if present
            prompt_user = (
                prompt_user_default
                .replace("{{conceito}}", str(conceito or ""))
                .replace("{{genero}}", str(genero or ""))
                .replace("{{logline}}", str(getattr(book, "logline", "") or ""))
            )
        else:
            prompt_user = (
                "Gere uma lista JSON com pelo menos 6 tramas originais para um livro de ficção. "
                "Cada item deve ser uma frase curta que descreva a trama principal."
            )
        details = []
        # Primary guidance: conceito (previous step)
        if conceito:
            details.append(f"conceito: {conceito}")
        if genero:
            details.append(f"genero: {genero}")
        if details:
            prompt_user += " Context: " + "; ".join(details)

        prompts = [
            {"role": "system", "content": prompt_system},
            {"role": "user", "content": prompt_user},
        ]

        if extra_summary:
            try:
                ctx = json.dumps(extra_summary, ensure_ascii=False)
            except Exception:
                ctx = str(extra_summary)
            prompts[-1]["content"] += f" More context: {ctx}"

        result = self.entrypoint.generate_json(prompts, response_schema=schema, temperature= self.temperature, max_tokens=self.max_tokens)

        # Parse result defensively (similar to generate_genres)
        if isinstance(result, dict):
            if "tramas" in result and isinstance(result["tramas"], list):
                return [str(x).strip() for x in result["tramas"] if x]

            for v in result.values():
                if isinstance(v, list) and all(isinstance(i, str) for i in v):
                    return [i.strip() for i in v]

            for v in result.values():
                if isinstance(v, list):
                    cleaned = [str(x).strip() for x in v if isinstance(x, (str, int, float))]
                    if cleaned:
                        return cleaned

            # fallback: create simple tramas based on conceito if available
            if conceito:
                return [f"Uma história sobre {conceito} e suas consequências."]
            return [
                "Um herói improvável é forçado a enfrentar uma antiga ameaça.",
                "Um segredo de família vem à tona e muda tudo.",
            ]

        if isinstance(result, str):
            try:
                parsed = json.loads(result)
                if isinstance(parsed, list):
                    return [str(x).strip() for x in parsed]
                if isinstance(parsed, dict) and "tramas" in parsed:
                    return [str(x).strip() for x in parsed["tramas"]]
            except Exception:
                pass

        return []

    def generate_loglines(self, book: Book, extra_summary: Optional[Dict[str, Any]] = None) -> list[str]:
        """
        Generate candidate loglines (short one-line story hooks) using structured JSON schema.
        Returns a list of logline strings.
        """
        schema = {
            "type": "json_schema",
            "json_schema": {
                "name": "loglines",
                "schema": {
                    "type": "object",
                    "properties": {
                        "loglines": {
                            "type": "array",
                            "items": {"type": "string"},
                            "minItems": 6,
                        }
                    },
                    "required": ["loglines"],
                },
            },
        }

        prompt_system = self.prompts.get("system_logline", "You are an assistant that writes loglines.")
        prompt_user_template = self.prompts.get("user_logline", "Generate loglines.")

        conceito = getattr(book, "conceito", "")
        tema = getattr(book, "tema", "")
        genero = getattr(book, "genre", None) or getattr(book, "genero", "")

        # Replace template placeholders if present (including genero)
        prompt_user = (
            prompt_user_template
            .replace("{{conceito}}", str(conceito))
            .replace("{{tema}}", str(tema))
            .replace("{{genero}}", str(genero))
        )
      

        prompts = [
            {"role": "system", "content": prompt_system},
            {"role": "user", "content": prompt_user},
        ]

        if genero:
            prompts[-1]["content"] += f" Context: genero: {genero}"

        if extra_summary:
            try:
                ctx = json.dumps(extra_summary, ensure_ascii=False)
            except Exception:
                ctx = str(extra_summary)
            prompts[-1]["content"] += f" Context: {ctx}"

        result = self.entrypoint.generate_json(prompts, response_schema=schema, temperature= self.temperature, max_tokens=self.max_tokens)

        # Defensive parsing (similar to other generators)
        if isinstance(result, dict):
            if "loglines" in result and isinstance(result["loglines"], list):
                return [str(x).strip() for x in result["loglines"] if x]

            for v in result.values():
                if isinstance(v, list) and all(isinstance(i, str) for i in v):
                    return [i.strip() for i in v]

            for v in result.values():
                if isinstance(v, list):
                    cleaned = [str(x).strip() for x in v if isinstance(x, (str, int, float))]
                    if cleaned:
                        return cleaned

            return []

        if isinstance(result, str):
            try:
                parsed = json.loads(result)
                if isinstance(parsed, list):
                    return [str(x).strip() for x in parsed]
                if isinstance(parsed, dict) and "loglines" in parsed:
                    return [str(x).strip() for x in parsed["loglines"]]
            except Exception:
                pass

        return []

    def generate_protagonistas(self, book: Book, extra_summary: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        """
        Generate one or more protagonists. Returns a list of protagonist objects.
        Each protagonist object should contain at least: 'nome', 'descricao', 'acoes', 'transformacao'.
        The first item is considered the main protagonist.
        """
        schema = {
            "type": "json_schema",
            "json_schema": {
                "name": "protagonistas",
                "schema": {
                    "type": "object",
                    "properties": {
                        "protagonistas": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "nome": {"type": "string"},
                                    "descricao": {"type": "string"},
                                    "acoes": {"type": "array", "items": {"type": "string"}},
                                    "transformacao": {"type": "string"}
                                },
                                "required": ["nome", "descricao"]
                            },
                            "minItems": 1,
                        }
                    },
                    "required": ["protagonistas"],
                },
            },
        }

        prompt_system = self.prompts.get("system_protagonista", "Você é um assistente que cria protagonistas em JSON válido.")
        prompt_user_template = self.prompts.get("user_protagonista", "Dada a logline '{{logline}}', o tema '{{tema}}' e o conceito '{{conceito}}', gere um objeto JSON descrevendo o protagonista do livro.")

        logline = getattr(book, "logline", "") or ""
        tema = getattr(book, "tema", "") or ""
        conceito = getattr(book, "conceito", "") or ""

        prompt_user = (
            prompt_user_template.replace("{{logline}}", str(logline)).replace("{{tema}}", str(tema)).replace("{{conceito}}", str(conceito))
        )

        prompts = [
            {"role": "system", "content": prompt_system},
            {"role": "user", "content": prompt_user},
        ]

        if extra_summary:
            try:
                ctx = json.dumps(extra_summary, ensure_ascii=False)
            except Exception:
                ctx = str(extra_summary)
            prompts[-1]["content"] += f" Context: {ctx}"

        result = self.entrypoint.generate_json(prompts, response_schema=schema, temperature= self.temperature, max_tokens=self.max_tokens)

        # Use helper to parse structured response
        parsed = self._parse_structured(result, "protagonistas")
        if isinstance(parsed, list):
            return parsed

        # Fallback: create a simple main protagonist from available book data
        main_name = "Protagonista"
        if conceito:
            main_name = f"Protagonista de {conceito}"[:60]
        return [{"nome": main_name, "descricao": conceito or "Um protagonista indefinido.", "acoes": [], "transformacao": ""}]


    def generate_antagonistas(self, book: Book, extra_summary: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        """
        Generate one or more antagonists. Returns a list of antagonist objects.
        The first item is considered the main antagonist.
        """
        schema = {
            "type": "json_schema",
            "json_schema": {
                "name": "antagonistas",
                "schema": {
                    "type": "object",
                    "properties": {
                        "antagonistas": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "nome": {"type": "string"},
                                    "descricao": {"type": "string"},
                                    "acoes": {"type": "array", "items": {"type": "string"}},
                                    "transformacao": {"type": "string"}
                                },
                                "required": ["nome", "descricao"]
                            },
                            "minItems": 1,
                        }
                    },
                    "required": ["antagonistas"],
                },
            },
        }

        prompt_system = self.prompts.get("system_antagonista", "Você é um assistente que cria antagonistas em JSON válido.")
        prompt_user_template = self.prompts.get("user_antagonista", "Dada a logline '{{logline}}', o tema '{{tema}}' e o conceito '{{conceito}}', gere um objeto JSON descrevendo o antagonista do livro.")

        logline = getattr(book, "logline", "") or ""
        tema = getattr(book, "tema", "") or ""
        conceito = getattr(book, "conceito", "") or ""

        prompt_user = (
            prompt_user_template.replace("{{logline}}", str(logline)).replace("{{tema}}", str(tema)).replace("{{conceito}}", str(conceito))
        )

        prompts = [
            {"role": "system", "content": prompt_system},
            {"role": "user", "content": prompt_user},
        ]

        if extra_summary:
            try:
                ctx = json.dumps(extra_summary, ensure_ascii=False)
            except Exception:
                ctx = str(extra_summary)
            prompts[-1]["content"] += f" Context: {ctx}"

        result = self.entrypoint.generate_json(prompts, response_schema=schema, temperature= self.temperature, max_tokens=self.max_tokens)

        parsed = self._parse_structured(result, "antagonistas")
        if isinstance(parsed, list):
            return parsed

        # Fallback
        main_name = "Antagonista"
        if conceito:
            main_name = f"Antagonista em {conceito}"[:60]
        return [{"nome": main_name, "descricao": conceito or "Um antagonista indefinido.", "acoes": [], "transformacao": ""}]

    def generate_logline_expansion(self, book: Book, extra_summary: Optional[Dict[str, Any]] = None) -> str:
        """
        Expand the book's `logline` into a single paragraph describing:
        - the premise
        - the major disasters/conflicts
        - the ending

        The function sends the `Book` as JSON as context to the LLM and returns
        the expanded paragraph (string).
        """
        if not getattr(book, "logline", None):
            return ""

        # Prepare a clear system and user prompt
        system_msg = (
            "You are a creative fiction assistant. Expand the provided logline into one paragraph. "
            "The paragraph must contain the premise, the major disasters/conflicts (key turning points), and the ending."
        )

        # Provide the entire book as JSON context to the model
        try:
            book_json = book.to_json()
        except Exception:
            # Fallback to dict if to_json isn't available
            try:
                book_json = json.dumps(book.to_dict(), ensure_ascii=False)
            except Exception:
                book_json = str(book.__dict__)

        user_msg = (
            f"Expand this logline into one paragraph (premise, major disasters/conflicts, ending):\n\n"
            f"Logline: {book.logline}\n\nBook JSON Context:\n{book_json}\n\nReturn a single paragraph in Portuguese (or the book's language)."
        )

        messages = [
            {"role": "system", "content": system_msg},
            {"role": "user", "content": user_msg},
        ]

        url = _build_endpoint(self.entrypoint.base_url, "chat/completions")
        headers = {
            "Authorization": f"Bearer {self.entrypoint.api_key}",
            "Content-Type": "application/json",
        }
        payload = {
            "model": self.entrypoint.model,
            "messages": messages,
            "temperature": self.temperature,
            "max_tokens": self.max_tokens,
        }

        # Ensure string content
        for m in payload["messages"]:
            if not isinstance(m.get("content"), str):
                m["content"] = json.dumps(m.get("content"), ensure_ascii=False)

        resp = requests.post(url, headers=headers, json=payload, timeout=60)
        try:
            resp.raise_for_status()
        except requests.exceptions.HTTPError:
            # Attach response text to exception for debugging
            raise
        data = resp.json()
        try:
            content = data["choices"][0]["message"]["content"]
        except Exception:
            # Unexpected shape
            return ""

        return content.strip()


    def generate_three_acts_from_logline(self, book: Book, extra_summary: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        """
        Generate a 3-act outline based on `book.logline_expanded`.

        Rules applied:
        - Act 1 ends with the 1st disaster (preferably external).
        - Act 2 contains the 2nd (midpoint) disaster and then a 3rd disaster
          that results from the protagonist's attempts to fix the situation.
        - Act 3 resolves the consequences and provides the ending.

        Returns a list of 3 dicts: { 'act': int, 'description': str, 'disaster_point': str }
        """
        text = getattr(book, "logline_expanded", None)
        if not text:
            return []

        # Try asking the LLM for a structured 3-act breakdown first
        schema = {
            "type": "json_schema",
            "json_schema": {
                "name": "acts",
                "schema": {
                    "type": "object",
                    "properties": {
                        "acts": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "act": {"type": "integer"},
                                    "description": {"type": "string"},
                                    "disaster_point": {"type": "string"}
                                },
                                "required": ["act", "description", "disaster_point"]
                            },
                            "minItems": 3,
                        }
                    },
                    "required": ["acts"],
                },
            },
        }

        system_msg = (
            "Você é um assistente de estrutura narrativa. Dado um parágrafo expandido da logline, "
            "retorne um JSON com três atos. O 1º ato deve terminar com o primeiro desastre (preferencialmente externo). "
            "O 2º ato deve conter o desastre do meio (midpoint). O 3º desastre deve ser consequência das tentativas do protagonista de consertar as coisas e empurrar para o Ato 3. "
            "Para cada ato, forneça: act (1-3), description (breve descrição do que acontece no ato) e disaster_point (a tragédia/colapso central que encerra/afeta o ato)."
        )

        user_msg = f"Logline expanded:\n\n{text}\n\nGere a estrutura de 3 atos em JSON conforme instruções acima. Responda apenas com o JSON estrutural."

        prompts = [
            {"role": "system", "content": system_msg},
            {"role": "user", "content": user_msg},
        ]

        try:
            result = self.entrypoint.generate_json(prompts, response_schema=schema, temperature=self.temperature, max_tokens=600)
            parsed = self._parse_structured(result, "acts")
            if isinstance(parsed, list) and len(parsed) >= 3:
                # Normalize items to expected shape
                cleaned = []
                for item in parsed[:3]:
                    if isinstance(item, dict):
                        cleaned.append({
                            "act": int(item.get("act", len(cleaned) + 1)),
                            "description": str(item.get("description", "")).strip(),
                            "disaster_point": str(item.get("disaster_point", "")).strip(),
                        })
                if len(cleaned) >= 3:
                    return cleaned
        except Exception:
            # fall through to heuristic fallback
            pass

        # Heuristic fallback: extract candidate sentences from the expanded logline
        import re

        sentences = [s.strip() for s in re.split(r"(?<=[.!?])\s+", text) if s.strip()]
        # keywords to prioritize for disasters
        kws = ["desastre", "desapare", "brecha", "fragment", "falha", "sacrif", "experimento", "rebeld", "risco", "consequ"]
        candidates = []
        for s in sentences:
            low = s.lower()
            if any(k in low for k in kws):
                candidates.append(s)
        # if not enough candidates, use the longest sentences
        if len(candidates) < 3:
            # combine candidates with longest sentences until 3
            remaining = [s for s in sentences if s not in candidates]
            remaining_sorted = sorted(remaining, key=lambda x: -len(x))
            for s in remaining_sorted:
                if len(candidates) >= 3:
                    break
                candidates.append(s)

        # ensure we have at least 3 items
        while len(candidates) < 3:
            candidates.append("Uma virada dramática que altera o curso da história.")

        acts = []
        # Map candidates to acts with narrative rules
        acts.append({
            "act": 1,
            "description": f"Ato 1: apresentação do mundo, personagens e motivações; termina com o primeiro desastre externo que muda a rotina: {candidates[0]}",
            "disaster_point": candidates[0],
        })
        acts.append({
            "act": 2,
            "description": f"Ato 2: complicações e tentativas do protagonista de consertar a situação; no meio ocorre um segundo desastre (midpoint): {candidates[1]}. As ações do protagonista começam a agravar as coisas.",
            "disaster_point": candidates[1],
        })
        acts.append({
            "act": 3,
            "description": f"Ato 3: consequências das tentativas falhas do protagonista culminam em um terceiro desastre que empurra para o clímax e resolução: {candidates[2]}",
            "disaster_point": candidates[2],
        })

        return acts


    def build_book_structure_with_llm(
        self,
        temperature: float ,
        max_tokens: int = 1500,
    ) -> Book:
        """
        Calls the LLM to generate a book structure and returns a Book object.
        - api_key: OpenAI-compatible API key
        - base_url: API base URL (default: OpenAI)
        - model: model name
        - book_title, author: optional metadata
        - extra_summary: dict with keys like 'conceito', 'trama', etc.
        - structure_config: dict with structure numbers (acts, chapters, etc.)
        """
        book_title = None
        author = None
        extra_summary = None
    
        
        
        book = Book()
        
        book.genre = choose( "The genre of the book is",  self.generate_genres(extra_summary ) )
        book.conceito = choose( "The conceito of the book is",  self.generate_conceitos( book, extra_summary ) )
        # Logline should come before trama and must not depend on trama
        book.logline = choose( "The logline of the book is",  self.generate_loglines( book, extra_summary ) )
        # Trama can use conceito and optionally the generated logline
        #book.trama = choose( "The trama of the book is",  self.generate_tramas( book, extra_summary ) )
        book.tema = choose( "The tema of the book is",  self.generate_temas( book, extra_summary ) )

        # Expand the selected logline into a descriptive paragraph and attach to book
        try:
            expanded = self.generate_logline_expansion(book, extra_summary)
            book.logline_expanded = expanded
        except Exception:
            book.logline_expanded = None
               
        # Generate a 3-act outline based on the expanded logline (tries LLM then fallback)
        try:
            acts = self.generate_three_acts_from_logline(book, extra_summary)
            if acts:
                book.acts = acts
        except Exception:
            # leave book.acts as default/empty if generation fails
            pass
   

         
        protos = self.generate_protagonistas( book, extra_summary )
        for p in protos:
            if "nome" in p:
                print("  Protagonist:", p["nome"]) 

        ants = self.generate_antagonistas( book, extra_summary )
        for a in ants:
            if "nome" in a:
                print("  Antagonist:", a["nome"])

        # Attach lists for backward compatibility
        book.protagonistas = protos
        book.antagonistas = ants

        # Generate character sheets (fichas) for important characters
        try:
            sheets = self.generate_character_sheets(book, extra_summary)
            if sheets:
                book.character_sheets = sheets
        except Exception:
            pass

        # Set primary hero/villain fields on Book to the name only (avoid duplicating ficha)
        try:
            if protos and isinstance(protos, list) and isinstance(protos[0], dict):
                book.heroi = protos[0].get("nome")
            else:
                # If item is a plain string, use it directly
                if protos and isinstance(protos, list) and isinstance(protos[0], str):
                    book.heroi = protos[0]
        except Exception:
            pass
        try:
            if ants and isinstance(ants, list) and isinstance(ants[0], dict):
                book.vilao = ants[0].get("nome")
            else:
                if ants and isinstance(ants, list) and isinstance(ants[0], str):
                    book.vilao = ants[0]
        except Exception:
            pass

        return book 


def _build_endpoint(base_api: str, path: str) -> str:
    base = base_api.rstrip('/')
    if not base.endswith("/v1") and not base.endswith("/v1/"):
        base = base + "/v1"
    return f"{base.rstrip('/')}/{path.lstrip('/')}"

def build_book_structure_with_llm(
    api_key: str,
    base_url: str = "https://api.openai.com/v1",
    model: str = "gpt-3.5-turbo",
    temperature: float = 0.9,
    max_tokens: int = 1500,
) -> Book:
    generator = LLMBookGenerator( api_key=api_key, base_url=base_url, model=model )
    return generator.build_book_structure_with_llm(
        temperature=temperature,
        max_tokens=max_tokens,
    )

if __name__ == "__main__":
    # Example usage (requires valid API key and endpoint)
    import getpass
    api_key = os.environ.get("OPENAI_API_KEY") or getpass.getpass("OpenAI API key: ")
    book = LLMBookGenerator( api_key=api_key ).build_book_structure_with_llm()
