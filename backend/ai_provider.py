"""
Universal AI Provider Wrapper
Supports OpenAI, Anthropic Claude, and OpenRouter
"""

import os
import json
from typing import Dict, Any, Optional, List, AsyncGenerator
from openai import OpenAI
from anthropic import Anthropic

class AIProvider:
    """Universal AI provider that works with OpenAI, Anthropic, and OpenRouter"""

    def __init__(self):
        self.provider = os.getenv("AI_PROVIDER", "openai").lower()
        self.model = os.getenv("AI_MODEL", "gpt-4o")

        # Initialize the appropriate client
        if self.provider == "openai":
            api_key = os.getenv("OPENAI_API_KEY")
            if not api_key:
                raise ValueError("OPENAI_API_KEY not found in environment")
            self.client = OpenAI(api_key=api_key)

        elif self.provider == "anthropic":
            api_key = os.getenv("ANTHROPIC_API_KEY")
            if not api_key:
                raise ValueError("ANTHROPIC_API_KEY not found in environment")
            self.client = Anthropic(api_key=api_key)

        elif self.provider == "openrouter":
            api_key = os.getenv("OPENROUTER_API_KEY")
            if not api_key:
                raise ValueError("OPENROUTER_API_KEY not found in environment")
            # OpenRouter uses OpenAI-compatible API
            self.client = OpenAI(
                base_url="https://openrouter.ai/api/v1",
                api_key=api_key
            )
        else:
            raise ValueError(f"Unsupported AI provider: {self.provider}")

    def chat_completion(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.7,
        max_tokens: int = 4000,
        response_format: Optional[Any] = None  # {"type": "json_object"} or None
    ) -> Dict[str, Any]:
        """
        Universal chat completion method that works across all providers

        Args:
            messages: List of message dicts with 'role' and 'content'
            temperature: Sampling temperature (0-1)
            max_tokens: Maximum tokens to generate
            response_format: {"type": "json_object"} for JSON response, None for text

        Returns:
            Dict with 'content' (str) and 'tokens_used' (int)
        """

        # Normalize response_format to boolean for easier handling
        wants_json = False
        if response_format:
            if isinstance(response_format, dict):
                wants_json = response_format.get("type") == "json_object"
            elif isinstance(response_format, str):
                wants_json = response_format.lower() == "json"

        if self.provider == "anthropic":
            return self._anthropic_completion(messages, temperature, max_tokens, wants_json)
        else:
            # OpenAI and OpenRouter use the same API format
            return self._openai_completion(messages, temperature, max_tokens, response_format)

    def _openai_completion(
        self,
        messages: List[Dict[str, str]],
        temperature: float,
        max_tokens: int,
        response_format: Optional[str]
    ) -> Dict[str, Any]:
        """OpenAI/OpenRouter completion"""

        kwargs = {
            "model": self.model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens
        }

        # Add response format if JSON requested
        if response_format == "json":
            kwargs["response_format"] = {"type": "json_object"}

        response = self.client.chat.completions.create(**kwargs)

        return {
            "content": response.choices[0].message.content,
            "tokens_used": response.usage.total_tokens if response.usage else None
        }

    def _anthropic_completion(
        self,
        messages: List[Dict[str, str]],
        temperature: float,
        max_tokens: int,
        wants_json: bool
    ) -> Dict[str, Any]:
        """Anthropic Claude completion"""

        # Anthropic has a different message format
        # System message must be separate from conversation messages
        system_message = None
        conversation_messages = []

        for msg in messages:
            if msg["role"] == "system":
                system_message = msg["content"]
            else:
                conversation_messages.append({
                    "role": msg["role"],
                    "content": msg["content"]
                })

        # If no conversation messages, convert system to user
        if not conversation_messages:
            conversation_messages = [{"role": "user", "content": system_message or ""}]
            system_message = None

        # For JSON responses, add explicit instruction to the last user message
        if wants_json and conversation_messages:
            last_message = conversation_messages[-1]
            if last_message["role"] == "user":
                last_message["content"] += "\n\nIMPORTANT: Respond with ONLY valid JSON. Do not include any text before or after the JSON object."

        kwargs = {
            "model": self.model,
            "max_tokens": max_tokens,
            "temperature": temperature,
            "messages": conversation_messages
        }

        if system_message:
            kwargs["system"] = system_message

        response = self.client.messages.create(**kwargs)

        # Extract text content
        content = ""
        for block in response.content:
            if hasattr(block, 'text'):
                content += block.text

        return {
            "content": content,
            "tokens_used": response.usage.input_tokens + response.usage.output_tokens if response.usage else None
        }

    async def chat_completion_stream(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.7,
        max_tokens: int = 4000,
        response_format: Optional[Any] = None
    ) -> AsyncGenerator[str, None]:
        """
        Streaming chat completion - yields text chunks as they arrive
        """
        # Normalize response_format
        wants_json = False
        if response_format:
            if isinstance(response_format, dict):
                wants_json = response_format.get("type") == "json_object"
            elif isinstance(response_format, str):
                wants_json = response_format.lower() == "json"

        if self.provider == "anthropic":
            async for chunk in self._anthropic_completion_stream(messages, temperature, max_tokens, wants_json):
                yield chunk
        else:
            async for chunk in self._openai_completion_stream(messages, temperature, max_tokens, response_format):
                yield chunk

    async def _anthropic_completion_stream(
        self,
        messages: List[Dict[str, str]],
        temperature: float,
        max_tokens: int,
        wants_json: bool
    ) -> AsyncGenerator[str, None]:
        """Streaming Anthropic Claude completion"""
        # Prepare messages same as non-streaming
        system_message = None
        conversation_messages = []

        for msg in messages:
            if msg["role"] == "system":
                system_message = msg["content"]
            else:
                conversation_messages.append({
                    "role": msg["role"],
                    "content": msg["content"]
                })

        if not conversation_messages:
            conversation_messages = [{"role": "user", "content": system_message or ""}]
            system_message = None

        if wants_json and conversation_messages:
            last_message = conversation_messages[-1]
            if last_message["role"] == "user":
                last_message["content"] += "\n\nIMPORTANT: Respond with ONLY valid JSON. Do not include any text before or after the JSON object."

        kwargs = {
            "model": self.model,
            "max_tokens": max_tokens,
            "temperature": temperature,
            "messages": conversation_messages
        }

        if system_message:
            kwargs["system"] = system_message

        with self.client.messages.stream(**kwargs) as stream:
            for text in stream.text_stream:
                yield text

    async def _openai_completion_stream(
        self,
        messages: List[Dict[str, str]],
        temperature: float,
        max_tokens: int,
        response_format: Optional[str]
    ) -> AsyncGenerator[str, None]:
        """Streaming OpenAI/OpenRouter completion"""
        kwargs = {
            "model": self.model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
            "stream": True
        }

        if response_format == "json" or (isinstance(response_format, dict) and response_format.get("type") == "json_object"):
            kwargs["response_format"] = {"type": "json_object"}

        stream = self.client.chat.completions.create(**kwargs)
        for chunk in stream:
            if chunk.choices[0].delta.content:
                yield chunk.choices[0].delta.content


# Global instance (lazy initialization)
_ai_provider_instance = None


def get_ai_provider() -> AIProvider:
    """Get the global AI provider instance"""
    global _ai_provider_instance
    if _ai_provider_instance is None:
        _ai_provider_instance = AIProvider()
    return _ai_provider_instance
