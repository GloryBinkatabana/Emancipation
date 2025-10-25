/*COMICS

const comic1 = {
       title: "Playground Justice",
       panels: [
         {
           image: "panel1.svg",
           dialogue: [
             {speaker: "Max", text: "Hey! Stop that!"},
             {speaker: "Bully", text: "Mind your business!"}
           ],
           narration: "Max saw something wrong..."
         },
         // 12 panels total
       ],
       choices: [
         // Panel 8: Reader chooses what hero does
         {
           question: "What should Max do?",
           options: [
             {text: "Get a teacher", outcome: "good", points: 10},
             {text: "Fight back", outcome: "bad", points: 0},
             {text: "Ask others to help", outcome: "great", points: 15}
           ]
         }
       ]
     }

     //TRAINING GAMES

     const scenarios = [
     {
       situation: "Someone pushes in line",
       options: [
         {text: "Push them back", score: 0, feedback: "Violence isn't the answer"},
         {text: "Tell them politely", score: 10, feedback: "Great communication!"},
         {text: "Tell a teacher", score: 8, feedback: "Good! Ask for help"}
       ]
     },
     // 20 scenarios total
   ]

   //HERO CREATOR

    const heroCreator = {
       steps: [
         {
           step: 1,
           question: "Choose your hero's look",
           options: ["hair", "skin", "costume", "accessories"]
         },
         {
           step: 2,
           question: "What's your hero's special power?",
           options: [
             "Super Kindness (makes everyone smile)",
             "Courage Shield (helps scared friends)",
             "Truth Vision (spots unfairness)",
             "Empathy Heart (understands feelings)"
           ]
         },
         {
           step: 3,
           question: "Create your hero name",
           input: "text"
         }
       ]
     }

     //ACHIEVEMENT BADGES

     const badges = [
     {name: "Kindness Cadet", requirement: "Complete 3 missions"},
     {name: "Respect Ranger", requirement: "Perfect score on 5 scenarios"},
     {name: "Inclusion Hero", requirement: "Finish New Kid comic"},
     {name: "Creator Champion", requirement: "Make a hero character"},
     // 20 total badges
   ]