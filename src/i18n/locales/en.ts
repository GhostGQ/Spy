/** English translations. Keep keys in sync with ru.ts. */
const en = {
  menu: {
    title: 'SPY',
    subtitle: 'Find the one who doesn’t know the word',
    play: 'Play',
    rules: 'Rules',
    settings: 'Settings',
    tagline: 'Local game · 3–12 players · one device',
  },

  settings: {
    title: 'Settings',
    sound: 'Sound',
    haptics: 'Vibration',
    hints: 'Hints for the spy',
    language: 'Language',
    languageRu: 'Русский',
    languageEn: 'English',
    legalSection: 'Legal',
    terms: 'Terms of Use',
    privacy: 'Privacy Policy',
    aboutTitle: 'About',
    aboutBody:
      '“Spy” is a local party game for a group. Version 1.0.0. Pass the device around the circle and have fun!',
  },

  rules: {
    title: 'Rules',
    goalTitle: 'Goal',
    goalBody:
      "One secret word is chosen. Civilians know it; the spies don't. During the discussion, civilians try to expose the spies without giving the word away, while the spies try to blend in, work out the word, and avoid getting caught. The whole game runs on a single device passed around the circle.",
    howToPlayTitle: 'How to play',
    howToPlayBody:
      "Pass the device around the circle. Each player opens their card, memorizes their role and word, hides it, and passes the phone on. Once everyone has seen their card, the discussion begins: players take turns asking each other questions about the secret word and answering them. Answer so that your fellow civilians can tell you know the word, but the spy can't figure out what it is. When the timer runs out, everyone votes for a suspect together.",
    rolesTitle: 'Roles',
    roleCivilianTitle: 'Civilian',
    roleCivilianBody:
      'Knows the secret word. Asks leading questions and answers in a way that convinces the other civilians they are one of them — without handing the word to the spy. Wins once all spies are exposed.',
    roleSpyTitle: 'Spy',
    roleSpyBody:
      "Does not know the word. Tries not to give themselves away, to deduce the word from others' answers, and to deflect suspicion during the vote. Wins by staying undetected to the end (and, in some modes, by guessing the word).",
    stagesTitle: 'Stages',
    stagesBody:
      '1. Setup — choose the mode, number of players, number of spies, and word categories.\n2. Role deal — the device goes around the circle; everyone secretly views their card.\n3. Discussion — the timer runs; players ask and answer questions.\n4. Voting — everyone picks a suspect together; whoever gets the majority reveals their role.\n5. Results — the screen shows who was who and what the word was.',
    constraintsTitle: 'Rules & limits',
    constraintsBody:
      "• Never say the secret word out loud — it hands it straight to the spy.\n• Keep questions and answers indirect: clear to your side, but not obvious to the spy.\n• Everyone answers for themselves — you can't speak for another player.\n• 3 to 12 players; you set the number of spies at setup (in “Chaos” it's hidden and random).\n• Players decide the winner themselves on the results screen — the app doesn't track the discussion.",
    modesTitle: 'Modes',
    minPlayers: 'Minimum players: {{count}}',
  },

  setup: {
    title: 'New game',
    subtitle: 'Set up the round',
    modeLabel: 'Mode',
    basicModesLabel: 'Basic modes',
    exclusiveModesLabel: 'Exclusive modes',
    playersLabel: 'Players',
    playersCount: 'Number of players',
    additionalLabel: 'Advanced',
    chaosNote:
      'In “Chaos” mode the number of spies is hidden and decided randomly at the start.',
    ghostClassic: 'Classic ghost',
    spies: 'Spies',
    next: 'Choose category',
  },

  modes: {
    classic: {
      title: 'Classic',
      short: 'Civilians know the word, spies don’t',
      description:
        'All civilians see one secret word. The spies don’t know it and try not to give themselves away during the discussion. You set the number of spies yourself.',
      specialCount: 'Spies',
    },
    chaos: {
      title: 'Chaos',
      short: 'Spy count is hidden and random',
      description:
        'Like classic, but the number of spies isn’t known in advance — it’s decided randomly at the start. There can even be more spies than civilians.',
      specialCount: 'Spies',
    },
    ghost: {
      title: 'Ghost',
      short: 'Ghosts don’t know they are ghosts',
      description:
        'Everyone thinks they are a civilian. Ghosts see a similar but different word — and don’t know they are ghosts. The majority’s task is to find those who are talking “about the wrong thing”.\n\n“Classic ghost” mode: toggled on in the setup. In addition to ordinary spies (who know their role but not the word), one secret ghost with a fake word is added. Civilians look for both the spies and the ghost at once.',
      specialCount: 'Ghosts',
    },
    syndicate: {
      title: 'Syndicate',
      short: 'Spies know each other and play as a team',
      description:
        "Like Classic, but the spies form a syndicate: each spy sees their teammates on their own card. They still don't know the secret word, but they can coordinate, cover for one another, and steer civilians off the trail. A syndicate needs at least two spies. The majority must uncover the whole team.",
      specialCount: 'Spies',
    },
    detective: {
      title: 'Detective',
      short: 'A detective is among you, on the hunt',
      description:
        'Like classic, but one civilian is secretly the detective. On their card they see whether one random player is a spy. The detective must not give themselves away — if the spies figure out who the detective is, they win automatically.',
      specialCount: 'Spies',
    },
  },

  winners: {
    civilians: 'Civilians win',
    spies: 'Spies win',
    majority: 'Majority wins',
    ghosts: 'Ghosts win',
    skip: 'Skip',
    detectiveCaught: 'Spies exposed the detective',
  },

  categories: {
    title: 'Category',
    subtitle: 'Tap to select · hold for words',
    wordsShort: 'words',
    comingSoon: 'Coming soon',
    selectedLabel: 'Categories selected: ',
    needWord: 'Enable at least one word from the category',
    needCategory: 'Select at least one category',
    start: 'Start game',
    locations: 'Locations',
    food: 'Food',
    cities: 'Cities',
    professions: 'Professions',
    relationships: 'Relationships',
    games: 'Games',
    movies: 'Movies',
    brands: 'Brands',
    anime: 'Anime',
    game_characters: 'Game Characters',
    historical_figures: 'Historical Figures',
    celebrities: 'Celebrities',
  },

  category: {
    subtitle: '{{enabled}}/{{total}} words in play',
    markWords: 'Mark the words for the game',
    selectAll: 'Select all',
    deselectAll: 'Deselect all',
  },

  roles: {
    notDealt: 'Roles haven’t been dealt yet.',
    toSetup: 'Back to setup',
    hintReveal: 'Tap the card to reveal your role',
    hintLast: 'Tap again to start the discussion',
    hintNext: 'Tap again to hide and pass on',
    playerOf: 'Player {{current}} of {{total}}',
    player: 'Player {{number}}',
    civilian: 'Civilian',
    spy: 'Spy',
    ghost: 'Ghost',
    detective: 'Detective',
    teammates: 'Your team:',
    detectiveTipSpy: 'Player {{number}} is a spy.',
    detectiveTipCivilian: 'Player {{number}} is not a spy.',
    youAreSpy: 'You are a spy',
    hintCivilian:
      "Don't say the word out loud. Listen to the others and try to spot who doesn't know it.",
    hintSpy:
      "Listen to the discussion and try to guess the word without giving away that you don't know it.",
    hintDetective:
      "Use your tip to find the spy, but don't give away that you're the detective.",
    readyTitle: 'Everyone ready?',
    readyBody: 'Once every player has seen their role, you can start the discussion.',
    startGame: 'Start game',
  },

  timer: {
    title: 'Discussion',
    subtitle: 'How long is the round?',
    quickPick: 'Quick pick',
    minShort: 'min',
    minutes_one: 'minute',
    minutes_other: 'minutes',
    start: 'Start discussion',
    pauseTitle: 'Pause',
    pauseSubtitle: 'Timer stopped',
    resume: 'Resume game',
    finish: 'Finish game',
    exitTitle: 'Exit to menu?',
    exitBody: 'The current round will be interrupted with no results.',
    stay: 'Stay',
    toMenu: 'To main menu',
    hintsTitle: 'Question hints',
  },

  hintQuestions: {
    locations: [
      'How do you usually get there?',
      'What time of day is it busiest?',
      'What do people mostly do there?',
      'Is it more of an indoor or outdoor place?',
      'Do you like going there?',
      'Do people often bring kids there?',
      'Is it a place you stay at for a while or just pass through?',
      'Do you need to pay to enter?',
      'Is it more for leisure or for errands?',
      'Is it usually noisy or quiet?',
    ],
    food: [
      'Is it eaten hot or cold?',
      'What time of day is it usually eaten?',
      'Can you make it at home?',
      'Is it sweet or savory?',
      'Would you order it at a restaurant?',
      'Is it eaten with your hands or with utensils?',
      'Is it spicy?',
      'Is it something festive or everyday?',
      'Can you buy it at a store?',
      'Is it easy to confuse with something similar?',
    ],
    cities: [
      'Would you like to visit it?',
      'Is it far from here?',
      "What's worth seeing or trying there?",
      "What's the weather like there?",
      'Is it a popular tourist destination?',
      'Is the city big or small?',
      'Do people speak a different language there?',
      'Is the city by the sea?',
      'Is it easy to reach by plane?',
      'Is the city known for a particular landmark?',
    ],
    professions: [
      'Does this job require a degree?',
      'Does this person work with people or alone?',
      'Is this profession well paid?',
      'Can this job be done remotely?',
      'Would you want this profession?',
      'Is this job risky?',
      'Does it require a special uniform?',
      'Is it more about creativity or precision?',
      'Is this job usually done indoors?',
      'Is this profession rare or common?',
    ],
    relationships: [
      'Is it more about joy or hardship?',
      'Does it happen early in a relationship or later?',
      'Does it involve two people or more?',
      'Is it usually talked about openly or kept private?',
      'Would you call it romantic?',
      'Does it happen more in youth or in adult life?',
      'Can it cause conflict?',
      'Is it something people discuss with friends?',
      'Is it related to commitment?',
      'Would you call it unexpected?',
    ],
    games: [
      'Do you play it alone or with friends?',
      'Does it require a device?',
      'Does it require physical activity?',
      'Do kids or adults mostly play it?',
      'Would you call it competitive?',
      'Can you play it online?',
      'Does it have clear rules?',
      'Does it take a lot of time?',
      'Is it good for a big group?',
      'Did you play it as a kid?',
    ],
    movies: [
      'Is it more funny or serious?',
      'Have you watched something similar recently?',
      'Is it for the whole family or for adults?',
      'Is it a long movie?',
      'Would you recommend it to a friend?',
      'Is it part of a series?',
      'Is there one main character or several?',
      'Is it set in our time or another era?',
      'Has it won any awards?',
      'Would you watch it again?',
    ],
    brands: [
      'Is it something you can wear?',
      'Is it an expensive brand?',
      'Do you use this brand?',
      'Is it known worldwide?',
      'Is it more about technology or clothing?',
      'Has this brand existed for a long time?',
      'Does it have a signature color or logo?',
      'Can you buy it online?',
      'Is it associated with luxury?',
      'Do you own something from this brand?',
    ],
    anime: [
      'Is it about school or adventure?',
      'Are there a lot of characters?',
      'Is it a long series?',
      'Do you like this genre?',
      'Is it something new or a classic?',
      'Is the main character human?',
      'Is it set in the real world or a fantasy one?',
      'Is it a recent anime or an older one?',
      'Is there a romantic storyline?',
      'Would you recommend it to a friend?',
    ],
    game_characters: [
      'Is this character good or evil?',
      'Do they have special abilities?',
      'Are they from an old game or a new one?',
      'Have you played as this character?',
      'Are they human or not?',
      'Is this character a main hero or a side character?',
      'Do they have a recognizable look?',
      'Do they appear in multiple games?',
      'Can this character fly or use magic?',
      'Do you like this character?',
    ],
    historical_figures: [
      'Did this person live long ago?',
      'Are they known for achievements or actions?',
      'Did you learn about them at school?',
      'Are they connected to science, art, or politics?',
      'Are they from our country or another?',
      'Have movies or books been made about them?',
      'Were they a leader?',
      'Is their name still mentioned often?',
      'Did they live in peaceful times or during conflicts?',
      'Do you see this person as positive or controversial?',
    ],
    celebrities: [
      'Is this person connected to music, movies, or sports?',
      'Do you follow this person on social media?',
      'Is this a modern figure or from the past?',
      'Have you seen this person in an interview?',
      'Do you like this person?',
      'Are they from our country or another?',
      'Do they have a large social media following?',
      'Have they been famous for a long time or recently?',
      'Have they appeared with other famous people?',
      'Would you want to see them in person?',
    ],
  },

  result: {
    title: 'Who won?',
    subtitle: 'The discussion is over. Choose the round’s outcome.',
  },

  summary: {
    title: 'Round results',
    noWinner: 'No winner chosen',
    mode: 'Mode',
    category: 'Category',
    secretWord: 'Secret word',
    ghostWord: 'Ghosts’ word',
    playersRoles: 'Player roles',
    playAgain: 'Play again',
    mainMenu: 'Main menu',
  },

  legal: {
    appName: 'Spy',
    effectiveDate: 'Effective date: {{date}}.',
    terms: {
      title: 'Terms of Use',
      intro:
        'These Terms of Use govern the use of the mobile application “{{app}}” (the “App”), the rights to which are held by {{developer}} (the “Developer”).',
      s1title: '1. Acceptance of terms',
      s1body:
        'By installing, opening or using the App, you confirm that you have read, understood and agree to comply with these Terms. If you do not agree with any provision, please do not use the App.',
      s2title: '2. Service description',
      s2body:
        '“{{app}}” is a local offline game for a group. Players pass one device around the circle, take turns viewing their role and word, then discuss and try to identify the spy. The App runs entirely on the device and requires no internet connection, registration or account.',
      s3title: '3. License to use',
      s3body:
        'The Developer grants you a limited, personal, non-exclusive, revocable and non-transferable license to use the App for personal, non-commercial purposes. You may not sell, rent, distribute or otherwise transfer the App to third parties.',
      s4title: '4. Intellectual property',
      s4body:
        'The App, its name, source code, design, graphics, task texts and other materials are the intellectual property of the Developer and are protected by applicable law. All rights not expressly granted to you are reserved by the Developer.',
      s5title: '5. Acceptable use',
      s5body:
        'You agree not to use the App for any unlawful purpose, not to attempt to decompile, modify, hack or otherwise interfere with its operation, and not to violate the rights of others while using it.',
      s6title: '6. Disclaimer of warranties',
      s6body:
        'The App is provided on an “as is” and “as available” basis, without warranties of any kind, express or implied. The Developer does not guarantee uninterrupted, error-free or secure operation of the App.',
      s7title: '7. Limitation of liability',
      s7body:
        'To the maximum extent permitted by law, the Developer shall not be liable for any direct, indirect, incidental or other damages arising from the use of or inability to use the App.',
      s8title: '8. Changes to the terms',
      s8body:
        'The Developer may update these Terms from time to time. The current version is published in the App. By continuing to use the App after changes are made, you agree to the updated Terms.',
      s9title: '9. Governing law',
      s9body:
        'These Terms are governed by and construed in accordance with the laws of {{jurisdiction}}, without regard to conflict-of-law rules.',
      s10title: '10. Contact',
      s10body:
        'For questions regarding these Terms, you can contact the Developer at: {{email}}.',
    },
    privacy: {
      title: 'Privacy Policy',
      intro:
        'This Privacy Policy describes how the mobile application “{{app}}” (the “App”), developed by {{developer}} (the “Developer”), handles user data.',
      s1title: '1. General provisions',
      s1body:
        'We respect your privacy. This Policy explains what data the App uses and how it is stored. By using the App, you agree to the terms of this Policy.',
      s2title: '2. What data we collect',
      s2body:
        'The App does not collect or request personal data. Using “{{app}}” requires no registration, account, email address or access to your contacts, location, camera or microphone.',
      s3title: '3. Local data storage',
      s3body:
        'The App stores only user settings (such as sound and vibration) and the last selected game categories. This data is stored exclusively locally on your device and does not leave it, nor is it transmitted to the Developer or third parties.',
      s4title: '4. Transfer of data to third parties',
      s4body:
        'We do not transfer any data to third parties. The App does not use servers, analytics systems, ad networks or third-party SDKs to collect data.',
      s5title: '5. Device permissions',
      s5body:
        'The App uses only haptic feedback (vibration) for interface responses, and it can be turned off in the settings. Access to the camera, microphone, location, contacts and other sensitive data is not requested.',
      s6title: '6. Children',
      s6body:
        'The App is suitable for family use. Since no personal data is collected, using the App does not involve processing information about children.',
      s7title: '7. Data deletion',
      s7body:
        'All saved settings are stored locally. Deleting the App from your device automatically and irreversibly erases all related local data.',
      s8title: '8. Changes to the policy',
      s8body:
        'The Developer may update this Policy from time to time. The current version is always available in the App. By continuing to use the App, you agree to the updated Policy.',
      s9title: '9. Contact',
      s9body:
        'For any questions regarding this Privacy Policy, you can contact the Developer at: {{email}}.',
    },
  },

  purchase: {
    locked: 'Locked',
    unlock: 'Unlock',
    unlockAll: 'Unlock all categories',
    restorePurchases: 'Restore purchases',
    restoreSuccess: 'Purchases restored',
    restoreError: 'Failed to restore purchases',
    loading: 'Loading…',
    error: 'Purchase failed',
    fullAccessTitle: 'Full access',
    fullAccessTagline: 'The whole game — now and forever',
    fullAccessCategories: 'All word categories',
    fullAccessModes: 'All exclusive game modes',
    fullAccessFuture: 'Every future category and mode',
    fullAccessForever: 'One-time purchase — yours forever',
    activate: 'Activate',
    activated: 'Activated',
    unlockFullAccess: 'Unlock full access',
    fullAccessSavings: 'Cheaper than buying each category separately',
    saleEndsIn: 'Offer ends in {{time}}',
  },
};

export default en;
