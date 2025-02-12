import os
import nest_asyncio
import json
from llama_cloud_services import LlamaParse

class LlamaParser:
    def __init__(self, result_type="text", num_workers=4, verbose=True, language="vi"):
        nest_asyncio.apply()
        self.parser = LlamaParse(
            api_key=os.environ["LLAMA_CLOUD_API_KEY"],
            result_type=result_type,  # "markdown" and "text" are available
            num_workers=num_workers,  # if multiple files passed, split in `num_workers` API calls
            verbose=verbose,
            language=language,  # Optionally you can define a language, default=vi
        )

    def load_data(self, file_path):
        """Load data synchronously."""
        documents = self.parser.load_data(file_path)
        result = [{"page": idx + 1, "text": doc.text} for idx, doc in enumerate(documents)]
        return result

    async def aload_data(self, file_path):
        """Load data asynchronously."""
        documents = await self.parser.aload_data(file_path)
        result = [{"page": idx + 1, "text": doc.text} for idx, doc in enumerate(documents)]
        return result