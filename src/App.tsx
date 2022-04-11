import { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { fakeApi } from "./services/fakeApi";
import axios from "axios";

function App() {
  type Tasks = {
    id: number;
    description: string;
  };

  type CreateTask = {
    id?: number;
    description: string;
  };

  const [tasks, setTasks] = useState<Tasks[]>([]);
  const [taskDescriptionInput, setTaskDescriptionInput] = useState("");
  const [idInput, setIdInput] = useState(0);
  const [activities, setActivities] = useState(" ");
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  async function handleGetActivity() {
    setIsLoadingProfile(true);

    try {
      const typeOfActivity = "recreational";
      const baseUrl = "http://www.boredapi.com/api/activity";

      const response = await fetch(`${baseUrl}?type=${typeOfActivity}`, {
        method: "GET",
      });
      const activities = await response.json();

      setActivities(activities.activity);
    } catch (error) {
      alert(error);
    } finally {
      setIsLoadingProfile(false);
    }
  }

  async function getTasks() {
    const response = await fakeApi.get("tasks");

    const fakeTasks = response.data;

    setTasks(fakeTasks);
  }

  async function createTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data: CreateTask = {
      description: taskDescriptionInput,
    };

    if (!data.description) {
      alert("Please insert a task...");
      return;
    }

    const response = await fakeApi.post("tasks", data);

    const fakeTask = response.data;

    setTasks((previousState) => [...previousState, fakeTask]);
    setTaskDescriptionInput("");
  }

  async function deleteTask(idInput: number) {
    await fakeApi.delete(`tasks/${idInput}`);

    setTasks((previousState) =>
      previousState.filter((task) => task.id !== idInput)
    );
    setIdInput(0);
  }

  useEffect(() => {
    getTasks();
  }, []);

  return (
    <div className="App">
      <header>
        <h1>To Do List</h1>
      </header>
      <body>
        <form onSubmit={createTask}>
          <label htmlFor="task-description"></label>
          <input
            type="text"
            id="task-description"
            value={taskDescriptionInput}
            onChange={(event) => setTaskDescriptionInput(event.target.value)}
          />
          <button id="myButton" type="submit">
            Add tasks
          </button>
        </form>
        <section id="section-tasks">
          <h2 id="title-section-tasks">Tasks to do</h2>
          <ul className="tasks">
            {tasks.map((task) => (
              <li key={task.id}>
                <p>{task.description}</p>
                <button onClick={() => deleteTask(task.id)}>
                  <img
                    src="https://img1.gratispng.com/20180203/afq/kisspng-button-icon-delete-button-png-image-5a756de9bd9403.9092848715176452897765.jpg"
                    height="30"
                    width="30"
                  />
                </button>
              </li>
            ))}
          </ul>
        </section>
        <section id="tasks-extras">
          <h4>Finished your tasks?</h4>
          <h4>Here is a suggested activity for you!</h4>
          {isLoadingProfile && (
            <p>Wait... we're looking for something interesting for you</p>
          )}
          {!isLoadingProfile && <p>{activities}</p>}
          <button id="myButton" onClick={handleGetActivity}>
            New activity
          </button>
        </section>
      </body>
      <footer>By Cecilia Andrea Pesce and Rebeca Baptista</footer>
    </div>
  );
}

export default App;
