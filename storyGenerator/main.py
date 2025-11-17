"""Refactored entrypoint for story structure generation.

This module exposes a `main()` orchestration function and a set of small
helper functions that request lists or objects from an LLM, parse messy
LLM output, and generate themes, conceitos, loglines and characters.

Keep prompts in `llm_prompts.json` next to this file.
"""
from __future__ import annotations

import argparse
import json
import os
import random
import re
from typing import Any, Dict, List, Optional

import requests

from LLMStructure import  build_book_structure_with_llm
 
def loadFromJson( filepath: str ) -> Dict[str, Any]:
    """Load a JSON file and return its contents as a dictionary."""
    with open( filepath, "r", encoding="utf-8") as f:
        data = json.load(f)
        #check for keys
#          "openai_api_key": "lmstudio", 
#  "model": "gpt-3.5-turbo",
#  "openai_base_url": "http://192.168.56.1:1234"
    if not isinstance(data, dict):
        raise ValueError(f"Expected a JSON object in {filepath}, got {type(data)}")
    required_keys = {"openai_api_key", "model", "openai_base_url"}
    missing_keys = required_keys - data.keys()
    if missing_keys:
        raise ValueError(f"Missing required keys in {filepath}: {missing_keys}")
    


    return data


def main() -> int:
   # load host, apikey from config file or env vars
    llm_config = loadFromJson(
        os.path.join(os.path.dirname(__file__), "config.json")
    )

    # Call the LLM structure builder
    api_key = llm_config.get("openai_api_key") or os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("API key not found in config file or environment variable OPENAI_API_KEY")
    base_url = llm_config.get("openai_base_url") or os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1")
    book = build_book_structure_with_llm(  api_key=api_key, base_url=base_url )

    # Save the generated book structure to a JSON file
    with open( "output.json", "w", encoding="utf-8") as f:
        book_json = book.to_dict() if hasattr(book, "to_dict") else book
        print( book_json )
        json.dump( book_json, f, ensure_ascii=False, indent=2)

    print(f"Book structure saved to output.json")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
