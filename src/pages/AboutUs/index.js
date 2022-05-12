// import { useState } from "react";

import CollapsibleButton from "../../components/CollapsibleButton";
// import Navbar from "../../components/Navbar";

import "./AboutUs.css";
// import jen from "../../images/jen.png";

function AboutUs() {
  // const [hidden, setHidden] = useState(true);

  return (
    <div className="AboutUs">
      <h2 className="about-us">ABOUT US</h2>
      {/* <Navbar title="About Us" /> */}
      <div className="aboutUs-content">
        {/* <img className="ourPictures" src={jen}/> */}
        <CollapsibleButton
          id="asaniButton"
          text="Asani"
          content="A strong believer in life long learning, coding presented a great opportunity to continuously learn and grow as well as being able to solve some of the many day to day problems that we encounter. After trying out a few online courses and tutorials I realised that I would love to take this interest even further and turn it into a career rather than just a hobby. School of Code has helped to horne my problem solving skills as well as expose me to the many wonders of the world of software engineering and I can not wait to explore and grow as an individual and an engineer."
        />
        <CollapsibleButton
          id="cigdemButton"
          text="Cigdem"
          content="An analytical, bright, and versatile Software Engineer with a passion for software, coding and its capacity to solve real issues, making life easier and better for businesses and people around the world. Continuously learning, I am educated to Masters level, am currently studying at the School of Code to refresh my skillset after a lengthy career break, to prepare myself for a new, exciting engineering role as part of a thriving organisation. Strong communication and relationship skills complement high levels of organisational agility, a positive and resilient attitude and a commitment to always giving my best and supporting colleagues."
        />
        <CollapsibleButton
          id="dovButton"
          text="Dov"
          content="I'm a life-long learner, who is on a good start. I want to be part of a team and solve problems. I always had a strong interest in technology, the great outdoors, cycling and cars."
        />
        <CollapsibleButton
          id="jallowButton"
          text="Jallow"
          content="Hello, My name is Mohammed Adam. I am a self motivated person, constantly learning new things and on self improvement. Motivated by new challenges and problem solving. I have always been excited and fascinated about the field of software development and lifecycle. I have excellent communication and servant leadership skills. I have a strong understanding of technical processes within software development and lifecycle. I stay up-to-speed with innovative technologies and test the promising ones to make sure I do not miss game-changing opportunities to boost productivity and stay relevant. "
        />
        <CollapsibleButton
          id="jennyButton"
          text="Jenny"
          content="Prior to applying for the School of Code my background was an English Literature Degree from University of Wales, Aberystwyth, followed by a career as a chef and then in project management. Project management appealed to me because it is logical and can be exiting, but I had little chance to create anything. Knowing I needed a change once my maternity leave ended, I was thrilled to be accepted to the School of Code, and I have gone from knowing no code, to being able to create the front and back end of applications, design them, work following Agile methodologies, and practice pair programming, all in just 16 weeks. I can not wait to see what more I can learn in my new career in tech! "
        />
        <CollapsibleButton
          id="rikiahButton"
          text="Rikiah"
          content="Hi there, My Name is Rikiah Williams. I recently graduated from the School of Code as Full Stack Developer, my passion for code comes from my love for technology with code being the universal language between all machines. I thought why not merge them together and have the power to create. I have a range of experience in several fields from being a regional manager in cyber security to working as an investigator in the police. I'd love to be a digital nomad as I'm a great people person and love to have the solutions to the problems you haven't encountered yet."
        />
      </div>
    </div>
  );
}

export default AboutUs;
