/* REAL SCENARIO
const scenario = {
       title: "The Group Chat",
       format: "phone-simulation",
       story: [
         {
           type: "message",
           from: "Alex",
           text: "Did you see what Maya wore today? LOL",
           timestamp: "3:45 PM"
         },
         {
           type: "message",
           from: "Jordan",
           text: "Yeah so weird haha",
           timestamp: "3:46 PM"
         },
         {
           type: "choice",
           prompt: "What do you do?",
           options: [
             {
               text: "Join in the laughing",
               consequence: "negative",
               outcome: "The bullying continued and Maya saw the messages. She felt terrible."
             },
             {
               text: "Say 'That's mean, stop it'",
               consequence: "positive",
               outcome: "Your friends realize they were being hurtful and apologize."
             },
             {
               text: "Leave the group and tell a trusted adult",
               consequence: "best",
               outcome: "You protected Maya and helped stop cyberbullying."
             },
             {
               text: "Say nothing",
               consequence: "passive",
               outcome: "The bullying continued. Silence can hurt too."
             }
           ]
         }
       ],
       reflection: {
         question: "Why is online kindness important?",
         answer_type: "text-input",
         min_words: 15
       }
     }

     //RHYTHM & MUSIC GAMES 

     const consentGame = {
       type: "rhythm-tap",
       song: "consent-song.mp3",
       bpm: 120,
       beats: [
         {time: 1.0, note: "Ask", key: "A"},
         {time: 1.5, note: "Listen", key: "L"},
         {time: 2.0, note: "Respect", key: "R"},
         {time: 2.5, note: "Answer", key: "A"}
       ],
       phrases: [
         "Can I borrow this?",
         "Is this okay?",
         "What do you think?",
         "I respect your choice"
       ]
     }

     //RANGERS RADIO 
     const podcast = {
       episode: 1,
       title: "I Stood Up to a Bully",
       duration: 420, // seconds
       audio: "rangers-radio-ep1.mp3",
       transcript: "...", // Full text
       discussion_questions: [
         "Have you ever seen bullying?",
         "What would you do differently?",
         "Who are your trusted adults?"
       ]
     }

     //ASK ANYTHING (Anonymous Q&A)
      const askAnything = {
    form: {
      question: "text-area",
      category: ["Family", "Friends", "School", "Body", "Feelings", "Safety"],
      anonymous: true
    },
    moderation: {
      // In real app: sends to moderator
      // For hackathon: pre-written FAQ responses
    },
    faq: [
      {
        question: "What if someone touches me inappropriately?",
        answer: "Tell a trusted adult immediately. It's NEVER your fault...",
        resources: ["crisis-hotline", "trusted-adult-list"]
      },
      // 50+ pre-written FAQs
    ]
  }

  //REFLECTION & TRACKING
  const progressTracker = {
  skills: {
    empathy: {
      level: 75,
      activities: ["Completed 8 scenarios", "Asked 3 questions", "Created 1 story"]
    },
    courage: {
      level: 60,
      activities: ["Stood up in 5 scenarios", "Shared 1 personal story"]
    },
    wisdom: {
      level: 80,
      activities: ["Perfect score on 4 scenarios", "Listened to 6 podcasts"]
    }
  },
  badges: ["Bystander Hero", "Digital Safety Expert", "Consent Champion"],
  nextGoal: "Complete 3 more scenarios to level up Courage"
 }

 //