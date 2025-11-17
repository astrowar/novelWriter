from __future__ import annotations

from dataclasses import asdict, dataclass, field
from typing import Any, Dict, List, Optional
import json


@dataclass
class Beat:
    """A single beat inside a scene.

    Fields:
      - text: short title or label for the beat
      - contents: longer textual contents of the beat
    """
    text: str
    contents: str

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class Scene:
    """A scene contains a list of beats."""

    id: Optional[str] = None
    title: Optional[str] = None
    beats: List[Beat] = field(default_factory=list)

    def add_beat(self, beat_text: str, contents: str) -> Beat:
        b = Beat(text=beat_text, contents=contents)
        self.beats.append(b)
        return b

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "title": self.title,
            "beats": [b.to_dict() for b in self.beats],
        }


@dataclass
class Chapter:
    """A chapter contains a list of scenes."""

    id: Optional[str] = None
    title: Optional[str] = None
    scenes: List[Scene] = field(default_factory=list)

    def add_scene(self, scene: Scene) -> Scene:
        self.scenes.append(scene)
        return scene

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "title": self.title,
            "scenes": [s.to_dict() for s in self.scenes],
        }


@dataclass
class Act:
    """An act contains a list of chapters."""

    id: Optional[str] = None
    title: Optional[str] = None
    chapters: List[Chapter] = field(default_factory=list)

    def add_chapter(self, chapter: Chapter) -> Chapter:
        self.chapters.append(chapter)
        return chapter

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "title": self.title,
            "chapters": [c.to_dict() for c in self.chapters],
        }


@dataclass
class Book:
    """Book container holding acts, chapters and scenes, and story summary fields.

    The Book keeps a hierarchical structure (acts -> chapters -> scenes -> beats)
    and also provides top-level lists `acts`, `chapters` and `scenes` for convenience.
    New fields: conceito, trama, logline, tema, heroi, vilao (all Optional[str]).
    """

    title: Optional[str] = None
    author: Optional[str] = None
    # language/genre fields (kept in both Portuguese and English for compatibility)
    genre: Optional[str] = None
    genero: Optional[str] = None
    conceito: Optional[str] = None  # Concept
    trama: Optional[str] = None     # Plot
    logline: Optional[str] = None
    logline_expanded: Optional[str] = None
    tema: Optional[str] = None     # Theme
    heroi: Optional[Dict[str, Any]] = None    # Hero (object)
    vilao: Optional[Dict[str, Any]] = None    # Villain (object)
    protagonistas: List[Dict[str, Any]] = field(default_factory=list)
    antagonistas: List[Dict[str, Any]] = field(default_factory=list)
    acts: List[Act] = field(default_factory=list)
    # character_sheets: fichas geradas pelo LLM para personagens importantes
    character_sheets: List[Dict[str, Any]] = field(default_factory=list)

    def add_act(self, act: Act) -> Act:
        self.acts.append(act)
        return act

    @property
    def chapters(self) -> List[Chapter]:
        """Flattened list of chapters across all acts."""
        out: List[Chapter] = []
        for a in self.acts:
            out.extend(a.chapters)
        return out

    @property
    def scenes(self) -> List[Scene]:
        """Flattened list of scenes across all chapters and acts."""
        out: List[Scene] = []
        for c in self.chapters:
            out.extend(c.scenes)
        return out

    def to_dict(self) -> Dict[str, Any]:
        return {
            "title": self.title,
            "author": self.author,
            "genre": self.genre,
            "genero": self.genero,
            "conceito": self.conceito,
            "trama": self.trama,
            "logline": self.logline,
            "logline_expanded": self.logline_expanded,
            "tema": self.tema,
            # hero/villain may be objects (dict) or strings; include as-is
            "heroi": self.heroi,
            "vilao": self.vilao,
            "protagonistas": self.protagonistas,
            "antagonistas": self.antagonistas,
            # `acts` may contain `Act` instances or plain dicts produced by LLM helpers.
            "acts": [a.to_dict() if hasattr(a, "to_dict") else a for a in self.acts],
            "character_sheets": self.character_sheets,
        }

    def to_json(self, **kwargs) -> str:
        return json.dumps(self.to_dict(), ensure_ascii=False, **kwargs)

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "Book":
        book = cls(
            title=data.get("title"),
            author=data.get("author"),
            conceito=data.get("conceito"),
            trama=data.get("trama"),
            logline=data.get("logline"),
            logline_expanded=data.get("logline_expanded"),
            tema=data.get("tema"),
            heroi=data.get("heroi"),
            vilao=data.get("vilao"),
        )
        # map genre/genero
        try:
            book.genre = data.get("genre") or data.get("genero")
            book.genero = data.get("genero") or data.get("genre")
        except Exception:
            book.genre = None
            book.genero = None
        # attach protagonists/antagonists if present
        try:
            book.protagonistas = data.get("protagonistas", []) or []
        except Exception:
            book.protagonistas = []
        try:
            book.antagonistas = data.get("antagonistas", []) or []
        except Exception:
            book.antagonistas = []
        # attach hero/villain names only (ensure string). If dict provided, extract 'nome'
        try:
            h = data.get("heroi")
            if isinstance(h, dict):
                book.heroi = h.get("nome")
            elif isinstance(h, str) and h:
                book.heroi = h
            else:
                book.heroi = None
        except Exception:
            book.heroi = None
        try:
            v = data.get("vilao")
            if isinstance(v, dict):
                book.vilao = v.get("nome")
            elif isinstance(v, str) and v:
                book.vilao = v
            else:
                book.vilao = None
        except Exception:
            book.vilao = None
        for a in data.get("acts", []):
            act = Act(id=a.get("id"), title=a.get("title"))
            for ch in a.get("chapters", []):
                chapter = Chapter(id=ch.get("id"), title=ch.get("title"))
                for s in ch.get("scenes", []):
                    scene = Scene(id=s.get("id"), title=s.get("title"))
                    for b in s.get("beats", []):
                        scene.add_beat(b.get("text", ""), b.get("contents", ""))
                    chapter.add_scene(scene)
                act.add_chapter(chapter)
            book.add_act(act)
        # attach any character sheets present
        try:
            book.character_sheets = data.get("character_sheets", []) or []
        except Exception:
            book.character_sheets = []
        return book


if __name__ == "__main__":
    # Quick example usage
    b = Book(title="Example Book", author="Author Name")

    a1 = b.add_act(Act(id="act1", title="Act I"))
    ch1 = a1.add_chapter(Chapter(id="ch1", title="Chapter 1"))
    s1 = ch1.add_scene(Scene(id="s1", title="Scene 1"))
    s1.add_beat("Beat 1", "This is the content of beat 1.")
    s1.add_beat("Beat 2", "This is the content of beat 2.")

    print(b.to_json(indent=2))
