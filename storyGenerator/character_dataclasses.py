from dataclasses import dataclass, field
from typing import List, Optional

@dataclass
class Personagem:
    nome: str
    descricao: str
    acoes: List[str] = field(default_factory=list)
    transformacao: Optional[str] = None

@dataclass
class Protagonista(Personagem):
    papel: str = "protagonista"

@dataclass
class Antagonista(Personagem):
    papel: str = "antagonista"

@dataclass
class Auxiliar(Personagem):
    papel: str = "auxiliar"
