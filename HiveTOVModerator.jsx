import React, { useState } from 'react';
import { Copy, Check, ArrowLeft, Sparkles } from 'lucide-react';

export default function HiveTOVModerator() {
  const [screen, setScreen] = useState('menu');
  const [selectedOption, setSelectedOption] = useState(null);
  const [inputText, setInputText] = useState('');
  const [instructions, setInstructions] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [chatInput, setChatInput] = useState('');
  // FIXED: Added missing state declarations for training simulator
  const [trainingMode, setTrainingMode] = useState(null);
  const [trainingScenario, setTrainingScenario] = useState(null);

  const options = [
    { id: 0, title: 'Free Chat Mode', description: 'Natural conversation - paste tickets, ask for replies, translations, and more', icon: '💬' },
    { id: 1, title: 'Review a ticket for TOV compliance', description: 'Review and rewrite the ticket; provide TOV feedback', icon: '📝' },
    { id: 2, title: 'Review Zendesk ticket history', description: 'Assess full thread for tone, clarity, and warmth', icon: '📊' },
    { id: 3, title: 'Refine a draft response', description: 'Improve message tone, structure, and clarity', icon: '✨' },
    { id: 4, title: 'Translate a message', description: 'Translate with glossary consistency; include literal English version', icon: '🌐' },
    { id: 5, title: 'Summarize ticket conversation', description: 'Generate summary and internal comment table for Zendesk', icon: '📋' },
    { id: 6, title: 'Generate Zendesk Macros', description: 'Create multilingual macros (EN, DE, FR, IT, ES, NL) from a ticket or draft', icon: '⚡' },
    { id: 7, title: 'CS Training Simulator', description: 'Practice with adversarial customer scenarios and get real-time feedback', icon: '🎯' }
  ];

  const systemPrompt = `You are ClaudeBee, the Tone of Voice Moderator for Hive customer support. Your role is to refine customer-facing replies to match Hive's standards based on their official documentation.

HIVE TONE OF VOICE RULES:
- Short and sweet: Write concisely, do not overcomplicate or repeat
- Perfect balance between friendly and professional
- Use American English
- Address customers by first name (not company name)
- Keep abbreviations to a minimum
- NEVER use "unfortunately" - always lead with solutions
- Avoid emojis (if needed, only positive ones, limit 🚀)
- Use ONE exclamation mark (!) per email maximum
- Be solution-focused, not detail-focused on problems
- Reserve apologies for serious mistakes (use "thank you for your patience" instead of "sorry for late reply")
- Never use "ASAP" - give accurate timeframes
- Communicate as "we" (one Hive team), not "I'm checking with tech team"
- BANNED WORDS: "unfortunately", sad emojis 😕
- Use "Hive App" (not "portal"), "brands" (not "merchants/customers"), "fulfillment center" (not "FC/warehouse"), "kitting" (not "confectioning"), "public holiday" (not "bank holiday"), "business days" (not "working days"), "carriers" (not "couriers")

QUALITY CHECKLIST (Target: 11/12):
1. Greet by correct name with polite opening (1 point)
2. Address ALL questions in full chain (2 points)
3. Delightful, warm tone following TOV (2 points)
4. Friendly sign-off welcoming them to reach out (1 point)
5. Solution-oriented / go above and beyond (2 points)
6. Take necessary actions (1 point)
7. Correct categorization (1 point)
8. Clear internal notes with next steps (2 points)

HOW TO BE HELPFUL:
- Aim for one-contact-resolution
- Be a detective: troubleshoot thoroughly, provide short summaries in internal notes
- Think like a lawyer: if unclear, provide multiple solutions, address ALL questions
- Be a storyteller: explain what happens next and why
- Present like a TV news reader: be friendly no matter what, adapt to audience
- Set realistic expectations: focus on continuous improvement, not guarantees
- Use confidence, not certainty

Return ONLY the improved text without explanations or meta-commentary.`;

  const summaryPrompt = `You are ClaudeBee, specialized in analyzing Hive support ticket conversations. Provide clear, structured summaries following Hive's quality standards.

HIVE CONTEXT YOU MUST KNOW:
- Hive is an international end-to-end operations platform for D2C and B2B growth
- Merchants are referred to as "brands" in communication
- Use terms: "Hive App" (not portal), "fulfillment center" (not FC/warehouse), "kitting" (not confectioning), "business days" (not working days), "carriers" (not couriers)
- SLAs: 48 hours for inventory checks
- Always aim for one-contact-resolution

When given a ticket conversation, output TWO components:

1. **Summary (≤300 words):**
   - Concisely describe the issue, context, and resolution attempts
   - Merchant-focused and neutral tone
   - Include what was done and what happens next
   - Note if one-contact-resolution was achieved

2. **Zendesk Internal Comment Table:**
   Create a structured table with these rows:
   - Merchant complaint & request (bullet points)
   - Action(s) taken by the agent (bullet points, or "None provided")
   - Action(s) taken by the merchant (bullet points, or "None provided")
   - Object of the request (e.g., order numbers, SKUs, specific issue)
   - Perceived severity (Low/Medium/High based on merchant tone and urgency)
   - Quality Score: Rate the agent's response out of 12 using Hive's Quality Checklist
   - Links mentioned: List all URLs as clickable links

QUALITY ASSESSMENT CRITERIA (score /12):
1. Proper greeting with correct name (0-1)
2. Read full chain and answer all points (0-2)
3. Tone follows Hive TOV (warm, clear, solution-focused) (0-2)
4. Friendly sign-off (0-1)
5. Solution-oriented / above & beyond (0-2)
6. Necessary actions taken (0-1)
7. Correct categorization (0-1)
8. Clear internal notes (0-2)

Guidelines:
- Prioritize clarity, accuracy, and neutrality
- Capture the essence without repetition
- Max 300 words for summary
- Use "None provided" for empty fields
- Avoid speculation - only state what's supported by ticket content`;

  const macroPrompt = `You are ClaudeBee, specialized in creating Zendesk macros for Hive customer support. Transform ticket responses or drafts into reusable macros in multiple languages.

HIVE CONTEXT YOU MUST KNOW:
- Hive is an international end-to-end operations platform for D2C and B2B growth
- Merchants are referred to as "brands" in communication
- Use terms: "Hive App" (not portal), "fulfillment center" (not FC/warehouse), "kitting" (not confectioning), "business days" (not working days), "carriers" (not couriers)
- Tone: Short, friendly, professional, solution-focused
- Use American English for EN version
- Address customers by first name with {{ticket.requester.first_name}}
- NEVER use "unfortunately" - always lead with solutions
- Avoid emojis (if needed, only positive ones, limit 🚀)
- Use ONE exclamation mark (!) per email maximum

GLOSSARY FOR TRANSLATIONS:
- "brands" → DE: Marken, FR: marques, IT: brand, ES: marcas, NL: merken
- "Hive App" → Keep as "Hive App" in all languages
- "fulfillment center" → DE: Fulfillment-Center, FR: centre de traitement, IT: centro di evasione, ES: centro de cumplimiento, NL: fulfillment center
- "kitting" → DE: Konfektionierung, FR: assemblage, IT: kit, ES: montaje, NL: kitting
- "business days" → DE: Werktage, FR: jours ouvrables, IT: giorni lavorativi, ES: días hábiles, NL: werkdagen
- "carriers" → DE: Versanddienstleister, FR: transporteurs, IT: corrieri, ES: transportistas, NL: vervoerders

OUTPUT FORMAT:
For each language, provide the macro in this exact format:

---
**ENGLISH (EN)**
[Macro text with {{ticket.requester.first_name}} placeholder]

---
**GERMAN (DE)**
[Macro text with {{ticket.requester.first_name}} placeholder]

---
**FRENCH (FR)**
[Macro text with {{ticket.requester.first_name}} placeholder]

---
**ITALIAN (IT)**
[Macro text with {{ticket.requester.first_name}} placeholder]

---
**SPANISH (ES)**
[Macro text with {{ticket.requester.first_name}} placeholder]

---
**DUTCH (NL)**
[Macro text with {{ticket.requester.first_name}} placeholder]

---

GUIDELINES:
- Make macros generic and reusable (remove specific order numbers, dates, etc.)
- Use {{ticket.requester.first_name}} for personalization
- Keep the same warm, professional tone across all languages
- Ensure translations are natural and culturally appropriate
- Maintain Hive's TOV standards in every language
- Each macro should be concise and solution-focused`;

  const trainingPrompt = `You are the Adversarial Customer Simulation Trainer (ACST) for Hive customer support training.

YOUR ROLE:
You simulate realistic, challenging customer interactions to help CS agents practice and improve their responses. You evaluate agent performance based on Hive's standards and provide constructive feedback.

HIVE STANDARDS YOU ENFORCE:
- Short and sweet: Write concisely, do not overcomplicate or repeat
- Perfect balance between friendly and professional
- Use American English
- Address customers by first name (not company name)
- Keep abbreviations to a minimum
- NEVER use "unfortunately" - always lead with solutions
- Avoid emojis (if needed, only positive ones, limit 🚀)
- Use ONE exclamation mark (!) per email maximum
- Be solution-focused, not detail-focused on problems
- Reserve apologies for serious mistakes (use "thank you for your patience" instead of "sorry for late reply")
- Never use "ASAP" - give accurate timeframes
- Communicate as "we" (one Hive team), not "I'm checking with tech team"

QUALITY CHECKLIST (score out of 12):
1. Greet by correct name with polite opening (0-1)
2. Address ALL questions in full chain (0-2)
3. Delightful, warm tone following TOV (0-2)
4. Friendly sign-off welcoming them to reach out (0-1)
5. Solution-oriented / go above and beyond (0-2)
6. Take necessary actions (0-1)
7. Correct categorization (0-1)
8. Clear internal notes with next steps (0-2)

SIMULATION MODES:
- 🟢 Beginner: Friendly customers with straightforward questions
- 🟠 Intermediate: Mildly irritated customers with layered issues
- 🔴 Advanced: Aggressive, confusing, or emotionally charged queries

SCENARIO TYPES:
- 🔄 Return issue
- 📦 Fulfillment delay
- 💬 Wrong SKU shipped
- 🧾 Invoice/payment issue
- 🚚 Tracking/shipping failure

SIMULATION FLOW:
1. Start with an initial customer message matching the selected difficulty and scenario
2. Read the agent's response carefully
3. React authentically as the customer would (follow-ups, misunderstandings, escalations)
4. After 2-3 exchanges, provide detailed feedback with:
   - Quality score breakdown (out of 12)
   - Specific strengths
   - Areas for improvement with examples
   - Rewritten version showing best practices
5. Ask if they want to continue training or try a new scenario

CUSTOMER PERSONAS YOU SIMULATE:
- Polite but confused
- Frustrated and impatient
- Demanding or urgent
- Highly detailed with multi-point issues
- Language barrier challenges

Be realistic, challenging, and constructive. Your goal is to help agents improve while maintaining a supportive training environment.`;

  const handleOptionSelect = (optionId) => {
    setSelectedOption(optionId);
    if (optionId === 0) {
      setScreen('chat');
      setChatHistory([]);
      setChatInput('');
    } else if (optionId === 7) {
      setScreen('training-setup');
      setTrainingMode(null);
      setTrainingScenario(null);
      setChatHistory([]);
      setChatInput('');
    } else {
      setScreen('input');
      setInputText('');
      setInstructions('');
      setOutputText('');
    }
  };

  const handleProcess = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    setOutputText('');

    try {
      const taskInstructions = {
        1: 'Review this ticket and rewrite it to meet Hive TOV standards. Provide the improved version only.',
        2: 'Review this Zendesk ticket history for tone, clarity, and warmth. Suggest improvements and provide a refined version.',
        3: 'Refine this draft response to align with Hive standards. Return only the improved text.',
        4: 'Translate this message using Hive glossary standards. Provide both the refined translation and a literal English translation.',
        5: 'Analyze this ticket conversation and provide: 1) A summary (max 300 words), and 2) A Zendesk Internal Comment Table with the specified fields.',
        6: 'Convert this ticket or draft into reusable Zendesk macros in 6 languages: English, German, French, Italian, Spanish, and Dutch. Follow the specified format exactly.'
      };

      const isTicketSummary = selectedOption === 5;
      const isMacroGeneration = selectedOption === 6;
      let prompt = systemPrompt;

      if (isTicketSummary) {
        prompt = summaryPrompt;
      } else if (isMacroGeneration) {
        prompt = macroPrompt;
      }

      const userPrompt = `${prompt}\n\nTask: ${taskInstructions[selectedOption]}\n\n${instructions.trim() ? `Additional Instructions: ${instructions}\n\n` : ''}Content to review:\n${inputText}`;

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 2000,
          messages: [
            {
              role: 'user',
              content: userPrompt
            }
          ]
        })
      });

      const data = await response.json();
      const result = data.content.find(item => item.type === 'text')?.text || 'Error processing request';

      setOutputText(result);
      setScreen('output');
    } catch (error) {
      setOutputText('Error: Unable to process your request. Please try again.');
      setScreen('output');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleChatSubmit = async () => {
    if (!chatInput.trim()) return;

    const userMessage = chatInput.trim();
    setChatInput('');

    // Add user message to chat
    const newHistory = [...chatHistory, { role: 'user', content: userMessage }];
    setChatHistory(newHistory);
    setIsLoading(true);

    try {
      // Build messages array for API
      const messages = newHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Determine which system prompt to use
      const isTraining = selectedOption === 7;
      const systemContext = isTraining ? trainingPrompt : systemPrompt;

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 2000,
          system: systemContext,
          messages: messages
        })
      });

      const data = await response.json();
      const assistantMessage = data.content.find(item => item.type === 'text')?.text || 'Error processing request';

      setChatHistory([...newHistory, { role: 'assistant', content: assistantMessage }]);
    } catch (error) {
      setChatHistory([...newHistory, { role: 'assistant', content: 'Error: Unable to process your request. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const startTrainingSession = async () => {
    if (!trainingMode || !trainingScenario) return;

    setScreen('chat');
    setIsLoading(true);

    try {
      const initialMessage = `Start a ${trainingMode} difficulty training session with a ${trainingScenario} scenario. Begin by introducing yourself as the customer and presenting the initial issue.`;

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 2000,
          system: trainingPrompt,
          messages: [{ role: 'user', content: initialMessage }]
        })
      });

      const data = await response.json();
      const customerMessage = data.content.find(item => item.type === 'text')?.text || 'Error starting session';

      setChatHistory([{ role: 'assistant', content: customerMessage }]);
    } catch (error) {
      setChatHistory([{ role: 'assistant', content: 'Error: Unable to start training session. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyChatMessage = (content) => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBackToMenu = () => {
    setScreen('menu');
    setSelectedOption(null);
    setInputText('');
    setInstructions('');
    setOutputText('');
    setChatHistory([]);
    setChatInput('');
    setTrainingMode(null);
    setTrainingScenario(null);
  };

  return (
    <div className="min-h-screen bg-black p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Yellow accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-400"></div>

          <div className="p-6 md:p-12">
            {/* Header */}
            <div className="flex items-center gap-4 mb-10">
              <div className="relative w-16 h-16 bg-black rounded-2xl flex items-center justify-center text-3xl shadow-xl">
                🐝
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-black">
                  ClaudeBee
                </h1>
                <p className="text-gray-600 text-sm md:text-base">Hive Tone of Voice Moderator</p>
              </div>
            </div>

            {/* Menu Screen */}
            {screen === 'menu' && (
              <div>
                <p className="text-gray-700 mb-10 text-xl leading-relaxed font-light">
                  Hi HiveBee, I am ClaudeBee, here to help you review your ticket responses and improve them. Choose an option below:
                </p>
                <div className="grid gap-4">
                  {options.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleOptionSelect(option.id)}
                      className="group relative text-left p-6 rounded-2xl bg-white border-2 border-gray-200 hover:border-black hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-start gap-4">
                        <div className="text-3xl mt-1">{option.icon}</div>
                        <div className="flex-1">
                          <div className="font-semibold text-black text-lg mb-1">
                            {option.title}
                          </div>
                          <div className="text-sm text-gray-600">{option.description}</div>
                        </div>
                        <div className="text-black opacity-0 group-hover:opacity-100 transition-opacity text-xl">→</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Screen */}
            {screen === 'input' && (
              <div>
                <button
                  onClick={handleBackToMenu}
                  className="flex items-center gap-2 text-gray-600 hover:text-black mb-6 transition-colors group font-medium"
                >
                  <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                  Back to menu
                </button>
                <h2 className="text-3xl font-bold text-black mb-8 flex items-center gap-3">
                  <span className="text-4xl">{options.find(o => o.id === selectedOption)?.icon}</span>
                  {options.find(o => o.id === selectedOption)?.title}
                </h2>

                {/* Instructions Box */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-black mb-3">
                    Additional Instructions <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <textarea
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="Add specific instructions... (e.g., 'Make this more formal', 'Keep under 100 words')"
                    className="w-full h-24 p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-black focus:outline-none resize-none text-black placeholder-gray-400 transition-all"
                  />
                </div>

                {/* Content Box */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-black mb-3">
                    {selectedOption === 5 ? 'Ticket Conversation' : 'Content to Review'}
                  </label>
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={selectedOption === 5 ? "Paste the full ticket conversation here..." : "Paste your ticket text or draft here..."}
                    className="w-full h-80 p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-black focus:outline-none resize-none text-black placeholder-gray-400 transition-all"
                  />
                </div>

                <button
                  onClick={handleProcess}
                  disabled={!inputText.trim() || isLoading}
                  className="w-full bg-black text-white font-bold py-4 px-6 rounded-full hover:bg-gray-900 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-2xl flex items-center justify-center gap-2 text-lg"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} />
                      {selectedOption === 5 ? 'Generate Summary' : 'Review & Improve'}
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Output Screen */}
            {screen === 'output' && (
              <div>
                <button
                  onClick={handleBackToMenu}
                  className="flex items-center gap-2 text-gray-600 hover:text-black mb-6 transition-colors group font-medium"
                >
                  <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                  Back to menu
                </button>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-black">
                    {selectedOption === 5 ? '📋 Ticket Summary' : selectedOption === 6 ? '⚡ Zendesk Macros' : '✨ Improved Version'}
                  </h2>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-6 py-3 bg-black hover:bg-gray-900 text-white rounded-full transition-all font-medium"
                  >
                    {copied ? (
                      <>
                        <Check size={18} />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={18} />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <div className="bg-gray-50 p-8 rounded-2xl border-2 border-gray-200 whitespace-pre-wrap max-h-96 overflow-y-auto text-black">
                  {outputText}
                </div>
                <div className="mt-8 grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setScreen('input')}
                    className="bg-black text-white font-bold py-4 rounded-full hover:bg-gray-900 transition-all duration-300 shadow-lg"
                  >
                    Adjust Input
                  </button>
                  <button
                    onClick={handleBackToMenu}
                    className="bg-white border-2 border-gray-200 text-black font-bold py-4 rounded-full hover:border-black transition-all"
                  >
                    New Task
                  </button>
                </div>
              </div>
            )}

            {/* Training Setup Screen */}
            {screen === 'training-setup' && (
              <div>
                <button
                  onClick={handleBackToMenu}
                  className="flex items-center gap-2 text-gray-600 hover:text-black mb-6 transition-colors group font-medium"
                >
                  <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                  Back to menu
                </button>

                <h2 className="text-3xl font-bold text-black mb-4 flex items-center gap-3">
                  <span className="text-4xl">🎯</span>
                  CS Training Simulator
                </h2>

                <p className="text-gray-700 mb-8 text-lg">
                  Practice handling challenging customer scenarios and receive real-time feedback on your responses. Select your difficulty level and scenario type:
                </p>

                {/* Difficulty Selection */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-black mb-3">
                    Select Difficulty Level
                  </label>
                  <div className="grid gap-3">
                    <button
                      onClick={() => setTrainingMode('beginner')}
                      className={`text-left p-4 rounded-xl border-2 transition-all ${
                        trainingMode === 'beginner'
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🟢</span>
                        <div>
                          <div className="font-semibold text-black">Beginner</div>
                          <div className="text-sm text-gray-600">Friendly customers with straightforward questions</div>
                        </div>
                      </div>
                    </button>
                    <button
                      onClick={() => setTrainingMode('intermediate')}
                      className={`text-left p-4 rounded-xl border-2 transition-all ${
                        trainingMode === 'intermediate'
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🟠</span>
                        <div>
                          <div className="font-semibold text-black">Intermediate</div>
                          <div className="text-sm text-gray-600">Mildly irritated customers with layered issues</div>
                        </div>
                      </div>
                    </button>
                    <button
                      onClick={() => setTrainingMode('advanced')}
                      className={`text-left p-4 rounded-xl border-2 transition-all ${
                        trainingMode === 'advanced'
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:border-red-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🔴</span>
                        <div>
                          <div className="font-semibold text-black">Advanced</div>
                          <div className="text-sm text-gray-600">Aggressive, confusing, or emotionally charged queries</div>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Scenario Selection */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-black mb-3">
                    Select Scenario Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'return', icon: '🔄', label: 'Return issue' },
                      { id: 'fulfillment', icon: '📦', label: 'Fulfillment delay' },
                      { id: 'wrong-sku', icon: '💬', label: 'Wrong SKU shipped' },
                      { id: 'invoice', icon: '🧾', label: 'Invoice/payment issue' },
                      { id: 'tracking', icon: '🚚', label: 'Tracking/shipping failure' }
                    ].map((scenario) => (
                      <button
                        key={scenario.id}
                        onClick={() => setTrainingScenario(scenario.id)}
                        className={`text-left p-4 rounded-xl border-2 transition-all ${
                          trainingScenario === scenario.id
                            ? 'border-black bg-gray-50'
                            : 'border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{scenario.icon}</span>
                          <div className="font-medium text-black">{scenario.label}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={startTrainingSession}
                  disabled={!trainingMode || !trainingScenario}
                  className="w-full bg-black text-white font-bold py-4 px-6 rounded-full hover:bg-gray-900 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-2xl flex items-center justify-center gap-2 text-lg"
                >
                  <Sparkles size={20} />
                  Start Training Session
                </button>
              </div>
            )}

            {/* Chat Screen */}
            {screen === 'chat' && (
              <div className="flex flex-col h-[600px]">
                <button
                  onClick={handleBackToMenu}
                  className="flex items-center gap-2 text-gray-600 hover:text-black mb-6 transition-colors group font-medium"
                >
                  <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                  Back to menu
                </button>

                <h2 className="text-3xl font-bold text-black mb-4 flex items-center gap-3">
                  <span className="text-4xl">{selectedOption === 7 ? '🎯' : '💬'}</span>
                  {selectedOption === 7 ? 'CS Training Simulator' : 'Free Chat Mode'}
                </h2>

                <p className="text-gray-600 mb-6">
                  {selectedOption === 7
                    ? `Training Mode: ${trainingMode} | Scenario: ${trainingScenario}. Respond as you would to a real customer!`
                    : 'Paste tickets, ask for replies, request translations, or get any help you need. I\'ll remember our conversation!'}
                </p>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto mb-4 space-y-4 bg-gray-50 rounded-2xl p-6 border-2 border-gray-200">
                  {chatHistory.length === 0 && (
                    <div className="text-center text-gray-400 py-12">
                      <div className="text-6xl mb-4">🐝</div>
                      <p className="text-lg">
                        {selectedOption === 7
                          ? 'Your training session will begin here...'
                          : 'Start chatting! Try pasting a ticket and saying "reply to this"'}
                      </p>
                    </div>
                  )}

                  {chatHistory.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl p-4 ${
                          message.role === 'user'
                            ? 'bg-black text-white'
                            : selectedOption === 7
                            ? 'bg-blue-50 border-2 border-blue-200 text-black'
                            : 'bg-white border-2 border-gray-200 text-black'
                        }`}
                      >
                        {selectedOption === 7 && message.role === 'assistant' && index === 0 && (
                          <div className="text-xs font-semibold text-blue-600 mb-2">📧 CUSTOMER MESSAGE</div>
                        )}
                        {selectedOption === 7 && message.role === 'assistant' && index > 0 && message.content.includes('Score') && (
                          <div className="text-xs font-semibold text-green-600 mb-2">📊 FEEDBACK & EVALUATION</div>
                        )}
                        <div className={`whitespace-pre-wrap break-words ${message.role === 'user' && message.content.length > 300 ? 'max-h-32 overflow-y-auto' : ''}`}>
                          {message.content}
                        </div>
                        {message.role === 'assistant' && (
                          <button
                            onClick={() => handleCopyChatMessage(message.content)}
                            className="mt-2 text-xs text-gray-500 hover:text-black flex items-center gap-1"
                          >
                            <Copy size={12} />
                            Copy
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white border-2 border-gray-200 rounded-2xl p-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Chat Input */}
                <div className="flex gap-3">
                  <textarea
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleChatSubmit();
                      }
                    }}
                    placeholder={selectedOption === 7
                      ? "Type your customer support response... (Shift+Enter for new line)"
                      : "Type your message or paste a ticket... (Shift+Enter for new line)"}
                    className="flex-1 p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-black focus:outline-none resize-none text-black placeholder-gray-400 transition-all"
                    rows={3}
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleChatSubmit}
                    disabled={!chatInput.trim() || isLoading}
                    className="bg-black text-white font-bold px-8 rounded-2xl hover:bg-gray-900 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-2xl"
                  >
                    Send
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
