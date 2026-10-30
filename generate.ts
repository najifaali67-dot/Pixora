import { GoogleGenAI } from '@google/genai';

export const handler = async (event: any) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const { prompt, negativePrompt, aspectRatio = '1:1', style = 'Realistic' } = JSON.parse(
      event.body || '{}'
    );

    if (!prompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Prompt is required.' }),
      };
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const allowedAspects = ['1:1', '3:4', '4:3', '9:16', '16:9'];
      const validAspectRatio = allowedAspects.includes(aspectRatio) ? aspectRatio : '1:1';

      let finalPrompt = `${prompt}, in ${style} style, stunning lighting, masterpiece`;
      if (negativePrompt) finalPrompt += `. Avoid: ${negativePrompt}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-image',
        contents: {
          parts: [{ text: finalPrompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: validAspectRatio as any,
          },
        },
      });

      for (const part of response.candidates?.[0]?.content?.parts ?? []) {
        if (part.inlineData?.data) {
          const mime = part.inlineData.mimeType ?? 'image/png';
          return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              imageUrl: `data:${mime};base64,${part.inlineData.data}`,
              prompt,
              style,
              aspectRatio: validAspectRatio,
              provider: 'gemini-3.1-flash-lite-image',
            }),
          };
        }
      }
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'No image returned by provider or GEMINI_API_KEY not configured.',
      }),
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || 'Generation error' }),
    };
  }
};
