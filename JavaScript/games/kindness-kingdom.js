/*
const story1 = {
     title: "Lulu and the Lost Toy",
     scenes: [
       {
         image: "lulu-scene1.svg",
         text: "Lulu found a toy that wasn't hers",
         narration: "audio/lulu-1.mp3",
         duration: 5000
       },
       // 8-10 scenes total
     ],
     lesson: "Sharing makes everyone happy",
     reflectionQuestion: "How do you feel when you share?"
   }

   // Game mechanics
   let toys = ["ball", "doll", "car", "puzzle"];
   let friends = ["anna", "ben", "carla", "danny"];
   
   function dragToy(toy, friend) {
     if (toy.matches(friend.preference)) {
       playSound("happy-cheer.mp3");
       addStar();
     }
   }
 