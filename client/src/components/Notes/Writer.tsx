import React, { useState, useEffect } from "react";
import Typewriter from "typewriter-effect";


const Writer = () => {
  return (
    <div data-aos="fade-up" data-aos-duration="1000">
      <Typewriter
        options={{
          autoStart: true,
          loop: true,
          delay: 20,
          deleteSpeed: 15,
        }}
        onInit={(typewriter) => {
          typewriter
            .typeString("<strong>Dear Diary...<strong/><br>")
            .typeString("This is what i did today")
            .typeString("")
            .pauseFor(2500)
            .deleteChars(24)

            .typeString("I had such a stressful Day")
            .pauseFor(2500)
            .deleteChars(26)

            .typeString("I really want a pony")
            .pauseFor(2500)
            .deleteAll()

            .typeString("<strong>Funny words learnt today<strong/><br>")
            .typeString("Sussy Baka...")
            .pauseFor(2500)
            .deleteChars(13)

            .typeString("Rambunctious")
            .pauseFor(2500)
            .deleteChars(12)

            .typeString("Compunction")
            .pauseFor(2500)
            .deleteAll(11)

            .typeString("<strong>Todo List...<strong/><br>")
            .typeString("Clean the House")
            .pauseFor(2500)
            .deleteChars(15)

            .typeString("Wash the Dishes")
            .pauseFor(2500)
            .deleteChars(15)

            .typeString("Water my Flowers")
            .pauseFor(2500)
            .deleteAll()

            .callFunction(() => {
              console.log("String typed out!");
            })

            .callFunction(() => {
              console.log("All strings were deleted");
            })
            .start();
        }}
      />
      {/*       <Typewriter
        options={{
          autoStart: true,
          loop: true,
        }}
        onInit={(typewriter) => {
          typewriter
            .pauseFor(2900)
            .typeString("This is the body")
            .pauseFor(2500)
            .deleteAll()
            .typeString("This is the second body")
            .pauseFor(2500)
            .deleteAll()
            .typeString("This is the Final body")
            .pauseFor(2500)
            .deleteAll()

            .callFunction(() => {
              console.log("String typed out!");
            })

            .callFunction(() => {
              console.log("All strings were deleted");
            })
            .start();
        }}
      />
 */}{" "}
    </div>
  );
};

export default Writer;
