import Particles, { initParticlesEngine } from "@tsparticles/react";
import { useEffect, useMemo, useState } from "react";
// import { loadAll } from "@/tsparticles/all"; // if you are going to use `loadAll`, install the "@tsparticles/all" package too.
// import { loadFull } from "tsparticles"; // if you are going to use `loadFull`, install the "tsparticles" package too.
import { loadSlim } from "@tsparticles/slim"; // if you are going to use `loadSlim`, install the "@tsparticles/slim" package too.
// import { loadBasic } from "@tsparticles/basic"; // if you are going to use `loadBasic`, install the "@tsparticles/basic" package too.



const ParticlesComponent = (props) => {

  const [init, setInit] = useState(false);
  // this should be run only once per application lifetime
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
      // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
      // starting from v2 you can add only the features you need reducing the bundle size
      //await loadAll(engine);
      //await loadFull(engine);
      await loadSlim(engine);
      //await loadBasic(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = (container) => {
    console.log(container);
  };


  const options = useMemo(
    () => ({
      background: {
        color: {
          value: "rgb(21, 22, 24)",
        },
      },
      fpsLimit: 120,
      interactivity: {
        events: {
          onClick: {
            enable: true,
            mode: "repulse",
          },
          onHover: {
            enable: true,
            mode: 'grab',
          },
        },
        modes: {
          push: {
            distance: 200,
            duration: 15,
          },
          grab: {
            distance: 150,
          },
        },
      },
      particles: {
        color: {
          value: "#FFFFFF",
        },
        links: {
          color: "#FFFFFF",
          distance: 150,
          enable: true,
          opacity: 0.3,
          width: 1,
        },
        move: {
          direction: "none",
          enable: true,
          outModes: {
            default: "bounce",
          },
          random: true,
          speed: 1,
          straight: false,
        },
        number: {
          density: {
            enable: true,
          },
          value: 150,
        },
        opacity: {
          value: 1.0,
        },
        shape: {
          type: "circle",
        },
        size: {
          value: { min: 1, max: 3 },
        },
      },
      detectRetina: true,
    }),
    [],
  );


  return <Particles id={props.id} init={particlesLoaded} options={options} />; 
};

export default ParticlesComponent;
//  Report Abuse

//  Zero Trust
//  Open Source
//  Encrypted
//  Non Profit
// Paste.Quest - Copy and Paste text online to share with anyone anywhere
// Paste Quest is a service that enables users to post any type of text online for the purpose of making it easier to share. The purpose of the site is to simplify the process of transferring big amounts of text between users of the internet online through the use of links. The best part is that PasteQuest is a free online notepad that's quick & easy to work with and lets you post text.

// While there are many online clipboard sites that could be used to share notes online, we could not find a highly secure and encrypted text sharing site which is secure enough to protect your private data from being stolen in a data breach (hacking attack). This is why, we created Paste Quest, a super safe online text sharing site that is privacy friendly by design and has encryption, password protection and auto-expiration.

// Report Abuse: 

// A Secure Pastebin Alternative
// A pastebin, also known as a text storage site, is a type of online content-hosting service that allows users to store plain text or simply copy paste online. By storing text online, not only its users can easily make the pastes available for any one in need but it also saves a lot of time when you can direct everyone to a single source of text. The use of online text storage like paste.quest can save your time as well as increase your overall productivity with its manageable nature where you can paste links or code.

// When text is published to a paste quest, it is encrypted in your browser and then saved on a secure server. No one, not even us can view your texts unless you post your text's link publicly (along with the password, if one was set). Every submission has its own unique URL, which users may talk about on IRC, in programming-related forums, or on other internet platforms like Facebook or Twitter. Pastebins are used by programmers as a means of exchanging interesting code with one another and of requesting assistance with debugging. IRC (Internet Relay Chat) records can also be posted by users, along with text notes and chats.

// Why use Paste Quest?
// The pasted data is first encrypted on the client side and then uploaded to the server which leaves no way for the server to know what was posted. Similarly, the viewer needs a decryption key to view the encrypted data which is downloaded off the server. Decryption key (part after #) never reaches the server.
// Because big sites getting hacked (e.g. Patreon) and user data (password, emails, chats, etc) getting stolen is becoming more and more common, encryption-first sites like this one are need of the hour because even if the site gets hacked, there would only be tons of garbage (encrypted data that makes no sense). You can send your parents your credit card information using this service without fearing it getting stolen/ logged.

// Accessibility and Manageable:
// No matter how long your texts are, you can always share them with your friends on apps like whatsapp, telegram, messenger, imessage, reddit, discord, chat rooms or be it on any social media or website with the use of a single link. That saves us a lot of hassle with copy pasting.

// Online-Clipboard
// There is a limit to how much you can store in your clipboard and there is a limit to how many different types of topic based texts you can keep on your device's clipboard. With use of paste.quest, this bothersome issue can be easily dealt with. You can create as many clipboards as you want online, all pointed to different links so as to not confuse you. You can reach out to several of your online pasted items and share them just by using a link whenever required.

// To share encrypted information:
// Want to share information secretly? This is your go-to tool to copy paste online. Use the password option to add a password to the pasted information you want to share with your colleage or staffs.

// Paste links online
// You can use our site to share links online, like a pastebin but with the added feature of uploading and sharing images and text files with your friends and family.

// To share code:
// Need to urgently share a piece of source code with a friend at work? You have been covered, use this amazing tool to easily share your code with your friend using a link. The formatting options will help you with your job. The neat formatting of this tool will get you all the praise you deserve.

// Logo
// Paste it! And move ahead. Life's too short but your pastes can be longer.

// Paste Quest
// Legal Notice
// Terms
// Privacy Policy
// About Us
// Blog
// You may like
// Tochato
// MeetYou
// Post images online
// URL Shortener
// Talk to Strangers