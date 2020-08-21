import React, { useState, useEffect } from "react";
import "./App.css";

import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import axios from "axios";

function App() {
  const tabs = [
    "all",
    "managers",
    "testers",
    "content",
    "designers",
    "developers",
  ];
  const [activeTab, setActiveTab] = useState("managers");
  const [managersJson, setManagersJson] = useState();
  const [testersJson, setTestersJson] = useState();
  const [contentJson, setContentJson] = useState();
  const [designersJson, setDesignersJson] = useState();
  const [developersJson, setDevelopersJson] = useState();

  useEffect(() => {
    axios
      .get(
        "https://spreadsheets.google.com/feeds/cells/1Z4AbwcBShKFdvWZmgB5ox59GW1MklFAFATxuY4Kv6sU/2/public/full?alt=json"
      )
      .then((res) => {
        setManagersJson(res.data);
      });
    axios
      .get(
        "https://spreadsheets.google.com/feeds/cells/1Z4AbwcBShKFdvWZmgB5ox59GW1MklFAFATxuY4Kv6sU/3/public/full?alt=json"
      )
      .then((res) => {
        setTestersJson(res.data);
      });
    axios
      .get(
        "https://spreadsheets.google.com/feeds/cells/1Z4AbwcBShKFdvWZmgB5ox59GW1MklFAFATxuY4Kv6sU/4/public/full?alt=json"
      )
      .then((res) => {
        setDesignersJson(res.data);
      });
    axios
      .get(
        "https://spreadsheets.google.com/feeds/cells/1Z4AbwcBShKFdvWZmgB5ox59GW1MklFAFATxuY4Kv6sU/5/public/full?alt=json"
      )
      .then((res) => {
        setContentJson(res.data);
      });
    axios
      .get(
        "https://spreadsheets.google.com/feeds/cells/1Z4AbwcBShKFdvWZmgB5ox59GW1MklFAFATxuY4Kv6sU/6/public/full?alt=json"
      )
      .then((res) => {
        setDevelopersJson(res.data);
      });
  }, []);

  const isReady =
    managersJson &&
    testersJson &&
    designersJson &&
    contentJson &&
    developersJson;

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

  const getWorkersToManagers = (managers) => {
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
              manager.gs$cell.col === i.toString() &&
              manager.gs$cell.row !== "1"
          )
          .map((manager) => manager.gs$cell.$t)
      );
    }

    const workersToManagers = workersList.map((worker) => {
      const a = managersToWorkers
        .map((mng) => mng.find((x) => x === worker))
        .map((q, i) => {
          if (typeof q !== "undefined") return managersList[i];
          else return undefined;
        })
        .filter((x) => x !== undefined);
      return { worker, managers: a };
    });
    return workersToManagers;
  };

  let uniqueWorkers = [];

  if (isReady) {
    let allWorkers = [
      ...getWorkersToManagers(managersJson),
      ...getWorkersToManagers(testersJson),
      ...getWorkersToManagers(developersJson),
      ...getWorkersToManagers(contentJson),
      ...getWorkersToManagers(designersJson),
    ].map((worker) => ({
      ...worker,
      worker: worker.worker.trim(),
    }));

    const uniqueWorkersByName = allWorkers.reduce((acc, currentWorker) => {
      const key = currentWorker.worker.trim();
      const worker = acc[key];
      if (worker) {
        const newWorker = {
          ...worker,
          managers: [...worker.managers, ...currentWorker.managers],
        };
        return { ...acc, [key]: newWorker };
      }
      return { ...acc, [key]: currentWorker };
    }, {});
    uniqueWorkers = Object.values(uniqueWorkersByName);
  }

  return (
    <div className="App">
      <header>
        <div>
          {tabs.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}>
              {tab}
            </button>
          ))}
        </div>
      </header>
      {isReady ? (
        activeTab === "all" ? (
          uniqueWorkers.map((wtm) => (
            <React.Fragment key={wtm.worker}>
              <h3>{wtm.worker}</h3>
              {wtm.managers.map((m) => (
                <p key={m}>{m}</p>
              ))}
            </React.Fragment>
          ))
        ) : (
          getWorkersToManagers(managers).map((wtm) => (
            <React.Fragment key={wtm.worker}>
              <h3>{wtm.worker}</h3>
              {wtm.managers.map((m) => (
                <p key={m}>{m}</p>
              ))}
            </React.Fragment>
          ))
        )
      ) : (
        <Loader
          type="Puff"
          color="#00BFFF"
          height={100}
          width={100}
          timeout={3000} //3 secs
        />
      )}
    </div>
  );
}

export default App;
