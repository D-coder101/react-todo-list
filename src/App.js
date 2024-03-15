import { useState } from "react";
import "./index.css";

function Button({ children, onClick }) {
  return (
    <button style={{ backgroundColor: "blue" }} onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  const [item, setItem] = useState([]);
  const [sortBy, setSortBy] = useState("input");

  let sortedItems;

  if (sortBy === "input") sortedItems = item;

  if (sortBy === "description")
    sortedItems = item
      .slice()
      .sort((a, b) => a.description.localeCompare(b.description));

  if (sortBy === "done")
    sortedItems = item.slice().sort((a, b) => Number(a.done) - Number(b.done));

  function handleAddItems(item) {
    setItem((items) => [...items, item]);
  }
  function handleDeleteItems(id) {
    setItem((items) => items.filter((item) => item.id !== id));
  }

  function handleToggleItem(id) {
    setItem((items) =>
      items.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item
      )
    );
  }

  function handleClearList() {
    setItem([]);
  }

  return (
    <div className="To-do-list-container">
      <div className="Form-input">
        <FormInput handleAddItems={handleAddItems} />
        <ToDoList
          item={sortedItems}
          onDeleteItems={handleDeleteItems}
          onHandleToggleItem={handleToggleItem}
        />
        <Stats items={item} />
        <ClearListButton onClick={handleClearList}>
          {" "}
          Clear List{" "}
        </ClearListButton>
        <Sort items={sortedItems} sortBy={sortBy} setSortBy={setSortBy} />
      </div>
    </div>
  );
}

function FormInput({ handleAddItems }) {
  const [description, setDescription] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!description) return;

    const newItem = {
      id: crypto.randomUUID(),
      description,
      done: false,
    };

    handleAddItems(newItem);

    setDescription("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Add Task..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}

function ToDoList({ item, onDeleteItems, onHandleToggleItem }) {
  return (
    <div>
      <ul className="list">
        {item.map((items) => (
          <Task
            description={items.description}
            done={items.done}
            onDeleteItems={onDeleteItems}
            onHandleToggleItem={onHandleToggleItem}
            itemId={items.id}
          />
        ))}
      </ul>
    </div>
  );
}

function Task({
  description,
  done,
  onDeleteItems,
  itemId,
  onHandleToggleItem,
}) {
  return (
    <li style={done ? { textDecoration: "line-through" } : {}}>
      <input
        type="checkbox"
        value={done}
        onChange={() => onHandleToggleItem(itemId)}
      />
      {description}
      <Button style={{ float: "right" }} onClick={() => onDeleteItems(itemId)}>
        Delete
      </Button>
    </li>
  );
}

function Stats({ items }) {
  if (!items.length)
    return <h3 className="stats">Start Adding some Tasks to Your List 🚀</h3>;

  const numItems = items.length;
  const numPacked = items.filter((item) => item.done).length;
  const percentage = Math.round((numPacked / numItems) * 100);

  return (
    <div className="stats">
      <h3>
        {percentage === 100
          ? "You've Completed your Tasks, Great Job😀"
          : `You have ${numItems} Tasks on you list, and you've already done ${numPacked} (${percentage}%)`}
      </h3>
    </div>
  );
}

function ClearListButton({ children, onClick }) {
  return (
    <button className="Clear-list-button" onClick={onClick}>
      {children}
    </button>
  );
}

function Sort({ sortBy, setSortBy }) {
  return (
    <div>
      <select
        className="select"
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
      >
        <option value="input">Select by Input Order</option>
        <option value="description">Select by Description</option>
        <option value="done">Select by Done</option>
      </select>
    </div>
  );
}
