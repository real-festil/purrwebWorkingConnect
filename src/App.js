import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import managersJson from "./tableManager.json";
import testersJson from "./tableTesters.json";
import contentJson from "./tableContent.json";
import designersJson from "./tableDesigners.json";
import developersJson from "./tableDevelopers.json";

function App() {
  const tabs = ["managers", "testers", "content", "designers", "developers"];
  const [activeTab, setActiveTab] = useState("managers");

  let managers;
  switch (activeTab) {
    case "managers":
      managers = managersJson;
      break;
    case "testers":
      managers = testersJson;
      break;
    case "content":
      managers = contentJson;
      break;
    case "developers":
      managers = developersJson;
      break;
    case "designers":
      managers = designersJson;
      break;
    default:
      break;
  }

  const managersList = managers.feed.entry
    .filter((manager) => manager.gs$cell.row === "1")
    .map((manager) => manager.gs$cell.$t);

  const workersList = managers.feed.entry
    .filter((manager) => manager.gs$cell.row !== "1")
    .map((manager) => manager.gs$cell.$t)
    .filter((v, i, a) => a.indexOf(v) === i);

  const managersLength = managers.feed.entry.filter(
    (manager) => manager.gs$cell.row === "1"
  ).length;

  const managersToWorkers = [];
  for (let i = 1; i < managersLength + 1; i++) {
    managersToWorkers.push(
      managers.feed.entry
        .filter(
          (manager) =>
            manager.gs$cell.col === i.toString() && manager.gs$cell.row !== "1"
        )
        .map((manager) => manager.gs$cell.$t)
    );
  }

  const workersToManagers = workersList.map((worker) => {
    const a = managersToWorkers
      .map((mng) => mng.find((x) => x === worker))
      .map((q, i) => {
        if (typeof q !== "undefined") return managersList[i];
      })
      .filter((x) => x !== undefined);
    return { worker, managers: a };
  });

  return (
    <div className="App">
      <header>
        <div>
          {tabs.map((tab) => (
            <button onClick={() => setActiveTab(tab)}>{tab}</button>
          ))}
        </div>
      </header>
      {workersToManagers.map((wtm) => (
        <>
          <h3>{wtm.worker}</h3>
          {wtm.managers.map((m) => (
            <p>{m}</p>
          ))}
        </>
      ))}
    </div>
  );
}

export default App;
