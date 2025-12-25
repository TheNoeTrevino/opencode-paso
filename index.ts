import type { Plugin } from "@opencode-ai/plugin"
import type { Event, EventSessionCreated } from "@opencode-ai/sdk"

/**
 * OpenCode plugin for paso workflow context injection.
 *
 * Dynamically runs `paso tutorial` at session start to inject
 * up-to-date paso workflow context into the conversation.
 *
 * ## Requirements
 * - `paso` must be installed and in PATH
 *
 * ## Configuration
 * Add to your opencode.json:
 * ```json
 * {
 *   "plugin": ["opencode-paso"]
 * }
 * ```
 */
// Only use default export to avoid duplicate plugin loading
// OpenCode's plugin loader iterates over all exports, so having both
// named and default exports causes the plugin to run twice
const OpenCodePasoSession: Plugin = async (ctx) => {
  const { client, $ } = ctx

  return {
    event: async ({ event }: { event: Event }) => {
      if (event.type === "session.created") {
        const sessionEvent = event as EventSessionCreated
        const sessionId = sessionEvent.properties.info.id

        try {
          // Run paso tutorial to get current workflow context
          const pasoContext = await $`paso tutorial`.text()

          if (!pasoContext || pasoContext.trim().length === 0) {
            console.warn("[opencode-paso] paso tutorial returned empty output")
            return
          }

          // Inject context without triggering AI response
          await client.session.prompt({
            path: { id: sessionId },
            body: {
              noReply: true,
              parts: [{
                type: "text",
                text: pasoContext
              }]
            }
          })
        } catch (error) {
          // paso might not be installed or not in PATH
          console.error("[opencode-paso] Failed to inject context:", error)
        }
      }
    }
  }
}

export default OpenCodePasoSession
