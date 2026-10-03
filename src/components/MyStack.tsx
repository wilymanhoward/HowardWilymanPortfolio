import HoverLinks from "./HoverLinks";
import "./styles/MyStack.css";

const stack = [
  {
    category: "Game Development",
    main: ["Unity 6", "Unity 2022", "C#", "C++", "C"],
    more: [
      "VR / AR / MR",
      "XR Interaction Toolkit",
      "AR Foundation",
      "Meta Quest 3",
      "Maya",
      "Photoshop",
      "Illustrator",
      "Adobe Audition",
    ],
  },
  {
    category: "Software & App Development",
    main: ["Flutter", "React Native", "React.js", "Node.js"],
    more: ["Firebase (Auth, Firestore, Realtime DB)", "Python", "XML"],
  },
  {
    category: "Other Tools",
    main: ["Tableau", "Photography", "Videography"],
    more: [],
  },
];

const MyStack = () => {
  return (
    <div className="stack-section section-container" id="stack">
      <h2>
        My <span>Stack</span>
      </h2>
      <div className="stack-list">
        {stack.map((group) => (
          <div className="stack-row" key={group.category}>
            <h3>{group.category}</h3>
            <div className="stack-skills">
              <div className="stack-main">
                {group.main.map((item) => (
                  <HoverLinks key={item} text={item} />
                ))}
              </div>
              {group.more.length > 0 && (
                <div className="stack-more">
                  {group.more.map((item) => (
                    <HoverLinks key={item} text={item} />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyStack;
