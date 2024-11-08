**Persona:**

Act as an expert full-stack web developer specialized in building multiplayer, real-time games using the latest Next.js framework with TypeScript, Tailwind CSS, and ESLint, adhering to modern coding practices.

**Task:**

Develop a high-quality, multiplayer, real-time web-based game called **"Strategic Auction Simulator"** for a hackathon. The game should simulate government officials managing infrastructure bids in a Singaporean context. Players strategize to select contracts based on criteria like budget, quality, sustainability, and vendor reliability.

**Context:**

- **Theme:** *Modernise an existing system/process, making it secure and future-ready.*
- **Game Overview:**
  1. **Company Setup:** At the start, each player sets up their own company by entering information through a predefined form with interview questions.
  2. **Contract Valuation:** The system uses OpenAI API calls to have GPT evaluate the contracts based on specific rubrics, determining their quality and assigning hidden values.
  3. **Bidding Process:** Bids are presented one by one. Players bid to acquire contracts based on the provided information. The highest bidder wins the contract.
  4. **Outcome Revelation:** The true values of the contracts are revealed, indicating whether the bidder made a profit or loss. Credits are adjusted accordingly. The contract creator gains 50% of the final bid price.
  5. **Game Summary:** At the end, display a leaderboard and an AI-generated summary of the game based on the bids, values, and player actions.
- **Additional Requirements:**
  - Incorporate Singaporean elements using specific names and references to enhance relatability.
  - Ensure the game is fun and engaging without overcomplicating the cultural context.
  - Keep the code readable and simplistic.
  - Modularize the code to facilitate easy addition of new features and future modifications.

**Response Format:**

- Provide the full code for every file in an organized manner, starting with the main website design files:
  - `src/app/layout.tsx`
  - `src/app/page.tsx`
  - `src/components/...` (include all necessary components)
- Include comments in the code to explain complex sections.
- Present the code in a clear and structured format, suitable for direct use.
- Include a `README.md` file with a brief introduction and instructions on how to run the project.

**Examples:**

- **Component Structure:**
  - `src/components/CompanySetupForm.tsx` for the company setup form.
  - `src/components/BidItem.tsx` for displaying individual bids.
  - `src/components/Leaderboard.tsx` for the end-game leaderboard.

**Instructions:**

- Think through the game logic step by step before coding.
- Weigh all aspects of the gameplay to ensure a balanced and enjoyable player experience.
- Before presenting the final code, list out your thoughts and planning process to ensure all requirements are met.





































You are an expert prompt engineer. Your task is to deeply understand what I want, and in return respond with a well crafted prompt that, if fed to a separate AI, will get me exactly the result I want.

The prompt follows this rough outline, and makes sure to include each part as needed:

1. A persona. At the start, you write something to the affect of "Act as an expert in ..." This primes the LLM to respond from info relating to experts in the specific field.
2. The task. This part of the prompt involves exhaustively laying out the task for the LLM. It is critical this part is specific and clear. This is the most important part of the prompt.
3. Context. Make sure to include _any_ context that is needed for the LLM to accurately, and reliably respond as needed.
4. Response format. Outline the ideal response format for this prompt.
5. Examples. This step is optional, but if examples would be beneficial, include them.
6. Input. If needed, leave a space in the prompt for any input data. This should be highlight between brackets [like this]

Some other important notes:

- Instruct the model to list out it's thoughts before giving an answer.
- If complex reasoning is required, include directions for the LLM to think step by step, and weigh all sides of the topic before settling on an answer.
- Where appropriate, make sure to utilize advanced prompt engineering techniques. These include, but are not limited to: Chain of Thought, Debate simulations, Self Reflection, and Self Consistency.
- Strictly use text, no code please

Please craft the perfect prompt for my request below

---

Build a game in a webapp as a product for a hackathon. The theme is "Modernise an existing system/process, making it secure and future-ready". The website is to use NEXT.JS + Typescript + TailwindCSS + ESLint + standard modern coding practices. Give your FULL codes to every file in an organised manner starting with the website design (src/app/layout.tsx, src/app/page.tsx, src/components/...,)

Here is the idea I have come up with: **Strategic Auction Simulator**
- **Overview**: Build an interactive game where users act as government officials managing infrastructure bids. Players must strategize to select contracts based on criteria like budget, quality, sustainability, and vendor reliability.
- **Key Features**: The player must negotiate and choose the most future-ready option.
- **Risk Assessment**: Each company comes with its own risk profile and historical data on contract completion, adding depth to the decision-making process.
- **Future-Proofing**: Players need to predict how contracts may fare with emerging technologies and sustainability requirements.

When players purchase or bring up a contract, it is to be uploaded to a local JSON file as the database. Additionally, please try to relate the game to a Singaporean context, so just use specific names, etc. No need to overdo it as the game should be fun.

Here is how I want the game to be like. Note that this is based on a Roblox game and you may adapt the gameplay slightly.
✍️In Idiotic Investing with 4 or more players, you are given two pieces of paper to draw two separate topics on! Once every player has submitted their masterpiece, the bidding begins!✍️ 
  💸At the start of every round, each player is given 3,000 credits to bid on other's art pieces. Once a player has successfully bid on a piece of art work, the true value of the piece will be revealed!💸    
💰Short on Credits? You can gain more by auctioning off some of your art pieces or taking a loan from the Blox Bank! Be careful though, at the end of the game you have to pay a 50% interest fee on your loans.💰    
🔩Want to annoy some of your friends? Half way through the round every player 
gains the abilty to screw a player and force them to bid once.🔩   

So, here is a rough procedure:
1. At the start of the game, each player is able to set up their own company and offer bids. They can enter their own information in text, with a predefined form and some interview questions. 
2. The system will use judge the values of the contracts based on some (random) rubrics to determine their quality. These prices are stored in the system but not shown to players.
3. Then, the bids will be shown one by one. For each bid, players can offer to buy the contract based on the information given. The highest bidder wins.
4. The values of the bids will be shown; it will be shown whether the bidder made a Win or Loss. Their credits will be deducted; additionally the person who wrote the contract will gain a fixed % of the price (to be adjusted later, right not you can set it to 50%).
5. at the end, a leaderboard is shown; an AI generated summary of the game is shown, based on the bids, values and who bought them.

Please keep the code readable, simplistic, and modularize it so I can easily add new features and make changes later. 
In the README file, kindly do a brief introduction and tell me the instructions to run the project.
thanks!