import { isAiConfigured } from "@/lib/ai/config";
import { AssistantPanel } from "@/components/assistant/assistant-panel";

const examplePrompts = [
  "Noise-cancelling headphones under ₹15,000",
  "A gift for someone who runs every morning",
  "Something to carry a 14-inch laptop on a bike",
  "Compare your two most popular watches",
];

/**
 * Home-page section hosting the shopping assistant. A server component so
 * the API-key check never reaches the browser; the panel itself is a client
 * component.
 */
export function AiAssistantSection() {
  return <AssistantPanel enabled={isAiConfigured()} examplePrompts={examplePrompts} />;
}
