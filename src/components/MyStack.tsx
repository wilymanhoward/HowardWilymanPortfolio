import HoverLinks from "./HoverLinks";
import "./styles/MyStack.css";

const stack = [
  {
    category: "Game Development",
    main: ["Unity 6", "Unity 2022", "Unreal Engine 5", "C#", "C++", "C"],
    more: ["VR / AR / MR", "XR Interaction Toolkit", "AR Foundation", "Meta Quest 3"],
  },
  {
    category: "Software & App Development",
    main: ["Flutter", "React Native", "React.js", "Node.js", "JavaScript", "TypeScript"],
    more: ["Firebase (Auth, Firestore, Realtime DB)", "MySQL", "Python", "XML"],
  },
  {
    category: "Design & Animation",
    main: ["Autodesk Maya", "Adobe Animate"],
    more: [
      "Photoshop",
      "Illustrator",
      "Adobe Audition",
      "Adobe Lightroom",
      "Adobe InDesign",
    ],
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
