import React, { useState, useEffect } from "react";
import Contact from "./components/Contact";
import './index.js';
import './App.css';

function App() {
  const host = "http://localhost:5000/api";
  const [contacts, setContacts] = useState([]);
  const [newContactName, setNewContactName] = useState("");
  const [render, setRender] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [showCount, setShowCount] = useState({});

  const [newestContactTimestamp, setNewestContactTimestamp] = useState(null);
  const [oldestContactTimestamp, setOldestContactTimestamp] = useState(null);

  // State to manage temporary images and timing
  const [createContactImage, setCreateContactImage] = useState(null);
  const [deleteContactImage, setDeleteContactImage] = useState(null);

  const handleCreateContact = () => {
    if (newContactName === "") {
      return;
    }

    // Display a temporary image when creating a contact
    setCreateContactImage("https://media.giphy.com/media/urHYyRzWHRxDoY7yqp/giphy.gif");
    setTimeout(() => {
      setCreateContactImage(null);
    }, 3000);

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
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${host}/contacts`);
        const data = await response.json();
        setContacts(data);

        const timestamps = data.map((contact) => new Date(contact.createdAt));

        const formatTimestamp = (timestamp) => {
          const options = {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
            timeZone: 'Australia/Sydney',
          };
          return new Intl.DateTimeFormat("en-AU", options).format(timestamp);
        };

        const newestTimestamp = formatTimestamp(new Date(Math.max(...timestamps)));
        const oldestTimestamp = formatTimestamp(new Date(Math.min(...timestamps)));

        setNewestContactTimestamp(newestTimestamp);
        setOldestContactTimestamp(oldestTimestamp);
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
  }

  // Default image URL
  const defaultImageUrl = "https://media.giphy.com/media/2GVbnYUArrolt3f1sA/giphy.gif";

  // Use createContactImage and deleteContactImage instead of imageUrl
  const imageUrl = createContactImage || deleteContactImage || defaultImageUrl;

  return (
    <div className="App flex flex-col items-center" style={{ backgroundColor: '#FFFFCC', margin: '20px' }}>
      <div className="my-3 text-xl font-semibold" style={{ color: '#F2ABB3', fontSize: '72px', margin: '52px', marginBottom: '5px' }}>Contactor</div>
      <div className="my-3 text-xl font-semi" style={{ color: '#F2ABB3', fontSize: '28px', margin: '30px', marginBottom: '65px' }}>Stay in touch Smartly and Effectively ❤️ !</div>
      <div style={{ minWidth: '490px', backgroundColor: '#FFE1E6', borderColor: '#75BFB2', borderWidth: '3px', marginBottom: '30px' }} className="flex flex-col items-center rounded border-2">
        <div className="py-3 text-lg font-semibold" style={{ color: '#75BFB2', fontSize: '42px', margin: '15px', marginBottom: '5px' }}>Contacts</div>
        {createContactImage || deleteContactImage ? (
          <img src={imageUrl} alt="Temporary Image" width="250" height="250" />
        ) : (
          <img src={defaultImageUrl} alt="Default Image" width="250" height="250" />
        )}

        <input
          type="text"
          placeholder="  Name"
          style={{ minWidth: '250px', borderWidth: '1.5px', borderColor: '#FF6961'}}
          value={newContactName}
          onChange={(e) => setNewContactName(e.target.value)}
        />
        <button onClick={handleCreateContact} className="my-3 px-2 py-1 text-base rounded" style={{ backgroundColor: '#75BFB2', color: '#FFFFFF', boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)' ,margin: '20px', marginBottom: '15px' }}>
          <span>Create contact</span>
        </button>
        <div className="flex w-full">
          <div className="mx-2 w-full" style={{ marginBottom: '12px' }}> 
            <div className="border-t-2 p-1 w-full" style={{ borderColor: '#F2ABB3', marginBottom: '10px' }}></div>
            {contacts.map((contact, index) => (
              <Contact
                key={index}
                contact={contact}
                render={render}
                setRender={setRender}
                setDeleteContactImage={setDeleteContactImage}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4">
        <button onClick={handleShow} className="px-2 py-1 rounded" style={{ backgroundColor: '#F2ABB3', color: '#FFFFFF' }}>show status</button>
      </div>

      {showStatus ? (
        <div className="mt-4 rounded border-2" style={{ borderColor: '#F2ABB3' }}>
          <div className="p-3" style={{ background:'#FFFFFF' }} >
            <div className="flex justify-center">
              <div style={{ color: '#C13346' }}>Number of contacts</div>
            </div>
            <div className="flex justify-center">
              <div>{showCount.contactCount}</div>
            </div>
            <div className="flex justify-center">
              <div style={{ color: '#C13346' }}>Number of phones</div>
            </div>
            <div className="flex justify-center">
              <div>{showCount.phoneCount}</div>
            </div>
            <div className="flex justify-center">
              <div style={{ color: '#C13346' }}>Newest Contact timestamp</div>
            </div>
            <div className="flex justify-center">
              <div className="py-2">{newestContactTimestamp}</div>
            </div>
            <div className="flex justify-center">
              <div style={{ color: '#C13346' }}>Oldest Contact timestamp</div>
            </div>
            <div className="flex justify-center">
              <div className="py-2">{oldestContactTimestamp}</div>
            </div>
          </div>
        </div>
      ) : <></>}
      {/* Add swipe-up image */}
      <img
        className="swipe-up"
        src="https://media.giphy.com/media/jmxDdzVQbvDa2U0WU4/giphy.gif"
        alt="Swipe Up"
        width="100" height="100"
        onClick={() => {
    // Scroll to the top of the page when the image is clicked
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}

export default App;
