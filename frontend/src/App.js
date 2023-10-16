import React, { useState, useEffect } from "react";
import Contact from "./components/Contact";

function App() {
  const host = "http://localhost:5000/api";
  const [contacts, setContacts] = useState([]);
  const [newContactName, setNewContactName] = useState("");
  const [render, setRender] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [showCount, setShowCount] = useState({});
  
  const [newestContactTimestamp, setNewestContactTimestamp] = useState(null);
  const [oldestContactTimestamp, setOldestContactTimestamp] = useState(null);
  
  const handleCreateContact = () => {
    if (newContactName === "") {
      return;
    }

    fetch(`${host}/contacts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: newContactName }),
    })
      .then((response) => response.json())
      .then(() => {
        setNewContactName("");
        setRender(!render);
        fetch(`${host}/getCount`)
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            setShowCount(data);
          })
          .catch((error) => console.error("Error fetching contact count:", error));
      })
      .catch((error) => console.error("Error creating contact:", error));
  };

  useEffect(() => {
    // Fetch contacts from your API
    const fetchData = async () => {
      try {
        const response = await fetch(`${host}/contacts`);
        const data = await response.json();
        setContacts(data);

        // Extract timestamps and find the newest and oldest
        const timestamps = data.map((contact) => new Date(contact.createdAt));
        const newestTimestamp = new Date(Math.max(...timestamps));
        const oldestTimestamp = new Date(Math.min(...timestamps));

        setNewestContactTimestamp(newestTimestamp.toISOString()); // Format as needed
        setOldestContactTimestamp(oldestTimestamp.toISOString()); // Format as needed
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };
    fetchData();
  }, [render]);

  const handleShow = () => {
    setShowStatus(!showStatus);
    const fetchData = async () => {
      try {
        const response = await fetch(`${host}/getCount`);
        const data = await response.json();
        console.log(data);
        setShowCount(data);
      } catch (error) {
        console.error("Error fetching contact count:", error);
      }
    };
    fetchData();
  };

  return (
    <div className="App flex flex-col align-items-center">
      <div className="my-3 text-xl font-semibold">Contactor</div>
      <div style={{ minWidth: '490px' }} className="flex flex-col align-items-center rounded border-2 border-black ">
        <div className="py-3 text-lg font-medium">Contacts</div>
        <input
          type="text"
          placeholder="Name"
          value={newContactName}
          onChange={(e) => setNewContactName(e.target.value)}
        />
        <button onClick={handleCreateContact} className="my-3 px-2 py-1 text-base rounded bg-green-500">
          Create contact
        </button>
        <div className="flex w-full">
          <div className="mx-2 w-full">
            <div className="border-t-2 border-black p-1 w-full"></div>
            {contacts.map((contact, index) => (
              <Contact
                key={index}
                contact={contact}
                render={render}
                setRender={setRender}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4">
        <button onClick={handleShow} className="px-2 py-1 rounded bg-green-500">show status</button>
      </div>

      {showStatus ? (
  <div className="mt-4 rounded border-2 border-black">
    <div className="p-3">
      <div className="flex justify-center">
        <div>Number of contacts</div>
      </div>
      <div className="flex justify-center">
        <div>{showCount.contactCount}</div>
      </div>
      <div className="flex justify-center">
        <div>Number of phones</div>
      </div>
      <div className="flex justify-center">
        <div>{showCount.phoneCount}</div>
      </div>
      <div className="flex justify-center">
        <div>Newest Contact timestamp</div>
      </div>
      <div className="flex justify-center">
        <div className="py-2">{newestContactTimestamp}</div>
      </div>
      <div className="flex justify-center">
        <div>Oldest Contact timestamp</div>
      </div>
      <div className="flex justify-center">
        <div className="py-2">{oldestContactTimestamp}</div>
      </div>
    </div>
  </div>
) : <></>}

    </div>
  );
}

export default App;
